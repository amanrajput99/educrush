import type { Metadata } from 'next'
import { getProjectsFromSupabase } from '@/lib/projectService'
import { projects as fallbackProjects } from '@/data/projects'
import ProjectsClient from './ProjectsClient'

// ── SEO ───────────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'Free Web Development Projects with Source Code',
  description:
    'Browse free web development projects with full source code. HTML, CSS, JavaScript, React projects for BCA, BTech & Diploma students. Download and learn for free.',
  keywords: [
    'free web development projects',
    'HTML CSS projects download',
    'JavaScript projects source code',
    'mini projects BTech',
    'BCA projects free',
    'free source code download',
    'EduCrush projects',
  ],
  alternates: { canonical: 'https://educrush.in/projects' },
  openGraph: {
    type: 'website',
    url: 'https://educrush.in/projects',
    title: 'Free Web Dev Projects with Source Code | EduCrush',
    description: 'Free HTML, CSS, JavaScript & React projects for students. Full source code download.',
    siteName: 'EduCrush',
    images: [{ url: '/og-projects.png', width: 1200, height: 630, alt: 'EduCrush Free Projects' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Projects | EduCrush',
    description: 'Free projects with source code for students.',
    images: ['/og-projects.png'],
  },
}

// ── SSR + ISR — Notes/Blog jaisa ─────────────────────────────────────────────
export const revalidate = 3600 // 1 hour cache

export default async function ProjectsPage() {
  let initialProjects = fallbackProjects

  try {
    const data = await getProjectsFromSupabase()
    if (data && data.length > 0) initialProjects = data
  } catch {
    // Supabase fail → fallback data se render hoga, site down nahi hogi
  }

  return <ProjectsClient initialProjects={initialProjects} />
}