"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import GoalsList from "@/components/GoalsList";
import CreateGoal from "@/components/CreateGoal";
import Stats from "@/components/Stats";
import LandingPage from "@/components/LandingPage";

type Tab = "goals" | "new" | "stats";

export default function Home() {
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<Tab>("goals");

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
