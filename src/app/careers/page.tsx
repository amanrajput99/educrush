import type { Metadata } from 'next'
import CareersClient from './CareersClient'

const BASE_URL = 'https://educrush.in'

export const metadata: Metadata = {
  title: 'Careers at EduCrush — Ambassador & Volunteer Programs',
  description: "Join EduCrush as a Student Ambassador or Volunteer Contributor. Help build India's best free learning platform. Open for BTech, BCA, Diploma students across India. Get certificate & LOR.",
  keywords: [
    'EduCrush careers', 'student volunteer India', 'campus ambassador program India',
    'EduCrush ambassador', 'student ambassador BTech BCA',
    'volunteer contribute notes India', 'student contributor program',
    'campus representative program India', 'internship certificate for students',
    'letter of recommendation students India', 'EduCrush join',
  ],
  alternates: { canonical: `${BASE_URL}/careers` },
  openGraph: {
    type: 'website', url: `${BASE_URL}/careers`,
    title: 'Careers at EduCrush — Join as Ambassador or Volunteer',
    description: "Become a campus ambassador or volunteer contributor. Get certificate, LOR & recognition. Help build India's free student platform.",
    siteName: 'EduCrush',
    images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'Careers at EduCrush — Ambassador & Volunteer' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Join EduCrush — Ambassador & Volunteer Roles',
    description: 'Campus ambassador or volunteer contributor — get certificate & LOR. Open for all students.',
    images: [`${BASE_URL}/og-image.png`],
  },
  robots: { index: true, follow: true },
}

function CareersJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Careers at EduCrush — Ambassador & Volunteer Programs',
        url: `${BASE_URL}/careers`,
        description: "Join EduCrush as a Student Ambassador or Volunteer Contributor.",
        inLanguage: 'en-IN',
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
            { '@type': 'ListItem', position: 2, name: 'Careers', item: `${BASE_URL}/careers` },
          ],
        },
      },
      // JobPosting — Ambassador role
      {
        '@type': 'JobPosting',
        title: 'Student Ambassador',
        description: 'Represent EduCrush at your college. Guide students to free resources, host small events, and earn a certificate and letter of recommendation.',
        hiringOrganization: { '@type': 'Organization', name: 'EduCrush', url: BASE_URL },
        jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressCountry: 'IN' } },
        employmentType: 'VOLUNTEER',
        url: `${BASE_URL}/careers/ambassador`,
        datePosted: '2025-01-01',
        validThrough: '2026-12-31',
        isAccessibleForFree: true,
      },
      // JobPosting — Volunteer role
      {
        '@type': 'JobPosting',
        title: 'Volunteer Contributor',
        description: 'Contribute notes, projects, or blog articles to EduCrush. Get a contributor badge, credit on your content, and help thousands of students.',
        hiringOrganization: { '@type': 'Organization', name: 'EduCrush', url: BASE_URL },
        jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressCountry: 'IN' } },
        employmentType: 'VOLUNTEER',
        url: `${BASE_URL}/careers/volunteer`,
        datePosted: '2025-01-01',
        validThrough: '2026-12-31',
        isAccessibleForFree: true,
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export default function CareersPage() {
  return (
    <>
      <CareersJsonLd />
      <CareersClient />
    </>
  )
}