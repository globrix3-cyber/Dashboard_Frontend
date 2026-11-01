export const T = {
  c:   '#FDF9F1',
  cm:  '#F0DCC0',
  cd:  '#E3D5C1',
  w:   '#FDF9F1',
  t:   '#C8792C',
  td:  '#C8792C',
  tl:  '#FDF9F1',
  tm:  '#F0DCC0',
  ink: '#5B4632',
  is:  '#5B4632',
  mu:  '#79634E',
  b:   '#E3D5C1',
  bs:  '#E3D5C1',
  g:   '#3D7A52',
  gl:  '#EBF4EE',
  n:   '#5B4632',
  nl:  '#F0DCC0',
};

export const shadow = {
  sm: '0 2px 8px rgba(43,32,22,.07)',
  md: '0 8px 32px rgba(43,32,22,.10)',
  lg: '0 20px 64px rgba(43,32,22,.14)',
};

export const W = { maxWidth: 1200, margin: '0 auto' };

export const eyebrow = {
  fontSize: 11, fontWeight: 700, letterSpacing: '.14em',
  textTransform: 'uppercase', color: '#C8792C', marginBottom: 8,
};

export const sectionTitle = {
  fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
  fontSize: 'clamp(28px,3vw,44px)', fontWeight: 700,
  color: '#5B4632', letterSpacing: -0.5, lineHeight: 1.1,
};

export const tag = (variant = 't') => {
  const map = {
    t: { background: '#FDF9F1', color: '#C8792C' },
    g: { background: '#EBF4EE', color: '#3D7A52' },
    n: { background: '#F0DCC0', color: '#5B4632' },
  };
  return { ...map[variant], fontSize: 10, padding: '3px 9px', borderRadius: 4, fontWeight: 600, display: 'inline-block' };
};

export const btnPrimary = {
  padding: '11px 26px', borderRadius: 8, border: 'none',
  background: 'linear-gradient(135deg,#C8792C,#C8792C)',
  color: '#FDF9F1', fontSize: 14, fontWeight: 700,
  cursor: 'pointer', fontFamily: 'inherit',
  boxShadow: '0 8px 28px rgba(200,121,44,.38)',
  transition: '.18s', letterSpacing: '.01em',
};

export const btnGhost = {
  padding: '10px 24px', borderRadius: 8,
  border: '1.5px solid #E3D5C1', background: 'transparent',
  fontSize: 14, fontWeight: 500, color: '#5B4632',
  cursor: 'pointer', fontFamily: 'inherit', transition: '.18s',
};

export const viewAll = {
  fontSize: 13, color: '#C8792C', fontWeight: 600,
  textDecoration: 'none', display: 'inline-flex',
  alignItems: 'center', gap: 5, padding: '8px 16px',
  borderRadius: 7, border: '1.5px solid rgba(200,121,44,.25)',
  background: '#FDF9F1', transition: '.18s',
  whiteSpace: 'nowrap', flexShrink: 0, cursor: 'pointer',
};
