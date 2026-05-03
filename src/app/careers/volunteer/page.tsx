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

const contributionTypes = [
  {
    icon: '📝',
    title: 'Upload Notes',
    desc: 'Have handwritten or digital notes? Upload them and help thousands of students. BTech, BCA, Diploma — all subjects are welcome.',
    tag: 'Most Needed',
    tagColor: 'bg-green-950 border-green-400 text-green-300',
  },
  {
    icon: '💻',
    title: 'Share Projects',
    desc: 'Share your college projects — mini projects, final year projects, web dev builds — so other students can learn and get inspired.',
    tag: 'Popular',
    tagColor: 'bg-blue-950 border-blue-400 text-blue-300',
  },
  {
    icon: '✍️',
    title: 'Write a Blog or Article',
    desc: 'Tech articles, study tips, career advice — if your perspective adds value, publish it on the EduCrush blog with full credit to you.',
    tag: 'Open',
    tagColor: 'bg-purple-950 border-purple-400 text-purple-300',
  },
  {
    icon: '🐛',
    title: 'Report Bugs or Share Feedback',
    desc: 'Spotted an issue on the platform? Have suggestions? As a contributor, your reports receive priority attention from our team.',
    tag: 'Always Open',
    tagColor: 'bg-orange-950 border-orange-400 text-orange-300',
  },
]

const perks = [
  { title: 'Contributor Credit', desc: 'Your name on every note and project you upload — permanently.' },
  { title: 'Community Badge', desc: 'A verified Contributor badge displayed on your EduCrush profile.' },
  { title: 'Early Access', desc: 'Be the first to try new features before they go live.' },
  { title: 'Team Discord', desc: 'Connect directly with the core team and share your ideas.' },
  { title: 'Portfolio Building', desc: 'Add your EduCrush contributions to your resume or portfolio with confidence.' },
  { title: 'Reference Letter', desc: 'Top contributors are eligible for a recommendation letter from the EduCrush team.' },
]

const steps = [
  { step: '01', title: 'Choose What to Contribute', desc: 'Notes, projects, or articles — pick whatever suits you best.' },
  { step: '02', title: 'Fill the Interest Form', desc: 'Tell us what you would like to share — takes under 2 minutes.' },
  { step: '03', title: 'Review & Onboarding', desc: 'Our team gets back to you within 2–3 business days.' },
  { step: '04', title: 'Submit & Shine!', desc: 'Your content goes live on EduCrush — with full credit to you.' },
]

export default function VolunteerPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
        * { font-family: 'Sora', sans-serif; }
      `}</style>

      <div className="bg-black min-h-screen text-white overflow-x-hidden">
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-[700px] h-[700px] bg-green-500/[0.10] rounded-full blur-[200px] z-0" />

        {/* ── HERO ── */}
        <section className="relative z-10 pt-36 pb-20 px-6">
          <div className="max-w-5xl mx-auto">
            <Divider />
            <div className="mt-10">
              <FadeUp>
                <div className="flex items-center gap-3 mb-5">
                  <Link href="/careers" className="text-slate-500 text-xs hover:text-slate-300 transition flex items-center gap-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    Careers
                  </Link>
                  <span className="text-slate-700 text-xs">/</span>
                  <span className="text-slate-400 text-xs">Volunteer</span>
                </div>
                <Label text="Volunteer & Contributor Program" />
              </FadeUp>

              <FadeUp delay={0.08}>
                <div className="mb-6">
                  <span className="text-xs px-3 py-1 rounded-full bg-blue-950 border border-blue-400 text-blue-300 font-semibold tracking-wide">ALWAYS OPEN</span>
                </div>
                <h1 className="text-[38px] sm:text-[52px] md:text-[62px] font-semibold tracking-tight leading-[1.05] max-w-3xl">
                  Share your knowledge,{' '}
                  <span className="bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">
                    impact thousands
                  </span>
                </h1>
              </FadeUp>

              <FadeUp delay={0.16}>
                <p className="mt-6 text-sm/7 text-slate-400 max-w-lg">
                  EduCrush is a community-powered platform. If you have notes, projects, or skills to share —
                  contribute and leave a lasting impact. Credit, badges, and recognition are guaranteed.
                </p>
              </FadeUp>

              <FadeUp delay={0.22}>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link href="/careers/contact?role=volunteer"
                    className="flex items-center gap-2 bg-gradient-to-r from-green-950 to-green-600 hover:from-green-600 hover:to-green-950 text-white px-7 py-3 rounded-full text-sm font-medium transition duration-300">
                    Become a Contributor
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

        {/* ── CONTRIBUTION TYPES ── */}
        <section className="relative z-10 py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <FadeUp className="mb-12">
              <Label text="Ways to Contribute" />
              <h2 className="text-3xl md:text-[40px] font-semibold tracking-tight">
                How would you like to{' '}
                <span className="bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">contribute?</span>
              </h2>
              <p className="text-slate-500 text-sm mt-3 max-w-md">Pick one way or all of them — entirely up to you.</p>
            </FadeUp>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contributionTypes.map((item, i) => (
                <FadeUp key={item.title} delay={i * 0.08}>
                  <div className="relative border border-gray-800 rounded-2xl p-6 bg-gradient-to-b from-[#0a0a0a] to-[#0D542B]/8 hover:border-emerald-900/60 hover:-translate-y-1 transition-all duration-300 h-full">
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-3xl">{item.icon}</span>
                      <span className={`text-[10px] px-2.5 py-1 rounded-full border font-semibold tracking-wider ${item.tagColor}`}>
                        {item.tag}
                      </span>
                    </div>
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
              <Label text="Benefits" />
              <h2 className="text-3xl md:text-[40px] font-semibold tracking-tight">
                What you{' '}
                <span className="bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">receive</span>
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

        {/* ── STEPS ── */}
        <section className="relative z-10 py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <FadeUp className="mb-14">
              <Label text="How It Works" />
              <h2 className="text-3xl md:text-[40px] font-semibold tracking-tight">
                4 simple{' '}
                <span className="bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">steps</span>
              </h2>
            </FadeUp>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {steps.map((item, i) => (
                <FadeUp key={item.step} delay={i * 0.08}>
                  <div className="border border-gray-800 rounded-2xl p-6 bg-gradient-to-b from-[#0a0a0a] to-black h-full">
                    <span className="text-4xl font-black text-emerald-900/60 leading-none block mb-4">{item.step}</span>
                    <h3 className="text-white font-medium text-sm mb-2">{item.title}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        <Divider />

        {/* ── OPEN CALL BANNER ── */}
        <section className="relative z-10 py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <FadeUp>
              <div className="border border-emerald-900/60 rounded-2xl bg-gradient-to-r from-[#0D542B]/20 to-black p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <p className="text-green-400 text-xs font-semibold uppercase tracking-wider mb-3">Open Call</p>
                  <h3 className="text-white font-semibold text-2xl md:text-3xl mb-2">Notes Contributors Wanted</h3>
                  <p className="text-slate-400 text-sm max-w-md">
                    We are actively looking for BTech 1st–4th year notes — especially from CSE, ECE, and ME branches.
                    Your notes could make a real difference for thousands of students.
                  </p>
                </div>
                <Link href="/careers/contact?role=volunteer"
                  className="shrink-0 flex items-center gap-2 bg-gradient-to-r from-green-950 to-green-600 hover:from-green-600 hover:to-green-950 text-white px-8 py-3.5 rounded-full text-sm font-medium transition duration-300 whitespace-nowrap">
                  Contribute Notes
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </Link>
              </div>
            </FadeUp>
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
              Join the Community
            </button>
            <h2 className="text-3xl md:text-5xl font-semibold leading-tight bg-gradient-to-r from-white via-green-100 to-green-400 bg-clip-text text-transparent max-w-2xl mx-auto mb-6">
              Your contribution matters
            </h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-10">
              Upload a single note and watch how many students it helps. Every contribution counts.
            </p>
            <Link href="/careers/contact?role=volunteer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-950 to-green-600 hover:from-green-600 hover:to-green-950 text-white px-10 py-4 rounded-full text-sm font-medium transition duration-300">
              Become a Contributor — It's Free
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </FadeUp>
        </section>

      </div>
    </>
  )
}