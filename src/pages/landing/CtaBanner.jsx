import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleLogin } from '../../features/auth/authSlice';
import { T } from './tokens';

export default function CtaBanner() {
  const dispatch = useDispatch();
  const [hovW, setHovW] = useState(false);
  const [hovO, setHovO] = useState(false);

  return (
    <div style={{ background: `linear-gradient(145deg,${T.t} 0%,${T.td} 100%)`, padding: '104px 56px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle stroke='rgba(255,255,255,0.06)' stroke-width='1' cx='30' cy='30' r='28' fill='none'/%3E%3Ccircle stroke='rgba(255,255,255,0.04)' stroke-width='1' cx='30' cy='30' r='16' fill='none'/%3E%3C/svg%3E\")", backgroundSize: '60px', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(38px,5vw,66px)', fontWeight: 900, color: '#fff', letterSpacing: -2.5, lineHeight: 1.01, marginBottom: 16 }}>Ready to grow<br/>your business?</h2>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,.76)', lineHeight: 1.78, marginBottom: 46, maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}>Join thousands of Indian businesses already sourcing and selling smarter on Globrixa.</p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => dispatch(toggleLogin(true))}
            onMouseEnter={() => setHovW(true)} onMouseLeave={() => setHovW(false)}
            style={{ padding: '15px 40px', borderRadius: 9, background: '#fff', color: T.t, fontSize: 15, fontWeight: 800, border: 'none', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 6px 24px rgba(0,0,0,.2)', transform: hovW ? 'translateY(-2px)' : 'none', transition: '.18s' }}>
            Start sourcing — it's free
          </button>
          <button
            onClick={() => dispatch(toggleLogin(true))}
            onMouseEnter={() => setHovO(true)} onMouseLeave={() => setHovO(false)}
            style={{ padding: '14px 38px', borderRadius: 9, background: hovO ? 'rgba(255,255,255,.1)' : 'transparent', color: 'rgba(255,255,255,.88)', border: '1.5px solid rgba(255,255,255,.35)', fontSize: 15, cursor: 'pointer', fontFamily: 'inherit', transition: '.18s' }}>
            List your brand →
          </button>
        </div>
      </div>
    </div>
  );
}
