import { Link } from 'react-router-dom';
import { useLandingBreakpoint } from '../../hooks/useBreakpoint';

const MOCHA = '#5B4632';
const CREAM = '#FDF9F1';

// Mirrors the reference #home-about-us: full-bleed photo (min 420px, 440px on phones) under an even
// dark wash, heading clamp(46px, 6vw, 88px) with .12em tracking, a two-line Canela statement
// (1.74vw on one line each from 761px, 20px wrapped on phones) and "Know more".
export default function AboutBanner() {
  const bp = useLandingBreakpoint();
  const m = bp.isMobile;
  return (
    <section aria-labelledby="gx-about-banner" style={{
      position: 'relative', isolation: 'isolate', display: 'grid', placeItems: 'center', width: '100%', overflow: 'hidden', background: MOCHA,
      minHeight: m ? 440 : 420,
    }}>
      <img src="/images/v4/about-woven-woodwork.jpg" alt="" loading="lazy" decoding="async"
        style={{ position: 'absolute', inset: 0, zIndex: -2, width: '100%', height: '100%', objectFit: 'cover', objectPosition: m ? '43% center' : 'center' }} />
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: -1, background: 'linear-gradient(90deg, rgba(43,32,22,.46), rgba(43,32,22,.54), rgba(43,32,22,.46))' }} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, width: '100%', boxSizing: 'border-box', padding: m ? '36px 7%' : '40px 4%', textAlign: 'center' }}>
        <h2 id="gx-about-banner" style={{ margin: 0, paddingLeft: '.12em', fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: m ? 'clamp(42px, 8vw, 60px)' : 'clamp(46px, 6vw, 88px)', fontWeight: 600, lineHeight: 1.05, letterSpacing: '.12em', color: CREAM, textShadow: '0 2px 18px rgba(43,32,22,.4)' }}>
          ABOUT US
        </h2>
        <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: m ? 900 : 'none', color: CREAM, fontFamily: "'Canela', Georgia, serif", fontSize: m ? 'clamp(20px, 1.65vw, 26px)' : '1.74vw', fontWeight: 300, fontStyle: 'normal', textShadow: '0 2px 12px rgba(43,32,22,.4)' }}>
          <p style={{ margin: 0, lineHeight: 1.45, whiteSpace: m ? 'normal' : 'nowrap' }}>Rooted in India, Globrixa brings furniture and home accessories with character to retailers, importers and online sellers.</p>
          <p style={{ margin: 0, lineHeight: 1.45, whiteSpace: m ? 'normal' : 'nowrap' }}>From thoughtfully chosen collections to custom creations, we help shape your store’s vision into pieces your customers connect with.</p>
        </div>
        <Link className="gx-btn-gold" to="/about" aria-label="Know more about Globrixa"
          style={{ position: 'relative', top: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', width: 176, maxWidth: '100%', height: 44, padding: '0 16px', background: MOCHA, color: CREAM, borderRadius: 3, fontSize: 13, fontWeight: 600, lineHeight: 1.4, letterSpacing: '.1px', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'background .2s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#2B2016'; }}
          onMouseLeave={e => { e.currentTarget.style.background = MOCHA; }}>
          Know more
        </Link>
      </div>
    </section>
  );
}
