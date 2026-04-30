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

export async function getProjectsFromSupabase(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')

  if (error) {
    console.error('Supabase Error:', error)
    return []
  }

  return (data as Project[]) || []
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Supabase Error:', error)
    return null
  }

  return data as Project
}

export async function addProjectToSupabase(project: Project) {
  const { data, error } = await supabase
    .from('projects')
    .insert([project])
    .select()

  if (error) throw error
  return data
}