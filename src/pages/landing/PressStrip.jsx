import { T } from './tokens';
import { PRESS_LOGOS } from './data';

export default function PressStrip() {
  return (
    <div style={{ background: T.cm, padding: '28px 56px', borderBottom: `1px solid ${T.b}` }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 48, flexWrap: 'wrap' }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: T.mu, flexShrink: 0 }}>As seen in</div>
        <div style={{ display: 'flex', gap: 36, alignItems: 'center', flexWrap: 'wrap' }}>
          {PRESS_LOGOS.map(name => (
            <div key={name} style={{ fontSize: 13, fontWeight: 800, color: T.mu, opacity: .45, fontFamily: "'Playfair Display',serif", letterSpacing: '-.2px' }}>{name}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
