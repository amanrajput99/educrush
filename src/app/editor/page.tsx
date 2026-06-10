import type { Metadata } from 'next'
import EditorClient from './EditorClient'

export const metadata: Metadata = {
  title: 'Free Online Code Editor — HTML, Python, C++, Java | EduCrush',
  description: 'Free browser-based code editor for students. Write and run HTML, Python, C++, JavaScript, Java code online. No install needed. Built for BCA & BTech students.',
  alternates: {
    canonical: 'https://educrush.in/editor',
  },
  openGraph: {
    type: 'website',
    url: 'https://educrush.in/editor',
    title: 'Free Online Code Editor | EduCrush',
    description: 'Write and run HTML, Python, C++, JS code in your browser. Free, no login.',
    siteName: 'EduCrush',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online Code Editor | EduCrush',
    description: 'Run HTML, Python, C++, JS code in browser. Free for students.',
    images: ['/og-image.png'],
  },
}

export default function EditorPage() {
  return <EditorClient />
}