'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Mail, Send, MessageCircle } from 'lucide-react'

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget
    const name = (form.elements.namedItem('name') as HTMLInputElement).value
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    const mobile = (form.elements.namedItem('mobile') as HTMLInputElement).value
    const subject = (form.elements.namedItem('subject') as HTMLSelectElement).value
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value

    const { error } = await supabase
      .from('contacts')
      .insert([{ name, email, mobile, subject, message }])

    if (!error) setSuccess(true)
    setLoading(false)
  }

  return (
    <>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap");
        * { font-family: "Sora", sans-serif; }
      `}</style>

      <div className='bg-black min-h-screen text-white'>

        {/* Hero */}
        <section className='relative flex flex-col md:flex-row justify-center px-4 py-20 gap-20'>
          <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none size-140 bg-green-500/35 rounded-full blur-[200px]'></div>

          <div className='text-center md:text-left mt-12'>
            <div className="flex items-center p-1.5 rounded-full border border-green-900 text-xs w-fit mx-auto md:mx-0">
              <div className="flex items-center">
                <img className="size-7 rounded-full border border-green-900" src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=50" alt="u1" />
                <img className="size-7 rounded-full border border-green-900 -translate-x-2" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=50" alt="u2" />
                <img className="size-7 rounded-full border border-green-900 -translate-x-4" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=50" alt="u3" />
              </div>
              <p className="-translate-x-2 text-xs text-slate-200">Trusted by 10,000+ students across India</p>
            </div>
            <h1 className='font-semibold text-3xl md:text-5xl/15 bg-linear-to-r max-md:mx-auto from-white to-green-300 bg-clip-text text-transparent max-w-[470px] mt-4'>
              Have a question or want to collaborate?
            </h1>
            <p className='text-sm/6 text-slate-400 max-w-[345px] mt-4 mx-auto md:mx-0'>
              Whether you want to share notes, report an issue, or simply say hello — we read every message and reply within 24 hours.
            </p>
          </div>

          {/* Form */}
          <div className='w-full max-w-lg max-md:mx-auto backdrop-blur-sm border border-white/10 rounded-xl p-8'>
            {success ? (
              <div className='flex flex-col items-center justify-center h-full py-16 text-center'>
                <div className='text-4xl mb-4'>✅</div>
                <h3 className='text-white text-xl font-semibold mb-2'>Message Sent!</h3>
                <p className='text-slate-400 text-sm'>We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form className='space-y-5' onSubmit={handleSubmit}>
                <div>
                  <label className='block text-white text-sm mb-2'>Full Name</label>
                  <input name="name" type="text" required placeholder="John Doe"
                    className='w-full bg-[#00A63E]/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 placeholder:text-sm focus:outline-none focus:border-green-600 transition' />
                </div>
                <div>
                  <label className='block text-white text-sm mb-2'>Email Address</label>
                  <input name="email" type="email" required placeholder="you@example.com"
                    className='w-full bg-[#00A63E]/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 placeholder:text-sm focus:outline-none focus:border-green-600 transition' />
                </div>
                <div>
                  <label className='block text-white text-sm mb-2'>Mobile <span className='text-white/40 font-normal'>(Optional)</span></label>
                  <input name="mobile" type="tel" placeholder="+91 98765 43210"
                    className='w-full bg-[#00A63E]/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 placeholder:text-sm focus:outline-none focus:border-green-600 transition' />
                </div>
                <div>
                  <label className='block text-white text-sm mb-2'>Subject</label>
                  <select name="subject" required
                    className='w-full bg-[#00A63E]/5 border border-white/20 rounded-lg px-4 py-3 text-white/70 text-sm focus:outline-none focus:border-green-600 transition'>
                    <option value="" className='bg-black'>Select a subject</option>
                    <option value="General Inquiry" className='bg-black'>General Inquiry</option>
                    <option value="Notes Request" className='bg-black'>Notes Request</option>
                    <option value="Project Help" className='bg-black'>Project Help</option>
                    <option value="Bug Report" className='bg-black'>Bug Report</option>
                    <option value="Other" className='bg-black'>Other</option>
                  </select>
                </div>
                <div>
                  <label className='block text-white text-sm mb-2'>Message</label>
                  <textarea name="message" placeholder="Tell us how we can help you..." rows={4} required
                    className='w-full bg-[#00A63E]/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 placeholder:text-sm focus:outline-none focus:border-green-600 transition resize-none'></textarea>
                </div>
                <div className='flex items-center justify-between'>
                  <p className='text-xs text-white/60 max-w-[180px]'>
                    By submitting, you agree to our <span className='text-white'>Terms</span> and <span className='text-white'>Privacy Policy</span>.
                  </p>
                  <button type="submit" disabled={loading}
                    className='bg-linear-to-r from-green-950 to-green-600 hover:from-green-600 hover:to-green-950 text-white text-sm px-8 py-3 rounded-full transition duration-300 cursor-pointer disabled:opacity-50'>
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* Info Cards */}
        <section className='px-6 pb-16 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6'>

          {/* Email */}
          <div className='border border-white/10 rounded-xl p-6 bg-white/5 backdrop-blur-sm'>
            <Mail className='text-green-400 mb-3' size={28} />
            <h3 className='text-white font-semibold mb-1'>Email Us</h3>
            <p className='text-slate-400 text-sm mb-3'>We reply within 24 hours</p>
            <a href="mailto:educrushofficial@gmail.com" className='text-green-400 text-sm hover:text-green-300 transition'>
              educrushofficial@gmail.com
            </a>
          </div>

          {/* Telegram */}
          <div className='border border-white/10 rounded-xl p-6 bg-white/5 backdrop-blur-sm'>
            <Send className='text-green-400 mb-3' size={28} />
            <h3 className='text-white font-semibold mb-1'>Join Telegram</h3>
            <p className='text-slate-400 text-sm mb-3'>Get instant updates and community support</p>
            <a href="https://t.me/educrush" target="_blank" rel="noreferrer" className='text-green-400 text-sm hover:text-green-300 transition'>
              t.me/educrush
            </a>
          </div>

          {/* WhatsApp */}
          <div className='border border-white/10 rounded-xl p-6 bg-white/5 backdrop-blur-sm'>
            <MessageCircle className='text-green-400 mb-3' size={28} />
            <h3 className='text-white font-semibold mb-1'>WhatsApp Community</h3>
            <p className='text-slate-400 text-sm mb-3'>Connect with fellow students for quick help</p>
            <a href="https://whatsapp.com/channel/educrush" target="_blank" rel="noreferrer" className='text-green-400 text-sm hover:text-green-300 transition'>
              Join Community
            </a>
          </div>

        </section>

      </div>
    </>
  )
}