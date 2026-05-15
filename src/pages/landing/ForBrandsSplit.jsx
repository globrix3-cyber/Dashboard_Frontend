import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleLogin } from '../../features/auth/authSlice';
import { T, eyebrow, btnPrimary, btnGhost } from './tokens';
import { BRAND_PERKS, BRAND_METRICS } from './data';
import { IMG } from './images';

export default function ForBrandsSplit() {
  const dispatch = useDispatch();
  const [hovApply, setHovApply] = useState(false);
  const [hovLearn, setHovLearn] = useState(false);

  return (
    <div style={{ background: T.cd, padding: '0 56px', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 600 }}>

        {/* Left — text panel */}
        <div style={{ padding: '80px 64px 80px 0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ ...eyebrow, marginBottom: 14 }}>For Suppliers</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(30px,3vw,46px)', fontWeight: 700, color: T.ink, letterSpacing: -1.5, lineHeight: 1.1, marginBottom: 16 }}>
            Grow your brand.<br/>Reach new buyers.
          </h2>
          <p style={{ fontSize: 15, color: T.mu, lineHeight: 1.82, marginBottom: 36, maxWidth: 400 }}>
            List your products, manage RFQs, and transact with thousands of buyers across India and beyond — all in one platform.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 36 }}>
            {BRAND_PERKS.map(p => (
              <div key={p.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: T.tl, border: '1.5px solid rgba(196,119,58,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{p.icon}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.ink, marginBottom: 2 }}>{p.title}</div>
                  <div style={{ fontSize: 13, color: T.mu, lineHeight: 1.55 }}>{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => dispatch(toggleLogin(true))}
              onMouseEnter={() => setHovApply(true)} onMouseLeave={() => setHovApply(false)}
              style={{ ...btnPrimary, ...(hovApply ? { background: `linear-gradient(135deg,${T.td},#8A5226)`, transform: 'translateY(-1px)' } : {}) }}
            >
              Apply as a brand
            </button>
            <button
              onMouseEnter={() => setHovLearn(true)} onMouseLeave={() => setHovLearn(false)}
              style={{ ...btnGhost, ...(hovLearn ? { borderColor: T.t, background: T.tl, color: T.t } : {}) }}
            >
              Learn more
            </button>
          </div>
        </div>

        {/* Right — photo panel */}
        <div style={{ margin: '0 -56px 0 0', position: 'relative', overflow: 'hidden' }}>
          {/* Full-bleed photo */}
          <img
            src={IMG.artisanWeaving}
            alt="Indian artisan at work — supplier on Globrixa"
            loading="lazy"
            decoding="async"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
          />

          {/* Layered dark overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(145deg, rgba(20,16,12,.88) 0%, rgba(36,28,20,.82) 100%)' }} />

          {/* Warm radial glow */}
          <div style={{ position: 'absolute', top: -120, right: -120, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(196,119,58,.18),transparent 70%)', pointerEvents: 'none' }} />

          {/* Metric cards on top */}
          <div style={{ position: 'relative', zIndex: 1, padding: '80px 56px 80px 56px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
            {BRAND_METRICS.map(m => (
              <div key={m.num} style={{
                background: 'rgba(255,255,255,.06)',
                border: '1px solid rgba(255,255,255,.1)',
                borderRadius: 16, padding: '20px 22px',
                display: 'flex', alignItems: 'center', gap: 16,
                backdropFilter: 'blur(8px)',
                transition: 'background .2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.06)'; }}
              >
                <div style={{ width: 50, height: 50, background: 'rgba(196,119,58,.18)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0, border: '1px solid rgba(196,119,58,.25)' }}>
                  {m.icon}
                </div>
                <div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 700, color: '#fff', lineHeight: 1, marginBottom: 5 }}>{m.num}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,.45)', lineHeight: 1.4 }}>{m.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
