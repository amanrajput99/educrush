import jsPDF from 'jspdf'
import QRCode from 'qrcode'
import html2canvas from 'html2canvas'
import { buildCertificateHtml } from './certificateTemplate'
import { supabase } from '@/lib/supabase'

// Loads the Google Fonts used by the certificate template (Poppins +
// Dancing Script for the name/signature) and waits until they're actually
// usable before we screenshot.
async function ensureCertificateFontsLoaded() {
  const linkId = 'ec-certificate-fonts'
  if (!document.getElementById(linkId)) {
    const link = document.createElement('link')
    link.id = linkId
    link.rel = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Dancing+Script:wght@600;700&display=swap'
    document.head.appendChild(link)
  }

  try {
    await Promise.all([
      document.fonts.load('800 46px "Poppins"'),
      document.fonts.load('700 92px "Dancing Script"'),
      document.fonts.load('700 38px "Dancing Script"'),
    ])
    await document.fonts.ready
  } catch {
    // fall back to the fixed delay below if Font Loading API is unavailable
  }
}

// Generates and downloads the branded EduCrush Ambassador certificate as a
// PDF, and records it in `ambassador_certificates` so the QR code's
// /verify/[certId] link can do an exact DB lookup rather than reconstructing
// an ID from the user's UUID (which risked collisions between ambassadors).
//
// Re-downloading reuses the same cert_id for that person — it doesn't mint
// a new ID every click — so the QR code on every copy of their certificate
// always resolves to the same verification record.
export async function downloadAmbassadorCertificate(
  name: string,
  points: number,
  referrals: number,
  userId: string,
) {
  const displayName = name?.trim() || 'EduCrush Ambassador'
  const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

  let certId: string

  const { data: existing } = await supabase
    .from('ambassador_certificates')
    .select('cert_id')
    .eq('user_id', userId)
    .maybeSingle()

  if (existing) {
    certId = existing.cert_id
    await supabase
      .from('ambassador_certificates')
      .update({ full_name: displayName, points, referrals })
      .eq('user_id', userId)
  } else {
    certId = `EC-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`
    const { error: insertErr } = await supabase
      .from('ambassador_certificates')
      .insert({ cert_id: certId, user_id: userId, full_name: displayName, points, referrals })

    // Extremely unlikely random collision on the suffix — retry once
    if (insertErr) {
      certId = `EC-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`
      await supabase
        .from('ambassador_certificates')
        .insert({ cert_id: certId, user_id: userId, full_name: displayName, points, referrals })
    }
  }

  const verifyUrl = `https://educrush.in/verify/${certId}`

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
    certId: `#${certId}`,
    qrDataUrl,
  })

  const container = document.createElement('div')
  container.style.position = 'fixed'
  container.style.top = '0'
  container.style.left = '-99999px'
  container.style.width = '1500px'
  container.style.height = '1000px'
  container.innerHTML = html
  document.body.appendChild(container)

  try {
    await ensureCertificateFontsLoaded()
    await new Promise(resolve => setTimeout(resolve, 150))

    const target = container.querySelector('#ec-cert-root') as HTMLElement
    const canvas = await html2canvas(target, {
      scale: 2,
      backgroundColor: null,
      useCORS: true,
    })

    const imgData = canvas.toDataURL('image/png', 1.0)

    const doc = new jsPDF({ orientation: 'l', unit: 'mm', format: [300, 200] })
    doc.addImage(imgData, 'PNG', 0, 0, 300, 200, undefined, 'FAST')
    doc.save(`EduCrush-Ambassador-Certificate-${displayName.replace(/\s+/g, '-')}.pdf`)
  } finally {
    document.body.removeChild(container)
  }
}