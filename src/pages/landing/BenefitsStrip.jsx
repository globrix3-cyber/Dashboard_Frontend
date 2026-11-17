import { Link } from 'react-router-dom';
import { useBreakpoint } from '../../hooks/useBreakpoint';

const MOCHA = '#5B4632';
const BENEFITS = [
  { img: '/images/v4/benefits-discovery.png', lines: ['Discover distinctive', 'products'] },
  // The reference thickens the handshake strokes slightly so it matches the other two icons.
  { img: '/images/v4/benefits-trade.png',     lines: ['Made for', 'trade buyers'], filter: `drop-shadow(.45px 0 0 ${MOCHA}) drop-shadow(-.45px 0 0 ${MOCHA}) drop-shadow(0 .35px 0 ${MOCHA})` },
  { img: '/images/v4/benefits-enquiry.png',   lines: ['Source quality', 'products'] },
];

export default function BenefitsStrip() {
  const bp   = useBreakpoint();
  const m    = bp.isMobile;
  const icon = m ? 58 : 68;
  // Reference: 254px tall at 1440 (3 columns + button), 353px at 390 (2 + 1 rows + button).
  return (
    <section style={{ background: '#FDF9F1', borderBottom: '1px solid rgba(91,70,50,.125)', padding: m ? '20px 19.5px' : bp.isTablet ? '20px 32px 18px' : '20px 61.9px 18px' }}>
      <div style={{ maxWidth: 1316, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', rowGap: 18 }}>
        {BENEFITS.map(b => (
          <div key={b.img} style={{ flex: m ? '0 0 50%' : '1 1 0', textAlign: 'center', color: MOCHA, fontSize: m ? 13 : bp.isTablet ? 16 : 18, fontWeight: 500, lineHeight: 1.5 }}>
            <img src={b.img} alt="" width={icon} height={icon} loading="lazy" decoding="async"
              style={{ width: icon, height: icon, objectFit: 'contain', display: 'block', margin: `0 auto ${m ? 8 : 9}px`, filter: b.filter }} />
            <p style={{ margin: 0 }}>{b.lines[0]}<br />{b.lines[1]}</p>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
        <Link to="/contact"
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', minWidth: 176, height: 44, padding: '0 16px', background: MOCHA, color: '#FDF9F1', borderRadius: 3, fontSize: 13, fontWeight: 600, lineHeight: '18.2px', letterSpacing: '.1px', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'background .15s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#4A3828'; }}
          onMouseLeave={e => { e.currentTarget.style.background = MOCHA; }}>
          Talk to our team
        </Link>
      </div>
    </section>
  );
}
