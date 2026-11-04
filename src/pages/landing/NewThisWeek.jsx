import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { toggleLogin } from '../../features/auth/authSlice';
import { useBreakpoint, rGutter } from '../../hooks/useBreakpoint';
import { api } from '../../services/api';
import { imageProps } from '../../utils/helpers';
import { CATEGORY_LINKS, useCategoryCounts, hasProducts } from './categoryLinks';
import { useWishlist } from '../../hooks/useWishlist';

const INK   = '#5B4632';
const SERIF = "'Cormorant Garamond', Georgia, serif";


const pill = { padding: '10px 18px', borderRadius: 100, border: '1px solid #E3D5C1', fontSize: 11, textDecoration: 'none', whiteSpace: 'nowrap' };

function CardSkeleton() {
  return (
    <div>
      <div style={{ aspectRatio: '314 / 280', background: 'linear-gradient(90deg,#F0DCC0 25%,#E3D5C1 50%,#F0DCC0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
      <div style={{ height: 10, width: '40%', marginTop: 26, background: '#E3D5C1' }} />
      <div style={{ height: 16, width: '70%', marginTop: 14, background: '#E3D5C1' }} />
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
  const photo  = imageProps(product.images?.[0]?.image_url, 320);
  const imgUrl = photo.src;
  const moq    = Number(product.min_order_quantity);

  return (
    <Link to={`/products/${product.id}`} style={{ display: 'block', textDecoration: 'none', color: INK }}>
      <div style={{ position: 'relative', aspectRatio: '314 / 280', background: '#E3D5C1', overflow: 'hidden' }}>
        {imgUrl && !imgFailed && (
          <img {...photo} alt={product.name} loading="lazy" decoding="async" onError={() => setImgFailed(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        )}
        <button
          onClick={e => { e.preventDefault(); e.stopPropagation(); onFav(); }}
          aria-label={isFav ? 'Remove from wishlist' : 'Add to wishlist'}
          style={{ position: 'absolute', top: 12, right: 12, width: 30, height: 30, borderRadius: '50%', border: 'none', background: '#FDF9F1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Heart size={15} color={INK} fill={isFav ? '#C8792C' : 'none'} />
        </button>
      </div>
      <div style={{ marginTop: 20, fontSize: 9, letterSpacing: '.16em', textTransform: 'uppercase', color: '#79634E' }}>{product.category_name || 'Uncategorized'}</div>
      <div style={{ margin: '10px 0', fontFamily: SERIF, fontSize: bp.isMobile ? 19 : 24, fontWeight: 500, lineHeight: 1.2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</div>
      {isLoggedIn ? (
        <div style={{ fontSize: 13, fontWeight: 600 }}>{priceLabel(product)} <span style={{ fontSize: 11, fontWeight: 400, color: '#79634E' }}>/ {product.moq_unit || 'unit'}</span></div>
      ) : (
        <button onClick={e => { e.preventDefault(); onLoginRequired(); }}
          style={{ padding: 0, background: 'none', border: 'none', fontSize: 12, color: INK, cursor: 'pointer', fontFamily: 'inherit' }}>
          🔒 Sign in to see price
        </button>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginTop: 14, fontSize: 11 }}>
        <span style={{ color: '#79634E' }}>{moq ? `Min. order ${moq} ${product.moq_unit || 'units'}` : ''}</span>
        <span style={{ borderBottom: `1px solid ${INK}`, paddingBottom: 4, fontWeight: 500 }}>Request quote +</span>
      </div>
    </Link>
  );
}

export default function NewThisWeek() {
  const dispatch   = useDispatch();
  const bp         = useBreakpoint();
  const isLoggedIn = !!useSelector(s => s.auth.token);
  const openLogin  = () => dispatch(toggleLogin(true));
  const counts     = useCategoryCounts();
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

  return (
    <section id="products" style={{ background: '#FDF9F1', padding: bp.isMobile ? '28px 0 44px' : '40px 0 60px' }}>
      <div style={rGutter(bp)}>
        <div style={{ fontSize: 9, letterSpacing: '.2em', color: INK, marginBottom: 16 }}>THE DISCOVERY EDIT</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
          <h2 style={{ fontFamily: SERIF, fontSize: bp.isMobile ? 32 : 42, fontWeight: 500, color: INK, margin: 0, lineHeight: 1.1 }}>Find a place on your shelves.</h2>
            <label style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 10, color: INK }}>
              Sort by
              <select value={sort} onChange={e => setSort(e.target.value)}
                style={{ border: 'none', background: 'transparent', color: INK, fontSize: 12, fontFamily: 'inherit', padding: '4px 8px', cursor: 'pointer' }}>
                <option value="featured">Featured</option>
                <option value="low">Price: low to high</option>
                <option value="high">Price: high to low</option>
              </select>
            </label>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflowX: 'auto', scrollbarWidth: 'none', margin: '30px 0 32px' }}>
          <span style={{ ...pill, background: INK, borderColor: INK, color: '#FDF9F1' }}>All discoveries</span>
          {CATEGORY_LINKS.filter(f => hasProducts(counts, f.root)).map(f => <Link key={f.label} to={f.to} style={{ ...pill, color: INK }}>{f.label}</Link>)}
          {!loading && <span style={{ marginLeft: 'auto', paddingLeft: 12, flexShrink: 0, fontSize: 10, color: INK }}>{products.length} discoveries</span>}
        </div>

        {!loading && products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#79634E', fontSize: 14 }}>No products listed yet — check back soon!</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: bp.isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: bp.isMobile ? '32px 12px' : '40px 20px' }}>
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)
              : sorted.map(p => <ProductCard key={p.id} product={p} bp={bp} isLoggedIn={isLoggedIn} onLoginRequired={openLogin} isFav={wishlist.has(p.id)} onFav={() => wishlist.toggle(p.id)} />)}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 36 }}>
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
