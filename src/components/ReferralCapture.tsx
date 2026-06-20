'use client'
// src/components/ReferralCapture.tsx
// Add this ONCE in the root layout. Watches the URL for ?ref=CODE and
// stores it in both localStorage (client reads) and a cookie (server
// route can read it too), so attribution works whether the new user
// signs up via Google/GitHub (server callback) or Magic Link (client
// callback).

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

const STORAGE_KEY = 'educrush_referral_code'
const COOKIE_NAME = 'edu_ref'
const EXPIRY_DAYS = 30

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`
}

export default function ReferralCapture() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const ref = searchParams.get('ref')
    if (!ref) return

    const code = ref.toUpperCase()

    // Don't overwrite an existing valid referral — first link wins
    const existing = localStorage.getItem(STORAGE_KEY)
    if (existing) {
      try {
        const parsed = JSON.parse(existing)
        if (Date.now() < parsed.expiresAt) return
      } catch { /* fall through and overwrite invalid data */ }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      code,
      capturedAt: Date.now(),
      expiresAt: Date.now() + EXPIRY_DAYS * 24 * 60 * 60 * 1000,
    }))
    setCookie(COOKIE_NAME, code, EXPIRY_DAYS)
  }, [searchParams])

  return null
}

// ── Helper used by client-callback after a successful signup ───────────────
export function getPendingReferralCode(): string | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    if (Date.now() > parsed.expiresAt) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return parsed.code
  } catch {
    return null
  }
}

export function clearPendingReferralCode() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
  document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}