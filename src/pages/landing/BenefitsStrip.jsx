import { useBreakpoint, rGutter } from '../../hooks/useBreakpoint';

const BENEFITS = [
  { icon: '◈', title: 'Discover something different', body: 'Products with a point of view' },
  { icon: '⌑', title: 'Buy for your business',        body: 'Explore prices & minimum orders' },
  { icon: '↔', title: 'Connect with the makers',      body: 'Start a wholesale conversation' },
  { icon: '✳', title: 'Grow your own way',            body: 'For stores with their own story' },
];

export default function BenefitsStrip() {
  const bp = useBreakpoint();
  return (
    <section style={{ background: '#FDF9F1', borderBottom: '1px solid #E3D5C1', padding: '24px 0' }}>
      <div style={{ ...rGutter(bp), display: 'grid', gridTemplateColumns: bp.isDesktop ? 'repeat(4,1fr)' : 'repeat(2,1fr)', rowGap: 20 }}>
        {BENEFITS.map((b, i) => (
          <div key={b.title} style={{ display: 'flex', alignItems: 'center', justifyContent: bp.isDesktop ? 'center' : 'flex-start', gap: bp.isMobile ? 10 : 18, padding: bp.isMobile ? '0 6px' : '0 14px', borderLeft: i && (bp.isDesktop || i % 2) ? '1px solid #E3D5C1' : 'none', color: '#5B4632' }}>
            <span style={{ fontSize: 22, flexShrink: 0 }}>{b.icon}</span>
            <div>
              <div style={{ fontSize: 12 }}>{b.title}</div>
              <div style={{ fontSize: 10, marginTop: 8, color: '#79634E' }}>{b.body}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
