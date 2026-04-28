'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Note, notes } from '@/data/Notes'
import { getNotesFromSupabase } from '@/lib/NoteService'

// ── Subject colors ───────────────────────────────────────────────────────────
const SUBJECT_COLORS: Record<string, { bg: string; dot: string }> = {
  Physics:  { bg: '#1a1f2e', dot: '#6fa3ef' },
  Maths:    { bg: '#1f1a2e', dot: '#a57ef5' },
  Biology:  { bg: '#1a2e1e', dot: '#5ecf7a' },
  History:  { bg: '#2e1f1a', dot: '#e5845a' },
  Chemistry:{ bg: '#2e2a1a', dot: '#f5c842' },
  English:  { bg: '#1e1e2e', dot: '#c084fc' },
}

// ── Detail Modal ─────────────────────────────────────────────────────────────
const NoteDetailModal = ({ note, onClose }: { note: Note; onClose: () => void }) => {
  const colors = SUBJECT_COLORS[note.subject] ?? { bg: '#1a1a1a', dot: '#888' }
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
          {/* X button top-right */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)' }}
          >
            ✕
          </button>

          {/* Image / placeholder */}
          <div className="w-full h-[180px] flex items-center justify-center" style={{ background: colors.bg }}>
            {note.image
              ? <img src={note.image} alt={note.title} className="w-full h-full object-cover" />
              : <span className="text-[17px] font-bold" style={{ color: colors.dot }}>{note.subject}</span>
            }
          </div>

          {/* Body */}
          <div className="p-5">
            <p className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: colors.dot }}>{note.subject}</p>
            <h3 className="text-[17px] font-semibold text-white mb-2">{note.title}</h3>
            <p className="text-[13px] text-slate-400 leading-relaxed">{note.description}</p>

            {/* Buttons */}
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

// ── Single Note Card ─────────────────────────────────────────────────────────
const NoteCard = ({ note, onSelect }: { note: Note; onSelect: (n: Note) => void }) => {
  const [visible, setVisible] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)
  const colors = SUBJECT_COLORS[note.subject] ?? { bg: '#1a1a1a', dot: '#888' }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const bounds = cardRef.current?.getBoundingClientRect()
    if (!bounds) return
    setPos({ x: e.clientX - bounds.left, y: e.clientY - bounds.top })
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onClick={() => onSelect(note)}
      className="group relative overflow-hidden rounded-xl border border-slate-800 bg-[#141414] p-[10px] text-left shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-[#3a3a3a] cursor-pointer"
    >
      {/* ── Cursor Glow — subtle, barely visible ──
      <motion.span
        className="pointer-events-none absolute h-[220px] w-[220px] rounded-full bg-gradient-to-r from-lime-400 via-emerald-300 to-cyan-300 blur-2xl"
        animate={{
          top: pos.y - 110,
          left: pos.x - 110,
          opacity: visible ? 0.07 : 0,
          scale: visible ? 1.05 : 0.95,
        }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      /> */}

 {/* Cursor Glow */}
      <motion.span
        className="pointer-events-none absolute h-[220px] w-[220px] rounded-full bg-gradient-to-r from-emerald-400 via-lime-300 to-cyan-300 blur-2xl"
        animate={{
          top: pos.y - 110,
          left: pos.x - 110,
          opacity: visible ? .5 : 0,
          scale: visible ? 1.05 : 0.95,
        }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      />


      <div className="relative z-10 flex flex-col h-full">
        {/* ── Top row: badge + bookmark ── */}
        <div className="flex items-center justify-between mb-[10px]">
          <span className="bg-[#c8fa45] text-[#111] text-[11px] font-bold px-[10px] py-[3px] rounded-full truncate max-w-[110px]">
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

        {/* ── Image / Colored placeholder ── */}
        <div
          className="w-full h-[110px] rounded-[10px] overflow-hidden flex items-center justify-center mb-[10px] relative"
          style={{ background: colors.bg }}
        >
          {note.image ? (
            <>
              <img
                src={note.image}
                alt={note.title}
                loading="lazy"
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity group-hover:opacity-100 flex items-end p-2">
                <span className="flex items-center gap-1 rounded-md border border-[#c8fa45]/50 bg-[#c8fa45]/20 px-2 py-1 text-xs font-semibold text-[#c8fa45] backdrop-blur-sm">
                  View Notes
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                    <path d="M7 17L17 7M17 7H7M17 7v10" stroke="#c8fa45" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </>
          ) : (
            <span className="text-[13px] font-bold text-center px-2 leading-snug" style={{ color: colors.dot }}>
              {note.subject}
            </span>
          )}
        </div>

        {/* ── Title ── */}
        <p className="text-[13px] text-slate-400 mb-2 px-[2px] leading-snug min-h-[36px]">
          {note.title}
        </p>

        {/* ── Bottom: subject + View Notes → ── */}
        <div className="flex items-center justify-between px-[2px] mt-auto">
          <span className="text-[13px] font-semibold text-white">{note.subject}</span>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-[#c8fa45] whitespace-nowrap">
            View Notes
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M2.5 6.5h8M7 3l3.5 3.5L7 10" stroke="#c8fa45" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Explore More Card (same as ViewMoreCard) ─────────────────────────────────
const ExploreMoreCard = () => (
  <Link
    href="/notes"
    className="group relative overflow-hidden rounded-xl border border-dashed border-slate-700 bg-[#0d0d0d]/50 p-5 flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-[#c8fa45] hover:bg-slate-900/50 min-h-[200px]"
  >
    <div className="relative z-10">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#c8fa45]/10 text-[#c8fa45] group-hover:bg-[#c8fa45]/20 group-hover:scale-110 transition-all mx-auto">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">Explore More</h3>
      <p className="text-sm text-slate-400">Saare notes dekho aur padhna shuru karo.</p>
    </div>
    <div className="absolute inset-0 bg-gradient-to-br from-[#c8fa45]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
  </Link>
)

// ── Main Component ────────────────────────────────────────────────────────────
const NoteCards = ({ limit }: { limit?: number }) => {
  const [noteList, setNoteList] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Note | null>(null)

  useEffect(() => {
    async function fetchNotes() {
      try {
        const data = await getNotesFromSupabase()
        if (data && data.length > 0) {
          setNoteList(data)
        } else {
          setNoteList(notes)
        }
      } catch {
        setNoteList(notes)
      } finally {
        setLoading(false)
      }
    }
    fetchNotes()
  }, [])

  const displayedNotes = limit ? noteList.slice(0, limit) : noteList
  const mobileNotes = noteList.slice(0, 7)
  const showViewMore = limit ? noteList.length > limit : false

  if (loading) {
    return (
      <section className="bg-[#0a0a0a] text-slate-100 py-8 px-6">
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="min-w-[200px] h-64 bg-slate-900 animate-pulse rounded-xl flex-shrink-0" />
          ))}
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="bg-black text-slate-100 py-8 ">
        {/* Header */}
        <div className="py-4 px-4 bg-black flex flex-col justify-center items-center gap-6">
          <button className='px-4 h-8 border border-gray-800 text-slate-200 text-xs rounded-lg'>Notes</button>
                <h1 className="text-3xl md:text-[40px]/12 font-medium text-gray-100 max-w-lg text-center leading-tight">Our latest notes.</h1>
                <p className='text-base/7 text-gray-200 max-w-xl text-center'>Carefully curated notes covering all important topics for your academic success.</p>
        </div>

        {/* ── DESKTOP: horizontal scroll, no scrollbar ── */}
        <div
          className="hidden md:flex gap-[14px] overflow-x-auto px-5 pb-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style>{`.notes-scroll::-webkit-scrollbar { display: none; }`}</style>
          {displayedNotes.map((note, i) => (
            <div key={i} className="flex-shrink-0 w-[200px]">
              <NoteCard note={note} onSelect={setSelected} />
            </div>
          ))}
          {showViewMore && (
            <div className="flex-shrink-0 w-[200px]">
              <ExploreMoreCard />
            </div>
          )}
        </div>

        {/* ── MOBILE: 2-col grid, 7 notes + explore card ── */}
        <div className="grid grid-cols-2 gap-3 px-4 md:hidden">
          {mobileNotes.map((note, i) => (
            <NoteCard key={i} note={note} onSelect={setSelected} />
          ))}
          <ExploreMoreCard />
        </div>
      </section>

      {/* Detail Modal */}
      {selected && <NoteDetailModal note={selected} onClose={() => setSelected(null)} />}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-30 my-6" />
    </>
  )
}

export default NoteCards