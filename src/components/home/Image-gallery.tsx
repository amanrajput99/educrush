'use client'

export default function ImageGallery() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
        * { font-family: 'Sora', sans-serif; }
      `}</style>

      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-700/40 to-transparent my-6" />

      <div className="py-4 px-4 bg-black flex flex-col justify-center items-center gap-6">
        <button className="px-4 h-8 border border-gray-800 text-slate-400 text-xs rounded-lg cursor-default tracking-wide uppercase">
          Community
        </button>
        <h1 className="text-3xl md:text-[40px]/12 font-semibold text-gray-100 max-w-lg text-center leading-tight">
          Built by students, for students.
        </h1>
        <p className="text-base/7 text-slate-400 max-w-xl text-center">
          From packed lecture halls to late-night study sessions — EduCrush was born out of real student life, and it shows.
        </p>
      </div>

      <div className="flex items-center gap-6 h-[400px] w-full max-w-5xl mt-10 mx-auto px-4">

        {/* Card 1 */}
        <div className="relative group flex-grow transition-all w-56 h-[400px] duration-500 hover:w-full">
          <img
            className="h-full w-full object-cover object-center"
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&h=400&auto=format&fit=crop"
            alt="Students studying together"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-10 text-white bg-black/55 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <h1 className="text-2xl font-semibold mb-2">Study Smarter</h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Access semester-wise notes and resources crafted by students who have been exactly where you are.
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="relative group flex-grow transition-all w-56 h-[400px] duration-500 hover:w-full">
          <img
            className="h-full w-full object-cover object-center"
            src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&h=400&auto=format&fit=crop"
            alt="Students collaborating on projects"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-10 text-white bg-black/55 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <h1 className="text-2xl font-semibold mb-2">Build Real Projects</h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Explore hands-on projects with source code — learn by building, not just reading.
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="relative group flex-grow transition-all w-56 h-[400px] duration-500 hover:w-full">
          <img
            className="h-full w-full object-cover object-center"
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&h=400&auto=format&fit=crop"
            alt="Student community"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-10 text-white bg-black/55 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <h1 className="text-2xl font-semibold mb-2">Grow Together</h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Join a community of 10,000+ students sharing knowledge, solving doubts, and supporting each other.
            </p>
          </div>
        </div>

      </div>
    </>
  )
}