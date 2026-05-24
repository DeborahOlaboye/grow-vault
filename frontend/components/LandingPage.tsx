"use client";

import { useConnect } from "wagmi";

const features = [
  {
    icon: "🎯",
    title: "Goal-Based Saving",
    desc: "Name your goal, set a target, pick a deadline. Your money works toward something real.",
  },
  {
    icon: "🔒",
    title: "Soft & Hard Lock",
    desc: "Soft lock keeps you accountable with a 5% early-exit fee. Hard lock holds firm until you hit your goal.",
  },
  {
    icon: "👥",
    title: "Social Contributions",
    desc: "Share your goal ID so friends and family can deposit directly — turn personal goals into community wins.",
  },
  {
    icon: "🏅",
    title: "Milestone Badges",
    desc: "Claim on-chain badges at 25%, 50%, 75%, and 100% — proof of your progress, forever on Celo.",
  },
];

const steps = [
  { n: "1", title: "Create a goal", body: "Pick an emoji, name it, set your cUSD target and a deadline." },
  { n: "2", title: "Deposit cUSD", body: "Fund your goal anytime. Friends can chip in too." },
  { n: "3", title: "Watch it grow", body: "Track progress, collect badges, and withdraw when you're ready." },
];

export default function LandingPage() {
  const { connect, connectors } = useConnect();
  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-white to-violet-50 flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-5 pt-5 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌱</span>
          <span className="text-lg font-bold text-violet-700 tracking-tight">GrowVault</span>
        </div>
        <span className="text-xs text-violet-400 font-medium bg-violet-100 px-2.5 py-1 rounded-full">Celo · MiniPay</span>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 pt-10 pb-12">
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-xl shadow-violet-200">
            <span className="text-5xl">🎯</span>
          </div>
          <span className="absolute -bottom-1 -right-1 text-2xl">✨</span>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 leading-tight mb-3">
          Save with{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-500">
            purpose
          </span>
          .<br />
          Earn while you wait.
        </h1>

        <p className="text-gray-500 text-sm max-w-xs leading-relaxed mb-2">
          Goal-based cUSD savings on Celo. Set a target, lock your funds, collect milestone badges.
        </p>
        <p className="text-xs text-violet-400 font-medium mb-8">Built for MiniPay · Powered by cUSD</p>

        {connectors.length > 0 ? (
          <button
            onClick={() => connect({ connector: connectors[0] })}
            className="w-full max-w-xs py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-2xl font-bold text-base shadow-lg shadow-violet-300 active:scale-95 transition-transform"
          >
            Connect Wallet →
          </button>
        ) : (
          <div className="w-full max-w-xs py-4 bg-violet-100 text-violet-400 rounded-2xl font-semibold text-sm text-center">
            Opening in MiniPay…
          </div>
        )}
      </section>

      {/* Features */}
      <section className="px-5 mb-10">
        <h2 className="text-base font-bold text-gray-800 mb-4">Why GrowVault?</h2>
        <div className="grid grid-cols-2 gap-3">
          {features.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="bg-white rounded-2xl p-4 border border-violet-100 shadow-sm flex flex-col gap-2"
            >
              <span className="text-2xl">{icon}</span>
              <p className="text-xs font-semibold text-gray-800 leading-snug">{title}</p>
              <p className="text-[11px] text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats strip */}
      <section className="mx-5 mb-10">
        <div className="bg-white rounded-2xl shadow-sm border border-violet-100 grid grid-cols-3 divide-x divide-violet-100 py-4">
          {[
            { value: "cUSD", label: "Savings token" },
            { value: "4", label: "Milestones" },
            { value: "0%", label: "Platform fee" },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center gap-0.5 px-2">
              <span className="text-lg font-extrabold text-violet-700">{value}</span>
              <span className="text-[10px] text-gray-400 text-center leading-tight">{label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
