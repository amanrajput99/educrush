'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { getBlogBySlug, getLatestBlogs, type Blog } from '@/lib/blogService'
import { notFound } from 'next/navigation'

// ── Utils ─────────────────────────────────────────────────────────────────────
function formatDate(d?: string) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}
function readTime(content?: string, excerpt?: string) {
  const words = ((content ?? '') + (excerpt ?? '')).split(' ').length
  return `${Math.max(1, Math.ceil(words / 200))} min read`
}
const TAG_COLORS = [
  'border-emerald-800/60 text-emerald-400 bg-emerald-950/50',
  'border-slate-700/80 text-slate-400 bg-slate-900',
  'border-cyan-800/60 text-cyan-400 bg-cyan-950/50',
  'border-lime-800/60 text-lime-400 bg-lime-950/50',
]

// ── Extract H2 headings for TOC ───────────────────────────────────────────────
function extractHeadings(html: string) {
  const matches = [...html.matchAll(/<h2[^>]*>(.*?)<\/h2>/gi)]
  return matches.map((m, i) => ({
    id: `heading-${i}`,
    text: m[1].replace(/<[^>]+>/g, ''),
  }))
}

// ── Inject IDs into H2 tags ───────────────────────────────────────────────────
function injectHeadingIds(html: string) {
  let i = 0
  return html.replace(/<h2([^>]*)>/gi, () => `<h2$1 id="heading-${i++}">`)
}

// ── Reading Progress Bar ──────────────────────────────────────────────────────
function ProgressBar() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100
      setProgress(Math.min(100, Math.max(0, pct)))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-emerald-500 via-lime-400 to-cyan-400 transition-all duration-100"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}


// ── Table of Contents — always inline, collapsible ───────────────────────────
function TableOfContents({ headings }: { headings: { id: string; text: string }[] }) {
  const [active, setActive] = useState('')
  const [open, setOpen] = useState(true)

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => { entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id) }) },
      { rootMargin: '-20% 0% -70% 0%' }
    )
    headings.forEach(h => { const el = document.getElementById(h.id); if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [headings])

  if (headings.length < 2) return null

  return (
    <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-3.5"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-slate-300">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
            <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
          Table of Contents
          <span className="text-[11px] text-slate-600 font-normal">{headings.length} sections</span>
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          className={`transition-transform duration-200 text-slate-500 ${open ? 'rotate-180' : ''}`}>
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>

      {open && (
        <div className="border-t border-slate-800 px-4 py-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
            {headings.map((h, i) => (
              <button
                key={h.id}
                onClick={() => document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className={`flex items-center gap-2.5 text-left px-3 py-2 rounded-xl transition-all duration-150 text-sm ${
                  active === h.id
                    ? 'bg-emerald-950/60 border border-emerald-800/40 text-emerald-300'
                    : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <span className={`text-[10px] font-bold font-mono shrink-0 ${active === h.id ? 'text-emerald-500' : 'text-slate-700'}`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="truncate">{h.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Share Buttons ─────────────────────────────────────────────────────────────
function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false)
  const url = `https://educrush.in/blogs/${slug}`
  const text = encodeURIComponent(`${title} — EduCrush`)
  const encodedUrl = encodeURIComponent(url)

  const copyLink = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shares = [
    {
      label: 'WhatsApp',
      color: 'hover:bg-green-950/60 hover:border-green-800/50 hover:text-green-400',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.098.546 4.07 1.5 5.785L0 24l6.385-1.673A11.952 11.952 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.848 0-3.574-.5-5.063-1.374L3 21.5l.91-3.857A9.956 9.956 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
        </svg>
      ),
      href: `https://wa.me/?text=${text}%20${encodedUrl}`,
    },
    {
      label: 'Twitter/X',
      color: 'hover:bg-slate-800 hover:border-slate-600 hover:text-white',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.713 5.897zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      href: `https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`,
    },
    {
      label: 'LinkedIn',
      color: 'hover:bg-blue-950/60 hover:border-blue-800/50 hover:text-blue-400',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
  ]

  return (
    <div className="my-10 p-5 rounded-2xl border border-slate-800 bg-slate-950/60">
      <p className="text-xs text-slate-500 uppercase tracking-widest mb-4 font-medium">Share this article</p>
      <div className="flex flex-wrap gap-2">
        {shares.map(s => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noreferrer"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 text-sm font-medium transition-all ${s.color}`}
          >
            {s.icon} {s.label}
          </a>
        ))}
        <button
          onClick={copyLink}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
            copied
              ? 'border-emerald-700/60 bg-emerald-950/60 text-emerald-400'
              : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-600 hover:text-white'
          }`}
        >
          {copied ? (
            <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Copied!</>
          ) : (
            <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy Link</>
          )}
        </button>
      </div>
    </div>
  )
}

// ── AI Summary ────────────────────────────────────────────────────────────────

// ── Related Articles ──────────────────────────────────────────────────────────
function RelatedArticles({ currentSlug, tags }: { currentSlug: string; tags: string[] }) {
  const [related, setRelated] = useState<Blog[]>([])

  useEffect(() => {
    getLatestBlogs(10).then(all => {
      const filtered = all
        .filter(b => b.slug !== currentSlug && b.tags?.some(t => tags.includes(t)))
        .slice(0, 3)
      setRelated(filtered.length >= 1 ? filtered : all.filter(b => b.slug !== currentSlug).slice(0, 3))
    })
  }, [currentSlug, tags])

  if (related.length === 0) return null

  return (
    <div className="mt-12 mb-6">
      <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent mb-10" />
      <p className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-6">Related Articles</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {related.map(blog => (
          <Link
            key={blog.slug}
            href={`/blogs/${blog.slug}`}
            className="group flex flex-col rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden hover:border-emerald-700/50 transition-all hover:-translate-y-0.5"
          >
            <div className="h-28 overflow-hidden bg-slate-900 shrink-0">
              {blog.cover_image ? (
                <img src={blog.cover_image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-emerald-950 to-slate-900" />
              )}
            </div>
            <div className="p-3 flex-1">
              <p className="text-xs font-medium text-white line-clamp-2 leading-snug group-hover:text-emerald-300 transition-colors">
                {blog.title}
              </p>
              <p className="text-[11px] text-slate-600 mt-2">{blog.author}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

// ── Main Page Component ───────────────────────────────────────────────────────
export default function BlogDetailClient({ blog }: { blog: Blog }) {
  const headings = extractHeadings(blog.content ?? '')
  const contentWithIds = injectHeadingIds(blog.content ?? '')

  return (
    <>
      <ProgressBar />
     

      <div className="min-h-screen bg-black text-white">

        {/* Hero Cover */}
        <div className="relative w-full h-[55vh] min-h-[360px] max-h-[520px] overflow-hidden">
          {blog.cover_image ? (
            <img src={blog.cover_image} alt={blog.title} className="w-full h-full object-cover object-top" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-emerald-950 via-slate-900 to-black" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10" />

          <div className="absolute top-6 left-0 right-0 max-w-4xl mx-auto px-6">
            <Link href="/blogs" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              All Articles
            </Link>
          </div>

          <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-6 pb-10">
            <div className="flex flex-wrap gap-2 mb-4">
              {(blog.tags ?? []).map((tag, i) => (
                <span key={tag} className={`text-xs px-3 py-1 rounded-full border font-medium ${TAG_COLORS[i % TAG_COLORS.length]}`}>{tag}</span>
              ))}
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight text-white max-w-3xl">
              {blog.title}
            </h1>
          </div>
        </div>

        {/* Article */}
        <div className="max-w-3xl mx-auto px-6">

          {/* Author bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-6 mb-8 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-600 to-cyan-700 flex items-center justify-center font-bold text-white text-base shrink-0 ring-2 ring-emerald-500/20">
                {blog.author?.[0]?.toUpperCase() ?? 'E'}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{blog.author}</p>
                <p className="text-xs text-slate-500">{formatDate(blog.created_at)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {readTime(blog.content, blog.excerpt)}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                Free Article
              </span>
            </div>
          </div>

          {/* AI Summary */}
          {/* {blog.content && <AISummary content={blog.content} title={blog.title} />} */}

          {/* Excerpt */}
          <div className="relative mb-10 pl-5 border-l-2 border-emerald-500/40">
            <div className="absolute -left-[3px] top-0 w-1.5 h-6 bg-emerald-500 rounded-full" />
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-light italic">{blog.excerpt}</p>
          </div>


          {/* TOC — mobile */}
          <TableOfContents headings={headings} />


          {/* Content */}
          {blog.content ? (
            <div className="blog-body" dangerouslySetInnerHTML={{ __html: contentWithIds }} />
          ) : (
            <p className="text-slate-600 italic">Content coming soon...</p>
          )}

          {/* Share */}
          <ShareButtons title={blog.title} slug={blog.slug} />

          {/* Related */}
          <RelatedArticles currentSlug={blog.slug} tags={blog.tags ?? []} />

          {/* CTA */}
          <div className="mt-10 mb-10">
            <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-8 text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-600 to-cyan-700 flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                  {blog.author?.[0]?.toUpperCase() ?? 'E'}
                </div>
                <p className="text-slate-400 text-sm mb-1">Written by</p>
                <p className="text-white font-semibold text-lg mb-3">{blog.author}</p>
                <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">Part of the EduCrush team — building free resources for every Indian student.</p>
                <Link href="/blogs" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-sm font-medium hover:bg-emerald-900/40 transition-all">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                  Read More Articles
                </Link>
              </div>
            </div>
          </div>
        </div>


      </div>
    </>
  )
}