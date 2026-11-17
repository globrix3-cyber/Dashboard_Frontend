import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { api } from '../../services/api';
import { imageProps } from '../../utils/helpers';

const INK   = '#5B4632';
const MUTED = '#79634E';
const SERIF = "'Canela', 'Cormorant Garamond', Georgia, serif";

function CardSkeleton({ bp }) {
  return (
    <div>
      <div style={{ aspectRatio: '3 / 4', borderRadius: bp.isMobile ? 19 : 30, background: 'linear-gradient(90deg,#F0DCC0 25%,#E3D5C1 50%,#F0DCC0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
      <div style={{ height: 9, width: '40%', margin: `${bp.isMobile ? 22 : 26}px auto 0`, background: '#E3D5C1' }} />
      <div style={{ height: 14, width: '70%', margin: '12px auto 0', background: '#E3D5C1' }} />
    </div>
  );
}

function ProductCard({ product, bp }) {
  const [imgFailed, setImgFailed] = useState(false);
  const m      = bp.isMobile;
  const photo  = imageProps(product.images?.[0]?.image_url, m ? 200 : 340);
  const href   = `/products/${product.id}`;

  // Reference card: 3:4 photo with 30px (desktop) / 19px (mobile) corners, "View details" pill 12px
  // above the bottom edge, then a tiny uppercase category and the uppercase product name, centred.
  return (
    <div className="sf-card" style={{ position: 'relative', color: INK, textAlign: 'center' }}>
      <Link to={href} aria-label={`View details: ${product.name}`}
        style={{ position: 'relative', display: 'block', aspectRatio: '313 / 417', overflow: 'hidden', borderRadius: m ? 19 : 30, background: photo.src && !imgFailed ? '#FDF9F1' : '#E3D5C1', isolation: 'isolate' }}>
        {photo.src && !imgFailed && (
          <img {...photo} alt="" loading="lazy" decoding="async" onError={() => setImgFailed(true)}
            className="sf-img" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .5s ease' }} />
        )}
        <span aria-hidden="true" className="sf-pill"
          style={{ position: 'absolute', left: '50%', bottom: 12, transform: 'translateX(-50%)', borderRadius: 30, background: INK, color: '#FDF9F1', fontSize: m ? 10 : 11, lineHeight: m ? '13px' : '14px', fontWeight: 400, letterSpacing: '.4px', padding: m ? '10px 17px' : '12px 25px', whiteSpace: 'nowrap', transition: 'opacity .25s ease, transform .25s ease' }}>
          View details
        </span>
      </Link>

      <Link to={href} style={{ display: 'block', textDecoration: 'none', color: INK, padding: '0 5px' }}>
        <div style={{ marginTop: m ? 22 : 26, fontSize: m ? 8 : 9, lineHeight: m ? '10px' : '12px', fontWeight: 400, letterSpacing: m ? '1px' : '1.6px', textTransform: 'uppercase', color: MUTED }}>
          {product.category_name || 'Uncategorized'}
        </div>
        <div style={{ marginTop: m ? 9 : 10, fontSize: m ? 12 : 15, fontWeight: 500, letterSpacing: '.25px', lineHeight: 1.5, textTransform: 'uppercase', color: INK, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.name}
        </div>
      </Link>
    </div>
  );
}

export default function NewThisWeek() {
  const bp = useBreakpoint();
  const m  = bp.isMobile;

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
    <label style={{ display: 'flex', flexDirection: m ? 'column' : 'row', alignItems: m ? 'flex-start' : 'center', flexShrink: 0, fontSize: m ? 9 : 10, fontWeight: 400, color: MUTED, marginTop: m ? 0 : 49 }}>
      Sort by
      <select value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort products"
        style={{ border: 'none', background: 'transparent', color: INK, fontSize: m ? 10 : 11, fontFamily: 'inherit', padding: m ? '7px 0' : 9, width: m ? 99 : 124, cursor: 'pointer', marginTop: m ? 6 : 0 }}>
        <option value="featured">Featured</option>
        <option value="low">Price: low to high</option>
        <option value="high">Price: high to low</option>
      </select>
    </label>
  );

  // Reference: 1440px → 1346px tall (313x417 cards, 21px column gap, 45px row gap);
  // 390px → 1614px tall (169x225 cards, 13px column gap, 37px row gap).
  return (
    <section id="products" style={{ scrollMarginTop: 90, background: '#FDF9F1', padding: m ? '40px 19.5px 42px' : bp.isTablet ? '56px 32px 60px' : '58px 61.9px 65px' }}>
      <div style={{ maxWidth: 1316, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: m ? 43 : 28 }}>
          <h2 style={{ maxWidth: m ? 237 : 'none', fontFamily: SERIF, fontSize: m ? 36 : bp.isTablet ? 46 : 57.6, fontWeight: 300, color: INK, margin: 0, lineHeight: 1.1, letterSpacing: '-.8px' }}>STANDOUT FINDS</h2>
          {sortControl}
        </div>

        {!loading && products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: MUTED, fontSize: 14 }}>No products listed yet — check back soon!</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: m ? 'repeat(2,minmax(0,1fr))' : 'repeat(4,minmax(0,1fr))', gap: m ? '37px 13px' : bp.isTablet ? '40px 18px' : '45px 21px' }}>
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} bp={bp} />)
              : sorted.map(p => <ProductCard key={p.id} product={p} bp={bp} />)}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <Link to="/products" className="sf-all"
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 176, height: 44, boxSizing: 'border-box', padding: '0 16px', borderRadius: 3, background: INK, color: '#FDF9F1', fontSize: 13, fontWeight: 600, letterSpacing: '.1px', textDecoration: 'none', transition: 'background .2s ease' }}>
            View all products
          </Link>
        </div>
      </div>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .sf-all:hover { background: #4A3828 !important; }
        @media (hover: hover) and (min-width: 640px) {
          .sf-card .sf-pill { opacity: 0; transform: translate(-50%, 8px) !important; }
          .sf-card:hover .sf-pill, .sf-card a:focus-visible .sf-pill { opacity: 1; transform: translateX(-50%) !important; }
          .sf-card:hover .sf-img { transform: scale(1.03); }
        }
      `}</style>
    </section>
  );
}
