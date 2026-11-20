import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLandingBreakpoint } from '../../hooks/useBreakpoint';

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
  const m = bp.isMobile, t = bp.isTablet;
  // Reference .collection-label: clamp(21px, 1.9vw, 31px), 16px inset; tablet 22px / 12px inset;
  // phone 21px (28px on the wide tile) / 10px inset.
  const label = m
    ? (big ? { fontSize: 28, padding: '13px 15px' } : { fontSize: 21, padding: 10 })
    : t ? { fontSize: 22, padding: 11 } : { fontSize: 'clamp(21px, 1.9vw, 31px)', padding: '12px 15px' };
  const inset = m ? 10 : t ? 12 : 16;
  return (
    <Link
      to={item.to}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative', overflow: 'hidden', display: 'block', textDecoration: 'none', background: '#EEE0CC', minWidth: 0,
        borderRadius: m ? 19 : 'clamp(18px, 2.4vw, 30px)', isolation: 'isolate',
        ...(m ? { aspectRatio: big ? '4 / 3' : '1 / 1.12' } : null), ...style,
      }}
    >
      <img src={item.img} alt={item.alt} loading="lazy" decoding="async"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: item.pos || 'center', transform: hov ? 'scale(1.04)' : 'none', transition: 'transform .45s ease' }} />
      <span style={{
        position: 'absolute', left: inset, right: inset, bottom: inset, display: 'flex', alignItems: 'center',
        background: '#FDF9F1', borderRadius: m ? 7 : 9, boxShadow: '0 2px 12px rgba(43,32,22,.07)', ...label,
        fontFamily: SERIF, fontWeight: 300, lineHeight: 1.13, color: INK, textAlign: 'left',
      }}>
        {item.name}
      </span>
    </Link>
  );
}

// Mirrors the reference #collections rules: 4.3% gutter (5% on phones), heading
// clamp(36px, 4vw, 62px), mosaic rows clamp(190px, 22vw, 340px). On narrow phones
// (≤560px) the "VIEW ALL" button wraps under the heading, as in the reference.
export default function CollectionsSection() {
  const bp = useLandingBreakpoint();
  const m = bp.isMobile, t = bp.isTablet;
  const wrapHead = bp.width <= 560;
  const grid = m
    ? { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14 }
    : { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gridTemplateRows: 'repeat(2, clamp(190px, 22vw, 340px))', gap: t ? 15 : 20 };

  return (
    <section id="collections" style={{ scrollMarginTop: 90, background: '#FDF9F1', padding: m ? '42px 5% 43px' : '58px 4.3% 65px', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: m ? 'center' : 'flex-end', justifyContent: 'space-between', flexWrap: wrapHead ? 'wrap' : 'nowrap', gap: wrapHead || m ? 16 : 25, marginBottom: m ? 24 : 32 }}>
        <h2 style={{ fontFamily: SERIF, fontSize: m ? 35 : t ? 43 : 'clamp(36px, 4vw, 62px)', fontWeight: 300, color: INK, margin: `${m ? 12 : 14}px 0 0`, lineHeight: 1.08, letterSpacing: '-1px', maxWidth: m ? 270 : 'none' }}>
          Trending Categories
        </h2>
        <Link to="/products"
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', flex: 'none', width: 176, maxWidth: '100%', height: 44, padding: '0 16px', borderRadius: 3, background: INK, color: '#FDF9F1', fontSize: 13, fontWeight: 600, lineHeight: 1.4, letterSpacing: '.1px', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'background .2s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#2B2016'; }}
          onMouseLeave={e => { e.currentTarget.style.background = INK; }}>
          VIEW ALL
        </Link>
      </div>
      <div style={{ display: 'grid', ...grid }}>
        {COLLECTIONS.map((item, i) => (
          <CollectionCard key={item.name} item={item} bp={bp} big={i === 0}
            style={i === 0 ? (m ? { gridColumn: '1 / -1' } : { gridRow: '1 / 3' }) : undefined} />
        ))}
      </div>
    </section>
  );
}
