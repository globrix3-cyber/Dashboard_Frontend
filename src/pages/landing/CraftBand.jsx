import { useBreakpoint } from '../../hooks/useBreakpoint';

const SERIF = "'Canela', 'Cormorant Garamond', Georgia, serif";
const IMAGE = '/images/v3/craftsmanship-workshop-triptych.jpg';
const ALT   = 'Craftspeople at work: cutting timber, chiselling wood and stamping a leather wallet';

export default function CraftBand() {
  const bp = useBreakpoint();

  if (bp.isMobile) {
    // Reference mobile (415px): the triptych as a 167px strip, then a mocha panel with
    // both headings split by a hairline.
    const h = { margin: 0, fontFamily: SERIF, fontWeight: 300, fontSize: 33.15, lineHeight: 1.04, letterSpacing: '-.6px', color: '#FDF9F1' };
    return (
      <section style={{ background: '#5B4632' }}>
        <img src={IMAGE} alt={ALT} loading="lazy" decoding="async"
          style={{ display: 'block', width: '100%', height: 167, objectFit: 'cover' }} />
        <div style={{ padding: '40px 27px 30px' }}>
          <h2 style={h}>Hands behind the craft</h2>
          <div aria-hidden style={{ height: 1, background: 'rgba(244,217,160,.35)', margin: '43px 0 34px' }} />
          <h3 style={{ ...h, fontSize: 31.2, lineHeight: 1.05, letterSpacing: '-.5px' }}>Crafting your<br />unique story</h3>
        </div>
      </section>
    );
  }

  const h = { position: 'absolute', margin: 0, fontFamily: SERIF, fontWeight: 300, fontSize: bp.isTablet ? 44 : 52.56, lineHeight: 1.04, letterSpacing: '-.6px', color: '#FDF9F1', textShadow: '0 1px 2px rgba(43,32,22,.45), 0 2px 24px rgba(43,32,22,.55)' };
  return (
    <section style={{ position: 'relative', height: bp.isTablet ? 460 : 616, overflow: 'hidden', background: '#2B2016' }}>
      <img src={IMAGE} alt={ALT} loading="lazy" decoding="async"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      {/* Corner scrims keep the light headings legible over bright areas of the photo (sawdust, sunlight). */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(43,32,22,.42) 0%, rgba(43,32,22,.18) 26%, rgba(43,32,22,0) 42%), radial-gradient(ellipse 55% 45% at 22% 12%, rgba(43,32,22,.4) 0%, rgba(43,32,22,0) 100%), radial-gradient(ellipse 45% 50% at 88% 90%, rgba(43,32,22,.5) 0%, rgba(43,32,22,.2) 55%, rgba(43,32,22,0) 100%)' }} />
      <h2 style={{ ...h, top: bp.isTablet ? 40 : 63, left: bp.isTablet ? 32 : 65 }}>
        Hands behind the craft
      </h2>
      <h3 style={{ ...h, fontSize: bp.isTablet ? 40 : 48.96, lineHeight: 1.05, letterSpacing: '-.5px', bottom: bp.isTablet ? 40 : 49, right: bp.isTablet ? 32 : 64, textAlign: 'right' }}>
        Crafting your<br />unique story
      </h3>
    </section>
  );
}
