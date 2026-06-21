import type { Metadata } from 'next'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'

interface Props {
  params: Promise<{ certId: string }>
}

export const metadata: Metadata = {
  title: 'Certificate Verification — EduCrush',
  description: 'Verify the authenticity of an EduCrush Ambassador certificate.',
  robots: { index: false },
}

async function getCertificate(certId: string) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
  )

  const { data } = await supabase
    .from('ambassador_certificates')
    .select('cert_id, full_name, issued_at')
    .eq('cert_id', certId)
    .maybeSingle()

  return data
}

export default async function VerifyPage({ params }: Props) {
  const { certId } = await params
  const cert = await getCertificate(certId)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

        nav, header, footer { display: none !important; }

        #verify-root, #verify-root * { font-family: 'Poppins', sans-serif; box-sizing: border-box; }
        #verify-root { margin: 0; padding: 0; }

        @keyframes pulse-glow { 0%, 100% { opacity: 0.35; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.08); } }
        @keyframes fade-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes check-pop { 0% { transform: scale(0); opacity: 0; } 60% { transform: scale(1.12); } 100% { transform: scale(1); opacity: 1; } }

        .v-card { animation: fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .v-icon { animation: check-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both; }
      `}</style>

      <div id="verify-root" style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        minHeight: '100vh', background: '#050807', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20, overflow: 'auto',
      }}>
        <div style={{
          position: 'fixed', top: '34%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 560, height: 560, borderRadius: '50%',
          background: cert
            ? 'radial-gradient(circle, rgba(34,197,94,0.18) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(239,68,68,0.13) 0%, transparent 70%)',
          filter: 'blur(80px)', pointerEvents: 'none',
          animation: 'pulse-glow 5s ease-in-out infinite',
        }} />
        <div style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', opacity: 0.35,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />

        <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 440, textAlign: 'center', padding: '40px 0' }}>

          {/* Logo — matches login page style exactly: text only, no icon */}
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: 44 }}>
            <span style={{ fontSize: 26, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>
              Edu<span style={{ color: '#34d399' }}>Crush</span>
            </span>
          </Link>

          {/* Gradient border frame */}
          <div style={{
            position: 'relative', borderRadius: 22, padding: 1.5,
            background: cert
              ? 'linear-gradient(160deg, rgba(74,222,128,0.35), rgba(74,222,128,0.02) 45%)'
              : 'linear-gradient(160deg, rgba(248,113,113,0.3), rgba(248,113,113,0.02) 45%)',
          }}>
            <div className="v-card" style={{
              borderRadius: 20.5, padding: '40px 32px',
              background: 'linear-gradient(180deg, #0a0f0c, #070a08)',
              border: '1px solid rgba(255,255,255,0.04)',
            }}>
              {cert ? (
                <>
                  {/* Concentric ring badge */}
                  <div className="v-icon" style={{ position: 'relative', width: 84, height: 84, margin: '0 auto 22px' }}>
                    <svg width="84" height="84" viewBox="0 0 84 84" style={{ position: 'absolute', top: 0, left: 0 }}>
                      <circle cx="42" cy="42" r="40" fill="none" stroke="rgba(74,222,128,0.15)" strokeWidth="1.5" />
                      <circle cx="42" cy="42" r="33" fill="none" stroke="rgba(74,222,128,0.08)" strokeWidth="1" />
                    </svg>
                    <div style={{
                      position: 'absolute', inset: 14, borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(34,197,94,0.25), rgba(34,197,94,0.05))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 0 40px rgba(34,197,94,0.22)',
                    }}>
                      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        <path d="M9 12l2 2 4-4"/>
                      </svg>
                    </div>
                  </div>

                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.25)',
                    borderRadius: 20, padding: '5px 14px', marginBottom: 20,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80' }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#4ade80', letterSpacing: '0.1em' }}>
                      VERIFIED CERTIFICATE
                    </span>
                  </div>

                  <h1 style={{ fontSize: 25, fontWeight: 650, color: '#fff', marginBottom: 6, letterSpacing: '-0.02em' }}>
                    {cert.full_name}
                  </h1>
                  <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.4)', marginBottom: 28, lineHeight: 1.5 }}>
                    is a certified{' '}
                    <span style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>EduCrush Student Ambassador</span>
                  </p>

                  <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(74,222,128,0.25), transparent)', marginBottom: 24 }} />

                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ flex: 1, textAlign: 'left', paddingRight: 16 }}>
                      <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', marginBottom: 7 }}>
                        CERTIFICATE ID
                      </p>
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.01em' }}>
                        {cert.cert_id}
                      </p>
                    </div>
                    <div style={{ width: 1, height: 34, background: 'rgba(255,255,255,0.08)' }} />
                    <div style={{ flex: 1, textAlign: 'right', paddingLeft: 16 }}>
                      <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', marginBottom: 7 }}>
                        ISSUED ON
                      </p>
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>
                        {new Date(cert.issued_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="v-icon" style={{ position: 'relative', width: 84, height: 84, margin: '0 auto 22px' }}>
                    <svg width="84" height="84" viewBox="0 0 84 84" style={{ position: 'absolute', top: 0, left: 0 }}>
                      <circle cx="42" cy="42" r="40" fill="none" stroke="rgba(248,113,113,0.15)" strokeWidth="1.5" />
                      <circle cx="42" cy="42" r="33" fill="none" stroke="rgba(248,113,113,0.08)" strokeWidth="1" />
                    </svg>
                    <div style={{
                      position: 'absolute', inset: 14, borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(239,68,68,0.2), rgba(239,68,68,0.04))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 0 40px rgba(239,68,68,0.15)',
                    }}>
                      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                    </div>
                  </div>

                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)',
                    borderRadius: 20, padding: '5px 14px', marginBottom: 20,
                  }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#f87171', letterSpacing: '0.1em' }}>
                      CERTIFICATE NOT FOUND
                    </span>
                  </div>

                  <h1 style={{ fontSize: 19, fontWeight: 600, color: '#fff', marginBottom: 12 }}>
                    We couldn't verify this certificate
                  </h1>
                  <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, marginBottom: 4 }}>
                    The ID{' '}
                    <span style={{
                      color: '#e2e8f0', fontFamily: 'ui-monospace, monospace', fontSize: 12.5,
                      background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: 6,
                    }}>
                      {certId}
                    </span>{' '}
                    doesn't match any certificate in our system.
                  </p>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 16 }}>
                    Think this is a mistake?{' '}
                    <a href="mailto:educrushofficial@gmail.com" style={{ color: '#4ade80', textDecoration: 'none' }}>
                      Contact us
                    </a>
                  </p>
                </>
              )}
            </div>
          </div>

          <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.2)', marginTop: 26, letterSpacing: '0.01em' }}>
            Issued through the EduCrush Student Ambassador Program
          </p>
        </div>
      </div>
    </>
  )
}