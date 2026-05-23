// app/admission/page.tsx
// ✅ Ye SERVER component hai — metadata export kar sakta hai
// AdmissionPageClient mein saara 'use client' code hai

import type { Metadata } from 'next'
import { AdmissionPageClient } from './AdmissionPageClient'

export const metadata: Metadata = {
  title: 'Free College Admission Guidance 2026 — Dehradun, Delhi, Bihar | EduCrush',
  description: 'Compare top colleges in Dehradun, Delhi & across India for BTech, BCA, Diploma. Free counseling on WhatsApp. Special help for Bihar students — DRCC loan guidance.',
  keywords: ['college admission 2026', 'BTech admission Dehradun', 'BCA admission Delhi', 'Bihar DRCC loan', 'free college counseling'],
  openGraph: {
    title: 'Free College Admission Guidance 2026 | EduCrush',
    description: 'Compare top colleges in Dehradun & Delhi. 100% free counseling on WhatsApp. Bihar students: DRCC loan help included.',
    url: 'https://educrush.in/admission',
    siteName: 'EduCrush',
    images: [
      {
        url: 'https://educrush.in/og-admission.png', // apni OG image yahan lagao
        width: 1200,
        height: 630,
        alt: 'EduCrush — Free College Admission Guidance 2026',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free College Admission Guidance 2026 | EduCrush',
    description: 'Compare top colleges. Free WhatsApp counseling. Bihar DRCC loan help.',
    images: ['https://educrush.in/og-admission.png'],
  },
  alternates: {
    canonical: 'https://educrush.in/admission',
  },
}

export default function AdmissionPage() {
  return <AdmissionPageClient />
}