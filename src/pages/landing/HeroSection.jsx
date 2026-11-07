import { useNavigate } from 'react-router-dom';
import { useBreakpoint } from '../../hooks/useBreakpoint';

const IMG_SRC = '/images/v3/rustic-living-room-edited.jpg';
const IMG_ALT = 'Sunlit rustic living room with a cream sofa and a wooden coffee table';
const H1_FONT = "'Bodoni 72', 'Bodoni Moda', Didot, serif"; // Bodoni 72 on Apple devices, like the reference

export default function HeroSection() {
  const navigate = useNavigate();
  const bp       = useBreakpoint();

  /* Mobile: as in the reference, the photo sits on top and the text below it on the cream page. */
  if (bp.isMobile) {
    return (
      <section style={{ background: '#FDF9F1' }}>
        <img
          src={IMG_SRC} alt={IMG_ALT}
          loading="eager" fetchPriority="high" decoding="async"
          style={{ display: 'block', width: '100%', height: 167, objectFit: 'cover', objectPosition: 'center' }}
        />
        <div style={{ padding: '52px 23px 31px' }}>
          <h1 style={{ fontFamily: H1_FONT, fontStyle: 'italic', fontWeight: 400, fontSize: 46, lineHeight: 1.03, letterSpacing: '-1.7px', color: '#5B4632', margin: 0 }}>
            From India<br /><span>with intention</span>
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: '#79634E', margin: '14px 0 22px' }}>
            Distinctive Indian designs for your next great collection.
          </p>
          <button
            onClick={() => navigate('/products')}
            style={{ display: 'flex', gap: 21, padding: '15px 22px', background: 'transparent', border: '1px solid #5B4632', color: '#5B4632', fontSize: 11, fontWeight: 700, letterSpacing: '.15px', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Explore wholesale <span aria-hidden="true">↗</span>
          </button>
        </div>
      </section>
    );
  }

  const side = bp.isTablet ? 32 : 72;
  return (
    <section style={{ position: 'relative', height: bp.isTablet ? 560 : 617, overflow: 'hidden', background: '#2B2016' }}>
      <img
        src={IMG_SRC} alt={IMG_ALT}
        loading="eager" fetchPriority="high" decoding="async"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
      />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,rgba(43,32,22,.82) 0%,rgba(43,32,22,.5) 42%,rgba(43,32,22,0) 72%)' }} />
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: `27px ${side}px 0`, maxWidth: 1440, margin: '0 auto', boxSizing: 'border-box' }}>
        <h1 style={{ fontFamily: H1_FONT, fontStyle: 'italic', fontWeight: 400, fontSize: bp.isTablet ? 62 : 76.2, lineHeight: 1.03, letterSpacing: '-1.7px', color: '#FDF9F1', margin: 0 }}>
          From India<br /><span style={{ color: '#F4D9A0' }}>with intention</span>
        </h1>
        <p style={{ fontSize: bp.isTablet ? 20 : 23, lineHeight: 1.6, color: '#FFF4E4', margin: '21.6px 0 29px', maxWidth: 500 }}>
          Distinctive Indian designs for your next great collection.
        </p>
        <button
          onClick={() => navigate('/products')}
          style={{ alignSelf: 'flex-start', display: 'flex', gap: 38, padding: '12.5px 21px', background: 'transparent', border: '1px solid #FDF9F1', color: '#FFFFFF', fontSize: 12, fontWeight: 700, letterSpacing: '.15px', cursor: 'pointer', fontFamily: 'inherit', transition: 'background .15s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(253,249,241,.15)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
        >
          Explore wholesale <span aria-hidden="true">↗</span>
        </button>
      </div>
    </section>
  );
}
