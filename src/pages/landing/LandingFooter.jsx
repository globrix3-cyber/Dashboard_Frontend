import { Link } from 'react-router-dom';
import { useBreakpoint } from '../../hooks/useBreakpoint';

const CREAM = '#F0DCC0';
const GOLD  = '#F4D9A0';

const QUICK_LINKS = [
  { to: '/',          label: 'Home' },
  { to: '/about',     label: 'About us' },
  { to: '/#products', label: 'Products' },
  { to: '/blog',      label: 'Blogs' },
  { to: '/contact',   label: 'Contact Us' },
];
const POLICIES = [
  { to: '/policies?tab=terms',    label: 'Terms & Conditions' },
  { to: '/policies?tab=shipping', label: 'Shipping Policy' },
  { to: '/policies?tab=privacy',  label: 'Privacy Policy' },
  { to: '/policies?tab=faqs',     label: 'FAQs' },
];
const ADDRESS = 'OFF. NO 301, PLOT NO6, III/F, Anupam Plaza 1, Ghazipur Road, Ghazipur, NEW DELHI, 110096';
const MAP_URL = 'https://maps.app.goo.gl/3KtMCNrtySo5hrHM6';
const SOCIALS = [
  { name: 'Facebook',  href: 'https://www.facebook.com/people/Globrixa/61592642189036/',           img: '/images/v4/social/facebook.svg' },
  { name: 'Instagram', href: 'https://www.instagram.com/globrixa_india?cnvx=MTF3M3B1MHRjc3E5eA==', img: '/images/v4/social/instagram.svg' },
  { name: 'LinkedIn',  href: 'https://www.linkedin.com/company/globrixa/home/',                    img: '/images/v4/social/linkedin.svg' },
];

const ICON = { display: 'block', flex: 'none', width: 15, height: 17, marginTop: 2, fill: 'none', stroke: GOLD, strokeWidth: 1.35, strokeLinecap: 'round', strokeLinejoin: 'round' };
const PinIcon   = () => <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" style={ICON}><path d="M19 10c0 5-7 12-7 12S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2.2" /></svg>;
const MailIcon  = () => <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" style={ICON}><rect x="3" y="5" width="18" height="14" rx="1" /><path d="m4 6 8 7 8-7" /></svg>;
const PhoneIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" style={ICON}><path d="m6 3 4 5-3 3c2 4 4 6 8 8l3-3 5 4-2 3C10 24 0 14 2 5Z" /></svg>;

// Matched to the reference footer CSS: 54px top / 4.3% side padding at every width,
// columns 1.6fr 1fr 1fr 1.2fr with 30px gaps; at <=760px two columns (25px gaps)
// with the brand spanning the top. 1440px → 408px tall, 390px → 811px.
// Shared by the homepage and the marketing pages (via SiteLayout).
export default function LandingFooter() {
  const bp = useBreakpoint();
  const m  = bp.width <= 760;
  const link = { display: 'block', margin: `0 0 ${m ? 15 : 16}px`, padding: 0, fontFamily: "'DM Sans', Arial, sans-serif", fontSize: 14, fontWeight: 400, lineHeight: 1.8, letterSpacing: 0, color: CREAM, textAlign: 'left', textDecoration: 'none' };
  const row  = { ...link, display: 'flex', alignItems: 'flex-start', gap: m ? 9 : 10 };
  const heading = { margin: `5px 0 ${m ? 20 : 24}px`, fontFamily: "'Canela', 'Cormorant Garamond', Georgia, serif", fontSize: m ? 28 : 30, fontWeight: 300, lineHeight: 1.2, letterSpacing: 'normal', color: GOLD };
  return (
    <footer className="gx-footer" style={{ background: '#5B4632', color: GOLD, borderTop: '1px solid #f4d9a045', padding: '54px 4.3% 0' }}>
      <style>{`
        .gx-footer a.gx-fl:hover, .gx-footer a.gx-fr:hover > span { color: #FDF9F1; text-decoration: underline; text-underline-offset: 4px; }
        .gx-footer a:focus-visible { outline: 2px solid ${GOLD}; outline-offset: 3px; }
        .gx-footer .gx-social { transition: background .2s; }
        .gx-footer .gx-social:hover { background: #F4D9A01A; }
        @media (prefers-reduced-motion: reduce) { .gx-footer .gx-social { transition: none; } }
      `}</style>
      <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr 1fr' : '1.6fr 1fr 1fr 1.2fr', gap: m ? 25 : 30, paddingBottom: 45 }}>
        <div style={{ gridColumn: m ? '1 / -1' : 'auto' }}>
          <Link to="/" aria-label="Globrixa home" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: m ? 31 : 34, fontWeight: 600, fontStyle: 'normal', letterSpacing: m ? '2.5px' : '3px', lineHeight: 'normal', color: GOLD, textDecoration: 'none' }}>
            GLOBRIXA
          </Link>
          <p style={{ margin: '1em 0', fontSize: 14, lineHeight: 1.8, color: CREAM }}>Crafted with character.<br />Sourced for your store.</p>
        </div>
        <nav aria-label="Quick links">
          <h2 style={heading}>Quick Links</h2>
          {QUICK_LINKS.map(l => <Link key={l.label} to={l.to} className="gx-fl" style={link}>{l.label}</Link>)}
        </nav>
        <nav aria-label="Policies">
          <h2 style={heading}>Policies</h2>
          {POLICIES.map(l => <Link key={l.label} to={l.to} className="gx-fl" style={link}>{l.label}</Link>)}
        </nav>
        <div>
          <h2 style={heading}>Address</h2>
          <a className="gx-fr" href={MAP_URL} target="_blank" rel="noopener noreferrer" aria-label={`${ADDRESS} (opens Google Maps in a new tab)`} style={row}>
            <PinIcon /><span style={{ minWidth: 0, overflowWrap: 'anywhere' }}>{ADDRESS}</span>
          </a>
          <a className="gx-fr" href="mailto:support@globrixa.com" style={row}>
            <MailIcon /><span style={{ minWidth: 0, overflowWrap: 'anywhere' }}>support@globrixa.com</span>
          </a>
          <a className="gx-fr" href="tel:+918700076057" style={{ ...row, marginBottom: 4 }}>
            <PhoneIcon /><span>+91 8700076057</span>
          </a>
          <a className="gx-fr" href="tel:+918796930822" style={{ ...row, paddingLeft: m ? 24 : 25 }}>
            <span>+91 8796930822</span>
          </a>
          <div role="group" aria-label="Follow Globrixa" style={{ display: 'flex', gap: m ? 8 : 9, marginLeft: m ? 18 : 19 }}>
            {SOCIALS.map(s => (
              <a key={s.name} className="gx-social" href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`Globrixa on ${s.name} (opens in a new tab)`}
                style={{ display: 'grid', placeItems: 'center', flex: 'none', width: 40, height: 40, padding: 4, boxSizing: 'border-box', borderRadius: 7, textDecoration: 'none' }}>
                <img src={s.img} width="30" height="30" alt="" decoding="async" loading="lazy" style={{ display: 'block', width: 30, height: 30, objectFit: 'contain' }} />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid #f4d9a045', padding: '22px 0', display: 'flex', flexDirection: m ? 'column' : 'row', alignItems: m ? 'flex-start' : 'stretch', justifyContent: 'space-between', flexWrap: m ? 'wrap' : 'nowrap', gap: m ? 20 : 0, fontSize: 12, lineHeight: 'normal', color: CREAM }}>
        <span>© 2026 Globrixa</span>
        <span>India · English · INR ₹</span>
      </div>
    </footer>
  );
}
