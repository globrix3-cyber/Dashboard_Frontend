import { useState } from 'react';
import { T, shadow, W, eyebrow, sectionTitle, viewAll, tag } from './tokens';
import { BRANDS } from './data';
import { IMG } from './images';

const BRAND_PHOTOS = {
  'Artisan Textiles Co.': IMG.jaisalmerTextiles,
  'Heritage Handicrafts':  IMG.ceramicKitchenware,
  'Punjab Agro Foods':     IMG.wheatFieldIndia,
  'TechParts India':       IMG.factoryAssembly,
};

function BrandCard({ b }) {
  const [hov,    setHov]    = useState(false);
  const [ctaHov, setCtaHov] = useState(false);
  const photo = BRAND_PHOTOS[b.name];

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: T.w, borderRadius: 18,
        border: `1.5px solid ${hov ? 'rgba(196,119,58,.35)' : T.bs}`,
        overflow: 'hidden', cursor: 'pointer',
        transform: hov ? 'translateY(-6px)' : 'none',
        boxShadow: hov ? `0 20px 50px rgba(28,25,21,.13)` : shadow.sm,
        transition: '.25s cubic-bezier(.22,.68,0,1.2)',
      }}
    >
      {/* Card header — photo or emoji */}
      <div style={{ height: 132, position: 'relative', overflow: 'hidden' }}>
        {photo ? (
          <>
            <img
              src={photo}
              alt={`${b.name} — verified Indian supplier`}
              loading="lazy"
              decoding="async"
              style={{
                width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center',
                transform: hov ? 'scale(1.07)' : 'scale(1)',
                transition: 'transform .5s ease',
                display: 'block',
              }}
            />
            <div style={{ position: 'absolute', inset: 0, background: hov ? 'rgba(18,14,10,.2)' : 'rgba(18,14,10,.06)', transition: '.25s' }} />
          </>
        ) : (
          <div style={{
            width: '100%', height: '100%',
            background: b.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 46,
            transform: hov ? 'scale(1.04)' : 'scale(1)',
            transition: 'transform .4s ease',
          }}>
            {b.emoji}
          </div>
        )}

        {/* Verified badge */}
        <span style={{
          position: 'absolute', top: 11, right: 11,
          fontSize: 9, fontWeight: 700, padding: '4px 10px', borderRadius: 20,
          backdropFilter: 'blur(8px)',
          letterSpacing: '.04em',
          ...b.badgeStyle,
        }}>
          {b.badge}
        </span>

        {/* Hover overlay chip */}
        {hov && photo && (
          <div style={{ position: 'absolute', bottom: 12, left: 12 }}>
            <span style={{ background: 'rgba(255,255,255,.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,.25)', color: '#fff', fontSize: 9, fontWeight: 700, padding: '4px 10px', borderRadius: 20 }}>
              View Catalog →
            </span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div style={{ padding: '16px 18px 18px' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: T.ink, marginBottom: 3 }}>{b.name}</div>
        <div style={{ fontSize: 12, color: T.mu, marginBottom: 12 }}>{b.loc}</div>
        <div style={{ display: 'flex', gap: 12, padding: '10px 0', borderTop: `1px solid ${T.bs}`, borderBottom: `1px solid ${T.bs}`, marginBottom: 12 }}>
          {[['Products', b.products], ['Rating', b.rating], ['Min order', b.min]].map(([l, v]) => (
            <div key={l}>
              <div style={{ fontSize: 14, fontWeight: 800, color: T.ink }}>{v}</div>
              <div style={{ fontSize: 9, color: T.mu, marginTop: 1 }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 14 }}>
          {b.tags.map(({ v, l }) => <span key={l} style={tag(v)}>{l}</span>)}
        </div>
        <button
          onMouseEnter={() => setCtaHov(true)}
          onMouseLeave={() => setCtaHov(false)}
          style={{
            width: '100%', padding: '10px 0',
            background: ctaHov ? T.t : T.tl,
            color: ctaHov ? '#fff' : T.t,
            border: `1.5px solid ${ctaHov ? T.t : 'rgba(196,119,58,.3)'}`,
            borderRadius: 8, fontSize: 12, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'inherit', transition: '.18s',
            boxShadow: ctaHov ? '0 4px 14px rgba(196,119,58,.3)' : 'none',
          }}
        >
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
