import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleLogin } from '../../features/auth/authSlice';
import { useBreakpoint } from '../../hooks/useBreakpoint';

export default function HeroSection() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const bp       = useBreakpoint();
  const side     = bp.isMobile ? 18 : bp.isTablet ? 32 : 72;

  return (
    <section style={{ position: 'relative', height: bp.isMobile ? 540 : bp.isTablet ? 560 : 617, overflow: 'hidden', background: '#2B2016' }}>
      <img
        src="/images/v3/rustic-living-room-edited.jpg"
        alt="Sunlit rustic living room with a cream sofa and a wooden coffee table"
        loading="eager" fetchPriority="high" decoding="async"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: bp.isMobile ? '62% center' : 'center' }}
      />
      <div style={{ position: 'absolute', inset: 0, background: bp.isMobile ? 'rgba(43,32,22,.58)' : 'linear-gradient(90deg,rgba(43,32,22,.82) 0%,rgba(43,32,22,.5) 42%,rgba(43,32,22,0) 72%)' }} />
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: `${bp.isMobile ? 0 : 90}px ${side}px 0`, maxWidth: 1440, margin: '0 auto', boxSizing: 'border-box' }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500, fontSize: bp.isMobile ? 46 : bp.isTablet ? 60 : 68, lineHeight: 1.08, color: '#FDF9F1', margin: 0 }}>
          Born in India<br /><span style={{ color: '#F4D9A0' }}>Built for the world</span>
        </h1>
        <p style={{ fontSize: bp.isMobile ? 15 : 15, lineHeight: 1.6, color: '#FDF9F1', margin: '20px 0 28px', maxWidth: 545 }}>
          Discover distinctive furniture, rugs, lighting and home accessories for your store with globrixa.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}>
          <button onClick={() => navigate('/products')}
            style={{ display: 'flex', gap: 38, padding: '16px 22px', background: '#C8792C', border: 'none', color: '#2B2016', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
            Explore wholesale <span>↗</span>
          </button>
          <button onClick={() => dispatch(toggleLogin({ show: true, intent: 'supplier' }))}
            style={{ padding: '0 0 4px', background: 'none', border: 'none', borderBottom: '1px solid #FDF9F1', color: '#FDF9F1', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
            Bring your brand to Globrixa
          </button>
        </div>
      </div>
    </section>
  );
}
