import QRCode from 'qrcode'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { buildCertificateHtml } from './certificateTemplate'
import { supabase } from '@/lib/supabase'

async function ensureCertFontsLoaded(): Promise<void> {
  const linkId = 'ec-certificate-fonts'
  if (!document.getElementById(linkId)) {
    const link = document.createElement('link')
    link.id   = linkId
    link.rel  = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Montserrat:wght@700&display=swap'
    document.head.appendChild(link)
  }
  try {
    await Promise.all([
      document.fonts.load('700 16px "Montserrat"'),
      document.fonts.load('700 80px "Dancing Script"'),
      document.fonts.load('600 80px "Dancing Script"'),
    ])
    await document.fonts.ready
  } catch {
    // Font Loading API unavailable — fall through to delay
  }
  await new Promise(resolve => setTimeout(resolve, 200))
}

export async function downloadAmbassadorCertificate(
  name: string,
  points: number,
  referrals: number,
  userId: string,
  backgroundImage: string,
): Promise<void> {
  const displayName = name?.trim() || 'EduCrush Ambassador'
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  })

  // ── 1. Resolve cert ID ───────────────────────────────────────────────────
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
    certId = `EC-SA-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`
    const { error: insertErr } = await supabase
      .from('ambassador_certificates')
      .insert({ cert_id: certId, user_id: userId, full_name: displayName, points, referrals })

    if (insertErr) {
      certId = `EC-SA-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`
      await supabase
        .from('ambassador_certificates')
        .insert({ cert_id: certId, user_id: userId, full_name: displayName, points, referrals })
    }
  }

  // ── 2. Generate QR ───────────────────────────────────────────────────────
  const verifyUrl = `https://educrush.in/verify/${certId}`
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
    width: 300, margin: 1,
    color: { dark: '#1a5e20', light: '#ffffff' },
  })

  // ── 3. Build HTML ────────────────────────────────────────────────────────
  const html = buildCertificateHtml({
    name: displayName,
    dateStr,
    certId,
    qrDataUrl,
    backgroundBase64: backgroundImage,
  })

  // ── 4. Mount off-screen ──────────────────────────────────────────────────
  const container = document.createElement('div')
  container.style.cssText = 'position:fixed;top:0;left:-99999px;width:1491px;height:1055px;overflow:hidden;'
  container.innerHTML = html
  document.body.appendChild(container)

  try {
    await ensureCertFontsLoaded()

    const target = container.querySelector('#ec-cert-root') as HTMLElement

    // ── 5. Screenshot ────────────────────────────────────────────────────
    const canvas = await html2canvas(target, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: null,
      width: 1491,
      height: 1055,
      logging: false,
    })

    // ── 6. Download PDF ──────────────────────────────────────────────────
    const imgData = canvas.toDataURL('image/jpeg', 1.0)

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [1491, 1055],
    })

    pdf.addImage(imgData, 'JPEG', 0, 0, 1491, 1055)
    pdf.save(`EduCrush-Ambassador-${displayName.replace(/\s+/g, '-')}.pdf`)

  } finally {
    document.body.removeChild(container)
  }
}