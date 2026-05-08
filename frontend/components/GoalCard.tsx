"use client";

import { useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { GROW_VAULT_ABI } from "@/lib/contracts";

export default function GoalCard({
  goalId,
  contractAddress,
}: {
  goalId: bigint;
  contractAddress: `0x${string}`;
}) {
  const { data: goal } = useReadContract({
    address: contractAddress,
    abi: GROW_VAULT_ABI,
    functionName: "goals",
    args: [goalId],
  });

  const { data: progress } = useReadContract({
    address: contractAddress,
    abi: GROW_VAULT_ABI,
    functionName: "getProgress",
    args: [goalId],
  });

  if (!goal) return null;

  const saved = Number(formatUnits(goal[4], 18)).toFixed(2);
  const target = Number(formatUnits(goal[3], 18)).toFixed(2);
  const pct = Number(progress ?? 0);
  const deadline = new Date(Number(goal[5]) * 1000).toLocaleDateString();
  const lockLabel = goal[6] === 0 ? "Soft lock" : "Hard lock";

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{goal[2]}</span>
            <div>
              <p className="font-semibold text-gray-800 text-sm">{goal[1]}</p>
              <p className="text-xs text-gray-400">{lockLabel} · Due {deadline}</p>
            </div>
          </div>
          <p className="font-bold text-violet-700 text-sm">{pct}%</p>
        </div>
        <div className="h-2 bg-gray-100 rounded-full">
          <div className="h-2 bg-violet-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-400">
          <span>{saved} cUSD saved</span>
          <span>{target} cUSD goal</span>
        </div>
      </div>
    </div>
  );
}
