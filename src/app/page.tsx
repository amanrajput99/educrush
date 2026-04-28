import HeroSection from '@/components/home/Hero-section'
import ProjectCards from '@/components/home/Projectcards'
import NotesSection from '@/components/home/Notescards' 

import Features from '@/components/home/Features'
import ImageGallery from '@/components/home/Image-gallery'
// import MarqueeText from '@/components/home/MarqueeText'
import FAQ from '@/components/home/FAQ'
import Testimonials from '@/components/ui/Testimonials'

export default function Home() {
  return (
    <>
      <HeroSection />
      <NotesSection />
      <ProjectCards limit={5} />
      <Features />
      <ImageGallery />
      <Testimonials />    
      {/* <MarqueeText /> */}
      <FAQ />
    </>
  )
}
