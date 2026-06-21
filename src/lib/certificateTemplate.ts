// Builds the certificate markup as an HTML string at a fixed 1500x1000px
// design canvas. Rendered off-screen and captured with html2canvas — see
// certificate.ts. Keeping this as a plain string (not JSX) keeps the
// capture step simple: mount, wait for fonts/images, screenshot, unmount.
//
// Style: premium diagonal-panel layout (dark brand panel on the left with
// logo, tagline and a mountain/stairs/flag illustration, ribbon badge
// top-right, script-font name, 3-stat info row, signature + seal + QR
// footer, social bar, faint architectural line-art watermark) matching the
// brand's own designed certificate template.

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export type CertificateData = {
  name: string
  points: number
  referrals: number
  dateStr: string
  certId: string
  qrDataUrl: string
}

// The name is rendered in a wide script font inside a fixed-width area that
// shares space with the ribbon badge — auto-shrink by length so short names
// stay large and impactful, and long names still fit on one line.
function nameFontSizeFor(name: string): number {
  const len = name.length
  if (len > 26) return 28
  if (len > 21) return 32
  if (len > 16) return 38
  if (len > 11) return 44
  return 52
}

export function buildCertificateHtml(data: CertificateData): string {
  const name = escapeHtml(data.name)
  const nameFontSize = nameFontSizeFor(data.name)

  return `
<style>
  #ec-cert-root, #ec-cert-root * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Poppins', sans-serif; }

  #ec-cert-root { width: 1500px; height: 1000px; position: relative; background: #fcfbf7; overflow: hidden; }

  #ec-cert-root .bg-deco { position: absolute; inset: 0; z-index: 0; }

  #ec-cert-root .dark-panel {
    position: absolute; top: 0; left: 0; width: 470px; height: 1000px; z-index: 1;
    background: linear-gradient(160deg, #050805 0%, #081c10 55%, #0b2415 100%);
    clip-path: polygon(0 0, 330px 0, 420px 250px, 280px 420px, 400px 620px, 250px 1000px, 0 1000px);
  }
  #ec-cert-root .panel-edge {
    position: absolute; top: 0; left: 0; width: 470px; height: 1000px; z-index: 2; pointer-events: none;
    background: linear-gradient(180deg, #6ee7b7, #22c55e 35%, #16a34a 70%, #15803d 100%);
    clip-path: polygon(330px 0, 348px 0, 438px 250px, 298px 420px, 418px 620px, 268px 1000px, 250px 1000px, 400px 620px, 280px 420px, 420px 250px);
  }

  #ec-cert-root .panel-content { position: absolute; top: 0; left: 0; width: 420px; height: 1000px; z-index: 3; padding: 50px 0 0 52px; }

  #ec-cert-root .logo-row2 { display: flex; align-items: center; gap: 13px; }
  #ec-cert-root .logo-mark {
    width: 48px; height: 48px; border-radius: 11px; flex-shrink: 0;
    background: linear-gradient(135deg,#22c55e,#15803d);
    display: flex; align-items: center; justify-content: center; position: relative;
  }
  #ec-cert-root .logo-text2 { font-size: 31px; font-weight: 800; color: #fff; }
  #ec-cert-root .logo-text2 .accent2 { color: #4ade80; }
  #ec-cert-root .panel-underline { width: 290px; height: 1.5px; background: linear-gradient(90deg, #22c55e, transparent); margin: 11px 0 14px; }
  #ec-cert-root .panel-tagline { font-size: 14px; color: #c7d2cc; font-weight: 400; }
  #ec-cert-root .panel-tagline .sep3 { color: #4ade80; margin: 0 8px; }

  #ec-cert-root .panel-empower { margin-top: 130px; font-size: 17px; color: #e5e7e0; font-weight: 500; line-height: 1.4; }
  #ec-cert-root .panel-build { font-size: 30px; color: #4ade80; font-weight: 800; line-height: 1.15; margin-top: 4px; }
  #ec-cert-root .panel-rule { width: 50px; height: 2px; background: #4ade80; margin-top: 16px; }

  #ec-cert-root .panel-illust { position: absolute; bottom: 35px; left: 25px; width: 280px; height: 280px; }

  #ec-cert-root .ribbon { position: absolute; top: 0; right: 55px; width: 210px; z-index: 4; }
  #ec-cert-root .ribbon-body {
    width: 210px; padding: 22px 14px 38px;
    background: linear-gradient(165deg, #22c55e, #16a34a 60%, #14532d);
    clip-path: polygon(0 0, 100% 0, 100% 84%, 50% 100%, 0 84%);
    display: flex; flex-direction: column; align-items: center;
    box-shadow: 0 12px 26px rgba(0,0,0,0.2);
  }
  #ec-cert-root .ribbon-stars { color: #fff; font-size: 13px; letter-spacing: 4px; margin-bottom: 6px; }
  #ec-cert-root .ribbon-title { color: #fff; font-weight: 800; font-size: 16.5px; text-align: center; line-height: 1.3; letter-spacing: 0.02em; margin-top: 10px; }
  #ec-cert-root .ribbon-line { width: 36px; height: 1px; background: rgba(255,255,255,0.5); margin: 10px 0; }
  #ec-cert-root .ribbon-year { color: #fff; font-weight: 700; font-size: 15px; letter-spacing: 0.1em; }

  #ec-cert-root .main-content {
    position: relative; z-index: 3; margin-left: 470px;
    padding: 70px 80px 0 65px;
    display: flex; flex-direction: column; align-items: center;
    height: 1000px;
  }

  #ec-cert-root .presented-to { color: #16a34a; font-weight: 600; font-size: 18px; letter-spacing: 0.3em; margin-bottom: 18px; }
  #ec-cert-root .name2 { font-family: 'Dancing Script', cursive; font-weight: 700; color: #14150f; line-height: 1.15; max-width: 800px; text-align: center; }
  #ec-cert-root .name2-underline { width: 420px; max-width: 80%; height: 1.5px; background: #16a34a; margin: 14px 0 28px; }

  #ec-cert-root .for-text { font-size: 19px; color: #6b7280; margin-bottom: 10px; }
  #ec-cert-root .program-line1 { font-size: 48px; font-weight: 800; color: #15171a; letter-spacing: 0.01em; line-height: 1.1; }
  #ec-cert-root .program-line2 { font-size: 38px; font-weight: 800; color: #16a34a; letter-spacing: 0.005em; line-height: 1.2; margin-bottom: 14px; }

  #ec-cert-root .dot-divider { display: flex; align-items: center; gap: 8px; margin-bottom: 22px; }
  #ec-cert-root .dot-divider .dl { width: 70px; height: 1px; background: #d8dcd6; }
  #ec-cert-root .dot-divider .dd { width: 5px; height: 5px; border-radius: 50%; background: #9ca3af; }

  #ec-cert-root .desc { font-size: 16.5px; color: #6b7280; text-align: center; max-width: 760px; line-height: 1.65; margin-bottom: 34px; }

  #ec-cert-root .info-row { display: flex; align-items: center; gap: 0; margin-bottom: 28px; }
  #ec-cert-root .info-item { display: flex; align-items: center; gap: 12px; padding: 0 26px; }
  #ec-cert-root .info-icon {
    width: 42px; height: 42px; border-radius: 11px; flex-shrink: 0;
    border: 1.5px solid #bbf7d0; background: #f0fdf4;
    display: flex; align-items: center; justify-content: center; color: #16a34a;
  }
  #ec-cert-root .info-label { font-size: 10.5px; font-weight: 600; color: #9ca3af; letter-spacing: 0.08em; }
  #ec-cert-root .info-value { font-size: 16.5px; font-weight: 700; color: #16191c; margin-top: 2px; }
  #ec-cert-root .info-value.small { font-size: 12.5px; font-weight: 500; color: #4b5563; line-height: 1.4; }
  #ec-cert-root .info-sep { width: 1px; height: 44px; background: #e5e7eb; }

  #ec-cert-root .footer-row2 {
    display: flex; align-items: center; justify-content: space-between; width: 100%; max-width: 920px;
    margin-top: auto; margin-bottom: 50px;
  }
  #ec-cert-root .sig-block { display: flex; flex-direction: column; align-items: flex-start; }
  #ec-cert-root .sig-script { font-family: 'Dancing Script', cursive; font-size: 44px; font-weight: 700; color: #1a1a1a; }
  #ec-cert-root .sig-rule { width: 190px; height: 1px; background: #16a34a; margin: 6px 0 8px; }
  #ec-cert-root .sig-bold { font-size: 13px; font-weight: 700; color: #14532d; letter-spacing: 0.02em; }
  #ec-cert-root .sig-role { font-size: 12.5px; color: #6b7280; margin-top: 1px; }

  #ec-cert-root .seal2 {
    width: 130px; height: 130px; border-radius: 50%; position: relative;
    display: flex; align-items: center; justify-content: center;
    border: 1.5px solid #cbd5cf;
  }
  #ec-cert-root .seal2::before { content:''; position:absolute; inset: 8px; border-radius: 50%; border: 1px dashed #cbd5cf; }
  #ec-cert-root .seal2-inner { width: 36px; height: 36px; border-radius: 9px; background: linear-gradient(135deg,#22c55e,#15803d); display:flex; align-items:center; justify-content:center; }

  #ec-cert-root .qr-box2 {
    width: 130px; height: 130px; background: #fff; border-radius: 10px; padding: 8px;
    border: 2px solid #22c55e;
    display: flex; align-items: center; justify-content: center;
  }
  #ec-cert-root .qr-box2 img { width: 100%; height: 100%; }

  #ec-cert-root .bottom-bar2 {
    position: absolute; left: 0; right: 0; bottom: 0; height: 54px; z-index: 4;
    background: #08130a;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 50px 0 40px; font-size: 13px; color: #d1fae5;
  }
  #ec-cert-root .bottom-bar2 .bb-left { display: flex; align-items: center; gap: 8px; padding-left: 420px; }
  #ec-cert-root .bottom-bar2 .bb-center { display: flex; align-items: center; gap: 16px; }
  #ec-cert-root .bottom-bar2 .bb-right { font-weight: 600; color: #9ca3af; font-size: 12.5px; }
</style>

<div id="ec-cert-root">

  <svg class="bg-deco" viewBox="0 0 1500 1000" preserveAspectRatio="none">
    <g stroke="#16a34a" stroke-width="1.6" fill="none" opacity="0.16">
      <path d="M1500 380 Q1300 420 1180 360 Q1060 300 950 380"/>
      <path d="M1500 420 Q1300 460 1180 400 Q1060 340 950 420"/>
      <rect x="1180" y="640" width="220" height="280"/>
      <rect x="1220" y="680" width="40" height="50"/>
      <rect x="1280" y="680" width="40" height="50"/>
      <rect x="1220" y="760" width="40" height="50"/>
      <rect x="1280" y="760" width="40" height="50"/>
      <path d="M1180 640 L1290 580 L1400 640"/>
      <rect x="1340" y="700" width="160" height="220"/>
    </g>
  </svg>

  <div class="dark-panel"></div>
  <div class="panel-edge"></div>

  <div class="panel-content">
    <div class="logo-row2">
      <div class="logo-mark">
        <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
          <path d="M9 7 L23 7 L23 25 L9 25 Q5 25 5 21 L5 11 Q5 7 9 7 Z" fill="#fff" opacity="0.97"/>
          <rect x="9" y="11" width="10" height="2.2" rx="1.1" fill="#16a34a"/>
          <rect x="9" y="15.5" width="10" height="2.2" rx="1.1" fill="#16a34a"/>
          <rect x="9" y="20" width="7" height="2.2" rx="1.1" fill="#16a34a"/>
          <path d="M16 1 L26 5 L16 9 L6 5 Z" fill="#4ade80"/>
          <path d="M10.5 6.3 V10.5 Q16 12.3 21.5 10.5 V6.3" fill="none" stroke="#4ade80" stroke-width="1"/>
          <circle cx="26" cy="5" r="1.1" fill="#4ade80"/>
          <line x1="26" y1="5" x2="26" y2="9.5" stroke="#4ade80" stroke-width="0.8"/>
        </svg>
      </div>
      <div class="logo-text2">Edu<span class="accent2">Crush</span></div>
    </div>
    <div class="panel-underline"></div>
    <div class="panel-tagline">Learn <span class="sep3">•</span> Grow <span class="sep3">•</span> Succeed</div>

    <div class="panel-empower">EMPOWERING STUDENTS.</div>
    <div class="panel-build">BUILDING<br/>TOMORROW.</div>
    <div class="panel-rule"></div>

    <svg class="panel-illust" viewBox="0 0 240 240" fill="none" stroke="#86efac" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <path d="M70 165 L140 55 L210 165" opacity="0.9"/>
      <path d="M140 55 L140 25"/>
      <path d="M140 25 L172 36 L140 46 Z" fill="#86efac" stroke="none"/>
      <path d="M15 215 L55 215 L55 195 L85 195 L85 175 L115 175 L115 165" />
      <circle cx="103" cy="150" r="11" fill="none"/>
      <path d="M92 150 Q103 165 114 150"/>
      <path d="M94 137 L103 132 L112 137 L103 142 Z" fill="#86efac" stroke="none"/>
      <path d="M115 165 Q107 173 113 180 L123 176"/>
      <path d="M123 176 L123 187"/>
    </svg>
  </div>

  <div class="ribbon">
    <div class="ribbon-body">
      <div class="ribbon-stars">★ ★ ★</div>
      <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
        <g fill="#ffffff" opacity="0.95">
          <ellipse cx="4.0" cy="7.5" rx="1.6" ry="0.75" transform="rotate(-30 4 7.5)"/>
          <ellipse cx="3.2" cy="10.2" rx="1.6" ry="0.75" transform="rotate(-12 3.2 10.2)"/>
          <ellipse cx="3.2" cy="13.2" rx="1.6" ry="0.75" transform="rotate(12 3.2 13.2)"/>
          <ellipse cx="4.2" cy="15.9" rx="1.6" ry="0.75" transform="rotate(35 4.2 15.9)"/>
          <ellipse cx="4.9" cy="18.2" rx="1.6" ry="0.75" transform="rotate(55 4.9 18.2)"/>
          <ellipse cx="20" cy="7.5" rx="1.6" ry="0.75" transform="rotate(30 20 7.5)"/>
          <ellipse cx="20.8" cy="10.2" rx="1.6" ry="0.75" transform="rotate(12 20.8 10.2)"/>
          <ellipse cx="20.8" cy="13.2" rx="1.6" ry="0.75" transform="rotate(-12 20.8 13.2)"/>
          <ellipse cx="19.8" cy="15.9" rx="1.6" ry="0.75" transform="rotate(-35 19.8 15.9)"/>
          <ellipse cx="19.1" cy="18.2" rx="1.6" ry="0.75" transform="rotate(-55 19.1 18.2)"/>
        </g>
        <circle cx="12" cy="9" r="3.1" fill="#fff"/>
        <path d="M7.3 19.2c0-2.9 2.1-4.8 4.7-4.8s4.7 1.9 4.7 4.8" fill="#fff"/>
        <path d="M6.6 7.8 12 5.3 17.4 7.8 12 10.3Z" fill="#fff"/>
        <path d="M8.8 8.5 L8.8 11 Q12 12.4 15.2 11 L15.2 8.5" fill="none" stroke="#fff" stroke-width="0.6"/>
      </svg>
      <div class="ribbon-title">STUDENT<br/>AMBASSADOR</div>
      <div class="ribbon-line"></div>
      <div class="ribbon-year">2026</div>
    </div>
  </div>

  <div class="main-content">
    <div class="presented-to">PROUDLY PRESENTED TO</div>
    <div class="name2" style="font-size:${nameFontSize}px">${name}</div>
    <div class="name2-underline"></div>

    <div class="for-text">for successfully completing the</div>
    <div class="program-line1">EDUCRUSH</div>
    <div class="program-line2">STUDENT AMBASSADOR PROGRAM</div>

    <div class="dot-divider"><div class="dl"></div><div class="dd"></div><div class="dd"></div><div class="dd"></div><div class="dl"></div></div>

    <div class="desc">You have demonstrated exceptional dedication, leadership, and a strong commitment to empowering students and spreading the power of learning within your community.</div>

    <div class="info-row">
      <div class="info-item">
        <div class="info-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg></div>
        <div><div class="info-label">DATE OF COMPLETION</div><div class="info-value">${data.dateStr}</div></div>
      </div>
      <div class="info-sep"></div>
      <div class="info-item">
        <div class="info-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M15 8h2M15 12h2M7 16h10"/></svg></div>
        <div><div class="info-label">CERTIFICATE ID</div><div class="info-value">${data.certId}</div></div>
      </div>
      <div class="info-sep"></div>
      <div class="info-item">
        <div class="info-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg></div>
        <div><div class="info-label">VERIFY CERTIFICATE</div><div class="info-value small">Scan QR or visit<br/>educrush.in/verify</div></div>
      </div>
    </div>

    <div class="footer-row2">
      <div class="sig-block">
        <div class="sig-script">Pranav</div>
        <div class="sig-rule"></div>
        <div class="sig-bold">PRANAV N KAMAT</div>
        <div class="sig-role">Founder &amp; CEO, EduCrush</div>
      </div>

      <div class="seal2">
        <svg width="130" height="130" viewBox="0 0 130 130" style="position:absolute;" xmlns:xlink="http://www.w3.org/1999/xlink">
          <defs><path id="seCircleTop" d="M 16,65 A 49,49 0 0 1 114,65"/><path id="seCircleBot" d="M 114,68 A 49,49 0 0 1 16,68"/></defs>
          <text font-size="9" letter-spacing="2" fill="#9ca3af" font-family="Poppins"><textPath xlink:href="#seCircleTop" startOffset="50%" text-anchor="middle">LEARN · GROW · SUCCEED</textPath></text>
          <text font-size="9" letter-spacing="2" fill="#9ca3af" font-family="Poppins"><textPath xlink:href="#seCircleBot" startOffset="50%" text-anchor="middle">EDUCRUSH</textPath></text>
        </svg>
        <div class="seal2-inner">
          <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
            <path d="M9 7 L23 7 L23 25 L9 25 Q5 25 5 21 L5 11 Q5 7 9 7 Z" fill="#fff"/>
            <rect x="9" y="11" width="10" height="2" rx="1" fill="#16a34a"/>
            <rect x="9" y="15.5" width="10" height="2" rx="1" fill="#16a34a"/>
            <path d="M16 1 L26 5 L16 9 L6 5 Z" fill="#fff"/>
          </svg>
        </div>
      </div>

      <div class="qr-box2"><img src="${data.qrDataUrl}" /></div>
    </div>
  </div>

  <div class="bottom-bar2">
    <div class="bb-left">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>
      www.educrush.in
    </div>
    <div class="bb-center">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#d1fae5"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.48 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V23h-4V8zm7 0h3.7v2.05h.05c.5-.95 1.8-2.05 3.7-2.05 4 0 4.7 2.6 4.7 6V23h-4v-6.5c0-1.55-.03-3.5-2.15-3.5-2.15 0-2.48 1.7-2.48 3.4V23h-4V8z"/></svg>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d1fae5" stroke-width="1.8"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.3" cy="6.7" r="1"/></svg>
      <svg width="17" height="17" viewBox="0 0 24 24" fill="#d1fae5"><path d="M22 7.5s-.2-1.6-.8-2.3c-.8-.9-1.7-.9-2.1-1C16.3 4 12 4 12 4h0s-4.3 0-7.1.2c-.4 0-1.3.1-2.1 1C2.2 5.9 2 7.5 2 7.5S1.8 9.3 1.8 11.2v1.6c0 1.9.2 3.7.2 3.7s.2 1.6.8 2.3c.8.9 1.9.9 2.4 1 1.7.2 7.3.2 7.3.2s4.3 0 7.1-.2c.4 0 1.3-.1 2.1-1 .6-.7.8-2.3.8-2.3s.2-1.8.2-3.7v-1.6c0-1.9-.2-3.7-.2-3.7zM9.7 14.9V8.7l5.8 3.1-5.8 3.1z"/></svg>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#d1fae5"><path d="M18.9 3H22l-7 8 8.2 10h-6.4l-5-6.5-5.8 6.5H2.6l7.5-8.5L2.3 3h6.5l4.5 6 5.6-6Z"/></svg>
      <span>/educrush</span>
    </div>
    <div class="bb-right">#EmpoweringStudents</div>
  </div>
</div>
`
}