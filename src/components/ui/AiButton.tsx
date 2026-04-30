'use client'
import { usePathname } from 'next/navigation';

export default function AIButton() {
  const pathname = usePathname();

  // /ai page pr button nahi dikhega
  if (pathname === '/ai') return null;

  return (
    <>
      <style>{`
        @keyframes spin-gradient {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(38px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(38px) rotate(-360deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 10px #00E57688, 0 0 24px #00E57644; }
          50% { box-shadow: 0 0 18px #00E576bb, 0 0 40px #00E57666; }
        }
        .ai-btn-outer {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 58px;
          height: 58px;
          border-radius: 50%;
          cursor: pointer;
          transition: transform 0.3s;
        }
        .ai-btn-outer:hover { transform: scale(1.08); }
        .ai-btn-outer:active { transform: scale(1.0); }
        .spinning-ring {
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          overflow: hidden;
        }
        .spinning-ring::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: conic-gradient(from 0deg, #00E576, #00E57618, #57ff9a, #00E57618, #00E576);
          animation: spin-gradient 3s linear infinite;
        }
        .orbit-dot {
          position: absolute;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #afffcf, #00E576);
          box-shadow: 0 0 8px #00E576cc, 0 0 2px #fff8;
          top: -4.5px;
          left: -4.5px;
          animation: orbit 3s linear infinite;
        }
        .ai-btn-inner {
          position: relative;
          z-index: 2;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(145deg, #0a2318 0%, #0d2e1e 40%, #112b1a 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
          color: #00E576;
          letter-spacing: 1.5px;
          animation: pulse-glow 2.5s ease-in-out infinite;
          border: 1px solid #00E57640;
        }
        .glass-shine {
          position: absolute;
          top: 6px;
          left: 10px;
          width: 30px;
          height: 12px;
          border-radius: 50%;
          background: linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 100%);
          z-index: 3;
          pointer-events: none;
        }
      `}</style>

      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
      }}>
        <div className="ai-btn-outer" onClick={() => window.location.href = '/ai'}>
          <div style={{
            position: 'absolute',
            inset: '-20px',
            borderRadius: '50%',
            border: '1px dashed #00E57630',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 0,
            height: 0,
            zIndex: 10,
          }}>
            <div className="orbit-dot" />
          </div>
          <div className="spinning-ring" />
          <div className="ai-btn-inner">
            <div className="glass-shine" />
            AI
          </div>
        </div>

        <span style={{
          fontSize: '10px',
          fontWeight: '600',
          color: '#00E576',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          textShadow: '0 0 10px #00E576aa, 0 0 20px #00E57644',
        }}>
          AI
        </span>
      </div>
    </>
  );
}