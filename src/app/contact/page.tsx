import type { Metadata } from 'next'
import ContactClient from './ContactClient'

export const metadata: Metadata = {
  title: 'Contact EduCrush — Get Help or Collaborate',
  description: 'Contact EduCrush for support, collaboration, or queries. Reach us at educrushofficial@gmail.com or join our Telegram community. We reply within 24 hours.',
  keywords: ['contact EduCrush', 'EduCrush email', 'EduCrush support', 'EduCrush Telegram'],
  alternates: { canonical: 'https://educrush.in/contact' },
  openGraph: {
    type: 'website', url: 'https://educrush.in/contact',
    title: 'Contact EduCrush',
    description: 'Reach EduCrush for support or collaboration. We reply within 24 hours.',
    siteName: 'EduCrush',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Contact EduCrush' }],
  },
  twitter: { card: 'summary_large_image', title: 'Contact EduCrush', description: 'Get in touch with EduCrush.', images: ['/og-image.png'] },
}

export default function ContactPage() {
  return <ContactClient />
}
