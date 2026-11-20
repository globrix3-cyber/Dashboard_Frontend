import { Link } from 'react-router-dom';
import { useLandingBreakpoint } from '../../hooks/useBreakpoint';

const MOCHA = '#5B4632';
const CREAM = '#FDF9F1';

// Mirrors the reference .home-about-banner: full-bleed photo at a 3.6:1 ratio
// (3:1 on tablets, 1.8:1 on phones; min 280/260/250px), heading clamp(46px, 6vw, 88px)
// with .12em tracking, "Know more" nudged 12px below the centred stack.
export default function AboutBanner() {
  const bp = useLandingBreakpoint();
  const m = bp.isMobile, t = bp.isTablet;
  return (
    <section aria-labelledby="gx-about-banner" style={{
      position: 'relative', isolation: 'isolate', display: 'grid', placeItems: 'center', width: '100%', overflow: 'hidden', background: MOCHA,
      aspectRatio: m ? '1.8 / 1' : t ? '3 / 1' : '3.6 / 1', minHeight: m ? 250 : t ? 260 : 280,
    }}>
      <img src="/images/v4/about-woven-woodwork.jpg" alt="" loading="lazy" decoding="async"
        style={{ position: 'absolute', inset: 0, zIndex: -2, width: '100%', height: '100%', objectFit: 'cover', objectPosition: m ? '43% center' : 'center' }} />
      {/* Reference tint plus a soft local scrim so the lighter weave never fights the heading. */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: -1, background: 'radial-gradient(ellipse 55% 60% at 50% 45%, rgba(43,32,22,.28) 0%, rgba(43,32,22,0) 100%), rgba(43,32,22,.12)' }} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: m || t ? 25 : 29, padding: '40px 6%', textAlign: 'center' }}>
        <h2 id="gx-about-banner" style={{ margin: 0, paddingLeft: '.12em', fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: m ? 'clamp(42px, 8vw, 60px)' : 'clamp(46px, 6vw, 88px)', fontWeight: 600, lineHeight: 1.05, letterSpacing: '.12em', color: CREAM, textShadow: '0 2px 18px rgba(43,32,22,.4)' }}>
          ABOUT US
        </h2>
        <Link to="/about" aria-label="Know more about Globrixa"
          style={{ position: 'relative', top: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', width: 176, maxWidth: '100%', height: 44, padding: '0 16px', background: MOCHA, color: CREAM, borderRadius: 3, fontSize: 13, fontWeight: 600, lineHeight: 1.4, letterSpacing: '.1px', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'background .2s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#2B2016'; }}
          onMouseLeave={e => { e.currentTarget.style.background = MOCHA; }}>
          Know more
        </Link>
      </div>
    </section>
  );
}
