import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone } from 'lucide-react';
import { useBreakpoint, rGutter } from '../../hooks/useBreakpoint';

const CREAM = '#F0DCC0';
const GOLD  = '#F4D9A0';

const QUICK_LINKS = [
  { to: '/',         label: 'Home' },
  { to: '/about',    label: 'About us' },
  { to: '/products', label: 'Products' },
  { to: '/blog',     label: 'Blogs' },
  { to: '/contact',  label: 'Contact Us' },
];
// No dedicated shipping page exists yet; shipping terms live in the Terms & Conditions.
const POLICIES = [
  { to: '/terms',   label: 'Terms & Conditions' },
  { to: '/terms',   label: 'Shipping Policy' },
  { to: '/privacy', label: 'Privacy Policy' },
  { href: '#faq',   label: 'FAQs' },
];

// Reference layout: 1440px → 396px tall (4 columns 409/255/255/307 with 30px gaps, 62px sides);
// 390px → 730px tall (brand, then Quick Links | Policies, then Address; 16.8px sides).
export default function LandingFooter() {
  const bp   = useBreakpoint();
  const m    = bp.isMobile;
  const side = m ? 16.8 : bp.isTablet ? 32 : 62;
  const link = { display: 'block', fontSize: 11, fontWeight: 400, lineHeight: '19.8px', color: CREAM, textDecoration: 'none' };
  const heading = { margin: `0 0 ${m ? 20 : 24}px`, fontFamily: "'Canela', 'Cormorant Garamond', Georgia, serif", fontSize: m ? 25 : 26, fontWeight: 300, lineHeight: 1.2, letterSpacing: 'normal', color: GOLD };
  const list = { display: 'flex', flexDirection: 'column', gap: m ? 14.75 : 16, margin: 0, padding: 0, listStyle: 'none' };
  const colTop = m ? 0 : 6;
  const icon = { flexShrink: 0, marginTop: 2 };
  return (
    <footer style={{ background: '#5B4632', color: CREAM, padding: '54px 0 0' }}>
      <div style={{ ...rGutter(bp), paddingLeft: side, paddingRight: side }}>
        <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr 1fr' : bp.isTablet ? '1.3fr 1fr 1fr 1.2fr' : '409fr 255fr 255fr 307fr', columnGap: m ? 25 : 30, rowGap: 41 }}>
          <div style={{ gridColumn: m ? '1 / -1' : 'auto', paddingTop: 1 }}>
            <Link to="/" aria-label="Globrixa home" style={{ display: 'inline-block', lineHeight: 'normal', fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: m ? 27 : 30, fontWeight: 600, letterSpacing: m ? '2.5px' : '3px', color: GOLD, textDecoration: 'none' }}>
              GLOBRIXA
            </Link>
            <p style={{ fontSize: 11, lineHeight: '19.8px', margin: '11px 0 0', color: CREAM }}>Crafted with character.<br />Sourced for your store.</p>
          </div>
          <nav aria-label="Quick links" style={{ paddingTop: colTop }}>
            <h2 style={heading}>Quick Links</h2>
            <ul style={list}>
              {QUICK_LINKS.map(l => <li key={l.label}><Link to={l.to} style={link}>{l.label}</Link></li>)}
            </ul>
          </nav>
          <nav aria-label="Policies" style={{ paddingTop: colTop }}>
            <h2 style={heading}>Policies</h2>
            <ul style={list}>
              {POLICIES.map(l => <li key={l.label}>{l.href ? <a href={l.href} style={link}>{l.label}</a> : <Link to={l.to} style={link}>{l.label}</Link>}</li>)}
            </ul>
          </nav>
          <div style={{ paddingTop: colTop, marginTop: m ? 4 : 0 }}>
            <h2 style={heading}>Address</h2>
            <ul style={{ ...list, gap: m ? 14 : 16 }}>
              <li style={{ ...link, display: 'flex', gap: m ? 9 : 10 }}>
                <MapPin size={15} strokeWidth={1.5} aria-hidden="true" style={icon} /><span>Address details coming soon.</span>
              </li>
              <li>
                <a href="mailto:support@globrixa.com" style={{ ...link, display: 'flex', gap: m ? 9 : 10 }}>
                  <Mail size={15} strokeWidth={1.5} aria-hidden="true" style={icon} /><span>support@globrixa.com</span>
                </a>
              </li>
              <li style={{ ...link, display: 'flex', gap: m ? 9 : 10 }}>
                <Phone size={15} strokeWidth={1.5} aria-hidden="true" style={icon} /><span>Phone number coming soon.</span>
              </li>
            </ul>
          </div>
        </div>
        <div style={{ marginTop: 60, padding: '22px 0', borderTop: '1px solid rgba(244,217,160,.27)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, fontSize: m ? 8 : 9, lineHeight: '12px', color: CREAM }}>
          <span>© 2026 Globrixa</span>
          <span>India · English · INR ₹</span>
        </div>
      </div>
    </footer>
  );
}
