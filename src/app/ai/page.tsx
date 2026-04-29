"use client";

import { useChat } from "@ai-sdk/react";
import { useRef, useState, useEffect, useCallback } from "react";

type Provider = "gemini" | "groq" | "anthropic";

const PROVIDERS = [
  { id: "groq"      as Provider, name: "Groq",   model: "llama-3.3-70b-versatile", badge: "Free", color: "#F55036" },
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
  const [provider, setProvider]       = useState<Provider>("groq");
  const [showProviders, setShowProviders] = useState(false);
  const [input, setInput]             = useState("");
  const [rows, setRows]               = useState(1);

  const { messages, sendMessage, status, setMessages } = useChat();
  const isLoading = status === "streaming" || status === "submitted";

  // ── Scroll refs ────────────────────────────────────────────────────────────
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef           = useRef<HTMLDivElement>(null);
  const isNearBottomRef     = useRef(true);   // track if user is already near bottom
  const ticking             = useRef(false);  // rAF debounce flag

  // Check if user is near bottom (within 120px)
  const checkNearBottom = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    isNearBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
  }, []);

  // Smooth-scroll to bottom only if user is already near bottom
  const scrollToBottomIfNeeded = useCallback(() => {
    if (!isNearBottomRef.current) return;
    if (ticking.current) return;
    ticking.current = true;
    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      ticking.current = false;
    });
  }, []);

  useEffect(() => {
    scrollToBottomIfNeeded();
  }, [messages, scrollToBottomIfNeeded]);

  // Force scroll to bottom when user sends a new message
  const forceScrollToBottom = useCallback(() => {
    isNearBottomRef.current = true;
    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    });
  }, []);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const current = PROVIDERS.find((p) => p.id === provider)!;

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    setRows(Math.min(e.target.value.split("\n").length, 5));
  }

  async function handleSend(text?: string) {
    const msg = text ?? input;
    if (!msg.trim() || isLoading) return;
    setInput("");
    setRows(1);
    forceScrollToBottom();
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

  // ── Provider Dropdown (shared) ─────────────────────────────────────────────
  function ProviderDropdown({ align = "left" }: { align?: "left" | "right" }) {
    return (
      <div className={`absolute ${align === "right" ? "right-0" : "left-1/2 -translate-x-1/2"} top-12 bg-[#0d110d] border border-white/10 rounded-xl overflow-hidden z-50 w-56 shadow-xl shadow-black/60`}>
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
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      className="flex flex-col relative overflow-hidden text-white"
      style={{ minHeight: "calc(100vh - 64px)", background: "#000000" }}
      onClick={() => setShowProviders(false)}
    >
      {/* ── Background: greenish ambient glow ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(1, 255, 5, 0.09) 0%, transparent 70%)," +
            "radial-gradient(ellipse 50% 40% at 80% 80%, rgba(16,185,129,0.06) 0%, transparent 60%)," +
            "radial-gradient(ellipse 40% 30% at 10% 60%, rgba(137, 253, 27, 0.05) 0%, transparent 60%)",
        }}
      />
      {/* subtle green scanline noise overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(74,222,128,0.3) 2px, rgba(74,222,128,0.3) 3px)",
          backgroundSize: "100% 4px",
        }}
      />

      {/* ── Chat area ── */}
      <div
        ref={scrollContainerRef}
        onScroll={checkNearBottom}
        className="relative z-10 flex-1 overflow-y-auto px-4 py-6 scroll-smooth"
      >
        <div className="max-w-2xl mx-auto flex flex-col gap-6">

          {/* Welcome state */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center text-center gap-5 pt-10">
              {/* Icon with green glow */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                style={{
                  background: "rgba(34,197,94,0.08)",
                  border: "1px solid rgba(34,197,94,0.25)",
                  boxShadow: "0 0 32px rgba(34,197,94,0.15), 0 0 8px rgba(34,197,94,0.1)",
                }}
              >
                ✦
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-white mb-1">EduCrush AI</h1>
                <p className="text-white/40 text-sm max-w-sm">Ask anything — concepts, code, notes, projects.</p>
              </div>

              {/* Model selector */}
              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowProviders(!showProviders); }}
                  className="flex items-center gap-2 border border-white/10 bg-white/[0.04] px-4 py-2 rounded-full hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-colors text-sm"
                >
                  <span className="w-2 h-2 rounded-full" style={{ background: current.color }} />
                  <span className="text-white/70">{current.name}</span>
                  <span className="text-xs text-white/30">▾</span>
                </button>
                {showProviders && <ProviderDropdown align="left" />}
              </div>

              {/* Suggestions */}
              <div className="flex flex-wrap justify-center gap-2 mt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => handleSend(s.prompt)}
                    className="text-sm px-4 py-2 rounded-full border border-white/10 text-white/60 hover:text-white hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Top-right model switcher when chatting */}
          {messages.length > 0 && (
            <div className="flex justify-end">
              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowProviders(!showProviders); }}
                  className="flex items-center gap-2 border border-white/10 bg-white/[0.04] px-3 py-1.5 rounded-full hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-colors text-xs"
                >
                  <span className="w-2 h-2 rounded-full" style={{ background: current.color }} />
                  <span className="text-white/60">{current.name}</span>
                  <span className="text-white/30">▾</span>
                </button>
                {showProviders && <ProviderDropdown align="right" />}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <div
                className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-semibold mt-0.5 ${
                  m.role === "user"
                    ? "bg-violet-600 text-white"
                    : ""
                }`}
                style={
                  m.role === "assistant"
                    ? {
                        background: "rgba(34,197,94,0.1)",
                        border: "1px solid rgba(34,197,94,0.25)",
                        color: "rgba(134,239,172,1)",
                        boxShadow: "0 0 12px rgba(34,197,94,0.15)",
                      }
                    : {}
                }
              >
                {m.role === "user" ? "U" : "✦"}
              </div>
              <div
                className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-violet-600 text-white rounded-tr-sm"
                    : "rounded-tl-sm text-white/85"
                }`}
                style={
                  m.role === "assistant"
                    ? {
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(34,197,94,0.12)",
                        boxShadow: "0 0 0 0 transparent",
                      }
                    : {}
                }
              >
                {getMessageText(m)}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                style={{
                  background: "rgba(34,197,94,0.1)",
                  border: "1px solid rgba(34,197,94,0.25)",
                  color: "rgba(134,239,172,1)",
                  boxShadow: "0 0 12px rgba(34,197,94,0.15)",
                }}
              >
                ✦
              </div>
              <div
                className="px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(34,197,94,0.12)",
                }}
              >
                {[0, 150, 300].map((d) => (
                  <span
                    key={d}
                    className="w-1.5 h-1.5 rounded-full animate-bounce"
                    style={{
                      background: "rgba(134,239,172,0.7)",
                      animationDelay: `${d}ms`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* ── Input ── */}
      <div className="relative z-10 px-4 pb-6 pt-2 border-t border-white/[0.06]">
        {/* subtle green glow behind input bar */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-24 -z-10"
          style={{
            background: "radial-gradient(ellipse at center bottom, rgba(34,197,94,0.08) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-2xl mx-auto">
          <div
            className="flex items-end gap-2 rounded-2xl px-4 py-3 transition-all"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            onFocus={() => {}}
          >
            <textarea
              rows={rows}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything — concepts, code, projects..."
              className="flex-1 bg-transparent text-sm text-white placeholder-white/25 resize-none outline-none leading-relaxed"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all flex-shrink-0 mb-0.5 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #22c55e, #10b981)",
                boxShadow: input.trim() && !isLoading ? "0 0 16px rgba(34,197,94,0.4)" : "none",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
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