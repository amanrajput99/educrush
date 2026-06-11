'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { CodeBlock } from '@/data/projects'
import JSZip from 'jszip'

const LANG_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  HTML:       { bg: '#3d1a0a', text: '#fb923c', dot: '#f97316' },
  CSS:        { bg: '#0a1a3d', text: '#60a5fa', dot: '#3b82f6' },
  JavaScript: { bg: '#3d3000', text: '#fbbf24', dot: '#f59e0b' },
  'Three.js': { bg: '#0a2a1a', text: '#4ade80', dot: '#22c55e' },
  'CSS 3D':   { bg: '#1a0a3d', text: '#a78bfa', dot: '#8b5cf6' },
  TypeScript: { bg: '#0a1a3d', text: '#60a5fa', dot: '#3b82f6' },
}

const getLangStyle = (lang: string) =>
  LANG_COLORS[lang] ?? { bg: '#1a1a1a', text: '#94a3b8', dot: '#64748b' }

function highlight(code: string, lang: string): string {
  let c = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  if (lang === 'HTML') {
    c = c.replace(/(&lt;\/?)([\w-]+)/g, '<span style="color:#f97316">$1$2</span>')
    c = c.replace(/\s([\w-]+)(=)/g, ' <span style="color:#fbbf24">$1</span><span style="color:#94a3b8">$2</span>')
    c = c.replace(/"([^"]*)"/g, '"<span style="color:#4ade80">$1</span>"')
    c = c.replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span style="color:#4b5563">$1</span>')
  } else if (lang === 'CSS' || lang === 'CSS 3D') {
    c = c.replace(/^([\.\#\w\-\[\]=:,\s*>+~]+)\s*\{/gm, '<span style="color:#60a5fa">$1</span>{')
    c = c.replace(/([\w-]+)(\s*:\s*)/g, '<span style="color:#f97316">$1</span>$2')
    c = c.replace(/:\s*([^;{}\n]+)/g, ': <span style="color:#4ade80">$1</span>')
    c = c.replace(/(\/\*[\s\S]*?\*\/)/g, '<span style="color:#4b5563">$1</span>')
    c = c.replace(/(@[\w-]+)/g, '<span style="color:#a78bfa">$1</span>')
  } else if (lang === 'JavaScript' || lang === 'Three.js') {
    c = c.replace(/(`[^`]*`)/g, '<span style="color:#4ade80">$1</span>')
    c = c.replace(/('[^']*')/g, '<span style="color:#4ade80">$1</span>')
    c = c.replace(/("[^"]*")/g, '<span style="color:#4ade80">$1</span>')
    const kws = ['const','let','var','function','return','if','else','for','while','class','new','import','export','default','async','await','typeof','instanceof','of','in','true','false','null','undefined','this','from']
    kws.forEach(kw => {
      c = c.replace(new RegExp(`\\b(${kw})\\b`, 'g'), '<span style="color:#a78bfa">$1</span>')
    })
    c = c.replace(/\b(\d+\.?\d*)\b/g, '<span style="color:#fb923c">$1</span>')
    c = c.replace(/(\/\/[^\n]*)/g, '<span style="color:#4b5563">$1</span>')
    c = c.replace(/\b([\w]+)(\s*\()/g, '<span style="color:#60a5fa">$1</span>$2')
  }

  return c
}

const CodeBlockPanel = ({ block, isActive }: { block: CodeBlock; isActive: boolean }) => {
  const [copied, setCopied] = useState(false)
  const style = getLangStyle(block.language)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(block.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isActive) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-xl overflow-hidden border border-slate-800 bg-[#080808]"
    >
      <div className="flex items-center justify-between px-4 py-3 bg-[#0f0f0f] border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/70" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <span className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
          <span className="text-slate-400 text-xs font-mono">{block.filename}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-all text-xs"
        >
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              <span style={{ color: '#4ade80' }}>Copied!</span>
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      <div className="overflow-auto max-h-[500px] scrollbar-hide">
        <pre className="p-5 text-[13px] leading-[1.8] font-mono text-slate-300 min-w-full">
          <code dangerouslySetInnerHTML={{ __html: highlight(block.code, block.language) }} />
        </pre>
      </div>
    </motion.div>
  )
}

// ── Props — server se data aata hai, koi useEffect fetch nahi ─────────────────
interface ProjectClientProps {
  project: any | null
  slug: string
}

// ── Main Client Component ─────────────────────────────────────────────────────
export default function ProjectClient({ project, slug }: ProjectClientProps) {
  const [activeTab, setActiveTab] = useState(0)

  // ✅ useEffect + useParams + loading state — sab hata diya
  // Server se project directly aa raha hai prop mein

  if (!project) return notFound()

  const codeBlocks: CodeBlock[] = project.codeBlocks ?? project.codeblocks ?? []

  const handleDownload = async () => {
    const zip = new JSZip()
    const folder = zip.folder(project.slug)!
    codeBlocks.forEach((block) => { folder.file(block.filename, block.code) })
    const blob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${project.slug}.zip`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="min-h-screen bg-black text-white pt-24 pb-20">
      <div className="fixed inset-x-0 top-0 flex justify-center pointer-events-none z-0">
        <div className="w-[700px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">

        {/* Back button */}
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="mb-8">
          <Link href="/projects" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors group">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
              <path d="m15 18-6-6 6-6" />
            </svg>
            All Projects
          </Link>
        </motion.div>

        {/* Hero Image */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="rounded-2xl overflow-hidden border border-slate-800 mb-8 relative group">
          <img
            src={project.image}
            alt={project.name}
            className="w-full h-[280px] sm:h-[380px] object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1629752187687-3d3c7ea3a21b?w=1200' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-5 right-5 flex gap-2">
            {codeBlocks.length > 0 && (
              <button onClick={handleDownload} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-500/50 bg-slate-900/70 text-slate-200 text-sm font-semibold backdrop-blur-sm hover:bg-slate-800 hover:border-slate-400 transition-all">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download ZIP
              </button>
            )}
            <a href={project.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-emerald-400/50 bg-emerald-500/20 text-emerald-200 text-sm font-semibold backdrop-blur-sm hover:bg-emerald-500/30 transition-all">
              Live Preview
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M7 17L17 7M17 7H7M17 7v10" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </motion.div>

        {/* Project Info */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 }} className="mb-10">
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags?.map((tag: string) => {
              const s = getLangStyle(tag)
              return (
                <span key={tag} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border" style={{ background: s.bg, color: s.text, borderColor: s.dot + '40' }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
                  {tag}
                </span>
              )
            })}
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tighter leading-tight mb-3">{project.name}</h1>
          <p className="text-slate-400 text-[15px] leading-relaxed max-w-2xl">
            {project.longDescription ?? project.longdescription ?? project.description}
          </p>
          <div className="mt-6 h-px bg-gradient-to-r from-emerald-700/30 via-slate-700/30 to-transparent" />
        </motion.div>

        {/* Code Section */}
        {codeBlocks.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
                </svg>
                <h2 className="text-base font-semibold text-white">Source Code</h2>
              </div>
              <div className="flex-1 h-px bg-slate-800" />
              <span className="text-xs text-slate-600">{codeBlocks.length} file{codeBlocks.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {codeBlocks.map((block, i) => {
                const s = getLangStyle(block.language)
                const isActive = activeTab === i
                return (
                  <button key={i} onClick={() => setActiveTab(i)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-200"
                    style={isActive
                      ? { background: s.bg, color: s.text, borderColor: s.dot + '60', boxShadow: `0 0 12px ${s.dot}20` }
                      : { background: 'transparent', color: '#64748b', borderColor: '#1e293b' }
                    }
                  >
                    <span className="w-2 h-2 rounded-full" style={{ background: isActive ? s.dot : '#334155' }} />
                    {block.language}
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded"
                      style={{ background: isActive ? s.dot + '25' : '#0f172a', color: isActive ? s.text : '#475569' }}>
                      {block.filename}
                    </span>
                  </button>
                )
              })}
            </div>
            {codeBlocks.map((block, i) => (
              <CodeBlockPanel key={i} block={block} isActive={activeTab === i} />
            ))}
          </motion.div>
        )}

        {/* Bottom nav */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.4 }} className="mt-14 pt-6 border-t border-slate-800/50 flex items-center justify-between">
          <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to Projects
          </Link>
          <a href={project.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-all">
            Open Live Project
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M7 17L17 7M17 7H7M17 7v10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </motion.div>

      </div>
    </main>
  )
}