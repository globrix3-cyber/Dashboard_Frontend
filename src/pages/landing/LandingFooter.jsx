import { useNavigate } from 'react-router-dom';
import { T } from './tokens';
import { FOOTER_COLS } from './data';
import { useBreakpoint } from '../../hooks/useBreakpoint';

const NAV_MAP = {
  'About': '/about', 'Blog': '/blog', 'Careers': '/careers', 'Press': '/about',
  'Help Center': '/help', 'Contact': '/contact', 'Privacy': '/privacy',
  'Terms': '/terms', 'Refund Policy': '/terms',
};

export default function LandingFooter() {
  const navigate = useNavigate();
  const bp       = useBreakpoint();

  const pad  = bp.isMobile ? '48px 18px 28px' : bp.isTablet ? '56px 32px 28px' : '64px 56px 36px';
  const cols = bp.isMobile ? '1fr 1fr' : bp.isTablet ? '1fr 1fr 1fr' : '2fr 1fr 1fr 1fr 1fr';

  return (
    <footer style={{ background: '#0F0E0D', padding: pad }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: cols, gap: bp.isMobile ? 28 : 40, paddingBottom: bp.isMobile ? 36 : 52, borderBottom: '1px solid #1A1816' }}>

          {/* Brand col — full width on mobile */}
          <div style={{ gridColumn: bp.isMobile ? '1 / -1' : 'auto' }}>
            <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 12 }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: '-.5px' }}>Globrixa</div>
            </button>
            <p style={{ fontSize: 13, color: '#555', lineHeight: 1.78, maxWidth: 220, marginBottom: 18 }}>India's premier B2B wholesale marketplace — connecting verified suppliers with global buyers across 120+ countries.</p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,.04)', border: '1px solid #222', borderRadius: 7, padding: '7px 13px', fontSize: 11, color: '#555' }}>🇮🇳 Proudly Made in India</div>
          </div>

          {FOOTER_COLS.map(col => (
            <div key={col.heading}>
              <h5 style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#555', marginBottom: 16 }}>{col.heading}</h5>
              {col.links.map(link => (
                <div key={link}
                  onClick={() => NAV_MAP[link] && navigate(NAV_MAP[link])}
                  onMouseEnter={e => { if (NAV_MAP[link]) e.currentTarget.style.color = T.t; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#444'; }}
                  style={{ display: 'block', fontSize: 13, color: '#444', marginBottom: 9, cursor: NAV_MAP[link] ? 'pointer' : 'default', transition: '.15s' }}
                >{link}</div>
              ))}
            </div>
          ))}
        </div>

        <div style={{ paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <span style={{ fontSize: 12, color: '#2A2724' }}>© 2025 Globrixa Technologies Pvt. Ltd. All rights reserved.</span>
          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
            {['Privacy', 'Terms', 'Refund Policy'].map(l => (
              <span key={l} onClick={() => navigate('/terms')} style={{ fontSize: 12, color: '#2A2724', cursor: 'pointer', transition: '.15s' }}
                onMouseEnter={e => { e.currentTarget.style.color = T.t; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#2A2724'; }}
              >{l}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
