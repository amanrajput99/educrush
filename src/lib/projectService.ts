import { supabase } from '@/lib/supabase'
import type { Project } from '@/data/projects'

export async function getProjectsFromSupabase() {
  const { data, error } = await supabase.from<Project>('projects').select('*')
  if (error) {
    throw error
  }
  return data ?? []
}

export async function addProjectToSupabase(project: Project) {
  const { data, error } = await supabase.from<Project>('projects').insert([project])
  if (error) {
    throw error
  }
  return data
}
