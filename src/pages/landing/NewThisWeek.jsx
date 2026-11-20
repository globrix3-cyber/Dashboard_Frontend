import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLandingBreakpoint } from '../../hooks/useBreakpoint';
import { api } from '../../services/api';
import { imageProps } from '../../utils/helpers';

const INK   = '#5B4632';
const MUTED = '#79634E';
const SERIF = "'Canela', 'Cormorant Garamond', Georgia, serif";

function CardSkeleton({ bp }) {
  return (
    <div>
      <div style={{ aspectRatio: '3 / 4', borderRadius: bp.isMobile ? 19 : 'clamp(18px, 2.4vw, 30px)', background: 'linear-gradient(90deg,#F0DCC0 25%,#E3D5C1 50%,#F0DCC0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
      <div style={{ height: 9, width: '40%', margin: `${bp.isMobile ? 22 : 26}px auto 0`, background: '#E3D5C1' }} />
      <div style={{ height: 14, width: '70%', margin: '12px auto 0', background: '#E3D5C1' }} />
    </div>
  );
}

function ProductCard({ product, bp }) {
  const [imgFailed, setImgFailed] = useState(false);
  const m      = bp.isMobile;
  const t      = bp.isTablet;
  const photo  = imageProps(product.images?.[0]?.image_url, m ? 200 : 340);
  const href   = `/products/${product.id}`;

  // Reference card: 3:4 photo with clamp(18px, 2.4vw, 30px) corners (19px on phones), a "View details"
  // pill near the bottom edge, then a tiny uppercase category and the uppercase product name, centred.
  return (
    <div className="sf-card" style={{ position: 'relative', color: INK, textAlign: 'center' }}>
      <Link to={href} aria-label={`View details: ${product.name}`}
        style={{ position: 'relative', display: 'block', aspectRatio: '3 / 4', overflow: 'hidden', borderRadius: m ? 19 : 'clamp(18px, 2.4vw, 30px)', background: photo.src && !imgFailed ? '#FDF9F1' : '#E3D5C1', isolation: 'isolate' }}>
        {photo.src && !imgFailed && (
          <img {...photo} alt="" loading="lazy" decoding="async" onError={() => setImgFailed(true)}
            className="sf-img" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .5s ease' }} />
        )}
        <span aria-hidden="true" className="sf-pill"
          style={{ position: 'absolute', left: '50%', bottom: m ? 12 : 20, transform: 'translateX(-50%)', borderRadius: 30, background: INK, color: '#FDF9F1', fontSize: m || t ? 10 : 11, lineHeight: m || t ? '13px' : '14px', fontWeight: 400, letterSpacing: '.4px', padding: m ? '10px 17px' : t ? '10px 18px' : '12px 25px', whiteSpace: 'nowrap', transition: 'opacity .25s ease, transform .25s ease' }}>
          View details
        </span>
      </Link>

      <Link to={href} style={{ display: 'block', textDecoration: 'none', color: INK, padding: `${m ? 16 : 21}px 5px 0` }}>
        <div style={{ fontSize: m ? 8 : 9, lineHeight: m ? '10px' : '12px', fontWeight: 400, letterSpacing: m ? '1px' : '1.6px', textTransform: 'uppercase', color: MUTED }}>
          {product.category_name || 'Uncategorized'}
        </div>
        <div style={{ margin: `${m ? 7 : 9}px 0 8px`, fontSize: m ? 12 : t ? 13 : 15, fontWeight: 500, letterSpacing: '.25px', lineHeight: 1.5, textTransform: 'uppercase', color: INK, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.name}
        </div>
      </Link>
    </div>
  );
}

export default function NewThisWeek() {
  const bp = useLandingBreakpoint();
  const m  = bp.isMobile;
  const t  = bp.isTablet;

  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [sort,     setSort]     = useState('featured');

  useEffect(() => {
    api.getProducts({ limit: 8 })
      .then(res => {
        const list = Array.isArray(res) ? res : (res?.data ?? []);
        setProducts(list.slice(0, 8));
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const sorted = sort === 'featured' ? products : [...products].sort((a, b) => {
    const diff = Number(a.base_price || 0) - Number(b.base_price || 0);
    return sort === 'low' ? diff : -diff;
  });

  const sortControl = (
    <label style={{ display: 'flex', flexDirection: m ? 'column' : 'row', alignItems: m ? 'flex-start' : 'center', flexShrink: 0, fontSize: m ? 9 : 10, lineHeight: m ? '12px' : 'normal', gap: m ? 0 : 3, fontWeight: 400, color: MUTED, paddingTop: m ? 6 : 0 }}>
      Sort by
      <select value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort products"
        style={{ border: 'none', background: 'transparent', color: INK, fontSize: m ? 10 : 11, fontFamily: 'inherit', padding: m ? '7px 0' : 9, width: m ? 99 : 124, cursor: 'pointer' }}>
        <option value="featured">Featured</option>
        <option value="low">Price: low to high</option>
        <option value="high">Price: high to low</option>
      </select>
    </label>
  );

  // Mirrors the reference #products rules: 4.3% gutter (5% on phones), heading
  // clamp(36px, 4vw, 62px), 4-column grid (2 on phones) with 37/22px gaps
  // (30/16px on tablets, 29/14px on phones).
  return (
    <section id="products" style={{ scrollMarginTop: 30, background: '#FDF9F1', padding: m ? '40px 5% 42px' : '58px 4.3% 65px', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: m ? 'flex-start' : 'flex-end', gap: m ? 15 : 20, marginBottom: 28 }}>
        <h2 style={{ flex: m ? '1 1 auto' : 'none', minWidth: 0, fontFamily: SERIF, fontSize: m ? 36 : 'clamp(36px, 4vw, 60px)', fontWeight: 300, color: INK, margin: `0 0 ${m ? 15 : 20}px`, lineHeight: 1.1, letterSpacing: '-.8px' }}>STANDOUT FINDS</h2>
        {sortControl}
      </div>

      {!loading && products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: MUTED, fontSize: 14 }}>New products are being added. Please check back soon.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: m ? 'repeat(2, minmax(0, 1fr))' : 'repeat(4, minmax(0, 1fr))', gap: m ? '29px 14px' : t ? '30px 16px' : '37px 22px' }}>
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} bp={bp} />)
            : sorted.map(p => <ProductCard key={p.id} product={p} bp={bp} />)}
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <Link to="/products" className="sf-all"
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 176, maxWidth: '100%', height: 44, boxSizing: 'border-box', padding: '0 16px', borderRadius: 3, background: INK, color: '#FDF9F1', fontSize: 13, fontWeight: 600, lineHeight: 1.4, letterSpacing: '.1px', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'background .2s ease' }}>
          View all products
        </Link>
      </div>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .sf-all:hover { background: #2B2016 !important; }
        @media (hover: hover) and (min-width: 761px) {
          .sf-card .sf-pill { opacity: 0; transform: translate(-50%, 8px) !important; }
          .sf-card:hover .sf-pill, .sf-card a:focus-visible .sf-pill { opacity: 1; transform: translateX(-50%) !important; }
          .sf-card:hover .sf-img { transform: scale(1.03); }
        }
      `}</style>
    </section>
  );
}
