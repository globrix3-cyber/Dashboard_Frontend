import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Heart, Eye } from 'lucide-react';
import { toggleLogin } from '../../features/auth/authSlice';
import { useBreakpoint, rGutter } from '../../hooks/useBreakpoint';
import { api } from '../../services/api';
import { imageProps } from '../../utils/helpers';
import { useWishlist } from '../../hooks/useWishlist';

const INK   = '#5B4632';
const MUTED = '#79634E';
const SERIF = "'Canela', 'Cormorant Garamond', Georgia, serif";

function CardSkeleton({ bp }) {
  return (
    <div>
      <div style={{ aspectRatio: '4 / 5', background: 'linear-gradient(90deg,#F0DCC0 25%,#E3D5C1 50%,#F0DCC0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
      <div style={{ height: 9, width: '40%', margin: `${bp.isMobile ? 16 : 22}px auto 0`, background: '#E3D5C1' }} />
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

  const href   = `/products/${product.id}`;
  const btn    = bp.isMobile ? 29 : 34;
  const inset  = bp.isMobile ? 9 : 13;
  const round  = { position: 'absolute', top: inset, width: btn, height: btn, borderRadius: '50%', border: 'none', background: '#FDF9F1', boxShadow: '0 2px 10px rgba(43,32,22,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0, boxSizing: 'border-box', color: INK };

  return (
    <div className="sf-card" style={{ position: 'relative', color: INK, textAlign: 'center' }}>
      {/* Portrait 4:5 frame; the photo is contained inside it, as in the reference */}
      <div style={{ position: 'relative', aspectRatio: '4 / 5' }}>
        <Link to={href} tabIndex={-1} style={{ display: 'block', width: '100%', height: '100%', background: imgUrl && !imgFailed ? 'transparent' : '#E3D5C1' }}>
          {imgUrl && !imgFailed && (
            <img {...photo} alt={product.name} loading="lazy" decoding="async" onError={() => setImgFailed(true)}
              style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
          )}
        </Link>
        <button
          type="button"
          onClick={e => { e.preventDefault(); e.stopPropagation(); onFav(); }}
          aria-label={isFav ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={isFav}
          style={{ ...round, left: inset }}>
          <Heart size={bp.isMobile ? 13 : 15} color={INK} strokeWidth={1.6} fill={isFav ? '#C8792C' : 'none'} />
        </button>
        <Link to={href} aria-label="View product" style={{ ...round, right: bp.isMobile ? 10 : 14 }}>
          <Eye size={bp.isMobile ? 14 : 16} color={INK} strokeWidth={1.6} />
        </Link>
        <Link to={href} className="sf-pill"
          style={{ position: 'absolute', left: '50%', bottom: bp.isMobile ? 13 : 12, transform: 'translateX(-50%)', width: bp.isMobile ? 94 : 116, height: bp.isMobile ? 33 : 38, boxSizing: 'border-box', borderRadius: 999, background: 'rgba(91,70,50,.94)', color: '#FDF9F1', fontFamily: "'DM Sans', sans-serif", fontSize: bp.isMobile ? 10 : 11, fontWeight: 400, letterSpacing: '.4px', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'opacity .2s ease' }}>
          View details
        </Link>
      </div>

      <Link to={href} style={{ display: 'block', textDecoration: 'none', color: INK }}>
        <div style={{ marginTop: bp.isMobile ? 16 : 22, fontSize: bp.isMobile ? 8 : 9, fontWeight: 400, letterSpacing: bp.isMobile ? '1px' : '1.6px', textTransform: 'uppercase', color: MUTED }}>{product.category_name || 'Uncategorized'}</div>
        <div style={{ margin: '10px 0 8px', fontSize: bp.isMobile ? 12 : bp.isTablet ? 14 : 15, fontWeight: 500, letterSpacing: '.25px', lineHeight: 1.4, textTransform: 'uppercase', color: INK, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</div>
        {isLoggedIn ? (
          <>
            <div style={{ fontSize: bp.isMobile ? 15 : 16, fontWeight: 400, color: INK }}>{priceLabel(product)}</div>
            <div style={{ marginTop: 6, fontSize: bp.isMobile ? 9 : 10, fontWeight: 400, color: MUTED }}>/ {unit}, indicative</div>
          </>
        ) : (
          <button type="button" onClick={e => { e.preventDefault(); e.stopPropagation(); onLoginRequired(); }}
            style={{ padding: 0, background: 'none', border: 'none', fontSize: 12, color: INK, cursor: 'pointer', fontFamily: 'inherit' }}>
            🔒 Sign in to see price
          </button>
        )}
        {moq > 0 && <div style={{ marginTop: 10, fontSize: bp.isMobile ? 9 : 10, fontWeight: 400, color: MUTED }}>Min. order {moq} {product.moq_unit || 'units'}</div>}
        <div style={{ marginTop: 14 }}>
          <span style={{ fontSize: bp.isMobile ? 10 : 11, fontWeight: 500, color: INK, borderBottom: `1px solid ${INK}`, paddingBottom: 4 }}>Request quote +</span>
        </div>
      </Link>
    </div>
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

  // Reference gutters: 61.9px desktop, 19.5px mobile
  const side = bp.isMobile ? 19.5 : 61.9;

  const sortControl = (
    <label style={{ display: 'flex', flexDirection: bp.isMobile ? 'column' : 'row', alignItems: bp.isMobile ? 'flex-start' : 'center', gap: bp.isMobile ? 6 : 14, flexShrink: 0, fontSize: bp.isMobile ? 9 : 10, fontWeight: 400, color: MUTED }}>
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
    <section id="products" style={{ scrollMarginTop: 90, background: '#FDF9F1', padding: bp.isMobile ? '40px 0 42px' : '58px 0 65px' }}>
      <div style={{ ...rGutter(bp), ...(bp.isTablet ? {} : { paddingLeft: side, paddingRight: side }) }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
          <h2 style={{ flex: bp.isTablet ? '0 1 auto' : `0 1 ${bp.isMobile ? 237 : 760}px`, fontFamily: SERIF, fontSize: bp.isMobile ? 36 : bp.isTablet ? 46 : 57.6, fontWeight: 300, color: INK, margin: 0, lineHeight: 1.05, letterSpacing: '-.8px' }}>STANDOUT FINDS</h2>
          {bp.isMobile && sortControl}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, marginTop: bp.isMobile ? 18 : 23 }}>
          <p style={{ margin: 0, maxWidth: bp.isMobile ? 237 : 760, fontSize: bp.isMobile ? 12 : 15, lineHeight: 1.8, color: INK }}>
            Source distinctive furniture and home accessories for your business. Explore wholesale prices and minimum quantities to build your next order.
          </p>
          {!bp.isMobile && sortControl}
        </div>
        <div style={{ margin: bp.isMobile ? '14px 0 12px' : '22px 0 19px', minHeight: 12, lineHeight: '12px', fontSize: 10, fontWeight: 400, color: MUTED }}>
          {!loading && products.length > 0 && `${products.length} ${products.length === 1 ? 'discovery' : 'discoveries'}`}
        </div>

        {!loading && products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: MUTED, fontSize: 14 }}>No products listed yet — check back soon!</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: bp.isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: bp.isMobile ? '37px 13px' : bp.isTablet ? '40px 18px' : '29px 21px' }}>
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} bp={bp} />)
              : sorted.map(p => <ProductCard key={p.id} product={p} bp={bp} isLoggedIn={isLoggedIn} onLoginRequired={openLogin} isFav={wishlist.has(p.id)} onFav={() => wishlist.toggle(p.id)} />)}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: bp.isMobile ? 38 : 28 }}>
          <Link to="/products" style={{ display: 'inline-flex', justifyContent: 'space-between', gap: 38, minWidth: 180, boxSizing: 'border-box', padding: '13px 22px', border: `1px solid ${INK}`, color: INK, fontSize: 11, fontWeight: 400, textDecoration: 'none' }}>
            View all products <span>↗</span>
          </Link>
        </div>
      </div>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @media (hover: hover) and (min-width: 640px) {
          .sf-card .sf-pill { opacity: 0; }
          .sf-card:hover .sf-pill, .sf-card .sf-pill:focus-visible { opacity: 1; }
        }
      `}</style>
    </section>
  );
}
