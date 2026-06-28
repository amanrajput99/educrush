import { MetadataRoute } from 'next'
import { notes } from '@/data/Notes'
import { projects } from '@/data/projects'
import { getPublishedBlogs } from '@/lib/blogService'
import { getPublishedColleges } from '@/lib/admissionService'
import { getLanguages, getProblemsByLanguage } from '@/lib/codingPracticeService'

const BASE_URL = 'https://educrush.in'

export const revalidate = 3600 // har 1 ghante mein regenerate

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  // ── 1. Static pages ─────────────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    // Core — highest priority
    { url: BASE_URL,                               lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE_URL}/notes`,                    lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE_URL}/blogs`,                    lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE_URL}/projects`,                 lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE_URL}/admission`,                lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE_URL}/admission/colleges`,       lastModified: new Date(), changeFrequency: 'daily',   priority: 0.85 },
    { url: `${BASE_URL}/coding-practice`,          lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${BASE_URL}/ai`,                       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/editor`,                   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    // Company pages
    { url: `${BASE_URL}/about`,                    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/vision`,                   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/careers`,                  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/careers/ambassador`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/careers/volunteer`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/contact`,                  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    // Legal
    { url: `${BASE_URL}/privacy-policy`,           lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE_URL}/terms`,                    lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
  ]

  // ── 2. Notes — local + Supabase dono cover ──────────────────────────────────
  const notePages: MetadataRoute.Sitemap = notes.map((note) => {
    const slug = note.link.split('/').pop() ?? ''
    return {
      url: `${BASE_URL}/notes/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    }
  })

  // ── 3. Projects — local data ─────────────────────────────────────────────────
  const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${BASE_URL}/projects/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  // ── 4. Blogs — Supabase se fetch ─────────────────────────────────────────────
  let blogPages: MetadataRoute.Sitemap = []
  try {
    const blogs = await getPublishedBlogs()
    blogPages = blogs.map((blog) => ({
      url: `${BASE_URL}/blogs/${blog.slug}`,
      lastModified: blog.created_at ? new Date(blog.created_at) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    }))
  } catch (e) {
    console.error('Sitemap: blogs fetch failed', e)
  }

  // ── 5. Colleges — Supabase se fetch ──────────────────────────────────────────
  let collegePages: MetadataRoute.Sitemap = []
  try {
    const colleges = await getPublishedColleges()
    collegePages = colleges.map((college) => ({
      url: `${BASE_URL}/admission/colleges/${college.slug}`,
      lastModified: college.created_at ? new Date(college.created_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.75,
    }))
  } catch (e) {
    console.error('Sitemap: colleges fetch failed', e)
  }

  // ── 6. Coding Practice — Languages + Problems ─────────────────────────────────
  let codingPages: MetadataRoute.Sitemap = []
  try {
    const languages = await getLanguages()

    const langPages: MetadataRoute.Sitemap = languages.map((lang) => ({
      url: `${BASE_URL}/coding-practice/${lang.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }))

    const problemPagesNested = await Promise.all(
      languages.map(async (lang) => {
        try {
          const problems = await getProblemsByLanguage(lang.slug)
          return problems.map((problem) => ({
            url: `${BASE_URL}/coding-practice/${lang.slug}/${problem.slug}`,
            lastModified: problem.created_at ? new Date(problem.created_at) : new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.65,
          }))
        } catch {
          return []
        }
      })
    )

    codingPages = [...langPages, ...problemPagesNested.flat()]
  } catch (e) {
    console.error('Sitemap: coding practice fetch failed', e)
  }

  // ── Sab merge ────────────────────────────────────────────────────────────────
  return [
    ...staticPages,
    ...notePages,
    ...projectPages,
    ...blogPages,
    ...collegePages,
    ...codingPages,
  ]
}