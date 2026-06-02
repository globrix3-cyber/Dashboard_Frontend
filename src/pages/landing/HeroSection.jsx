import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleLogin } from '../../features/auth/authSlice';
import { T, shadow } from './tokens';
import { IMG } from './images';
import { useBreakpoint, rW } from '../../hooks/useBreakpoint';

const STATS = [
  { n: '$30M+',  l: 'Monthly Volume' },
  { n: '50K+',   l: 'Products' },
  { n: '5,000+', l: 'Suppliers' },
];

function PhotoMosaic({ bp }) {
  if (bp.isMobile) {
    return (
      <div style={{ borderRadius: 18, overflow: 'hidden', position: 'relative', height: 240 }}>
        <img src={IMG.artisanWeaving} alt="Indian artisan weaving on a traditional loom"
          loading="eager" fetchpriority="high" decoding="sync"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(18,14,10,.7) 0%,rgba(18,14,10,.1) 60%,transparent)' }} />
        <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
          <div style={{ fontFamily: "'Cormorant Garamond','Playfair Display',serif", color: '#fff', fontSize: 17, fontWeight: 700, marginBottom: 3 }}>5,000+ Verified Suppliers</div>
          <div style={{ color: 'rgba(255,255,255,.6)', fontSize: 11 }}>MSMEs · Artisans · Exporters</div>
        </div>
        <div style={{ position: 'absolute', top: 12, left: 14 }}>
          <span style={{ background: 'rgba(196,119,58,.92)', backdropFilter: 'blur(8px)', color: '#fff', fontSize: 9, fontWeight: 800, padding: '4px 10px', borderRadius: 20, letterSpacing: '.08em', display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff', animation: 'heroPulse 1.8s ease infinite', display: 'inline-block' }} />
            LIVE
          </span>
        </div>
        <style>{`@keyframes heroPulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
      </div>
    );
  }

  const twoCol = bp.isTablet;

  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: twoCol ? '1fr 1fr' : '1.15fr 0.85fr',
        gridTemplateRows: twoCol ? '220px' : '220px 220px',
        gap: 10, borderRadius: 24, overflow: 'hidden',
      }}>
        {/* Main artisan — spans 2 rows on desktop */}
        <div style={{ gridRow: twoCol ? '1' : '1 / 3', position: 'relative', overflow: 'hidden' }}>
          <img src={IMG.artisanWeaving} alt="Indian artisan weaving on a traditional loom"
            loading="eager" fetchpriority="high" decoding="sync"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', transition: 'transform .6s ease', display: 'block' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(18,14,10,.82) 0%,rgba(18,14,10,.08) 55%,transparent)' }} />
          <div style={{ position: 'absolute', top: 16, left: 16 }}>
            <span style={{ background: 'rgba(196,119,58,.92)', backdropFilter: 'blur(8px)', color: '#fff', fontSize: 9, fontWeight: 800, padding: '5px 12px', borderRadius: 20, letterSpacing: '.1em', display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff', animation: 'heroPulse 1.8s ease infinite', display: 'inline-block' }} />
              LIVE MARKETPLACE
            </span>
          </div>
          <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
            <div style={{ fontFamily: "'Cormorant Garamond','Playfair Display',serif", color: '#fff', fontSize: 20, fontWeight: 700, marginBottom: 4, lineHeight: 1.2 }}>5,000+ Verified<br/>Suppliers</div>
            <div style={{ color: 'rgba(255,255,255,.6)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 16, height: 1, background: 'rgba(255,255,255,.35)', display: 'inline-block' }} />
              MSMEs, Artisans & Exporters
            </div>
          </div>
        </div>

        {/* Top-right — handmade pottery */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <img src={IMG.handmadePottery} alt="Vibrant handmade pottery — Handicrafts category"
            loading="eager" fetchpriority="high" decoding="sync"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .5s ease' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(18,14,10,.65) 0%,transparent 55%)' }} />
          <div style={{ position: 'absolute', top: 12, left: 12 }}>
            <span style={{ background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,.22)', color: '#fff', fontSize: 8, fontWeight: 800, padding: '4px 10px', borderRadius: 20, letterSpacing: '.1em' }}>HANDICRAFTS</span>
          </div>
          <div style={{ position: 'absolute', bottom: 12, left: 14 }}>
            <div style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>982 brands</div>
            <div style={{ color: 'rgba(255,255,255,.55)', fontSize: 10 }}>Pottery · Jewelry · Art</div>
          </div>
        </div>

        {/* Bottom-right — mosaic lamps (desktop only) */}
        {!twoCol && (
          <div style={{ position: 'relative', overflow: 'hidden' }}>
            <img src={IMG.mosaicLamps} alt="Vibrant mosaic glass lamps — Home Décor category"
              loading="eager" fetchpriority="high" decoding="sync"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .5s ease' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(18,14,10,.65) 0%,transparent 55%)' }} />
            <div style={{ position: 'absolute', top: 12, left: 12 }}>
              <span style={{ background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,.22)', color: '#fff', fontSize: 8, fontWeight: 800, padding: '4px 10px', borderRadius: 20, letterSpacing: '.1em' }}>HOME DÉCOR</span>
            </div>
            <div style={{ position: 'absolute', bottom: 12, left: 14 }}>
              <div style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>Delhi crafts</div>
              <div style={{ color: 'rgba(255,255,255,.55)', fontSize: 10 }}>Lamps · Ceramics · Decor</div>
            </div>
          </div>
        )}
      </div>


      <style>{`@keyframes heroPulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
    </div>
  );
}

export default function HeroSection() {
  const dispatch = useDispatch();
  const bp       = useBreakpoint();
  const [hovMain, setHovMain] = useState(false);
  const [hovSec,  setHovSec]  = useState(false);

  const pad = bp.isMobile ? '48px 18px 52px' : bp.isTablet ? '60px 32px 56px' : '80px 56px 72px';

  return (
    <section style={{ background: T.c, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -200, right: -200, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(196,119,58,.10),transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -150, left: -150, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(61,122,82,.08),transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ ...rW, padding: pad, position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: bp.isMobile ? '1fr' : '1fr 1fr',
          gap: bp.isMobile ? 32 : 56,
          alignItems: 'center',
        }}>
          {/* Left — text */}
          <div>
            <h1 style={{ fontFamily: "'Cormorant Garamond','Cormorant Garamond','Playfair Display',serif", fontSize: bp.isMobile ? '40px' : bp.isTablet ? '56px' : 'clamp(52px,5vw,76px)', fontWeight: 700, lineHeight: 1.04, letterSpacing: -1, color: T.ink, marginBottom: 20 }}>
              India's next-generation<br/>
              <span style={{ fontStyle: 'normal', background: `linear-gradient(135deg,${T.t} 0%,#E8A060 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>wholesale marketplace</span>
            </h1>

            <p style={{ fontSize: bp.isMobile ? 15 : 17, color: T.is, lineHeight: 1.82, marginBottom: 32, maxWidth: 460 }}>
              Discover fresh products from Indian manufacturers and growing brands. Built for modern B2B trade — simple, fast, and transparent.
            </p>

            <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
              <button
                onClick={() => dispatch(toggleLogin(true))}
                onMouseEnter={() => setHovMain(true)} onMouseLeave={() => setHovMain(false)}
                style={{ padding: bp.isMobile ? '13px 28px' : '15px 36px', borderRadius: 10, background: hovMain ? `linear-gradient(135deg,${T.td},#8A5226)` : `linear-gradient(135deg,${T.t},${T.td})`, color: '#fff', fontSize: bp.isMobile ? 14 : 15, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 8px 28px rgba(196,119,58,.38)', transform: hovMain ? 'translateY(-2px)' : 'none', transition: '.2s' }}>
                Explore products
              </button>
            </div>

            <div style={{ display: 'flex', gap: bp.isMobile ? 14 : 22, flexWrap: 'wrap' }}>
              {['Verified businesses', 'Easy sourcing', 'Export support'].map(txt => (
                <div key={txt} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: T.mu, fontWeight: 500 }}>
                  <span style={{ width: 18, height: 18, borderRadius: '50%', background: T.gl, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: T.g, fontWeight: 700, flexShrink: 0 }}>✓</span>
                  {txt}
                </div>
              ))}
            </div>
          </div>

          {/* Right — photo mosaic */}
          <PhotoMosaic bp={bp} />
        </div>
      </div>
    </section>
  );
}
