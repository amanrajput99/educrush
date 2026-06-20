'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
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

// ── Inner form (uses useSearchParams — must be inside Suspense) ───────────────
function CareersForm() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const roleParam = searchParams.get('role')

  const [role, setRole] = useState(roleParam === 'volunteer' ? 'Volunteer / Contributor' : 'Student Ambassador')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // ── Auth gate ────────────────────────────────────────────────────────────
  const [authChecked, setAuthChecked] = useState(false)
  const [user, setUser] = useState<{ id: string; email: string; full_name: string | null } | null>(null)
  const [alreadyApplied, setAlreadyApplied] = useState<{ status: string; role: string } | null>(null)

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { setAuthChecked(true); return }

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', session.user.id)
        .maybeSingle()

      setUser({
        id: session.user.id,
        email: session.user.email!,
        full_name: profile?.full_name ?? null,
      })

      // Check if this user already has a pending/accepted application
      const { data: existing } = await supabase
        .from('careers_interest')
        .select('status, role')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (existing && existing.status !== 'rejected') {
        setAlreadyApplied(existing)
      }

      setAuthChecked(true)
    }
    check()
  }, [])

  useEffect(() => {
    if (roleParam === 'volunteer') setRole('Volunteer / Contributor')
    else if (roleParam === 'ambassador') setRole('Student Ambassador')
  }, [roleParam])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!user) return // shouldn't happen — gated below
    setLoading(true)
    setError('')

    const form = e.currentTarget
    const name         = (form.elements.namedItem('name')         as HTMLInputElement).value
    const email        = (form.elements.namedItem('email')        as HTMLInputElement).value
    const mobile       = (form.elements.namedItem('mobile')       as HTMLInputElement).value
    const college      = (form.elements.namedItem('college')      as HTMLInputElement).value
    const course       = (form.elements.namedItem('course')       as HTMLInputElement).value
    const year         = (form.elements.namedItem('year')         as HTMLSelectElement).value
    const contribution = (form.elements.namedItem('contribution') as HTMLInputElement).value
    const message       = (form.elements.namedItem('message')      as HTMLTextAreaElement).value

    const { error: dbError } = await supabase
      .from('careers_interest')
      .insert([{ name, email, mobile, college, course, year, role, contribution, message, user_id: user.id, status: 'new' }])

    if (dbError) {
      setError('Something went wrong. Please try again or reach us at educrushofficial@gmail.com.')
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  const inputClass = 'w-full bg-[#00A63E]/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 placeholder:text-sm focus:outline-none focus:border-green-600 transition text-sm'
  const labelClass = 'block text-white text-sm mb-2'

  // ── Not logged in — gate the form ───────────────────────────────────────
  if (authChecked && !user) {
    return (
      <div className="w-full max-w-lg backdrop-blur-sm border border-white/10 rounded-2xl p-8">
        <div className="flex flex-col items-center justify-center py-14 text-center">
          <div className="w-14 h-14 rounded-full bg-green-950 border border-green-700/50 flex items-center justify-center mb-5">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h3 className="text-white text-lg font-semibold mb-2">Sign in to apply</h3>
          <p className="text-slate-400 text-sm mb-7 max-w-xs">
            We link applications to your EduCrush account so we can verify you and, once approved, set up your Ambassador dashboard.
          </p>
          <button
            onClick={() => router.push(`/login?next=${encodeURIComponent(pathname + '?role=' + (role === 'Volunteer / Contributor' ? 'volunteer' : 'ambassador'))}`)}
            className="bg-gradient-to-r from-green-950 to-green-600 hover:from-green-600 hover:to-green-950 text-white text-sm px-8 py-3 rounded-full transition duration-300 font-medium"
          >
            Sign in to continue
          </button>
        </div>
      </div>
    )
  }

  // ── Already applied ──────────────────────────────────────────────────────
  if (authChecked && user && alreadyApplied) {
    const statusLabel = alreadyApplied.status === 'accepted' ? 'Accepted' : alreadyApplied.status === 'reviewed' ? 'Under review' : 'Submitted'
    return (
      <div className="w-full max-w-lg backdrop-blur-sm border border-white/10 rounded-2xl p-8">
        <div className="flex flex-col items-center justify-center py-14 text-center">
          <div className="w-14 h-14 rounded-full bg-green-950 border border-green-700/50 flex items-center justify-center mb-5">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 12 2 2 4-4"/><circle cx="12" cy="12" r="10"/>
            </svg>
          </div>
          <h3 className="text-white text-lg font-semibold mb-2">You've already applied</h3>
          <p className="text-slate-400 text-sm mb-1">Role: <span className="text-white">{alreadyApplied.role}</span></p>
          <p className="text-slate-400 text-sm mb-7">Status: <span className="text-green-400">{statusLabel}</span></p>
          <Link href="/dashboard"
            className="flex items-center gap-2 border border-white/15 hover:border-green-700/60 bg-white/5 text-white px-6 py-2.5 rounded-full text-sm font-medium transition duration-300">
            Go to dashboard
          </Link>
        </div>
      </div>
    )
  }

  if (!authChecked) {
    return (
      <div className="w-full max-w-lg border border-white/10 rounded-2xl p-8 flex items-center justify-center min-h-[400px]">
        <p className="text-slate-500 text-sm">Loading...</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-lg backdrop-blur-sm border border-white/10 rounded-2xl p-8">
      {success ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-green-950 border border-green-500 flex items-center justify-center mb-5">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 12 2 2 4-4" /><circle cx="12" cy="12" r="10" />
            </svg>
          </div>
          <h3 className="text-white text-xl font-semibold mb-2">Application received</h3>
          <p className="text-slate-400 text-sm mb-1">
            Thank you for your interest in joining the{' '}
            <span className="text-green-400 font-medium">EduCrush team</span>.
          </p>
          <p className="text-slate-500 text-xs mb-8">We will get back to you within 3–5 business days via email.</p>
          <Link href="/dashboard"
            className="flex items-center gap-2 border border-white/15 hover:border-green-700/60 bg-white/5 text-white px-6 py-2.5 rounded-full text-sm font-medium transition duration-300">
            Go to dashboard
          </Link>
        </div>
      ) : (
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className={labelClass}>I want to join as</label>
            <div className="grid grid-cols-2 gap-3">
              {['Student Ambassador', 'Volunteer / Contributor'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all duration-200 text-left ${
                    role === r
                      ? 'border-green-600 bg-green-950/50 text-green-300'
                      : 'border-white/20 bg-white/5 text-slate-400 hover:border-white/40'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Full Name *</label>
              <input name="name" type="text" required defaultValue={user?.full_name ?? ''} placeholder="Aman Kumar Singh" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Email Address *</label>
              <input name="email" type="email" required defaultValue={user?.email ?? ''} readOnly placeholder="you@example.com" className={inputClass + ' opacity-60 cursor-not-allowed'} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Mobile <span className="text-white/40 font-normal">(Optional)</span></label>
              <input name="mobile" type="tel" placeholder="+91 98765 43210" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>College / University *</label>
              <input name="college" type="text" required placeholder="AKTU Lucknow" className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Course *</label>
              <input name="course" type="text" required placeholder="BTech CSE" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Current Year *</label>
              <select name="year" required className={inputClass + ' text-white/70'}>
                <option value="" className="bg-black">Select year</option>
                <option value="1st Year" className="bg-black">1st Year</option>
                <option value="2nd Year" className="bg-black">2nd Year</option>
                <option value="3rd Year" className="bg-black">3rd Year</option>
                <option value="4th Year" className="bg-black">4th Year</option>
                <option value="Final Semester" className="bg-black">Final Semester</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>
              {role === 'Student Ambassador'
                ? 'How will you promote EduCrush at your college? *'
                : 'What would you like to contribute? (subject, project, article, etc.) *'}
            </label>
            <input name="contribution" type="text" required
              placeholder={role === 'Student Ambassador'
                ? 'e.g. Study groups, social media, word of mouth...'
                : 'e.g. DSA notes semester 3, React mini project...'}
              className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Anything else you would like to share? <span className="text-white/40 font-normal">(Optional)</span></label>
            <textarea name="message" rows={3} placeholder="Your motivation, skills, social handles, etc."
              className={inputClass + ' resize-none'} />
          </div>

          {error && (
            <p className="text-red-400 text-xs border border-red-900 bg-red-950/30 rounded-lg px-4 py-3">{error}</p>
          )}

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-white/50 max-w-[180px]">
              By submitting, you agree to our{' '}
              <Link href="/terms" className="text-white hover:underline">Terms</Link> &{' '}
              <Link href="/privacy-policy" className="text-white hover:underline">Privacy Policy</Link>.
            </p>
            <button type="submit" disabled={loading}
              className="bg-gradient-to-r from-green-950 to-green-600 hover:from-green-600 hover:to-green-950 text-white text-sm px-8 py-3 rounded-full transition duration-300 cursor-pointer disabled:opacity-50 font-medium">
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function CareersContactPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
        * { font-family: 'Sora', sans-serif; }
      `}</style>

      <div className="bg-black min-h-screen text-white">
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-[700px] h-[700px] bg-green-500/[0.12] rounded-full blur-[200px] z-0" />

        {/* ── HERO + FORM ── */}
        <section className="relative z-10 flex flex-col md:flex-row justify-center px-4 pt-36 pb-20 gap-14 max-w-6xl mx-auto">

          {/* Left: Info */}
          <div className="md:text-left mt-4 max-w-md">
            <div className="flex items-center gap-3 mb-5">
              <Link href="/careers" className="text-slate-500 text-xs hover:text-slate-300 transition flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                Careers
              </Link>
              <span className="text-slate-700 text-xs">/</span>
              <span className="text-slate-400 text-xs">Apply</span>
            </div>

            <button className="px-4 h-8 border border-gray-800 text-slate-400 text-xs rounded-lg mb-5 cursor-default tracking-wide uppercase">
              Interest Form
            </button>

            <h1 className="font-semibold text-3xl md:text-[44px] leading-[1.1] tracking-tight bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent max-w-sm mb-5">
              Join the EduCrush Team
            </h1>

            <p className="text-sm/7 text-slate-400 mb-8">
              A simple form — done in under 2 minutes. Every application is personally reviewed by our team.
            </p>

            {/* What happens next */}
            <div className="border border-gray-800 rounded-2xl bg-gradient-to-b from-[#0a0a0a] to-[#0D542B]/8 p-6 space-y-0 mb-6">
              <p className="text-green-400 text-xs font-semibold uppercase tracking-wider mb-4">What Happens Next</p>
              {[
                { label: 'Application submitted', value: 'Instantly',     dot: 'bg-green-400' },
                { label: 'Team review',           value: '2–5 days',     dot: 'bg-emerald-400' },
                { label: 'Intro email / call',    value: 'After review', dot: 'bg-teal-400' },
              ].map((item, i) => (
                <div key={item.label} className={`flex items-center justify-between py-3.5 ${i < 2 ? 'border-b border-gray-800/60' : ''}`}>
                  <div className="flex items-center gap-3">
                    <span className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
                    <span className="text-slate-400 text-sm">{item.label}</span>
                  </div>
                  <span className="text-white font-semibold text-sm">{item.value}</span>
                </div>
              ))}
            </div>

            <p className="text-slate-500 text-xs">
              Have questions? Email us at{' '}
              <a href="mailto:educrushofficial@gmail.com" className="text-green-400 hover:text-green-300 transition">
                educrushofficial@gmail.com
              </a>
            </p>
          </div>

          {/* Right: Form */}
          <Suspense fallback={
            <div className="w-full max-w-lg border border-white/10 rounded-2xl p-8 flex items-center justify-center min-h-[400px]">
              <p className="text-slate-500 text-sm">Loading form...</p>
            </div>
          }>
            <FadeUp delay={0.1}>
              <CareersForm />
            </FadeUp>
          </Suspense>

        </section>

        <Divider />

        {/* ── OTHER OPTIONS ── */}
        <section className="relative z-10 px-6 py-16 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <FadeUp>
            <div className="border border-white/10 rounded-xl p-6 bg-white/5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mb-3">
                <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              <h3 className="text-white font-semibold mb-1">Email Us</h3>
              <p className="text-slate-400 text-sm mb-3">Reach out directly to the team</p>
              <a href="mailto:educrushofficial@gmail.com" className="text-green-400 text-sm hover:text-green-300 transition">
                educrushofficial@gmail.com
              </a>
            </div>
          </FadeUp>

          <FadeUp delay={0.07}>
            <div className="border border-white/10 rounded-xl p-6 bg-white/5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mb-3">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
              </svg>
              <h3 className="text-white font-semibold mb-1">Ambassador Program</h3>
              <p className="text-slate-400 text-sm mb-3">Lead EduCrush on your campus</p>
              <Link href="/careers/ambassador" className="text-green-400 text-sm hover:text-green-300 transition">
                Learn More →
              </Link>
            </div>
          </FadeUp>

          <FadeUp delay={0.14}>
            <div className="border border-white/10 rounded-xl p-6 bg-white/5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mb-3">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <h3 className="text-white font-semibold mb-1">Volunteer Program</h3>
              <p className="text-slate-400 text-sm mb-3">Contribute notes, projects, and more</p>
              <Link href="/careers/volunteer" className="text-green-400 text-sm hover:text-green-300 transition">
                Learn More →
              </Link>
            </div>
          </FadeUp>
        </section>

      </div>
    </>
  )
}