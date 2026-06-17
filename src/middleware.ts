// src/middleware.ts
// Dashboard aur onboarding ko protect karta hai — bina login ke nahi jaane deta

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Yeh routes sirf logged-in users ke liye hain
const PROTECTED = ['/dashboard', '/onboarding']

// Yeh routes logged-in users ke liye nahi hain (already in toh redirect)
const AUTH_ROUTES = ['/login']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: getUser() validates the session with Supabase Auth server —
  // never trust getSession() alone inside middleware, it only reads the cookie.
  const { data: { user } } = await supabase.auth.getUser()

  // Protected route pe jaana tha aur login nahi — login pe bhejo
  if (PROTECTED.some(p => pathname.startsWith(p)) && !user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Already logged in aur login page pe ja raha — dashboard pe bhejo
  if (AUTH_ROUTES.some(p => pathname.startsWith(p)) && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/|public/).*)',
  ],
}
