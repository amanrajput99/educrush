import { supabase } from '@/lib/supabase'

// ── Blog Type ─────────────────────────────────────────────────────────────────
export type Blog = {
  id?: string
  title: string
  slug: string
  excerpt: string
  content?: string
  cover_image: string
  author: string
  tags: string[]
  published: boolean
  created_at?: string
}

// ── Fetch all published blogs ─────────────────────────────────────────────────
export async function getPublishedBlogs(): Promise<Blog[]> {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Blog fetch error:', error)
    return []
  }

  return (data as Blog[]) || []
}

// ── Fetch latest N blogs (homepage ke liye) ───────────────────────────────────
export async function getLatestBlogs(limit = 3): Promise<Blog[]> {
  const { data, error } = await supabase
    .from('blogs')
    .select('id, title, slug, excerpt, cover_image, author, tags, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Latest blogs fetch error:', error)
    return []
  }

  return (data as Blog[]) || []
}

// ── Fetch single blog by slug ─────────────────────────────────────────────────
export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
  
    .single()

  if (error || !data) return null
  return data as Blog
}