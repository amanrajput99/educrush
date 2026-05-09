// src/app/projects/[slug]/page.tsx
// ⚠️ 'use client' NAHI likhna — ye Server Component hai

import type { Metadata } from 'next'
import { projects } from '@/data/projects'
import { getProjectBySlug } from '@/lib/projectService'
import ProjectClient from './ProjectClient'
import { ProjectJsonLd } from '@/components/seo/JsonLd'

const BASE_URL = 'https://educrush.in'

// ── Pre-render ────────────────────────────────────────────────────────────────
export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

// ── Helper ────────────────────────────────────────────────────────────────────
async function getProject(slug: string) {
  let project: (typeof projects)[number] | null | undefined =
    projects.find((p) => p.slug === slug)
  if (!project) {
    try {
      project = await getProjectBySlug(slug)
    } catch {}
  }
  return project ?? null
}

// ── Dynamic metadata ──────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>   // ← Next.js 15: Promise
}): Promise<Metadata> {
  const { slug } = await params        // ← await karo pehle

  const project = await getProject(slug)

  if (!project) {
    return {
      title: 'Project Not Found',
      description: 'This project does not exist on EduCrush.',
    }
  }

  const title = `${project.name} — Free Web Dev Project`
  const description = (
    (project as any).longDescription ??
    (project as any).longdescription ??
    project.description
  ).slice(0, 155)

  const pageUrl = `${BASE_URL}/projects/${slug}`

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
      images: [{ url: project.image || '/og-image.png', width: 1200, height: 630, alt: project.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [project.image || '/og-image.png'],
    },
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>   // ← Next.js 15: Promise
}) {
  const { slug } = await params        // ← await karo pehle

  const project = await getProject(slug)

  return (
    <>
      {project && (
        <ProjectJsonLd
          name={project.name}
          description={
            (project as any).longDescription ??
            (project as any).longdescription ??
            project.description
          }
          slug={slug}
          tags={project.tags}
          image={project.image}
        />
      )}
      <ProjectClient />
    </>
  )
}