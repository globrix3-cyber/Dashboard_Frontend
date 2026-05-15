import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleLogin } from '../../features/auth/authSlice';
import { T, shadow, eyebrow, sectionTitle } from './tokens';
import { CAT_HERO, CAT_SUB } from './data';
import { IMG } from './images';
import { useBreakpoint, rPad, rW } from '../../hooks/useBreakpoint';

const CAT_IMAGES = {
  Textiles:    IMG.jaipurTextiles,
  Handicrafts: IMG.wovenBaskets,
  Agriculture: IMG.spicesMarket,
  Engineering: IMG.steelBolts,
};

function CatHeroCard({ item, onAction }) {
  const [hov, setHov] = useState(false);
  const photo = CAT_IMAGES[item.name];

  return (
    <div onClick={onAction} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      borderRadius: 18, overflow: 'hidden', position: 'relative', cursor: 'pointer',
      aspectRatio: '3/4',
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      transform: hov ? 'translateY(-6px)' : 'none',
      boxShadow: hov ? shadow.lg : shadow.sm,
      transition: '.28s cubic-bezier(.22,.68,0,1.2)',
    }}>
      {photo ? (
        <img src={photo} alt={`${item.name} category — Indian B2B marketplace`}
          loading="lazy" decoding="async"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', transform: hov ? 'scale(1.07)' : 'scale(1)', transition: 'transform .55s ease' }}
        />
      ) : (
        <div style={{ position: 'absolute', inset: 0, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80, transform: hov ? 'scale(1.04)' : 'scale(1)', transition: '.4s' }}>{item.emoji}</div>
      )}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(18,14,10,.88) 0%,rgba(18,14,10,.22) 50%,rgba(18,14,10,.04) 100%)' }} />
      {hov && <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(196,119,58,.12) 0%,transparent 60%)', pointerEvents: 'none' }} />}
      <div style={{ position: 'relative', zIndex: 2, padding: '20px 18px' }}>
        <div style={{ marginBottom: 8 }}>
          <span style={{ display: 'inline-block', background: hov ? 'rgba(196,119,58,.9)' : 'rgba(255,255,255,.12)', backdropFilter: 'blur(8px)', border: hov ? '1px solid rgba(196,119,58,.5)' : '1px solid rgba(255,255,255,.18)', color: '#fff', fontSize: 9, fontWeight: 800, padding: '4px 11px', borderRadius: 20, letterSpacing: '.1em', textTransform: 'uppercase', transition: '.22s' }}>{item.chip}</span>
        </div>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 4, lineHeight: 1.15 }}>{item.name}</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,.6)', marginBottom: 10 }}>{item.count}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: hov ? T.tm : 'rgba(255,255,255,.45)', fontSize: 11, fontWeight: 600, transition: '.22s', transform: hov ? 'translateX(4px)' : 'none' }}>
          Browse {item.name} <span style={{ fontSize: 13 }}>→</span>
        </div>
      </div>
    </div>
  );
}

function CatSubCard({ item, cta, onAction }) {
  const [hov, setHov] = useState(false);
  if (cta) return (
    <div onClick={onAction} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ background: hov ? `linear-gradient(135deg,${T.td},#8A5226)` : `linear-gradient(135deg,${T.t},${T.td})`, borderRadius: 12, padding: '16px 10px', textAlign: 'center', cursor: 'pointer', transition: '.18s', transform: hov ? 'translateY(-2px)' : 'none' }}>
      <div style={{ fontSize: 20, marginBottom: 6 }}>→</div>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#fff', marginBottom: 2 }}>View all 24</div>
      <div style={{ fontSize: 10, color: 'rgba(255,255,255,.75)' }}>categories</div>
    </div>
  );
  return (
    <div onClick={onAction} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ background: hov ? T.tl : T.w, border: `1.5px solid ${hov ? T.t : T.bs}`, borderRadius: 12, padding: '14px 10px', textAlign: 'center', cursor: 'pointer', transform: hov ? 'translateY(-2px)' : 'none', boxShadow: hov ? shadow.sm : 'none', transition: '.18s' }}>
      <div style={{ fontSize: 24, marginBottom: 6 }}>{item.icon}</div>
      <div style={{ fontSize: 11, fontWeight: 700, color: T.ink, marginBottom: 2 }}>{item.name}</div>
      <div style={{ fontSize: 10, color: T.mu }}>{item.count}</div>
    </div>
  );
}

export default function ShopByCategory() {
  const dispatch = useDispatch();
  const bp       = useBreakpoint();
  const openLogin = () => dispatch(toggleLogin(true));

  const heroColumns = bp.isMobile ? 'repeat(2,1fr)' : bp.isTablet ? 'repeat(2,1fr)' : 'repeat(4,1fr)';
  const subColumns  = bp.isMobile ? 'repeat(3,1fr)' : bp.isTablet ? 'repeat(4,1fr)' : 'repeat(6,1fr)';

  return (
    <section style={{ background: T.c, padding: rPad(bp) }}>
      <div style={{ ...rW }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28, gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div style={eyebrow}>Browse</div>
            <h2 style={sectionTitle}>Shop by Category</h2>
            <p style={{ fontSize: 13, color: T.mu, marginTop: 6 }}>24 categories · 5,000+ verified suppliers</p>
          </div>
          <button onClick={openLogin} style={{ fontSize: 13, color: T.t, fontWeight: 600, background: T.tl, border: `1.5px solid rgba(196,119,58,.25)`, borderRadius: 7, padding: '8px 16px', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>All categories →</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: heroColumns, gap: 12, marginBottom: 10 }}>
          {CAT_HERO.map(item => <CatHeroCard key={item.name} item={item} onAction={openLogin} />)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: subColumns, gap: 8 }}>
          {CAT_SUB.map(item => <CatSubCard key={item.name} item={item} onAction={openLogin} />)}
          <CatSubCard cta onAction={openLogin} />
        </div>
      </div>
    </section>
  );
}
