import { useState } from 'react';
import { T, eyebrow, sectionTitle } from './tokens';
import { FAQS } from './data';
import { useBreakpoint, rPad, rW } from '../../hooks/useBreakpoint';

function FaqCard({ faq, bp }) {
  const [open, setOpen] = useState(false);
  const [hov, setHov]   = useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => setOpen(o => !o)}
      style={{
        background: T.w, borderRadius: 14,
        padding: bp.isMobile ? '18px 16px' : '22px 26px',
        border: `1.5px solid ${hov || open ? 'rgba(196,119,58,.35)' : T.bs}`,
        transition: '.18s', cursor: 'pointer',
      }}
    >
      <div style={{ fontSize: bp.isMobile ? 14 : 15, fontWeight: 700, color: T.ink, marginBottom: open ? 10 : 0, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flex: 1 }}>
          <span style={{ width: 22, height: 22, background: T.tl, color: T.t, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, flexShrink: 0, marginTop: 1 }}>Q</span>
          {faq.q}
        </div>
        <span style={{ color: T.t, fontSize: 16, flexShrink: 0, transition: 'transform .2s', transform: open ? 'rotate(45deg)' : 'none' }}>+</span>
      </div>
      {open && (
        <p style={{ fontSize: 14, color: T.mu, lineHeight: 1.78, paddingLeft: 32, marginTop: 4 }}>{faq.a}</p>
      )}
    </div>
  );
}

export default function FaqSection() {
  const bp   = useBreakpoint();
  const cols = bp.isMobile ? '1fr' : 'repeat(2,1fr)';

  return (
    <section style={{ background: T.cm, padding: rPad(bp) }}>
      <div style={{ ...rW }}>
        <div style={{ marginBottom: 32 }}>
          <div style={eyebrow}>Got questions?</div>
          <h2 style={sectionTitle}>Frequently asked</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 12 }}>
          {FAQS.map(faq => <FaqCard key={faq.q} faq={faq} bp={bp} />)}
        </div>
      </div>
    </section>
  );
}
