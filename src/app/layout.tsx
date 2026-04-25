import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CTA from '@/components/home/CTA'


export const metadata: Metadata = {
  title: {
    default: 'EduCrush',
    template: '%s | EduCrush'
  },
  description: 'Free Notes, Projects aur Web Development resources students ke liye.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        
        <main>
          {children}
        </main>
        <CTA />
        <Footer />
      </body>
    </html>
  )
}