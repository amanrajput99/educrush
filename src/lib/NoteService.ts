import { supabase } from '@/lib/supabase'
import type { Note } from '@/data/Notes'

export async function getNotesFromSupabase(): Promise<Note[]> {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Supabase Error (notes):', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    })
    return []
  }

  return (data as unknown as Note[]) || []
}

export async function addNoteToSupabase(note: Note) {
  const { data, error } = await supabase
    .from('notes')
    .insert([note])
    .select()

  if (error) throw error
  return data
}