import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Heart, Plus, ArrowRight, ShoppingBag } from 'lucide-react';
import { IMG } from './landing/images';
import { api } from '../services/api';
import { useFetchData } from '../hooks/useFetchData';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { Spinner, EmptyState } from '../components/UI';
import { resolveImageUrl } from '../utils/helpers';
import { useCurrency } from '../hooks/useCurrency';

/* ── Design tokens ─────────────────────────────────────────────────────────── */
const T = {
  ink:    '#1C1815',
  muted:  '#7A7068',
  border: '#F0EAE0',
  cream:  '#FDF8F2',
  saffron:'#C4773A',
  emerald:'#1A7A4A',
  navy:   '#1B3175',
};

/* ── Category card imagery — paired with real categories at render time ───── */
const CATEGORY_IMAGES = [
  IMG.jaipurTextiles, IMG.blueCeramicVases, IMG.wovenBaskets, IMG.ceramicKitchenware,
  IMG.fabricRolls, IMG.indianJewelry, IMG.vadodaraPottery, IMG.chennaBaskets,
];

/* ── Promo banners ─────────────────────────────────────────────────────────── */
const BANNERS = [
  { title: 'New arrivals this week', sub: 'Fresh stock from 200+ verified suppliers', cta: 'Shop new', bg: '#2C1810', img: IMG.artisanWeaving },
  { title: 'Bulk order deals',       sub: 'Save up to 30% on orders above MOQ × 5',  cta: 'View deals', bg: '#1B3175', img: IMG.fabricRolls  },
  { title: 'Export-ready products',  sub: 'GST invoices, quality certs, fast dispatch', cta: 'Explore', bg: '#1A4A2E', img: IMG.indiaFactoryWorkers },
];

/* ── Favourite state (local only) ─────────────────────────────────────────── */
const useFavourites = () => {
  const [favs, setFavs] = useState(new Set());
  const toggle = (id) => setFavs(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
  return [favs, toggle];
};

/* ── Map a real product record onto the card's display shape ──────────────── */
const toCardProduct = (p) => ({
  id:    p.id,
  name:  p.name,
  rawPrice: Number(p.base_price) || 0,
  moq:   `MOQ ${Number(p.min_order_quantity || 1).toLocaleString('en-IN')}${p.moq_unit ? ` ${p.moq_unit}` : ''}`,
  brand: p.category_name || '',
  img:   resolveImageUrl(p.images?.[0]?.image_url) || null,
  badge: p.status === 'active' ? 'Verified' : null,
});

/* ── Category card ─────────────────────────────────────────────────────────── */
function CategoryCard({ cat, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 12px', borderRadius: 12,
        border: `1.5px solid ${hov ? T.saffron : '#EDE8DF'}`,
        background: hov ? T.cream : '#fff',
        cursor: 'pointer', transition: 'all .15s',
      }}
    >
      <div style={{ width: 56, height: 56, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
        <img src={cat.img} alt={cat.label} loading="lazy" decoding="async"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
      <span style={{ fontSize: 13.5, fontWeight: 600, color: T.ink, lineHeight: 1.3 }}>{cat.label}</span>
    </div>
  );
}

/* ── Promo banner ──────────────────────────────────────────────────────────── */
function PromoBanner({ b, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: 14, overflow: 'hidden', position: 'relative',
        background: b.bg, cursor: 'pointer',
        transform: hov ? 'translateY(-2px)' : 'none',
        boxShadow: hov ? '0 8px 28px rgba(0,0,0,.18)' : '0 2px 8px rgba(0,0,0,.10)',
        transition: 'all .2s', display: 'flex', height: 140,
      }}
    >
      <div style={{ flex: 1, padding: '20px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 700, color: '#fff', lineHeight: 1.25, marginBottom: 5 }}>{b.title}</div>
          <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,.65)', lineHeight: 1.5 }}>{b.sub}</div>
        </div>
        <button style={{
          alignSelf: 'flex-start', padding: '6px 14px', borderRadius: 6,
          border: '1.5px solid rgba(255,255,255,.5)', background: 'transparent',
          color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer',
          fontFamily: "'DM Sans', sans-serif",
        }}>{b.cta} →</button>
      </div>
      <div style={{ width: 140, position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
        <img src={b.img} alt={b.title} loading="lazy" decoding="async"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center',
            opacity: .55, transform: hov ? 'scale(1.06)' : 'scale(1)', transition: 'transform .4s ease' }} />
      </div>
    </div>
  );
}

/* ── Section heading with a "see all" CTA ─────────────────────────────────── */
function SectionHeading({ title, cta, onCta, bp }) {
  const [hov, setHov] = useState(false);
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16, gap: 12 }}>
      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: bp.isMobile ? 19 : 22, fontWeight: 700, color: T.ink, margin: 0 }}>
        {title}
      </h3>
      <button
        onClick={onCta}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: 5,
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, fontWeight: 700,
          color: hov ? T.saffron : T.muted, transition: 'color .15s', whiteSpace: 'nowrap',
        }}
      >
        {cta} <ArrowRight size={13} />
      </button>
    </div>
  );
}

/* ── Faire-style product card ──────────────────────────────────────────────── */
function ProductCard({ p, isFav, onFav, onAction }) {
  const [hov, setHov] = useState(false);
  const { fmt } = useCurrency();
  const badgeColor = p.badge === 'Trending' ? { bg: '#F3F0EB', color: '#1C1815' }
    : p.badge === 'Export'   ? { bg: '#EEF2FB', color: '#1B3175' }
    : p.badge === 'Verified' ? { bg: '#EAF5EF', color: T.emerald }
    : { bg: '#F3F0EB', color: '#1C1815' };

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Square image */}
      <div
        onClick={onAction}
        style={{
          position: 'relative', borderRadius: 12, overflow: 'hidden',
          aspectRatio: '1 / 1', background: '#F5F0E8', marginBottom: 10,
          border: `1px solid ${hov ? '#D4C9B8' : '#EDE8DF'}`, transition: 'border-color .15s',
        }}
      >
        {p.img ? (
          <img src={p.img} alt={p.name} loading="lazy" decoding="async"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block',
              transform: hov ? 'scale(1.04)' : 'scale(1)', transition: 'transform .35s ease' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>{p.emoji}</div>
        )}

        {/* Badge */}
        {p.badge && (
          <div style={{
            position: 'absolute', top: 8, left: 8,
            background: badgeColor.bg, color: badgeColor.color,
            fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4,
            letterSpacing: '.02em',
          }}>{p.badge}</div>
        )}

        {/* Heart */}
        <button
          aria-label={isFav ? 'Remove from wishlist' : 'Add to wishlist'}
          onClick={e => { e.stopPropagation(); onFav(); }}
          style={{
            position: 'absolute', top: 8, right: 8,
            width: 28, height: 28, borderRadius: '50%',
            background: 'rgba(255,255,255,.85)', backdropFilter: 'blur(4px)',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: hov || isFav ? 1 : 0, transition: 'opacity .15s',
          }}
        >
          <Heart size={13} fill={isFav ? '#C4773A' : 'none'} color={isFav ? '#C4773A' : '#7A7068'} />
        </button>

        {/* Quick add */}
        <button
          aria-label="Quick add to cart"
          onClick={e => { e.stopPropagation(); onAction(); }}
          style={{
            position: 'absolute', bottom: 8, right: 8,
            width: 28, height: 28, borderRadius: '50%',
            background: '#fff', border: '1.5px solid #D4C9B8',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: hov ? 1 : 0, transition: 'opacity .15s',
            boxShadow: '0 2px 8px rgba(0,0,0,.1)',
          }}
        >
          <Plus size={13} color={T.ink} />
        </button>
      </div>

      {/* Info */}
      <div onClick={onAction}>
        <div style={{ fontSize: 14, fontWeight: 700, color: T.ink, marginBottom: 1 }}>
          {p.rawPrice ? fmt(p.rawPrice) : 'Price on request'}
          <span style={{ fontSize: 11, fontWeight: 400, color: T.muted, marginLeft: 6 }}>{p.moq}</span>
        </div>
        <div style={{ fontSize: 12.5, color: T.ink, lineHeight: 1.35, marginBottom: 3 }}>{p.name}</div>
        <div style={{ fontSize: 11.5, color: T.saffron, fontWeight: 500 }}>{p.brand}</div>
        {p.rating && (
          <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>⭐ {p.rating}</div>
        )}
      </div>
    </div>
  );
}

/* ── BuyerDashboard ────────────────────────────────────────────────────────── */
export default function BuyerDashboard() {
  const { userName }  = useSelector((s) => s.auth);
  const navigate      = useNavigate();
  const bp            = useBreakpoint();
  const [favs, toggleFav] = useFavourites();
  const [visibleCount, setVisibleCount] = useState(12);

  const { data: rawProducts = [], loading: productsLoading, error: productsError } = useFetchData(() => api.getProducts());
  const { data: rawCategories = [] } = useFetchData(() => api.getCategories());

  const allProducts  = Array.isArray(rawProducts) ? rawProducts : [];
  const rootCats     = (Array.isArray(rawCategories) ? rawCategories : []).filter(c => !c.parent_id);
  const categoryCards = rootCats.slice(0, 8).map((c, i) => ({
    key: c.id, label: c.name, img: CATEGORY_IMAGES[i % CATEGORY_IMAGES.length],
  }));

  const products = allProducts.slice(0, visibleCount).map(toCardProduct);
  const hasMore  = allProducts.length > visibleCount;

  const goToCategory = (id) => navigate(`/categories?id=${encodeURIComponent(id)}`);

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: '#fff' }}>

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      <div style={{ padding: bp.isMobile ? '18px 14px' : bp.isTablet ? '22px 24px' : '28px 32px', maxWidth: 1400, margin: '0 auto' }}>

        {/* Welcome */}
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: bp.isMobile ? 22 : 26, fontWeight: 700, color: T.ink, marginBottom: 4 }}>
          Hi, {userName?.split(' ')[0] || userName}
        </h2>
        <p style={{ fontSize: 13, color: T.muted, marginBottom: 24 }}>
          Fresh picks from GST-verified Indian suppliers, curated for your business.
        </p>

        {/* Category cards */}
        {categoryCards.length > 0 && (
          <>
            <SectionHeading title="Shop by category" cta="Browse all" onCta={() => navigate('/categories')} bp={bp} />
            <div style={{ display: 'grid', gridTemplateColumns: bp.isMobile ? 'repeat(2, 1fr)' : bp.isTablet ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)', gap: 8, marginBottom: 32 }}>
              {categoryCards.map(cat => (
                <CategoryCard key={cat.key} cat={cat} onClick={() => goToCategory(cat.key)} />
              ))}
            </div>
          </>
        )}

        {/* Promo banners */}
        <div style={{ display: 'grid', gridTemplateColumns: bp.isMobile ? '1fr' : bp.isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }}>
          {BANNERS.map(b => (
            <PromoBanner key={b.title} b={b} onClick={() => navigate('/products')} />
          ))}
        </div>

        {/* Ideas for you */}
        <div style={{ marginBottom: 20 }}>
          <SectionHeading title="Ideas for you" cta="View all products" onCta={() => navigate('/products')} bp={bp} />

          {productsLoading ? (
            <Spinner />
          ) : productsError ? (
            <div style={{ padding: 32, textAlign: 'center', color: T.muted }}>
              <p style={{ marginBottom: 12 }}>Could not load product ideas.</p>
              <button onClick={() => window.location.reload()} style={{ padding: '8px 20px', borderRadius: 100, background: T.saffron, color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>Retry</button>
            </div>
          ) : products.length === 0 ? (
            <EmptyState icon={ShoppingBag} title="No products yet" desc="Check back soon — new supplier listings are added regularly." />
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(${bp.isMobile ? '140px' : '175px'}, 1fr))`, gap: bp.isMobile ? 12 : 20 }}>
                {products.map((p) => (
                  <ProductCard
                    key={p.id}
                    p={p}
                    isFav={favs.has(p.id)}
                    onFav={() => toggleFav(p.id)}
                    onAction={() => navigate(`/products/${p.id}`)}
                  />
                ))}
              </div>

              {/* Load more */}
              {hasMore && (
                <div style={{ textAlign: 'center', paddingTop: 24, paddingBottom: 16 }}>
                  <button onClick={() => setVisibleCount(v => v + 12)}
                    style={{ padding: '10px 32px', borderRadius: 8, border: `1.5px solid #E8E2D8`, background: '#fff', color: T.ink, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    Load more
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
