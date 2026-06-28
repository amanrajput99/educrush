import type { Metadata } from 'next'
import AmbassadorClient from './AmbassadorClient'

const BASE_URL = 'https://educrush.in'

export const metadata: Metadata = {
  title: 'Student Ambassador Program — Represent EduCrush at Your College',
  description: 'Apply as an EduCrush Student Ambassador. Represent EduCrush at your college, earn a certificate, letter of recommendation & exclusive perks. Open for BTech, BCA & Diploma students across India.',
  keywords: [
    'student ambassador program India', 'EduCrush ambassador',
    'college ambassador program India', 'campus representative India',
    'student ambassador certificate India', 'campus ambassador BTech BCA',
    'student ambassador letter of recommendation', 'college rep program India',
    'how to become student ambassador India', 'EduCrush ambassador apply',
  ],
  alternates: { canonical: `${BASE_URL}/careers/ambassador` },
  openGraph: {
    type: 'website', url: `${BASE_URL}/careers/ambassador`,
    title: 'EduCrush Student Ambassador Program — Apply Now',
    description: 'Become the face of EduCrush at your college. Certificate + LOR + exclusive perks. Open for all students.',
    siteName: 'EduCrush',
    images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'EduCrush Student Ambassador Program' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EduCrush Ambassador Program — Certificate & LOR',
    description: 'Apply as Student Ambassador. Represent EduCrush, get certificate & letter of recommendation.',
    images: [`${BASE_URL}/og-image.png`],
  },
  robots: { index: true, follow: true },
}

function AmbassadorJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: 'Student Campus Ambassador',
    description: 'Represent EduCrush at your college. Guide students to free notes, projects & AI tools. Earn a certificate, letter of recommendation, and exclusive perks.',
    hiringOrganization: { '@type': 'Organization', name: 'EduCrush', url: BASE_URL },
    jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressCountry: 'IN' } },
    employmentType: 'VOLUNTEER',
    url: `${BASE_URL}/careers/ambassador`,
    datePosted: '2025-01-01',
    validThrough: '2026-12-31',
    responsibilities: 'Represent EduCrush, guide students, host events, grow community at college',
    qualifications: 'BTech, BCA or Diploma student. 2-3 hours per week commitment.',
    incentiveCompensation: 'Certificate, Letter of Recommendation, Priority access, Direct team support',
    applicationContact: { '@type': 'ContactPoint', url: `${BASE_URL}/careers/ambassador` },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export default function AmbassadorPage() {
  return (
    <>
      <AmbassadorJsonLd />
      <AmbassadorClient />
    </>
  )
}