// src/lib/codingPracticeService.ts

import { supabase } from '@/lib/supabase'
import type { CodingLanguage, CodingProblem } from '@/data/codingPractice'

// ── Languages ─────────────────────────────────────────────────────────────────
export async function getLanguages(): Promise<CodingLanguage[]> {
  const { data, error } = await supabase
    .from('coding_languages')
    .select('*')
    .eq('published', true)
    .order('order_index', { ascending: true })

  if (error) { console.error('getLanguages error:', error); return [] }
  return (data as CodingLanguage[]) ?? []
}

// ── Problems list for a language ──────────────────────────────────────────────
export async function getProblemsByLanguage(languageSlug: string): Promise<CodingProblem[]> {
  const { data, error } = await supabase
    .from('coding_problems')
    .select('id, slug, title, language_slug, difficulty, topic, description, examples, constraints, tags, views, submissions, published, order_index, created_at')
    .eq('language_slug', languageSlug)
    .eq('published', true)
    .order('order_index', { ascending: true })

  if (error) { console.error('getProblemsByLanguage error:', error); return [] }
  return (data as CodingProblem[]) ?? []
}

// ── Single problem (full — with hints, solution etc.) ────────────────────────
export async function getProblemBySlug(slug: string): Promise<CodingProblem | null> {
  const { data, error } = await supabase
    .from('coding_problems')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error) { console.error('getProblemBySlug error:', error); return null }

  // Increment views
  supabase
    .from('coding_problems')
    .update({ views: (data.views ?? 0) + 1 })
    .eq('slug', slug)
    .then(() => {})

  return data as CodingProblem
}

// ── Admin: all problems (unpublished bhi) ─────────────────────────────────────
export async function getAllProblemsAdmin(): Promise<CodingProblem[]> {
  const { data, error } = await supabase
    .from('coding_problems')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) { console.error('getAllProblemsAdmin error:', error); return [] }
  return (data as CodingProblem[]) ?? []
}

// ── Admin: add problem ────────────────────────────────────────────────────────
export async function addProblem(problem: Omit<CodingProblem, 'id' | 'views' | 'submissions' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('coding_problems')
    .insert({ ...problem, views: 0, submissions: 0 })
    .select()
    .single()

  if (error) throw error
  return data
}

// ── Admin: update problem ─────────────────────────────────────────────────────
export async function updateProblem(id: number, updates: Partial<CodingProblem>) {
  const { data, error } = await supabase
    .from('coding_problems')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// ── Admin: delete problem ─────────────────────────────────────────────────────
export async function deleteProblem(id: number) {
  const { error } = await supabase
    .from('coding_problems')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ── Admin: add language ───────────────────────────────────────────────────────
export async function addLanguage(lang: Omit<CodingLanguage, 'id' | 'total_problems'>) {
  const { data, error } = await supabase
    .from('coding_languages')
    .insert({ ...lang, total_problems: 0 })
    .select()
    .single()

  if (error) throw error
  return data
}