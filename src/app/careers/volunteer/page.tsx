import type { Metadata } from 'next'
import VolunteerClient from './VolunteerClient'

export const metadata: Metadata = {
  title: 'Volunteer & Contribute to EduCrush — Share Notes or Projects',
  description: 'Volunteer with EduCrush. Contribute notes, projects, or articles. Get a Contributor Badge, credit on your content, and early feature access. Impact thousands of students.',
  keywords: ['volunteer EduCrush', 'contribute notes India', 'student contributor program', 'share study material India'],
  alternates: { canonical: 'https://educrush.in/careers/volunteer' },
  openGraph: {
    type: 'website', url: 'https://educrush.in/careers/volunteer',
    title: 'Volunteer & Contributor Program | EduCrush',
    description: 'Contribute notes or projects to EduCrush. Help thousands of students.',
    siteName: 'EduCrush',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'EduCrush Volunteer' }],
  },
  twitter: { card: 'summary_large_image', title: 'Volunteer at EduCrush', description: 'Contribute and impact thousands of students.', images: ['/og-image.png'] },
}

export default function VolunteerPage() {
  return <VolunteerClient />
}
