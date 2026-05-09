This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```


## dekh bhi ye domain ke bare me hai


this is live on vercel with domain educrush.in that is created by me Aman singh Rajput

## for codding practtice cards

1. Supabase — coding_languages table mein insert karo:
sql
[INSERT INTO coding_languages (slug, name, icon, color, description, order_index, published)
VALUES ('java', 'Java', '☕', '#f89820', 'Object-oriented programming — classes, OOP, data structures.', 5, true);]

2. Main site — codingPractice.ts mein add karo:
ts
// LANGUAGE_CONFIG mein add karo
[java: {
  monacoLang: 'java',
  defaultCode: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
},]

3. API route — run-code/route.ts mein add karo:
ts


// Paiza mein
java: 'java',

// Godbolt mein
java: { compiler: 'java2100', lang: 'java', args: '' },

// CodeX mein
java: 'java',


4. Admin — ProblemForm.tsx mein:
ts
// LANGUAGES array mein add karo
const LANGUAGES = ['c', 'cpp', 'python', 'javascript', 'java']

// LANG_LABELS mein
java: 'Java'

// DEFAULT_CODE mein
java: `public class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}`,


5. ProblemsClient.tsx mein filter dropdown mein:

tsx<option value="java">Java</option>

6. Editor page mein LANGUAGES array mein add karo:

ts{
  slug: 'java', name: 'Java', icon: '☕', color: '#f89820',
  default: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
},

Kaunsi language add karni hai? Batao — main uska poora ready code de dunga



## if adding another page for seo


add karna hua to  kaise add karunga yr seo ke sath

00:46
Claude responded: Bhai simple rule hai — naya page banao to bas 2 cheezein karo:
Bhai simple rule hai — naya page banao to bas 2 cheezein karo:

Agar naya page add karna hai
Rule 1 — Agar page mein 'use client' hai:

2 files banao:

NewPageClient.tsx  ← tera poora code yahan
page.tsx           ← sirf metadata + import
page.tsx template — bas copy karo aur words badlo:

tsx
import type { Metadata } from 'next'
import NewPageClient from './NewPageClient'

export const metadata: Metadata = {
  title: 'Page Title | EduCrush',
  description: 'Page description 150-160 characters mein.',
  alternates: { canonical: 'https://educrush.in/new-page' },
  openGraph: {
    url: 'https://educrush.in/new-page',
    title: 'Page Title | EduCrush',
    description: 'Page description.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
}

export default function NewPage() {
  return <NewPageClient />
}
Rule 2 — Agar page mein 'use client' nahi hai:

Seedha page.tsx mein upar metadata export kar do — alag file ki zaroorat nahi.

Rule 3 — Naya page banane ke baad:

sitemap.ts mein woh URL add karo:

ts
{
  url: 'https://educrush.in/new-page',
  lastModified: NOW,
  changeFrequency: 'monthly',
  priority: 0.8,
},
Rule 4 — Deploy ke baad:

Search Console → URL Inspection → naya URL daalo → Request Indexing

Bas yeh 4 rules yaad rakho — SEO automatically strong rahega! 🚀

You said: ye
