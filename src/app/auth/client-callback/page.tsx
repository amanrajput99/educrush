'use client'
import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getPendingReferralCode, clearPendingReferralCode } from '@/components/ReferralCapture'

// ── Attribute a referral once, right after profile creation ────────────────
async function attributeReferral(newUserId: string, newUserEmail: string) {
  const code = getPendingReferralCode()
  if (!code) return

  // Find the ambassador who owns this code
  const { data: ambassador } = await supabase
    .from('profiles')
    .select('id')
    .eq('referral_code', code)
    .maybeSingle()

  // Don't let someone "refer" themselves, and don't fail silently-loud
  // if the code doesn't match anyone (typo, expired link, etc.)
  if (ambassador && ambassador.id !== newUserId) {
    await supabase.from('ambassador_referrals').insert({
      ambassador_id: ambassador.id,
      referred_user_id: newUserId,
      referred_email: newUserEmail,
    })
  }

  clearPendingReferralCode()
}

function ClientCallbackInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next')

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.replace('/login?error=auth_failed'); return }

      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_done')
        .eq('id', session.user.id)
        .maybeSingle()

      if (!profile) {
        await supabase.from('profiles').upsert({
          id: session.user.id,
          email: session.user.email!,
          full_name: session.user.user_metadata?.full_name ?? null,
          avatar_url: session.user.user_metadata?.avatar_url ?? session.user.user_metadata?.picture ?? null,
          streak_count: 1,
          last_active: new Date().toISOString(),
          profile_completed: 10,
          onboarding_done: false,
        }, { onConflict: 'id', ignoreDuplicates: true })

        // First time this profile exists — attribute any pending referral
        await attributeReferral(session.user.id, session.user.email!)

        router.replace(next ? `/onboarding?next=${encodeURIComponent(next)}` : '/onboarding')
        return
      }

      if (!profile.onboarding_done) {
        router.replace(next ? `/onboarding?next=${encodeURIComponent(next)}` : '/onboarding')
        return
      }

      router.replace(next ?? '/dashboard')
    })
  }, [router, next])

  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'Poppins, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid rgba(52,211,153,0.3)', borderTopColor: '#34d399', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ color: 'rgba(255,255,255,0.5)' }}>Logging you in...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default function ClientCallback() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#000' }} />}>
      <ClientCallbackInner />
    </Suspense>
  )
}