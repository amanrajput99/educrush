// src/lib/auth.ts
// Supabase Auth ke saare helper functions yahan hain

import { supabase } from '@/lib/supabase'
import type { UserProfile } from '@/types/auth'

// ── Google OAuth login ────────────────────────────────────────────────────────
export async function signInWithGoogle(next?: string) {
  const redirectTo = next
    ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`
    : `${window.location.origin}/auth/callback`

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })
  if (error) throw error
}

// ── GitHub OAuth login ────────────────────────────────────────────────────────
export async function signInWithGitHub(next?: string) {
  const redirectTo = next
    ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`
    : `${window.location.origin}/auth/callback`

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: { redirectTo },
  })
  if (error) throw error
}

// ── Magic Link (email, no password) ──────────────────────────────────────────
export async function signInWithMagicLink(email: string, next?: string) {
  const emailRedirectTo = next
    ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`
    : `${window.location.origin}/auth/callback`

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo },
  })
  if (error) throw error
}

// ── Sign out ──────────────────────────────────────────────────────────────────
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
  window.location.href = '/'
}

// ── Get current session ───────────────────────────────────────────────────────
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

// ── Get or create user profile ────────────────────────────────────────────────
// Login ke baad call karo — agar profile nahi hai toh auto-create hoga
export async function getOrCreateProfile(userId: string, userData: {
  email: string
  full_name?: string | null
  avatar_url?: string | null
}): Promise<UserProfile | null> {
  // Pehle check karo existing profile
  // FIX: maybeSingle() — single() naye user ke liye throw karta tha
  // (jab profile row abhi exist hi nahi karta)
  const { data: existing } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (existing) {
    // Streak update karo — agar aaj login nahi kiya tha
    await updateStreak(userId, existing)
    return existing as UserProfile
  }

  // Naya profile banao (Google/GitHub se jo info mili)
  const { data: created, error } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      email: userData.email,
      full_name: userData.full_name ?? null,
      avatar_url: userData.avatar_url ?? null,
      streak_count: 1,
      last_active: new Date().toISOString(),
      profile_completed: 10,  // sirf email = 10%
      onboarding_done: false,
    })
    .select()
    .single()

  if (error) {
    console.error('Profile create error:', error)
    return null
  }

  return created as UserProfile
}

// ── Update profile ────────────────────────────────────────────────────────────
export async function updateProfile(userId: string, updates: Partial<UserProfile>) {
  // FIX: Existing profile fetch karo — completion poore profile (DB + naye
  // updates ka merge) se calculate hona chahiye, sirf is call mein bheje gaye
  // fields se nahi. Warna agar koi sirf "college" update kare, to pehle se
  // saved goals/interests bhi "missing" maan liye jaate the aur % galat girta tha.
  const { data: existing } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  const merged = { ...(existing ?? {}), ...updates }
  const completion = calculateCompletion(merged)

  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, profile_completed: completion })
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data as UserProfile
}

// ── Profile completion % calculate karo ──────────────────────────────────────
function calculateCompletion(profile: Partial<UserProfile>): number {
  const fields = [
    { key: 'full_name',  weight: 15 },
    { key: 'course',     weight: 20 },
    { key: 'year',       weight: 15 },
    { key: 'college',    weight: 20 },
    { key: 'goals',      weight: 15 },
    { key: 'interests',  weight: 15 },
  ] as const

  let total = 0
  for (const field of fields) {
    const val = profile[field.key]
    if (val && (Array.isArray(val) ? val.length > 0 : true)) {
      total += field.weight
    }
  }
  return Math.min(total, 100)
}

// ── Streak update karo ────────────────────────────────────────────────────────
async function updateStreak(userId: string, profile: UserProfile) {
  const today = new Date().toDateString()
  const lastActive = profile.last_active
    ? new Date(profile.last_active).toDateString()
    : null

  if (lastActive === today) return  // aaj already visit kiya

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const isConsecutive = lastActive === yesterday.toDateString()

  await supabase
    .from('profiles')
    .update({
      streak_count: isConsecutive ? profile.streak_count + 1 : 1,
      last_active: new Date().toISOString(),
    })
    .eq('id', userId)
}

// ── Save / unsave note ────────────────────────────────────────────────────────
export async function toggleSaveNote(userId: string, note: {
  link: string
  title: string
  subject?: string
}) {
  // Already saved hai?
  // FIX: maybeSingle() — most notes aren't saved yet, single() threw on that
  // common case instead of just returning null
  const { data: existing } = await supabase
    .from('saved_notes')
    .select('id')
    .eq('user_id', userId)
    .eq('note_link', note.link)
    .maybeSingle()

  if (existing) {
    // Unsave
    await supabase.from('saved_notes').delete().eq('id', existing.id)
    return false  // saved = false
  } else {
    // Save
    await supabase.from('saved_notes').insert({
      user_id: userId,
      note_link: note.link,
      note_title: note.title,
      note_subject: note.subject ?? null,
    })
    return true  // saved = true
  }
}

// ── Get saved notes ───────────────────────────────────────────────────────────
export async function getSavedNotes(userId: string) {
  const { data } = await supabase
    .from('saved_notes')
    .select('*')
    .eq('user_id', userId)
    .order('saved_at', { ascending: false })

  return data ?? []
}

// ── Save coding progress ──────────────────────────────────────────────────────
export async function saveCodingProgress(userId: string, problemSlug: string, lang: string) {
  // Duplicate check
  // FIX: maybeSingle() — first-time solves are the common case, single()
  // threw instead of returning null
  const { data: existing } = await supabase
    .from('coding_progress')
    .select('id')
    .eq('user_id', userId)
    .eq('problem_slug', problemSlug)
    .maybeSingle()

  if (existing) return  // already saved

  await supabase.from('coding_progress').insert({
    user_id: userId,
    problem_slug: problemSlug,
    lang,
  })
}

// ── Get coding progress ───────────────────────────────────────────────────────
export async function getCodingProgress(userId: string) {
  const { data } = await supabase
    .from('coding_progress')
    .select('*')
    .eq('user_id', userId)
    .order('solved_at', { ascending: false })

  return data ?? []
}