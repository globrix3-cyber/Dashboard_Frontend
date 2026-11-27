import { Link } from 'react-router-dom';
import { useLandingBreakpoint } from '../../hooks/useBreakpoint';

const MOCHA = '#5B4632';
const BENEFITS = [
  { img: '/images/v4/benefits-discovery.png', lines: ['Discover distinctive', 'products'] },
  // The reference thickens the handshake strokes slightly so it matches the other two icons.
  { img: '/images/v4/benefits-trade.png',     lines: ['Made for', 'trade buyers'], filter: `drop-shadow(.45px 0 0 ${MOCHA}) drop-shadow(-.45px 0 0 ${MOCHA}) drop-shadow(0 .35px 0 ${MOCHA})` },
  { img: '/images/v4/benefits-enquiry.png',   lines: ['Source quality', 'products'] },
];

// Mirrors the reference #trade-benefits rules: a 3-column grid inside a 4.3% gutter
// (2 + 1 on phones), fluid label size clamp(13px, 1.25vw, 19px), centred button below.
export default function BenefitsStrip() {
  const bp = useLandingBreakpoint();
  const m = bp.isMobile, t = bp.isTablet;
  const icon = m ? 58 : 68;
  return (
    <section style={{
      display: 'grid', gridTemplateColumns: m ? 'repeat(2, minmax(0, 1fr))' : 'repeat(3, minmax(0, 1fr))',
      rowGap: m ? 18 : 0, columnGap: 0,
      padding: m ? '20px 5%' : t ? '20px 4% 18px' : '20px 4.3% 18px',
      background: '#FDF9F1', color: MOCHA, borderBottom: '1px solid rgba(91,70,50,.125)', boxSizing: 'border-box',
    }}>
      {BENEFITS.map((b, i) => (
        <div key={b.img} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: m ? 8 : 9, textAlign: 'center', padding: m || t ? '0 12px' : '0 18px', gridColumn: m && i === 2 ? '1 / -1' : undefined }}>
          <img src={b.img} alt="" width={icon} height={icon} loading="lazy" decoding="async"
            style={{ display: 'block', width: icon, height: icon, objectFit: 'contain', flexShrink: 0, filter: b.filter }} />
          <p style={{ margin: 0, fontSize: m || t ? 13 : 'clamp(13px, 1.25vw, 19px)', fontWeight: 500, lineHeight: 1.5, color: MOCHA }}>
            {b.lines[0]}<br />{b.lines[1]}
          </p>
        </div>
      ))}
      <Link className="gx-btn-gold" to="/contact"
        style={{ gridColumn: '1 / -1', justifySelf: 'center', marginTop: m ? 22 : 40, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', width: 176, maxWidth: '100%', height: 44, padding: '0 16px', background: MOCHA, color: '#FDF9F1', borderRadius: 3, fontSize: 13, fontWeight: 600, lineHeight: 1.4, letterSpacing: '.1px', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'background .2s' }}
        onMouseEnter={e => { e.currentTarget.style.background = '#2B2016'; }}
        onMouseLeave={e => { e.currentTarget.style.background = MOCHA; }}>
        Talk to our team
      </Link>
    </section>
  );
}
