// import type { Metadata } from 'next'
// import './globals.css'
// import Navbar from '@/components/Navbar'
// import Footer from '@/components/Footer'
// import CTA from '@/components/home/CTA'
// import AiButton from '@/components/ui/AiButton'
// import { WebsiteJsonLd, OrganizationJsonLd } from '@/components/seo/JsonLd'
// import GoogleAnalytics from '@/components/Googleanalytics'


// // ── Base URL — apna domain yahan daalo ───────────────────────────────────────
// const BASE_URL = 'https://educrush.in'

// export const metadata: Metadata = {
//   // ── Basic ──────────────────────────────────────────────────────────────────
//   metadataBase: new URL(BASE_URL),
//   title: {
//     default: 'EduCrush — Free Notes, Projects & AI for Students',
//     template: '%s | EduCrush',
//   },
//   description:
//     'EduCrush provides free notes, web development projects, coding practice, and an AI study assistant for BCA, BTech, Class 10–12, and Diploma students.',

//   // ── Keywords ───────────────────────────────────────────────────────────────
//   keywords: [
//     'free notes', 'BCA notes', 'BTech notes', 'Class 10 notes', 'Class 12 notes',
//     'Diploma notes', 'web development projects', 'HTML CSS projects', 'coding practice',
//     'AI study assistant', 'EduCrush', 'free study material', 'student resources India',
//   ],

//   // ── Authors & Site Info ────────────────────────────────────────────────────
//   authors: [{ name: 'EduCrush', url: BASE_URL }],
//   creator: 'EduCrush',
//   publisher: 'EduCrush',

//   // ── Canonical ─────────────────────────────────────────────────────────────
//   alternates: {
//     canonical: BASE_URL,
//   },

//   // ── Open Graph (Facebook, WhatsApp, LinkedIn share) ───────────────────────
//   openGraph: {
//     type: 'website',
//     locale: 'en_IN',
//     url: BASE_URL,
//     siteName: 'EduCrush',
//     title: 'EduCrush — Free Notes, Projects & AI for Students',
//     description:
//       'Free notes, web development projects, coding practice, and AI study assistant for Indian students. BCA, BTech, Class 10–12 & Diploma.',
//     images: [
//       {
//         url: '/og-image.png',   // 1200x630px image — /public/og-image.png mein rakho
//         width: 1200,
//         height: 630,
//         alt: 'EduCrush — Free Study Resources for Students',
//       },
//     ],
//   },

//   // ── Twitter / X Cards ─────────────────────────────────────────────────────
//   twitter: {
//     card: 'summary_large_image',
//     site: '@educrush',        // apna Twitter handle daalo
//     creator: '@educrush',
//     title: 'EduCrush — Free Notes, Projects & AI for Students',
//     description:
//       'Free notes, projects, coding practice & AI study assistant for Indian students.',
//     images: ['/og-image.png'],
//   },

//   // ── Robots ────────────────────────────────────────────────────────────────
//   robots: {
//     index: true,
//     follow: true,
//     googleBot: {
//       index: true,
//       follow: true,
//       'max-video-preview': -1,
//       'max-image-preview': 'large',
//       'max-snippet': -1,
//     },
//   },

//   // ── Icons ─────────────────────────────────────────────────────────────────
//   icons: {
//     icon: '/favicon.ico',
//     shortcut: '/favicon.ico',
//     apple: '/apple-touch-icon.png',  // /public/ mein 180x180 png rakho
//   },

//   // ── Verification (Google Search Console mein milega) ──────────────────────
//   verification: {
//     google: 'google-site-verification=xO3Fi1Yr9Lr8Y3LcFRdT_BbxXLoLQgWr30d92zbUuHU',
//   },
// }

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body>
//         <GoogleAnalytics />
// <WebsiteJsonLd />
// <OrganizationJsonLd />
//         <Navbar />
//         <main>{children}</main>
//         <CTA />
//         <Footer />
//         <AiButton />
//       </body>
//     </html>
//   )
// }



import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CTA from '@/components/home/CTA'
import AiButton from '@/components/ui/AiButton'
import { WebsiteJsonLd, OrganizationJsonLd } from '@/components/seo/JsonLd'
import GoogleAnalytics from '@/components/Googleanalytics'

const BASE_URL = 'https://educrush.in'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'EduCrush — Free Notes, Projects & AI for Students',
    template: '%s | EduCrush',
  },
  description:
    'EduCrush provides free notes, web development projects, coding practice, and an AI study assistant for BCA, BTech, Class 10–12, and Diploma students.',

  keywords: [
    'free notes', 'BCA notes', 'BTech notes', 'Class 10 notes', 'Class 12 notes',
    'Diploma notes', 'web development projects', 'HTML CSS projects', 'coding practice',
    'AI study assistant', 'EduCrush', 'free study material', 'student resources India',
  ],

  authors: [{ name: 'EduCrush', url: BASE_URL }],
  creator: 'EduCrush',
  publisher: 'EduCrush',

  alternates: {
    canonical: BASE_URL,
  },

  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: BASE_URL,
    siteName: 'EduCrush',
    title: 'EduCrush — Free Notes, Projects & AI for Students',
    description:
      'Free notes, web development projects, coding practice, and AI study assistant for Indian students. BCA, BTech, Class 10–12 & Diploma.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'EduCrush — Free Study Resources for Students',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    site: '@educrush',
    creator: '@educrush',
    title: 'EduCrush — Free Notes, Projects & AI for Students',
    description:
      'Free notes, projects, coding practice & AI study assistant for Indian students.',
    images: ['/og-image.png'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },

  manifest: '/manifest.json',

  themeColor: '#0f172a',

  verification: {
    google: 'google-site-verification=xO3Fi1Yr9Lr8Y3LcFRdT_BbxXLoLQgWr30d92zbUuHU',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="EduCrush" />
      </head>
      <body>
        <GoogleAnalytics />
        <WebsiteJsonLd />
        <OrganizationJsonLd />
        <Navbar />
        <main>{children}</main>
        <CTA />
        <Footer />
        <AiButton />
      </body>
    </html>
  )
}