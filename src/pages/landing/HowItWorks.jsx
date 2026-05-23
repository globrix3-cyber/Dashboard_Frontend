import { useDispatch } from 'react-redux';
import { toggleLogin } from '../../features/auth/authSlice';
import { T, eyebrow, btnPrimary } from './tokens';
import { useBreakpoint, rPad, rW } from '../../hooks/useBreakpoint';

const STEPS = [
  { n: '01', icon: '🔐', title: 'Create your account',   desc: 'Sign up as a buyer or supplier. GST-based verification completes in under 24 hours — no paperwork, no delays.' },
  { n: '02', icon: '🔍', title: 'Browse or post an RFQ', desc: 'Search 50,000+ products across 24 categories, or post requirements and receive quotes from verified suppliers instantly.' },
  { n: '03', icon: '🚀', title: 'Order with confidence', desc: 'Pay on net 30 terms, track shipments in real time, and manage contracts digitally — all under one trade-assured roof.' },
];

export default function HowItWorks() {
  const dispatch  = useDispatch();
  const bp        = useBreakpoint();
  const openLogin = () => dispatch(toggleLogin(true));

  const cols = bp.isMobile ? '1fr' : bp.isTablet ? '1fr' : 'repeat(3,1fr)';

  return (
    <section style={{ background: T.cd, padding: rPad(bp) }}>
      <div style={{ ...rW }}>
        <div style={{ textAlign: 'center', marginBottom: bp.isMobile ? 32 : 48 }}>
          <div style={{ ...eyebrow, display: 'inline-block', marginBottom: 10 }}>Simple Process</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond','Playfair Display',serif", fontSize: bp.isMobile ? '26px' : 'clamp(26px,3vw,40px)', fontWeight: 700, color: T.ink, letterSpacing: -1, lineHeight: 1.1, textAlign: 'center' }}>Up and running in minutes</h2>
          <p style={{ fontSize: 15, color: T.mu, marginTop: 10, maxWidth: 440, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.7 }}>No lengthy onboarding. Discover, connect, and transact — all in one place.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: cols, gap: bp.isMobile ? 12 : 2 }}>
          {STEPS.map((s, i) => (
            <div key={s.n} style={{
              background: T.w, padding: bp.isMobile ? '32px 24px' : '44px 38px',
              borderRadius: bp.isMobile ? 16
                : i === 0 ? '16px 0 0 16px'
                : i === 2 ? '0 16px 16px 0' : 0,
              borderLeft: !bp.isMobile && i > 0 ? `1px solid ${T.bs}` : 'none',
              borderTop: bp.isMobile && i > 0 ? `1px solid ${T.bs}` : 'none',
            }}>
              <div style={{ fontFamily: "'Cormorant Garamond','Playfair Display',serif", fontSize: bp.isMobile ? 38 : 48, fontWeight: 900, WebkitTextStroke: `2px ${T.t}`, color: 'transparent', lineHeight: 1, marginBottom: 16 }}>{s.n}</div>
              <div style={{ fontSize: 26, marginBottom: 14 }}>{s.icon}</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: T.ink, marginBottom: 9 }}>{s.title}</div>
              <p style={{ fontSize: 14, color: T.mu, lineHeight: 1.75 }}>{s.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 36 }}>
          <button onClick={openLogin} style={{ ...btnPrimary, padding: '13px 34px', fontSize: 14 }}>
            Get started free →
          </button>
        </div>
      </div>
    </section>
  );
}
