import { getPublishedBlogs } from '@/lib/blogService'
import BlogsClient from './BlogsClient'
import type { Metadata } from 'next'

// ─── Blogs Listing Page SEO ───────────────────────────────────────────────────
// Goal: "student blogs India", "coding tips for BTech students" jaise
// searches pe rank karna — entry point hai individual posts ke liye

export const metadata: Metadata = {
  // layout.tsx template se | EduCrush auto-append hoga
  title: 'Blog — Coding Tips, Exam Guides & Student Resources',

  description:
    'Free articles on web development, DSA, exam prep, internships, and college life — written by students for students. New posts every week. No paywall, ever.',

  keywords: [
    // Blog discovery keywords
    'student blog India',
    'coding blog for beginners',
    'BTech student blog',
    'BCA student articles',
    'web development tips students',
    'DSA tips for beginners',
    'exam preparation tips BTech',
    'college life tips India',
    // Content-specific
    'how to learn web development',
    'how to start DSA',
    'how to get internship college student',
    'Git GitHub tutorial beginners',
    'LinkedIn profile tips students',
    'freelancing for students India',
    'machine learning beginners guide',
    'cyber security career India',
    // Brand
    'EduCrush blog',
    'EduCrush articles',
  ],

  alternates: {
    canonical: 'https://educrush.in/blogs',
  },

  openGraph: {
    title: 'Blog — Coding Tips, Exam Guides & Student Resources | EduCrush',
    description:
      'Free articles on web development, DSA, internships, and college life — by students, for students. Always free.',
    url: 'https://educrush.in/blogs',
    siteName: 'EduCrush',
    type: 'website',
    locale: 'en_IN',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'EduCrush Blog — Student Tips, Coding Guides & Tutorials',
        type: 'image/png',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    site: '@educrush',
    title: 'Blog — Coding Tips & Student Guides | EduCrush',
    description: 'Free articles on DSA, web dev, internships & college life.',
    images: [{ url: '/og-image.png', alt: 'EduCrush Blog' }],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

// Har 60 sec mein revalidate (ISR)
export const revalidate = 3600 // 1 hour cache


export default async function BlogsPage() {
  const blogs = await getPublishedBlogs()
  return <BlogsClient blogs={blogs} />
}