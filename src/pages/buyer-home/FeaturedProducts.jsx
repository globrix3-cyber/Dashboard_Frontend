import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useLandingBreakpoint } from '../../hooks/useBreakpoint';
import { imageProps } from '../../utils/helpers';

const SERIF = "'Canela', 'Cormorant Garamond', Georgia, serif";
const INK = '#5B4632';
const MUTED = '#79634E';

// Listing card per the client (Canva V2, pages 11 and 16): 3:4 photo, then only
// the product name and its category — no badge, price or MOQ.
function ProductTile({ p, isFav, onFav }) {
  const [hov, setHov] = useState(false);
  const img = p.images?.[0]?.image_url;
  return (
    <Link to={`/products/${p.id}`}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: 'block', minWidth: 0, textDecoration: 'none', color: INK }}>
      <div style={{ position: 'relative', aspectRatio: '3 / 4', overflow: 'hidden', borderRadius: 14, background: '#F0E6D6' }}>
        {img && (
          <img {...imageProps(img, 420)} alt={p.name} loading="lazy" decoding="async"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: hov ? 'scale(1.04)' : 'none', transition: 'transform .45s ease' }} />
        )}
        <button type="button" aria-label={isFav ? `Remove ${p.name} from wishlist` : `Save ${p.name} to wishlist`} aria-pressed={isFav}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onFav(); }}
          style={{ position: 'absolute', top: 10, right: 10, width: 34, height: 34, borderRadius: '50%', border: 'none', background: 'rgba(253,249,241,.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 1px 4px rgba(43,32,22,.12)' }}>
          <Heart size={15} fill={isFav ? '#C8792C' : 'none'} color={isFav ? '#C8792C' : INK} />
        </button>
      </div>
      <p style={{ margin: '14px 0 0', fontSize: 14, lineHeight: 1.4, fontWeight: 500, color: INK, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.name}</p>
      {p.category_name && <p style={{ margin: '5px 0 0', fontSize: 12, color: MUTED }}>{p.category_name}</p>}
    </Link>
  );
}

// Standout finds (client Canva p8 / p39): 4 across × 3 rows, a fresh random pick on each visit, then "View all".
const ROWS = 3;

function pickRandom(list, n) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a.slice(0, n);
}
export default function FeaturedProducts({ products, wishlist, loading, error }) {
  const bp = useLandingBreakpoint();
  const m = bp.isMobile;
  const cols = m ? 2 : 4;
  // Shuffle once per product list (not on every render), so hovering or saving doesn't reshuffle the grid.
  const items = useMemo(() => pickRandom(products, cols * ROWS), [products, cols]);
  return (
    <section aria-labelledby="home-featured" style={{ marginTop: m ? 48 : 76, paddingBottom: m ? 56 : 88 }}>
      <h2 id="home-featured" style={{ margin: 0, fontFamily: SERIF, fontWeight: 300, color: INK, letterSpacing: '-1px', lineHeight: 1.05, fontSize: m ? 34 : 'clamp(38px, 3.6vw, 54px)' }}>STANDOUT FINDS</h2>
      <div style={{ marginTop: m ? 20 : 30 }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${m ? 2 : 4}, minmax(0, 1fr))`, gap: m ? '22px 12px' : 'clamp(14px, 1.6vw, 24px)' }}>
            {Array.from({ length: cols * ROWS }, (_, i) => (
              <div key={i} aria-hidden style={{ aspectRatio: '3 / 4', borderRadius: 14, background: '#F0E6D6' }} />
            ))}
          </div>
        ) : error ? (
          <p style={{ color: MUTED, fontSize: 14 }}>
            Products couldn't load just now. <button type="button" onClick={() => window.location.reload()} style={{ background: 'none', border: 'none', padding: 0, color: INK, textDecoration: 'underline', cursor: 'pointer', font: 'inherit' }}>Try again</button>
          </p>
        ) : items.length === 0 ? (
          <p style={{ color: MUTED, fontSize: 14 }}>New products are being added. Please check back soon.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${m ? 2 : 4}, minmax(0, 1fr))`, gap: m ? '26px 12px' : 'clamp(18px, 1.8vw, 28px) clamp(14px, 1.6vw, 24px)' }}>
            {items.map(p => <ProductTile key={p.id} p={p} isFav={wishlist.has(p.id)} onFav={() => wishlist.toggle(p.id)} />)}
          </div>
        )}
      </div>
      <div style={{ textAlign: 'center', marginTop: m ? 30 : 44 }}>
        <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', height: 44, padding: '0 26px', background: INK, color: '#FDF9F1', fontSize: 13, fontWeight: 600, letterSpacing: '.1px', borderRadius: 3, textDecoration: 'none' }}>View all products</Link>
      </div>
    </section>
  );
}
