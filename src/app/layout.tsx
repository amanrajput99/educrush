import type { Metadata, Viewport } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CTA from '@/components/home/CTA'
import AiButton from '@/components/ui/AiButton'
import { WebsiteJsonLd, OrganizationJsonLd } from '@/components/seo/JsonLd'
import GoogleAnalytics from '@/components/Googleanalytics'
import Script from 'next/script'

const BASE_URL = 'https://educrush.in'

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  // ─── Title ───────────────────────────────────────────────
  // default = homepage title
  // template = har doosre page pe auto-apply hoga — | EduCrush append hoga
  title: {
    default: 'EduCrush — Free Notes, Projects & AI for Students',
    template: '%s | EduCrush',
  },

  // ─── Description ─────────────────────────────────────────
  description:
    'EduCrush provides free notes, web development projects, coding practice, and an AI study assistant for BCA, BTech, Class 10–12, and Diploma students. 10,000+ students learning free.',

  // ─── Keywords ────────────────────────────────────────────
  keywords: [
    'free notes', 'BCA notes', 'BTech notes', 'Class 10 notes', 'Class 12 notes',
    'Diploma notes', 'web development projects', 'HTML CSS projects', 'coding practice',
    'AI study assistant', 'EduCrush', 'free study material', 'student resources India',
    'free education India', 'BTech notes PDF', 'BCA notes PDF', 'engineering notes free',
  ],

  // ─── Author / Publisher ───────────────────────────────────
  authors: [{ name: 'EduCrush', url: BASE_URL }],
  creator: 'EduCrush',
  publisher: 'EduCrush',

  // ─── Canonical ───────────────────────────────────────────
  // Sirf homepage ka canonical yahan — baaki pages apna khud set karenge
// <<<<<<< HEAD
  // alternates: {
  //   canonical: BASE_URL,
  // },
// =======

  // ─── Open Graph ──────────────────────────────────────────
  // WhatsApp, Facebook, LinkedIn share pe yahi dikhta hai
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: BASE_URL,
    siteName: 'EduCrush',
    title: 'EduCrush — Free Notes, Projects & AI for Students',
    description:
      'Free notes, web development projects, coding practice, and AI study assistant for Indian students. BCA, BTech, Class 10–12 & Diploma. Join 10,000+ students.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'EduCrush — Free Study Resources for Students',
        type: 'image/png',
      },
    ],
  },

  // ─── Twitter / X ─────────────────────────────────────────
  twitter: {
    card: 'summary_large_image',
    site: '@educrush',
    creator: '@educrush',
    title: 'EduCrush — Free Notes, Projects & AI for Students',
    description:
      'Free notes, projects, coding practice & AI study assistant for Indian students. 10,000+ students learning free.',
    images: [
      {
        url: '/og-image.png',
        alt: 'EduCrush — Free Study Resources for Students',
      },
    ],
  },

  // ─── Robots ──────────────────────────────────────────────
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

  // ─── Icons ───────────────────────────────────────────────
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },

  // ─── PWA Manifest ────────────────────────────────────────
  manifest: '/manifest.json',

  // ─── Google Verification ─────────────────────────────────
  verification: {
    google: 'xO3Fi1Yr9Lr8Y3LcFRdT_BbxXLoLQgWr30d92zbUuHU',
    // future mein Bing add karna ho toh:
    // other: { 'msvalidate.01': 'BING_CODE_HERE' },
  },

  // ─── Category ────────────────────────────────────────────
  category: 'education',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      {/*
        Next.js automatically injects:
        - charset utf-8
        - viewport (from viewport export above)
        - themeColor (from viewport export above)
        - title, description, og tags (from metadata export above)

        Sirf woh tags yahan daalo jo Next.js metadata API cover nahi karta.
      */}
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="EduCrush" />
      </head>
      <body>
        <GoogleAnalytics />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6151740459717471"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
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