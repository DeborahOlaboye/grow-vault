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

export async function monitorGoals(): Promise<GoalState[]> {
  const total = await publicClient.readContract({
    address: GROW_VAULT_ADDRESS,
    abi: GROW_VAULT_ABI,
    functionName: "totalGoals",
  });

  const now = Math.floor(Date.now() / 1000);
  const active: GoalState[] = [];

  for (let i = 0; i < Number(total); i++) {
    // viem returns a tuple — destructure by position
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
      args: [BigInt(i)],
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
      id: i,
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
