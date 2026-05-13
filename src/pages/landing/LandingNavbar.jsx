import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleLogin } from '../../features/auth/authSlice';
import { T, btnPrimary, btnGhost } from './tokens';

export default function LandingNavbar() {
  const dispatch = useDispatch();
  const [hoverSign, setHoverSign] = useState(false);
  const [hoverJoin, setHoverJoin] = useState(false);

  return (
    <nav style={{
      background: 'rgba(247,241,232,.95)', backdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${T.bs}`, padding: '0 56px', height: 68,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 200, gap: 24,
    }}>
      <div style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize: 23, fontWeight: 900, color: T.ink, letterSpacing: '-.5px', flexShrink: 0 }}>
        Globri<span style={{ color: T.t }}>xa</span>
      </div>

      <div style={{
        flex: 1, maxWidth: 540, background: T.w,
        border: `1.5px solid ${T.b}`, borderRadius: 10, height: 44,
        display: 'flex', alignItems: 'center', padding: '0 6px 0 16px', gap: 10,
        boxShadow: '0 2px 8px rgba(28,25,21,.07)',
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.mu} strokeWidth="2" style={{ flexShrink: 0 }}>
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input type="text" placeholder="Search products, suppliers, categories…"
          style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 14, color: T.ink, fontFamily: 'inherit', width: '100%' }} />
        <button style={{ background: T.t, border: 'none', borderRadius: 7, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', fontSize: 14, flexShrink: 0 }}>→</button>
      </div>

      <div style={{ display: 'flex', gap: 2 }}>
        {['Discover', 'Suppliers', 'Pricing'].map(l => (
          <span key={l} style={{ padding: '7px 13px', borderRadius: 7, fontSize: 13, color: T.is, cursor: 'pointer', fontWeight: 500 }}>{l}</span>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
        <button
          onClick={() => dispatch(toggleLogin(true))}
          onMouseEnter={() => setHoverSign(true)} onMouseLeave={() => setHoverSign(false)}
          style={{ ...btnGhost, padding: '8px 18px', fontSize: 13, ...(hoverSign ? { borderColor: T.t, background: T.tl, color: T.t } : {}) }}>
          Sign in
        </button>
        <button
          onClick={() => dispatch(toggleLogin(true))}
          onMouseEnter={() => setHoverJoin(true)} onMouseLeave={() => setHoverJoin(false)}
          style={{ ...btnPrimary, padding: '9px 20px', fontSize: 13, ...(hoverJoin ? { background: `linear-gradient(135deg,${T.td},#8A5226)`, transform: 'translateY(-1px)' } : {}) }}>
          Join free
        </button>
      </div>
    </nav>
  );
}
