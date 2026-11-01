import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toggleLogin } from '../../features/auth/authSlice';
import { useBreakpoint, rGutter } from '../../hooks/useBreakpoint';

const linkStyle = { display: 'block', marginBottom: 13, fontSize: 12, color: '#F0DCC0', textDecoration: 'none' };
const heading   = { margin: '0 0 22px', fontFamily: 'inherit', fontSize: 9, fontWeight: 700, letterSpacing: '.14em', color: '#F4D9A0' };

export default function LandingFooter() {
  const dispatch = useDispatch();
  const bp       = useBreakpoint();
  return (
    <footer style={{ background: '#5B4632', color: '#F0DCC0', padding: bp.isMobile ? '40px 0 24px' : '56px 0 22px' }}>
      <div style={rGutter(bp)}>
        <div style={{ display: 'grid', gridTemplateColumns: bp.isMobile ? '1fr 1fr' : '2fr 1fr 1fr 1.3fr', gap: bp.isMobile ? 28 : 40 }}>
          <div style={{ gridColumn: bp.isMobile ? '1 / -1' : 'auto' }}>
            <Link to="/" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 42, fontWeight: 500, color: '#F4D9A0', textDecoration: 'none' }}>globrixa✳</Link>
            <p style={{ fontSize: 12, lineHeight: 1.6, margin: '12px 0 0' }}>Good finds. Better business.<br />A new perspective on wholesale.</p>
          </div>
          <div>
            <h5 style={heading}>FOR BUYERS</h5>
            <Link to="/products" style={linkStyle}>Explore products</Link>
            <Link to="/categories" style={linkStyle}>Shop by category</Link>
            <Link to="/buyer-dashboard/rfqs/new" style={linkStyle}>Your buyer brief</Link>
          </div>
          <div>
            <h5 style={heading}>FOR BRANDS</h5>
            <button onClick={() => dispatch(toggleLogin({ show: true, intent: 'supplier' }))} style={{ ...linkStyle, padding: 0, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Become a seller</button>
            <Link to="/our-story" style={linkStyle}>Our approach</Link>
          </div>
          <div>
            <h5 style={heading}>LET’S BUILD SOMETHING</h5>
            <p style={{ fontSize: 12, lineHeight: 1.6, margin: '0 0 12px' }}>A considered marketplace.<br />For independent businesses.</p>
            <Link to="/contact" style={linkStyle}>Contact us ↗</Link>
          </div>
        </div>
        <div style={{ marginTop: 40, paddingTop: 20, borderTop: '1px solid rgba(244,217,160,.3)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, fontSize: 10 }}>
          <span>© 2026 Globrixa Technologies Pvt. Ltd.</span>
          <span>India · English · INR ₹</span>
          <span style={{ display: 'flex', gap: 16 }}>
            <Link to="/privacy" style={{ color: '#F0DCC0', textDecoration: 'none' }}>Privacy</Link>
            <Link to="/terms" style={{ color: '#F0DCC0', textDecoration: 'none' }}>Terms</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
