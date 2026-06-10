'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'

// ── Animated counter ──────────────────────────────────────────────────────────
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(to)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1600
    const step = 16
    const increment = to / (duration / step)
    const timer = setInterval(() => {
      start += increment
      if (start >= to) { setCount(to); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, step)
    return () => clearInterval(timer)
  }, [inView, to])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

// ── Fade up wrapper ───────────────────────────────────────────────────────────
function FadeUp({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ── Data ──────────────────────────────────────────────────────────────────────
const stats = [
  { value: 10000, suffix: '+', label: 'Students Helped' },
  { value: 50,    suffix: '+', label: 'Notes Available' },
  { value: 10,    suffix: '+', label: 'Projects Shared' },
  { value: 8,     suffix: '+', label: 'Courses Covered' },
]

const values = [
  {
    title: 'Quality Content',
    desc: 'Every note is carefully reviewed to ensure accuracy, clarity, and exam readiness.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
  },
  {
    title: 'Always Free',
    desc: 'Education should never come with a price tag. Every resource on EduCrush is completely free.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
      </svg>
    ),
  },
  {
    title: 'Community First',
    desc: 'A thriving student community where everyone supports and learns from each other.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    title: 'Constantly Growing',
    desc: 'New notes, projects, and course materials are added on a regular basis.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
]

const team = [
  {
    name: 'Aman Kumar Singh',
    role: 'Founder & Lead Developer',
    avatar: 'AS',
    bio: 'A BTech CSE student on a mission to ensure no student ever struggles to find the resources they need.',
  },
  {
    name: 'Prince Kumar',
    role: 'Co-founder & Product Designer (UI/UX)',
    avatar: 'PK',
    bio: 'Designing intuitive and user-centric learning experiences that make education simple and accessible.',
  },
]

const timeline = [
  {
    year: '2024',
    title: 'The Idea',
    desc: 'Born out of frustration — one BTech student asking "where do I find good notes?" — EduCrush was conceptualized.',
  },
  {
    year: '2025',
    title: 'First Launch',
    desc: 'EduCrush launched with its first 50 notes. Over 500 students joined within the first month.',
  },
  {
    year: '2026',
    title: 'Community Growth',
    desc: 'Crossed 10,000+ students, introduced the Projects section, and built a thriving learning community.',
  },
  {
    year: 'Now',
    title: 'Expanding Horizons',
    desc: 'Expanding BTech, BCA & Diploma sections, integrating AI-powered tools, and launching a redesigned experience.',
  },
]

// ── Social links ──────────────────────────────────────────────────────────────
const socialLinks = [
  {
    href: 'https://www.linkedin.com/in/aman-kumar-singh-4618aa344',
    label: 'LinkedIn',
    fill: false,
    icon: (
      <>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect width="4" height="12" x="2" y="9"/>
        <circle cx="4" cy="4" r="2"/>
      </>
    ),
  },
  {
    href: 'https://github.com/amanrajput99',
    label: 'GitHub',
    fill: false,
    icon: (
      <>
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
        <path d="M9 18c-4.51 2-5-2-7-2"/>
      </>
    ),
  },
  {
    href: 'https://www.instagram.com/_amanrajput_99',
    label: 'Instagram',
    fill: false,
    icon: (
      <>
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
      </>
    ),
  },
]

// ── Divider ───────────────────────────────────────────────────────────────────
const Divider = () => (
  <div className="w-full h-px bg-gradient-to-r from-transparent via-emerald-700/30 to-transparent" />
)

// ── Section label ─────────────────────────────────────────────────────────────
const Label = ({ text }: { text: string }) => (
  <button className="px-4 h-8 border border-gray-800 text-slate-400 text-xs rounded-lg mb-5 cursor-default tracking-wide uppercase">
    {text}
  </button>
)

// ─────────────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
        * { font-family: 'Sora', sans-serif; }
      `}</style>

      <div className="bg-black min-h-screen text-white overflow-x-hidden">

        {/* Ambient glow */}
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-[700px] h-[700px] bg-green-500/[0.10] rounded-full blur-[200px] z-0" />

        {/* ══ HERO ══════════════════════════════════════════════════════════ */}
        <section className="relative z-10 pt-36 pb-24 px-6">
          <div className="max-w-5xl mx-auto">
            <Divider />
            <div className="mt-10">
              <FadeUp>
                <Label text="About EduCrush" />
              </FadeUp>

              <FadeUp delay={0.08}>
                <h1 className="text-[38px] sm:text-[56px] md:text-[68px] font-semibold tracking-tight leading-[1.05] max-w-3xl">
                  We're building the platform{' '}
                  <span className="bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">
                    every student deserves
                  </span>
                </h1>
              </FadeUp>

              <FadeUp delay={0.16}>
                <p className="mt-6 text-sm/7 text-slate-400 max-w-lg">
                  EduCrush began with one frustrated student and a shared Google Drive link.
                  Today, we empower thousands of students to access quality notes, build meaningful
                  projects, and truly understand what they're learning.
                </p>
              </FadeUp>

              <FadeUp delay={0.22}>
                <div className="flex flex-wrap gap-3 mt-8">
                  <Link
                    href="/notes"
                    className="px-7 py-2.5 rounded-full text-sm font-medium bg-white text-black hover:bg-white/90 transition-all duration-200"
                  >
                    Browse Notes
                  </Link>
                  <Link
                    href="/contact"
                    className="px-7 py-2.5 rounded-full text-sm font-medium border border-gray-700 text-slate-300 hover:border-gray-500 hover:text-white transition-all duration-200"
                  >
                    Get in Touch
                  </Link>
                </div>
              </FadeUp>
            </div>
          </div>
        </section>

        <Divider />

        {/* ══ STATS ═════════════════════════════════════════════════════════ */}
        <section className="relative z-10 py-20 px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <FadeUp key={s.label} delay={i * 0.07}>
                <div className="border border-gray-800 rounded-2xl p-6 bg-gradient-to-b from-[#0a0a0a] to-black hover:border-emerald-900/60 transition-colors duration-300 text-center">
                  <p className="text-3xl md:text-4xl font-semibold text-white">
                    <Counter to={s.value} suffix={s.suffix} />
                  </p>
                  <p className="text-slate-500 text-xs mt-2 tracking-wide">{s.label}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        <Divider />

        {/* ══ FOUNDER ═══════════════════════════════════════════════════════ */}
        <section className="relative z-10 py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <FadeUp className="mb-12">
              <Label text="The Founder" />
              <h2 className="text-3xl md:text-[40px] font-semibold tracking-tight leading-tight">
                The person who{' '}
                <span className="bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">
                  started it all
                </span>
              </h2>
            </FadeUp>

            <FadeUp delay={0.1}>
              <div className="border border-gray-800 rounded-2xl bg-gradient-to-b from-[#0a0a0a] to-[#0D542B]/10 p-8 md:p-10 hover:border-emerald-900/60 transition-colors duration-300">
                <div className="flex flex-col md:flex-row gap-8 items-start">

                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-[#0D542B] to-[#022c22] border border-emerald-900/60 flex items-center justify-center text-2xl font-bold text-white select-none">
                      AK
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-black">
                      <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <h3 className="text-lg md:text-xl font-semibold text-white">Aman Kumar Singh</h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#0D542B]/40 border border-emerald-800/50 text-green-400">
                        Founder & CEO
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mb-5">BTech CSE · Dehradun, India</p>

                    <blockquote className="border-l-2 border-emerald-700/50 pl-4 mb-6">
                      <p className="text-sm/7 text-slate-300 italic">
                        "I was in my second year of BTech and couldn't find quality notes anywhere.
                        I created a Google Drive folder and shared it with my class — 200 students
                        downloaded it within a single day. That moment made it clear: EduCrush had to exist."
                      </p>
                    </blockquote>

                    <div className="flex flex-wrap gap-8 mb-6">
                      {[
                        { label: 'Students impacted', val: '10,000+' },
                        { label: 'Notes created', val: '50+' },
                        { label: 'Years building', val: '2' },
                      ].map(s => (
                        <div key={s.label}>
                          <p className="text-white font-semibold text-lg leading-none">{s.val}</p>
                          <p className="text-slate-500 text-xs mt-1">{s.label}</p>
                        </div>
                      ))}
                    </div>

                    {/* ── Social Links ── */}
                    <div className="flex items-center gap-2">
                      {socialLinks.map((item) => (
                        <a
                          key={item.label}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={item.label}
                          className="w-8 h-8 rounded-lg border border-gray-800 bg-[#0a0a0a] hover:border-emerald-900/60 hover:bg-[#0D542B]/20 flex items-center justify-center text-slate-500 hover:text-green-400 transition-all duration-200"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill={item.fill ? 'currentColor' : 'none'} stroke={item.fill ? 'none' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            {item.icon}
                          </svg>
                        </a>
                      ))}
                      <Link href="/contact" className="ml-1 flex items-center gap-1.5 text-xs text-slate-500 hover:text-green-400 transition-colors duration-200">
                        Say hello
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </section>

        <Divider />

        {/* ══ MISSION ═══════════════════════════════════════════════════════ */}
        <section className="relative z-10 py-24 px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

            <FadeUp>
              <Label text="Our Mission" />
              <h2 className="text-3xl md:text-[38px] font-semibold tracking-tight leading-tight mb-5">
                Quality education{' '}
                <span className="bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">
                  without barriers
                </span>
              </h2>
              <p className="text-sm/7 text-slate-400 mb-4">
                Millions of students cannot afford expensive coaching or premium resources.
                EduCrush was built for them — free, reliable, and focused on what matters most: results.
              </p>
              <p className="text-sm/7 text-slate-400 mb-8">
                Our notes are crafted by top-performing students, our projects reflect real-world
                challenges, and every resource is curated with care before it reaches you.
              </p>
              <div className="space-y-2.5">
                {['100% Free, forever', 'Community-verified content', 'Continuously updated'].map(item => (
                  <div key={item} className="flex items-center gap-3 text-sm text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-[#0D542B]/40 border border-emerald-800/50 flex items-center justify-center shrink-0">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </FadeUp>

            <FadeUp delay={0.15}>
              <div className="border border-gray-800 rounded-2xl bg-gradient-to-b from-[#0a0a0a] to-black p-7 space-y-0">
                {[
                  { label: 'Notes added this month', value: '48', dot: 'bg-green-400' },
                  { label: 'Active students',         value: '10K+', dot: 'bg-emerald-400' },
                  { label: 'Subjects covered',        value: '20+', dot: 'bg-teal-400' },
                ].map((item, i) => (
                  <div key={item.label} className={`flex items-center justify-between py-4 ${i < 2 ? 'border-b border-gray-800/60' : ''}`}>
                    <div className="flex items-center gap-3">
                      <span className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
                      <span className="text-slate-400 text-sm">{item.label}</span>
                    </div>
                    <span className="text-white font-semibold text-sm">{item.value}</span>
                  </div>
                ))}
                <div className="pt-5">
                  <div className="flex justify-between text-xs text-slate-600 mb-2">
                    <span>Growth this year</span>
                    <span className="text-slate-400">87%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-gray-800">
                    <div className="h-1.5 rounded-full bg-gradient-to-r from-[#0D542B] to-green-400" style={{ width: '87%' }} />
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </section>

        <Divider />

        {/* ══ VALUES ════════════════════════════════════════════════════════ */}
        <section className="relative z-10 py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <FadeUp className="mb-12">
              <Label text="What We Stand For" />
              <h2 className="text-3xl md:text-[40px] font-semibold tracking-tight leading-tight">
                Our{' '}
                <span className="bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">
                  core values
                </span>
              </h2>
            </FadeUp>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {values.map((v, i) => (
                <FadeUp key={v.title} delay={i * 0.08}>
                  <div className="border border-gray-800 rounded-2xl p-6 bg-gradient-to-b from-[#0a0a0a] to-[#0D542B]/8 hover:border-emerald-900/60 hover:-translate-y-1 transition-all duration-300 h-full">
                    <div className="w-10 h-10 rounded-xl border border-gray-800 bg-[#0D542B]/20 flex items-center justify-center text-green-400 mb-5">
                      {v.icon}
                    </div>
                    <h3 className="text-white font-medium text-sm mb-2">{v.title}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">{v.desc}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        <Divider />

        {/* ══ TIMELINE ══════════════════════════════════════════════════════ */}
        <section className="relative z-10 py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <FadeUp className="mb-14">
              <Label text="Our Journey" />
              <h2 className="text-3xl md:text-[40px] font-semibold tracking-tight leading-tight">
                How we{' '}
                <span className="bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">
                  got here
                </span>
              </h2>
            </FadeUp>

            <div className="relative">
              <div className="absolute left-[19px] md:left-1/2 md:-translate-x-px top-2 bottom-2 w-px bg-gradient-to-b from-emerald-700/50 via-emerald-900/30 to-transparent" />

              <div className="space-y-8">
                {timeline.map((item, i) => (
                  <FadeUp key={item.year} delay={i * 0.08}>
                    <div className={`relative flex gap-8 md:gap-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                      <div className="absolute left-[15px] md:left-1/2 -translate-x-1/2 top-5 w-[9px] h-[9px] rounded-full bg-green-500 border-2 border-black z-10 shrink-0" />
                      <div className={`hidden md:flex md:w-1/2 items-start pt-3.5 ${i % 2 === 0 ? 'justify-end pr-10' : 'justify-start pl-10'}`}>
                        <span className="text-slate-600 font-mono text-sm">{item.year}</span>
                      </div>
                      <div className={`pl-10 md:pl-0 md:w-1/2 ${i % 2 === 0 ? 'md:pl-10' : 'md:pr-10'}`}>
                        <div className="border border-gray-800 rounded-xl p-5 bg-gradient-to-b from-[#0a0a0a] to-black hover:border-emerald-900/50 transition-colors duration-300">
                          <span className="text-slate-600 font-mono text-xs md:hidden">{item.year} · </span>
                          <span className="text-white font-medium text-sm">{item.title}</span>
                          <p className="text-slate-500 text-xs leading-relaxed mt-1.5">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Divider />

        {/* ══ TEAM ══════════════════════════════════════════════════════════ */}
        <section className="relative z-10 py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <FadeUp className="mb-12">
              <Label text="Core Team" />
              <h2 className="text-3xl md:text-[40px] font-semibold tracking-tight leading-tight">
                The people{' '}
                <span className="bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">
                  behind EduCrush
                </span>
              </h2>
              <p className="text-slate-500 text-sm mt-3 max-w-sm">
                We are students ourselves — which is why every resource we create is built around what genuinely helps.
              </p>
            </FadeUp>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
              {team.map((member, i) => (
                <FadeUp key={member.name} delay={i * 0.1}>
                  <div className="flex items-start gap-4 border border-gray-800 rounded-2xl p-6 bg-gradient-to-b from-[#0a0a0a] to-black hover:border-emerald-900/60 hover:-translate-y-1 transition-all duration-300">
                    <div className="w-11 h-11 rounded-xl shrink-0 flex items-center justify-center text-white font-semibold text-sm bg-gradient-to-br from-[#0D542B] to-[#022c22] border border-emerald-900/50">
                      {member.avatar}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-white font-medium text-sm leading-snug">{member.name}</h3>
                      <p className="text-slate-500 text-xs mt-0.5 mb-2">{member.role}</p>
                      <p className="text-slate-500 text-xs leading-relaxed">{member.bio}</p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        <Divider />

        {/* ══ CTA ═══════════════════════════════════════════════════════════ */}
        <section className="relative z-10 py-24 px-6 text-center overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[500px] h-[200px] bg-green-500/15 rounded-full blur-[120px]" />
          </div>

          <button className="px-4 h-8 border border-gray-800 text-slate-200 text-xs rounded-lg mb-10 tracking-wide uppercase cursor-default">
            Join Us Today
          </button>
          <h2 className="text-3xl md:text-5xl font-semibold leading-tight bg-gradient-to-r from-white via-green-100 to-green-400 bg-clip-text text-transparent max-w-2xl mx-auto mb-6">
            Ready to Learn Smarter?
          </h2>
          <p className="text-slate-400 text-base max-w-md mx-auto mb-10">
            Over 10,000 students already rely on EduCrush. Now it's your turn — completely free, no strings attached.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/notes"
              className="flex items-center gap-2 bg-gradient-to-r from-green-950 to-green-600 hover:from-green-600 hover:to-green-950 text-white px-8 py-3.5 rounded-full text-sm font-medium transition duration-300"
            >
              Browse Notes
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-2 border border-white/15 hover:border-green-700/60 bg-white/5 text-white px-8 py-3.5 rounded-full text-sm font-medium transition duration-300"
            >
              Get in Touch
            </Link>
          </div>
        </section>

      </div>
    </>
  )
}