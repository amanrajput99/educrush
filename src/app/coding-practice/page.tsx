import type { Metadata } from 'next'
import CodingPracticeClient from './CodingPracticeClient'

export const metadata: Metadata = {
  title: 'Free Coding Practice — Python, Java, C++, JavaScript Problems',
  description: 'Practice coding problems in Python, Java, C++ and JavaScript for free. Beginner to advanced problems with hints, solutions & built-in code editor for BCA & BTech students.',
  keywords: ['coding practice free', 'Python practice problems', 'Java coding practice', 'C++ practice', 'JavaScript problems', 'coding for beginners India', 'BTech coding practice', 'EduCrush coding'],
  alternates: { canonical: 'https://educrush.in/coding-practice' },
  openGraph: {
    type: 'website', url: 'https://educrush.in/coding-practice',
    title: 'Free Coding Practice — Python, Java, C++, JS | EduCrush',
    description: 'Practice programming for free. Beginner to advanced with built-in editor.',
    siteName: 'EduCrush',
    images: [{ url: '/og-coding.png', width: 1200, height: 630, alt: 'EduCrush Coding Practice' }],
  },
  twitter: { card: 'summary_large_image', title: 'Free Coding Practice | EduCrush', description: 'Python, Java, C++ & JS problems for students.', images: ['/og-coding.png'] },
}

export default function CodingPracticePage() {
  return <CodingPracticeClient />
}
