import { getPublishedColleges } from '@/lib/admissionService'
import CollegesClient from './CollegesClient'
import type { Metadata } from 'next'

const BASE_URL = 'https://educrush.in'
export const revalidate = 300

export const metadata: Metadata = {
  title: 'Top Colleges in India 2026 — BTech, BCA, Diploma | EduCrush',
  description: 'Compare top BTech, BCA & Diploma colleges in Dehradun, Delhi, Noida & across India. Fees, NIRF rank, placement, hostel details. Free admission guidance on EduCrush.',
  keywords: [
    'top BTech colleges India 2026', 'best BCA colleges India 2026',
    'BTech colleges Dehradun 2026', 'engineering colleges Uttarakhand',
    'compare colleges India fees', 'NIRF ranked colleges 2026',
    'BTech colleges with placement India', 'BCA colleges Delhi NCR',
    'college comparison India free', 'EduCrush college list',
    'best engineering colleges Uttarakhand', 'private BTech colleges India fees',
  ],
  alternates: { canonical: `${BASE_URL}/admission/colleges` },
  openGraph: {
    type: 'website', url: `${BASE_URL}/admission/colleges`,
    title: 'Top BTech, BCA & Diploma Colleges 2026 | EduCrush',
    description: 'Compare top colleges in Dehradun, Delhi & across India. Fees, NIRF rank, placement details. Free guidance.',
    siteName: 'EduCrush',
    images: [{ url: `${BASE_URL}/og-admission.png`, width: 1200, height: 630, alt: 'Top Colleges 2026 — EduCrush' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Top Colleges India 2026 — BTech, BCA | EduCrush',
    description: 'Compare fees, NIRF rank, placement of top colleges. Free guidance.',
    images: [`${BASE_URL}/og-admission.png`],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' } },
}

function CollegesListJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Top Colleges in India 2026 — BTech, BCA, Diploma',
    url: `${BASE_URL}/admission/colleges`,
    description: 'Compare top BTech, BCA & Diploma colleges in India. Fees, NIRF rank, placement details. Free admission guidance.',
    inLanguage: 'en-IN',
    isAccessibleForFree: true,
    provider: { '@type': 'EducationalOrganization', name: 'EduCrush', url: BASE_URL },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'Admission', item: `${BASE_URL}/admission` },
        { '@type': 'ListItem', position: 3, name: 'Colleges', item: `${BASE_URL}/admission/colleges` },
      ],
    },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export default async function CollegesPage() {
  const colleges = await getPublishedColleges()
  return (
    <>
      <CollegesListJsonLd />
      <CollegesClient colleges={colleges} />
    </>
  )
}