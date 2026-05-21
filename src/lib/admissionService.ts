import { supabase } from '@/lib/supabase'

// ── Types ─────────────────────────────────────────────────────────────────────
export type College = {
  id?: string
  name: string
  slug: string
  city: string
  state: string
  fees_min: number
  fees_max: number
  nirf_rank?: number
  courses: string[]
  placement_avg?: number
  hostel_available: boolean
  established?: number
  description?: string
  logo_url?: string
  website?: string
  badge?: string        // "NIRF Ranked" | "Top Placement" | "Budget Friendly"
  published: boolean
  created_at?: string
}

export type AdmissionLead = {
  id?: string
  name: string
  phone: string
  email?: string
  marks_12th: number
  preferred_course: string
  preferred_city?: string
  message?: string
  status?: 'new' | 'contacted' | 'enrolled' | 'dropped'
  created_at?: string
}

// ── Colleges ──────────────────────────────────────────────────────────────────
export async function getPublishedColleges(): Promise<College[]> {
  const { data, error } = await supabase
    .from('admission_colleges')
    .select('*')
    .eq('published', true)
    .order('nirf_rank', { ascending: true, nullsFirst: false })

  if (error) { console.error('College fetch error:', error); return [] }
  return (data as College[]) || []
}

export async function getCollegeBySlug(slug: string): Promise<College | null> {
  const { data, error } = await supabase
    .from('admission_colleges')
    .select('*')
    .eq('slug', slug)
    .single()
  if (error || !data) return null
  return data as College
}

export async function getAllCollegesAdmin(): Promise<College[]> {
  const { data, error } = await supabase
    .from('admission_colleges')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return []
  return (data as College[]) || []
}

export async function upsertCollege(college: Partial<College>): Promise<boolean> {
  const { error } = await supabase
    .from('admission_colleges')
    .upsert(college)
  return !error
}

export async function deleteCollege(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('admission_colleges')
    .delete()
    .eq('id', id)
  return !error
}

// ── Leads ─────────────────────────────────────────────────────────────────────
export async function submitAdmissionLead(lead: Omit<AdmissionLead, 'id' | 'created_at' | 'status'>): Promise<boolean> {
  const { error } = await supabase
    .from('admission_leads')
    .insert({ ...lead, status: 'new' })
  return !error
}

export async function getAllLeads(): Promise<AdmissionLead[]> {
  const { data, error } = await supabase
    .from('admission_leads')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return []
  return (data as AdmissionLead[]) || []
}

export async function updateLeadStatus(id: string, status: AdmissionLead['status']): Promise<boolean> {
  const { error } = await supabase
    .from('admission_leads')
    .update({ status })
    .eq('id', id)
  return !error
}