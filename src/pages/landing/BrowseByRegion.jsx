import { useState } from 'react';
import { T, shadow, W, eyebrow, sectionTitle, viewAll, tag } from './tokens';
import { REGIONS } from './data';

function RegionCard({ r }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ background: r.bg, borderRadius: 14, padding: '26px 22px', cursor: 'pointer', border: `1.5px solid ${hov ? T.tm : r.border}`, transform: hov ? 'translateY(-3px)' : 'none', boxShadow: hov ? shadow.md : 'none', transition: '.2s' }}>
      <div style={{ fontSize: 32, marginBottom: 13 }}>{r.emoji}</div>
      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: T.ink, marginBottom: 6 }}>{r.name}</div>
      <div style={{ fontSize: 12, color: T.mu, lineHeight: 1.7, marginBottom: 12 }}>{r.cities}</div>
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
        {r.tags.map(([v, l]) => <span key={l} style={tag(v)}>{l}</span>)}
      </div>
    </div>
  );
}

export default function BrowseByRegion() {
  return (
    <section style={{ background: T.c, padding: '80px 56px' }}>
      <div style={{ ...W }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 36 }}>
          <div>
            <div style={eyebrow}>Pan-India Network</div>
            <h2 style={sectionTitle}>Browse by Region</h2>
            <p style={{ fontSize: 14, color: T.mu, marginTop: 7 }}>Every MSME hub. Every manufacturing cluster.</p>
          </div>
          <div style={viewAll}>View all cities →</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
          {REGIONS.map(r => <RegionCard key={r.name} r={r} />)}
        </div>
      </div>
    </section>
  );
}
