import { useState } from 'react';
import { T, shadow, W, sectionTitle, viewAll } from './tokens';
import { NEW_THIS_WEEK } from './data';
import { IMG } from './images';

const ITEM_PHOTOS = {
  'Linen Kurta Fabric 58"':   IMG.fabricRolls,
  'Turmeric — Lakadong':      IMG.turmericPowder,
  'Precision Drill Bit Set':  IMG.metalParts,
  'Blue Pottery Vase':        IMG.blueCeramicVases,
  'Ashwagandha Root Powder':  IMG.herbalPowder,
  'Rose Attar Essential Oil': IMG.floralHerbs,
};

function MiniCard({ item }) {
  const [hov, setHov] = useState(false);
  const photo = ITEM_PHOTOS[item.name];

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: T.w, borderRadius: 12, overflow: 'hidden',
        border: `1.5px solid ${hov ? 'rgba(196,119,58,.3)' : T.bs}`,
        cursor: 'pointer',
        transform: hov ? 'translateY(-4px)' : 'none',
        boxShadow: hov ? shadow.md : 'none',
        transition: '.22s cubic-bezier(.22,.68,0,1.2)',
      }}
    >
      {/* Image / emoji header */}
      <div style={{ height: 118, position: 'relative', overflow: 'hidden' }}>
        {photo ? (
          <>
            <img
              src={photo}
              alt={item.name}
              loading="lazy"
              decoding="async"
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                transform: hov ? 'scale(1.08)' : 'scale(1)',
                transition: 'transform .5s ease', display: 'block',
              }}
            />
            <div style={{ position: 'absolute', inset: 0, background: hov ? 'rgba(18,14,10,.12)' : 'rgba(18,14,10,.04)', transition: '.22s' }} />
          </>
        ) : (
          <div style={{ width: '100%', height: '100%', background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>
            {item.emoji}
          </div>
        )}

        {/* NEW badge */}
        <div style={{ position: 'absolute', top: 8, left: 8 }}>
          <span style={{
            background: 'rgba(196,119,58,.92)', backdropFilter: 'blur(6px)',
            color: '#fff', fontSize: 7, fontWeight: 800,
            padding: '3px 7px', borderRadius: 4, letterSpacing: '.08em',
          }}>NEW</span>
        </div>

        {/* Wishlist */}
        <div style={{
          position: 'absolute', top: 8, right: 8,
          width: 24, height: 24, borderRadius: '50%',
          background: 'rgba(255,255,255,.9)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, boxShadow: shadow.sm,
          opacity: hov ? 1 : 0, transition: '.2s',
        }}>♡</div>
      </div>

      {/* Info */}
      <div style={{ padding: '9px 11px 12px' }}>
        <div style={{ fontSize: 9, color: T.t, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 3 }}>{item.brand}</div>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.ink, lineHeight: 1.35, marginBottom: 5 }}>{item.name}</div>
        <div style={{ fontSize: 12, fontWeight: 800, color: T.ink }}>{item.price}</div>
      </div>
    </div>
  );
}

export default function NewThisWeek() {
  return (
    <section style={{ background: T.cm, padding: '80px 56px' }}>
      <div style={{ ...W }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ background: `linear-gradient(135deg,${T.t},${T.td})`, color: '#fff', fontSize: 9, fontWeight: 800, padding: '4px 12px', borderRadius: 5, letterSpacing: '.08em', textTransform: 'uppercase' }}>New This Week</span>
            <h2 style={sectionTitle}>Just listed</h2>
          </div>
          <div style={viewAll}>See all new arrivals →</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 12 }}>
          {NEW_THIS_WEEK.map((item, i) => <MiniCard key={i} item={item} />)}
        </div>
      </div>
    </section>
  );
}
