import { useState } from 'react';
import { T, shadow, eyebrow, sectionTitle } from './tokens';
import { TESTIMONIALS } from './data';
import { IMG } from './images';
import { useBreakpoint, rPad, rW } from '../../hooks/useBreakpoint';

const TESTI_PHOTOS = {
  'Sarah Mitchell': IMG.sarahMitchell,
  'Pierre Dubois':  IMG.pierreDubois,
  'Aiko Tanaka':    IMG.aikoTanaka,
};

function TestiCard({ t, featured }) {
  const [hov, setHov] = useState(false);

  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ background: featured ? `linear-gradient(145deg,${T.ink},#2A2320)` : T.w, borderRadius: 20, padding: 28, border: `1.5px solid ${hov ? 'rgba(196,119,58,.45)' : featured ? 'rgba(196,119,58,.2)' : T.bs}`, boxShadow: hov ? shadow.lg : featured ? '0 8px 32px rgba(28,25,21,.18)' : 'none', transition: '.22s', position: 'relative', overflow: 'hidden', transform: hov ? 'translateY(-4px)' : 'none' }}>
      <div style={{ position: 'absolute', top: -14, right: -4, fontFamily: "'Playfair Display',serif", fontSize: 130, fontWeight: 900, lineHeight: 1, color: featured ? 'rgba(196,119,58,.12)' : 'rgba(196,119,58,.07)', pointerEvents: 'none', userSelect: 'none' }}>"</div>
      <div style={{ color: T.t, fontSize: 12, letterSpacing: 3, marginBottom: 16 }}>{t.rating}</div>
      <p style={{ fontSize: 15, color: featured ? 'rgba(255,255,255,.85)' : T.is, lineHeight: 1.8, fontStyle: 'italic', marginBottom: 26, fontFamily: "'Playfair Display',serif", fontWeight: 600, position: 'relative', zIndex: 1 }}>{t.quote}</p>
      <div style={{ height: 1, background: featured ? 'rgba(255,255,255,.08)' : T.bs, marginBottom: 18 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
        {TESTI_PHOTOS[t.name] ? (
          <div style={{ width: 48, height: 48, borderRadius: 12, overflow: 'hidden', flexShrink: 0, border: `2px solid ${featured ? 'rgba(196,119,58,.4)' : 'rgba(196,119,58,.2)'}` }}>
            <img src={TESTI_PHOTOS[t.name]} alt={t.name} loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
          </div>
        ) : (
          <div style={{ width: 48, height: 48, borderRadius: 12, background: t.bg, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, flexShrink: 0 }}>{t.initial}</div>
        )}
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: featured ? '#fff' : T.ink }}>{t.name}</div>
          <div style={{ fontSize: 12, color: featured ? 'rgba(255,255,255,.45)' : T.mu, marginTop: 2 }}>{t.role}</div>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const bp   = useBreakpoint();
  const cols = bp.isMobile ? '1fr' : bp.isTablet ? 'repeat(2,1fr)' : 'repeat(3,1fr)';

  return (
    <section style={{ background: T.c, padding: rPad(bp) }}>
      <div style={{ ...rW }}>
        <div style={{ marginBottom: 36, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={eyebrow}>Customer Stories</div>
            <h2 style={sectionTitle}>Trusted by global buyers</h2>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 800, color: T.ink, lineHeight: 1 }}>4.9 / 5</div>
            <div style={{ color: T.t, fontSize: 12, letterSpacing: 2 }}>★★★★★</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 18 }}>
          {TESTIMONIALS.map((t, i) => <TestiCard key={t.name} t={t} featured={!bp.isMobile && i === 1} />)}
        </div>
      </div>
    </section>
  );
}
