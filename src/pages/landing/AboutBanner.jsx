import { Link } from 'react-router-dom';
import { useBreakpoint } from '../../hooks/useBreakpoint';

const MOCHA = '#5B4632';
const CREAM = '#FDF9F1';

// Full-bleed "ABOUT US" band (reference: 400px tall at 1440, 250px at 390).
export default function AboutBanner() {
  const bp = useBreakpoint();
  const m  = bp.isMobile;
  const size = m ? 42 : bp.isTablet ? 66 : 86.4;
  const spacing = size * 0.12;
  return (
    <section aria-labelledby="gx-about-banner" style={{ position: 'relative', height: m ? 250 : bp.isTablet ? 340 : 400, overflow: 'hidden', background: MOCHA }}>
      <img src="/images/v4/about-woven-woodwork.jpg" alt="" loading="lazy" decoding="async"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: m ? '43% 50%' : '50% 50%' }} />
      {/* Soft scrim: the photo is already dark; this only steadies the lighter weave behind the heading. */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 55% 60% at 50% 45%, rgba(43,32,22,.28) 0%, rgba(43,32,22,0) 100%)' }} />
      <div style={{ position: 'relative', height: '100%', boxSizing: 'border-box', paddingTop: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <h2 id="gx-about-banner" style={{ margin: `0 0 ${m ? 38 : 41}px`, paddingLeft: spacing, fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: size, fontWeight: 600, lineHeight: 1.05, letterSpacing: spacing, color: CREAM, textShadow: '0 2px 16px rgba(43,32,22,.35)' }}>
          ABOUT US
        </h2>
        <Link to="/about" aria-label="Know more about Globrixa"
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', minWidth: 176, height: 44, padding: '0 16px', background: MOCHA, color: CREAM, borderRadius: 3, fontSize: 13, fontWeight: 600, lineHeight: '18.2px', letterSpacing: '.1px', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'background .15s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#4A3828'; }}
          onMouseLeave={e => { e.currentTarget.style.background = MOCHA; }}>
          Know more
        </Link>
      </div>
    </section>
  );
}
