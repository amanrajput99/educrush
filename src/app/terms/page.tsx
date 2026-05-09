import type { Metadata } from 'next'
import TermsClient from './TermsClient'

export const metadata: Metadata = {
  title: 'Terms of Service — EduCrush',
  description: 'Read the Terms of Service for EduCrush. By using our platform, you agree to these terms. EduCrush provides free educational resources for students across India.',
  alternates: { canonical: 'https://educrush.in/terms' },
  robots: { index: false, follow: false },
  openGraph: {
    type: 'website', url: 'https://educrush.in/terms',
    title: 'Terms of Service | EduCrush',
    description: 'Terms and conditions for using EduCrush.',
    siteName: 'EduCrush',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
}

export default function TermsPage() {
  return <TermsClient />
}
