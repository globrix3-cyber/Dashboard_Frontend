import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleLogin } from '../../features/auth/authSlice';
import { T, shadow, W } from './tokens';
import { HERO_PRODUCTS } from './data';

function HeroProductCard({ item }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      background: T.w, borderRadius: 14, overflow: 'hidden',
      boxShadow: hov ? shadow.md : shadow.sm, border: `1px solid ${T.bs}`,
      transform: hov ? 'translateY(-5px)' : 'none', transition: '.22s', cursor: 'pointer',
    }}>
      <div style={{ height: 108, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, position: 'relative' }}>
        {item.emoji}
        {item.badge && (
          <span style={{ position: 'absolute', top: 9, left: 9, background: item.badgeBg, color: '#fff', fontSize: 8, fontWeight: 800, padding: '3px 9px', borderRadius: 5, letterSpacing: '.04em', backdropFilter: 'blur(4px)' }}>{item.badge}</span>
        )}
        <span style={{ position: 'absolute', top: 9, right: 9, background: 'rgba(255,255,255,.92)', backdropFilter: 'blur(4px)', borderRadius: '50%', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, boxShadow: shadow.sm }}>♡</span>
      </div>
      <div style={{ padding: '11px 13px 13px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.ink, marginBottom: 3, lineHeight: 1.3 }}>{item.name}</div>
        <div style={{ fontSize: 10, color: T.mu, marginBottom: 6 }}>{item.brand}</div>
        <div style={{ fontSize: 13, fontWeight: 800, color: T.t }}>{item.price}<small style={{ fontSize: 9, color: T.mu, fontWeight: 400 }}>{item.unit}</small></div>
        <div style={{ fontSize: 9, color: T.mu, marginTop: 2 }}>{item.moq}</div>
      </div>
    </div>
  );
}

function HeroCtaTile() {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      background: `linear-gradient(135deg,${T.t},${T.td})`,
      borderRadius: 14, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 8, padding: 16, minHeight: 168, cursor: 'pointer',
      opacity: hov ? 0.9 : 1, transition: '.18s',
    }}>
      <span style={{ fontFamily:"'Playfair Display',serif", fontSize: 30, fontWeight: 900, color: '#fff', letterSpacing: -1 }}>5,000+</span>
      <span style={{ fontSize: 10, color: 'rgba(255,255,255,.82)', textAlign: 'center', lineHeight: 1.5 }}>verified suppliers ready to ship</span>
      <span style={{ fontSize: 20, color: 'rgba(255,255,255,.55)' }}>↗</span>
    </div>
  );
}

export default function HeroSection() {
  const dispatch = useDispatch();
  const [hovMain, setHovMain] = useState(false);
  const [hovSec, setHovSec] = useState(false);

  return (
    <section style={{ background: T.c, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position:'absolute', top:-200, right:-200, width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle,rgba(196,119,58,.10),transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:-150, left:-150, width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(61,122,82,.08),transparent 70%)', pointerEvents:'none' }} />

      <div style={{ ...W, padding: '72px 56px 0', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center', paddingBottom: 60 }}>

          <div>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:'.16em', textTransform:'uppercase', color:T.t, marginBottom:18, display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:T.t, flexShrink:0 }} />
              <span style={{ width:28, height:1.5, background:`linear-gradient(90deg,${T.t},transparent)`, display:'inline-block' }} />
              India's B2B Wholesale Marketplace
            </div>

            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(42px,5vw,68px)', fontWeight:900, lineHeight:1.01, letterSpacing:-2.5, color:T.ink, marginBottom:22 }}>
              Where brands<br/>meet{' '}
              <em style={{ fontStyle:'italic', background:`linear-gradient(135deg,${T.t} 0%,#E8A060 100%)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>buyers</em>
            </h1>

            <p style={{ fontSize:17, color:T.is, lineHeight:1.82, marginBottom:38, maxWidth:430, fontWeight:400 }}>
              Discover 50,000+ products from 5,000+ verified Indian suppliers. Order wholesale, pay on terms, and grow faster — all in one place.
            </p>

            <div style={{ display:'flex', gap:12, marginBottom:40 }}>
              <button
                onClick={() => dispatch(toggleLogin(true))}
                onMouseEnter={() => setHovMain(true)} onMouseLeave={() => setHovMain(false)}
                style={{ padding:'15px 34px', borderRadius:10, background: hovMain ? `linear-gradient(135deg,${T.td},#8A5226)` : `linear-gradient(135deg,${T.t},${T.td})`, color:'#fff', fontSize:15, fontWeight:700, border:'none', cursor:'pointer', fontFamily:'inherit', boxShadow:'0 8px 28px rgba(196,119,58,.38)', transform: hovMain ? 'translateY(-2px)' : 'none', transition:'.2s' }}>
                Start sourcing free
              </button>
              <button
                onClick={() => dispatch(toggleLogin(true))}
                onMouseEnter={() => setHovSec(true)} onMouseLeave={() => setHovSec(false)}
                style={{ padding:'14px 28px', borderRadius:10, background: hovSec ? T.tl : T.w, color:T.ink, fontSize:15, fontWeight:600, border:`1.5px solid ${hovSec ? T.t : T.b}`, cursor:'pointer', fontFamily:'inherit', boxShadow:'0 2px 8px rgba(28,25,21,.07)', transition:'.18s' }}>
                List your brand →
              </button>
            </div>

            <div style={{ display:'flex', gap:22, flexWrap:'wrap' }}>
              {['GST Verified','Trade Assured','Net 30 Terms'].map(txt => (
                <div key={txt} style={{ display:'flex', alignItems:'center', gap:7, fontSize:12, color:T.mu, fontWeight:500 }}>
                  <span style={{ width:20, height:20, borderRadius:'50%', background:T.gl, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, color:T.g, fontWeight:700 }}>✓</span>
                  {txt}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
            {HERO_PRODUCTS.map((item, i) => <HeroProductCard key={i} item={item} />)}
            <HeroCtaTile />
          </div>

        </div>
      </div>
    </section>
  );
}
