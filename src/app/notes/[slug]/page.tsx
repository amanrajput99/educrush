'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { notes, Note } from '@/data/Notes'
import { getNotesFromSupabase } from '@/lib/NoteService'

// ── Subject colors ────────────────────────────────────────────────────────────
const SUBJECT_COLORS: Record<string, { bg: string; dot: string; glow: string; label: string }> = {
  Physics:            { bg: '#1a1f2e', dot: '#6fa3ef', glow: '#3b82f6', label: '⚡ Physics' },
  Maths:              { bg: '#1f1a2e', dot: '#a57ef5', glow: '#8b5cf6', label: '∑ Maths' },
  Biology:            { bg: '#1a2e1e', dot: '#5ecf7a', glow: '#22c55e', label: '🧬 Biology' },
  History:            { bg: '#2e1f1a', dot: '#e5845a', glow: '#f97316', label: '📜 History' },
  Chemistry:          { bg: '#2e2a1a', dot: '#f5c842', glow: '#eab308', label: '⚗️ Chemistry' },
  English:            { bg: '#1e1e2e', dot: '#c084fc', glow: '#a855f7', label: '✍️ English' },
  'Computer Science': { bg: '#1a2a2e', dot: '#38bdf8', glow: '#0ea5e9', label: '💻 CS' },
  Geography:          { bg: '#1e2a1a', dot: '#86efac', glow: '#22c55e', label: '🌍 Geography' },
  Drawing:            { bg: '#2a1e2e', dot: '#f0abfc', glow: '#e879f9', label: '✏️ Drawing' },
  Management:         { bg: '#2e1e1e', dot: '#fca5a5', glow: '#f87171', label: '📊 Management' },
}

const getSubjectStyle = (subject: string) =>
  SUBJECT_COLORS[subject] ?? { bg: '#1a1a1a', dot: '#c8fa45', glow: '#c8fa45', label: subject }

const getSlug = (link: string) => link.split('/').pop() ?? ''

function getDriveEmbedUrl(driveLink: string): string | null {
  const fileMatch = driveLink.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
  const openMatch = driveLink.match(/[?&]id=([a-zA-Z0-9_-]+)/)
  const id = fileMatch?.[1] ?? openMatch?.[1]
  if (!id) return null
  return `https://drive.google.com/file/d/${id}/preview`
}

// ── AdSense Slot ──────────────────────────────────────────────────────────────
// Replace data-ad-client and data-ad-slot with your actual AdSense values
const AdSlot = ({ slot, format = 'auto', className = '' }: { slot: string; format?: string; className?: string }) => {
  const adRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        ;((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
      }
    } catch {}
  }, [])

  return (
    <div
      ref={adRef}
      className={`overflow-hidden rounded-xl border border-slate-800/50 bg-[#0a0a0b] ${className}`}
    >
      {/* AdSense label — required by Google policy */}
      <p className="text-[9px] text-slate-700 uppercase tracking-widest text-center pt-2 px-2">
        Advertisement
      </p>
      <ins
        className="adsbygoogle block"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"   // 🔑 Replace with your publisher ID
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}

// ── Sticky Progress Bar ───────────────────────────────────────────────────────
const ReadingProgress = ({ color }: { color: string }) => {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const handler = () => {
      const el = document.documentElement
      const scrolled = el.scrollTop
      const total = el.scrollHeight - el.clientHeight
      setProgress(total > 0 ? (scrolled / total) * 100 : 0)
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-slate-900">
      <motion.div
        className="h-full rounded-full"
        style={{ background: color, width: `${progress}%` }}
        transition={{ ease: 'linear', duration: 0.1 }}
      />
    </div>
  )
}

// ── Book / PDF Viewer ─────────────────────────────────────────────────────────
const BookViewer = ({ note }: { note: Note }) => {
  const embedUrl = getDriveEmbedUrl(note.driveLink ?? note.link)
  const [loaded, setLoaded] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const viewerRef = useRef<HTMLDivElement>(null)
  const s = getSubjectStyle(note.subject)

  useEffect(() => {
    const handler = () => setFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  if (!embedUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] rounded-2xl border border-dashed border-slate-800 bg-[#0c0c0e] text-center px-6">
        <div
          className="w-16 h-20 rounded-r-xl border-2 flex items-center justify-center mb-5 relative"
          style={{ borderColor: s.dot + '40', background: s.bg }}
        >
          <div className="space-y-1.5 px-2 w-full">
            {[80, 60, 75, 50].map((w, i) => (
              <div key={i} className="h-1.5 rounded-full" style={{ background: s.dot + '30', width: `${w}%` }} />
            ))}
          </div>
          <div className="absolute left-0 top-0 w-2 h-full rounded-l" style={{ background: s.dot + '60' }} />
        </div>
        <p className="text-white font-semibold mb-1">PDF not linked yet</p>
        <p className="text-slate-500 text-sm mb-4">Drive link hasn't been added for this note.</p>
        <a
          href={note.link}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
          style={{ background: '#c8fa4518', border: '1px solid #c8fa4535', color: '#c8fa45' }}
        >
          Open Notes →
        </a>
      </div>
    )
  }

  return (
    <motion.div
      ref={viewerRef}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative rounded-2xl overflow-hidden border border-slate-800"
      style={{ boxShadow: `0 8px 60px ${s.glow}12` }}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0d0e0e] border-b border-slate-800/70">
        <div className="flex items-center gap-3">
          {/* Traffic lights */}
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
          <div className="w-px h-4 bg-slate-700" />
          <div
            className="px-2 py-0.5 rounded text-[10px] font-black"
            style={{ background: s.bg, color: s.dot }}
          >
            PDF
          </div>
          <span className="text-slate-300 text-[13px] font-medium truncate max-w-[200px] sm:max-w-sm">
            {note.title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (!fullscreen) viewerRef.current?.requestFullscreen?.()
              else document.exitFullscreen?.()
            }}
            className="w-8 h-8 rounded-lg border border-slate-700 bg-slate-900/80 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 transition-all"
          >
            {fullscreen ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
            )}
          </button>
          <a
            href={note.driveLink ?? note.link}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{ background: '#c8fa4512', border: '1px solid #c8fa4530', color: '#c8fa45' }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 0 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            Open in Drive
          </a>
        </div>
      </div>

      {/* Iframe */}
      <div className="relative" style={{ paddingBottom: '72%', minHeight: '480px' }}>
        <AnimatePresence>
          {!loaded && (
            <motion.div
              key="loader"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-[#08090a] z-10"
            >
              <div className="relative mb-6">
                {/* Animated book */}
                <div className="flex gap-0.5">
                  {/* Spine */}
                  <div className="w-3 rounded-l-sm" style={{ background: s.dot + '80', height: '80px' }} />
                  {/* Pages */}
                  <div
                    className="w-16 rounded-r-xl border-2 flex flex-col justify-center gap-2 px-2.5 py-3"
                    style={{ borderColor: s.dot + '40', background: s.bg, height: '80px' }}
                  >
                    {[80, 60, 75, 50].map((w, i) => (
                      <motion.div
                        key={i}
                        className="h-1.5 rounded-full"
                        style={{ background: s.dot + '50', width: `${w}%` }}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
                      />
                    ))}
                  </div>
                </div>
                <motion.div
                  className="absolute -inset-6 rounded-full blur-2xl"
                  style={{ background: s.glow }}
                  animate={{ opacity: [0.08, 0.18, 0.08] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <p className="text-slate-300 text-sm font-medium">Loading your notes...</p>
              <p className="text-slate-600 text-xs mt-1">{note.subject} • {note.course}</p>
            </motion.div>
          )}
        </AnimatePresence>
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full"
          style={{ border: 'none' }}
          allow="autoplay"
          onLoad={() => setLoaded(true)}
          title={note.title}
        />
      </div>

      {/* Bottom status bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#0a0b0b] border-t border-slate-800/50">
        <p className="text-slate-600 text-[11px] flex items-center gap-1.5">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
          Scroll inside to navigate pages
        </p>
        <div className="flex items-center gap-1.5">
          <motion.span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: loaded ? '#4ade80' : '#475569' }}
            animate={loaded ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 1, repeat: loaded ? 0 : Infinity }}
          />
          <span className="text-[11px]" style={{ color: loaded ? '#4ade80' : '#475569' }}>
            {loaded ? 'Ready' : 'Loading...'}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

// ── Stat Pill ─────────────────────────────────────────────────────────────────
const StatPill = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-slate-800 bg-[#0c0c0e]">
    <div className="text-slate-500">{icon}</div>
    <div>
      <p className="text-[10px] text-slate-600 uppercase tracking-wider">{label}</p>
      <p className="text-white text-[13px] font-semibold leading-none mt-0.5">{value}</p>
    </div>
  </div>
)

// ── Related Note Card ─────────────────────────────────────────────────────────
const RelatedCard = ({ note, index }: { note: Note; index: number }) => {
  const s = getSubjectStyle(note.subject)
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
    >
      <Link
        href={note.link}
        className="group flex items-start gap-3 p-3.5 rounded-xl border border-slate-800 bg-[#0c0c0e] hover:border-slate-700 hover:bg-[#111213] transition-all duration-200"
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-[10px] font-black"
          style={{ background: s.bg, color: s.dot }}
        >
          {note.subject.slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-white text-[13px] font-medium leading-snug line-clamp-2 group-hover:text-[#c8fa45] transition-colors">
            {note.title}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-slate-600 text-[10px]">{note.subject}</span>
            {note.year && (
              <>
                <span className="text-slate-800">·</span>
                <span className="text-slate-600 text-[10px]">{note.year}</span>
              </>
            )}
          </div>
        </div>
        <svg
          className="text-slate-700 group-hover:text-[#c8fa45] transition-colors shrink-0 mt-1"
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </Link>
    </motion.div>
  )
}

// ── Tips/Info Box ─────────────────────────────────────────────────────────────
const TipBox = ({ subject }: { subject: string }) => {
  const tips: Record<string, string[]> = {
    Maths: ['Practice problems daily — maths sirf padhne se nahi aata.', 'Formulas yaad karne se pehle unka proof samjho.', 'Previous year questions zaroor solve karo.'],
    Physics: ['Diagrams bana ke concepts samjho.', 'Units aur dimensions pe dhyan do.', 'Numerical practice ke bina theory adhuri hai.'],
    'Computer Science': ['Code likhte waqt comments add karo.', 'Theory ke saath practical bhi karo.', 'Algorithms visualize karo — pen-paper se.'],
    Chemistry: ['Reactions ko groups mein yaad karo.', 'Periodic table ke trends samjho, ratto mat.', 'Lab practical ke notes alag rakho.'],
    Biology: ['Diagrams label karna practice karo.', 'NCERT se ek baar bhi matt hatna.', 'Scientific names ko context mein yaad karo.'],
  }
  const list = tips[subject] ?? ['Regularly revise karo.', 'Short notes banao.', 'Group study try karo.']
  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0c0c0e] overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-800/60 flex items-center gap-2">
        <span className="text-base">💡</span>
        <span className="text-xs font-semibold text-slate-300">Study Tips</span>
      </div>
      <ul className="p-4 space-y-3">
        {list.map((tip, i) => (
          <li key={i} className="flex items-start gap-2.5 text-[13px] text-slate-400 leading-relaxed">
            <span className="text-[#c8fa45] shrink-0 mt-0.5">→</span>
            {tip}
          </li>
        ))}
      </ul>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function NoteDetailPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [noteList, setNoteList] = useState<Note[]>(notes)
  const [loading, setLoading] = useState(true)
  const [copyDone, setCopyDone] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getNotesFromSupabase()
        if (data && data.length > 0) setNoteList(data)
      } catch { }
      finally { setLoading(false) }
    }
    fetchData()
  }, [])

  const note = noteList.find((n) => getSlug(n.link) === slug)
  const s = note ? getSubjectStyle(note.subject) : { bg: '#1a1a1a', dot: '#c8fa45', glow: '#c8fa45', label: '' }

  const related = noteList
    .filter((n) => getSlug(n.link) !== slug && (n.course === note?.course || n.subject === note?.subject))
    .slice(0, 5)

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopyDone(true)
    setTimeout(() => setCopyDone(false), 2000)
  }

  // ── Loading ──
  if (loading) {
    return (
      <main className="min-h-screen bg-black pt-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-4 animate-pulse">
          <div className="h-5 w-28 bg-slate-800 rounded" />
          <div className="h-10 w-2/3 bg-slate-800 rounded-xl" />
          <div className="h-4 w-1/2 bg-slate-800/60 rounded" />
          <div className="h-[500px] bg-slate-900 rounded-2xl mt-6" />
        </div>
      </main>
    )
  }

  // ── Not Found ──
  if (!note) {
    return (
      <main className="min-h-screen bg-black pt-24 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">📭</div>
          <h2 className="text-white text-xl font-semibold mb-2">Note Not Found</h2>
          <p className="text-slate-500 text-sm mb-6">Yeh note exist nahi karta ya delete ho gaya.</p>
          <Link href="/notes" className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ background: '#c8fa4518', border: '1px solid #c8fa4535', color: '#c8fa45' }}>
            ← Back to Notes
          </Link>
        </div>
      </main>
    )
  }

  return (
    <>
      <ReadingProgress color={s.dot} />

      <main className="min-h-screen bg-black text-white pt-20 pb-24">
        {/* Background glow */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div
            className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-[140px]"
            style={{ background: s.glow, opacity: 0.05 }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">

          {/* ── Breadcrumb ── */}
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-xs text-slate-600 mb-8 flex-wrap"
          >
            <Link href="/" className="hover:text-slate-400 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/notes" className="hover:text-slate-400 transition-colors">Notes</Link>
            {note.course && (
              <>
                <span>/</span>
                <Link href={`/notes?course=${note.course}`} className="hover:text-slate-400 transition-colors">
                  {note.course}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-slate-400 truncate max-w-[200px]">{note.title}</span>
          </motion.nav>

          {/* ── Main Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">

            {/* ═══ LEFT COLUMN ═══ */}
            <div className="min-w-0">

              {/* ── Header ── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="mb-7"
              >
                {/* Tag row */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold"
                    style={{ background: s.bg, color: s.dot, border: `1px solid ${s.dot}30` }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: s.dot }} />
                    {note.subject}
                  </span>
                  {note.course && (
                    <span className="px-3 py-1 rounded-full border border-slate-700/60 bg-slate-900/60 text-slate-400 text-[11px]">
                      {note.course}
                    </span>
                  )}
                  {note.year && (
                    <span className="px-3 py-1 rounded-full border border-slate-700/60 bg-slate-900/60 text-slate-400 text-[11px]">
                      {note.year}
                    </span>
                  )}
                  {note.semester && (
                    <span className="px-3 py-1 rounded-full border border-slate-700/60 bg-slate-900/60 text-slate-400 text-[11px]">
                      {note.semester}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-[32px] sm:text-[42px] font-semibold text-white tracking-tighter leading-[1.1] mb-3">
                  {note.title}
                </h1>

                {/* Description */}
                <p className="text-slate-400 text-[15px] leading-relaxed max-w-xl mb-5">
                  {note.description}
                </p>

                {/* Stats row */}
                <div className="flex flex-wrap gap-2.5 mb-5">
                  <StatPill
                    icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
                    label="Format" value="PDF Notes"
                  />
                  <StatPill
                    icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>}
                    label="Course" value={note.course ?? 'General'}
                  />
                  {note.year && (
                    <StatPill
                      icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
                      label="Year" value={note.year}
                    />
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-2">
                  <a
                    href={note.driveLink ?? note.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                    style={{ background: '#c8fa45', color: '#0a0a0a' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </a>
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white transition-all"
                  >
                    {copyDone ? (
                      <>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>
                        <span className="text-green-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                        Share
                      </>
                    )}
                  </button>
                </div>

                {/* Divider */}
                <div className="mt-6 h-px" style={{ background: `linear-gradient(to right, ${s.dot}25, transparent)` }} />
              </motion.div>

              {/* ── AdSense — Top (before viewer) ── */}
              {/* <AdSlot slot="1234567890" className="mb-5" /> */}
              {/* 👆 Uncomment & replace slot ID when AdSense is approved */}

              {/* ── PDF Viewer ── */}
              <BookViewer note={note} />

              {/* ── AdSense — Middle (after viewer) ── */}
              {/* <AdSlot slot="0987654321" format="rectangle" className="mt-6" /> */}

              {/* ── What's in this note ── */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8 rounded-2xl border border-slate-800 bg-[#0c0c0e] overflow-hidden"
              >
                <div className="px-5 py-4 border-b border-slate-800/60 flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c8fa45" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                  <span className="text-sm font-semibold text-white">What's covered in these notes</span>
                </div>
                <div className="p-5">
                  <p className="text-slate-400 text-[14px] leading-relaxed mb-4">
                    {note.description}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      'Clear concept explanations',
                      'Exam-focused important topics',
                      'Easy to understand language',
                      'Diagrams & examples included',
                      'Previous year question hints',
                      'Concise revision-ready format',
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-[13px] text-slate-400">
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: s.dot }} />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* ── AdSense — Bottom ── */}
              {/* <AdSlot slot="1122334455" className="mt-6" /> */}

            </div>

            {/* ═══ RIGHT SIDEBAR ═══ */}
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="space-y-5 lg:sticky lg:top-24 lg:self-start"
            >

              {/* Note Info Card */}
              <div
                className="rounded-2xl border border-slate-800 bg-[#0c0c0e] overflow-hidden"
                style={{ boxShadow: `0 0 40px ${s.glow}08` }}
              >
                <div className="px-4 py-3 border-b border-slate-800/60 flex items-center gap-2"
                  style={{ background: s.bg + '50' }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: s.dot }} />
                  <span className="text-xs font-semibold text-slate-200">Note Details</span>
                </div>
                <div className="p-4 divide-y divide-slate-800/60">
                  {[
                    { label: 'Subject', value: note.subject },
                    { label: 'Course', value: note.course ?? '—' },
                    { label: 'Year', value: note.year ?? '—' },
                    { label: 'Semester', value: note.semester ?? '—' },
                    { label: 'Format', value: 'PDF' },
                    { label: 'Language', value: 'Hindi + English' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                      <span className="text-slate-600 text-xs">{label}</span>
                      <span className="text-slate-200 text-xs font-medium">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="px-4 pb-4 space-y-2">
                  <a
                    href={note.driveLink ?? note.link}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all"
                    style={{ background: '#c8fa45', color: '#0a0a0a' }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </a>
                  <a
                    href={note.driveLink ?? note.link}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold border border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white transition-all"
                  >
                    Open in Drive
                  </a>
                </div>
              </div>

              {/* AdSense Sidebar */}
              {/* <AdSlot slot="5566778899" format="rectangle" className="min-h-[250px]" /> */}

              {/* Study Tips */}
              <TipBox subject={note.subject} />

              {/* Related Notes */}
              {related.length > 0 && (
                <div className="rounded-2xl border border-slate-800 bg-[#0c0c0e] overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-800/60 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c8fa45" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                      </svg>
                      <span className="text-xs font-semibold text-slate-300">Related Notes</span>
                    </div>
                    <span className="text-[10px] text-slate-600">{related.length}</span>
                  </div>
                  <div className="p-3 space-y-2">
                    {related.map((n, i) => <RelatedCard key={i} note={n} index={i} />)}
                  </div>
                  <div className="px-3 pb-3">
                    <Link
                      href="/notes"
                      className="block text-center py-2 rounded-xl border border-slate-800 text-[12px] text-slate-500 hover:text-[#c8fa45] hover:border-slate-700 transition-all"
                    >
                      View all notes →
                    </Link>
                  </div>
                </div>
              )}
            </motion.aside>
          </div>

          {/* Bottom glow divider */}
          <div className="mt-16 h-px" style={{ background: `linear-gradient(to right, transparent, ${s.dot}25, transparent)` }} />
        </div>
      </main>
    </>
  )
}