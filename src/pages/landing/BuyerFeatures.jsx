import { useDispatch } from 'react-redux';
import { toggleLogin } from '../../features/auth/authSlice';
import { IMG } from './images';
import { useBreakpoint } from '../../hooks/useBreakpoint';

const FEATURES = [
  {
    num: '01',
    label: 'Low minimum orders',
    desc: 'Start small with trial orders — no need to commit to huge volumes upfront.',
  },
  {
    num: '02',
    label: 'KYC-verified suppliers',
    desc: 'Every manufacturer is identity-verified across 500+ product categories.',
  },
  {
    num: '03',
    label: 'End-to-end export support',
    desc: 'Digital contracts, logistics coordination, and a dedicated support team.',
  },
];

export default function BuyerFeatures() {
  const dispatch = useDispatch();
  const bp       = useBreakpoint();

  if (bp.isMobile) {
    return (
      <section style={{ background: '#FDF8F2', padding: '56px 20px 52px', borderTop: '1px solid #E8E2D8' }}>
        {/* Image strip */}
        <div style={{ borderRadius: 18, overflow: 'hidden', marginBottom: 36, position: 'relative', aspectRatio: '16/9' }}>
          <img src={IMG.womanArtisanMarket} alt="Indian artisan" loading="lazy" decoding="async"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(28,24,20,.6) 0%, transparent 50%)' }} />
        </div>

        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: '#C4773A', marginBottom: 16 }}>For buyers</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond','Playfair Display',serif", fontSize: '28px', fontWeight: 900, color: '#1C1815', lineHeight: 1.15, letterSpacing: -0.5, marginBottom: 28 }}>
          For any buyer, no matter what you source.
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 32 }}>
          {FEATURES.map(f => (
            <div key={f.num} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#C4773A', minWidth: 22, paddingTop: 2, letterSpacing: '.04em' }}>{f.num}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1C1815', marginBottom: 4 }}>{f.label}</div>
                <div style={{ fontSize: 13, color: '#7A7068', lineHeight: 1.65 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => dispatch(toggleLogin(true))}
          style={{ padding: '13px 32px', borderRadius: 8, border: 'none', background: '#1C1815', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
          Start sourcing →
        </button>
      </section>
    );
  }

  return (
    <section style={{ background: '#FDF8F2', padding: bp.isTablet ? '72px 32px' : '96px 56px', borderTop: '1px solid #E8E2D8' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', display: 'grid', gridTemplateColumns: bp.isTablet ? '1fr 1fr' : '1fr 1fr', gap: bp.isTablet ? 48 : 80, alignItems: 'center' }}>

        {/* Left — contained image */}
        <div style={{ position: 'relative', order: bp.isTablet ? 2 : 1 }}>
          {/* Subtle background blob */}
          <div style={{ position: 'absolute', inset: -24, background: 'radial-gradient(ellipse at 60% 50%, rgba(196,119,58,.08) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

          <div style={{ position: 'relative', zIndex: 1, borderRadius: 24, overflow: 'hidden', boxShadow: '0 24px 64px rgba(28,24,20,.14)' }}>
            <img
              src={IMG.womanArtisanMarket}
              alt="Indian artisan crafting handmade products"
              loading="lazy"
              decoding="async"
              style={{ width: '100%', aspectRatio: bp.isTablet ? '4/3' : '3/4', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
            />
            {/* Subtle gradient at bottom */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(28,24,20,.5) 0%, transparent 45%)' }} />

            {/* Floating verified tag */}
            <div style={{ position: 'absolute', bottom: 20, left: 20, display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.92)', backdropFilter: 'blur(12px)', borderRadius: 30, padding: '8px 16px', boxShadow: '0 4px 16px rgba(0,0,0,.12)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3D7A52' }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#1C1815' }}>5,000+ verified suppliers</span>
            </div>
          </div>
        </div>

        {/* Right — text content */}
        <div style={{ order: bp.isTablet ? 1 : 2 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: '#C4773A', marginBottom: 20 }}>
            For buyers
          </div>

          <h2 style={{
            fontFamily: "'Cormorant Garamond','Playfair Display',serif",
            fontSize: bp.isTablet ? '28px' : '40px',
            fontWeight: 900, color: '#1C1815',
            lineHeight: 1.15, letterSpacing: -0.5,
            marginBottom: bp.isTablet ? 28 : 40,
          }}>
            For any buyer, no matter what you source.
          </h2>

          {/* Numbered feature list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: bp.isTablet ? 22 : 28, marginBottom: bp.isTablet ? 32 : 40 }}>
            {FEATURES.map((f, i) => (
              <div key={f.num} style={{ display: 'flex', gap: 20, alignItems: 'flex-start', paddingBottom: i < FEATURES.length - 1 ? (bp.isTablet ? 22 : 28) : 0, borderBottom: i < FEATURES.length - 1 ? '1px solid #E8E2D8' : 'none' }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#C4773A', minWidth: 24, paddingTop: 3, letterSpacing: '.06em', fontFamily: 'monospace' }}>{f.num}</div>
                <div>
                  <div style={{ fontSize: bp.isTablet ? 14 : 15, fontWeight: 700, color: '#1C1815', marginBottom: 6 }}>{f.label}</div>
                  <div style={{ fontSize: bp.isTablet ? 13 : 14, color: '#7A7068', lineHeight: 1.7 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => dispatch(toggleLogin(true))}
            style={{
              padding: bp.isTablet ? '12px 28px' : '14px 36px',
              borderRadius: 8,
              border: 'none',
              background: '#1C1815',
              color: '#fff',
              fontSize: 14, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'inherit',
              letterSpacing: '.02em',
              transition: 'background .18s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#3D3730'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#1C1815'; }}
          >
            Start sourcing →
          </button>
        </div>
      </div>
    </section>
  );
}
