import { useNavigate } from 'react-router-dom';
import { useBreakpoint } from '../../hooks/useBreakpoint';

export default function HeroSection() {
  const navigate = useNavigate();
  const bp       = useBreakpoint();
  const side     = bp.isMobile ? 18 : bp.isTablet ? 32 : 72;

  return (
    <section style={{ position: 'relative', height: bp.isMobile ? 520 : bp.isTablet ? 560 : 620, overflow: 'hidden', background: '#2B2016' }}>
      <img
        src="/images/v3/rustic-living-room-edited.jpg"
        alt="Sunlit rustic living room with a cream sofa and a wooden coffee table"
        loading="eager" fetchPriority="high" decoding="async"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: bp.isMobile ? '62% center' : 'center' }}
      />
      <div style={{ position: 'absolute', inset: 0, background: bp.isMobile ? 'rgba(43,32,22,.58)' : 'linear-gradient(90deg,rgba(43,32,22,.82) 0%,rgba(43,32,22,.5) 42%,rgba(43,32,22,0) 72%)' }} />
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: `0 ${side}px`, maxWidth: 1440, margin: '0 auto', boxSizing: 'border-box' }}>
        <h1 style={{ fontFamily: "'Bodoni Moda', 'Bodoni 72', Didot, serif", fontStyle: 'italic', fontWeight: 400, fontSize: bp.isMobile ? 48 : bp.isTablet ? 62 : 76, lineHeight: 1.06, color: '#FDF9F1', margin: 0 }}>
          From India<br /><span style={{ color: '#F4D9A0' }}>with intention</span>
        </h1>
        <p style={{ fontSize: bp.isMobile ? 18 : 24, lineHeight: 1.55, color: '#FDF9F1', margin: '22px 0 30px', maxWidth: 500 }}>
          Distinctive Indian designs for your next great collection.
        </p>
        <button
          onClick={() => navigate('/products')}
          style={{ alignSelf: 'flex-start', display: 'flex', gap: 38, padding: '15px 21px', background: 'transparent', border: '1px solid #FDF9F1', color: '#FDF9F1', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'background .15s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(253,249,241,.15)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
        >
          Explore wholesale <span>↗</span>
        </button>
      </div>
    </section>
  );
}
