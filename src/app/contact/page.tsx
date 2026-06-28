import type { Metadata } from 'next'
import ContactClient from './ContactClient'

const BASE_URL = 'https://educrush.in'

export const metadata: Metadata = {
  title: 'Contact EduCrush — Get Help, Report Issue or Collaborate',
  description: 'Contact EduCrush for support, collaboration, content contribution, or general queries. Email: educrushofficial@gmail.com. WhatsApp & Telegram available. We reply within 24 hours.',
  keywords: [
    'contact EduCrush', 'EduCrush email', 'EduCrush support',
    'EduCrush Telegram', 'EduCrush WhatsApp', 'EduCrush helpline',
    'EduCrush collaboration', 'report issue EduCrush',
    'EduCrush contact form', 'educrushofficial@gmail.com',
  ],
  alternates: { canonical: `${BASE_URL}/contact` },
  openGraph: {
    type: 'website', url: `${BASE_URL}/contact`,
    title: 'Contact EduCrush — Help & Collaboration',
    description: 'Reach EduCrush for support, collaboration, or queries. Email or Telegram. We reply within 24 hours.',
    siteName: 'EduCrush',
    images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'Contact EduCrush' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact EduCrush',
    description: 'Get in touch with EduCrush — 24 hour reply via WhatsApp & email.',
    images: [`${BASE_URL}/og-image.png`],
  },
  robots: { index: true, follow: true },
}

function ContactJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact EduCrush',
    url: `${BASE_URL}/contact`,
    description: 'Contact EduCrush for support, collaboration, or queries. We reply within 24 hours.',
    inLanguage: 'en-IN',
    mainEntity: {
      '@type': 'EducationalOrganization',
      name: 'EduCrush',
      url: BASE_URL,
      email: 'educrushofficial@gmail.com',
      contactPoint: [
        { '@type': 'ContactPoint', contactType: 'customer support', availableLanguage: ['English', 'Hindi'] },
        { '@type': 'ContactPoint', contactType: 'technical support', email: 'educrushofficial@gmail.com' },
      ],
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'Contact', item: `${BASE_URL}/contact` },
      ],
    },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export default function ContactPage() {
  return (
    <>
      <ContactJsonLd />
      <ContactClient />
    </>
  )
}