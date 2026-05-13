import { T } from './tokens';
import { CATEGORY_NAV } from './data';

export default function CategoryNavBar() {
  return (
    <div style={{ background: T.w, borderBottom: `1.5px solid ${T.bs}`, padding: '0 56px', position: 'sticky', top: 68, zIndex: 150, boxShadow: '0 2px 12px rgba(28,25,21,.04)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {CATEGORY_NAV.map(item => (
          <div key={item.label} style={{ padding: '15px 18px', fontSize: 13, fontWeight: item.active ? 600 : 500, color: item.active ? T.t : T.mu, cursor: 'pointer', whiteSpace: 'nowrap', borderBottom: item.active ? `2.5px solid ${T.t}` : '2.5px solid transparent', transition: '.15s', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 14 }}>{item.icon}</span>{item.label}
          </div>
        ))}
        <div style={{ padding: '15px 18px', fontSize: 13, fontWeight: 600, color: T.t, cursor: 'pointer', whiteSpace: 'nowrap', borderBottom: '2.5px solid transparent' }}>
          View all 24 →
        </div>
      </div>
    </div>
  );
}
