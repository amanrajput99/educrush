import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'EduCrush — Free Notes, Projects & AI for Students',
    short_name: 'EduCrush',
    description: 'Free notes, web development projects, coding practice, and AI study assistant for BCA, BTech & Diploma students.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#000000',
    theme_color: '#0a0a0a',
    categories: ['education', 'productivity'],
    lang: 'en-IN',
    dir: 'ltr',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    screenshots: [
      {
        src: '/og-image.png',
        sizes: '1200x630',
        type: 'image/png',
        // @ts-ignore — Next.js types mein form_factor abhi nahi hai
        form_factor: 'wide',
        label: 'EduCrush — Free Study Resources for Students',
      },
    ],
    shortcuts: [
      {
        name: 'Browse Notes',
        short_name: 'Notes',
        description: 'Find free notes for your course',
        url: '/notes',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'Coding Practice',
        short_name: 'Code',
        description: 'Practice coding problems',
        url: '/coding-practice',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'AI Assistant',
        short_name: 'AI',
        description: 'Ask AI your study questions',
        url: '/ai',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }],
      },
    ],
  }
}