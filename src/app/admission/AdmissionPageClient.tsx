'use client'
// ✅ Ye file hai: app/admission/AdmissionPageClient.tsx
// Saara client side code yahan hai — page.tsx sirf metadata export karta hai

import { useState, useEffect, useRef, useMemo } from 'react'
import Link from 'next/link'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { submitAdmissionLead } from '@/lib/admissionService'

function Particles() {
  const [particles, setParticles] = useState<Array<{
    width: number; height: number; left: string; top: string;
    duration: number; delay: number; color: string;
  }>>([])

  useEffect(() => {
    setParticles(
      Array.from({ length: 24 }).map((_, i) => ({
        width: Math.random() * 4 + 1,
        height: Math.random() * 4 + 1,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: 4 + Math.random() * 4,
        delay: Math.random() * 5,
        color: i % 3 === 0 ? '#34d399' : i % 3 === 1 ? '#6ee7b7' : '#a7f3d0',
      }))
    )
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <motion.div key={i} className="absolute rounded-full"
          style={{ width: p.width, height: p.height, left: p.left, top: p.top, background: p.color }}
          animate={{ y: [0, -35, 0], opacity: [0.2, 0.9, 0.2], scale: [1, 1.5, 1] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
    let start = 0; const step = to / 60
    const timer = setInterval(() => {
      start += step
      if (start >= to) { setCount(to); clearInterval(timer) } else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [inView, to])
  return <span ref={ref}>{count}{suffix}</span>
}

function BiharBanner() {
  const [visible, setVisible] = useState(true)
  if (!visible) return null
  return (
    <motion.div initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, type: 'spring', stiffness: 280 }}
      className="relative z-50 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-black">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-lg">🏛️</span>
          <span className="font-black text-sm">Bihar Govt Scheme:</span>
          <span className="font-semibold text-sm">DRCC Bihar — Education Loan up to ₹4 Lakh @ just 1% interest</span>
          <a href="#counseling-form" className="text-xs bg-black/20 hover:bg-black/30 px-3 py-1 rounded-full font-black transition-all">Check Eligibility Free →</a>
        </div>
        <button onClick={() => setVisible(false)} className="text-black/50 hover:text-black text-lg ml-auto">✕</button>
      </div>
    </motion.div>
  )
}

function AdmissionForm() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ name: '', phone: '', marks: '', course: '', city: '', state: 'Bihar' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const inView = useInView(formRef, { once: true })

  useEffect(() => {
    if (inView) { setTimeout(() => setFocused('name'), 600); setTimeout(() => setFocused(null), 2200) }
  }, [inView])

  const courses = ['BTech CSE', 'BTech ECE', 'BTech ME', 'BCA', 'Diploma', 'MBA', 'MCA', 'Other']
  const cities = ['Dehradun', 'Delhi', 'Noida', 'Any']
  const states = ['Bihar', 'Jharkhand', 'Delhi', 'UP', 'Uttarakhand', 'Other']

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.marks || !form.course) return
    setLoading(true)
    const ok = await submitAdmissionLead({
      name: form.name,
      phone: form.phone,
      marks_12th: parseInt(form.marks),
      preferred_course: form.course,
      preferred_city: form.city,
      student_state: form.state,
    })
    setLoading(false)
    if (ok) setSubmitted(true)
  }

  const inputClass = (field: string) => `w-full bg-black/60 border rounded-xl px-4 py-3.5 text-white text-sm placeholder-slate-600 outline-none transition-all duration-300 ${focused === field ? 'border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.25)] bg-emerald-950/20' : 'border-slate-800 hover:border-slate-600 focus:border-emerald-500'}`

  if (submitted) return (
    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-10">
      <motion.div animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.3, 1] }} transition={{ duration: 0.7 }} className="text-6xl mb-4">🎉</motion.div>
      <h3 className="text-2xl font-black text-emerald-400 mb-2">Application Submitted!</h3>
      <p className="text-slate-300 text-sm mb-1">Our counselor will contact you within <strong className="text-white">24 hours</strong> on WhatsApp.</p>
      {form.state === 'Bihar' && <p className="text-emerald-400 text-xs mt-3 bg-emerald-950/30 border border-emerald-900/40 rounded-xl px-4 py-2">We'll also check your DRCC Bihar loan eligibility for free!</p>}
    </motion.div>
  )

  return (
    <div ref={formRef}>
      <div className="flex gap-2 mb-6">
        {['Your Info', 'Preferences', 'Confirm'].map((s, i) => (
          <div key={i} className="flex-1">
            <div className={`h-1.5 rounded-full transition-all duration-500 ${step >= i ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-slate-800'}`} />
            <p className={`text-[10px] mt-1.5 transition-colors font-semibold ${step >= i ? 'text-emerald-400' : 'text-slate-700'}`}>{s}</p>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="s0" initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -40, opacity: 0 }} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block font-semibold">Full Name *</label>
              <input className={inputClass('name')} placeholder="e.g. Akhil Singh" value={form.name} onFocus={() => setFocused('name')} onBlur={() => setFocused(null)} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} autoFocus />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block font-semibold">WhatsApp Number *</label>
              <input className={inputClass('phone')} placeholder="10-digit number" value={form.phone} onFocus={() => setFocused('phone')} onBlur={() => setFocused(null)} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} type="tel" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block font-semibold">12th Percentage *</label>
              <input className={inputClass('marks')} placeholder="e.g. 75" value={form.marks} onFocus={() => setFocused('marks')} onBlur={() => setFocused(null)} onChange={e => setForm(f => ({ ...f, marks: e.target.value }))} type="number" min="0" max="100" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-2 block font-semibold">Your Home State</label>
              <div className="flex gap-2 flex-wrap">
                {states.map(s => (
                  <button key={s} onClick={() => setForm(f => ({ ...f, state: s }))}
                    className={`py-1.5 px-3 rounded-full text-xs border transition-all ${form.state === s ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold' : 'bg-black/40 border-slate-800 text-slate-400 hover:border-slate-600'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            {form.state === 'Bihar' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                className="bg-emerald-950/30 border border-emerald-900/40 rounded-xl p-3 text-xs text-emerald-300 flex gap-2">
                <span>✨</span>
                <span>Great! You may qualify for <strong>DRCC Bihar Education Loan</strong> — our counselor will guide you for free.</span>
              </motion.div>
            )}
            <button onClick={() => form.name && form.phone && form.marks && setStep(1)} disabled={!form.name || !form.phone || !form.marks}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-sm transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 shadow-lg hover:shadow-emerald-500/30">
              Continue →
            </button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="s1" initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -40, opacity: 0 }} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 mb-2 block font-semibold">Preferred Course *</label>
              <div className="grid grid-cols-2 gap-2">
                {courses.map(c => (
                  <button key={c} onClick={() => setForm(f => ({ ...f, course: c }))}
                    className={`py-3 px-3 rounded-xl text-sm border transition-all text-left font-semibold ${form.course === c ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300' : 'bg-black/40 border-slate-800 text-slate-400 hover:border-slate-600'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-2 block font-semibold">Preferred City</label>
              <div className="flex flex-wrap gap-2">
                {cities.map(c => (
                  <button key={c} onClick={() => setForm(f => ({ ...f, city: c }))}
                    className={`py-1.5 px-3 rounded-full text-xs border transition-all ${form.city === c ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300 font-bold' : 'bg-black/40 border-slate-800 text-slate-400 hover:border-slate-600'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(0)} className="flex-1 py-3 rounded-xl border border-slate-800 text-slate-400 text-sm hover:border-slate-600 transition-all">← Back</button>
              <button onClick={() => form.course && setStep(2)} disabled={!form.course}
                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-sm transition-all hover:scale-[1.02] disabled:opacity-40 disabled:scale-100">
                Next →
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="s2" initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -40, opacity: 0 }} className="space-y-4">
            <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-xl p-4 space-y-2.5">
              <p className="text-xs text-emerald-400 font-black uppercase tracking-widest mb-3">Your Summary</p>
              {[['Name', form.name], ['Phone', form.phone], ['12th Marks', form.marks + '%'], ['Course', form.course], ['City', form.city || 'Any'], ['State', form.state]].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="text-slate-500">{k}</span>
                  <span className="text-white font-semibold">{v}</span>
                </div>
              ))}
            </div>
            {form.state === 'Bihar' && (
              <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-xl p-3 flex gap-2">
                <span className="text-emerald-400 text-lg">🏛️</span>
                <div>
                  <p className="text-xs text-emerald-400 font-black">DRCC Bihar Loan Check Included</p>
                  <p className="text-xs text-slate-500 mt-0.5">Counselor will check your eligibility for ₹4L @ 1% loan</p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-2 text-xs text-slate-600 bg-slate-900/50 p-3 rounded-xl">
              <span className="text-emerald-500 mt-0.5">🔒</span>
              <span>100% Free. No spam. Only one WhatsApp call from our counselor.</span>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl border border-slate-800 text-slate-400 text-sm hover:border-slate-600 transition-all">← Edit</button>
              <button onClick={handleSubmit} disabled={loading}
                className="flex-1 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-sm transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 shadow-xl hover:shadow-emerald-500/40">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="inline-block w-4 h-4 border-2 border-black/30 border-t-black rounded-full" />
                    Submitting...
                  </span>
                ) : '🚀 Get Free Counseling'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const SAMPLE_COLLEGES = [
  { name: 'Graphic Era University', city: 'Dehradun', courses: ['BTech', 'BCA'], fees: '80k–1.5L', badge: 'NIRF Ranked', slug: 'graphic-era-university', logo_url: '' },
  { name: 'DIT University', city: 'Dehradun', courses: ['BTech', 'MBA'], fees: '70k–1.2L', badge: 'Good Placement', slug: 'dit-university', logo_url: '' },
  { name: 'Amity University', city: 'Noida', courses: ['BTech', 'BCA', 'MBA'], fees: '1.2L–2L', badge: 'Premium', slug: 'amity-university-noida', logo_url: '' },
  { name: 'Sharda University', city: 'Delhi NCR', courses: ['BTech', 'BCA', 'Diploma'], fees: '80k–1.4L', badge: 'Budget Friendly', slug: 'sharda-university', logo_url: '' },
]
const BADGE_STYLES: Record<string, string> = {
  'NIRF Ranked': 'bg-emerald-950/60 border-emerald-800/60 text-emerald-400',
  'Good Placement': 'bg-blue-950/60 border-blue-800/60 text-blue-400',
  'Premium': 'bg-teal-950/60 border-teal-800/60 text-teal-400',
  'Budget Friendly': 'bg-slate-900 border-slate-700 text-slate-300',
}

function BiharLoanSection() {
  return (
    <section className="px-4 py-20 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="relative overflow-hidden bg-gradient-to-br from-emerald-950/50 via-slate-950 to-teal-950/30 border border-emerald-800/40 rounded-3xl p-8 md:p-12">
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-400/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">🏛️</span>
            <span className="text-xs font-black text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-full uppercase tracking-widest">Bihar Government Scheme</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black mt-2 mb-2 text-white">DRCC Bihar Education Loan</h2>
          <p className="text-emerald-400 text-xl font-bold mb-4">Study Without Financial Stress</p>
          <p className="text-slate-400 text-base max-w-xl mb-8 leading-relaxed">
            Bihar government offers education loans up to <strong className="text-white">₹4 Lakh at just 1% interest</strong> for Bihar students. No collateral needed for loans under ₹1.5 lakh.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { icon: '💰', title: 'Up to ₹4 Lakh', desc: 'Covers tuition, hostel & books' },
              { icon: '📉', title: '1% Interest Only', desc: 'Far below any bank loan rate' },
              { icon: '🪙', title: 'No Collateral', desc: 'Loans up to ₹1.5L without guarantee' },
            ].map(item => (
              <div key={item.title} className="bg-black/40 border border-emerald-900/30 rounded-2xl p-5">
                <div className="text-3xl mb-2">{item.icon}</div>
                <h4 className="font-black text-white text-sm mb-1">{item.title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-2xl p-4 mb-6">
            <p className="text-xs font-bold text-emerald-400 mb-3">✅ Who Can Apply?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-400">
              {['Bihar domicile — permanent resident of Bihar', 'Passed 10th/12th from a recognized board', 'Admission in any recognized institute in India', 'Family income below ₹3 Lakh (for full subsidy)'].map(t => (
                <div key={t} className="flex gap-2"><span className="text-emerald-500 flex-shrink-0">→</span>{t}</div>
              ))}
            </div>
          </div>
          <a href="#counseling-form" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-black text-sm hover:from-emerald-400 hover:to-teal-300 transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(52,211,153,0.35)] active:scale-95">
            Check My Eligibility — Free →
          </a>
        </div>
      </motion.div>
    </section>
  )
}

export function AdmissionPageClient() {
  const statsRef = useRef(null)
  const statsInView = useInView(statsRef, { once: true })
  const stats = [
    { label: 'Colleges Listed', value: 50, suffix: '+' },
    { label: 'Free Counseling', value: 100, suffix: '%' },
    { label: 'Students Helped', value: 2000, suffix: '+' },
    { label: 'Bihar Students', value: 800, suffix: '+' },
  ]

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <BiharBanner />

      <section className="relative min-h-screen flex items-center px-4 pt-16 pb-12 overflow-hidden">
        <Particles />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(52,211,153,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(52,211,153,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-teal-400/4 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/50 border border-emerald-800/60 text-emerald-400 text-xs font-bold mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Admissions 2026 Open — Dehradun · Delhi · Pan India
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}
              className="text-4xl sm:text-5xl xl:text-6xl font-black leading-[1.1] tracking-tight">
              Find Your{' '}
              <span className="relative">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-300 to-teal-400">Perfect College</span>
                <motion.span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.9, duration: 0.6 }} />
              </span>
              <br /><span className="text-slate-300">100% Free Guidance</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              className="text-slate-400 mt-5 text-base md:text-lg leading-relaxed max-w-lg">
              Compare top colleges in Dehradun, Delhi & across India for BTech, BCA, Diploma. Get fee details, placement records, and free counseling on WhatsApp within 24 hours.
            </motion.p>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
              className="mt-6 bg-emerald-950/30 border border-emerald-800/50 rounded-2xl p-4 max-w-lg">
              <div className="flex gap-3 items-start">
                <span className="text-2xl">🎯</span>
                <div>
                  <p className="text-emerald-400 font-black text-sm">Special for Bihar Students</p>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">We help you apply for <strong className="text-white">DRCC Bihar loan (₹4L @ 1%)</strong> along with college admissions — completely free.</p>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="flex flex-wrap gap-3 mt-8">
              {[{ icon: '🆓', text: 'Zero Cost' }, { icon: '📱', text: 'WhatsApp Support' }, { icon: '✅', text: '2026 Updated' }, { icon: '🏛️', text: 'Bihar Loan Help' }].map(t => (
                <span key={t.text} className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full">{t.icon} {t.text}</span>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-2">
                {['🧑', '👩', '👦', '👧', '🧒'].map((e, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-slate-800 border-2 border-black flex items-center justify-center text-sm">{e}</div>
                ))}
              </div>
              <p className="text-xs text-slate-500"><strong className="text-white">2,000+</strong> students guided this year</p>
            </motion.div>
          </div>

          <motion.div id="counseling-form" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }} className="relative">
            <div className="absolute -inset-6 bg-emerald-500/6 rounded-3xl blur-2xl pointer-events-none" />
            <div className="relative bg-slate-950 border border-slate-800 hover:border-emerald-900/50 transition-colors duration-500 rounded-3xl p-6 md:p-8">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-emerald-400 bg-emerald-950/50 border border-emerald-900/60 px-3 py-1 rounded-full uppercase tracking-wider">Free Counseling</span>
                  <span className="text-xs text-slate-600">Takes 2 minutes</span>
                </div>
                <h2 className="text-xl font-black text-white mt-4 mb-1">Start Your College Journey</h2>
                <p className="text-slate-500 text-xs leading-relaxed">Fill in your details and a counselor will call you on WhatsApp with personalized guidance.</p>
              </div>
              <AdmissionForm />
            </div>
          </motion.div>
        </div>
      </section>

      <section ref={statsRef} className="px-4 py-16 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 30 }} animate={statsInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group bg-slate-950 border border-slate-800 hover:border-emerald-800/60 rounded-2xl p-6 text-center transition-all duration-300 hover:bg-emerald-950/10">
              <div className="text-3xl md:text-4xl font-black text-emerald-400 mb-1">
                {statsInView ? <Counter to={s.value} suffix={s.suffix} /> : '0'}
              </div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <BiharLoanSection />

      <section className="px-4 py-16 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="text-xs text-emerald-400 border border-emerald-900/60 bg-emerald-950/30 px-3 py-1 rounded-full font-bold uppercase tracking-wider">Courses</span>
          <h2 className="text-3xl md:text-4xl font-black mt-4 mb-3">Which Course is Right for You?</h2>
          <p className="text-slate-500 max-w-lg mx-auto text-sm">Explore scope, fee ranges, and career paths</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'BTech CSE', icon: '💻', desc: 'Software, AI/ML, web development', fees: '80k–1.5L/yr', demand: 'Very High' },
            { name: 'BTech ECE', icon: '📡', desc: 'Electronics, IoT, VLSI design', fees: '70k–1.2L/yr', demand: 'High' },
            { name: 'BCA', icon: '🖥️', desc: 'Programming, web apps, IT jobs', fees: '30k–60k/yr', demand: 'High' },
            { name: 'Diploma', icon: '🔧', desc: '3-year fast-track technical course', fees: '15k–35k/yr', demand: 'Medium' },
          ].map((c, i) => (
            <motion.div key={c.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -6, scale: 1.02 }}
              className="group bg-slate-950 border border-slate-800 hover:border-emerald-700/40 rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_20px_60px_rgba(52,211,153,0.08)]">
              <div className="text-4xl mb-4">{c.icon}</div>
              <h3 className="font-black text-white text-lg mb-1">{c.name}</h3>
              <p className="text-slate-500 text-xs mb-4">{c.desc}</p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-slate-600">Fees/yr</span><span className="text-slate-300 font-semibold">{c.fees}</span></div>
                <div className="flex justify-between"><span className="text-slate-600">Demand</span><span className="text-emerald-400 font-bold">{c.demand}</span></div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-4 py-16 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <span className="text-xs text-emerald-400 border border-emerald-900/60 bg-emerald-950/30 px-3 py-1 rounded-full font-bold uppercase tracking-wider">Top Colleges</span>
            <h2 className="text-3xl font-black mt-3">Top Colleges — Dehradun & Delhi</h2>
          </div>
          <Link href="/admission/colleges" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors hidden sm:block font-semibold">View All →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SAMPLE_COLLEGES.map((col, i) => (
            <motion.div key={col.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={{ y: -4 }}
              className="bg-slate-950 border border-slate-800 hover:border-emerald-700/40 rounded-2xl p-5 transition-all duration-300 group">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-900/60 to-slate-900 border border-emerald-900/40 flex items-center justify-center text-xl overflow-hidden">
                  {col.logo_url ? <img src={col.logo_url} alt={col.name} className="w-full h-full object-cover rounded-xl" /> : '🏛️'}
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${BADGE_STYLES[col.badge] ?? 'bg-slate-900 border-slate-700 text-slate-400'}`}>{col.badge}</span>
              </div>
              <h4 className="font-black text-white text-sm mb-1 group-hover:text-emerald-300 transition-colors">{col.name}</h4>
              <p className="text-slate-600 text-xs mb-3">📍 {col.city}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {col.courses.map(c => <span key={c} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400">{c}</span>)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-emerald-400 font-bold">₹{col.fees}/yr</span>
                <Link href={`/admission/colleges/${col.slug}`} className="text-[10px] text-slate-500 hover:text-emerald-400 transition-colors">Details →</Link>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link href="/admission/colleges" className="text-sm text-emerald-400 hover:text-emerald-300 sm:hidden font-semibold">View all colleges →</Link>
        </div>
      </section>

      <section className="px-4 py-16 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="bg-gradient-to-r from-emerald-950/40 via-slate-950 to-emerald-950/40 border border-emerald-900/30 rounded-3xl p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-black text-center mb-2">Why Trust EduCrush?</h2>
          <p className="text-slate-500 text-center text-sm mb-10">10,000+ students already use EduCrush for notes, projects, and now — admission guidance</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '🆓', title: 'Completely Free', desc: 'No hidden charges — counseling, comparisons, and loan guidance all free.' },
              { icon: '📱', title: 'WhatsApp Support', desc: 'Personal reply within 24 hours. Ask anything about colleges or loans.' },
              { icon: '🏛️', title: 'DRCC Bihar Loan Help', desc: 'We help Bihar students apply for government loan at just 1% interest.' },
            ].map(f => (
              <div key={f.title} className="text-center">
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="font-black text-white mb-1">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="px-4 pb-20 max-w-2xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h3 className="text-2xl font-black mb-3">Still Thinking?</h3>
          <p className="text-slate-500 text-sm mb-6">Talk to our counselor — no commitment, no cost, just honest guidance.</p>
          <a href="#counseling-form" className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-black text-sm hover:from-emerald-400 hover:to-teal-300 transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(52,211,153,0.35)] active:scale-95">
            Get Free Counseling Now →
          </a>
        </motion.div>
      </section>

      <div className="max-w-6xl mx-auto px-4 mb-10">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-emerald-700/30 to-transparent" />
      </div>
    </main>
  )
}