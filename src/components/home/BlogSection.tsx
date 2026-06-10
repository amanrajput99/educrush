'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { getLatestBlogs, type Blog } from '@/lib/blogService'

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

function readTime(excerpt: string, content?: string) {
  const text = content || excerpt || ''
  const words = text.trim().split(/\s+/).length
  return `${Math.max(1, Math.ceil(words / 200))} min read`
}

function BlogCard({ blog, index, featured = false }: { blog: Blog; index: number; featured?: boolean }) {
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
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className={`group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 text-left shadow-lg
        transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/60 hover:shadow-emerald-500/10 hover:shadow-xl
        ${featured ? 'md:col-span-2 md:flex md:flex-row' : 'flex flex-col'}`}
    >
      {/* Cursor Glow */}
      <motion.span
        className="pointer-events-none absolute h-[220px] w-[220px] rounded-full bg-gradient-to-r from-emerald-400 via-lime-300 to-cyan-300 blur-2xl z-0"
        animate={{
          top: pos.y - 110,
          left: pos.x - 110,
          opacity: visible ? .5 : 0,
          scale: visible ? 1.05 : 0.95,
        }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      />
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
  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center text-[8px] font-bold text-white">
    {blog.author?.[0]?.toUpperCase() ?? 'E'}
  </div>
  {blog.author}
</div>

      {/* Cover Image */}
      <div className={`relative overflow-hidden shrink-0
        ${featured
          ? 'md:w-[45%] h-52 md:h-auto rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none'
          : 'h-[clamp(180px,50vw,220px)] rounded-t-2xl'}`}
      >
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
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="rgba(52,211,153,0.3)" strokeWidth="1.2">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end p-4">
          <span className="flex items-center gap-2 rounded-lg border border-emerald-400/50 bg-emerald-500/20 px-3 py-2 text-sm font-semibold text-emerald-200 backdrop-blur-sm">
            Read Article
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M7 17L17 7M17 7H7M17 7v10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between p-5 flex-1">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {(blog.tags ?? []).slice(0, 3).map((tag, i) => (
            <span
              key={tag}
              className={`rounded-full border px-3 py-0.5 text-xs transition-colors group-hover:border-emerald-800/50 ${TAG_COLORS[i % TAG_COLORS.length]}`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className={`font-semibold text-white tracking-tight leading-snug group-hover:text-emerald-300 transition-colors duration-200 ${featured ? 'text-xl md:text-2xl mb-3' : 'text-lg mb-2'}`}>
          {blog.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-slate-400 leading-relaxed line-clamp-2 mb-4 flex-1">
          {blog.excerpt}
        </p>

        {/* Author + Meta */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-600 to-cyan-700 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
              {blog.author?.[0]?.toUpperCase() ?? 'E'}
            </div>
            <span className="text-xs text-slate-500">{blog.author}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-600">
            <span>{formatDate(blog.created_at)}</span>
            <span>·</span>
  <span>{readTime(blog.excerpt, blog.content)}</span>
            </div>
        </div>
      </div>
    </motion.a>
  )
}

function ViewAllCard() {
  return (
    <Link
      href="/blogs"
      className="group relative overflow-hidden rounded-2xl border border-dashed border-slate-700 bg-slate-950/50
        flex flex-col items-center justify-center text-center
        transition-all duration-300 hover:border-emerald-500/50 hover:bg-slate-900/60 min-h-[280px]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10 flex flex-col items-center px-6">
        <div className="relative mb-5">
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-all duration-500" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 border border-slate-700 group-hover:border-emerald-500/50 text-emerald-400 transition-all duration-300 group-hover:scale-110">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
          </div>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-emerald-300 transition-colors">
          Read All Articles
        </h3>
        <p className="text-sm text-slate-500 max-w-[180px] leading-relaxed">
          Tips, tutorials, and guides written by students
        </p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-xs text-emerald-400 border border-emerald-800/60 bg-emerald-950/50 px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          Visit Blog
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </span>
      </div>
    </Link>
  )
}

function BlogSkeleton({ featured = false }: { featured?: boolean }) {
  return (
    <div className={`rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden animate-pulse ${featured ? 'md:col-span-2' : ''}`}>
      <div className={`bg-slate-800 ${featured ? 'h-52' : 'h-[200px]'}`} />
      <div className="p-5 space-y-3">
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-slate-800 rounded-full" />
          <div className="h-5 w-12 bg-slate-800 rounded-full" />
        </div>
        <div className="h-5 bg-slate-800 rounded w-3/4" />
        <div className="h-4 bg-slate-800/60 rounded w-full" />
        <div className="h-4 bg-slate-800/60 rounded w-2/3" />
      </div>
    </div>
  )
}

export default function BlogSection() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getLatestBlogs(3).then((data) => {
      setBlogs(data)
      setLoading(false)
    })
  }, [])

  if (!loading && blogs.length === 0) return null

  return (
    <section className="bg-black text-slate-100 px-6 py-12">
      {/* Header — same style as ProjectCards */}
      <div className="text-center mb-12">
        <button className="px-4 h-8 border border-gray-800 text-slate-200 text-xs rounded-lg">
          Blogs
        </button>
        <h1 className="text-[42px] font-medium text-white tracking-tighter mt-1">
          Latest Articles
        </h1>
        <p className="text-base text-slate-400 max-w-md mx-auto mt-2">
          Tips, tutorials, and guides written by students — for students. Always free.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 max-w-7xl mx-auto">
        {loading ? (
          <>
            <BlogSkeleton featured />
            <BlogSkeleton />
            <BlogSkeleton />
            
          </>
        ) : (
          <>
            {blogs.map((blog, i) => (
              <BlogCard key={blog.id ?? blog.slug} blog={blog} index={i} featured={i === 0} />
            ))}
            <ViewAllCard />
          </>
        )}
        
      </div>

      {/* Bottom divider */}
      {/* <div className="mt-16 max-w-7xl mx-auto w-full h-px bg-gradient-to-r from-transparent via-emerald-700/40 to-transparent" /> */}
    </section>
  )
}