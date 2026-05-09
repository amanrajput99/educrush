import type { Metadata } from 'next'
import AboutClient from './AboutClient'

export const metadata: Metadata = {
  title: 'About EduCrush — Our Mission, Team & Story',
  description: "Learn about EduCrush — India's free student learning platform. Started by BTech student Aman Kumar Singh from Dehradun. Helping 10,000+ students with free notes, projects & AI tools.",
  keywords: ['about EduCrush', 'EduCrush team', 'Aman Kumar Singh', 'free education India', 'EduCrush mission'],
  alternates: { canonical: 'https://educrush.in/about' },
  openGraph: {
    type: 'website', url: 'https://educrush.in/about',
    title: 'About EduCrush — Mission, Team & Story',
    description: 'EduCrush was started by a BTech student from Dehradun. Helping 10,000+ students learn for free.',
    siteName: 'EduCrush',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'About EduCrush' }],
  },
  twitter: { card: 'summary_large_image', title: 'About EduCrush', description: 'Meet the team behind India\'s free student platform.', images: ['/og-image.png'] },
}

export default function AboutPage() {
  return <AboutClient />
}
