"use client";

import { useState } from "react";
import { useAccount, useChainId, useReadContract, useWriteContract } from "wagmi";
import { formatUnits, parseUnits } from "viem";
import { GROW_VAULT_ABI, ERC20_ABI, CUSD_ADDRESS } from "@/lib/contracts";

const MILESTONES = ["25%", "50%", "75%", "100%"];

export default function GoalCard({
  goalId,
  contractAddress,
}: {
  goalId: bigint;
  contractAddress: `0x${string}`;
}) {
  const { address } = useAccount();
  const chainId = useChainId() as 42220 | 44787;
  const cUSD = CUSD_ADDRESS[chainId] as `0x${string}`;
  const [depositAmount, setDepositAmount] = useState("");
  const [expanded, setExpanded] = useState(false);

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

  const { writeContract: approve } = useWriteContract();

  if (!goal) return null;

  const saved = Number(formatUnits(goal[4], 18)).toFixed(2);
  const target = Number(formatUnits(goal[3], 18)).toFixed(2);
  const pct = Number(progress ?? 0);
  const deadline = new Date(Number(goal[5]) * 1000).toLocaleDateString();
  const lockLabel = goal[6] === 0 ? "Soft lock" : "Hard lock";
  const isOwner = goal[0].toLowerCase() === address?.toLowerCase();
  const milestonesClaimed = Number(goal[10]);

  function handleDeposit() {
    if (!depositAmount) return;
    const parsed = parseUnits(depositAmount, 18);
    approve({ address: cUSD, abi: ERC20_ABI, functionName: "approve", args: [contractAddress, parsed] });
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <button className="w-full p-4 text-left" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{goal[2]}</span>
            <div>
              <p className="font-semibold text-gray-800 text-sm">{goal[1]}</p>
              <p className="text-xs text-gray-400">{lockLabel} · Due {deadline}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-violet-700 text-sm">{pct}%</p>
            {goal[7] && <span className="text-xs text-green-500">Completed!</span>}
          </div>
        </div>
        <div className="h-2 bg-gray-100 rounded-full">
          <div className="h-2 bg-violet-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-400">
          <span>{saved} cUSD saved</span>
          <span>{target} cUSD goal</span>
        </div>
      </button>
      {expanded && !goal[8] && (
        <div className="border-t border-gray-100 p-4 space-y-3">
          <div className="flex gap-2">
            <input
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="Deposit amount"
              type="number"
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <button
              onClick={handleDeposit}
              disabled={!depositAmount}
              className="px-4 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-medium disabled:opacity-50"
            >
              Deposit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
