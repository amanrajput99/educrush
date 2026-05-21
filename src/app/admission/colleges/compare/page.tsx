'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'

type College = {
  id: string; name: string; slug: string; city: string; state: string
  fees_min: number; fees_max: number; nirf_rank?: number; courses: string[]
  placement_avg?: number; hostel_available: boolean; badge?: string
  description?: string; website?: string
}

// ── Apply Modal ───────────────────────────────────────────────────────────────
function ApplyModal({ collegeName, onClose }: { collegeName: string; onClose: () => void }) {
  const [form, setForm] = useState({ name: '', phone: '', marks: '', course: '', state: 'Bihar' })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.marks) return
    setLoading(true)
    await supabase.from('admission_leads').insert({
      name: form.name, phone: form.phone, marks_12th: parseInt(form.marks),
      preferred_course: form.course || 'Not specified', preferred_city: collegeName, status: 'new',
    })
    setLoading(false); setDone(true)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-md p-6">
        {done ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-xl font-black text-emerald-400 mb-2">Request Submitted!</h3>
            <p className="text-slate-400 text-sm mb-2">Counselor will call you within 24 hours on WhatsApp.</p>
            {form.state === 'Bihar' && <p className="text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-900/40 rounded-xl px-4 py-2 mt-2">DRCC Bihar loan check included!</p>}
            <button onClick={onClose} className="mt-6 px-6 py-2.5 rounded-xl bg-emerald-500 text-black font-black text-sm">Close</button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-black text-white">Free Counseling</h3>
                <p className="text-emerald-400 text-xs mt-0.5">{collegeName}</p>
              </div>
              <button onClick={onClose} className="text-slate-500 hover:text-white text-xl">✕</button>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Full Name *', key: 'name', placeholder: 'Rahul Kumar', type: 'text' },
                { label: 'WhatsApp *', key: 'phone', placeholder: '9876543210', type: 'tel' },
                { label: '12th Marks % *', key: 'marks', placeholder: '75', type: 'number' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs text-slate-400 font-semibold mb-1 block">{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={form[f.key as keyof typeof form]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full bg-black/40 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-all" />
                </div>
              ))}
              <div>
                <label className="text-xs text-slate-400 font-semibold mb-1.5 block">Home State</label>
                <div className="flex flex-wrap gap-1.5">
                  {['Bihar', 'Jharkhand', 'UP', 'Uttarakhand', 'Other'].map(s => (
                    <button key={s} onClick={() => setForm(p => ({ ...p, state: s }))}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${form.state === s ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold' : 'bg-black/40 border-slate-800 text-slate-400 hover:border-slate-600'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              {form.state === 'Bihar' && (
                <div className="bg-emerald-950/30 border border-emerald-900/40 rounded-xl p-2.5 text-xs text-emerald-300 flex gap-2">
                  <span>🏛️</span><span>DRCC Bihar loan check included — free!</span>
                </div>
              )}
              <button onClick={handleSubmit} disabled={loading || !form.name || !form.phone || !form.marks}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-sm transition-all disabled:opacity-50">
                {loading ? 'Submitting...' : '🚀 Get Free Counseling'}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}

// ── Compare Row ───────────────────────────────────────────────────────────────
function CompareRow({ label, values, highlight }: {
  label: string; values: (string | boolean | null | undefined)[]; highlight?: boolean
}) {
  const cols = values.length
  return (
    <div className={`grid gap-px ${cols === 2 ? 'grid-cols-[160px_1fr_1fr]' : 'grid-cols-[160px_1fr_1fr_1fr]'} ${highlight ? 'bg-emerald-950/10' : ''}`}>
      <div className="px-4 py-3.5 text-xs text-slate-500 font-semibold flex items-center bg-slate-950/80 border-b border-slate-900">{label}</div>
      {values.map((val, i) => (
        <div key={i} className="px-4 py-3.5 text-sm text-white border-b border-slate-900 flex items-center bg-slate-950/40">
          {typeof val === 'boolean'
            ? <span className={val ? 'text-emerald-400 font-bold' : 'text-slate-600'}>{val ? '✓ Yes' : '✗ No'}</span>
            : <span className={highlight ? 'text-emerald-300 font-bold' : ''}>{val || '—'}</span>
          }
        </div>
      ))}
    </div>
  )
}

// ── College Selector ──────────────────────────────────────────────────────────
function CollegeSelector({ allColleges, selected, onSelect, onClose }: {
  allColleges: College[]; selected: string[]; onSelect: (id: string) => void; onClose: () => void
}) {
  const [search, setSearch] = useState('')
  const filtered = allColleges.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.city.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-lg max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <h3 className="font-black text-white">Select a College</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white text-xl">✕</button>
        </div>
        <div className="p-4 border-b border-slate-800">
          <input type="text" placeholder="Search college..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-black/40 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-all" />
        </div>
        <div className="overflow-y-auto flex-1 p-3">
          {filtered.map(col => {
            const isSelected = selected.includes(col.id)
            return (
              <button key={col.id} onClick={() => onSelect(col.id)} disabled={isSelected}
                className={`w-full text-left p-3.5 rounded-xl mb-1.5 transition-all flex items-center justify-between ${isSelected ? 'bg-emerald-950/40 border border-emerald-800/40 opacity-50 cursor-not-allowed' : 'hover:bg-slate-900 border border-transparent hover:border-slate-800'}`}>
                <div>
                  <p className="text-sm font-semibold text-white">{col.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">📍 {col.city} · ₹{(col.fees_min / 1000).toFixed(0)}k–{(col.fees_max / 1000).toFixed(0)}k/yr</p>
                </div>
                {isSelected && <span className="text-emerald-400 text-xs font-semibold">Already added</span>}
              </button>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ComparePage() {
  const [allColleges, setAllColleges] = useState<College[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [colleges, setColleges] = useState<College[]>([])
  const [loading, setLoading] = useState(true)
  const [showSelector, setShowSelector] = useState(false)
  const [applyCollege, setApplyCollege] = useState<string | null>(null)

  useEffect(() => {
    const fetchColleges = async () => {
      const { data } = await supabase.from('admission_colleges').select('*').eq('published', true).order('nirf_rank')
      setAllColleges((data ?? []) as College[]); setLoading(false)
    }
    fetchColleges()
    const params = new URLSearchParams(window.location.search)
    const ids = params.get('colleges')?.split(',').filter(Boolean) ?? []
    if (ids.length > 0) setSelectedIds(ids)
  }, [])

  useEffect(() => {
    setColleges(allColleges.filter(c => selectedIds.includes(c.id)))
  }, [selectedIds, allColleges])

  const addCollege = (id: string) => { if (selectedIds.length >= 3) return; setSelectedIds(p => [...p, id]); setShowSelector(false) }
  const removeCollege = (id: string) => setSelectedIds(p => p.filter(i => i !== id))
  const colCount = colleges.length

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 bg-[linear-gradient(rgba(52,211,153,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(52,211,153,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      {/* Header */}
      <div className="pt-28 pb-10 px-4 max-w-6xl mx-auto">
        <Link href="/admission/colleges" className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-400 text-sm transition-colors mb-6 font-semibold">
          ← Back to Colleges
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-emerald-400 border border-emerald-900/60 bg-emerald-950/30 px-3 py-1 rounded-full font-bold uppercase tracking-wider">Side-by-Side</span>
            <h1 className="text-3xl md:text-4xl font-black mt-3">Compare Colleges</h1>
            <p className="text-slate-400 text-sm mt-2">Select up to 3 colleges and compare them side-by-side</p>
          </div>
          {colCount < 3 && (
            <button onClick={() => setShowSelector(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-sm transition-all hover:scale-105">
              + Add College
            </button>
          )}
        </div>
      </div>

      {/* Empty */}
      {!loading && colleges.length === 0 && (
        <div className="max-w-6xl mx-auto px-4 pb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-slate-950 border border-slate-800 rounded-3xl p-16 text-center">
            <div className="text-6xl mb-4">🏛️</div>
            <h2 className="text-xl font-black text-white mb-2">No colleges selected yet</h2>
            <p className="text-slate-500 text-sm mb-8">Add colleges to start comparing fees, rankings, and placements</p>
            <button onClick={() => setShowSelector(true)}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-black text-sm transition-all hover:scale-105">
              + Add College
            </button>
          </motion.div>
        </div>
      )}

      {/* Compare Table */}
      {colleges.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 pb-20 overflow-x-auto">
          {/* College headers */}
          <div className={`grid gap-px mb-1 ${colCount === 2 ? 'grid-cols-[160px_1fr_1fr]' : 'grid-cols-[160px_1fr_1fr_1fr]'}`}>
            <div className="bg-transparent" />
            {colleges.map((col, i) => (
              <motion.div key={col.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-slate-950 border border-slate-800 rounded-t-2xl p-5 relative group">
                <button onClick={() => removeCollege(col.id)}
                  className="absolute top-3 right-3 w-6 h-6 rounded-full bg-slate-900 border border-slate-700 text-slate-500 hover:text-red-400 hover:border-red-800 text-xs transition-all opacity-0 group-hover:opacity-100">✕</button>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-900/60 to-slate-900 border border-emerald-900/40 flex items-center justify-center text-xl mb-3">🏛️</div>
                <h3 className="font-black text-white text-sm mb-1">{col.name}</h3>
                <p className="text-slate-500 text-xs">📍 {col.city}</p>
                {col.badge && (
                  <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-400">{col.badge}</span>
                )}
              </motion.div>
            ))}
            {colCount < 3 && (
              <button onClick={() => setShowSelector(true)}
                className="bg-slate-950/40 border border-dashed border-slate-700 hover:border-emerald-700/50 rounded-t-2xl p-5 flex flex-col items-center justify-center gap-2 transition-all group">
                <div className="w-10 h-10 rounded-xl border border-dashed border-slate-700 group-hover:border-emerald-700/50 flex items-center justify-center text-slate-600 group-hover:text-emerald-500 text-2xl transition-all">+</div>
                <span className="text-xs text-slate-600 group-hover:text-emerald-500 transition-colors">Add College</span>
              </button>
            )}
          </div>

          {/* Rows */}
          <div className="rounded-b-2xl overflow-hidden border border-slate-800 border-t-0">
            <CompareRow label="Annual Fees" highlight values={colleges.map(c => `₹${(c.fees_min / 1000).toFixed(0)}k – ₹${(c.fees_max / 1000).toFixed(0)}k`)} />
            <CompareRow label="NIRF Rank" values={colleges.map(c => c.nirf_rank ? `#${c.nirf_rank}` : 'Not Ranked')} />
            <CompareRow label="Avg Placement" values={colleges.map(c => c.placement_avg ? `₹${c.placement_avg}L/yr` : 'N/A')} />
            <CompareRow label="Hostel" values={colleges.map(c => c.hostel_available)} />
            <CompareRow label="City" values={colleges.map(c => c.city)} />
            <CompareRow label="Courses" values={colleges.map(c => c.courses.slice(0, 3).join(', ') + (c.courses.length > 3 ? ` +${c.courses.length - 3}` : ''))} />

            {/* CTA row */}
            <div className={`grid gap-px ${colCount === 2 ? 'grid-cols-[160px_1fr_1fr]' : 'grid-cols-[160px_1fr_1fr_1fr]'} bg-slate-950`}>
              <div className="px-4 py-5 bg-slate-950/80 text-xs text-slate-500 font-semibold flex items-center">Free Counseling</div>
              {colleges.map(col => (
                <div key={col.id} className="px-4 py-4 bg-slate-950/40 flex items-center">
                  <button onClick={() => setApplyCollege(col.name)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black text-xs font-black transition-all hover:scale-105">
                    Apply Free
                  </button>
                </div>
              ))}
              {colCount < 3 && <div className="bg-slate-950/20" />}
            </div>
          </div>

          {/* Detail links */}
          <div className={`grid gap-4 mt-4 ${colCount === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
            {colleges.map(col => (
              <Link key={col.id} href={`/admission/colleges/${col.slug}`}
                className="text-center text-xs text-slate-500 hover:text-emerald-400 transition-colors py-2 font-semibold">
                Full details for {col.name} →
              </Link>
            ))}
          </div>

          {/* Bihar loan note */}
          <div className="mt-8 bg-emerald-950/20 border border-emerald-900/30 rounded-2xl p-5 flex gap-3 items-start">
            <span className="text-2xl">🏛️</span>
            <div>
              <p className="text-sm font-black text-emerald-400">Bihar Students — DRCC Loan Available for All These Colleges</p>
              <p className="text-xs text-slate-400 mt-1">Government education loan up to ₹4L @ 1% interest. Our counselors will check your eligibility for free when you apply.</p>
              <a href="/admission#counseling-form" className="inline-flex items-center gap-1 mt-2 text-xs text-emerald-400 hover:text-emerald-300 font-bold transition-colors">Check Eligibility Free →</a>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showSelector && <CollegeSelector allColleges={allColleges} selected={selectedIds} onSelect={addCollege} onClose={() => setShowSelector(false)} />}
        {applyCollege && <ApplyModal collegeName={applyCollege} onClose={() => setApplyCollege(null)} />}
      </AnimatePresence>
    </main>
  )
}