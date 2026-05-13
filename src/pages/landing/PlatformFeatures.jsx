import { useState } from 'react';
import { T, W, eyebrow, sectionTitle } from './tokens';
import { FEATURES } from './data';

function FeatureBlock({ f, i }) {
  const [hov, setHov] = useState(false);
  const col = i % 3;
  const row = Math.floor(i / 3);
  const tl = i === 0 ? 16 : 0;
  const tr = i === 2 ? 16 : 0;
  const bl = i === 3 ? 16 : 0;
  const br = i === 5 ? 16 : 0;
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      background: T.w, padding: '36px 32px',
      borderRadius: `${tl}px ${tr}px ${br}px ${bl}px`,
      borderTop: `${row > 0 ? 1 : 3}px solid ${hov && row === 0 ? T.t : row === 0 ? T.t : T.bs}`,
      borderLeft: col > 0 ? `1px solid ${T.bs}` : 'none',
      transition: '.18s',
    }}>
      <div style={{ width: 52, height: 52, borderRadius: 12, background: f.iconBg, border: `1.5px solid ${f.iconBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 18 }}>{f.icon}</div>
      <div style={{ fontSize: 17, fontWeight: 700, color: T.ink, marginBottom: 8 }}>{f.title}</div>
      <p style={{ fontSize: 14, color: T.mu, lineHeight: 1.78 }}>{f.desc}</p>
    </div>
  );
}

export default function PlatformFeatures() {
  return (
    <section style={{ background: T.c, padding: '80px 56px' }}>
      <div style={{ ...W }}>
        <div style={{ marginBottom: 36 }}>
          <div style={eyebrow}>Why Globrixa</div>
          <h2 style={sectionTitle}>Built for B2B, built for India</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2 }}>
          {FEATURES.map((f, i) => <FeatureBlock key={f.title} f={f} i={i} />)}
        </div>
      </div>
    </section>
  );
}
