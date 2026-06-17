'use client'
import Link from "next/link";
import { useChromeHidden } from '@/lib/useChromeVisibility'

export default function CTA() {
  const chromeHidden = useChromeHidden()
  if (chromeHidden) return null

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
        * { font-family: 'Sora', sans-serif; }
      `}</style>

      <div className="max-w-5xl pt-16 pb-0 md:w-full mx-2 md:mx-auto flex flex-col items-center justify-center text-center bg-gradient-to-b from-[#0D542B] to-black rounded-2xl p-10 text-white">
        <p className="px-6 py-2 rounded-full text-sm border border-emerald-700/50 text-green-300">
          Community & Support
        </p>
        <h1 className="text-4xl md:text-5xl md:leading-[60px] font-semibold max-w-2xl mt-5">
          Join 10,000+ students already learning{' '}
          <span className="bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent">
            for free on EduCrush
          </span>
        </h1>
        <p className="text-slate-300 text-sm mt-3 max-w-md">
          Access notes, projects, and a growing community — no sign-up fee, no paywall, ever.
        </p>
        <Link href="/notes">
          <button className="px-12 py-2.5 mt-6 rounded-full text-sm font-medium border border-emerald-600 bg-gradient-to-r from-green-950 to-green-700 hover:from-green-700 hover:to-green-950 text-white active:scale-95 transition-all duration-300">
            Start Learning Free
          </button>
        </Link>
      </div>
    </>
  );
}