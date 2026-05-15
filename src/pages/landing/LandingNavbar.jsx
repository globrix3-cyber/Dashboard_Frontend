import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleLogin } from '../../features/auth/authSlice';
import { T, btnPrimary, btnGhost } from './tokens';
import { useBreakpoint } from '../../hooks/useBreakpoint';

const NAV_LINKS = ['Discover', 'Suppliers', 'Pricing'];

export default function LandingNavbar() {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const bp         = useBreakpoint();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query,    setQuery]    = useState('');

  const openLogin = () => { dispatch(toggleLogin(true)); setMenuOpen(false); };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(toggleLogin(true));
  };

  return (
    <>
      <nav style={{
        background: 'rgba(247,241,232,.97)', backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${T.bs}`,
        padding: bp.isMobile ? '0 16px' : bp.isTablet ? '0 28px' : '0 56px',
        height: bp.isMobile ? 58 : 68,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 1000, gap: 16,
      }}>

        {/* Logo */}
        <button
          onClick={() => navigate('/')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }}
        >
          <span style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: bp.isMobile ? 19 : 23, fontWeight: 900, color: T.ink, letterSpacing: '-.5px' }}>
            Globri<span style={{ color: T.t }}>xa</span>
          </span>
        </button>

        {/* Search bar — hidden on mobile */}
        {!bp.isMobile && (
          <form onSubmit={handleSearch} style={{
            flex: 1, maxWidth: 500, background: T.w,
            border: `1.5px solid ${T.b}`, borderRadius: 10,
            height: bp.isTablet ? 40 : 44,
            display: 'flex', alignItems: 'center', padding: '0 6px 0 14px', gap: 8,
            boxShadow: '0 2px 8px rgba(28,25,21,.07)',
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={T.mu} strokeWidth="2" style={{ flexShrink: 0 }}>
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => dispatch(toggleLogin(true))}
              placeholder="Search products, suppliers, categories…"
              style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: T.ink, fontFamily: 'inherit', width: '100%' }}
            />
            <button type="submit" style={{ background: T.t, border: 'none', borderRadius: 7, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', fontSize: 13, flexShrink: 0 }}>→</button>
          </form>
        )}

        {/* Nav links — desktop only */}
        {bp.isDesktop && (
          <div style={{ display: 'flex', gap: 2 }}>
            {NAV_LINKS.map(l => (
              <button key={l} onClick={openLogin} style={{ padding: '7px 13px', borderRadius: 7, fontSize: 13, color: T.is, cursor: 'pointer', fontWeight: 500, background: 'none', border: 'none', fontFamily: 'inherit', transition: 'background .15s, color .15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = T.tl; e.currentTarget.style.color = T.t; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = T.is; }}
              >{l}</button>
            ))}
          </div>
        )}

        {/* Auth buttons — desktop/tablet */}
        {!bp.isMobile ? (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
            <button onClick={openLogin} style={{ ...btnGhost, padding: bp.isTablet ? '7px 14px' : '8px 18px', fontSize: 13 }}>
              Sign in
            </button>
            <button onClick={openLogin} style={{ ...btnPrimary, padding: bp.isTablet ? '8px 16px' : '9px 20px', fontSize: 13 }}>
              Join free
            </button>
          </div>
        ) : (
          /* Hamburger — mobile only */
          <button
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, display: 'flex', flexDirection: 'column', gap: 5 }}
          >
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: 'block', width: 22, height: 2, borderRadius: 2, background: T.ink,
                transition: 'transform .22s, opacity .22s',
                transform: menuOpen
                  ? i === 0 ? 'translateY(7px) rotate(45deg)'
                    : i === 2 ? 'translateY(-7px) rotate(-45deg)'
                    : 'scaleX(0)'
                  : 'none',
                opacity: menuOpen && i === 1 ? 0 : 1,
              }} />
            ))}
          </button>
        )}
      </nav>

      {/* Mobile drawer */}
      {bp.isMobile && (
        <div style={{
          position: 'fixed', top: 58, left: 0, right: 0, bottom: 0,
          background: 'rgba(15,14,13,.6)', backdropFilter: 'blur(4px)',
          zIndex: 999, opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? 'auto' : 'none',
          transition: 'opacity .22s',
        }} onClick={() => setMenuOpen(false)}>
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: T.c, borderBottom: `1px solid ${T.bs}`,
              padding: '20px 20px 28px',
              transform: menuOpen ? 'translateY(0)' : 'translateY(-12px)',
              transition: 'transform .22s ease',
            }}
          >
            {/* Mobile search */}
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginBottom: 20, background: T.w, border: `1.5px solid ${T.b}`, borderRadius: 10, padding: '0 8px 0 14px', height: 44, alignItems: 'center' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={T.mu} strokeWidth="2" style={{ flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search products, suppliers…"
                style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 14, fontFamily: 'inherit', color: T.ink }}
              />
              <button type="submit" style={{ background: T.t, border: 'none', borderRadius: 7, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>→</button>
            </form>

            {/* Nav links */}
            {NAV_LINKS.map(l => (
              <button key={l} onClick={openLogin} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '13px 4px', fontSize: 15, fontWeight: 600, color: T.ink, background: 'none', border: 'none', borderBottom: `1px solid ${T.bs}`, cursor: 'pointer', fontFamily: 'inherit' }}>
                {l}
              </button>
            ))}

            {/* Auth */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
              <button onClick={openLogin} style={{ ...btnPrimary, width: '100%', justifyContent: 'center', padding: '13px 0', fontSize: 14 }}>
                Join free — it's free
              </button>
              <button onClick={openLogin} style={{ ...btnGhost, width: '100%', justifyContent: 'center', padding: '12px 0', fontSize: 14, border: `1.5px solid ${T.b}`, borderRadius: 8 }}>
                Sign in
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
