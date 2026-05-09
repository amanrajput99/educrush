import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',      // API routes crawl nahi honi chahiye
        ],
      },
    ],
    sitemap: 'https://educrush.in/sitemap.xml',
    host: 'https://educrush.in',
  }
}