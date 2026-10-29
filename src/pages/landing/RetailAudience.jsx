import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleLogin } from '../../features/auth/authSlice';
import { useBreakpoint, rPad, rW } from '../../hooks/useBreakpoint';

// Placeholder images — the client will supply final images via Drive.
const LEFT_IMAGE  = '/images/people/woman-artisan-market.jpg';
const RIGHT_IMAGE = '/images/people/businessman-portrait.jpg';

export default function RetailAudience() {
  const dispatch = useDispatch();
  const bp       = useBreakpoint();
  const [btnHov, setBtnHov] = useState(false);

  const cols = bp.isMobile ? '1fr' : bp.isTablet ? '1fr 1.2fr' : '1fr 1.1fr 1fr';

  const imgStyle = {
    width: '100%',
    aspectRatio: bp.isMobile ? '4 / 3' : '4 / 5',
    objectFit: 'cover',
    borderRadius: 4,
    display: 'block',
  };

  const leftImage = (
    <img src={LEFT_IMAGE} alt="Shop owner in her store" loading="lazy" decoding="async" style={imgStyle} />
  );

  const text = (
    <div style={{ textAlign: 'center' }}>
      <h2 style={{
        fontFamily: "'Cormorant Garamond','Playfair Display',serif",
        fontWeight: 500,
        fontSize: 'clamp(28px,3vw,40px)',
        lineHeight: 1.15,
        color: '#F0DCC0',
        margin: '0 0 18px',
      }}>
        From Local Shops to Growing Retail Businesses
      </h2>
      <p style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(253,249,241,.85)', margin: '0 0 28px' }}>
        Globrixa helps retailers, importers, and online sellers source distinctive furniture and home accessories their customers will love.
      </p>
      <button
        onClick={() => dispatch(toggleLogin(true))}
        onMouseEnter={() => setBtnHov(true)}
        onMouseLeave={() => setBtnHov(false)}
        style={{
          background: btnHov ? '#D68A3D' : '#C8792C',
          color: '#2B2016',
          padding: '13px 28px',
          borderRadius: 4,
          border: 'none',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'inherit',
          transition: 'background .2s ease',
        }}
      >
        Start sourcing ↗
      </button>
    </div>
  );

  return (
    <section style={{ background: '#5B4632', padding: rPad(bp) }}>
      <div style={{ ...rW, display: 'grid', gridTemplateColumns: cols, gap: 40, alignItems: 'center' }}>
        {bp.isMobile ? (
          <>
            {text}
            {leftImage}
          </>
        ) : (
          <>
            {leftImage}
            {text}
            {!bp.isTablet && (
              <img src={RIGHT_IMAGE} alt="Retail business owner" loading="lazy" decoding="async" style={imgStyle} />
            )}
          </>
        )}
      </div>
    </section>
  );
}
