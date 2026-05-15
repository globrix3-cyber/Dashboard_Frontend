import { T } from './tokens';
import { TICKER_ITEMS } from './data';
import { useBreakpoint } from '../../hooks/useBreakpoint';

export default function SocialProofTicker() {
  const bp = useBreakpoint();

  return (
    <div style={{
      background: T.w,
      borderTop: `1px solid ${T.bs}`,
      borderBottom: `1px solid ${T.bs}`,
      padding: bp.isMobile ? '12px 18px' : '13px 56px',
      overflowX: 'auto',
      scrollbarWidth: 'none',
      WebkitOverflowScrolling: 'touch',
    }}>
      <div style={{
        display: 'flex',
        gap: bp.isMobile ? 24 : 40,
        alignItems: 'center',
        minWidth: 'max-content',
      }}>
        {TICKER_ITEMS.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {i > 0 && <div style={{ width: 1, height: 14, background: T.bs, flexShrink: 0, marginRight: bp.isMobile ? 16 : 31 }} />}
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3D7A52', flexShrink: 0, boxShadow: '0 0 6px rgba(61,122,82,.5)' }} />
            <span style={{ fontSize: bp.isMobile ? 12 : 13, color: T.is, fontWeight: 500, whiteSpace: 'nowrap' }}>
              <span style={{ fontWeight: 700, color: T.ink }}>{item.bold}</span>{item.suffix}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
