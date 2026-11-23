import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { api } from '../services/api';
import { imageProps } from '../utils/helpers';
import useWishlist from '../hooks/useWishlist';
import { useBreakpoint } from '../hooks/useBreakpoint';

const MOCHA = '#5B4632';
const CREAM = '#FDF9F1';
const MUTED = '#79634E';
const SERIF = "'Canela', 'Cormorant Garamond', Georgia, serif";
const MAX_ITEMS = 60;

/* ── Saved products (client brief: Wishlist in the account menu) ──────────────
   The wishlist API returns product ids; each product is fetched for its card.
   Cards follow the listing rule: 3:4 image, product name and category only. */
export default function BuyerWishlistPage() {
  const navigate = useNavigate();
  const bp = useBreakpoint();
  const { ids, toggle } = useWishlist();
  const [products, setProducts] = useState({});   // id → product | null (failed / removed)

  const idList = useMemo(() => [...ids].slice(0, MAX_ITEMS), [ids]);

  useEffect(() => {
    let alive = true;
    const missing = idList.filter(id => !(id in products));
    if (!missing.length) return () => { alive = false; };
    Promise.all(missing.map(id => api.getProduct(id).then(p => [id, p]).catch(() => [id, null])))
      .then(rows => {
        if (!alive) return;
        setProducts(prev => ({ ...prev, ...Object.fromEntries(rows) }));
      });
    return () => { alive = false; };
  }, [idList, products]);

  // Still fetching while any saved id has no entry yet (failed fetches are stored as null).
  const loading = idList.some(id => !(id in products));
  const saved = idList.map(id => products[id]).filter(Boolean);
  const cols = bp.isMobile ? 2 : bp.isTablet ? 3 : 4;

  return (
    <div style={{ color: MOCHA }}>
      <div style={{ marginBottom: bp.isMobile ? 22 : 32 }}>
        <div style={{ fontSize: 11, letterSpacing: '1.6px', textTransform: 'uppercase', color: MUTED, fontWeight: 500 }}>Your account</div>
        <h1 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: bp.isMobile ? 32 : 42, letterSpacing: '-.8px', lineHeight: 1.1, margin: '6px 0 8px' }}>Wishlist</h1>
        <p style={{ margin: 0, fontSize: 14, color: MUTED }}>Products you have saved for your next collection.</p>
      </div>

      {loading && saved.length === 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`, gap: bp.isMobile ? 14 : 24 }}>
          {Array.from({ length: cols }).map((_, i) => (
            <div key={i} style={{ aspectRatio: '3 / 4', background: '#F5F0E7', borderRadius: 14 }} />
          ))}
        </div>
      ) : saved.length === 0 ? (
        <div style={{ textAlign: 'center', padding: bp.isMobile ? '48px 12px' : '72px 24px', border: '1px solid #E3D5C1', borderRadius: 4, background: CREAM }}>
          <Heart size={28} color={MOCHA} strokeWidth={1.4} />
          <h2 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: 26, margin: '14px 0 8px' }}>Your wishlist is empty</h2>
          <p style={{ margin: '0 auto 22px', maxWidth: 380, fontSize: 14, color: MUTED, lineHeight: 1.7 }}>
            Tap the heart on any product to save it here and come back to it when you're ready to request a quote.
          </p>
          <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', height: 44, padding: '0 22px', background: MOCHA, color: CREAM, borderRadius: 3, fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>
            Browse products
          </Link>
        </div>
      ) : (
        <>
          <p style={{ fontSize: 13, color: MUTED, margin: '0 0 16px' }}>{saved.length} saved {saved.length === 1 ? 'product' : 'products'}</p>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`, gap: bp.isMobile ? '22px 14px' : '34px 24px' }}>
            {saved.map(p => {
              const img = p.images?.[0]?.image_url;
              return (
                <article key={p.id} style={{ position: 'relative', minWidth: 0 }}>
                  <button type="button" onClick={() => navigate(`/products/${p.id}`)} aria-label={`View ${p.name}`}
                    style={{ display: 'block', width: '100%', padding: 0, border: 'none', background: 'none', cursor: 'pointer', textAlign: 'center', color: MOCHA, fontFamily: 'inherit' }}>
                    <div style={{ aspectRatio: '3 / 4', borderRadius: 14, overflow: 'hidden', background: '#F5F0E7' }}>
                      {img && <img loading="lazy" decoding="async" {...imageProps(img, 400)} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />}
                    </div>
                    <div style={{ marginTop: 14, fontSize: 10.5, letterSpacing: '1.6px', textTransform: 'uppercase', color: MUTED }}>{p.category_name || 'Product'}</div>
                    <div style={{ marginTop: 6, fontSize: bp.isMobile ? 13 : 14, letterSpacing: '.4px', textTransform: 'uppercase', lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.name}</div>
                  </button>
                  <button type="button" onClick={() => toggle(p.id)} aria-label={`Remove ${p.name} from wishlist`} title="Remove from wishlist"
                    style={{ position: 'absolute', top: 10, right: 10, width: 36, height: 36, borderRadius: '50%', border: 'none', background: 'rgba(253,249,241,.94)', boxShadow: '0 1px 3px rgba(43,32,22,.18)', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
                    <Heart size={16} color={MOCHA} fill={MOCHA} />
                  </button>
                </article>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
