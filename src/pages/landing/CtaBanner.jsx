import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleLogin } from '../../features/auth/authSlice';
import { T } from './tokens';
import { IMG } from './images';

export default function CtaBanner() {
  const dispatch = useDispatch();
  const [hovW, setHovW] = useState(false);
  const [hovO, setHovO] = useState(false);

  return (
    <div style={{ position: 'relative', padding: '104px 56px', textAlign: 'center', overflow: 'hidden' }}>

      {/* Photo layer */}
      <img
        src={IMG.delhiTextiles}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center',
          filter: 'saturate(1.3)',
        }}
      />

      {/* Saffron gradient overlay — semi-transparent so photo bleeds through */}
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(145deg, rgba(164,84,22,.93) 0%, rgba(130,65,14,.95) 100%)` }} />

      {/* Subtle mandala pattern */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle stroke='rgba(255,255,255,0.05)' stroke-width='1' cx='30' cy='30' r='28' fill='none'/%3E%3Ccircle stroke='rgba(255,255,255,0.04)' stroke-width='1' cx='30' cy='30' r='16' fill='none'/%3E%3C/svg%3E\")",
        backgroundSize: '60px', pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Eyebrow */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,.18)', borderRadius: 20, padding: '5px 16px', marginBottom: 24 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,.7)', display: 'inline-block', animation: 'ctaPulse 2s ease infinite' }} />
          <span style={{ color: 'rgba(255,255,255,.85)', fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase' }}>Join 5,000+ suppliers today</span>
        </div>

        <h2 style={{
          fontFamily: "'Playfair Display',serif",
          fontSize: 'clamp(38px,5vw,66px)', fontWeight: 900,
          color: '#fff', letterSpacing: -2.5, lineHeight: 1.01, marginBottom: 16,
          textShadow: '0 2px 20px rgba(0,0,0,.2)',
        }}>
          Ready to grow<br/>your business?
        </h2>

        <p style={{ fontSize: 17, color: 'rgba(255,255,255,.76)', lineHeight: 1.78, marginBottom: 46, maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}>
          Join thousands of Indian businesses already sourcing and selling smarter on Globrixa.
        </p>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => dispatch(toggleLogin(true))}
            onMouseEnter={() => setHovW(true)} onMouseLeave={() => setHovW(false)}
            style={{
              padding: '16px 42px', borderRadius: 9, background: hovW ? 'rgba(255,255,255,.95)' : '#fff',
              color: T.td, fontSize: 15, fontWeight: 800, border: 'none', cursor: 'pointer',
              fontFamily: 'inherit', boxShadow: '0 8px 30px rgba(0,0,0,.25)',
              transform: hovW ? 'translateY(-3px) scale(1.02)' : 'none', transition: '.2s',
            }}>
            Start sourcing — it's free
          </button>
          <button
            onClick={() => dispatch(toggleLogin(true))}
            onMouseEnter={() => setHovO(true)} onMouseLeave={() => setHovO(false)}
            style={{
              padding: '15px 40px', borderRadius: 9,
              background: hovO ? 'rgba(255,255,255,.12)' : 'transparent',
              color: 'rgba(255,255,255,.9)', border: '1.5px solid rgba(255,255,255,.38)',
              fontSize: 15, cursor: 'pointer', fontFamily: 'inherit', transition: '.18s',
              transform: hovO ? 'translateY(-2px)' : 'none',
            }}>
            List your brand →
          </button>
        </div>
      </div>

      <style>{`@keyframes ctaPulse { 0%,100%{opacity:1} 50%{opacity:.3} }`}</style>
    </div>
  );
}
