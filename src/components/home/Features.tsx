'use client'

const featuresData = [
  {
    icon: (
      <svg className="text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    title: 'Organised Notes Library',
    description: 'Browse semester-wise, subject-wise notes for BTech, BCA, and Diploma — all in one place, always free.',
  },
  {
    icon: (
      <svg className="text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    title: 'Real Projects with Source Code',
    description: 'Explore mini projects, final year projects, and web dev builds — complete with code so you can learn by doing.',
  },
  {
    icon: (
      <svg className="text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    title: 'Smart Search',
    description: 'Find exactly what you need in seconds. Search by subject, semester, branch, or topic — no more wasted time.',
  },
  {
    icon: (
      <svg className="text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Student Community',
    description: 'Join thousands of students sharing knowledge, asking doubts, and growing together — across colleges and cities.',
  },
  {
    icon: (
      <svg className="text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    title: 'Contribute & Get Credit',
    description: 'Upload your notes or projects and help others — your name stays on every resource you contribute, forever.',
  },
  {
    icon: (
      <svg className="text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    title: '100% Free, Forever',
    description: 'No subscriptions, no paywalls, no hidden fees. Every resource on EduCrush is completely free — and always will be.',
  },
]

const Features = () => {
  return (
    <>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap");
        * { font-family: "Sora", sans-serif; }
      `}</style>

      <section className="py-8 px-4 bg-black flex flex-col justify-center items-center gap-6">
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-700/40 to-transparent my-6" />

        <button className="px-4 h-8 border border-gray-800 text-slate-400 text-xs rounded-lg cursor-default tracking-wide uppercase">
          Features
        </button>

        <h2 className="text-3xl md:text-[40px]/12 font-semibold text-gray-100 max-w-lg text-center leading-tight">
          Everything a student needs, in one place.
        </h2>

        <p className="text-base/7 text-slate-400 max-w-xl text-center">
          From organised notes to real projects and a growing community — EduCrush gives you every tool to study smarter and build better.
        </p>

        <div className="relative max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {featuresData.map((feature, index) => (
            <div
              key={index}
              className="bg-linear-to-b from-[#020204] to-[#0D542B] border border-gray-700 rounded-lg p-6 space-y-3 hover:-translate-y-1 transition duration-300"
            >
              {feature.icon}
              <p className="font-semibold text-lg text-gray-100">{feature.title}</p>
              <p className="text-sm/5 text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default Features