import type { Metadata } from 'next'
import HeroSection from '@/components/home/Hero-section'
import ProjectCards from '@/components/home/Projectcards'
import NotesSection from '@/components/home/Notescards'
import BlogSection from '@/components/home/BlogSection'
import Features from '@/components/home/Features'
import ImageGallery from '@/components/home/Image-gallery'
import FAQ from '@/components/home/FAQ'
import Testimonials from '@/components/ui/Testimonials'

const BASE_URL = 'https://educrush.in'

// ── Homepage Metadata ─────────────────────────────────────────────────────────
// Homepage sabse important page hai — yahan title/desc most competitive hona chahiye
export const metadata: Metadata = {

  // ── Title — 58 chars, primary keyword pehle ──────────────────────────────
  // "Free Notes + Projects + AI" = 3 main value props ek title mein
  title: 'EduCrush — Free Notes, Projects & AI for Students',

  // ── Description — 158 chars, action words, all courses covered ───────────
  description:
    'Free notes, projects with source code, coding practice & AI study assistant for BCA, BTech, Diploma & Class 10–12 students. No login needed. 10,000+ students learning free.',

  // ── Keywords — homepage broad + high-volume terms cover karo ─────────────
  // Notes page ne specific "BCA notes PDF" cover kiya
  // Projects page ne "web dev projects source code" cover kiya
  // Homepage mein brand + broad + intent-based terms daalo
  keywords: [
    // Brand terms — sabse important
    'EduCrush',
    'educrush.in',
    'EduCrush free notes',
    'EduCrush projects',

    // Broad high-volume terms (homepage ke liye best)
    'free study material for students India',
    'free notes for engineering students',
    'free education platform India',
    'free learning platform for students',
    'student resources India free',

    // Course-level terms
    'BCA notes projects free',
    'BTech notes projects free',
    'Diploma notes free India',
    'Class 10 study material free',
    'Class 12 study material free',

    // Feature-level terms
    'AI study assistant free India',
    'free coding practice for students',
    'free online code editor students',
    'free college admission guidance India',

    // Location — Uttarakhand students
    'free notes Dehradun',
    'free study material Uttarakhand',
    'EduCrush Dehradun',

    // Intent terms
    'where to get free notes for BCA',
    'best free education site for BTech students',
    'free notes download no login',
    'free projects with source code for students',
  ],

  // ── Canonical — homepage ─────────────────────────────────────────────────
  alternates: {
    canonical: BASE_URL,
  },

  // ── Open Graph — WhatsApp, Facebook, LinkedIn share ──────────────────────
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: BASE_URL,
    siteName: 'EduCrush',
    // OG title thoda longer ho sakta hai — 70-90 chars
    title: 'EduCrush — Free Notes, Projects, Coding & AI for BCA, BTech Students',
    description:
      'India ka free student platform. Notes, projects with source code, coding practice & AI assistant for BCA, BTech, Diploma & Class 10–12. Join 10,000+ students. No login.',
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'EduCrush — Free Study Resources for BCA, BTech & Diploma Students',
        type: 'image/png',
      },
    ],
  },

  // ── Twitter / X ──────────────────────────────────────────────────────────
  twitter: {
    card: 'summary_large_image',
    site: '@educrush',
    creator: '@educrush',
    title: 'EduCrush — Free Notes, Projects & AI for Students',
    description:
      'Free notes, projects, coding practice & AI for BCA, BTech, Diploma students. 10,000+ students. No login needed.',
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        alt: 'EduCrush — Free Study Resources for Students',
      },
    ],
  },

  // ── Robots — aggressively index karo ─────────────────────────────────────
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
}

// ── FAQPage + WebSite JSON-LD — Rich Results ke liye ─────────────────────────
// FAQPage schema se Google search mein FAQ dropdowns dikhte hain
// Ye homepage ka sabse powerful SEO feature hai
function HomepageJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [

      // ── FAQPage — FAQ section ke questions Google mein expand hote hain ──
      {
        '@type': 'FAQPage',
        '@id': `${BASE_URL}/#faq`,
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Is EduCrush completely free?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes — 100% free, forever. EduCrush was built on the belief that quality education should never be locked behind a paywall. Every note, project, and resource on this platform is free to access with no hidden charges.',
            },
          },
          {
            '@type': 'Question',
            name: 'Which courses and subjects are covered on EduCrush?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'EduCrush covers BTech (CSE, ECE, ME and more), BCA, and Diploma programmes across all years and semesters. Subjects include DSA, DBMS, Operating Systems, Java, Python, Web Development, Engineering Mathematics, and more.',
            },
          },
          {
            '@type': 'Question',
            name: 'Do I need to create an account to access notes and projects?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No login is needed to browse and download notes or projects. You can access all free resources instantly without signing up.',
            },
          },
          {
            '@type': 'Question',
            name: 'What is EduCrush AI?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'EduCrush AI is a free AI-powered study assistant for students. You can ask questions, get concept explanations, solve coding problems, and get help in Computer Science, Mathematics, Physics and more — powered by Claude, Gemini and Groq.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I contribute my own notes or projects to EduCrush?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. You can join as a Volunteer Contributor and submit notes, projects, or articles. Your content is published with full credit and you receive a contributor badge.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is EduCrush available outside Dehradun or Uttarakhand?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. EduCrush is a fully online platform accessible to any student across India. Whether you are in a metro city or a Tier 3 town, all you need is an internet connection.',
            },
          },
          {
            '@type': 'Question',
            name: 'How do I become an EduCrush Student Ambassador?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Apply through the Careers page. The Student Ambassador Program is open to any BTech, BCA, or Diploma student. It requires 2–3 hours per week and comes with a certificate and letter of recommendation.',
            },
          },
        ],
      },

      // ── EducationalOrganization — homepage level ──────────────────────────
      {
        '@type': 'EducationalOrganization',
        '@id': `${BASE_URL}/#organization`,
        name: 'EduCrush',
        url: BASE_URL,
        logo: {
          '@type': 'ImageObject',
          url: `${BASE_URL}/icon-512.png`,
          width: 512,
          height: 512,
        },
        description:
          'EduCrush is a free educational platform providing notes, projects with source code, coding practice, and AI tools for BCA, BTech, Diploma and Class 10–12 students in India.',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Dehradun',
          addressRegion: 'Uttarakhand',
          addressCountry: 'IN',
        },
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          email: 'educrushofficial@gmail.com',
          url: `${BASE_URL}/contact`,
          availableLanguage: ['English', 'Hindi'],
        },
        sameAs: [
          'https://www.linkedin.com/company/educrushio',
          'https://www.instagram.com/educrush',
          'https://t.me/educrush',
          'https://www.youtube.com/@educrush_99',
        ],
        founder: {
          '@type': 'Person',
          name: 'Aman Kumar Singh',
          url: `${BASE_URL}/about`,
        },
      },

      // ── WebPage — homepage specific ───────────────────────────────────────
      {
        '@type': 'WebPage',
        '@id': `${BASE_URL}/#webpage`,
        url: BASE_URL,
        name: 'EduCrush — Free Notes, Projects & AI for Students',
        description:
          'Free notes, projects with source code, coding practice & AI study assistant for BCA, BTech, Diploma & Class 10–12 students.',
        inLanguage: 'en-IN',
        isPartOf: { '@id': `${BASE_URL}/#organization` },
        about: { '@id': `${BASE_URL}/#organization` },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: BASE_URL,
            },
          ],
        },
      },

    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <>
      <HomepageJsonLd />
      <HeroSection />
      <NotesSection limit={7} />
      <ProjectCards limit={5} />
      <BlogSection />
      <Features />
      <ImageGallery />
      <FAQ />
      <Testimonials />
    </>
  )
}