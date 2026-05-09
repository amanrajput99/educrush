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
ts// LANGUAGES array mein add karo
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