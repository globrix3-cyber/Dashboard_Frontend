import { useBreakpoint } from '../../hooks/useBreakpoint';

const SERIF = "'Cormorant Garamond', Georgia, serif";

export default function CraftBand() {
  const bp   = useBreakpoint();
  const side = bp.isMobile ? 18 : bp.isTablet ? 32 : 65;
  return (
    <section style={{ position: 'relative', height: bp.isMobile ? 340 : bp.isTablet ? 460 : 616, margin: bp.isMobile ? '40px 0' : '60px 0', overflow: 'hidden', background: '#2B2016' }}>
      <img src="/images/v3/hands-of-heritage-craftsmanship.jpg" alt="Hands shaping a wooden chair, carving an intricate pattern and stitching a leather bag" loading="lazy" decoding="async"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      <h2 style={{ position: 'absolute', top: bp.isMobile ? 24 : 60, left: side, margin: 0, fontFamily: SERIF, fontWeight: 600, fontSize: bp.isMobile ? 30 : 52, lineHeight: 1.1, color: '#FDF9F1' }}>
        Hands behind the craft.
      </h2>
      <h2 style={{ position: 'absolute', bottom: bp.isMobile ? 24 : 48, right: side, margin: 0, textAlign: 'right', fontFamily: SERIF, fontWeight: 600, fontSize: bp.isMobile ? 26 : 46, lineHeight: 1.1, color: '#FDF9F1' }}>
        Crafting your<br />unique story.
      </h2>
    </section>
  );
}
