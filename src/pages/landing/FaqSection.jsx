import { useState } from 'react';
import { T } from './tokens';
import { FAQS } from './data';
import { useBreakpoint, rGutter } from '../../hooks/useBreakpoint';

function FaqCard({ faq, bp }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: T.w, borderRadius: 14, border: `1px solid ${open ? 'rgba(200,121,44,.45)' : T.bs}`, transition: '.18s', alignSelf: 'start' }}>
      <button onClick={() => setOpen(o => !o)} aria-expanded={open}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: bp.isMobile ? '18px 16px' : '32px 22px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', fontSize: bp.isMobile ? 14 : 15, fontWeight: 600, color: T.ink }}>
        <span style={{ width: 28, height: 28, background: T.tl, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, flexShrink: 0 }}>Q</span>
        <span style={{ flex: 1 }}>{faq.q}</span>
        <span style={{ color: T.t, fontSize: 22, fontWeight: 400, lineHeight: 1, flexShrink: 0, transition: 'transform .2s', transform: open ? 'rotate(45deg)' : 'none' }}>+</span>
      </button>
      {open && <p style={{ margin: 0, padding: bp.isMobile ? '0 16px 18px 58px' : '0 22px 28px 64px', fontSize: 14, lineHeight: 1.75, color: T.mu }}>{faq.a}</p>}
    </div>
  );
}

export default function FaqSection() {
  const bp = useBreakpoint();
  return (
    <section style={{ background: T.c, padding: bp.isMobile ? '44px 0' : '66px 0' }}>
      <div style={rGutter(bp)}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: bp.isMobile ? 34 : 54, fontWeight: 600, color: T.ink, margin: `0 0 ${bp.isMobile ? 24 : 32}px` }}>Frequently asked questions.</h2>
        <div style={{ display: 'grid', gridTemplateColumns: bp.isMobile ? '1fr' : 'repeat(2,1fr)', gap: 17, columnGap: 20 }}>
          {FAQS.map(faq => <FaqCard key={faq.q} faq={faq} bp={bp} />)}
        </div>
      </div>
    </section>
  );
}
