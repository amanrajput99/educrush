'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'

// ── Animated counter ──────────────────────────────────────────────────────────
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1800
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

// ── Fade-in wrapper ───────────────────────────────────────────────────────────
function FadeIn({
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
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ── Data ──────────────────────────────────────────────────────────────────────
const stats = [
  { value: 10000, suffix: '+', label: 'Students Helped' },
  { value: 50, suffix: '+', label: 'Notes Available' },
  { value: 10, suffix: '+', label: 'Projects Shared' },
  { value: 8, suffix: '+', label: 'Courses Covered' },
]

const values = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    title: 'Quality Content',
    desc: 'Har note carefully review kiya jaata hai — accurate, clear aur exam-ready.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
      </svg>
    ),
    title: 'Always Free',
    desc: 'Education pe paisa nahi lagni chahiye. Hamare saare resources bilkul free hain.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Community First',
    desc: 'Ek bada student community jahan sabh ek doosre ki help karte hain.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: 'Constantly Growing',
    desc: 'Naye notes, projects aur courses regularly add hote rehte hain.',
  },
]

const team = [
  {
    name: 'Aman Kumar Singh',
    role: 'Founder & Lead Developer',
    avatar: 'AS',
    colorFrom: '#0D542B',
    colorTo: '#022c22',
    bio: 'BTech CSE student jo chahta hai ki koi bhi student resources ke liye struggle na kare.',
  },
  // {
  //   name: 'Priya Verma',
  //   role: 'Content Head',
  //   avatar: 'PV',
  //   colorFrom: '#065F46',
  //   colorTo: '#022c22',
  //   bio: 'Class 12 topper jo ab sab students ke liye notes curate karti hai.',
  // },
  {
    name: 'Prince Kumar',
    role: 'Co-Founder & UI/UX Designer',
    avatar: 'PK',
    colorFrom: '#14532D',
    colorTo: '#022c22',
    bio: 'Design mein believe karta hai jo learning ko fun aur simple banaye.',
  },
]

const timeline = [
  {
    year: '2024',
    title: 'Idea Born',
    desc: 'Ek BTech student ke frustration se — "notes kahan milenge?" — EduCrush ka idea aaya.',
  },
  {
    year: '2025',
    title: 'First Launch',
    desc: 'Pehle 50 notes ke saath EduCrush launch hua. 500 students ne pehle mahine join kiya.',
  },
  {
    year: '2026',
    title: 'Community Grows',
    desc: '10,000+ students, projects section add hua, aur Telegram community bani.',
  },
  {
    year: 'Now',
    title: 'AI & Expansion',
    desc: 'EduCrush AI launch, BTech/BCA/Diploma section expand, aur naya UI.',
  },
]

// ── Page ─────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap");
        * { font-family: "Poppins", sans-serif; }
      `}</style>

      <div className="bg-black min-h-screen text-white overflow-x-hidden">

        {/* Global green ambient glow */}
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-[700px] h-[700px] bg-green-500/20 rounded-full blur-[220px] z-0" />

        {/* ══ HERO ══════════════════════════════════════════════════════════ */}
        <section className="relative z-10 pt-36 pb-24 px-6 text-center">

          {/* Badge — same style as notes/projects pages */}
          <FadeIn>
            <button className="px-4 h-8 border border-gray-800 text-slate-200 text-xs rounded-lg mb-10">
              About EduCrush
            </button>
          </FadeIn>

          {/* Big heading — white + green two-line like screenshot */}
          <FadeIn delay={0.1}>
            <h1 className="font-bold tracking-tight max-w-5xl mx-auto leading-none">
              <span className="block text-4xl sm:text-6xl md:text-7xl text-white mb-2">
                We&apos;re building the platform
              </span>
              <span className="block text-4xl sm:text-6xl md:text-7xl text-green-400">
                every student deserves
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="mt-8 text-slate-400 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
              EduCrush started with one frustrated student and a Google Drive link.
              Today we help 50,000+ students find notes, build projects, and
              actually understand what they&apos;re studying.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
              <Link
                href="/notes"
                className="bg-green-500 hover:bg-green-400 text-black text-sm font-semibold px-8 py-3.5 rounded-full transition duration-200"
              >
                Browse Notes
              </Link>
              <Link
                href="/contact"
                className="border border-white/20 hover:border-white/50 bg-transparent text-white text-sm font-medium px-8 py-3.5 rounded-full transition duration-200"
              >
                Get in Touch
              </Link>
            </div>
          </FadeIn>
        </section>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-green-700/40 to-transparent" />

        {/* ══ FOUNDER CARD ══════════════════════════════════════════════════ */}
        <section className="relative z-10 py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <FadeIn className="text-center mb-12">


              <button className="px-4 h-8 border border-gray-800 text-slate-200 text-xs rounded-lg mb-10">
                The Founder
              </button>

              <h2 className="text-2xl md:text-3xl font-semibold text-white">
                The person who started it all
              </h2>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="relative group border border-white/10 hover:border-green-800/60 rounded-3xl p-8 md:p-10 bg-gradient-to-br from-white/5 via-transparent to-green-950/20 backdrop-blur-sm transition-all duration-500 overflow-hidden">

                {/* BG glow on hover */}
                <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-green-500/10 rounded-full blur-[80px] group-hover:bg-green-500/20 transition-all duration-700 pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row gap-8 md:gap-12 items-start md:items-center">

                  {/* Avatar */}
                  <div className="shrink-0 relative">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-green-700 to-green-950 border border-green-700/50 flex items-center justify-center text-3xl md:text-4xl font-bold text-white select-none">
                      A
                    </div>
                    {/* Online indicator */}
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-black flex items-center justify-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-ping absolute" />
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-xl md:text-2xl font-bold text-white">Aman Kumar Singh</h3>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-950 border border-green-800 text-green-400">
                        Founder & CEO
                      </span>
                    </div>
                    <p className="text-green-400 text-sm mb-4 font-medium">BTech CSE · Dehradun, India</p>
                    <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl mb-6">
                      &ldquo;I was in my 2nd year of BTech and couldn&apos;t find good notes anywhere.
                      I made a Google Drive folder, shared it with my class — 200 students downloaded in one day.
                      That was the moment I knew EduCrush had to exist.&rdquo;
                    </p>

                    {/* Stats row */}
                    <div className="flex flex-wrap gap-6 mb-6">
                      {[
                        { label: 'Students impacted', val: '10,000+' },
                        { label: 'Notes created', val: '50+' },
                        { label: 'Years building', val: '2' },
                      ].map((s) => (
                        <div key={s.label}>
                          <p className="text-white font-bold text-lg leading-none">{s.val}</p>
                          <p className="text-slate-500 text-xs mt-1">{s.label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Social links */}
                    <div className="flex items-center gap-3">
                      <a href="#" className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 hover:border-green-700/60 hover:bg-green-950/40 flex items-center justify-center text-slate-400 hover:text-green-400 transition-all duration-200">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                        </svg>
                      </a>
                      <a href="#" className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 hover:border-green-700/60 hover:bg-green-950/40 flex items-center justify-center text-slate-400 hover:text-green-400 transition-all duration-200">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" />
                        </svg>
                      </a>
                      <a href="#" className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 hover:border-green-700/60 hover:bg-green-950/40 flex items-center justify-center text-slate-400 hover:text-green-400 transition-all duration-200">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" />
                        </svg>
                      </a>
                      <Link href="/contact" className="ml-2 flex items-center gap-2 text-sm text-green-400 hover:text-green-300 font-medium transition-colors">
                        Say hello
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-green-700/40 to-transparent" />

        {/* ══ STATS ═════════════════════════════════════════════════════════ */}
        <section className="relative z-10 py-20 px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-5">
            {stats.map((s, i) => (
              <FadeIn key={s.label} delay={i * 0.08}>
                <div className="border border-white/10 rounded-2xl p-6 bg-white/5 backdrop-blur-sm text-center hover:border-green-900/60 transition-colors duration-300">
                  <p className="text-3xl md:text-4xl font-bold text-green-400">
                    <Counter to={s.value} suffix={s.suffix} />
                  </p>
                  <p className="text-slate-400 text-sm mt-2">{s.label}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-green-700/40 to-transparent" />

        {/* ══ MISSION ═══════════════════════════════════════════════════════ */}
        <section className="relative z-10 py-24 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-14 items-center">

            <FadeIn>

              <button className="px-4 h-8 border border-gray-800 text-slate-200 text-xs rounded-lg mb-10">
                Our Mission
              </button>

              <h2 className="text-3xl md:text-4xl font-semibold leading-tight bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent mb-5">
                Quality Education Without Any Barrier
              </h2>
              <p className="text-slate-400 leading-relaxed mb-4 text-sm md:text-base">
                Bahut saare students aise hain jinke paas costly coaching nahi hoti, notes share karne wale doston ka circle nahi hota. EduCrush unhi students ke liye bana hai.
              </p>
              <p className="text-slate-400 leading-relaxed mb-8 text-sm md:text-base">
                Hamare notes toppers dwara banaye gaye hain, projects real-world experience se aate hain, aur har resource carefully curated hai — taaki tumhari padhai faster aur smarter ho.
              </p>
              <div className="flex flex-col gap-3">
                {['100% Free forever', 'Community-verified content', 'Updated regularly'].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-green-950 border border-green-700 flex items-center justify-center shrink-0">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-br from-green-900/20 to-transparent rounded-3xl blur-xl" />
                <div className="relative border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm p-8 space-y-5">
                  {[
                    { label: 'Notes added this month', value: '48' },
                    { label: 'Active students', value: '10K+' },
                    { label: 'Subjects covered', value: '20+' },
                  ].map((item, i) => (
                    <div key={item.label} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                      <div className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-green-400' : i === 1 ? 'bg-emerald-400' : 'bg-teal-400'}`} />
                        <span className="text-slate-400 text-sm">{item.label}</span>
                      </div>
                      <span className="text-white font-semibold">{item.value}</span>
                    </div>
                  ))}
                  <div className="pt-2">
                    <div className="flex justify-between text-xs text-slate-500 mb-2">
                      <span>Growth this year</span><span>87%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10">
                      <div className="h-2 rounded-full bg-gradient-to-r from-green-700 to-green-400" style={{ width: '87%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-green-700/40 to-transparent" />

        {/* ══ VALUES ════════════════════════════════════════════════════════ */}
        <section className="relative z-10 py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <FadeIn className="text-center mb-14">

              <button className="px-4 h-8 border border-gray-800 text-slate-200 text-xs rounded-lg mb-10">
                What We Stand For
              </button>
              <h2 className="text-3xl md:text-4xl font-semibold bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">
                Our Core Values
              </h2>
            </FadeIn>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {values.map((v, i) => (
                <FadeIn key={v.title} delay={i * 0.1}>
                  <div className="border border-white/10 rounded-2xl p-6 bg-gradient-to-b from-white/5 to-[#0D542B]/10 hover:border-green-900/60 hover:-translate-y-1 transition-all duration-300 h-full">
                    <div className="w-11 h-11 rounded-xl border border-green-900/50 bg-green-950/60 flex items-center justify-center text-green-400 mb-5">
                      {v.icon}
                    </div>
                    <h3 className="text-white font-semibold mb-2">{v.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{v.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-green-700/40 to-transparent" />

        {/* ══ TIMELINE ══════════════════════════════════════════════════════ */}
        <section className="relative z-10 py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <FadeIn className="text-center mb-16">
              
              <button className="px-4 h-8 border border-gray-800 text-slate-200 text-xs rounded-lg mb-10">
                Our Journey
              </button>
              <h2 className="text-3xl md:text-4xl font-semibold bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">
                How We Got Here
              </h2>
            </FadeIn>

            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[22px] md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px bg-gradient-to-b from-green-600/60 via-green-800/30 to-transparent" />

              <div className="space-y-10">
                {timeline.map((item, i) => (
                  <FadeIn key={item.year} delay={i * 0.1}>
                    <div className={`relative flex gap-8 md:gap-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                      {/* Dot */}
                      <div className="absolute left-[22px] md:left-1/2 -translate-x-1/2 top-5 w-4 h-4 rounded-full bg-green-500 border-2 border-green-300 z-10 shrink-0" />

                      {/* Year label */}
                      <div className={`hidden md:flex md:w-1/2 items-start pt-4 ${i % 2 === 0 ? 'justify-end pr-10' : 'justify-start pl-10'}`}>
                        <span className="text-green-400 font-bold text-lg">{item.year}</span>
                      </div>

                      {/* Card */}
                      <div className={`pl-12 md:pl-0 md:w-1/2 ${i % 2 === 0 ? 'md:pl-10' : 'md:pr-10'}`}>
                        <div className="border border-white/10 rounded-xl p-5 bg-white/5 backdrop-blur-sm hover:border-green-900/50 transition-colors">
                          <span className="text-green-400 font-bold text-sm md:hidden">{item.year} · </span>
                          <h3 className="inline text-white font-semibold">{item.title}</h3>
                          <p className="text-slate-400 text-sm leading-relaxed mt-1">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-green-700/40 to-transparent" />

        {/* ══ TEAM ══════════════════════════════════════════════════════════ */}
        <section className="relative z-10 py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <FadeIn className="text-center mb-14">
             
               <button className="px-4 h-8 border border-gray-800 text-slate-200 text-xs rounded-lg mb-10">
               Core Team
              </button>
              <h2 className="text-3xl md:text-4xl font-semibold bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">
                The People Behind EduCrush
              </h2>
              <p className="text-slate-400 mt-4 max-w-md mx-auto text-sm">
                Hum bhi students hain — isliye hamare resources wahi cover karte hain jo actually kaam aata hai.
              </p>
            </FadeIn>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
              {team.filter((m) => m.name !== 'Aarav Sharma').map((member, i) => (
                <FadeIn key={member.name} delay={i * 0.12}>
                  <div className="flex items-start gap-4 border border-white/10 rounded-2xl p-6 bg-white/5 backdrop-blur-sm hover:border-green-900/60 hover:-translate-y-1 transition-all duration-300">
                    <div
                      className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center text-white font-bold text-base border border-green-700/50"
                      style={{ background: `linear-gradient(135deg, ${member.colorFrom}, ${member.colorTo})` }}
                    >
                      {member.avatar}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-sm">{member.name}</h3>
                      <p className="text-green-400 text-xs mt-0.5 mb-2">{member.role}</p>
                      <p className="text-slate-400 text-xs leading-relaxed">{member.bio}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-green-700/40 to-transparent" />

        {/* ══ CTA ═══════════════════════════════════════════════════════════ */}
        <section className="relative z-10 py-24 px-6 text-center overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[500px] h-[200px] bg-green-500/15 rounded-full blur-[120px]" />
          </div>
          <FadeIn>
            <button className="px-4 h-8 border border-gray-800 text-slate-200 text-xs rounded-lg mb-10">
               joins us today
              </button>
            <h2 className="text-3xl md:text-5xl font-semibold leading-tight bg-gradient-to-r from-white via-green-100 to-green-400 bg-clip-text text-transparent max-w-2xl mx-auto mb-6">
              Ready to Learn Smarter?
            </h2>
            <p className="text-slate-400 text-base max-w-md mx-auto mb-10">
              10,000+ students already use EduCrush. Ab tumhari baari hai — bilkul free mein.
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
          </FadeIn>
        </section>

        {/* ── Big watermark text — same as footer ── */}
        {/* <div className="relative pb-0 overflow-hidden">
          <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-3xl h-64 bg-green-500 rounded-full blur-[170px] pointer-events-none opacity-25" />
          <h3 className="text-center font-extrabold leading-[0.75] text-transparent text-[clamp(3rem,15vw,15rem)] [-webkit-text-stroke:1px_#0D542B] select-none">
            EduCrush
          </h3>
        </div> */}

      </div>
    </>
  )
}