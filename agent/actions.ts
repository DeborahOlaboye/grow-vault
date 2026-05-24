import { formatUnits } from "viem";
import { walletClient, publicClient } from "./wallet";
import { GROW_VAULT_ADDRESS, GROW_VAULT_ABI, CUSD_ADDRESS, ERC20_ABI } from "./abi";
import { Decision } from "./brain";

export async function executeDecisions(decisions: Decision[]): Promise<void> {
  const boosts = decisions.filter((d) => d.shouldBoost && d.boostAmount > 0n);

  if (boosts.length === 0) {
    console.log("[Agent] No boosts needed this cycle.");
    return;
  }

  for (const d of boosts) {
    console.log(`\n[Agent] → Boosting goal #${d.goalId}: ${formatUnits(d.boostAmount, 18)} cUSD`);
    console.log(`[Agent]   Reason: ${d.reason}`);

    try {
      // Step 1: approve cUSD spend
      const approveTx = await walletClient.writeContract({
        address: CUSD_ADDRESS,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [GROW_VAULT_ADDRESS, d.boostAmount],
      });
      await publicClient.waitForTransactionReceipt({ hash: approveTx });
      console.log(`[Agent]   Approved cUSD — tx: ${approveTx}`);

      // Step 2: deposit to goal
      const depositTx = await walletClient.writeContract({
        address: GROW_VAULT_ADDRESS,
        abi: GROW_VAULT_ABI,
        functionName: "deposit",
        args: [BigInt(d.goalId), d.boostAmount],
      });
      await publicClient.waitForTransactionReceipt({ hash: depositTx });
      console.log(`[Agent]   Deposit complete — tx: ${depositTx}`);
    } catch (err) {
      console.error(`[Agent]   Failed to boost goal #${d.goalId}:`, err);
    }
  }
}
