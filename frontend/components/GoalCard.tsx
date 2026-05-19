"use client";

import { useState, useRef, useEffect } from "react";
import { useAccount, useChainId, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { GROW_VAULT_ADDRESS, GROW_VAULT_ABI, ERC20_ABI, CUSD_ADDRESS } from "@/lib/contracts";

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
  const pendingAmount = useRef<string>("");

  const { data: goal, refetch } = useReadContract({
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

  const { data: contributorList } = useReadContract({
    address: contractAddress,
    abi: GROW_VAULT_ABI,
    functionName: "getContributors",
    args: [goalId],
  });

  const { writeContract: approve, data: approveTx, isPending: approvePending } = useWriteContract();
  const { writeContract: deposit, data: depositTx, isPending: depositPending } = useWriteContract();
  const { writeContract: withdraw } = useWriteContract();
  const { writeContract: claimMilestone } = useWriteContract();

  const { isSuccess: approveOk } = useWaitForTransactionReceipt({ hash: approveTx });
  const { isSuccess: depositOk } = useWaitForTransactionReceipt({ hash: depositTx });

  useEffect(() => { if (depositOk) { refetch(); setDepositAmount(""); } }, [depositOk]);

  useEffect(() => {
    if (approveOk && pendingAmount.current) {
      const amount = pendingAmount.current;
      pendingAmount.current = "";
      deposit({
        address: contractAddress,
        abi: GROW_VAULT_ABI,
        functionName: "deposit",
        args: [goalId, parseUnits(amount, 18)],
      });
    }
  }, [approveOk]);

  if (!goal) return null;

  const saved = Number(formatUnits(goal[4], 18)).toFixed(2);
  const target = Number(formatUnits(goal[3], 18)).toFixed(2);
  const pct = Number(progress ?? 0);
  const deadline = new Date(Number(goal[5]) * 1000).toLocaleDateString();
  const isOwner = goal[0].toLowerCase() === address?.toLowerCase();
  const lockLabel = goal[6] === 0 ? "Soft lock" : "Hard lock";
  const milestonesClaimed = Number(goal[10]);
  const nextMilestone = milestonesClaimed < 4 ? pct >= (milestonesClaimed + 1) * 25 : false;
  const daysLeft = Math.max(0, Math.ceil((Number(goal[5]) * 1000 - Date.now()) / 86400000));

  function handleDeposit() {
    if (!depositAmount) return;
    pendingAmount.current = depositAmount;
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
              <p className="text-xs text-gray-400">{lockLabel} · {daysLeft > 0 ? `${daysLeft}d left` : "Deadline passed"}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-violet-700 text-sm">{pct}%</p>
            {goal[7] && <span className="text-xs text-green-500">Completed!</span>}
            {!goal[7] && contributorList && contributorList.length > 0 && (
              <p className="text-xs text-gray-400">{contributorList.length} saver{contributorList.length !== 1 ? "s" : ""}</p>
            )}
          </div>
        </div>

        <div className="h-2 bg-gray-100 rounded-full">
          <div
            className="h-2 bg-violet-500 rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-400">
          <span>{saved} cUSD saved</span>
          <span>{target} cUSD goal</span>
        </div>
      </button>

      {milestonesClaimed > 0 && (
        <div className="flex gap-1 px-4 pb-2">
          {MILESTONES.slice(0, milestonesClaimed).map((m, i) => (
            <span key={m} className={`text-xs px-2 py-0.5 rounded-full ${
              i === 3 ? "bg-green-100 text-green-700" : i === 2 ? "bg-violet-200 text-violet-800" : "bg-violet-100 text-violet-700"
            }`}>
              {m}
            </span>
          ))}
        </div>
      )}

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
              disabled={!depositAmount || approvePending || depositPending}
              className="px-4 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-medium disabled:opacity-50"
            >
              {approvePending ? "Approving..." : depositPending ? "Saving..." : "Deposit"}
            </button>
          </div>

          {nextMilestone && (
            <button
              onClick={() =>
                claimMilestone({
                  address: contractAddress,
                  abi: GROW_VAULT_ABI,
                  functionName: "claimMilestone",
                  args: [goalId],
                })
              }
              className="w-full py-2 bg-violet-100 text-violet-700 rounded-xl text-sm font-medium"
            >
              Claim {MILESTONES[milestonesClaimed]} milestone badge!
            </button>
          )}

          {isOwner && (
            <>
              {goal[6] === 1 && !goal[7] && daysLeft > 0 && (
                <p className="text-xs text-amber-600 text-center py-1">Hard locked — available after deadline or goal completion</p>
              )}
              <button
                onClick={() =>
                  withdraw({
                    address: contractAddress,
                    abi: GROW_VAULT_ABI,
                    functionName: "withdraw",
                    args: [goalId],
                  })
                }
                disabled={goal[6] === 1 && !goal[7] && daysLeft > 0}
                className="w-full py-2 border border-gray-200 text-gray-500 rounded-xl text-sm disabled:opacity-40"
              >
                Withdraw {goal[6] === 0 ? "(5% penalty if early)" : ""}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
