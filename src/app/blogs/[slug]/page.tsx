import { getBlogBySlug, getPublishedBlogs } from '@/lib/blogService'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import BlogDetailClient from './BlogDetailClient'

export async function generateStaticParams() {
  const blogs = await getPublishedBlogs()
  return blogs.map(b => ({ slug: b.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const blog = await getBlogBySlug(slug)
  if (!blog) return { title: 'Blog Not Found' }
  return {
    title: `${blog.title} — EduCrush`,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      images: blog.cover_image ? [{ url: blog.cover_image }] : [{ url: '/og-image.png' }],
    },
  }
}

export const revalidate = 60

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const blog = await getBlogBySlug(slug)
  if (!blog) notFound()
  return <BlogDetailClient blog={blog} />
}