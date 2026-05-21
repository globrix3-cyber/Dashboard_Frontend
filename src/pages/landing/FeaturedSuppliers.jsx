import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleLogin } from '../../features/auth/authSlice';
import { T, shadow, eyebrow, sectionTitle, tag } from './tokens';
import { BRANDS } from './data';
import { IMG } from './images';
import { useBreakpoint, rPad, rW } from '../../hooks/useBreakpoint';

const BRAND_PHOTOS = {
  'Heritage Décor Studio': IMG.jaisalmerTextiles,
  'Moradabad Brass Works':  IMG.ceramicVasesLamps,
  'Delhi Textile House':    IMG.wheatFieldIndia,
  'Jodhpur Craft Studio':   IMG.rajasthaniEmbroidery,
};

const ALL_CATEGORIES = ['All', 'Wall Décor', 'Lighting & Lamps', 'Soft Furnishings', 'Furniture Décor'];

function BrandCard({ b, onAction }) {
  const [hov, setHov] = useState(false);
  const photo = BRAND_PHOTOS[b.name];

  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ background: T.w, borderRadius: 18, border: `1.5px solid ${hov ? 'rgba(196,119,58,.35)' : T.bs}`, overflow: 'hidden', cursor: 'pointer', transform: hov ? 'translateY(-6px)' : 'none', boxShadow: hov ? '0 20px 50px rgba(28,25,21,.13)' : shadow.sm, transition: '.25s cubic-bezier(.22,.68,0,1.2)' }}>

      {/* Category label */}
      <div style={{ padding: '8px 18px 0', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 9, fontWeight: 800, color: T.t, textTransform: 'uppercase', letterSpacing: '.1em', background: T.tl, padding: '3px 9px', borderRadius: 20 }}>{b.category}</span>
      </div>

      {/* Header photo */}
      <div style={{ height: 130, position: 'relative', overflow: 'hidden', margin: '8px 0 0' }}>
        {photo ? (
          <>
            <img src={photo} alt={`${b.name} — verified Indian supplier`} loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', transform: hov ? 'scale(1.07)' : 'scale(1)', transition: 'transform .5s ease', display: 'block' }} />
            <div style={{ position: 'absolute', inset: 0, background: hov ? 'rgba(18,14,10,.2)' : 'rgba(18,14,10,.06)', transition: '.25s' }} />
          </>
        ) : (
          <div style={{ width: '100%', height: '100%', background: b.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44, transform: hov ? 'scale(1.04)' : 'scale(1)', transition: 'transform .4s ease' }}>{b.emoji}</div>
        )}
        <span style={{ position: 'absolute', top: 11, right: 11, fontSize: 9, fontWeight: 700, padding: '4px 10px', borderRadius: 20, backdropFilter: 'blur(8px)', letterSpacing: '.04em', ...b.badgeStyle }}>{b.badge}</span>
      </div>

      {/* Body */}
      <div style={{ padding: '15px 18px 18px' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: T.ink, marginBottom: 3 }}>{b.name}</div>
        <div style={{ fontSize: 12, color: T.mu, marginBottom: 11 }}>{b.loc}</div>
        <div style={{ display: 'flex', gap: 10, padding: '9px 0', borderTop: `1px solid ${T.bs}`, borderBottom: `1px solid ${T.bs}`, marginBottom: 11 }}>
          {[['Products', b.products], ['Rating', b.rating], ['Min order', b.min]].map(([l, v]) => (
            <div key={l}><div style={{ fontSize: 13, fontWeight: 800, color: T.ink }}>{v}</div><div style={{ fontSize: 9, color: T.mu, marginTop: 1 }}>{l}</div></div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 13 }}>
          {b.tags.map(({ v, l }) => <span key={l} style={tag(v)}>{l}</span>)}
        </div>
        <button onClick={onAction} style={{ width: '100%', padding: '10px 0', background: hov ? T.t : T.tl, color: hov ? '#fff' : T.t, border: `1.5px solid ${hov ? T.t : 'rgba(196,119,58,.3)'}`, borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: '.18s', boxShadow: hov ? '0 4px 14px rgba(196,119,58,.3)' : 'none' }}>
          Explore Collection →
        </button>
      </div>
    </div>
  );
}

export default function FeaturedSuppliers() {
  const dispatch  = useDispatch();
  const bp        = useBreakpoint();
  const openLogin = () => dispatch(toggleLogin(true));
  const [activeTab, setActiveTab] = useState('All');

  const cols    = bp.isMobile ? 'repeat(1,1fr)' : bp.isTablet ? 'repeat(2,1fr)' : 'repeat(4,1fr)';
  const filtered = activeTab === 'All' ? BRANDS : BRANDS.filter(b => b.category === activeTab);

  return (
    <section style={{ background: T.cm, padding: rPad(bp) }}>
      <div style={{ ...rW }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={eyebrow}>Curated for you</div>
            <h2 style={sectionTitle}>Trusted Indian Suppliers</h2>
            <p style={{ fontSize: 13, color: T.mu, marginTop: 6 }}>Verified, top-rated, ready to ship worldwide</p>
          </div>
          <button onClick={openLogin} style={{ fontSize: 13, color: T.t, fontWeight: 600, background: T.tl, border: `1.5px solid rgba(196,119,58,.25)`, borderRadius: 7, padding: '8px 16px', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>Browse all suppliers →</button>
        </div>

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {ALL_CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveTab(cat)} style={{ padding: '7px 16px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', border: `1.5px solid ${activeTab === cat ? T.t : T.bs}`, background: activeTab === cat ? T.t : T.w, color: activeTab === cat ? '#fff' : T.mu, transition: '.15s' }}>
              {cat}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 16 }}>
          {filtered.map(b => <BrandCard key={b.name} b={b} onAction={openLogin} />)}
        </div>
      </div>
    </section>
  );
}
