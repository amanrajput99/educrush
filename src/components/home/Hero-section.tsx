'use client'


export default function HeroSection() {

  const companyLogos = [
    { name: "React", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "Python", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
    { name: "Java", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
    { name: "Next.js", url: "https://cdn.worldvectorlogo.com/logos/nextjs-2.svg" },
    {
      name: "Tailwind",
      url: "https://www.svgrepo.com/show/374118/tailwind.svg"
    },
    { name: "Supabase", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg" },
    { name: "Framer", url: "https://cdn.worldvectorlogo.com/logos/framer-motion.svg" }
  ];

  return (
    <>
      <style>
        {`s
        
/* =========================
   GLOBAL (font optional)
========================= */
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap");
* { font-family: "Poppins", sans-serif; }

/* =========================
   MARQUEE CORE (NO GAP LOOP)
   - 3x content
   - move 33.333%
========================= */
.marquee-track {
  display: flex;
  width: max-content;
  gap: 3.5rem;                 /* base gap */
  animation: marquee-scroll 25s linear infinite;
  will-change: transform;
}

/* hover pause */
.marquee-track:hover {
  animation-play-state: paused;
}

/* seamless scroll */
@keyframes marquee-scroll {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-33.333%); }
}

/* =========================
   RESPONSIVE SPEED
   (mobile slow → desktop fast)
========================= */
@media (min-width: 768px) {
  .marquee-track { animation-duration: 20s; gap: 4rem; }
}
@media (min-width: 1024px) {
  .marquee-track { animation-duration: 15s; gap: 5rem; }
}

/* =========================
   GLASS STRIP (container)
   - use on wrapper div
========================= */
.marquee-glass {
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  padding: 1.5rem 1.25rem;
  background: rgba(255,255,255,0.06);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.12);
  box-shadow: 0 0 60px rgba(139,92,246,0.25);
  perspective: 1000px; /* for 3D hover */
}

/* top/bottom glow lines (optional helper classes) */
.marquee-glow-top,
.marquee-glow-bottom {
  position: absolute;
  left: 0;
  width: 100%;
  height: 1px;
  pointer-events: none;
  background: linear-gradient(to right, transparent, rgba(167,139,250,0.7), transparent);
  opacity: 0.4;
}
.marquee-glow-top { top: 0; }
.marquee-glow-bottom { bottom: 0; }

/* =========================
   EDGE FADE (SOFT, NOT HARD BLACK)
   - add two divs with these classes
========================= */
.marquee-fade-left,
.marquee-fade-right {
  position: absolute;
  top: 0;
  height: 100%;
  width: 7rem;                 /* adjust as needed */
  z-index: 10;
  pointer-events: none;
}

.marquee-fade-left {
  left: 0;
  background: linear-gradient(
    to right,
    rgba(0,0,0,0.85),
    rgba(0,0,0,0.45),
    rgba(0,0,0,0)
  );
}

.marquee-fade-right {
  right: 0;
  background: linear-gradient(
    to left,
    rgba(0,0,0,0.85),
    rgba(0,0,0,0.45),
    rgba(0,0,0,0)
  );
}

/* =========================
   LOGO STYLING
========================= */
.marquee-item {
  height: 3.5rem;             /* mobile */
  width: auto;
  object-fit: contain;
  opacity: 0.7;
  transition: transform 0.35s ease, opacity 0.3s ease, filter 0.3s ease;
  transform: translateZ(0);
  filter: drop-shadow(0 0 10px rgba(139,92,246,0.25));
}

/* responsive logo size */
@media (min-width: 768px) {
  .marquee-item { height: 4rem; }
}
@media (min-width: 1024px) {
  .marquee-item { height: 5rem; }
}

/* 3D hover */
.marquee-item:hover {
  opacity: 1;
  transform: translateZ(40px) scale(1.15);
  filter: drop-shadow(0 0 16px rgba(139,92,246,0.45));
}

/* =========================
   BLUR TRAIL (subtle)
========================= */
/* when hovering the strip, non-hovered logos get slight blur */
.marquee-track:hover .marquee-item {
  filter: blur(0.8px) drop-shadow(0 0 10px rgba(139,92,246,0.25));
}
.marquee-track:hover .marquee-item:hover {
  filter: blur(0px) drop-shadow(0 0 16px rgba(139,92,246,0.45));
}

/* =========================
   OPTIONAL: MASK-BASED FADE (extra smooth)
   - apply to the same wrapper as .marquee-glass
========================= */
.marquee-mask {
  -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
          mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
}

  `}
      </style>

      <section className='flex flex-col items-center bg-black bg-[url("https://assets.prebuiltui.com/images/components/hero-section/hero-galaxy-bg.png")] bg-cover bg-center bg-no-repeat text-white  px-4'>

        {/* Badge */}
      
         <div className="flex flex-wrap items-center justify-center gap-2 px-3 py-2 mt-32 rounded-full bg-linear-to-r from-[#0000FF]/20 to-[#800080]/10 border border-white/10">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles-icon lucide-sparkles"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/><path d="M20 2v4"/><path d="M22 4h-4"/><circle cx="4" cy="20" r="2"/></svg>
         <span className="text-xs text-gray-50">FREE LEARNING RESOURCES</span>
                </div>

        {/* Heading */}
        <h2 className="text-4xl md:text-6xl text-center max-w-3xl mt-8 font-medium leading-tight">
          Everything You Need <br className="hidden md:block" /> Learn & Build
        </h2>

        {/* Subtext */}
        <p className="text-sm text-white/70 text-center max-w-[480px] mt-5 leading-relaxed">
          From class notes to web projects — EduCrush is your one-stop platform to learn, create, and grow.
        </p>

        {/* Buttons */}
        <div className="flex gap-3 mt-10">
  {/* Browse Notes Button */}
  <button
    onClick={() =>
      document.getElementById("notes")?.scrollIntoView({ behavior: "smooth" })
    }
    className="bg-gradient-to-r from-[#0000FF]/20 to-[#800080]/10 border border-white/15 hover:border-white/30 flex items-center gap-3 px-2 py-1 pr-4 rounded-full transition duration-200 cursor-pointer"
  >
    <div className="w-10 h-10 rounded-full border-2 border-[#7E69B5] flex items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-sparkles-icon lucide-sparkles"
      >
        <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
        <path d="M20 2v4" />
        <path d="M22 4h-4" />
        <circle cx="4" cy="20" r="2" />
      </svg>
    </div>
    <span className="text-slate-100 text-sm">Browse Notes</span>
  </button>

  {/* View Projects Button */}
  <button
    onClick={() =>
      document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
    }
    className="bg-gradient-to-r from-[#0000FF]/20 to-[#800080]/10 border border-white/15 hover:border-white/30 flex items-center gap-3 px-2 py-1 pr-4 rounded-full transition duration-200 cursor-pointer"
  >
    <div className="w-10 h-10 rounded-full border-2 border-[#7E69B5] flex items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-phone-call-icon lucide-phone-call"
      >
        <path d="M13 2a9 9 0 0 1 9 9" />
        <path d="M13 6a5 5 0 0 1 5 5" />
        <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
      </svg>
    </div>
    <span className="text-slate-100 text-sm">View Projects</span>
  </button>
</div>

        {/* Label */}
        <p className="mt-10 mb-2 text-xs text-white/40 tracking-[0.2em] uppercase">
          Join 10000+ Students Already Learning
        </p>


        <div className="relative w-full py-8">

          <div className="
    relative overflow-hidden
    bg-gradient-to-r from-white/10 via-white/5 to-white/10
    backdrop-blur-2xl
    border border-white/20
    rounded-2xl
    shadow-[0_0_60px_rgba(139,92,246,0.25)]
    px-6 py-8
  ">

            {/* Shine */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-20 pointer-events-none" />

            {/* Fade */}
            <div className="absolute left-0 top-0 h-full w-32 z-20 pointer-events-none 
      bg-gradient-to-r from-black/30 via-transparent to-transparent" />

            <div className="absolute right-0 top-0 h-full w-32 z-20 pointer-events-none 
      bg-gradient-to-l from-black/30 via-transparent to-transparent" />

            {/* Marquee */}
            <div className="marquee-track flex items-center gap-14">
              {[...companyLogos, ...companyLogos, ...companyLogos].map((logo, index) => (
                <img
                  key={index}
                  src={logo.url}
                  alt={logo.name}
                  className="h-14 md:h-16 lg:h-20 opacity-80 hover:opacity-100 transition"
                />
              ))}
            </div>

          </div>
        </div>
{/* ── Bottom divider glow ── */}
        <div className="mt-20 w-full h-px bg-gradient-to-r from-transparent via-emerald-700/40 to-transparent" />
      

      </section>
    </>
  )
}
