'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

function FadeUp({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string
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

const Divider = () => (
  <div className="w-full h-px bg-gradient-to-r from-transparent via-emerald-700/30 to-transparent" />
)

const Label = ({ text }: { text: string }) => (
  <button className="px-4 h-8 border border-gray-800 text-slate-400 text-xs rounded-lg mb-5 cursor-default tracking-wide uppercase">
    {text}
  </button>
)

// ── Data ──────────────────────────────────────────────────────────────────────

const pillars = [
  {
    number: '01',
    title: 'Free Forever',
    desc: 'Every student deserves access to quality education — regardless of their financial background. EduCrush will never have a paywall. Not now, not ever.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Student-Built',
    desc: 'We are students ourselves. We built what we wished existed. That is why our resources are grounded in reality — not theory.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Quality Over Quantity',
    desc: 'Every note and project on EduCrush is carefully reviewed before it goes live. We only publish what genuinely helps — no filler, no fluff.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Community Powered',
    desc: 'EduCrush does not grow alone — it grows with its community. Every contributor, ambassador, and learner is an essential part of this mission.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
        <line x1="6" x2="6" y1="1" y2="4"/><line x1="10" x2="10" y1="1" y2="4"/><line x1="14" x2="14" y1="1" y2="4"/>
      </svg>
    ),
  },
]

const goals = [
  {
    year: '2026',
    title: '100,000 Students',
    desc: 'Reach one lakh students across India — with a strong focus on Tier 2 and Tier 3 cities.',
    status: 'In Progress',
    statusColor: 'bg-yellow-950 border-yellow-500 text-yellow-300',
  },
  {
    year: '2026',
    title: 'AI-Powered Learning',
    desc: 'Personalized study paths, an AI doubt solver, and smart note recommendations tailored to every student.',
    status: 'Building',
    statusColor: 'bg-blue-950 border-blue-500 text-blue-300',
  },
  {
    year: '2027',
    title: '500+ Notes Library',
    desc: 'BTech, BCA, and Diploma — every subject, every semester, all in one place.',
    status: 'Planned',
    statusColor: 'bg-slate-800 border-slate-600 text-slate-400',
  },
  {
    year: '2027',
    title: 'Campus Ambassador Network',
    desc: 'EduCrush Student Ambassadors across 100+ colleges — building a national peer-to-peer learning network.',
    status: 'Planned',
    statusColor: 'bg-slate-800 border-slate-600 text-slate-400',
  },
  {
    year: '2028',
    title: 'Pan-India Platform',
    desc: "India's most trusted free education platform — the first choice for every engineering student in the country.",
    status: 'Vision',
    statusColor: 'bg-green-950 border-green-500 text-green-300',
  },
]

const problems = [
  {
    problem: 'Students waste hours searching for reliable notes',
    solution: 'One destination — organized, searchable, and completely free',
  },
  {
    problem: 'Expensive courses that rarely deliver results',
    solution: 'Real student notes that actually help you perform in exams',
  },
  {
    problem: 'No structured guidance for building projects',
    solution: 'Complete projects with source code — learn by seeing, then doing',
  },
  {
    problem: 'Quality resources are scarce in Tier 2 and Tier 3 cities',
    solution: 'If you have internet, you have EduCrush — location is never a barrier',
  },
]

// ── Page ──────────────────────────────────────────────────────────────────────
export default function VisionPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
        * { font-family: 'Sora', sans-serif; }
      `}</style>

      <div className="bg-black min-h-screen text-white overflow-x-hidden">

        {/* Ambient glow */}
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-[700px] h-[700px] bg-green-500/[0.08] rounded-full blur-[200px] z-0" />

        {/* ── HERO ── */}
        <section className="relative z-10 pt-36 pb-24 px-6">
          <div className="max-w-5xl mx-auto">
            <Divider />
            <div className="mt-10">

              <FadeUp>
                <Label text="Our Vision" />
              </FadeUp>

              <FadeUp delay={0.08}>
                <h1 className="text-[38px] sm:text-[56px] md:text-[72px] font-semibold tracking-tight leading-[1.05] max-w-4xl">
                  Education should be{' '}
                  <span className="bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">
                    free for every student
                  </span>{' '}
                  in India
                </h1>
              </FadeUp>

              <FadeUp delay={0.16}>
                <p className="mt-7 text-base/8 text-slate-400 max-w-2xl">
                  EduCrush was founded on a simple but powerful belief — if a student has the right
                  resources, no one needs to fail. We are working toward an India where quality
                  education is no longer defined by how much you can afford.
                </p>
              </FadeUp>

              <FadeUp delay={0.22}>
                <div className="mt-10 flex flex-wrap gap-4">
                  <Link href="/about"
                    className="flex items-center gap-2 bg-gradient-to-r from-green-950 to-green-600 hover:from-green-600 hover:to-green-950 text-white px-7 py-3 rounded-full text-sm font-medium transition duration-300">
                    Our Story
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </Link>
                  <Link href="/careers"
                    className="flex items-center gap-2 border border-white/15 hover:border-green-700/60 bg-white/5 text-white px-7 py-3 rounded-full text-sm font-medium transition duration-300">
                    Join the Mission
                  </Link>
                </div>
              </FadeUp>

            </div>
          </div>
        </section>

        <Divider />

        {/* ── PROBLEM WE SOLVE ── */}
        <section className="relative z-10 py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <FadeUp className="mb-14">
              <Label text="The Problem" />
              <h2 className="text-3xl md:text-[40px] font-semibold tracking-tight leading-tight">
                Students struggle.{' '}
                <span className="bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">
                  We fix that.
                </span>
              </h2>
              <p className="text-slate-500 text-sm mt-3 max-w-lg">
                These are real problems — ones we have personally experienced. That is exactly why we take them seriously.
              </p>
            </FadeUp>

            <div className="space-y-3">
              {problems.map((item, i) => (
                <FadeUp key={i} delay={i * 0.07}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-gray-800 rounded-2xl overflow-hidden hover:border-emerald-900/50 transition-colors duration-300">
                    {/* Problem */}
                    <div className="flex items-start gap-4 p-6 bg-gradient-to-b from-[#0a0a0a] to-black md:border-r border-gray-800">
                      <div className="w-8 h-8 rounded-lg bg-red-950/40 border border-red-900/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/>
                        </svg>
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed">{item.problem}</p>
                    </div>
                    {/* Solution */}
                    <div className="flex items-start gap-4 p-6 bg-gradient-to-b from-[#0D542B]/10 to-black">
                      <div className="w-8 h-8 rounded-lg bg-green-950/50 border border-green-900/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m9 12 2 2 4-4"/>
                        </svg>
                      </div>
                      <p className="text-white text-sm leading-relaxed font-medium">{item.solution}</p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        <Divider />

        {/* ── CORE PILLARS ── */}
        <section className="relative z-10 py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <FadeUp className="mb-14">
              <Label text="Our Beliefs" />
              <h2 className="text-3xl md:text-[40px] font-semibold tracking-tight leading-tight">
                What we{' '}
                <span className="bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">
                  stand for
                </span>
              </h2>
            </FadeUp>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pillars.map((p, i) => (
                <FadeUp key={p.number} delay={i * 0.08}>
                  <div className="border border-gray-800 rounded-2xl p-7 bg-gradient-to-b from-[#0a0a0a] to-[#0D542B]/8 hover:border-emerald-900/60 hover:-translate-y-1 transition-all duration-300 h-full">
                    <div className="flex items-start justify-between mb-5">
                      <div className="w-11 h-11 rounded-xl border border-gray-800 bg-[#0D542B]/20 flex items-center justify-center text-green-400">
                        {p.icon}
                      </div>
                      <span className="text-3xl font-black text-emerald-900/50 leading-none">{p.number}</span>
                    </div>
                    <h3 className="text-white font-semibold text-base mb-2">{p.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{p.desc}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        <Divider />

        {/* ── ROADMAP ── */}
        <section className="relative z-10 py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <FadeUp className="mb-14">
              <Label text="Roadmap" />
              <h2 className="text-3xl md:text-[40px] font-semibold tracking-tight leading-tight">
                Where we&apos;re{' '}
                <span className="bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">
                  headed
                </span>
              </h2>
              <p className="text-slate-500 text-sm mt-3 max-w-md">
                These are not just plans — they are commitments we are making publicly.
              </p>
            </FadeUp>

            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-emerald-700/60 via-emerald-900/30 to-transparent" />

              <div className="space-y-4">
                {goals.map((goal, i) => (
                  <FadeUp key={i} delay={i * 0.08}>
                    <div className="relative flex gap-6 pl-10">
                      {/* Dot */}
                      <div className="absolute left-[15px] top-5 w-[9px] h-[9px] rounded-full bg-green-500 border-2 border-black z-10" />

                      <div className="flex-1 border border-gray-800 rounded-2xl p-5 bg-gradient-to-b from-[#0a0a0a] to-black hover:border-emerald-900/50 transition-colors duration-300">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              <span className="text-slate-600 font-mono text-xs">{goal.year}</span>
                              <span className={`text-[10px] px-2.5 py-1 rounded-full border font-semibold ${goal.statusColor}`}>
                                {goal.status}
                              </span>
                            </div>
                            <h3 className="text-white font-semibold text-base mb-1.5">{goal.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">{goal.desc}</p>
                          </div>
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

        {/* ── MANIFESTO QUOTE ── */}
        <section className="relative z-10 py-24 px-6 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[600px] h-[300px] bg-green-500/10 rounded-full blur-[140px]" />
          </div>
          <div className="max-w-4xl mx-auto relative z-10 text-center">
            <FadeUp>
              <div className="text-5xl text-green-800 mb-6 font-serif leading-none">&ldquo;</div>
              <p className="text-2xl md:text-3xl lg:text-4xl font-medium leading-snug tracking-tight text-white max-w-3xl mx-auto">
                One day, no student in India will have to ask{' '}
                <span className="bg-gradient-to-r from-green-300 to-green-500 bg-clip-text text-transparent">
                  &ldquo;where do I find good notes?&rdquo;
                </span>{' '}
                — because EduCrush will already be there.
              </p>
              <div className="text-5xl text-green-800 mt-4 font-serif leading-none rotate-180">&ldquo;</div>
              <div className="mt-8 flex items-center justify-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#0D542B]/40 border border-emerald-900/60 flex items-center justify-center text-green-400 font-bold text-xs">
                  AK
                </div>
                <div className="text-left">
                  <p className="text-white text-sm font-medium">Aman Kumar Singh</p>
                  <p className="text-slate-500 text-xs">Founder, EduCrush</p>
                </div>
              </div>
            </FadeUp>
          </div>
        </section>

        <Divider />

        {/* ── NUMBERS ── */}
        <section className="relative z-10 py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <FadeUp className="mb-14 text-center">
              <Label text="Impact So Far" />
              <h2 className="text-3xl md:text-[40px] font-semibold tracking-tight">
                Started small.{' '}
                <span className="bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">
                  Thinking big.
                </span>
              </h2>
            </FadeUp>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: '10K+',  label: 'Students Reached',   sub: 'and growing' },
                { value: '50+',   label: 'Notes Available',    sub: 'all free' },
                { value: '10+',   label: 'Projects Shared',    sub: 'with source code' },
                { value: '100%',  label: 'Free Forever',       sub: 'no paywall, ever' },
              ].map((stat, i) => (
                <FadeUp key={stat.label} delay={i * 0.07}>
                  <div className="border border-gray-800 rounded-2xl p-6 bg-gradient-to-b from-[#0a0a0a] to-[#0D542B]/8 text-center hover:-translate-y-1 transition-all duration-300">
                    <p className="text-4xl font-bold text-white mb-1">{stat.value}</p>
                    <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                    <p className="text-slate-600 text-xs mt-1">{stat.sub}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        <Divider />

        {/* ── CTA ── */}
        <section className="relative z-10 py-24 px-6 text-center overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[500px] h-[200px] bg-green-500/15 rounded-full blur-[120px]" />
          </div>
          <FadeUp>
            <button className="px-4 h-8 border border-gray-800 text-slate-200 text-xs rounded-lg mb-8 cursor-default tracking-wide uppercase">
              Be Part of the Mission
            </button>
            <h2 className="text-3xl md:text-5xl font-semibold leading-tight bg-gradient-to-r from-white via-green-100 to-green-400 bg-clip-text text-transparent max-w-2xl mx-auto mb-6">
              Be Part of Something Bigger
            </h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-10">
              Are you a student? Share your notes. Become a campus ambassador. Or simply use EduCrush — every learner who joins makes this mission stronger.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/notes"
                className="flex items-center gap-2 bg-gradient-to-r from-green-950 to-green-600 hover:from-green-600 hover:to-green-950 text-white px-8 py-3.5 rounded-full text-sm font-medium transition duration-300">
                Start Learning Free
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <Link href="/careers"
                className="flex items-center gap-2 border border-white/15 hover:border-green-700/60 bg-white/5 text-white px-8 py-3.5 rounded-full text-sm font-medium transition duration-300">
                Join Our Team
              </Link>
            </div>
          </FadeUp>
        </section>

      </div>
    </>
  )
}