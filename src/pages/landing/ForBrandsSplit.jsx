import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleLogin } from '../../features/auth/authSlice';
import { T, eyebrow, btnPrimary, btnGhost } from './tokens';
import { BRAND_PERKS, BRAND_METRICS } from './data';
import { IMG } from './images';
import { useBreakpoint } from '../../hooks/useBreakpoint';

export default function ForBrandsSplit() {
  const dispatch  = useDispatch();
  const bp        = useBreakpoint();
  const [hovApply, setHovApply] = useState(false);
  const [hovLearn, setHovLearn] = useState(false);
  const openLogin = () => dispatch(toggleLogin(true));

  const pad = bp.isMobile ? '52px 18px' : bp.isTablet ? '64px 32px' : '0 56px';

  return (
    <div style={{ background: T.cd, padding: bp.isMobile || bp.isTablet ? pad : '0 56px', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: bp.isMobile ? '1fr' : bp.isTablet ? '1fr' : '1fr 1fr', minHeight: bp.isMobile ? 'auto' : 560 }}>

        {/* Left — text */}
        <div style={{ padding: bp.isMobile ? '0' : bp.isTablet ? '64px 0' : '80px 64px 80px 0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ ...eyebrow, marginBottom: 12 }}>For Suppliers</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: bp.isMobile ? '28px' : 'clamp(28px,3vw,44px)', fontWeight: 700, color: T.ink, letterSpacing: -1.2, lineHeight: 1.1, marginBottom: 14 }}>
            Grow your brand.<br/>Reach new buyers.
          </h2>
          <p style={{ fontSize: 14, color: T.mu, lineHeight: 1.8, marginBottom: 28, maxWidth: 400 }}>
            List your products, manage RFQs, and transact with thousands of buyers across India and beyond — all in one platform.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
            {BRAND_PERKS.map(p => (
              <div key={p.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 13 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: T.tl, border: '1.5px solid rgba(196,119,58,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>{p.icon}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.ink, marginBottom: 2 }}>{p.title}</div>
                  <div style={{ fontSize: 13, color: T.mu, lineHeight: 1.55 }}>{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button onClick={openLogin} onMouseEnter={() => setHovApply(true)} onMouseLeave={() => setHovApply(false)} style={{ ...btnPrimary, flex: bp.isMobile ? '1 1 auto' : 'none', justifyContent: 'center', ...(hovApply ? { background: `linear-gradient(135deg,${T.td},#8A5226)`, transform: 'translateY(-1px)' } : {}) }}>Apply as a brand</button>
            <button onClick={openLogin} onMouseEnter={() => setHovLearn(true)} onMouseLeave={() => setHovLearn(false)} style={{ ...btnGhost, flex: bp.isMobile ? '1 1 auto' : 'none', justifyContent: 'center', border: `1.5px solid ${T.b}`, ...(hovLearn ? { borderColor: T.t, background: T.tl, color: T.t } : {}) }}>Learn more</button>
          </div>
        </div>

        {/* Right — photo + metrics (hidden on mobile as standalone section, but shown stacked) */}
        {!bp.isMobile && (
          <div style={{ margin: bp.isTablet ? '32px -32px -64px' : '0 -56px 0 0', position: 'relative', overflow: 'hidden', minHeight: bp.isTablet ? 360 : 'auto' }}>
            <img src={IMG.artisanWeaving} alt="Indian artisan at work — supplier on Globrixa" loading="lazy" decoding="async" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(145deg,rgba(20,16,12,.88) 0%,rgba(36,28,20,.82) 100%)' }} />
            <div style={{ position: 'absolute', top: -120, right: -120, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(196,119,58,.18),transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1, padding: bp.isTablet ? '40px 32px' : '80px 56px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12 }}>
              {BRAND_METRICS.map(m => (
                <div key={m.num} onClick={openLogin} style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 16, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, backdropFilter: 'blur(8px)', cursor: 'pointer', transition: 'background .2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.06)'; }}
                >
                  <div style={{ width: 46, height: 46, background: 'rgba(196,119,58,.18)', borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0, border: '1px solid rgba(196,119,58,.25)' }}>{m.icon}</div>
                  <div>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 700, color: '#fff', lineHeight: 1, marginBottom: 4 }}>{m.num}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,.45)', lineHeight: 1.4 }}>{m.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
