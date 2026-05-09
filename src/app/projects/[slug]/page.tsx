// src/app/projects/[slug]/page.tsx
// ⚠️ 'use client' NAHI likhna — ye Server Component hai

import type { Metadata } from 'next'
import { projects } from '@/data/projects'
import { getProjectBySlug } from '@/lib/projectService'
import ProjectClient from './ProjectClient' 

const BASE_URL = 'https://educrush.in'

// ── Pre-render all project pages at build time ────────────────────────────────
export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

// ── Dynamic meta per project ──────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  // Local data se pehle dhundo
let project:
  | (typeof projects)[number]
  | null
  | undefined = projects.find((p) => p.slug === params.slug)
  
  // Agar nahi mila toh Supabase se fetch karo
  if (!project) {
    project = await getProjectBySlug(params.slug)
  }

  if (!project) {
    return {
      title: 'Project Not Found',
      description: 'This project does not exist on EduCrush.',
    }
  }

  const title = `${project.name} — Free Web Dev Project`
  const description =
    ((project as any).longDescription ?? (project as any).longdescription ?? project.description).slice(0, 155)

  const pageUrl = `${BASE_URL}/projects/${params.slug}`

  return {
    title,
    description,
    keywords: [
      project.name,
      ...project.tags,
      'free project',
      'source code download',
      'web development project',
      'EduCrush',
    ],
    alternates: { canonical: pageUrl },
    openGraph: {
      type: 'article',
      url: pageUrl,
      title,
      description,
      siteName: 'EduCrush',
      images: [
        {
          url: project.image || '/og-image.png',
          width: 1200,
          height: 630,
          alt: project.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [project.image || '/og-image.png'],
    },
  }
}

// ── Page — sirf ProjectClient render karta hai ────────────────────────────────
export default function ProjectPage() {
  return <ProjectClient />
}