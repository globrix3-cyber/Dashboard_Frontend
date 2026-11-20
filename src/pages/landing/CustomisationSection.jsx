import { Link } from 'react-router-dom';
import { useBreakpoint } from '../../hooks/useBreakpoint';

const SERIF = "'Canela', 'Cormorant Garamond', Georgia, serif";

const ITEMS = [
  { label: 'Finishes & sizes',      text: 'Explore materials, colours and dimensions.' },
  { label: 'Your brand',            text: 'Ask about logos, labels and packaging.' },
  { label: 'Samples & order terms', text: 'Confirm development fees, minimums and sample approval.' },
];

// Mirrors the reference #makers.customisation-section rules: photo + mocha panel in
// .95fr / 1.05fr columns (photo min 520px, copy padding 44px 8%); stacked up to
// 1000px with a 16:9 photo (4:3 up to 480px) and 37px 6% padding.
export default function CustomisationSection() {
  const { width: w } = useBreakpoint();
  const stacked = w <= 1000, le760 = w <= 760, le480 = w <= 480;
  return (
    <section id="makers" style={{ display: 'grid', gridTemplateColumns: stacked ? '1fr' : '.95fr 1.05fr', alignItems: 'stretch', background: '#F6E5C5', scrollMarginTop: 30 }}>
      <div style={{ position: 'relative', minHeight: stacked ? 0 : 520, aspectRatio: stacked ? (le480 ? '4 / 3' : '16 / 9') : 'auto' }}>
        <img src="/images/v3/furniture-design-workspace-edited.jpg" alt="Designer sketching armchair designs at a workbench" loading="lazy" decoding="async"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
      </div>
      <div style={{ background: '#5B4632', color: '#F4D9A0', padding: stacked ? '37px 6%' : '44px 8%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', boxSizing: 'border-box' }}>
        <h2 style={{ fontFamily: SERIF, fontSize: le760 ? 38 : 'clamp(35px, 3.2vw, 48px)', fontWeight: 300, lineHeight: 1.13, letterSpacing: '-.5px', color: '#F4D9A0', margin: `0 0 ${le760 ? 24 : 30}px` }}>
          Customisation &amp;<br />private label
        </h2>
        <dl style={{ margin: '0 0 28px', width: '100%', maxWidth: le760 ? 'none' : 470 }}>
          {ITEMS.map((it, i) => (
            <div key={it.label} style={{ padding: i === 0 ? '0 0 16px' : '15px 0 16px', borderTop: i === 0 ? 'none' : '1px solid rgba(244,217,160,.23)', minWidth: 0 }}>
              <dt style={{ fontSize: 10, lineHeight: 1.5, fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: '#F4D9A0', marginBottom: 6 }}>{it.label}</dt>
              <dd style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: '#F2E5D1' }}>{it.text}</dd>
            </div>
          ))}
        </dl>
        <Link to="/contact"
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', width: 176, maxWidth: '100%', height: 44, padding: '0 16px', background: '#FDF9F1', color: '#5B4632', borderRadius: 3, fontSize: 13, lineHeight: 1.4, fontWeight: 600, letterSpacing: '.1px', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'background .2s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#F0DCC0'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#FDF9F1'; }}>
          Talk to our team
        </Link>
      </div>
    </section>
  );
}
