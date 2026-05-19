import { getBlogBySlug, getPublishedBlogs } from '@/lib/blogService'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'

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

function formatDate(dateStr?: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function readTime(content?: string, excerpt?: string) {
  const text = (content ?? '') + (excerpt ?? '')
  const words = text.split(' ').length
  return `${Math.max(1, Math.ceil(words / 200))} min read`
}

const TAG_COLORS = [
  'border-emerald-800/60 text-emerald-400 bg-emerald-950/50',
  'border-slate-700/80 text-slate-400 bg-slate-900',
  'border-cyan-800/60 text-cyan-400 bg-cyan-950/50',
  'border-lime-800/60 text-lime-400 bg-lime-950/50',
]

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const blog = await getBlogBySlug(slug)
  if (!blog) notFound()

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Hero Cover */}
      <div className="relative w-full h-[55vh] min-h-[360px] max-h-[520px] overflow-hidden">
        {blog.cover_image ? (
          <img src={blog.cover_image} alt={blog.title} className="w-full h-full object-cover object-top" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-950 via-slate-900 to-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10" />

        <div className="absolute top-6 left-0 right-0 max-w-4xl mx-auto px-6">
          <Link href="/blogs" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            All Articles
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-6 pb-10">
          <div className="flex flex-wrap gap-2 mb-4">
            {(blog.tags ?? []).map((tag, i) => (
              <span key={tag} className={`text-xs px-3 py-1 rounded-full border font-medium ${TAG_COLORS[i % TAG_COLORS.length]}`}>{tag}</span>
            ))}
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight text-white max-w-3xl">
            {blog.title}
          </h1>
        </div>
      </div>

      {/* Article Body */}
      <div className="max-w-3xl mx-auto px-6">

        {/* Author bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-6 mb-10 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-600 to-cyan-700 flex items-center justify-center font-bold text-white text-base shrink-0 ring-2 ring-emerald-500/20">
              {blog.author?.[0]?.toUpperCase() ?? 'E'}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{blog.author}</p>
              <p className="text-xs text-slate-500">{formatDate(blog.created_at)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {readTime(blog.content, blog.excerpt)}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              Free Article
            </span>
          </div>
        </div>

        {/* Excerpt */}
        <div className="relative mb-12 pl-5 border-l-2 border-emerald-500/40">
          <div className="absolute -left-[3px] top-0 w-1.5 h-6 bg-emerald-500 rounded-full" />
          <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-light italic">{blog.excerpt}</p>
        </div>

        {/* Main Content — inline styles instead of prose */}
        {blog.content ? (
          <div
            className="blog-body"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        ) : (
          <p className="text-slate-600 italic">Content coming soon...</p>
        )}

        {/* Bottom CTA */}
        <div className="mt-20 mb-8">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-emerald-700/40 to-transparent mb-12" />
          <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-8 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-600 to-cyan-700 flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                {blog.author?.[0]?.toUpperCase() ?? 'E'}
              </div>
              <p className="text-slate-400 text-sm mb-1">Written by</p>
              <p className="text-white font-semibold text-lg mb-4">{blog.author}</p>
              <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">Part of the EduCrush team — building free resources for every Indian student.</p>
              <Link href="/blogs" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-sm font-medium hover:bg-emerald-900/40 transition-all duration-200">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Read More Articles
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}