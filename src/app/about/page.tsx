import type { Metadata } from 'next'
import AboutClient from './AboutClient'

const BASE_URL = 'https://educrush.in'

export const metadata: Metadata = {
  title: 'About EduCrush — Our Mission, Team & Story',
  description: "Learn about EduCrush — India's free student learning platform. Started by Aman Kumar Singh, a BTech CSE student from Dehradun. Helping 10,000+ students with free notes, projects & AI tools.",
  keywords: [
    'about EduCrush', 'EduCrush team', 'EduCrush founder',
    'Aman Kumar Singh EduCrush', 'Aman Kumar Singh founder',
    'free education platform India', 'EduCrush mission', 'EduCrush story',
    'EduCrush Dehradun', 'student built platform India',
  ],
  alternates: { canonical: `${BASE_URL}/about` },
  openGraph: {
    type: 'profile',
    url: `${BASE_URL}/about`,
    title: 'About EduCrush — Mission, Team & Story',
    description: 'EduCrush was started by Aman Kumar Singh, a BTech CSE student from Dehradun. Helping 10,000+ students learn for free.',
    siteName: 'EduCrush',
    images: [{ url: `${BASE_URL}/og-about.png`, width: 1200, height: 630, alt: 'About EduCrush — Team & Mission' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About EduCrush — Founder & Mission',
    description: "Meet Aman Kumar Singh — the BTech student who built India's free student platform.",
    images: [`${BASE_URL}/og-about.png`],
  },
  robots: { index: true, follow: true },
}

function AboutPageJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      // Person schema — about page pe sabse relevant jagah
      {
        '@type': 'Person',
        '@id': `${BASE_URL}/#founder`,
        name: 'Aman Kumar Singh',
        alternateName: 'Aman Rajput',
        description: 'Founder & Lead Developer of EduCrush. BTech CSE student from Dehradun, Uttarakhand building free tools for Indian students.',
        url: `${BASE_URL}/about`,
        image: { '@type': 'ImageObject', url: `${BASE_URL}/founder-photo.jpg`, width: 400, height: 400 },
        jobTitle: 'Founder & Lead Developer',
        worksFor: { '@type': 'EducationalOrganization', name: 'EduCrush', url: BASE_URL },
        nationality: 'Indian',
        address: { '@type': 'PostalAddress', addressLocality: 'Dehradun', addressRegion: 'Uttarakhand', addressCountry: 'IN' },
        sameAs: [
          'https://www.linkedin.com/in/aman-kumar-singh-4618aa344',
          'https://github.com/amanrajput99',
          'https://www.instagram.com/_amanrajput_99',
        ],
        knowsAbout: ['Web Development', 'Next.js', 'React', 'Education Technology', 'BTech CSE'],
      },
      // WebPage
      {
        '@type': 'AboutPage',
        '@id': `${BASE_URL}/about`,
        url: `${BASE_URL}/about`,
        name: 'About EduCrush — Mission, Team & Story',
        description: "EduCrush was founded by Aman Kumar Singh, a BTech student from Dehradun. India's free student learning platform.",
        inLanguage: 'en-IN',
        about: { '@id': `${BASE_URL}/#founder` },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
            { '@type': 'ListItem', position: 2, name: 'About', item: `${BASE_URL}/about` },
          ],
        },
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export default function AboutPage() {
  return (
    <>
      <AboutPageJsonLd />
      <AboutClient />
    </>
  )
}