import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Sabhi crawlers ke liye
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',           // API routes — crawl nahi honi chahiye
          '/dashboard/',     // Private user pages
          '/onboarding/',    // Private flow
          '/auth/',          // Auth callbacks
          '/login',          // Login page — no SEO value
          '/*?*',            // Query params wale URLs — duplicate content avoid
        ],
      },
      {
        // GPTBot (ChatGPT) — allow karo, free promotion hai
        userAgent: 'GPTBot',
        allow: ['/notes', '/blogs', '/projects', '/about'],
        disallow: ['/api/', '/dashboard/', '/auth/'],
      },
    ],
    sitemap: 'https://educrush.in/sitemap.xml',
    host: 'https://educrush.in',
  }
}