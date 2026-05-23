import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleLogin } from '../../features/auth/authSlice';
import { T, shadow, eyebrow, sectionTitle } from './tokens';
import { COLLECTIONS } from './data';
import { IMG } from './images';
import { useBreakpoint, rPad, rW } from '../../hooks/useBreakpoint';

const COLLECTION_PHOTOS = {
  'Organic India — Farm to Shelf': IMG.keralaRiceFields,
  'The Luxury Craft Edit':         IMG.indianJewelry,
  'Made in Maharashtra':           IMG.indiaFactoryWorkers,
};
const COLLECTION_OVERLAYS = {
  'Organic India — Farm to Shelf': 'linear-gradient(to top,rgba(14,34,22,.92) 0%,rgba(14,34,22,.55) 50%,rgba(14,34,22,.2) 100%)',
  'The Luxury Craft Edit':         'linear-gradient(to top,rgba(38,18,10,.92) 0%,rgba(38,18,10,.55) 50%,rgba(38,18,10,.2) 100%)',
  'Made in Maharashtra':           'linear-gradient(to top,rgba(10,18,34,.92) 0%,rgba(10,18,34,.55) 50%,rgba(10,18,34,.2) 100%)',
};
const COLLECTION_ACCENTS = {
  'Organic India — Farm to Shelf': T.g,
  'The Luxury Craft Edit':         T.t,
  'Made in Maharashtra':           T.n,
};

function CollectionCard({ item, onAction, bp }) {
  const [hov, setHov] = useState(false);
  const photo   = COLLECTION_PHOTOS[item.name];
  const overlay = COLLECTION_OVERLAYS[item.name];
  const accent  = COLLECTION_ACCENTS[item.name];

  return (
    <div onClick={onAction} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ borderRadius: 20, overflow: 'hidden', cursor: 'pointer', transform: hov ? 'translateY(-5px)' : 'none', boxShadow: hov ? '0 24px 60px rgba(28,25,21,.2)' : shadow.sm, transition: '.28s cubic-bezier(.22,.68,0,1.2)', gridColumn: !bp.isMobile && item.wide ? 'span 2' : 'span 1', position: 'relative', minHeight: bp.isMobile ? 260 : 320, display: 'flex', flexDirection: 'column' }}>
      {photo ? (
        <img src={photo} alt={item.name} loading="lazy" decoding="async" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', transform: hov ? 'scale(1.05)' : 'scale(1)', transition: 'transform .6s ease' }} />
      ) : (
        <div style={{ position: 'absolute', inset: 0, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: item.wide ? 72 : 56 }}>
          <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 65% 35%,${item.glow},transparent 60%)` }} />
          <span style={{ position: 'relative', zIndex: 1 }}>{item.emoji}</span>
        </div>
      )}
      <div style={{ position: 'absolute', inset: 0, background: overlay || item.bg }} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: accent }} />
      <div style={{ position: 'relative', zIndex: 2, padding: bp.isMobile ? '22px 18px' : '28px 26px', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'flex-end' }}>
        <div style={{ marginBottom: 12 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,.18)', color: '#fff', fontSize: 9, fontWeight: 800, padding: '4px 12px', borderRadius: 20, letterSpacing: '.1em', textTransform: 'uppercase' }}>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: accent, display: 'inline-block' }} />
            Editor's Pick
          </span>
        </div>
        <div style={{ fontFamily: "'Cormorant Garamond','Playfair Display',serif", fontSize: !bp.isMobile && item.wide ? 22 : 18, fontWeight: 700, color: '#fff', marginBottom: 8, lineHeight: 1.2 }}>{item.name}</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,.65)', lineHeight: 1.65, marginBottom: 16 }}>{item.desc}</div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: hov ? '#fff' : 'rgba(255,255,255,.65)', transition: '.2s', transform: hov ? 'translateX(4px)' : 'none' }}>
          Explore collection <span style={{ fontSize: 14 }}>→</span>
        </div>
      </div>
    </div>
  );
}

export default function CuratedCollections() {
  const dispatch  = useDispatch();
  const bp        = useBreakpoint();
  const openLogin = () => dispatch(toggleLogin(true));
  const cols      = bp.isMobile ? '1fr' : bp.isTablet ? '1fr 1fr' : '2fr 1fr 1fr';

  return (
    <section style={{ background: T.cm, padding: rPad(bp) }}>
      <div style={{ ...rW }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={eyebrow}>Editor's Picks</div>
            <h2 style={sectionTitle}>Curated Collections</h2>
            <p style={{ fontSize: 13, color: T.mu, marginTop: 6 }}>Handpicked by our sourcing experts</p>
          </div>
          <button onClick={openLogin} style={{ fontSize: 13, color: T.t, fontWeight: 600, background: T.tl, border: `1.5px solid rgba(196,119,58,.25)`, borderRadius: 7, padding: '8px 16px', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>All collections →</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 16 }}>
          {COLLECTIONS.map(item => <CollectionCard key={item.name} item={item} onAction={openLogin} bp={bp} />)}
        </div>
      </div>
    </section>
  );
}
