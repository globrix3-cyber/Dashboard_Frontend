import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBreakpoint, rGutter } from '../../hooks/useBreakpoint';

const SERIF = "'Cormorant Garamond', Georgia, serif";

const COLLECTIONS = [
  { name: 'Home & Living', img: '/images/v3/rustic-living-room-edited.jpg', to: '/products?category=Home%20%26%20Garden', pos: '30% center' },
  { name: 'Leather Bags',  img: '/images/v3/category-leather-bags.jpg',     to: '/products?search=leather%20bag' },
  { name: 'Table Lamps',   img: '/images/v3/category-table-lamps.jpg',      to: '/products?search=lamp' },
  { name: 'Jewellery',     img: '/images/v3/category-jewellery.jpg',        to: '/products?search=jewel' },
  { name: 'Coffee Tables', img: '/images/v3/newsletter-coffee-table.jpeg',  to: '/products?search=coffee%20table' },
];

function CollectionCard({ item, style, bp }) {
  const [hov, setHov] = useState(false);
  return (
    <Link
      to={item.to}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ position: 'relative', overflow: 'hidden', display: 'block', textDecoration: 'none', ...style }}
    >
      <img src={item.img} alt={item.name} loading="lazy" decoding="async"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: item.pos || 'center', transform: hov ? 'scale(1.05)' : 'none', transition: 'transform .5s ease' }} />
      <span style={{ position: 'absolute', left: bp.isMobile ? 10 : 16, right: bp.isMobile ? 10 : 16, bottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FDF9F1', borderRadius: 6, padding: bp.isMobile ? '8px 12px' : '12px 15px', fontFamily: SERIF, fontSize: bp.isMobile ? 17 : 26, fontWeight: 500, color: '#5B4632' }}>
        {item.name} <span style={{ fontSize: 13 }}>↗</span>
      </span>
    </Link>
  );
}

export default function CollectionsSection() {
  const bp = useBreakpoint();
  const grid = bp.isMobile
    ? { gridTemplateColumns: 'repeat(2,1fr)', gridAutoRows: 190 }
    : { gridTemplateColumns: 'repeat(3,1fr)', gridTemplateRows: bp.isTablet ? 'repeat(2,250px)' : 'repeat(2,316px)' };

  return (
    <section id="collections" style={{ background: '#F4D9A0', padding: bp.isMobile ? '44px 0' : '66px 0' }}>
      <div style={rGutter(bp)}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 32 }}>
          <h2 style={{ fontFamily: SERIF, fontSize: bp.isMobile ? 34 : 58, fontWeight: 600, color: '#5B4632', margin: 0, lineHeight: 1.1 }}>Find your next collection.</h2>
          <Link to="/products" style={{ display: 'flex', gap: 16, flexShrink: 0, fontSize: 10, letterSpacing: '.14em', color: '#5B4632', textDecoration: 'none', borderBottom: '1px solid #5B4632', paddingBottom: 8 }}>
            VIEW ALL <span>↗</span>
          </Link>
        </div>
        <div style={{ display: 'grid', gap: 20, ...grid }}>
          {COLLECTIONS.map((item, i) => (
            <CollectionCard key={item.name} item={item} bp={bp}
              style={i === 0 ? (bp.isMobile ? { gridColumn: '1 / -1' } : { gridRow: '1 / 3' }) : undefined} />
          ))}
        </div>
      </div>
    </section>
  );
}
