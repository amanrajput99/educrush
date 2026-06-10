import { getPublishedBlogs } from '@/lib/blogService'
import BlogsClient from './BlogsClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog — Student Tips, Tutorials & Guides',
  description:
    'Read articles on coding, exam prep, web development, and student life — written by students for students. Free, always.',
  alternates: {
    canonical: 'https://educrush.in/blogs',
  },
  openGraph: {
    title: 'EduCrush Blog',
    description: 'Coding tutorials, exam tips, and student guides — all free.',
    url: 'https://educrush.in/blogs',
    siteName: 'EduCrush',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
}

// Har 60 sec mein revalidate (ISR)
export const revalidate = 3600 // 1 hour cache


export default async function BlogsPage() {
  const blogs = await getPublishedBlogs()
  return <BlogsClient blogs={blogs} />
}