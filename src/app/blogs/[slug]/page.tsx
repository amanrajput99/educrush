import { getBlogBySlug, getPublishedBlogs } from '@/lib/blogService'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import BlogDetailClient from './BlogDetailClient'

const BASE_URL = 'https://educrush.in'

export async function generateStaticParams() {
  const blogs = await getPublishedBlogs()
  return blogs.map(b => ({ slug: b.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const blog = await getBlogBySlug(slug)

  if (!blog) {
    return {
      title: 'Article Not Found',
      description: 'This article does not exist or has been removed.',
      robots: { index: false, follow: false },
    }
  }

  const canonicalUrl = `${BASE_URL}/blogs/${blog.slug}`
  const ogImage = blog.cover_image || `${BASE_URL}/og-image.png`
  const publishedDate = new Date(blog.created_at!).toISOString()

  return {
    title: blog.title,
    description:
      blog.excerpt ||
      `${blog.title} — Free guide for BTech, BCA & Diploma students on EduCrush.`,

    keywords: blog.tags?.length
      ? [...blog.tags, 'EduCrush', 'student guide', 'free tutorial']
      : ['EduCrush blog', 'student guide', 'free tutorial', blog.title],

    alternates: {
      canonical: canonicalUrl,
    },

    authors: [
      {
        name: blog.author || 'EduCrush Team',
        url: BASE_URL,
      },
    ],

    openGraph: {
      type: 'article',
      locale: 'en_IN',
      url: canonicalUrl,
      siteName: 'EduCrush',
      title: blog.title,
      description:
        blog.excerpt || `${blog.title} — Free guide for students on EduCrush.`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: blog.title,
          type: 'image/png',
        },
      ],
      publishedTime: publishedDate,
      modifiedTime: publishedDate,
      authors: [`${BASE_URL}/about`],
      tags: blog.tags || [],
      section: 'Student Resources',
    },

    twitter: {
      card: 'summary_large_image',
      site: '@educrush',
      creator: '@educrush',
      title: blog.title,
      description:
        blog.excerpt || `${blog.title} — Free guide on EduCrush.`,
      images: [{ url: ogImage, alt: blog.title }],
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
}

export const revalidate = 60

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const blog = await getBlogBySlug(slug)
  if (!blog) notFound()

  const canonicalUrl = `${BASE_URL}/blogs/${blog.slug}`
  const ogImage = blog.cover_image || `${BASE_URL}/og-image.png`
  const publishedDate = new Date(blog.created_at!).toISOString()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${canonicalUrl}#article`,
        headline: blog.title,
        description: blog.excerpt || blog.title,
        image: {
          '@type': 'ImageObject',
          url: ogImage,
          width: 1200,
          height: 630,
        },
        datePublished: publishedDate,
        dateModified: publishedDate,
        author: {
          '@type': 'Person',
          name: blog.author || 'EduCrush Team',
          url: `${BASE_URL}/about`,
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
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl,
        },
        url: canonicalUrl,
        inLanguage: 'en-IN',
        keywords: blog.tags?.join(', ') || 'student guide, free tutorial',
        articleSection: 'Student Resources',
        isAccessibleForFree: true,
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: BASE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: `${BASE_URL}/blogs`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: blog.title,
            item: canonicalUrl,
          },
        ],
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogDetailClient blog={blog} />
    </>
  )
}