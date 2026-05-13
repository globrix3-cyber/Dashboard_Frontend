import { useState } from 'react';
import { T, shadow, W, eyebrow, sectionTitle, viewAll, tag } from './tokens';
import { BRANDS } from './data';

function BrandCard({ b }) {
  const [hov, setHov] = useState(false);
  const [ctaHov, setCtaHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ background: T.w, borderRadius: 16, border: `1.5px solid ${hov ? 'transparent' : T.bs}`, overflow: 'hidden', cursor: 'pointer', transform: hov ? 'translateY(-5px)' : 'none', boxShadow: hov ? shadow.lg : 'none', transition: '.22s' }}>
      <div style={{ height: 100, background: b.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44, position: 'relative' }}>
        {b.emoji}
        <span style={{ position: 'absolute', top: 10, right: 10, fontSize: 9, fontWeight: 700, padding: '4px 9px', borderRadius: 5, backdropFilter: 'blur(6px)', ...b.badgeStyle }}>{b.badge}</span>
      </div>
      <div style={{ padding: '16px 18px 18px' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: T.ink, marginBottom: 3 }}>{b.name}</div>
        <div style={{ fontSize: 12, color: T.mu, marginBottom: 12 }}>{b.loc}</div>
        <div style={{ display: 'flex', gap: 12, padding: '10px 0', borderTop: `1px solid ${T.bs}`, borderBottom: `1px solid ${T.bs}`, marginBottom: 12 }}>
          {[['Products', b.products], ['Rating', b.rating], ['Min order', b.min]].map(([l, v]) => (
            <div key={l}><div style={{ fontSize: 14, fontWeight: 800, color: T.ink }}>{v}</div><div style={{ fontSize: 9, color: T.mu, marginTop: 1 }}>{l}</div></div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 14 }}>
          {b.tags.map(({ v, l }) => <span key={l} style={tag(v)}>{l}</span>)}
        </div>
        <button onMouseEnter={() => setCtaHov(true)} onMouseLeave={() => setCtaHov(false)} style={{ width: '100%', padding: '10px 0', background: ctaHov ? T.t : T.tl, color: ctaHov ? '#fff' : T.t, border: `1.5px solid ${ctaHov ? T.t : 'rgba(196,119,58,.3)'}`, borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: '.18s', boxShadow: ctaHov ? '0 4px 14px rgba(196,119,58,.3)' : 'none' }}>
          View Catalog →
        </button>
      </div>
    </div>
  );
}

export default function FeaturedSuppliers() {
  return (
    <section style={{ background: T.cm, padding: '80px 56px' }}>
      <div style={{ ...W }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 36 }}>
          <div>
            <div style={eyebrow}>Curated for you</div>
            <h2 style={sectionTitle}>Featured Suppliers</h2>
            <p style={{ fontSize: 14, color: T.mu, marginTop: 7 }}>Verified, top-rated, ready to ship</p>
          </div>
          <div style={viewAll}>Browse all suppliers →</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          {BRANDS.map(b => <BrandCard key={b.name} b={b} />)}
        </div>
      </div>
    </section>
  );
}
