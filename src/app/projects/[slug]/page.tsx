// src/app/projects/[slug]/page.tsx
// ⚠️ 'use client' NAHI likhna — ye Server Component hai

import type { Metadata } from 'next'
import { projects } from '@/data/projects'
import { getProjectBySlug } from '@/lib/projectService'
import ProjectClient from './ProjectClient'

const BASE_URL = 'https://educrush.in'

// ── Helper ────────────────────────────────────────────────────────────────────
async function getProject(slug: string) {
  // Pehle local data check karo — fast
  const local = projects.find((p) => p.slug === slug)
  if (local) return local
  // Phir Supabase
  try {
    const remote = await getProjectBySlug(slug)
    if (remote) return remote
  } catch {}
  return null
}

// ── Pre-render all slugs at build time ───────────────────────────────────────
export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

// ── Dynamic Metadata ──────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = await getProject(slug)

  if (!project) {
    return {
      title: 'Project Not Found | EduCrush',
      description: 'This project does not exist on EduCrush.',
      robots: { index: false },
    }
  }

  const longDesc: string =
    (project as any).longDescription ??
    (project as any).longdescription ??
    project.description

  const pageUrl = `${BASE_URL}/projects/${slug}`
  const ogImage = project.image || `${BASE_URL}/og-projects.png`

  // ── Smart Title — 55-60 chars ─────────────────────────────────────────────
  // Formula: [Project Name] — Free [Tag] Project | EduCrush
  const primaryTag = project.tags?.[0] ?? 'Web Dev'
  const title = `${project.name} — Free ${primaryTag} Project | EduCrush`

  // ── Smart Description — first clean sentence ──────────────────────────────
  const firstSentence = longDesc.split(/[.\n]/)[0]?.trim()?.slice(0, 100) ?? ''
  const description = firstSentence
    ? `${firstSentence}. Free source code download — no login required.`
    : `${project.description} Free ${primaryTag} project with full source code on EduCrush.`

  // ── Long-tail keywords ────────────────────────────────────────────────────
  const keywords = [
    `${project.name.toLowerCase()} source code`,
    `${project.name.toLowerCase()} free download`,
    ...project.tags.map((t) => `${t} project free source code`),
    ...project.tags.map((t) => `free ${t} project for students`),
    'free web development project source code',
    'mini project for BCA BTech students',
    'EduCrush projects',
  ]

  return {
    title,
    description,
    keywords,
    alternates: { canonical: pageUrl },
    openGraph: {
      type: 'article',
      url: pageUrl,
      title,
      description,
      siteName: 'EduCrush',
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${project.name} — EduCrush` }],
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

// ── JSON-LD ───────────────────────────────────────────────────────────────────
function ProjectJsonLd({ project, slug }: { project: any; slug: string }) {
  const pageUrl = `${BASE_URL}/projects/${slug}`
  const longDesc: string =
    project.longDescription ?? project.longdescription ?? project.description
  const cleanDesc = longDesc.split(/[.\n]/)[0]?.trim() || project.description

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      // SoftwareSourceCode — Google developer searches mein rank karta hai
      {
        '@type': 'SoftwareSourceCode',
        name: project.name,
        description: cleanDesc,
        url: pageUrl,
        image: project.image || `${BASE_URL}/og-projects.png`,
        codeRepository: pageUrl,
        programmingLanguage: project.tags ?? [],
        isAccessibleForFree: true,
        inLanguage: 'en-IN',
        author: {
          '@type': 'Organization',
          name: 'EduCrush',
          url: BASE_URL,
        },
        publisher: {
          '@type': 'Organization',
          name: 'EduCrush',
          url: BASE_URL,
          logo: {
            '@type': 'ImageObject',
            url: `${BASE_URL}/favicon.ico`,
          },
        },
        audience: {
          '@type': 'EducationalAudience',
          educationalRole: 'student',
          audienceType: 'BCA, BTech, Diploma',
        },
      },
      // BreadcrumbList
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
          { '@type': 'ListItem', position: 2, name: 'Projects', item: `${BASE_URL}/projects` },
          { '@type': 'ListItem', position: 3, name: project.name, item: pageUrl },
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

// ── Page — Server Component ───────────────────────────────────────────────────
// project data SERVER pe fetch hota hai — Google ko poora content milega
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getProject(slug)

  return (
    <>
      {project && <ProjectJsonLd project={project} slug={slug} />}
      {/* ✅ project prop pass kar rahe hain — client mein koi fetch nahi hoga */}
      <ProjectClient project={project} slug={slug} />
    </>
  )
}