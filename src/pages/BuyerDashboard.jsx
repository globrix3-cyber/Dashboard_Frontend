import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { toggleLogin } from '../features/auth/authSlice';
import { Heart, Plus } from 'lucide-react';
import { CAT_DATA } from './landing/ShopByCategory';
import { IMG } from './landing/images';
import { useBreakpoint } from '../hooks/useBreakpoint';

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

/* ── Category card data ────────────────────────────────────────────────────── */
const CATEGORIES = [
  { label: 'Textiles',         img: IMG.jaipurTextiles,     key: 'Textiles' },
  { label: 'Wall Décor',       img: IMG.blueCeramicVases,   key: 'Wall Décor' },
  { label: 'Handicrafts',      img: IMG.wovenBaskets,       key: 'Handicrafts & Artisan' },
  { label: 'Kitchen & Dining', img: IMG.ceramicKitchenware, key: 'Kitchen & Dining' },
  { label: 'Soft Furnishings', img: IMG.fabricRolls,        key: 'Soft Furnishings' },
  { label: 'Jewelry',          img: IMG.indianJewelry,      key: 'Jewelry' },
  { label: 'Garden & Outdoor', img: IMG.vadodaraPottery,    key: 'Garden & Outdoor' },
  { label: 'Sustainable',      img: IMG.chennaBaskets,      key: 'Sustainable Décor' },
];

/* ── Promo banners ─────────────────────────────────────────────────────────── */
const BANNERS = [
  { title: 'New arrivals this week', sub: 'Fresh stock from 200+ verified suppliers', cta: 'Shop new', bg: '#2C1810', img: IMG.artisanWeaving },
  { title: 'Bulk order deals',       sub: 'Save up to 30% on orders above MOQ × 5',  cta: 'View deals', bg: '#1B3175', img: IMG.fabricRolls  },
  { title: 'Export-ready products',  sub: 'GST invoices, quality certs, fast dispatch', cta: 'Explore', bg: '#1A4A2E', img: IMG.indiaFactoryWorkers },
];

/* ── All products flat list ────────────────────────────────────────────────── */
const ALL_PRODUCTS = Object.values(CAT_DATA).flatMap(cat => cat.products);

/* ── Favourite state (local only) ─────────────────────────────────────────── */
const useFavourites = () => {
  const [favs, setFavs] = useState(new Set());
  const toggle = (name) => setFavs(prev => {
    const next = new Set(prev);
    next.has(name) ? next.delete(name) : next.add(name);
    return next;
  });
  return [favs, toggle];
};

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

/* ── Faire-style product card ──────────────────────────────────────────────── */
function ProductCard({ p, isFav, onFav, onAction }) {
  const [hov, setHov] = useState(false);
  const badgeColor = p.badge === 'Trending' ? { bg: '#F3F0EB', color: '#1C1815' }
    : p.badge === 'Export' ? { bg: '#EEF2FB', color: '#1B3175' }
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
          {p.price}
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
  const dispatch      = useDispatch();
  const bp            = useBreakpoint();
  const [favs, toggleFav] = useFavourites();
  const [visibleCount, setVisibleCount] = useState(12);

  const products = ALL_PRODUCTS.slice(0, visibleCount);
  const hasMore  = ALL_PRODUCTS.length > visibleCount;

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: '#fff' }}>

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      <div style={{ padding: bp.isMobile ? '18px 14px' : bp.isTablet ? '22px 24px' : '28px 32px', maxWidth: 1400, margin: '0 auto' }}>

        {/* Welcome */}
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: bp.isMobile ? 22 : 26, fontWeight: 700, color: T.ink, marginBottom: 16 }}>
          Welcome back, {userName}
        </h2>

        {/* Category cards */}
        <div style={{ display: 'grid', gridTemplateColumns: bp.isMobile ? 'repeat(2, 1fr)' : bp.isTablet ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)', gap: 8, marginBottom: 20 }}>
          {CATEGORIES.map(cat => (
            <CategoryCard key={cat.key} cat={cat} onClick={() => dispatch(toggleLogin(true))} />
          ))}
        </div>

        {/* Promo banners */}
        <div style={{ display: 'grid', gridTemplateColumns: bp.isMobile ? '1fr' : bp.isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }}>
          {BANNERS.map(b => (
            <PromoBanner key={b.title} b={b} onClick={() => dispatch(toggleLogin(true))} />
          ))}
        </div>

        {/* Ideas for you */}
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: bp.isMobile ? 19 : 22, fontWeight: 700, color: T.ink, marginBottom: 16 }}>
            Ideas for you
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(${bp.isMobile ? '140px' : '175px'}, 1fr))`, gap: bp.isMobile ? 12 : 20 }}>
            {products.map((p, i) => (
              <ProductCard
                key={`${p.name}-${i}`}
                p={p}
                isFav={favs.has(p.name)}
                onFav={() => toggleFav(p.name)}
                onAction={() => dispatch(toggleLogin(true))}
              />
            ))}
          </div>
        </div>

        {/* Load more */}
        {hasMore && (
          <div style={{ textAlign: 'center', paddingTop: 8, paddingBottom: 16 }}>
            <button onClick={() => setVisibleCount(v => v + 12)}
              style={{ padding: '10px 32px', borderRadius: 8, border: `1.5px solid #E8E2D8`, background: '#fff', color: T.ink, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              Load more
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
