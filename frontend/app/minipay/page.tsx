"use client";

import { useEffect, useState } from "react";
import { useAccount, useConnect } from "wagmi";
import GoalsList from "@/components/GoalsList";
import CreateGoal from "@/components/CreateGoal";
import Stats from "@/components/Stats";
import AIAdvisor from "@/components/AIAdvisor";
import LandingPage from "@/components/LandingPage";

type Tab = "goals" | "new" | "stats" | "ai";

export default function MiniPayPage() {
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const [activeTab, setActiveTab] = useState<Tab>("goals");

  // Auto-connect when opened inside MiniPay
  useEffect(() => {
    const w = window as typeof window & { ethereum?: { isMiniPay?: boolean } };
    if (w.ethereum?.isMiniPay && connectors.length > 0 && !isConnected) {
      connect({ connector: connectors[0] });
    }
  }, [connectors, connect, isConnected]);

  if (!isConnected) {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen max-w-md mx-auto px-4 pb-8">
      <header className="pt-6 pb-4">
        <h1 className="text-2xl font-bold text-violet-700">GrowVault</h1>
        <p className="text-xs text-gray-400">Save in cUSD · Earn badges · Build habits</p>
      </header>

      <nav className="flex bg-white rounded-xl p-1 shadow-sm mb-5 gap-1">
        {([["goals", "My Goals"], ["new", "New Goal"], ["stats", "Stats"], ["ai", "🤖 AI"]] as [Tab, string][]).map(([id, label]) => (
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
      {activeTab === "ai" && <AIAdvisor />}
    </div>
  );
}
