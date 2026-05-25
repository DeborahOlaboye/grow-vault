import { NextRequest, NextResponse } from "next/server";

type Tip = {
  goalId: number;
  amountNeeded: string;
  nextMilestonePct: number;
  reason: string;
  updatedAt: number;
};

// In-memory store — survives warm Vercel instances, resets on cold start (fine for demo)
const tips: Record<number, Tip> = {};

const TTL_MS = 30 * 60 * 1000; // tips expire after 30 minutes

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-agent-secret");
  if (!process.env.AGENT_SECRET || secret !== process.env.AGENT_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { goals } = await req.json() as { goals: Omit<Tip, "updatedAt">[] };
  const now = Date.now();

  for (const g of goals) {
    tips[g.goalId] = { ...g, updatedAt: now };
  }

  return NextResponse.json({ ok: true, count: goals.length });
}

export async function GET(req: NextRequest) {
  const goalId = req.nextUrl.searchParams.get("goalId");
  const now = Date.now();

  if (goalId) {
    const tip = tips[Number(goalId)];
    if (tip && now - tip.updatedAt < TTL_MS) return NextResponse.json(tip);
    return NextResponse.json(null);
  }

  const fresh = Object.values(tips).filter((t) => now - t.updatedAt < TTL_MS);
  return NextResponse.json(fresh);
}
