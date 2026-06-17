
import type { Metadata } from 'next'
import { notes } from '@/data/Notes'
import { getNotesFromSupabase } from '@/lib/NoteService'
import NoteClient from './NoteClient'

const BASE_URL = 'https://educrush.in'

// ── Helpers ───────────────────────────────────────────────────────────────────
async function getAllNotes() {
  try {
    const supabaseNotes = await getNotesFromSupabase()
    if (supabaseNotes && supabaseNotes.length > 0) return supabaseNotes
  } catch {}
  return notes
}

async function getNote(slug: string) {
  const allNotes = await getAllNotes()
  return allNotes.find((n) => n.link.split('/').pop() === slug) ?? null
}

// ── Pre-render all slugs at build time ───────────────────────────────────────
export async function generateStaticParams() {
  const allNotes = await getAllNotes()
  const slugs = allNotes.map((n) => ({ slug: n.link.split('/').pop() ?? '' }))
  return Array.from(new Map(slugs.map((s) => [s.slug, s])).values())
}

// ── Dynamic Metadata ──────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const note = await getNote(slug)

  if (!note) {
    return {
      title: 'Note Not Found',
      description: 'This note does not exist on EduCrush.',
      robots: { index: false },
    }
  }

  const pageUrl = `${BASE_URL}/notes/${slug}`
  const ogImage = note.image ? note.image : `${BASE_URL}/og-notes.png`

  // ── Smart Title — 55-60 chars target ─────────────────────────────────────
  // Formula: [Note Title] — Free [Course] PDF | EduCrush
  // Example: "DSA Handwritten Notes — Free BTech PDF | EduCrush" = 51 chars ✅
  const courseStr = note.course ? `${note.course} ` : ''
  const yearStr = note.year ? `${note.year} ` : ''
  const title = `${note.title} — Free ${courseStr}${yearStr}PDF`
//i  am removing | educrush becouse it is present in layout.tsx
  // ── Smart Description — 145-155 chars target ─────────────────────────────
  // Clean first sentence of description — professional, no emojis, no topic lists
  const firstSentence = note.description
    ?.split(/[.\n]/)[0]
    ?.trim()
    ?.slice(0, 100) ?? ''

  const description = firstSentence
    ? `${firstSentence}. Free PDF download for ${courseStr}${yearStr}students — no login required.`
    : `Download free ${note.subject} notes for ${courseStr}${yearStr}students. Well-structured PDF available on EduCrush — no login, no paywall.`

  // ── Long-tail keywords — exact match searchers aate hain ─────────────────
  const keywords = [
    // Most specific — highest intent
    `${note.title.toLowerCase()}`,
    `${note.subject} notes free PDF`,
    `${note.subject} handwritten notes`,
    note.course && note.year
      ? `${note.course} ${note.year} ${note.subject} notes`
      : null,
    note.course && note.semester
      ? `${note.course} ${note.semester} ${note.subject} notes`
      : null,
    note.course ? `${note.course} ${note.subject} notes free download` : null,
    note.course ? `free ${note.course} notes PDF` : null,
    note.year ? `${note.year} ${note.subject} notes` : null,
    // Broader — backup traffic
    `${note.subject} study material`,
    `${note.subject} notes for students India`,
    'free notes download India',
    'EduCrush notes',
  ].filter(Boolean) as string[]

  return {
    // ✅ Title with primary keyword first
    title,

    // ✅ Description with action word + keywords + USP
    description,

    keywords,

    // ✅ Canonical — duplicate content se bachao
    alternates: { canonical: pageUrl },

    openGraph: {
      type: 'article',
      url: pageUrl,
      title,
      description,
      siteName: 'EduCrush',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${note.title} — Free Notes on EduCrush`,
        },
      ],
      // Article specific — Google News ke liye bhi helpful
      authors: ['EduCrush'],
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },

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
}

// ── JSON-LD — Rich Results ke liye ───────────────────────────────────────────
// Google "LearningResource" type ko special treatment deta hai education searches mein
function NoteJsonLd({ note, slug }: { note: any; slug: string }) {
  const pageUrl = `${BASE_URL}/notes/${slug}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      // LearningResource — education searches mein special ranking
      {
        '@type': 'LearningResource',
        '@id': pageUrl,
        name: note.title,
        description:
          note.description?.split(/[.\n]/)[0]?.trim() ||
          `Free ${note.subject} notes for ${note.course ?? 'students'}.`,
        url: pageUrl,
        image: note.image || `${BASE_URL}/og-notes.png`,
        inLanguage: ['en-IN', 'hi-IN'],
        isAccessibleForFree: true,
        // educationalLevel — Google ko samajhata hai ye kiske liye hai
        educationalLevel: note.year
          ? `${note.course ?? ''} ${note.year}`.trim()
          : note.course ?? 'Higher Education',
        // learningResourceType — PDF format explicitly batao
        learningResourceType: 'Notes',
        // educationalAlignment — subject clearly specify karo
        about: {
          '@type': 'Thing',
          name: note.subject,
        },
        // teaches — Google ko pata chale ye kya sikhata hai
        teaches: note.subject,
        // audience — exactly kiske liye hai
        audience: {
          '@type': 'EducationalAudience',
          educationalRole: 'student',
          ...(note.course && { audienceType: note.course }),
        },
        provider: {
          '@type': 'Organization',
          name: 'EduCrush',
          url: BASE_URL,
        },
        // publisher
        publisher: {
          '@type': 'Organization',
          name: 'EduCrush',
          url: BASE_URL,
          logo: {
            '@type': 'ImageObject',
            url: `${BASE_URL}/favicon.ico`,
          },
        },
      },

      // BreadcrumbList — Google search mein breadcrumb dikhega
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: BASE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Notes',
            item: `${BASE_URL}/notes`,
          },
          ...(note.course
            ? [
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: note.course,
                  item: `${BASE_URL}/notes?course=${note.course}`,
                },
                ...(note.year
                  ? [
                      {
                        '@type': 'ListItem',
                        position: 4,
                        name: note.year,
                        item: `${BASE_URL}/notes?course=${note.course}&year=${note.year}`,
                      },
                      {
                        '@type': 'ListItem',
                        position: 5,
                        name: note.title,
                        item: pageUrl,
                      },
                    ]
                  : [
                      {
                        '@type': 'ListItem',
                        position: 4,
                        name: note.title,
                        item: pageUrl,
                      },
                    ]),
              ]
            : [
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: note.title,
                  item: pageUrl,
                },
              ]),
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

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function NotePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const allNotes = await getAllNotes()
  const note = allNotes.find((n) => n.link.split('/').pop() === slug) ?? null

  return (
    <>
      {note && <NoteJsonLd note={note} slug={slug} />}
      <NoteClient note={note} allNotes={allNotes} slug={slug} />
    </>
  )
}