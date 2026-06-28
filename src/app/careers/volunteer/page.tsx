import type { Metadata } from 'next'
import VolunteerClient from './VolunteerClient'

const BASE_URL = 'https://educrush.in'

export const metadata: Metadata = {
  title: 'Volunteer & Contribute to EduCrush — Share Notes, Projects or Articles',
  description: 'Volunteer with EduCrush. Contribute notes, web dev projects, or articles. Get a Contributor Badge, full credit on your content, and impact thousands of students across India. 100% free.',
  keywords: [
    'volunteer EduCrush', 'contribute notes India',
    'student contributor program India', 'share study material India',
    'contribute projects EduCrush', 'write articles EduCrush',
    'student volunteer program India', 'contribute notes get credit',
    'EduCrush volunteer apply', 'share notes get badge',
    'how to contribute study material India',
  ],
  alternates: { canonical: `${BASE_URL}/careers/volunteer` },
  openGraph: {
    type: 'website', url: `${BASE_URL}/careers/volunteer`,
    title: 'Volunteer & Contribute to EduCrush — Impact Thousands of Students',
    description: 'Share notes, projects or articles. Get a Contributor Badge and help thousands of students — completely free.',
    siteName: 'EduCrush',
    images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'Volunteer at EduCrush — Contributor Program' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Volunteer at EduCrush — Get Contributor Badge',
    description: 'Contribute notes, projects or articles. Impact thousands of students and get recognized.',
    images: [`${BASE_URL}/og-image.png`],
  },
  robots: { index: true, follow: true },
}

function VolunteerJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: 'Volunteer Content Contributor',
    description: 'Contribute notes, web development projects, or blog articles to EduCrush. Get a Contributor Badge, full credit on your content, early feature access, and help thousands of students across India.',
    hiringOrganization: { '@type': 'Organization', name: 'EduCrush', url: BASE_URL },
    jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressCountry: 'IN' } },
    employmentType: 'VOLUNTEER',
    url: `${BASE_URL}/careers/volunteer`,
    datePosted: '2025-01-01',
    validThrough: '2026-12-31',
    responsibilities: 'Contribute study notes, web dev projects, or articles for Indian students',
    qualifications: 'Any student with quality notes or projects to share',
    incentiveCompensation: 'Contributor Badge, Content Credit, Early Feature Access',
    applicationContact: { '@type': 'ContactPoint', url: `${BASE_URL}/careers/volunteer` },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export default function VolunteerPage() {
  return (
    <>
      <VolunteerJsonLd />
      <VolunteerClient />
    </>
  )
}