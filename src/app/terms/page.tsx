'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const LAST_UPDATED = 'May 2, 2026'

const sections = [
  {
    id: 'acceptance',
    title: 'Acceptance of Terms',
    content: `By accessing or using EduCrush ("the Platform"), you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, you may not access or use our services.\n\nThese terms apply to all visitors, users, and others who access or use the Platform. We reserve the right to update or change these Terms at any time, and such changes will be effective immediately upon posting.`,
  },
  {
    id: 'use',
    title: 'Use of the Platform',
    content: `EduCrush provides free educational resources including notes, projects, tutorials, and study materials for students. By using our Platform, you agree to:\n\n• Use the content solely for personal, non-commercial educational purposes\n• Not reproduce, duplicate, copy, sell, or exploit any portion of the Platform without express written permission\n• Not use the Platform for any unlawful purpose or in violation of any regulations\n• Not attempt to gain unauthorized access to any portion of the Platform or its related systems`,
  },
  {
    id: 'intellectual',
    title: 'Intellectual Property',
    content: `All content on EduCrush — including notes, project code, articles, tutorials, images, graphics, logos, and design — is the property of EduCrush or its content creators and is protected by applicable copyright laws.\n\nYou are granted a limited, non-exclusive, non-transferable license to access and use the content for personal educational purposes only. You may not modify, distribute, or use the content for commercial purposes without prior written consent.`,
  },
  {
    id: 'disclaimer',
    title: 'Disclaimer of Warranties',
    content: `EduCrush provides all content and services on an "as is" and "as available" basis without any warranties of any kind. We do not warrant that the Platform will be uninterrupted, error-free, or completely secure.\n\nThe educational materials provided are intended to supplement formal education and should not be relied upon as the sole source of information for examinations or academic purposes.`,
  },
  {
    id: 'liability',
    title: 'Limitation of Liability',
    content: `To the fullest extent permitted by applicable law, EduCrush and its team members shall not be liable for any indirect, incidental, special, or consequential damages arising from your use or inability to use the Platform.\n\nThis includes unauthorized access to our servers, interruption of services, bugs or viruses transmitted through the Platform, or any errors or omissions in any content.`,
  },
  {
    id: 'advertising',
    title: 'Third-Party Links & Advertising',
    content: `EduCrush may display advertisements through services like Google AdSense and may contain links to third-party websites. These third-party sites have their own privacy policies and terms.\n\nGoogle AdSense may use cookies to serve personalized ads based on your visits. You can opt out of personalized advertising by visiting Google's Ad Settings at g.co/adsettings.`,
  },
  {
    id: 'privacy',
    title: 'Privacy & Data',
    content: `Your use of EduCrush is governed by our Privacy Policy. By using the Platform, you consent to the collection and use of your information as described therein.\n\nWe may collect non-personally identifiable information automatically including browser type, operating system, and pages viewed — solely to improve our services.`,
  },
  {
    id: 'governing',
    title: 'Governing Law',
    content: `These Terms & Conditions shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.\n\nAny disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts located in India.`,
  },
  {
    id: 'contact',
    title: 'Contact Us',
    content: `If you have any questions about these Terms & Conditions, please reach out:\n\n📧  support@educrush.in\n🌐  https://educrush.in\n📍  India\n\nWe aim to respond to all inquiries within 2–3 business days.`,
  },
]

export default function TermsPage() {
  const [activeId, setActiveId] = useState('acceptance')
  const [progress, setProgress] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  // Reading progress
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const total = el.scrollHeight - el.clientHeight
      setProgress(total > 0 ? (el.scrollTop / total) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Active section tracker
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveId(e.target.id) }),
      { rootMargin: '-20% 0px -70% 0px' }
    )
    sections.forEach(s => {
      const el = document.getElementById(s.id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setMobileMenuOpen(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * { font-family: 'Poppins', sans-serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .fade-up { animation: fadeUp 0.55s ease forwards; }
        .fade-in { animation: fadeIn 0.4s ease forwards; }

        .section-card {
          transition: border-color 0.35s ease, background 0.35s ease, box-shadow 0.35s ease;
        }
        .section-card.active {
          border-color: rgba(6,78,59,0.7) !important;
          box-shadow: 0 0 30px rgba(16,185,129,0.06);
        }
        .section-card:hover {
          border-color: rgba(55,65,81,0.8);
        }

        .toc-item {
          transition: all 0.2s ease;
          border-left: 2px solid transparent;
        }
        .toc-item.active {
          background: rgba(13,84,43,0.35);
          color: #86efac;
          border-left-color: #22c55e;
        }
        .toc-item:not(.active):hover {
          background: rgba(255,255,255,0.03);
          color: #cbd5e1;
        }

        .progress-bar {
          transition: width 0.12s linear;
        }

        .mobile-toc {
          animation: fadeUp 0.3s ease forwards;
        }
      `}</style>

      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-black/40">
        <div
          className="progress-bar h-full bg-gradient-to-r from-[#0D542B] via-green-400 to-green-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="bg-black min-h-screen text-white overflow-x-hidden">

        {/* Background glow */}
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-[600px] h-[600px] bg-green-500/15 rounded-full blur-[180px]" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-28 pb-24">

          {/* ── Header ── */}
          <div className="mb-12 fade-up">
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-700/40 to-transparent mb-10" />

            <button className="px-4 h-8 border border-gray-800 text-slate-200 text-xs rounded-lg mb-5">
              Legal
            </button>

            <h1 className="text-[38px] sm:text-[52px] font-medium leading-[1.1] max-w-xl mb-4">
              Terms &{' '}
              <span className="bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">
                Conditions
              </span>
            </h1>

            <p className="text-sm/6 text-slate-400 max-w-md mb-5">
              Please read these terms carefully before using EduCrush. By accessing our platform, you agree to the following conditions.
            </p>

            <div className="flex flex-wrap items-center gap-5 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Updated: <span className="text-slate-300">{LAST_UPDATED}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                ~4 min read
              </span>
              <span className="flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                {sections.length} sections
              </span>
            </div>

            {/* Mobile TOC toggle */}
            <button
              onClick={() => setMobileMenuOpen(v => !v)}
              className="lg:hidden mt-5 flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-800 text-slate-400 text-xs hover:border-gray-700 hover:text-slate-300 transition-all"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
              {mobileMenuOpen ? 'Hide' : 'Show'} Contents
            </button>

            {/* Mobile TOC dropdown */}
            {mobileMenuOpen && (
              <div className="lg:hidden mobile-toc mt-3 rounded-xl border border-gray-800 bg-[#0a0a0a] overflow-hidden">
                <nav className="p-2">
                  {sections.map((s, i) => (
                    <button
                      key={s.id}
                      onClick={() => scrollTo(s.id)}
                      className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] toc-item ${activeId === s.id ? 'active' : ''}`}
                    >
                      <span className="text-[9px] font-mono text-slate-700">{String(i + 1).padStart(2, '0')}</span>
                      {s.title}
                    </button>
                  ))}
                </nav>
              </div>
            )}

            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-700/40 to-transparent mt-8" />
          </div>

          {/* ── AdSense Top slot ── */}
          {/* Uncomment when AdSense approved:
          <div className="mb-8 rounded-xl border border-gray-800 overflow-hidden">
            <p className="text-[9px] text-slate-700 uppercase tracking-widest text-center py-1.5">Advertisement</p>
            <ins className="adsbygoogle block" data-ad-client="ca-pub-XXXXXXXX" data-ad-slot="TOP_SLOT" data-ad-format="auto" data-full-width-responsive="true" />
          </div> */}
         

          {/* ── Two column layout ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-10">

            {/* Desktop sticky TOC */}
            <aside className="hidden lg:block fade-in" style={{ animationDelay: '0.2s', opacity: 0 }}>
              <div className="sticky top-24 rounded-xl border border-gray-800 bg-gradient-to-b from-[#0b0b0b] to-black overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-800/80">
                  <p className="text-[10px] text-slate-600 uppercase tracking-widest font-medium">Contents</p>
                </div>
                <nav className="p-2">
                  {sections.map((s, i) => (
                    <button
                      key={s.id}
                      onClick={() => scrollTo(s.id)}
                      className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] toc-item ${activeId === s.id ? 'active' : ''}`}
                    >
                      <span className={`text-[9px] font-mono shrink-0 ${activeId === s.id ? 'text-green-600' : 'text-slate-700'}`}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {s.title}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Main content */}
            <div className="space-y-3" ref={contentRef}>
              {sections.map((section, idx) => (
                <div
                  key={section.id}
                  id={section.id}
                  style={{ scrollMarginTop: '96px' }}
                  className={`section-card rounded-xl border border-gray-800 overflow-hidden ${activeId === section.id ? 'active' : ''}`}
                  style={{
                    scrollMarginTop: '96px',
                    background: activeId === section.id
                      ? 'linear-gradient(to bottom, #020204, rgba(13,84,43,0.12))'
                      : 'linear-gradient(to bottom, #020204, #080808)',
                    animationDelay: `${idx * 0.05}s`,
                    opacity: 0,
                    animation: `fadeUp 0.5s ease ${idx * 0.05}s forwards`,
                  }}
                >
                  {/* Section header */}
                  <div className={`flex items-center gap-3 px-5 sm:px-6 py-4 border-b transition-colors duration-300 ${
                    activeId === section.id ? 'border-emerald-900/50' : 'border-gray-800/60'
                  }`}>
                    <span className={`shrink-0 text-[11px] font-mono font-semibold px-2 py-0.5 rounded border transition-all duration-300 ${
                      activeId === section.id
                        ? 'text-green-400 border-emerald-800/50 bg-[#0D542B]/25'
                        : 'text-slate-600 border-gray-800 bg-[#0f0f0f]'
                    }`}>
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <h2 className="text-[14px] sm:text-[15px] font-medium text-gray-100">{section.title}</h2>
                  </div>

                  {/* Section body */}
                  <div className="px-5 sm:px-6 py-5 space-y-3">
                    {section.content.split('\n\n').map((para, i) => (
                      <p key={i} className="text-[13px] sm:text-sm leading-[1.85] text-slate-400 whitespace-pre-line">
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              ))}

              {/* ── AdSense Middle slot ── */}
              {/* Uncomment when AdSense approved:
              <div className="rounded-xl border border-gray-800 overflow-hidden my-2">
                <p className="text-[9px] text-slate-700 uppercase tracking-widest text-center py-1.5">Advertisement</p>
                <ins className="adsbygoogle block" data-ad-client="ca-pub-XXXXXXXX" data-ad-slot="MIDDLE_SLOT" data-ad-format="rectangle" />
              </div>
              */}

              {/* Agreement / CTA box */}
              <div
                className="rounded-xl border border-[#0D542B]/50 text-center p-8 sm:p-10 mt-2"
                style={{ background: 'linear-gradient(to bottom, rgba(13,84,43,0.25), black)' }}
              >
                <p className="px-4 py-1.5 rounded-full text-xs border border-[#0D542B] bg-gradient-to-r from-[#A992F2] to-[#DFAB9B] bg-clip-text text-transparent inline-block mb-4">
                  You're all set
                </p>
                <h3 className="text-2xl sm:text-3xl font-medium text-white max-w-sm mx-auto mb-3 leading-snug">
                  By using EduCrush, you{' '}
                  <span className="bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">
                    agree to these terms
                  </span>
                </h3>
                <p className="text-sm text-slate-400 mb-7 max-w-xs mx-auto">
                  Last updated <span className="text-slate-200">{LAST_UPDATED}</span>. Questions? We're happy to help.
                </p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <Link
                    href="/"
                    className="px-8 py-2.5 rounded-full text-sm border border-[#0D542B] bg-gradient-to-r from-[#A992F2] to-[#DFAB9B] bg-clip-text text-transparent active:scale-95 transition-all hover:border-green-700"
                  >
                    Back to Home
                  </Link>
                  <Link
                    href="/contact"
                    className="px-8 py-2.5 rounded-full text-sm border border-gray-700 text-slate-300 hover:border-gray-600 hover:text-white active:scale-95 transition-all"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>

              {/* Also see cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {[
                  { label: 'Privacy Policy', desc: 'How we handle your data', href: '/privacy-policy', emoji: '🔒' },
                  { label: 'Contact Us', desc: 'Get in touch with our team', href: '/contact', emoji: '✉️' },
                ].map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center gap-4 p-5 rounded-xl border border-gray-800 hover:border-emerald-900/60 transition-all duration-300"
                    style={{ background: 'linear-gradient(to bottom, #020204, #080808)' }}
                  >
                    <span className="text-xl">{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-200 group-hover:text-green-300 transition-colors duration-200">{item.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                    <svg className="text-slate-700 group-hover:text-green-600 transition-colors duration-200 shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </Link>
                ))}
              </div>

              {/* ── AdSense Bottom slot ── */}
              {/* Uncomment when AdSense approved:
              <div className="rounded-xl border border-gray-800 overflow-hidden mt-2">
                <p className="text-[9px] text-slate-700 uppercase tracking-widest text-center py-1.5">Advertisement</p>
                <ins className="adsbygoogle block" data-ad-client="ca-pub-XXXXXXXX" data-ad-slot="BOTTOM_SLOT" data-ad-format="auto" data-full-width-responsive="true" />
              </div>
              */}

              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-700/40 to-transparent mt-4" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}