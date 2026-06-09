import type { Metadata } from 'next'
import { getNotesFromSupabase } from '@/lib/NoteService'
import { notes as fallbackNotes } from '@/data/Notes'
import NotesClient from './NotesClient'

// ── SEO ───────────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'Free Notes — BCA, BTech, Diploma, Class 10–12 | EduCrush',
  description:
    'Download free handwritten and typed notes for BCA, BTech, Diploma, Class 10, 11, 12, MCA & BSc students. Subjects include DSA, DBMS, OS, JAVA, Computer Networks, Physics, Maths & more. No login required.',
  keywords: [
    'free notes download',
    'BCA notes PDF',
    'BTech notes PDF',
    'BCA 3rd semester notes',
    'BTech CSE notes free download',
    'DSA notes for beginners',
    'DBMS notes free PDF',
    'Operating System notes BTech',
    'Computer Networks notes BCA',
    'Class 10 notes',
    'Class 12 notes',
    'Diploma notes',
    'JAVA notes free',
    'handwritten notes India',
    'free study material India',
    'EduCrush notes',
  ],
  alternates: { canonical: 'https://educrush.in/notes' },
  openGraph: {
    type: 'website',
    url: 'https://educrush.in/notes',
    title: 'Free Notes — BCA, BTech, Diploma, Class 10–12 | EduCrush',
    description:
      'Free handwritten & typed notes for BCA, BTech, Diploma & Class 10–12 students. No login, no paywall — ever.',
    siteName: 'EduCrush',
    images: [
      {
        url: '/og-notes.png',
        width: 1200,
        height: 630,
        alt: 'EduCrush Free Notes — BCA, BTech, Diploma',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Notes for BCA & BTech Students | EduCrush',
    description:
      'Download free semester-wise notes for BCA, BTech, Diploma & Class 10–12. No sign-up needed.',
    images: ['/og-notes.png'],
  },
}

// ── Page — Server Component (SSR) ─────────────────────────────────────────────
// Data fetch SERVER pe hota hai — Google ko poore notes milenge, loading screen nahi
export default async function NotesPage() {
  let initialNotes = fallbackNotes

  try {
    const data = await getNotesFromSupabase()
    if (data && data.length > 0) {
      initialNotes = data
    }
  } catch {
    // Supabase fail hone pe fallback notes use honge
    initialNotes = fallbackNotes
  }

  return <NotesClient initialNotes={initialNotes} />
}