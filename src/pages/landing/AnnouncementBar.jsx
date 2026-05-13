export default function AnnouncementBar() {
  return (
    <div style={{
      background: 'linear-gradient(90deg,#1C1915 0%,#2A2320 50%,#1C1915 100%)',
      color: 'rgba(255,255,255,.82)', fontSize: 12, fontWeight: 500,
      textAlign: 'center', padding: '10px 20px',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
    }}>
      <span style={{
        background: 'linear-gradient(135deg,#C4773A,#A8622E)',
        color: '#fff', fontSize: 9, fontWeight: 800,
        padding: '3px 10px', borderRadius: 4, letterSpacing: '.08em', textTransform: 'uppercase',
      }}>NEW</span>
      Trade assurance now covers international shipments —{' '}
      <span style={{ color: '#E8A876', fontWeight: 600, cursor: 'pointer' }}>Learn more →</span>
    </div>
  );
}
