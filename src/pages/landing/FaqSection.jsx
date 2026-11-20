import { useState } from 'react';
import { FAQS } from './data';
import { useBreakpoint } from '../../hooks/useBreakpoint';

const INK = '#5B4632';
const MUTED = '#79634E';
const SERIF = "'Canela', 'Cormorant Garamond', Georgia, serif";

function FaqItem({ faq, idx, open, onToggle, small }) {
  const panelId = `faq-panel-${idx}`;
  const btnId   = `faq-btn-${idx}`;
  const icon    = small ? 30 : 34;
  return (
    <div style={{
      background: open ? '#FFFDF8' : '#F8F2E9', borderRadius: 10, border: `1px solid ${open ? '#CBB18F' : 'transparent'}`, overflow: 'hidden',
      boxShadow: open ? '0 7px 24px rgba(43,32,22,.03)' : 'none', transition: 'background .25s, border-color .25s, box-shadow .25s',
    }}>
      <h3 style={{ margin: 0 }}>
        <button id={btnId} onClick={onToggle} aria-expanded={open} aria-controls={panelId}
          style={{ width: '100%', boxSizing: 'border-box', display: 'grid', gridTemplateColumns: `minmax(0, 1fr) ${icon}px`, alignItems: 'center', gap: small ? 15 : 20, fontFamily: "'DM Sans', system-ui, sans-serif", minHeight: small ? 78 : 80, padding: small ? '19px 18px' : '21px 25px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: small ? 14 : 15, lineHeight: 1.55, fontWeight: 500, letterSpacing: 'normal', color: INK }}>
          <span>{faq.q}</span>
          <span aria-hidden="true" style={{ width: icon, height: icon, boxSizing: 'border-box', borderRadius: '50%', border: `1px solid ${open ? INK : 'rgba(91,70,50,.25)'}`, background: open ? INK : 'transparent', position: 'relative', transition: 'background .25s, border-color .25s' }}>
            <span style={{ position: 'absolute', left: '50%', top: '50%', width: 12, height: 1.5, marginLeft: -6, marginTop: -0.75, background: open ? '#F4D9A0' : INK }} />
            <span style={{ position: 'absolute', left: '50%', top: '50%', width: 1.5, height: 12, marginLeft: -0.75, marginTop: -6, background: open ? '#F4D9A0' : INK, opacity: open ? 0 : 1, transform: open ? 'rotate(90deg)' : 'none', transition: 'opacity .2s, transform .3s' }} />
          </span>
        </button>
      </h3>
      {open && (
        <div id={panelId} role="region" aria-labelledby={btnId} style={{ padding: small ? '0 18px 22px' : '0 79px 25px 25px' }}>
          <p style={{ margin: 0, paddingTop: 3, maxWidth: 620, fontSize: small ? 13 : 14, lineHeight: 1.85, color: MUTED }}>{faq.a}</p>
        </div>
      )}
    </div>
  );
}

// Mirrors the reference .faq-refined rules: two columns (minmax(240px, .75fr) and
// 1.45fr) with a clamp(40px, 6vw, 100px) gap in a 6% gutter; one column up to 900px
// (heading beside nothing, 47px), compact cards up to 600px.
export default function FaqSection() {
  const { width: w } = useBreakpoint();
  const le900 = w <= 900, le600 = w <= 600;
  const [openIdx, setOpenIdx] = useState(-1);

  return (
    <section id="faq" style={{
      display: 'grid', alignItems: 'start', background: '#FDF9F1', color: INK, scrollMarginTop: 30, boxSizing: 'border-box',
      gridTemplateColumns: le900 ? '1fr' : 'minmax(240px, .75fr) minmax(0, 1.45fr)',
      gap: le600 ? 28 : le900 ? 30 : 'clamp(40px, 6vw, 100px)',
      padding: le600 ? '43px 5%' : le900 ? '55px 5%' : '80px 6%',
    }}>
      <div style={le900 ? { padding: 0 } : { position: 'sticky', top: 32, padding: '9px 0' }}>
        <h2 style={{ fontFamily: SERIF, fontSize: le600 ? 43 : le900 ? 47 : 'clamp(38px, 4.1vw, 62px)', fontWeight: 300, lineHeight: 1.02, letterSpacing: '-1px', color: INK, margin: le600 ? '16px 0' : le900 ? '15px 0 0' : '20px 0 22px', maxWidth: le900 && !le600 ? 'calc(50% - 15px)' : 'none' }}>
          Frequently asked<br />questions.
        </h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0 }}>
        {FAQS.map((faq, i) => (
          <FaqItem key={faq.q} faq={faq} idx={i} small={le600} open={openIdx === i} onToggle={() => setOpenIdx(o => (o === i ? -1 : i))} />
        ))}
      </div>
    </section>
  );
}
