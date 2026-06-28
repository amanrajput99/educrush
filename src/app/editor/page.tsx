import type { Metadata } from 'next'
import EditorClient from './EditorClient'

const BASE_URL = 'https://educrush.in'

export const metadata: Metadata = {
  title: 'Free Online Code Editor — Run HTML, Python, C++, Java in Browser',
  description: 'Free browser-based code editor for students. Write and run HTML, CSS, JavaScript, Python, C++, Java code online — no install, no login. Built for BCA & BTech students in India.',
  keywords: [
    'free online code editor India', 'run Python online free',
    'run HTML CSS JavaScript online', 'online C++ compiler free',
    'online Java compiler free', 'browser code editor students',
    'code editor no install India', 'online IDE for students free',
    'run code online free India', 'HTML CSS editor online free',
    'EduCrush code editor', 'free coding playground students',
  ],
  alternates: { canonical: `${BASE_URL}/editor` },
  openGraph: {
    type: 'website', url: `${BASE_URL}/editor`,
    title: 'Free Online Code Editor — Run HTML, Python, C++ | EduCrush',
    description: 'Write and run HTML, Python, C++, JS, Java in browser. No install, no login. Free for students.',
    siteName: 'EduCrush',
    images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'EduCrush Online Code Editor' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online Code Editor | EduCrush',
    description: 'Run HTML, Python, C++, JS, Java in browser. Free, no login needed.',
    images: [`${BASE_URL}/og-image.png`],
  },
  robots: { index: true, follow: true },
}

function EditorJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'EduCrush Online Code Editor',
    url: `${BASE_URL}/editor`,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web Browser',
    description: 'Free browser-based code editor. Write and run HTML, Python, C++, JavaScript, Java online. No install required.',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    featureList: ['HTML/CSS/JS Editor', 'Python Online Compiler', 'C++ Online Compiler', 'Java Online Compiler', 'No login required', 'Auto-save'],
    provider: { '@type': 'EducationalOrganization', name: 'EduCrush', url: BASE_URL },
    audience: { '@type': 'EducationalAudience', educationalRole: 'student' },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export default function EditorPage() {
  return (
    <>
      <EditorJsonLd />
      <EditorClient />
    </>
  )
}