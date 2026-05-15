import { T } from './tokens';
import { STATS } from './data';
import { useBreakpoint, rW } from '../../hooks/useBreakpoint';

export default function StatsSection() {
  const bp   = useBreakpoint();
  const pad  = bp.isMobile ? '52px 18px' : bp.isTablet ? '64px 32px' : '72px 56px';
  const cols = bp.isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)';
  const num  = bp.isMobile ? 36 : bp.isTablet ? 44 : 56;

  return (
    <div style={{ background: 'linear-gradient(145deg,#1C1915 0%,#2A2320 100%)', padding: pad, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -200, right: -200, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(196,119,58,.12),transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -150, left: -150, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(61,122,52,.10),transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ ...rW, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 1, background: 'rgba(255,255,255,.06)', borderRadius: 16, overflow: 'hidden' }}>
          {STATS.map(s => (
            <div key={s.label} style={{ padding: bp.isMobile ? '32px 20px' : '48px 36px', background: 'rgba(255,255,255,.03)', textAlign: 'center' }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: num, fontWeight: 900, color: '#fff', letterSpacing: -1.5, lineHeight: 1, marginBottom: 8 }}>
                {s.num}<span style={{ color: T.t }}>{s.suf}</span>
              </div>
              <div style={{ fontSize: bp.isMobile ? 11 : 13, color: 'rgba(255,255,255,.4)', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
