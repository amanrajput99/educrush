import type { Metadata } from 'next'
import CareersClient from './CareersClient'

export const metadata: Metadata = {
  title: 'Careers & Volunteer at EduCrush — Join Our Mission',
  description: "Join EduCrush as a Student Ambassador or Volunteer. Help build India's best free learning platform. Open roles for students across India.",
  keywords: ['EduCrush careers', 'student volunteer India', 'campus ambassador program', 'EduCrush ambassador', 'student ambassador India'],
  alternates: { canonical: 'https://educrush.in/careers' },
  openGraph: {
    type: 'website', url: 'https://educrush.in/careers',
    title: 'Join EduCrush — Volunteer & Careers',
    description: 'Become a campus ambassador or volunteer. Help build free education for Indian students.',
    siteName: 'EduCrush',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Careers at EduCrush' }],
  },
  twitter: { card: 'summary_large_image', title: 'Careers at EduCrush', description: 'Ambassador & Volunteer roles open.', images: ['/og-image.png'] },
}

export default function CareersPage() {
  return <CareersClient />
}
