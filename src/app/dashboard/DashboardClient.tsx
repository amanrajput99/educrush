'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { getSavedNotes, getCodingProgress } from '@/lib/auth'
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
}

// ── Progress ring ─────────────────────────────────────────────────────────────
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
function Stat({ label, value, accent }: { label: string; value: string | number; accent?: string }) {
  return (
    <div className="stat-card" style={{
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 14, padding: '16px 18px',
    }}>
      <p style={{ fontSize: 22, fontWeight: 600, color: accent ?? '#fff', lineHeight: 1, letterSpacing: '-0.01em' }}>{value}</p>
      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 6 }}>{label}</p>
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
    }}>
      {label}
    </button>
  )
}

export default function DashboardClient() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [savedNotes, setSavedNotes] = useState<SavedNote[]>([])
  const [progress, setProgress] = useState<CodingProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'overview' | 'notes' | 'coding' | 'profile'>('overview')

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
  const completion = profile?.profile_completed ?? 0
  const streak = profile?.streak_count ?? 0
  const langMap: Record<string, number> = {}
  progress.forEach(p => { langMap[p.lang] = (langMap[p.lang] ?? 0) + 1 })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * { font-family: 'Poppins', sans-serif; box-sizing: border-box; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .dash-fade { animation: fadeUp 0.3s ease both; }
        .ql-row:hover { background: rgba(255,255,255,0.05) !important; }
        .nt-row:hover { background: rgba(255,255,255,0.06) !important; border-color: rgba(255,255,255,0.13) !important; }
        .lp-link:hover { color: #6ee7b7 !important; }

        .dash-wrap { max-width: 920px; margin: 0 auto; padding: 40px 20px 60px; }
        .dash-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 28px; }
        .completion-card { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
        .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
        .tabs-row { display: flex; gap: 4px; margin-bottom: 22px; overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .tabs-row::-webkit-scrollbar { display: none; }
        .overview-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

        @media (max-width: 640px) {
          .dash-wrap { padding: 24px 14px 48px; }
          .dash-header { flex-direction: column; align-items: stretch; gap: 12px; margin-bottom: 22px; }
          .dash-header h1 { font-size: 21px !important; }
          .dash-header button { align-self: flex-start; }
          .completion-card { flex-wrap: wrap; padding: 14px 16px !important; }
          .completion-card > div:nth-child(2) { min-width: 100%; order: 3; }
          .completion-card button { margin-left: auto; }
          .stats-row { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .overview-grid { grid-template-columns: 1fr; gap: 14px; }
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#000', color: '#fff' }}>
        <div className="dash-wrap">

          {/* Header */}
          <div className="dash-header">
            <div>
              <h1 style={{ fontSize: 25, fontWeight: 600, color: '#fff', letterSpacing: '-0.01em', marginBottom: 5 }}>
                Welcome back, {firstName}
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13.5 }}>
                {profile?.course
                  ? `${profile.course}${profile.year ? ` · ${profile.year}` : ''}${profile.college ? ` · ${profile.college}` : ''}`
                  : 'Complete your profile to personalize your dashboard'}
              </p>
            </div>
            <button
              onClick={async () => { await supabase.auth.signOut(); window.location.href = '/' }}
              style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 9, padding: '8px 16px', color: 'rgba(255,255,255,0.5)',
                fontSize: 12.5, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap',
                fontFamily: 'Poppins, sans-serif', flexShrink: 0,
              }}
            >
              Log out
            </button>
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
            <Stat label="Saved notes" value={savedNotes.length} />
            <Stat label="Problems solved" value={progress.length} accent="#6ee7b7" />
            <Stat label="Day streak" value={streak} accent="#fb923c" />
            <Stat label="Profile score" value={`${completion}%`} accent="#fbbf24" />
          </div>

          {/* Tabs */}
          <div className="tabs-row" style={{
            background: 'rgba(255,255,255,0.025)', borderRadius: 11, padding: 4,
            border: '1px solid rgba(255,255,255,0.06)', width: 'fit-content',
          }}>
            {(['overview', 'notes', 'coding', 'profile'] as const).map(t => (
              <Tab key={t} label={t.charAt(0).toUpperCase() + t.slice(1)} active={tab === t} onClick={() => setTab(t)} />
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