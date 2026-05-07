"use client";
import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">Opening in MiniPay...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-md mx-auto px-4 pb-8">
      <header className="pt-6 pb-4">
        <h1 className="text-2xl font-bold text-violet-700">GrowVault</h1>
        <p className="text-xs text-gray-400">Save towards your goals. Earn while you wait.</p>
      </header>
    </div>
  );
}
