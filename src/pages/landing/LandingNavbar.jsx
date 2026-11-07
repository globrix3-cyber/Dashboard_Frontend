import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Search } from 'lucide-react';
import { toggleLogin } from '../../features/auth/authSlice';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { CATEGORY_LINKS, useCategoryCounts, hasProducts } from './categoryLinks';


const subNavLink = { display: 'flex', alignItems: 'center', fontSize: 12, color: '#5B4632', textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 };

const aboutLink = { display: 'flex', alignItems: 'center', alignSelf: 'center', background: '#F5ECDC', border: '1px solid rgba(91,70,50,.31)', borderRadius: 3, padding: '8px 12px', fontSize: 11, fontWeight: 500, color: '#5B4632', textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 };

// Logo pill: { fontSize, padding } scale down on smaller screens.
const LOGO_SIZES = {
  desktop: { fontSize: 26, letterSpacing: 5, padding: '13px 20px 14px 25px', borderRadius: 15 },
  tablet:  { fontSize: 21, letterSpacing: 4, padding: '10px 16px 11px 20px', borderRadius: 13 },
  mobile:  { fontSize: 17, letterSpacing: 3, padding: '7px 11px 8px 14px',   borderRadius: 10 },
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
    <div style={{ background: '#5B4632', color: '#F4D9A0', fontSize: bp.isMobile ? 11 : 12, padding: '10px 16px', display: 'flex', justifyContent: 'center', gap: 22, textAlign: 'center' }}>
      {!bp.isMobile && <span>Made for independent businesses. Inspired by the extraordinary.</span>}
      <a href="/#collections" onClick={goToCollections} style={{ color: '#F4D9A0', textUnderlineOffset: 3 }}>Find your next best seller ↗</a>
    </div>
  );
}

function TextButton({ onClick, children }) {
  return (
    <button onClick={onClick} style={{ padding: 0, fontSize: 13, color: '#5B4632', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
      {children}
    </button>
  );
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery]       = useState('');

  const openLogin            = () => { dispatch(toggleLogin(true)); setMenuOpen(false); };
  const openSupplierRegister = () => { dispatch(toggleLogin({ show: true, intent: 'supplier' })); setMenuOpen(false); };
  const goToBuyerPage        = (path) => { if (isLoggedIn) navigate(path); else openLogin(); };
  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    setMenuOpen(false);
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
          <div style={{ maxWidth: 1440, margin: '0 auto', height: bp.isTablet ? 76 : 90, display: 'flex', alignItems: 'center', gap: bp.isTablet ? 16 : 44, padding: `0 ${side}px`, boxSizing: 'border-box' }}>
            <Logo variant={bp.isTablet ? 'tablet' : 'desktop'} onClick={() => navigate('/')} />
            {searchBox(42)}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: bp.isTablet ? 12 : 28, flexShrink: 0 }}>
              {!bp.isTablet && <TextButton onClick={openSupplierRegister}>Sell on Globrixa</TextButton>}
              <TextButton onClick={openLogin}>Sign in</TextButton>
              <IconButton label="Wishlist" onClick={() => goToBuyerPage('/buyer-dashboard')}><Heart size={20} /></IconButton>
              <IconButton label="Cart" onClick={() => goToBuyerPage('/buyer-dashboard/cart')}><ShoppingBag size={20} /></IconButton>
              <button onClick={() => navigate('/products')}
                style={{ display: 'flex', gap: bp.isTablet ? 12 : 26, padding: '13px 18px', background: '#5B4632', color: '#FDF9F1', fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', transition: 'background .15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#2B2016'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#5B4632'; }}
              >Start sourcing <span>↗</span></button>
            </div>
          </div>
        </nav>
        <div style={{ background: '#FDF9F1', borderBottom: '1px solid #E3D5C1' }}>
          <div style={{ maxWidth: 1440, margin: '0 auto', height: 56, display: 'flex', alignItems: 'stretch', gap: 30, padding: `0 ${side}px`, boxSizing: 'border-box', overflowX: 'auto', scrollbarWidth: 'none' }}>
            <Link to="/about" style={aboutLink}>About us</Link>
            <Link to="/" style={{ ...subNavLink, fontWeight: 600, borderBottom: '2px solid #5B4632' }}>Discover</Link>
            {NAV_ITEMS.map(item => <Link key={item.label} to={item.to} style={subNavLink}>{item.label}</Link>)}
            {!bp.isTablet && (
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 40 }}>
                <Link to="/our-story" style={subNavLink}>Our Story</Link>
                <a href="/#makers" style={{ ...subNavLink, gap: 18 }}>Meet the makers <span>↗</span></a>
                <span style={{ fontSize: 9, letterSpacing: '.16em', color: '#5B4632', whiteSpace: 'nowrap' }}>INDIA, WITH LOVE <span style={{ color: '#C8792C', fontSize: 13 }}>✳</span></span>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  /* ── Mobile ─────────────────────────────────────────────────────────── */
  const menuLinks = [
    ['About us', () => { navigate('/about'); setMenuOpen(false); }],
    ...NAV_ITEMS.map(item => [item.label, () => { navigate(item.to); setMenuOpen(false); }]),
    ['Sell on Globrixa', openSupplierRegister],
    ['Our Story', () => { navigate('/our-story'); setMenuOpen(false); }],
    ['Blog', () => { navigate('/blog'); setMenuOpen(false); }],
  ];
  return (
    <>
      <AnnouncementBar bp={bp} />
      <nav style={{ background: '#FDF9F1', borderBottom: '1px solid #E3D5C1', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', position: 'sticky', top: 0, zIndex: 1000 }}>
        <Logo variant="mobile" onClick={() => navigate('/')} />
        <button onClick={() => setMenuOpen(o => !o)} aria-label="Menu" aria-expanded={menuOpen}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, display: 'flex', flexDirection: 'column', gap: 5 }}>
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              display: 'block', width: 22, height: 2, borderRadius: 2, background: '#5B4632', transition: 'transform .22s, opacity .22s',
              transform: menuOpen ? (i === 0 ? 'translateY(7px) rotate(45deg)' : i === 2 ? 'translateY(-7px) rotate(-45deg)' : 'scaleX(0)') : 'none',
              opacity: menuOpen && i === 1 ? 0 : 1,
            }} />
          ))}
        </button>
        {menuOpen && (
          <div style={{ position: 'absolute', top: 64, left: 0, right: 0, height: 'calc(100vh - 64px)', background: 'rgba(43,32,22,.55)' }} onClick={() => setMenuOpen(false)}>
            <div onClick={e => e.stopPropagation()} style={{ background: '#FDF9F1', padding: '20px 18px 28px', maxHeight: '100%', overflowY: 'auto', boxSizing: 'border-box' }}>
              {searchBox(46)}
              {menuLinks.map(([label, fn]) => (
                <button key={label} onClick={fn} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '13px 4px', fontSize: 15, color: '#5B4632', background: 'none', border: 'none', borderBottom: '1px solid #E3D5C1', cursor: 'pointer', fontFamily: 'inherit' }}>{label}</button>
              ))}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
                <button onClick={() => { navigate('/products'); setMenuOpen(false); }} style={{ padding: 14, background: '#5B4632', color: '#FDF9F1', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Start sourcing ↗</button>
                <button onClick={openLogin} style={{ padding: 13, background: 'none', color: '#5B4632', fontSize: 14, border: '1px solid #5B4632', cursor: 'pointer', fontFamily: 'inherit' }}>Sign in</button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
