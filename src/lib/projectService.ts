import { supabase } from '@/lib/supabase'
import type { Project } from '@/data/projects'

export async function getProjectsFromSupabase() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching projects:', error)
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
