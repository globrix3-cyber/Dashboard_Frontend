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
  const height = bp.isMobile ? 240 : bp.isTablet ? 380 : 460;

  return (
    <div style={{ borderRadius: 24, overflow: 'hidden', position: 'relative', height }}>
      <img
        src={IMG.artisanWeaving}
        alt="Indian artisan weaving on a traditional loom"
        loading="eager" fetchpriority="high" decoding="sync"
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block', transition: 'transform .6s ease' }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
      />
      <div style={{ position: 'absolute', top: 16, left: 16 }}>
        <span style={{ background: 'rgba(196,119,58,.92)', backdropFilter: 'blur(8px)', color: '#fff', fontSize: 9, fontWeight: 800, padding: '5px 12px', borderRadius: 20, letterSpacing: '.1em', display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff', animation: 'heroPulse 1.8s ease infinite', display: 'inline-block' }} />
          LIVE MARKETPLACE
        </span>
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
            <h1 style={{ fontFamily: "'Cormorant Garamond','Playfair Display',serif", fontSize: bp.isMobile ? '40px' : bp.isTablet ? '56px' : 'clamp(52px,5vw,76px)', fontWeight: 700, lineHeight: 1.04, letterSpacing: -1, color: T.ink, marginBottom: 20 }}>
              India's next generation<br/>
              <span style={{ fontStyle: 'normal', background: `linear-gradient(135deg,${T.t} 0%,#E8A060 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>wholesale marketplace</span>
            </h1>

            <p style={{ fontSize: bp.isMobile ? 15 : 17, color: T.is, lineHeight: 1.82, marginBottom: 32, maxWidth: 460 }}>
              Discover fresh products from Indian manufacturers and growing brands. Built for modern B2B trade: simple, fast, and transparent.
            </p>

            <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
              <button
                onClick={() => dispatch(toggleLogin(true))}
                onMouseEnter={() => setHovMain(true)} onMouseLeave={() => setHovMain(false)}
                style={{ padding: bp.isMobile ? '13px 28px' : '15px 36px', borderRadius: 10, background: hovMain ? `linear-gradient(135deg,${T.td},#8A5226)` : `linear-gradient(135deg,${T.t},${T.td})`, color: '#fff', fontSize: bp.isMobile ? 14 : 15, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 8px 28px rgba(196,119,58,.38)', transform: hovMain ? 'translateY(-2px)' : 'none', transition: '.2s' }}>
                Explore products
              </button>
            </div>

            <div style={{ fontSize: 13, color: T.mu, fontWeight: 500 }}>
              Are you a brand?{' '}
              <button
                onClick={() => dispatch(toggleLogin({ show: true, intent: 'supplier' }))}
                onMouseEnter={() => setHovSec(true)} onMouseLeave={() => setHovSec(false)}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, color: T.t, textDecoration: 'underline', textUnderlineOffset: 3 }}
              >
                Sign up to sell
              </button>
            </div>
          </div>

          {/* Right — photo mosaic */}
          <PhotoMosaic bp={bp} />
        </div>
      </div>
    </section>
  );
}
