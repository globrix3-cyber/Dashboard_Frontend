import { useBreakpoint, rGutter } from '../../hooks/useBreakpoint';

const BENEFITS = [
  { img: '/images/v3/benefits-discovery.png', lines: ['Discover distinctive', 'products'] },
  { img: '/images/v3/benefits-trade.png',     lines: ['Made for', 'trade buyers'] },
  { img: '/images/v3/benefits-enquiry.png',   lines: ['Source quality', 'products'] },
];

export default function BenefitsStrip() {
  const bp   = useBreakpoint();
  const icon = bp.isMobile ? 58 : 68;
  // Layout matched to the reference: 170px tall at 1440 (20/18px padding), 269px at 390 (2 + 1 rows).
  return (
    <section style={{ background: '#FDF9F1', borderBottom: '1px solid #E3D5C1', padding: bp.isMobile ? '20px 0' : '20px 0 18px' }}>
      {/* Mobile: two on the first row, the third centred below (as in the reference). */}
      <div style={{ ...rGutter(bp), ...(bp.isMobile ? { paddingLeft: 19.5, paddingRight: 19.5 } : null), display: 'flex', flexWrap: 'wrap', justifyContent: 'center', rowGap: 18 }}>
        {BENEFITS.map(b => (
          <div key={b.img} style={{ flex: bp.isMobile ? '0 0 50%' : '1 1 0', textAlign: 'center', color: '#5B4632', fontSize: bp.isMobile ? 13 : bp.isTablet ? 16 : 18, fontWeight: 500, lineHeight: 1.5 }}>
            <img src={b.img} alt="" loading="lazy" decoding="async" style={{ width: icon, height: icon, objectFit: 'contain', display: 'block', margin: `0 auto ${bp.isMobile ? 8 : 9}px` }} />
            {b.lines[0]}<br />{b.lines[1]}
          </div>
        ))}
      </div>
    </section>
  );
}
