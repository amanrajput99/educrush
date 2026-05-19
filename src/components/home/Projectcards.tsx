'use client'

import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Project, projects } from '@/data/projects'
import { getProjectsFromSupabase } from '@/lib/projectService'
import Link from 'next/link'

// ── Project Card ──────────────────────────────────────────────────────────────
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
    <motion.a
      ref={cardRef}
      href={`/projects/${project.slug}`}
      target="_blank"
      rel="noreferrer"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-5 text-left shadow-lg
        transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/60
        hover:shadow-emerald-500/10 hover:shadow-xl flex flex-col"
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

      {/* Glossy tooltip — project name */}
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
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
        {project.name}
      </div>

      <div className="relative z-10 flex flex-col flex-1">

        {/* Thumbnail */}
        <div
          className="relative overflow-hidden rounded-xl shrink-0 flex items-center justify-center"
          style={{ height: 'clamp(180px,50vw,245px)', background: '#0d1a12' }}
        >
          {/* Placeholder — image load hone se pehle dikhta hai */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-0">
            <div className="w-12 h-12 rounded-xl bg-emerald-900/40 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(52,211,153,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/><path d="m3 9 4-4 4 4 4-4 4 4"/><path d="M3 15h18"/>
              </svg>
            </div>
            <span className="text-[11px] text-emerald-900/80 font-medium">{project.name}</span>
          </div>

          <img
            src={project.image}
            alt={project.name}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105 z-10"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end p-4 z-20">
            <span className="flex items-center gap-2 rounded-lg border border-emerald-400/50 bg-emerald-500/20 px-3 py-2 text-sm font-semibold text-emerald-200 backdrop-blur-sm">
              View Project
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M7 17L17 7M17 7H7M17 7v10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </div>
        </div>

        {/* Title + description */}
        <div className="mt-4 flex-1">
          <h3 className="text-lg font-semibold text-white tracking-tight group-hover:text-emerald-300 transition-colors duration-200">
            {project.name}
          </h3>
          <p className="text-sm text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Tags + divider */}
        <div className="mt-4 pt-4 border-t border-slate-800/80">
          <div className="flex flex-wrap gap-2">
            {project.tags?.map((tag, j) => (
              <span
                key={j}
                className="rounded-full border border-slate-700/80 bg-slate-900 px-3 py-0.5 text-xs text-slate-400 group-hover:border-emerald-800/50 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.a>
  )
}

// ── View More Card ────────────────────────────────────────────────────────────
const ViewMoreCard = () => (
  <Link
    href="/projects"
    className="group relative overflow-hidden rounded-2xl border border-dashed border-slate-800 bg-slate-950/50
      flex flex-col items-center justify-center text-center
      transition-all duration-300 hover:border-emerald-500/50 hover:bg-slate-900/60 min-h-[360px]"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="relative z-10 flex flex-col items-center px-6">
      <div className="relative mb-5">
        <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-all duration-500" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 border border-slate-800 group-hover:border-emerald-500/50 text-emerald-400 transition-all duration-300 group-hover:scale-110">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
      </div>
      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-emerald-300 transition-colors">
        Explore More
      </h3>
      <p className="text-sm text-slate-500 max-w-[180px] leading-relaxed">
        See our full collection of projects & experiments
      </p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-xs text-emerald-400 border border-emerald-800/60 bg-emerald-950/50 px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
        View All Projects
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </span>
    </div>
  </Link>
)

// ── Skeleton Card — proper shimmer ────────────────────────────────────────────
const SkeletonCard = ({ index }: { index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, delay: index * 0.08 }}
    className="rounded-2xl border border-slate-800/60 bg-slate-950 overflow-hidden flex flex-col"
  >
    {/* Image shimmer */}
    <div className="relative h-[220px] bg-slate-900 overflow-hidden">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-slate-700/20 to-transparent" />
    </div>

    {/* Content shimmer */}
    <div className="p-5 flex flex-col flex-1 gap-3">
      {/* Title */}
      <div className="relative h-5 w-3/4 bg-slate-800/80 rounded-lg overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_0.1s_infinite] bg-gradient-to-r from-transparent via-slate-700/30 to-transparent" />
      </div>
      {/* Description line 1 */}
      <div className="relative h-3.5 w-full bg-slate-800/60 rounded-lg overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_0.15s_infinite] bg-gradient-to-r from-transparent via-slate-700/30 to-transparent" />
      </div>
      {/* Description line 2 */}
      <div className="relative h-3.5 w-2/3 bg-slate-800/60 rounded-lg overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_0.2s_infinite] bg-gradient-to-r from-transparent via-slate-700/30 to-transparent" />
      </div>

      {/* Tags row */}
      <div className="flex gap-2 mt-1 pt-3 border-t border-slate-800/60">
        {[40, 56, 48].map((w, i) => (
          <div
            key={i}
            className="relative h-6 rounded-full bg-slate-800/70 overflow-hidden"
            style={{ width: w }}
          >
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_0.25s_infinite] bg-gradient-to-r from-transparent via-slate-700/30 to-transparent" />
          </div>
        ))}
      </div>
    </div>
  </motion.div>
)

// ── Main Component ────────────────────────────────────────────────────────────
const ProjectCards = ({ limit }: { limit?: number }) => {
  const [projectList, setProjectList] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await getProjectsFromSupabase()
        setProjectList(data && data.length > 0 ? data : projects)
      } catch {
        setProjectList(projects)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  const displayedProjects = limit ? projectList.slice(0, limit) : projectList
  const showViewMore = !!(limit && projectList.length > limit)

  return (
    <section className="bg-black text-slate-100 px-6 py-12" id="projects">

      {/* Header — always visible, loading ka wait nahi */}
      <div className="text-center mb-12">
        <button className="px-4 h-8 border border-gray-800 text-slate-200 text-xs rounded-lg cursor-default">
          Projects
        </button>
        <h1 className="text-[42px] font-medium text-white tracking-tighter mt-1">
          {limit ? 'Our Latest Projects' : 'All Projects'}
        </h1>
        <p className="text-base text-slate-400 max-w-md mx-auto mt-2">
          {limit
            ? 'A collection of creative web projects — each crafted with code, design, and attention to detail.'
            : 'Explore our complete portfolio of web applications, experiments, and creative designs.'}
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 max-w-7xl mx-auto">
        {loading ? (
          [0, 1, 2].map(i => <SkeletonCard key={i} index={i} />)
        ) : (
          <>
            {displayedProjects.map((project, index) => (
              <ProjectCard key={index} project={project} index={index} />
            ))}
            {showViewMore && <ViewMoreCard />}
          </>
        )}
      </div>

      <div className="mt-12 max-w-7xl mx-auto w-full h-px bg-gradient-to-r from-transparent via-emerald-700/40 to-transparent" />
    </section>
  )
}

export default ProjectCards