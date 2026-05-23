import { T } from './tokens';
import { PRESS_LOGOS } from './data';
import { useBreakpoint } from '../../hooks/useBreakpoint';

export default function PressStrip() {
  const bp  = useBreakpoint();
  const pad = bp.isMobile ? '20px 18px' : bp.isTablet ? '24px 32px' : '28px 56px';

  return (
    <div style={{ background: T.cm, padding: pad, borderBottom: `1px solid ${T.b}` }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: T.mu, marginBottom: 14, textAlign: bp.isMobile ? 'center' : 'left' }}>
          As seen in
        </div>
        <div style={{
          display: 'flex',
          gap: bp.isMobile ? 18 : 36,
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: bp.isMobile ? 'center' : 'flex-start',
        }}>
          {PRESS_LOGOS.map(name => (
            <div key={name} style={{ fontSize: bp.isMobile ? 11 : 13, fontWeight: 800, color: T.mu, opacity: .45, fontFamily: "'Cormorant Garamond','Playfair Display',serif", letterSpacing: '-.2px', whiteSpace: 'nowrap' }}>
              {name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
