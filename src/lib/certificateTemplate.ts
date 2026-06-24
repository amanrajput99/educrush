// Builds the EduCrush Ambassador certificate as an HTML string.
// Fixed canvas: 1491 × 1055 px (matches the branded template image exactly).
// Rendered off-screen with html2canvas — see certificate.ts.
//
// Design: branded green-white EduCrush template image as background,
// Dancing Script name overlay, date + cert-ID below their labels,
// QR below "VERIFY CERTIFICATE" section.

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export type CertificateData = {
  name: string
  dateStr: string
  certId: string
  qrDataUrl: string
  // backgroundBase64: the branded template PNG as a data-URI base64 string
  backgroundBase64: string
}

// Auto-shrink name font for long names so it always fits on one line.
function nameFontSize(name: string): number {
  const len = name.length
  if (len > 28) return 68
  if (len > 22) return 80
  if (len > 16) return 96
  if (len > 11) return 112
  return 128
}

export function buildCertificateHtml(data: CertificateData): string {
  const name = escapeHtml(data.name)
  const fs   = nameFontSize(data.name)

  return `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Montserrat:wght@700&display=swap" rel="stylesheet">

<style>
  #ec-cert-root, #ec-cert-root * { box-sizing: border-box; margin: 0; padding: 0; }

  /* Fixed canvas — MUST match template image dimensions exactly */
  #ec-cert-root {
    position: relative;
    width:  1491px;
    height: 1055px;
    overflow: hidden;
    font-family: 'Montserrat', sans-serif;
  }

  /* Background: the branded EduCrush template */
  #ec-cert-root .bg {
    position: absolute;
    inset: 0;
    width:  1491px;
    height: 1055px;
    display: block;
    z-index: 0;
  }

  /* All text overlays sit above the background */
  #ec-cert-root .ov {
    position: absolute;
    z-index: 10;
    pointer-events: none;
  }

  /* ── NAME ──────────────────────────────────────────────────────────────
     Blank white area between "PROUDLY PRESENTED TO" (~y 100) and the
     green underline (~y 293). Centred horizontally in the right ~75 % of
     the card (x 440 → 1250), clear of the badge on the right edge.
  ──────────────────────────────────────────────────────────────────────── */
  #ec-cert-root #ov-name {
 
  left:   400px;
  top:    110px;
  width:  800px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}
  #ec-cert-root #name-txt {
    font-family: 'Dancing Script', cursive;
    font-weight: 500;
    color: #111;
    text-align: center;
    line-height: 1;
    white-space: nowrap;
    display: block;
  width: fit-content;   /* ← 100% ki jagah — yahi fix hai */
    max-width: 100%;      /* ← container se bahar na jaye */

  }

  /* ── DATE VALUE ────────────────────────────────────────────────────────
     Below the "DATE OF COMPLETION" label.
     Icon top ~y 718, label "DATE OF COMPLETION" ~y 730,
     value goes just below label at y 793.
     Icon left edge ~x 318; text after icon starts x 392.
  ──────────────────────────────────────────────────────────────────────── */
  #ec-cert-root #ov-date {
    left:      460px;
    top:       770px;
    font-size: 1.05rem;
    font-weight: 700;
    color: #111;
  }

  /* ── CERTIFICATE ID ────────────────────────────────────────────────────
     Same row as date. Icon left ~x 605; text starts x 658.
  ──────────────────────────────────────────────────────────────────────── */
  #ec-cert-root #ov-certid {
    left:      788px;
    top:       770px;
    font-size: 1.05rem;
    font-weight: 700;
    color: #111;
  }

  /* ── QR CODE ───────────────────────────────────────────────────────────
     Positioned below "VERIFY CERTIFICATE / Visit educrush.in/verify" text.
     Verify icon ~x 878, section runs to ~x 1380.
     QR sits at x 1050, y 820 — above bottom bar (~y 985).
     Size 150 × 150 px with green border to match template style.
  ──────────────────────────────────────────────────────────────────────── */
  #ec-cert-root #ov-qr {
    left:   1070px;
    top:     835px;
    width:   140px;
    height:  140px;
    background: #fff;
    border: 2.5px solid #1a7a28;
    border-radius: 7px;
    padding: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  #ec-cert-root #ov-qr img {
    width:  145px;
    height: 145px;
    display: block;
  }
</style>

<div id="ec-cert-root">
  <!-- Branded template background -->
  <img class="bg" src="${data.backgroundBase64}" />

  <!-- Student name -->
  <div class="ov" id="ov-name">
    <div id="name-txt" style="font-size:${fs}px">${name}</div>
  </div>

  <!-- Date of completion -->
  <div class="ov" id="ov-date">${escapeHtml(data.dateStr)}</div>

  <!-- Certificate ID -->
  <div class="ov" id="ov-certid">${escapeHtml(data.certId)}</div>

  <!-- QR code -->
  <div class="ov" id="ov-qr">
    <img src="${data.qrDataUrl}" alt="Verify certificate" />
  </div>
</div>
`
}