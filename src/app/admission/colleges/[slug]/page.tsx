import { supabase } from '@/lib/supabase'
import CollegeDetailClient from './CollegeDetailClient'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const revalidate = 300

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const { data } = await supabase
    .from('admission_colleges')
    .select('name, city, description')
    .eq('slug', slug)
    .single()
  if (!data) return { title: 'College Not Found' }
  return {
    title: `${data.name} — Admission 2025 | EduCrush`,
    description: data.description ?? `${data.name}, ${data.city} — fees, courses, placement details`,
  }
}

export default async function CollegeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data } = await supabase
    .from('admission_colleges')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!data) notFound()

  return <CollegeDetailClient college={data} />
}