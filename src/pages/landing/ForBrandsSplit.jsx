import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleLogin } from '../../features/auth/authSlice';
import { T, eyebrow, btnPrimary, btnGhost } from './tokens';
import { BRAND_PERKS, BRAND_METRICS } from './data';

export default function ForBrandsSplit() {
  const dispatch = useDispatch();
  const [hovApply, setHovApply] = useState(false);
  const [hovLearn, setHovLearn] = useState(false);

  return (
    <div style={{ background: T.cd, padding: '0 56px', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 580 }}>

        <div style={{ padding: '80px 64px 80px 0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ ...eyebrow, marginBottom: 14 }}>For Suppliers</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(30px,3vw,46px)', fontWeight: 700, color: T.ink, letterSpacing: -1.5, lineHeight: 1.1, marginBottom: 16 }}>Grow your brand.<br/>Reach new buyers.</h2>
          <p style={{ fontSize: 15, color: T.mu, lineHeight: 1.82, marginBottom: 36, maxWidth: 400 }}>List your products, manage RFQs, and transact with thousands of buyers across India and beyond — all in one platform.</p>
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
            <button onClick={() => dispatch(toggleLogin(true))} onMouseEnter={() => setHovApply(true)} onMouseLeave={() => setHovApply(false)}
              style={{ ...btnPrimary, ...(hovApply ? { background: `linear-gradient(135deg,${T.td},#8A5226)`, transform: 'translateY(-1px)' } : {}) }}>
              Apply as a brand
            </button>
            <button onMouseEnter={() => setHovLearn(true)} onMouseLeave={() => setHovLearn(false)}
              style={{ ...btnGhost, ...(hovLearn ? { borderColor: T.t, background: T.tl, color: T.t } : {}) }}>
              Learn more
            </button>
          </div>
        </div>

        <div style={{ background: 'linear-gradient(145deg,#1C1915,#2A2320)', margin: '0 -56px 0 0', padding: '80px 80px 80px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -150, right: -150, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(196,119,58,.14),transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'relative', zIndex: 1 }}>
            {BRAND_METRICS.map(m => (
              <div key={m.num} style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.09)', borderRadius: 14, padding: '22px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 50, height: 50, background: 'rgba(196,119,58,.14)', borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>{m.icon}</div>
                <div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700, color: '#fff', lineHeight: 1, marginBottom: 4 }}>{m.num}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,.42)' }}>{m.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
