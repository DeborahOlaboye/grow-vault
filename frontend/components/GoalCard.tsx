"use client";

import { useReadContract } from "wagmi";
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

  if (!goal) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4">
      <div className="flex items-center gap-2">
        <span className="text-2xl">{goal[2]}</span>
        <p className="font-semibold text-gray-800 text-sm">{goal[1]}</p>
      </div>
    </div>
  );
}
