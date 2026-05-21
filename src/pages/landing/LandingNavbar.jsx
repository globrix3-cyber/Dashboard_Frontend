import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleLogin } from '../../features/auth/authSlice';
import { useBreakpoint } from '../../hooks/useBreakpoint';

export default function LandingNavbar() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const bp        = useBreakpoint();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery]       = useState('');

  const openLogin  = () => { dispatch(toggleLogin(true)); setMenuOpen(false); };
  const handleSearch = (e) => { e.preventDefault(); dispatch(toggleLogin(true)); };

  /* ── Desktop / Tablet ───────────────────────────────────────────────── */
  if (!bp.isMobile) return (
    <nav style={{
      background: '#fff',
      borderBottom: '1px solid #E8E2D8',
      height: bp.isTablet ? 58 : 64,
      display: 'flex',
      alignItems: 'center',
      padding: bp.isTablet ? '0 24px' : '0 48px',
      position: 'sticky', top: 0, zIndex: 1000,
      gap: 0,
    }}>

      {/* Logo — far left */}
      <button
        onClick={() => navigate('/')}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }}
      >
        <span style={{
          fontFamily: "'DM Sans',sans-serif",
          fontSize: bp.isTablet ? 13 : 15,
          fontWeight: 800,
          color: '#1C1815',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}>
          G L O B R I X A
        </span>
      </button>

      {/* All categories — desktop only */}
      {!bp.isTablet && (
        <button
          onClick={openLogin}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '7px 14px',
            marginLeft: 24,
            borderRadius: 6,
            border: '1.5px solid #E0DAD0',
            background: '#fff',
            fontSize: 13, fontWeight: 500, color: '#1C1815',
            cursor: 'pointer', fontFamily: 'inherit',
            flexShrink: 0, whiteSpace: 'nowrap',
            transition: 'border-color .15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#C4773A'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#E0DAD0'; }}
        >
          All categories
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}

      {/* Search — grows to fill all remaining center space */}
      <form
        onSubmit={handleSearch}
        style={{ flex: 1, margin: bp.isTablet ? '0 16px' : '0 28px', position: 'relative' }}
      >
        <div
          style={{
            display: 'flex', alignItems: 'center',
            border: '1.5px solid #E0DAD0',
            borderRadius: 100,
            height: bp.isTablet ? 38 : 42,
            padding: '0 16px', gap: 10,
            background: '#FAFAF8',
            transition: 'border-color .15s',
          }}
          onFocusCapture={e => { e.currentTarget.style.borderColor = '#C4773A'; }}
          onBlurCapture={e => { e.currentTarget.style.borderColor = '#E0DAD0'; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9A9088" strokeWidth="2" style={{ flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => dispatch(toggleLogin(true))}
            placeholder="Search wholesale products or brands"
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: '#1C1815', fontFamily: 'inherit' }}
          />
        </div>
      </form>

      {/* Right nav — pushed to far right by the flex-1 search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, flexShrink: 0 }}>
        {!bp.isTablet && (
          <>
            <NavLink onClick={() => navigate('/blog')}>Blog</NavLink>
            <NavLink onClick={openLogin}>Sign up to sell</NavLink>
          </>
        )}
        <NavLink onClick={openLogin}>Sign in</NavLink>
        <button
          onClick={openLogin}
          style={{
            marginLeft: 10,
            padding: bp.isTablet ? '8px 18px' : '9px 22px',
            borderRadius: 100,
            background: '#1C1815', color: '#fff',
            fontSize: 13, fontWeight: 600,
            border: 'none', cursor: 'pointer',
            fontFamily: 'inherit', whiteSpace: 'nowrap',
            transition: 'background .15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#3D3730'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#1C1815'; }}
        >
          Join free
        </button>
      </div>
    </nav>
  );

  /* ── Mobile ─────────────────────────────────────────────────────────── */
  return (
    <>
      <nav style={{
        background: '#fff', borderBottom: '1px solid #E8E2D8',
        height: 54, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 16px',
        position: 'sticky', top: 0, zIndex: 1000,
      }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 800, color: '#1C1815', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            G L O B R I X A
          </span>
        </button>
        <button
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Menu"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, display: 'flex', flexDirection: 'column', gap: 5 }}
        >
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              display: 'block', width: 22, height: 2, borderRadius: 2, background: '#1C1815',
              transition: 'transform .22s, opacity .22s',
              transform: menuOpen
                ? (i === 0 ? 'translateY(7px) rotate(45deg)' : i === 2 ? 'translateY(-7px) rotate(-45deg)' : 'scaleX(0)')
                : 'none',
              opacity: menuOpen && i === 1 ? 0 : 1,
            }} />
          ))}
        </button>
      </nav>

      {menuOpen && (
        <div
          style={{ position: 'fixed', top: 54, left: 0, right: 0, bottom: 0, background: 'rgba(15,14,13,.55)', backdropFilter: 'blur(4px)', zIndex: 999 }}
          onClick={() => setMenuOpen(false)}
        >
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', padding: '20px 18px 28px', borderBottom: '1px solid #E8E2D8' }}>
            <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1.5px solid #E0DAD0', borderRadius: 100, height: 44, padding: '0 14px', marginBottom: 18, background: '#FAFAF8' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9A9088" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search products or brands…" style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 14, fontFamily: 'inherit', color: '#1C1815' }} />
            </form>
            {[
              ['Blog', () => { navigate('/blog'); setMenuOpen(false); }],
              ['Our Story', () => { navigate('/our-story'); setMenuOpen(false); }],
              ['Sign up to sell', openLogin],
            ].map(([label, fn]) => (
              <button key={label} onClick={fn} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '13px 4px', fontSize: 15, fontWeight: 500, color: '#1C1815', background: 'none', border: 'none', borderBottom: '1px solid #F0EBE4', cursor: 'pointer', fontFamily: 'inherit' }}>
                {label}
              </button>
            ))}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
              <button onClick={openLogin} style={{ width: '100%', padding: '13px', borderRadius: 100, background: '#1C1815', color: '#fff', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Join free</button>
              <button onClick={openLogin} style={{ width: '100%', padding: '12px', borderRadius: 100, background: 'none', color: '#1C1815', fontSize: 14, fontWeight: 500, border: '1.5px solid #E0DAD0', cursor: 'pointer', fontFamily: 'inherit' }}>Sign in</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function NavLink({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{ padding: '6px 14px', fontSize: 13, fontWeight: 500, color: '#5A5248', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', borderRadius: 6, transition: 'color .15s', whiteSpace: 'nowrap' }}
      onMouseEnter={e => { e.currentTarget.style.color = '#1C1815'; }}
      onMouseLeave={e => { e.currentTarget.style.color = '#5A5248'; }}
    >
      {children}
    </button>
  );
}
