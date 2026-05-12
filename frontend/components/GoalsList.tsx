"use client";

import { useAccount, useChainId, useReadContract } from "wagmi";
import { GROW_VAULT_ADDRESS, GROW_VAULT_ABI } from "@/lib/contracts";
import GoalCard from "./GoalCard";

export default function GoalsList() {
  const { address } = useAccount();
  const chainId = useChainId() as 42220 | 44787;
  const contractAddress = GROW_VAULT_ADDRESS[chainId];

  const { data: goalIds } = useReadContract({
    address: contractAddress,
    abi: GROW_VAULT_ABI,
    functionName: "getUserGoals",
    args: address ? [address] : undefined,
  });

  if (!goalIds || goalIds.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
        <p className="text-4xl mb-3">🎯</p>
        <p className="font-semibold text-gray-700 mb-1">No goals yet</p>
        <p className="text-xs text-gray-400">Create your first savings goal.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {goalIds.map((id) => (
        <GoalCard key={id.toString()} goalId={id} contractAddress={contractAddress} />
      ))}
    </div>
  );
}
