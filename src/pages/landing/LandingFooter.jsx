import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toggleLogin } from '../../features/auth/authSlice';
import { useBreakpoint, rGutter } from '../../hooks/useBreakpoint';

const linkStyle = { display: 'block', marginBottom: 14, fontSize: 12, color: '#F4D9A0', textDecoration: 'none' };
const heading   = { margin: '0 0 24px', fontFamily: 'inherit', fontSize: 9, fontWeight: 700, letterSpacing: '.14em', color: '#F4D9A0' };
const bottomLink = { color: '#F0DCC0', textDecoration: 'none' };

export default function LandingFooter() {
  const dispatch = useDispatch();
  const bp       = useBreakpoint();
  return (
    <footer style={{ background: '#5B4632', color: '#FDF9F1', padding: bp.isMobile ? '40px 0 24px' : '60px 0 22px' }}>
      <div style={rGutter(bp)}>
        <div style={{ display: 'grid', gridTemplateColumns: bp.isMobile ? '1fr 1fr' : bp.isTablet ? '1.3fr 1fr 1fr 1.2fr' : '1.53fr 1fr 1fr 1fr', gap: bp.isMobile ? 28 : 32 }}>
          <div style={{ gridColumn: bp.isMobile ? '1 / -1' : 'auto' }}>
            <Link to="/" aria-label="Globrixa home" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: bp.isMobile ? 38 : 44, fontWeight: 300, lineHeight: 1, color: '#F4D9A0', textDecoration: 'none' }}>
              globrixa<span aria-hidden="true" style={{ color: '#C8792C', fontSize: '.75em', verticalAlign: 'top' }}>✳</span>
            </Link>
            <p style={{ fontSize: 12, lineHeight: 1.7, margin: '16px 0 0' }}>Good finds. Better business.<br />A new perspective on wholesale.</p>
          </div>
          <div>
            <h5 style={heading}>FOR BUYERS</h5>
            <Link to="/products" style={linkStyle}>Explore products</Link>
            <Link to="/categories" style={linkStyle}>Shop by category</Link>
            <Link to="/buyer-dashboard/rfqs/new" style={linkStyle}>Your buyer brief</Link>
          </div>
          <div>
            <h5 style={heading}>FOR BRANDS</h5>
            <button onClick={() => dispatch(toggleLogin({ show: true, intent: 'supplier' }))} style={{ ...linkStyle, padding: 0, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>Become a seller</button>
            <Link to="/about" style={linkStyle}>About us</Link>
            <Link to="/our-story" style={linkStyle}>Our approach</Link>
          </div>
          <div style={{ gridColumn: bp.isMobile ? '1 / -1' : 'auto' }}>
            <h5 style={heading}>LET’S BUILD SOMETHING</h5>
            <p style={{ fontSize: 12, lineHeight: 1.7, margin: '0 0 14px', color: '#F4D9A0' }}>A considered marketplace.<br />For independent businesses.</p>
            <Link to="/our-story" style={linkStyle}>Our Story</Link>
            <Link to="/contact" style={linkStyle}>Contact us <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
        <div style={{ marginTop: bp.isMobile ? 32 : 50, paddingTop: 22, borderTop: '1px solid rgba(244,217,160,.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, fontSize: 10, color: '#F0DCC0' }}>
          <span>© 2026 Globrixa Technologies Pvt. Ltd.</span>
          <span>India · English · INR ₹</span>
          <span style={{ display: 'flex', gap: 16 }}>
            <Link to="/privacy" style={bottomLink}>Privacy</Link>
            <Link to="/terms" style={bottomLink}>Terms</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
