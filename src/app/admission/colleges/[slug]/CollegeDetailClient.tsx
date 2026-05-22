'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'

type College = {
  id: string; name: string; slug: string; city: string; state: string
  fees_min: number; fees_max: number; nirf_rank?: number; courses: string[]
  placement_avg?: number; hostel_available: boolean; established?: number
  description?: string; website?: string; badge?: string
  logo_url?: string; hero_image?: string; images?: string[]
}

const BADGE_STYLES: Record<string, string> = {
  'NIRF Ranked':     'bg-emerald-950/80 border-emerald-700/60 text-emerald-300',
  'Top Placement':   'bg-blue-950/80    border-blue-700/60    text-blue-300',
  'Budget Friendly': 'bg-slate-900      border-slate-600      text-slate-200',
  'Premium':         'bg-teal-950/80    border-teal-700/60    text-teal-300',
}

// ── Quick Apply Modal ─────────────────────────────────────────────────────────
function ApplyForm({ collegeName, onClose }: { collegeName: string; onClose: () => void }) {
  const [form, setForm] = useState({ name: '', phone: '', marks: '', course: '', state: 'Bihar' })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.marks || !form.course) return
    setLoading(true)
    await supabase.from('admission_leads').insert({
      name: form.name, phone: form.phone, marks_12th: parseInt(form.marks),
      preferred_course: form.course, preferred_city: collegeName, status: 'new',
    })
    setLoading(false); setDone(true)
  }

  const states = ['Bihar', 'Jharkhand', 'UP', 'Uttarakhand', 'Other']

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.92, opacity: 0, y: 24 }} animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 12 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl">
        {done ? (
          <div className="text-center py-8">
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5 }} className="text-6xl mb-4">🎉</motion.div>
            <h3 className="text-xl font-black text-emerald-400 mb-2">Request Submitted!</h3>
            <p className="text-slate-400 text-sm mb-2">Our counselor will call you within <strong className="text-white">24 hours</strong> on WhatsApp.</p>
            {form.state === 'Bihar' && (
              <p className="text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-900/40 rounded-xl px-4 py-2 mt-3">
                🏛️ DRCC Bihar loan eligibility check included — free!
              </p>
            )}
            <button onClick={onClose} className="mt-6 px-8 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm transition-all">Close</button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-black text-white text-lg">Free Counseling</h3>
                <p className="text-emerald-400 text-xs mt-0.5 truncate max-w-[240px]">{collegeName}</p>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-all text-sm">✕</button>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Full Name *', key: 'name', placeholder: 'Rahul Kumar', type: 'text' },
                { label: 'WhatsApp Number *', key: 'phone', placeholder: '9876543210', type: 'tel' },
                { label: '12th Marks (%) *', key: 'marks', placeholder: '75', type: 'number' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs text-slate-400 mb-1.5 block font-semibold">{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={form[f.key as keyof typeof form]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full bg-black/40 border border-slate-800 focus:border-emerald-500 focus:shadow-[0_0_0_3px_rgba(52,211,153,0.08)] rounded-xl px-4 py-3 text-white text-sm outline-none transition-all" />
                </div>
              ))}
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block font-semibold">Preferred Course *</label>
                <select value={form.course} onChange={e => setForm(p => ({ ...p, course: e.target.value }))}
                  className="w-full bg-black/40 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all">
                  <option value="">Select course</option>
                  {['BTech CSE', 'BTech ECE', 'BTech ME', 'BCA', 'MBA', 'Diploma', 'MCA'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block font-semibold">Your Home State</label>
                <div className="flex flex-wrap gap-1.5">
                  {states.map(s => (
                    <button key={s} onClick={() => setForm(p => ({ ...p, state: s }))}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${form.state === s ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold' : 'bg-black/40 border-slate-800 text-slate-400 hover:border-slate-600'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              {form.state === 'Bihar' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  className="bg-emerald-950/30 border border-emerald-900/40 rounded-xl p-3 text-xs text-emerald-300 flex gap-2">
                  <span>🏛️</span><span>DRCC Bihar loan check will be included — free!</span>
                </motion.div>
              )}
              <button onClick={handleSubmit} disabled={loading || !form.name || !form.phone || !form.marks || !form.course}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-sm transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100 mt-1">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="inline-block w-4 h-4 border-2 border-black/30 border-t-black rounded-full" />
                    Submitting...
                  </span>
                ) : '🚀 Get Free Counseling'}
              </button>
              <p className="text-center text-xs text-slate-600">🔒 100% Free · No spam ever</p>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}

// ── Gallery Lightbox ──────────────────────────────────────────────────────────
function Lightbox({ images, index, onClose }: { images: string[]; index: number; onClose: () => void }) {
  const [current, setCurrent] = useState(index)
  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
        <img src={images[current]} alt={`Campus ${current + 1}`} className="w-full max-h-[75vh] object-contain rounded-2xl" />
        <div className="flex items-center justify-between mt-4">
          <button onClick={() => setCurrent(p => Math.max(0, p - 1))} disabled={current === 0}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30 text-sm transition-all">← Prev</button>
          <span className="text-slate-500 text-sm">{current + 1} / {images.length}</span>
          <button onClick={() => setCurrent(p => Math.min(images.length - 1, p + 1))} disabled={current === images.length - 1}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30 text-sm transition-all">Next →</button>
        </div>
      </motion.div>
      <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-900/80 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white text-lg transition-all">✕</button>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function CollegeDetailClient({ college }: { college: College }) {
  const [showForm, setShowForm] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const stats = [
    { label: 'Annual Fees',    value: `₹${(college.fees_min / 1000).toFixed(0)}k – ₹${(college.fees_max / 1000).toFixed(0)}k`, icon: '💰' },
    { label: 'NIRF Rank',      value: college.nirf_rank ? `#${college.nirf_rank}` : 'N/A',                                       icon: '🏆' },
    { label: 'Avg Placement',  value: college.placement_avg ? `₹${college.placement_avg}L/yr` : 'N/A',                           icon: '💼' },
    { label: 'Hostel',         value: college.hostel_available ? '✓ Available' : '✗ N/A',                                        icon: '🏠' },
  ]

  const hasHeroImage = !!college.hero_image
  const hasImages    = !!(college.images && college.images.length > 0)

  return (
    <main className="min-h-screen bg-black text-white">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[70vh] flex flex-col justify-end overflow-hidden">

        {/* Background — hero image OR gradient fallback */}
        {hasHeroImage ? (
          <>
            <div className="absolute inset-0">
              <img src={college.hero_image!} alt={college.name}
                className="w-full h-full object-cover" />
              {/* dark overlays for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
            </div>
          </>
        ) : (
          <>
            {/* no image — rich gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-black to-emerald-950/30" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(52,211,153,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(52,211,153,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
            <div className="absolute top-1/3 left-1/3 w-[600px] h-[400px] bg-emerald-500/6 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-teal-400/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
          </>
        )}

        {/* Back button — top left */}
        <div className="absolute top-0 left-0 right-0 pt-20 px-4 md:px-8 z-10">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <Link href="/admission/colleges"
                className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors font-semibold bg-black/30 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full hover:bg-black/50">
                ← Back to Colleges
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Hero content — bottom */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 pb-10 w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6 }}>

            {/* Badge */}
            {college.badge && (
              <span className={`inline-block text-xs px-3 py-1 rounded-full border mb-5 backdrop-blur-sm ${BADGE_STYLES[college.badge] ?? 'bg-slate-900 border-slate-700 text-slate-300'}`}>
                {college.badge}
              </span>
            )}

            {/* Logo + Name row */}
            <div className="flex items-end gap-5 mb-4">
              {/* Logo */}
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl border-2 border-white/20 bg-black/50 backdrop-blur-md flex items-center justify-center text-4xl overflow-hidden flex-shrink-0 shadow-2xl">
                {college.logo_url
                  ? <img src={college.logo_url} alt={college.name} className="w-full h-full object-cover" />
                  : <span>🏛️</span>
                }
              </div>

              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight drop-shadow-lg">
                  {college.name}
                </h1>
                <p className="text-white/70 text-sm mt-2 flex items-center gap-2">
                  <span>📍</span>
                  <span>{college.city}, {college.state}</span>
                  {college.established && (
                    <>
                      <span className="text-white/30">·</span>
                      <span>Est. {college.established}</span>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Description */}
            {college.description && (
              <p className="text-white/60 text-sm max-w-2xl leading-relaxed mb-6">
                {college.description}
              </p>
            )}

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setShowForm(true)}
                className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-sm transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(52,211,153,0.4)] active:scale-95 shadow-lg">
                🎓 Get Free Counseling
              </button>
              {college.website && (
                <a href={college.website} target="_blank" rel="noopener noreferrer"
                  className="px-7 py-3.5 rounded-2xl bg-black/40 backdrop-blur-sm border border-white/20 hover:border-white/40 text-white font-semibold text-sm text-center transition-all hover:bg-black/60">
                  Official Website ↗
                </a>
              )}
              <Link href={`/admission/colleges/compare?colleges=${college.id}`}
                className="px-7 py-3.5 rounded-2xl bg-black/40 backdrop-blur-sm border border-white/10 hover:border-white/30 text-white/70 hover:text-white font-semibold text-sm text-center transition-all">
                + Compare
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────────── */}
      <section className="px-4 max-w-5xl mx-auto -mt-1 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.07 }}
              className="bg-slate-950 border border-slate-800 hover:border-emerald-800/50 rounded-2xl p-4 md:p-5 transition-all group">
              <div className="text-2xl mb-2">{s.icon}</div>
              <p className="text-xs text-slate-500 mb-1">{s.label}</p>
              <p className={`font-black text-base md:text-lg ${s.label === 'Hostel' && college.hostel_available ? 'text-emerald-400' : 'text-white'}`}>{s.value}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── COURSES ───────────────────────────────────────────────────────── */}
      <section className="px-4 pb-12 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-slate-950 border border-slate-800 rounded-3xl p-6 md:p-8">
          <h2 className="text-xl font-black text-white mb-6">Courses Offered</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {college.courses.map((course, i) => (
              <motion.div key={course} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 bg-black/40 border border-slate-800 hover:border-emerald-800/50 rounded-xl p-3.5 transition-all group">
                <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-900/40 flex items-center justify-center text-sm flex-shrink-0">🎓</div>
                <span className="text-sm text-slate-300 group-hover:text-emerald-300 transition-colors font-semibold">{course}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── CAMPUS GALLERY ────────────────────────────────────────────────── */}
      {hasImages && (
        <section className="px-4 pb-12 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-slate-950 border border-slate-800 rounded-3xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-white">Campus Gallery</h2>
              <span className="text-xs text-slate-500 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full">
                {college.images!.length} photos
              </span>
            </div>
            {/* Bento-style grid */}
            <div className={`grid gap-3 ${college.images!.length >= 4 ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2'}`}>
              {college.images!.map((img, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                  onClick={() => setLightboxIndex(i)}
                  className={`relative rounded-2xl overflow-hidden border border-slate-800 hover:border-emerald-700/50 transition-all group cursor-pointer
                    ${i === 0 && college.images!.length >= 3 ? 'md:col-span-2 aspect-[16/7]' : 'aspect-video'}`}>
                  <img src={img} alt={`${college.name} campus ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                    <div className="bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs text-white font-semibold">🔍 View</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* ── FEES ──────────────────────────────────────────────────────────── */}
      <section className="px-4 pb-12 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-slate-950 border border-slate-800 rounded-3xl p-6 md:p-8">
          <h2 className="text-xl font-black text-white mb-6">Fee Structure</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-2xl p-5">
              <p className="text-xs text-emerald-500 mb-1">Minimum Fees</p>
              <p className="text-3xl font-black text-emerald-400">₹{(college.fees_min / 1000).toFixed(0)}k</p>
              <p className="text-xs text-slate-500 mt-1">per year</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
              <p className="text-xs text-slate-400 mb-1">Maximum Fees</p>
              <p className="text-3xl font-black text-white">₹{(college.fees_max / 1000).toFixed(0)}k</p>
              <p className="text-xs text-slate-500 mt-1">per year</p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-black/30 rounded-xl border border-slate-900">
            <p className="text-xs text-slate-500">💡 Fees include tuition, exam, and development charges. Hostel and transport are billed separately.</p>
          </div>
          <div className="mt-4 p-4 bg-emerald-950/20 border border-emerald-900/30 rounded-xl">
            <p className="text-xs text-emerald-400 font-bold mb-1">🏛️ Bihar Students — DRCC Loan Available</p>
            <p className="text-xs text-slate-400">
              Bihar government education loan up to ₹4L at just 1% interest.{' '}
              <a href="/admission#counseling-form" className="text-emerald-400 underline hover:text-emerald-300">Check eligibility free →</a>
            </p>
          </div>
        </motion.div>
      </section>

      {/* ── BOTTOM CTA ────────────────────────────────────────────────────── */}
      <section className="px-4 pb-24 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative bg-gradient-to-r from-emerald-950/40 via-slate-950 to-emerald-950/40 border border-emerald-900/30 rounded-3xl p-8 md:p-14 text-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(52,211,153,0.06)_0%,transparent_70%)] pointer-events-none" />
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3">Want to Join {college.name}?</h2>
          <p className="text-slate-400 text-sm mb-8 max-w-md mx-auto leading-relaxed">
            Get free counseling — fees, eligibility, and document guidance delivered on WhatsApp within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => setShowForm(true)}
              className="px-10 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-sm transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(52,211,153,0.3)] active:scale-95">
              🎓 Get Free Counseling
            </button>
            <Link href="/admission/colleges"
              className="px-10 py-4 rounded-2xl border border-slate-700 hover:border-emerald-700/50 text-slate-300 hover:text-emerald-300 font-semibold text-sm transition-all text-center">
              Browse More Colleges
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Modals */}
      <AnimatePresence>
        {showForm && <ApplyForm collegeName={college.name} onClose={() => setShowForm(false)} />}
        {lightboxIndex !== null && college.images && (
          <Lightbox images={college.images} index={lightboxIndex} onClose={() => setLightboxIndex(null)} />
        )}
      </AnimatePresence>
    </main>
  )
}
