import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { notes as localNotes } from '@/data/Notes'
import { projects as localProjects } from '@/data/projects'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim() ?? ''

  if (!q || q.length < 2) {
    return NextResponse.json({
      notes: [],
      projects: [],
    })
  }

  const pattern = `%${q}%`
  const lowerQ = q.toLowerCase()

  // ───────────────── NOTES ─────────────────

  const { data: supabaseNotes, error: notesErr } = await supabase
    .from('notes')
    .select(
      'title, description, subject, link, course, year, semester, image'
    )
    .or(
      `title.ilike.${pattern},subject.ilike.${pattern},description.ilike.${pattern},course.ilike.${pattern}`
    )
    .limit(5)

  const localNoteMatches = localNotes
    .filter(
      (n) =>
        n.title.toLowerCase().includes(lowerQ) ||
        n.subject.toLowerCase().includes(lowerQ) ||
        n.description.toLowerCase().includes(lowerQ) ||
        n.course?.toLowerCase().includes(lowerQ)
    )
    .slice(0, 5)

  let finalNotes = localNoteMatches

  if (!notesErr && supabaseNotes?.length) {
    const supabaseLinks = new Set(
      supabaseNotes.map((n: any) => n.link)
    )

    const filteredLocal = localNoteMatches.filter(
      (n) => !supabaseLinks.has(n.link)
    )

    finalNotes = [...supabaseNotes, ...filteredLocal].slice(0, 5)
  }

  // ───────────────── PROJECTS ─────────────────

  const { data: supabaseProjects, error: projectsErr } = await supabase
    .from('projects')
    .select(
      'name, description, slug, image, tags, link'
    )
    .or(
      `name.ilike.${pattern},description.ilike.${pattern}`
    )
    .limit(4)

  const localProjectMatches = localProjects
    .filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQ) ||
        p.description.toLowerCase().includes(lowerQ) ||
        p.tags?.some((t) =>
          t.toLowerCase().includes(lowerQ)
        )
    )
    .slice(0, 4)

  let finalProjects = localProjectMatches

  if (!projectsErr && supabaseProjects?.length) {
    const supabaseSlugs = new Set(
      supabaseProjects.map((p: any) => p.slug)
    )

    const filteredLocal = localProjectMatches.filter(
      (p) => !supabaseSlugs.has(p.slug)
    )

    finalProjects = [...supabaseProjects, ...filteredLocal].slice(0, 4)
  }

  return NextResponse.json({
    notes: finalNotes,
    projects: finalProjects,
  })
}