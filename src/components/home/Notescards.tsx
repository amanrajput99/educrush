'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Note, notes } from '@/data/Notes'
import { getNotesFromSupabase } from '@/lib/NoteService'

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
const getColors = (subject: string) =>
  SUBJECT_COLORS[subject] ?? { bg: '#1a1a1a', dot: '#c8fa45' }

// ── Note Card ─────────────────────────────────────────────────────────────────
const NoteCard = ({
  note,
  index,
  onSelect,
}: {
  note: Note
  index: number
  onSelect: (n: Note) => void
}) => {
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
      // Fixed height so all cards are equal — subject name ka size card ko affect nahi karega
      className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 text-left shadow-lg cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-[#c8fa45]/40 hover:shadow-[#c8fa45]/5 hover:shadow-xl flex flex-col"
      style={{ height: '280px' }}
    >
      {/* Cursor Glow */}
      <motion.span
        className="pointer-events-none absolute h-[220px] w-[220px] rounded-full bg-gradient-to-r from-emerald-400 via-lime-300 to-cyan-300 blur-2xl"
        animate={{
          top: pos.y - 110,
          left: pos.x - 110,
          opacity: visible ? 0.5 : 0,
          scale: visible ? 1.05 : 0.95,
        }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      />

      <div className="relative z-10 flex flex-col h-full">
        {/* Image / Placeholder */}
        <div
          className="w-full overflow-hidden rounded-t-2xl flex items-center justify-center relative shrink-0"
          style={{ height: '160px', background: colors.bg }}
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end p-3">
                <span className="flex items-center gap-1.5 rounded-lg border border-[#c8fa45]/50 bg-[#c8fa45]/20 px-2.5 py-1.5 text-xs font-semibold text-[#c8fa45] backdrop-blur-sm">
                  View Notes
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                    <path d="M7 17L17 7M17 7H7M17 7v10" stroke="#c8fa45" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </>
          ) : (
            <span className="text-[14px] font-bold text-center px-3" style={{ color: colors.dot }}>
              {note.subject}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4 min-h-0">
          {/* Subject badge — fixed width, truncate long names */}
          <span
            className="inline-block text-[10px] font-bold px-2.5 py-[3px] rounded-full mb-2 shrink-0 w-fit max-w-full truncate"
            style={{
              background: '#c8fa4520',
              color: '#c8fa45',
              border: '1px solid #c8fa4540',
            }}
          >
            {note.subject}
          </span>

          {/* Title — 2 lines max */}
          <p className="text-[13px] text-white font-medium leading-snug line-clamp-2 flex-1">
            {note.title}
          </p>

          {/* Bottom row */}
          <div className="flex items-center justify-between mt-2 shrink-0">
            {note.course && (
              <span className="text-[11px] text-slate-500 truncate max-w-[100px]">{note.course}</span>
            )}
            <span className="flex items-center gap-1 text-[11px] font-semibold text-[#c8fa45] ml-auto whitespace-nowrap">
              View Notes
              <svg width="11" height="11" viewBox="0 0 13 13" fill="none">
                <path d="M2.5 6.5h8M7 3l3.5 3.5L7 10" stroke="#c8fa45" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
    className="group relative overflow-hidden rounded-2xl border border-dashed border-slate-700 bg-[#0d0d0d]/50 flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-[#c8fa45]/50 hover:bg-slate-900/60"
    style={{ height: '280px' }}
  >
    <div className="relative z-10 p-5">
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#c8fa45]/10 text-[#c8fa45] group-hover:bg-[#c8fa45]/20 group-hover:scale-110 transition-all duration-300 mx-auto">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
      <h3 className="text-base font-semibold text-white mb-1">Explore More</h3>
      <p className="text-xs text-slate-500 max-w-[140px] mx-auto leading-relaxed">
        Saare notes dekho — filters ke saath.
      </p>
    </div>
    <div className="absolute inset-0 bg-gradient-to-br from-[#c8fa45]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  </Link>
)

// ── Skeleton ──────────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="rounded-2xl border border-slate-800 bg-slate-950 animate-pulse" style={{ height: '280px' }}>
    <div className="h-[160px] rounded-t-2xl bg-slate-800/60" />
    <div className="p-4 space-y-2.5">
      <div className="h-3 w-16 bg-slate-800 rounded-full" />
      <div className="h-4 w-3/4 bg-slate-800 rounded" />
      <div className="h-4 w-1/2 bg-slate-800/60 rounded" />
    </div>
  </div>
)

// ── Detail Modal ──────────────────────────────────────────────────────────────
const NoteDetailModal = ({ note, onClose }: { note: Note; onClose: () => void }) => {
  const colors = getColors(note.subject)
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.75)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      >
        <motion.div
          className="relative w-[380px] max-w-full rounded-2xl overflow-hidden border border-[#2a2a2a] bg-[#141414]"
          initial={{ scale: 0.93, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.93, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 26 }}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)' }}
          >
            ✕
          </button>

          <div className="w-full h-[180px] flex items-center justify-center" style={{ background: colors.bg }}>
            {note.image
              ? <img src={note.image} alt={note.title} className="w-full h-full object-cover" />
              : <span className="text-[17px] font-bold" style={{ color: colors.dot }}>{note.subject}</span>
            }
          </div>

          <div className="p-5">
            <p className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: colors.dot }}>
              {note.subject}
            </p>
            <h3 className="text-[17px] font-semibold text-white mb-2">{note.title}</h3>
            <p className="text-[13px] text-slate-400 leading-relaxed">{note.description}</p>

            <div className="flex gap-2 mt-5">
              <Link
                href={note.link}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg py-[10px] text-[13px] font-bold bg-[#c8fa45] text-[#111] hover:bg-[#d6ff55] transition-colors"
              >
                View Notes
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M2.5 6.5h8M7 3l3.5 3.5L7 10" stroke="#111" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <button
                onClick={onClose}
                className="w-11 flex items-center justify-center rounded-lg border border-[#2a2a2a] bg-[#1e1e1e] text-slate-500 hover:text-white hover:border-[#444] transition-colors text-base"
              >
                ✕
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
        <div className="py-4 px-4 bg-black flex flex-col justify-center items-center gap-4 mb-6">
          <button className="px-4 h-8 border border-gray-800 text-slate-200 text-xs rounded-lg cursor-default">
            Notes
          </button>
          <h1 className="text-3xl md:text-[40px] font-medium text-gray-100 max-w-lg text-center leading-tight">
            Our latest notes.
          </h1>
          <p className="text-base/7 text-gray-200 max-w-xl text-center">
            Carefully curated notes covering all important topics for your academic success.
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {loading ? (
            // Skeleton — same grid as cards
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {displayedNotes.map((note, i) => (
                <NoteCard key={i} note={note} index={i} onSelect={setSelected} />
              ))}
              {/* Explore More card — always last */}
              {showViewMore && <ExploreMoreCard />}
              {/* Agar limit nahi hai ya sab show ho gaye — tab bhi explore more dikhao */}
              {!showViewMore && !limit && <ExploreMoreCard />}
            </div>
          )}
        </div>
      </section>

      {/* Detail Modal */}
      {selected && <NoteDetailModal note={selected} onClose={() => setSelected(null)} />}

      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-700/40 to-transparent" />
    </>
  )
}

export default NoteCards