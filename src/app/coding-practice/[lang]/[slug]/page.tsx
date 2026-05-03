'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { getProblemBySlug, getLanguages } from '@/lib/codingPracticeService'
import type { CodingProblem, CodingLanguage } from '@/data/codingPractice'
import { DIFFICULTY_CONFIG, LANGUAGE_CONFIG } from '@/data/codingPractice'

// ── Simple code editor (textarea based — no external deps) ───────────────────
const CodeEditor = ({
  value,
  onChange,
  language,
  readOnly = false,
}: {
  value: string
  onChange?: (v: string) => void
  language: string
  readOnly?: boolean
}) => {
  const taRef = useRef<HTMLTextAreaElement>(null)

  // Tab key support
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const ta = taRef.current!
      const start = ta.selectionStart
      const end = ta.selectionEnd
      const newVal = value.substring(0, start) + '  ' + value.substring(end)
      onChange?.(newVal)
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 2
      })
    }
  }

  return (
    <div className="relative rounded-xl overflow-hidden border border-gray-800 bg-[#07080a] font-mono">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0c0d0f] border-b border-gray-800/60">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/60" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <span className="w-3 h-3 rounded-full bg-green-500/60" />
        </div>
        <span className="text-slate-500 text-xs ml-2">
          {readOnly ? 'solution' : 'editor'}.{language === 'python' ? 'py' : language === 'javascript' ? 'js' : language === 'cpp' ? 'cpp' : 'c'}
        </span>
        {!readOnly && (
          <span className="ml-auto text-[10px] text-slate-700">Tab = 2 spaces</span>
        )}
      </div>
      <textarea
        ref={taRef}
        value={value}
        onChange={e => onChange?.(e.target.value)}
        onKeyDown={readOnly ? undefined : handleKeyDown}
        readOnly={readOnly}
        spellCheck={false}
        className="w-full bg-transparent text-slate-200 text-[13px] leading-[1.7] p-4 resize-none outline-none scrollbar-hide"
        style={{
          minHeight: '280px',
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
          tabSize: 2,
        }}
      />
    </div>
  )
}

// ── Hint card ─────────────────────────────────────────────────────────────────
const HintCard = ({ hint, index, revealed, onReveal }: {
  hint: string; index: number; revealed: boolean; onReveal: () => void
}) => (
  <div className="border border-gray-800 rounded-xl overflow-hidden">
    <button
      onClick={onReveal}
      className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/[0.02] transition-colors"
    >
      <div className="flex items-center gap-2.5">
        <span className="w-5 h-5 rounded-full bg-[#0D542B]/40 border border-emerald-800/50 flex items-center justify-center text-[10px] text-green-400 font-semibold">
          {index + 1}
        </span>
        <span className="text-slate-400 text-sm">Hint {index + 1}</span>
      </div>
      {revealed ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2"><polyline points="18 15 12 9 6 15"/></svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
      )}
    </button>
    <AnimatePresence>
      {revealed && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden"
        >
          <p className="px-4 pb-4 text-sm text-slate-400 leading-relaxed border-t border-gray-800/60 pt-3">
            {hint}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
)

// ── Tabs ──────────────────────────────────────────────────────────────────────
type Tab = 'problem' | 'hints' | 'solution'

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ProblemDetailPage() {
  const params = useParams()
  const langSlug    = params?.lang as string
  const problemSlug = params?.slug as string

  const [problem, setProblem]     = useState<CodingProblem | null>(null)
  const [language, setLanguage]   = useState<CodingLanguage | null>(null)
  const [loading, setLoading]     = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('problem')
  const [code, setCode]           = useState('')
  const [revealedHints, setRevealedHints] = useState<Set<number>>(new Set())
  const [showSolution, setShowSolution]   = useState(false)
  const [solved, setSolved]       = useState(false)
  const [copied, setCopied]       = useState(false)

  useEffect(() => {
    if (!langSlug || !problemSlug) return
    Promise.all([
      getProblemBySlug(problemSlug),
      getLanguages(),
    ]).then(([prob, langs]) => {
      if (prob) {
        setProblem(prob)
        const saved = localStorage.getItem(`code:${problemSlug}`)
        setCode(saved ?? prob.starter_code ?? LANGUAGE_CONFIG[langSlug]?.defaultCode ?? '')
        setSolved(localStorage.getItem(`solved:${problemSlug}`) === 'true')
      }
      setLanguage(langs.find(l => l.slug === langSlug) ?? null)
      setLoading(false)
    })
  }, [langSlug, problemSlug])

  // Auto-save code
  useEffect(() => {
    if (code && problemSlug) {
      const t = setTimeout(() => localStorage.setItem(`code:${problemSlug}`, code), 800)
      return () => clearTimeout(t)
    }
  }, [code, problemSlug])

  const markSolved = () => {
    setSolved(true)
    localStorage.setItem(`solved:${problemSlug}`, 'true')
  }

  const resetCode = () => {
    if (problem) {
      setCode(problem.starter_code ?? LANGUAGE_CONFIG[langSlug]?.defaultCode ?? '')
      localStorage.removeItem(`code:${problemSlug}`)
    }
  }

  const copyCode = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const revealHint = (i: number) => {
    setRevealedHints(prev => new Set([...prev, i]))
  }

  if (loading) return (
    <div className="bg-black min-h-screen pt-28 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto animate-pulse space-y-4">
        <div className="h-5 w-48 bg-gray-800 rounded" />
        <div className="h-8 w-72 bg-gray-800 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="h-[500px] bg-gray-900 rounded-2xl" />
          <div className="h-[500px] bg-gray-900 rounded-2xl" />
        </div>
      </div>
    </div>
  )

  if (!problem) return (
    <div className="bg-black min-h-screen pt-28 flex items-center justify-center">
      <div className="text-center">
        <p className="text-slate-400 mb-3">Problem not found</p>
        <Link href={`/coding-practice/${langSlug}`} className="text-sm text-green-400 hover:text-green-300">← Back</Link>
      </div>
    </div>
  )

  const diff = DIFFICULTY_CONFIG[problem.difficulty]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        body { font-family: 'Poppins', sans-serif; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="bg-black min-h-screen text-white">
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-[600px] h-[600px] rounded-full blur-[180px] z-0 opacity-40"
          style={{ background: language?.color + '08' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-20">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-600 mb-6 flex-wrap">
            <Link href="/coding-practice" className="hover:text-slate-400 transition-colors">Practice</Link>
            <span>/</span>
            <Link href={`/coding-practice/${langSlug}`} className="hover:text-slate-400 transition-colors capitalize">{language?.name}</Link>
            <span>/</span>
            <span className="text-slate-500 truncate max-w-[200px]">{problem.title}</span>
          </nav>

          {/* Title row */}
          <div className="flex flex-wrap items-start gap-3 mb-6">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-medium border"
                  style={{ color: diff.color, background: diff.bg, borderColor: diff.color + '30' }}
                >
                  {diff.label}
                </span>
                {problem.topic && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] border border-gray-800 text-slate-500 bg-[#0a0a0a]">
                    {problem.topic}
                  </span>
                )}
                {solved && (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] border border-green-800/50 bg-green-900/20 text-green-400">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    Solved
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-white">{problem.title}</h1>
            </div>

            {/* Mark solved button */}
            {!solved && (
              <button
                onClick={markSolved}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm border border-gray-800 text-slate-400 hover:border-green-800/60 hover:text-green-400 transition-all"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                Mark Solved
              </button>
            )}
          </div>

          {/* ── Main split layout ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* ── LEFT: Problem panel ── */}
            <div className="space-y-4">

              {/* Tab switcher */}
              <div className="flex gap-1 p-1 rounded-xl bg-[#0a0a0a] border border-gray-800 w-fit">
                {([
                  { id: 'problem',  label: 'Problem' },
                  { id: 'hints',    label: `Hints (${problem.hints?.length ?? 0})` },
                  { id: 'solution', label: 'Solution' },
                ] as { id: Tab; label: string }[]).map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-[#0D542B]/40 text-green-300 border border-emerald-800/50'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Problem tab */}
              <AnimatePresence mode="wait">
                {activeTab === 'problem' && (
                  <motion.div
                    key="problem"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border border-gray-800 rounded-2xl bg-gradient-to-b from-[#0a0a0a] to-black overflow-hidden"
                  >
                    {/* Description */}
                    <div className="p-5 sm:p-6 border-b border-gray-800/60">
                      <h3 className="text-xs text-slate-600 uppercase tracking-wider mb-3">Problem Statement</h3>
                      <p className="text-sm/7 text-slate-300 whitespace-pre-line">{problem.description}</p>
                    </div>

                    {/* Examples */}
                    {problem.examples?.length > 0 && (
                      <div className="p-5 sm:p-6 border-b border-gray-800/60">
                        <h3 className="text-xs text-slate-600 uppercase tracking-wider mb-4">Examples</h3>
                        <div className="space-y-4">
                          {problem.examples.map((ex, i) => (
                            <div key={i} className="rounded-xl bg-[#080808] border border-gray-800/60 overflow-hidden">
                              <div className="px-4 py-2 bg-[#0c0c0c] border-b border-gray-800/40">
                                <span className="text-[10px] text-slate-600 font-mono">Example {i + 1}</span>
                              </div>
                              <div className="p-4 space-y-2 font-mono text-xs">
                                <div>
                                  <span className="text-slate-600">Input: </span>
                                  <span className="text-green-400">{ex.input}</span>
                                </div>
                                <div>
                                  <span className="text-slate-600">Output: </span>
                                  <span className="text-blue-400">{ex.output}</span>
                                </div>
                                {ex.explanation && (
                                  <div>
                                    <span className="text-slate-600">Explanation: </span>
                                    <span className="text-slate-400">{ex.explanation}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Constraints */}
                    {problem.constraints?.length > 0 && (
                      <div className="p-5 sm:p-6">
                        <h3 className="text-xs text-slate-600 uppercase tracking-wider mb-3">Constraints</h3>
                        <ul className="space-y-1.5">
                          {problem.constraints.map((c, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-slate-400 font-mono">
                              <span className="text-slate-700 mt-0.5">•</span>
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Hints tab */}
                {activeTab === 'hints' && (
                  <motion.div
                    key="hints"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-2"
                  >
                    {problem.hints?.length > 0 ? (
                      <>
                        <p className="text-xs text-slate-600 px-1">
                          Try the problem first! Hints are here when you need them.
                        </p>
                        {problem.hints.map((hint, i) => (
                          <HintCard
                            key={i}
                            hint={hint}
                            index={i}
                            revealed={revealedHints.has(i)}
                            onReveal={() => revealHint(i)}
                          />
                        ))}
                      </>
                    ) : (
                      <div className="border border-gray-800 rounded-xl p-8 text-center text-slate-500 text-sm">
                        No hints available for this problem.
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Solution tab */}
                {activeTab === 'solution' && (
                  <motion.div
                    key="solution"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    {!showSolution ? (
                      <div className="border border-gray-800 rounded-2xl bg-gradient-to-b from-[#0a0a0a] to-black p-8 text-center">
                        <div className="w-12 h-12 rounded-full bg-[#0D542B]/20 border border-emerald-800/40 flex items-center justify-center mx-auto mb-4">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.8">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                          </svg>
                        </div>
                        <h3 className="text-white font-medium mb-2">Solution is locked</h3>
                        <p className="text-slate-500 text-sm mb-5 max-w-xs mx-auto">
                          Try solving the problem yourself first. Hints available in the Hints tab.
                        </p>
                        <button
                          onClick={() => setShowSolution(true)}
                          className="px-6 py-2 rounded-xl text-sm font-medium border border-emerald-800/50 bg-[#0D542B]/20 text-green-400 hover:bg-[#0D542B]/30 transition-all"
                        >
                          Show Solution
                        </button>
                      </div>
                    ) : (
                      <>
                        <CodeEditor value={problem.solution_code} language={langSlug} readOnly />
                        {problem.solution_explanation && (
                          <div className="border border-gray-800 rounded-xl bg-[#0a0a0a] p-5">
                            <h4 className="text-xs text-slate-600 uppercase tracking-wider mb-3">Explanation</h4>
                            <p className="text-sm/7 text-slate-400 whitespace-pre-line">{problem.solution_explanation}</p>
                          </div>
                        )}
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── RIGHT: Code Editor ── */}
            <div className="space-y-3">
              {/* Editor toolbar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="px-3 py-1 rounded-lg text-xs font-medium border flex items-center gap-1.5"
                    style={{
                      background: (language?.color ?? '#4ade80') + '10',
                      borderColor: (language?.color ?? '#4ade80') + '30',
                      color: language?.color ?? '#4ade80',
                    }}
                  >
                    {language?.icon} {language?.name}
                  </div>
                  <span className="text-xs text-slate-700">Auto-saved</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyCode}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-gray-800 text-slate-500 hover:text-white hover:border-gray-700 transition-all"
                  >
                    {copied ? (
                      <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg><span className="text-green-400">Copied</span></>
                    ) : (
                      <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>Copy</>
                    )}
                  </button>
                  <button
                    onClick={resetCode}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-gray-800 text-slate-500 hover:text-white hover:border-gray-700 transition-all"
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                    Reset
                  </button>
                </div>
              </div>

              {/* Editor */}
              <CodeEditor
                value={code}
                onChange={setCode}
                language={langSlug}
              />

              {/* Note about running code */}
              <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl border border-gray-800 bg-[#0a0a0a]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" className="shrink-0 mt-0.5">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Code editor mein likhao aur apna solution compare karo.
                  Copy karke{' '}
                  <a href="https://www.programiz.com/c-programming/online-compiler/" target="_blank" rel="noreferrer" className="text-green-500 hover:text-green-400 transition-colors">
                    online compiler
                  </a>{' '}
                  pe run kar sakte ho.
                </p>
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-1">
                <Link
                  href={`/coding-practice/${langSlug}`}
                  className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-white transition-colors"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
                  All Problems
                </Link>
                {!solved && (
                  <button
                    onClick={markSolved}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium bg-[#0D542B]/30 border border-emerald-800/50 text-green-400 hover:bg-[#0D542B]/50 transition-all"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    Mark as Solved
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-10 w-full h-px bg-gradient-to-r from-transparent via-emerald-700/30 to-transparent" />
        </div>
      </div>
    </>
  )
}