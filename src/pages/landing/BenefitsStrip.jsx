import { useBreakpoint, rGutter } from '../../hooks/useBreakpoint';

const BENEFITS = [
  { img: '/images/v3/benefits-discovery.png', lines: ['Discover distinctive', 'products'] },
  { img: '/images/v3/benefits-trade.png',     lines: ['Made for', 'trade buyers'] },
  { img: '/images/v3/benefits-enquiry.png',   lines: ['Source quality', 'products'] },
];

export default function BenefitsStrip() {
  const bp   = useBreakpoint();
  const icon = bp.isMobile ? 48 : 60;
  return (
    <section style={{ background: '#FDF9F1', borderBottom: '1px solid #E3D5C1', padding: bp.isMobile ? '24px 0' : '30px 0 20px' }}>
      {/* Mobile: two on the first row, the third centred below (as in the reference). */}
      <div style={{ ...rGutter(bp), display: 'flex', flexWrap: 'wrap', justifyContent: 'center', rowGap: 22 }}>
        {BENEFITS.map(b => (
          <div key={b.img} style={{ flex: bp.isMobile ? '0 0 50%' : '1 1 0', textAlign: 'center', color: '#5B4632', fontSize: bp.isMobile ? 13 : 17, lineHeight: 1.6 }}>
            <img src={b.img} alt="" loading="lazy" decoding="async" style={{ width: icon, height: icon, objectFit: 'contain', display: 'block', margin: '0 auto 12px' }} />
            {b.lines[0]}<br />{b.lines[1]}
          </div>
        ))}
      </div>
    </section>
  );
}
