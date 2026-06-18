'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams} from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { updateProfile } from '@/lib/auth'
import {
  GraduationCap, Building2, Target, ArrowRight, Rocket,
  Code2, Globe, Brain, Smartphone, Trophy, Database, Network, Cloud,
  Briefcase, BookOpen, Landmark, Sparkles, SkipForward,
} from 'lucide-react'


const COURSES = ['BTech', 'BCA', 'Diploma', 'Class 11', 'Class 12', 'MCA', 'BSc', 'MBA']
const YEARS: Record<string, string[]> = {
  'BTech':   ['1st Year', '2nd Year', '3rd Year', '4th Year'],
  'BCA':     ['1st Year', '2nd Year', '3rd Year'],
  'Diploma': ['1st Year', '2nd Year', '3rd Year'],
  'MCA':     ['1st Year', '2nd Year'],
  'BSc':     ['1st Year', '2nd Year', '3rd Year'],
  'MBA':     ['1st Year', '2nd Year'],
  'Class 11': [], 'Class 12': [],
}

const GOALS = [
  { label: 'Campus Placement', icon: Briefcase },
  { label: 'Higher Studies', icon: BookOpen },
  { label: 'Govt Job', icon: Landmark },
  { label: 'Startup / Freelance', icon: Rocket },
  { label: 'Just Learning', icon: Sparkles },
]

const INTERESTS = [
  { label: 'DSA / Algorithms', icon: Code2 },
  { label: 'Web Development', icon: Globe },
  { label: 'Machine Learning', icon: Brain },
  { label: 'App Development', icon: Smartphone },
  { label: 'Competitive Coding', icon: Trophy },
  { label: 'Database / SQL', icon: Database },
  { label: 'System Design', icon: Network },
  { label: 'Cloud / DevOps', icon: Cloud },
]

// 'choice' = welcome/choice screen, 1-3 = the actual form, shown only if "personalize" chosen
type Stage = 'choice' | 1 | 2 | 3

function OnboardingClientInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
const next = searchParams.get('next')
  const [stage, setStage] = useState<Stage>('choice')
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [skipping, setSkipping] = useState(false)

  const [course, setCourse] = useState('')
  const [year, setYear] = useState('')
  const [college, setCollege] = useState('')
  const [goals, setGoals] = useState<string[]>([])
  const [interests, setInterests] = useState<string[]>([])

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.replace('/login'); return }
      setUserId(user.id)
    })
  }, [router])

  const toggleArr = (arr: string[], item: string, setArr: (v: string[]) => void) => {
    setArr(arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item])
  }

  const handleFinish = async () => {
    if (!userId) return
    setLoading(true)
    try {
      await updateProfile(userId, {
        course: course || null,
        year: year || null,
        college: college || null,
        goals: goals.length > 0 ? goals : null,
        interests: interests.length > 0 ? interests : null,
        onboarding_done: true,
      })
      router.replace(next ?? '/dashboard')
    } catch {
      setLoading(false)
    }
  }

  const skip = async () => {
    if (!userId) return
    setSkipping(true)
    await supabase.from('profiles').update({ onboarding_done: true }).eq('id', userId)
    router.replace(next ?? '/dashboard')
  }

  const years = course ? YEARS[course] ?? [] : []
  const canStep1 = !!course
  const totalSteps = 3
  const stepNum = typeof stage === 'number' ? stage : 0

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * { font-family: 'Poppins', sans-serif; box-sizing: border-box; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .step-card { animation: fadeUp 0.35s ease both; }

        .option-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 16px;
          border-radius: 10px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.65);
          font-size: 13px;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .option-chip:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.2);
          color: #fff;
        }
        .option-chip.selected {
          background: rgba(52,211,153,0.12);
          border-color: rgba(52,211,153,0.4);
          color: #6ee7b7;
          font-weight: 500;
        }
        .next-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px;
          border-radius: 12px;
          background: linear-gradient(135deg, #059669, #0D542B);
          border: none;
          color: white;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Poppins', sans-serif;
        }
        .next-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #10b981, #065f46);
          transform: translateY(-1px);
          box-shadow: 0 8px 25px rgba(5,150,105,0.3);
        }
        .next-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .secondary-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px;
          border-radius: 12px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.7);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Poppins', sans-serif;
        }
        .secondary-btn:hover:not(:disabled) {
          background: rgba(255,255,255,0.08);
          color: #fff;
        }
        .secondary-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .college-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 13px 16px;
          color: #e2e8f0;
          font-size: 14px;
          font-family: 'Poppins', sans-serif;
          outline: none;
          transition: border-color 0.2s;
        }
        .college-input:focus { border-color: rgba(52,211,153,0.4); }
        .college-input::placeholder { color: rgba(255,255,255,0.2); }

        .choice-card {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px 20px;
          border-radius: 16px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }
        .choice-card:hover:not(:disabled) {
          background: rgba(52,211,153,0.08);
          border-color: rgba(52,211,153,0.35);
          transform: translateY(-1px);
        }
        .choice-card:disabled { opacity: 0.5; cursor: not-allowed; }
        .choice-icon {
          flex-shrink: 0;
          width: 44px; height: 44px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
        }
      `}</style>

      <div style={{
        minHeight: '100vh', background: '#000',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px', position: 'relative', overflow: 'hidden',
      }}>
        {/* Bg orb */}
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(13,84,43,0.2) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 500 }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <span style={{ fontSize: 26, fontWeight: 700, color: '#fff' }}>
              Edu<span style={{ color: '#34d399' }}>Crush</span>
            </span>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, marginTop: 6 }}>
              {stage === 'choice' ? 'One quick thing before you start' : "Let's personalize your experience"}
            </p>
          </div>

          {/* Stage: Choice screen */}
          {stage === 'choice' && (
            <div className="step-card" style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 24, padding: '28px 24px',
              backdropFilter: 'blur(20px)',
            }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, color: '#fff', marginBottom: 6 }}>
                Want to personalize your dashboard?
              </h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>
                Takes about 2 minutes — helps us show you the right notes and resources. Totally optional.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <button className="choice-card" disabled={skipping} onClick={() => setStage(1)}>
                  <div className="choice-icon" style={{ background: 'rgba(52,211,153,0.15)' }}>
                    <Sparkles size={20} color="#34d399" />
                  </div>
                  <div>
                    <div style={{ color: '#fff', fontSize: 14, fontWeight: 600, marginBottom: 2 }}>
                      Yes, personalize it
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
                      3 quick questions — course, college, goals
                    </div>
                  </div>
                </button>

                <button className="choice-card" disabled={skipping} onClick={skip}>
                  <div className="choice-icon" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <SkipForward size={20} color="rgba(255,255,255,0.6)" />
                  </div>
                  <div>
                    <div style={{ color: '#fff', fontSize: 14, fontWeight: 600, marginBottom: 2 }}>
                      {skipping ? 'Taking you there...' : 'Skip, take me to dashboard'}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
                      You can always fill this in later from your profile
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Stages 1-3: the actual form */}
          {typeof stage === 'number' && (
            <>
              {/* Progress bar */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  {Array.from({ length: totalSteps }).map((_, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      color: i + 1 <= stepNum ? '#34d399' : 'rgba(255,255,255,0.25)',
                      fontSize: 12, fontWeight: 500,
                    }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: '50%',
                        background: i + 1 < stepNum ? '#059669' : i + 1 === stepNum ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.06)',
                        border: `1px solid ${i + 1 <= stepNum ? 'rgba(52,211,153,0.5)' : 'rgba(255,255,255,0.1)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 10, color: i + 1 <= stepNum ? '#fff' : 'rgba(255,255,255,0.3)',
                      }}>
                        {i + 1 < stepNum ? '✓' : i + 1}
                      </div>
                      {['Course', 'College', 'Goals'][i]}
                    </div>
                  ))}
                </div>
                <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
                  <div style={{
                    height: '100%', borderRadius: 2,
                    background: 'linear-gradient(to right, #059669, #34d399)',
                    width: `${((stepNum - 1) / (totalSteps - 1)) * 100}%`,
                    transition: 'width 0.4s ease',
                  }} />
                </div>
              </div>

              {/* Card */}
              <div className="step-card" key={stage} style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 24, padding: '28px 24px',
                backdropFilter: 'blur(20px)',
              }}>

                {/* Step 1 — Course */}
                {stage === 1 && (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <GraduationCap size={22} color="#34d399" />
                      <h2 style={{ fontSize: 20, fontWeight: 600, color: '#fff' }}>
                        What are you studying?
                      </h2>
                    </div>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 22 }}>
                      We&apos;ll tailor notes and resources to your course
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                      {COURSES.map(c => (
                        <button key={c} className={`option-chip ${course === c ? 'selected' : ''}`}
                          onClick={() => { setCourse(c); setYear('') }}>
                          {c}
                        </button>
                      ))}
                    </div>
                    {years.length > 0 && (
                      <>
                        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>
                          Which year are you in?
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                          {years.map(y => (
                            <button key={y} className={`option-chip ${year === y ? 'selected' : ''}`}
                              onClick={() => setYear(y)}>
                              {y}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                    <button className="next-btn" disabled={!canStep1} onClick={() => setStage(2)}>
                      Next <ArrowRight size={16} />
                    </button>
                  </>
                )}

                {/* Step 2 — College */}
                {stage === 2 && (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <Building2 size={22} color="#34d399" />
                      <h2 style={{ fontSize: 20, fontWeight: 600, color: '#fff' }}>
                        Which college?
                      </h2>
                    </div>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 22 }}>
                      Optional — you can always add this later
                    </p>
                    <input
                      type="text"
                      className="college-input"
                      placeholder="e.g. Delhi College of Engineering"
                      value={college}
                      onChange={e => setCollege(e.target.value)}
                      style={{ marginBottom: 20 }}
                    />
                    <button className="next-btn" onClick={() => setStage(3)}>
                      {college ? 'Next' : 'Skip this step'} <ArrowRight size={16} />
                    </button>
                  </>
                )}

                {/* Step 3 — Goals & Interests */}
                {stage === 3 && (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <Target size={22} color="#34d399" />
                      <h2 style={{ fontSize: 20, fontWeight: 600, color: '#fff' }}>
                        What&apos;s your goal?
                      </h2>
                    </div>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 14 }}>
                      Pick what fits — select as many as you like
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                      {GOALS.map(({ label, icon: Icon }) => (
                        <button key={label}
                          className={`option-chip ${goals.includes(label) ? 'selected' : ''}`}
                          onClick={() => toggleArr(goals, label, setGoals)}>
                          <Icon size={14} />
                          {label}
                        </button>
                      ))}
                    </div>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>
                      Topics you&apos;re interested in
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                      {INTERESTS.map(({ label, icon: Icon }) => (
                        <button key={label}
                          className={`option-chip ${interests.includes(label) ? 'selected' : ''}`}
                          onClick={() => toggleArr(interests, label, setInterests)}>
                          <Icon size={14} />
                          {label}
                        </button>
                      ))}
                    </div>
                    <button className="next-btn" disabled={loading} onClick={handleFinish}>
                      {loading ? 'Saving...' : <>Go to dashboard <Rocket size={16} /></>}
                    </button>
                  </>
                )}
              </div>

              {/* Skip — still available mid-flow, now a clear secondary action instead of a tiny dismiss link */}
              <div style={{ marginTop: 16 }}>
                <button className="secondary-btn" disabled={skipping} onClick={skip}>
                  <SkipForward size={14} />
                  {skipping ? 'Taking you there...' : 'Skip remaining steps'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default function OnboardingClient() {
  return (
    <Suspense fallback={null}>
      <OnboardingClientInner />
    </Suspense>
  )
}