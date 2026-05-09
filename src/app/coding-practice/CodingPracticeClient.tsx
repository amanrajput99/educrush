'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { getLanguages } from '@/lib/codingPracticeService'
import type { CodingLanguage } from '@/data/codingPractice'

// ── Fade up ───────────────────────────────────────────────────────────────────
const FadeUp = ({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
)

// ── Language Card ─────────────────────────────────────────────────────────────
const LanguageCard = ({ lang, index }: { lang: CodingLanguage; index: number }) => {
  const difficultyBreakdown = [
    { label: 'Easy',   pct: 60 },
    { label: 'Medium', pct: 30 },
    { label: 'Hard',   pct: 10 },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/coding-practice/${lang.slug}`}
        className="group block border border-gray-800 rounded-2xl bg-gradient-to-b from-[#0a0a0a] to-black hover:border-emerald-900/60 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
      >
        {/* Top accent */}
        <div className="h-[2px]" style={{ background: `linear-gradient(to right, transparent, ${lang.color}60, transparent)` }} />

        <div className="p-6">
          {/* Icon + Name */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border"
                style={{ background: lang.color + '15', borderColor: lang.color + '30' }}
              >
                {lang.icon}
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg leading-none">{lang.name}</h3>
                <p className="text-slate-500 text-xs mt-1">{lang.total_problems} problems</p>
              </div>
            </div>
            <svg
              className="text-slate-700 group-hover:text-slate-400 transition-colors mt-1"
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </div>

          {/* Description */}
          <p className="text-slate-500 text-xs leading-relaxed mb-5">
            {lang.description}
          </p>

          {/* Difficulty pills */}
          <div className="flex gap-2 mb-5">
            {[
              { label: 'Easy',   color: '#4ade80', bg: '#052e16' },
              { label: 'Medium', color: '#fbbf24', bg: '#1c1000' },
              { label: 'Hard',   color: '#f87171', bg: '#1c0000' },
            ].map(d => (
              <span
                key={d.label}
                className="px-2.5 py-0.5 rounded-full text-[10px] font-medium border"
                style={{ color: d.color, background: d.bg, borderColor: d.color + '30' }}
              >
                {d.label}
              </span>
            ))}
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] text-slate-600">
              <span>Problem distribution</span>
            </div>
            <div className="flex h-1.5 rounded-full overflow-hidden gap-px">
              <div className="h-full rounded-l-full" style={{ width: '60%', background: '#4ade8060' }} />
              <div className="h-full"               style={{ width: '30%', background: '#fbbf2460' }} />
              <div className="h-full rounded-r-full" style={{ width: '10%', background: '#f8717160' }} />
            </div>
          </div>

          {/* CTA */}
          <div
            className="mt-5 flex items-center justify-between py-2.5 px-3 rounded-xl border transition-all duration-200"
            style={{
              background: lang.color + '08',
              borderColor: lang.color + '20',
            }}
          >
            <span className="text-xs font-medium" style={{ color: lang.color }}>
              Start Practicing
            </span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={lang.color} strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="border border-gray-800 rounded-2xl bg-[#0a0a0a] p-6 animate-pulse">
    <div className="flex gap-3 mb-5">
      <div className="w-12 h-12 rounded-xl bg-gray-800" />
      <div className="space-y-2 flex-1">
        <div className="h-4 w-24 bg-gray-800 rounded" />
        <div className="h-3 w-16 bg-gray-800/60 rounded" />
      </div>
    </div>
    <div className="space-y-2 mb-5">
      <div className="h-3 w-full bg-gray-800/60 rounded" />
      <div className="h-3 w-3/4 bg-gray-800/40 rounded" />
    </div>
    <div className="h-8 bg-gray-800/40 rounded-xl" />
  </div>
)

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CodingPracticePage() {
  const [languages, setLanguages] = useState<CodingLanguage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getLanguages().then(data => {
      setLanguages(data)
      setLoading(false)
    })
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * { font-family: 'Poppins', sans-serif; }
      `}</style>

      <div className="bg-black min-h-screen text-white overflow-x-hidden">

        {/* Glow */}
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-[700px] h-[700px] bg-green-500/[0.1] rounded-full blur-[200px] z-0" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-28 pb-24">

          {/* Divider top */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-emerald-700/30 to-transparent mb-10" />

          {/* Header */}
          <FadeUp>
            <button className="px-4 h-8 border border-gray-800 text-slate-400 text-xs rounded-lg mb-5 cursor-default">
              Coding Practice
            </button>
          </FadeUp>

          <FadeUp delay={0.07}>
            <h1 className="text-[38px] sm:text-[52px] font-medium tracking-tight leading-[1.05] max-w-2xl mb-4">
              Practice code.{' '}
              <span className="bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">
                Build skills.
              </span>
            </h1>
          </FadeUp>

          <FadeUp delay={0.14}>
            <p className="text-sm/7 text-slate-400 max-w-lg mb-10">
              Real problems, live editor, step-by-step hints aur solutions — sab ek jagah.
              Beginner se advanced tak — apni language choose karo aur shuru ho jao.
            </p>
          </FadeUp>

          {/* Stats row */}
          <FadeUp delay={0.2}>
            <div className="flex flex-wrap gap-6 mb-12">
              {[
                { label: 'Languages', val: '4' },
                { label: 'Problems', val: '50+' },
                { label: 'Topics', val: '16' },
                { label: 'Free Forever', val: '100%' },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-white font-semibold text-xl leading-none">{s.val}</p>
                  <p className="text-slate-600 text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </FadeUp>

          {/* AdSense Top */}
          {/* <div className="mb-10 rounded-xl border border-gray-800 overflow-hidden">
            <p className="text-[9px] text-slate-700 uppercase tracking-widest text-center py-1.5">Advertisement</p>
            <ins className="adsbygoogle block" data-ad-client="ca-pub-XXXXXXXX" data-ad-slot="SLOT_ID" data-ad-format="auto" data-full-width-responsive="true" />
          </div> */}

          {/* Section label */}
          <FadeUp delay={0.22}>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-sm font-medium text-slate-400">Choose a Language</h2>
              <div className="flex-1 h-px bg-gray-800" />
            </div>
          </FadeUp>

          {/* Language cards */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {languages.map((lang, i) => (
                <LanguageCard key={lang.slug} lang={lang} index={i} />
              ))}
            </div>
          )}

          {/* How it works */}
          <FadeUp delay={0.3}>
            <div className="mt-16 border border-gray-800 rounded-2xl bg-gradient-to-b from-[#0a0a0a] to-black overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-800">
                <h3 className="text-sm font-medium text-slate-300">How it works</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-800">
                {[
                  { step: '01', title: 'Problem padhao', desc: 'Statement, examples aur constraints carefully padhao.' },
                  { step: '02', title: 'Code likhao', desc: 'Built-in editor mein apna solution likhao — hints available hain.' },
                  { step: '03', title: 'Solution dekhao', desc: 'Apna solution compare karo aur explanation samjhao.' },
                ].map(item => (
                  <div key={item.step} className="px-6 py-5">
                    <span className="text-[10px] font-mono text-slate-700">{item.step}</span>
                    <h4 className="text-white text-sm font-medium mt-1 mb-1">{item.title}</h4>
                    <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* AdSense Bottom */}
          {/* <div className="mt-10 rounded-xl border border-gray-800 overflow-hidden">
            <p className="text-[9px] text-slate-700 uppercase tracking-widest text-center py-1.5">Advertisement</p>
            <ins className="adsbygoogle block" data-ad-client="ca-pub-XXXXXXXX" data-ad-slot="SLOT_ID" data-ad-format="auto" data-full-width-responsive="true" />
          </div> */}

          <div className="mt-12 w-full h-px bg-gradient-to-r from-transparent via-emerald-700/30 to-transparent" />
        </div>
      </div>
    </>
  )
}