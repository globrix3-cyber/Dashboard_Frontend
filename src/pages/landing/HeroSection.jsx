import { Link } from 'react-router-dom';
import { useBreakpoint } from '../../hooks/useBreakpoint';

const IMG_SRC = '/images/v4/hero-natural-chair.jpg';
const IMG_ALT = 'Light wooden armchair, sideboard and table in a calm, sunlit room';
const SERIF   = "'Canela', 'Cormorant Garamond', Georgia, serif";
const MOCHA   = '#5B4632';

// Solid mocha call-to-action used across the new reference (176x44, 13px/600).
const ctaStyle = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', minWidth: 176, height: 44, padding: '0 16px', background: MOCHA, color: '#FFFFFF', borderRadius: 3, fontSize: 13, fontWeight: 600, lineHeight: '18.2px', letterSpacing: '.1px', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'background .15s' };
const hoverOn  = e => { e.currentTarget.style.background = '#4A3828'; };
const hoverOff = e => { e.currentTarget.style.background = MOCHA; };

export default function HeroSection() {
  const bp = useBreakpoint();
  const h1 = { fontFamily: SERIF, fontWeight: 300, lineHeight: 1.03, letterSpacing: '-1.7px', color: MOCHA, margin: 0 };

  /* Mobile: photo on top, text below on the cream page (reference: 458px tall). */
  if (bp.isMobile) {
    return (
      <section style={{ background: '#FDF9F1' }}>
        <img src={IMG_SRC} alt={IMG_ALT} loading="eager" fetchPriority="high" decoding="async"
          style={{ display: 'block', width: '100%', height: 167, objectFit: 'cover', objectPosition: '50% 100%' }} />
        <div style={{ padding: '52px 23px 32px' }}>
          <h1 style={{ ...h1, fontSize: 46 }}>From India<br /><span>with intention</span></h1>
          {/* The reference paints this line cream-on-cream on phones; mocha keeps it readable. */}
          <p style={{ fontSize: 17, lineHeight: 1.7, color: MOCHA, margin: '17px 0 22px' }}>Your next bestsellers start here.</p>
          <Link to="/products" style={ctaStyle} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>Explore wholesale</Link>
        </div>
      </section>
    );
  }

  const side = bp.isTablet ? 32 : 72;
  return (
    <section style={{ position: 'relative', height: bp.isTablet ? 560 : 617, overflow: 'hidden', background: '#EFE6D6' }}>
      <img src={IMG_SRC} alt={IMG_ALT} loading="eager" fetchPriority="high" decoding="async"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 100%' }} />
      {/* Very soft scrim behind the copy so the white subtitle stays readable on the pale wall. */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 42% 30% at 20% 63%, rgba(43,32,22,.30) 0%, rgba(43,32,22,.12) 55%, rgba(43,32,22,0) 100%)' }} />
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', padding: `27px ${side}px 0`, maxWidth: 1440, margin: '0 auto', boxSizing: 'border-box' }}>
        <h1 style={{ ...h1, fontSize: bp.isTablet ? 62 : 76.176 }}>From India<br /><span>with intention</span></h1>
        {/* White as in the reference; a soft shadow keeps it legible over the light wall. */}
        <p style={{ fontSize: bp.isTablet ? 20 : 23, lineHeight: 1.6, color: '#FFFFFF', margin: '21px 0 29px', textShadow: '0 1px 2px rgba(43,32,22,.6), 0 0 10px rgba(43,32,22,.45), 0 0 24px rgba(43,32,22,.3)' }}>
          Your next bestsellers start here.
        </p>
        <Link to="/products" style={ctaStyle} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>Explore wholesale</Link>
      </div>
    </section>
  );
}
