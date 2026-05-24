"use client";

export default function LandingPage() {
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
    </div>
  );
}
