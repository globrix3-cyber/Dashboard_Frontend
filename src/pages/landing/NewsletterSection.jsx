import { T, eyebrow, btnPrimary } from './tokens';

export default function NewsletterSection() {
  return (
    <div style={{ background: T.c, padding: '72px 56px', textAlign: 'center', borderTop: `1px solid ${T.bs}` }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <div style={{ ...eyebrow, marginBottom: 12 }}>Stay informed</div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 700, color: T.ink, letterSpacing: -1, marginBottom: 10 }}>Stay ahead of the market</h2>
        <p style={{ fontSize: 15, color: T.mu, lineHeight: 1.75, marginBottom: 28 }}>Weekly sourcing insights, new supplier alerts, and category trend reports — delivered to your inbox.</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <input type="email" placeholder="Enter your business email" style={{ flex: 1, border: `1.5px solid ${T.b}`, borderRadius: 8, padding: '13px 16px', fontSize: 14, fontFamily: 'inherit', background: T.w, color: T.ink, outline: 'none' }} />
          <button style={{ ...btnPrimary, whiteSpace: 'nowrap', padding: '13px 24px' }}>Subscribe free</button>
        </div>
        <p style={{ fontSize: 11, color: T.mu, marginTop: 12 }}>No spam. Unsubscribe anytime. Join 12,000+ procurement professionals.</p>
      </div>
    </div>
  );
}
