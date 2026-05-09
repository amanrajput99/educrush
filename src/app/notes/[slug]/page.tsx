// src/app/notes/[slug]/page.tsx
// ⚠️ 'use client' NAHI likhna yahan — ye Server Component hai

import type { Metadata } from 'next'
import { notes } from '@/data/Notes'
import { getNotesFromSupabase } from '@/lib/NoteService'
import NoteClient from './NoteClient'

const BASE_URL = 'https://educrush.in'

// ── Pre-render all note pages at build time (good for SEO) ───────────────────
export async function generateStaticParams() {
  return notes.map((note) => ({
    slug: note.link.split('/').pop() ?? '',
  }))
}

// ── Dynamic meta per note ─────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  // Local data se pehle dhundo
  let note = notes.find((n) => n.link.split('/').pop() === params.slug)

  // Agar nahi mila toh Supabase se fetch karo
  if (!note) {
    const supabaseNotes = await getNotesFromSupabase()
    note = supabaseNotes.find((n) => n.link.split('/').pop() === params.slug)
  }

  if (!note) {
    return {
      title: 'Note Not Found',
      description: 'This note does not exist on EduCrush.',
    }
  }

  const title = `${note.title} — Free ${note.subject} Notes`
  const description =
    note.description.slice(0, 155) ||
    `Free ${note.subject} notes for ${note.course ?? 'students'}${note.year ? ` ${note.year}` : ''} on EduCrush.`

  const pageUrl = `${BASE_URL}/notes/${params.slug}`

  return {
    title,
    description,
    keywords: [
      note.title,
      note.subject,
      note.course ?? '',
      note.year ?? '',
      note.semester ?? '',
      'free notes',
      'study material',
      'EduCrush',
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
          url: note.image || '/og-image.png',
          width: 1200,
          height: 630,
          alt: note.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [note.image || '/og-image.png'],
    },
  }
}

// ── Page component — sirf NoteClient render karta hai ────────────────────────
export default function NotePage() {
  return <NoteClient />
}