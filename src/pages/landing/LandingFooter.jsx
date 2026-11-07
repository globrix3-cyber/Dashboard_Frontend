import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toggleLogin } from '../../features/auth/authSlice';
import { useBreakpoint, rGutter } from '../../hooks/useBreakpoint';

// Layout matched to the reference: 283px tall at 1440, 563px at 390. Link line boxes are 14px on a 27px pitch.
const linkStyle = { display: 'block', marginBottom: 13, fontSize: 11, fontWeight: 400, lineHeight: '14px', color: '#F4D9A0', textDecoration: 'none' };
const lastLink  = { ...linkStyle, marginBottom: 0 };
const heading   = { margin: '11px 0 23px', fontFamily: 'inherit', fontSize: 9, fontWeight: 700, lineHeight: '12px', letterSpacing: '1px', color: '#F4D9A0' };
const bottomLink = { color: '#F0DCC0', textDecoration: 'none' };

export default function LandingFooter() {
  const dispatch = useDispatch();
  const bp       = useBreakpoint();
  const side     = bp.isMobile ? 17 : bp.isTablet ? 32 : 62;
  return (
    <footer style={{ background: '#5B4632', color: '#FDF9F1', padding: '54px 0 0' }}>
      <div style={{ ...rGutter(bp), paddingLeft: side, paddingRight: side }}>
        <div style={{ display: 'grid', gridTemplateColumns: bp.isMobile ? '1fr 1fr' : bp.isTablet ? '1.3fr 1fr 1fr 1.2fr' : '409fr 255fr 255fr 307fr', gap: bp.isMobile ? '35px 25px' : 30 }}>
          <div style={{ gridColumn: bp.isMobile ? '1 / -1' : 'auto', paddingTop: bp.isMobile ? 5 : 6 }}>
            <Link to="/" aria-label="Globrixa home" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: bp.isMobile ? 37 : bp.isTablet ? 40 : 43, fontWeight: 600, letterSpacing: '-2.2px', lineHeight: 1, color: '#F4D9A0', textDecoration: 'none' }}>
              globrixa<span aria-hidden="true" style={{ color: '#C8792C', fontSize: '.75em', letterSpacing: 0, verticalAlign: 'top' }}>✳</span>
            </Link>
            <p style={{ fontSize: 11, lineHeight: '20px', margin: '15px 0 0', color: '#F0DCC0' }}>Good finds. Better business.<br />A new perspective on wholesale.</p>
          </div>
          <div>
            <h5 style={heading}>FOR BUYERS</h5>
            <Link to="/products" style={linkStyle}>Explore products</Link>
            <Link to="/categories" style={linkStyle}>Shop by category</Link>
            <Link to="/buyer-dashboard/rfqs/new" style={lastLink}>Your buyer brief</Link>
          </div>
          <div>
            <h5 style={heading}>FOR BRANDS</h5>
            <button onClick={() => dispatch(toggleLogin({ show: true, intent: 'supplier' }))} style={{ ...linkStyle, padding: 0, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>Become a seller</button>
            <Link to="/about" style={linkStyle}>About us</Link>
            <Link to="/our-story" style={lastLink}>Our approach</Link>
          </div>
          <div style={{ marginTop: bp.isMobile ? 2 : 0 }}>
            <h5 style={heading}>LET’S BUILD SOMETHING</h5>
            <p style={{ fontSize: 11, lineHeight: '20px', margin: `0 0 ${bp.isMobile ? 10 : 11}px`, color: '#F0DCC0' }}>A considered marketplace.<br />For independent businesses.</p>
            <Link to="/our-story" style={linkStyle}>Our Story</Link>
            <Link to="/contact" style={lastLink}>Contact us <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
        <div style={{ marginTop: bp.isMobile ? 32 : 34, padding: '22px 0', borderTop: '1px solid rgba(244,217,160,.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, fontSize: bp.isMobile ? 8 : 9, lineHeight: '12px', color: '#F0DCC0' }}>
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
