"use client";

import { useChat } from "@ai-sdk/react";
import { useRef, useState, useEffect } from "react";

type Provider = "gemini" | "groq" | "anthropic";

const PROVIDERS = [
    { id: "groq"      as Provider, name: "Groq",   model: "llama-3.3-70b-versatile",  badge: "Free", color: "#F55036" },

  { id: "gemini"    as Provider, name: "Gemini", model: "gemini-2.0-flash",         badge: "Free", color: "#4285F4" },
  { id: "anthropic" as Provider, name: "Claude", model: "claude-sonnet-4",           badge: "Paid", color: "#D97757" },
];

const SUGGESTIONS = [
  { label: "Explain React hooks",  prompt: "Explain React hooks (useState, useEffect) with simple examples." },
  { label: "Python OOP basics",    prompt: "Explain Object-Oriented Programming in Python with a simple example." },
  { label: "Study plan for exams", prompt: "Help me create a 7-day study plan for a programming exam." },
  { label: "What is Next.js?",     prompt: "Explain Next.js and how it differs from React. When should I use it?" },
];

export default function AiChatPage() {
  const [provider, setProvider] = useState<Provider>("groq");
  const [showProviders, setShowProviders] = useState(false);
  const [input, setInput] = useState("");
  const [rows, setRows] = useState(1);

  const { messages, sendMessage, status, setMessages } = useChat();
  const isLoading = status === "streaming" || status === "submitted";
  const bottomRef = useRef<HTMLDivElement>(null);
  const current = PROVIDERS.find((p) => p.id === provider)!;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    setRows(Math.min(e.target.value.split("\n").length, 5));
  }

  async function handleSend(text?: string) {
    const msg = text ?? input;
    if (!msg.trim() || isLoading) return;
    setInput("");
    setRows(1);
    await sendMessage({ text: msg }, { body: { provider } });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }

  function switchProvider(p: Provider) {
    setProvider(p);
    setShowProviders(false);
    setMessages([]);
  }

  function getMessageText(message: any): string {
    if (typeof message.content === "string") return message.content;
    if (Array.isArray(message.parts)) {
      return message.parts.filter((p: any) => p.type === "text").map((p: any) => p.text).join("");
    }
    return "";
  }

  return (
    <div className="flex flex-col bg-[#080808] text-white" style={{ minHeight: "calc(100vh - 64px)" }}>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-4 py-6" onClick={() => setShowProviders(false)}>
        <div className="max-w-2xl mx-auto flex flex-col gap-6">

          {/* Welcome state */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center text-center gap-5 pt-10">
              <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-2xl">✦</div>
              <div>
                <h1 className="text-2xl font-semibold text-white mb-1">EduCrush AI</h1>
                <p className="text-white/40 text-sm max-w-sm">Ask anything — concepts, code, notes, projects.</p>
              </div>

              {/* Model selector — center mein */}
              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowProviders(!showProviders); }}
                  className="flex items-center gap-2 border border-white/10 bg-white/[0.04] px-4 py-2 rounded-full hover:border-white/20 transition-colors text-sm"
                >
                  <span className="w-2 h-2 rounded-full" style={{ background: current.color }} />
                  <span className="text-white/70">{current.name}</span>
                  <span className="text-xs text-white/30">▾</span>
                </button>

                {showProviders && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-12 bg-[#111] border border-white/10 rounded-xl overflow-hidden z-50 w-56">
                    <p className="text-white/30 text-xs px-4 py-2 border-b border-white/[0.06]">Switch AI Model</p>
                    {PROVIDERS.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => switchProvider(p.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.04] transition-colors ${p.id === provider ? "bg-white/[0.04]" : ""}`}
                      >
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: p.color }} />
                        <div className="flex-1">
                          <p className="text-sm text-white/80 font-medium">{p.name}</p>
                          <p className="text-xs text-white/30">{p.model}</p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${p.badge === "Free" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
                          {p.badge}
                        </span>
                        {p.id === provider && <span className="text-violet-400 text-xs">✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Suggestions */}
              <div className="flex flex-wrap justify-center gap-2 mt-1">
                {SUGGESTIONS.map((s) => (
                  <button key={s.label} onClick={() => handleSend(s.prompt)}
                    className="text-sm px-4 py-2 rounded-full border border-white/10 text-white/60 hover:text-white hover:border-violet-500/50 hover:bg-violet-500/5 transition-all">
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages + model switcher in top-right when chatting */}
          {messages.length > 0 && (
            <div className="flex justify-end">
              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowProviders(!showProviders); }}
                  className="flex items-center gap-2 border border-white/10 bg-white/[0.04] px-3 py-1.5 rounded-full hover:border-white/20 transition-colors text-xs"
                >
                  <span className="w-2 h-2 rounded-full" style={{ background: current.color }} />
                  <span className="text-white/60">{current.name}</span>
                  <span className="text-white/30">▾</span>
                </button>

                {showProviders && (
                  <div className="absolute right-0 top-10 bg-[#111] border border-white/10 rounded-xl overflow-hidden z-50 w-56">
                    <p className="text-white/30 text-xs px-4 py-2 border-b border-white/[0.06]">Switch AI Model</p>
                    {PROVIDERS.map((p) => (
                      <button key={p.id} onClick={() => switchProvider(p.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.04] transition-colors ${p.id === provider ? "bg-white/[0.04]" : ""}`}>
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: p.color }} />
                        <div className="flex-1">
                          <p className="text-sm text-white/80 font-medium">{p.name}</p>
                          <p className="text-xs text-white/30">{p.model}</p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${p.badge === "Free" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
                          {p.badge}
                        </span>
                        {p.id === provider && <span className="text-violet-400 text-xs">✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-semibold mt-0.5
                ${m.role === "user" ? "bg-violet-600 text-white" : "bg-violet-500/10 border border-violet-500/20 text-violet-300"}`}>
                {m.role === "user" ? "U" : "✦"}
              </div>
              <div className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                ${m.role === "user" ? "bg-violet-600 text-white rounded-tr-sm" : "bg-white/[0.05] border border-white/[0.07] text-white/85 rounded-tl-sm"}`}>
                {getMessageText(m)}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-xs text-violet-300 flex-shrink-0">✦</div>
              <div className="bg-white/[0.05] border border-white/[0.07] px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                {[0, 150, 300].map((d) => (
                  <span key={d} className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="px-4 pb-6 pt-2 border-t border-white/[0.06]">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-end gap-2 bg-white/[0.04] border border-white/[0.08] rounded-2xl px-4 py-3 focus-within:border-violet-500/40 transition-colors">
            <textarea
              rows={rows}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything — concepts, code, projects..."
              className="flex-1 bg-transparent text-sm text-white placeholder-white/25 resize-none outline-none leading-relaxed"
            />
            <button onClick={() => handleSend()} disabled={!input.trim() || isLoading}
              className="w-8 h-8 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all flex-shrink-0 mb-0.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
          <p className="text-center text-white/20 text-xs mt-2.5">
            Using <span style={{ color: current.color }}>{current.name}</span> · EduCrush AI may make mistakes
          </p>
        </div>
      </div>
    </div>
  );
}