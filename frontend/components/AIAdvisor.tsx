"use client";

import { useState, useRef, useEffect } from "react";

type Message = { role: "user" | "assistant"; content: string };

const STARTERS = [
  "I want to save 200 cUSD for school fees in 2 months",
  "Help me save for a smartphone — about 150 cUSD",
  "I need 500 cUSD for a business deposit by December",
  "Save 80 cUSD for medical expenses this month",
];

export default function AIAdvisor() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages([...next, { role: "assistant", content: data.text }]);
    } catch {
      setMessages([...next, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-4 text-white">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-2xl">🤖</span>
          <div>
            <p className="font-bold text-sm">AI Savings Advisor</p>
            <p className="text-violet-200 text-xs">Powered by Claude · Personalized for MiniPay</p>
          </div>
        </div>
        <p className="text-violet-100 text-xs mt-2">
          Describe your savings goal and I'll build you a plan — deposit schedule, lock mode, and milestone targets.
        </p>
      </div>

      {/* Chat area */}
      <div className="flex flex-col gap-3 min-h-[200px]">
        {messages.length === 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-gray-400 font-medium">Try one of these:</p>
            {STARTERS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="text-left text-xs bg-white border border-violet-100 rounded-xl px-4 py-3 text-gray-600 shadow-sm active:scale-95 transition-transform hover:border-violet-300"
              >
                💬 {s}
              </button>
            ))}
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "assistant" && (
              <span className="text-lg mr-2 mt-0.5 flex-shrink-0">🤖</span>
            )}
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                m.role === "user"
                  ? "bg-violet-600 text-white rounded-br-sm"
                  : "bg-white border border-violet-100 text-gray-700 shadow-sm rounded-bl-sm"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <span className="text-lg mr-2 flex-shrink-0">🤖</span>
            <div className="bg-white border border-violet-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:300ms]" />
              </span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {messages.length > 0 && (
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder="Describe your goal…"
            rows={2}
            className="flex-1 resize-none bg-white border border-violet-200 rounded-xl px-3 py-2.5 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 shadow-sm"
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || loading}
            className="px-4 py-2.5 bg-violet-600 text-white rounded-xl text-xs font-semibold disabled:opacity-40 active:scale-95 transition-transform shadow"
          >
            Send
          </button>
        </div>
      )}

      {messages.length > 0 && (
        <button
          onClick={() => setMessages([])}
          className="text-xs text-gray-400 text-center underline underline-offset-2"
        >
          Start over
        </button>
      )}
    </div>
  );
}
