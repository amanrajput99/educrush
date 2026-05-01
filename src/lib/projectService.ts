// import { supabase } from '@/lib/supabase'
// import type { Project } from '@/data/projects'

// export async function getProjectsFromSupabase() {
//   const { data, error } = await supabase
//     .from('projects')
//     .select('*')

//   if (error) {
//     console.error('Supabase Error:', {
//       message: error.message,
//       details: error.details,
//       hint: error.hint,
//       code: error.code
//     })
//     return []
//   }
  
//   return (data as unknown as Project[]) || []
// }

// export async function addProjectToSupabase(project: Project) {
//   const { data, error } = await supabase
//     .from('projects')
//     .insert([project])
//     .select()

//   if (error) throw error
//   return data
// }

import { supabase } from '@/lib/supabase'
import type { Project } from '@/data/projects'
import { projects as localProjects } from '@/data/projects'

export async function getProjectsFromSupabase(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Supabase Error:', error)
    // Supabase fail → sirf local projects
    return localProjects
  }

  const supabaseProjects = (data as unknown as Project[]) || []

  if (supabaseProjects.length === 0) {
    // Supabase empty → sirf local projects
    return localProjects
  }

  // Supabase upar, local neeche — duplicate slugs skip
  const supabaseSlugs = new Set(supabaseProjects.map((p) => p.slug))
  const filteredLocal = localProjects.filter((p) => !supabaseSlugs.has(p.slug))

  return [...supabaseProjects, ...filteredLocal]
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  // Pehle local mein dhundho (fast)
  const local = localProjects.find((p) => p.slug === slug)

  // Phir Supabase mein check karo (override kare local ko)
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) {
    // Supabase mein nahi mila → local return karo
    return local ?? null
  }

  return data as unknown as Project
}

export async function addProjectToSupabase(project: Project) {
  const { data, error } = await supabase
    .from('projects')
    .insert([project])
    .select()

  if (error) throw error
  return data
}