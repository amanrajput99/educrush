'use client'
import { usePathname } from 'next/navigation'

// Yeh routes apna full-screen design hote hain — global Navbar/Footer/CTA/AiButton
// inke saath clash karte hain, isliye yahan hide karo.
const CHROME_HIDDEN_ROUTES = ['/login', '/onboarding']

export function useChromeHidden() {
  const pathname = usePathname()
  return CHROME_HIDDEN_ROUTES.some(route => pathname === route || pathname?.startsWith(route + '/'))
}
