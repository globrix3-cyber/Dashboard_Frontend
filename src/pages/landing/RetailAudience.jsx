import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBreakpoint, rGutter } from '../../hooks/useBreakpoint';

const SERIF       = "'Cormorant Garamond', Georgia, serif";
const LEFT_IMAGE  = '/images/v3/boutique-studio-portrait.jpg';
const RIGHT_IMAGE = '/images/v3/furniture-shop-portrait.jpg';

export default function RetailAudience() {
  const bp = useBreakpoint();
  const [btnHov, setBtnHov] = useState(false);

  const imgStyle = { width: '100%', aspectRatio: '4 / 5', objectFit: 'cover', display: 'block', background: '#79634E' };
  const left  = <img src={LEFT_IMAGE}  alt="Boutique owner standing in her clothing studio" loading="lazy" decoding="async" style={imgStyle} />;
  const right = <img src={RIGHT_IMAGE} alt="Furniture shop owner seated in her store"       loading="lazy" decoding="async" style={imgStyle} />;

  const text = (
    <div style={{ textAlign: 'center', padding: bp.isMobile ? 0 : bp.isTablet ? '0 8px' : '0 48px' }}>
      <h2 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: bp.isMobile ? 38 : bp.isTablet ? 34 : 40, lineHeight: 1.05, letterSpacing: '-.01em', color: '#F4D9A0', margin: '0 0 22px' }}>
        From Local Shops to Growing Retail Businesses
      </h2>
      <p style={{ fontSize: bp.isMobile ? 15 : 17, lineHeight: 1.65, color: '#F0DCC0', margin: '0 0 28px' }}>
        Globrixa helps retailers, importers, and online sellers source distinctive furniture and home accessories their customers will love.
      </p>
      <Link
        to="/products"
        onMouseEnter={() => setBtnHov(true)}
        onMouseLeave={() => setBtnHov(false)}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 34, padding: '15px 22px', background: btnHov ? '#D68A3C' : '#C8792C', color: '#2B2016', fontSize: 13, fontWeight: 500, textDecoration: 'none', transition: 'background .2s ease' }}
      >
        Start sourcing <span style={{ fontSize: 11 }}>↗</span>
      </Link>
    </div>
  );

  return (
    <section style={{ background: '#5B4632', padding: bp.isMobile ? '48px 0' : '68px 0' }}>
      {bp.isMobile ? (
        <div style={rGutter(bp)}>
          {text}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 40 }}>
            {left}{right}
          </div>
        </div>
      ) : (
        <div style={{ ...rGutter(bp), display: 'grid', gridTemplateColumns: bp.isTablet ? '1fr 1.3fr 1fr' : '406fr 504fr 406fr', alignItems: 'center', gap: bp.isTablet ? 20 : 0 }}>
          {left}{text}{right}
        </div>
      )}
    </section>
  );
}
