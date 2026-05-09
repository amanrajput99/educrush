import type { Metadata } from 'next'
import NotesClient from './NotesClient'

export const metadata: Metadata = {
  title: 'Free Notes — BCA, BTech, Diploma, Class 10–12',
  description: 'Download free handwritten and typed notes for BCA, BTech, Diploma, Class 10, 11, 12, MCA & BSc students. Subjects include JAVA, Computer Science, Physics, Maths & more. No login required.',
  keywords: ['free notes download', 'BCA notes PDF', 'BTech notes PDF', 'Class 10 notes', 'Class 12 notes', 'Diploma notes', 'JAVA notes free', 'handwritten notes India', 'free study material India', 'EduCrush notes'],
  alternates: { canonical: 'https://educrush.in/notes' },
  openGraph: {
    type: 'website', url: 'https://educrush.in/notes',
    title: 'Free Notes — BCA, BTech, Diploma, Class 10–12 | EduCrush',
    description: 'Free handwritten & typed notes for BCA, BTech, Diploma & Class 10–12 students.',
    siteName: 'EduCrush',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'EduCrush Free Notes' }],
  },
  twitter: { card: 'summary_large_image', title: 'Free Notes | EduCrush', description: 'Free notes for Indian students.', images: ['/og-image.png'] },
}

export default function NotesPage() {
  return <NotesClient />
}
