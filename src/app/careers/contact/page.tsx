import type { Metadata } from 'next'
import CareersContactClient from './CareersContactClient'

export const metadata: Metadata = {
  title: 'Apply to Join EduCrush — Ambassador & Volunteer Form',
  description: 'Apply to join EduCrush as a Student Ambassador or Volunteer Contributor. Fill a simple 2-minute form and our team will get back within 3–5 business days.',
  alternates: { canonical: 'https://educrush.in/careers/contact' },
  openGraph: {
    type: 'website', url: 'https://educrush.in/careers/contact',
    title: 'Apply to Join EduCrush | Careers Form',
    description: 'Simple 2-minute application to join EduCrush team.',
    siteName: 'EduCrush',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Join EduCrush' }],
  },
  twitter: { card: 'summary_large_image', title: 'Apply to Join EduCrush', description: 'Apply as Ambassador or Volunteer.', images: ['/og-image.png'] },
}

export default function CareersContactPage() {
  return <CareersContactClient />
}
