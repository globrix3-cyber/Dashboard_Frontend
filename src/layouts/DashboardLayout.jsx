import { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, toggleLogin } from '../features/auth/authSlice';
import { disconnectSocket } from '../services/socket';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { api } from '../services/api';
import { LogOut, Search, Bell, User, Tag } from 'lucide-react';
import LandingNavbar from '../pages/landing/LandingNavbar';
import LandingFooter from '../pages/landing/LandingFooter';
import { CATEGORY_LINKS, useCategoryCounts, hasProducts } from '../pages/landing/categoryLinks';

/* ── CSS variables injected once into :root ────────────────────────────────── */
const CSS_VARS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,600&family=DM+Sans:wght@400;500;600&display=swap');

  :root {
    --cream:        #E3D5C1;
    --cream-mid:    #E3D5C1;
    --cream-deep:   #E3D5C1;
    --warm-white:   #FDF9F1;
    --saffron:      #C8792C;
    --saffron-lt:   #FDF9F1;
    --emerald:      #1A7A4A;
    --emerald-lt:   #EAF5EF;
    --navy:         #5B4632;
    --navy-lt:      #F0DCC0;
    --gold:         #C8792C;
    --gold-lt:      #FDF9F1;
    --ink:          #5B4632;
    --ink-soft:     #2B2016;
    --muted:        #79634E;
    --border:       #E3D5C1;
    --border-soft:  #E3D5C1;
  }
`;

/* ── Inject styles once ─────────────────────────────────────────────────────── */
if (!document.getElementById('globrix-vars')) {
  const s = document.createElement('style');
  s.id = 'globrix-vars';
  s.textContent = CSS_VARS;
  document.head.appendChild(s);
}

/* ── Palette & type (client brief: Cormorant wordmark, DM Sans UI, Burnt Amber actions) ── */
const MOCHA     = '#5B4632';
const CREAM     = '#FDF9F1';
const CHAMPAGNE = '#F4D9A0';
const AMBER     = '#C8792C';
const DEEP      = '#2B2016';
const MUTED     = '#79634E';
const WORDMARK  = "'Cormorant Garamond', Georgia, serif";
const SERIF     = "'Canela', 'Cormorant Garamond', Georgia, serif";

/* ── Account menu links per role (client: buyers get Wishlist; My Orders / My Cart removed) ── */
const buyerLinks = [
  { path: '/buyer-dashboard',           label: 'Overview'   },
  { path: '/buyer-dashboard/rfqs',      label: 'My RFQs'    },
  { path: '/buyer-dashboard/contracts', label: 'Contracts'  },
  { path: '/buyer-dashboard/wishlist',  label: 'Wishlist'   },
  { path: '/buyer-dashboard/messages',  label: 'Messages'   },
  { path: '/categories',                label: 'Categories' },
  { path: '/products',                  label: 'Browse'     },
  { path: '/edit-profile',              label: 'Profile'    },
];

const supplierLinks = [
  { path: '/supplier-dashboard',           label: 'Overview'   },
  { path: '/supplier-dashboard/rfqs',      label: 'Open RFQs'  },
  { path: '/supplier-dashboard/quotes',    label: 'My Quotes'  },
  { path: '/supplier-dashboard/contracts', label: 'Contracts'  },
  { path: '/supplier-dashboard/orders',    label: 'Orders'     },
  { path: '/supplier-dashboard/messages',  label: 'Messages'   },
  { path: '/categories',                   label: 'Categories' },
  { path: '/supplier-dashboard/catalog',   label: 'Catalog'    },
  { path: '/edit-profile',                 label: 'Profile'    },
];

const adminLinks = [
  { path: '/admin-dashboard',               label: 'Overview'        },
  { path: '/admin-dashboard/users',         label: 'Users'           },
  { path: '/admin-dashboard/companies',     label: 'Companies'       },
  { path: '/admin-dashboard/verifications', label: 'Verifications'   },
  { path: '/admin-dashboard/messages',      label: 'Messages'        },
  { path: '/admin-dashboard/reports',       label: 'Reports'         },
  { path: '/products',                      label: 'Browse Products' },
];

const ROLE_CONFIG = {
  buyer:    { links: buyerLinks,    homePath: '/buyer-dashboard',    searchPlaceholder: 'Search products, materials and collections', setupGuide: true  },
  supplier: { links: supplierLinks, homePath: '/supplier-dashboard', searchPlaceholder: 'Search RFQs, buyers, orders…',                setupGuide: true  },
  admin:    { links: adminLinks,    homePath: '/admin-dashboard',    searchPlaceholder: 'Search users, companies, orders…',             setupGuide: false },
};

const reset = { background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", color: MOCHA };
const outlinedBtn = { ...reset, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', border: '1px solid rgba(91,70,50,.396)', borderRadius: 3, fontSize: 14, fontWeight: 500, letterSpacing: '.1px', whiteSpace: 'nowrap', flexShrink: 0 };
const iconBtn = { ...outlinedBtn, width: 46, height: 46, padding: 0 };
const getQuoteBtn = { ...reset, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 12, boxSizing: 'border-box', height: 48, padding: '0 28px', background: MOCHA, border: `1px solid ${MOCHA}`, borderRadius: 3, color: CREAM, fontSize: 14.5, fontWeight: 600, letterSpacing: '1.2px', textTransform: 'uppercase', whiteSpace: 'nowrap', flexShrink: 0, transition: 'background .15s, color .15s, border-color .15s' };
// Client Canva p26: action buttons are mocha, turning champagne gold on hover.
const quoteHoverOn  = e => { const s = e.currentTarget.style; s.background = CHAMPAGNE; s.borderColor = CHAMPAGNE; s.color = MOCHA; };
const quoteHoverOff = e => { const s = e.currentTarget.style; s.background = MOCHA; s.borderColor = MOCHA; s.color = CREAM; };
const focusCss = `
.gx-app-search::placeholder{color:rgba(91,70,50,.74);opacity:1}
.gx-app-hdr a:focus-visible,.gx-app-hdr button:focus-visible,.gx-app-hdr input:focus-visible{outline:2px solid ${AMBER};outline-offset:2px}
.gx-app-menu button:hover{background:#F5F0E7}
`;

function Arrow({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/* ── Account dropdown menu ──────────────────────────────────────────────────── */
function AccountMenu({ userName, items, onNavigate, onLogout, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 199 }} />
      <div className="gx-app-menu" role="menu" style={{
        position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: 248,
        background: CREAM, borderRadius: 4, border: '1px solid #E3D5C1',
        boxShadow: '0 16px 40px rgba(43,32,22,.14)', overflow: 'hidden', zIndex: 200,
      }}>
        <div style={{ padding: '16px 18px 14px', borderBottom: '1px solid #E3D5C1' }}>
          <div style={{ fontSize: 11, letterSpacing: '1.6px', textTransform: 'uppercase', color: MUTED, fontWeight: 500 }}>Your account</div>
          <div style={{ marginTop: 4, fontFamily: SERIF, fontSize: 22, fontWeight: 300, letterSpacing: '-.3px', color: MOCHA, lineHeight: 1.2 }}>Hi, {userName?.split(' ')[0] || userName || 'there'}</div>
        </div>
        <div style={{ padding: 6, maxHeight: 340, overflowY: 'auto' }}>
          {items.map(({ path, label }) => (
            <button className="gx-btn-gold" key={path} role="menuitem" onClick={() => onNavigate(path)}
              style={{ ...reset, display: 'block', width: '100%', textAlign: 'left', padding: '11px 12px', borderRadius: 3, fontSize: 14, fontWeight: 400 }}>
              {label}
            </button>
          ))}
        </div>
        <div style={{ borderTop: '1px solid #E3D5C1', padding: 6 }}>
          <button role="menuitem" onClick={onLogout}
            style={{ ...reset, display: 'flex', alignItems: 'center', gap: 8, width: '100%', textAlign: 'left', padding: '11px 12px', borderRadius: 3, fontSize: 14, fontWeight: 500, color: '#9B2C2C' }}>
            <LogOut size={15} /> Log out
          </button>
        </div>
      </div>
    </>
  );
}

function highlightMatch(text, q) {
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx < 0) return text;
  return <>{text.slice(0, idx)}<strong style={{ color: MOCHA, fontWeight: 600 }}>{text.slice(idx, idx + q.length)}</strong>{text.slice(idx + q.length)}</>;
}

/* ── Signed-in header — same size and design language as the homepage header ── */
function TopBar({ role }) {
  const navigate                      = useNavigate();
  const location                      = useLocation();
  const dispatch                      = useDispatch();
  const bp                            = useBreakpoint();
  const counts                        = useCategoryCounts();
  const { userName }                  = useSelector((s) => s.auth);
  const [menuOpen, setMenuOpen]       = useState(false);
  const [navOpen, setNavOpen]         = useState(false);
  const [query, setQuery]             = useState('');
  const [showDrop, setShowDrop]       = useState(false);
  const [catalog, setCatalog]         = useState(null);
  const loadingRef                    = useRef(false);

  const { links, homePath, searchPlaceholder, setupGuide } = ROLE_CONFIG[role];
  const messagesPath = `${homePath}/messages`;
  const isBuyer = role === 'buyer';
  const navItems = CATEGORY_LINKS.filter(c => hasProducts(counts, c.root));
  const isPhone   = bp.width <= 900;
  const isCompact = bp.width > 900 && bp.width <= 1150;

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

  const suggestions = useMemo(() => {
    if (!catalog || query.length < 2) return [];
    const q = query.toLowerCase();
    const ps = catalog.products.filter(p => p.name?.toLowerCase().includes(q)).slice(0, 5).map(p => ({ type: 'product', label: p.name, id: p.id }));
    const cs = catalog.categories.filter(c => c.name?.toLowerCase().includes(q)).slice(0, 2).map(c => ({ type: 'category', label: c.name }));
    return [...ps, ...cs];
  }, [query, catalog]);

  // Leaving the phone layout closes the phone nav; Escape closes it too.
  if (!isPhone && navOpen) setNavOpen(false);
  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setNavOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navOpen]);

  const submitSearch = (e) => {
    e?.preventDefault();
    setShowDrop(false);
    const q = query.trim();
    navigate(q ? `/products?search=${encodeURIComponent(q)}` : '/products');
  };

  const pickSuggestion = (s) => {
    setQuery(''); setShowDrop(false);
    if (s.type === 'product') navigate(`/products/${s.id}`);
    else navigate(`/products?category=${encodeURIComponent(s.label)}`);
  };

  const goQuote = () => { setNavOpen(false); navigate('/buyer-dashboard/rfqs/new'); };

  const wrap = { maxWidth: 1600, margin: '0 auto', boxSizing: 'border-box', paddingLeft: isPhone ? '5%' : '4.5%', paddingRight: isPhone ? '5%' : '4.5%' };
  const searchBox = { display: 'flex', alignItems: 'center', boxSizing: 'border-box', background: '#F5F0E7', border: `1px solid ${showDrop && query ? AMBER : 'rgba(91,70,50,.145)'}`, borderRadius: 4, gap: 12, transition: 'border-color .15s' };
  const wordmark = (
    <Link to={homePath} aria-label="Globrixa home"
      style={{ fontFamily: WORDMARK, fontSize: isPhone ? (bp.width <= 380 ? 24 : 27) : isCompact ? 28 : 31, fontWeight: 600, letterSpacing: isPhone ? 3.5 : 4.5, lineHeight: 1.2, color: MOCHA, textDecoration: 'none', whiteSpace: 'nowrap', textTransform: 'uppercase' }}>
      Globrixa
    </Link>
  );

  const search = (
    <form role="search" onSubmit={submitSearch} style={{ position: 'relative', flex: 1, minWidth: 0, maxWidth: isPhone ? 'none' : 640 }}>
      <div style={{ ...searchBox, height: isPhone ? 46 : 50, padding: '0 8px 0 16px' }}>
        <Search size={18} color={MOCHA} aria-hidden="true" style={{ flexShrink: 0 }} />
        <input
          value={query}
          aria-label="Search"
          className="gx-app-search"
          onChange={e => { setQuery(e.target.value); setShowDrop(true); }}
          onFocus={() => { loadCatalog(); if (query.length >= 2) setShowDrop(true); }}
          onBlur={() => setTimeout(() => setShowDrop(false), 150)}
          onKeyDown={e => { if (e.key === 'Escape') { setShowDrop(false); setQuery(''); } }}
          placeholder={searchPlaceholder}
          style={{ flex: 1, minWidth: 0, height: '100%', border: 'none', outline: 'none', background: 'transparent', padding: 0, fontFamily: "'DM Sans', sans-serif", fontSize: isPhone ? 16 : 14.5, color: MOCHA }}
        />
        <button type="submit" aria-label="Submit search" style={{ ...reset, width: 34, height: 34, borderRadius: 3, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          <Arrow />
        </button>
      </div>

      {showDrop && query.length >= 2 && (
        <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, background: CREAM, border: '1px solid #E3D5C1', borderRadius: 4, overflow: 'hidden', boxShadow: '0 12px 32px rgba(43,32,22,0.13)', zIndex: 1000 }}>
          {suggestions.map((s, i) => (
            <div key={i} onMouseDown={() => pickSuggestion(s)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', cursor: 'pointer', fontSize: 14, color: MOCHA, borderBottom: '1px solid #E3D5C1', background: CREAM }}
              onMouseEnter={e => { e.currentTarget.style.background = '#F5F0E7'; }}
              onMouseLeave={e => { e.currentTarget.style.background = CREAM; }}
            >
              {s.type === 'product'
                ? <Search size={14} color={MUTED} style={{ flexShrink: 0 }} />
                : <Tag size={14} color={AMBER} style={{ flexShrink: 0 }} />}
              <span style={{ flex: 1 }}>{highlightMatch(s.label, query)}</span>
              {s.type === 'category' && <span style={{ fontSize: 11, color: MUTED, letterSpacing: '1px', textTransform: 'uppercase', flexShrink: 0 }}>Category</span>}
            </div>
          ))}
          <div onMouseDown={submitSearch}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: MOCHA, background: CREAM }}
            onMouseEnter={e => { e.currentTarget.style.background = '#F5F0E7'; }}
            onMouseLeave={e => { e.currentTarget.style.background = CREAM; }}
          >
            <Search size={14} />
            Search all results for "{query}"
          </div>
        </div>
      )}
    </form>
  );

  const bell = (
    <div style={{ position: 'relative' }}>
      <button className="gx-btn-gold" type="button" onClick={() => navigate(messagesPath)} aria-label="Notifications and messages" title="Notifications" style={{ ...iconBtn, width: isPhone ? 40 : 46, height: isPhone ? 40 : 46 }}>
        <Bell size={isPhone ? 17 : 19} color={MOCHA} />
      </button>
      <span aria-hidden="true" style={{ position: 'absolute', top: 7, right: 8, width: 7, height: 7, borderRadius: '50%', background: AMBER }} />
    </div>
  );
  const account = (
    <div style={{ position: 'relative' }}>
      <button className="gx-btn-gold" type="button" onClick={() => setMenuOpen(o => !o)} aria-label="Account menu" aria-haspopup="menu" aria-expanded={menuOpen} title="Account"
        style={{ ...iconBtn, width: isPhone ? 40 : 46, height: isPhone ? 40 : 46, background: menuOpen ? '#F5F0E7' : 'transparent' }}>
        <User size={isPhone ? 17 : 19} color={MOCHA} />
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
  );
  const quoteBtn = isBuyer && (
    <button type="button" onClick={goQuote} style={getQuoteBtn}
      onMouseEnter={quoteHoverOn} onMouseLeave={quoteHoverOff} onFocus={quoteHoverOn} onBlur={quoteHoverOff}>
      Get quote <Arrow size={17} />
    </button>
  );
  const onHome = location.pathname === homePath;

  const announcement = (
    <div style={{ background: MOCHA, color: CHAMPAGNE, fontSize: isPhone ? 11 : 12, fontWeight: 400, letterSpacing: '.25px', lineHeight: 1.5 }}>
      <div style={{ ...wrap, paddingTop: 9, paddingBottom: 9, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
        <span style={{ whiteSpace: 'nowrap' }}>Rooted in India. Global perspective.</span>
        {!isPhone && <Link to="/contact" style={{ color: CHAMPAGNE, textDecoration: 'none', whiteSpace: 'nowrap' }}>Need help? Talk to our team</Link>}
      </div>
    </div>
  );

  /* ── Desktop / tablet (901px and up) ── */
  if (!isPhone) {
    const navItem = { display: 'flex', alignItems: 'center', height: 52, fontSize: isCompact ? 13 : 14, fontWeight: 400, letterSpacing: '.05px', color: MOCHA, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 };
    return (
      <header className="gx-app-hdr" style={{ flexShrink: 0, position: 'relative', zIndex: 100, background: CREAM, borderBottom: '1px solid rgba(91,70,50,.133)' }}>
        <style>{focusCss}</style>
        {announcement}
        <div style={{ ...wrap, display: 'flex', alignItems: 'center', gap: isCompact ? 20 : 32, minHeight: isCompact ? 96 : 108, paddingTop: 24, paddingBottom: 24 }}>
          <div style={{ flexShrink: 0 }}>{wordmark}</div>
          {search}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: isCompact ? 10 : 14, flexShrink: 0 }}>
            {setupGuide && !isCompact && (
              <button className="gx-btn-gold" type="button" onClick={() => navigate('/contact')} style={{ ...outlinedBtn, height: 46, padding: '0 18px' }}>Contact us</button>
            )}
            {bell}
            {account}
            {quoteBtn}
          </div>
        </div>
        <nav aria-label="Categories" style={{ borderTop: '1px solid rgba(91,70,50,.082)' }}>
          <div style={{ ...wrap, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: isCompact ? 24 : 32, minWidth: 0, overflowX: 'auto', scrollbarWidth: 'none' }}>
              <Link to={homePath} aria-current={onHome ? 'page' : undefined} style={{ ...navItem, boxShadow: onHome ? `inset 0 -2px 0 ${MOCHA}` : 'none' }}>Discover</Link>
              {navItems.map(item => <Link key={item.label} to={item.to} style={navItem}>{item.label}</Link>)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 28, flexShrink: 0 }}>
              <Link to="/products" style={navItem}>All products</Link>
              <Link to="/blog" style={navItem}>Blog</Link>
            </div>
          </div>
        </nav>
      </header>
    );
  }

  /* ── Phone / small tablet (900px and below) ── */
  const menuLink = { display: 'flex', alignItems: 'center', height: 48, fontSize: 15, fontWeight: 400, color: MOCHA, textDecoration: 'none' };
  return (
    <header className="gx-app-hdr" style={{ flexShrink: 0, position: 'relative', zIndex: 100, background: CREAM, borderBottom: '1px solid rgba(91,70,50,.133)' }}>
      <style>{focusCss}</style>
      {announcement}
      <div style={{ padding: '14px 5% 16px', boxSizing: 'border-box' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '40px minmax(0,1fr) auto', gap: 10, alignItems: 'center' }}>
          <button className="gx-btn-gold" type="button" onClick={() => setNavOpen(o => !o)} aria-expanded={navOpen} aria-controls="gx-app-mobile-nav"
            aria-label={navOpen ? 'Close navigation' : 'Open navigation'}
            style={{ ...iconBtn, width: 40, height: 40, border: '1px solid rgba(91,70,50,.2)' }}>
            <svg width="15" height="11" viewBox="0 0 13 9" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
              <path d="M0 .6h13M0 4.5h13M0 8.4h13" />
            </svg>
          </button>
          <div style={{ justifySelf: 'center' }}>{wordmark}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {bell}
            {account}
          </div>
        </div>
        <div style={{ marginTop: 14, display: 'flex' }}>{search}</div>
        {isBuyer && (
          <button type="button" onClick={goQuote} onMouseEnter={quoteHoverOn} onMouseLeave={quoteHoverOff} style={{ ...getQuoteBtn, width: '100%', marginTop: 12, height: 46 }}>
            Get quote <Arrow size={17} />
          </button>
        )}
      </div>
      {navOpen && (
        <div id="gx-app-mobile-nav" style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: CREAM, borderBottom: '1px solid rgba(91,70,50,.15)', boxShadow: '0 18px 28px rgba(91,70,50,.12)', padding: '12px 5% 20px', boxSizing: 'border-box', maxHeight: 'calc(100dvh - 220px)', overflowY: 'auto', zIndex: 150 }}>
          <nav aria-label="Main navigation">
            <div style={{ display: 'grid', gridTemplateColumns: bp.width <= 380 ? '1fr' : '1fr 1fr', columnGap: 24 }}>
              <Link to={homePath} onClick={() => setNavOpen(false)} style={{ ...menuLink, fontWeight: 600 }}>Discover</Link>
              {navItems.map(item => <Link key={item.label} to={item.to} onClick={() => setNavOpen(false)} style={menuLink}>{item.label}</Link>)}
              <Link to="/products" onClick={() => setNavOpen(false)} style={menuLink}>All products</Link>
              <Link to="/blog" onClick={() => setNavOpen(false)} style={menuLink}>Blog</Link>
              {setupGuide && <Link to="/contact" onClick={() => setNavOpen(false)} style={menuLink}>Contact us</Link>}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

/* ── DashboardLayout ────────────────────────────────────────────────────────── */
export default function DashboardLayout({ children, fullBleed = false }) {
  const { userRole } = useSelector((s) => s.auth);
  const bp = useBreakpoint();
  const role = userRole === 'supplier' ? 'supplier'
             : userRole === 'admin'    ? 'admin'
             : userRole === 'buyer'    ? 'buyer'
             : 'guest';

  const hPad = bp.isMobile ? 16 : 32;

  return (
    <div style={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: CREAM }}>
      {/* Guests browsing the catalogue see exactly the homepage header (Sign in / Create account). */}
      {role === 'guest' ? <div style={{ flexShrink: 0 }}><LandingNavbar /></div> : <TopBar role={role} />}
      <main style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: '1 0 auto' }}>
          {fullBleed ? children : (
            <div style={{ maxWidth: 1440, margin: '0 auto', padding: `28px ${hPad}px 48px` }}>
              {children}
            </div>
          )}
        </div>
        {/* Client brief: the homepage footer on every page, dashboards included. */}
        <LandingFooter />
      </main>
    </div>
  );
}
