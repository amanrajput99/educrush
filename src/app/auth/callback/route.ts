import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const token_hash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type') as 'email' | 'magiclink' | null
  const next = requestUrl.searchParams.get('next')
  const origin = requestUrl.origin

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  let user = null

  // Case 1: Google / GitHub OAuth — comes with "code"
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) user = data.user
  }

  // Case 2: Magic Link — comes with "token_hash" + "type"
  if (!user && token_hash && type) {
    const { data, error } = await supabase.auth.verifyOtp({ token_hash, type })
    if (!error) user = data.user
  }

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_done')
      .eq('id', user.id)
      .maybeSingle()

    if (!profile) {
      // upsert + ignoreDuplicates so this can't collide with the
      // client-callback fallback trying to insert the same row
      await supabase.from('profiles').upsert({
        id: user.id,
        email: user.email!,
        full_name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
        avatar_url: user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null,
        streak_count: 1,
        last_active: new Date().toISOString(),
        profile_completed: 10,
        onboarding_done: false,
      }, { onConflict: 'id', ignoreDuplicates: true })

      // First-time user — still go through onboarding, but remember
      // where they wanted to go (carried as a query param)
      const onboardingUrl = next
        ? `${origin}/onboarding?next=${encodeURIComponent(next)}`
        : `${origin}/onboarding`
      return NextResponse.redirect(onboardingUrl)
    }

    if (!profile.onboarding_done) {
      const onboardingUrl = next
        ? `${origin}/onboarding?next=${encodeURIComponent(next)}`
        : `${origin}/onboarding`
      return NextResponse.redirect(onboardingUrl)
    }

    // Returning user with completed profile — send back to where
    // they came from (e.g. the coding problem they were solving)
    return NextResponse.redirect(next ? `${origin}${next}` : `${origin}/dashboard`)
  }

  // Neither code nor token_hash worked — fall back to client-side session check
  const clientCallbackUrl = next
    ? `${origin}/auth/client-callback?next=${encodeURIComponent(next)}`
    : `${origin}/auth/client-callback`
  return NextResponse.redirect(clientCallbackUrl)
}