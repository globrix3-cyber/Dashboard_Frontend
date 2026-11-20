import { Link } from 'react-router-dom';
import { useLandingBreakpoint } from '../../hooks/useBreakpoint';

const IMG_SRC = '/images/v4/hero-natural-chair.jpg';
const IMG_ALT = 'Light wooden armchair, sideboard and table in a calm, sunlit room';
const SERIF   = "'Canela', 'Cormorant Garamond', Georgia, serif";
const MOCHA   = '#5B4632';

// Solid mocha call-to-action used across the reference (176x44, 13px/600).
const ctaStyle = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', width: 176, maxWidth: '100%', height: 44, padding: '0 16px', background: MOCHA, color: '#FFFFFF', borderRadius: 3, fontSize: 13, fontWeight: 600, lineHeight: 1.4, letterSpacing: '.1px', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'background .2s' };
const hoverOn  = e => { e.currentTarget.style.background = '#2B2016'; };
const hoverOff = e => { e.currentTarget.style.background = MOCHA; };

// Mirrors the reference's .scene-hero rules: the photo keeps a 1915:821 ratio at
// every width; the copy sits over it (left 5%, vertically centred) above 760px and
// drops below it on phones. Sizes use the reference's clamp() expressions.
export default function HeroSection() {
  const bp = useLandingBreakpoint();
  const m = bp.isMobile, t = bp.isTablet;

  const h1 = {
    fontFamily: SERIF, fontWeight: 300, lineHeight: 1.03, letterSpacing: '-1.7px', color: MOCHA,
    fontSize: m ? 'clamp(46px, 10.925vw, 71.3px)' : t ? 'clamp(40.25px, 5.29vw, 56.35px)' : 'clamp(43.7px, 5.29vw, 87.4px)',
    margin: m ? '20px 0 17px' : t ? '14px 0' : 'clamp(16px, 1.8vw, 30px) 0 clamp(12px, 1.5vw, 24px)',
  };
  const p = {
    margin: 0, lineHeight: m ? 1.7 : 1.6,
    fontSize: m ? 17 : t ? 18 : 'clamp(18px, 1.6vw, 23px)',
    maxWidth: m ? 'none' : 540,
    // The reference paints this line white even on the cream phone layout (invisible);
    // mocha keeps it readable there. Over the photo it stays white with a soft shadow.
    color: m ? MOCHA : '#FFFFFF',
    textShadow: m ? 'none' : '0 1px 2px rgba(43,32,22,.75), 0 0 6px rgba(43,32,22,.6), 0 0 14px rgba(43,32,22,.5), 0 0 28px rgba(43,32,22,.38)',
  };
  const copy = m
    ? { position: 'relative', padding: '32px 6%' }
    : { position: 'absolute', top: '50%', left: t ? '4%' : '5%', width: t ? '60%' : '57%', transform: 'translateY(-50%)' };

  return (
    <section style={{ position: 'relative', width: '100%', overflow: 'hidden', isolation: 'isolate', background: '#FDF9F1' }}>
      <img src={IMG_SRC} alt={IMG_ALT} loading="eager" fetchPriority="high" decoding="async"
        style={{ display: 'block', width: '100%', height: 'auto', aspectRatio: '1915 / 821', objectFit: 'cover', objectPosition: 'center bottom' }} />
      {!m && (
        /* Very soft scrim behind the copy so the white subtitle stays readable on the pale wall. */
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 30% 10% at 19% 61%, rgba(43,32,22,.40) 0%, rgba(43,32,22,.2) 60%, rgba(43,32,22,0) 100%), radial-gradient(ellipse 42% 30% at 20% 63%, rgba(43,32,22,.22) 0%, rgba(43,32,22,.08) 55%, rgba(43,32,22,0) 100%)' }} />
      )}
      <div style={{ ...copy, boxSizing: 'border-box', color: MOCHA }}>
        <h1 style={h1}>From India<br /><span>with intention</span></h1>
        <p style={p}>Your next bestsellers start here.</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: m ? 20 : t ? 16 : 24, flexWrap: m ? 'wrap' : 'nowrap', marginTop: m ? 22 : t ? 16 : 'clamp(18px, 2vw, 32px)' }}>
          <Link to="/products" style={ctaStyle} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>Explore wholesale</Link>
        </div>
      </div>
    </section>
  );
}
