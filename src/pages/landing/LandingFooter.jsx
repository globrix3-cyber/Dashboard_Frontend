import { useNavigate } from 'react-router-dom';
import { T } from './tokens';
import { FOOTER_COLS } from './data';

const NAV_MAP = {
  'About': '/about', 'Blog': '/blog', 'Careers': '/careers', 'Press': '/about',
  'Help Center': '/help', 'Contact': '/contact', 'Privacy': '/privacy',
  'Terms': '/terms', 'Refund Policy': '/terms',
};

export default function LandingFooter() {
  const navigate = useNavigate();
  return (
    <footer style={{ background: '#0F0E0D', padding: '64px 56px 36px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 48, paddingBottom: 56, borderBottom: '1px solid #1A1816' }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 12, letterSpacing: '-.5px' }}>Globrixa</div>
            <p style={{ fontSize: 13, color: '#555', lineHeight: 1.78, maxWidth: 220, marginBottom: 20 }}>India's premier B2B wholesale marketplace — connecting verified suppliers with global buyers across 120+ countries.</p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,.04)', border: '1px solid #222', borderRadius: 7, padding: '7px 13px', fontSize: 11, color: '#555' }}>🇮🇳 Proudly Made in India</div>
          </div>
          {FOOTER_COLS.map(col => (
            <div key={col.heading}>
              <h5 style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#555', marginBottom: 18 }}>{col.heading}</h5>
              {col.links.map(link => (
                <div key={link}
                  onClick={() => NAV_MAP[link] && navigate(NAV_MAP[link])}
                  onMouseEnter={e => { if (NAV_MAP[link]) e.currentTarget.style.color = T.t; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#444'; }}
                  style={{ display: 'block', fontSize: 13, color: '#444', marginBottom: 10, cursor: NAV_MAP[link] ? 'pointer' : 'default', transition: '.15s' }}>
                  {link}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ paddingTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: 12, color: '#2A2724' }}>© 2025 Globrixa Technologies Pvt. Ltd.</span>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy', 'Terms', 'Refund Policy'].map(l => (
              <span key={l} onClick={() => navigate('/terms')} style={{ fontSize: 12, color: '#2A2724', cursor: 'pointer' }}>{l}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
