import { useBreakpoint, rGutter } from '../../hooks/useBreakpoint';

const REASONS = [
  { icon: 'crafted-character.png',    title: 'Crafted character',      body: 'Discover pieces inspired by traditional skills and thoughtful design.' },
  { icon: 'considered-materials.png', title: 'Considered materials',   body: 'Explore textures and finishes that bring depth to your collection.' },
  { icon: 'global-perspective.png',   title: 'Global perspective',     body: 'Bring an Indian design perspective to stores around the world.' },
  { icon: 'your-store.png',           title: 'Your store, your style', body: 'Build a distinctive shortlist around your customers and your style.' },
];

export default function WhyGlobrixa() {
  const bp = useBreakpoint();
  const iconSize = bp.isMobile ? 52 : 64;
  return (
    <section style={{ background: '#FDF9F1', padding: bp.isMobile ? '48px 0 44px' : '52px 0 58px' }}>
      <div style={rGutter(bp)}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: bp.isMobile ? 36 : 54, fontWeight: 300, lineHeight: 1.1, color: '#5B4632', textAlign: 'center', margin: `0 0 ${bp.isMobile ? 32 : 76}px` }}>WHY GLOBRIXA?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: bp.isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', rowGap: 32 }}>
          {REASONS.map((r, i) => (
            <div key={r.title} style={{ textAlign: 'center', padding: bp.isMobile ? '0 10px' : bp.isTablet ? '0 16px' : '0 28px', borderLeft: i && (!bp.isMobile || i % 2) ? '1px solid #E3D5C1' : 'none', color: '#5B4632' }}>
              <img src={`/images/v3/why-icons/${r.icon}`} alt="" width={iconSize} height={iconSize} loading="lazy" decoding="async"
                style={{ display: 'block', width: iconSize, height: iconSize, objectFit: 'contain', margin: `0 auto ${bp.isMobile ? 20 : 46}px` }} />
              <h3 style={{ margin: `0 0 ${bp.isMobile ? 14 : 26}px`, fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: bp.isMobile ? 11 : 13, fontWeight: 500, letterSpacing: '.08em', textTransform: 'uppercase' }}>{r.title}</h3>
              <p style={{ margin: '0 auto', maxWidth: 270, fontSize: bp.isMobile ? 12 : 15, lineHeight: 1.75, color: '#79634E' }}>{r.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
