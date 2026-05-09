// src/components/seo/JsonLd.tsx

export function WebsiteJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'EduCrush',
    url: 'https://educrush.in',
    description: 'Free notes, web development projects, coding practice, and AI study assistant for Indian students.',
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: 'https://educrush.in/notes?q={search_term_string}' },
      'query-input': 'required name=search_term_string',
    },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

// ── NoteJsonLd — handwritten support + strong structured data ─────────────────
export function NoteJsonLd({
  title,
  description,
  subject,
  course,
  year,
  semester,
  slug,
  image,
  isHandwritten,
  tags,
  topic,
}: {
  title: string
  description: string
  subject: string
  course?: string
  year?: string
  semester?: string
  slug: string
  image?: string
  isHandwritten?: boolean
  tags?: string[]
  topic?: string
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',

    // ── Basic info ────────────────────────────────────────────────────────────
    headline: title,
    description,
    url: `https://educrush.in/notes/${slug}`,
    image: image || 'https://educrush.in/og-image.png',

    // ── Publisher ─────────────────────────────────────────────────────────────
    publisher: {
      '@type': 'Organization',
      name: 'EduCrush',
      url: 'https://educrush.in',
      logo: { '@type': 'ImageObject', url: 'https://educrush.in/favicon.ico' },
    },

    // ── Education specific ────────────────────────────────────────────────────
    about: { '@type': 'Thing', name: topic ?? subject },
    educationalLevel: course ? `${course}${year ? ` ${year}` : ''}` : 'Higher Education',
    teaches: subject,
    inLanguage: 'en-IN',
    isAccessibleForFree: true,

    // ── Handwritten ya typed — Google samjhega ────────────────────────────────
    // 'handwritten' = teacher/student ka original, 'digital' = typed PDF
    additionalType: isHandwritten
      ? 'https://schema.org/Manuscript'   // handwritten manuscript
      : 'https://schema.org/DigitalDocument', // typed/printed

    // ── Extra keywords — Google indexing improve hoga ─────────────────────────
    keywords: [
      title,
      subject,
      course ?? '',
      year ?? '',
      semester ?? '',
      topic ?? '',
      ...(tags ?? []),
      'free notes',
      'study material',
      'EduCrush',
      isHandwritten ? 'handwritten notes' : 'typed notes',
      isHandwritten ? `handwritten ${subject} notes` : `${subject} notes PDF`,
    ].filter(Boolean).join(', '),

    // ── Course info ───────────────────────────────────────────────────────────
    ...(course && {
      hasCourseInstance: {
        '@type': 'CourseInstance',
        name: `${subject} — ${course}${year ? ` ${year}` : ''}${semester ? ` ${semester}` : ''}`,
        courseMode: 'online',
      },
    }),
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

// ── ProjectJsonLd ─────────────────────────────────────────────────────────────
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
    publisher: { '@type': 'Organization', name: 'EduCrush', url: 'https://educrush.in' },
    isAccessibleForFree: true,
    inLanguage: 'en-IN',
    keywords: [...tags, 'free project', 'source code', 'web development', 'EduCrush', `${name} source code`].join(', '),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

// ── OrganizationJsonLd ────────────────────────────────────────────────────────
export function OrganizationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'EduCrush',
    url: 'https://educrush.in',
    description: 'EduCrush is a free educational platform providing notes, projects, and AI tools for Indian students.',
    sameAs: [
      'https://twitter.com/educrush',
      'https://github.com/educrush',
      'https://linkedin.com/company/educrush',
    ],
    contactPoint: { '@type': 'ContactPoint', contactType: 'customer support', url: 'https://educrush.in/contact' },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}