import Groq from "groq-sdk";
import { GoalState } from "./monitor";

export type Decision = {
  goalId: number;
  shouldBoost: boolean;
  boostAmount: bigint;
  reason: string;
};

const MAX_BOOST_WEI = BigInt(2 * 1e18); // never spend more than 2 cUSD per goal per cycle

export async function analyze(goals: GoalState[]): Promise<Decision[]> {
  if (goals.length === 0) return [];

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const snapshot = goals.map((g) => ({
    id: g.id,
    name: g.name,
    emoji: g.emoji,
    progressPct: g.progressPct,
    savedCUSD: (Number(g.savedAmount) / 1e18).toFixed(4),
    targetCUSD: (Number(g.targetAmount) / 1e18).toFixed(4),
    amountToNextMilestoneCUSD: (Number(g.amountToNextMilestone) / 1e18).toFixed(4),
    nextMilestonePct: g.nextMilestonePct,
    daysLeft: g.daysLeft,
  }));

  const prompt = `You are GrowVault Agent — an autonomous savings coach running on Celo.

Your job: decide which savings goals deserve a milestone boost deposit this cycle.

Rules:
- Only boost if amountToNextMilestoneCUSD <= 2.0 AND daysLeft > 0
- Set boostAmount to exactly amountToNextMilestoneCUSD (no rounding up)
- Never boost a goal at 100% progress
- Give a short, human-readable reason for each decision

Goals this cycle:
${JSON.stringify(snapshot, null, 2)}

Reply with a JSON array ONLY, no other text:
[{"goalId": 0, "shouldBoost": true, "boostAmount": 1.25, "reason": "24 cUSD saved, just 1.25 cUSD from the 25% milestone with 12 days to go"}]`;

  const res = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 512,
    temperature: 0,
  });

  const content = res.choices[0]?.message?.content ?? "[]";
  const match = content.match(/\[[\s\S]*\]/);
  if (!match) {
    console.warn("[Brain] Could not parse AI response, skipping all boosts");
    return goals.map((g) => ({ goalId: g.id, shouldBoost: false, boostAmount: 0n, reason: "Parse error" }));
  }

  const parsed: { goalId: number; shouldBoost: boolean; boostAmount: number; reason: string }[] =
    JSON.parse(match[0]);

  return parsed.map((d) => {
    const raw = BigInt(Math.round(d.boostAmount * 1e18));
    const boostAmount = raw > MAX_BOOST_WEI ? MAX_BOOST_WEI : raw;
    return {
      goalId: d.goalId,
      shouldBoost: !!d.shouldBoost && boostAmount > 0n,
      boostAmount,
      reason: d.reason ?? "",
    };
  });
}
