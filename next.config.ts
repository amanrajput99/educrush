import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
       // ── Typo fixes ──────────────────────────────────────────────────────
      {
        source: '/project',
        destination: '/projects',
        permanent: true,
      },
      {
        source: '/note',
        destination: '/notes',
        permanent: true,
      },
      // ── Purane .html pages → naye clean URLs ────────────────────────────
      {
        source: '/notes.html',
        destination: '/notes',
        permanent: true, // 301 redirect — Google ko batata hai "hamesha ke liye badla"
      },
      {
        source: '/projects.html',
        destination: '/projects',
        permanent: true,
      },
      {
        source: '/about.html',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/contact.html',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/btech-third-year.html',
        destination: '/notes',
        permanent: true,
      },
      // ── Purane /all-notes/ URLs → naye /notes/ ──────────────────────────
      // Wildcard — saare /all-notes/*.html pages ek saath redirect
      {
        source: '/all-notes/:slug',
        destination: '/notes',
        permanent: true,
      },
      {
        source: '/all-notes/java-1.html',
        destination: '/notes',
        permanent: true,
      },
      {
        source: '/all-notes/js-1.html',
        destination: '/notes',
        permanent: true,
      },
      {
        source: '/all-notes/html-1.html',
        destination: '/notes',
        permanent: true,
      },
      {
        source: '/all-notes/flat-1.html',
        destination: '/notes',
        permanent: true,
      },
     
    ];
  },
};

export default nextConfig;