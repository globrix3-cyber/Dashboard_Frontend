import { useState } from 'react';
import { T, shadow, W, eyebrow, sectionTitle } from './tokens';
import { TESTIMONIALS } from './data';

function TestiCard({ t }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ background: T.w, borderRadius: 16, padding: 30, border: `1.5px solid ${hov ? 'rgba(196,119,58,.4)' : T.bs}`, boxShadow: hov ? shadow.md : 'none', transition: '.2s', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -20, right: -10, fontFamily: "'Playfair Display',serif", fontSize: 120, fontWeight: 900, color: 'rgba(196,119,58,.06)', lineHeight: 1, pointerEvents: 'none' }}>"</div>
      <div style={{ color: T.t, fontSize: 14, letterSpacing: 3, marginBottom: 16 }}>{t.rating}</div>
      <p style={{ fontSize: 15, color: T.is, lineHeight: 1.82, fontStyle: 'italic', marginBottom: 26, fontFamily: "'Playfair Display',serif", fontWeight: 600 }}>{t.quote}</p>
      <div style={{ height: 1, background: T.bs, marginBottom: 18 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 10, background: t.bg, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, flexShrink: 0 }}>{t.initial}</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.ink }}>{t.name}</div>
          <div style={{ fontSize: 12, color: T.mu }}>{t.role}</div>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section style={{ background: T.c, padding: '80px 56px' }}>
      <div style={{ ...W }}>
        <div style={{ marginBottom: 36 }}>
          <div style={eyebrow}>Customer Stories</div>
          <h2 style={sectionTitle}>Trusted by Indian businesses</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
          {TESTIMONIALS.map(t => <TestiCard key={t.name} t={t} />)}
        </div>
      </div>
    </section>
  );
}
