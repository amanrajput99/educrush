'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { getLanguages, getProblemsByLanguage } from '@/lib/codingPracticeService'
import type { CodingLanguage, CodingProblem, Difficulty } from '@/data/codingPractice'
import { DIFFICULTY_CONFIG, TOPICS } from '@/data/codingPractice'

// ── Difficulty badge ──────────────────────────────────────────────────────────
const DiffBadge = ({ d }: { d: Difficulty }) => {
  const c = DIFFICULTY_CONFIG[d]
  return (
    <span
      className="px-2 py-0.5 rounded-full text-[10px] font-medium border"
      style={{ color: c.color, background: c.bg, borderColor: c.color + '30' }}
    >
      {c.label}
    </span>
  )
}

// ── Problem Row ───────────────────────────────────────────────────────────────
const ProblemRow = ({ problem, index, langSlug }: {
  problem: CodingProblem; index: number; langSlug: string
}) => {
  const solved = typeof window !== 'undefined'
    ? localStorage.getItem(`solved:${problem.slug}`) === 'true'
    : false

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
    >
      <Link
        href={`/coding-practice/${langSlug}/${problem.slug}`}
        className="group flex items-center gap-4 px-5 py-4 border-b border-gray-800/60 hover:bg-white/[0.02] transition-colors duration-200"
      >
        {/* Index + solved indicator */}
        <div className="w-8 shrink-0 flex items-center justify-center">
          {solved ? (
            <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          ) : (
            <span className="text-slate-700 text-xs font-mono">{String(index + 1).padStart(2, '0')}</span>
          )}
        </div>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <p className="text-slate-200 text-sm font-medium group-hover:text-white transition-colors truncate">
            {problem.title}
          </p>
          {problem.topic && (
            <p className="text-slate-600 text-xs mt-0.5">{problem.topic}</p>
          )}
        </div>

        {/* Tags (hidden on mobile) */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          {problem.tags?.slice(0, 2).map(tag => (
            <span key={tag} className="px-2 py-0.5 rounded text-[10px] text-slate-500 border border-gray-800 bg-[#0a0a0a]">
              {tag}
            </span>
          ))}
        </div>

        {/* Difficulty */}
        <div className="shrink-0">
          <DiffBadge d={problem.difficulty} />
        </div>

        {/* Arrow */}
        <svg className="text-slate-700 group-hover:text-slate-400 transition-colors shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </Link>
    </motion.div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function LanguageProblemsPage() {
  const params = useParams()
  const langSlug = params?.lang as string

  const [language, setLanguage]   = useState<CodingLanguage | null>(null)
  const [problems, setProblems]   = useState<CodingProblem[]>([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [diffFilter, setDiffFilter] = useState<Difficulty | 'all'>('all')
  const [topicFilter, setTopicFilter] = useState('all')

  useEffect(() => {
    if (!langSlug) return
    Promise.all([
      getLanguages(),
      getProblemsByLanguage(langSlug),
    ]).then(([langs, probs]) => {
      setLanguage(langs.find(l => l.slug === langSlug) ?? null)
      setProblems(probs)
      setLoading(false)
    })
  }, [langSlug])

  // Unique topics from problems
  const availableTopics = useMemo(() => {
    const t = new Set(problems.map(p => p.topic).filter(Boolean))
    return ['all', ...Array.from(t)]
  }, [problems])

  // Filtered problems
  const filtered = useMemo(() => {
    return problems.filter(p => {
      const q = search.toLowerCase()
      const matchSearch = !q || p.title.toLowerCase().includes(q) || p.topic?.toLowerCase().includes(q) || p.tags?.some(t => t.toLowerCase().includes(q))
      const matchDiff = diffFilter === 'all' || p.difficulty === diffFilter
      const matchTopic = topicFilter === 'all' || p.topic === topicFilter
      return matchSearch && matchDiff && matchTopic
    })
  }, [problems, search, diffFilter, topicFilter])

  // Stats
  const stats = useMemo(() => ({
    easy:   problems.filter(p => p.difficulty === 'easy').length,
    medium: problems.filter(p => p.difficulty === 'medium').length,
    hard:   problems.filter(p => p.difficulty === 'hard').length,
  }), [problems])

  if (loading) return (
    <div className="bg-black min-h-screen pt-28 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto animate-pulse space-y-4">
        <div className="h-5 w-32 bg-gray-800 rounded" />
        <div className="h-10 w-64 bg-gray-800 rounded-xl" />
        <div className="h-4 w-48 bg-gray-800/60 rounded" />
        <div className="h-12 bg-gray-900 rounded-xl mt-8" />
        {[1,2,3,4,5].map(i => <div key={i} className="h-14 bg-gray-900 rounded-xl" />)}
      </div>
    </div>
  )

  if (!language) return (
    <div className="bg-black min-h-screen pt-28 flex items-center justify-center">
      <div className="text-center">
        <p className="text-slate-400">Language not found</p>
        <Link href="/coding-practice" className="mt-3 text-sm text-green-400 hover:text-green-300 block">← Back</Link>
      </div>
    </div>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * { font-family: 'Poppins', sans-serif; }
      `}</style>

      <div className="bg-black min-h-screen text-white">
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-[600px] h-[600px] rounded-full blur-[180px] z-0"
          style={{ background: language.color + '0a' }} />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-24">

          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-xs text-slate-600 mb-8"
          >
            <Link href="/" className="hover:text-slate-400 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/coding-practice" className="hover:text-slate-400 transition-colors">Coding Practice</Link>
            <span>/</span>
            <span className="text-slate-400">{language.name}</span>
          </motion.nav>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <div className="w-full h-px bg-gradient-to-r from-transparent via-emerald-700/30 to-transparent mb-8" />

            <div className="flex items-start gap-4 mb-5">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl border shrink-0"
                style={{ background: language.color + '15', borderColor: language.color + '30' }}
              >
                {language.icon}
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-medium tracking-tight">
                  {language.name}{' '}
                  <span className="bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">
                    Problems
                  </span>
                </h1>
                <p className="text-slate-500 text-sm mt-1">{language.description}</p>
              </div>
            </div>

            {/* Difficulty stats */}
            <div className="flex flex-wrap gap-4">
              {[
                { label: 'Easy',   count: stats.easy,   color: '#4ade80' },
                { label: 'Medium', count: stats.medium, color: '#fbbf24' },
                { label: 'Hard',   count: stats.hard,   color: '#f87171' },
                { label: 'Total',  count: problems.length, color: '#94a3b8' },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
                  <span className="text-xs text-slate-500">{s.label}:</span>
                  <span className="text-xs font-semibold" style={{ color: s.color }}>{s.count}</span>
                </div>
              ))}
            </div>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-emerald-700/30 to-transparent mt-6" />
          </motion.div>

          {/* AdSense */}
          {/* <div className="mb-8 rounded-xl border border-gray-800 overflow-hidden">
            <p className="text-[9px] text-slate-700 uppercase tracking-widest text-center py-1.5">Advertisement</p>
            <ins className="adsbygoogle block" data-ad-client="ca-pub-XXXXXXXX" data-ad-slot="SLOT_ID" data-ad-format="auto" data-full-width-responsive="true" />
          </div> */}

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3 mb-6"
          >
            {/* Search */}
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search problems..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-800 bg-[#0a0a0a] text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-emerald-900/60 transition-colors"
              />
            </div>

            {/* Difficulty filter */}
            <div className="flex gap-2">
              {(['all', 'easy', 'medium', 'hard'] as const).map(d => (
                <button
                  key={d}
                  onClick={() => setDiffFilter(d)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all duration-200 ${
                    diffFilter === d
                      ? 'bg-emerald-900/30 border-emerald-800/60 text-green-400'
                      : 'border-gray-800 text-slate-500 hover:border-gray-700 hover:text-slate-300'
                  }`}
                >
                  {d === 'all' ? 'All' : DIFFICULTY_CONFIG[d].label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Topic filter chips */}
          {availableTopics.length > 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="flex flex-wrap gap-2 mb-6"
            >
              {availableTopics.map(t => (
                <button
                  key={t}
                  onClick={() => setTopicFilter(t)}
                  className={`px-3 py-1 rounded-full text-xs border transition-all duration-200 ${
                    topicFilter === t
                      ? 'bg-emerald-900/30 border-emerald-800/50 text-green-400'
                      : 'border-gray-800 text-slate-600 hover:text-slate-400'
                  }`}
                >
                  {t === 'all' ? 'All Topics' : t}
                </button>
              ))}
            </motion.div>
          )}

          {/* Results count */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-slate-600">
              {filtered.length === 0 ? 'No problems found' : `${filtered.length} problem${filtered.length !== 1 ? 's' : ''}`}
              {(diffFilter !== 'all' || topicFilter !== 'all' || search) && (
                <button
                  onClick={() => { setSearch(''); setDiffFilter('all'); setTopicFilter('all') }}
                  className="ml-2 text-green-600 hover:text-green-400 transition-colors"
                >
                  Clear filters
                </button>
              )}
            </p>
          </div>

          {/* Problems table */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="border border-gray-800 rounded-2xl bg-gradient-to-b from-[#0a0a0a] to-black overflow-hidden"
          >
            {/* Table header */}
            <div className="flex items-center gap-4 px-5 py-3 border-b border-gray-800 bg-[#080808]">
              <div className="w-8 shrink-0" />
              <span className="flex-1 text-[10px] text-slate-600 uppercase tracking-wider">Problem</span>
              <span className="hidden sm:block text-[10px] text-slate-600 uppercase tracking-wider shrink-0 w-24">Tags</span>
              <span className="text-[10px] text-slate-600 uppercase tracking-wider shrink-0">Difficulty</span>
              <div className="w-4 shrink-0" />
            </div>

            <AnimatePresence mode="popLayout">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-12 h-12 rounded-full border border-gray-800 flex items-center justify-center mb-3 text-slate-600">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                    </svg>
                  </div>
                  <p className="text-slate-500 text-sm">No problems found</p>
                  <button
                    onClick={() => { setSearch(''); setDiffFilter('all'); setTopicFilter('all') }}
                    className="mt-3 text-xs text-green-500 hover:text-green-400 transition-colors"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                filtered.map((problem, i) => (
                  <ProblemRow key={problem.slug} problem={problem} index={i} langSlug={langSlug} />
                ))
              )}
            </AnimatePresence>
          </motion.div>

          {/* AdSense Bottom */}
          {/* <div className="mt-10 rounded-xl border border-gray-800 overflow-hidden">
            <p className="text-[9px] text-slate-700 uppercase tracking-widest text-center py-1.5">Advertisement</p>
            <ins className="adsbygoogle block" data-ad-client="ca-pub-XXXXXXXX" data-ad-slot="SLOT_ID" data-ad-format="auto" data-full-width-responsive="true" />
          </div> */}

          <div className="mt-10 w-full h-px bg-gradient-to-r from-transparent via-emerald-700/30 to-transparent" />
        </div>
      </div>
    </>
  )
}