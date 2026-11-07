import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { toggleLogin } from '../../features/auth/authSlice';
import { useBreakpoint, rGutter } from '../../hooks/useBreakpoint';
import { api } from '../../services/api';
import { imageProps } from '../../utils/helpers';
import { useWishlist } from '../../hooks/useWishlist';

const INK   = '#5B4632';
const MUTED = '#79634E';
const SERIF = "'Cormorant Garamond', Georgia, serif";

function CardSkeleton({ bp }) {
  return (
    <div>
      <div style={{ aspectRatio: '1 / 1', background: 'linear-gradient(90deg,#F0DCC0 25%,#E3D5C1 50%,#F0DCC0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
      <div style={{ height: 9, width: '40%', margin: `${bp.isMobile ? 40 : 66}px auto 0`, background: '#E3D5C1' }} />
      <div style={{ height: 14, width: '70%', margin: '14px auto 0', background: '#E3D5C1' }} />
      <div style={{ height: 14, width: '30%', margin: '14px auto 0', background: '#E3D5C1' }} />
    </div>
  );
}

function priceLabel(product) {
  const price = Number(product.base_price);
  if (!price) return 'Price on request';
  return product.currency === 'USD' ? `$${price.toFixed(2)}` : `₹${price.toLocaleString('en-IN')}`;
}

function ProductCard({ product, isLoggedIn, onLoginRequired, isFav, onFav, bp }) {
  const [imgFailed, setImgFailed] = useState(false);
  const photo  = imageProps(product.images?.[0]?.image_url, bp.isMobile ? 200 : 320);
  const imgUrl = photo.src;
  const moq    = Number(product.min_order_quantity);
  const unit   = product.moq_unit || 'unit';

  return (
    <Link to={`/products/${product.id}`} style={{ position: 'relative', display: 'block', textDecoration: 'none', color: INK, textAlign: 'center' }}>
      <div style={{ aspectRatio: '1 / 1', background: '#E3D5C1', overflow: 'hidden' }}>
        {imgUrl && !imgFailed && (
          <img {...photo} alt={product.name} loading="lazy" decoding="async" onError={() => setImgFailed(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        )}
      </div>
      {/* Heart straddles the image's top edge, top-left — as in the reference */}
      <button
        type="button"
        onClick={e => { e.preventDefault(); e.stopPropagation(); onFav(); }}
        aria-label={isFav ? 'Remove from wishlist' : 'Add to wishlist'}
        aria-pressed={isFav}
        style={{ position: 'absolute', top: bp.isMobile ? -8 : -24, left: bp.isMobile ? 8 : 14, width: bp.isMobile ? 28 : 34, height: bp.isMobile ? 28 : 34, borderRadius: '50%', border: 'none', background: '#FDF9F1', boxShadow: '0 2px 10px rgba(43,32,22,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}>
        <Heart size={bp.isMobile ? 13 : 15} color={INK} strokeWidth={1.6} fill={isFav ? '#C8792C' : 'none'} />
      </button>

      <div style={{ marginTop: bp.isMobile ? 40 : 66, fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', color: MUTED }}>{product.category_name || 'Uncategorized'}</div>
      <div style={{ margin: '10px 0 8px', fontSize: bp.isMobile ? 13 : 15, lineHeight: 1.4, textTransform: 'uppercase', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</div>
      {isLoggedIn ? (
        <>
          <div style={{ fontSize: bp.isMobile ? 15 : 17 }}>{priceLabel(product)}</div>
          <div style={{ marginTop: 6, fontSize: 10, color: MUTED }}>/ {unit}, indicative</div>
        </>
      ) : (
        <button type="button" onClick={e => { e.preventDefault(); e.stopPropagation(); onLoginRequired(); }}
          style={{ padding: 0, background: 'none', border: 'none', fontSize: 12, color: INK, cursor: 'pointer', fontFamily: 'inherit' }}>
          🔒 Sign in to see price
        </button>
      )}
      {moq > 0 && <div style={{ marginTop: 10, fontSize: 10, color: MUTED }}>Min. order {moq} {product.moq_unit || 'units'}</div>}
      <div style={{ marginTop: 14 }}>
        <span style={{ fontSize: 11, borderBottom: `1px solid ${INK}`, paddingBottom: 4 }}>Request quote +</span>
      </div>
    </Link>
  );
}

export default function NewThisWeek() {
  const dispatch   = useDispatch();
  const bp         = useBreakpoint();
  const isLoggedIn = !!useSelector(s => s.auth.token);
  const openLogin  = () => dispatch(toggleLogin(true));
  const wishlist   = useWishlist();

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
    <label style={{ display: 'flex', flexDirection: bp.isMobile ? 'column' : 'row', alignItems: bp.isMobile ? 'flex-start' : 'center', gap: bp.isMobile ? 6 : 14, flexShrink: 0, fontSize: 10, color: INK }}>
      Sort by
      <select value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort products"
        style={{ border: 'none', background: 'transparent', color: INK, fontSize: 11, fontFamily: 'inherit', padding: '4px 0', minWidth: bp.isMobile ? 96 : 120, cursor: 'pointer' }}>
        <option value="featured">Featured</option>
        <option value="low">Price: low to high</option>
        <option value="high">Price: high to low</option>
      </select>
    </label>
  );

  return (
    <section id="products" style={{ scrollMarginTop: 90, background: '#FDF9F1', padding: bp.isMobile ? '40px 0 44px' : '62px 0 66px' }}>
      <div style={rGutter(bp)}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
          <h2 style={{ fontFamily: SERIF, fontSize: bp.isMobile ? 40 : 58, fontWeight: 300, color: INK, margin: 0, lineHeight: 1.05, letterSpacing: '-.01em' }}>STANDOUT FINDS</h2>
          {bp.isMobile && sortControl}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, marginTop: 22 }}>
          <p style={{ margin: 0, maxWidth: bp.isMobile ? 240 : 760, fontSize: bp.isMobile ? 12 : 15, lineHeight: 1.8, color: INK }}>
            Source distinctive furniture and home accessories for your business. Explore wholesale prices and minimum quantities to build your next order.
          </p>
          {!bp.isMobile && sortControl}
        </div>
        <div style={{ margin: bp.isMobile ? '22px 0 34px' : '34px 0 52px', minHeight: 12, fontSize: 10, color: INK }}>
          {!loading && products.length > 0 && `${products.length} ${products.length === 1 ? 'discovery' : 'discoveries'}`}
        </div>

        {!loading && products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: MUTED, fontSize: 14 }}>No products listed yet — check back soon!</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: bp.isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: bp.isMobile ? '56px 14px' : '64px 22px' }}>
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} bp={bp} />)
              : sorted.map(p => <ProductCard key={p.id} product={p} bp={bp} isLoggedIn={isLoggedIn} onLoginRequired={openLogin} isFav={wishlist.has(p.id)} onFav={() => wishlist.toggle(p.id)} />)}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: bp.isMobile ? 40 : 42 }}>
          <Link to="/products" style={{ display: 'inline-flex', justifyContent: 'space-between', gap: 38, minWidth: 180, boxSizing: 'border-box', padding: '13px 22px', border: `1px solid ${INK}`, color: INK, fontSize: 11, textDecoration: 'none' }}>
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
