import { useNavigate } from 'react-router-dom';
import { useBreakpoint } from '../../hooks/useBreakpoint';

const SERIF = "'Canela', 'Cormorant Garamond', Georgia, serif";

const ITEMS = [
  { label: 'Finishes & sizes',      text: 'Explore materials, colours and dimensions.' },
  { label: 'Your brand',            text: 'Ask about logos, labels and packaging.' },
  { label: 'Samples & order terms', text: 'Confirm development fees, minimums and sample approval.' },
];

// Reference layout: 1440px → 520px tall (684px photo + mocha panel, content vertically centred);
// 390px → 780px tall (293px photo on top, panel below with 37px / 23.4px padding).
export default function CustomisationSection() {
  const navigate = useNavigate();
  const bp = useBreakpoint();
  const m  = bp.isMobile;
  return (
    <section style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : '47.5fr 52.5fr', background: '#F6E5C5' }}>
      <div style={{ position: 'relative', height: m ? 293 : 'auto', minHeight: m ? 0 : 520 }}>
        <img src="/images/v3/furniture-design-workspace-edited.jpg" alt="Designer sketching armchair designs at a workbench" loading="lazy" decoding="async"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
      <div style={{ background: '#5B4632', color: '#F4D9A0', padding: m ? '37px 23.4px' : bp.isTablet ? '44px 36px' : '44px 60.5px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
        <h2 style={{ fontFamily: SERIF, fontSize: m ? 38 : 46.08, fontWeight: 300, lineHeight: 1.13, letterSpacing: '-0.5px', color: '#F4D9A0', margin: 0 }}>
          Customisation &amp;<br />private label
        </h2>
        <dl style={{ margin: `${m ? 23 : 30}px 0 0`, width: '100%', maxWidth: 470 }}>
          {ITEMS.map((it, i) => (
            <div key={it.label} style={{ padding: i === 0 ? '0 0 16px' : '15px 0 16px', borderTop: i === 0 ? 'none' : '1px solid rgba(244,217,160,.23)' }}>
              <dt style={{ fontSize: 10, lineHeight: '15px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: '#F4D9A0' }}>{it.label}</dt>
              <dd style={{ margin: '6px 0 0', fontSize: 13, lineHeight: 1.7, color: '#F2E5D1' }}>{it.text}</dd>
            </div>
          ))}
        </dl>
        <button type="button" onClick={() => navigate('/contact')}
          style={{ marginTop: 28, minWidth: 176, height: 44, padding: '0 16px', background: '#FDF9F1', color: '#5B4632', border: 'none', borderRadius: 3, fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 13, lineHeight: '18.2px', fontWeight: 600, letterSpacing: '0.1px', cursor: 'pointer', transition: 'background .15s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#F0DCC0'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#FDF9F1'; }}>
          Talk to our team
        </button>
      </div>
    </section>
  );
}
