'use client'

const faqs = [
  {
    question: "Is EduCrush completely free?",
    answer: "Yes — 100% free, forever. EduCrush was built on the belief that quality education should never be locked behind a paywall. Every note, project, and resource on this platform is free to access with no hidden charges."
  },
  {
    question: "Who creates the notes on EduCrush?",
    answer: "Our notes are contributed by top-performing students from BTech, BCA, and Diploma programmes. Every submission goes through a review before going live, so you only get content that is accurate, clear, and exam-ready."
  },
  {
    question: "Which courses and subjects are covered?",
    answer: "We currently cover BTech (CSE, ECE, ME and more), BCA, and Diploma programmes — across all years and semesters. We are adding new subjects regularly, so the library keeps growing."
  },
  {
    question: "Can I contribute my own notes or projects?",
    answer: "Absolutely. If you have notes, college projects, or articles to share, you can join as a Volunteer Contributor. Your content will be published with full credit to you, and you will receive a contributor badge and recognition on your profile."
  },
  {
    question: "How do I become a Student Ambassador?",
    answer: "Apply through our Careers page. The Student Ambassador Program is open to any BTech, BCA, or Diploma student. It requires just 2–3 hours per week and comes with a certificate, priority access, and direct team support."
  },
  {
    question: "How often is new content added?",
    answer: "New notes, projects, and resources are added on a regular basis by our growing contributor community. You can expect fresh content every month across multiple subjects and courses."
  },
  {
    question: "Is EduCrush available outside Dehradun or Uttarakhand?",
    answer: "Yes. EduCrush is a fully online platform accessible to any student in India. Whether you are in a Tier 1 metro or a Tier 3 city, all you need is an internet connection."
  },
  {
    question: "How can I report an issue or suggest a feature?",
    answer: "You can reach us via the Contact page, email us at educrushofficial@gmail.com, or join our Telegram community. We read every message and take feedback seriously — many of our improvements come directly from students."
  },
]

const mid = Math.ceil(faqs.length / 2)
const columns = [faqs.slice(0, mid), faqs.slice(mid)]

const FAQ = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
        * { font-family: 'Sora', sans-serif; }
      `}</style>

      <section className="bg-black w-full flex flex-col items-center justify-center py-10 px-4">
        <div className="w-full max-w-5xl">

          {/* Header */}
          <div className="mb-14 text-center">
            <button className="px-4 h-8 border border-gray-800 text-slate-400 text-xs rounded-lg mb-5 cursor-default tracking-wide uppercase">
              FAQ
            </button>
            <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight">
              Questions we{' '}
              <span className="bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">
                get asked a lot
              </span>
            </h2>
            <p className="text-slate-400 text-sm/7 max-w-lg mx-auto mt-4">
              Everything you need to know about EduCrush — notes, contributors, ambassadors, and more.
              Can't find an answer?{' '}
              <a href="/contact" className="text-green-400 hover:text-green-300 transition">Reach out to us.</a>
            </p>
          </div>

          {/* Accordion grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-y-0">
            {columns.map((column, columnIndex) => (
              <div key={columnIndex} className="space-y-4">
                {column.map((faq) => (
                  <details
                    key={faq.question}
                    name="faq-accordion"
                    className="group rounded-2xl border border-gray-800 bg-gradient-to-b from-[#0a0a0a] to-black transition-all duration-300 hover:border-emerald-900/60"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 [&::-webkit-details-marker]:hidden">
                      <span className="text-sm font-medium text-white leading-snug">{faq.question}</span>
                      <div className="shrink-0 w-7 h-7 rounded-lg border border-gray-800 bg-[#0D542B]/20 flex items-center justify-center text-green-400 transition-colors group-open:bg-[#0D542B]/40">
                        <svg className="block group-open:hidden" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14" /><path d="M12 5v14" />
                        </svg>
                        <svg className="hidden group-open:block" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14" />
                        </svg>
                      </div>
                    </summary>
                    <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-300 ease-in-out group-open:grid-rows-[1fr] group-open:opacity-100">
                      <div className="overflow-hidden">
                        <p className="px-4 pb-4 text-sm leading-relaxed text-slate-400">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 text-center">
            <p className="text-slate-500 text-sm">
              Still have questions?{' '}
              <a href="/contact" className="text-green-400 hover:text-green-300 transition font-medium">
                Contact us →
              </a>
            </p>
          </div>

        </div>
      </section>
    </>
  )
}

export default FAQ