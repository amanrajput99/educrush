import type { Metadata } from 'next'
import { getProjectsFromSupabase } from '@/lib/projectService'
import { projects as fallbackProjects } from '@/data/projects'
import ProjectsClient from './ProjectsClient'

// ── JSON-LD — Google ko projects listing ka structured data ───────────────────
function ProjectsPageJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      // WebPage schema
      {
        '@type': 'WebPage',
        '@id': 'https://educrush.in/projects',
        url: 'https://educrush.in/projects',
        name: 'Free Web Development Projects with Source Code | EduCrush',
        description:
          'Browse free HTML, CSS, JavaScript and React projects with full source code for BCA, BTech and Diploma students.',
        inLanguage: 'en-IN',
        isPartOf: { '@id': 'https://educrush.in/#website' },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://educrush.in' },
            { '@type': 'ListItem', position: 2, name: 'Projects', item: 'https://educrush.in/projects' },
          ],
        },
      },
      // CollectionPage — Google ko pata chale ye ek projects library hai
      {
        '@type': 'CollectionPage',
        name: 'Free Web Development Projects for Students',
        description:
          'Free HTML, CSS, JavaScript and React projects with full source code. Built for BCA, BTech and Diploma students to learn and practice web development.',
        url: 'https://educrush.in/projects',
        provider: {
          '@type': 'Organization',
          name: 'EduCrush',
          url: 'https://educrush.in',
        },
        audience: {
          '@type': 'EducationalAudience',
          educationalRole: 'student',
          audienceType: 'BCA, BTech, Diploma',
        },
        inLanguage: 'en-IN',
        isAccessibleForFree: true,
      },
      // FAQ schema — Google rich results
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Are EduCrush projects free to download?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, all projects on EduCrush are completely free. Full source code is available with no login or payment required.',
            },
          },
          {
            '@type': 'Question',
            name: 'Which technologies are covered in EduCrush projects?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'EduCrush projects cover HTML, CSS, JavaScript, React, and more. Projects range from beginner to advanced level.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can BCA and BTech students use these projects?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. All projects are designed keeping BCA, BTech, and Diploma students in mind — perfect for assignments, portfolios, and learning.',
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
export const metadata: Metadata = {
  // ✅ 60 chars — primary keyword "Free Projects" pehle, brand last
  title: 'Free Web Dev Projects with Source Code',

  // ✅ 155 chars — action word "Browse", keywords: HTML, CSS, JS, React, BCA, BTech
  description:
    'Browse free HTML, CSS, JavaScript and React projects with full source code. Built for BCA, BTech and Diploma students. Download, learn and build for free.',

  keywords: [
    // High-intent long-tail — ye rank karte hain
    'free web development projects with source code',
    'HTML CSS JavaScript projects free download',
    'mini projects for BCA students',
    'mini projects for BTech students',
    'web development projects for beginners India',
    'free React projects source code',
    'JavaScript projects for students free',
    'HTML CSS projects for college students',
    'web dev projects with source code India',
    'free coding projects for BCA BTech',
    'portfolio projects for students India',
    'web development mini projects free download',
    'EduCrush projects',
    'free projects no login',
  ],

  alternates: { canonical: 'https://educrush.in/projects' },

  openGraph: {
    type: 'website',
    url: 'https://educrush.in/projects',
    title: 'Free Web Development Projects with Source Code | EduCrush',
    description:
      'Browse free HTML, CSS, JavaScript and React projects with full source code. Perfect for BCA, BTech and Diploma students. No login, no paywall.',
    siteName: 'EduCrush',
    images: [
      {
        url: 'https://educrush.in/og-projects.png',
        width: 1200,
        height: 630,
        alt: 'Free Web Development Projects — EduCrush',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Free Web Dev Projects with Source Code | EduCrush',
    description:
      'Free HTML, CSS, JavaScript and React projects for BCA, BTech and Diploma students. Full source code. No login needed.',
    images: ['https://educrush.in/og-projects.png'],
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

// ── ISR — 1 hour cache ────────────────────────────────────────────────────────
export const revalidate = 3600

// ── Page — Server Component ───────────────────────────────────────────────────
export default async function ProjectsPage() {
  let initialProjects = fallbackProjects

  try {
    const data = await getProjectsFromSupabase()
    if (data && data.length > 0) initialProjects = data
  } catch {
    initialProjects = fallbackProjects
  }

  return (
    <>
      <ProjectsPageJsonLd />
      <ProjectsClient initialProjects={initialProjects} />
    </>
  )
}