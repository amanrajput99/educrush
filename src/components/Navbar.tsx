'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'

type NoteResult = { title: string; subject: string; link: string; course?: string; year?: string }
type ProjectResult = { name: string; slug: string; tags?: string[] }
type SearchResults = { notes: NoteResult[]; projects: ProjectResult[] }

// ── Search Dropdown ───────────────────────────────────────────────────────────
function SearchDropdown({ query, results, loading, onClose }: {
  query: string; results: SearchResults | null; loading: boolean; onClose: () => void
}) {
  if (!query.trim()) return null
  const total = (results?.notes?.length ?? 0) + (results?.projects?.length ?? 0)

  return (
    <div className="absolute top-full left-0 mt-2 w-full bg-white border border-zinc-200 rounded-2xl shadow-xl z-50 overflow-hidden">
      {loading ? (
        <div className="flex items-center justify-center gap-2 px-4 py-5 text-sm text-zinc-400">
          <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round"/>
          </svg>
          Searching...
        </div>
      ) : total === 0 ? (
        <div className="px-4 py-6 text-center text-sm text-zinc-400">No results for &quot;{query}&quot;</div>
      ) : (
        <div className="py-2">
          {results!.notes.length > 0 && (
            <>
              <p className="px-4 pt-2 pb-1 text-xs font-bold text-zinc-400 uppercase tracking-wider">Notes</p>
              {results!.notes.map((note, i) => (
                <Link key={i} href={note.link} onClick={onClose} className="flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-50 transition-colors">
                  <div className="size-8 rounded-lg bg-zinc-100 flex items-center justify-center flex-shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-zinc-800 truncate">{note.title}</p>
                    <p className="text-xs text-zinc-400 truncate">{note.subject}{note.course ? ` · ${note.course}` : ''}{note.year ? ` · ${note.year}` : ''}</p>
                  </div>
                </Link>
              ))}
            </>
          )}
          {results!.projects.length > 0 && (
            <>
              <p className="px-4 pt-3 pb-1 text-xs font-bold text-zinc-400 uppercase tracking-wider">Projects</p>
              {results!.projects.map((project, i) => (
                <Link key={i} href={`/projects/${project.slug}`} onClick={onClose} className="flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-50 transition-colors">
                  <div className="size-8 rounded-lg bg-zinc-100 flex items-center justify-center flex-shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-zinc-800 truncate">{project.name}</p>
                    <p className="text-xs text-zinc-400 truncate">{project.tags?.slice(0, 3).join(' · ')}</p>
                  </div>
                </Link>
              ))}
            </>
          )}
          <div className="border-t border-zinc-100 mt-2">
            <Link href={`/notes?q=${encodeURIComponent(query)}`} onClick={onClose} className="flex items-center justify-center gap-2 px-4 py-3 text-sm text-zinc-500 hover:text-zinc-800 font-medium hover:bg-zinc-50 transition-colors">
              View all results for &quot;{query}&quot;
              <svg width="12" height="10" viewBox="0 0 12 10" fill="none"><path d="M.6 4.602h10m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

// ── useSearch hook — debounce + real API call ─────────────────────────────────
function useSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResults | null>(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const search = useCallback((q: string) => {
    setQuery(q)
    setOpen(true)
    if (timer.current) clearTimeout(timer.current)
    if (!q.trim() || q.trim().length < 2) { setResults(null); setLoading(false); return }
    setLoading(true)
    timer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`)
        setResults(await res.json())
      } catch { setResults({ notes: [], projects: [] }) }
      finally { setLoading(false) }
    }, 300)
  }, [])

  const close = useCallback(() => { setOpen(false); setQuery(''); setResults(null) }, [])

  return { query, results, loading, open, setOpen, search, close }
}

// ── Navbar ────────────────────────────────────────────────────────────────────
const Navbar = () => {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [dropdownOpen1, setDropdownOpen1] = useState(false)
  const [dropdownOpen2, setDropdownOpen2] = useState(false)
  const desktop = useSearch()
  const mobile = useSearch()
  const desktopRef = useRef<HTMLDivElement>(null)
  const mobileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (desktopRef.current && !desktopRef.current.contains(e.target as Node)) desktop.setOpen(false)
      if (mobileRef.current && !mobileRef.current.contains(e.target as Node)) mobile.setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [desktop, mobile])

  const submit = (q: string, closeFn: () => void) => (e: React.FormEvent) => {
    e.preventDefault()
    if (q.trim()) { window.location.href = `/notes?q=${encodeURIComponent(q.trim())}`; closeFn(); setMenuOpen(false) }
  }

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap'); *{font-family:"Geist",sans-serif;}`}</style>
      <nav className="bg-white px-6 md:px-16 lg:px-24 xl:px-32 py-4 flex items-center justify-between relative">
        <div className="flex items-center gap-20">
          <a href="https://educrush.in"><span className="text-3xl font-bold text-zinc-900">EduCrush</span></a>
          <div className="hidden md:flex items-center gap-8">
            <a href="/notes" className="text-sm text-zinc-500 hover:text-zinc-800 font-bold">Notes</a>
            <a href="/projects" className="text-sm text-zinc-500 hover:text-zinc-800 font-bold">Projects</a>
            <a href="/ai" className="text-sm text-zinc-500 hover:text-zinc-800 font-bold">EduCrush Ai</a>
            <div className="relative group">
              <button className="flex items-center gap-1.5 text-sm text-zinc-800 cursor-pointer bg-transparent border-0 py-2 font-bold">All Tools<svg className="transition-transform group-hover:rotate-180" width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="m1 1 4 4 4-4" stroke="#71717b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
              <div className="absolute top-full left-0 mt-1 w-44 bg-white border border-zinc-200 rounded-xl shadow-lg py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <a href="/editor" className="block px-4 py-2 font-bold text-sm text-zinc-600 hover:bg-zinc-50">Code Editor</a>
                <a href="/coding-practice" className="block px-4 py-2 font-bold text-sm text-zinc-600 hover:bg-zinc-50">Coding Practice</a>
              </div>
            </div>
            <div className="relative group">
              <button className="flex items-center gap-1.5 text-sm text-zinc-800 cursor-pointer bg-transparent border-0 py-2 font-bold">All Pages<svg className="transition-transform group-hover:rotate-180" width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="m1 1 4 4 4-4" stroke="#71717b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-zinc-200 rounded-xl shadow-lg py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <a href="/careers" className="block px-4 py-2 font-bold text-sm text-zinc-600 hover:bg-zinc-50">Careers</a>
                <a href="/about" className="block px-4 py-2 font-bold text-sm text-zinc-600 hover:bg-zinc-50">About</a>
                <a href="/contact" className="block px-4 py-2 font-bold text-sm text-zinc-600 hover:bg-zinc-50">Contact</a>
                <a href="/terms" className="block px-4 py-2 font-bold text-sm text-zinc-600 hover:bg-zinc-50">Terms & Conditions</a>
                <a href="/privacy-policy" className="block px-4 py-2 font-bold text-sm text-zinc-600 hover:bg-zinc-50">Privacy Policy</a>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop search */}
        <div className="hidden md:flex items-center gap-3">
          <div ref={desktopRef} className="relative w-full max-w-[22rem] lg:max-w-[26rem]">
            <form onSubmit={submit(desktop.query, desktop.close)}>
              <input type="search" placeholder="Search notes, projects..." value={desktop.query}
                onChange={e => desktop.search(e.target.value)}
                onFocus={() => desktop.query.trim() && desktop.setOpen(true)}
                className="w-full h-11 rounded-full border border-zinc-200 bg-zinc-50 px-4 pr-28 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
              />
              <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-zinc-950 text-zinc-50 px-4 py-2 text-sm font-medium hover:bg-zinc-800">Search</button>
            </form>
            {desktop.open && desktop.query.trim() && (
              <SearchDropdown query={desktop.query} results={desktop.results} loading={desktop.loading} onClose={desktop.close}/>
            )}
          </div>
          <Link href="/notes" className="hidden md:flex items-center gap-2.5 bg-linear-to-r from-zinc-950 to-zinc-500 text-zinc-50 hover:text-zinc-200 text-sm font-medium pl-5 pr-2 py-2 rounded-full cursor-pointer border-0">
            Get All Resources
            <span className="size-7 rounded-full bg-white flex items-center justify-center">
              <svg width="12" height="10" viewBox="0 0 12 10" fill="none"><path d="M.6 4.602h10m-4-4 4 4-4 4" stroke="#3f3f47" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button type="button" aria-label="Toggle mobile menu" onClick={(e) => { e.stopPropagation(); setMenuOpen(o => !o) }} className="md:hidden z-50 flex flex-col gap-1.5 cursor-pointer bg-transparent border-0 p-1">
          <span className={`block w-6 h-0.5 bg-zinc-800 transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-zinc-800 transition-opacity ${menuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-zinc-800 transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-t border-zinc-200 flex flex-col p-5 gap-3 md:hidden z-50">
            <div ref={mobileRef} className="relative w-full">
              <form onSubmit={submit(mobile.query, mobile.close)}>
                <input type="search" placeholder="Search notes, projects..." value={mobile.query}
                  onChange={e => mobile.search(e.target.value)}
                  onFocus={() => mobile.query.trim() && mobile.setOpen(true)}
                  className="w-full h-11 rounded-full border border-zinc-200 bg-zinc-50 px-4 pr-24 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-zinc-950 text-zinc-50 px-4 py-2 text-sm font-medium hover:bg-zinc-800">Search</button>
              </form>
              {mobile.open && mobile.query.trim() && (
                <SearchDropdown query={mobile.query} results={mobile.results} loading={mobile.loading} onClose={() => { mobile.close(); setMenuOpen(false) }}/>
              )}
            </div>
            <a href="/notes" className="px-4 font-bold py-2.5 rounded-lg text-sm text-zinc-500 hover:bg-zinc-50">Notes</a>
            <a href="/projects" className="px-4 font-bold py-2.5 rounded-lg text-sm text-zinc-500 hover:bg-zinc-50">Projects</a>
            <a href="/ai" className="px-4 font-bold py-2.5 rounded-lg text-sm text-zinc-500 hover:bg-zinc-50">EduCrush Ai</a>
            <button onClick={() => setDropdownOpen1(!dropdownOpen1)} className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-sm text-zinc-800 hover:bg-zinc-50 bg-transparent border-0 cursor-pointer font-bold">
              All Tools<svg className={`transition-transform ${dropdownOpen1 ? 'rotate-180' : ''}`} width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="m1 1 4 4 4-4" stroke="#71717b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            {dropdownOpen1 && (
              <div className="flex flex-col pl-4">
                <a href="/editor" className="block px-4 py-2 font-bold text-sm text-zinc-600 hover:bg-zinc-50">Code Editor</a>
                <a href="/coding-practice" className="block px-4 py-2 font-bold text-sm text-zinc-500 hover:bg-zinc-50">Coding Practice</a>
              </div>
            )}
            <button onClick={() => setDropdownOpen2(!dropdownOpen2)} className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-sm text-zinc-800 hover:bg-zinc-50 bg-transparent border-0 cursor-pointer font-bold">
              All Pages<svg className={`transition-transform ${dropdownOpen2 ? 'rotate-180' : ''}`} width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="m1 1 4 4 4-4" stroke="#71717b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            {dropdownOpen2 && (
              <div className="flex flex-col pl-4">
                <a href="/careers" className="block px-4 py-2 font-bold text-sm text-zinc-500 hover:bg-zinc-50">Careers</a>
                <a href="/about" className="block px-4 py-2 font-bold text-sm text-zinc-500 hover:bg-zinc-50">About</a>
                <a href="/contact" className="block px-4 py-2 font-bold text-sm text-zinc-500 hover:bg-zinc-50">Contact</a>
                <a href="/terms" className="block px-4 py-2 font-bold text-sm text-zinc-500 hover:bg-zinc-50">Terms & Conditions</a>
                <a href="/privacy-policy" className="block px-4 py-2 font-bold text-sm text-zinc-500 hover:bg-zinc-50">Privacy Policy</a>
              </div>
            )}
            <Link href="/notes" className="flex items-center justify-center gap-2.5 bg-linear-to-r from-zinc-950 to-zinc-500 text-zinc-50 text-sm font-medium px-5 py-2.5 rounded-full cursor-pointer border-0 mt-3 w-fit">
              Get All Resources<span className="size-7 rounded-full bg-white flex items-center justify-center"><svg width="12" height="10" viewBox="0 0 12 10" fill="none"><path d="M.6 4.602h10m-4-4 4 4-4 4" stroke="#3f3f47" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
            </Link>
          </div>
        )}
      </nav>
    </>
  )
}

export default Navbar