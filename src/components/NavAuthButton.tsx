'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

type UserData = { name: string; avatar: string | null; streak: number }

// ── Skeleton shapes ───────────────────────────────────────────────────────────
function DesktopSkeleton() {
  return (
    <div className="hidden md:flex items-center gap-2 border border-zinc-200 rounded-full pl-1 pr-4 py-1 animate-pulse">
      {/* avatar circle */}
      <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#e4e4e7', flexShrink: 0 }} />
      {/* name */}
      <div style={{ width: 56, height: 12, borderRadius: 6, background: '#e4e4e7' }} />
      {/* streak badge */}
      <div style={{ width: 32, height: 20, borderRadius: 20, background: '#fde8d8' }} />
    </div>
  )
}

function MobileSkeleton() {
  return (
    <div className="flex items-center gap-2.5 border border-zinc-200 rounded-full px-3 py-1.5 mt-3 w-fit animate-pulse">
      <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#e4e4e7', flexShrink: 0 }} />
      <div style={{ width: 52, height: 11, borderRadius: 6, background: '#e4e4e7' }} />
      <div style={{ width: 72, height: 11, borderRadius: 6, background: '#e4e4e7' }} />
    </div>
  )
}

// ── Shared fetch + streak logic ───────────────────────────────────────────────
async function fetchUser(): Promise<UserData | null> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return null

  const { data: p } = await supabase
    .from('profiles')
    .select('full_name, avatar_url, streak_count, last_active')
    .eq('id', session.user.id)
    .single()

  if (p) {
    const today = new Date().toDateString()
    const lastActive = p.last_active ? new Date(p.last_active).toDateString() : null

    if (lastActive !== today) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const isConsecutive = lastActive === yesterday.toDateString()
      const newStreak = isConsecutive ? (p.streak_count ?? 0) + 1 : 1

      // fire-and-forget — don't await, don't block UI
      supabase.from('profiles').update({
        streak_count: newStreak,
        last_active: new Date().toISOString(),
      }).eq('id', session.user.id).then(() => {})

      p.streak_count = newStreak
    }
  }

  return {
    name: p?.full_name ?? session.user.user_metadata?.full_name ?? session.user.email?.split('@')[0] ?? 'User',
    avatar: p?.avatar_url ?? session.user.user_metadata?.avatar_url ?? session.user.user_metadata?.picture ?? null,
    streak: p?.streak_count ?? 0,
  }
}

// ── Cache across mounts (same tab) ───────────────────────────────────────────
let _cache: { user: UserData | null; state: 'guest' | 'user' } | null = null

function useAuthState() {
  const [state, setState] = useState<'loading' | 'guest' | 'user'>(
    _cache ? _cache.state : 'loading'
  )
  const [user, setUser] = useState<UserData | null>(_cache?.user ?? null)

  useEffect(() => {
    // If we already have cache, skip network call
    if (_cache) return

    let cancelled = false
    fetchUser()
      .then(u => {
        if (cancelled) return
        _cache = { user: u, state: u ? 'user' : 'guest' }
        setUser(u)
        setState(u ? 'user' : 'guest')
      })
      .catch(() => {
        if (!cancelled) setState('guest')
      })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      // invalidate cache on auth change
      _cache = null
      fetchUser().then(u => {
        if (cancelled) return
        _cache = { user: u, state: u ? 'user' : 'guest' }
        setUser(u)
        setState(u ? 'user' : 'guest')
      }).catch(() => setState('guest'))
    })

    return () => { cancelled = true; subscription.unsubscribe() }
  }, [])

  return { state, user }
}

// ── Desktop ───────────────────────────────────────────────────────────────────
export function NavAuthButton() {
  const { state, user } = useAuthState()

  if (state === 'loading') return <DesktopSkeleton />

  if (state === 'guest') {
    return (
      <Link href="/login"
        className="hidden md:flex items-center gap-2.5 bg-linear-to-r from-zinc-950 to-zinc-500 text-zinc-50 hover:text-zinc-200 text-sm font-medium pl-5 pr-2 py-2 rounded-full cursor-pointer border-0"
      >
        Sign In
        <span className="size-7 rounded-full bg-white flex items-center justify-center">
          <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
            <path d="M.6 4.602h10m-4-4 4 4-4 4" stroke="#3f3f47" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </Link>
    )
  }

  const initials = (user?.name ?? 'U').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <Link href="/dashboard"
      className="hidden md:flex items-center gap-2 border border-zinc-200 rounded-full pl-1 pr-4 py-1 hover:bg-zinc-50 transition-colors"
    >
      <div style={{
        width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
        background: user?.avatar ? 'transparent' : '#18181b',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 700, color: '#fff', overflow: 'hidden',
      }}>
        {user?.avatar
          ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : initials}
      </div>
      <span className="text-sm font-semibold text-zinc-800">{user?.name.split(' ')[0]}</span>
      {(user?.streak ?? 0) > 0 && (
        <span style={{
          fontSize: 11, fontWeight: 700, color: '#ea580c',
          background: '#fff7ed', border: '1px solid #fed7aa',
          borderRadius: 20, padding: '2px 8px', whiteSpace: 'nowrap',
        }}>
          {user?.streak}d
        </span>
      )}
    </Link>
  )
}

// ── Mobile ────────────────────────────────────────────────────────────────────
export function MobileNavAuthButton() {
  const { state, user } = useAuthState()

  if (state === 'loading') return <MobileSkeleton />

  if (state === 'guest') {
    return (
      <Link href="/login"
        className="flex items-center justify-center gap-2.5 bg-linear-to-r from-zinc-950 to-zinc-500 text-zinc-50 text-sm font-medium px-5 py-2.5 rounded-full cursor-pointer border-0 mt-3 w-fit"
      >
        Sign In
        <span className="size-7 rounded-full bg-white flex items-center justify-center">
          <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
            <path d="M.6 4.602h10m-4-4 4 4-4 4" stroke="#3f3f47" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </Link>
    )
  }

  const initials = (user?.name ?? 'U').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <Link href="/dashboard"
      className="flex items-center gap-2.5 border border-zinc-200 rounded-full px-3 py-1.5 mt-3 w-fit hover:bg-zinc-50"
    >
      <div style={{
        width: 26, height: 26, borderRadius: '50%',
        background: user?.avatar ? 'transparent' : '#18181b',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 10, fontWeight: 700, color: '#fff', overflow: 'hidden',
      }}>
        {user?.avatar
          ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : initials}
      </div>
      <span className="text-sm font-semibold text-zinc-800">{user?.name.split(' ')[0]}</span>
      <span className="text-xs text-zinc-400 font-medium">Dashboard →</span>
    </Link>
  )
}