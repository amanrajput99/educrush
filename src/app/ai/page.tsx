import type { Metadata } from 'next'
import AiClient from './AiClient'

const BASE_URL = 'https://educrush.in'

export const metadata: Metadata = {
  title: 'EduCrush AI — Free AI Study Assistant for Students',
  description: 'EduCrush AI is a free AI-powered study assistant for BCA, BTech & Diploma students. Ask questions, get concept explanations, solve coding problems in CS, Java, Maths & Physics. Powered by Groq, Gemini & Claude.',
  keywords: [
    'free AI study assistant India', 'AI tutor for students India',
    'free AI chatbot for students', 'AI for BTech BCA students',
    'EduCrush AI', 'free AI study help India',
    'Groq AI free students', 'Gemini AI study assistant',
    'Claude AI study helper', 'AI for coding problems free',
    'free AI for DSA problems', 'AI explain concepts free',
    'free ChatGPT alternative for students India',
    'AI homework help free India',
  ],
  alternates: { canonical: `${BASE_URL}/ai` },
  openGraph: {
    type: 'website', url: `${BASE_URL}/ai`,
    title: 'EduCrush AI — Free AI Study Assistant for Students',
    description: 'Free AI chatbot for BCA & BTech students. Ask concepts, debug code, solve problems. Powered by Groq, Gemini & Claude.',
    siteName: 'EduCrush',
    images: [{ url: `${BASE_URL}/og-ai.png`, width: 1200, height: 630, alt: 'EduCrush AI — Free Study Assistant' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EduCrush AI — Free AI Study Assistant',
    description: 'Free AI for Indian students. Ask anything — concepts, code, DSA. Powered by Groq, Gemini & Claude.',
    images: [`${BASE_URL}/og-ai.png`],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-snippet': -1 } },
}

function AiJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'EduCrush AI Study Assistant',
        url: `${BASE_URL}/ai`,
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Web Browser',
        description: 'Free AI-powered study assistant for BCA, BTech & Diploma students. Ask questions in Computer Science, Java, Python, Maths, Physics and more.',
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
        provider: { '@type': 'EducationalOrganization', name: 'EduCrush', url: BASE_URL },
        audience: { '@type': 'EducationalAudience', educationalRole: 'student' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Is EduCrush AI completely free?',
            acceptedAnswer: { '@type': 'Answer', text: 'Yes, EduCrush AI is 100% free. No subscription, no credits, no login required to use it.' },
          },
          {
            '@type': 'Question',
            name: 'Which AI models power EduCrush AI?',
            acceptedAnswer: { '@type': 'Answer', text: 'EduCrush AI is powered by Groq, Google Gemini, and Anthropic Claude — some of the best AI models available for fast and accurate answers.' },
          },
          {
            '@type': 'Question',
            name: 'What subjects can I ask EduCrush AI about?',
            acceptedAnswer: { '@type': 'Answer', text: 'You can ask about Computer Science, Data Structures & Algorithms (DSA), DBMS, Operating Systems, Java, Python, C++, Web Development, Engineering Mathematics, Physics, and more.' },
          },
        ],
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export default function AiPage() {
  return (
    <>
      <AiJsonLd />
      <AiClient />
    </>
  )
}