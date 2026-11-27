import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLandingBreakpoint } from '../../hooks/useBreakpoint';

const SERIF       = "'Canela', 'Cormorant Garamond', Georgia, serif";
const LEFT_IMAGE  = '/images/v3/retailer-shop-cottonbro.jpg';
const RIGHT_IMAGE = '/images/v3/retailer-packing-kampus.jpg';

// Mirrors the reference #for-retailers rules: above 760px an 8:3 band with three
// columns (1fr 1.05fr 1fr, 3% gap) and fluid type; on phones the copy sits on top
// and the two square portraits sit side by side below it.
export default function RetailAudience() {
  const bp = useLandingBreakpoint();
  const m = bp.isMobile, t = bp.isTablet;
  const [btnHov, setBtnHov] = useState(false);

  const imgStyle = { display: 'block', width: '100%', height: 'auto', aspectRatio: '1 / 1', objectFit: 'cover', background: '#79634E', minHeight: 0 };
  const left  = <img src={LEFT_IMAGE}  alt="Shop owner behind the counter of her lifestyle store" loading="lazy" decoding="async" style={{ ...imgStyle, objectPosition: 'center', gridRow: m ? 2 : undefined }} />;
  const right = <img src={RIGHT_IMAGE} alt="Retailer holding a packed shipping box" loading="lazy" decoding="async" style={{ ...imgStyle, objectPosition: 'center top', gridRow: m ? 2 : undefined }} />;

  const h2 = m
    ? { fontSize: 'clamp(33px, 8vw, 43px)', letterSpacing: '-.5px' }
    : t ? { fontSize: 'clamp(21px, 2.4vw, 26px)', letterSpacing: '-.4px' } : { fontSize: 'clamp(25px, 2.3vw, 38px)', letterSpacing: '-.4px' };
  const p = m
    ? { fontSize: 16, lineHeight: 1.7, maxWidth: 360, margin: '20px auto 24px' }
    : t ? { fontSize: 13, lineHeight: 1.5, maxWidth: 390, margin: '13px auto 15px' } : { fontSize: 'clamp(15px, 1.2vw, 17px)', lineHeight: 1.6, maxWidth: 390, margin: '18px auto 20px' };

  const text = (
    <div style={{ textAlign: 'center', minWidth: 0, padding: m ? '0 4% 5px' : 0, gridColumn: m ? '1 / -1' : undefined, gridRow: m ? 1 : undefined }}>
      <h2 style={{ fontFamily: SERIF, fontWeight: 300, lineHeight: 1.1, color: '#F4D9A0', margin: 0, textWrap: 'balance', ...h2 }}>
        From Local Shops to Growing Retail Businesses
      </h2>
      <p style={{ fontWeight: 400, color: '#F0DCC0', ...p }}>
        Globrixa helps retailers, importers, and online sellers source distinctive furniture and home accessories their customers will love.
      </p>
      <Link className="gx-btn-gold"
        to="/contact"
        onMouseEnter={() => setBtnHov(true)}
        onMouseLeave={() => setBtnHov(false)}
        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 176, maxWidth: '100%', height: 44, boxSizing: 'border-box', padding: '0 16px', borderRadius: 3, background: btnHov ? '#F0DCC0' : '#E3D5C1', color: '#5B4632', fontSize: 13, fontWeight: 600, lineHeight: 1.4, letterSpacing: '.1px', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'background .2s ease' }}
      >
        Start sourcing
      </Link>
    </div>
  );

  return (
    <section id="for-retailers" style={{
      scrollMarginTop: 30, display: 'grid', alignItems: 'center', background: '#5B4632', color: '#F4D9A0', boxSizing: 'border-box', width: '100%',
      ...(m
        ? { gridTemplateColumns: '1fr 1fr', gap: '25px 14px', padding: '36px 5%' }
        : { aspectRatio: '8 / 3', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.05fr) minmax(0, 1fr)', gridTemplateRows: 'minmax(0, 1fr)', columnGap: t ? '2.4%' : '3%', padding: t ? '26px 3.5%' : 'clamp(22px, 2.4vw, 40px) 4.3%' }),
    }}>
      {m ? <>{text}{left}{right}</> : <>{left}{text}{right}</>}
    </section>
  );
}
