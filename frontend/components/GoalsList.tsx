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
      <div className="bg-white rounded-2xl p-8 text-center shadow-sm space-y-2">
        <p className="text-4xl">🎯</p>
        <p className="font-semibold text-gray-700">No savings goals yet</p>
        <p className="text-xs text-gray-400">Tap <strong>New Goal</strong> to start saving towards something that matters to you.</p>
        <p className="text-xs text-gray-300 pt-1">Tip: friends and family can contribute to your goals too.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-400 px-1">{goalIds.length} goal{goalIds.length !== 1 ? "s" : ""} · tap a card to deposit or withdraw</p>
      {goalIds.map((id) => (
        <GoalCard key={id.toString()} goalId={id} contractAddress={contractAddress} />
      ))}
    </div>
  );
}
