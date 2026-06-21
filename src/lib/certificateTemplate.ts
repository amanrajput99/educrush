// Builds the certificate markup as an HTML string at a fixed 1500x1000px
// design canvas. Rendered off-screen and captured with html2canvas — see
// certificate.ts. Keeping this as a plain string (not JSX) keeps the
// capture step simple: mount, wait for fonts/images, screenshot, unmount.

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

export function buildCertificateHtml(data: CertificateData): string {
  const name = escapeHtml(data.name)
  return `
<style>
  #ec-cert-root, #ec-cert-root * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Poppins', sans-serif; }

  #ec-cert-root {
    width: 1500px; height: 1000px; position: relative;
    display: flex; flex-direction: column;
    background:
      radial-gradient(ellipse 700px 500px at 15% 90%, rgba(34,197,94,0.10), transparent 60%),
      radial-gradient(ellipse 600px 400px at 85% 10%, rgba(99,102,241,0.07), transparent 60%),
      #060a08;
    overflow: hidden;
  }

  #ec-cert-root .dot-grid {
    position: absolute; width: 130px; height: 130px; opacity: 0.5;
    background-image: radial-gradient(rgba(120,140,130,0.35) 1.3px, transparent 1.3px);
    background-size: 13px 13px;
  }
  #ec-cert-root .dot-grid.tl { top: 50px; left: 40px; }
  #ec-cert-root .dot-grid.tr { top: 50px; right: 40px; }

  #ec-cert-root .frame-svg { position: absolute; inset: 0; width: 100%; height: 100%; }

  #ec-cert-root .cert-inner {
    position: relative; z-index: 2; flex: 1; min-height: 0;
    display: flex; flex-direction: column; align-items: center;
    padding: 50px 90px 0;
  }

  #ec-cert-root .logo-row { display: flex; align-items: center; gap: 14px; }
  #ec-cert-root .logo-text { font-size: 56px; font-weight: 800; color: #fff; letter-spacing: -0.01em; }
  #ec-cert-root .logo-text .accent { color: #22c55e; }
  #ec-cert-root .tagline { margin-top: 4px; font-size: 17px; font-weight: 500; color: #8a9590; letter-spacing: 0.35em; }

  #ec-cert-root .divider { display: flex; align-items: center; gap: 10px; margin: 18px 0; width: 100%; max-width: 440px; }
  #ec-cert-root .divider .line { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, rgba(34,197,94,0.5), transparent); }
  #ec-cert-root .divider .diamond { width: 7px; height: 7px; background: #4ade80; transform: rotate(45deg); border-radius: 1px; box-shadow: 0 0 8px rgba(74,222,128,0.8); }

  #ec-cert-root .heading-row { display: flex; align-items: center; gap: 22px; margin-bottom: 14px; }
  #ec-cert-root .heading-row .line { width: 90px; height: 1px; background: linear-gradient(90deg, transparent, rgba(150,160,155,0.6)); }
  #ec-cert-root .heading-row .line.right { background: linear-gradient(90deg, rgba(150,160,155,0.6), transparent); }
  #ec-cert-root .heading-text { font-size: 26px; font-weight: 600; color: #eef1ef; letter-spacing: 0.32em; }

  #ec-cert-root .sub { font-size: 22px; color: #9aa39e; font-weight: 400; margin-bottom: 12px; }

  #ec-cert-root .name {
    font-size: 78px; font-weight: 800; line-height: 1;
    color: #34d399;
    padding: 0 10px 14px; max-width: 1250px; text-align: center;
  }

  #ec-cert-root .sub2 { font-size: 21px; color: #9aa39e; margin-top: 8px; margin-bottom: 18px; }

  #ec-cert-root .pill {
    display: flex; align-items: center; gap: 14px;
    padding: 16px 38px; border-radius: 50px;
    border: 1.5px solid rgba(139,92,246,0.55);
    background: rgba(139,92,246,0.06);
    box-shadow: 0 0 24px rgba(139,92,246,0.18), inset 0 0 20px rgba(139,92,246,0.06);
    margin-bottom: 34px;
  }
  #ec-cert-root .pill-text { font-size: 25px; font-weight: 700; color: #fff; }

  #ec-cert-root .stats-row { display: flex; align-items: center; gap: 0; margin-bottom: 20px; }
  #ec-cert-root .stat { display: flex; align-items: center; gap: 14px; padding: 0 42px; }
  #ec-cert-root .stat-icon-wrap {
    width: 50px; height: 50px; border-radius: 50%; flex-shrink: 0;
    border: 1.5px solid rgba(74,222,128,0.5); background: rgba(74,222,128,0.05);
    display: flex; align-items: center; justify-content: center; color: #4ade80;
  }
  #ec-cert-root .stat-label { font-size: 13px; font-weight: 600; color: #8a9590; letter-spacing: 0.1em; }
  #ec-cert-root .stat-value { font-size: 24px; font-weight: 700; color: #4ade80; margin-top: 2px; }
  #ec-cert-root .stat-sep { width: 1px; height: 56px; background: rgba(255,255,255,0.1); }

  #ec-cert-root .footer-row {
    display: flex; align-items: center; width: 100%; max-width: 1320px;
    padding-top: 30px; border-top: 1px solid rgba(255,255,255,0.08);
    margin-top: auto; margin-bottom: 28px;
  }
  #ec-cert-root .footer-col { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 0 18px; }
  #ec-cert-root .footer-sep { width: 1px; height: 80px; background: rgba(255,255,255,0.08); }

  #ec-cert-root .sig-name { font-family: 'Caveat', cursive; font-size: 42px; font-weight: 700; color: #fff; align-self: flex-start; }
  #ec-cert-root .sig-line { width: 100%; height: 1.5px; background: linear-gradient(90deg, #22c55e, transparent); margin: 6px 0; }
  #ec-cert-root .sig-caption { font-size: 12px; font-weight: 600; color: #4ade80; letter-spacing: 0.12em; align-self: flex-start; }
  #ec-cert-root .footer-col.sig { align-items: flex-start; }

  #ec-cert-root .badge-seal {
    width: 96px; height: 96px; border-radius: 50%; position: relative;
    border: 2px solid #22c55e; background: radial-gradient(circle, rgba(34,197,94,0.12), transparent 70%);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    box-shadow: 0 0 0 4px rgba(34,197,94,0.08), 0 0 18px rgba(34,197,94,0.25);
  }
  #ec-cert-root .badge-seal::before {
    content: ''; position: absolute; inset: -7px; border-radius: 50%;
    border: 1.5px dashed rgba(34,197,94,0.45);
  }
  #ec-cert-root .badge-stars { font-size: 11px; color: #4ade80; letter-spacing: 3px; margin-bottom: 2px; }
  #ec-cert-root .badge-verified { font-size: 14px; font-weight: 800; color: #fff; letter-spacing: 0.04em; }
  #ec-cert-root .badge-sub { font-size: 10px; font-weight: 700; color: #4ade80; letter-spacing: 0.1em; margin-top: 1px; }

  #ec-cert-root .id-label { font-size: 12px; font-weight: 600; color: #8a9590; letter-spacing: 0.12em; margin-bottom: 6px; }
  #ec-cert-root .id-value { font-size: 21px; font-weight: 700; color: #4ade80; }
  #ec-cert-root .id-line { width: 70px; height: 1px; background: rgba(255,255,255,0.15); margin: 9px 0; }
  #ec-cert-root .id-url { font-size: 12px; color: #6b756f; }

  #ec-cert-root .qr-box {
    width: 92px; height: 92px; background: #fff; border-radius: 10px; padding: 6px;
    display: flex; align-items: center; justify-content: center;
  }
  #ec-cert-root .qr-box img { width: 100%; height: 100%; }
  #ec-cert-root .qr-caption { font-size: 11px; font-weight: 600; color: #4ade80; letter-spacing: 0.08em; margin-top: 8px; }

  #ec-cert-root .bottom-bar {
    position: relative; z-index: 2; height: 56px; flex-shrink: 0;
    background: rgba(255,255,255,0.02); border-top: 1px solid rgba(255,255,255,0.06);
    display: flex; align-items: center; justify-content: center; gap: 18px;
    font-size: 13.5px; color: #8a9590;
  }
  #ec-cert-root .bottom-bar .sep { color: rgba(255,255,255,0.15); }
  #ec-cert-root .bottom-bar .ic { color: #4ade80; }
</style>

<div id="ec-cert-root">
  <div class="dot-grid tl"></div>
  <div class="dot-grid tr"></div>

  <svg class="frame-svg" viewBox="0 0 1500 1000" preserveAspectRatio="none">
    <defs>
      <linearGradient id="frameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#22c55e"/>
        <stop offset="50%" stop-color="#16a34a"/>
        <stop offset="100%" stop-color="#7c3aed"/>
      </linearGradient>
    </defs>
    <path d="M 70 25 L 1390 25 L 1475 90 L 1475 905 L 1410 975 L 90 975 L 25 910 L 25 95 Z"
          fill="none" stroke="url(#frameGrad)" stroke-width="2.5" opacity="0.85"/>
    <path d="M 5 60 L 5 95 L 25 95" fill="none" stroke="#22c55e" stroke-width="2" opacity="0.55"/>
    <path d="M 1495 60 L 1495 90 L 1475 90" fill="none" stroke="#7c3aed" stroke-width="2" opacity="0.55"/>
    <path d="M 5 940 L 5 910 L 25 910" fill="none" stroke="#22c55e" stroke-width="2" opacity="0.55"/>
    <path d="M 1495 940 L 1495 975 L 1475 975" fill="none" stroke="#7c3aed" stroke-width="2" opacity="0.55"/>
  </svg>

  <div class="cert-inner">
    <div class="logo-row">
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
        <path d="M3 6.5C3 6.5 6 5 9 5.5C11 5.8 12 7 12 7V18C12 18 10.5 17 9 17C6.5 17 3 18 3 18V6.5Z" fill="#22c55e" opacity="0.85"/>
        <path d="M21 6.5C21 6.5 18 5 15 5.5C13 5.8 12 7 12 7V18C12 18 13.5 17 15 17C17.5 17 21 18 21 18V6.5Z" fill="#22c55e" opacity="0.85"/>
        <path d="M12 2 L12 5" stroke="#22c55e" stroke-width="1.5"/>
        <circle cx="12" cy="2.5" r="1.5" fill="#22c55e"/>
      </svg>
      <div class="logo-text">Edu<span class="accent">Crush</span></div>
    </div>
    <div class="tagline">SHAPE YOUR FUTURE</div>

    <div class="divider"><div class="line"></div><div class="diamond"></div><div class="line"></div></div>

    <div class="heading-row">
      <div class="line"></div>
      <div class="heading-text">CERTIFICATE OF ACHIEVEMENT</div>
      <div class="line right"></div>
    </div>

    <div class="sub">This is to certify that</div>
    <div class="name">${name}</div>

    <div class="sub2">has been recognized as an</div>
    <div class="pill">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z"/>
        <path d="M17 5h2a2 2 0 0 1 2 2 4 4 0 0 1-4 4M7 5H5a2 2 0 0 0-2 2 4 4 0 0 0 4 4"/>
      </svg>
      <span class="pill-text">EduCrush Ambassador Program</span>
    </div>

    <div class="stats-row">
      <div class="stat">
        <div class="stat-icon-wrap">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </div>
        <div><div class="stat-label">POINTS EARNED</div><div class="stat-value">${data.points}</div></div>
      </div>
      <div class="stat-sep"></div>
      <div class="stat">
        <div class="stat-icon-wrap">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <div><div class="stat-label">REFERRALS</div><div class="stat-value">${data.referrals}</div></div>
      </div>
      <div class="stat-sep"></div>
      <div class="stat">
        <div class="stat-icon-wrap">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
        </div>
        <div><div class="stat-label">ISSUED ON</div><div class="stat-value">${data.dateStr}</div></div>
      </div>
    </div>

    <div class="footer-row">
      <div class="footer-col sig">
        <div class="sig-name">Aman Singh</div>
        <div class="sig-line"></div>
        <div class="sig-caption">FOUNDER, EDUCRUSH</div>
      </div>
      <div class="footer-sep"></div>
      <div class="footer-col">
        <div class="badge-seal">
          <div class="badge-stars">★ ★ ★</div>
          <div class="badge-verified">VERIFIED</div>
          <div class="badge-sub">EDUCRUSH</div>
        </div>
      </div>
      <div class="footer-sep"></div>
      <div class="footer-col">
        <div class="id-label">CERTIFICATE ID</div>
        <div class="id-value">${data.certId}</div>
        <div class="id-line"></div>
        <div class="id-url">educrush.in/verify</div>
      </div>
      <div class="footer-sep"></div>
      <div class="footer-col">
        <div class="qr-box"><img src="${data.qrDataUrl}" /></div>
        <div class="qr-caption">SCAN TO VERIFY</div>
      </div>
    </div>
  </div>

  <div class="bottom-bar">
    <span class="ic">🌐</span> www.educrush.in
    <span class="sep">|</span>
    <span class="ic">✉</span> educrushofficial@gmail.com
  </div>
</div>
`
}