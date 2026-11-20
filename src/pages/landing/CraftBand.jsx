import { useLandingBreakpoint } from '../../hooks/useBreakpoint';

const SERIF = "'Canela', 'Cormorant Garamond', Georgia, serif";
const IMAGE = '/images/v3/craftsmanship-workshop-triptych.jpg';
const ALT   = 'Craftspeople at work: cutting timber, chiselling wood and stamping a leather wallet';
const SHADOW = '0 1px 2px rgba(43,32,22,.45), 0 2px 24px rgba(43,32,22,.55)';

// Mirrors the reference .craft-story: full-bleed triptych at its natural ratio with
// the reference's top/bottom shade; headings at 8% / 4.5% from the corners with
// clamp() sizes. On phones the photo sits on top and the headings follow on mocha,
// split by a hairline.
export default function CraftBand() {
  const bp = useLandingBreakpoint();
  const m = bp.isMobile, t = bp.isTablet;
  const base = { fontFamily: SERIF, fontWeight: 300, color: '#FDF9F1' };

  if (m) {
    return (
      <section style={{ display: 'grid', gridTemplateColumns: '1fr', background: '#5B4632', color: '#F4D9A0' }}>
        <img src={IMAGE} alt={ALT} loading="lazy" decoding="async"
          style={{ display: 'block', width: '100%', height: 'auto', aspectRatio: '1918 / 820', objectFit: 'cover' }} />
        <div style={{ padding: '28px 7% 0' }}>
          <h2 style={{ ...base, fontSize: 'clamp(33px, 8.5vw, 45px)', lineHeight: 1.04, letterSpacing: '-.6px', margin: '12px 0 15px' }}>Hands behind the craft</h2>
        </div>
        <div style={{ margin: '28px 7% 30px', paddingTop: 22, borderTop: '1px solid rgba(244,217,160,.25)' }}>
          <h3 style={{ ...base, fontSize: 'clamp(31px, 8vw, 40px)', lineHeight: 1.05, letterSpacing: '-.5px', margin: '12px 0 0' }}>Crafting your<br />unique story</h3>
        </div>
      </section>
    );
  }

  return (
    <section style={{ position: 'relative', isolation: 'isolate', overflow: 'hidden', background: '#1C1A17' }}>
      <img src={IMAGE} alt={ALT} loading="lazy" decoding="async"
        style={{ display: 'block', width: '100%', height: 'auto', aspectRatio: '1918 / 820', objectFit: 'contain' }} />
      {/* Reference shade: darkens the top and bottom bands where the headings sit. */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(180deg, rgba(16,14,11,.76), transparent 43%, rgba(16,14,11,.72)), linear-gradient(90deg, rgba(16,14,11,.28), transparent 60%)' }} />
      <div style={{ position: 'absolute', top: '8%', left: '4.5%', width: '43%' }}>
        <h2 style={{ ...base, fontSize: t ? 'clamp(28px, 3.5vw, 37px)' : 'clamp(30px, 3.65vw, 60px)', lineHeight: 1.04, letterSpacing: '-.6px', margin: t ? '10px 0' : '14px 0 15px', textShadow: SHADOW }}>
          Hands behind the craft
        </h2>
      </div>
      <div style={{ position: 'absolute', right: '4.5%', bottom: '8%', maxWidth: '43%', textAlign: 'right' }}>
        <h3 style={{ ...base, fontSize: t ? 'clamp(28px, 3.4vw, 36px)' : 'clamp(30px, 3.4vw, 56px)', lineHeight: 1.05, letterSpacing: '-.5px', margin: '12px 0 0', textShadow: SHADOW }}>
          Crafting your<br />unique story
        </h3>
      </div>
    </section>
  );
}
