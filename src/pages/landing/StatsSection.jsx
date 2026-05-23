import { T } from './tokens';
import { STATS } from './data';
import { IMG } from './images';
import { useBreakpoint, rW } from '../../hooks/useBreakpoint';

export default function StatsSection() {
  const bp   = useBreakpoint();
  const pad  = bp.isMobile ? '52px 18px' : bp.isTablet ? '64px 32px' : '72px 56px';
  const cols = bp.isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)';
  const num  = bp.isMobile ? 36 : bp.isTablet ? 44 : 56;

  return (
    <div style={{ position: 'relative', padding: pad, overflow: 'hidden' }}>
      {/* Background photo */}
      <img
        src={IMG.artisanWeaving}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
      />
      {/* Dark overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(145deg,rgba(20,16,12,.93) 0%,rgba(36,28,22,.90) 100%)' }} />

      {/* Saffron glow orbs */}
      <div style={{ position: 'absolute', top: -200, right: -200, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(196,119,58,.14),transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -150, left: -150, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(61,122,52,.10),transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ ...rW, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 1, background: 'rgba(255,255,255,.07)', borderRadius: 18, overflow: 'hidden', backdropFilter: 'blur(6px)' }}>
          {STATS.map(s => (
            <div key={s.label} style={{ padding: bp.isMobile ? '32px 16px' : '48px 36px', background: 'rgba(255,255,255,.03)', textAlign: 'center' }}>
              <div style={{ fontFamily: "'Cormorant Garamond','Playfair Display',serif", fontSize: num, fontWeight: 900, color: '#fff', letterSpacing: -1.5, lineHeight: 1, marginBottom: 8 }}>
                {s.num}<span style={{ color: T.t }}>{s.suf}</span>
              </div>
              <div style={{ fontSize: bp.isMobile ? 11 : 13, color: 'rgba(255,255,255,.45)', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
