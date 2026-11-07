import { useBreakpoint } from '../../hooks/useBreakpoint';

const REASONS = [
  { icon: 'crafted-character.png',    title: 'Crafted character',      body: 'Discover pieces inspired by traditional skills and thoughtful design.' },
  { icon: 'considered-materials.png', title: 'Considered materials',   body: 'Explore textures and finishes that bring depth to your collection.' },
  { icon: 'global-perspective.png',   title: 'Global perspective',     body: 'Bring an Indian design perspective to stores around the world.' },
  { icon: 'your-store.png',           title: 'Your store, your style', body: 'Build a distinctive shortlist around your customers and your style.' },
];

export default function WhyGlobrixa() {
  const bp = useBreakpoint();
  const m = bp.isMobile;
  const iconSize = m ? 74 : 86;
  // Reference layout: 1440px → 458px tall, 4 equal columns inside a 57.6px gutter;
  // 390px → 582px tall, 2x2 grid inside a 15.6px gutter.
  const gutter = m ? 15.6 : bp.isTablet ? 32 : 57.6;
  return (
    <section style={{ background: '#FDF9F1', padding: m ? `40px ${gutter}px` : `64px ${gutter}px 55px` }}>
      <div style={{ maxWidth: 1440, margin: '0 auto' }}>
        <h2 style={{ fontFamily: "'Canela', 'Cormorant Garamond', Georgia, serif", fontSize: m ? 33 : bp.isTablet ? 40 : 47.5, fontWeight: 300, lineHeight: 1.1, letterSpacing: '0.3px', color: '#5B4632', textAlign: 'center', margin: `0 0 ${m ? 34 : 72}px` }}>WHY GLOBRIXA?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: m ? 'repeat(2,minmax(0,1fr))' : 'repeat(4,minmax(0,1fr))', rowGap: 30 }}>
          {REASONS.map(r => (
            <div key={r.title} style={{ textAlign: 'center', padding: m ? '0 10px' : bp.isTablet ? '0 16px' : '0 28px', color: '#5B4632' }}>
              <img src={`/images/v3/why-icons/${r.icon}`} alt="" width={iconSize} height={iconSize} loading="lazy" decoding="async"
                style={{ display: 'block', width: iconSize, height: iconSize, objectFit: 'contain', margin: `0 auto ${m ? 19 : 35}px` }} />
              <h3 style={{ width: 'fit-content', maxWidth: '100%', minHeight: m ? 33 : 20, margin: `0 auto ${m ? 12 : 22}px`, fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: m ? 11 : 13.5, lineHeight: m ? '16.5px' : '20px', fontWeight: 600, letterSpacing: m ? '0.45px' : '0.65px', textTransform: 'uppercase' }}>{r.title}</h3>
              <p style={{ margin: '0 auto', maxWidth: m ? 155 : 270, fontSize: m ? 12 : 14.4, lineHeight: m ? 1.75 : '26px', color: '#5B4632' }}>{r.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
