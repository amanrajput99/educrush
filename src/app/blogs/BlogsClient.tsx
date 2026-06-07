'use client'

import { useState, useMemo, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Blog } from '@/lib/blogService'

// ── Tag colors — EduCrush green theme ────────────────────────────────────────
const TAG_COLORS = [
  'border-emerald-800/60 text-emerald-400 bg-emerald-950/50',
  'border-slate-700/80 text-slate-400 bg-slate-900',
  'border-cyan-800/60 text-cyan-400 bg-cyan-950/50',
]

function formatDate(dateStr?: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

function readTime(excerpt: string) {
  const words = excerpt?.split(' ').length ?? 0
  return `${Math.max(1, Math.ceil(words / 200))} min read`
}

// ── Blog Card — full ProjectCard treatment ────────────────────────────────────
function BlogCard({ blog, index }: { blog: Blog; index: number }) {
  const [visible, setVisible] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLAnchorElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const bounds = cardRef.current?.getBoundingClientRect()
    if (!bounds) return
    setPos({ x: e.clientX - bounds.left, y: e.clientY - bounds.top })
  }

  return (
    <motion.a
      ref={cardRef}
      href={`/blogs/${blog.slug}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 text-left shadow-lg
        transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/60
        hover:shadow-emerald-500/10 hover:shadow-xl flex flex-col"
    >
      {/* Cursor Glow — exact same as ProjectCard */}
      <motion.span
        className="pointer-events-none absolute h-[220px] w-[220px] rounded-full bg-gradient-to-r from-emerald-400 via-lime-300 to-cyan-300 blur-2xl z-0"
        animate={{
          top: pos.y - 110,
          left: pos.x - 110,
          opacity: visible ? 1 : 0,
          scale: visible ? 1.05 : 0.95,
        }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      />

      {/* Author Glossy Tooltip */}
      <div
        className="pointer-events-none absolute z-20 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-200 whitespace-nowrap"
        style={{
          top: pos.y + 12,
          left: pos.x + 12,
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1)' : 'scale(0.65)',
          transition: 'opacity 0.18s ease, transform 0.18s ease',
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.13)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center text-[8px] font-bold text-white shrink-0">
          {blog.author?.[0]?.toUpperCase() ?? 'E'}
        </div>
        {blog.author}
      </div>

      {/* Cover Image */}
      <div className="relative overflow-hidden h-[clamp(180px,50vw,220px)] rounded-t-2xl shrink-0">
        {blog.cover_image ? (
          <img
            src={blog.cover_image}
            alt={blog.title}
            loading="lazy"
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600'
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-950 via-slate-900 to-black flex items-center justify-center">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="rgba(52,211,153,0.25)" strokeWidth="1.2">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
        )}
        {/* Hover overlay — Read Article button */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end p-4">
          <span className="flex items-center gap-2 rounded-lg border border-emerald-400/50 bg-emerald-500/20 px-3 py-2 text-sm font-semibold text-emerald-200 backdrop-blur-sm">
            Read Article
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M7 17L17 7M17 7H7M17 7v10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="relative z-10 flex flex-col flex-1 p-5">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {(blog.tags ?? []).slice(0, 3).map((tag, i) => (
            <span
              key={tag}
              className={`rounded-full border px-3 py-0.5 text-xs font-medium transition-colors group-hover:border-emerald-800/50 ${TAG_COLORS[i % TAG_COLORS.length]}`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-white tracking-tight leading-snug mb-2 group-hover:text-emerald-300 transition-colors duration-200 line-clamp-2">
          {blog.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-slate-400 leading-relaxed line-clamp-2 mb-4 flex-1">
          {blog.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-600 to-cyan-700 flex items-center justify-center text-[9px] font-bold text-white">
              {blog.author?.[0]?.toUpperCase() ?? 'E'}
            </div>
            <span className="text-xs text-slate-500">{blog.author}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
            <span>{formatDate(blog.created_at)}</span>
            <span>·</span>
            <span>{readTime(blog.excerpt)}</span>
          </div>
        </div>
      </div>
    </motion.a>
  )
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ hasSearch }: { hasSearch: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-full flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-5">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
      </div>
      <p className="text-slate-400 font-medium mb-1">
        {hasSearch ? 'No articles match your search' : 'No articles yet'}
      </p>
      <p className="text-sm text-slate-600">
        {hasSearch ? 'Try different keywords or clear the filter.' : 'Check back soon — more coming.'}
      </p>
    </motion.div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function BlogsClient({ blogs }: { blogs: Blog[] }) {
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const allTags = useMemo(() => {
    const set = new Set<string>()
    blogs.forEach(b => b.tags?.forEach(t => set.add(t)))
    return Array.from(set)
  }, [blogs])

  const filtered = useMemo(() => {
    return blogs.filter(b => {
      const matchSearch = search === '' ||
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.excerpt.toLowerCase().includes(search.toLowerCase())
      const matchTag = !activeTag || b.tags?.includes(activeTag)
      return matchSearch && matchTag
    })
  }, [blogs, search, activeTag])

  return (
    <div className="min-h-screen bg-black text-white">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="relative pt-32 pb-16 px-4 text-center overflow-hidden">
        {/* Subtle bg glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-2xl mx-auto">
          {/* Label pill — same as ProjectCards */}
          <div className="inline-flex mb-6">
            <span className="px-4 h-8 flex items-center border border-gray-800 text-slate-400 text-xs rounded-lg">
              Blog
            </span>
          </div>

          <h1 className="text-[42px] md:text-5xl font-medium text-white tracking-tighter leading-tight mb-4">
            Tips, Tutorials &<br />
            <span className="text-slate-600">Student Stories</span>
          </h1>

          <p className="text-base text-slate-400 max-w-md mx-auto leading-relaxed mb-10">
            Guides on coding, exam prep, web dev, and college life — written by students who've been there.
          </p>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-6 text-sm text-slate-600 mb-10">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              {blogs.length} Article{blogs.length !== 1 ? 's' : ''}
            </span>
            <span className="w-px h-4 bg-slate-800" />
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 inline-block" />
              {allTags.length} Topics
            </span>
            <span className="w-px h-4 bg-slate-800" />
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-lime-500 inline-block" />
              Always Free
            </span>
          </div>

          {/* Search bar */}
          <div className="relative max-w-lg mx-auto">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-600
                focus:outline-none focus:border-emerald-500/50 focus:bg-slate-900 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Tag filters ──────────────────────────────────────────────────── */}
      {/* {allTags.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 mb-10">
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setActiveTag(null)}
              className={`text-xs px-4 py-1.5 rounded-full border transition-all duration-150 font-medium
                ${!activeTag
                  ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60'
                  : 'bg-slate-900 text-slate-500 border-slate-800 hover:border-slate-700 hover:text-slate-400'}`}
            >
              All
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`text-xs px-4 py-1.5 rounded-full border transition-all duration-150 font-medium
                  ${activeTag === tag
                    ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60'
                    : 'bg-slate-900 text-slate-500 border-slate-800 hover:border-slate-700 hover:text-slate-400'}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )} */}

      {/* ── Divider ──────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 mb-10">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-emerald-700/40 to-transparent" />
      </div>

      {/* ── Grid ─────────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 pb-24">

        {/* Results count */}
        {(search || activeTag) && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-slate-600 mb-6"
          >
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            {search && <span> for "<span className="text-slate-400">{search}</span>"</span>}
            {activeTag && <span> in <span className="text-emerald-400">{activeTag}</span></span>}
          </motion.p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.length === 0
            ? <EmptyState hasSearch={!!(search || activeTag)} />
            : filtered.map((blog, i) => (
                <BlogCard key={blog.id ?? blog.slug} blog={blog} index={i} />
              ))
          }
        </div>
      </div>
    </div>
  )
}