import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleLogin } from '../../features/auth/authSlice';
import { T, eyebrow, btnPrimary } from './tokens';
import { useBreakpoint, rPad, rW } from '../../hooks/useBreakpoint';

export default function NewsletterSection() {
  const dispatch  = useDispatch();
  const bp        = useBreakpoint();
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(toggleLogin(true));
  };

  return (
    <div style={{ background: T.c, padding: rPad(bp), borderTop: `1px solid ${T.bs}` }}>
      <div style={{ ...rW, maxWidth: 560 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ ...eyebrow, marginBottom: 12 }}>Stay informed</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: bp.isMobile ? '26px' : 32, fontWeight: 700, color: T.ink, letterSpacing: -1, marginBottom: 10 }}>Stay ahead of the market</h2>
          <p style={{ fontSize: bp.isMobile ? 14 : 15, color: T.mu, lineHeight: 1.75, marginBottom: 24 }}>Weekly sourcing insights, new supplier alerts, and category trend reports — delivered to your inbox.</p>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, flexDirection: bp.isMobile ? 'column' : 'row' }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your business email"
              style={{ flex: 1, border: `1.5px solid ${T.b}`, borderRadius: 8, padding: '13px 16px', fontSize: 14, fontFamily: 'inherit', background: T.w, color: T.ink, outline: 'none', width: bp.isMobile ? '100%' : 'auto' }}
              onFocus={e => { e.currentTarget.style.borderColor = T.t; }}
              onBlur={e => { e.currentTarget.style.borderColor = T.b; }}
            />
            <button type="submit" style={{ ...btnPrimary, whiteSpace: 'nowrap', padding: '13px 24px', justifyContent: 'center' }}>Subscribe free</button>
          </form>
          <p style={{ fontSize: 11, color: T.mu, marginTop: 12 }}>No spam. Unsubscribe anytime. Join 12,000+ procurement professionals.</p>
        </div>
      </div>
    </div>
  );
}
