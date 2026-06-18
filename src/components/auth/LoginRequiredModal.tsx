'use client'
// src/components/auth/LoginRequiredModal.tsx
// Guest user "Mark Solved" click kare to yeh popup dikhta hai

import { useRouter } from 'next/navigation'

interface Props {
  open: boolean
  onClose: () => void
  redirectTo: string
}

export default function LoginRequiredModal({ open, onClose, redirectTo }: Props) {
  const router = useRouter()
  if (!open) return null

  const handleLogin = () => {
    router.push(`/login?next=${encodeURIComponent(redirectTo)}`)
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20, backdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#0a0a0a', border: '1px solid #1f2937',
          borderRadius: 18, padding: '32px 28px',
          maxWidth: 380, width: '100%', textAlign: 'center',
          fontFamily: 'Poppins, sans-serif',
        }}
      >
        <div style={{
          width: 52, height: 52, borderRadius: '50%',
          background: 'rgba(13,84,43,0.25)', border: '1px solid rgba(74,222,128,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 18px',
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>

        <h3 style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 8 }}>
          Sign in to save progress
        </h3>
        <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, marginBottom: 24 }}>
          Create a free account to track solved problems, build a streak, and pick up where you left off.
        </p>

        <button
          onClick={handleLogin}
          style={{
            width: '100%', padding: '12px 0', borderRadius: 12,
            background: 'linear-gradient(135deg, #059669, #0D542B)',
            border: 'none', color: '#fff', fontSize: 14, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
            marginBottom: 10,
          }}
        >
          Sign in
        </button>

        <button
          onClick={onClose}
          style={{
            width: '100%', padding: '10px 0', borderRadius: 12,
            background: 'transparent', border: 'none',
            color: 'rgba(255,255,255,0.4)', fontSize: 13, cursor: 'pointer',
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          Maybe later
        </button>
      </div>
    </div>
  )
}