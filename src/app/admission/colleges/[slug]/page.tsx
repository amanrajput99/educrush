import { supabase } from '@/lib/supabase'
import CollegeDetailClient from './CollegeDetailClient'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const revalidate = 300

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { data } = await supabase
    .from('admission_colleges')
    .select('name, city, description')
    .eq('slug', params.slug)
    .single()
  if (!data) return { title: 'College Not Found' }
  return {
    title: `${data.name} — Admission 2025 | EduCrush`,
    description: data.description ?? `${data.name}, ${data.city} — fees, courses, placement details`,
  }
}

export default async function CollegeDetailPage({ params }: { params: { slug: string } }) {
  const { data } = await supabase
    .from('admission_colleges')
    .select('*')
    .eq('slug', params.slug)
    .eq('published', true)
    .single()

  if (!data) notFound()

  return <CollegeDetailClient college={data} />
}