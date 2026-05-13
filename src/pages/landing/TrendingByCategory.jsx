import { useState } from 'react';
import { T, shadow, W, viewAll } from './tokens';
import { TRENDING_ROWS } from './data';

function MiniProdCard({ item }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ background: T.w, borderRadius: 10, overflow: 'hidden', border: `1.5px solid ${T.bs}`, cursor: 'pointer', transform: hov ? 'translateY(-2px)' : 'none', boxShadow: hov ? shadow.sm : 'none', transition: '.18s' }}>
      <div style={{ height: 96, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>{item.emoji}</div>
      <div style={{ padding: '8px 10px 10px' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: T.ink, lineHeight: 1.3, marginBottom: 3 }}>{item.name}</div>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.t }}>{item.price}</div>
        <div style={{ fontSize: 9, color: T.mu }}>{item.moq}</div>
      </div>
    </div>
  );
}

function CategoryRow({ row }) {
  return (
    <div style={{ padding: '60px 56px', borderBottom: `1px solid ${T.bs}` }}>
      <div style={{ ...W }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 11, background: row.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, border: `1.5px solid ${row.iconBorder}`, flexShrink: 0 }}>{row.icon}</div>
            <div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: T.ink, letterSpacing: '-.5px' }}>{row.title}</div>
              <div style={{ fontSize: 12, color: T.mu, marginTop: 2 }}>{row.count}</div>
            </div>
          </div>
          <div style={viewAll}>{row.link}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 12 }}>
          {row.products.map((item, i) => <MiniProdCard key={i} item={item} />)}
        </div>
      </div>
    </div>
  );
}

export default function TrendingByCategory() {
  return (
    <div style={{ background: T.c, borderTop: `1px solid ${T.bs}` }}>
      {TRENDING_ROWS.map(row => <CategoryRow key={row.title} row={row} />)}
    </div>
  );
}
