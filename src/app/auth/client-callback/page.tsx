'use client'
import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getPendingReferralCode, clearPendingReferralCode } from '@/components/ReferralCapture'

// ── Attribute a referral once, right after profile creation ────────────────
// NOTE: this calls a SECURITY DEFINER Postgres function (attribute_referral)
// instead of doing the profiles-by-referral_code lookup + insert directly
// from the client. Reason: with normal RLS, a brand-new user is only allowed
// to SELECT their own profiles row, so a client-side lookup of *someone
// else's* profile by referral_code returns nothing and the referral never
// gets attributed (silently). The DB function runs with elevated privileges
// so it can do the lookup + insert safely without opening up the profiles
// table to everyone. See the SQL migration for the function definition.
async function attributeReferral(newUserEmail: string) {
  const code = getPendingReferralCode()
  if (!code) return

  const { error } = await supabase.rpc('attribute_referral', {
    p_referral_code: code,
    p_referred_email: newUserEmail,
  })

  if (error) {
    // Don't block onboarding on this, but make sure it's visible — this is
    // exactly the kind of failure that was silent before.
    console.error('Referral attribution failed:', error)
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
        await attributeReferral(session.user.email!)

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