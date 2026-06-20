// src/types/auth.ts

export type UserProfile = {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  course: string | null          // 'BTech' | 'BCA' | 'Diploma' | 'Class 12' | etc.
  year: string | null            // '1st Year' | '2nd Year' | etc.
  college: string | null
  goals: string[] | null         // ['Placement', 'Higher Studies', 'Govt Job']
  interests: string[] | null     // ['DSA', 'Web Dev', 'ML', etc.]
  streak_count: number
  last_active: string | null
  profile_completed: number      // 0–100
  onboarding_done: boolean
  role: string                   // 'user' | 'admin' | 'ambassador'
  referral_code: string | null
  ambassador_status: string      // 'none' | 'pending' | 'ambassador' | 'rejected'
  created_at: string
}

export type SavedNote = {
  id: string
  user_id: string
  note_link: string
  note_title: string
  note_subject: string | null
  saved_at: string
}

export type CodingProgress = {
  id: string
  user_id: string
  problem_slug: string
  lang: string
  solved_at: string
}