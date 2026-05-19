"use client";

import { useState } from "react";
import { useChainId, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits } from "viem";
import { GROW_VAULT_ADDRESS, GROW_VAULT_ABI } from "@/lib/contracts";

const EMOJIS = ["🎓", "🏠", "📱", "🚗", "💊", "💼", "✈️", "👶"];

export default function CreateGoal({ onCreated }: { onCreated: () => void }) {
  const chainId = useChainId() as 42220 | 44787;
  const contractAddress = GROW_VAULT_ADDRESS[chainId];

  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState(EMOJIS[0]);
  const [target, setTarget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [lockMode, setLockMode] = useState<0 | 1>(0); // 0=SOFT, 1=HARD

  const { writeContract, data: tx, isPending } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash: tx });

  if (isSuccess) {
    onCreated();
    return null;
  }

  function handleCreate() {
    if (!name || !target || !deadline || !contractAddress) return;
    const deadlineTs = Math.floor(new Date(deadline).getTime() / 1000);
    writeContract({
      address: contractAddress,
      abi: GROW_VAULT_ABI,
      functionName: "createGoal",
      args: [name, emoji, parseUnits(target, 18), BigInt(deadlineTs), lockMode],
    });
  }

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-2">Choose an icon</label>
        <div className="flex gap-2 flex-wrap">
          {EMOJIS.map((e) => (
            <button
              key={e}
              onClick={() => setEmoji(e)}
              className={`text-2xl p-2 rounded-xl border-2 transition-colors ${
                emoji === e ? "border-violet-500 bg-violet-50" : "border-gray-100"
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between mb-1">
          <label className="text-xs font-medium text-gray-600">Goal name</label>
          <span className={`text-xs ${name.length > 40 ? "text-amber-500" : "text-gray-400"}`}>{name.length}/50</span>
        </div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 50))}
          placeholder="e.g. School fees, New phone..."
          className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Target amount (cUSD)</label>
        <input
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="0.00"
          type="number"
          min="0.01"
          step="0.01"
          className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <p className="text-xs text-gray-400 mt-1">1 cUSD ≈ 1 US Dollar · minimum 0.01 cUSD</p>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Deadline</label>
        <div className="flex gap-1.5 mb-2">
          {([["1mo", 1], ["3mo", 3], ["6mo", 6]] as [string, number][]).map(([label, months]) => {
            const d = new Date();
            d.setMonth(d.getMonth() + months);
            const val = d.toISOString().split("T")[0];
            return (
              <button key={label} type="button" onClick={() => setDeadline(val)}
                className={`text-xs px-3 py-1 rounded-lg border transition-colors ${
                  deadline === val ? "border-violet-500 bg-violet-50 text-violet-700" : "border-gray-200 text-gray-500"
                }`}>{label}</button>
            );
          })}
        </div>
        <input
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          type="date"
          min={minDate.toISOString().split("T")[0]}
          className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-2">Lock type</label>
        <div className="flex gap-2">
          {([
            [0, "Soft Lock", "5% fee if withdrawn early"],
            [1, "Hard Lock", "Locked until deadline or goal"],
          ] as [0 | 1, string, string][]).map(([val, label, desc]) => (
            <button
              key={val}
              onClick={() => setLockMode(val)}
              className={`flex-1 p-3 text-left rounded-xl border-2 transition-colors ${
                lockMode === val ? "border-violet-500 bg-violet-50" : "border-gray-100"
              }`}
            >
              <p className="text-xs font-semibold text-gray-800">{label}</p>
              <p className="text-xs text-gray-400">{desc}</p>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleCreate}
        disabled={!name || !target || !deadline || isPending}
        className="w-full py-3 bg-violet-600 text-white rounded-xl font-semibold disabled:opacity-50"
      >
        {isPending ? "Creating goal..." : `Create ${emoji} ${name.trim() || "Goal"}`}
      </button>
    </div>
  );
}
