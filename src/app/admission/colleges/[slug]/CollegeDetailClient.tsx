'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'

type College = {
  id: string
  name: string
  slug: string
  city: string
  state: string
  fees_min: number
  fees_max: number
  nirf_rank?: number
  courses: string[]
  placement_avg?: number
  hostel_available: boolean
  established?: number
  description?: string
  website?: string
  badge?: string
}

const BADGE_STYLES: Record<string, string> = {
  'NIRF Ranked':     'bg-emerald-950/60 border-emerald-800/60 text-emerald-400',
  'Top Placement':   'bg-blue-950/60 border-blue-800/60 text-blue-400',
  'Budget Friendly': 'bg-slate-900 border-slate-700 text-slate-300',
  'Premium':         'bg-amber-950/60 border-amber-800/60 text-amber-400',
}

// ── Quick Apply Form ──────────────────────────────────────────────────────────
function ApplyForm({ collegeName, onClose }: { collegeName: string; onClose: () => void }) {
  const [form, setForm] = useState({ name: '', phone: '', marks: '', course: '' })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.marks || !form.course) return
    setLoading(true)
    await supabase.from('admission_leads').insert({
      name: form.name,
      phone: form.phone,
      marks_12th: parseInt(form.marks),
      preferred_course: form.course,
      preferred_city: collegeName,
      status: 'new',
    })
    setLoading(false)
    setDone(true)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-md p-6"
      >
        {done ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-xl font-bold text-emerald-400 mb-2">Request Submitted!</h3>
            <p className="text-slate-400 text-sm mb-6">Hum 24 ghante mein WhatsApp pe contact karenge.</p>
            <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-emerald-500 text-black font-semibold text-sm">
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-white text-lg">Free Counseling</h3>
                <p className="text-emerald-400 text-xs mt-0.5">{collegeName}</p>
              </div>
              <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors text-xl">✕</button>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Tumhara naam', key: 'name', placeholder: 'Rahul Kumar', type: 'text' },
                { label: 'WhatsApp number', key: 'phone', placeholder: '9876543210', type: 'tel' },
                { label: '12th marks %', key: 'marks', placeholder: '75', type: 'number' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs text-slate-500 mb-1 block">{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={form[f.key as keyof typeof form]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full bg-black/40 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all"
                  />
                </div>
              ))}
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Course chahiye</label>
                <select
                  value={form.course}
                  onChange={e => setForm(p => ({ ...p, course: e.target.value }))}
                  className="w-full bg-black/40 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all"
                >
                  <option value="">Select course</option>
                  <option value="BTech CSE">BTech CSE</option>
                  <option value="BTech ECE">BTech ECE</option>
                  <option value="BCA">BCA</option>
                  <option value="MBA">MBA</option>
                  <option value="Diploma">Diploma</option>
                </select>
              </div>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm transition-all hover:scale-[1.02] disabled:opacity-50 mt-2"
              >
                {loading ? 'Bhej rahe hain...' : '🚀 Free Counseling Book Karo'}
              </button>
              <p className="text-center text-xs text-slate-600">🔒 100% Free · No spam</p>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function CollegeDetailClient({ college }: { college: College }) {
  const [showForm, setShowForm] = useState(false)

  const stats = [
    { label: 'Annual Fees', value: `₹${(college.fees_min / 1000).toFixed(0)}k – ₹${(college.fees_max / 1000).toFixed(0)}k` },
    { label: 'NIRF Rank', value: college.nirf_rank ? `#${college.nirf_rank}` : 'N/A' },
    { label: 'Avg Placement', value: college.placement_avg ? `₹${college.placement_avg}L/yr` : 'N/A' },
    { label: 'Hostel', value: college.hostel_available ? '✓ Available' : '✗ Not Available' },
  ]

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Grid bg */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(52,211,153,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(52,211,153,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      {/* Hero */}
      <section className="relative pt-28 pb-16 px-4 max-w-5xl mx-auto">
        {/* Back */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <Link href="/admission/colleges" className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-400 text-sm transition-colors mb-8">
            ← Wapas colleges
          </Link>
        </motion.div>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            {/* Badge */}
            {college.badge && (
              <span className={`inline-block text-xs px-3 py-1 rounded-full border mb-4 ${BADGE_STYLES[college.badge] ?? 'bg-slate-900 border-slate-700 text-slate-400'}`}>
                {college.badge}
              </span>
            )}
            {/* Icon + Name */}
            <div className="flex items-center gap-4 mb-3">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-900/60 to-slate-900 border border-emerald-900/40 flex items-center justify-center text-3xl flex-shrink-0">
                🏛️
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">{college.name}</h1>
                <p className="text-slate-400 text-sm mt-1">📍 {college.city}, {college.state}{college.established ? ` · Est. ${college.established}` : ''}</p>
              </div>
            </div>
            {college.description && (
              <p className="text-slate-400 text-sm max-w-xl mt-4 leading-relaxed">{college.description}</p>
            )}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-3 flex-shrink-0"
          >
            <button
              onClick={() => setShowForm(true)}
              className="px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(52,211,153,0.3)]"
            >
              🎓 Free Counseling Lo
            </button>
            {college.website && (
              <a
                href={college.website}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 rounded-2xl border border-slate-700 hover:border-emerald-700/50 text-slate-300 hover:text-emerald-300 font-semibold text-sm text-center transition-all"
              >
                Official Website ↗
              </a>
            )}
            <Link
              href={`/admission/colleges/compare?colleges=${college.id}`}
              className="px-8 py-3.5 rounded-2xl border border-slate-800 hover:border-slate-600 text-slate-500 hover:text-slate-300 font-semibold text-sm text-center transition-all"
            >
              + Compare karo
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 pb-12 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="bg-slate-950 border border-slate-800 hover:border-emerald-800/40 rounded-2xl p-5 transition-all"
            >
              <p className="text-xs text-slate-500 mb-1">{s.label}</p>
              <p className={`font-bold text-lg ${s.label === 'Hostel' && college.hostel_available ? 'text-emerald-400' : 'text-white'}`}>
                {s.value}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Courses */}
      <section className="px-4 pb-12 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-slate-950 border border-slate-800 rounded-3xl p-6 md:p-8"
        >
          <h2 className="text-xl font-bold text-white mb-6">Courses Offered</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {college.courses.map((course, i) => (
              <motion.div
                key={course}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 bg-black/40 border border-slate-800 hover:border-emerald-800/40 rounded-xl p-3.5 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-900/40 flex items-center justify-center text-sm flex-shrink-0">
                  🎓
                </div>
                <span className="text-sm text-slate-300 group-hover:text-emerald-300 transition-colors font-medium">{course}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Fees Breakdown */}
      <section className="px-4 pb-12 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-slate-950 border border-slate-800 rounded-3xl p-6 md:p-8"
        >
          <h2 className="text-xl font-bold text-white mb-6">Fees Detail</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-2xl p-5">
              <p className="text-xs text-emerald-500 mb-1">Minimum Fees</p>
              <p className="text-3xl font-bold text-emerald-400">₹{(college.fees_min / 1000).toFixed(0)}k</p>
              <p className="text-xs text-slate-500 mt-1">per year</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
              <p className="text-xs text-slate-400 mb-1">Maximum Fees</p>
              <p className="text-3xl font-bold text-white">₹{(college.fees_max / 1000).toFixed(0)}k</p>
              <p className="text-xs text-slate-500 mt-1">per year</p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-black/30 rounded-xl border border-slate-900">
            <p className="text-xs text-slate-500">
              💡 Fees mein tuition, exam, aur basic development charges included hain. Hostel aur transport alag hote hain.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Bottom CTA */}
      <section className="px-4 pb-20 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-r from-emerald-950/40 via-slate-950 to-emerald-950/40 border border-emerald-900/30 rounded-3xl p-8 md:p-12 text-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-emerald-500/3 rounded-3xl pointer-events-none" />
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            {college.name} mein admission lena chahte ho?
          </h2>
          <p className="text-slate-400 text-sm mb-8 max-w-md mx-auto">
            Free counseling lo — fees, eligibility, aur documents sab WhatsApp pe samjhayenge
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setShowForm(true)}
              className="px-10 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(52,211,153,0.3)]"
            >
              🎓 Free Counseling Book Karo
            </button>
            <Link
              href="/admission"
              className="px-10 py-4 rounded-2xl border border-slate-700 hover:border-emerald-700/50 text-slate-300 font-semibold text-sm transition-all text-center"
            >
              Aur colleges dekho
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Apply Modal */}
      <AnimatePresence>
        {showForm && <ApplyForm collegeName={college.name} onClose={() => setShowForm(false)} />}
      </AnimatePresence>
    </main>
  )
}