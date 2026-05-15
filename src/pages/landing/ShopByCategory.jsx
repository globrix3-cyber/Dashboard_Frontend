import { useState } from 'react';
import { T, shadow, W, eyebrow, sectionTitle, viewAll } from './tokens';
import { CAT_HERO, CAT_SUB } from './data';
import { IMG } from './images';

const CAT_IMAGES = {
  Textiles:    IMG.jaipurTextiles,
  Handicrafts: IMG.wovenBaskets,
  Agriculture: IMG.spicesMarket,
  Engineering: IMG.steelBolts,
};

function CatHeroCard({ item }) {
  const [hov, setHov] = useState(false);
  const photo = CAT_IMAGES[item.name];

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: 18, overflow: 'hidden', position: 'relative', cursor: 'pointer',
        aspectRatio: '3/4', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        transform: hov ? 'translateY(-6px)' : 'none',
        boxShadow: hov ? shadow.lg : shadow.sm,
        transition: '.28s cubic-bezier(.22,.68,0,1.2)',
      }}
    >
      {/* Background — photo or gradient */}
      {photo ? (
        <img
          src={photo}
          alt={`${item.name} category — Indian B2B marketplace`}
          loading="lazy"
          decoding="async"
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center',
            transform: hov ? 'scale(1.07)' : 'scale(1)',
            transition: 'transform .55s ease',
          }}
        />
      ) : (
        <div style={{
          position: 'absolute', inset: 0, background: item.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80,
          transform: hov ? 'scale(1.04)' : 'scale(1)', transition: '.4s',
        }}>
          {item.emoji}
        </div>
      )}

      {/* Gradient overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(18,14,10,.88) 0%, rgba(18,14,10,.22) 50%, rgba(18,14,10,.04) 100%)' }} />

      {/* Hover shimmer */}
      {hov && (
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(196,119,58,.12) 0%, transparent 60%)', pointerEvents: 'none' }} />
      )}

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, padding: '22px 20px' }}>
        {/* Category badge */}
        <div style={{ marginBottom: 10 }}>
          <span style={{
            display: 'inline-block',
            background: hov ? `rgba(196,119,58,.9)` : 'rgba(255,255,255,.12)',
            backdropFilter: 'blur(8px)',
            border: hov ? '1px solid rgba(196,119,58,.5)' : '1px solid rgba(255,255,255,.18)',
            color: '#fff', fontSize: 9, fontWeight: 800, padding: '4px 12px', borderRadius: 20,
            letterSpacing: '.1em', textTransform: 'uppercase', transition: '.22s',
          }}>{item.chip}</span>
        </div>

        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 5, lineHeight: 1.15 }}>{item.name}</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,.6)', marginBottom: 12 }}>{item.count}</div>

        {/* Arrow CTA on hover */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          color: hov ? T.tm : 'rgba(255,255,255,.45)',
          fontSize: 12, fontWeight: 600, transition: '.22s',
          transform: hov ? 'translateX(4px)' : 'none',
        }}>
          Browse {item.name} <span style={{ fontSize: 14 }}>→</span>
        </div>
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
