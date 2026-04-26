import ProjectCards from '@/components/home/Projectcards'

export const metadata = {
  title: 'All Projects | EduCrush',
  description: 'Explore all the creative web projects and experiments built by the EduCrush team.',
}

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-black pt-20">
      <ProjectCards />
    </main>
  )
}
