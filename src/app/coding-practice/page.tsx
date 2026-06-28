import type { Metadata } from 'next'
import CodingPracticeClient from './CodingPracticeClient'

const BASE_URL = 'https://educrush.in'

export const metadata: Metadata = {
  title: 'Free Coding Practice — Python, Java, C++, JavaScript Problems',
  description: 'Practice coding problems in Python, Java, C++ and JavaScript for free. Beginner to advanced problems with hints, solutions & built-in online code editor. For BCA & BTech students in India.',
  keywords: [
    'free coding practice India', 'Python practice problems free',
    'Java coding practice free', 'C++ practice problems students',
    'JavaScript problems beginners', 'coding problems for BTech BCA',
    'online coding practice no login', 'data structures practice free India',
    'EduCrush coding practice', 'free LeetCode alternative India',
    'coding problems with solutions free', 'beginner coding problems India',
    'DSA practice problems free', 'online code editor free India',
  ],
  alternates: { canonical: `${BASE_URL}/coding-practice` },
  openGraph: {
    type: 'website', url: `${BASE_URL}/coding-practice`,
    title: 'Free Coding Practice — Python, Java, C++, JS | EduCrush',
    description: 'Practice Python, Java, C++ & JavaScript problems free. Hints, solutions & built-in editor. For BCA & BTech students.',
    siteName: 'EduCrush',
    images: [{ url: `${BASE_URL}/og-coding.png`, width: 1200, height: 630, alt: 'EduCrush Free Coding Practice' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Coding Practice — Python, Java, C++ | EduCrush',
    description: 'Practice coding problems free. Hints, solutions & editor built-in.',
    images: [`${BASE_URL}/og-coding.png`],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' } },
}

function CodingPracticeJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'EduCrush Coding Practice',
        url: `${BASE_URL}/coding-practice`,
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Web Browser',
        description: 'Free coding practice platform with Python, Java, C++ & JavaScript problems. Built-in code editor with hints and solutions.',
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
        provider: { '@type': 'EducationalOrganization', name: 'EduCrush', url: BASE_URL },
        audience: { '@type': 'EducationalAudience', educationalRole: 'student' },
        featureList: ['Python Problems', 'Java Problems', 'C++ Problems', 'JavaScript Problems', 'Built-in Code Editor', 'Hints System', 'Solution Reveal', 'Progress Tracking'],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Is EduCrush coding practice free?',
            acceptedAnswer: { '@type': 'Answer', text: 'Yes, all coding problems, hints, solutions and the built-in code editor are completely free. No login required to practice.' },
          },
          {
            '@type': 'Question',
            name: 'Which languages are available for coding practice on EduCrush?',
            acceptedAnswer: { '@type': 'Answer', text: 'EduCrush offers coding problems in Python, Java, C++, and JavaScript — with more languages being added regularly.' },
          },
          {
            '@type': 'Question',
            name: 'Are hints and solutions available for all problems?',
            acceptedAnswer: { '@type': 'Answer', text: 'Yes, most problems have multiple hints that you can reveal one at a time, plus a complete solution with explanation.' },
          },
        ],
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export default function CodingPracticePage() {
  return (
    <>
      <CodingPracticeJsonLd />
      <CodingPracticeClient />
    </>
  )
}