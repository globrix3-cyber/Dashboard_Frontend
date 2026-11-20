import { useBreakpoint } from '../../hooks/useBreakpoint';

const SERIF = "'Canela', 'Cormorant Garamond', Georgia, serif";
const MOCHA = '#5B4632';
const REASONS = [
  { icon: 'crafted-character.png',    title: 'Crafted character',      body: 'Discover pieces inspired by traditional skills and thoughtful design.' },
  { icon: 'considered-materials.png', title: 'Considered materials',   body: 'Explore textures and finishes that bring depth to your collection.' },
  { icon: 'global-perspective.png',   title: 'Global perspective',     body: 'Bring an Indian design perspective to stores around the world.' },
  { icon: 'your-store.png',           title: 'Your store, your style', body: 'Build a distinctive shortlist around your customers and your style.' },
];

// Mirrors the reference #why-globrixa.why-reference rules (breakpoints 1100 / 900 /
// 480 / 340px): 4 columns, 2 up to 900px, 1 below 340px; Canela titles in bold.
export default function WhyGlobrixa() {
  const { width: w } = useBreakpoint();
  const le1100 = w <= 1100, le900 = w <= 900, le480 = w <= 480, le340 = w <= 340;
  const icon = le480 ? 74 : le900 ? 82 : 'clamp(80px, 6vw, 100px)';
  return (
    <section id="why-globrixa" style={{ background: '#FDF9F1', color: MOCHA, textAlign: 'center', padding: le480 ? '40px 4%' : le900 ? '48px 5%' : '64px 4% 52px', boxSizing: 'border-box' }}>
      <h2 style={{ fontFamily: SERIF, fontWeight: 300, lineHeight: 1.1, letterSpacing: '.3px', color: MOCHA, margin: `0 0 ${le480 ? 34 : le900 ? 42 : 68}px`, fontSize: le480 ? 33 : le900 ? 38 : 'clamp(36px, 3.3vw, 52px)' }}>
        WHY GLOBRIXA?
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: le340 ? '1fr' : le900 ? 'repeat(2, minmax(0, 1fr))' : 'repeat(4, minmax(0, 1fr))', gap: le480 ? '30px 0' : le900 ? '36px 0' : 0, alignItems: 'stretch' }}>
        {REASONS.map(r => (
          <article key={r.title} style={{ minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: le480 ? '0 12px' : le1100 ? '4px 18px 3px' : '4px 26px 3px' }}>
            <img src={`/images/v3/why-icons/${r.icon}`} alt="" loading="lazy" decoding="async"
              style={{ display: 'block', width: icon, height: icon, objectFit: 'contain', flexShrink: 0, margin: `0 0 ${le480 ? 19 : le900 ? 24 : 34}px` }} />
            <h3 style={{
              fontFamily: SERIF, fontWeight: 700, fontStyle: 'normal', fontSynthesis: 'weight', lineHeight: 1.5, textTransform: 'uppercase', color: MOCHA,
              fontSize: le480 ? 11.55 : le1100 ? 12.6 : 'clamp(12.6px, .987vw, 16.8px)', letterSpacing: le480 ? '.45px' : '.65px',
              minHeight: le480 && !le340 ? 33 : 0, margin: `0 0 ${le480 ? 12 : le900 ? 14 : 22}px`,
            }}>
              {r.title}
            </h3>
            <p style={{ fontSize: le480 ? 12 : le1100 ? 13 : 'clamp(13px, 1vw, 16px)', fontWeight: 400, lineHeight: le480 ? 1.75 : 1.8, maxWidth: 270, color: MOCHA, margin: 0 }}>
              {r.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
