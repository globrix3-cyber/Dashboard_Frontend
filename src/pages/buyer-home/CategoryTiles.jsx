import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLandingBreakpoint } from '../../hooks/useBreakpoint';

const SERIF = "'Canela', 'Cormorant Garamond', Georgia, serif";
const INK = '#5B4632';

function Tile({ item, big, bp, style }) {
  const [hov, setHov] = useState(false);
  const m = bp.isMobile;
  const inset = m ? 10 : 14;
  return (
    <Link to={item.to}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ position: 'relative', display: 'block', overflow: 'hidden', minWidth: 0, borderRadius: m ? 16 : 'clamp(16px, 2vw, 26px)', background: '#EEE0CC', textDecoration: 'none', isolation: 'isolate', ...(m ? { aspectRatio: big ? '4 / 3' : '1 / 1.1' } : null), ...style }}>
      <img src={item.img} alt="" loading="lazy" decoding="async"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: hov ? 'scale(1.04)' : 'none', transition: 'transform .45s ease' }} />
      <span style={{ position: 'absolute', left: inset, right: inset, bottom: inset, display: 'block', padding: m ? '9px 12px' : '11px 15px', background: '#FDF9F1', borderRadius: 8, boxShadow: '0 2px 12px rgba(43,32,22,.08)', fontFamily: SERIF, fontWeight: 300, color: INK, fontSize: m ? (big ? 24 : 16) : 'clamp(19px, 1.7vw, 27px)', lineHeight: 1.15, letterSpacing: '-.3px', ...(m && !big ? { overflowWrap: 'anywhere' } : { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }) }}>
        {item.name}
      </span>
    </Link>
  );
}

// "Find your foundation" layout (client Canva V2, page 7): one tall tile, then a 2×2 grid.
export default function CategoryTiles({ tiles }) {
  const bp = useLandingBreakpoint();
  const m = bp.isMobile;
  if (!tiles.length) return null;
  const [first, ...rest] = tiles;
  return (
    <section aria-labelledby="home-categories" style={{ marginTop: m ? 34 : 56 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: m ? 18 : 26 }}>
        <div>
          <p style={{ margin: 0, fontSize: 11, letterSpacing: '1.6px', textTransform: 'uppercase', fontWeight: 600, color: '#79634E' }}>Shop by category</p>
          <h2 id="home-categories" style={{ margin: '8px 0 0', fontFamily: SERIF, fontWeight: 300, color: INK, letterSpacing: '-1px', lineHeight: 1.05, fontSize: m ? 34 : 'clamp(38px, 3.6vw, 54px)' }}>Find your foundation</h2>
        </div>
        <Link to="/products" style={{ flexShrink: 0, fontSize: 12, fontWeight: 600, letterSpacing: '1.2px', textTransform: 'uppercase', color: INK, textDecoration: 'none', borderBottom: `1px solid ${INK}`, paddingBottom: 4 }}>View all</Link>
      </div>
      {m ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Tile item={first} big bp={bp} style={{ gridColumn: '1 / -1' }} />
          {rest.map(t => <Tile key={t.name} item={t} bp={bp} />)}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: rest.length >= 2 ? '1fr 1fr 1fr' : '1fr 1fr', gridTemplateRows: rest.length > 2 ? '1fr 1fr' : '1fr', gap: 'clamp(12px, 1.2vw, 18px)', height: rest.length > 2 ? 'clamp(420px, 40vw, 640px)' : 'clamp(260px, 24vw, 380px)' }}>
          <Tile item={first} bp={bp} style={{ gridRow: rest.length > 2 ? '1 / 3' : 'auto' }} />
          {rest.map(t => <Tile key={t.name} item={t} bp={bp} />)}
        </div>
      )}
    </section>
  );
}
