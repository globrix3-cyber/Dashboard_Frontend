import { useState } from 'react';
import { T, shadow, W, eyebrow, sectionTitle, viewAll } from './tokens';
import { COLLECTIONS } from './data';

function CollectionCard({ item }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ borderRadius: 16, overflow: 'hidden', cursor: 'pointer', transform: hov ? 'translateY(-4px)' : 'none', boxShadow: hov ? shadow.lg : 'none', transition: '.22s', gridColumn: item.wide ? 'span 2' : 'span 1' }}>
      <div style={{ height: 200, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: item.wide ? 72 : 56, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 65% 35%,${item.glow},transparent 60%)` }} />
        <span style={{ position: 'relative', zIndex: 1 }}>{item.emoji}</span>
      </div>
      <div style={{ background: T.w, padding: '20px 22px', border: `1.5px solid ${T.bs}`, borderTop: 'none', borderRadius: '0 0 16px 16px' }}>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 19, fontWeight: 700, color: T.ink, marginBottom: 5 }}>{item.name}</div>
        <div style={{ fontSize: 13, color: T.mu, lineHeight: 1.65, marginBottom: 14 }}>{item.desc}</div>
        <div style={{ fontSize: 12, fontWeight: 700, color: T.t }}>Explore collection →</div>
      </div>
    </div>
  );
}

export default function CuratedCollections() {
  return (
    <section style={{ background: T.cm, padding: '80px 56px' }}>
      <div style={{ ...W }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 36 }}>
          <div>
            <div style={eyebrow}>Editor's Picks</div>
            <h2 style={sectionTitle}>Curated Collections</h2>
            <p style={{ fontSize: 14, color: T.mu, marginTop: 7 }}>Handpicked by our sourcing experts</p>
          </div>
          <div style={viewAll}>All collections →</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 16 }}>
          {COLLECTIONS.map(item => <CollectionCard key={item.name} item={item} />)}
        </div>
      </div>
    </section>
  );
}
