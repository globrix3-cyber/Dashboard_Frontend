import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleLogin } from '../../features/auth/authSlice';
import { T, shadow } from './tokens';
import { TRENDING_ROWS } from './data';
import { IMG } from './images';
import { useBreakpoint, rW } from '../../hooks/useBreakpoint';

const PRODUCT_PHOTOS = {
  'Banarasi Silk Saree':    IMG.delhiTextiles,
  'Khadi Cotton Fabric':    IMG.fabricRolls,
  'Pashmina Shawl':         IMG.jaisalmerTextiles,
  'Embroidered Dupatta':    IMG.embroideredDupatta,
  'Cotton Kurta Set':       IMG.jaipurTextiles,
  'Linen Blend Fabric':     IMG.artisanWeaving,
  'Organic Basmati Rice':   IMG.basmatiRice,
  'Raw Turmeric Powder':    IMG.turmericPowder,
  'Kashmiri Red Chilli':    IMG.redChilli,
  'Cold-Press Coconut Oil': IMG.coconutOil,
  'Dried Moringa Leaves':   IMG.herbalPowder,
  'Premium Garlic Flakes':  IMG.garlicDried,
  'Blue Pottery Vase':      IMG.blueCeramicVases,
  'Kundan Necklace Set':    IMG.indianJewelry,
  'Channapatna Toys':       IMG.woodenToys,
  'Rajasthani Mirror Work': IMG.rajasthaniEmbroidery,
  'Madhubani Art Print':    IMG.artisanPainting,
  'Bamboo Basket Set':      IMG.chennaBaskets,
};

function MiniProdCard({ item, onAction }) {
  const [hov, setHov] = useState(false);
  const photo = PRODUCT_PHOTOS[item.name];

  return (
    <div onClick={onAction} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ background: T.w, borderRadius: 12, overflow: 'hidden', border: `1.5px solid ${hov ? 'rgba(196,119,58,.3)' : T.bs}`, cursor: 'pointer', transform: hov ? 'translateY(-4px)' : 'none', boxShadow: hov ? shadow.md : 'none', transition: '.22s cubic-bezier(.22,.68,0,1.2)' }}>
      <div style={{ height: 100, position: 'relative', overflow: 'hidden' }}>
        {photo ? (
          <>
            <img src={photo} alt={item.name} loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', transform: hov ? 'scale(1.10)' : 'scale(1)', transition: 'transform .45s ease', display: 'block' }} />
            <div style={{ position: 'absolute', inset: 0, background: hov ? 'rgba(18,14,10,.14)' : 'rgba(18,14,10,.04)', transition: '.22s' }} />
          </>
        ) : (
          <div style={{ width: '100%', height: '100%', background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>{item.emoji}</div>
        )}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: hov ? 1 : 0, transition: '.2s', pointerEvents: 'none' }}>
          <span style={{ background: 'rgba(196,119,58,.92)', backdropFilter: 'blur(8px)', color: '#fff', fontSize: 9, fontWeight: 800, padding: '5px 12px', borderRadius: 20, letterSpacing: '.08em' }}>Get Quote →</span>
        </div>
      </div>
      <div style={{ padding: '9px 11px 11px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.ink, lineHeight: 1.3, marginBottom: 3 }}>{item.name}</div>
        <div style={{ fontSize: 12, fontWeight: 800, color: T.t }}>{item.price}</div>
        <div style={{ fontSize: 9, color: T.mu, marginTop: 1 }}>{item.moq}</div>
      </div>
    </div>
  );
}

function CategoryRow({ row, onAction, bp }) {
  const cols = bp.isMobile ? 'repeat(2,1fr)' : bp.isTablet ? 'repeat(3,1fr)' : 'repeat(6,1fr)';
  const pad  = bp.isMobile ? '40px 18px' : bp.isTablet ? '48px 32px' : '56px 56px';

  return (
    <div style={{ padding: pad, borderBottom: `1px solid ${T.bs}` }}>
      <div style={{ ...rW }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 11, background: row.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, border: `1.5px solid ${row.iconBorder}`, flexShrink: 0 }}>{row.icon}</div>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond','Playfair Display',serif", fontSize: bp.isMobile ? 18 : 22, fontWeight: 700, color: T.ink, letterSpacing: '-.5px' }}>{row.title}</div>
              <div style={{ fontSize: 12, color: T.mu, marginTop: 2 }}>{row.count}</div>
            </div>
          </div>
          <button onClick={onAction} style={{ fontSize: 13, color: T.t, fontWeight: 600, background: T.tl, border: `1.5px solid rgba(196,119,58,.25)`, borderRadius: 7, padding: '7px 14px', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>{row.link}</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 10 }}>
          {row.products.map((item, i) => <MiniProdCard key={i} item={item} onAction={onAction} />)}
        </div>
      </div>
    </div>
  );
}

export default function TrendingByCategory() {
  const dispatch  = useDispatch();
  const bp        = useBreakpoint();
  const openLogin = () => dispatch(toggleLogin(true));

  return (
    <div style={{ background: T.c, borderTop: `1px solid ${T.bs}` }}>
      {TRENDING_ROWS.map(row => <CategoryRow key={row.title} row={row} onAction={openLogin} bp={bp} />)}
    </div>
  );
}
