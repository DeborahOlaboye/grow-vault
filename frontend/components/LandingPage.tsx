"use client";

import { useConnect } from "wagmi";

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
    </div>
  );
}
