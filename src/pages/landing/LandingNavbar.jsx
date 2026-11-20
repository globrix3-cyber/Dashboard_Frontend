import { useEffect, useState } from 'react';
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
.gx-nav-search--m::placeholder{font-size:12.333px}
`;

const reset = { background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer', fontFamily: 'inherit', color: MOCHA };

// Reference (new header): 12.33px/500 outlined buttons, 13.33px "Sign in", 12.33px nav links.
const outlinedBtn = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', border: '1px solid rgba(91,70,50,.396)', borderRadius: 3, fontSize: 12.333, fontWeight: 500, lineHeight: '17.27px', letterSpacing: '.1px', color: MOCHA, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 };

const createBtn = { ...reset, display: 'flex', alignItems: 'center', boxSizing: 'border-box', height: 43, background: MOCHA, border: `1px solid ${MOCHA}`, borderRadius: 3, color: CREAM, fontSize: 12.333, fontWeight: 500, lineHeight: '17.27px', letterSpacing: '.1px', whiteSpace: 'nowrap', flexShrink: 0 };

const navLink = { display: 'flex', alignItems: 'center', height: '100%', fontSize: 12.333, fontWeight: 400, lineHeight: '16.03px', letterSpacing: '.05px', color: MOCHA, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 };

function SearchIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0, color: MOCHA }}>
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
    <div style={{ background: MOCHA, color: CHAMPAGNE, fontSize: isMobile ? 10.333 : 11.333, fontWeight: 400, letterSpacing: '.25px', lineHeight: 1.5 }}>
      <div style={{ maxWidth: 1600, margin: '0 auto', padding: isMobile ? '8px 5%' : '8px 4.5%', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: isMobile ? 15 : 24 }}>
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
      style={{ flex: 1, minWidth: 0, height: mobile ? 40 : 42, border: 'none', outline: 'none', background: 'transparent', padding: 0, fontSize: mobile ? 17.333 : isCompact ? 12.333 : 13.333, color: MOCHA, fontFamily: 'inherit' }} />
  );
  const submitBtn = (
    <button type="submit" aria-label="Submit product search" style={{ ...reset, width: 32, height: 32, borderRadius: 3, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
      <Arrow />
    </button>
  );
  const searchBox = { display: 'flex', alignItems: 'center', boxSizing: 'border-box', background: '#F5F0E7', border: '1px solid rgba(91,70,50,.145)', borderRadius: 4 };

  /* ── Desktop (reference .trade-header, 901px and up) ───────────────── */
  if (!isPhone) {
    const wrap = { maxWidth: 1600, margin: '0 auto', boxSizing: 'border-box', paddingLeft: '4.5%', paddingRight: '4.5%' };
    const navItem = { ...navLink, height: 46, fontSize: isCompact ? 11.333 : 12.333 };
    return (
      <>
        <style>{SEARCH_CSS}</style>
        <AnnouncementBar isMobile={false} />
        <header style={{ background: CREAM, borderBottom: '1px solid rgba(91,70,50,.133)', position: 'relative', zIndex: 1000 }}>
          <div style={{ ...wrap, display: 'grid', gridTemplateColumns: '165px minmax(130px, 1fr) auto', gap: 24, alignItems: 'center', minHeight: isCompact ? 82 : 88, paddingTop: isCompact ? 19 : 22, paddingBottom: isCompact ? 19 : 22 }}>
            <Link to="/" aria-label="Globrixa home" style={{ justifySelf: 'start', fontFamily: SERIF, fontSize: isCompact ? 26.333 : 27.333, fontWeight: 600, letterSpacing: isCompact ? 3.8 : 4, lineHeight: 1.2, color: MOCHA, textDecoration: 'none', whiteSpace: 'nowrap' }}>
              GLOBRIXA
            </Link>
            <form role="search" onSubmit={handleSearch} style={{ ...searchBox, width: '100%', maxWidth: 620, minWidth: 0, height: 44, padding: '0 7px 0 15px', gap: 12 }}>
              <SearchIcon />
              {searchInput(false)}
              {submitBtn}
            </form>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 14 }}>
              <Link to="/about" style={{ ...outlinedBtn, minHeight: 42, padding: '11px 13px' }}>About us</Link>
              <Link to="/contact" style={{ ...outlinedBtn, minHeight: 42, padding: '11px 13px' }}>Contact us</Link>
              <button type="button" onClick={openLogin} style={{ ...reset, minHeight: 42, display: 'flex', alignItems: 'center', padding: '10px 0', boxSizing: 'border-box', fontSize: 13.333, fontWeight: 500, lineHeight: 1.4, whiteSpace: 'nowrap' }}>Sign in</button>
              <button type="button" onClick={openRegister} style={{ ...createBtn, height: 'auto', minHeight: 42, gap: 20, justifyContent: 'center', padding: '12px 17px' }}>
                Create account <Arrow size={16} />
              </button>
            </div>
          </div>
          <nav aria-label="Categories" style={{ borderTop: '1px solid rgba(91,70,50,.082)' }}>
            <div style={{ ...wrap, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: isCompact ? 20 : 25 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: isCompact ? 21 : 27, minWidth: 0 }}>
                <Link to="/" aria-current={location.pathname === '/' ? 'page' : undefined} style={{ ...navItem, boxShadow: `inset 0 -2px 0 ${MOCHA}` }}>Discover</Link>
                {NAV_ITEMS.map(item => <Link key={item.label} to={item.to} style={navItem}>{item.label}</Link>)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: isCompact ? 18 : 24 }}>
                <Link to="/blog" style={navItem}>Blog</Link>
              </div>
            </div>
          </nav>
        </header>
      </>
    );
  }

  /* ── Phone / small tablet (reference up to 900px: 173px header) ─────── */
  const menuLink = { display: 'flex', alignItems: 'center', height: 48, fontSize: 13, fontWeight: 400, color: MOCHA, textDecoration: 'none' };
  const menuInline = { ...menuLink, height: 'auto', whiteSpace: 'nowrap' };
  const mBtn = { ...outlinedBtn, width: 100, height: 36, padding: '8px 12px' };
  return (
    <>
      <style>{SEARCH_CSS}</style>
      <AnnouncementBar isMobile />
      <header style={{ background: CREAM, borderBottom: '1px solid rgba(91,70,50,.133)', position: 'relative', zIndex: 1000 }}>
        <div style={{ padding: '14px 5% 16px', boxSizing: 'border-box' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '36px minmax(0, 1fr) 0px', gap: bp.width <= 380 ? 10 : 13, alignItems: 'center', height: 36 }}>
            <button type="button" onClick={() => setMenuOpen(o => !o)} aria-expanded={menuOpen} aria-controls="gx-mobile-menu"
              aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
              style={{ ...reset, width: 36, height: 36, boxSizing: 'border-box', border: '1px solid rgba(91,70,50,.125)', borderRadius: 3, display: 'grid', placeItems: 'center' }}>
              <svg width="13" height="9" viewBox="0 0 13 9" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
                <path d="M0 .6h13M0 4.5h13M0 8.4h13" />
              </svg>
            </button>
            <Link to="/" onClick={closeMenu} aria-label="Globrixa home" style={{ justifySelf: 'center', fontFamily: SERIF, fontSize: bp.width <= 380 ? 23.333 : 26.333, fontWeight: 600, letterSpacing: bp.width <= 380 ? 3 : 4, lineHeight: 1.2, color: MOCHA, textDecoration: 'none', whiteSpace: 'nowrap' }}>
              GLOBRIXA
            </Link>
          </div>
          <form role="search" onSubmit={handleSearch} style={{ ...searchBox, marginTop: bp.width <= 380 ? 12 : 15, height: 42, padding: '0 7px 0 12px', gap: 10 }}>
            <SearchIcon />
            {searchInput(true)}
            {submitBtn}
          </form>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: bp.width <= 380 ? 10 : 13 }}>
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
                <button type="button" onClick={openSupplierRegister} style={{ ...reset, ...menuInline }}>Become a seller</button>
              </div>
            </nav>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 18 }}>
              <button type="button" onClick={openLogin} style={{ ...reset, fontSize: 12, fontWeight: 400, textDecoration: 'underline', textUnderlineOffset: 3, whiteSpace: 'nowrap' }}>Sign in</button>
              <button type="button" onClick={openRegister} style={{ ...createBtn, height: 42, flex: 1, minWidth: 0, maxWidth: 300, justifyContent: 'center', gap: 23, padding: '0 17px' }}>
                Create account <Arrow size={16} />
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
