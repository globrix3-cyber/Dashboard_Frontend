import { useEffect, useState } from 'react';
import { SUPPLIER_SIGNUP_OPEN } from '../../constants';
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toggleLogin } from '../../features/auth/authSlice';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { CATEGORY_LINKS, useCategoryCounts, hasProducts } from './categoryLinks';

const MOCHA = '#5B4632';
const CREAM = '#FDF9F1';
const CHAMPAGNE = '#F4D9A0';
const SERIF = "'Cormorant Garamond', Georgia, serif";

// Placeholder colour/size can't be set inline.
const SEARCH_CSS = `
.gx-nav-search::placeholder{color:rgba(91,70,50,.74);opacity:1}
`;

const reset = { background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer', fontFamily: 'inherit', color: MOCHA };

// Client Canva p37: the before-login header matches the size of the after-login header
// (src/layouts/DashboardLayout.jsx): 46px outlined buttons with 14px text, a 48px primary
// button with 14.5px text, 14px "Sign in" and 14px nav links on a 52px row.
const outlinedBtn = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', border: '1px solid rgba(91,70,50,.396)', borderRadius: 3, fontSize: 14, fontWeight: 500, lineHeight: 1.4, letterSpacing: '.1px', color: MOCHA, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 };

const createBtn = { ...reset, display: 'flex', alignItems: 'center', boxSizing: 'border-box', height: 48, background: MOCHA, border: `1px solid ${MOCHA}`, borderRadius: 3, color: CREAM, fontSize: 14.5, fontWeight: 600, lineHeight: 1.4, letterSpacing: '.1px', whiteSpace: 'nowrap', flexShrink: 0 };

const navLink = { display: 'flex', alignItems: 'center', height: '100%', fontSize: 14, fontWeight: 400, lineHeight: 1.3, letterSpacing: '.05px', color: MOCHA, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 };

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0, color: MOCHA }}>
      <circle cx="11" cy="11" r="7" /><path d="m20 20-3.6-3.6" />
    </svg>
  );
}

function Arrow({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

// Reference .trade-utility: 1600px inner width, 4.5% side padding (5% up to 900px).
function AnnouncementBar({ isMobile }) {
  return (
    <div style={{ background: MOCHA, color: CHAMPAGNE, fontSize: isMobile ? 11 : 12, fontWeight: 400, letterSpacing: '.25px', lineHeight: 1.5 }}>
      <div style={{ maxWidth: 1600, margin: '0 auto', padding: isMobile ? '9px 5%' : '9px 4.5%', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: isMobile ? 15 : 24 }}>
        <span style={{ whiteSpace: 'nowrap' }}>Rooted in India. Global perspective.</span>
        {!isMobile && <a href="/#for-retailers" style={{ color: CHAMPAGNE, textDecoration: 'none', whiteSpace: 'nowrap' }}>For trade buyers</a>}
      </div>
    </div>
  );
}

export default function LandingNavbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const bp       = useBreakpoint();
  const counts   = useCategoryCounts();
  const NAV_ITEMS = CATEGORY_LINKS.filter(c => hasProducts(counts, c.root));
  const [query, setQuery]       = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu            = () => setMenuOpen(false);
  const openLogin            = () => { closeMenu(); dispatch(toggleLogin(true)); };
  const openRegister         = () => { closeMenu(); dispatch(toggleLogin({ show: true, intent: 'register' })); };
  const openSupplierRegister = () => { closeMenu(); dispatch(toggleLogin({ show: true, intent: 'supplier' })); };
  const handleSearch = (e) => {
    e.preventDefault();
    closeMenu();
    const q = query.trim();
    navigate(q ? `/products?search=${encodeURIComponent(q)}` : '/products');
  };

  // Escape closes the mobile menu.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  // Header breakpoints follow the reference header.css: phone layout up to
  // 900px, compact desktop 901–1150px.
  const isPhone   = bp.width <= 900;
  const isCompact = bp.width > 900 && bp.width <= 1150;

  // Leaving the phone layout closes the menu.
  if (!isPhone && menuOpen) setMenuOpen(false);

  const searchInput = (mobile) => (
    <input type="text" value={query} onChange={e => setQuery(e.target.value)} aria-label="Search products"
      placeholder="Search products, materials and collections"
      className={mobile ? 'gx-nav-search gx-nav-search--m' : 'gx-nav-search'}
      style={{ flex: 1, minWidth: 0, height: '100%', border: 'none', outline: 'none', background: 'transparent', padding: 0, fontSize: mobile ? 16 : 14.5, color: MOCHA, fontFamily: "'DM Sans', sans-serif" }} />
  );
  const submitBtn = (
    <button type="submit" aria-label="Submit product search" style={{ ...reset, width: 34, height: 34, borderRadius: 3, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
      <Arrow />
    </button>
  );
  const searchBox = { display: 'flex', alignItems: 'center', boxSizing: 'border-box', background: '#F5F0E7', border: '1px solid rgba(91,70,50,.145)', borderRadius: 4 };

  /* ── Desktop (reference .trade-header, 901px and up) ───────────────── */
  if (!isPhone) {
    const wrap = { maxWidth: 1600, margin: '0 auto', boxSizing: 'border-box', paddingLeft: '4.5%', paddingRight: '4.5%' };
    const navItem = { ...navLink, height: 52, fontSize: isCompact ? 13 : 14 };
    return (
      <>
        <style>{SEARCH_CSS}</style>
        <AnnouncementBar isMobile={false} />
        <header style={{ background: CREAM, borderBottom: '1px solid rgba(91,70,50,.133)', position: 'relative', zIndex: 1000 }}>
          <div style={{ ...wrap, display: 'flex', alignItems: 'center', gap: isCompact ? 20 : 32, minHeight: isCompact ? 96 : 108, paddingTop: 24, paddingBottom: 24 }}>
            <Link to="/" aria-label="Globrixa home" style={{ flexShrink: 0, fontFamily: SERIF, fontSize: isCompact ? 28 : 31, fontWeight: 600, letterSpacing: 4.5, lineHeight: 1.2, color: MOCHA, textDecoration: 'none', whiteSpace: 'nowrap' }}>
              GLOBRIXA
            </Link>
            <form role="search" onSubmit={handleSearch} style={{ ...searchBox, flex: 1, maxWidth: 640, minWidth: 0, height: 50, padding: '0 8px 0 16px', gap: 12 }}>
              <SearchIcon />
              {searchInput(false)}
              {submitBtn}
            </form>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: isCompact ? 10 : 14, flexShrink: 0 }}>
              <Link to="/about" style={{ ...outlinedBtn, height: 46, padding: isCompact ? '0 14px' : '0 18px' }}>About us</Link>
              <Link to="/contact" style={{ ...outlinedBtn, height: 46, padding: isCompact ? '0 14px' : '0 18px' }}>Contact us</Link>
              <button type="button" onClick={openLogin} style={{ ...reset, height: 46, display: 'flex', alignItems: 'center', padding: '0 4px', boxSizing: 'border-box', fontSize: 14, fontWeight: 500, lineHeight: 1.4, whiteSpace: 'nowrap' }}>Sign in</button>
              <button type="button" onClick={openRegister} style={{ ...createBtn, gap: 12, justifyContent: 'center', padding: isCompact ? '0 20px' : '0 28px' }}>
                Create account <Arrow size={17} />
              </button>
            </div>
          </div>
          <nav aria-label="Categories" style={{ borderTop: '1px solid rgba(91,70,50,.082)' }}>
            <div style={{ ...wrap, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: isCompact ? 24 : 32, minWidth: 0 }}>
                <Link to="/" aria-current={location.pathname === '/' ? 'page' : undefined} style={{ ...navItem, boxShadow: `inset 0 -2px 0 ${MOCHA}` }}>Discover</Link>
                {NAV_ITEMS.map(item => <Link key={item.label} to={item.to} style={navItem}>{item.label}</Link>)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
                <Link to="/blog" style={navItem}>Blog</Link>
              </div>
            </div>
          </nav>
        </header>
      </>
    );
  }

  /* ── Phone / small tablet (reference up to 900px: 173px header) ─────── */
  const menuLink = { display: 'flex', alignItems: 'center', height: 48, fontSize: 15, fontWeight: 400, color: MOCHA, textDecoration: 'none' };
  const menuInline = { ...menuLink, height: 'auto', whiteSpace: 'nowrap' };
  const mBtn = { ...outlinedBtn, minWidth: 118, height: 46, padding: '0 16px' };
  return (
    <>
      <style>{SEARCH_CSS}</style>
      <AnnouncementBar isMobile />
      <header style={{ background: CREAM, borderBottom: '1px solid rgba(91,70,50,.133)', position: 'relative', zIndex: 1000 }}>
        <div style={{ padding: '14px 5% 16px', boxSizing: 'border-box' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '40px minmax(0, 1fr) 40px', gap: 10, alignItems: 'center', height: 40 }}>
            <button type="button" onClick={() => setMenuOpen(o => !o)} aria-expanded={menuOpen} aria-controls="gx-mobile-menu"
              aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
              style={{ ...reset, width: 40, height: 40, boxSizing: 'border-box', border: '1px solid rgba(91,70,50,.2)', borderRadius: 3, display: 'grid', placeItems: 'center' }}>
              <svg width="15" height="11" viewBox="0 0 13 9" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
                <path d="M0 .6h13M0 4.5h13M0 8.4h13" />
              </svg>
            </button>
            <Link to="/" onClick={closeMenu} aria-label="Globrixa home" style={{ justifySelf: 'center', fontFamily: SERIF, fontSize: bp.width <= 380 ? 24 : 27, fontWeight: 600, letterSpacing: 3.5, lineHeight: 1.2, color: MOCHA, textDecoration: 'none', whiteSpace: 'nowrap' }}>
              GLOBRIXA
            </Link>
          </div>
          <form role="search" onSubmit={handleSearch} style={{ ...searchBox, marginTop: 14, height: 46, padding: '0 8px 0 16px', gap: 12 }}>
            <SearchIcon />
            {searchInput(true)}
            {submitBtn}
          </form>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 12 }}>
            <Link to="/about" onClick={closeMenu} style={mBtn}>About us</Link>
            <Link to="/contact" onClick={closeMenu} style={mBtn}>Contact us</Link>
          </div>
        </div>

        {menuOpen && (
          <div id="gx-mobile-menu" style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: CREAM, borderBottom: '1px solid rgba(91,70,50,.15)', boxShadow: '0 18px 28px rgba(91,70,50,.12)', padding: '16px 5% 24px', boxSizing: 'border-box', maxHeight: 'calc(100dvh - 210px)', overflowY: 'auto' }}>
            <nav aria-label="Main navigation">
              <div style={{ display: 'grid', gridTemplateColumns: bp.width <= 380 ? '1fr' : '1fr 1fr', columnGap: 24 }}>
                <Link to="/" onClick={closeMenu} style={{ ...menuLink, fontWeight: 600 }}>Discover</Link>
                {NAV_ITEMS.map(item => <Link key={item.label} to={item.to} onClick={closeMenu} style={menuLink}>{item.label}</Link>)}
              </div>
              <div style={{ height: 1, background: 'rgba(91,70,50,.13)', marginTop: 14 }} />
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', columnGap: 28, minHeight: 48, marginTop: 7 }}>
                <Link to="/blog" onClick={closeMenu} style={menuInline}>Blog</Link>
                {SUPPLIER_SIGNUP_OPEN && <button type="button" onClick={openSupplierRegister} style={{ ...reset, ...menuInline }}>Become a seller</button>}
              </div>
            </nav>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 18 }}>
              <button type="button" onClick={openLogin} style={{ ...reset, fontSize: 15, fontWeight: 400, textDecoration: 'underline', textUnderlineOffset: 3, whiteSpace: 'nowrap' }}>Sign in</button>
              <button type="button" onClick={openRegister} style={{ ...createBtn, height: 46, flex: 1, minWidth: 0, maxWidth: 300, justifyContent: 'center', gap: 12, padding: '0 17px' }}>
                Create account <Arrow size={16} />
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
