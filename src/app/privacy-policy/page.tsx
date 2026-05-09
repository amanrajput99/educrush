import type { Metadata } from 'next'
import PrivacyClient from './PrivacyClient'

export const metadata: Metadata = {
  title: 'Privacy Policy — EduCrush',
  description: 'Read EduCrush\'s Privacy Policy. We are committed to protecting your privacy. Learn how we collect, use, and safeguard your information on our free student platform.',
  alternates: { canonical: 'https://educrush.in/privacy-policy' },
  robots: { index: false, follow: false },
  openGraph: {
    type: 'website', url: 'https://educrush.in/privacy-policy',
    title: 'Privacy Policy | EduCrush',
    description: 'How EduCrush collects and protects your data.',
    siteName: 'EduCrush',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
}

export default function PrivacyPage() {
  return <PrivacyClient />
}
