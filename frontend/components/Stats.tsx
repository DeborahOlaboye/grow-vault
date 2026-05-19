"use client";

import { useChainId, useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { GROW_VAULT_ADDRESS, GROW_VAULT_ABI, ERC20_ABI, CUSD_ADDRESS } from "@/lib/contracts";

const ROADMAP = [
  { done: true, item: "Goal creation with soft/hard lock modes" },
  { done: true, item: "Social contributions — anyone can deposit to a goal" },
  { done: true, item: "Milestone badges at 25%, 50%, 75%, 100%" },
  { done: false, item: "Yield integration — earn while saving (Mento / Uniswap LP)" },
  { done: false, item: "Push notifications for milestone events" },
  { done: false, item: "Group goals — shared savings pools" },
  { done: false, item: "MiniPay listing" },
];

export default function Stats() {
  const chainId = useChainId() as 42220 | 44787;
  const contractAddress = GROW_VAULT_ADDRESS[chainId];
  const cUSD = CUSD_ADDRESS[chainId] as `0x${string}`;

  const { data: totalGoals } = useReadContract({
    address: contractAddress,
    abi: GROW_VAULT_ABI,
    functionName: "totalGoals",
  });

  const { data: penaltyPool } = useReadContract({
    address: contractAddress,
    abi: GROW_VAULT_ABI,
    functionName: "penaltyPool",
  });

  const { data: vaultBalance } = useReadContract({
    address: cUSD,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: contractAddress ? [contractAddress] : undefined,
  });

  const metrics = [
    {
      icon: "🎯",
      label: "Goals Created",
      value: totalGoals != null ? totalGoals.toString() : "—",
    },
    {
      icon: "💰",
      label: "cUSD in Vault",
      value: vaultBalance != null
        ? `$${Number(formatUnits(vaultBalance, 18)).toFixed(2)}`
        : "—",
    },
    {
      icon: "⚖️",
      label: "Penalty Pool",
      value: penaltyPool != null
        ? `$${Number(formatUnits(penaltyPool, 18)).toFixed(2)}`
        : "—",
    },
  ];

  const networkLabel = chainId === 42220 ? "Celo Mainnet" : "Alfajores Testnet";
  const networkColor = chainId === 42220 ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700";

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${networkColor}`}>{networkLabel}</span>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {metrics.map(({ icon, label, value }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <span className="text-3xl">{icon}</span>
            <div>
              <p className="text-xs text-gray-400">{label}</p>
              <p className="text-xl font-bold text-violet-700">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <p className="text-sm font-semibold text-gray-700 mb-3">Roadmap</p>
        <ul className="space-y-2">
          {ROADMAP.map(({ done, item }) => (
            <li key={item} className="flex items-start gap-2 text-xs">
              <span className={done ? "text-green-500" : "text-gray-300"}>
                {done ? "✓" : "○"}
              </span>
              <span className={done ? "text-gray-700" : "text-gray-400"}>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-violet-50 rounded-2xl p-4 text-xs text-violet-700">
        <p className="font-semibold mb-1">What is GrowVault?</p>
        <p>
          Goal-based savings on Celo. Set a target, save cUSD, and choose how strict
          your commitment is — soft lock (5% early exit fee) or hard lock (held until
          your deadline). Friends and family can contribute to your goals.
        </p>
      </div>
    </div>
  );
}
