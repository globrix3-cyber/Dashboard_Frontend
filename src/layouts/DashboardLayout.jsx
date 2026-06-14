import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, toggleLogin } from '../features/auth/authSlice';
import { disconnectSocket } from '../services/socket';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { api } from '../services/api';
import { LogOut, Search, Bell, ChevronDown, Globe, User, ShoppingBag, Tag } from 'lucide-react';

/* ── CSS variables injected once into :root ────────────────────────────────── */
const CSS_VARS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,600&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  :root {
    --cream:        #F0E8DA;
    --cream-mid:    #E8DFCF;
    --cream-deep:   #DEDAD0;
    --warm-white:   #FDF8F2;
    --saffron:      #C4773A;
    --saffron-lt:   #FDF1E8;
    --emerald:      #1A7A4A;
    --emerald-lt:   #EAF5EF;
    --navy:         #1B3175;
    --navy-lt:      #EEF2FB;
    --gold:         #B8730A;
    --gold-lt:      #FDF5E2;
    --ink:          #1C1815;
    --ink-soft:     #3D3731;
    --muted:        #7A7068;
    --border:       #D4C9B8;
    --border-soft:  #E6DED0;
  }
`;

/* ── Inject styles once ─────────────────────────────────────────────────────── */
if (!document.getElementById('globrix-vars')) {
  const s = document.createElement('style');
  s.id = 'globrix-vars';
  s.textContent = CSS_VARS;
  document.head.appendChild(s);
}

/* ── Nav link definitions — also power the Faire-style top bar for every role ── */
const buyerLinks = [
  { path: '/buyer-dashboard',           label: 'Overview'   },
  { path: '/buyer-dashboard/rfqs',       label: 'My RFQs'    },
  { path: '/buyer-dashboard/contracts',  label: 'Contracts'  },
  { path: '/buyer-dashboard/orders',     label: 'My Orders'  },
  { path: '/buyer-dashboard/messages',   label: 'Messages'   },
  { path: '/categories',                 label: 'Categories' },
  { path: '/products',                   label: 'Browse'     },
  { path: '/edit-profile',               label: 'Profile'    },
];

const supplierLinks = [
  { path: '/supplier-dashboard',           label: 'Overview'   },
  { path: '/supplier-dashboard/rfqs',       label: 'Open RFQs'  },
  { path: '/supplier-dashboard/quotes',     label: 'My Quotes'  },
  { path: '/supplier-dashboard/contracts',  label: 'Contracts'  },
  { path: '/supplier-dashboard/orders',     label: 'Orders'     },
  { path: '/supplier-dashboard/messages',   label: 'Messages'   },
  { path: '/categories',                    label: 'Categories' },
  { path: '/supplier-dashboard/catalog',    label: 'Catalog'    },
  { path: '/edit-profile',                  label: 'Profile'    },
];

const adminLinks = [
  { path: '/admin-dashboard',               label: 'Overview'      },
  { path: '/admin-dashboard/users',         label: 'Users'         },
  { path: '/admin-dashboard/companies',     label: 'Companies'     },
  { path: '/admin-dashboard/products',      label: 'Products'      },
  { path: '/admin-dashboard/verifications', label: 'Verifications' },
  { path: '/admin-dashboard/messages',      label: 'Messages'      },
  { path: '/admin-dashboard/reports',       label: 'Reports'       },
  { path: '/admin-dashboard/settings',      label: 'Settings'      },
  { path: '/edit-profile',                  label: 'Profile'       },
];

/* ── Per-role top bar configuration ───────────────────────────────────────────── */
const ROLE_CONFIG = {
  buyer: {
    links: buyerLinks, accent: '#C4773A', homePath: '/buyer-dashboard',
    searchPlaceholder: 'Search products or suppliers', cartPath: '/buyer-dashboard/orders',
  },
  supplier: {
    links: supplierLinks, accent: '#1A7A4A', homePath: '/supplier-dashboard',
    searchPlaceholder: 'Search RFQs, buyers, orders…', cartPath: '/supplier-dashboard/orders',
  },
  admin: {
    links: adminLinks, accent: '#1B3175', homePath: '/admin-dashboard',
    searchPlaceholder: 'Search users, companies, orders…', cartPath: '/admin-dashboard/products',
  },
  guest: {
    links: [], accent: '#C4773A', homePath: '/',
    searchPlaceholder: 'Search products or suppliers',
  },
};

/* ── Faire-style category browsing row — shared across every role's top bar ────
   Mirrors the live root categories (api.getCategories()) so a click filters
   /products to real, matching results instead of landing on an empty grid. ── */
const CATEGORY_NAV = [
  'Apparel & Textiles', 'Electronics & Electrical', 'Home & Garden', 'Food & Agriculture',
  'Industrial & Machinery', 'Beauty & Personal Care', 'Sports & Outdoors',
  'Packaging & Printing', 'Chemicals & Plastics', 'Handicrafts & Gifts',
];

/* ── Account dropdown menu ──────────────────────────────────────────────────── */
function AccountMenu({ userName, items, onNavigate, onLogout, onClose }) {
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 199 }} />
      <div style={{
        position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: 236,
        background: '#fff', borderRadius: 14, border: '1px solid #EDE8DF',
        boxShadow: '0 16px 48px rgba(28,24,21,.16)', overflow: 'hidden', zIndex: 200,
      }}>
        <div style={{ padding: '16px 18px', borderBottom: '1px solid #F2EDE4' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#1C1815', fontFamily: "'Cormorant Garamond', serif" }}>Hi, {userName?.split(' ')[0] || userName}</div>
        </div>
        <div style={{ padding: 6, maxHeight: 320, overflowY: 'auto' }}>
          {items.map(({ path, label }) => (
            <button
              key={path}
              onClick={() => onNavigate(path)}
              style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13.5, color: '#1C1815', fontFamily: "'DM Sans', sans-serif" }}
              onMouseEnter={e => { e.currentTarget.style.background = '#FBF6EF'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              {label}
            </button>
          ))}
        </div>
        <div style={{ borderTop: '1px solid #F2EDE4', padding: 6 }}>
          <button
            onClick={onLogout}
            style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13.5, fontWeight: 600, color: '#C0392B', fontFamily: "'DM Sans', sans-serif" }}
            onMouseEnter={e => { e.currentTarget.style.background = '#FDEEEC'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            <LogOut size={14} /> Log out
          </button>
        </div>
      </div>
    </>
  );
}

/* ── "All categories" dropdown — mirrors Faire's category-menu trigger ───────── */
function CategoryMenu({ onNavigate, onClose }) {
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 199 }} />
      <div style={{
        position: 'absolute', top: 'calc(100% + 10px)', left: 0, width: 240,
        background: '#fff', borderRadius: 14, border: '1px solid #EDE8DF',
        boxShadow: '0 16px 48px rgba(28,24,21,.16)', overflow: 'hidden', zIndex: 200,
      }}>
        <div style={{ padding: 6, maxHeight: 360, overflowY: 'auto' }}>
          {CATEGORY_NAV.map((label) => (
            <button
              key={label}
              onClick={() => onNavigate(label)}
              style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13.5, color: '#1C1815', fontFamily: "'DM Sans', sans-serif" }}
              onMouseEnter={e => { e.currentTarget.style.background = '#FBF6EF'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function highlightMatch(text, q) {
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx < 0) return text;
  return <>{text.slice(0, idx)}<strong style={{ color: '#1C1815', fontWeight: 700 }}>{text.slice(idx, idx + q.length)}</strong>{text.slice(idx + q.length)}</>;
}

/* ── Top bar — Faire-style header + category browsing row, shared by every role ── */
function TopBar({ role }) {
  const navigate                      = useNavigate();
  const dispatch                      = useDispatch();
  const bp                            = useBreakpoint();
  const { userName }                  = useSelector((s) => s.auth);
  const [menuOpen, setMenuOpen]       = useState(false);
  const [catMenuOpen, setCatMenuOpen] = useState(false);
  const [query, setQuery]             = useState('');
  const [showDrop, setShowDrop]       = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [catalog, setCatalog]         = useState(null);
  const loadingRef                    = useRef(false);

  const isGuest = role === 'guest';
  const { links, accent, homePath, searchPlaceholder, cartPath } = ROLE_CONFIG[role];
  const messagesPath = `${homePath}/messages`;
  const openLogin = () => dispatch(toggleLogin(true));
  // Jump straight to the filtered product grid — Faire-style — instead of an
  // intermediate "pick a category" menu page.
  const goToCategory = (label) => navigate(`/products?category=${encodeURIComponent(label)}`);

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logout());
    disconnectSocket();
    dispatch(toggleLogin(true));
    navigate('/');
  };

  const loadCatalog = async () => {
    if (catalog || loadingRef.current) return;
    loadingRef.current = true;
    try {
      const [prods, cats] = await Promise.all([api.getProducts(), api.getCategories()]);
      setCatalog({ products: Array.isArray(prods) ? prods : [], categories: Array.isArray(cats) ? cats : [] });
    } catch { setCatalog({ products: [], categories: [] }); }
  };

  useEffect(() => {
    if (!catalog || query.length < 2) { setSuggestions([]); return; }
    const q = query.toLowerCase();
    const ps = catalog.products.filter(p => p.name?.toLowerCase().includes(q)).slice(0, 5).map(p => ({ type: 'product', label: p.name, id: p.id }));
    const cs = catalog.categories.filter(c => c.name?.toLowerCase().includes(q)).slice(0, 2).map(c => ({ type: 'category', label: c.name }));
    setSuggestions([...ps, ...cs]);
  }, [query, catalog]);

  const submitSearch = () => {
    if (!query.trim()) return;
    setShowDrop(false);
    navigate(`/products?search=${encodeURIComponent(query.trim())}`);
  };

  const pickSuggestion = (s) => {
    setQuery(''); setShowDrop(false);
    if (s.type === 'product') navigate(`/products/${s.id}`);
    else navigate(`/products?category=${encodeURIComponent(s.label)}`);
  };

  return (
    <header style={{ flexShrink: 0, zIndex: 100, background: '#fff', borderBottom: '1px solid #EFE9DF' }}>

      {/* Row 1 — logo · all categories · search · language · setup guide · bell/account/cart */}
      <div style={{ height: 64, display: 'flex', alignItems: 'center', gap: bp.isMobile ? 10 : 16, padding: bp.isMobile ? '0 16px' : '0 32px' }}>
        <img
          src="/logo.png" alt="Globrixa" onClick={() => navigate(homePath)}
          style={{ height: bp.isMobile ? 32 : 40, objectFit: 'contain', cursor: 'pointer', flexShrink: 0, display: 'block' }}
        />

        {!bp.isMobile && (
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <button
              onClick={() => setCatMenuOpen(o => !o)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, height: 38, padding: '0 14px', borderRadius: 10, border: '1.5px solid #E8E2D8', background: catMenuOpen ? '#FDF8F2' : '#fff', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: '#1C1815', whiteSpace: 'nowrap' }}
            >
              All categories <ChevronDown size={14} color="#9A9088" />
            </button>
            {catMenuOpen && (
              <CategoryMenu
                onNavigate={(label) => { setCatMenuOpen(false); goToCategory(label); }}
                onClose={() => setCatMenuOpen(false)}
              />
            )}
          </div>
        )}

        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#B0A89E', pointerEvents: 'none', zIndex: 1 }} />
          <input
            value={query}
            onChange={e => { setQuery(e.target.value); setShowDrop(true); }}
            onFocus={() => {
              if (isGuest) { dispatch(toggleLogin(true)); return; }
              loadCatalog();
              if (query.length >= 2) setShowDrop(true);
            }}
            onBlur={() => setTimeout(() => setShowDrop(false), 150)}
            onKeyDown={e => { if (e.key === 'Enter') submitSearch(); if (e.key === 'Escape') { setShowDrop(false); setQuery(''); } }}
            placeholder={bp.isMobile ? 'Search…' : searchPlaceholder}
            style={{ width: '100%', height: 38, borderRadius: 100, border: `1.5px solid ${showDrop && query ? '#C4773A' : '#E8E2D8'}`, background: '#FDF8F2', padding: '0 16px 0 38px', fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#1C1815', outline: 'none', cursor: 'text', boxSizing: 'border-box', transition: 'border-color .15s' }}
          />

          {/* Autocomplete dropdown */}
          {showDrop && query.length >= 2 && (
            <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, background: '#fff', border: '1.5px solid #E8E2D8', borderRadius: 14, overflow: 'hidden', boxShadow: '0 8px 32px rgba(28,24,21,0.13)', zIndex: 1000 }}>
              {suggestions.map((s, i) => (
                <div key={i} onMouseDown={() => pickSuggestion(s)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', cursor: 'pointer', fontSize: 13, color: '#1C1815', borderBottom: '1px solid #F5F0EA', background: '#fff' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#FDF8F2'}
                  onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                >
                  {s.type === 'product'
                    ? <Search size={13} color="#9A9088" style={{ flexShrink: 0 }} />
                    : <Tag size={13} color="#C4773A" style={{ flexShrink: 0 }} />}
                  <span style={{ flex: 1 }}>{highlightMatch(s.label, query)}</span>
                  {s.type === 'category' && <span style={{ fontSize: 11, color: '#9A9088', background: '#F5F0EA', padding: '2px 8px', borderRadius: 100, flexShrink: 0 }}>Category</span>}
                </div>
              ))}
              <div onMouseDown={submitSearch}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#C4773A', background: '#FDF8F2' }}
                onMouseEnter={e => e.currentTarget.style.background = '#FDF1E8'}
                onMouseLeave={e => e.currentTarget.style.background = '#FDF8F2'}
              >
                <Search size={13} />
                Search all results for "{query}"
              </div>
            </div>
          )}
        </div>

        {/* Right-anchored cluster — language · setup guide · bell/account/cart */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: bp.isMobile ? 8 : 16, flexShrink: 0 }}>
          {!bp.isMobile && (
            <button
              style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px 4px', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: '#3D3731', flexShrink: 0 }}
            >
              <Globe size={15} /> EN-IN
            </button>
          )}

          {!bp.isMobile && !isGuest && (
            <button
              onClick={() => navigate('/edit-profile')}
              style={{ height: 38, padding: '0 18px', borderRadius: 100, border: '1.5px solid #E8E2D8', background: '#fff', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, fontWeight: 600, color: '#1C1815', whiteSpace: 'nowrap', flexShrink: 0 }}
            >
              Setup guide
            </button>
          )}

          {isGuest ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: bp.isMobile ? 8 : 10, flexShrink: 0 }}>
              <button
                onClick={openLogin}
                style={{ height: 38, padding: '0 16px', borderRadius: 100, border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: '#1C1815', whiteSpace: 'nowrap' }}
              >
                Log in
              </button>
              <button
                onClick={openLogin}
                style={{ height: 38, padding: '0 20px', borderRadius: 100, border: 'none', background: accent, color: '#fff', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' }}
              >
                Sign up
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: bp.isMobile ? 6 : 10, flexShrink: 0 }}>
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => navigate(messagesPath)} title="Notifications"
                  style={{ width: 38, height: 38, borderRadius: 10, border: '1.5px solid #E8E2D8', background: '#FDF8F2', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <Bell size={15} color="#7A7068" />
                </button>
                <div style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, borderRadius: '50%', background: '#DC2626', border: '1.5px solid #fff' }} />
              </div>

              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setMenuOpen(o => !o)} title="Account"
                  style={{ width: 38, height: 38, borderRadius: 10, border: '1.5px solid #E8E2D8', background: '#FDF8F2', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <User size={16} color="#7A7068" />
                </button>
                {menuOpen && (
                  <AccountMenu
                    userName={userName}
                    items={links}
                    onClose={() => setMenuOpen(false)}
                    onNavigate={(p) => { setMenuOpen(false); navigate(p); }}
                    onLogout={handleLogout}
                  />
                )}
              </div>

              <button
                onClick={() => navigate(cartPath)} title="Orders"
                style={{ width: 38, height: 38, borderRadius: 10, border: '1.5px solid #E8E2D8', background: '#FDF8F2', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <ShoppingBag size={16} color="#7A7068" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Row 2 — Faire-style category browsing row (shared B2B nav now lives in the account menu) */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: bp.isMobile ? 18 : 28, height: 44, padding: bp.isMobile ? '0 16px' : '0 32px', overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {CATEGORY_NAV.map((label) => (
          <button
            key={label}
            onClick={() => goToCategory(label)}
            style={{
              height: '100%', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap',
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, fontWeight: 500, color: '#7A7068',
              transition: 'color .15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = accent; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#7A7068'; }}
          >
            {label}
          </button>
        ))}
      </nav>
    </header>
  );
}

/* ── DashboardLayout ────────────────────────────────────────────────────────── */
export default function DashboardLayout({ children }) {
  const { userRole } = useSelector((s) => s.auth);
  const role = userRole === 'supplier' ? 'supplier'
             : userRole === 'admin'    ? 'admin'
             : userRole === 'buyer'    ? 'buyer'
             : 'guest';

  /* Every role — including signed-out guests browsing /products & /categories —
     gets the same Faire-style top bar (logo · search · account, then a category
     row); guests see "Log in / Sign up" instead of the account/cart cluster.
     Clipped-viewport model: bar stays put, <main> scrolls internally, so pages
     with their own internally-scrolling panels (e.g. Messages) keep working. */
  return (
    <div style={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <TopBar role={role} />
      <main style={{ flex: 1, overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}