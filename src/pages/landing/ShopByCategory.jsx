import { useState } from 'react';
import { T, shadow, W, eyebrow, sectionTitle, viewAll } from './tokens';
import { CAT_HERO, CAT_SUB } from './data';

function CatHeroCard({ item }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ borderRadius: 16, overflow: 'hidden', position: 'relative', cursor: 'pointer', aspectRatio: '3/4', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', transform: hov ? 'translateY(-5px)' : 'none', boxShadow: hov ? shadow.lg : 'none', transition: '.25s' }}>
      <div style={{ position: 'absolute', inset: 0, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80, transform: hov ? 'scale(1.04)' : 'scale(1)', transition: '.4s' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(18,14,10,.82) 0%,rgba(18,14,10,.18) 55%,transparent 100%)' }} />
      <div style={{ position: 'relative', zIndex: 2, padding: '22px 20px' }}>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 21, fontWeight: 700, color: '#fff', marginBottom: 5, lineHeight: 1.15 }}>{item.name}</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,.68)', marginBottom: 10 }}>{item.count}</div>
        <div style={{ display: 'inline-block', background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,.18)', color: '#fff', fontSize: 10, fontWeight: 600, padding: '4px 12px', borderRadius: 5 }}>{item.chip}</div>
      </div>
    </div>
  );
}

function CatSubCard({ item, cta }) {
  const [hov, setHov] = useState(false);
  if (cta) return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ background: hov ? `linear-gradient(135deg,${T.td},#8A5226)` : `linear-gradient(135deg,${T.t},${T.td})`, borderRadius: 12, padding: '16px 10px', textAlign: 'center', cursor: 'pointer', border: `1.5px solid ${T.t}`, transition: '.18s', transform: hov ? 'translateY(-2px)' : 'none' }}>
      <div style={{ fontSize: 22, marginBottom: 7 }}>→</div>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#fff', marginBottom: 2 }}>View all 24</div>
      <div style={{ fontSize: 10, color: 'rgba(255,255,255,.75)' }}>categories</div>
    </div>
  );
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ background: hov ? T.tl : T.w, border: `1.5px solid ${hov ? T.t : T.bs}`, borderRadius: 12, padding: '16px 10px', textAlign: 'center', cursor: 'pointer', transform: hov ? 'translateY(-2px)' : 'none', boxShadow: hov ? shadow.sm : 'none', transition: '.18s' }}>
      <div style={{ fontSize: 26, marginBottom: 7 }}>{item.icon}</div>
      <div style={{ fontSize: 11, fontWeight: 700, color: T.ink, marginBottom: 2 }}>{item.name}</div>
      <div style={{ fontSize: 10, color: T.mu }}>{item.count}</div>
    </div>
  );
}

export default function ShopByCategory() {
  return (
    <section style={{ background: T.c, padding: '80px 56px 48px' }}>
      <div style={{ ...W }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 36 }}>
          <div>
            <div style={eyebrow}>Browse</div>
            <h2 style={sectionTitle}>Shop by Category</h2>
            <p style={{ fontSize: 14, color: T.mu, marginTop: 7 }}>24 categories · 5,000+ verified suppliers</p>
          </div>
          <div style={viewAll}>All categories →</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 12 }}>
          {CAT_HERO.map(item => <CatHeroCard key={item.name} item={item} />)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 10 }}>
          {CAT_SUB.map(item => <CatSubCard key={item.name} item={item} />)}
          <CatSubCard cta />
        </div>
      </div>
    </section>
  );
}
