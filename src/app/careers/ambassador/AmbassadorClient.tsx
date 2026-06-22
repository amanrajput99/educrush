'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
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

const responsibilities = [
  {
    icon: '📢',
    title: 'Spread the Word',
    desc: 'Talk about EduCrush on your campus — introduce classmates, juniors, and seniors to the platform and what it offers.',
  },
  {
    icon: '🎓',
    title: 'Onboard New Students',
    desc: 'Help new users navigate the platform and guide them toward the resources most relevant to their courses.',
  },
  {
    icon: '📋',
    title: 'Gather Feedback',
    desc: 'Collect feedback from students and relay it to the EduCrush team so we can keep improving the platform.',
  },
  {
    icon: '🤝',
    title: 'Organise Events',
    desc: 'Host study groups, doubt-clearing sessions, or online workshops within your college community.',
  },
]

const perks = [
  { title: 'Official Certificate', desc: 'A signed EduCrush Student Ambassador certificate — a meaningful addition to your resume.' },
  { title: 'Priority Support', desc: 'Direct access to the core team and priority on all platform resources.' },
  { title: 'Community Badge', desc: 'A verified Ambassador badge displayed on your EduCrush profile.' },
  { title: 'Letter of Recommendation', desc: 'Outstanding ambassadors are eligible for a letter of recommendation from the EduCrush team.' },
  { title: 'Early Feature Access', desc: 'Get access to new features before anyone else — and help shape them as a beta tester.' },
  { title: 'Team Discord Access', desc: 'Connect directly with the core team and contribute to platform decisions.' },
]

const eligibility = [
  'Open to any BTech, BCA, Diploma, or BSc student',
  'A commitment of just 2–3 hours per week is sufficient',
  'No prior experience required',
  'Must have at least one semester remaining at your institution',
  'A genuine passion for education and helping others',
]

export default function AmbassadorPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
        * { font-family: 'Sora', sans-serif; }
      `}</style>

      <div className="bg-black min-h-screen text-white overflow-x-hidden">
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-[700px] h-[700px] bg-green-500/[0.10] rounded-full blur-[200px] z-0" />

        {/* ── HERO ── */}
        <section className="relative z-10 pt-6 pb-20 px-6">
          <div className="max-w-5xl mx-auto">
            {/* <Divider /> */}
            <div className="mt-10">
              <FadeUp>
                <div className="flex items-center gap-3 mb-5">
                  <Link href="/careers" className="text-slate-500 text-xs hover:text-slate-300 transition flex items-center gap-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    Careers
                  </Link>
                  <span className="text-slate-700 text-xs">/</span>
                  <span className="text-slate-400 text-xs">Ambassador</span>
                </div>
                <Label text="Student Ambassador Program" />
              </FadeUp>

              <FadeUp delay={0.08}>
                <div className="mb-6">
                  <span className="text-xs px-3 py-1 rounded-full bg-green-950 border border-green-300 text-green-300 font-semibold tracking-wide">OPEN FOR APPLICATIONS</span>
                </div>
                <h1 className="text-[38px] sm:text-[52px] md:text-[62px] font-semibold tracking-tight leading-[1.05] max-w-3xl">
                  Be the face of{' '}
                  <span className="bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">
                    EduCrush
                  </span>{' '}
                  at your college
                </h1>
              </FadeUp>

              <FadeUp delay={0.16}>
                <p className="mt-6 text-sm/7 text-slate-400 max-w-lg">
                  The Student Ambassador Program is a community-driven initiative where motivated students
                  represent EduCrush on their campus — and in return, receive recognition, certificates,
                  and direct access to the core team.
                </p>
              </FadeUp>

              <FadeUp delay={0.22}>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link href="/careers/contact?role=ambassador"
                    className="flex items-center gap-2 bg-gradient-to-r from-green-950 to-green-600 hover:from-green-600 hover:to-green-950 text-white px-7 py-3 rounded-full text-sm font-medium transition duration-300">
                    Apply Now
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </Link>
                  <Link href="/careers"
                    className="flex items-center gap-2 border border-white/15 hover:border-green-700/60 bg-white/5 text-white px-7 py-3 rounded-full text-sm font-medium transition duration-300">
                    All Programs
                  </Link>
                </div>
              </FadeUp>
            </div>
          </div>
        </section>

        <Divider />

        {/* ── RESPONSIBILITIES ── */}
        <section className="relative z-10 py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <FadeUp className="mb-12">
              <Label text="What You'll Do" />
              <h2 className="text-3xl md:text-[40px] font-semibold tracking-tight">
                Your{' '}
                <span className="bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">responsibilities</span>
              </h2>
              <p className="text-slate-500 text-sm mt-3 max-w-md">No pressure, no targets — just show up for your community.</p>
            </FadeUp>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {responsibilities.map((item, i) => (
                <FadeUp key={item.title} delay={i * 0.08}>
                  <div className="border border-gray-800 rounded-2xl p-6 bg-gradient-to-b from-[#0a0a0a] to-[#0D542B]/8 hover:border-emerald-900/60 hover:-translate-y-1 transition-all duration-300 h-full">
                    <span className="text-3xl block mb-4">{item.icon}</span>
                    <h3 className="text-white font-medium text-sm mb-2">{item.title}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        <Divider />

        {/* ── PERKS ── */}
        <section className="relative z-10 py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <FadeUp className="mb-12">
              <Label text="What You Get" />
              <h2 className="text-3xl md:text-[40px] font-semibold tracking-tight">
                Your{' '}
                <span className="bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">benefits</span>
              </h2>
            </FadeUp>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {perks.map((perk, i) => (
                <FadeUp key={perk.title} delay={i * 0.07}>
                  <div className="border border-gray-800 rounded-2xl p-6 bg-gradient-to-b from-[#0a0a0a] to-black hover:border-emerald-900/60 hover:-translate-y-1 transition-all duration-300 h-full">
                    <div className="w-8 h-8 rounded-lg bg-[#0D542B]/30 border border-emerald-900/50 flex items-center justify-center mb-4">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m9 12 2 2 4-4" /><circle cx="12" cy="12" r="10" />
                      </svg>
                    </div>
                    <h3 className="text-white font-medium text-sm mb-1.5">{perk.title}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">{perk.desc}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        <Divider />

        {/* ── ELIGIBILITY ── */}
        <section className="relative z-10 py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <FadeUp>
                <Label text="Eligibility" />
                <h2 className="text-3xl md:text-[38px] font-semibold tracking-tight mb-6">
                  Who can{' '}
                  <span className="bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">apply?</span>
                </h2>
                <div className="space-y-3">
                  {eligibility.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
                        <path d="m9 12 2 2 4-4" /><circle cx="12" cy="12" r="10" />
                      </svg>
                      <span className="text-slate-400 text-sm leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </FadeUp>

              <FadeUp delay={0.1}>
                <div className="border border-gray-800 rounded-2xl bg-gradient-to-b from-[#0a0a0a] to-[#0D542B]/10 p-8 space-y-0">
                  <p className="text-green-400 text-xs font-semibold mb-5 uppercase tracking-wider">Ambassador Stats</p>
                  {[
                    { label: 'Time commitment per week', value: '2–3 hrs', dot: 'bg-green-400' },
                    { label: 'Program duration',          value: '1 semester', dot: 'bg-emerald-400' },
                    { label: 'Colleges currently active', value: '5+', dot: 'bg-teal-400' },
                  ].map((item, i) => (
                    <div key={item.label} className={`flex items-center justify-between py-4 ${i < 2 ? 'border-b border-gray-800/60' : ''}`}>
                      <div className="flex items-center gap-3">
                        <span className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
                        <span className="text-slate-400 text-sm">{item.label}</span>
                      </div>
                      <span className="text-white font-semibold text-sm">{item.value}</span>
                    </div>
                  ))}
                </div>
              </FadeUp>
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
              Limited Spots Available
            </button>
            <h2 className="text-3xl md:text-5xl font-semibold leading-tight bg-gradient-to-r from-white via-green-100 to-green-400 bg-clip-text text-transparent max-w-2xl mx-auto mb-6">
              Ready to lead?
            </h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-10">
              Apply now and become EduCrush's first Ambassador at your campus.
            </p>
            <Link href="/careers/contact?role=ambassador"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-950 to-green-600 hover:from-green-600 hover:to-green-950 text-white px-10 py-4 rounded-full text-sm font-medium transition duration-300">
              Apply as Ambassador
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </FadeUp>
        </section>

      </div>
    </>
  )
}