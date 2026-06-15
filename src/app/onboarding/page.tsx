// src/app/onboarding/page.tsx
import type { Metadata } from 'next'
import OnboardingClient from './OnboardingClient'

export const metadata: Metadata = {
  title: 'Welcome to EduCrush',
  robots: { index: false },
}

export default function OnboardingPage() {
  return <OnboardingClient />
}
