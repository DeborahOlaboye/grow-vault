import "dotenv/config";
import { monitorGoals } from "./monitor";
import { analyze } from "./brain";
import { executeDecisions } from "./actions";
import { agentAddress, publicClient } from "./wallet";
import { CUSD_ADDRESS, ERC20_ABI } from "./abi";
import { formatUnits } from "viem";

const INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

async function run() {
  const ts = new Date().toISOString();
  console.log(`\n${"─".repeat(60)}`);
  console.log(`[${ts}] GrowVault Agent cycle`);
  console.log(`[Agent] Wallet: ${agentAddress}`);

  // Log cUSD balance so we know if the agent is funded
  const balance = await publicClient.readContract({
    address: CUSD_ADDRESS,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [agentAddress],
  });
  console.log(`[Agent] cUSD balance: ${formatUnits(balance, 18)}`);

  const goals = await monitorGoals();
  console.log(`[Agent] Active goals found: ${goals.length}`);

  if (goals.length === 0) {
    console.log("[Agent] Nothing to do. Next run in 5 minutes.");
    return;
  }

  goals.forEach((g) =>
    console.log(
      `  #${g.id} ${g.emoji} "${g.name}" — ${g.progressPct}% complete, ${g.daysLeft}d left, ` +
        `${formatUnits(g.amountToNextMilestone, 18)} cUSD to ${g.nextMilestonePct}% milestone`
    )
  );

  console.log("[Agent] Asking AI to analyse goals...");
  const decisions = await analyze(goals);

  const boostCount = decisions.filter((d) => d.shouldBoost).length;
  console.log(`[Agent] AI decided to boost ${boostCount} goal(s)`);

  await executeDecisions(decisions);
  console.log(`\n[Agent] Cycle complete. Next run in 5 minutes.`);
}

run().catch(console.error);
setInterval(() => run().catch(console.error), INTERVAL_MS);
