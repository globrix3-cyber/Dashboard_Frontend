import { T, W, eyebrow } from './tokens';

const STEPS = [
  { n:'01', icon:'🔐', title:'Create your account',    desc:'Sign up as a buyer or supplier. GST-based verification completes in under 24 hours — no paperwork, no delays.' },
  { n:'02', icon:'🔍', title:'Browse or post an RFQ',  desc:'Search 50,000+ products across 24 categories, or post requirements and receive quotes from verified suppliers instantly.' },
  { n:'03', icon:'🚀', title:'Order with confidence',  desc:'Pay on net 30 terms, track shipments in real time, and manage contracts digitally — all under one trade-assured roof.' },
];

export default function HowItWorks() {
  return (
    <section style={{ background: T.cd, padding: '80px 56px' }}>
      <div style={{ ...W }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ ...eyebrow, display: 'inline-block', marginBottom: 10 }}>Simple Process</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(26px,3vw,40px)', fontWeight: 700, color: T.ink, letterSpacing: -1, lineHeight: 1.1, textAlign: 'center' }}>Up and running in minutes</h2>
          <p style={{ fontSize: 15, color: T.mu, marginTop: 10, maxWidth: 460, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.7 }}>No lengthy onboarding. Discover, connect, and transact — all in one place.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2 }}>
          {STEPS.map((s, i) => (
            <div key={s.n} style={{ background: T.w, padding: '44px 38px', borderRadius: i === 0 ? '16px 0 0 16px' : i === 2 ? '0 16px 16px 0' : 0, borderLeft: i > 0 ? `1px solid ${T.bs}` : 'none' }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 52, fontWeight: 900, WebkitTextStroke: `2px ${T.t}`, color: 'transparent', lineHeight: 1, marginBottom: 20 }}>{s.n}</div>
              <div style={{ fontSize: 28, marginBottom: 16 }}>{s.icon}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: T.ink, marginBottom: 10 }}>{s.title}</div>
              <p style={{ fontSize: 14, color: T.mu, lineHeight: 1.78 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
