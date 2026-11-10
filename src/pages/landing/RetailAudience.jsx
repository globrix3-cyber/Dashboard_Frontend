import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBreakpoint, rGutter } from '../../hooks/useBreakpoint';

const SERIF       = "'Canela', 'Cormorant Garamond', Georgia, serif";
const LEFT_IMAGE  = '/images/v3/retailer-shop-cottonbro.jpg';
const RIGHT_IMAGE = '/images/v3/retailer-packing-kampus.jpg';

export default function RetailAudience() {
  const bp = useBreakpoint();
  const [btnHov, setBtnHov] = useState(false);

  // Square portraits, as in the reference (406px desktop, 169px mobile)
  const imgStyle = { width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', display: 'block', background: '#79634E' };
  const left  = <img src={LEFT_IMAGE}  alt="Shop owner behind the counter of her lifestyle store" loading="lazy" decoding="async" style={imgStyle} />;
  const right = <img src={RIGHT_IMAGE} alt="Retailer holding a packed shipping box"       loading="lazy" decoding="async" style={imgStyle} />;

  const text = (
    <div style={{ textAlign: 'center', padding: bp.isMobile ? '0 14px' : bp.isTablet ? '0 8px' : '0 39px' }}>
      <h2 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: bp.isMobile ? 33 : bp.isTablet ? 33 : 33.1, lineHeight: 1.05, letterSpacing: bp.isMobile ? '-.5px' : '-.4px', color: '#F4D9A0', margin: bp.isMobile ? '0 0 25px' : '0 0 22px' }}>
        From Local Shops to Growing Retail Businesses
      </h2>
      <p style={{ fontSize: bp.isMobile ? 16 : 17, fontWeight: 400, lineHeight: 1.65, color: '#F0DCC0', maxWidth: bp.isDesktop ? 390 : 'none', margin: bp.isMobile ? '0 auto 27px' : '0 auto 19px' }}>
        Globrixa helps retailers, importers, and online sellers source distinctive furniture and home accessories their customers will love.
      </p>
      <Link
        to="/products"
        onMouseEnter={() => setBtnHov(true)}
        onMouseLeave={() => setBtnHov(false)}
        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between', width: bp.isMobile ? 164 : 162, height: 48, boxSizing: 'border-box', padding: '0 22px', background: btnHov ? '#D68A3C' : '#C8792C', color: '#2B2016', fontSize: 13, fontWeight: 500, letterSpacing: 'normal', textDecoration: 'none', transition: 'background .2s ease' }}
      >
        Start sourcing <span style={{ fontSize: 11 }}>↗</span>
      </Link>
    </div>
  );

  return (
    <section style={{ background: '#5B4632', padding: bp.isMobile ? '36px 0' : bp.isTablet ? '48px 0' : '34.56px 0' }}>
      {bp.isMobile ? (
        <div style={{ ...rGutter(bp), paddingLeft: 19.5, paddingRight: 19.5 }}>
          {text}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 13, marginTop: 30 }}>
            {left}{right}
          </div>
        </div>
      ) : (
        <div style={{ ...rGutter(bp), ...(bp.isDesktop && { paddingLeft: 61.9, paddingRight: 61.9, minHeight: 471 }), display: 'grid', gridTemplateColumns: bp.isTablet ? '1fr 1.3fr 1fr' : '406fr 504fr 406fr', alignItems: 'center', gap: bp.isTablet ? 20 : 0 }}>
          {left}{text}{right}
        </div>
      )}
    </section>
  );
}
