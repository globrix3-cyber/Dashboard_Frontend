import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
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
.gx-nav-search--m::placeholder{font-size:11px}
`;

const reset = { background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer', fontFamily: 'inherit', color: MOCHA };

const outlinedBtn = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', border: '1px solid rgba(91,70,50,.4)', borderRadius: 3, fontSize: 11, fontWeight: 500, letterSpacing: '.1px', color: MOCHA, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 };

const createBtn = { ...reset, display: 'flex', alignItems: 'center', boxSizing: 'border-box', height: 42, background: MOCHA, border: `1px solid ${MOCHA}`, borderRadius: 3, color: CREAM, fontSize: 11, fontWeight: 500, letterSpacing: '.1px', whiteSpace: 'nowrap', flexShrink: 0 };

const navLink = { display: 'flex', alignItems: 'center', height: '100%', fontSize: 11, fontWeight: 400, letterSpacing: '.05px', color: MOCHA, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 };

function Arrow({ style }) {
  return (
    <svg width="11" height="8" viewBox="0 0 11 8" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0, ...style }}>
      <path d="M.6 4h9.8M7 .7 10.4 4 7 7.3" />
    </svg>
  );
}

function SmallArrow() {
  return (
    <svg width="9" height="7" viewBox="0 0 9 7" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0, marginRight: 3 }}>
      <path d="M.5 3.5h8M5.6.6l2.9 2.9-2.9 2.9" />
    </svg>
  );
}

function AnnouncementBar({ isMobile, side }) {
  return (
    <div style={{ background: MOCHA, color: CHAMPAGNE, fontSize: isMobile ? 9 : 10, fontWeight: 400, letterSpacing: '.25px', lineHeight: isMobile ? '14px' : '15px' }}>
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: `8px ${side}px`, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <span style={{ whiteSpace: 'nowrap' }}>Indian design. Global perspective.</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, whiteSpace: 'nowrap' }}>
          {!isMobile && (
            <>
              <Link to="/products" style={{ color: CHAMPAGNE, textDecoration: 'none' }}>For trade buyers</Link>
              <span aria-hidden="true" style={{ width: 1, height: 11, background: 'rgba(244,217,160,.314)' }} />
            </>
          )}
          <span>India · INR ₹</span>
        </div>
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
  const goToMakers = (e) => {
    e.preventDefault();
    closeMenu();
    if (location.pathname === '/') document.getElementById('makers')?.scrollIntoView({ behavior: 'smooth' });
    else navigate('/#makers');
  };

  // Arriving at '/#makers' from another page: scroll once the section has rendered.
  useEffect(() => {
    if (location.pathname !== '/' || location.hash !== '#makers') return;
    let tries = 0;
    const id = setInterval(() => {
      const el = document.getElementById('makers');
      if (el || ++tries > 20) { clearInterval(id); el?.scrollIntoView({ behavior: 'smooth' }); }
    }, 100);
    return () => clearInterval(id);
  }, [location.pathname, location.hash]);

  // Escape closes the mobile menu.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  // Leaving mobile layout closes the menu.
  if (!bp.isMobile && menuOpen) setMenuOpen(false);

  const searchInput = (mobile) => (
    <input type="text" value={query} onChange={e => setQuery(e.target.value)} aria-label="Search products"
      placeholder="Search products, materials and collections"
      className={mobile ? 'gx-nav-search gx-nav-search--m' : 'gx-nav-search'}
      style={{ flex: 1, minWidth: 0, height: mobile ? 40 : 42, border: 'none', outline: 'none', background: 'transparent', padding: 0, fontSize: mobile ? 16 : 12, color: MOCHA, fontFamily: 'inherit' }} />
  );
  const submitBtn = (
    <button type="submit" aria-label="Submit product search" style={{ ...reset, width: 32, height: 32, borderRadius: 3, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
      <Arrow />
    </button>
  );
  const searchBox = { display: 'flex', alignItems: 'center', boxSizing: 'border-box', background: '#F5F0E7', border: '1px solid #DED7CC', borderRadius: 3 };

  /* ── Desktop / Tablet ───────────────────────────────────────────────── */
  if (!bp.isMobile) {
    const side = bp.isTablet ? 24 : 65;
    return (
      <>
        <style>{SEARCH_CSS}</style>
        <AnnouncementBar isMobile={false} side={side} />
        <header style={{ background: CREAM, borderBottom: '1px solid #E7E0D7', position: 'sticky', top: 0, zIndex: 1000 }}>
          <div style={{ borderBottom: '1px solid #EFEAE1' }}>
            <div style={{ maxWidth: 1440, margin: '0 auto', height: 88, display: 'flex', alignItems: 'center', padding: `0 ${side}px`, boxSizing: 'border-box' }}>
              <Link to="/" aria-label="Globrixa home" style={{ fontFamily: SERIF, fontSize: bp.isTablet ? 22 : 26, fontWeight: 600, letterSpacing: bp.isTablet ? 3 : 4, lineHeight: '31px', color: MOCHA, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>
                GLOBRIXA
              </Link>
              <form role="search" onSubmit={handleSearch} style={{ ...searchBox, flex: '0 1 620px', minWidth: 0, height: 44, marginLeft: bp.isTablet ? 20 : 51, padding: '0 6px 0 16px', gap: 14 }}>
                <Search size={14} color={MOCHA} strokeWidth={2} style={{ flexShrink: 0 }} aria-hidden="true" />
                {searchInput(false)}
                {submitBtn}
              </form>
              <div style={{ marginLeft: 'auto', paddingLeft: bp.isTablet ? 16 : 24, display: 'flex', alignItems: 'center', gap: bp.isTablet ? 14 : 20, flexShrink: 0 }}>
                {!bp.isTablet && <Link to="/about" style={{ ...outlinedBtn, height: 42, padding: '11px 18px' }}>About us</Link>}
                <button onClick={openLogin} style={{ ...reset, padding: '10px 0', fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap' }}>Sign in</button>
                <button onClick={openRegister} style={{ ...createBtn, width: bp.isTablet ? 'auto' : 154, gap: 20, justifyContent: 'space-between', padding: '12px 17px' }}>
                  Create account <SmallArrow />
                </button>
              </div>
            </div>
          </div>
          <nav aria-label="Categories" style={{ maxWidth: 1440, margin: '0 auto', height: 46, display: 'flex', alignItems: 'stretch', padding: `0 ${side}px`, boxSizing: 'border-box', overflowX: 'auto', scrollbarWidth: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'stretch', gap: 26.5 }}>
              <Link to="/" aria-current={location.pathname === '/' ? 'page' : undefined} style={{ ...navLink, boxShadow: `inset 0 -2px 0 ${MOCHA}` }}>Discover</Link>
              {NAV_ITEMS.map(item => <Link key={item.label} to={item.to} style={navLink}>{item.label}</Link>)}
            </div>
            <div style={{ marginLeft: 'auto', paddingLeft: 24, display: 'flex', alignItems: 'stretch', gap: 23 }}>
              <Link to="/blog" style={navLink}>Journal</Link>
              <a href="/#makers" onClick={goToMakers} style={navLink}>Meet the makers</a>
            </div>
          </nav>
        </header>
      </>
    );
  }

  /* ── Mobile ─────────────────────────────────────────────────────────── */
  const menuLink = { display: 'flex', alignItems: 'center', height: 48, fontSize: 13, fontWeight: 400, color: MOCHA, textDecoration: 'none' };
  const menuInline = { ...menuLink, height: 'auto', whiteSpace: 'nowrap' };
  return (
    <>
      <style>{SEARCH_CSS}</style>
      <AnnouncementBar isMobile side={20} />
      <header style={{ background: CREAM, borderBottom: '1px solid #E7E1D7', position: 'relative', zIndex: 1000 }}>
        <div style={{ padding: '14px 20px 16px', boxSizing: 'border-box' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', height: 36 }}>
            <button type="button" onClick={() => setMenuOpen(o => !o)} aria-expanded={menuOpen} aria-controls="gx-mobile-menu"
              aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
              style={{ ...reset, width: 36, height: 36, boxSizing: 'border-box', border: '1px solid rgba(91,70,50,.13)', borderRadius: 3, display: 'grid', placeItems: 'center' }}>
              <svg width="13" height="9" viewBox="0 0 13 9" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
                <path d="M0 .6h13M0 4.5h13M0 8.4h13" />
              </svg>
            </button>
            <Link to="/" onClick={closeMenu} aria-label="Globrixa home" style={{ justifySelf: 'center', fontFamily: SERIF, fontSize: 25, fontWeight: 600, letterSpacing: 4, lineHeight: '30px', color: MOCHA, textDecoration: 'none', whiteSpace: 'nowrap' }}>
              GLOBRIXA
            </Link>
            <Link to="/about" onClick={closeMenu} style={{ ...outlinedBtn, height: 36, padding: '8px 12px' }}>About us</Link>
          </div>
          <form role="search" onSubmit={handleSearch} style={{ ...searchBox, marginTop: 15, height: 42, padding: '0 6px 0 12px', gap: 13 }}>
            <Search size={14} color={MOCHA} strokeWidth={2} style={{ flexShrink: 0 }} aria-hidden="true" />
            {searchInput(true)}
            {submitBtn}
          </form>
        </div>

        {menuOpen && (
          <div id="gx-mobile-menu" style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: CREAM, borderBottom: '1px solid rgba(91,70,50,.15)', boxShadow: '0 18px 28px rgba(91,70,50,.12)', padding: '14px 20px 26px', boxSizing: 'border-box' }}>
            <nav aria-label="Main navigation">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 23 }}>
                <Link to="/" onClick={closeMenu} style={{ ...menuLink, fontWeight: 600 }}>Discover</Link>
                {NAV_ITEMS.map(item => <Link key={item.label} to={item.to} onClick={closeMenu} style={menuLink}>{item.label}</Link>)}
              </div>
              <div style={{ height: 1, background: 'rgba(91,70,50,.13)', marginTop: 14 }} />
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', columnGap: 28, minHeight: 48, marginTop: 7 }}>
                <Link to="/blog" onClick={closeMenu} style={menuInline}>Journal</Link>
                <a href="/#makers" onClick={goToMakers} style={menuInline}>Meet the makers</a>
                <button type="button" onClick={openSupplierRegister} style={{ ...reset, ...menuInline }}>Become a seller</button>
              </div>
            </nav>
            <div style={{ display: 'flex', alignItems: 'center', gap: 1, marginTop: 18 }}>
              <button type="button" onClick={openLogin} style={{ ...reset, fontSize: 12, fontWeight: 400, textDecoration: 'underline', textUnderlineOffset: 3, whiteSpace: 'nowrap' }}>Sign in</button>
              <button type="button" onClick={openRegister} style={{ ...createBtn, width: 300, maxWidth: '100%', justifyContent: 'center', gap: 23, padding: '0 17px' }}>
                Create account <SmallArrow />
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
