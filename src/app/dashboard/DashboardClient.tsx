'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { getSavedNotes, getCodingProgress } from '@/lib/auth'
import AmbassadorTab from '@/components/dashboard/AmbassadorTab'
import { downloadAmbassadorCertificate } from '@/lib/certificate'
import type { UserProfile, SavedNote, CodingProgress } from '@/types/auth'

// ── Inline icons ────────────────────────────────────────────────────────────
const Icon = {
  Notes: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  Code: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
    </svg>
  ),
  Bot: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/>
    </svg>
  ),
  Bookmark: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  ArrowRight: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  Blog: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      <line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="15" y2="11"/>
    </svg>
  ),
  Star: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  Trophy: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z"/>
      <path d="M17 5h2a2 2 0 0 1 2 2 4 4 0 0 1-4 4M7 5H5a2 2 0 0 0-2 2 4 4 0 0 0 4 4"/>
    </svg>
  ),
  Award: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6"/><path d="M9 14.5 7 22l5-3 5 3-2-7.5"/>
    </svg>
  ),
  Lock: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>
    </svg>
  ),
}

// ── Progress ring (used for the small "complete profile" card) ─────────────
function Ring({ pct }: { pct: number }) {
  const r = 24, c = 2 * Math.PI * r
  return (
    <svg width="52" height="52" viewBox="0 0 60 60" style={{ flexShrink: 0 }}>
      <circle cx="30" cy="30" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="4" />
      <circle cx="30" cy="30" r={r} fill="none" stroke="#34d399" strokeWidth="4"
        strokeDasharray={`${(pct / 100) * c} ${c}`} strokeLinecap="round"
        transform="rotate(-90 30 30)" style={{ transition: 'stroke-dasharray 0.8s ease' }} />
      <text x="30" y="34" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="500"
        fontFamily="Poppins, sans-serif">{pct}%</text>
    </svg>
  )
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function Stat({ icon, label, value, accent }: { icon?: React.ReactNode; label: string; value: string | number; accent?: string }) {
  return (
    <div className="stat-card" style={{ ['--stat-accent' as string]: accent ?? '#34d399' } as React.CSSProperties}>
      {icon && <span className="stat-icon" style={{ color: accent ?? '#6ee7b7' }}>{icon}</span>}
      <p className="stat-value" style={{ color: accent ?? '#fff' }}>{value}</p>
      <p className="stat-label">{label}</p>
    </div>
  )
}

// ── Tab ───────────────────────────────────────────────────────────────────────
function Tab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      padding: '7px 16px', borderRadius: 9, fontSize: 13, fontWeight: 500,
      cursor: 'pointer', border: 'none', transition: 'all 0.15s', whiteSpace: 'nowrap',
      background: active ? 'rgba(52,211,153,0.12)' : 'transparent',
      color: active ? '#6ee7b7' : 'rgba(255,255,255,0.45)',
      fontFamily: 'Poppins, sans-serif', flexShrink: 0,
      display: 'flex', alignItems: 'center', gap: 5,
    }}>
      {label}
    </button>
  )
}

// ── Personalized "kick" message under the hero — encodes real progress data,
// not decoration. Priority: streak > problems solved > notes saved > default.
function getKickMessage(streak: number, solved: number, notesCount: number): { emoji: string; text: string } {
  if (streak >= 7) return { emoji: '🔥', text: `${streak}-day streak — you're unstoppable. Keep it going!` }
  if (streak >= 3) return { emoji: '🔥', text: `${streak}-day streak going strong. Don't break it today.` }
  if (solved >= 10) return { emoji: '🚀', text: `${solved} problems solved — you're crushing it. Next one?` }
  if (solved > 0) return { emoji: '💪', text: `${solved} problem${solved > 1 ? 's' : ''} solved. Let's build that streak!` }
  if (notesCount > 0) return { emoji: '📚', text: 'Nice start! Solve your first problem to begin a streak.' }
  return { emoji: '👋', text: 'Welcome to EduCrush! Explore notes & problems to get started.' }
}

type AmbStats = { rank: number | null; points: number; referrals: number; certMinPoints: number }
type DashTab = 'overview' | 'notes' | 'coding' | 'ambassador' | 'profile'

export default function DashboardClient() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [savedNotes, setSavedNotes] = useState<SavedNote[]>([])
  const [progress, setProgress] = useState<CodingProgress[]>([])
  const [ambStats, setAmbStats] = useState<AmbStats | null>(null)
  const [certGenerating, setCertGenerating] = useState(false)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<DashTab>('overview')

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.replace('/login'); return }

      const [{ data: prof }, notes, code] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
        getSavedNotes(user.id),
        getCodingProgress(user.id),
      ])

      if (!prof) { router.replace('/onboarding'); return }

      setProfile(prof as UserProfile)
      setSavedNotes(notes as SavedNote[])
      setProgress(code as CodingProgress[])

      // Ambassadors get their rank/points/referrals pulled up front so it's
      // visible on the main Overview tab — no need to open the Ambassador
      // tab just to see "where do I stand".
      if ((prof as UserProfile).role === 'ambassador') {
        const [{ data: board }, { data: configRow }] = await Promise.all([
          supabase
            .from('ambassador_leaderboard')
            .select('id, referral_count, total_points')
            .order('total_points', { ascending: false }),
          supabase
            .from('ambassador_config')
            .select('value')
            .eq('key', 'certificate_min_points')
            .maybeSingle(),
        ])

        const idx = board?.findIndex(r => r.id === user.id) ?? -1
        setAmbStats({
          rank: idx >= 0 ? idx + 1 : null,
          points: idx >= 0 ? (board![idx].total_points ?? 0) : 0,
          referrals: idx >= 0 ? (board![idx].referral_count ?? 0) : 0,
          certMinPoints: configRow?.value ?? 50,
        })
      }

      setLoading(false)
    }
    init()
  }, [router])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 28, height: 28, border: '2px solid rgba(52,211,153,0.25)', borderTopColor: '#34d399', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  const name = profile?.full_name ?? profile?.email?.split('@')[0] ?? 'Student'
  const firstName = name.split(' ')[0]
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const completion = profile?.profile_completed ?? 0
  const streak = profile?.streak_count ?? 0
  const langMap: Record<string, number> = {}
  progress.forEach(p => { langMap[p.lang] = (langMap[p.lang] ?? 0) + 1 })

  const isAmbassador = profile?.role === 'ambassador'
  const visibleTabs: DashTab[] = isAmbassador
    ? ['overview', 'notes', 'coding', 'ambassador', 'profile']
    : ['overview', 'notes', 'coding', 'profile']

  const kick = getKickMessage(streak, progress.length, savedNotes.length)
  const ringR = 27, ringC = 2 * Math.PI * ringR

  // Switches to the Ambassador tab AND scrolls it into view — without the
  // scroll, the tab content swaps below the fold and the click can feel
  // like it "did nothing" if the person doesn't notice the tab bar change.
  const openAmbassadorHub = () => {
    setTab('ambassador')
    requestAnimationFrame(() => {
      document.getElementById('dash-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * { font-family: 'Poppins', sans-serif; box-sizing: border-box; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bubblePop { from { opacity: 0; transform: translateY(6px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes breathe { 0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.9; } 50% { transform: translateX(-50%) scale(1.08); opacity: 1; } }
        .dash-fade { animation: fadeUp 0.3s ease both; }
        .ql-row:hover { background: rgba(255,255,255,0.05) !important; }
        .nt-row:hover { background: rgba(255,255,255,0.06) !important; border-color: rgba(255,255,255,0.13) !important; }
        .lp-link:hover { color: #6ee7b7 !important; }

        .dash-page {
          min-height: 100vh; min-height: 100dvh;
          background: radial-gradient(ellipse 700px 400px at 50% 0%, rgba(52,211,153,0.06), transparent), #000;
          color: #fff;
        }
        .dash-wrap { max-width: 920px; margin: 0 auto; padding: 36px 20px 60px; }

        /* ── Hero ── */
        .dash-hero { position: relative; text-align: center; padding: 18px 16px 26px; margin-bottom: 22px; }
        .hero-glow {
          position: absolute; top: -40px; left: 50%; width: min(320px, 85vw); height: min(320px, 85vw);
          background: radial-gradient(circle, rgba(52,211,153,0.16), transparent 70%);
          filter: blur(6px); pointer-events: none; z-index: 0;
          animation: breathe 7s ease-in-out infinite;
        }
        .logout-btn {
          position: absolute; top: 0; right: 0; z-index: 2;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 9px; padding: 7px 14px; color: rgba(255,255,255,0.5);
          font-size: 12px; font-weight: 500; cursor: pointer; white-space: nowrap;
          font-family: 'Poppins', sans-serif; transition: all 0.15s;
        }
        .logout-btn:hover { color: #fca5a5; border-color: rgba(239,68,68,0.3); background: rgba(239,68,68,0.06); }

        .hero-avatar-wrap { position: relative; width: 100px; height: 100px; margin: 0 auto 16px; z-index: 1; }
        .hero-avatar-ring { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
        .hero-avatar {
          position: absolute; inset: 9px; border-radius: 50%; overflow: hidden;
          background: linear-gradient(135deg, #0d542b, #064e3b);
          display: flex; align-items: center; justify-content: center;
          font-size: 26px; font-weight: 600; color: #6ee7b7;
          box-shadow: 0 0 0 1px rgba(255,255,255,0.06), 0 10px 30px rgba(0,0,0,0.55);
        }
        .hero-avatar img { width: 100%; height: 100%; object-fit: cover; }

        .hero-avatar-seal {
          position: absolute; bottom: -2px; right: -2px; z-index: 2;
          width: 26px; height: 26px; border-radius: 50%;
          background: linear-gradient(135deg, #fcd34d, #d97706);
          display: flex; align-items: center; justify-content: center;
          color: #1a1306; box-shadow: 0 0 0 3px #000, 0 4px 10px rgba(0,0,0,0.5);
        }
        .hero-eyebrow {
          position: relative; z-index: 1; font-size: 10.5px; font-weight: 600; color: #fbbf24;
          text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 6px;
        }

        .hero-name { font-size: 26px; font-weight: 600; color: #fff; letter-spacing: -0.01em; margin-bottom: 5px; position: relative; z-index: 1; }
        .hero-sub { color: rgba(255,255,255,0.4); font-size: 13.5px; position: relative; z-index: 1; }

        .kick-bubble {
          position: relative; z-index: 1; display: inline-flex; align-items: center; gap: 8px;
          margin-top: 16px; padding: 9px 16px; max-width: 100%;
          background: rgba(255,255,255,0.035); border: 1px solid rgba(255,255,255,0.09);
          border-radius: 10px;
          font-size: 12.5px; color: rgba(255,255,255,0.65); text-align: left;
          animation: bubblePop 0.4s ease 0.15s both;
        }
        .kick-emoji { font-size: 14px; flex-shrink: 0; opacity: 0.9; }

        .completion-card { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
        .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 18px; }
        .stat-card {
          position: relative; overflow: hidden;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px; padding: 16px 18px;
          transition: transform 0.18s ease, border-color 0.18s ease;
        }
        .stat-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: var(--stat-accent, #34d399); opacity: 0.45;
        }
        .stat-card:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.16); }
        .stat-icon { display: inline-flex; margin-bottom: 8px; opacity: 0.7; }
        .stat-value { font-size: 22px; font-weight: 600; line-height: 1; letter-spacing: -0.01em; }
        .stat-label { font-size: 12px; color: rgba(255,255,255,0.4); margin-top: 6px; }

        .amb-snapshot {
          background: rgba(255,255,255,0.025); border: 1px solid rgba(251,191,36,0.18);
          border-radius: 14px; padding: 18px 20px; margin-bottom: 18px;
        }
        .amb-snapshot-head { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
        .amb-snapshot-icon {
          width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0;
          background: rgba(251,191,36,0.1); color: #fbbf24;
          display: flex; align-items: center; justify-content: center;
        }
        .amb-snapshot-title { font-size: 14px; font-weight: 600; color: #fff; }
        .amb-snapshot-sub { font-size: 11.5px; color: rgba(255,255,255,0.4); margin-top: 1px; }
        .amb-snapshot-btn {
          margin-left: auto; background: rgba(255,255,255,0.04); border: 1px solid rgba(251,191,36,0.25);
          color: #fbbf24; border-radius: 9px; padding: 8px 16px; font-size: 12.5px; font-weight: 500;
          cursor: pointer; font-family: 'Poppins', sans-serif; white-space: nowrap; transition: all 0.15s;
        }
        .amb-snapshot-btn:hover { background: rgba(251,191,36,0.1); }
        .amb-snapshot-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; text-align: center; }
        .amb-snapshot-stats > div { background: rgba(0,0,0,0.22); border-radius: 10px; padding: 12px 8px; }
        .amb-snap-num { font-size: 19px; font-weight: 600; line-height: 1; }
        .amb-snap-lbl { font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 6px; }

        .cert-btn {
          width: 100%; margin-top: 14px; display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 11px; border-radius: 10px; font-size: 13px; font-weight: 600;
          cursor: pointer; font-family: 'Poppins', sans-serif; transition: all 0.15s; border: none;
        }
        .cert-btn-unlocked {
          background: linear-gradient(135deg, #fcd34d, #d97706); color: #1a1306;
          box-shadow: 0 4px 16px rgba(217,119,6,0.25);
        }
        .cert-btn-unlocked:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(217,119,6,0.32); }
        .cert-btn-unlocked:disabled { opacity: 0.6; cursor: wait; transform: none; }
        .cert-locked { margin-top: 14px; padding: 12px 14px; background: rgba(0,0,0,0.18); border-radius: 10px; }
        .cert-locked-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
        .cert-locked-label { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.5); }
        .cert-locked-count { font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.6); }
        .cert-progress-track { height: 5px; border-radius: 3px; background: rgba(255,255,255,0.08); overflow: hidden; }
        .cert-progress-fill { height: 100%; border-radius: 3px; background: linear-gradient(90deg, #d97706, #fbbf24); transition: width 0.6s ease; }
        .cert-locked-hint { font-size: 11px; color: rgba(255,255,255,0.35); margin-top: 8px; }

        .tabs-row { display: flex; gap: 4px; margin-bottom: 22px; overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .tabs-row::-webkit-scrollbar { display: none; }
        .overview-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

        @media (max-width: 640px) {
          .dash-wrap { padding: 22px 14px 48px; }
          .dash-hero { padding: 32px 10px 22px; }
          .logout-btn { padding: 6px 12px; font-size: 11.5px; }
          .hero-avatar-wrap { width: 84px; height: 84px; }
          .hero-avatar-seal { width: 22px; height: 22px; }
          .hero-eyebrow { font-size: 10px; }
          .hero-name { font-size: 21px; }
          .kick-bubble { font-size: 12.5px; padding: 9px 14px 9px 12px; }
          .completion-card { flex-wrap: wrap; padding: 14px 16px !important; }
          .completion-card > div:nth-child(2) { min-width: 100%; order: 3; }
          .completion-card button { margin-left: auto; }
          .stats-row { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .amb-snapshot-stats { grid-template-columns: repeat(3, 1fr); gap: 8px; }
          .amb-snap-num { font-size: 16px; }
          .amb-snapshot-btn { width: 100%; margin-left: 0; }
          .overview-grid { grid-template-columns: 1fr; gap: 14px; }
        }
      `}</style>

      <div className="dash-page">
        <div className="dash-wrap">

          {/* ── Hero ── */}
          <div className="dash-hero">
            <div className="hero-glow" />
            <button className="logout-btn" onClick={async () => { await supabase.auth.signOut(); window.location.href = '/' }}>
              Log out
            </button>

            <div className="hero-avatar-wrap">
              <svg className="hero-avatar-ring" viewBox="0 0 60 60" preserveAspectRatio="xMidYMid meet">
                <circle cx="30" cy="30" r={ringR} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2.4" />
                <circle cx="30" cy="30" r={ringR} fill="none" stroke="url(#heroRingGrad)" strokeWidth="2.4"
                  strokeDasharray={`${(completion / 100) * ringC} ${ringC}`} strokeLinecap="round"
                  transform="rotate(-90 30 30)" style={{ transition: 'stroke-dasharray 0.8s ease' }} />
                <defs>
                  <linearGradient id="heroRingGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#6ee7b7" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="hero-avatar">
                {profile?.avatar_url ? <img src={profile.avatar_url} alt={name} /> : <span>{initials}</span>}
              </div>
              {isAmbassador && (
                <span className="hero-avatar-seal" title="EduCrush Ambassador">
                  <Icon.Award />
                </span>
              )}
            </div>

            {isAmbassador && <p className="hero-eyebrow">EDUCRUSH AMBASSADOR</p>}
            <h1 className="hero-name">Welcome back, {firstName}</h1>
            <p className="hero-sub">
              {profile?.course
                ? `${profile.course}${profile.year ? ` · ${profile.year}` : ''}${profile.college ? ` · ${profile.college}` : ''}`
                : 'Complete your profile to personalize your dashboard'}
            </p>

            <div className="kick-bubble">
              <span className="kick-emoji">{kick.emoji}</span>
              <span>{kick.text}</span>
            </div>
          </div>

          {/* Profile completion */}
          {completion < 100 && (
            <div className="completion-card" style={{
              background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 14, padding: '16px 20px',
            }}>
              <Ring pct={completion} />
              <div style={{ flex: 1, minWidth: 140 }}>
                <p style={{ fontWeight: 500, fontSize: 14, color: '#fff', marginBottom: 3 }}>
                  Profile {completion}% complete
                </p>
                <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.4)' }}>
                  {completion < 50 ? 'Add your course and year to personalize your experience' : 'Add interests and goals for full AI personalization'}
                </p>
              </div>
              <button onClick={() => setTab('profile')} style={{
                background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)',
                borderRadius: 9, padding: '8px 16px', color: '#6ee7b7',
                fontSize: 12.5, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap',
                fontFamily: 'Poppins, sans-serif',
              }}>
                Complete profile
              </button>
            </div>
          )}

          {/* Stats */}
          <div className="stats-row">
            <Stat icon={<Icon.Bookmark />} label="Saved notes" value={savedNotes.length} accent="#a78bfa" />
            <Stat icon={<Icon.Code />} label="Problems solved" value={progress.length} accent="#34d399" />
            <Stat icon={<span style={{ fontSize: 16 }}>🔥</span>} label="Day streak" value={streak} accent="#fb923c" />
            <Stat icon={<Icon.Check />} label="Profile score" value={`${completion}%`} accent="#fbbf24" />
          </div>

          {/* Ambassador snapshot — visible right on Overview, no extra clicks */}
          {isAmbassador && ambStats && (
            <div className="amb-snapshot">
              <div className="amb-snapshot-head">
                <span className="amb-snapshot-icon"><Icon.Trophy /></span>
                <div>
                  <p className="amb-snapshot-title">Ambassador Hub</p>
                  <p className="amb-snapshot-sub">Your referrals & points at a glance</p>
                </div>
                <button className="amb-snapshot-btn" onClick={openAmbassadorHub}>
                  Open hub →
                </button>
              </div>
              <div className="amb-snapshot-stats">
                <div>
                  <p className="amb-snap-num" style={{ color: '#fff' }}>{ambStats.rank ? `#${ambStats.rank}` : '—'}</p>
                  <p className="amb-snap-lbl">Leaderboard rank</p>
                </div>
                <div>
                  <p className="amb-snap-num" style={{ color: '#fbbf24' }}>{ambStats.points}</p>
                  <p className="amb-snap-lbl">Total points</p>
                </div>
                <div>
                  <p className="amb-snap-num" style={{ color: '#6ee7b7' }}>{ambStats.referrals}</p>
                  <p className="amb-snap-lbl">Referrals</p>
                </div>
              </div>

              {/* Certificate — unlocks once the configured point threshold is reached */}
              {ambStats.points >= ambStats.certMinPoints ? (
                <button
                  className="cert-btn cert-btn-unlocked"
                  disabled={certGenerating}
                  onClick={async () => {
                    if (!profile) return
                    setCertGenerating(true)
                    try {
                      await downloadAmbassadorCertificate(name, ambStats.points, ambStats.referrals, profile.id, '/certificate-template.png')
                    } catch (err) {
                      console.error('Certificate generation failed:', err)
                    } finally {
                      setCertGenerating(false)
                    }
                  }}
                >
                  <Icon.Award />
                  {certGenerating ? 'Generating…' : 'Download your certificate'}
                </button>
              ) : (
                <div className="cert-locked">
                  <div className="cert-locked-row">
                    <span className="cert-locked-label"><Icon.Lock /> Certificate locked</span>
                    <span className="cert-locked-count">{ambStats.points} / {ambStats.certMinPoints} pts</span>
                  </div>
                  <div className="cert-progress-track">
                    <div className="cert-progress-fill" style={{
                      width: `${Math.min(100, (ambStats.points / Math.max(1, ambStats.certMinPoints)) * 100)}%`,
                    }} />
                  </div>
                  <p className="cert-locked-hint">
                    Earn {Math.max(0, ambStats.certMinPoints - ambStats.points)} more point{ambStats.certMinPoints - ambStats.points === 1 ? '' : 's'} to unlock your certificate
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tabs */}
          <div id="dash-tabs" className="tabs-row" style={{
            background: 'rgba(255,255,255,0.025)', borderRadius: 11, padding: 4,
            border: '1px solid rgba(255,255,255,0.06)', width: 'fit-content',
          }}>
            {visibleTabs.map(t => (
              <Tab
                key={t}
                label={t === 'ambassador' ? 'Ambassador' : t.charAt(0).toUpperCase() + t.slice(1)}
                active={tab === t}
                onClick={() => setTab(t)}
              />
            ))}
          </div>

          {/* Content */}
          <div className="dash-fade" key={tab}>

            {/* Overview */}
            {tab === 'overview' && (
              <div className="overview-grid">
                {/* Quick access */}
                <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 18 }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
                    Quick access
                  </p>
                  {[
                    { href: '/notes', icon: <Icon.Notes />, label: 'Browse notes', desc: 'Study material' },
                    { href: '/projects', icon: <Icon.Code />, label: 'View projects', desc: 'Source code & demos' },
                    { href: '/ai', icon: <Icon.Bot />, label: 'EduCrush AI', desc: 'Ask anything' },
                    { href: '/coding-practice', icon: <Icon.Code />, label: 'Coding practice', desc: 'Solve problems' },
                    { href: '/blogs', icon: <Icon.Blog />, label: 'Read blogs', desc: 'Articles & guides' },
                  ].map(l => (
                    <Link key={l.href} href={l.href} className="ql-row" style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '10px 10px', borderRadius: 10,
                      textDecoration: 'none', marginBottom: 2, transition: 'background 0.15s',
                    }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                        background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.55)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>{l.icon}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13.5, fontWeight: 500, color: '#fff' }}>{l.label}</p>
                        <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.3)' }}>{l.desc}</p>
                      </div>
                      <span style={{ color: 'rgba(255,255,255,0.25)', flexShrink: 0 }}><Icon.ArrowRight /></span>
                    </Link>
                  ))}
                </div>

                {/* Recent saved */}
                <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 18 }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
                    Recent saves
                  </p>
                  {savedNotes.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '32px 0' }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.05)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 12px', color: 'rgba(255,255,255,0.3)',
                      }}><Icon.Bookmark /></div>
                      <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, marginBottom: 8 }}>No notes saved yet</p>
                      <Link href="/notes" className="lp-link" style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12.5, fontWeight: 500, textDecoration: 'none' }}>
                        Browse notes →
                      </Link>
                    </div>
                  ) : savedNotes.slice(0, 5).map(n => (
                    <Link key={n.id} href={n.note_link} className="ql-row" style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '10px 10px', borderRadius: 10, textDecoration: 'none',
                      marginBottom: 2, transition: 'background 0.15s',
                    }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                        background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}><Icon.Notes /></div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <p style={{ fontSize: 13.5, fontWeight: 500, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.note_title}</p>
                        <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.3)' }}>{n.note_subject}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {tab === 'notes' && (
              <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 18 }}>
                {savedNotes.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '56px 0' }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.05)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 16px', color: 'rgba(255,255,255,0.3)',
                    }}><Icon.Bookmark /></div>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 16 }}>No notes saved yet</p>
                    <Link href="/notes" style={{
                      background: 'linear-gradient(135deg, #059669, #0D542B)', border: 'none',
                      borderRadius: 10, padding: '10px 22px', color: '#fff',
                      fontSize: 13, fontWeight: 500, textDecoration: 'none',
                    }}>Browse notes</Link>
                  </div>
                ) : savedNotes.map(n => (
                  <Link key={n.id} href={n.note_link} className="nt-row" style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '12px', borderRadius: 11, textDecoration: 'none',
                    marginBottom: 4, transition: 'all 0.15s',
                    border: '1px solid transparent',
                  }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                      background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.55)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}><Icon.Notes /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 500, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.note_title}</p>
                      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{n.note_subject} · {new Date(n.saved_at).toLocaleDateString('en-IN')}</p>
                    </div>
                    <span style={{ color: 'rgba(255,255,255,0.25)', flexShrink: 0 }}><Icon.ArrowRight /></span>
                  </Link>
                ))}
              </div>
            )}

            {/* Coding */}
            {tab === 'coding' && (
              <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 18 }}>
                {progress.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '56px 0' }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.05)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 16px', color: 'rgba(255,255,255,0.3)',
                    }}><Icon.Code /></div>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 16 }}>No problems solved yet</p>
                    <Link href="/coding-practice" style={{
                      background: 'linear-gradient(135deg, #059669, #0D542B)', border: 'none',
                      borderRadius: 10, padding: '10px 22px', color: '#fff',
                      fontSize: 13, fontWeight: 500, textDecoration: 'none',
                    }}>Start practicing</Link>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                      {Object.entries(langMap).map(([lang, count]) => (
                        <div key={lang} style={{
                          padding: '6px 14px', borderRadius: 9,
                          background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)',
                          color: '#6ee7b7', fontSize: 12.5, fontWeight: 500,
                        }}>
                          {lang} · {count} solved
                        </div>
                      ))}
                    </div>
                    {progress.slice(0, 20).map(p => (
                      <div key={p.id} style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '11px 12px', borderRadius: 10,
                        background: 'rgba(255,255,255,0.025)', marginBottom: 4,
                      }}>
                        <span style={{
                          width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                          background: 'rgba(52,211,153,0.12)', color: '#6ee7b7',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}><Icon.Check /></span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 13.5, fontWeight: 500, color: '#fff', textTransform: 'capitalize' }}>{p.problem_slug.replace(/-/g, ' ')}</p>
                          <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.3)' }}>{p.lang} · {new Date(p.solved_at).toLocaleDateString('en-IN')}</p>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}

            {/* Ambassador */}
            {tab === 'ambassador' && profile && (
              <AmbassadorTab userId={profile.id} />
            )}

            {/* Profile */}
            {tab === 'profile' && <ProfileEditor profile={profile} />}
          </div>
        </div>
      </div>
    </>
  )
}

// ── Profile Editor ────────────────────────────────────────────────────────────
function ProfileEditor({ profile }: { profile: UserProfile | null }) {
  const [name, setName] = useState(profile?.full_name ?? '')
  const [college, setCollege] = useState(profile?.college ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    if (!profile) return
    setSaving(true)
    await supabase.from('profiles').update({ full_name: name, college }).eq('id', profile.id)
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10, padding: '11px 14px', color: '#e2e8f0',
    fontSize: 13, fontFamily: 'Poppins, sans-serif', outline: 'none',
  }
  const labelStyle: React.CSSProperties = { color: 'rgba(255,255,255,0.4)', fontSize: 12, display: 'block', marginBottom: 7 }

  return (
    <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 24 }}>
      <style>{`
        .profile-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px; }
        @media (max-width: 640px) { .profile-grid { grid-template-columns: 1fr; } }
      `}</style>
      <h3 style={{ fontSize: 16, fontWeight: 500, color: '#fff', marginBottom: 20 }}>Edit profile</h3>
      <div className="profile-grid">
        <div>
          <label style={labelStyle}>Full name</label>
          <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
        </div>
        <div>
          <label style={labelStyle}>Email</label>
          <input style={{ ...inputStyle, opacity: 0.4 }} value={profile?.email ?? ''} disabled />
        </div>
        <div>
          <label style={labelStyle}>Course</label>
          <input style={{ ...inputStyle, opacity: 0.5 }} value={profile?.course ?? 'Not set'} disabled />
        </div>
        <div>
          <label style={labelStyle}>College</label>
          <input style={inputStyle} value={college} onChange={e => setCollege(e.target.value)} placeholder="Your college" />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <button onClick={handleSave} disabled={saving} style={{
          padding: '10px 22px', borderRadius: 10,
          background: 'linear-gradient(135deg, #059669, #0D542B)', border: 'none',
          color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer',
          fontFamily: 'Poppins, sans-serif',
        }}>
          {saving ? 'Saving...' : saved ? 'Saved' : 'Save changes'}
        </button>
        <Link href="/onboarding" style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12.5, textDecoration: 'none' }}>
          Complete full profile setup →
        </Link>
      </div>
    </div>
  )
}