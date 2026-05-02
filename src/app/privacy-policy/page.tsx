'use client'

import { useState, useEffect } from 'react'

const sections = [
  {
    id: "information-we-collect",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    title: "Information We Collect",
    content: [
      { subtitle: "Personal Information", text: "When you register or interact with EduCrush, we may collect your name, email address, and other contact details you voluntarily provide." },
      { subtitle: "Usage Data", text: "We automatically collect information about how you use our platform — including pages visited, time spent, notes accessed, projects viewed, and device/browser details." },
      { subtitle: "Cookies & Tracking", text: "We use cookies and similar tracking technologies to improve your experience, remember your preferences, and serve relevant content. This includes third-party cookies from services like Google AdSense." }
    ]
  },
  {
    id: "how-we-use",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
      </svg>
    ),
    title: "How We Use Your Information",
    content: [
      { subtitle: "Platform Improvement", text: "We use collected data to understand user behavior, fix bugs, improve content quality, and enhance the overall EduCrush experience for students." },
      { subtitle: "Personalization", text: "Your usage patterns help us recommend relevant notes, projects, and learning resources tailored to your interests and academic level." },
      { subtitle: "Communications", text: "We may use your email to send important platform updates, new resource announcements, and educational newsletters (you can opt out anytime)." },
      { subtitle: "Advertising (Google AdSense)", text: "EduCrush uses Google AdSense to display advertisements. Google may use cookies to show personalized ads based on your browsing history. We do not control what data Google collects for this purpose." }
    ]
  },
  {
    id: "google-adsense",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="14" x="2" y="5" rx="2" /><path d="M2 10h20" />
      </svg>
    ),
    title: "Google AdSense & Third-Party Ads",
    content: [
      { subtitle: "How AdSense Works", text: "EduCrush is a free platform supported by advertising revenue. We partner with Google AdSense to display ads that help us keep all resources free for students." },
      { subtitle: "Personalized Advertising", text: "Google AdSense may use the DoubleClick cookie to serve ads based on your prior visits to EduCrush and other websites. You can opt out at adssettings.google.com." },
      { subtitle: "Third-Party Privacy", text: "Third-party ad vendors, including Google, use cookies to serve ads based on a user's prior visits to our website. These vendors' use of cookies is subject to their own privacy policies." },
      { subtitle: "GDPR / CCPA Compliance", text: "We comply with applicable data protection regulations. For EU/EEA users, we obtain consent before enabling personalized ads. California residents have additional rights under CCPA." }
    ]
  },
  {
    id: "data-sharing",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" x2="12" y1="2" y2="15" />
      </svg>
    ),
    title: "Data Sharing & Disclosure",
    content: [
      { subtitle: "We Do Not Sell Your Data", text: "EduCrush does not sell, trade, or rent your personal information to third parties for their marketing purposes. Period." },
      { subtitle: "Service Providers", text: "We may share your information with trusted service providers (like Supabase for database, Google Analytics for insights) who assist in operating our platform under strict confidentiality agreements." },
      { subtitle: "Legal Requirements", text: "We may disclose your information if required by law, court order, or governmental authority, or to protect the rights and safety of EduCrush and its users." }
    ]
  },
  {
    id: "data-security",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    title: "Data Security",
    content: [
      { subtitle: "Security Measures", text: "We implement industry-standard security measures including SSL/TLS encryption, secure database practices via Supabase, and regular security audits to protect your data." },
      { subtitle: "Data Retention", text: "We retain your personal information only as long as necessary to provide our services or as required by law. You may request deletion of your account and data at any time." },
      { subtitle: "No Absolute Guarantee", text: "While we strive to protect your information, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security of your data." }
    ]
  },
  {
    id: "your-rights",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Your Rights & Choices",
    content: [
      { subtitle: "Access & Correction", text: "You have the right to access, update, or correct your personal information at any time through your account settings or by contacting us directly." },
      { subtitle: "Opt-Out of Personalized Ads", text: "You can opt out of personalized advertising through Google's Ad Settings, the NAI opt-out tool, or by enabling 'Do Not Track' in your browser settings." },
      { subtitle: "Cookie Preferences", text: "You can control cookies through your browser settings. Note that disabling cookies may affect certain features of EduCrush including ad personalization." },
      { subtitle: "Account Deletion", text: "You may request complete deletion of your account and personal data by emailing us at privacy@educrush.in. We will process your request within 30 days." }
    ]
  },
  {
    id: "childrens-privacy",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      </svg>
    ),
    title: "Children's Privacy",
    content: [
      { subtitle: "Age Requirement", text: "EduCrush is designed for students and is generally suitable for users of all ages. However, users under 13 should use the platform with parental guidance." },
      { subtitle: "COPPA Compliance", text: "We do not knowingly collect personal information from children under 13 without parental consent. If we discover we have collected such information, we will delete it promptly." },
      { subtitle: "Parental Controls", text: "Parents or guardians who believe their child has provided personal information on EduCrush should contact us at privacy@educrush.in for immediate action." }
    ]
  },
  {
    id: "policy-changes",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" />
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" />
      </svg>
    ),
    title: "Changes to This Policy",
    content: [
      { subtitle: "Policy Updates", text: "We may update this Privacy Policy from time to time to reflect changes in our practices, services, or legal requirements. We will notify users of significant changes via email or a prominent notice on our platform." },
      { subtitle: "Continued Use", text: "Your continued use of EduCrush after any policy changes constitutes your acceptance of the updated Privacy Policy. We encourage you to review this page periodically." }
    ]
  }
]

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [tocOpen, setTocOpen] = useState(false)

  useEffect(() => {
    const close = () => setTocOpen(false)
    if (tocOpen) document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [tocOpen])

  const jump = (id: string) => {
    setActiveSection(id)
    setTocOpen(false)
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 60)
  }

  return (
    <>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap");

        *, *::before, *::after {
          font-family: "Poppins", sans-serif;
          box-sizing: border-box;
          margin: 0; padding: 0;
        }

        /* ═══════════════ HERO ═══════════════ */
        .pp-hero {
          background: #000;
          position: relative;
          overflow: hidden;
          padding: 90px 16px 60px;
          text-align: center;
        }
        @media (min-width: 480px)  { .pp-hero { padding: 105px 20px 70px; } }
        @media (min-width: 768px)  { .pp-hero { padding: 120px 32px 80px; } }
        @media (min-width: 1024px) { .pp-hero { padding: 140px 48px 90px; } }

        /* Moving grid */
        .pp-hero::before {
          content: '';
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(13,84,43,0.13) 1px, transparent 1px),
            linear-gradient(90deg, rgba(13,84,43,0.13) 1px, transparent 1px);
          background-size: 36px 36px;
          animation: gridMove 18s linear infinite;
          pointer-events: none;
        }
        @media (min-width: 768px) { .pp-hero::before { background-size: 48px 48px; } }
        @keyframes gridMove {
          from { transform: translateY(0); }
          to   { transform: translateY(36px); }
        }

        /* Gradient overlay */
        .pp-hero::after {
          content: '';
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 80% 55% at 50% 0%, rgba(13,84,43,0.22) 0%, transparent 65%),
            linear-gradient(to bottom, transparent 25%, #000 100%);
          pointer-events: none;
        }

        /* Orbs */
        .pp-orb {
          position: absolute; border-radius: 50%;
          filter: blur(65px); pointer-events: none;
          animation: orbFloat 9s ease-in-out infinite;
        }
        .pp-orb-1 {
          width: 200px; height: 200px; top: -70px; left: -50px;
          background: radial-gradient(circle, rgba(13,84,43,0.4), transparent 70%);
          animation-delay: 0s;
        }
        .pp-orb-2 {
          width: 160px; height: 160px; top: -30px; right: -30px;
          background: radial-gradient(circle, rgba(0,0,200,0.2), transparent 70%);
          animation-delay: -3s;
        }
        .pp-orb-3 {
          width: 130px; height: 130px; bottom: 0; left: 44%;
          background: radial-gradient(circle, rgba(128,0,128,0.22), transparent 70%);
          animation-delay: -5.5s;
        }
        @media (min-width: 768px) {
          .pp-orb-1 { width: 340px; height: 340px; }
          .pp-orb-2 { width: 260px; height: 260px; }
          .pp-orb-3 { width: 200px; height: 200px; }
        }
        @keyframes orbFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50%       { transform: translateY(-20px) scale(1.06); }
        }

        /* Scan line */
        .pp-scan {
          position: absolute; left: 0; right: 0; height: 2px; z-index: 1;
          background: linear-gradient(to right, transparent, rgba(13,84,43,0.6), transparent);
          animation: scanDown 5s linear infinite; pointer-events: none;
        }
        @keyframes scanDown {
          0%   { top: 0%;   opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }

        /* Particles */
        .pp-particle {
          position: absolute; width: 2px; height: 2px; border-radius: 50%;
          background: #4ade80; pointer-events: none;
          animation: particleRise linear infinite;
        }
        @keyframes particleRise {
          0%   { transform: translateY(50px); opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 0.4; }
          100% { transform: translateY(-160px); opacity: 0; }
        }

        /* Shield */
        .pp-shield-wrap {
          position: relative; display: inline-flex;
          align-items: center; justify-content: center;
          margin-bottom: 20px;
        }
        .pp-shield-core {
          width: 58px; height: 58px; border-radius: 50%; position: relative; z-index: 1;
          background: linear-gradient(135deg, rgba(13,84,43,0.55), rgba(13,84,43,0.22));
          border: 1px solid rgba(13,84,43,0.65);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 32px rgba(13,84,43,0.45), inset 0 1px 0 rgba(255,255,255,0.1);
        }
        @media (min-width: 640px) { .pp-shield-core { width: 68px; height: 68px; } }
        .pp-ring-o {
          position: absolute; width: 96px; height: 96px; border-radius: 50%;
          border: 1px solid rgba(13,84,43,0.3);
          animation: ringPulse 3.2s ease-in-out infinite;
        }
        .pp-ring-i {
          position: absolute; width: 76px; height: 76px; border-radius: 50%;
          border: 1px solid rgba(13,84,43,0.5);
          animation: ringPulse 3.2s ease-in-out infinite; animation-delay: -1.6s;
        }
        @media (min-width: 640px) {
          .pp-ring-o { width: 112px; height: 112px; }
          .pp-ring-i { width: 90px; height: 90px; }
        }
        @keyframes ringPulse {
          0%, 100% { opacity: 0.25; transform: scale(1); }
          50%       { opacity: 0.6; transform: scale(1.1); }
        }

        /* Hero badge */
        .pp-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 5px 12px; border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.12);
          background: linear-gradient(to right, rgba(0,0,255,0.1), rgba(128,0,128,0.08));
          color: rgba(255,255,255,0.8);
          font-size: 10px; font-weight: 600; letter-spacing: 0.13em; text-transform: uppercase;
          position: relative; z-index: 2; margin-bottom: 14px;
        }
        @media (min-width: 640px) { .pp-badge { font-size: 11px; padding: 5px 14px; } }

        /* Hero title */
        .pp-hero-title {
          font-size: clamp(1.9rem, 7vw, 3.8rem);
          font-weight: 700; line-height: 1.1; letter-spacing: -0.02em;
          margin-bottom: 14px; position: relative; z-index: 2;
        }
        .pp-grad-text {
          background: linear-gradient(135deg, #4ade80, #0D542B);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Hero sub */
        .pp-hero-sub {
          color: rgba(255,255,255,0.52);
          font-size: 13px; line-height: 1.75;
          max-width: 440px; margin: 0 auto 24px;
          position: relative; z-index: 2;
        }
        @media (min-width: 640px) { .pp-hero-sub { font-size: 15px; max-width: 480px; } }

        /* Stats bar */
        .pp-stats-bar {
          display: inline-flex; align-items: center; flex-wrap: wrap; justify-content: center;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px; overflow: hidden; position: relative; z-index: 2;
        }
        .pp-stat {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 12px; font-size: 10px; color: rgba(255,255,255,0.42);
          border-right: 1px solid rgba(255,255,255,0.07);
        }
        .pp-stat:last-child { border-right: none; }
        @media (min-width: 480px) { .pp-stat { font-size: 11px; padding: 9px 14px; } }
        @media (max-width: 400px) {
          .pp-stats-bar { flex-direction: column; }
          .pp-stat { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.07); width: 100%; justify-content: center; }
          .pp-stat:last-child { border-bottom: none; }
        }

        /* ═══════════════ DIVIDER ═══════════════ */
        .pp-divider {
          width: 100%; height: 1px;
          background: linear-gradient(to right, transparent, rgba(13,84,43,0.45), transparent);
        }

        /* ═══════════════ LAYOUT ═══════════════ */
        .pp-layout {
          max-width: 1180px; margin: 0 auto;
          padding: 28px 16px 64px;
          display: flex; gap: 24px; align-items: flex-start;
        }
        @media (min-width: 640px)  { .pp-layout { padding: 36px 24px 72px; gap: 28px; } }
        @media (min-width: 1024px) { .pp-layout { padding: 48px 40px 96px; gap: 36px; } }

        /* ═══════════════ SIDEBAR (desktop only) ═══════════════ */
        .pp-sidebar {
          width: 210px; flex-shrink: 0;
          position: sticky; top: 20px;
          display: none;
        }
        @media (min-width: 1024px) { .pp-sidebar { display: block; } }

        .pp-toc-box {
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px; background: rgba(255,255,255,0.02); padding: 12px 10px;
        }
        .pp-toc-label {
          font-size: 9px; font-weight: 700; color: rgba(255,255,255,0.26);
          letter-spacing: 0.12em; text-transform: uppercase;
          padding: 0 8px; margin-bottom: 8px; display: block;
        }
        .pp-toc-link {
          display: flex; align-items: center; gap: 7px;
          padding: 6px 8px; border-radius: 7px;
          color: rgba(255,255,255,0.48); font-size: 11.5px;
          transition: all 0.18s; cursor: pointer; user-select: none;
        }
        .pp-toc-link::before {
          content: ''; width: 4px; height: 4px; border-radius: 50%;
          background: currentColor; flex-shrink: 0;
        }
        .pp-toc-link:hover { background: rgba(13,84,43,0.18); color: #4ade80; }
        .pp-toc-link.active { background: rgba(13,84,43,0.22); color: #4ade80; }
        .pp-toc-contact {
          margin-top: 12px; border: 1px solid rgba(13,84,43,0.28);
          border-radius: 10px; background: rgba(13,84,43,0.07); padding: 12px;
        }

        /* ═══════════════ MOBILE TOC ═══════════════ */
        .pp-mobile-toc { display: block; margin-bottom: 18px; }
        @media (min-width: 1024px) { .pp-mobile-toc { display: none; } }

        .pp-mobile-toc-btn {
          width: 100%; display: flex; align-items: center; justify-content: space-between;
          padding: 11px 14px; border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.03);
          color: rgba(255,255,255,0.75); font-size: 13px; font-weight: 500;
          cursor: pointer;
        }
        .pp-mobile-toc-dropdown {
          margin-top: 5px; border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px; background: #0a0a0a; overflow: hidden;
        }
        .pp-mobile-toc-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 14px; font-size: 12px;
          color: rgba(255,255,255,0.6);
          cursor: pointer; border-bottom: 1px solid rgba(255,255,255,0.05);
          transition: background 0.15s;
        }
        .pp-mobile-toc-item:last-child { border-bottom: none; }
        .pp-mobile-toc-item:active { background: rgba(13,84,43,0.2); }

        /* ═══════════════ CONTENT ═══════════════ */
        .pp-content { flex: 1; min-width: 0; }

        /* Intro box */
        .pp-intro {
          border: 1px solid rgba(13,84,43,0.28);
          border-radius: 12px; background: rgba(13,84,43,0.09);
          padding: 14px 16px; margin-bottom: 20px;
          display: flex; gap: 10px; align-items: flex-start;
        }
        @media (min-width: 640px) { .pp-intro { padding: 18px 22px; margin-bottom: 24px; gap: 12px; } }
        .pp-intro-icon {
          background: rgba(13,84,43,0.3); border-radius: 8px; padding: 7px; flex-shrink: 0;
        }

        /* ═══════════════ ACCORDION CARD ═══════════════ */
        .pp-card {
          border: 1px solid rgba(255,255,255,0.08); border-radius: 12px;
          background: linear-gradient(135deg, rgba(5,5,8,0.95), rgba(13,84,43,0.1));
          transition: border-color 0.22s, transform 0.22s;
          cursor: pointer; overflow: hidden; margin-bottom: 10px;
        }
        .pp-card:hover  { border-color: rgba(13,84,43,0.42); transform: translateY(-1px); }
        .pp-card:active { transform: translateY(0); }
        .pp-card.active { border-color: rgba(13,84,43,0.62); background: linear-gradient(135deg, rgba(5,5,8,0.98), rgba(13,84,43,0.18)); }

        .pp-card-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 13px 14px; gap: 8px;
          -webkit-tap-highlight-color: transparent;
        }
        @media (min-width: 480px) { .pp-card-header { padding: 14px 16px; } }
        @media (min-width: 640px) { .pp-card-header { padding: 16px 20px; gap: 12px; } }

        .pp-card-left {
          display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0;
        }
        @media (min-width: 480px) { .pp-card-left { gap: 10px; } }
        @media (min-width: 640px) { .pp-card-left { gap: 12px; } }

        .pp-num {
          width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0;
          background: rgba(13,84,43,0.25); border: 1px solid rgba(13,84,43,0.4);
          display: flex; align-items: center; justify-content: center;
          font-size: 9px; font-weight: 700; color: #4ade80;
        }
        @media (min-width: 640px) { .pp-num { width: 27px; height: 27px; font-size: 10px; } }

        .pp-icon-wrap {
          width: 34px; height: 34px; border-radius: 8px; flex-shrink: 0;
          background: linear-gradient(135deg, rgba(13,84,43,0.28), rgba(13,84,43,0.1));
          border: 1px solid rgba(13,84,43,0.28);
          display: flex; align-items: center; justify-content: center; color: #4ade80;
        }
        @media (min-width: 640px) { .pp-icon-wrap { width: 40px; height: 40px; border-radius: 10px; } }

        .pp-card-title {
          font-weight: 600; color: #fff; font-size: 12px; line-height: 1.3; flex: 1; min-width: 0;
        }
        @media (min-width: 480px) { .pp-card-title { font-size: 13px; } }
        @media (min-width: 640px) { .pp-card-title { font-size: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } }

        .pp-chevron {
          transition: transform 0.28s; color: rgba(255,255,255,0.32); flex-shrink: 0;
        }
        .pp-chevron.open { transform: rotate(180deg); }

        /* Body */
        .pp-card-body {
          max-height: 0; overflow: hidden;
          transition: max-height 0.38s ease, opacity 0.28s ease; opacity: 0;
        }
        .pp-card-body.open { max-height: 2600px; opacity: 1; }

        .pp-sub-item {
          border-top: 1px solid rgba(255,255,255,0.05);
          padding: 12px 14px;
        }
        @media (min-width: 480px) { .pp-sub-item { padding: 12px 16px; } }
        @media (min-width: 640px) { .pp-sub-item { padding: 14px 20px; } }

        .pp-sub-title {
          font-weight: 600; font-size: 11px; color: #4ade80;
          margin-bottom: 5px; display: flex; align-items: center; gap: 5px;
        }
        @media (min-width: 640px) { .pp-sub-title { font-size: 12.5px; } }

        .pp-sub-text {
          font-size: 11.5px; color: rgba(255,255,255,0.58); line-height: 1.72;
        }
        @media (min-width: 640px) { .pp-sub-text { font-size: 13px; } }

        /* ═══════════════ ADSENSE BOX ═══════════════ */
        .pp-adsense-box {
          margin-top: 20px; border: 1px solid rgba(251,191,36,0.22);
          border-radius: 12px; background: rgba(251,191,36,0.05); padding: 14px 16px;
        }
        @media (min-width: 640px) { .pp-adsense-box { margin-top: 24px; padding: 16px 20px; } }

        /* ═══════════════ CONTACT CARD ═══════════════ */
        .pp-contact-card {
          margin-top: 14px; border: 1px solid rgba(13,84,43,0.35);
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(13,84,43,0.14), rgba(0,0,0,0.75));
          padding: 18px 16px;
        }
        @media (min-width: 640px) { .pp-contact-card { margin-top: 18px; padding: 22px 24px; } }

        .pp-contact-btns { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 14px; }

        .pp-btn-primary {
          display: inline-flex; align-items: center; gap: 6px;
          background: linear-gradient(135deg, rgba(13,84,43,0.42), rgba(13,84,43,0.22));
          border: 1px solid rgba(13,84,43,0.52); border-radius: 999px;
          padding: 8px 16px; color: #fff; font-size: 12px; font-weight: 500;
          text-decoration: none; cursor: pointer; white-space: nowrap;
          transition: border-color 0.2s;
        }
        .pp-btn-primary:hover { border-color: rgba(13,84,43,0.8); }
        @media (min-width: 640px) { .pp-btn-primary { font-size: 13px; padding: 9px 20px; } }

        .pp-btn-secondary {
          display: inline-flex; align-items: center; gap: 6px;
          background: transparent; border: 1px solid rgba(255,255,255,0.13);
          border-radius: 999px; padding: 8px 16px;
          color: rgba(255,255,255,0.6); font-size: 12px; font-weight: 500;
          text-decoration: none; cursor: pointer; transition: border-color 0.2s;
        }
        .pp-btn-secondary:hover { border-color: rgba(255,255,255,0.3); color: rgba(255,255,255,0.85); }
        @media (min-width: 640px) { .pp-btn-secondary { font-size: 13px; padding: 9px 20px; } }

        /* ═══════════════ PAGE FOOTER ROW ═══════════════ */
        .pp-foot-row {
          margin-top: 24px; padding-top: 18px;
          border-top: 1px solid rgba(255,255,255,0.06);
          display: flex; flex-direction: column; gap: 8px;
        }
        @media (min-width: 480px) {
          .pp-foot-row { flex-direction: row; justify-content: space-between; align-items: center; }
        }
        .pp-foot-links { display: flex; gap: 14px; flex-wrap: wrap; }
      `}</style>

      <main style={{ background: '#000', minHeight: '100vh', color: '#fff' }}>

        {/* ── HERO ── */}
        <section className="pp-hero">
          <div className="pp-orb pp-orb-1" />
          <div className="pp-orb pp-orb-2" />
          <div className="pp-orb pp-orb-3" />
          <div className="pp-scan" />
          {[
            { left: '10%', delay: '0s',   dur: '6s'   },
            { left: '27%', delay: '2.2s', dur: '8s'   },
            { left: '53%', delay: '1s',   dur: '7.5s' },
            { left: '70%', delay: '3.1s', dur: '5.5s' },
            { left: '88%', delay: '0.5s', dur: '9s'   },
          ].map((p, i) => (
            <div key={i} className="pp-particle"
              style={{ left: p.left, bottom: 0, animationDelay: p.delay, animationDuration: p.dur }} />
          ))}

          <div style={{ position: 'relative', zIndex: 2, maxWidth: 680, margin: '0 auto' }}>

            {/* Shield */}
            <div className="pp-shield-wrap">
              <div className="pp-ring-o" />
              <div className="pp-ring-i" />
              <div className="pp-shield-core">
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24"
                  fill="none" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
            </div>

            {/* Badge */}
            <div>
              <span className="pp-badge">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/>
                </svg>
                Legal & Privacy
              </span>
            </div>

            <h1 className="pp-hero-title">
              Privacy <span className="pp-grad-text">Policy</span>
            </h1>

            <p className="pp-hero-sub">
              Your privacy matters to us. This policy explains exactly how EduCrush
              collects, uses, and protects your information — clearly and honestly.
            </p>

            {/* Stats */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div className="pp-stats-bar">
                <div className="pp-stat">
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect width="18" height="18" x="3" y="4" rx="2"/>
                    <line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
                  </svg>
                  May 2, 2026
                </div>
                <div className="pp-stat">
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
                  </svg>
                  GDPR & AdSense Ready
                </div>
                <div className="pp-stat">
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  ~5 min read
                </div>
              </div>
            </div>

          </div>
        </section>

        <div className="pp-divider" />

        {/* ── MAIN LAYOUT ── */}
        <div className="pp-layout">

          {/* Desktop Sidebar */}
          <aside className="pp-sidebar">
            <div className="pp-toc-box">
              <span className="pp-toc-label">On this page</span>
              {sections.map(s => (
                <div key={s.id}
                  className={`pp-toc-link ${activeSection === s.id ? 'active' : ''}`}
                  onClick={() => jump(s.id)}>
                  {s.title}
                </div>
              ))}
            </div>
            <div className="pp-toc-contact">
              <p style={{ fontSize: 11, color: '#4ade80', fontWeight: 700, marginBottom: 5 }}>Quick Contact</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.44)', lineHeight: 1.6 }}>
                Privacy concerns?<br />
                <a href="mailto:privacy@educrush.in" style={{ color: '#4ade80', textDecoration: 'none' }}>
                  privacy@educrush.in
                </a>
              </p>
            </div>
          </aside>

          {/* Main content */}
          <div className="pp-content">

            {/* Mobile TOC */}
            <div className="pp-mobile-toc">
              <button className="pp-mobile-toc-btn"
                onClick={e => { e.stopPropagation(); setTocOpen(o => !o) }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2">
                    <line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="15" y1="18" y2="18"/>
                  </svg>
                  Jump to section
                </span>
                <svg style={{ transition: 'transform 0.2s', transform: tocOpen ? 'rotate(180deg)' : 'none', flexShrink: 0 }}
                  xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="rgba(255,255,255,0.38)" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              {tocOpen && (
                <div className="pp-mobile-toc-dropdown" onClick={e => e.stopPropagation()}>
                  {sections.map((s, i) => (
                    <div key={s.id} className="pp-mobile-toc-item" onClick={() => jump(s.id)}>
                      <span style={{ fontSize: 9, fontWeight: 700, color: '#4ade80', minWidth: 18 }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {s.title}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Intro */}
            <div className="pp-intro">
              <div className="pp-intro-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                  fill="none" stroke="#4ade80" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
                </svg>
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: 13, color: '#fff', marginBottom: 4 }}>
                  Welcome to EduCrush's Privacy Policy
                </p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.56)', lineHeight: 1.7 }}>
                  <strong style={{ color: 'rgba(255,255,255,0.82)' }}>EduCrush (educrush.in)</strong> is a free educational platform for students.
                  By using our website, you agree to the collection and use of information described in this policy.
                  This page also covers our use of Google AdSense advertising.
                </p>
              </div>
            </div>

            {/* Accordion sections */}
            {sections.map((section, idx) => {
              const isOpen = activeSection === section.id
              return (
                <div key={section.id} id={section.id}
                  className={`pp-card ${isOpen ? 'active' : ''}`}
                  onClick={() => setActiveSection(isOpen ? null : section.id)}>

                  <div className="pp-card-header">
                    <div className="pp-card-left">
                      <div className="pp-num">{String(idx + 1).padStart(2, '0')}</div>
                      <div className="pp-icon-wrap">{section.icon}</div>
                      <span className="pp-card-title">{section.title}</span>
                    </div>
                    <svg className={`pp-chevron ${isOpen ? 'open' : ''}`}
                      xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m6 9 6 6 6-6"/>
                    </svg>
                  </div>

                  <div className={`pp-card-body ${isOpen ? 'open' : ''}`}>
                    {section.content.map((item, i) => (
                      <div key={i} className="pp-sub-item">
                        <p className="pp-sub-title">
                          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="m9 12 2 2 4-4"/><circle cx="12" cy="12" r="10"/>
                          </svg>
                          {item.subtitle}
                        </p>
                        <p className="pp-sub-text">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}

            {/* AdSense notice */}
            <div className="pp-adsense-box">
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                  fill="none" stroke="#fbbf24" strokeWidth="2">
                  <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/>
                </svg>
                <span style={{ fontWeight: 700, fontSize: 12, color: '#fbbf24' }}>Google AdSense Notice</span>
              </div>
              <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.5)', lineHeight: 1.72 }}>
                Third-party vendors including Google use cookies to serve ads based on your prior visits to EduCrush or
                other websites. Opt out at{' '}
                <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer"
                  style={{ color: '#fbbf24', textDecoration: 'none' }}>google.com/settings/ads</a>
                {' '}or{' '}
                <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer"
                  style={{ color: '#fbbf24', textDecoration: 'none' }}>aboutads.info</a>.
              </p>
            </div>

            {/* Contact */}
            <div className="pp-contact-card">
              <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 5 }}>Have Privacy Questions?</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
                We're committed to transparency. If you have any questions, concerns, or requests
                regarding your privacy or this policy, reach out to our team directly.
              </p>
              <div className="pp-contact-btns">
                <a href="mailto:privacy@educrush.in" className="pp-btn-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2">
                    <rect width="20" height="16" x="2" y="4" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  privacy@educrush.in
                </a>
                <a href="/contact" className="pp-btn-secondary">Contact Page →</a>
              </div>
            </div>

            {/* Footer row */}
            <div className="pp-foot-row">
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.26)' }}>© 2026 EduCrush · All rights reserved</p>
              <div className="pp-foot-links">
                <a href="/terms" style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', textDecoration: 'none' }}>Terms & Conditions</a>
                <a href="/contact" style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', textDecoration: 'none' }}>Contact</a>
              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  )
}