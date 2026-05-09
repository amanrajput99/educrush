import type { Metadata } from 'next'
import VisionClient from './VisionClient'

export const metadata: Metadata = {
  title: 'Our Vision — Free Education for Every Student in India',
  description: "EduCrush's vision: make quality education free for every student in India. Read our roadmap, mission, and what we stand for.",
  keywords: ['EduCrush vision', 'free education India', 'EduCrush roadmap', 'education for all India'],
  alternates: { canonical: 'https://educrush.in/vision' },
  openGraph: {
    type: 'website', url: 'https://educrush.in/vision',
    title: 'Our Vision — Free Education for Every Student | EduCrush',
    description: 'Quality education, free forever, for every student in India.',
    siteName: 'EduCrush',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'EduCrush Vision' }],
  },
  twitter: { card: 'summary_large_image', title: 'EduCrush Vision', description: 'Free education for every Indian student.', images: ['/og-image.png'] },
}

export default function VisionPage() {
  return <VisionClient />
}
