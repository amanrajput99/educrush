import type { Metadata } from 'next'
import AiClient from './AiClient'

export const metadata: Metadata = {
  title: 'EduCrush AI — Free AI Study Assistant for Students',
  description: 'EduCrush AI is a free AI-powered study assistant. Ask questions, get explanations in Computer Science, JAVA, Maths, Physics & more. Powered by Groq, Gemini & Claude.',
  keywords: ['free AI study assistant', 'AI for students', 'AI tutor India', 'free AI chatbot students', 'EduCrush AI', 'Groq AI free', 'Gemini AI students'],
  alternates: { canonical: 'https://educrush.in/ai' },
  openGraph: {
    type: 'website', url: 'https://educrush.in/ai',
    title: 'EduCrush AI — Free AI Study Assistant',
    description: 'Free AI chatbot for students. Ask anything — concepts, code, notes.',
    siteName: 'EduCrush',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'EduCrush AI' }],
  },
  twitter: { card: 'summary_large_image', title: 'EduCrush AI — Free Study Assistant', description: 'Free AI for Indian students.', images: ['/og-image.png'] },
}

export default function AiPage() {
  return <AiClient />
}
