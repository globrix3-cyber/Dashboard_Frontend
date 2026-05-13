import { useState } from 'react';
import { T, shadow, W, sectionTitle, viewAll } from './tokens';
import { NEW_THIS_WEEK } from './data';

function MiniCard({ item }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ background: T.w, borderRadius: 10, overflow: 'hidden', border: `1.5px solid ${T.bs}`, cursor: 'pointer', transform: hov ? 'translateY(-2px)' : 'none', boxShadow: hov ? shadow.sm : 'none', transition: '.2s' }}>
      <div style={{ height: 110, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>{item.emoji}</div>
      <div style={{ padding: '8px 10px 10px' }}>
        <div style={{ fontSize: 9, color: T.t, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 3 }}>{item.brand}</div>
        <div style={{ fontSize: 11, fontWeight: 600, color: T.ink, lineHeight: 1.3, marginBottom: 4 }}>{item.name}</div>
        <div style={{ fontSize: 12, fontWeight: 700, color: T.ink }}>{item.price}</div>
      </div>
    </div>
  );
}

export default function NewThisWeek() {
  return (
    <section style={{ background: T.cm, padding: '80px 56px' }}>
      <div style={{ ...W }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ background: `linear-gradient(135deg,${T.t},${T.td})`, color: '#fff', fontSize: 9, fontWeight: 800, padding: '4px 12px', borderRadius: 5, letterSpacing: '.08em', textTransform: 'uppercase' }}>New This Week</span>
            <h2 style={sectionTitle}>Just listed</h2>
          </div>
          <div style={viewAll}>See all new arrivals →</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 12 }}>
          {NEW_THIS_WEEK.map((item, i) => <MiniCard key={i} item={item} />)}
        </div>
      </div>
    </section>
  );
}
