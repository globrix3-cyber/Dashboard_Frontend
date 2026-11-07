import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Search } from 'lucide-react';
import { toggleLogin } from '../../features/auth/authSlice';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { CATEGORY_LINKS, useCategoryCounts, hasProducts } from './categoryLinks';
import { useWishlist } from '../../hooks/useWishlist';
import { api } from '../../services/api';


const subNavLink = { display: 'flex', alignItems: 'center', fontSize: 11, fontWeight: 400, color: '#5B4632', textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 };

const aboutLink = { display: 'flex', alignItems: 'center', alignSelf: 'center', background: '#F5ECDC', border: '1px solid rgba(91,70,50,.31)', borderRadius: 3, padding: '8px 12px', fontSize: 11, fontWeight: 600, color: '#5B4632', textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 };

// Logo pill: { fontSize, padding } scale down on smaller screens.
const LOGO_SIZES = {
  desktop: { fontSize: 26, letterSpacing: 5, padding: '13px 20px 14px 25px', borderRadius: 15 },
  tablet:  { fontSize: 22, letterSpacing: 4, padding: '10px 16px 11px 20px', borderRadius: 13 },
  mobile:  { fontSize: 18, letterSpacing: 3.2, padding: '11px 14px 12px 17px', borderRadius: 11 },
};

function Logo({ variant, onClick }) {
  const s = LOGO_SIZES[variant];
  return (
    <button onClick={onClick} aria-label="Globrixa home" style={{ background: '#5B4632', color: '#FDF9F1', border: 'none', cursor: 'pointer', padding: s.padding, borderRadius: s.borderRadius, flexShrink: 0, display: 'flex', alignItems: 'center', fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: s.fontSize, fontWeight: 600, letterSpacing: s.letterSpacing, lineHeight: 1, whiteSpace: 'nowrap' }}>
      GLOBRIXA
    </button>
  );
}

function AnnouncementBar({ bp }) {
  const goToCollections = (e) => {
    e.preventDefault();
    document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <div style={{ background: '#5B4632', color: '#F4D9A0', fontSize: bp.isMobile ? 9 : 11, fontWeight: 400, letterSpacing: '.3px', lineHeight: bp.isMobile ? 1.6 : 'normal', padding: bp.isMobile ? '7px 16px' : '11px 16px', display: bp.isMobile ? 'block' : 'flex', justifyContent: 'center', gap: 22, textAlign: 'center' }}>
      <span>Made for independent businesses. Inspired by the extraordinary.</span>
      <a href="/#collections" onClick={goToCollections} style={{ color: '#F4D9A0', textDecoration: 'underline', textUnderlineOffset: 3, marginLeft: bp.isMobile ? 10 : 0 }}>Find your next best seller ↗</a>
    </div>
  );
}

function TextButton({ onClick, children }) {
  return (
    <button onClick={onClick} style={{ padding: 0, fontSize: 12, fontWeight: 400, color: '#5B4632', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
      {children}
    </button>
  );
}

// Small count above the heart/cart icon, as in the reference header.
function CountBadge({ n }) {
  return <span aria-hidden="true" style={{ position: 'absolute', top: -6, right: -7, fontSize: 9, lineHeight: 1, color: '#5B4632', fontWeight: 400 }}>{n}</span>;
}

// Items in the signed-in buyer's cart; 0 when signed out.
function useCartCount(isLoggedIn) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isLoggedIn) return;
    let alive = true;
    api.getCart()
      .then(res => {
        const items = Array.isArray(res) ? res : (res?.items ?? res?.data ?? []);
        if (alive) setCount(Array.isArray(items) ? items.length : 0);
      })
      .catch(() => { if (alive) setCount(0); });
    return () => { alive = false; };
  }, [isLoggedIn]);
  return isLoggedIn ? count : 0;
}

function IconButton({ label, onClick, children }) {
  return (
    <button onClick={onClick} aria-label={label} style={{ padding: 0, display: 'flex', color: '#5B4632', background: 'none', border: 'none', cursor: 'pointer' }}>
      {children}
    </button>
  );
}

export default function LandingNavbar() {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const bp         = useBreakpoint();
  const isLoggedIn = !!useSelector(s => s.auth.token);
  const counts     = useCategoryCounts();
  const NAV_ITEMS  = CATEGORY_LINKS.filter(c => hasProducts(counts, c.root));
  const [query, setQuery]       = useState('');
  const savedCount = useWishlist().ids.size;
  const cartCount  = useCartCount(isLoggedIn);

  const openLogin            = () => { dispatch(toggleLogin(true)); };
  const openSupplierRegister = () => { dispatch(toggleLogin({ show: true, intent: 'supplier' })); };
  const goToBuyerPage        = (path) => { if (isLoggedIn) navigate(path); else openLogin(); };
  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/products?search=${encodeURIComponent(q)}` : '/products');
  };

  const searchBox = (height) => (
    <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: bp.isMobile ? 'none' : 490, display: 'flex', alignItems: 'center', gap: 12, background: '#F0DCC0', height, padding: '0 18px', marginBottom: bp.isMobile ? 16 : 0 }}>
      <Search size={16} color="#5B4632" style={{ flexShrink: 0 }} />
      <input type="text" value={query} onChange={e => setQuery(e.target.value)} aria-label="Search products"
        placeholder="Try ‘ceramics’, ‘linen’ or ‘gifts’"
        style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: '#5B4632', fontFamily: 'inherit' }} />
    </form>
  );

  /* ── Desktop / Tablet ───────────────────────────────────────────────── */
  if (!bp.isMobile) {
    const side = bp.isTablet ? 24 : 62;
    return (
      <>
        <AnnouncementBar bp={bp} />
        <nav style={{ background: '#FDF9F1', borderBottom: '1px solid #E3D5C1', position: 'sticky', top: 0, zIndex: 1000 }}>
          <div style={{ maxWidth: 1440, margin: '0 auto', height: bp.isTablet ? 76 : 101, display: 'flex', alignItems: 'center', gap: bp.isTablet ? 16 : 44, padding: `0 ${side}px`, boxSizing: 'border-box' }}>
            <Logo variant={bp.isTablet ? 'tablet' : 'desktop'} onClick={() => navigate('/')} />
            {searchBox(42)}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: bp.isTablet ? 12 : 28, flexShrink: 0 }}>
              {!bp.isTablet && <TextButton onClick={openSupplierRegister}>Sell on Globrixa</TextButton>}
              <TextButton onClick={openLogin}>Sign in</TextButton>
              <IconButton label={`Wishlist, ${savedCount} saved`} onClick={() => goToBuyerPage('/buyer-dashboard')}><span style={{ position: 'relative', display: 'flex' }}><Heart size={20} /><CountBadge n={savedCount} /></span></IconButton>
              <IconButton label={`Cart, ${cartCount} items`} onClick={() => goToBuyerPage('/buyer-dashboard/cart')}><span style={{ position: 'relative', display: 'flex' }}><ShoppingBag size={20} /><CountBadge n={cartCount} /></span></IconButton>
              <button onClick={() => navigate('/products')}
                style={{ display: 'flex', gap: bp.isTablet ? 12 : 26, padding: '13px 18px', background: '#5B4632', color: '#F4D9A0', fontSize: 11, fontWeight: 500, border: 'none', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', transition: 'background .15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#2B2016'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#5B4632'; }}
              >Start sourcing <span>↗</span></button>
            </div>
          </div>
        </nav>
        <div style={{ background: '#FDF9F1', borderBottom: '1px solid #E3D5C1' }}>
          <div style={{ maxWidth: 1440, margin: '0 auto', height: 55, display: 'flex', alignItems: 'stretch', gap: 30, padding: `0 ${side}px`, boxSizing: 'border-box', overflowX: 'auto', scrollbarWidth: 'none' }}>
            <Link to="/about" style={aboutLink}>About us</Link>
            <Link to="/" style={{ ...subNavLink, fontWeight: 600, borderBottom: '2px solid #5B4632' }}>Discover</Link>
            {NAV_ITEMS.map(item => <Link key={item.label} to={item.to} style={subNavLink}>{item.label}</Link>)}
            {!bp.isTablet && (
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 40 }}>
                <Link to="/our-story" style={subNavLink}>Our Story</Link>
                <a href="/#makers" style={{ ...subNavLink, gap: 18 }}>Meet the makers <span>↗</span></a>
                <span style={{ fontSize: 9, fontWeight: 400, letterSpacing: '1.3px', color: '#5B4632', whiteSpace: 'nowrap' }}>INDIA, WITH LOVE <span style={{ color: '#C8792C', fontSize: 13 }}>✳</span></span>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  /* ── Mobile: same rows as the reference — logo + icons + Start sourcing, search, category row ── */
  const mobileIcon = { padding: '1px 6px', display: 'flex', color: '#5B4632', background: 'none', border: 'none', cursor: 'pointer' };
  return (
    <>
      <AnnouncementBar bp={bp} />
      <header style={{ background: '#FDF9F1', borderBottom: '1px solid #E3D5C1' }}>
        <div style={{ padding: '17px 19.5px', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Logo variant="mobile" onClick={() => navigate('/')} />
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
              <button onClick={() => goToBuyerPage('/buyer-dashboard')} aria-label={`Wishlist, ${savedCount} saved`} style={mobileIcon}><span style={{ position: 'relative', display: 'flex' }}><Heart size={22} strokeWidth={1.6} /><CountBadge n={savedCount} /></span></button>
              <button onClick={() => goToBuyerPage('/buyer-dashboard/cart')} aria-label={`Cart, ${cartCount} items`} style={mobileIcon}><span style={{ position: 'relative', display: 'flex' }}><ShoppingBag size={22} strokeWidth={1.6} /><CountBadge n={cartCount} /></span></button>
              <button onClick={() => navigate('/products')}
                style={{ padding: 10, marginLeft: 4, background: '#5B4632', color: '#F4D9A0', border: '1px solid #5B4632', fontSize: 10, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                Start sourcing
              </button>
            </div>
          </div>
          <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 15, height: 40, padding: '10px 13px', background: '#F5ECDC', border: '1px solid transparent', boxSizing: 'border-box' }}>
            <Search size={18} color="#5B4632" style={{ flexShrink: 0 }} />
            <input type="text" value={query} onChange={e => setQuery(e.target.value)} aria-label="Search products"
              placeholder="Try ‘ceramics’, ‘linen’ or ‘gifts’"
              style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', fontSize: 12, color: '#5B4632', fontFamily: 'inherit' }} />
          </form>
        </div>
        <nav aria-label="Categories" style={{ height: 48, display: 'flex', alignItems: 'stretch', gap: 25, padding: '0 19.5px', overflowX: 'auto', scrollbarWidth: 'none', borderTop: '1px solid #E3D5C1' }}>
          <Link to="/about" style={{ ...aboutLink, fontSize: 10, fontWeight: 600 }}>About us</Link>
          <Link to="/" style={{ ...subNavLink, fontSize: 10, fontWeight: 600, borderBottom: '2px solid #5B4632' }}>Discover</Link>
          {NAV_ITEMS.map(item => <Link key={item.label} to={item.to} style={{ ...subNavLink, fontSize: 10 }}>{item.label}</Link>)}
          <button onClick={openLogin} style={{ ...subNavLink, fontSize: 10, background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit' }}>Sign in</button>
          <button onClick={openSupplierRegister} style={{ ...subNavLink, fontSize: 10, background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit' }}>Sell on Globrixa</button>
          <Link to="/our-story" style={{ ...subNavLink, fontSize: 10, paddingRight: 19.5 }}>Our Story</Link>
        </nav>
      </header>
    </>
  );
}
