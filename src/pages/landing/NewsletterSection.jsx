import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleLogin } from '../../features/auth/authSlice';
import { useBreakpoint } from '../../hooks/useBreakpoint';

const INK = '#5B4632';

export default function NewsletterSection() {
  const dispatch = useDispatch();
  const bp       = useBreakpoint();
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(toggleLogin(true));
  };

  return (
    <section style={{ display: 'grid', gridTemplateColumns: bp.isMobile ? '1fr' : '1fr 1fr', background: '#FDF9F1' }}>
      <img src="/images/v3/newsletter-coffee-table.jpeg" alt="Natural wooden coffee table in a warm living room" loading="lazy" decoding="async"
        style={{ width: '100%', height: bp.isMobile ? 280 : '100%', minHeight: bp.isMobile ? 0 : 560, maxHeight: bp.isMobile ? 280 : 720, objectFit: 'cover', display: 'block' }} />
      <div style={{ padding: bp.isMobile ? '36px 18px' : '0 58px', display: 'flex', flexDirection: 'column', justifyContent: 'center', color: INK }}>
        <div style={{ fontSize: 26, lineHeight: 1 }}>✳</div>
        <div style={{ fontSize: 9, letterSpacing: '.22em', margin: '16px 0 14px' }}>THE GLOBRIXA EDIT</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: bp.isMobile ? 42 : 62, fontWeight: 600, margin: 0, lineHeight: 1.1 }}>Stay inspired.</h2>
        <p style={{ fontSize: 15, lineHeight: 1.7, margin: '16px 0 28px', maxWidth: 520 }}>
          Discover fresh finds, homeware trends and the latest from Globrixa. Inspiration for your store’s next chapter, delivered to your inbox.
        </p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="newsletter-email" style={{ display: 'block', fontSize: 12, marginBottom: 8 }}>Your business email</label>
          <div style={{ display: 'flex', flexDirection: bp.isMobile ? 'column' : 'row', maxWidth: 605 }}>
            <input id="newsletter-email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@yourbusiness.com"
              style={{ flex: 1, minWidth: 0, minHeight: 49, padding: '0 13px', border: `1px solid ${INK}`, background: '#FDF9F1', color: INK, fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
            <button type="submit" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18, minHeight: 49, padding: '0 16px', background: INK, color: '#FDF9F1', fontSize: 12, border: 'none', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
              Sign up to our newsletter <span>↗</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
