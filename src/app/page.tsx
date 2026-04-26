import HeroSection from '@/components/home/Hero-section'
import ProjectCards from '@/components/home/Projectcards'
import Features from '@/components/home/Features'
import ImageGallery from '@/components/home/Image-gallery'
// import MarqueeText from '@/components/home/MarqueeText'
import FAQ from '@/components/home/FAQ'
import Testimonials from '@/components/ui/Testimonials'

export default function Home() {
  return (
    <>
      <HeroSection />
      <ProjectCards />
      <Features />
      
      <ImageGallery />
      <Testimonials />    
      {/* <MarqueeText /> */}
      <FAQ />
    </>
  )
}
