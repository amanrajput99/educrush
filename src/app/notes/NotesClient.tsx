'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRef } from 'react'
import { Note, COURSES, COURSE_YEARS } from '@/data/Notes'

// ── Subject colors ────────────────────────────────────────────────────────────
const SUBJECT_COLORS: Record<string, { bg: string; dot: string }> = {
  Physics:            { bg: '#1a1f2e', dot: '#6fa3ef' },
  Maths:              { bg: '#1f1a2e', dot: '#a57ef5' },
  Biology:            { bg: '#1a2e1e', dot: '#5ecf7a' },
  History:            { bg: '#2e1f1a', dot: '#e5845a' },
  Chemistry:          { bg: '#2e2a1a', dot: '#f5c842' },
  English:            { bg: '#1e1e2e', dot: '#c084fc' },
  'Computer Science': { bg: '#1a2a2e', dot: '#38bdf8' },
  Geography:          { bg: '#1e2a1a', dot: '#86efac' },
  Drawing:            { bg: '#2a1e2e', dot: '#f0abfc' },
  Management:         { bg: '#2e1e1e', dot: '#fca5a5' },
}

// ── Note Card ─────────────────────────────────────────────────────────────────
const NoteCard = ({ note, index }: { note: Note; index: number }) => {
  const [visible, setVisible] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLAnchorElement>(null)
  const colors = SUBJECT_COLORS[note.subject] ?? { bg: '#1a1a1a', dot: '#888' }

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const bounds = cardRef.current?.getBoundingClientRect()
    if (!bounds) return
    setPos({ x: e.clientX - bounds.left, y: e.clientY - bounds.top })
  }

  return (
    <motion.a
      ref={cardRef}
      href={note.link}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-5 text-left shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-[#c8fa45]/40 hover:shadow-[#c8fa45]/10 hover:shadow-xl"
    >
      {/* Cursor Glow */}
      <motion.span
        className="pointer-events-none absolute h-[220px] w-[220px] rounded-full bg-gradient-to-r from-emerald-400 via-lime-300 to-cyan-300 blur-2xl"
        animate={{
          top: pos.y - 110,
          left: pos.x - 110,
          opacity: visible ? 0.45 : 0,
          scale: visible ? 1.05 : 0.95,
        }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      />

      <div className="relative z-10 flex flex-col h-full">
        {/* Subject badge + bookmark */}
        <div className="flex items-center justify-between mb-3">
          <span className="bg-[#c8fa45] text-[#111] text-[11px] font-bold px-3 py-[3px] rounded-full truncate max-w-[120px]">
            {note.subject}
          </span>
          <div className="w-7 h-7 min-w-[28px] rounded-full border border-[#2e2e2e] bg-[#1a1a1a] flex items-center justify-center group-hover:border-[#c8fa45] transition-colors">
            <svg width="10" height="12" viewBox="0 0 9 11" fill="none">
              <path
                d="M7.357.5c.303 0 .594.117.808.325s.335.491.335.786v8.334a.54.54 0 0 1-.076.277.584.584 0 0 1-.779.205L5.067 8.995a1.17 1.17 0 0 0-1.134 0l-2.578 1.432a.584.584 0 0 1-.779-.205.54.54 0 0 1-.076-.277V1.61c0-.295.12-.577.335-.786A1.16 1.16 0 0 1 1.643.5z"
                stroke="#666"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Image / Colored placeholder */}
        <div
          className="w-full h-[120px] rounded-xl overflow-hidden flex items-center justify-center mb-3 relative"
          style={{ background: colors.bg }}
        >
          {note.image ? (
            <>
              <img
                src={note.image}
                alt={note.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end p-3">
                <span className="flex items-center gap-1 rounded-md border border-[#c8fa45]/50 bg-[#c8fa45]/20 px-2 py-1 text-xs font-semibold text-[#c8fa45] backdrop-blur-sm">
                  View Notes
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                    <path d="M7 17L17 7M17 7H7M17 7v10" stroke="#c8fa45" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </>
          ) : (
            <span className="text-[28px] font-black opacity-20" style={{ color: colors.dot }}>
              {note.subject.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>

        {/* Course + Year pills */}
        {(note.year || note.course) && (
          <div className="flex gap-1.5 mb-2 flex-wrap">
            {note.course && (
              <span className="text-[10px] px-2 py-0.5 rounded-full border border-slate-700 text-slate-500">
                {note.course}
              </span>
            )}
            {note.year && (
              <span className="text-[10px] px-2 py-0.5 rounded-full border border-slate-700 text-slate-500">
                {note.year}
              </span>
            )}
          </div>
        )}

        {/* Title */}
        <h3 className="text-[15px] font-semibold text-white mb-1 leading-snug">
          {note.title}
        </h3>

        {/* Description */}
        <p className="text-[12px] text-slate-500 leading-relaxed line-clamp-2 mb-3">
          {note.description}
        </p>

        {/* Bottom row */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-[11px] font-medium" style={{ color: colors.dot }}>
            {note.subject}
          </span>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-[#c8fa45] whitespace-nowrap">
            View Notes
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M2.5 6.5h8M7 3l3.5 3.5L7 10" stroke="#c8fa45" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </motion.a>
  )
}

// ── Filter Pill ───────────────────────────────────────────────────────────────
const FilterPill = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 whitespace-nowrap ${
      active
        ? 'bg-[#c8fa45]/20 border-[#c8fa45]/60 text-[#c8fa45] shadow-sm shadow-[#c8fa45]/20'
        : 'bg-transparent border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-300'
    }`}
  >
    {label}
  </button>
)

// ── Main Client Component ─────────────────────────────────────────────────────
// initialNotes = server se aaya data (SSR) — Google ko ye sab dikh raha hai
export default function NotesClient({ initialNotes }: { initialNotes: Note[] }) {
  const [search, setSearch] = useState('')
  const [activeCourse, setActiveCourse] = useState<string>('All')
  const [activeYear, setActiveYear] = useState<string>('All')
  const [activeSubject, setActiveSubject] = useState<string>('All')

  // Ab koi useEffect/loading nahi — data already server se aa gaya
  const noteList = initialNotes

  const handleCourseChange = (course: string) => {
    setActiveCourse(course)
    setActiveYear('All')
    setActiveSubject('All')
  }

  const handleYearChange = (year: string) => {
    setActiveYear(year)
    setActiveSubject('All')
  }

  const yearOptions = useMemo(() => {
    if (activeCourse === 'All') return []
    return COURSE_YEARS[activeCourse] ?? []
  }, [activeCourse])

  const subjectOptions = useMemo(() => {
    const set = new Set<string>()
    noteList
      .filter((n) => {
        const matchCourse = activeCourse === 'All' || n.course === activeCourse
        const matchYear   = activeYear   === 'All' || n.year   === activeYear
        return matchCourse && matchYear
      })
      .forEach((n) => set.add(n.subject))
    return ['All', ...Array.from(set).sort()]
  }, [noteList, activeCourse, activeYear])

  const filtered = useMemo(() => {
    return noteList.filter((n) => {
      const matchCourse  = activeCourse  === 'All' || n.course  === activeCourse
      const matchYear    = activeYear    === 'All' || n.year    === activeYear
      const matchSubject = activeSubject === 'All' || n.subject === activeSubject
      const q = search.toLowerCase()
      const matchSearch  =
        !q ||
        n.title.toLowerCase().includes(q) ||
        n.description.toLowerCase().includes(q) ||
        n.subject.toLowerCase().includes(q)
      return matchCourse && matchYear && matchSubject && matchSearch
    })
  }, [noteList, activeCourse, activeYear, activeSubject, search])

  const clearAll = () => {
    setSearch('')
    setActiveCourse('All')
    setActiveYear('All')
    setActiveSubject('All')
  }

  const hasActiveFilters = search || activeCourse !== 'All' || activeYear !== 'All' || activeSubject !== 'All'

  return (
    <main className="min-h-screen bg-black pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">

        {/* ── Hero Header ── */}
        <div className="text-center mb-14">
          <button className="px-4 h-8 border border-gray-800 text-slate-200 text-xs rounded-lg mb-4">
            Notes
          </button>
          <h1 className="text-5xl md:text-[56px] font-medium text-white tracking-tighter mt-2">
            All Notes
          </h1>
          <p className="text-base text-slate-400 max-w-lg mx-auto mt-3 leading-relaxed">
            Select your course — B.Tech, BCA, Diploma, or Class 10/11/12 — and instantly access clear, subject‑wise notes designed to help you succeed.
          </p>
        </div>

        {/* ── Search Bar ── */}
        <div className="relative mb-8">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            width="17" height="17" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes by title, subject, or keyword..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-11 pr-4 py-3.5 text-sm text-white placeholder-slate-600 outline-none focus:border-[#c8fa45]/40 focus:ring-1 focus:ring-[#c8fa45]/20 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* ── LEVEL 1: Course Filter ── */}
        <div className="mb-1">
          <p className="text-[11px] text-slate-600 uppercase tracking-widest mb-2.5 font-semibold">
            Select Course
          </p>
          <div className="flex flex-wrap gap-2">
            <FilterPill label="All" active={activeCourse === 'All'} onClick={() => handleCourseChange('All')} />
            {COURSES.map((course) => (
              <FilterPill
                key={course}
                label={course}
                active={activeCourse === course}
                onClick={() => handleCourseChange(course)}
              />
            ))}
          </div>
        </div>

        {/* ── LEVEL 2: Year Filter ── */}
        <AnimatePresence>
          {activeCourse !== 'All' && yearOptions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 20 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <p className="text-[11px] text-slate-600 uppercase tracking-widest mb-2.5 font-semibold">
                Select Year
              </p>
              <div className="flex flex-wrap gap-2">
                <FilterPill
                  label="All Years"
                  active={activeYear === 'All'}
                  onClick={() => handleYearChange('All')}
                />
                {yearOptions.map((year) => (
                  <FilterPill
                    key={year}
                    label={year}
                    active={activeYear === year}
                    onClick={() => handleYearChange(year)}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── LEVEL 3: Subject Filter ── */}
        <AnimatePresence>
          {subjectOptions.length > 2 && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 20 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <p className="text-[11px] text-slate-600 uppercase tracking-widest mb-2.5 font-semibold">
                Select Subject
              </p>
              <div className="flex flex-wrap gap-2">
                {subjectOptions.map((subject) => (
                  <FilterPill
                    key={subject}
                    label={subject}
                    active={activeSubject === subject}
                    onClick={() => setActiveSubject(subject)}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Divider ── */}
        <div className="mt-8 mb-5 w-full h-px bg-slate-900" />

        {/* ── Results count + clear ── */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-600 flex items-center gap-2 flex-wrap">
            <span>
              {filtered.length === 0
                ? 'No notes found'
                : `${filtered.length} note${filtered.length !== 1 ? 's' : ''}`}
            </span>
            {activeCourse !== 'All' && (
              <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-500">
                {activeCourse}
              </span>
            )}
            {activeYear !== 'All' && (
              <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-500">
                {activeYear}
              </span>
            )}
            {activeSubject !== 'All' && (
              <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-500">
                {activeSubject}
              </span>
            )}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="text-xs text-[#c8fa45] hover:text-[#d6ff55] flex items-center gap-1 transition-colors shrink-0"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
              Clear all
            </button>
          )}
        </div>

        {/* ── Grid ── */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-400">No notes found</h3>
            <p className="text-sm text-slate-600 mt-1">Try different filters or clear all</p>
            <button
              onClick={clearAll}
              className="mt-4 px-4 py-2 rounded-lg border border-slate-700 text-slate-400 text-sm hover:border-[#c8fa45]/50 hover:text-[#c8fa45] transition-all"
            >
              Clear all filters
            </button>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((note, index) => (
                <NoteCard
                  key={`${note.course}-${note.year}-${note.title}`}
                  note={note}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── Bottom divider glow ── */}
        <div className="mt-20 w-full h-px bg-gradient-to-r from-transparent via-[#c8fa45]/30 to-transparent" />
      </div>
    </main>
  )
}