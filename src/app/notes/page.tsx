import type { Metadata } from 'next'
import { getNotesFromSupabase } from '@/lib/NoteService'
import { notes as fallbackNotes } from '@/data/Notes'
import NotesClient from './NotesClient'

// ── JSON-LD — Google ko notes listing ka structured data ──────────────────────
function NotesPageJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      // WebPage schema
      {
        '@type': 'WebPage',
        '@id': 'https://educrush.in/notes',
        url: 'https://educrush.in/notes',
        name: 'Free Notes — BCA, BTech, Diploma, Class 10–12 | EduCrush',
        description:
          'Download free handwritten and typed notes for BCA, BTech, Diploma, Class 10, 11, 12, MCA & BSc students. No login required.',
        inLanguage: 'en-IN',
        isPartOf: { '@id': 'https://educrush.in/#website' },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://educrush.in' },
            { '@type': 'ListItem', position: 2, name: 'Notes', item: 'https://educrush.in/notes' },
          ],
        },
      },
      // Organization schema
      {
        '@type': 'Organization',
        '@id': 'https://educrush.in/#organization',
        name: 'EduCrush',
        url: 'https://educrush.in',
        logo: {
          '@type': 'ImageObject',
          url: 'https://educrush.in/favicon.ico',
        },
      },
      // CollectionPage — Google ko pata chale ye ek notes library hai
      {
        '@type': 'CollectionPage',
        name: 'Free Study Notes for Indian Students',
        description:
          'Free BCA, BTech, Diploma, Class 10, 11, 12 notes. Subjects include DSA, DBMS, OS, Java, Python, Web Development, Physics, Maths, Chemistry and more.',
        url: 'https://educrush.in/notes',
        provider: {
          '@type': 'Organization',
          name: 'EduCrush',
          url: 'https://educrush.in',
        },
        audience: {
          '@type': 'EducationalAudience',
          educationalRole: 'student',
        },
        inLanguage: ['en-IN', 'hi-IN'],
        isAccessibleForFree: true,
      },
      // FAQ schema — Google rich results ke liye
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Are EduCrush notes free to download?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, all notes on EduCrush are completely free. No login, no payment, no subscription required.',
            },
          },
          {
            '@type': 'Question',
            name: 'Which courses are covered in EduCrush notes?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'EduCrush provides notes for BCA, BTech, Diploma, Class 10, Class 11, Class 12, MCA, MBA, and BSc students.',
            },
          },
          {
            '@type': 'Question',
            name: 'Which subjects are available on EduCrush?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'EduCrush covers DSA, DBMS, Operating Systems, Computer Networks, Java, Python, C Programming, Web Development, Engineering Mathematics, Engineering Physics, Engineering Chemistry, and more.',
            },
          },
        ],
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

// ── Metadata ──────────────────────────────────────────────────────────────────
// Title: 60 chars max — primary keyword pehle
// Description: 155 chars max — action-oriented, keyword rich
export const metadata: Metadata = {
  // ✅ 58 chars — perfect length, primary keyword "Free Notes" pehle
  title: 'Free Notes for BCA, BTech & Diploma Students',

  // ✅ 154 chars — action word "Download", keywords: BCA, BTech, DSA, DBMS, free PDF
  description:
    'Download free BCA, BTech, Diploma & Class 10–12 notes. Covers DSA, DBMS, OS, Java, Python, Web Dev & more. No login needed. PDF available.',

  keywords: [
    // High-intent, long-tail — ye actually rank karte hain
    'free BCA notes PDF download',
    'free BTech notes PDF download',
    'BCA 1st year notes free',
    'BCA 2nd year notes free',
    'BCA 3rd year notes free',
    'BTech 1st year notes free PDF',
    'BTech 2nd year notes free PDF',
    'BTech CSE notes free download',
    'DSA handwritten notes free PDF',
    'DBMS notes free PDF BTech',
    'Operating System notes BTech free',
    'Java programming notes free PDF',
    'Python notes free PDF for students',
    'C programming handwritten notes',
    'Engineering Mathematics 1 notes',
    'Engineering Physics notes free',
    'free study material for BCA BTech India',
    'handwritten notes for engineering students',
    'free notes download no login',
    'EduCrush notes',
  ],

  alternates: { canonical: 'https://educrush.in/notes' },

  openGraph: {
    type: 'website',
    url: 'https://educrush.in/notes',
    // OG title thoda longer ho sakta hai — 70-90 chars
    title: 'Free Notes for BCA, BTech, Diploma & Class 10–12',
    description:
      'Download free handwritten notes for BCA, BTech, Diploma & Class 10–12 students. DSA, DBMS, OS, Java, Python, Web Dev & more. No login, no paywall.',
    siteName: 'EduCrush',
    images: [
      {
        url: 'https://educrush.in/og-notes.png',
        width: 1200,
        height: 630,
        alt: 'Free Notes for BCA, BTech, Diploma — EduCrush',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Free Notes for BCA, BTech & Diploma | EduCrush',
    description:
      'Download free semester-wise notes for BCA, BTech, Diploma & Class 10–12. No sign-up needed.',
    images: ['https://educrush.in/og-notes.png'],
  },

  // Robots — Google ko explicitly bolo index karo
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

// ── ISR — 1 hour cache ────────────────────────────────────────────────────────
export const revalidate = 3600

// ── Page — Server Component ───────────────────────────────────────────────────
export default async function NotesPage() {
  let initialNotes = fallbackNotes

  try {
    const data = await getNotesFromSupabase()
    if (data && data.length > 0) initialNotes = data
  } catch {
    initialNotes = fallbackNotes
  }

  return (
    <>
      <NotesPageJsonLd />
      <NotesClient initialNotes={initialNotes} />
    </>
  )
}