"use client";

import { useState } from "react";
import { useAccount, useConnect } from "wagmi";
import GoalsList from "@/components/GoalsList";
import CreateGoal from "@/components/CreateGoal";
import Stats from "@/components/Stats";

type Tab = "goals" | "new" | "stats";

export default function Home() {
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const [activeTab, setActiveTab] = useState<Tab>("goals");

  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5 px-6 bg-gradient-to-b from-violet-50 to-white">
        <span className="text-5xl">🎯</span>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-violet-700 mb-1">GrowVault</h1>
          <p className="text-sm text-gray-500">Save towards your goals. Earn while you wait.</p>
          <p className="text-xs text-gray-400 mt-1">cUSD savings on Celo · built for MiniPay</p>
        </div>
        {connectors.length > 0 ? (
          <button
            onClick={() => connect({ connector: connectors[0] })}
            className="px-8 py-3 bg-violet-600 text-white rounded-xl font-semibold shadow-lg shadow-violet-200 active:scale-95 transition-transform"
          >
            Connect Wallet
          </button>
        ) : (
          <p className="text-sm text-gray-400">Opening in MiniPay...</p>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-md mx-auto px-4 pb-8">
      <header className="pt-6 pb-4">
        <h1 className="text-2xl font-bold text-violet-700">GrowVault</h1>
        <p className="text-xs text-gray-400">Save towards your goals. Earn while you wait.</p>
      </header>

      <nav className="flex bg-white rounded-xl p-1 shadow-sm mb-5 gap-1">
        {([["goals", "My Goals"], ["new", "New Goal"], ["stats", "Stats"]] as [Tab, string][]).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${
              activeTab === id ? "bg-violet-600 text-white" : "text-gray-500"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      {activeTab === "goals" && <GoalsList />}
      {activeTab === "new" && <CreateGoal onCreated={() => setActiveTab("goals")} />}
      {activeTab === "stats" && <Stats />}
    </div>
  );
}
