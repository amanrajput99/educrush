'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ClientCallback() {
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.replace('/login?error=auth_failed'); return }

      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_done')
        .eq('id', session.user.id)
        .single()

      if (!profile) {
        await supabase.from('profiles').insert({
          id: session.user.id,
          email: session.user.email!,
          full_name: session.user.user_metadata?.full_name ?? null,
          avatar_url: session.user.user_metadata?.avatar_url ?? session.user.user_metadata?.picture ?? null,
          streak_count: 1,
          last_active: new Date().toISOString(),
          profile_completed: 10,
          onboarding_done: false,
        })
        router.replace('/onboarding')
        return
      }

      router.replace(profile.onboarding_done ? '/dashboard' : '/onboarding')
    })
  }, [router])

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