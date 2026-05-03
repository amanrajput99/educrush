// src/data/codingPractice.ts

export type Difficulty = 'easy' | 'medium' | 'hard'

export type CodingLanguage = {
  id?: number
  slug: string           // 'c' | 'cpp' | 'python' | 'javascript'
  name: string           // 'C' | 'C++' | 'Python' | 'JavaScript'
  icon: string
  color: string          // accent hex color
  description: string
  total_problems: number
  published: boolean
  order_index: number
}

export type ProblemExample = {
  input: string
  output: string
  explanation?: string
}

export type CodingProblem = {
  id?: number
  slug: string
  title: string
  language_slug: string
  difficulty: Difficulty
  topic: string
  description: string
  examples: ProblemExample[]
  constraints: string[]
  hints: string[]
  starter_code: string
  solution_code: string
  solution_explanation: string
  tags: string[]
  views: number
  submissions: number
  published: boolean
  order_index: number
  created_at?: string
  updated_at?: string
}

// ── Language configs ──────────────────────────────────────────────────────────
export const LANGUAGE_CONFIG: Record<string, {
  monacoLang: string    // Monaco editor language ID
  runUrl?: string       // Judge0 language ID (for future)
  defaultCode: string
}> = {
  c: {
    monacoLang: 'c',
    defaultCode: '#include <stdio.h>\n\nint main() {\n    // Write your code here\n    \n    return 0;\n}',
  },
  cpp: {
    monacoLang: 'cpp',
    defaultCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    \n    return 0;\n}',
  },
  python: {
    monacoLang: 'python',
    defaultCode: '# Write your code here\n',
  },
  javascript: {
    monacoLang: 'javascript',
    defaultCode: '// Write your code here\n',
  },
}

export const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; color: string; bg: string; border: string }> = {
  easy:   { label: 'Easy',   color: '#4ade80', bg: '#052e16', border: '#166534' },
  medium: { label: 'Medium', color: '#fbbf24', bg: '#1c1000', border: '#92400e' },
  hard:   { label: 'Hard',   color: '#f87171', bg: '#1c0000', border: '#991b1b' },
}

export const TOPICS = [
  'Basics', 'Input/Output', 'Variables', 'Operators',
  'Loops', 'Conditions', 'Functions', 'Arrays',
  'Strings', 'Pointers', 'Recursion', 'OOP',
  'Sorting', 'Searching', 'Math', 'Patterns',
]