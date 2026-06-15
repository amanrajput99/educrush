'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { updateProfile } from '@/lib/auth'

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
const GOALS = ['Campus Placement', 'Higher Studies', 'Govt Job', 'Startup / Freelance', 'Just Learning']
const INTERESTS = ['DSA / Algorithms', 'Web Development', 'Machine Learning', 'App Development', 'Competitive Coding', 'Database / SQL', 'System Design', 'Cloud / DevOps']

export default function OnboardingClient() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

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
      router.replace('/dashboard')
    } catch {
      setLoading(false)
    }
  }

  const skip = async () => {
    if (!userId) return
    await supabase.from('profiles').update({ onboarding_done: true }).eq('id', userId)
    router.replace('/dashboard')
  }

  const years = course ? YEARS[course] ?? [] : []
  const canStep1 = !!course
  const canStep2 = true  // college optional
  const totalSteps = 3

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
              Let&apos;s personalize your experience
            </p>
          </div>

          {/* Progress bar */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  color: i + 1 <= step ? '#34d399' : 'rgba(255,255,255,0.25)',
                  fontSize: 12, fontWeight: 500,
                }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: i + 1 < step ? '#059669' : i + 1 === step ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.06)',
                    border: `1px solid ${i + 1 <= step ? 'rgba(52,211,153,0.5)' : 'rgba(255,255,255,0.1)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, color: i + 1 <= step ? '#fff' : 'rgba(255,255,255,0.3)',
                  }}>
                    {i + 1 < step ? '✓' : i + 1}
                  </div>
                  {['Course', 'College', 'Goals'][i]}
                </div>
              ))}
            </div>
            <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
              <div style={{
                height: '100%', borderRadius: 2,
                background: 'linear-gradient(to right, #059669, #34d399)',
                width: `${((step - 1) / (totalSteps - 1)) * 100}%`,
                transition: 'width 0.4s ease',
              }} />
            </div>
          </div>

          {/* Card */}
          <div className="step-card" key={step} style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 24, padding: '28px 24px',
            backdropFilter: 'blur(20px)',
          }}>

            {/* Step 1 — Course */}
            {step === 1 && (
              <>
                <h2 style={{ fontSize: 20, fontWeight: 600, color: '#fff', marginBottom: 6 }}>
                  Kaunsa course kar rahe ho? 📚
                </h2>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 22 }}>
                  Iske hisaab se notes aur resources personalize honge
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
                      Kaunse year mein ho?
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
                <button className="next-btn" disabled={!canStep1} onClick={() => setStep(2)}>
                  Next →
                </button>
              </>
            )}

            {/* Step 2 — College */}
            {step === 2 && (
              <>
                <h2 style={{ fontSize: 20, fontWeight: 600, color: '#fff', marginBottom: 6 }}>
                  Kaunsa college? 🏫
                </h2>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 22 }}>
                  Optional hai — skip kar sakte ho baad mein daalna
                </p>
                <input
                  type="text"
                  className="college-input"
                  placeholder="eg. Delhi College of Engineering"
                  value={college}
                  onChange={e => setCollege(e.target.value)}
                  style={{ marginBottom: 20 }}
                />
                <button className="next-btn" onClick={() => setStep(3)}>
                  {college ? 'Next →' : 'Skip karo →'}
                </button>
              </>
            )}

            {/* Step 3 — Goals & Interests */}
            {step === 3 && (
              <>
                <h2 style={{ fontSize: 20, fontWeight: 600, color: '#fff', marginBottom: 6 }}>
                  Kya target hai? 🎯
                </h2>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 14 }}>
                  Goal select karo
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                  {GOALS.map(g => (
                    <button key={g}
                      className={`option-chip ${goals.includes(g) ? 'selected' : ''}`}
                      onClick={() => toggleArr(goals, g, setGoals)}>
                      {g}
                    </button>
                  ))}
                </div>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>
                  Topics jo pasand hain
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                  {INTERESTS.map(i => (
                    <button key={i}
                      className={`option-chip ${interests.includes(i) ? 'selected' : ''}`}
                      onClick={() => toggleArr(interests, i, setInterests)}>
                      {i}
                    </button>
                  ))}
                </div>
                <button className="next-btn" disabled={loading} onClick={handleFinish}>
                  {loading ? 'Saving...' : '🚀 Dashboard pe jao'}
                </button>
              </>
            )}
          </div>

          {/* Skip */}
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <button onClick={skip} style={{
              background: 'none', border: 'none',
              color: 'rgba(255,255,255,0.25)', fontSize: 12, cursor: 'pointer',
            }}>
              Abhi skip karo — baad mein bhar sakte ho
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
