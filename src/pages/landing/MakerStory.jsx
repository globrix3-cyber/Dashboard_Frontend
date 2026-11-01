import { useNavigate } from 'react-router-dom';
import { useBreakpoint } from '../../hooks/useBreakpoint';

export default function MakerStory() {
  const navigate = useNavigate();
  const bp       = useBreakpoint();
  return (
    <section id="makers" style={{ display: 'grid', gridTemplateColumns: bp.isMobile ? '1fr' : '1fr 1fr', background: '#5B4632' }}>
      <img src="/images/v3/furniture-design-workspace-edited.jpg" alt="Furniture designer sketching an armchair" loading="lazy" decoding="async"
        style={{ width: '100%', height: bp.isMobile ? 280 : '100%', minHeight: bp.isMobile ? 0 : 510, objectFit: 'cover', display: 'block' }} />
      <div style={{ padding: bp.isMobile ? '40px 18px' : bp.isTablet ? '48px 32px' : '0 80px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: bp.isMobile ? 36 : 48, fontWeight: 500, lineHeight: 1.1, color: '#F4D9A0', margin: 0 }}>
          Made with purpose.<br />Chosen with <em>care.</em>
        </h2>
        <p style={{ color: '#F0DCC0', fontSize: 14, lineHeight: 1.6, maxWidth: 360, margin: '24px 0 28px' }}>
          The best stores tell a story. Fill yours with objects that have one of their own — from tactile textiles to everyday ceramics, and the people who bring them to life.
        </p>
        <button onClick={() => navigate('/products')}
          style={{ display: 'flex', gap: 38, padding: '18px 23px', background: '#C8792C', color: '#2B2016', fontSize: 13, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
          Find your next discovery <span>↗</span>
        </button>
        <p style={{ marginTop: 28, marginBottom: 0, fontSize: 9, letterSpacing: '.18em', color: '#F4D9A0' }}>FROM INDIA. FOR YOUR NEXT CHAPTER.</p>
      </div>
    </section>
  );
}
