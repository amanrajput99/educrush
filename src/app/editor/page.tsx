'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { runCode } from '@/lib/codeRunner'

// ── Language config ───────────────────────────────────────────────────────────
const LANGUAGES = [
  {
    slug: 'html', name: 'HTML', icon: '🌐', color: '#fb923c',
    default: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>My Page</title>
  <style>
    body {
      font-family: 'Segoe UI', sans-serif;
      background: #0f0f0f;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
    }
    h1 { color: #4ade80; }
  </style>
</head>
<body>
  <h1>Hello from EduCrush! 🚀</h1>
</body>
</html>`,
  },
  {
    slug: 'c', name: 'C', icon: '⚙️', color: '#60a5fa',
    default: `#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}`,
  },
  {
    slug: 'cpp', name: 'C++', icon: '🔷', color: '#818cf8',
    default: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}`,
  },
  {
    slug: 'python', name: 'Python', icon: '🐍', color: '#4ade80',
    default: `print("Hello, World!")`,
  },
  {
    slug: 'javascript', name: 'JavaScript', icon: '🟨', color: '#fbbf24',
    default: `console.log("Hello, World!");`,
  },
]

const EXT: Record<string, string> = {
  html: 'html', c: 'c', cpp: 'cpp', python: 'py', javascript: 'js',
}

// ── Code Editor textarea ──────────────────────────────────────────────────────
const CodeArea = ({
  value, onChange, fontSize,
}: {
  value: string; onChange: (v: string) => void; fontSize: number
}) => {
  const ref = useRef<HTMLTextAreaElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const ta = ref.current!
      const s = ta.selectionStart, end = ta.selectionEnd
      const next = value.substring(0, s) + '  ' + value.substring(end)
      onChange(next)
      requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = s + 2 })
    }
    // Auto close brackets
    const pairs: Record<string, string> = { '(': ')', '[': ']', '{': '}' }
    if (pairs[e.key]) {
      e.preventDefault()
      const ta = ref.current!
      const s = ta.selectionStart, end = ta.selectionEnd
      const selected = value.substring(s, end)
      const next = value.substring(0, s) + e.key + selected + pairs[e.key] + value.substring(end)
      onChange(next)
      requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = s + 1 })
    }
  }

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={e => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      spellCheck={false}
      autoComplete="off"
      autoCorrect="off"
      className="w-full h-full bg-transparent text-slate-200 leading-[1.75] p-5 resize-none outline-none"
      style={{
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        fontSize,
        tabSize: 2,
        minHeight: '400px',
      }}
    />
  )
}

// ── HTML Preview Panel ────────────────────────────────────────────────────────
const HtmlPreview = ({ code, active }: { code: string; active: boolean }) => {
  const [liveMode, setLiveMode] = useState(true)
  const [renderKey, setRenderKey] = useState(0)

  // Re-render when code changes in live mode
  useEffect(() => {
    if (liveMode && active) {
      const t = setTimeout(() => setRenderKey(k => k + 1), 600)
      return () => clearTimeout(t)
    }
  }, [code, liveMode, active])

  return (
    <div className="flex flex-col h-full">
      {/* Preview toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0a0a0c] border-b border-gray-800">
        <div className="flex items-center gap-2">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fb923c" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
          <span className="text-xs font-medium text-slate-300">Preview</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Live toggle */}
          <button
            onClick={() => setLiveMode(v => !v)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] border transition-all ${
              liveMode
                ? 'border-orange-800/50 bg-orange-900/20 text-orange-400'
                : 'border-gray-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${liveMode ? 'bg-orange-400 animate-pulse' : 'bg-slate-600'}`} />
            {liveMode ? 'Live' : 'Manual'}
          </button>
          {/* Refresh */}
          <button
            onClick={() => setRenderKey(k => k + 1)}
            className="w-7 h-7 rounded-lg border border-gray-800 bg-[#0a0a0a] flex items-center justify-center text-slate-500 hover:text-white transition-all"
            title="Refresh preview"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
            </svg>
          </button>
        </div>
      </div>

      {/* iframe preview */}
      <div className="flex-1 bg-white relative">
        <iframe
          key={renderKey}
          srcDoc={code}
          title="HTML Preview"
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin"
          style={{ minHeight: '400px' }}
        />
      </div>
    </div>
  )
}

// ── Output Panel ──────────────────────────────────────────────────────────────
const OutputPanel = ({
  output, status, time, running,
}: {
  output: string; status: 'success' | 'error' | 'timeout' | null
  time?: string; running: boolean
}) => {
  const colors = {
    success: { text: '#4ade80', border: '#166534', bg: '#020f06' },
    error:   { text: '#f87171', border: '#7f1d1d', bg: '#0f0202' },
    timeout: { text: '#fbbf24', border: '#78350f', bg: '#0f0a00' },
  }
  const c = status ? colors[status] : { text: '#94a3b8', border: '#1e293b', bg: '#080a0d' }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0a0a0c] border-b border-gray-800">
        {running ? (
          <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
        ) : status === 'success' ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        ) : status ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2">
            <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
        )}
        <span className="text-xs font-medium" style={{ color: c.text }}>
          {running ? 'Running...' : status === 'success' ? 'Output' : status === 'error' ? 'Error' : status === 'timeout' ? 'Timeout' : 'Output'}
        </span>
        {time && !running && <span className="ml-auto text-[10px] text-slate-600">⏱ {time}</span>}
      </div>

      <div className="flex-1 overflow-auto p-4" style={{ background: c.bg, minHeight: '200px' }}>
        {running ? (
          <div className="flex items-center gap-3 text-slate-500 text-sm">
            <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
            Executing your code...
          </div>
        ) : output ? (
          <pre
            className="text-[13px] leading-[1.7] whitespace-pre-wrap break-words"
            style={{ color: c.text, fontFamily: "'JetBrains Mono', monospace" }}
          >
            {output}
          </pre>
        ) : (
          <div className="flex flex-col items-center justify-center h-full min-h-[160px] text-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1e293b" strokeWidth="1.5" className="mb-3">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            <p className="text-slate-700 text-xs">
              Press <kbd className="px-1.5 py-0.5 rounded border border-gray-800 text-[10px] font-mono">Ctrl+Enter</kbd> to run
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main Editor Page ──────────────────────────────────────────────────────────
export default function EditorPage() {
  const [activeLang, setActiveLang] = useState(LANGUAGES[0]) // HTML default
  const [codes, setCodes] = useState<Record<string, string>>(() =>
    Object.fromEntries(LANGUAGES.map(l => [l.slug, l.default]))
  )
  const [stdin, setStdin]         = useState('')
  const [showStdin, setShowStdin] = useState(false)
  const [running, setRunning]     = useState(false)
  const [output, setOutput]       = useState('')
  const [status, setStatus]       = useState<'success' | 'error' | 'timeout' | null>(null)
  const [runTime, setRunTime]     = useState<string | undefined>()
  const [copied, setCopied]       = useState(false)
  const [fontSize, setFontSize]   = useState(13.5)

  const isHtml = activeLang.slug === 'html'
  const code   = codes[activeLang.slug] ?? ''
  const setCode = (v: string) => setCodes(prev => ({ ...prev, [activeLang.slug]: v }))

  // Ctrl+Enter shortcut (only for non-HTML)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !isHtml) {
        e.preventDefault()
        handleRun()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [code, activeLang.slug, stdin, isHtml])

  const handleRun = async () => {
    if (running || isHtml) return
    setRunning(true)
    setOutput('')
    setStatus(null)
    setRunTime(undefined)
    const result = await runCode(code, activeLang.slug, stdin)
    setOutput(result.output)
    setStatus(result.status)
    setRunTime(result.time)
    setRunning(false)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleReset = () => {
    setCode(activeLang.default)
    setOutput('')
    setStatus(null)
  }

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `main.${EXT[activeLang.slug] ?? 'txt'}`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        body { font-family: 'Poppins', sans-serif; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="bg-black min-h-screen text-white flex flex-col">

        {/* ── Top Bar ── */}
        <header className="border-b border-gray-800 bg-[#080808] px-4 py-3 flex items-center gap-3 flex-wrap shrink-0">
          <Link href="/coding-practice"
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-sm mr-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Practice
          </Link>

          <div className="w-px h-5 bg-gray-800" />

          {/* Language tabs */}
          <div className="flex gap-1 flex-wrap">
            {LANGUAGES.map(lang => (
              <button
                key={lang.slug}
                onClick={() => {
                  setActiveLang(lang)
                  setOutput('')
                  setStatus(null)
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  activeLang.slug === lang.slug ? 'border' : 'text-slate-500 hover:text-slate-300'
                }`}
                style={activeLang.slug === lang.slug ? {
                  background:   lang.color + '15',
                  borderColor:  lang.color + '30',
                  color:        lang.color,
                } : {}}
              >
                <span>{lang.icon}</span>
                <span className="hidden sm:inline">{lang.name}</span>
              </button>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 ml-auto flex-wrap">
            {/* Font size — hide on mobile */}
            <div className="hidden md:flex items-center gap-1 border border-gray-800 rounded-lg px-2 py-1">
              <button onClick={() => setFontSize(f => Math.max(10, f - 1))} className="text-slate-500 hover:text-white text-xs w-5 text-center">−</button>
              <span className="text-xs text-slate-500 w-6 text-center">{fontSize}</span>
              <button onClick={() => setFontSize(f => Math.min(20, f + 1))} className="text-slate-500 hover:text-white text-xs w-5 text-center">+</button>
            </div>

            {/* Stdin — only for non-HTML */}
            {!isHtml && (
              <button
                onClick={() => setShowStdin(v => !v)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-all ${
                  showStdin ? 'border-emerald-800/50 bg-[#0D542B]/15 text-green-400' : 'border-gray-800 text-slate-500 hover:text-slate-300'
                }`}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 16 12 13 15 11 15 8 12 2 12"/>
                  <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
                </svg>
                <span className="hidden sm:inline">Stdin</span>
              </button>
            )}

            {/* Copy */}
            <button onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-gray-800 text-slate-500 hover:text-white transition-all">
              {copied
                ? <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg><span className="text-green-400 hidden sm:inline">Copied</span></>
                : <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg><span className="hidden sm:inline">Copy</span></>
              }
            </button>

            {/* Download */}
            <button onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-gray-800 text-slate-500 hover:text-white transition-all">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              <span className="hidden sm:inline">Download</span>
            </button>

            {/* Reset */}
            <button onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-gray-800 text-slate-500 hover:text-white transition-all">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
              </svg>
              <span className="hidden sm:inline">Reset</span>
            </button>

            {/* Run — only for non-HTML */}
            {!isHtml && (
              <button onClick={handleRun} disabled={running}
                className="flex items-center gap-2 px-5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 disabled:opacity-60"
                style={{
                  background: running ? '#0D542B' : 'linear-gradient(135deg, #0D542B, #16a34a)',
                  color: '#fff',
                  boxShadow: running ? 'none' : '0 0 16px rgba(22,163,74,0.2)',
                }}
              >
                {running ? (
                  <><svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Running</>
                ) : (
                  <><svg width="12" height="12" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>Run <span className="hidden md:inline text-[10px] opacity-60 font-normal">Ctrl+Enter</span></>
                )}
              </button>
            )}

            {/* HTML: Live label */}
            {isHtml && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-orange-800/40 bg-orange-900/10 text-orange-400">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                Live Preview
              </div>
            )}
          </div>
        </header>

        {/* ── Main area ── */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-0">

          {/* Code editor */}
          <div className="flex flex-col border-r border-gray-800 min-h-0">
            {/* File tab */}
            <div className="flex items-center gap-3 px-4 py-2 border-b border-gray-800/60 bg-[#0a0a0c] shrink-0">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
              </div>
              <span
                className="text-xs font-mono px-3 py-0.5 rounded border"
                style={{ borderColor: activeLang.color + '30', background: activeLang.color + '10', color: activeLang.color }}
              >
                {activeLang.icon} main.{EXT[activeLang.slug]}
              </span>
              <span className="ml-auto text-[10px] text-slate-700 hidden md:block">
                {isHtml ? 'Live preview on right →' : 'Tab = 2 spaces • auto-close brackets'}
              </span>
            </div>

            {/* Editor */}
            <div className="flex-1 overflow-auto scrollbar-hide" style={{ background: '#07080a' }}>
              <CodeArea value={code} onChange={setCode} fontSize={fontSize} />
            </div>

            {/* Stdin */}
            {showStdin && !isHtml && (
              <div className="border-t border-gray-800 shrink-0">
                <div className="flex items-center gap-2 px-4 py-2 bg-[#0a0a0c] border-b border-gray-800/60">
                  <span className="text-[10px] text-slate-600 uppercase tracking-wider">stdin</span>
                  <button onClick={() => setShowStdin(false)} className="ml-auto text-slate-700 hover:text-slate-400 transition-colors">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
                  </button>
                </div>
                <textarea
                  value={stdin}
                  onChange={e => setStdin(e.target.value)}
                  placeholder="Enter program input here..."
                  className="w-full bg-[#07080a] text-slate-300 text-xs p-4 resize-none outline-none"
                  style={{ minHeight: '72px', fontFamily: "'JetBrains Mono', monospace" }}
                />
              </div>
            )}
          </div>

          {/* ── Right panel: HTML Preview OR Code Output ── */}
          <div className="flex flex-col border-t lg:border-t-0 border-gray-800 min-h-0">
            {isHtml ? (
              <HtmlPreview code={code} active={isHtml} />
            ) : (
              <>
                <OutputPanel output={output} status={status} time={runTime} running={running} />
                {/* Footer */}
                <div className="px-4 py-2.5 border-t border-gray-800 bg-[#0a0a0c] shrink-0">
                  <div className="flex items-center gap-3">
                    <span className="text-base">{activeLang.icon}</span>
                    <span className="text-xs" style={{ color: activeLang.color }}>{activeLang.name}</span>
                    <div className="w-px h-3 bg-gray-800" />
                    <span className="text-[10px] text-slate-700">Free code runner</span>
                    <Link href="/coding-practice" className="ml-auto text-[11px] text-slate-600 hover:text-green-400 transition-colors">
                      Practice Problems →
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}