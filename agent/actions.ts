import { formatUnits } from "viem";
import { Decision } from "./brain";
import { GoalState } from "./monitor";

export async function postRecommendations(
  decisions: Decision[],
  goals: GoalState[]
): Promise<void> {
  const toPost = decisions
    .filter((d) => d.shouldBoost && d.boostAmount > 0n)
    .map((d) => {
      const goal = goals.find((g) => g.id === d.goalId);
      return {
        goalId: d.goalId,
        amountNeeded: formatUnits(d.boostAmount, 18),
        nextMilestonePct: goal?.nextMilestonePct ?? 25,
        reason: d.reason,
      };
    });

  if (toPost.length === 0) {
    console.log("[Agent] No tips to post this cycle.");
    return;
  }

  const frontendUrl = process.env.FRONTEND_URL ?? "https://grow-vault-taum.vercel.app";
  const secret = process.env.AGENT_SECRET;

  if (!secret) {
    console.warn("[Agent] AGENT_SECRET not set — skipping tip post.");
    return;
  }

  try {
    const res = await fetch(`${frontendUrl}/api/agent-signal`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-agent-secret": secret,
      },
      body: JSON.stringify({ goals: toPost }),
    });

    if (res.ok) {
      console.log(`[Agent] Posted ${toPost.length} tip(s) to app:`);
      toPost.forEach((t) =>
        console.log(
          `  Goal #${t.goalId} — deposit ${t.amountNeeded} cUSD to reach ${t.nextMilestonePct}% milestone`
        )
      );
    } else {
      console.warn("[Agent] Failed to post tips:", await res.text());
    }
  } catch (err) {
    console.error("[Agent] Error posting tips:", err);
  }
}
