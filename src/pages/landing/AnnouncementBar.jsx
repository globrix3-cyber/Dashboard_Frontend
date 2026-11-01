export default function AnnouncementBar() {
  return (
    <div style={{
      background: 'linear-gradient(90deg,#5B4632 0%,#2B2016 50%,#5B4632 100%)',
      color: 'rgba(253,249,241,.82)', fontSize: 12, fontWeight: 500,
      textAlign: 'center', padding: '10px 18px',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap',
    }}>
      <span style={{
        background: 'linear-gradient(135deg,#C8792C,#C8792C)',
        color: '#FDF9F1', fontSize: 9, fontWeight: 800,
        padding: '3px 10px', borderRadius: 4, letterSpacing: '.08em', textTransform: 'uppercase',
      }}>NEW</span>
      Trade assurance now covers international shipments —{' '}
      <span style={{ color: '#F0DCC0', fontWeight: 600, cursor: 'pointer' }}>Learn more →</span>
    </div>
  );
}
