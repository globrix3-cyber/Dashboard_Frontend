import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleLogin } from '../../features/auth/authSlice';
import { T, shadow, W } from './tokens';
import { IMG } from './images';

const STATS = [
  { n: '₹250Cr', l: 'Monthly Volume' },
  { n: '50K+',   l: 'Products' },
  { n: '5,000+', l: 'Suppliers' },
];

function PhotoMosaic() {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.15fr 0.85fr',
        gridTemplateRows: '220px 220px',
        gap: 10,
        borderRadius: 24,
        overflow: 'hidden',
      }}>

        {/* Main — artisan weaving spans 2 rows */}
        <div style={{ gridRow: '1 / 3', position: 'relative', overflow: 'hidden' }}>
          <img
            src={IMG.artisanWeaving}
            alt="Indian artisan weaving on a traditional loom"
            loading="eager"
            fetchpriority="high"
            decoding="sync"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', transition: 'transform .6s ease', display: 'block' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(18,14,10,.82) 0%, rgba(18,14,10,.08) 55%, transparent 100%)' }} />

          {/* Live badge */}
          <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ background: 'rgba(196,119,58,.92)', backdropFilter: 'blur(8px)', color: '#fff', fontSize: 9, fontWeight: 800, padding: '5px 12px', borderRadius: 20, letterSpacing: '.1em', display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff', animation: 'heroPulse 1.8s ease infinite', display: 'inline-block' }} />
              LIVE MARKETPLACE
            </span>
          </div>

          {/* Bottom info */}
          <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
            <div style={{ fontFamily: "'Playfair Display',serif", color: '#fff', fontSize: 20, fontWeight: 700, marginBottom: 4, lineHeight: 1.2 }}>
              5,000+ Verified<br/>Suppliers
            </div>
            <div style={{ color: 'rgba(255,255,255,.6)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 16, height: 1, background: 'rgba(255,255,255,.35)', display: 'inline-block' }} />
              MSMEs, Artisans & Exporters
            </div>
          </div>
        </div>

        {/* Top-right — handmade pottery */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <img
            src={IMG.handmadePottery}
            alt="Vibrant handmade pottery — Handicrafts category"
            loading="eager"
            fetchpriority="high"
            decoding="sync"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .5s ease' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(18,14,10,.65) 0%, transparent 55%)' }} />
          <div style={{ position: 'absolute', top: 12, left: 12 }}>
            <span style={{ background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,.22)', color: '#fff', fontSize: 8, fontWeight: 800, padding: '4px 10px', borderRadius: 20, letterSpacing: '.1em' }}>HANDICRAFTS</span>
          </div>
          <div style={{ position: 'absolute', bottom: 12, left: 14 }}>
            <div style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>982 brands</div>
            <div style={{ color: 'rgba(255,255,255,.55)', fontSize: 10 }}>Pottery · Jewelry · Art</div>
          </div>
        </div>

        {/* Bottom-right — mosaic lamps */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <img
            src={IMG.mosaicLamps}
            alt="Vibrant mosaic glass lamps — Home Décor category"
            loading="eager"
            fetchpriority="high"
            decoding="sync"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .5s ease' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(18,14,10,.65) 0%, transparent 55%)' }} />
          <div style={{ position: 'absolute', top: 12, left: 12 }}>
            <span style={{ background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,.22)', color: '#fff', fontSize: 8, fontWeight: 800, padding: '4px 10px', borderRadius: 20, letterSpacing: '.1em' }}>HOME DÉCOR</span>
          </div>
          <div style={{ position: 'absolute', bottom: 12, left: 14 }}>
            <div style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>Delhi crafts</div>
            <div style={{ color: 'rgba(255,255,255,.55)', fontSize: 10 }}>Lamps · Ceramics · Decor</div>
          </div>
        </div>
      </div>

      {/* Floating stats pill */}
      <div style={{
        position: 'absolute', bottom: -22, left: '50%', transform: 'translateX(-50%)',
        background: '#fff', borderRadius: 40, padding: '11px 28px',
        boxShadow: '0 10px 40px rgba(28,25,21,.16)',
        display: 'flex', gap: 28, alignItems: 'center',
        border: '1px solid rgba(28,25,21,.06)', whiteSpace: 'nowrap', zIndex: 10,
      }}>
        {STATS.map(({ n, l }, i) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: i > 0 ? 0 : 0 }}>
            {i > 0 && <div style={{ width: 1, height: 24, background: 'rgba(28,25,21,.1)', marginRight: 28 }} />}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 900, color: T.ink }}>{n}</div>
              <div style={{ fontSize: 9, color: T.mu, fontWeight: 600, letterSpacing: '.04em' }}>{l}</div>
            </div>
          </div>
        ))}
      </div>

      <style>{`@keyframes heroPulse { 0%,100%{opacity:1} 50%{opacity:.3} }`}</style>
    </div>
  );
}

export default function HeroSection() {
  const dispatch = useDispatch();
  const [hovMain, setHovMain] = useState(false);
  const [hovSec,  setHovSec]  = useState(false);

  return (
    <section style={{ background: T.c, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -200, right: -200, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(196,119,58,.10),transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -150, left: -150, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(61,122,82,.08),transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ ...W, padding: '80px 56px 72px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }}>

          {/* Left — text */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: T.t, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.t, flexShrink: 0 }} />
              <span style={{ width: 28, height: 1.5, background: `linear-gradient(90deg,${T.t},transparent)`, display: 'inline-block' }} />
              India's B2B Wholesale Marketplace
            </div>

            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(42px,5vw,68px)', fontWeight: 900, lineHeight: 1.01, letterSpacing: -2.5, color: T.ink, marginBottom: 22 }}>
              Where brands<br/>meet{' '}
              <em style={{ fontStyle: 'italic', background: `linear-gradient(135deg,${T.t} 0%,#E8A060 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>buyers</em>
            </h1>

            <p style={{ fontSize: 17, color: T.is, lineHeight: 1.82, marginBottom: 38, maxWidth: 430, fontWeight: 400 }}>
              Discover 50,000+ products from 5,000+ verified Indian suppliers. Order wholesale, pay on terms, and grow faster — all in one place.
            </p>

            <div style={{ display: 'flex', gap: 12, marginBottom: 40 }}>
              <button
                onClick={() => dispatch(toggleLogin(true))}
                onMouseEnter={() => setHovMain(true)} onMouseLeave={() => setHovMain(false)}
                style={{ padding: '15px 34px', borderRadius: 10, background: hovMain ? `linear-gradient(135deg,${T.td},#8A5226)` : `linear-gradient(135deg,${T.t},${T.td})`, color: '#fff', fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 8px 28px rgba(196,119,58,.38)', transform: hovMain ? 'translateY(-2px)' : 'none', transition: '.2s' }}>
                Start sourcing free
              </button>
              <button
                onClick={() => dispatch(toggleLogin(true))}
                onMouseEnter={() => setHovSec(true)} onMouseLeave={() => setHovSec(false)}
                style={{ padding: '14px 28px', borderRadius: 10, background: hovSec ? T.tl : T.w, color: T.ink, fontSize: 15, fontWeight: 600, border: `1.5px solid ${hovSec ? T.t : T.b}`, cursor: 'pointer', fontFamily: 'inherit', boxShadow: shadow.sm, transition: '.18s' }}>
                List your brand →
              </button>
            </div>

            <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap' }}>
              {['GST Verified', 'Trade Assured', 'Net 30 Terms'].map(txt => (
                <div key={txt} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: T.mu, fontWeight: 500 }}>
                  <span style={{ width: 20, height: 20, borderRadius: '50%', background: T.gl, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: T.g, fontWeight: 700 }}>✓</span>
                  {txt}
                </div>
              ))}
            </div>
          </div>

          {/* Right — photo mosaic */}
          <PhotoMosaic />

        </div>
      </div>
    </section>
  );
}
