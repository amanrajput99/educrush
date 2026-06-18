'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { signInWithGoogle, signInWithGitHub, signInWithMagicLink } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export default function LoginClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const next = searchParams.get('next') // e.g. /coding-practice/python/two-sum

  const [email, setEmail] = useState('')
  const [magicSent, setMagicSent] = useState(false)
  const [loading, setLoading] = useState<'google' | 'github' | 'magic' | null>(null)
  const [emailError, setEmailError] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace(next ?? '/dashboard')
    })
  }, [router, next])

  const handleGoogle = async () => {
    setLoading('google')
    try { await signInWithGoogle(next ?? undefined) }
    catch { setLoading(null) }
  }

  const handleGitHub = async () => {
    setLoading('github')
    try { await signInWithGitHub(next ?? undefined) }
    catch { setLoading(null) }
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !email.includes('@')) {
      setEmailError('Please enter a valid email address')
      return
    }
    setEmailError('')
    setLoading('magic')
    try {
      await signInWithMagicLink(email, next ?? undefined)
      setMagicSent(true)
    } catch {
      setEmailError('Something went wrong — please try again')
    } finally {
      setLoading(null)
    }
  }

  return (
    <>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap");
        * { font-family: "Sora", sans-serif; box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }

        .login-wrapper { animation: fadeUp 0.5s ease both; }

        .oauth-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 13px 20px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.04);
          color: #fff;
        }
        .oauth-btn:hover:not(:disabled) {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.2);
          transform: translateY(-1px);
        }
        .oauth-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .email-input {
          width: 100%;
          background: rgba(0,166,62,0.05);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 10px;
          padding: 13px 16px;
          color: #fff;
          font-size: 14px;
          font-family: "Sora", sans-serif;
          outline: none;
          transition: border-color 0.2s;
        }
        .email-input:focus { border-color: #16a34a; }
        .email-input::placeholder { color: rgba(255,255,255,0.3); font-size: 13px; }
        .email-input.error { border-color: rgba(239,68,68,0.6); }

        .send-btn {
          background: linear-gradient(to right, #14532d, #16a34a);
          border: none;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          padding: 13px 20px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s;
          font-family: "Sora", sans-serif;
          white-space: nowrap;
        }
        .send-btn:hover:not(:disabled) {
          background: linear-gradient(to right, #16a34a, #14532d);
          transform: translateY(-1px);
        }
        .send-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .spinner {
          width: 15px; height: 15px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
          flex-shrink: 0;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          color: rgba(255,255,255,0.25);
          font-size: 12px;
        }
        .divider::before, .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.1);
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: '#000',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}>

        <div style={{
          position: 'fixed', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 560, height: 560, borderRadius: '50%',
          background: 'rgba(34,197,94,0.2)',
          filter: 'blur(120px)',
          pointerEvents: 'none',
          animation: 'pulse 6s ease-in-out infinite',
        }} />

        <div className="login-wrapper" style={{
          position: 'relative', zIndex: 10,
          width: '100%', maxWidth: 460,
        }}>

          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <span style={{ fontSize: 26, fontWeight: 700, color: '#fff', letterSpacing: '-0.03em' }}>
                Edu<span style={{ color: '#4ade80' }}>Crush</span>
              </span>
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 12 }}>
              <div style={{ display: 'flex' }}>
                {[
                  'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=50',
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=50',
                  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=50',
                ].map((src, i) => (
                  <img key={i} src={src} alt="" style={{
                    width: 24, height: 24, borderRadius: '50%',
                    border: '1.5px solid #14532d',
                    marginLeft: i > 0 ? -8 : 0,
                    objectFit: 'cover',
                  }} />
                ))}
              </div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                Trusted by 10,000+ students across India
              </p>
            </div>
          </div>

          <div style={{
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 14,
            padding: '32px 28px',
            backdropFilter: 'blur(8px)',
            background: 'rgba(255,255,255,0.02)',
          }}>

            <h1 style={{ fontSize: 22, fontWeight: 600, color: '#fff', marginBottom: 6 }}>
              Sign in to EduCrush
            </h1>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 24, lineHeight: 1.6 }}>
              {next?.includes('coding-practice')
                ? 'Sign in to save your progress on this problem.'
                : 'Access your notes, track your progress, and get personalized recommendations.'}
            </p>

            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: 8, padding: '10px 14px',
                color: '#fca5a5', fontSize: 13, marginBottom: 20,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                Login failed — please try again
              </div>
            )}

            <button className="oauth-btn" onClick={handleGoogle} disabled={!!loading}
              style={{ marginBottom: 10 }}>
              {loading === 'google' ? <span className="spinner" /> : (
                <svg width="17" height="17" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )}
              {loading === 'google' ? 'Connecting...' : 'Continue with Google'}
            </button>

            <button className="oauth-btn" onClick={handleGitHub} disabled={!!loading}
              style={{ marginBottom: 24 }}>
              {loading === 'github' ? <span className="spinner" /> : (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
              )}
              {loading === 'github' ? 'Connecting...' : 'Continue with GitHub'}
            </button>

            <div className="divider" style={{ marginBottom: 20 }}>or continue with email</div>

            {!magicSent ? (
              <form onSubmit={handleMagicLink}>
                <div style={{ marginBottom: 8 }}>
                  <label style={{ display: 'block', color: '#fff', fontSize: 13, marginBottom: 8 }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    className={`email-input ${emailError ? 'error' : ''}`}
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setEmailError('') }}
                    disabled={!!loading}
                  />
                  {emailError && (
                    <p style={{ color: '#fca5a5', fontSize: 12, marginTop: 6 }}>{emailError}</p>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, gap: 12 }}>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5, maxWidth: 200 }}>
                    By signing in, you agree to our{' '}
                    <Link href="/terms" style={{ color: '#fff', textDecoration: 'none' }}>Terms</Link>
                    {' '}and{' '}
                    <Link href="/privacy-policy" style={{ color: '#fff', textDecoration: 'none' }}>Privacy Policy</Link>.
                  </p>
                  <button type="submit" className="send-btn" disabled={!!loading}>
                    {loading === 'magic'
                      ? <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span className="spinner" /> Sending...</span>
                      : 'Send Link'}
                  </button>
                </div>
              </form>
            ) : (
              <div style={{
                background: 'rgba(34,197,94,0.06)',
                border: '1px solid rgba(34,197,94,0.2)',
                borderRadius: 10, padding: '20px',
                textAlign: 'center',
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: 'rgba(34,197,94,0.1)',
                  border: '1px solid rgba(34,197,94,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 12px',
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <p style={{ fontWeight: 600, fontSize: 15, color: '#4ade80', marginBottom: 6 }}>
                  Check your inbox!
                </p>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
                  Magic link sent to <strong style={{ color: '#fff' }}>{email}</strong>.<br />
                  Click it to sign in — no password needed.
                </p>
                <button onClick={() => { setMagicSent(false); setEmail('') }}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 12, cursor: 'pointer', textDecoration: 'underline' }}>
                  Use a different email
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}