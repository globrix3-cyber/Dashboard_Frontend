import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toggleLogin } from '../../features/auth/authSlice';
import { useBreakpoint, rGutter } from '../../hooks/useBreakpoint';
import { api } from '../../services/api';
import { resolveImageUrl } from '../../utils/helpers';

const INK = '#5B4632';

function CardSkeleton() {
  return (
    <div>
      <div style={{ aspectRatio: '1 / 1', background: 'linear-gradient(90deg,#E3D5C1 25%,#E3D5C1 50%,#E3D5C1 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
      <div style={{ height: 12, width: '60%', margin: '28px auto 0', background: '#E3D5C1' }} />
      <div style={{ height: 12, width: '35%', margin: '12px auto 0', background: '#E3D5C1' }} />
    </div>
  );
}

function priceLabel(product) {
  const price = Number(product.base_price);
  if (!price) return 'Price on request';
  return product.currency === 'USD' ? `$${price.toFixed(2)}` : `₹${price.toLocaleString('en-IN')}`;
}

function ProductCard({ product, isLoggedIn, onLoginRequired, bp }) {
  const [imgFailed, setImgFailed] = useState(false);
  const imgUrl = resolveImageUrl(product.images?.[0]?.image_url);

  return (
    <Link to={`/products/${product.id}`} style={{ display: 'block', textDecoration: 'none', color: INK, textAlign: 'center' }}>
      <div style={{ aspectRatio: '1 / 1', background: '#E3D5C1', overflow: 'hidden' }}>
        {imgUrl && !imgFailed && (
          <img src={imgUrl} alt={product.name} loading="lazy" decoding="async" onError={() => setImgFailed(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        )}
      </div>
      <div style={{ marginTop: bp.isMobile ? 16 : 28, fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase' }}>{product.category_name || 'Uncategorized'}</div>
      <div style={{ margin: '10px 0 8px', fontSize: bp.isMobile ? 13 : 15, lineHeight: 1.35, textTransform: 'uppercase', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</div>
      {isLoggedIn ? (
        <div style={{ fontSize: 17 }}>{priceLabel(product)}</div>
      ) : (
        <button onClick={e => { e.preventDefault(); onLoginRequired(); }}
          style={{ padding: 0, background: 'none', border: 'none', fontSize: 13, color: INK, cursor: 'pointer', fontFamily: 'inherit' }}>
          🔒 Sign in to see price
        </button>
      )}
      <div style={{ marginTop: 14 }}>
        <span style={{ fontSize: 12, borderBottom: `1px solid ${INK}`, paddingBottom: 4 }}>Request quote +</span>
      </div>
    </Link>
  );
}

export default function NewThisWeek() {
  const dispatch   = useDispatch();
  const bp         = useBreakpoint();
  const isLoggedIn = !!useSelector(s => s.auth.token);
  const openLogin  = () => dispatch(toggleLogin(true));

  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [sort,     setSort]     = useState('featured');

  useEffect(() => {
    api.getProducts()
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

  return (
    <section id="products" style={{ background: '#FDF9F1', padding: bp.isMobile ? '44px 0' : '64px 0' }}>
      <div style={rGutter(bp)}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: bp.isMobile ? 36 : 58, fontWeight: 600, color: INK, margin: 0, lineHeight: 1.1 }}>STANDOUT FINDS</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, margin: '16px 0 40px' }}>
          <p style={{ margin: 0, maxWidth: 780, fontSize: 15, lineHeight: 1.8, color: INK }}>
            Source distinctive furniture and home accessories for your business. Explore wholesale prices and minimum quantities to build your next order.
          </p>
          {isLoggedIn && (
            <label style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 10, color: INK }}>
              Sort by
              <select value={sort} onChange={e => setSort(e.target.value)}
                style={{ border: 'none', background: 'transparent', color: INK, fontSize: 12, fontFamily: 'inherit', padding: '4px 8px', cursor: 'pointer' }}>
                <option value="featured">Featured</option>
                <option value="low">Price: low to high</option>
                <option value="high">Price: high to low</option>
              </select>
            </label>
          )}
        </div>

        {!loading && products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#79634E', fontSize: 14 }}>No products listed yet — check back soon!</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: bp.isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: bp.isMobile ? '32px 12px' : '48px 22px' }}>
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)
              : sorted.map(p => <ProductCard key={p.id} product={p} bp={bp} isLoggedIn={isLoggedIn} onLoginRequired={openLogin} />)}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Link to="/products" style={{ display: 'inline-flex', gap: 38, padding: '13px 22px', border: `1px solid ${INK}`, color: INK, fontSize: 12, textDecoration: 'none' }}>
            View all products <span>↗</span>
          </Link>
        </div>
      </div>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </section>
  );
}
