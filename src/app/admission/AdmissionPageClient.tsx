'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { submitAdmissionLead } from '@/lib/admissionService'

// ── Top Marquee ───────────────────────────────────────────────────────────────
function TopMarquee() {
  const items = [
    'DRCC Bihar Loan — Up to ₹4 Lakh @ 1% Interest',
    'Free College Counseling on WhatsApp',
    'Admissions 2026 Open — Dehradun · Delhi · Pan India',
    'No Hidden Charges — 100% Free Guidance',
    'Bihar Students: Government Loan Help Included',
    'BTech · BCA · MBA · Diploma — All Courses',
  ]
  const repeated = [...items, ...items, ...items]
  return (
    <div className="w-full overflow-hidden border-b border-white/5 bg-white/[0.02] py-2.5">
      <style>{`
        @keyframes marquee-top { 0% { transform: translateX(0) } 100% { transform: translateX(-33.333%) } }
        .marquee-top { animation: marquee-top 28s linear infinite; display: flex; width: max-content; }
        .marquee-top:hover { animation-play-state: paused; }
      `}</style>
      <div className="marquee-top">
        {repeated.map((item, i) => (
          <span key={i} className="flex items-center gap-3 px-6 text-xs text-white/40 whitespace-nowrap">
            {item}
            <span className="w-1 h-1 rounded-full bg-green-500/50 flex-shrink-0" />
          </span>
        ))}
      </div>
    </div>
  )
}

// ── College Names Marquee ─────────────────────────────────────────────────────
function CollegeMarquee() {
  const colleges = [
    'Graphic Era University', 'DIT University', 'UPES Dehradun',
    'Uttaranchal University', 'Amity University', 'Sharda University',
    'Galgotias University', 'Bennett University', 'Dev Bhoomi University',
    'Quantum University', 'IMS Unison University', 'Himgiri Zee University',
  ]
  const repeated = [...colleges, ...colleges, ...colleges]
  return (
    <div className="w-full overflow-hidden border-y border-white/5 bg-white/[0.015] py-3">
      <style>{`
        @keyframes marquee-col { 0% { transform: translateX(0) } 100% { transform: translateX(-33.333%) } }
        .marquee-col { animation: marquee-col 32s linear infinite; display: flex; width: max-content; }
        .marquee-col:hover { animation-play-state: paused; }
      `}</style>
      <div className="marquee-col">
        {repeated.map((name, i) => (
          <span key={i} className="flex items-center gap-4 px-5 text-xs text-white/25 whitespace-nowrap tracking-wide">
            {name}
            <span className="w-1 h-1 rounded-full bg-white/10 flex-shrink-0" />
          </span>
        ))}
      </div>
    </div>
  )
}

// ── Counter ───────────────────────────────────────────────────────────────────
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(to)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = to / 60
    const timer = setInterval(() => {
      start += step
      if (start >= to) { setCount(to); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [inView, to])
  return <span ref={ref}>{count}{suffix}</span>
}

// ── Lead Form ─────────────────────────────────────────────────────────────────
function AdmissionForm() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ name: '', phone: '', marks: '', course: '', city: '', state: 'Bihar' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const courses = ['BTech CSE', 'BTech ECE', 'BTech ME', 'BCA', 'Diploma', 'MBA', 'MCA', 'Other']
  const cities  = ['Dehradun', 'Delhi', 'Noida', 'Any']
  const states  = ['Bihar', 'Jharkhand', 'UP', 'Uttarakhand', 'Delhi', 'Other']

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.marks || !form.course) return
    setLoading(true)
    const ok = await submitAdmissionLead({
      name: form.name, phone: form.phone,
      marks_12th: parseInt(form.marks),
      preferred_course: form.course,
      preferred_city: form.city,
      student_state: form.state,
    })
    setLoading(false)
    if (ok) setSubmitted(true)
  }

  const inputCls = 'w-full bg-white/5 border border-white/10 focus:border-green-500 focus:bg-[#00A63E]/5 rounded-lg px-4 py-3 text-white placeholder:text-white/30 placeholder:text-sm outline-none transition-all duration-200 text-sm'

  if (submitted) return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
      <div className="w-14 h-14 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6 text-green-400">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Application Submitted</h3>
      <p className="text-white/50 text-sm mb-1">Our counselor will contact you within <span className="text-white font-semibold">24 hours</span> on WhatsApp.</p>
      {form.state === 'Bihar' && (
        <p className="text-green-400 text-xs mt-4 bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2.5">
          DRCC Bihar loan eligibility check included — free
        </p>
      )}
    </motion.div>
  )

  return (
    <div>
      <div className="flex gap-1.5 mb-5">
        {['Info', 'Course', 'Confirm'].map((s, i) => (
          <div key={i} className="flex-1">
            <div className={`h-0.5 rounded-full transition-all duration-300 ${step >= i ? 'bg-green-500' : 'bg-white/10'}`} />
            <p className={`text-[10px] mt-1.5 transition-colors ${step >= i ? 'text-green-400' : 'text-white/20'}`}>{s}</p>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="s0" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-3.5">
            <div>
              <label className="text-xs text-white/40 mb-1.5 block">Full Name *</label>
              <input className={inputCls} placeholder="Rahul Kumar" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1.5 block">WhatsApp Number *</label>
              <input className={inputCls} placeholder="10-digit number" type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1.5 block">12th Percentage *</label>
              <input className={inputCls} placeholder="e.g. 75" type="number" min="0" max="100" value={form.marks} onChange={e => setForm(f => ({ ...f, marks: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-2 block">Home State</label>
              <div className="flex gap-1.5 flex-wrap">
                {states.map(s => (
                  <button key={s} onClick={() => setForm(f => ({ ...f, state: s }))}
                    className={`py-1.5 px-3 rounded-full text-xs border transition-all ${form.state === s ? 'bg-green-500/20 border-green-500 text-green-300 font-semibold' : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            {form.state === 'Bihar' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-xs text-green-300">
                DRCC Bihar loan eligibility (up to ₹4L at 1%) will be checked — free.
              </motion.div>
            )}
            <button
              onClick={() => form.name && form.phone && form.marks && setStep(1)}
              disabled={!form.name || !form.phone || !form.marks}
              className="w-full py-3.5 rounded-full bg-linear-to-r from-green-950 to-green-600 hover:from-green-600 hover:to-green-950 text-white text-sm font-semibold transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer mt-1">
              Continue
            </button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="s1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4">
            <div>
              <label className="text-xs text-white/40 mb-2.5 block">Preferred Course *</label>
              <div className="grid grid-cols-2 gap-2">
                {courses.map(c => (
                  <button key={c} onClick={() => setForm(f => ({ ...f, course: c }))}
                    className={`py-2.5 px-3 rounded-lg text-sm border transition-all text-left ${form.course === c ? 'bg-green-500/15 border-green-500 text-white font-semibold' : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-white/40 mb-2 block">Preferred City</label>
              <div className="flex gap-2 flex-wrap">
                {cities.map(c => (
                  <button key={c} onClick={() => setForm(f => ({ ...f, city: c }))}
                    className={`py-1.5 px-3 rounded-full text-xs border transition-all ${form.city === c ? 'bg-green-500/20 border-green-500 text-green-300 font-semibold' : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setStep(0)} className="flex-1 py-3 rounded-full border border-white/10 text-white/40 text-sm hover:border-white/20 transition-all cursor-pointer">Back</button>
              <button onClick={() => form.course && setStep(2)} disabled={!form.course}
                className="flex-1 py-3 rounded-full bg-linear-to-r from-green-950 to-green-600 hover:from-green-600 hover:to-green-950 text-white text-sm font-semibold transition-all duration-300 disabled:opacity-30 cursor-pointer">
                Next
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="s2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
              <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold">Summary</p>
              {[['Name', form.name], ['WhatsApp', form.phone], ['12th Marks', form.marks + '%'], ['Course', form.course], ['City', form.city || 'Any'], ['State', form.state]].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm border-b border-white/5 pb-2 last:border-0 last:pb-0">
                  <span className="text-white/30">{k}</span>
                  <span className="text-white font-medium">{v}</span>
                </div>
              ))}
            </div>
            {form.state === 'Bihar' && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                <p className="text-xs text-green-400 font-semibold mb-0.5">DRCC Bihar Loan Check Included</p>
                <p className="text-xs text-white/40">Counselor will verify your eligibility for ₹4L @ 1% loan</p>
              </div>
            )}
            <p className="text-xs text-white/20 text-center">100% free. No spam. One WhatsApp call only.</p>
            <div className="flex gap-2">
              <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-full border border-white/10 text-white/40 text-sm hover:border-white/20 transition-all cursor-pointer">Edit</button>
              <button onClick={handleSubmit} disabled={loading}
                className="flex-1 py-3.5 rounded-full bg-linear-to-r from-green-950 to-green-600 hover:from-green-600 hover:to-green-950 text-white text-sm font-semibold transition-all duration-300 cursor-pointer disabled:opacity-50">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin inline-block" />
                    Submitting...
                  </span>
                ) : 'Get Free Counseling'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Data ──────────────────────────────────────────────────────────────────────
const SAMPLE_COLLEGES = [
  { name: 'Graphic Era University',  city: 'Dehradun',  courses: ['BTech', 'BCA'],           fees: '80k–1.5L', badge: 'NIRF Ranked',     slug: 'graphic-era-university',  logo_url: '' },
  { name: 'DIT University',          city: 'Dehradun',  courses: ['BTech', 'MBA'],            fees: '70k–1.2L', badge: 'Top Placement',   slug: 'dit-university',          logo_url: '' },
  { name: 'Amity University',        city: 'Noida',     courses: ['BTech', 'BCA', 'MBA'],     fees: '1.2L–2L',  badge: 'Premium',         slug: 'amity-university-noida',  logo_url: '' },
  { name: 'Sharda University',       city: 'Delhi NCR', courses: ['BTech', 'BCA', 'Diploma'], fees: '80k–1.4L', badge: 'Budget Friendly', slug: 'sharda-university',       logo_url: '' },
]
const BADGE_STYLES: Record<string, string> = {
  'NIRF Ranked':     'bg-green-500/10 border-green-500/30 text-green-400',
  'Top Placement':   'bg-blue-500/10  border-blue-500/30  text-blue-400',
  'Premium':         'bg-white/5      border-white/15     text-white/60',
  'Budget Friendly': 'bg-white/5      border-white/10     text-white/40',
}
const AVATARS = [
  'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=50',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=50',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=50&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=50',
]

// ── Main Page ─────────────────────────────────────────────────────────────────
export function AdmissionPageClient() {
  const statsRef    = useRef(null)
  const statsInView = useInView(statsRef, { once: true })

  const stats = [
    { label: 'Colleges Listed',  value: 50,   suffix: '+' },
    { label: 'Free Counseling',  value: 100,  suffix: '%' },
    { label: 'Students Helped',  value: 2000, suffix: '+' },
    { label: 'Bihar Students',   value: 800,  suffix: '+' },
  ]
  const courses = [
    { name: 'BTech CSE', desc: 'Software, AI/ML, web development',   fees: '80k–1.5L/yr', demand: 'Very High' },
    { name: 'BTech ECE', desc: 'Electronics, IoT, VLSI design',      fees: '70k–1.2L/yr', demand: 'High' },
    { name: 'BCA',       desc: 'Programming, web apps, IT jobs',     fees: '30k–60k/yr',  demand: 'High' },
    { name: 'Diploma',   desc: '3-year fast-track technical course', fees: '15k–35k/yr',  demand: 'Medium' },
  ]

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <TopMarquee />

      {/* ══ HERO ══════════════════════════════════════════════════════════════
          Mobile:  Form shows FIRST (order-1), info below (order-2)
          Desktop: Info left (lg:order-1), Form right (lg:order-2)
          No scroll tricks — pure CSS order solves it cleanly.
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-4 pt-8 pb-12 lg:min-h-[calc(100vh-40px)] lg:flex lg:items-center lg:pt-0 lg:pb-0">

        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-[500px] h-[500px] bg-green-500/15 rounded-full blur-[160px]" />

        <div className="relative z-10 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-20 lg:py-20">

          {/* FORM — order-1 mobile = shows first. lg:order-2 = right on desktop */}
          <motion.div
            id="counseling-form"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
            className="order-1 lg:order-2"
          >
            <div className="backdrop-blur-sm border border-white/10 rounded-2xl p-6 bg-white/[0.03]">
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-green-400 text-xs">Admissions 2026 Open</span>
                </div>
                <h2 className="text-xl font-semibold text-white mb-1">Start Your College Journey</h2>
                <p className="text-white/30 text-xs">Free counseling on WhatsApp — within 24 hours.</p>
              </div>
              <AdmissionForm />
            </div>
          </motion.div>

          {/* INFO — order-2 mobile = shows below form. lg:order-1 = left on desktop */}
          <div className="order-2 lg:order-1">
            <motion.h1
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.55 }}
              className="text-4xl sm:text-5xl xl:text-6xl font-semibold leading-[1.1] tracking-tight"
            >
              Find Your{' '}
              <span className="bg-linear-to-r from-white to-green-300 bg-clip-text text-transparent">
                Perfect College
              </span>
              <br />
              <span className="text-white/40 text-3xl sm:text-4xl font-normal">100% Free Guidance</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-white/50 mt-5 text-base leading-relaxed max-w-lg"
            >
              Compare top colleges in Dehradun, Delhi & across India. Get fee details, placement records, and personal counseling on WhatsApp within 24 hours.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="mt-5 bg-[#00A63E]/5 border border-white/10 rounded-xl p-4 max-w-lg"
            >
              <p className="text-green-400 font-semibold text-sm mb-1">Bihar Students</p>
              <p className="text-white/40 text-xs leading-relaxed">We help you apply for DRCC Bihar loan (₹4L @ 1%) along with college admissions — completely free.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-2 mt-5"
            >
              {['Zero Cost', 'WhatsApp Support', '2026 Updated', 'Bihar Loan Help'].map(t => (
                <span key={t} className="text-xs text-white/30 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">{t}</span>
              ))}
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="mt-5 flex items-center gap-3"
            >
              <div className="flex -space-x-2">
                {AVATARS.map((src, i) => (
                  <img key={i} src={src} alt="student" className="w-8 h-8 rounded-full border-2 border-black object-cover" />
                ))}
              </div>
              <p className="text-xs text-white/30">
                <span className="text-white font-semibold">2,000+</span> students guided this year
              </p>
            </motion.div>
          </div>

        </div>
      </section>

      {/* ── STATS ──────────────────────────────────────────────────────────── */}
      <section ref={statsRef} className="px-4 py-12 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 20 }} animate={statsInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.08 }}
              className="border border-white/10 hover:border-green-900 rounded-xl p-4 md:p-5 text-center transition-all bg-white/[0.02]">
              <div className="text-2xl md:text-3xl font-semibold text-green-400 mb-1">
                {<Counter to={s.value} suffix={s.suffix} />}
              </div>
              <div className="text-xs text-white/30">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <CollegeMarquee />

      {/* ── BIHAR LOAN ─────────────────────────────────────────────────────── */}
      <section className="px-4 py-14 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-10 bg-white/[0.02] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative">
            <span className="text-xs font-semibold text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
              Bihar Government Scheme
            </span>
            <h2 className="text-2xl md:text-3xl font-semibold mt-5 mb-2 bg-linear-to-r from-white to-green-300 bg-clip-text text-transparent">
              DRCC Bihar Education Loan
            </h2>
            <p className="text-white/40 text-sm max-w-xl mb-7 leading-relaxed">
              Bihar government offers education loans up to <span className="text-white">₹4 Lakh at 1% interest</span> for Bihar students. No collateral needed for loans under ₹1.5 lakh.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              {[
                { title: 'Up to ₹4 Lakh',   desc: 'Covers tuition, hostel & books' },
                { title: '1% Interest Only', desc: 'Far below any bank loan rate' },
                { title: 'No Collateral',    desc: 'For loans under ₹1.5 lakh' },
              ].map(item => (
                <div key={item.title} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <h4 className="font-semibold text-white text-sm mb-1">{item.title}</h4>
                  <p className="text-white/30 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
              <p className="text-xs font-semibold text-white/40 mb-3 uppercase tracking-wider">Who Can Apply</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-white/40">
                {['Bihar domicile — permanent resident', 'Passed 10th/12th from recognized board', 'Admission in any recognized institute', 'Family income below ₹3 Lakh (full subsidy)'].map(t => (
                  <div key={t} className="flex gap-2 items-start">
                    <span className="text-green-500 mt-0.5 flex-shrink-0">—</span>{t}
                  </div>
                ))}
              </div>
            </div>
            <a href="#counseling-form"
              className="inline-block px-7 py-3 rounded-full bg-linear-to-r from-green-950 to-green-600 hover:from-green-600 hover:to-green-950 text-white text-sm font-semibold transition-all duration-300">
              Check Eligibility — Free
            </a>
          </div>
        </motion.div>
      </section>

      {/* ── COURSES ────────────────────────────────────────────────────────── */}
      <section className="px-4 py-14 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <span className="text-xs text-white/30 border border-white/10 px-3 py-1 rounded-full uppercase tracking-wider">Courses</span>
          <h2 className="text-2xl md:text-3xl font-semibold mt-4 mb-2 bg-linear-to-r from-white to-green-300 bg-clip-text text-transparent">
            Which Course is Right for You?
          </h2>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {courses.map((c, i) => (
            <motion.div key={c.name}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="bg-white/[0.02] border border-white/10 hover:border-green-900 rounded-xl p-4 md:p-6 transition-all duration-300">
              <h3 className="font-semibold text-white text-sm mb-1.5">{c.name}</h3>
              <p className="text-white/30 text-xs mb-4 leading-relaxed">{c.desc}</p>
              <div className="space-y-1.5 text-xs border-t border-white/5 pt-3">
                <div className="flex justify-between">
                  <span className="text-white/20">Fees/yr</span>
                  <span className="text-white/50 font-medium">{c.fees}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/20">Demand</span>
                  <span className="text-green-400 font-semibold">{c.demand}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── COLLEGES ───────────────────────────────────────────────────────── */}
      <section className="px-4 py-14 max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs text-white/30 border border-white/10 px-3 py-1 rounded-full uppercase tracking-wider">Top Colleges</span>
            <h2 className="text-2xl md:text-3xl font-semibold mt-4 bg-linear-to-r from-white to-green-300 bg-clip-text text-transparent">
              Dehradun & Delhi
            </h2>
          </div>
          <Link href="/admission/colleges" className="text-sm text-green-400 hover:text-green-300 transition-colors hidden sm:block">View All</Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {SAMPLE_COLLEGES.map((col, i) => (
            <motion.div key={col.name}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="bg-white/[0.02] border border-white/10 hover:border-green-900 rounded-xl p-4 transition-all duration-300 group">
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {col.logo_url ? <img src={col.logo_url} alt={col.name} className="w-full h-full object-cover" /> : <span className="text-white/20 text-xs font-bold">{col.name.charAt(0)}</span>}
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full border leading-none ${BADGE_STYLES[col.badge] ?? 'bg-white/5 border-white/10 text-white/30'}`}>{col.badge}</span>
              </div>
              <h4 className="font-semibold text-white text-xs mb-1 group-hover:text-green-300 transition-colors leading-tight">{col.name}</h4>
              <p className="text-white/30 text-[11px] mb-2">{col.city}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {col.courses.slice(0, 2).map(c => <span key={c} className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/30">{c}</span>)}
              </div>
              <div className="flex items-center justify-between border-t border-white/5 pt-2">
                <span className="text-[11px] text-green-400 font-medium">₹{col.fees}/yr</span>
                <Link href={`/admission/colleges/${col.slug}`} className="text-[10px] text-white/20 hover:text-green-400 transition-colors">Details →</Link>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-5 sm:hidden">
          <Link href="/admission/colleges" className="text-sm text-green-400">View all colleges →</Link>
        </div>
      </section>

      {/* ── WHY EDUCRUSH ───────────────────────────────────────────────────── */}
      <section className="px-4 py-14 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-10 bg-white/[0.02]">
          <h2 className="text-2xl font-semibold text-center mb-2 bg-linear-to-r from-white to-green-300 bg-clip-text text-transparent">Why Trust EduCrush?</h2>
          <p className="text-white/30 text-center text-sm mb-8">10,000+ students use EduCrush for notes, projects, and admission guidance</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Completely Free',  desc: 'No hidden charges — counseling, comparisons, and loan guidance all free.' },
              { title: 'WhatsApp Support', desc: 'Personal reply within 24 hours. Ask anything about colleges or loans.' },
              { title: 'DRCC Bihar Loan',  desc: 'We help Bihar students apply for government loan at just 1% interest.' },
            ].map(f => (
              <div key={f.title} className="text-center">
                <div className="w-9 h-9 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-3">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                <h3 className="font-semibold text-white mb-1.5 text-sm">{f.title}</h3>
                <p className="text-white/30 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── BOTTOM CTA ─────────────────────────────────────────────────────── */}
      <section className="px-4 pb-20 max-w-xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h3 className="text-2xl font-semibold mb-3 bg-linear-to-r from-white to-green-300 bg-clip-text text-transparent">Still Thinking?</h3>
          <p className="text-white/30 text-sm mb-6">Talk to our counselor — no commitment, no cost, just honest guidance.</p>
          <a href="#counseling-form"
            className="inline-block px-9 py-3.5 rounded-full bg-linear-to-r from-green-950 to-green-600 hover:from-green-600 hover:to-green-950 text-white text-sm font-semibold transition-all duration-300 cursor-pointer">
            Get Free Counseling
          </a>
        </motion.div>
      </section>

      <div className="max-w-6xl mx-auto px-4 pb-10">
        <div className="w-full h-px bg-linear-to-r from-transparent via-green-700/30 to-transparent" />
      </div>
    </main>
  )
}