// Suppress Vercel build error - v2
import { supabase } from '@/lib/supabase'
import type { Project } from '@/data/projects'

export async function getProjectsFromSupabase() {
  const { data, error } = await supabase
    .from<'projects', Project>('projects') // Providing both arguments
    .select('*')

  if (error) {
    console.error('Supabase Error:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    })
    return []
  }
  
  return (data as unknown as Project[]) || []
}

export async function addProjectToSupabase(project: Project) {
  const { data, error } = await supabase
    .from('projects')
    .insert([project])
    .select()

  if (error) throw error
  return data
}
