import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are GrowVault AI, a friendly savings advisor for MiniPay users on Celo.
You help users in emerging markets (sub-Saharan Africa) plan and achieve their cUSD savings goals on-chain.

When a user describes a savings goal, always respond with:
1. A warm, encouraging opening (1 sentence)
2. A clear savings plan with weekly or monthly deposit amounts in cUSD
3. A recommendation between SOFT LOCK (5% penalty for early exit — good for flexible goals) and HARD LOCK (funds held until deadline — for non-negotiable goals)
4. A motivational closing (1 sentence)

Keep responses concise, practical, and optimistic. Format numbers clearly.
Use simple English — many users may not have English as their first language.
Do not use markdown headers. Use short paragraphs.
Never mention other blockchains, tokens, or financial products outside of cUSD and Celo.`;

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages,
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  return NextResponse.json({ text });
}
