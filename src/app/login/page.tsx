import type { Metadata } from 'next'
import { Suspense } from 'react'
import LoginClient from './LoginClient'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Sign in to EduCrush to save notes, track progress, and get personalized study recommendations.',
  robots: { index: false },
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#000' }} />}>
      <LoginClient />
    </Suspense>
  )
}