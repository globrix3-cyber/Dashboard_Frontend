import { useState } from 'react';
import { FAQS } from './data';
import { useBreakpoint, rGutter } from '../../hooks/useBreakpoint';

const INK = '#5B4632';
const MUTED = '#79634E';

function FaqItem({ faq, idx, open, onToggle, bp }) {
  const m = bp.isMobile;
  const panelId = `faq-panel-${idx}`;
  const btnId   = `faq-btn-${idx}`;
  const icon    = m ? 30 : 34;
  return (
    <div style={{ background: '#F8F2E9', borderRadius: 10, border: '1px solid transparent' }}>
      <h3 style={{ margin: 0 }}>
        <button id={btnId} onClick={onToggle} aria-expanded={open} aria-controls={panelId}
          style={{ width: '100%', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: m ? 15 : 21, fontFamily: "'DM Sans', system-ui, sans-serif", minHeight: m ? 78 : 80, padding: m ? '19px 18px' : '19px 24px 19px 25px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: m ? 14 : 15, lineHeight: 1.55, fontWeight: 500, letterSpacing: 'normal', color: INK }}>
          <span style={{ flex: 1 }}>{faq.q}</span>
          <span aria-hidden="true" style={{ width: icon, height: icon, boxSizing: 'border-box', borderRadius: '50%', border: '1px solid rgba(91,70,50,.25)', position: 'relative', flexShrink: 0 }}>
            <span style={{ position: 'absolute', left: '50%', top: '50%', width: 12, height: 1.5, marginLeft: -6, marginTop: -0.75, background: INK }} />
            <span style={{ position: 'absolute', left: '50%', top: '50%', width: 1.5, height: 12, marginLeft: -0.75, marginTop: -6, background: INK, transform: open ? 'scaleY(0)' : 'none', transition: 'transform .2s' }} />
          </span>
        </button>
      </h3>
      {open && (
        <div id={panelId} role="region" aria-labelledby={btnId}>
          <p style={{ margin: 0, padding: m ? '3px 18px 20px' : '3px 131px 25px 25px', fontSize: m ? 13 : 14, lineHeight: 1.85, color: MUTED }}>{faq.a}</p>
        </div>
      )}
    </div>
  );
}

export default function FaqSection() {
  const bp       = useBreakpoint();
  const [openIdx, setOpenIdx] = useState(-1);

  return (
    // Reference layout: 1440px → 702px tall (80px top/bottom, 6 x 82px cards + 10px gaps, cards at x=575 w=778);
    // 390px → 770px tall (43px top, 19.5px sides, h2 at +59, cards from +191).
    <section id="faq" style={{ background: '#FDF9F1', padding: bp.isMobile ? '43px 0' : '80px 0', scrollMarginTop: 140 }}>
      <div style={{ ...rGutter(bp), ...(bp.isDesktop ? { paddingLeft: 86.4, paddingRight: 86.4 } : bp.isMobile ? { paddingLeft: 19.5, paddingRight: 19.5 } : {}), display: 'grid', gridTemplateColumns: bp.isMobile ? '1fr' : bp.isTablet ? '1fr 1.4fr' : '403px 1fr', columnGap: bp.isTablet ? 32 : 86, rowGap: 25, alignItems: 'start' }}>
        <div style={{ paddingTop: bp.isMobile ? 16 : 29, paddingBottom: bp.isMobile ? 19 : 0, ...(bp.isMobile ? {} : { position: 'sticky', top: 110 }) }}>
          <h2 style={{ fontFamily: "'Canela', 'Cormorant Garamond', Georgia, serif", fontSize: bp.isMobile ? 43 : bp.isTablet ? 50 : 59, fontWeight: 300, lineHeight: 1.02, letterSpacing: '-1px', color: INK, margin: 0 }}>Frequently asked questions.</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {FAQS.map((faq, i) => (
            <FaqItem key={faq.q} faq={faq} idx={i} bp={bp} open={openIdx === i} onToggle={() => setOpenIdx(o => (o === i ? -1 : i))} />
          ))}
        </div>
      </div>
    </section>
  );
}
