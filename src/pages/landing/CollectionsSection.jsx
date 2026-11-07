import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBreakpoint, rGutter } from '../../hooks/useBreakpoint';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const INK   = '#5B4632';

const COLLECTIONS = [
  { name: 'Home & Living', img: '/images/v3/rustic-living-room-edited.jpg', to: '/products?category=Home%20%26%20Garden', pos: '30% center' },
  { name: 'Leather Bags',  img: '/images/v3/category-leather-bags.jpg',     to: '/products?search=leather%20bag' },
  { name: 'Table Lamps',   img: '/images/v3/category-table-lamps.jpg',      to: '/products?search=lamp' },
  { name: 'Jewellery',     img: '/images/v3/category-jewellery.jpg',        to: '/products?search=jewel' },
  { name: 'Coffee Tables', img: '/images/v3/newsletter-coffee-table.jpeg',  to: '/products?search=coffee%20table' },
];

function CollectionCard({ item, style, bp, big }) {
  const [hov, setHov] = useState(false);
  const labelSize = bp.isMobile ? (big ? 30 : 22) : 30;
  return (
    <Link
      to={item.to}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ position: 'relative', overflow: 'hidden', display: 'block', textDecoration: 'none', background: '#E3D5C1', ...style }}
    >
      <img src={item.img} alt={item.name} loading="lazy" decoding="async"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: item.pos || 'center', transform: hov ? 'scale(1.05)' : 'none', transition: 'transform .5s ease' }} />
      <span style={{
        position: 'absolute', left: bp.isMobile ? 10 : 16, right: bp.isMobile ? 10 : 16, bottom: bp.isMobile ? 10 : 16,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8,
        background: '#FDF9F1', borderRadius: 6, padding: bp.isMobile ? '8px 10px' : '10px 16px',
        boxShadow: '0 6px 18px rgba(43,32,22,.08)',
        fontFamily: SERIF, fontSize: labelSize, fontWeight: 400, lineHeight: 1.1, color: INK,
      }}>
        {item.name} <span style={{ fontSize: 11, flexShrink: 0 }}>↗</span>
      </span>
    </Link>
  );
}

export default function CollectionsSection() {
  const bp = useBreakpoint();
  const grid = bp.isMobile
    ? { gridTemplateColumns: 'repeat(2,1fr)', gridTemplateRows: '265px 188px 188px', gap: 14 }
    : { gridTemplateColumns: 'repeat(3,1fr)', gridTemplateRows: bp.isTablet ? 'repeat(2,250px)' : 'repeat(2,316px)', gap: 20 };

  return (
    <section id="collections" style={{ scrollMarginTop: 90, background: '#FDF9F1', padding: bp.isMobile ? '56px 0 44px' : '76px 0 66px' }}>
      <div style={rGutter(bp)}>
        <div style={{ display: 'flex', alignItems: bp.isMobile ? 'flex-start' : 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: bp.isMobile ? 26 : 30 }}>
          <h2 style={{ fontFamily: SERIF, fontSize: bp.isMobile ? 34 : 58, fontWeight: 300, color: INK, margin: 0, lineHeight: 1.08, letterSpacing: '-.01em' }}>
            Find your next collection.
          </h2>
          <Link to="/products" style={{ display: 'flex', gap: 16, flexShrink: 0, marginTop: bp.isMobile ? 14 : 0, marginBottom: bp.isMobile ? 0 : 6, fontSize: 9, letterSpacing: '.14em', color: INK, textDecoration: 'none', borderBottom: `1px solid ${INK}`, paddingBottom: 6 }}>
            VIEW ALL <span>↗</span>
          </Link>
        </div>
        <div style={{ display: 'grid', ...grid }}>
          {COLLECTIONS.map((item, i) => (
            <CollectionCard key={item.name} item={item} bp={bp} big={i === 0}
              style={i === 0 ? (bp.isMobile ? { gridColumn: '1 / -1' } : { gridRow: '1 / 3' }) : undefined} />
          ))}
        </div>
      </div>
    </section>
  );
}
