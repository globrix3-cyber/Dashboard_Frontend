import { useNavigate } from 'react-router-dom';
import { FOOTER_COLS } from './data';
import { useBreakpoint } from '../../hooks/useBreakpoint';

const NAV_MAP = {
  'About':        '/about',
  'Our Story':    '/our-story',
  'Blog':         '/blog',
  'Careers':      '/careers',
  'Press':        '/about',
  'Help Center':  '/help',
  'Contact':      '/contact',
  'Privacy':      '/privacy',
  'Terms':        '/terms',
  'Refund Policy':'/terms',
};

export default function LandingFooter() {
  const navigate = useNavigate();
  const bp       = useBreakpoint();
  const pad      = bp.isMobile ? '36px 18px 22px' : bp.isTablet ? '44px 28px 24px' : '52px 56px 28px';

  const COLS = [
    {
      heading: 'Support',
      links: ['Help Center', 'Contact', 'Privacy Policy', 'Terms of Service'],
      map: { 'Help Center': '/help', 'Contact': '/contact', 'Privacy Policy': '/privacy', 'Terms of Service': '/terms' },
    },
    {
      heading: 'Company',
      links: ['Our Story', 'Blog', 'Careers', 'Press'],
      map: { 'Our Story': '/our-story', 'Blog': '/blog', 'Careers': '/careers', 'Press': '/about' },
    },
    {
      heading: 'Categories',
      links: ['Wall Décor', 'Soft Furnishings', 'Handicrafts', 'Textiles', 'View all 24'],
      map: {},
    },
  ];

  return (
    <footer style={{ background: '#0F0E0D', padding: pad }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Main grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: bp.isMobile ? '1fr 1fr' : bp.isTablet ? '1fr 1fr' : '1.8fr 1fr 1fr 1fr',
          gap: bp.isMobile ? 28 : 40,
          paddingBottom: bp.isMobile ? 28 : 40,
          borderBottom: '1px solid rgba(255,255,255,.08)',
        }}>

          {/* Brand — full width on mobile */}
          <div style={{ gridColumn: bp.isMobile ? '1 / -1' : 'auto' }}>
            <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 14, display: 'block' }}>
              <img src="/logo.png" alt="Globrixa" style={{ height: 52, objectFit: 'contain' }} />
            </button>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,.6)', lineHeight: 1.75, maxWidth: 210 }}>
              India's B2B wholesale marketplace — connecting verified manufacturers with global buyers across 120+ countries.
            </p>
            <div style={{ marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 10, color: 'rgba(255,255,255,.5)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 5, padding: '5px 10px' }}>
              🇮🇳 Proudly Made in India
            </div>
          </div>

          {/* Support + Company + Address */}
          {COLS.map(col => (
            <div key={col.heading}>
              <h5 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#C4773A', marginBottom: 16 }}>
                {col.heading}
              </h5>
              {col.links ? col.links.map(link => (
                <div key={link}
                  onClick={() => col.map[link] && navigate(col.map[link])}
                  onMouseEnter={e => { if (col.map[link]) e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,.72)'; }}
                  style={{ fontSize: 13, color: 'rgba(255,255,255,.72)', marginBottom: 10, cursor: col.map[link] ? 'pointer' : 'default', transition: '.15s' }}
                >
                  {link}
                </div>
              )) : col.address.map((line, i) => (
                <div key={i} style={{ fontSize: 13, color: 'rgba(255,255,255,.4)', lineHeight: 1.7 }}>{line}</div>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,.45)' }}>
            Copyright © 2026 Globrixa Technologies Pvt. Ltd.
          </span>
          <div style={{ display: 'flex', gap: 16 }}>
            {['Privacy', 'Terms', 'Refund Policy'].map(l => (
              <span key={l} onClick={() => navigate('/terms')} style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', cursor: 'pointer', transition: '.15s' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,.5)'; }}
              >{l}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
