import { useNavigate } from 'react-router-dom';
import { useBreakpoint } from '../../hooks/useBreakpoint';

export default function MakerStory() {
  const navigate = useNavigate();
  const bp       = useBreakpoint();
  const m        = bp.isMobile;
  // Reference layout: 1440px → 510px tall (720x510 photo, copy column top-aligned at +112, x=799);
  // 390px → 726px tall (390x330 photo on top, copy at +386, x=27).
  const textPad = m ? '56px 27px 44px' : bp.isTablet ? '56px 32px' : '112px 80px 82px 79px';
  return (
    <section id="makers" style={{ scrollMarginTop: 90, display: 'grid', gridTemplateColumns: m ? '1fr' : '1fr 1fr', background: '#5B4632' }}>
      {/* Photo is absolutely filled on wider screens so its square intrinsic size can't stretch the row past the copy column. */}
      <div style={{ position: 'relative', height: m ? 330 : 'auto', minHeight: m ? 0 : 320 }}>
        <img src="/images/v3/furniture-design-workspace-edited.jpg" alt="Furniture designer sketching an armchair" loading="lazy" decoding="async"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
      <div style={{ padding: textPad, display: 'flex', flexDirection: 'column', justifyContent: bp.isTablet ? 'center' : 'flex-start', alignItems: 'flex-start' }}>
        <h2 style={{ fontFamily: "'Canela', 'Cormorant Garamond', Georgia, serif", fontSize: m ? 43 : bp.isTablet ? 46 : 48, fontWeight: 300, lineHeight: 1.1, letterSpacing: '-1px', color: '#F4D9A0', margin: 0 }}>
          Made with purpose.<br />Chosen with care.
        </h2>
        <p style={{ color: '#FDF9F1', fontSize: 12, lineHeight: 1.8, maxWidth: m ? 335 : 360, margin: m ? '23px 0 25px' : '22px 0 26px' }}>
          The best stores tell a story. Fill yours with objects that have one of their own — from tactile textiles to everyday ceramics, and the people who bring them to life.
        </p>
        <button onClick={() => navigate('/products')}
          style={{ display: 'flex', alignItems: 'center', gap: m ? 26 : 38, padding: m ? '14.5px 18px' : '16.5px 23px', background: '#C8792C', color: '#2B2016', fontSize: m ? 11 : 12, fontWeight: 500, border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'background .15s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#B56A22'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#C8792C'; }}>
          Find your next discovery <span aria-hidden="true">↗</span>
        </button>
        <p style={{ marginTop: m ? 28 : 31, marginBottom: 0, fontSize: 8, fontWeight: 400, letterSpacing: '1.7px', color: '#F4D9A0' }}>FROM INDIA. FOR YOUR NEXT CHAPTER.</p>
      </div>
    </section>
  );
}
