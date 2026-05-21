import { getPublishedColleges } from '@/lib/admissionService'
import CollegesClient from './CollegesClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Uttarakhand Colleges 2025 — BTech, BCA, Diploma | EduCrush',
  description: 'Compare top colleges in Uttarakhand — fees, NIRF rank, placement, courses. Free admission guidance for BTech, BCA, Diploma students.',
}

export const revalidate = 300 // 5 min

export default async function CollegesPage() {
  const colleges = await getPublishedColleges()
  return <CollegesClient colleges={colleges} />
}