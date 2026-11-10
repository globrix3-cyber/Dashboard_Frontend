import { useBreakpoint } from '../../hooks/useBreakpoint';

const SERIF = "'Canela', 'Cormorant Garamond', Georgia, serif";
const IMAGE = '/images/v3/craftsmanship-workshop-triptych.jpg';
const ALT   = 'Craftspeople at work: cutting timber, chiselling wood and stamping a leather wallet';

// Full-bleed band, no outer margins: it sits flush between the collections
// grid (cream) and Standout Finds (cream), as in the reference.
export default function CraftBand() {
  const bp = useBreakpoint();

  if (bp.isMobile) {
    // Reference mobile: stacked headings, left-aligned, split by a hairline.
    const h = { margin: 0, fontFamily: SERIF, fontWeight: 300, fontSize: 33.2, lineHeight: 1.05, letterSpacing: '-.6px', color: '#FDF9F1', textShadow: '0 1px 2px rgba(43,32,22,.45), 0 2px 20px rgba(43,32,22,.5)' };
    return (
      <section style={{ position: 'relative', minHeight: 415, overflow: 'hidden', background: '#5B4632', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 27px 42px', boxSizing: 'border-box' }}>
        <img src={IMAGE} alt={ALT} loading="lazy" decoding="async"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(43,32,22,.25) 0%, rgba(43,32,22,.45) 40%, rgba(43,32,22,.82) 100%)' }} />
        <div style={{ position: 'relative' }}>
          <h2 style={h}>Hands behind the craft.</h2>
          <div style={{ height: 1, background: 'rgba(244,217,160,.35)', margin: '34px 0 30px' }} />
          <h2 style={{ ...h, fontSize: 31.2, letterSpacing: '-.5px' }}>Crafting your<br />unique story.</h2>
        </div>
      </section>
    );
  }

  const side = bp.isTablet ? 32 : 62;
  const h = { position: 'absolute', margin: 0, fontFamily: SERIF, fontWeight: 300, fontSize: bp.isTablet ? 44 : 52.6, lineHeight: 1, letterSpacing: '-.6px', color: '#FDF9F1', textShadow: '0 1px 2px rgba(43,32,22,.45), 0 2px 24px rgba(43,32,22,.55)' };
  return (
    <section style={{ position: 'relative', height: bp.isTablet ? 460 : 616, overflow: 'hidden', background: '#2B2016' }}>
      <img src={IMAGE} alt={ALT} loading="lazy" decoding="async"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      {/* Corner scrims keep the light headings legible over bright areas of the photo (sawdust, sunlight). */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(43,32,22,.42) 0%, rgba(43,32,22,.18) 26%, rgba(43,32,22,0) 42%), radial-gradient(ellipse 55% 45% at 22% 12%, rgba(43,32,22,.4) 0%, rgba(43,32,22,0) 100%), radial-gradient(ellipse 45% 50% at 88% 90%, rgba(43,32,22,.5) 0%, rgba(43,32,22,.2) 55%, rgba(43,32,22,0) 100%)' }} />
      <h2 style={{ ...h, top: bp.isTablet ? 40 : 56, left: side }}>
        Hands behind the craft.
      </h2>
      <h2 style={{ ...h, fontSize: bp.isTablet ? 40 : 49, letterSpacing: '-.5px', bottom: bp.isTablet ? 40 : 48, right: side, textAlign: 'right' }}>
        Crafting your<br />unique story.
      </h2>
    </section>
  );
}
