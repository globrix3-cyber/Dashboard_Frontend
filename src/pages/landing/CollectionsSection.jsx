import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBreakpoint } from '../../hooks/useBreakpoint';

const SERIF = "'Canela', 'Cormorant Garamond', Georgia, serif";
const INK   = '#5B4632';

const COLLECTIONS = [
  { name: 'Home & Living', img: '/images/v3/rustic-living-room-edited.jpg', to: '/products?category=Home%20%26%20Garden', pos: '30% center', alt: 'Warm living room with a rustic wooden coffee table' },
  { name: 'Leather Bags',  img: '/images/v4/category-leather-bags.jpg',     to: '/products?search=leather%20bag', alt: 'Tan leather messenger bag' },
  { name: 'Table Lamps',   img: '/images/v4/category-table-lamps.jpg',      to: '/products?search=lamp', alt: 'Table lamp with a pleated shade by a window' },
  { name: 'Jewellery',     img: '/images/v3/category-jewellery.jpg',        to: '/products?search=jewel', alt: 'Gold necklace and earrings' },
  { name: 'Coffee Tables', img: '/images/v3/newsletter-coffee-table.jpeg',  to: '/products?search=coffee%20table', alt: 'A solid wood coffee table in a bright living room' },
];

function CollectionCard({ item, style, bp, big }) {
  const [hov, setHov] = useState(false);
  const m = bp.isMobile;
  // Reference label pill: desktop 27.36px, 12px 15px padding, 9px radius; mobile 28px (wide tile) or 21px.
  const label = m
    ? (big ? { fontSize: 28, padding: '13px 15px' } : { fontSize: 21, padding: 10 })
    : { fontSize: bp.isTablet ? 24 : 27.36, padding: '12px 15px' };
  const inset = m ? 10 : 16;
  return (
    <Link
      to={item.to}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ position: 'relative', overflow: 'hidden', display: 'block', textDecoration: 'none', background: '#EEE0CC', borderRadius: m ? 19 : 30, isolation: 'isolate', ...style }}
    >
      <img src={item.img} alt={item.alt} loading="lazy" decoding="async"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: item.pos || 'center', transform: hov ? 'scale(1.04)' : 'none', transition: 'transform .5s ease' }} />
      <span style={{
        position: 'absolute', left: inset, right: inset, bottom: inset,
        background: '#FDF9F1', borderRadius: m ? 7 : 9, ...label,
        fontFamily: SERIF, fontWeight: 300, lineHeight: 1.13, color: INK, textAlign: 'left',
      }}>
        {item.name}
      </span>
    </Link>
  );
}

export default function CollectionsSection() {
  const bp = useBreakpoint();
  const m = bp.isMobile;
  // Reference: 1440px → 885px tall (425px columns, 317px rows, 20px gaps);
  // 390px → 865px tall (wide 263px tile, then 2x2 of 169x189 with 13/14px gaps).
  const grid = m
    ? { gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gridTemplateRows: '263px 189px 189px', columnGap: 13, rowGap: 14 }
    : { gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gridTemplateRows: bp.isTablet ? 'repeat(2,250px)' : 'repeat(2,317px)', gap: 20 };

  return (
    <section id="collections" style={{ scrollMarginTop: 90, background: '#FDF9F1', padding: m ? '54px 19.5px 42px' : bp.isTablet ? '64px 32px 56px' : '72px 61.9px 65px' }}>
      <div style={{ maxWidth: 1316, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: m ? 'flex-start' : 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: m ? 24 : 32 }}>
          <h2 style={{ fontFamily: SERIF, fontSize: m ? 35 : bp.isTablet ? 46 : 57.6, fontWeight: 300, color: INK, margin: 0, lineHeight: 1.08, letterSpacing: '-1px', maxWidth: m ? 250 : 'none' }}>
            Trending Categories
          </h2>
          <Link to="/products" style={{ flexShrink: 0, marginTop: m ? 11 : 0, border: `1px solid ${INK}`, borderRadius: 28, padding: m ? '10px 17px' : '12px 23px', fontSize: m ? 9 : 10, lineHeight: 1.4, letterSpacing: m ? '1.1px' : '1.4px', fontWeight: 600, color: INK, textDecoration: 'none' }}>
            VIEW ALL
          </Link>
        </div>
        <div style={{ display: 'grid', ...grid }}>
          {COLLECTIONS.map((item, i) => (
            <CollectionCard key={item.name} item={item} bp={bp} big={i === 0}
              style={i === 0 ? (m ? { gridColumn: '1 / -1' } : { gridRow: '1 / 3' }) : undefined} />
          ))}
        </div>
      </div>
    </section>
  );
}
