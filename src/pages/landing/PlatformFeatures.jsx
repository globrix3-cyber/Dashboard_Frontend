import { useState } from 'react';
import { T, eyebrow, sectionTitle } from './tokens';
import { FEATURES } from './data';
import { useBreakpoint, rPad, rW } from '../../hooks/useBreakpoint';

function FeatureBlock({ f, bp }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: T.w,
        padding: bp.isMobile ? '26px 22px' : '36px 32px',
        border: `1.5px solid ${hov ? 'rgba(196,119,58,.3)' : T.bs}`,
        borderRadius: 16,
        transition: '.18s',
        boxShadow: hov ? '0 4px 20px rgba(28,25,21,.08)' : 'none',
      }}
    >
      <div style={{ width: 48, height: 48, borderRadius: 12, background: f.iconBg, border: `1.5px solid ${f.iconBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 16 }}>{f.icon}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: T.ink, marginBottom: 8 }}>{f.title}</div>
      <p style={{ fontSize: 14, color: T.mu, lineHeight: 1.78 }}>{f.desc}</p>
    </div>
  );
}

export default function PlatformFeatures() {
  const bp   = useBreakpoint();
  const cols = bp.isMobile ? '1fr' : bp.isTablet ? 'repeat(2,1fr)' : 'repeat(3,1fr)';

  return (
    <section style={{ background: T.c, padding: rPad(bp) }}>
      <div style={{ ...rW }}>
        <div style={{ marginBottom: 32 }}>
          <div style={eyebrow}>Why Globrixa</div>
          <h2 style={sectionTitle}>Built for B2B, built for India</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: cols, gap: bp.isMobile ? 12 : 2 }}>
          {FEATURES.map((f, i) => <FeatureBlock key={f.title} f={f} i={i} bp={bp} />)}
        </div>
      </div>
    </section>
  );
}
