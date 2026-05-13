import { T, W } from './tokens';
import { STATS } from './data';

export default function StatsSection() {
  return (
    <div style={{ background: 'linear-gradient(145deg,#1C1915 0%,#2A2320 100%)', padding: '72px 56px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -200, right: -200, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(196,119,58,.12),transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -150, left: -150, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(61,122,52,.10),transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ ...W, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, background: 'rgba(255,255,255,.06)', borderRadius: 16, overflow: 'hidden' }}>
          {STATS.map(s => (
            <div key={s.label} style={{ padding: '48px 36px', background: 'rgba(255,255,255,.03)', textAlign: 'center' }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 56, fontWeight: 900, color: '#fff', letterSpacing: -2, lineHeight: 1, marginBottom: 8 }}>
                {s.num}<span style={{ color: T.t }}>{s.suf}</span>
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,.4)', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
