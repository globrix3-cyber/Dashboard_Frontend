export const T = {
  c:   '#F7F1E8',
  cm:  '#EDE6D6',
  cd:  '#E2D8C6',
  w:   '#FFFFFF',
  t:   '#C4773A',
  td:  '#A8622E',
  tl:  '#FDF3EB',
  tm:  '#E8A876',
  ink: '#1C1915',
  is:  '#3D3830',
  mu:  '#8A8178',
  b:   '#DEDAD0',
  bs:  '#EDE8DF',
  g:   '#3D7A52',
  gl:  '#EBF4EE',
  n:   '#1B3175',
  nl:  '#EEF2FB',
};

export const shadow = {
  sm: '0 2px 8px rgba(28,25,21,.07)',
  md: '0 8px 32px rgba(28,25,21,.10)',
  lg: '0 20px 64px rgba(28,25,21,.14)',
};

export const W = { maxWidth: 1200, margin: '0 auto' };

export const eyebrow = {
  fontSize: 11, fontWeight: 700, letterSpacing: '.14em',
  textTransform: 'uppercase', color: '#C4773A', marginBottom: 8,
};

export const sectionTitle = {
  fontFamily: "'Playfair Display', Georgia, serif",
  fontSize: 'clamp(26px,3vw,40px)', fontWeight: 700,
  color: '#1C1915', letterSpacing: -1, lineHeight: 1.1,
};

export const tag = (variant = 't') => {
  const map = {
    t: { background: '#FDF3EB', color: '#C4773A' },
    g: { background: '#EBF4EE', color: '#3D7A52' },
    n: { background: '#EEF2FB', color: '#1B3175' },
  };
  return { ...map[variant], fontSize: 10, padding: '3px 9px', borderRadius: 4, fontWeight: 600, display: 'inline-block' };
};

export const btnPrimary = {
  padding: '11px 26px', borderRadius: 8, border: 'none',
  background: 'linear-gradient(135deg,#C4773A,#A8622E)',
  color: '#fff', fontSize: 14, fontWeight: 700,
  cursor: 'pointer', fontFamily: 'inherit',
  boxShadow: '0 8px 28px rgba(196,119,58,.38)',
  transition: '.18s', letterSpacing: '.01em',
};

export const btnGhost = {
  padding: '10px 24px', borderRadius: 8,
  border: '1.5px solid #DEDAD0', background: 'transparent',
  fontSize: 14, fontWeight: 500, color: '#1C1915',
  cursor: 'pointer', fontFamily: 'inherit', transition: '.18s',
};

export const viewAll = {
  fontSize: 13, color: '#C4773A', fontWeight: 600,
  textDecoration: 'none', display: 'inline-flex',
  alignItems: 'center', gap: 5, padding: '8px 16px',
  borderRadius: 7, border: '1.5px solid rgba(196,119,58,.25)',
  background: '#FDF3EB', transition: '.18s',
  whiteSpace: 'nowrap', flexShrink: 0, cursor: 'pointer',
};
