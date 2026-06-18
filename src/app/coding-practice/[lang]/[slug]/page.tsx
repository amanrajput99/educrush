'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { getProblemBySlug, getLanguages } from '@/lib/codingPracticeService'
import { runCode } from '@/lib/codeRunner'
import { supabase } from '@/lib/supabase'
import { saveCodingProgress } from '@/lib/auth'
import LoginRequiredModal from '@/components/auth/LoginRequiredModal'
import type { CodingProblem, CodingLanguage } from '@/data/codingPractice'
import { DIFFICULTY_CONFIG, LANGUAGE_CONFIG } from '@/data/codingPractice'

// ── Code Editor ───────────────────────────────────────────────────────────────
const CodeEditor = ({
  value, onChange, language, readOnly = false, minHeight = '280px',
}: {
  value: string; onChange?: (v: string) => void
  language: string; readOnly?: boolean; minHeight?: string
}) => {
  const taRef = useRef<HTMLTextAreaElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const ta = taRef.current!
      const start = ta.selectionStart
      const end = ta.selectionEnd
      const newVal = value.substring(0, start) + '  ' + value.substring(end)
      onChange?.(newVal)
      requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = start + 2 })
    }
  }

  const ext: Record<string, string> = { python: 'py', javascript: 'js', cpp: 'cpp', c: 'c' }

  return (
    <div className="relative rounded-xl overflow-hidden border border-gray-800 bg-[#07080a]" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0c0d0f] border-b border-gray-800/60">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/50" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/50" />
          <span className="w-3 h-3 rounded-full bg-green-500/50" />
        </div>
        <span className="text-slate-600 text-xs ml-2 font-mono">
          {readOnly ? 'solution' : 'main'}.{ext[language] ?? 'txt'}
        </span>
        {!readOnly && <span className="ml-auto text-[10px] text-slate-700">Tab = 2 spaces • auto-saved</span>}
      </div>
      <textarea
        ref={taRef}
        value={value}
        onChange={e => onChange?.(e.target.value)}
        onKeyDown={readOnly ? undefined : handleKeyDown}
        readOnly={readOnly}
        spellCheck={false}
        className="w-full bg-transparent text-slate-200 text-[13px] leading-[1.75] p-4 resize-none outline-none"
        style={{ minHeight, fontFamily: 'inherit', tabSize: 2 }}
      />
    </div>
  )
}

// ── Output Panel ──────────────────────────────────────────────────────────────
const OutputPanel = ({ output, status, time, running }: {
  output: string; status: 'success' | 'error' | 'timeout' | null
  time?: string; running: boolean
}) => {
  const colors = {
    success: { text: '#4ade80', border: '#166534', bg: '#052e16' },
    error:   { text: '#f87171', border: '#991b1b', bg: '#1c0000' },
    timeout: { text: '#fbbf24', border: '#92400e', bg: '#1c1000' },
  }
  const c = status ? colors[status] : { text: '#94a3b8', border: '#1e293b', bg: '#0a0a0a' }

  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: c.border, background: c.bg }}>
      <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: c.border }}>
        <div className="flex items-center gap-2">
          {running ? (
            <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c.text} strokeWidth="2.5">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
          ) : status === 'success' ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c.text} strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          ) : status ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c.text} strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          ) : null}
          <span className="text-xs font-medium" style={{ color: c.text }}>
            {running ? 'Running...' : status === 'success' ? 'Output' : status === 'error' ? 'Error' : status === 'timeout' ? 'Timeout' : 'Output'}
          </span>
        </div>
        {time && !running && (
          <span className="text-[10px] text-slate-600">{time}</span>
        )}
      </div>
      <pre className="p-4 text-[12px] leading-[1.7] font-mono overflow-x-auto whitespace-pre-wrap"
        style={{ color: c.text, minHeight: '80px', maxHeight: '220px', overflowY: 'auto' }}>
        {running ? (
          <span className="text-slate-500">Executing code...</span>
        ) : (
          output || <span className="text-slate-600">Run your code to see output here</span>
        )}
      </pre>
    </div>
  )
}

// ── Test Case Results Panel ────────────────────────────────────────────────────
type TestCaseResult = { input: string; expected: string; actual: string; passed: boolean }

const TestResultsPanel = ({ results, checking }: { results: TestCaseResult[] | null; checking: boolean }) => {
  if (!checking && !results) return null

  const passedCount = results?.filter(r => r.passed).length ?? 0
  const total = results?.length ?? 0
  const allPassed = total > 0 && passedCount === total

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        borderColor: checking ? '#1e293b' : allPassed ? '#166534' : '#991b1b',
        background: checking ? '#0a0a0a' : allPassed ? '#052e16' : '#1c0000',
      }}
    >
      <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: checking ? '#1e293b' : allPassed ? '#166534' : '#991b1b' }}>
        <div className="flex items-center gap-2">
          {checking ? (
            <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={allPassed ? '#4ade80' : '#f87171'} strokeWidth="2.5">
              {allPassed ? <polyline points="20 6 9 17 4 12"/> : <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>}
            </svg>
          )}
          <span className="text-xs font-medium" style={{ color: checking ? '#94a3b8' : allPassed ? '#4ade80' : '#f87171' }}>
            {checking ? 'Checking your solution...' : allPassed ? 'All test cases passed' : `${passedCount}/${total} test cases passed`}
          </span>
        </div>
      </div>

      {!checking && results && (
        <div className="p-3 space-y-2">
          {results.map((r, i) => (
            <div key={i} className="rounded-lg border p-3 text-xs font-mono"
              style={{ borderColor: r.passed ? '#166534' : '#991b1b', background: r.passed ? 'rgba(5,46,22,0.4)' : 'rgba(28,0,0,0.4)' }}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-slate-500">Test case {i + 1}</span>
                <span style={{ color: r.passed ? '#4ade80' : '#f87171' }}>{r.passed ? 'Passed' : 'Failed'}</span>
              </div>
              <div className="space-y-1 text-slate-400">
                <div><span className="text-slate-600">Input: </span>{r.input}</div>
                <div><span className="text-slate-600">Expected: </span><span className="text-blue-400">{r.expected}</span></div>
                {!r.passed && <div><span className="text-slate-600">Got: </span><span className="text-red-400">{r.actual || '(empty)'}</span></div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Hint Card ─────────────────────────────────────────────────────────────────
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
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={revealed ? '#4ade80' : '#475569'} strokeWidth="2">
        {revealed ? <polyline points="18 15 12 9 6 15"/> : <polyline points="6 9 12 15 18 9"/>}
      </svg>
    </button>
    <AnimatePresence>
      {revealed && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="overflow-hidden border-t border-gray-800/60"
        >
          <p className="px-4 pb-4 pt-3 text-sm text-slate-400 leading-relaxed">{hint}</p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
)

type Tab = 'problem' | 'hints' | 'solution'

// ── Main ──────────────────────────────────────────────────────────────────────
export default function ProblemDetailPage() {
  const params      = useParams()
  const pathname    = usePathname()
  const langSlug    = params?.lang as string
  const problemSlug = params?.slug as string

  const [problem, setProblem]   = useState<CodingProblem | null>(null)
  const [language, setLanguage] = useState<CodingLanguage | null>(null)
  const [loading, setLoading]   = useState(true)

  const [activeTab, setActiveTab]           = useState<Tab>('problem')
  const [code, setCode]                     = useState('')
  const [stdin, setStdin]                   = useState('')
  const [showStdin, setShowStdin]           = useState(false)
  const [revealedHints, setRevealedHints]   = useState<Set<number>>(new Set())
  const [showSolution, setShowSolution]     = useState(false)
  const [solved, setSolved]                 = useState(false)
  const [copied, setCopied]                 = useState(false)

  // Run state (manual "Run Code" button — just shows output, no verification)
  const [running, setRunning]   = useState(false)
  const [runOutput, setRunOutput] = useState('')
  const [runStatus, setRunStatus] = useState<'success' | 'error' | 'timeout' | null>(null)
  const [runTime, setRunTime]   = useState<string | undefined>()

  // Verification state (triggered by "Submit / Mark Solved")
  const [checking, setChecking] = useState(false)
  const [testResults, setTestResults] = useState<TestCaseResult[] | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)

  useEffect(() => {
    if (!langSlug || !problemSlug) return
    Promise.all([getProblemBySlug(problemSlug), getLanguages()]).then(([prob, langs]) => {
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

  // Auto-save
  useEffect(() => {
    if (!code || !problemSlug) return
    const t = setTimeout(() => localStorage.setItem(`code:${problemSlug}`, code), 800)
    return () => clearTimeout(t)
  }, [code, problemSlug])

  // ── Run code (manual, just for seeing output) ───────────────────────────────
  const handleRun = async () => {
    if (running) return
    setRunning(true)
    setRunOutput('')
    setRunStatus(null)
    setRunTime(undefined)
    const result = await runCode(code, langSlug, stdin)
    setRunOutput(result.output)
    setRunStatus(result.status)
    setRunTime(result.time)
    setRunning(false)
  }

  // ── Submit & Verify — runs every test case, only marks solved if all pass ──
  const handleSubmit = async () => {
    if (!problem || checking) return

    // 1. Must be logged in to even attempt verification + saving progress
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      setShowLoginModal(true)
      return
    }

    const testCases = (problem as any).test_cases as { input: string; expected_output: string }[] | undefined

    // No test cases configured for this problem — fall back to trusting the
    // student (legacy problems). Still requires login.
    if (!testCases || testCases.length === 0) {
      await finalizeSolved(session.user.id)
      return
    }

    setChecking(true)
    setTestResults(null)

    const results: TestCaseResult[] = []
    for (const tc of testCases) {
      const result = await runCode(code, langSlug, tc.input)
      const actual = (result.output ?? '').trim()
      const expected = tc.expected_output.trim()
      results.push({
        input: tc.input,
        expected: tc.expected_output,
        actual: result.output ?? '',
        passed: actual === expected,
      })
    }

    setTestResults(results)
    setChecking(false)

    const allPassed = results.every(r => r.passed)
    if (allPassed) {
      await finalizeSolved(session.user.id)
    }
  }

  // ── Once verified correct, persist solved state locally + in Supabase ──────
  const finalizeSolved = async (userId: string) => {
    setSolved(true)
    localStorage.setItem(`solved:${problemSlug}`, 'true')
    try {
      await saveCodingProgress(userId, problemSlug, langSlug)
    } catch {
      // Local solved-state already set; DB save can be retried by the
      // dashboard if needed. Don't block the UI on this.
    }
  }

  const resetCode = () => {
    if (!problem) return
    setCode(problem.starter_code ?? LANGUAGE_CONFIG[langSlug]?.defaultCode ?? '')
    localStorage.removeItem(`code:${problemSlug}`)
    setTestResults(null)
  }

  const copyCode = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const diff = problem ? DIFFICULTY_CONFIG[problem.difficulty] : null

  if (loading) return (
    <div className="bg-black min-h-screen pt-28 px-4">
      <div className="max-w-7xl mx-auto animate-pulse space-y-4">
        <div className="h-5 w-48 bg-gray-800 rounded" />
        <div className="h-8 w-72 bg-gray-800 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-8">
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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        body { font-family: 'Poppins', sans-serif; }
        textarea { font-family: 'JetBrains Mono', 'Fira Code', monospace !important; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <LoginRequiredModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        redirectTo={pathname}
      />

      <div className="bg-black min-h-screen text-white">
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[180px]"
            style={{ background: (language?.color ?? '#4ade80') + '07' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-20">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-600 mb-5 flex-wrap">
            <Link href="/coding-practice" className="hover:text-slate-400 transition-colors">Practice</Link>
            <span>/</span>
            <Link href={`/coding-practice/${langSlug}`} className="hover:text-slate-400 transition-colors">{language?.name}</Link>
            <span>/</span>
            <span className="text-slate-500 truncate max-w-[180px]">{problem.title}</span>
          </nav>

          {/* Title row */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="flex items-center gap-2 flex-wrap">
              {diff && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium border"
                  style={{ color: diff.color, background: diff.bg, borderColor: diff.color + '30' }}>
                  {diff.label}
                </span>
              )}
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
            <h1 className="text-2xl sm:text-3xl font-medium tracking-tight w-full sm:w-auto">{problem.title}</h1>
          </div>

          {/* ── Split Layout ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* ══ LEFT: Problem Panel ══ */}
            <div className="flex flex-col gap-4">

              {/* Tabs */}
              <div className="flex gap-1 p-1 rounded-xl bg-[#0a0a0a] border border-gray-800 w-fit">
                {([
                  { id: 'problem',  label: 'Problem' },
                  { id: 'hints',    label: `Hints (${problem.hints?.length ?? 0})` },
                  { id: 'solution', label: 'Solution' },
                ] as { id: Tab; label: string }[]).map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-[#0D542B]/40 text-green-300 border border-emerald-800/50'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <AnimatePresence mode="wait">

                {activeTab === 'problem' && (
                  <motion.div key="prob"
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                    className="border border-gray-800 rounded-2xl bg-gradient-to-b from-[#0a0a0a] to-black overflow-hidden"
                  >
                    <div className="p-5 border-b border-gray-800/50">
                      <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-3">Problem Statement</p>
                      <p className="text-sm/7 text-slate-300 whitespace-pre-line">{problem.description}</p>
                    </div>

                    {problem.examples?.length > 0 && (
                      <div className="p-5 border-b border-gray-800/50">
                        <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-4">Examples</p>
                        <div className="space-y-3">
                          {problem.examples.map((ex, i) => (
                            <div key={i} className="rounded-xl bg-[#080808] border border-gray-800/50 overflow-hidden">
                              <div className="px-4 py-2 bg-[#0c0c0c] border-b border-gray-800/30">
                                <span className="text-[10px] text-slate-600 font-mono">Example {i + 1}</span>
                              </div>
                              <div className="p-4 space-y-1.5 font-mono text-xs">
                                <div><span className="text-slate-600">Input: </span><span className="text-green-400">{ex.input}</span></div>
                                <div><span className="text-slate-600">Output: </span><span className="text-blue-400">{ex.output}</span></div>
                                {ex.explanation && <div><span className="text-slate-600">Note: </span><span className="text-slate-400">{ex.explanation}</span></div>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {problem.constraints?.length > 0 && (
                      <div className="p-5">
                        <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-3">Constraints</p>
                        <ul className="space-y-1.5">
                          {problem.constraints.map((c, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-slate-400 font-mono">
                              <span className="text-slate-700 mt-0.5">•</span>{c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'hints' && (
                  <motion.div key="hints"
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                    className="space-y-2"
                  >
                    <p className="text-xs text-slate-600 px-1 mb-3">Try it yourself first — hints are here if you get stuck.</p>
                    {problem.hints?.length > 0
                      ? problem.hints.map((hint, i) => (
                          <HintCard key={i} hint={hint} index={i}
                            revealed={revealedHints.has(i)}
                            onReveal={() => setRevealedHints(prev => new Set([...prev, i]))}
                          />
                        ))
                      : <div className="border border-gray-800 rounded-xl p-8 text-center text-slate-500 text-sm">No hints available.</div>
                    }
                  </motion.div>
                )}

                {activeTab === 'solution' && (
                  <motion.div key="sol"
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    {!showSolution ? (
                      <div className="border border-gray-800 rounded-2xl bg-gradient-to-b from-[#0a0a0a] to-black p-8 text-center">
                        <div className="w-12 h-12 rounded-full bg-[#0D542B]/20 border border-emerald-800/40 flex items-center justify-center mx-auto mb-4">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.8">
                            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                          </svg>
                        </div>
                        <h3 className="text-white font-medium mb-2">Solution is locked</h3>
                        <p className="text-slate-500 text-sm mb-5 max-w-xs mx-auto">Try it yourself first. Hints are available.</p>
                        <button onClick={() => setShowSolution(true)}
                          className="px-6 py-2 rounded-xl text-sm font-medium border border-emerald-800/50 bg-[#0D542B]/20 text-green-400 hover:bg-[#0D542B]/30 transition-all">
                          Show Solution Anyway
                        </button>
                      </div>
                    ) : (
                      <>
                        <CodeEditor value={problem.solution_code} language={langSlug} readOnly minHeight="240px" />
                        {problem.solution_explanation && (
                          <div className="border border-gray-800 rounded-xl bg-[#0a0a0a] p-5">
                            <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-3">Explanation</p>
                            <p className="text-sm/7 text-slate-400 whitespace-pre-line">{problem.solution_explanation}</p>
                          </div>
                        )}
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ══ RIGHT: Editor + Run ══ */}
            <div className="flex flex-col gap-3">

              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 rounded-lg text-xs font-medium border flex items-center gap-1.5"
                    style={{ background: (language?.color ?? '#4ade80') + '10', borderColor: (language?.color ?? '#4ade80') + '25', color: language?.color ?? '#4ade80' }}>
                    {language?.icon} {language?.name}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowStdin(v => !v)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-all ${
                      showStdin ? 'border-emerald-800/50 bg-[#0D542B]/20 text-green-400' : 'border-gray-800 text-slate-500 hover:text-slate-300'
                    }`}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="22 12 16 12 13 15 11 15 8 12 2 12"/>
                      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
                    </svg>
                    Stdin
                  </button>
                  <button onClick={copyCode}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-gray-800 text-slate-500 hover:text-white transition-all">
                    {copied
                      ? <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg><span className="text-green-400">Copied</span></>
                      : <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>Copy</>}
                  </button>
                  <button onClick={resetCode}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-gray-800 text-slate-500 hover:text-white transition-all">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
                    </svg>
                    Reset
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {showStdin && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="border border-gray-800 rounded-xl overflow-hidden">
                      <div className="px-4 py-2 bg-[#0c0c0c] border-b border-gray-800/60">
                        <span className="text-[10px] text-slate-600 uppercase tracking-wider">Standard Input (stdin)</span>
                      </div>
                      <textarea
                        value={stdin}
                        onChange={e => setStdin(e.target.value)}
                        placeholder="Enter input here..."
                        className="w-full bg-[#07080a] text-slate-300 text-xs p-3 resize-none outline-none font-mono"
                        style={{ minHeight: '64px', fontFamily: "'JetBrains Mono', monospace" }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <CodeEditor value={code} onChange={setCode} language={langSlug} minHeight="320px" />

              {/* Run + Submit buttons side by side */}
              <div className="flex gap-2">
                <button
                  onClick={handleRun}
                  disabled={running || checking}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium border border-gray-800 text-slate-300 hover:border-gray-600 transition-all disabled:opacity-60"
                >
                  {running ? (
                    <>
                      <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                      </svg>
                      Running...
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3"/>
                      </svg>
                      Run Code
                    </>
                  )}
                </button>

                {!solved && (
                  <button
                    onClick={handleSubmit}
                    disabled={running || checking}
                    className="flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-70"
                    style={{
                      background: checking ? '#0D542B' : 'linear-gradient(135deg, #0D542B, #16a34a)',
                      color: '#fff',
                      boxShadow: checking ? 'none' : '0 0 20px rgba(22,163,74,0.25)',
                    }}
                  >
                    {checking ? (
                      <>
                        <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                        </svg>
                        Checking...
                      </>
                    ) : (
                      <>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Submit
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Output panel — manual "Run Code" output */}
              <OutputPanel
                output={runOutput}
                status={runStatus}
                time={runTime}
                running={running}
              />

              {/* Test results — only shown after Submit */}
              <TestResultsPanel results={testResults} checking={checking} />

              <div className="flex items-center justify-between pt-1">
                <Link href={`/coding-practice/${langSlug}`}
                  className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-white transition-colors">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
                  All Problems
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-10 w-full h-px bg-gradient-to-r from-transparent via-emerald-700/30 to-transparent" />
        </div>
      </div>
    </>
  )
}