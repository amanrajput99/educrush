import { supabase } from '@/lib/supabase'
import type { Note } from '@/data/Notes'
import { notes as localNotes } from '@/data/Notes'

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
    // Supabase fail → sirf local notes return karo
    return localNotes
  }

  const supabaseNotes = (data as unknown as Note[]) || []

  if (supabaseNotes.length === 0) {
    // Supabase empty hai → sirf local notes
    return localNotes
  }

  // Supabase notes upar, local notes neeche
  // Duplicate avoid karo — same link wale local notes skip karo
  const supabaseSlugs = new Set(supabaseNotes.map((n) => n.link))
  const filteredLocal = localNotes.filter((n) => !supabaseSlugs.has(n.link))

  return [...supabaseNotes, ...filteredLocal]
}

export async function addNoteToSupabase(note: Note) {
  const { data, error } = await supabase
    .from('notes')
    .insert([note])
    .select()

  if (error) throw error
  return data
}