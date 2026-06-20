'use client'
// src/components/dashboard/AmbassadorTab.tsx
// Rendered inside the dashboard when profile.role === 'ambassador'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

type Task = {
  id: string
  title: string
  description: string | null
  points: number
  requires_proof: boolean
}

type Completion = {
  task_id: string
  status: 'pending' | 'approved' | 'rejected'
  proof_url: string | null
}

type LeaderboardRow = {
  id: string
  full_name: string | null
  avatar_url: string | null
  referral_count: number
  tasks_completed: number
  total_points: number
}

type Referral = {
  id: string
  referred_email: string | null
  joined_at: string
}

const TABS = ['Overview', 'Tasks', 'Referrals', 'Leaderboard'] as const
type SubTab = typeof TABS[number]

// How many referrals are needed (alongside all tasks) to unlock the certificate.
// Change this single number to adjust the requirement.
const MIN_REFERRALS_FOR_CERTIFICATE = 3

// ── Proof submission modal ───────────────────────────────────────────────────
function ProofModal({ task, onClose, onSubmit }: {
  task: Task
  onClose: () => void
  onSubmit: (proofUrl: string) => void
}) {
  const [url, setUrl] = useState('')
  const [touched, setTouched] = useState(false)

  const isValid = url.trim().length > 5 // loose check, just needs something link-like

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 16, padding: 28, maxWidth: 420, width: '100%',
          fontFamily: 'Poppins, sans-serif',
        }}
      >
        <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
          Submit proof
        </p>
        <h3 style={{ fontSize: 16, fontWeight: 500, color: '#fff', marginBottom: 6 }}>{task.title}</h3>
        <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.4)', marginBottom: 18, lineHeight: 1.5 }}>
          Paste a link to your proof — a screenshot uploaded to Drive/Imgur, a post URL, or anything an admin can open to verify this.
        </p>

        <input
          type="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          onBlur={() => setTouched(true)}
          placeholder="https://..."
          autoFocus
          style={{
            width: '100%', background: 'rgba(255,255,255,0.04)',
            border: `1px solid ${touched && !isValid ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.12)'}`,
            borderRadius: 10, padding: '11px 14px', color: '#e2e8f0',
            fontSize: 13, fontFamily: 'Poppins, sans-serif', outline: 'none', marginBottom: 6,
          }}
        />
        {touched && !isValid && (
          <p style={{ fontSize: 11.5, color: '#fca5a5', marginBottom: 10 }}>Please paste a valid link</p>
        )}

        <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '10px 0', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)',
            background: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 500,
            cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
          }}>
            Cancel
          </button>
          <button
            onClick={() => isValid && onSubmit(url.trim())}
            disabled={!isValid}
            style={{
              flex: 1, padding: '10px 0', borderRadius: 10, border: 'none',
              background: isValid ? 'linear-gradient(135deg, #059669, #0D542B)' : 'rgba(255,255,255,0.06)',
              color: isValid ? '#fff' : 'rgba(255,255,255,0.3)', fontSize: 13, fontWeight: 600,
              cursor: isValid ? 'pointer' : 'not-allowed', fontFamily: 'Poppins, sans-serif',
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AmbassadorTab({ userId }: { userId: string }) {
  const [subTab, setSubTab] = useState<SubTab>('Overview')
  const [loading, setLoading] = useState(true)

  const [referralCode, setReferralCode] = useState<string | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [completions, setCompletions] = useState<Completion[]>([])
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardRow[]>([])
  const [copied, setCopied] = useState(false)
  const [submittingTask, setSubmittingTask] = useState<string | null>(null)
  const [proofModalTask, setProofModalTask] = useState<Task | null>(null)

  useEffect(() => {
    const load = async () => {
      const [{ data: profile }, { data: taskList }, { data: comps }, { data: refs }, { data: board }] = await Promise.all([
        supabase.from('profiles').select('referral_code').eq('id', userId).maybeSingle(),
        supabase.from('ambassador_tasks').select('*').eq('active', true).order('points', { ascending: true }),
        supabase.from('ambassador_task_completions').select('task_id, status, proof_url').eq('user_id', userId),
        supabase.from('ambassador_referrals').select('id, referred_email, joined_at').eq('ambassador_id', userId).order('joined_at', { ascending: false }),
        supabase.from('ambassador_leaderboard').select('*').limit(20),
      ])

      setReferralCode(profile?.referral_code ?? null)
      setTasks(taskList ?? [])
      setCompletions(comps ?? [])
      setReferrals(refs ?? [])
      setLeaderboard((board ?? []) as LeaderboardRow[])
      setLoading(false)
    }
    load()
  }, [userId])

  const referralLink = referralCode ? `https://educrush.in/?ref=${referralCode}` : ''

  const copyLink = async () => {
    if (!referralLink) return
    await navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getCompletionFor = (taskId: string) => completions.find(c => c.task_id === taskId)

  // Submit without proof — for tasks that don't require it
  const submitTaskNoProof = async (task: Task) => {
    setSubmittingTask(task.id)
    const { error } = await supabase.from('ambassador_task_completions').insert({
      user_id: userId,
      task_id: task.id,
      status: 'pending',
      proof_url: null,
    })
    if (!error) {
      setCompletions(prev => [...prev, { task_id: task.id, status: 'pending', proof_url: null }])
    }
    setSubmittingTask(null)
  }

  // Triggered by the proof modal
  const submitTaskWithProof = async (proofUrl: string) => {
    if (!proofModalTask) return
    const task = proofModalTask
    setProofModalTask(null)
    setSubmittingTask(task.id)

    const { error } = await supabase.from('ambassador_task_completions').insert({
      user_id: userId,
      task_id: task.id,
      status: 'pending',
      proof_url: proofUrl,
    })
    if (!error) {
      setCompletions(prev => [...prev, { task_id: task.id, status: 'pending', proof_url: proofUrl }])
    }
    setSubmittingTask(null)
  }

  const handleTaskAction = (task: Task) => {
    if (task.requires_proof) {
      setProofModalTask(task)
    } else {
      submitTaskNoProof(task)
    }
  }

  const approvedCount = completions.filter(c => c.status === 'approved').length
  const totalPoints = leaderboard.find(r => r.id === userId)?.total_points ?? 0
  const myRank = leaderboard.findIndex(r => r.id === userId)
  const completionPct = tasks.length > 0 ? Math.round((approvedCount / tasks.length) * 100) : 0
  const allTasksDone = tasks.length > 0 && approvedCount === tasks.length
  const certificateUnlocked = allTasksDone && referrals.length >= MIN_REFERRALS_FOR_CERTIFICATE

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0' }}>
        <div style={{ width: 24, height: 24, border: '2px solid rgba(52,211,153,0.25)', borderTopColor: '#34d399', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div>
      <style>{`
        .amb-subtab { padding: 7px 14px; border-radius: 8px; font-size: 12.5px; font-weight: 500; cursor: pointer; border: none; transition: all 0.15s; font-family: Poppins, sans-serif; white-space: nowrap; }
        .amb-row:hover { background: rgba(255,255,255,0.05) !important; }
      `}</style>

      {proofModalTask && (
        <ProofModal
          task={proofModalTask}
          onClose={() => setProofModalTask(null)}
          onSubmit={submitTaskWithProof}
        />
      )}

      {/* Sub-tabs */}
      <div style={{
        display: 'flex', gap: 4, marginBottom: 18,
        background: 'rgba(255,255,255,0.025)', borderRadius: 10, padding: 4,
        border: '1px solid rgba(255,255,255,0.06)', width: 'fit-content', overflowX: 'auto',
      }}>
        {TABS.map(t => (
          <button key={t} className="amb-subtab" onClick={() => setSubTab(t)}
            style={{
              background: subTab === t ? 'rgba(52,211,153,0.12)' : 'transparent',
              color: subTab === t ? '#6ee7b7' : 'rgba(255,255,255,0.45)',
            }}>
            {t}
          </button>
        ))}
      </div>

      {/* ── Overview ── */}
      {subTab === 'Overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Referral link card */}
          <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 20 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
              Your referral link
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <div style={{
                flex: 1, minWidth: 200, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#e2e8f0', fontFamily: 'monospace',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {referralLink || 'Generating...'}
              </div>
              <button onClick={copyLink} style={{
                padding: '10px 18px', borderRadius: 10, border: 'none',
                background: copied ? 'rgba(52,211,153,0.15)' : 'linear-gradient(135deg, #059669, #0D542B)',
                color: copied ? '#6ee7b7' : '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer',
                fontFamily: 'Poppins, sans-serif', whiteSpace: 'nowrap',
              }}>
                {copied ? 'Copied' : 'Copy link'}
              </button>
            </div>
            <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.3)', marginTop: 10 }}>
              Share this link — anyone who signs up through it counts as your referral.
            </p>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              { label: 'Referrals', value: referrals.length },
              { label: 'Tasks completed', value: `${approvedCount}/${tasks.length}` },
              { label: 'Total points', value: totalPoints, accent: '#fbbf24' },
              { label: 'Leaderboard rank', value: myRank >= 0 ? `#${myRank + 1}` : '—', accent: '#6ee7b7' },
            ].map(s => (
              <div key={s.label} style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 14, padding: '16px 18px', flex: 1, minWidth: 130,
              }}>
                <p style={{ fontSize: 22, fontWeight: 600, color: s.accent ?? '#fff', lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 6 }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Progress + certificate */}
          <div style={{
            background: certificateUnlocked ? 'rgba(52,211,153,0.06)' : 'rgba(255,255,255,0.025)',
            border: `1px solid ${certificateUnlocked ? 'rgba(52,211,153,0.25)' : 'rgba(255,255,255,0.08)'}`,
            borderRadius: 14, padding: 20,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <p style={{ fontSize: 13.5, fontWeight: 500, color: '#fff' }}>Ambassador journey</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{completionPct}% complete</p>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden', marginBottom: 14 }}>
              <div style={{ height: '100%', width: `${completionPct}%`, background: 'linear-gradient(90deg, #059669, #34d399)', borderRadius: 3, transition: 'width 0.5s ease' }} />
            </div>

            {certificateUnlocked ? (
              <button style={{
                width: '100%', padding: '11px 0', borderRadius: 10, border: 'none',
                background: 'linear-gradient(135deg, #059669, #0D542B)', color: '#fff',
                fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
              }}>
                Download certificate
              </button>
            ) : (
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                Complete all tasks and reach {MIN_REFERRALS_FOR_CERTIFICATE} referrals to unlock your certificate.
                {' '}({referrals.length}/{MIN_REFERRALS_FOR_CERTIFICATE} referrals)
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── Tasks ── */}
      {subTab === 'Tasks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {tasks.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, textAlign: 'center', padding: '40px 0' }}>
              No tasks available right now — check back soon.
            </p>
          ) : tasks.map(task => {
            const completion = getCompletionFor(task.id)
            const status = completion?.status

            return (
              <div key={task.id} style={{
                background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12, padding: '16px 18px',
                display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
              }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <p style={{ fontSize: 14, fontWeight: 500, color: '#fff', marginBottom: 3 }}>{task.title}</p>
                  {task.description && <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{task.description}</p>}
                  {completion?.proof_url && (
                    <a href={completion.proof_url} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: 11.5, color: '#6ee7b7', textDecoration: 'underline' }}>
                      View submitted proof
                    </a>
                  )}
                </div>
                <span style={{
                  fontSize: 11.5, fontWeight: 600, color: '#fbbf24',
                  background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)',
                  borderRadius: 8, padding: '4px 10px', whiteSpace: 'nowrap',
                }}>
                  {task.points} pts
                </span>

                {status === 'approved' && (
                  <span style={{ fontSize: 12, fontWeight: 500, color: '#6ee7b7', whiteSpace: 'nowrap' }}>Approved</span>
                )}
                {status === 'pending' && (
                  <span style={{ fontSize: 12, fontWeight: 500, color: '#fbbf24', whiteSpace: 'nowrap' }}>Under review</span>
                )}
                {status === 'rejected' && (
                  <button onClick={() => handleTaskAction(task)} disabled={submittingTask === task.id} style={{
                    padding: '7px 16px', borderRadius: 8, border: '1px solid rgba(239,68,68,0.3)',
                    background: 'rgba(239,68,68,0.08)', color: '#fca5a5', fontSize: 12, fontWeight: 500,
                    cursor: 'pointer', fontFamily: 'Poppins, sans-serif', whiteSpace: 'nowrap',
                  }}>
                    Resubmit
                  </button>
                )}
                {!status && (
                  <button onClick={() => handleTaskAction(task)} disabled={submittingTask === task.id} style={{
                    padding: '7px 16px', borderRadius: 8, border: 'none',
                    background: 'linear-gradient(135deg, #059669, #0D542B)', color: '#fff',
                    fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'Poppins, sans-serif', whiteSpace: 'nowrap',
                  }}>
                    {submittingTask === task.id ? 'Submitting...' : task.requires_proof ? 'Submit proof' : 'Mark done'}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ── Referrals ── */}
      {subTab === 'Referrals' && (
        <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 18 }}>
          {referrals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 6 }}>No referrals yet</p>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>Share your link from the Overview tab to start tracking referrals.</p>
            </div>
          ) : referrals.map(r => (
            <div key={r.id} className="amb-row" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 10px', borderRadius: 10, transition: 'background 0.15s',
            }}>
              <span style={{ fontSize: 13.5, color: '#fff' }}>{r.referred_email ?? 'New student'}</span>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{new Date(r.joined_at).toLocaleDateString('en-IN')}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Leaderboard ── */}
      {subTab === 'Leaderboard' && (
        <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 8 }}>
          {leaderboard.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, textAlign: 'center', padding: '40px 0' }}>
              Leaderboard will appear once ambassadors start earning points.
            </p>
          ) : leaderboard.map((row, i) => {
            const isMe = row.id === userId
            const initials = (row.full_name ?? 'A').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
            return (
              <div key={row.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px', borderRadius: 10,
                background: isMe ? 'rgba(52,211,153,0.08)' : 'transparent',
                border: isMe ? '1px solid rgba(52,211,153,0.2)' : '1px solid transparent',
                marginBottom: 2,
              }}>
                <span style={{
                  width: 24, fontSize: 13, fontWeight: 600,
                  color: i === 0 ? '#fbbf24' : i === 1 ? '#d1d5db' : i === 2 ? '#fb923c' : 'rgba(255,255,255,0.4)',
                }}>
                  #{i + 1}
                </span>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                  background: row.avatar_url ? 'transparent' : '#18181b',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: '#fff', overflow: 'hidden',
                }}>
                  {row.avatar_url ? <img src={row.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
                </div>
                <span style={{ flex: 1, fontSize: 13.5, color: '#fff', fontWeight: isMe ? 600 : 400 }}>
                  {row.full_name ?? 'Ambassador'}{isMe ? ' (You)' : ''}
                </span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{row.referral_count} referrals</span>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: '#fbbf24', minWidth: 50, textAlign: 'right' }}>{row.total_points} pts</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}