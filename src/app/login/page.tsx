// src/app/login/page.tsx
import type { Metadata } from 'next'
import LoginClient from './LoginClient'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Sign in to EduCrush to save notes, track progress, and get personalized study recommendations.',
  robots: { index: false },
}

export default function LoginPage() {
  return <LoginClient />
}
