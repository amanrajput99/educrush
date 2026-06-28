import type { Metadata } from 'next'
import VisionClient from './VisionClient'

const BASE_URL = 'https://educrush.in'

export const metadata: Metadata = {
  title: 'Our Vision — Free Quality Education for Every Student in India',
  description: "EduCrush's mission: make quality education free and accessible for every BCA, BTech, Diploma student in India. Read our roadmap, values, and long-term vision.",
  keywords: [
    'EduCrush vision', 'free education India mission',
    'EduCrush roadmap', 'education for all India',
    'free quality education India', 'EduCrush goals',
    'why EduCrush is free', 'free learning platform India vision',
  ],
  alternates: { canonical: `${BASE_URL}/vision` },
  openGraph: {
    type: 'website', url: `${BASE_URL}/vision`,
    title: 'Our Vision — Free Education for Every Student | EduCrush',
    description: 'Quality education, free forever, for every student in India — no paywall, no barriers.',
    siteName: 'EduCrush',
    images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'EduCrush Vision — Free Education India' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EduCrush Vision — Free Education for Every Indian Student',
    description: 'Quality education, free forever, for every student in India.',
    images: [`${BASE_URL}/og-image.png`],
  },
  robots: { index: true, follow: true },
}

function VisionJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'EduCrush Vision — Free Education for Every Student in India',
    url: `${BASE_URL}/vision`,
    description: "EduCrush's vision is to make quality education free and accessible for every student in India.",
    inLanguage: 'en-IN',
    isPartOf: { '@type': 'EducationalOrganization', name: 'EduCrush', url: BASE_URL },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'Vision', item: `${BASE_URL}/vision` },
      ],
    },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export default function VisionPage() {
  return (
    <>
      <VisionJsonLd />
      <VisionClient />
    </>
  )
}