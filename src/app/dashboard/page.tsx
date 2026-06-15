// src/app/dashboard/page.tsx
import type { Metadata } from 'next'
import DashboardClient from './DashboardClient'

export const metadata: Metadata = {
  title: 'Dashboard',
  robots: { index: false },
}

export default function DashboardPage() {
  return <DashboardClient />
}
