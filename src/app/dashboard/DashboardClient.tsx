'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { signOut, getSavedNotes, getCodingProgress } from '@/lib/auth'
import type { UserProfile, SavedNote, CodingProgress } from '@/types/auth'

// ── Streak fire component ─────────────────────────────────────────────────────
function StreakBadge({ count }: { count: number }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: 'rgba(251,146,60,0.1)',
      border: '1px solid rgba(251,146,60,0.25)',
      borderRadius: 20, padding: '6px 14px',
    }}>
      <span style={{ fontSize: 18 }}>🔥</span>
      <span style={{ color: '#fb923c', fontWeight: 600, fontSize: 14 }}>{count} day streak</span>
    </div>
  )
}

// ── Profile completion ring ───────────────────────────────────────────────────
function CompletionRing({ pct }: { pct: number }) {
  const r = 28
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <svg width="70" height="70" viewBox="0 0 70 70">
      <circle cx="35" cy="35" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5"/>
      <circle cx="35" cy="35" r={r} fill="none" stroke="#34d399" strokeWidth="5"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 35 35)" style={{ transition: 'stroke-dasharray 0.8s ease' }}/>
      <text x="35" y="39" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="600"
        fontFamily="Poppins, sans-serif">{pct}%</text>
    </svg>
  )
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color }: {
  icon: string; label: string; value: string | number; color: string
}) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 16, padding: '16px 18px',
      flex: 1, minWidth: 120,
    }}>
      <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{label}</div>
    </div>
  )
}

export default function DashboardClient() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [savedNotes, setSavedNotes] = useState<SavedNote[]>([])
  const [progress, setProgress] = useState<CodingProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'coding' | 'profile'>('overview')

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.replace('/login'); return }

      const [{ data: prof }, notes, code] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        getSavedNotes(user.id),
        getCodingProgress(user.id),
      ])

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
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
          <div style={{ width: 32, height: 32, border: '2px solid rgba(52,211,153,0.3)', borderTopColor: '#34d399', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 12px' }} />
          Loading dashboard...
        </div>
      </div>
    )
  }

  const avatar = profile?.avatar_url
  const name = profile?.full_name ?? profile?.email?.split('@')[0] ?? 'Student'
  const initials = name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
  const completion = profile?.profile_completed ?? 0
  const streak = profile?.streak_count ?? 0

  // Lang breakdown for coding
  const langMap: Record<string, number> = {}
  progress.forEach(p => { langMap[p.lang] = (langMap[p.lang] ?? 0) + 1 })

  const tabs = [
    { id: 'overview', label: '🏠 Overview' },
    { id: 'notes', label: `📚 Saved Notes ${savedNotes.length > 0 ? `(${savedNotes.length})` : ''}` },
    { id: 'coding', label: `💻 Coding ${progress.length > 0 ? `(${progress.length})` : ''}` },
    { id: 'profile', label: '👤 Profile' },
  ] as const

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * { font-family: 'Poppins', sans-serif; box-sizing: border-box; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dash-tab {
          padding: 8px 16px; border-radius: 10px;
          background: none; border: none;
          color: rgba(255,255,255,0.4); font-size: 13px;
          cursor: pointer; transition: all 0.15s;
          font-family: 'Poppins', sans-serif; white-space: nowrap;
        }
        .dash-tab:hover { color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.04); }
        .dash-tab.active {
          color: #6ee7b7;
          background: rgba(52,211,153,0.1);
          border: 1px solid rgba(52,211,153,0.2);
        }
        .tab-content { animation: fadeUp 0.3s ease both; }

        .note-item {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 16px; border-radius: 12px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          transition: all 0.15s; text-decoration: none;
          margin-bottom: 8px;
        }
        .note-item:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.12);
          transform: translateX(2px);
        }
        .profile-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px; padding: 11px 14px;
          color: #e2e8f0; font-size: 13px;
          font-family: 'Poppins', sans-serif; outline: none;
          transition: border-color 0.2s;
        }
        .profile-input:focus { border-color: rgba(52,211,153,0.4); }
        .profile-input::placeholder { color: rgba(255,255,255,0.2); }
        .save-btn {
          padding: 10px 24px; border-radius: 10px;
          background: linear-gradient(135deg, #059669, #0D542B);
          border: none; color: white;
          font-size: 13px; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
          font-family: 'Poppins', sans-serif;
        }
        .save-btn:hover { background: linear-gradient(135deg, #10b981, #065f46); }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#000', color: '#fff' }}>

        {/* Top bar */}
        {/* <div style={{
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '16px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(10px)',
          position: 'sticky', top: 0, zIndex: 50,
        }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>
              Edu<span style={{ color: '#34d399' }}>Crush</span>
            </span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <StreakBadge count={streak} />
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: avatar ? 'transparent' : 'linear-gradient(135deg, #059669, #0D542B)',
              border: '2px solid rgba(52,211,153,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 600, overflow: 'hidden',
            }}>
              {avatar
                ? <img src={avatar} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : initials}
            </div>
            <button onClick={signOut} style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 8, padding: '6px 14px', color: 'rgba(255,255,255,0.4)',
              fontSize: 12, cursor: 'pointer',
            }}>
              Logout
            </button>
          </div>
        </div> */}

        <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px' }}>

          {/* Welcome */}
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 26, fontWeight: 600, color: '#fff', marginBottom: 4 }}>
              Welcome back, {name.split(' ')[0]} 👋
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14 }}>
              {profile?.course ? `${profile.course}${profile.year ? ` · ${profile.year}` : ''}` : 'Setup karo apna profile →'}
              {profile?.college ? ` · ${profile.college}` : ''}
            </p>
          </div>

          {/* Profile completion banner */}
          {completion < 100 && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(13,84,43,0.3), rgba(0,0,0,0))',
              border: '1px solid rgba(52,211,153,0.2)',
              borderRadius: 16, padding: '16px 20px',
              display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28,
            }}>
              <CompletionRing pct={completion} />
              <div style={{ flex: 1 }}>
                <p style={{ color: '#6ee7b7', fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
                  Profile {completion}% complete
                </p>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>
                  {completion < 50
                    ? 'Course aur year add karo — AI recommendations unlock honge'
                    : 'College aur interests add karo — personalization 100% hogi'}
                </p>
              </div>
              <button onClick={() => setActiveTab('profile')} style={{
                background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)',
                borderRadius: 10, padding: '8px 16px', color: '#34d399',
                fontSize: 12, cursor: 'pointer', fontFamily: 'Poppins, sans-serif', whiteSpace: 'nowrap',
              }}>
                Complete karo →
              </button>
            </div>
          )}

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
            <StatCard icon="📚" label="Saved Notes" value={savedNotes.length} color="#818cf8" />
            <StatCard icon="✅" label="Problems Solved" value={progress.length} color="#34d399" />
            <StatCard icon="🔥" label="Day Streak" value={streak} color="#fb923c" />
            <StatCard icon="🏆" label="Profile Score" value={`${completion}%`} color="#fbbf24" />
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex', gap: 4, marginBottom: 24,
            background: 'rgba(255,255,255,0.03)', borderRadius: 12,
            padding: 4, overflowX: 'auto',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            {tabs.map(t => (
              <button key={t.id} className={`dash-tab ${activeTab === t.id ? 'active' : ''}`}
                onClick={() => setActiveTab(t.id)}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="tab-content" key={activeTab}>

            {/* Overview */}
            {activeTab === 'overview' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

                  {/* Quick links */}
                  <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 16, padding: '20px',
                  }}>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quick Access</p>
                    {[
                      { href: '/notes', icon: '📚', label: 'Browse Notes' },
                      { href: '/projects', icon: '💻', label: 'View Projects' },
                      { href: '/ai', icon: '🤖', label: 'EduCrush AI' },
                      { href: '/coding-practice', icon: '⌨️', label: 'Coding Practice' },
                      { href: '/blogs', icon: '📝', label: 'Read Blogs' },
                    ].map(l => (
                      <Link key={l.href} href={l.href} style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 12px', borderRadius: 10,
                        textDecoration: 'none', marginBottom: 4,
                        color: 'rgba(255,255,255,0.7)', fontSize: 13,
                        transition: 'all 0.15s',
                      }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'
                          ;(e.currentTarget as HTMLElement).style.color = '#fff'
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.background = 'none'
                          ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)'
                        }}>
                        <span>{l.icon}</span> {l.label}
                        <span style={{ marginLeft: 'auto', opacity: 0.3 }}>→</span>
                      </Link>
                    ))}
                  </div>

                  {/* Recent saved notes */}
                  <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 16, padding: '20px',
                  }}>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recent Saved Notes</p>
                    {savedNotes.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '20px 0' }}>
                        <p style={{ fontSize: 28, marginBottom: 8 }}>📚</p>
                        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>
                          Koi note save nahi kiya abhi tak
                        </p>
                        <Link href="/notes" style={{ color: '#34d399', fontSize: 12, textDecoration: 'none' }}>
                          Notes browse karo →
                        </Link>
                      </div>
                    ) : savedNotes.slice(0, 4).map(n => (
                      <Link key={n.id} href={n.note_link} className="note-item">
                        <div style={{
                          width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                          background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.2)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
                        }}>📄</div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.note_title}</p>
                          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>{n.note_subject}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Saved Notes tab */}
            {activeTab === 'notes' && (
              <div>
                {savedNotes.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 0' }}>
                    <p style={{ fontSize: 48, marginBottom: 12 }}>📚</p>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 16 }}>
                      Abhi tak koi note save nahi kiya
                    </p>
                    <Link href="/notes" style={{
                      background: 'linear-gradient(135deg, #059669, #0D542B)',
                      border: 'none', borderRadius: 12, padding: '10px 24px',
                      color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none',
                    }}>
                      Notes browse karo →
                    </Link>
                  </div>
                ) : savedNotes.map(n => (
                  <Link key={n.id} href={n.note_link} className="note-item">
                    <div style={{
                      width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                      background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                    }}>📄</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.note_title}</p>
                      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>{n.note_subject} · {new Date(n.saved_at).toLocaleDateString('en-IN')}</p>
                    </div>
                    <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>→</span>
                  </Link>
                ))}
              </div>
            )}

            {/* Coding tab */}
            {activeTab === 'coding' && (
              <div>
                {progress.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 0' }}>
                    <p style={{ fontSize: 48, marginBottom: 12 }}>⌨️</p>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 16 }}>
                      Abhi tak koi problem solve nahi ki
                    </p>
                    <Link href="/coding-practice" style={{
                      background: 'linear-gradient(135deg, #059669, #0D542B)',
                      border: 'none', borderRadius: 12, padding: '10px 24px',
                      color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none',
                    }}>
                      Practice shuru karo →
                    </Link>
                  </div>
                ) : (
                  <>
                    {/* Language breakdown */}
                    <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
                      {Object.entries(langMap).map(([lang, count]) => (
                        <div key={lang} style={{
                          padding: '8px 14px', borderRadius: 10,
                          background: 'rgba(52,211,153,0.08)',
                          border: '1px solid rgba(52,211,153,0.2)',
                          color: '#6ee7b7', fontSize: 13,
                        }}>
                          {lang}: <strong>{count}</strong> solved
                        </div>
                      ))}
                    </div>
                    {progress.slice(0, 20).map(p => (
                      <div key={p.id} style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '12px 16px', borderRadius: 12,
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.07)', marginBottom: 8,
                      }}>
                        <span style={{ fontSize: 16 }}>✅</span>
                        <div style={{ flex: 1 }}>
                          <p style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 500 }}>{p.problem_slug.replace(/-/g, ' ')}</p>
                          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>{p.lang} · {new Date(p.solved_at).toLocaleDateString('en-IN')}</p>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}

            {/* Profile tab */}
            {activeTab === 'profile' && (
              <ProfileEditor profile={profile} />
            )}
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
    await supabase.from('profiles').update({
      full_name: name,
      college,
    }).eq('id', profile.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 16, padding: '24px',
    }}>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 20 }}>Edit Profile</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <div>
          <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, display: 'block', marginBottom: 6 }}>Full Name</label>
          <input className="profile-input" value={name} onChange={e => setName(e.target.value)} placeholder="Rahul Kumar" />
        </div>
        <div>
          <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, display: 'block', marginBottom: 6 }}>Email</label>
          <input className="profile-input" value={profile?.email ?? ''} disabled style={{ opacity: 0.4 }} />
        </div>
        <div>
          <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, display: 'block', marginBottom: 6 }}>Course</label>
          <input className="profile-input" value={profile?.course ?? ''} disabled style={{ opacity: 0.5 }} />
        </div>
        <div>
          <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, display: 'block', marginBottom: 6 }}>College</label>
          <input className="profile-input" value={college} onChange={e => setCollege(e.target.value)} placeholder="Apna college daalo" />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <button className="save-btn" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
        </button>
        <Link href="/onboarding" style={{
          color: 'rgba(255,255,255,0.35)', fontSize: 12, textDecoration: 'none',
        }}>
          Puri profile setup karo →
        </Link>
      </div>
    </div>
  )
}
