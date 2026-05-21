import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleLogin } from '../../features/auth/authSlice';
import { T } from './tokens';
import { IMG } from './images';
import { useBreakpoint } from '../../hooks/useBreakpoint';

export default function CtaBanner() {
  const dispatch  = useDispatch();
  const bp        = useBreakpoint();
  const [hovW, setHovW] = useState(false);
  const openLogin = () => dispatch(toggleLogin(true));

  const pad = bp.isMobile ? '72px 18px' : bp.isTablet ? '88px 32px' : '104px 56px';

  return (
    <div style={{ position: 'relative', padding: pad, textAlign: 'center', overflow: 'hidden' }}>
      <img src={IMG.delhiTextiles} alt="" aria-hidden="true" loading="lazy" decoding="async" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', filter: 'saturate(1.3)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(145deg,rgba(164,84,22,.93) 0%,rgba(130,65,14,.95) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle stroke='rgba(255,255,255,0.05)' stroke-width='1' cx='30' cy='30' r='28' fill='none'/%3E%3C/svg%3E\")", backgroundSize: '60px', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,.18)', borderRadius: 20, padding: '5px 16px', marginBottom: 22 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,.7)', display: 'inline-block', animation: 'ctaPulse 2s ease infinite' }} />
          <span style={{ color: 'rgba(255,255,255,.85)', fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase' }}>Join 5,000+ suppliers today</span>
        </div>

        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: bp.isMobile ? '32px' : bp.isTablet ? '46px' : 'clamp(38px,5vw,66px)', fontWeight: 900, color: '#fff', letterSpacing: bp.isMobile ? -1.5 : -2.5, lineHeight: 1.04, marginBottom: 14, textShadow: '0 2px 20px rgba(0,0,0,.2)' }}>
          Ready to grow<br/>your business?
        </h2>

        <p style={{ fontSize: bp.isMobile ? 15 : 17, color: 'rgba(255,255,255,.76)', lineHeight: 1.78, marginBottom: 38, maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}>
          Join thousands of Indian businesses already sourcing and selling smarter on Globrixa.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={openLogin} onMouseEnter={() => setHovW(true)} onMouseLeave={() => setHovW(false)} style={{ padding: bp.isMobile ? '13px 28px' : '16px 42px', borderRadius: 9, background: hovW ? 'rgba(255,255,255,.95)' : '#fff', color: T.td, fontSize: bp.isMobile ? 14 : 15, fontWeight: 800, border: 'none', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 8px 30px rgba(0,0,0,.25)', transform: hovW ? 'translateY(-3px) scale(1.02)' : 'none', transition: '.2s' }}>
            Start sourcing — it's free
          </button>
        </div>
      </div>
      <style>{`@keyframes ctaPulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
    </div>
  );
}
