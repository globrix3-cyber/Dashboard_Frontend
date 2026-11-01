import { Link } from 'react-router-dom';
import { useBreakpoint, rGutter } from '../../hooks/useBreakpoint';

const COLS = [
  { heading: 'FOR BUYERS', links: [['Explore products', '/products'], ['Shop by category', '/categories']] },
  { heading: 'COMPANY',    links: [['Our Story', '/our-story'], ['Blog', '/blog'], ['Careers', '/careers'], ['Contact', '/contact']] },
  { heading: 'LEGAL',      links: [['Privacy Policy', '/privacy'], ['Terms of Service', '/terms']] },
];

export default function LandingFooter() {
  const bp = useBreakpoint();
  return (
    <footer style={{ background: '#5B4632', color: '#F4D9A0', padding: bp.isMobile ? '40px 0 24px' : '56px 0 28px' }}>
      <div style={rGutter(bp)}>
        <div style={{ display: 'grid', gridTemplateColumns: bp.isMobile ? '1fr 1fr' : '2fr 1fr 1fr 1fr', gap: bp.isMobile ? 28 : 40 }}>
          <div style={{ gridColumn: bp.isMobile ? '1 / -1' : 'auto' }}>
            <Link to="/" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 46, fontWeight: 500, color: '#F4D9A0', textDecoration: 'none' }}>globrixa✳</Link>
            <p style={{ fontSize: 14, lineHeight: 1.6, margin: '14px 0 0', color: '#F0DCC0' }}>Good finds. Better business.<br />A new perspective on wholesale.</p>
          </div>
          {COLS.map(col => (
            <div key={col.heading}>
              <h5 style={{ margin: '0 0 18px', fontSize: 10, fontWeight: 700, letterSpacing: '.14em' }}>{col.heading}</h5>
              {col.links.map(([label, to]) => (
                <Link key={label} to={to} style={{ display: 'block', marginBottom: 11, fontSize: 13, color: '#F0DCC0', textDecoration: 'none' }}>{label}</Link>
              ))}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 36, paddingTop: 20, borderTop: '1px solid rgba(244,217,160,.25)', fontSize: 11, color: '#F0DCC0' }}>
          © 2026 Globrixa Technologies Pvt. Ltd.
        </div>
      </div>
    </footer>
  );
}
