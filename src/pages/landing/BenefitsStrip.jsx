import { useBreakpoint, rGutter } from '../../hooks/useBreakpoint';

const BENEFITS = [
  { img: '/images/v3/benefits-discovery.png', lines: ['Discover distinctive', 'products'] },
  { img: '/images/v3/benefits-trade.png',     lines: ['Made for', 'trade buyers'] },
  { img: '/images/v3/benefits-enquiry.png',   lines: ['Source quality', 'products'] },
];

export default function BenefitsStrip() {
  const bp = useBreakpoint();
  return (
    <section style={{ background: '#F4D9A0', borderBottom: '1px solid #E3D5C1', padding: bp.isMobile ? '24px 0' : '28px 0' }}>
      <div style={{ ...rGutter(bp), display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: bp.isMobile ? 10 : 24 }}>
        {BENEFITS.map(b => (
          <div key={b.img} style={{ textAlign: 'center', color: '#5B4632', fontSize: bp.isMobile ? 13 : 17, lineHeight: 1.6 }}>
            <img src={b.img} alt="" loading="lazy" decoding="async" style={{ width: bp.isMobile ? 48 : 64, height: bp.isMobile ? 48 : 64, objectFit: 'contain', display: 'block', margin: '0 auto 10px' }} />
            {b.lines[0]}<br />{b.lines[1]}
          </div>
        ))}
      </div>
    </section>
  );
}
