import { useState } from 'react';
import { T, shadow, W, eyebrow, sectionTitle, viewAll } from './tokens';
import { COLLECTIONS } from './data';
import { IMG } from './images';

const COLLECTION_PHOTOS = {
  'Organic India — Farm to Shelf': IMG.keralaRiceFields,
  'The Luxury Craft Edit':         IMG.indianJewelry,
  'Made in Maharashtra':           IMG.indiaFactoryWorkers,
};

const COLLECTION_OVERLAYS = {
  'Organic India — Farm to Shelf': 'linear-gradient(to top, rgba(14,34,22,.92) 0%, rgba(14,34,22,.55) 50%, rgba(14,34,22,.2) 100%)',
  'The Luxury Craft Edit':         'linear-gradient(to top, rgba(38,18,10,.92) 0%, rgba(38,18,10,.55) 50%, rgba(38,18,10,.2) 100%)',
  'Made in Maharashtra':           'linear-gradient(to top, rgba(10,18,34,.92) 0%, rgba(10,18,34,.55) 50%, rgba(10,18,34,.2) 100%)',
};

const COLLECTION_ACCENTS = {
  'Organic India — Farm to Shelf': T.g,
  'The Luxury Craft Edit':         T.t,
  'Made in Maharashtra':           T.n,
};

function CollectionCard({ item }) {
  const [hov, setHov] = useState(false);
  const photo   = COLLECTION_PHOTOS[item.name];
  const overlay = COLLECTION_OVERLAYS[item.name];
  const accent  = COLLECTION_ACCENTS[item.name];

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: 20, overflow: 'hidden', cursor: 'pointer',
        transform: hov ? 'translateY(-5px)' : 'none',
        boxShadow: hov ? `0 24px 60px rgba(28,25,21,.2)` : shadow.sm,
        transition: '.28s cubic-bezier(.22,.68,0,1.2)',
        gridColumn: item.wide ? 'span 2' : 'span 1',
        position: 'relative',
        minHeight: item.wide ? 340 : 340,
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Full-bleed photo */}
      {photo ? (
        <img
          src={photo}
          alt={item.name}
          loading="lazy"
          decoding="async"
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center',
            transform: hov ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform .6s ease',
          }}
        />
      ) : (
        <div style={{ position: 'absolute', inset: 0, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: item.wide ? 72 : 56 }}>
          <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 65% 35%,${item.glow},transparent 60%)` }} />
          <span style={{ position: 'relative', zIndex: 1 }}>{item.emoji}</span>
        </div>
      )}

      {/* Gradient overlay */}
      <div style={{ position: 'absolute', inset: 0, background: overlay || item.bg }} />

      {/* Accent line top */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: accent }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, padding: '28px 26px', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'flex-end' }}>

        {/* Tag */}
        <div style={{ marginBottom: 14 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            background: 'rgba(255,255,255,.1)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,.18)',
            color: '#fff', fontSize: 9, fontWeight: 800,
            padding: '4px 12px', borderRadius: 20, letterSpacing: '.1em', textTransform: 'uppercase',
          }}>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: accent, display: 'inline-block' }} />
            Editor's Pick
          </span>
        </div>

        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: item.wide ? 24 : 19, fontWeight: 700, color: '#fff', marginBottom: 8, lineHeight: 1.2 }}>
          {item.name}
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,.65)', lineHeight: 1.65, marginBottom: 18, maxWidth: item.wide ? 420 : '100%' }}>
          {item.desc}
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 12, fontWeight: 700,
          color: hov ? '#fff' : 'rgba(255,255,255,.65)',
          transition: '.2s',
          transform: hov ? 'translateX(4px)' : 'none',
        }}>
          Explore collection <span style={{ fontSize: 14 }}>→</span>
        </div>
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
