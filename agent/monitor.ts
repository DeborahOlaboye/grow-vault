import { parseAbiItem } from "viem";
import { publicClient } from "./wallet";
import { GROW_VAULT_ADDRESS, GROW_VAULT_ABI } from "./abi";

export type GoalState = {
  id: number;
  owner: string;
  name: string;
  emoji: string;
  targetAmount: bigint;
  savedAmount: bigint;
  deadline: bigint;
  milestonesClaimed: number;
  progressPct: number;
  daysLeft: number;
  nextMilestonePct: number;
  amountToNextMilestone: bigint;
};

const MILESTONES = [25, 50, 75, 100];

const GOAL_CREATED_EVENT = parseAbiItem(
  "event GoalCreated(uint256 indexed goalId, address indexed owner, string name, uint256 target, uint256 deadline)"
);

export async function monitorGoals(): Promise<GoalState[]> {
  // Enumerate all goal IDs via GoalCreated events — avoids totalGoals() which isn't in deployed bytecode
  // Scan from contract deployment block — avoid scanning all of Celo history
  const DEPLOY_BLOCK = BigInt(67270684);

  const logs = await publicClient.getLogs({
    address: GROW_VAULT_ADDRESS,
    event: GOAL_CREATED_EVENT,
    fromBlock: DEPLOY_BLOCK,
    toBlock: "latest",
  });

  const now = Math.floor(Date.now() / 1000);
  const active: GoalState[] = [];

  for (const log of logs) {
    const goalId = Number(log.args.goalId ?? 0);

    const [
      owner,
      name,
      emoji,
      targetAmount,
      savedAmount,
      deadline,
      ,        // lockMode
      completed,
      withdrawn,
      ,        // createdAt
      milestonesClaimed,
    ] = await publicClient.readContract({
      address: GROW_VAULT_ADDRESS,
      abi: GROW_VAULT_ABI,
      functionName: "goals",
      args: [BigInt(goalId)],
    });

    if (completed || withdrawn) continue;
    if (Number(deadline) < now) continue;
    if (targetAmount === 0n) continue;

    const progressPct = Number((savedAmount * 100n) / targetAmount);
    const daysLeft = Math.max(0, Math.floor((Number(deadline) - now) / 86400));

    const nextMilestonePct = MILESTONES.find((m) => progressPct < m) ?? 100;
    const targetForMilestone = (targetAmount * BigInt(nextMilestonePct)) / 100n;
    const amountToNextMilestone =
      targetForMilestone > savedAmount ? targetForMilestone - savedAmount : 0n;

    active.push({
      id: goalId,
      owner,
      name,
      emoji,
      targetAmount,
      savedAmount,
      deadline,
      milestonesClaimed,
      progressPct,
      daysLeft,
      nextMilestonePct,
      amountToNextMilestone,
    });
  }

  return active;
}
