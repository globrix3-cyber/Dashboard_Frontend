import { IMG } from './images';
import { useBreakpoint } from '../../hooks/useBreakpoint';

const BG  = '#2C1810';
const ACC = '#C4773A';

export default function BuyerStory() {
  const bp = useBreakpoint();

  if (bp.isMobile) {
    return (
      <section style={{ background: BG, padding: '56px 20px 52px' }}>
        {/* Eyebrow */}
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: ACC, marginBottom: 16 }}>About Globrixa</div>

        {/* Headline */}
        <h2 style={{ fontFamily: "'Cormorant Garamond','Playfair Display',Georgia,serif", fontSize: '32px', fontWeight: 900, color: ACC, lineHeight: 1.08, marginBottom: 8 }}>
          We're Globrixa.
        </h2>
        <div style={{ fontFamily: "'Cormorant Garamond','Playfair Display',Georgia,serif", fontSize: '20px', fontWeight: 600, color: 'rgba(255,255,255,.75)', lineHeight: 1.25, marginBottom: 20 }}>
          The platform for global buyers.
        </div>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,.5)', lineHeight: 1.85, marginBottom: 32 }}>
          We make it easy for you to discover authentic products from Indian manufacturers and connect with suppliers that make your business stand out.
        </p>

        {/* Contained image */}
        <div style={{ borderRadius: 20, overflow: 'hidden', position: 'relative', aspectRatio: '4/3' }}>
          <img src={IMG.keralaRiceFields} alt="Kerala rice fields" loading="lazy" decoding="async"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', display: 'block' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(44,24,16,.7) 0%, transparent 55%)' }} />
          <div style={{ position: 'absolute', bottom: 14, left: 16, right: 16 }}>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,.8)', fontWeight: 500 }}>Kerala organic farms — one of 500+ verified sourcing regions</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section style={{ background: BG, padding: bp.isTablet ? '72px 32px' : '96px 56px' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', display: 'grid', gridTemplateColumns: bp.isTablet ? '1fr 1fr' : '1fr 1fr', gap: bp.isTablet ? 48 : 80, alignItems: 'center' }}>

        {/* Left — text */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: ACC, marginBottom: 22 }}>
            About Globrixa
          </div>

          <h2 style={{
            fontFamily: "'Cormorant Garamond','Playfair Display',Georgia,serif",
            fontSize: bp.isTablet ? '36px' : '52px',
            fontWeight: 900, color: ACC,
            lineHeight: 1.05, letterSpacing: -1,
            marginBottom: 14,
          }}>
            We're Globrixa.
          </h2>

          <div style={{
            fontFamily: "'Cormorant Garamond','Playfair Display',Georgia,serif",
            fontSize: bp.isTablet ? '20px' : '26px',
            fontWeight: 600,
            color: 'rgba(255,255,255,.7)',
            lineHeight: 1.28, marginBottom: 28,
          }}>
            The platform for<br />global buyers.
          </div>

          <p style={{ fontSize: bp.isTablet ? 15 : 16, color: 'rgba(255,255,255,.5)', lineHeight: 1.9, marginBottom: 40, maxWidth: 420 }}>
            We make it easy for you to discover authentic products from Indian manufacturers and connect with suppliers that make your business stand out.
          </p>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 32 }}>
            {[['5,000+', 'Verified suppliers'], ['120+', 'Countries sourcing'], ['50K+', 'Products listed']].map(([num, label]) => (
              <div key={label}>
                <div style={{ fontFamily: "'Cormorant Garamond','Playfair Display',serif", fontSize: bp.isTablet ? 22 : 28, fontWeight: 900, color: '#fff', letterSpacing: -0.5 }}>{num}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', fontWeight: 500, marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — contained image */}
        <div style={{ position: 'relative' }}>
          {/* Decorative glow behind image */}
          <div style={{ position: 'absolute', inset: -20, background: `radial-gradient(ellipse at center, rgba(196,119,58,.15) 0%, transparent 70%)`, pointerEvents: 'none', zIndex: 0 }} />

          <div style={{ position: 'relative', zIndex: 1, borderRadius: 24, overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,.5)' }}>
            <img
              src={IMG.keralaRiceFields}
              alt="Aerial view of Kerala rice fields"
              loading="lazy"
              decoding="async"
              style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', objectPosition: 'center 30%', display: 'block' }}
            />
            {/* Gradient overlay */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(44,24,16,.75) 0%, transparent 55%)' }} />

            {/* Caption */}
            <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: ACC, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,.82)', fontWeight: 500, lineHeight: 1.4 }}>
                Kerala organic farms — one of 500+ verified sourcing regions on Globrixa
              </span>
            </div>
          </div>

          {/* Floating badge */}
          <div style={{ position: 'absolute', top: -16, right: -16, zIndex: 2, background: ACC, borderRadius: 14, padding: '10px 16px', boxShadow: '0 8px 24px rgba(196,119,58,.4)' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#fff', letterSpacing: '.06em', textTransform: 'uppercase' }}>🇮🇳 Made in India</div>
          </div>
        </div>
      </div>
    </section>
  );
}
