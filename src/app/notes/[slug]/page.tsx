// src/app/notes/[slug]/page.tsx
// ⚠️ 'use client' NAHI likhna — ye Server Component hai

import type { Metadata } from 'next'
import { notes } from '@/data/Notes'
import { getNotesFromSupabase } from '@/lib/NoteService'
import NoteClient from './NoteClient'

const BASE_URL = 'https://educrush.in'

// ── Helper: slug se note nikalo ───────────────────────────────────────────────
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

// ── Pre-render all note slugs ─────────────────────────────────────────────────
export async function generateStaticParams() {
  const allNotes = await getAllNotes()
  const slugs = allNotes.map((note) => ({
    slug: note.link.split('/').pop() ?? '',
  }))
  // Duplicates hata do
  return Array.from(new Map(slugs.map((s) => [s.slug, s])).values())
}

// ── Dynamic Metadata — har note ka apna title/description Google mein ─────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const note = await getNote(slug)

  if (!note) {
    return {
      title: 'Note Not Found | EduCrush',
      description: 'This note does not exist on EduCrush.',
    }
  }

  // Smart title — "BCA 2nd Year DBMS Notes Free PDF | EduCrush"
  const titleParts = [
    note.course,
    note.year,
    note.semester,
    note.subject,
    'Notes Free PDF',
  ].filter(Boolean)

  const title = `${note.title} | ${titleParts.join(' ')} | EduCrush`

  // Smart description — 155 chars max
  const description =
    note.description?.slice(0, 120) ||
    `Free ${note.subject} notes for ${note.course ?? 'students'}${note.year ? ` ${note.year}` : ''}${note.semester ? ` ${note.semester}` : ''}. Download PDF for free on EduCrush — no login required.`

  const pageUrl = `${BASE_URL}/notes/${slug}`
  const ogImage = note.image || '/og-notes.png'

  return {
    title,
    description,
    keywords: [
      // Specific long-tail keywords — ye rank karte hain
      `${note.subject} notes free PDF`,
      `${note.course} ${note.subject} notes`,
      `${note.course} ${note.year} ${note.subject} notes`,
      `${note.course} ${note.semester} ${note.subject} notes`,
      `free ${note.subject} notes for ${note.course}`,
      `${note.title}`,
      `${note.subject} study material`,
      `${note.course} notes free download`,
      'free notes download India',
      'EduCrush notes',
      'free study material BCA BTech',
    ].filter(Boolean),
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
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

// ── JSON-LD — Google ko structured data deta hai ──────────────────────────────
function NoteJsonLd({ note, slug }: { note: any; slug: string }) {
  const pageUrl = `${BASE_URL}/notes/${slug}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: note.title,
    description:
      note.description ||
      `Free ${note.subject} notes for ${note.course} students.`,
    url: pageUrl,
    image: note.image || `${BASE_URL}/og-notes.png`,
    inLanguage: 'hi-IN',
    isAccessibleForFree: true,
    educationalLevel: note.year ?? note.course ?? 'Higher Education',
    about: {
      '@type': 'Thing',
      name: note.subject,
    },
    provider: {
      '@type': 'Organization',
      name: 'EduCrush',
      url: BASE_URL,
    },
    // BreadcrumbList — Google search mein breadcrumb dikhega
    breadcrumb: {
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
            ]
          : []),
        {
          '@type': 'ListItem',
          position: note.course ? 4 : 3,
          name: note.title,
          item: pageUrl,
        },
      ],
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

// ── Page — Server Component ───────────────────────────────────────────────────
// note data SERVER pe fetch hota hai — Google ko poora content milega
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
      {/* note aur allNotes dono pass kar rahe hain client ko — no extra fetch needed */}
      <NoteClient note={note} allNotes={allNotes} slug={slug} />
    </>
  )
}