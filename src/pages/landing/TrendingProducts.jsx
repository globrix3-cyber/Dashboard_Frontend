import { useState } from 'react';
import { T, shadow, W, eyebrow, sectionTitle, viewAll } from './tokens';
import { TRENDING_PRODUCTS } from './data';

function ProductCard({ item }) {
  const [hov, setHov] = useState(false);
  const [qHov, setQHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ background: T.w, borderRadius: 14, overflow: 'hidden', border: `1.5px solid ${T.bs}`, transform: hov ? 'translateY(-4px)' : 'none', boxShadow: hov ? shadow.md : 'none', transition: '.22s', cursor: 'pointer' }}>
      <div style={{ height: 148, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 46, position: 'relative' }}>
        {item.emoji}
        {item.badge && <span style={{ position: 'absolute', top: 9, left: 9, background: item.badgeBg, color: '#fff', fontSize: 8, fontWeight: 800, padding: '3px 9px', borderRadius: 5 }}>{item.badge}</span>}
        <span style={{ position: 'absolute', top: 9, right: 9, background: 'rgba(255,255,255,.92)', backdropFilter: 'blur(4px)', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, boxShadow: shadow.sm }}>♡</span>
      </div>
      <div style={{ padding: '12px 14px 14px' }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: T.t, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>{item.brand}</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.ink, marginBottom: 6, lineHeight: 1.3 }}>{item.name}</div>
        <div style={{ fontSize: 10, color: T.mu, marginBottom: 7 }}>{item.moq}</div>
        <div style={{ fontSize: 16, fontWeight: 800, color: T.ink }}>{item.price}<small style={{ fontSize: 11, color: T.mu, fontWeight: 400 }}>{item.unit}</small></div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T.bs}` }}>
          <span style={{ fontSize: 10, color: T.mu }}>⭐ {item.rating}</span>
          <button onMouseEnter={() => setQHov(true)} onMouseLeave={() => setQHov(false)} style={{ fontSize: 10, fontWeight: 700, color: qHov ? '#fff' : T.t, background: qHov ? T.t : T.tl, border: 'none', borderRadius: 5, padding: '5px 11px', cursor: 'pointer', fontFamily: 'inherit', transition: '.15s' }}>Quote</button>
        </div>
      </div>
    </div>
  );
}

function SpotlightBanner() {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ gridColumn: 'span 2', background: 'linear-gradient(145deg,#1E3A28 0%,#12281A 100%)', borderRadius: 14, padding: '30px 26px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 320, cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(61,122,52,.3),transparent)', top: -100, right: -100, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle,rgba(196,119,58,.2),transparent)', bottom: -60, left: -60, pointerEvents: 'none' }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)', marginBottom: 10 }}>Spotlight Category</div>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 700, color: '#fff', lineHeight: 1.12, marginBottom: 10 }}>India's finest<br/>Agricultural<br/>produce</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,.58)', lineHeight: 1.65 }}>856 verified suppliers. Organic certified. Export-ready from farm to freight.</div>
      </div>
      <button style={{ position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', gap: 7, background: '#fff', color: '#1E3A28', fontSize: 12, fontWeight: 800, padding: '10px 20px', borderRadius: 8, fontFamily: 'inherit', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,.2)', transform: hov ? 'translateY(-1px)' : 'none', transition: '.18s' }}>
        Explore Agriculture →
      </button>
    </div>
  );
}

export default function TrendingProducts() {
  return (
    <section style={{ background: T.c, padding: '80px 56px' }}>
      <div style={{ ...W }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 36 }}>
          <div><div style={eyebrow}>Most ordered</div><h2 style={sectionTitle}>Trending Products</h2></div>
          <div style={viewAll}>Browse all →</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 14 }}>
          <SpotlightBanner />
          {TRENDING_PRODUCTS.map((item, i) => <ProductCard key={i} item={item} />)}
        </div>
      </div>
    </section>
  );
}
