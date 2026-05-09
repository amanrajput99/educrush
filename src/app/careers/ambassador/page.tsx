import type { Metadata } from 'next'
import AmbassadorClient from './AmbassadorClient'

export const metadata: Metadata = {
  title: 'Student Ambassador Program — Represent EduCrush at Your College',
  description: 'Apply as an EduCrush Student Ambassador. Represent EduCrush at your college, guide students, earn a certificate & letter of recommendation. Open for BTech, BCA, Diploma students.',
  keywords: ['student ambassador program India', 'EduCrush ambassador', 'college ambassador program', 'campus representative India'],
  alternates: { canonical: 'https://educrush.in/careers/ambassador' },
  openGraph: {
    type: 'website', url: 'https://educrush.in/careers/ambassador',
    title: 'Student Ambassador Program | EduCrush',
    description: 'Become the face of EduCrush at your college. Apply now.',
    siteName: 'EduCrush',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'EduCrush Ambassador' }],
  },
  twitter: { card: 'summary_large_image', title: 'EduCrush Ambassador Program', description: 'Apply as Student Ambassador.', images: ['/og-image.png'] },
}

export default function AmbassadorPage() {
  return <AmbassadorClient />
}
