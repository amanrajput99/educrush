import type { Metadata } from 'next'
import { AdmissionPageClient } from './AdmissionPageClient'

export const metadata: Metadata = {
  // ════════════════════════════════════════════════════════
  // TITLE — Primary keyword sabse pehle, brand last mein
  // Format: [Primary KW] — [Secondary KW] | [Brand]
  // ════════════════════════════════════════════════════════
  title: 'BTech BCA Admission 2026 — Free College Counseling Dehradun, Delhi, Bihar',

  // ════════════════════════════════════════════════════════
  // DESCRIPTION — 150-160 chars, CTA include karo, numbers use karo
  // ══════════════════════════════════════════════════════
  description: 'Get free BTech & BCA admission guidance 2026 for colleges in Dehradun, Delhi, Noida & across India. Bihar students: DRCC loan ₹4L @ 1% help included. WhatsApp reply in 24 hours. 2,000+ students guided.',

  // ════════════════════════════════════════════════════════
  // KEYWORDS — Long-tail + high-intent + location-based
  // ════════════════════════════════════════════════════════
  keywords: [
    // High intent — admission seekers
    'BTech admission 2026',
    'BCA admission 2026',
    'college admission 2026 India',
    'BTech admission Dehradun 2026',
    'BCA admission Delhi 2026',
    'BTech admission Bihar 2026',
    'engineering college admission 2026',
    'direct BTech admission 2026',

    // Location-specific
    'best BTech colleges Dehradun',
    'best BCA colleges Delhi',
    'BTech colleges Noida',
    'BTech colleges Uttarakhand',
    'engineering colleges Dehradun fees',
    'private BTech colleges Dehradun',
    'BTech colleges Delhi NCR 2026',

    // Free counseling intent
    'free college counseling 2026',
    'free admission guidance India',
    'college counseling WhatsApp',
    'free BTech counseling',
    'college admission help free',
    'admission counselor India free',

    // Bihar specific — huge audience
    'Bihar BTech admission 2026',
    'DRCC Bihar education loan',
    'DRCC Bihar loan BTech',
    'Bihar student college admission',
    'Bihar education loan 1 percent',
    'Bihar government education loan',
    'education loan Bihar 4 lakh',
    'DRCC loan eligibility Bihar',

    // Course + college specific
    'Graphic Era University admission 2026',
    'DIT University Dehradun admission',
    'Amity University Noida admission',
    'Sharda University admission 2026',
    'BTech CSE admission 2026',
    'BTech ECE admission 2026',
    'Diploma admission 2026',

    // Problem-aware searches
    'after 12th BTech admission',
    '12th pass college admission 2026',
    'JEE Main failed college option',
    'low percentage BTech admission',
    'direct admission without JEE',
    'EduCrush admission',
  ],

  // ════════════════════════════════════════════════════════
  // CANONICAL — Must match exact URL, no trailing slash issue
  // ════════════════════════════════════════════════════════
  alternates: {
    canonical: 'https://educrush.in/admission',
  },

  // ════════════════════════════════════════════════════════
  // ROBOTS — Fully indexable, max snippets for rich results
  // ════════════════════════════════════════════════════════
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

  // ════════════════════════════════════════════════════════
  // OPEN GRAPH — Social sharing (WhatsApp, Facebook, LinkedIn)
  // OG image MUST exist at this path in /public folder
  // Size: 1200x630px, text visible even as thumbnail
  // ════════════════════════════════════════════════════════
  openGraph: {
    title: 'Free BTech & BCA Admission Guidance 2026 — Dehradun, Delhi, Bihar',
    description: 'Compare top colleges in Dehradun & Delhi. Free WhatsApp counseling in 24 hrs. Bihar students: DRCC govt loan ₹4L @ 1% interest. 2,000+ students guided. 100% free.',
    url: 'https://educrush.in/admission',
    siteName: 'EduCrush',
    images: [
      {
        url: 'https://educrush.in/og-admission.png', // ⚠️ YEH FILE /public/og-admission.png MEIN HONI CHAHIYE
        width: 1200,
        height: 630,
        alt: 'EduCrush — Free BTech BCA Admission Guidance 2026 | Dehradun Delhi Bihar',
        type: 'image/png',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },

  // ════════════════════════════════════════════════════════
  // TWITTER CARD — Twitter/X sharing
  // ════════════════════════════════════════════════════════
  twitter: {
    card: 'summary_large_image',
    site: '@educrush',
    creator: '@educrush',
    title: 'Free BTech & BCA Admission Guidance 2026 | EduCrush',
    description: 'Dehradun, Delhi & Bihar colleges — free WhatsApp counseling. Bihar DRCC loan ₹4L @ 1% interest. 2,000+ students guided.',
    images: {
      url: 'https://educrush.in/og-admission.png',
      alt: 'EduCrush — Free College Admission Guidance 2026',
    },
  },

  // ════════════════════════════════════════════════════════
  // VERIFICATION & AUTHOR
  // ════════════════════════════════════════════════════════
  authors: [{ name: 'EduCrush', url: 'https://educrush.in' }],
  creator: 'EduCrush',
  publisher: 'EduCrush',

  // ════════════════════════════════════════════════════════
  // APP META — Mobile browser chrome color
  // ════════════════════════════════════════════════════════
  other: {
    'theme-color': '#0f172a',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'EduCrush Admission',
  },
}

// ════════════════════════════════════════════════════════
// JSON-LD STRUCTURED DATA — Google rich results ke liye
// Yeh Google ko exactly samjhata hai page kya hai
// FAQPage + EducationalOrganization dono daal rahe hain
// ════════════════════════════════════════════════════════
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    // 1. Organization Schema
    {
      '@type': 'EducationalOrganization',
      '@id': 'https://educrush.in/#organization',
      name: 'EduCrush',
      url: 'https://educrush.in',
      logo: 'https://educrush.in/favicon.ico',
      description: 'Free college admission guidance platform for BTech, BCA, Diploma students in India.',
      sameAs: [
        'https://www.instagram.com/educrush',
        'https://t.me/educrush',
        'https://www.linkedin.com/company/educrushio',
        'https://www.youtube.com/@educrush_99',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Admission Counseling',
        availableLanguage: ['English', 'Hindi'],
      },
    },

    // 2. WebPage Schema
    {
      '@type': 'WebPage',
      '@id': 'https://educrush.in/admission',
      url: 'https://educrush.in/admission',
      name: 'BTech BCA Admission 2026 — Free College Counseling | EduCrush',
      description: 'Free BTech & BCA admission guidance for 2026. Compare colleges in Dehradun, Delhi, Bihar. Bihar DRCC loan help.',
      inLanguage: 'en-IN',
      isPartOf: { '@id': 'https://educrush.in/#organization' },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://educrush.in',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Admission 2026',
            item: 'https://educrush.in/admission',
          },
        ],
      },
    },

    // 3. FAQ Schema — Google pe directly answers dikhenge search results mein
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Is EduCrush college admission counseling free?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, EduCrush admission counseling is 100% free. No hidden charges for college comparison, counseling, or DRCC Bihar loan guidance. We reply on WhatsApp within 24 hours.',
          },
        },
        {
          '@type': 'Question',
          name: 'Which BTech colleges are available in Dehradun for 2026 admission?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Top BTech colleges in Dehradun for 2026 include Graphic Era University (NIRF ranked), DIT University, UPES, Uttaranchal University, and JBIT. Fees range from ₹70,000 to ₹1.5 lakh per year. EduCrush provides free guidance to compare these colleges.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is DRCC Bihar education loan and who can apply?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'DRCC Bihar is a Bihar government scheme offering education loans up to ₹4 lakh at just 1% interest rate. Bihar domicile students who passed 10th/12th from a recognized board and have family income below ₹3 lakh can apply. No collateral needed for loans under ₹1.5 lakh. EduCrush helps Bihar students apply for this loan for free.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I get BTech admission in 2026 without JEE Main?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, many private BTech colleges in Dehradun and Delhi NCR like Graphic Era, DIT University, Sharda University, and Amity University offer direct admission based on Class 12 marks without requiring JEE Main scores. EduCrush provides free counseling to help you secure admission.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does EduCrush free WhatsApp counseling work?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Fill the admission form on EduCrush with your details — name, WhatsApp number, 12th percentage, and preferred state. Our counselor contacts you on WhatsApp within 24 hours with personalized college recommendations, fee details, and loan guidance — completely free.',
          },
        },
        {
          '@type': 'Question',
          name: 'What courses does EduCrush help with for 2026 admission?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'EduCrush provides free admission guidance for BTech CSE, BTech ECE, BCA, MBA, and Diploma programs at colleges across Dehradun, Delhi, Noida, and pan-India.',
          },
        },
      ],
    },
  ],
}

export default function AdmissionPage() {
  return (
    <>
      {/* JSON-LD inject karo head mein */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AdmissionPageClient />
    </>
  )
}