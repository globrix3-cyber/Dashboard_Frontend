import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleLogin } from '../../features/auth/authSlice';
import { T, shadow, eyebrow, sectionTitle } from './tokens';
import { TRENDING_PRODUCTS } from './data';
import { IMG } from './images';
import { useBreakpoint, rPad, rW } from '../../hooks/useBreakpoint';

const PRODUCT_PHOTOS = {
  'Cotton Kurta Fabric 44"':  IMG.jaipurTextiles,
  'Cold-Press Mustard Oil':   IMG.mustardField,
  'SS Hex Bolt Set M12':      IMG.steelBolts,
  'Kundan Bridal Jewelry':    IMG.indianJewelry,
  'A-Grade Kashmiri Saffron': IMG.saffronThreads,
};

function ProductCard({ item, onAction }) {
  const [hov, setHov] = useState(false);
  const photo = PRODUCT_PHOTOS[item.name];

  return (
    <div onClick={onAction} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ background: T.w, borderRadius: 16, overflow: 'hidden', border: `1.5px solid ${hov ? 'rgba(196,119,58,.3)' : T.bs}`, transform: hov ? 'translateY(-5px)' : 'none', boxShadow: hov ? shadow.md : 'none', transition: '.22s', cursor: 'pointer' }}>
      <div style={{ height: 148, position: 'relative', overflow: 'hidden' }}>
        {photo ? (
          <>
            <img src={photo} alt={item.name} loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hov ? 'scale(1.06)' : 'scale(1)', transition: 'transform .45s ease', display: 'block' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(18,14,10,.08)' }} />
          </>
        ) : (
          <div style={{ width: '100%', height: '100%', background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 46 }}>{item.emoji}</div>
        )}
        {item.badge && <span style={{ position: 'absolute', top: 9, left: 9, background: item.badgeBg, color: '#fff', fontSize: 8, fontWeight: 800, padding: '3px 9px', borderRadius: 5 }}>{item.badge}</span>}
        <span style={{ position: 'absolute', top: 9, right: 9, background: 'rgba(255,255,255,.92)', backdropFilter: 'blur(4px)', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, boxShadow: shadow.sm }}>♡</span>
      </div>
      <div style={{ padding: '12px 14px 14px' }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: T.t, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>{item.brand}</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.ink, marginBottom: 5, lineHeight: 1.3 }}>{item.name}</div>
        <div style={{ fontSize: 10, color: T.mu, marginBottom: 6 }}>{item.moq}</div>
        <div style={{ fontSize: 15, fontWeight: 800, color: T.ink }}>{item.price}<small style={{ fontSize: 10, color: T.mu, fontWeight: 400 }}>{item.unit}</small></div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 9, paddingTop: 9, borderTop: `1px solid ${T.bs}` }}>
          <span style={{ fontSize: 10, color: T.mu }}>⭐ {item.rating}</span>
          <button onClick={e => { e.stopPropagation(); onAction(); }} style={{ fontSize: 10, fontWeight: 700, color: hov ? '#fff' : T.t, background: hov ? T.t : T.tl, border: 'none', borderRadius: 5, padding: '5px 11px', cursor: 'pointer', fontFamily: 'inherit', transition: '.15s' }}>Quote</button>
        </div>
      </div>
    </div>
  );
}

function SpotlightBanner({ onAction, bp }) {
  const [hov, setHov] = useState(false);
  const spanCols = bp.isMobile ? 'span 1' : 'span 2';
  return (
    <div onClick={onAction} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ gridColumn: spanCols, borderRadius: 18, minHeight: bp.isMobile ? 200 : 300, cursor: 'pointer', position: 'relative', overflow: 'hidden', boxShadow: hov ? '0 24px 60px rgba(28,25,21,.18)' : shadow.sm, transition: '.28s' }}>
      <img src={IMG.artisanWeaving} alt="India's finest agricultural produce — Globrixa spotlight" loading="lazy" decoding="async" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', transform: hov ? 'scale(1.04)' : 'scale(1)', transition: 'transform .6s ease' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(145deg,rgba(18,40,26,.92) 0%,rgba(30,58,40,.88) 100%)' }} />
      <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(61,122,52,.35),transparent)', top: -100, right: -100, pointerEvents: 'none' }} />
      <div style={{ position: 'relative', zIndex: 1, padding: bp.isMobile ? '24px 20px' : '30px 26px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)', marginBottom: 10 }}>Spotlight Category</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: bp.isMobile ? 22 : 28, fontWeight: 700, color: '#fff', lineHeight: 1.12, marginBottom: 10 }}>India's finest<br/>Agricultural produce</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,.58)', lineHeight: 1.65 }}>856 verified suppliers. Organic certified. Export-ready.</div>
        </div>
        <button onClick={e => { e.stopPropagation(); onAction(); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, alignSelf: 'flex-start', background: hov ? 'rgba(255,255,255,.95)' : '#fff', color: '#1E3A28', fontSize: 12, fontWeight: 800, padding: '10px 20px', borderRadius: 8, fontFamily: 'inherit', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,.2)', transform: hov ? 'translateY(-1px)' : 'none', transition: '.18s' }}>Explore Agriculture →</button>
      </div>
    </div>
  );
}

export default function TrendingProducts() {
  const dispatch  = useDispatch();
  const bp        = useBreakpoint();
  const openLogin = () => dispatch(toggleLogin(true));

  const cols = bp.isMobile ? 'repeat(2,1fr)' : bp.isTablet ? 'repeat(3,1fr)' : 'repeat(5,1fr)';

  return (
    <section style={{ background: T.c, padding: rPad(bp) }}>
      <div style={{ ...rW }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <div><div style={eyebrow}>Most ordered</div><h2 style={sectionTitle}>Trending Products</h2></div>
          <button onClick={openLogin} style={{ fontSize: 13, color: T.t, fontWeight: 600, background: T.tl, border: `1.5px solid rgba(196,119,58,.25)`, borderRadius: 7, padding: '8px 16px', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>Browse all →</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 14 }}>
          <SpotlightBanner onAction={openLogin} bp={bp} />
          {TRENDING_PRODUCTS.map((item, i) => <ProductCard key={i} item={item} onAction={openLogin} />)}
        </div>
      </div>
    </section>
  );
}
