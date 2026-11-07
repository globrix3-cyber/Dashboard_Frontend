import { useNavigate } from 'react-router-dom';
import { useBreakpoint } from '../../hooks/useBreakpoint';

export default function MakerStory() {
  const navigate = useNavigate();
  const bp       = useBreakpoint();
  return (
    <section id="makers" style={{ scrollMarginTop: 90, display: 'grid', gridTemplateColumns: bp.isMobile ? '1fr' : '1fr 1fr', background: '#5B4632' }}>
      <img src="/images/v3/furniture-design-workspace-edited.jpg" alt="Furniture designer sketching an armchair" loading="lazy" decoding="async"
        style={{ width: '100%', height: bp.isMobile ? 280 : '100%', minHeight: bp.isMobile ? 0 : 560, objectFit: 'cover', display: 'block' }} />
      <div style={{ padding: bp.isMobile ? '40px 18px 44px' : bp.isTablet ? '56px 32px' : '64px 80px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: bp.isMobile ? 38 : bp.isTablet ? 46 : 56, fontWeight: 300, lineHeight: 1.02, letterSpacing: '-.01em', color: '#F4D9A0', margin: 0 }}>
          Made with purpose.<br />Chosen with care.
        </h2>
        <p style={{ color: '#FDF9F1', fontSize: 13, lineHeight: 1.65, maxWidth: 360, margin: '24px 0 26px' }}>
          The best stores tell a story. Fill yours with objects that have one of their own — from tactile textiles to everyday ceramics, and the people who bring them to life.
        </p>
        <button onClick={() => navigate('/products')}
          style={{ display: 'flex', alignItems: 'center', gap: 38, padding: '19px 23px', background: '#C8792C', color: '#2B2016', fontSize: 12, border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'background .15s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#B56A22'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#C8792C'; }}>
          Find your next discovery <span aria-hidden="true">↗</span>
        </button>
        <p style={{ marginTop: 32, marginBottom: 0, fontSize: 8, fontWeight: 500, letterSpacing: '.2em', color: '#F4D9A0' }}>FROM INDIA. FOR YOUR NEXT CHAPTER.</p>
      </div>
    </section>
  );
}
