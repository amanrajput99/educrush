'use client'

import { useState, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Project } from '@/data/projects'

// ─── Individual Card ──────────────────────────────────────────────────────────

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  const [visible, setVisible] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLAnchorElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const bounds = cardRef.current?.getBoundingClientRect()
    if (!bounds) return
    setPos({ x: e.clientX - bounds.left, y: e.clientY - bounds.top })
  }

  return (
    <a
      ref={cardRef}
      href={`/projects/${project.slug}`}
      target="_blank"
      rel="noreferrer"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-5 text-left shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-emerald-500/10 hover:shadow-xl"
    >
            {/* Cursor Glow */}
      <motion.span
        className="pointer-events-none absolute h-[220px] w-[220px] rounded-full bg-gradient-to-r from-emerald-400 via-lime-300 to-cyan-300 blur-2xl"
        animate={{
          top: pos.y - 110,
          left: pos.x - 110,
          opacity: visible ? 1 : 0,
          scale: visible ? 1.05 : 0.95,
        }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      />
      <div className="relative z-10">
        {/* Thumbnail */}
        <div className="relative overflow-hidden rounded-xl">
          <img
            src={project.image}
            alt={project.name}
            loading="lazy"
            className="h-[clamp(180px,50vw,230px)] w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1629752187687-3d3c7ea3a21b?w=600'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end p-4">
            <span className="flex items-center gap-2 rounded-lg border border-emerald-400/50 bg-emerald-500/20 px-3 py-2 text-sm font-semibold text-emerald-200 backdrop-blur-sm">
              View Project
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M7 17L17 7M17 7H7M17 7v10" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </div>

        {/* Meta */}
        <h3 className="mt-4 text-base font-semibold text-white tracking-tight">{project.name}</h3>
        <p className="mt-1 text-sm text-slate-400 line-clamp-2">{project.description}</p>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tags?.map((tag, j) => (
            <span
              key={j}
              className="rounded-full border border-slate-700/80 bg-slate-900 px-3 py-0.5 text-xs text-slate-400 group-hover:border-emerald-900/60 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </a>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProjectsClient({ initialProjects }: { initialProjects: Project[] }) {
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState<string>('All')

  const projectList = initialProjects

  // Collect all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    projectList.forEach((p) => p.tags?.forEach((t) => tagSet.add(t)))
    return ['All', ...Array.from(tagSet).sort()]
  }, [projectList])

  // Filter logic
  const filtered = useMemo(() => {
    return projectList.filter((p) => {
      const matchesTag = activeTag === 'All' || p.tags?.includes(activeTag)
      const q = search.toLowerCase()
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q))
      return matchesTag && matchesSearch
    })
  }, [projectList, activeTag, search])

  return (
    <main className="min-h-screen bg-black pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">

        {/* ── Hero Header ── */}
        <div className="text-center mb-14">
                    <button className='px-4 h-8 border border-gray-800 text-slate-200 text-xs rounded-lg'>Projects</button>


          <h1 className="text-5xl md:text-[56px] font-medium text-white tracking-tighter mt-2">
            All Projects
          </h1>
          <p className="text-base text-slate-400 max-w-lg mx-auto mt-3 leading-relaxed">
            Explore our complete portfolio of web applications, experiments, and creative designs — all crafted with code &amp; care.
          </p>
        </div>

        {/* ── Search Bar ── */}
        <div className="relative mb-5">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by name, tech, or tag..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-11 pr-4 py-3.5 text-sm text-white placeholder-slate-600 outline-none focus:border-emerald-600/60 focus:ring-1 focus:ring-emerald-600/30 transition-all"
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

        {/* ── Tag Filters ── */}
        <div className="flex flex-wrap gap-2 mb-10">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                activeTag === tag
                  ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 shadow-sm shadow-emerald-500/20'
                  : 'bg-transparent border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-300'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* ── Results count ── */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-600">
            {filtered.length === 0
              ? 'No projects found'
              : `Showing ${filtered.length} project${filtered.length !== 1 ? 's' : ''}${activeTag !== 'All' ? ` in "${activeTag}"` : ''}`}
          </p>
          {(search || activeTag !== 'All') && (
            <button
              onClick={() => { setSearch(''); setActiveTag('All') }}
              className="text-xs text-emerald-500 hover:text-emerald-400 flex items-center gap-1 transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
              Clear filters
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
            <h3 className="text-lg font-medium text-slate-400">No projects found</h3>
            <p className="text-sm text-slate-600 mt-1">Try a different search or clear the filters</p>
            <button
              onClick={() => { setSearch(''); setActiveTag('All') }}
              className="mt-4 px-4 py-2 rounded-lg border border-slate-700 text-slate-400 text-sm hover:border-emerald-600/50 hover:text-emerald-400 transition-all"
            >
              Clear all filters
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((project, index) => (
              <ProjectCard key={project.name} project={project} index={index} />
            ))}
          </div>
        )}

        {/* ── Bottom divider glow ── */}
        <div className="mt-20 w-full h-px bg-gradient-to-r from-transparent via-emerald-700/40 to-transparent" />
      </div>
    </main>
  )
}