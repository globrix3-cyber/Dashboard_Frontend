import { useDispatch } from 'react-redux';
import { toggleLogin } from '../../features/auth/authSlice';
import { useBreakpoint } from '../../hooks/useBreakpoint';

export default function SellerBanner() {
  const dispatch = useDispatch();
  const bp       = useBreakpoint();
  return (
    <section style={{ position: 'relative', overflow: 'hidden', background: '#5B4632', padding: bp.isMobile ? '40px 18px' : '50px 86px', display: 'flex', justifyContent: 'space-between', alignItems: bp.isMobile ? 'flex-start' : 'center', flexDirection: bp.isMobile ? 'column' : 'row', gap: 24 }}>
      <span aria-hidden="true" style={{ position: 'absolute', left: '58%', top: '50%', transform: 'translate(-50%,-50%)', fontSize: 240, lineHeight: 1, color: '#79634E', opacity: .5, pointerEvents: 'none' }}>✳</span>
      <div style={{ position: 'relative' }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.2em', color: '#F4D9A0', marginBottom: 16 }}>CALLING ALL INDEPENDENT BRANDS</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: bp.isMobile ? 32 : 42, fontWeight: 500, lineHeight: 1.1, color: '#F4D9A0', margin: 0 }}>
          Make something great?<br />Let’s help it find its people.
        </h2>
      </div>
      <button onClick={() => dispatch(toggleLogin({ show: true, intent: 'supplier' }))}
        style={{ position: 'relative', display: 'flex', gap: 38, flexShrink: 0, padding: '18px 23px', background: '#F4D9A0', color: '#2B2016', fontSize: 13, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
        Explore selling on Globrixa <span>↗</span>
      </button>
    </section>
  );
}
