'use client'
// src/components/auth/SaveNoteButton.tsx
// Har note card mein yeh button lagao — logged in hai toh save, nahi toh login prompt

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { toggleSaveNote } from '@/lib/auth'

interface Props {
  noteLink: string
  noteTitle: string
  noteSubject?: string
  size?: 'sm' | 'md'
}

export default function SaveNoteButton({ noteLink, noteTitle, noteSubject, size = 'md' }: Props) {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setUserId(user.id)

      // Already saved check karo
      const { data } = await supabase
        .from('saved_notes')
        .select('id')
        .eq('user_id', user.id)
        .eq('note_link', noteLink)
        .single()

      if (data) setSaved(true)
    }
    init()
  }, [noteLink])

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Not logged in — login pe bhejo
    if (!userId) {
      router.push('/login')
      return
    }

    setLoading(true)
    const isSaved = await toggleSaveNote(userId, {
      link: noteLink,
      title: noteTitle,
      subject: noteSubject,
    })
    setSaved(isSaved)

    if (isSaved) {
      setPulse(true)
      setTimeout(() => setPulse(false), 600)
    }

    setLoading(false)
  }

  const isSmall = size === 'sm'

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      title={saved ? 'Saved hai — click karke hatao' : userId ? 'Save karo' : 'Login karke save karo'}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 5,
        width: isSmall ? 32 : 36,
        height: isSmall ? 32 : 36,
        borderRadius: 8,
        background: saved
          ? 'rgba(52,211,153,0.1)'
          : 'rgba(255,255,255,0.04)',
        border: `1px solid ${saved ? 'rgba(52,211,153,0.3)' : 'rgba(255,255,255,0.1)'}`,
        cursor: 'pointer',
        transition: 'all 0.2s',
        transform: pulse ? 'scale(1.25)' : 'scale(1)',
        flexShrink: 0,
      }}
    >
      {loading ? (
        <div style={{
          width: 12, height: 12,
          border: '1.5px solid rgba(255,255,255,0.2)',
          borderTopColor: '#34d399', borderRadius: '50%',
          animation: 'spin 0.6s linear infinite',
        }} />
      ) : (
        <svg
          width={isSmall ? 13 : 15}
          height={isSmall ? 13 : 15}
          viewBox="0 0 24 24"
          fill={saved ? '#34d399' : 'none'}
          stroke={saved ? '#34d399' : 'rgba(255,255,255,0.5)'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </button>
  )
}
