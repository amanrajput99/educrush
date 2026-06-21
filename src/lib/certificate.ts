import jsPDF from 'jspdf'
import QRCode from 'qrcode'
import html2canvas from 'html2canvas'
import { buildCertificateHtml } from './certificateTemplate'

// Generates and downloads the branded EduCrush Ambassador certificate as a
// PDF. The certificate is built as real HTML/CSS (matching the brand's
// designed template), captured at high resolution with html2canvas, then
// embedded into a PDF sized to the exact same aspect ratio (no white
// borders / letterboxing).
export async function downloadAmbassadorCertificate(
  name: string,
  points: number,
  referrals: number,
  userId: string,
) {
  const displayName = name?.trim() || 'EduCrush Ambassador'
  const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  const certId = `#EC-${new Date().getFullYear()}-${userId.replace(/-/g, '').slice(0, 5).toUpperCase()}`
  const verifyUrl = `https://educrush.in/verify/${encodeURIComponent(certId.replace('#', ''))}`

  // QR is generated fully client-side (no network call), so it always works
  // even if the verify page doesn't exist yet — it just won't resolve until
  // that page ships.
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
    width: 300,
    margin: 0,
    color: { dark: '#0a0a0a', light: '#ffffff' },
  })

  const html = buildCertificateHtml({
    name: displayName,
    points,
    referrals,
    dateStr,
    certId,
    qrDataUrl,
  })

  // Mount off-screen at the template's native design size so html2canvas
  // captures it pixel-for-pixel regardless of the visible viewport size.
  const container = document.createElement('div')
  container.style.position = 'fixed'
  container.style.top = '0'
  container.style.left = '-99999px'
  container.style.width = '1500px'
  container.style.height = '1000px'
  container.innerHTML = html
  document.body.appendChild(container)

  try {
    // Make sure web fonts (Poppins / Caveat) are actually painted before
    // the screenshot, otherwise the capture can fall back to a system font.
    if (document.fonts?.ready) {
      await document.fonts.ready
    }
    await new Promise(resolve => setTimeout(resolve, 150))

    const target = container.querySelector('#ec-cert-root') as HTMLElement
    const canvas = await html2canvas(target, {
      scale: 2,
      backgroundColor: null,
      useCORS: true,
    })

    const imgData = canvas.toDataURL('image/png', 1.0)

    // Custom page size matching the 1500x1000 (3:2) design canvas exactly —
    // no white margins or letterboxing. orientation must be set explicitly:
    // jsPDF defaults to portrait and silently swaps a [300,200] array to
    // 200x300 otherwise, which clips the image on the right and leaves a
    // large blank strip at the bottom.
    const doc = new jsPDF({ orientation: 'l', unit: 'mm', format: [300, 200] })
    doc.addImage(imgData, 'PNG', 0, 0, 300, 200, undefined, 'FAST')
    doc.save(`EduCrush-Ambassador-Certificate-${displayName.replace(/\s+/g, '-')}.pdf`)
  } finally {
    document.body.removeChild(container)
  }
}