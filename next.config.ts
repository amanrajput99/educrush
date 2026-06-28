import type { NextConfig } from 'next'

const nextConfig: NextConfig = {

  // ── Images — next/image ke liye external domains ───────────────────────────
  // Teri app mein yeh domains se images aati hain:
  // 1. Supabase storage  — blogs cover_image, college logo/hero, avatars
  // 2. Unsplash          — Image gallery, contact page avatars
  // 3. prebuiltui        — Hero section galaxy background
  // 4. cdn.jsdelivr.net  — Hero section tech stack logos (React, Python, Java etc.)
  // 5. cdn.worldvectorlogo — Next.js, Framer logos
  // 6. svgrepo.com       — Tailwind logo
  images: {
    remotePatterns: [
      // Supabase storage — tera main image source
      // NOTE: apna actual Supabase project ID daalo neeche
      // NEXT_PUBLIC_SUPABASE_URL se milega: https://XXXX.supabase.co
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      // Unsplash — Image gallery + contact avatars
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // Hero background image
      {
        protocol: 'https',
        hostname: 'assets.prebuiltui.com',
      },
      // Tech stack logos (React, Python, Java, Supabase icons)
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
      },
      // Next.js, Framer logos
      {
        protocol: 'https',
        hostname: 'cdn.worldvectorlogo.com',
      },
      // Tailwind logo
      {
        protocol: 'https',
        hostname: 'www.svgrepo.com',
      },
      // Google OAuth avatars — login ke baad profile picture
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
    // WebP aur AVIF format auto convert — images 40-60% chhoti ho jaayengi
    formats: ['image/avif', 'image/webp'],
    // Device sizes — teri site ke common breakpoints
    deviceSizes: [375, 640, 750, 828, 1080, 1200, 1920],
    // Image sizes for layout="fixed" or layout="intrinsic"
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Minimum cache time — images 7 din tak browser mein rehti hain
    minimumCacheTTL: 604800,
  },

  // ── Security + Performance Headers ────────────────────────────────────────
  async headers() {
    return [
      // ── Sabhi pages pe security headers ───────────────────────────────────
      {
        source: '/(.*)',
        headers: [
          // Clickjacking se protection — koi teri site ko iframe mein nahi daal sakta
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // MIME sniffing attack se protection
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // HTTPS enforce karo — 2 saal ke liye
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          // Referrer — analytics ke liye same-origin pe full URL, cross-origin pe sirf domain
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Unnecessary browser features block — battery/performance save
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
          // XSS Protection (older browsers)
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          // DNS Prefetch — baaki pages ke resources pehle se load hone lagte hain
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },

      // ── Static assets — 1 saal ka aggressive cache ────────────────────────
      // _next/static mein JS/CSS bundled hoti hai — ye kabhi change nahi hoti
      // (hash-based filenames hoti hain, isliye safe hai)
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Public folder — images, icons, manifest
      {
        source: '/(.*)\\.(png|jpg|jpeg|gif|webp|avif|svg|ico|woff|woff2|ttf|otf)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Manifest aur robots — thoda kam cache
      {
        source: '/(manifest\\.json|robots\\.txt|sitemap\\.xml)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=3600' },
        ],
      },

      // ── API routes — no cache (always fresh data) ──────────────────────────
      {
        source: '/api/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
        ],
      },

      // ── Fonts preconnect hint — Google Fonts faster load hoti hain ────────
      // (ye layout.tsx mein <link rel="preconnect"> se better kaam karta hai)
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Link',
            value: '<https://fonts.googleapis.com>; rel=preconnect, <https://fonts.gstatic.com>; rel=preconnect; crossorigin',
          },
        ],
      },
    ]
  },

  // ── Redirects — sabhi purane/typo URLs → sahi URLs ────────────────────────
  async redirects() {
    return [
      // ── Typo / singular → plural ─────────────────────────────────────────
      { source: '/project',               destination: '/projects',          permanent: true },
      { source: '/note',                  destination: '/notes',             permanent: true },
      { source: '/blog',                  destination: '/blogs',             permanent: true },
      { source: '/admission/college',     destination: '/admission/colleges', permanent: true },
      { source: '/career',                destination: '/careers',           permanent: true },
      { source: '/coding',                destination: '/coding-practice',   permanent: true },

      // ── Purane .html pages → clean URLs ──────────────────────────────────
      { source: '/notes.html',            destination: '/notes',             permanent: true },
      { source: '/projects.html',         destination: '/projects',          permanent: true },
      { source: '/about.html',            destination: '/about',             permanent: true },
      { source: '/contact.html',          destination: '/contact',           permanent: true },
      { source: '/blogs.html',            destination: '/blogs',             permanent: true },
      { source: '/btech-third-year.html', destination: '/notes',            permanent: true },

      // ── Purane /all-notes/ pattern ────────────────────────────────────────
      { source: '/all-notes/:slug',       destination: '/notes',             permanent: true },
      { source: '/all-notes/java-1.html', destination: '/notes/java-programming', permanent: true },
      { source: '/all-notes/js-1.html',   destination: '/notes',            permanent: true },
      { source: '/all-notes/html-1.html', destination: '/notes',            permanent: true },
      { source: '/all-notes/flat-1.html', destination: '/notes',            permanent: true },

      // ── Trailing slash normalize ─────────────────────────────────────────
      // /notes/ → /notes (Google duplicate content avoid)
      { source: '/notes/',                destination: '/notes',             permanent: true },
      { source: '/blogs/',                destination: '/blogs',             permanent: true },
      { source: '/projects/',             destination: '/projects',          permanent: true },
      { source: '/admission/',            destination: '/admission',         permanent: true },
      { source: '/about/',                destination: '/about',             permanent: true },
      { source: '/contact/',              destination: '/contact',           permanent: true },
    ]
  },

  // ── Experimental optimizations ────────────────────────────────────────────
  experimental: {
    // CSS optimize karo — unused styles remove hoti hain
    optimizeCss: true,
    // Package imports optimize — lucide-react ka tree-shaking better hoga
    // (teri app mein lucide-react ^1.11.0 hai)
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
    ],
  },

  // ── Compiler options ──────────────────────────────────────────────────────
  compiler: {
    // Production build mein console.log remove ho jaayenge
    // (keep karo console.error aur console.warn debugging ke liye)
    removeConsole: process.env.NODE_ENV === 'production'
      ? { exclude: ['error', 'warn'] }
      : false,
  },

  // ── Bundle analysis (optional) ────────────────────────────────────────────
  // npm install @next/bundle-analyzer karke uncomment karo
  // phir: ANALYZE=true npm run build
  // ...(process.env.ANALYZE === 'true'
  //   ? { ...require('@next/bundle-analyzer')({ enabled: true })(nextConfig) }
  //   : {}),
}

export default nextConfig