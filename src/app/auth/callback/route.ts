
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  console.log('CALLBACK:', request.url)
  console.log('code:', code)

  if (code) {
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

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    console.log('error:', error?.message)
    console.log('user:', data?.user?.email)

    if (!error && data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_done')
        .eq('id', data.user.id)
        .single()

      if (!profile) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          email: data.user.email!,
          full_name: data.user.user_metadata?.full_name ?? data.user.user_metadata?.name ?? null,
          avatar_url: data.user.user_metadata?.avatar_url ?? data.user.user_metadata?.picture ?? null,
          streak_count: 1,
          last_active: new Date().toISOString(),
          profile_completed: 10,
          onboarding_done: false,
        })
        return NextResponse.redirect(`${origin}/onboarding`)
      }

      return NextResponse.redirect(
        profile.onboarding_done ? `${origin}/dashboard` : `${origin}/onboarding`
      )
    }
  }

  // Code nahi aaya — client side se handle karo
  return NextResponse.redirect(`${origin}/auth/client-callback`)
}