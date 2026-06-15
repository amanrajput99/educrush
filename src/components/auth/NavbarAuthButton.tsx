// src/components/auth/NavbarAuthButton.tsx
// Yeh Navbar mein import karo — login state ke hisaab se button change hoga
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { UserProfile } from '@/types/auth'

export default function NavbarAuthButton() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('full_name, avatar_url, streak_count')
          .eq('id', user.id)
          .single()
        setProfile(data as UserProfile)
      }
      setLoading(false)
    }
    check()

    // Auth state changes suno
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      check()
    })
    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <div style={{ width: 80, height: 36, borderRadius: 20, background: 'rgba(255,255,255,0.05)' }} />
  }

  if (!profile) {
    // Not logged in
    return (
      <Link href="/login" style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'linear-gradient(135deg, rgba(13,84,43,0.8), rgba(5,150,105,0.5))',
        border: '1px solid rgba(52,211,153,0.3)',
        borderRadius: 20, padding: '7px 18px',
        color: '#6ee7b7', fontSize: 13, fontWeight: 600,
        textDecoration: 'none', transition: 'all 0.2s',
      }}>
        Sign In
      </Link>
    )
  }

  // Logged in — avatar + streak
  const name = profile.full_name ?? 'User'
  const initials = name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
  const streak = profile.streak_count ?? 0

  return (
    <Link href="/dashboard" style={{
      display: 'flex', alignItems: 'center', gap: 8,
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 20, padding: '5px 12px 5px 5px',
      textDecoration: 'none', transition: 'all 0.2s',
    }}>
      {/* Avatar */}
      <div style={{
        width: 28, height: 28, borderRadius: '50%',
        background: profile.avatar_url ? 'transparent' : 'linear-gradient(135deg, #059669, #0D542B)',
        border: '1px solid rgba(52,211,153,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 600, color: '#fff', overflow: 'hidden',
        flexShrink: 0,
      }}>
        {profile.avatar_url
          ? <img src={profile.avatar_url} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : initials}
      </div>
      {/* Name (short) */}
      <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: 500 }}>
        {name.split(' ')[0]}
      </span>
      {/* Streak */}
      {streak > 0 && (
        <span style={{
          display: 'flex', alignItems: 'center', gap: 3,
          background: 'rgba(251,146,60,0.12)',
          border: '1px solid rgba(251,146,60,0.2)',
          borderRadius: 10, padding: '2px 8px',
          color: '#fb923c', fontSize: 11, fontWeight: 600,
        }}>
          🔥{streak}
        </span>
      )}
    </Link>
  )
}
