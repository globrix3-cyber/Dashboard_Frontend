import { useState } from 'react';
import { T, W, eyebrow, sectionTitle } from './tokens';
import { FAQS } from './data';

function FaqCard({ faq }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ background: T.w, borderRadius: 14, padding: '26px 28px', border: `1.5px solid ${hov ? 'rgba(196,119,58,.35)' : T.bs}`, transition: '.18s' }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: T.ink, marginBottom: 10, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <span style={{ width: 24, height: 24, background: T.tl, color: T.t, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, flexShrink: 0, marginTop: 1 }}>Q</span>
        {faq.q}
      </div>
      <p style={{ fontSize: 14, color: T.mu, lineHeight: 1.78, paddingLeft: 34 }}>{faq.a}</p>
    </div>
  );
}

export default function FaqSection() {
  return (
    <section style={{ background: T.cm, padding: '80px 56px' }}>
      <div style={{ ...W }}>
        <div style={{ marginBottom: 40 }}>
          <div style={eyebrow}>Got questions?</div>
          <h2 style={sectionTitle}>Frequently asked</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {FAQS.map(faq => <FaqCard key={faq.q} faq={faq} />)}
        </div>
      </div>
    </section>
  );
}
