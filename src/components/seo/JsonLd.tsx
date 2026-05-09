// ─────────────────────────────────────────────────────────────────────────────
// src/components/seo/JsonLd.tsx
// Google ko structured data deta hai — rich results mein dikhta hai
// ─────────────────────────────────────────────────────────────────────────────

// ── Website schema — layout.tsx mein use karo ─────────────────────────────
export function WebsiteJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'EduCrush',
    url: 'https://educrush.in',
    description:
      'Free notes, web development projects, coding practice, and AI study assistant for Indian students.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://educrush.in/notes?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ── Note/Article schema — notes/[slug]/page.tsx mein use karo ────────────
export function NoteJsonLd({
  title,
  description,
  subject,
  course,
  year,
  slug,
  image,
}: {
  title: string
  description: string
  subject: string
  course?: string
  year?: string
  slug: string
  image?: string
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: `https://educrush.in/notes/${slug}`,
    image: image || 'https://educrush.in/og-image.png',
    publisher: {
      '@type': 'Organization',
      name: 'EduCrush',
      url: 'https://educrush.in',
      logo: {
        '@type': 'ImageObject',
        url: 'https://educrush.in/favicon.ico',
      },
    },
    about: {
      '@type': 'Thing',
      name: subject,
    },
    educationalLevel: course
      ? `${course}${year ? ` ${year}` : ''}`
      : 'Higher Education',
    inLanguage: 'en-IN',
    isAccessibleForFree: true,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ── Project/SoftwareApp schema — projects/[slug]/page.tsx mein use karo ──
export function ProjectJsonLd({
  name,
  description,
  slug,
  tags,
  image,
}: {
  name: string
  description: string
  slug: string
  tags: string[]
  image?: string
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name,
    description,
    url: `https://educrush.in/projects/${slug}`,
    image: image || 'https://educrush.in/og-image.png',
    programmingLanguage: tags,
    codeRepository: `https://educrush.in/projects/${slug}`,
    publisher: {
      '@type': 'Organization',
      name: 'EduCrush',
      url: 'https://educrush.in',
    },
    isAccessibleForFree: true,
    inLanguage: 'en-IN',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ── Organization schema — about page ya layout mein use karo ─────────────
export function OrganizationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'EduCrush',
    url: 'https://educrush.in',
    description:
      'EduCrush is a free educational platform providing notes, projects, and AI tools for Indian students.',
    sameAs: [
      'https://twitter.com/educrush',    // apna actual handle daalo
      'https://github.com/educrush',     // apna actual GitHub daalo
      'https://linkedin.com/company/educrush',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      url: 'https://educrush.in/contact',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}