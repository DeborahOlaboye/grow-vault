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

  const { writeContract, data: tx, isPending } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash: tx });

  if (isSuccess) { onCreated(); return null; }

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
        <label className="block text-xs font-medium text-gray-600 mb-1">Goal name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. School fees, New phone..."
          className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>
      <button
        onClick={() => {}}
        disabled={!name || isPending}
        className="w-full py-3 bg-violet-600 text-white rounded-xl font-semibold disabled:opacity-50"
      >
        {isPending ? "Creating..." : `Create ${emoji} Goal`}
      </button>
    </div>
  );
}
