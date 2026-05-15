import { useState } from 'react';
import { T, shadow, W, viewAll } from './tokens';
import { TRENDING_ROWS } from './data';
import { IMG } from './images';

const PRODUCT_PHOTOS = {
  // Textiles
  'Banarasi Silk Saree':   IMG.delhiTextiles,
  'Khadi Cotton Fabric':   IMG.fabricRolls,
  'Pashmina Shawl':        IMG.jaisalmerTextiles,
  'Embroidered Dupatta':   IMG.embroideredDupatta,
  'Cotton Kurta Set':      IMG.jaipurTextiles,
  'Linen Blend Fabric':    IMG.artisanWeaving,

  // Agriculture & Food
  'Organic Basmati Rice':   IMG.basmatiRice,
  'Raw Turmeric Powder':    IMG.turmericPowder,
  'Kashmiri Red Chilli':    IMG.redChilli,
  'Cold-Press Coconut Oil': IMG.coconutOil,
  'Dried Moringa Leaves':   IMG.herbalPowder,
  'Premium Garlic Flakes':  IMG.garlicDried,

  // Handicrafts
  'Blue Pottery Vase':      IMG.blueCeramicVases,
  'Kundan Necklace Set':    IMG.indianJewelry,
  'Channapatna Toys':       IMG.woodenToys,
  'Rajasthani Mirror Work': IMG.rajasthaniEmbroidery,
  'Madhubani Art Print':    IMG.artisanPainting,
  'Bamboo Basket Set':      IMG.chennaBaskets,
};

function MiniProdCard({ item }) {
  const [hov, setHov] = useState(false);
  const photo = PRODUCT_PHOTOS[item.name];

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
      {/* Image header */}
      <div style={{ height: 100, position: 'relative', overflow: 'hidden' }}>
        {photo ? (
          <>
            <img
              src={photo}
              alt={item.name}
              loading="lazy"
              decoding="async"
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                objectPosition: 'center',
                transform: hov ? 'scale(1.10)' : 'scale(1)',
                transition: 'transform .45s ease',
                display: 'block',
              }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: hov ? 'rgba(18,14,10,.14)' : 'rgba(18,14,10,.04)',
              transition: '.22s',
            }} />
          </>
        ) : (
          <div style={{
            width: '100%', height: '100%', background: item.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32,
          }}>
            {item.emoji}
          </div>
        )}

        {/* Quick-quote hover pill */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: hov ? 1 : 0, transition: '.2s',
          pointerEvents: hov ? 'auto' : 'none',
        }}>
          <span style={{
            background: 'rgba(196,119,58,.92)', backdropFilter: 'blur(8px)',
            color: '#fff', fontSize: 9, fontWeight: 800,
            padding: '5px 12px', borderRadius: 20, letterSpacing: '.08em',
          }}>Get Quote →</span>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '9px 11px 11px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.ink, lineHeight: 1.3, marginBottom: 3 }}>{item.name}</div>
        <div style={{ fontSize: 12, fontWeight: 800, color: T.t }}>{item.price}</div>
        <div style={{ fontSize: 9, color: T.mu, marginTop: 1 }}>{item.moq}</div>
      </div>
    </div>
  );
}

function CategoryRow({ row }) {
  return (
    <div style={{ padding: '56px 56px', borderBottom: `1px solid ${T.bs}` }}>
      <div style={{ ...W }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 11,
              background: row.iconBg, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 22,
              border: `1.5px solid ${row.iconBorder}`, flexShrink: 0,
            }}>
              {row.icon}
            </div>
            <div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: T.ink, letterSpacing: '-.5px' }}>{row.title}</div>
              <div style={{ fontSize: 12, color: T.mu, marginTop: 2 }}>{row.count}</div>
            </div>
          </div>
          <div style={viewAll}>{row.link}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 12 }}>
          {row.products.map((item, i) => <MiniProdCard key={i} item={item} />)}
        </div>
      </div>
    </div>
  );
}

export default function TrendingByCategory() {
  return (
    <div style={{ background: T.c, borderTop: `1px solid ${T.bs}` }}>
      {TRENDING_ROWS.map(row => <CategoryRow key={row.title} row={row} />)}
    </div>
  );
}
