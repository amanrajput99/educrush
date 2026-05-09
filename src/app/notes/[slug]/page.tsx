// src/app/notes/[slug]/page.tsx
// ⚠️ 'use client' NAHI likhna yahan — ye Server Component hai

import type { Metadata } from 'next'
import { notes } from '@/data/Notes'
import { getNotesFromSupabase } from '@/lib/NoteService'
import NoteClient from './NoteClient'
import { NoteJsonLd } from '@/components/seo/JsonLd'

const BASE_URL = 'https://educrush.in'

// ── Pre-render — local + Supabase dono ke slugs ───────────────────────────────
export async function generateStaticParams() {
  const localSlugs = notes.map((note) => ({
    slug: note.link.split('/').pop() ?? '',
  }))
  try {
    const supabaseNotes = await getNotesFromSupabase()
    const supabaseSlugs = supabaseNotes.map((note) => ({
      slug: note.link.split('/').pop() ?? '',
    }))
    const allSlugs = [...localSlugs, ...supabaseSlugs]
    return Array.from(new Map(allSlugs.map((s) => [s.slug, s])).values())
  } catch {
    return localSlugs
  }
}

// ── Helper ────────────────────────────────────────────────────────────────────
async function getNote(slug: string) {
  let note = notes.find((n) => n.link.split('/').pop() === slug)
  if (!note) {
    try {
      const supabaseNotes = await getNotesFromSupabase()
      note = supabaseNotes.find((n) => n.link.split('/').pop() === slug)
    } catch {}
  }
  return note ?? null
}

// ── Dynamic metadata ──────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>   // ← Next.js 15: Promise
}): Promise<Metadata> {
  const { slug } = await params        // ← await karo pehle

  const note = await getNote(slug)

  if (!note) {
    return {
      title: 'Note Not Found',
      description: 'This note does not exist on EduCrush.',
    }
  }

  const title = `${note.title} — Free ${note.subject} Notes`
  const description =
    note.description.slice(0, 155) ||
    `Free ${note.subject} notes for ${note.course ?? 'students'}${
      note.year ? ` ${note.year}` : ''
    } on EduCrush.`

  const pageUrl = `${BASE_URL}/notes/${slug}`

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
      images: [{ url: note.image || '/og-image.png', width: 1200, height: 630, alt: note.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [note.image || '/og-image.png'],
    },
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function NotePage({
  params,
}: {
  params: Promise<{ slug: string }>   // ← Next.js 15: Promise
}) {
  const { slug } = await params        // ← await karo pehle

  const note = await getNote(slug)

  return (
    <>
      {note && (
        <NoteJsonLd
          title={note.title}
          description={note.description}
          subject={note.subject}
          course={note.course}
          year={note.year}
          slug={slug}
          image={note.image}
        />
      )}
      <NoteClient />
    </>
  )
}