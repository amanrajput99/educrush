'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import type { College } from '@/lib/admissionService'

const BADGE_STYLES: Record<string, string> = {
  'NIRF Ranked': 'bg-emerald-950/60 border-emerald-800/60 text-emerald-400',
  'Top Placement': 'bg-blue-950/60 border-blue-800/60 text-blue-400',
  'Budget Friendly': 'bg-slate-900 border-slate-700 text-slate-300',
  'Premium': 'bg-teal-950/60 border-teal-800/60 text-teal-400',
}

function CollegeCard({ college, index, compareList, onCompareToggle }: {
  college: College; index: number; compareList: string[]; onCompareToggle: (id: string) => void
}) {
  const isComparing = compareList.includes(college.id ?? '')
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -4 }} onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
      className={`group relative bg-slate-950 border rounded-2xl p-6 transition-all duration-300 flex flex-col ${isComparing ? 'border-emerald-500/60 shadow-[0_0_20px_rgba(52,211,153,0.12)]' : 'border-slate-800 hover:border-emerald-700/40'}`}>
      <AnimatePresence>
        {hovered && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent rounded-2xl pointer-events-none" />
        )}
      </AnimatePresence>

      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-900/60 to-slate-900 border border-emerald-900/40 flex items-center justify-center text-2xl overflow-hidden">
          {college.logo_url ? <img src={college.logo_url} alt={college.name} className="w-full h-full object-cover rounded-xl" /> : '🏛️'}
        </div>
        {college.badge && (
          <span className={`text-[10px] px-2.5 py-0.5 rounded-full border ${BADGE_STYLES[college.badge] ?? 'bg-slate-900 border-slate-700 text-slate-400'}`}>{college.badge}</span>
        )}
      </div>

      <h3 className="font-black text-white text-base mb-1 group-hover:text-emerald-300 transition-colors">{college.name}</h3>
      <p className="text-slate-500 text-xs mb-4 flex items-center gap-1">📍 {college.city}, {college.state}</p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {college.courses.slice(0, 3).map(c => (
          <span key={c} className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400">{c}</span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5 text-xs">
        <div className="bg-black/40 rounded-xl p-3">
          <div className="text-slate-600 mb-0.5">Annual Fees</div>
          <div className="text-emerald-400 font-bold">₹{(college.fees_min / 1000).toFixed(0)}k–{(college.fees_max / 1000).toFixed(0)}k</div>
        </div>
        {college.nirf_rank ? (
          <div className="bg-black/40 rounded-xl p-3">
            <div className="text-slate-600 mb-0.5">NIRF Rank</div>
            <div className="text-white font-bold">#{college.nirf_rank}</div>
          </div>
        ) : college.placement_avg ? (
          <div className="bg-black/40 rounded-xl p-3">
            <div className="text-slate-600 mb-0.5">Avg Placement</div>
            <div className="text-white font-bold">₹{college.placement_avg}L</div>
          </div>
        ) : null}
      </div>

      <div className="mt-auto flex gap-2">
        <button onClick={() => onCompareToggle(college.id ?? '')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-200 ${isComparing ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300' : 'bg-transparent border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300'}`}>
          {isComparing ? '✓ Comparing' : '+ Compare'}
        </button>
        <Link href={`/admission/colleges/${college.slug}`}
          className="flex-1 py-2.5 rounded-xl text-xs font-black bg-emerald-500 hover:bg-emerald-400 text-black text-center transition-all duration-200 hover:scale-[1.02] hover:shadow-emerald-500/20 hover:shadow-lg">
          Details →
        </Link>
      </div>
    </motion.div>
  )
}

export default function CollegesClient({ colleges }: { colleges: College[] }) {
  const [search, setSearch] = useState('')
  const [courseFilter, setCourseFilter] = useState('All')
  const [cityFilter, setCityFilter] = useState('All')
  const [sortBy, setSortBy] = useState<'fees' | 'rank' | 'name'>('rank')
  const [compareList, setCompareList] = useState<string[]>([])
  const [showCompareBar, setShowCompareBar] = useState(false)

  const allCourses = useMemo(() => {
    const s = new Set<string>(); colleges.forEach(c => c.courses.forEach(co => s.add(co))); return ['All', ...Array.from(s)]
  }, [colleges])

  const allCities = useMemo(() => {
    const s = new Set<string>(); colleges.forEach(c => s.add(c.city)); return ['All', ...Array.from(s)]
  }, [colleges])

  const filtered = useMemo(() => {
    return colleges
      .filter(c => {
        const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.city.toLowerCase().includes(search.toLowerCase())
        const matchCourse = courseFilter === 'All' || c.courses.includes(courseFilter)
        const matchCity = cityFilter === 'All' || c.city === cityFilter
        return matchSearch && matchCourse && matchCity
      })
      .sort((a, b) => {
        if (sortBy === 'fees') return a.fees_min - b.fees_min
        if (sortBy === 'rank') return (a.nirf_rank ?? 999) - (b.nirf_rank ?? 999)
        return a.name.localeCompare(b.name)
      })
  }, [colleges, search, courseFilter, cityFilter, sortBy])

  const toggleCompare = (id: string) => {
    setCompareList(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id)
      if (prev.length >= 3) return prev
      const next = [...prev, id]; setShowCompareBar(next.length >= 2); return next
    })
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <div className="relative pt-28 pb-12 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(52,211,153,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(52,211,153,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="inline-flex mb-5">
          <span className="px-4 h-8 flex items-center border border-emerald-900/60 bg-emerald-950/30 text-emerald-400 text-xs rounded-full font-bold uppercase tracking-wider">
            Colleges 2026 — Dehradun · Delhi · Pan India
          </span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="text-3xl md:text-5xl font-black mb-3 tracking-tight">
          Find the{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Right College</span>
          , Right Future
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-slate-400 text-sm max-w-md mx-auto mb-8">
          Compare fees, NIRF ranks, and placements — all in one place. Free.
        </motion.p>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="relative max-w-lg mx-auto">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input type="text" placeholder="Search by college name or city..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/60 transition-all" />
        </motion.div>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex flex-wrap gap-2">
            {allCourses.slice(0, 6).map(c => (
              <button key={c} onClick={() => setCourseFilter(c)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all font-semibold ${courseFilter === c ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60' : 'bg-slate-900 text-slate-500 border-slate-800 hover:border-slate-700'}`}>
                {c}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-slate-600">Sort by:</span>
            <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}
              className="text-xs bg-slate-900 border border-slate-800 text-slate-400 rounded-lg px-3 py-1.5 outline-none focus:border-emerald-700">
              <option value="rank">NIRF Rank</option>
              <option value="fees">Fees (Low first)</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mb-8">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-emerald-700/30 to-transparent" />
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-32">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-slate-500">No colleges found — try a different search or filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((col, i) => (
              <CollegeCard key={col.id ?? col.slug} college={col} index={i} compareList={compareList} onCompareToggle={toggleCompare} />
            ))}
          </div>
        )}
      </div>

      {/* Compare bar */}
      <AnimatePresence>
        {showCompareBar && compareList.length >= 2 && (
          <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6">
            <div className="max-w-2xl mx-auto bg-slate-950/95 border border-emerald-800/60 backdrop-blur-xl rounded-2xl p-4 flex items-center justify-between shadow-[0_0_40px_rgba(52,211,153,0.15)]">
              <div className="text-sm text-white">
                <span className="text-emerald-400 font-black">{compareList.length} colleges</span> selected for comparison
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setCompareList([]); setShowCompareBar(false) }}
                  className="text-xs px-3 py-2 rounded-xl border border-slate-700 text-slate-400 hover:text-white transition-colors">
                  Clear
                </button>
                <Link href={`/admission/colleges/compare?colleges=${compareList.join(',')}`}
                  className="text-xs px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black transition-all hover:scale-105">
                  Compare Now →
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}