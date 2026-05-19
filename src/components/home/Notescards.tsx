'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Note, notes } from '@/data/Notes'
import { getNotesFromSupabase } from '@/lib/NoteService'

// ── Subject colors ────────────────────────────────────────────────────────────
const SUBJECT_COLORS: Record<string, { bg: string; dot: string; glow: string }> = {
  Physics:            { bg: '#0d1626', dot: '#6fa3ef', glow: 'from-blue-500 via-blue-300 to-cyan-300' },
  Maths:              { bg: '#13102e', dot: '#a57ef5', glow: 'from-violet-500 via-purple-300 to-indigo-300' },
  Biology:            { bg: '#0d1f12', dot: '#5ecf7a', glow: 'from-emerald-500 via-green-300 to-teal-300' },
  History:            { bg: '#1f110d', dot: '#e5845a', glow: 'from-orange-500 via-orange-300 to-amber-300' },
  Chemistry:          { bg: '#1f1a0d', dot: '#f5c842', glow: 'from-yellow-500 via-yellow-300 to-amber-200' },
  English:            { bg: '#12102e', dot: '#c084fc', glow: 'from-purple-500 via-pink-300 to-fuchsia-300' },
  'Computer Science': { bg: '#0d1a1f', dot: '#38bdf8', glow: 'from-cyan-500 via-sky-300 to-blue-300' },
  Geography:          { bg: '#0f1f0d', dot: '#86efac', glow: 'from-green-400 via-emerald-300 to-teal-200' },
  Drawing:            { bg: '#1a0d1f', dot: '#f0abfc', glow: 'from-pink-500 via-fuchsia-300 to-purple-300' },
  Management:         { bg: '#1f0d0d', dot: '#fca5a5', glow: 'from-red-400 via-rose-300 to-pink-300' },
}
const getColors = (subject: string) =>
  SUBJECT_COLORS[subject] ?? { bg: '#111827', dot: '#c8fa45', glow: 'from-emerald-400 via-lime-300 to-cyan-300' }

// ── Note Card ─────────────────────────────────────────────────────────────────
const NoteCard = ({ note, index, onSelect }: { note: Note; index: number; onSelect: (n: Note) => void }) => {
  const [visible, setVisible] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)
  const colors = getColors(note.subject)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const bounds = cardRef.current?.getBoundingClientRect()
    if (!bounds) return
    setPos({ x: e.clientX - bounds.left, y: e.clientY - bounds.top })
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onClick={() => onSelect(note)}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 cursor-pointer
        transition-all duration-300 hover:-translate-y-1.5 hover:border-slate-700
        hover:shadow-xl flex flex-col"
      style={{ height: '290px' }}
    >
      {/* Subject-colored glow on hover */}
      <motion.span
        className={`pointer-events-none absolute h-[240px] w-[240px] rounded-full bg-gradient-to-r ${colors.glow} blur-2xl`}
        animate={{
          top: pos.y - 120,
          left: pos.x - 120,
          opacity: visible ? 0.45 : 0,
          scale: visible ? 1.05 : 0.9,
        }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      />

      {/* Author-style glossy tooltip — subject name */}
      <div
        className="pointer-events-none absolute z-20 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap"
        style={{
          top: pos.y + 12,
          left: pos.x + 12,
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1)' : 'scale(0.65)',
          transition: 'opacity 0.18s ease, transform 0.18s ease',
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.13)',
          backdropFilter: 'blur(12px)',
          color: colors.dot,
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: colors.dot }} />
        {note.subject}
      </div>

      <div className="relative z-10 flex flex-col h-full">

        {/* Image / Placeholder */}
        <div
          className="w-full overflow-hidden rounded-t-2xl flex items-center justify-center relative shrink-0"
          style={{ height: '165px', background: colors.bg }}
        >
          {note.image ? (
            <>
              <img
                src={note.image}
                alt={note.title}
                loading="lazy"
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end p-3">
                <span className="flex items-center gap-1.5 rounded-lg border border-[#c8fa45]/50 bg-[#c8fa45]/15 px-2.5 py-1.5 text-xs font-semibold text-[#c8fa45] backdrop-blur-sm">
                  View Notes
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                    <path d="M7 17L17 7M17 7H7M17 7v10" stroke="#c8fa45" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>
            </>
          ) : (
            // No image — subject icon placeholder with colored bg
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${colors.dot}18` }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={colors.dot} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
              </div>
              <span className="text-[13px] font-semibold" style={{ color: colors.dot }}>{note.subject}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4 min-h-0">

          {/* Subject badge */}
          <span
            className="inline-block text-[10px] font-bold px-2.5 py-[3px] rounded-full mb-2.5 shrink-0 w-fit max-w-full truncate"
            style={{ background: `${colors.dot}18`, color: colors.dot, border: `1px solid ${colors.dot}30` }}
          >
            {note.subject}
          </span>

          {/* Title */}
          <p className="text-[13px] text-white font-medium leading-snug line-clamp-2 flex-1">
            {note.title}
          </p>

          {/* Bottom row */}
          <div className="flex items-center justify-between mt-2.5 shrink-0 pt-2.5 border-t border-slate-800/80">
            {note.course ? (
              <span className="text-[11px] text-slate-600 truncate max-w-[110px]">{note.course}</span>
            ) : (
              <span />
            )}
            <span className="flex items-center gap-1 text-[11px] font-semibold text-[#c8fa45] whitespace-nowrap">
              View
              <svg width="11" height="11" viewBox="0 0 13 13" fill="none">
                <path d="M2.5 6.5h8M7 3l3.5 3.5L7 10" stroke="#c8fa45" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ── Explore More Card ─────────────────────────────────────────────────────────
const ExploreMoreCard = () => (
  <Link
    href="/notes"
    className="group relative overflow-hidden rounded-2xl border border-dashed border-slate-800 bg-slate-950/50
      flex flex-col items-center justify-center text-center
      transition-all duration-300 hover:border-[#c8fa45]/40 hover:bg-slate-900/60"
    style={{ height: '290px' }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-[#c8fa45]/4 via-transparent to-emerald-500/4 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="relative z-10 flex flex-col items-center px-6">
      <div className="relative mb-4">
        <div className="absolute inset-0 rounded-full bg-[#c8fa45]/20 blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-all duration-500" />
        <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 border border-slate-800 group-hover:border-[#c8fa45]/40 text-[#c8fa45] transition-all duration-300 group-hover:scale-110">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
        </div>
      </div>
      <h3 className="text-base font-semibold text-white mb-1.5 group-hover:text-[#c8fa45] transition-colors">
        Explore All Notes
      </h3>
      <p className="text-xs text-slate-600 max-w-[140px] leading-relaxed">
        Saare subjects ke notes filters ke saath
      </p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-xs text-[#c8fa45] border border-[#c8fa45]/30 bg-[#c8fa45]/8 px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
        Browse Notes
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </span>
    </div>
  </Link>
)

// ── Skeleton ──────────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 animate-pulse" style={{ height: '290px' }}>
    <div className="h-[165px] rounded-t-2xl bg-slate-800/50" />
    <div className="p-4 space-y-3">
      <div className="h-3 w-16 bg-slate-800 rounded-full" />
      <div className="h-4 w-3/4 bg-slate-800 rounded" />
      <div className="h-3 w-1/2 bg-slate-800/60 rounded" />
    </div>
  </div>
)

// ── Detail Modal ──────────────────────────────────────────────────────────────
const NoteDetailModal = ({ note, onClose }: { note: Note; onClose: () => void }) => {
  const colors = getColors(note.subject)

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      >
        <motion.div
          className="relative w-[400px] max-w-full rounded-2xl overflow-hidden border border-slate-800 bg-[#0d0d0d] shadow-2xl"
          initial={{ scale: 0.92, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 16 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>

          {/* Cover */}
          <div className="w-full h-[190px] flex items-center justify-center relative overflow-hidden" style={{ background: colors.bg }}>
            {note.image ? (
              <>
                <img src={note.image} alt={note.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `${colors.dot}18` }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={colors.dot} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                </div>
                <span className="text-base font-bold" style={{ color: colors.dot }}>{note.subject}</span>
              </div>
            )}

            {/* Subject pill on image */}
            <div className="absolute bottom-3 left-3">
              <span
                className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                style={{ background: `${colors.dot}22`, color: colors.dot, border: `1px solid ${colors.dot}35` }}
              >
                {note.subject}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="text-[17px] font-semibold text-white mb-2 leading-snug">{note.title}</h3>

            {note.description && (
              <p className="text-[13px] text-slate-400 leading-relaxed mb-1">{note.description}</p>
            )}

            {/* Meta row */}
            <div className="flex items-center gap-3 mt-3 mb-5">
              {note.course && (
                <span className="flex items-center gap-1.5 text-[11px] text-slate-500 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
                  </svg>
                  {note.course}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-950/50 border border-emerald-800/40 px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Free
              </span>
            </div>

            {/* CTA */}
            <div className="flex gap-2">
              <Link
                href={note.link}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-bold bg-[#c8fa45] text-[#0d0d0d] hover:bg-[#d6ff55] transition-colors"
              >
                View Notes
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M2.5 6.5h8M7 3l3.5 3.5L7 10" stroke="#111" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <button
                onClick={onClose}
                className="w-11 flex items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-500 hover:text-white hover:border-slate-700 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
const NoteCards = ({ limit }: { limit?: number }) => {
  const [noteList, setNoteList] = useState<Note[]>([])
  const [loading, setLoading]   = useState(true)
  const [selected, setSelected] = useState<Note | null>(null)

  useEffect(() => {
    async function fetchNotes() {
      try {
        const data = await getNotesFromSupabase()
        setNoteList(data && data.length > 0 ? data : notes)
      } catch {
        setNoteList(notes)
      } finally {
        setLoading(false)
      }
    }
    fetchNotes()
  }, [])

  const displayedNotes = limit ? noteList.slice(0, limit) : noteList
  const showViewMore   = !!limit && noteList.length > limit

  return (
    <>
      <section className="bg-black text-slate-100 py-8" id="notes">

        {/* Header */}
        <div className="py-4 px-4 bg-black flex flex-col justify-center items-center gap-3 mb-8">
          <button className="px-4 h-8 border border-gray-800 text-slate-200 text-xs rounded-lg cursor-default">
            Notes
          </button>
          <h1 className="text-3xl md:text-[42px] font-medium text-white tracking-tighter text-center leading-tight">
            Our latest notes.
          </h1>
          <p className="text-base text-slate-400 max-w-md text-center leading-relaxed">
            Carefully curated notes covering all important topics for your academic success.
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {[1,2,3,4,5,6,7,8].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {displayedNotes.map((note, i) => (
                <NoteCard key={i} note={note} index={i} onSelect={setSelected} />
              ))}
              {(showViewMore || (!limit)) && <ExploreMoreCard />}
            </div>
          )}
        </div>
      </section>

      {selected && <NoteDetailModal note={selected} onClose={() => setSelected(null)} />}

      <div className="w-full h-px bg-gradient-to-r from-transparent via-emerald-700/40 to-transparent" />
    </>
  )
}

export default NoteCards