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

const programs = [
  {
    href: '/careers/ambassador',
    badge: 'POPULAR',
    badgeColor: 'bg-green-950 border-green-400 text-green-300',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    title: 'Student Ambassador',
    subtitle: 'Represent EduCrush at your college',
    desc: 'Be the face of EduCrush on your campus. Guide fellow students, organise events, and help grow your college community around free, quality learning.',
    perks: ['Certificate of Recognition', 'Priority Access to Resources', 'Community Leadership Badge', 'Direct Team Access'],
    cta: 'Apply as Ambassador',
    glow: 'from-green-500/10',
  },
  {
    href: '/careers/volunteer',
    badge: 'OPEN',
    badgeColor: 'bg-blue-950 border-blue-400 text-blue-300',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Volunteer & Contributor',
    subtitle: 'Contribute notes, content, or code',
    desc: 'Have great notes, a project, or coding skills? Contribute to EduCrush and directly impact the learning of thousands of students across India.',
    perks: ['Contributor Badge on Profile', 'Notes Credit & Recognition', 'Early Feature Access', 'Team Discord Access'],
    cta: 'Join as Contributor',
    glow: 'from-blue-500/10',
  },
]

const faqs = [
  {
    q: 'Are these paid positions?',
    a: 'Currently, these are volunteer and community roles. We are an early-stage student platform — paid opportunities will open in the future. In the meantime, you will receive recognition, certificates, and meaningful perks.',
  },
  {
    q: 'Are there any eligibility requirements?',
    a: 'Any student can apply — BTech, BCA, Diploma, or any other programme. All we ask for is genuine interest and a little time.',
  },
  {
    q: 'How much time is required?',
    a: 'Ambassadors typically commit 2–3 hours per week. Contributors can participate on their own schedule — submit notes once and you are good to go.',
  },
  {
    q: 'What happens after I apply?',
    a: 'Our team responds via email within 3–5 business days. Shortlisted candidates will be invited for a quick introductory call.',
  },
]

export default function CareersPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
        * { font-family: 'Sora', sans-serif; }
      `}</style>

      <div className="bg-black min-h-screen text-white overflow-x-hidden">

        {/* Ambient glow */}
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-[700px] h-[700px] bg-green-500/[0.10] rounded-full blur-[200px] z-0" />

        {/* ── HERO ── */}
        <section className="relative z-10 pt-36 pb-20 px-6">
          <div className="max-w-5xl mx-auto">
            <Divider />
            <div className="mt-10">
              <FadeUp>
                <Label text="Join EduCrush" />
              </FadeUp>

              <FadeUp delay={0.08}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-xs px-3 py-1 rounded-full bg-green-950 border border-green-300 text-green-300 font-semibold tracking-wide">HIRING</span>
                  <span className="text-slate-500 text-sm">2 programs open</span>
                </div>
                <h1 className="text-[38px] sm:text-[56px] md:text-[68px] font-semibold tracking-tight leading-[1.05] max-w-3xl">
                  Shape the future of{' '}
                  <span className="bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">
                    student learning
                  </span>
                </h1>
              </FadeUp>

              <FadeUp delay={0.16}>
                <p className="mt-6 text-sm/7 text-slate-400 max-w-lg">
                  EduCrush is a platform built by students, for students — and we want students to be the ones who grow it. 
                  Join as an Ambassador or Contributor and help make quality education accessible to millions across India.
                </p>
              </FadeUp>

              <FadeUp delay={0.22}>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link href="/careers/ambassador"
                    className="flex items-center gap-2 bg-gradient-to-r from-green-950 to-green-600 hover:from-green-600 hover:to-green-950 text-white px-7 py-3 rounded-full text-sm font-medium transition duration-300">
                    Student Ambassador
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </Link>
                  <Link href="/careers/volunteer"
                    className="flex items-center gap-2 border border-white/15 hover:border-green-700/60 bg-white/5 text-white px-7 py-3 rounded-full text-sm font-medium transition duration-300">
                    Volunteer & Contribute
                  </Link>
                </div>
              </FadeUp>
            </div>
          </div>
        </section>

        <Divider />

        {/* ── STATS ── */}
        <section className="relative z-10 py-16 px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '10K+', label: 'Students Reached' },
              { value: '50+',  label: 'Notes Available' },
              { value: '2',    label: 'Open Programs' },
              { value: '₹0',   label: 'Cost to Join' },
            ].map((stat, i) => (
              <FadeUp key={stat.label} delay={i * 0.07}>
                <div className="border border-gray-800 rounded-2xl p-6 bg-gradient-to-b from-[#0a0a0a] to-[#0D542B]/8 text-center">
                  <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-slate-500 text-xs tracking-wide">{stat.label}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        <Divider />

        {/* ── PROGRAMS ── */}
        <section className="relative z-10 py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <FadeUp className="mb-14">
              <Label text="Open Programs" />
              <h2 className="text-3xl md:text-[40px] font-semibold tracking-tight leading-tight">
                Choose your{' '}
                <span className="bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">
                  role
                </span>
              </h2>
              <p className="text-slate-500 text-sm mt-3 max-w-md">
                Both programs are completely free. Pick the one that fits your interests and availability.
              </p>
            </FadeUp>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {programs.map((p, i) => (
                <FadeUp key={p.title} delay={i * 0.1}>
                  <div className="relative border border-gray-800 rounded-2xl p-8 bg-gradient-to-b from-[#0a0a0a] to-black hover:border-emerald-900/60 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                    {/* Subtle glow */}
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${p.glow} to-transparent opacity-30 pointer-events-none`} />

                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex items-start justify-between mb-6">
                        <div className="w-12 h-12 rounded-xl border border-gray-800 bg-[#0D542B]/20 flex items-center justify-center text-green-400">
                          {p.icon}
                        </div>
                        <span className={`text-[10px] px-2.5 py-1 rounded-full border font-semibold tracking-wider ${p.badgeColor}`}>
                          {p.badge}
                        </span>
                      </div>

                      <h3 className="text-white font-semibold text-xl mb-1">{p.title}</h3>
                      <p className="text-green-400 text-xs mb-4">{p.subtitle}</p>
                      <p className="text-slate-400 text-sm leading-relaxed mb-6">{p.desc}</p>

                      <div className="space-y-2 mb-8 flex-1">
                        {p.perks.map(perk => (
                          <div key={perk} className="flex items-center gap-2">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="m9 12 2 2 4-4" /><circle cx="12" cy="12" r="10" />
                            </svg>
                            <span className="text-slate-400 text-xs">{perk}</span>
                          </div>
                        ))}
                      </div>

                      <Link href={p.href}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-950 to-green-700 hover:from-green-700 hover:to-green-950 text-white px-6 py-3 rounded-xl text-sm font-medium transition duration-300 mt-auto">
                        {p.cta}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                      </Link>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        <Divider />

        {/* ── HOW IT WORKS ── */}
        <section className="relative z-10 py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <FadeUp className="mb-14">
              <Label text="Process" />
              <h2 className="text-3xl md:text-[40px] font-semibold tracking-tight">
                How to{' '}
                <span className="bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">get started</span>
              </h2>
            </FadeUp>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { step: '01', title: 'Choose a Program', desc: 'Pick Ambassador or Contributor — whichever suits you best.' },
                { step: '02', title: 'Fill the Form', desc: 'A simple interest form — done in under 2 minutes.' },
                { step: '03', title: 'We Review', desc: 'Our team gets back to you within 3–5 business days.' },
                { step: '04', title: 'Welcome Aboard!', desc: 'Receive your onboarding email and get access right away.' },
              ].map((item, i) => (
                <FadeUp key={item.step} delay={i * 0.08}>
                  <div className="relative border border-gray-800 rounded-2xl p-6 bg-gradient-to-b from-[#0a0a0a] to-black h-full">
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

        {/* ── FAQ ── */}
        <section className="relative z-10 py-24 px-6">
          <div className="max-w-3xl mx-auto">
            <FadeUp className="mb-12 text-center">
              <Label text="FAQ" />
              <h2 className="text-3xl md:text-[40px] font-semibold tracking-tight">
                Common{' '}
                <span className="bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">
                  questions
                </span>
              </h2>
            </FadeUp>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <FadeUp key={i} delay={i * 0.07}>
                  <div className="border border-gray-800 rounded-2xl p-6 bg-gradient-to-b from-[#0a0a0a] to-black hover:border-emerald-900/50 transition-colors duration-300">
                    <h3 className="text-white font-medium text-sm mb-2">{faq.q}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">{faq.a}</p>
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
              Ready to Join?
            </button>
            <h2 className="text-3xl md:text-5xl font-semibold leading-tight bg-gradient-to-r from-white via-green-100 to-green-400 bg-clip-text text-transparent max-w-2xl mx-auto mb-6">
              Become Part of EduCrush
            </h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-10">
              No fees, no prior experience required — just a genuine passion for learning and helping others grow.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/careers/ambassador"
                className="flex items-center gap-2 bg-gradient-to-r from-green-950 to-green-600 hover:from-green-600 hover:to-green-950 text-white px-8 py-3.5 rounded-full text-sm font-medium transition duration-300">
                Apply as Student Ambassador
              </Link>
              <Link href="/careers/contact"
                className="flex items-center gap-2 border border-white/15 hover:border-green-700/60 bg-white/5 text-white px-8 py-3.5 rounded-full text-sm font-medium transition duration-300">
                Have Questions? Contact Us
              </Link>
            </div>
          </FadeUp>
        </section>

      </div>
    </>
  )
}