'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { submitAdmissionLead } from '@/lib/admissionService'

// ── Floating particle background ──────────────────────────────────────────────
function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 4 + 1,
            height: Math.random() * 4 + 1,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: i % 3 === 0 ? '#34d399' : i % 3 === 1 ? '#6ee7b7' : '#a7f3d0',
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// ── Animated counter ──────────────────────────────────────────────────────────
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(0)
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

// ── Smart lead form — fills itself visually on hover/focus ────────────────────
function AdmissionForm() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ name: '', phone: '', marks: '', course: '', city: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)
  const formRef = useRef<HTMLDivElement>(null)

  // Auto-progress hint — when form enters viewport, subtly highlight first field
  const inView = useInView(formRef, { once: true })
  useEffect(() => {
    if (inView) {
      setTimeout(() => setFocused('name'), 800)
      setTimeout(() => setFocused(null), 2200)
    }
  }, [inView])

  const courses = ['BTech CSE', 'BTech ECE', 'BTech ME', 'BCA', 'Diploma', 'MBA', 'MCA']
  const cities = ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Nainital', 'Any']

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.marks || !form.course) return
    setLoading(true)
    const ok = await submitAdmissionLead({
      name: form.name,
      phone: form.phone,
      marks_12th: parseInt(form.marks),
      preferred_course: form.course,
      preferred_city: form.city,
    })
    setLoading(false)
    if (ok) setSubmitted(true)
  }

  const inputClass = (field: string) => `
    w-full bg-black/40 border rounded-xl px-4 py-3.5 text-white text-sm
    placeholder-slate-600 outline-none transition-all duration-300
    ${focused === field
      ? 'border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.25)] bg-emerald-950/20'
      : 'border-slate-800 hover:border-slate-600 focus:border-emerald-500 focus:shadow-[0_0_16px_rgba(52,211,153,0.15)]'
    }
  `

  if (submitted) return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center py-12"
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 0.6 }}
        className="text-6xl mb-4"
      >🎉</motion.div>
      <h3 className="text-2xl font-bold text-emerald-400 mb-2">Request Received!</h3>
      <p className="text-slate-400 text-sm">Hum 24 ghante mein WhatsApp pe contact karenge.</p>
      <div className="mt-4 text-xs text-slate-600">Apne Telegram pe EduCrush join karo — fast updates ke liye</div>
    </motion.div>
  )

  return (
    <div ref={formRef}>
      {/* Step indicators */}
      <div className="flex gap-2 mb-6">
        {['Basic Info', 'Preference', 'Submit'].map((s, i) => (
          <div key={i} className="flex-1">
            <div className={`h-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-emerald-500' : 'bg-slate-800'}`} />
            <p className={`text-[10px] mt-1 transition-colors ${step >= i ? 'text-emerald-400' : 'text-slate-700'}`}>{s}</p>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="step0" initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -40, opacity: 0 }} className="space-y-4">
            <div>
              <label className="text-xs text-slate-500 mb-1.5 block">Tumhara naam *</label>
              <input
                className={inputClass('name')}
                placeholder="Rahul Kumar"
                value={form.name}
                onFocus={() => setFocused('name')}
                onBlur={() => setFocused(null)}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1.5 block">WhatsApp number *</label>
              <input
                className={inputClass('phone')}
                placeholder="9876543210"
                value={form.phone}
                onFocus={() => setFocused('phone')}
                onBlur={() => setFocused(null)}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                type="tel"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1.5 block">12th ke marks (%) *</label>
              <input
                className={inputClass('marks')}
                placeholder="75"
                value={form.marks}
                onFocus={() => setFocused('marks')}
                onBlur={() => setFocused(null)}
                onChange={e => setForm(f => ({ ...f, marks: e.target.value }))}
                type="number" min="0" max="100"
              />
            </div>
            <button
              onClick={() => form.name && form.phone && form.marks && setStep(1)}
              className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-95"
            >
              Aage badhein →
            </button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="step1" initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -40, opacity: 0 }} className="space-y-4">
            <div>
              <label className="text-xs text-slate-500 mb-2 block">Course chahiye *</label>
              <div className="grid grid-cols-2 gap-2">
                {courses.map(c => (
                  <button
                    key={c}
                    onClick={() => setForm(f => ({ ...f, course: c }))}
                    className={`py-2.5 px-3 rounded-xl text-sm border transition-all duration-200 text-left ${
                      form.course === c
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                        : 'bg-black/40 border-slate-800 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-2 block">City preference</label>
              <div className="flex flex-wrap gap-2">
                {cities.map(c => (
                  <button
                    key={c}
                    onClick={() => setForm(f => ({ ...f, city: c }))}
                    className={`py-1.5 px-3 rounded-full text-xs border transition-all duration-200 ${
                      form.city === c
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                        : 'bg-black/40 border-slate-800 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(0)} className="flex-1 py-3 rounded-xl border border-slate-800 text-slate-400 text-sm hover:border-slate-600 transition-all">
                ← Wapas
              </button>
              <button
                onClick={() => form.course && setStep(2)}
                className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm transition-all duration-200 hover:scale-[1.02]"
              >
                Next →
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -40, opacity: 0 }} className="space-y-4">
            {/* Summary */}
            <div className="bg-emerald-950/30 border border-emerald-900/50 rounded-xl p-4 space-y-2">
              <p className="text-xs text-emerald-400 font-semibold mb-3">Tera Summary</p>
              {[
                ['Naam', form.name],
                ['Phone', form.phone],
                ['12th Marks', form.marks + '%'],
                ['Course', form.course],
                ['City', form.city || 'Any'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="text-slate-500">{k}</span>
                  <span className="text-white">{v}</span>
                </div>
              ))}
            </div>
            <div className="flex items-start gap-2 text-xs text-slate-600 bg-slate-900/50 p-3 rounded-xl">
              <span className="text-emerald-500 mt-0.5">🔒</span>
              <span>100% Free. Koi spam nahi. Sirf ek WhatsApp message milega EduCrush se.</span>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl border border-slate-800 text-slate-400 text-sm hover:border-slate-600 transition-all">
                ← Edit
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="inline-block w-4 h-4 border-2 border-black/30 border-t-black rounded-full" />
                    Bhej rahe hain...
                  </span>
                ) : '🚀 Free Counseling Book Karo'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── College mini card ─────────────────────────────────────────────────────────
const SAMPLE_COLLEGES = [
  { name: 'Graphic Era University', city: 'Dehradun', courses: ['BTech', 'BCA'], fees: '80k–1.5L', badge: 'NIRF Ranked', slug: 'graphic-era-university' },
  { name: 'DIT University', city: 'Dehradun', courses: ['BTech', 'MBA'], fees: '70k–1.2L', badge: 'Good Placement', slug: 'dit-university' },
  { name: 'UPES Dehradun', city: 'Dehradun', courses: ['BTech', 'Law'], fees: '1L–2L', badge: 'Premium', slug: 'upes-dehradun' },
  { name: 'Uttaranchal University', city: 'Dehradun', courses: ['BCA', 'BTech'], fees: '50k–90k', badge: 'Budget Friendly', slug: 'uttaranchal-university' },
]

const BADGE_STYLES: Record<string, string> = {
  'NIRF Ranked': 'bg-emerald-950/60 border-emerald-800/60 text-emerald-400',
  'Good Placement': 'bg-blue-950/60 border-blue-800/60 text-blue-400',
  'Premium': 'bg-amber-950/60 border-amber-800/60 text-amber-400',
  'Budget Friendly': 'bg-slate-900 border-slate-700 text-slate-300',
}

export default function AdmissionPage() {
  const heroRef = useRef(null)
  const statsRef = useRef(null)
  const statsInView = useInView(statsRef, { once: true })

  const stats = [
    { label: 'Colleges Listed', value: 50, suffix: '+' },
    { label: 'Free Counseling', value: 100, suffix: '%' },
    { label: 'Students Helped', value: 2000, suffix: '+' },
    { label: 'Cities Covered', value: 8, suffix: '' },
  ]

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-16 overflow-hidden">
        <Particles />

        {/* Grid bg */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(52,211,153,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(52,211,153,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

        {/* Center glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/50 border border-emerald-800/60 text-emerald-400 text-xs font-medium mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Admission 2025 — Uttarakhand
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-4xl sm:text-5xl md:text-7xl font-bold text-center max-w-4xl leading-tight tracking-tight"
        >
          Sahi College Chuno,{' '}
          <span className="relative">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-300 to-cyan-400">
              Bilkul Free
            </span>
            <motion.span
              className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 to-cyan-400"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-slate-400 text-center max-w-lg mt-6 text-base md:text-lg leading-relaxed"
        >
          BTech, BCA, Diploma — Uttarakhand ke top colleges compare karo, fees jaano, aur free counseling lo. Seedha WhatsApp pe.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 mt-10"
        >
          <a href="#counseling-form" className="group flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm transition-all duration-200 hover:scale-105 hover:shadow-[0_0_40px_rgba(52,211,153,0.4)] active:scale-95">
            <span>Free Counseling Lo</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
          <Link href="/admission/colleges" className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-slate-700 hover:border-emerald-700/60 text-slate-300 hover:text-emerald-300 font-semibold text-sm transition-all duration-200 hover:bg-emerald-950/20">
            Colleges Explore Karo
          </Link>
        </motion.div>

        {/* Trust pill */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center gap-4 mt-10 flex-wrap justify-center"
        >
          {['✓ Zero spam', '✓ 100% Free', '✓ WhatsApp support', '✓ 2025 cutoffs'].map(t => (
            <span key={t} className="text-xs text-slate-500">{t}</span>
          ))}
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 text-slate-700 text-xs flex flex-col items-center gap-1"
        >
          <span>scroll</span>
          <span>↓</span>
        </motion.div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <section ref={statsRef} className="px-4 py-16 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group relative bg-slate-950 border border-slate-800 hover:border-emerald-800/60 rounded-2xl p-6 text-center transition-all duration-300 hover:bg-emerald-950/10"
            >
              <div className="text-3xl md:text-4xl font-bold text-emerald-400 mb-1">
                {statsInView ? <Counter to={s.value} suffix={s.suffix} /> : '0'}
              </div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── COURSE CARDS ─────────────────────────────────────────────────── */}
      <section className="px-4 py-16 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-xs text-emerald-400 border border-emerald-900/60 bg-emerald-950/30 px-3 py-1 rounded-full">Courses</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-3">Kaunsa Course Sahi Hai?</h2>
          <p className="text-slate-500 max-w-lg mx-auto text-sm">Har course ka scope, fees range, aur career path jaano</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'BTech CSE', icon: '💻', desc: 'Software, AI/ML, web dev', fees: '80k–1.5L/yr', demand: 'Very High', color: 'emerald' },
            { name: 'BTech ECE', icon: '📡', desc: 'Electronics, IoT, VLSI', fees: '70k–1.2L/yr', demand: 'High', color: 'cyan' },
            { name: 'BCA', icon: '🖥️', desc: 'Programming, web, apps', fees: '30k–60k/yr', demand: 'High', color: 'green' },
            { name: 'Diploma', icon: '🔧', desc: '3 year fast-track', fees: '15k–35k/yr', demand: 'Medium', color: 'teal' },
          ].map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="group bg-slate-950 border border-slate-800 hover:border-emerald-700/40 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-[0_20px_60px_rgba(52,211,153,0.08)]"
            >
              <div className="text-4xl mb-4">{c.icon}</div>
              <h3 className="font-bold text-white text-lg mb-1">{c.name}</h3>
              <p className="text-slate-500 text-xs mb-4">{c.desc}</p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Fees/yr</span>
                  <span className="text-slate-300">{c.fees}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Demand</span>
                  <span className="text-emerald-400">{c.demand}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── TOP COLLEGES PREVIEW ─────────────────────────────────────────── */}
      <section className="px-4 py-16 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <span className="text-xs text-emerald-400 border border-emerald-900/60 bg-emerald-950/30 px-3 py-1 rounded-full">Top Colleges</span>
            <h2 className="text-3xl font-bold mt-3">Uttarakhand Ke Best Colleges</h2>
          </div>
          <Link href="/admission/colleges" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors hidden sm:block">
            Sab dekho →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SAMPLE_COLLEGES.map((col, i) => (
            <motion.div
              key={col.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="bg-slate-950 border border-slate-800 hover:border-emerald-700/40 rounded-2xl p-5 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-900 to-slate-900 flex items-center justify-center text-xl">🏛️</div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${BADGE_STYLES[col.badge] ?? 'bg-slate-900 border-slate-700 text-slate-400'}`}>
                  {col.badge}
                </span>
              </div>
              <h4 className="font-semibold text-white text-sm mb-1 group-hover:text-emerald-300 transition-colors">{col.name}</h4>
              <p className="text-slate-600 text-xs mb-3">📍 {col.city}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {col.courses.map(c => (
                  <span key={c} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400">{c}</span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-emerald-400">₹{col.fees}/yr</span>
                <Link href={`/admission/colleges/${col.slug}`} className="text-[10px] text-slate-500 hover:text-emerald-400 transition-colors">Details →</Link>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link href="/admission/colleges" className="text-sm text-emerald-400 hover:text-emerald-300 sm:hidden">
            Sab colleges dekho →
          </Link>
        </div>
      </section>

      {/* ── WHY TRUST ────────────────────────────────────────────────────── */}
      <section className="px-4 py-16 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-emerald-950/40 via-slate-950 to-emerald-950/40 border border-emerald-900/30 rounded-3xl p-8 md:p-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">EduCrush Pe Kyun Trust Karein?</h2>
          <p className="text-slate-500 text-center text-sm mb-10">10,000+ students already use EduCrush for notes, projects, and now — admission guidance</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '🆓', title: 'Bilkul Free', desc: 'Koi hidden charges nahi. Counseling, comparison, sab free hai.' },
              { icon: '📱', title: 'WhatsApp Support', desc: '24 ghante mein personal reply milega. Koi bhi sawaal puch sakte ho.' },
              { icon: '✅', title: '2025 Updated', desc: 'Fees, cutoffs, aur placements — sab latest data ke saath.' },
            ].map(f => (
              <div key={f.title} className="text-center">
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-white mb-1">{f.title}</h3>
                <p className="text-slate-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── COUNSELING FORM ──────────────────────────────────────────────── */}
      <section id="counseling-form" className="px-4 py-20 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Glow behind form */}
          <div className="absolute -inset-4 bg-emerald-500/5 rounded-3xl blur-2xl pointer-events-none" />

          <div className="relative bg-slate-950 border border-slate-800 rounded-3xl p-6 md:p-10">
            <div className="text-center mb-8">
              <span className="text-xs text-emerald-400 border border-emerald-900/60 bg-emerald-950/30 px-3 py-1 rounded-full">Free Counseling</span>
              <h2 className="text-2xl md:text-3xl font-bold mt-4 mb-2">Apni Details Bharo</h2>
              <p className="text-slate-500 text-sm">2 minute mein form complete karo — hum WhatsApp pe guide karenge</p>
            </div>
            <AdmissionForm />
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER DIVIDER ───────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 mb-10">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-emerald-700/30 to-transparent" />
      </div>
    </main>
  )
}