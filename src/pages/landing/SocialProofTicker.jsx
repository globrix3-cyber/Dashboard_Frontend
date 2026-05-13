import { T } from './tokens';
import { TICKER_ITEMS } from './data';

export default function SocialProofTicker() {
  return (
    <div style={{ background: T.w, borderTop: `1px solid ${T.bs}`, borderBottom: `1px solid ${T.bs}`, padding: '13px 56px', display: 'flex', gap: 40, alignItems: 'center', overflow: 'hidden' }}>
      {TICKER_ITEMS.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          {i > 0 && <div style={{ width: 1, height: 16, background: T.bs, flexShrink: 0, marginRight: 31 }} />}
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#3D7A52', flexShrink: 0, boxShadow: '0 0 6px rgba(61,122,82,.5)' }} />
          <span style={{ fontSize: 13, color: T.is, fontWeight: 500, whiteSpace: 'nowrap' }}>
            <span style={{ fontWeight: 700, color: T.ink }}>{item.bold}</span>{item.suffix}
          </span>
        </div>
      ))}
    </div>
  );
}
