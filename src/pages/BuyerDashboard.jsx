import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toggleLogin } from '../features/auth/authSlice';
import { Bell, Search } from 'lucide-react';
import { CAT_DATA } from './landing/ShopByCategory';

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

/* ── Category tabs config ──────────────────────────────────────────────────── */
const TABS = [
  { label: 'All',              key: null },
  { label: 'Textiles',         key: 'Textiles' },
  { label: 'Wall Décor',       key: 'Wall Décor' },
  { label: 'Soft Furnishings', key: 'Soft Furnishings' },
  { label: 'Handicrafts',      key: 'Handicrafts & Artisan' },
  { label: 'Kitchen & Dining', key: 'Kitchen & Dining' },
  { label: 'Jewelry',          key: 'Jewelry' },
  { label: 'Sustainable',      key: 'Sustainable Décor' },
];

/* ── Badge colours ─────────────────────────────────────────────────────────── */
const BADGE_STYLE = {
  'New':      { bg: '#C4773A',        color: '#fff' },
  'Export':   { bg: '#1B3175',        color: '#fff' },
  'Trending': { bg: '#1A7A4A',        color: '#fff' },
  'default':  { bg: 'rgba(0,0,0,.4)', color: '#fff' },
};

/* ── Derived product list ──────────────────────────────────────────────────── */
function getProducts(activeKey) {
  if (!activeKey) {
    // 2 products from each of the first 8 categories = 16 products total
    return Object.values(CAT_DATA).slice(0, 8).flatMap(cat => cat.products.slice(0, 2));
  }
  return CAT_DATA[activeKey]?.products ?? [];
}

/* ── Product card ──────────────────────────────────────────────────────────── */
function ProductCard({ p, onAction }) {
  const [hov, setHov] = useState(false);
  const badge = p.badge ? (BADGE_STYLE[p.badge] ?? BADGE_STYLE.default) : null;

  return (
    <div
      onClick={onAction}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: 14,
        border: `1.5px solid ${hov ? T.saffron : '#EDE8DF'}`,
        overflow: 'hidden', background: '#fff', cursor: 'pointer',
        transition: 'border-color .18s, transform .18s, box-shadow .18s',
        transform: hov ? 'translateY(-3px)' : 'none',
        boxShadow: hov ? '0 8px 28px rgba(196,119,58,.13)' : 'none',
      }}
    >
      {/* Image */}
      <div style={{ height: 140, position: 'relative', overflow: 'hidden', background: '#F0E8DA' }}>
        {p.img ? (
          <img
            src={p.img} alt={p.name} loading="lazy" decoding="async"
            style={{
              width: '100%', height: '100%', objectFit: 'cover', display: 'block',
              transform: hov ? 'scale(1.05)' : 'scale(1)', transition: 'transform .4s ease',
            }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>
            {p.emoji}
          </div>
        )}
        {badge && (
          <div style={{
            position: 'absolute', top: 10, left: 10,
            background: badge.bg, color: badge.color,
            fontSize: 9, fontWeight: 700, padding: '3px 8px',
            borderRadius: 100, letterSpacing: '.06em',
          }}>{p.badge}</div>
        )}
        {p.rating && (
          <div style={{
            position: 'absolute', top: 10, right: 10,
            background: 'rgba(0,0,0,.45)', backdropFilter: 'blur(6px)',
            borderRadius: 20, padding: '2px 7px', fontSize: 10, color: '#fff', fontWeight: 600,
          }}>{p.rating}</div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '10px 12px 13px' }}>
        <div style={{ fontSize: 9.5, fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 3 }}>
          {p.brand}
        </div>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: T.ink, lineHeight: 1.3, marginBottom: 8 }}>
          {p.name}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 700, color: T.saffron }}>
            {p.price}
          </span>
          <span style={{ fontSize: 10, color: T.muted, background: T.cream, borderRadius: 100, padding: '2px 8px', fontWeight: 600 }}>
            {p.moq}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── BuyerDashboard ────────────────────────────────────────────────────────── */
export default function BuyerDashboard() {
  const { userName }  = useSelector((s) => s.auth);
  const dispatch      = useDispatch();
  const navigate      = useNavigate();
  const [activeTab, setActiveTab]       = useState(null);
  const [visibleCount, setVisibleCount] = useState(8);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const allProducts = getProducts(activeTab);
  const products    = allProducts.slice(0, visibleCount);
  const hasMore     = allProducts.length > visibleCount;

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", minHeight: '100vh', background: '#fff' }}>

      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <div style={{
        height: 58, display: 'flex', alignItems: 'center', gap: 16,
        padding: '0 32px', borderBottom: `1px solid ${T.border}`,
        background: '#fff', position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 18, fontWeight: 700, color: T.ink, whiteSpace: 'nowrap', flexShrink: 0,
        }}>
          {greeting()}, {userName} 👋
        </div>

        <div style={{ flex: 1, maxWidth: 400, position: 'relative' }}>
          <Search size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#B0A89E', pointerEvents: 'none' }} />
          <input
            readOnly
            onClick={() => dispatch(toggleLogin(true))}
            placeholder="Search products, suppliers…"
            style={{
              width: '100%', height: 34, borderRadius: 100,
              border: `1.5px solid #E8E2D8`, background: T.cream,
              padding: '0 14px 0 32px',
              fontFamily: "'DM Sans', sans-serif", fontSize: 12.5,
              color: T.ink, outline: 'none', cursor: 'pointer',
            }}
          />
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => navigate('/buyer-dashboard/messages')}
              style={{
                width: 34, height: 34, borderRadius: 9,
                border: `1.5px solid #E8E2D8`, background: T.cream,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <Bell size={14} color={T.muted} />
            </button>
            <div style={{
              position: 'absolute', top: -2, right: -2,
              width: 8, height: 8, borderRadius: '50%',
              background: '#DC2626', border: '1.5px solid #fff',
            }} />
          </div>

          <div
            style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer' }}
            onClick={() => navigate('/edit-profile')}
          >
            <span style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>{userName}</span>
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: `linear-gradient(135deg, ${T.saffron}, #A8622E)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, color: '#fff',
            }}>{userName?.[0]?.toUpperCase()}</div>
          </div>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      <div style={{ padding: '28px 32px' }}>

        {/* Section heading + actions */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: T.saffron, marginBottom: 6 }}>
              New for you
            </div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 28, fontWeight: 700, color: T.ink, lineHeight: 1.1,
            }}>
              5,000+ verified Indian suppliers
            </h2>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => navigate('/buyer-dashboard/rfqs/new')}
              style={{
                padding: '9px 18px', borderRadius: 8, border: 'none',
                background: T.ink, color: '#fff',
                fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
                cursor: 'pointer',
              }}
            >+ New RFQ</button>
            <button
              onClick={() => navigate('/products')}
              style={{
                padding: '9px 18px', borderRadius: 8,
                border: `1.5px solid #E8E2D8`, background: T.cream, color: T.ink,
                fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
                cursor: 'pointer',
              }}
            >Browse all</button>
          </div>
        </div>

        {/* Category tabs */}
        <div style={{
          display: 'flex', gap: 7, marginBottom: 24,
          overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 2,
        }}>
          {TABS.map(tab => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.label}
                onClick={() => { setActiveTab(tab.key); setVisibleCount(8); }}
                style={{
                  padding: '7px 16px', borderRadius: 100,
                  border: isActive ? 'none' : `1px solid #E8E2D8`,
                  background: isActive ? T.ink : T.cream,
                  color: isActive ? '#fff' : T.muted,
                  fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, fontWeight: 600,
                  cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
                  transition: 'background .15s, color .15s',
                  outline: 'none',
                }}
              >{tab.label}</button>
            );
          })}
        </div>

        {/* Product grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 16,
          marginBottom: 32,
        }}>
          {products.map((p, i) => (
            <ProductCard
              key={`${p.name}-${i}`}
              p={p}
              onAction={() => dispatch(toggleLogin(true))}
            />
          ))}
        </div>

        {/* Load more */}
        {hasMore && (
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => setVisibleCount(v => v + 8)}
              style={{
                padding: '10px 32px', borderRadius: 8,
                border: `1.5px solid #E8E2D8`, background: '#fff', color: T.ink,
                fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
                cursor: 'pointer',
              }}
            >Load more products</button>
          </div>
        )}
      </div>
    </div>
  );
}
