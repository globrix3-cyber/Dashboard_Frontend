import { useNavigate } from 'react-router-dom';
import { HandHeart, Sprout, Globe, Store } from 'lucide-react';
import { useBreakpoint, rGutter } from '../../hooks/useBreakpoint';

const REASONS = [
  { Icon: HandHeart, title: 'Crafted character',     body: 'Discover pieces inspired by traditional skills and thoughtful design.' },
  { Icon: Sprout,    title: 'Considered materials',  body: 'Explore textures and finishes that bring depth to your collection.' },
  { Icon: Globe,     title: 'Global perspective',    body: 'Bring an Indian design perspective to stores around the world.' },
  { Icon: Store,     title: 'Your store, your style', body: 'Build a distinctive shortlist around your customers and your style.' },
];

export default function WhyGlobrixa() {
  const navigate = useNavigate();
  const bp       = useBreakpoint();
  return (
    <section style={{ background: '#FDF9F1', padding: bp.isMobile ? '44px 0' : '60px 0' }}>
      <div style={rGutter(bp)}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: bp.isMobile ? 32 : 46, fontWeight: 500, color: '#5B4632', textAlign: 'center', margin: `0 0 ${bp.isMobile ? 28 : 50}px` }}>WHY CHOOSE GLOBRIXA?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: bp.isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', rowGap: 28 }}>
          {REASONS.map((r, i) => (
            <div key={r.title} style={{ textAlign: 'center', padding: bp.isMobile ? '0 10px' : '0 28px', borderLeft: i && (!bp.isMobile || i % 2) ? '1px solid #E3D5C1' : 'none', color: '#5B4632' }}>
              <r.Icon size={bp.isMobile ? 40 : 52} strokeWidth={1} style={{ display: 'block', margin: '0 auto 24px' }} />
              <h3 style={{ margin: '0 0 16px', fontFamily: 'inherit', fontSize: 12, fontWeight: 600, letterSpacing: '.09em', textTransform: 'uppercase' }}>{r.title}</h3>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7 }}>{r.body}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 44 }}>
          <button onClick={() => navigate('/our-story')}
            style={{ display: 'inline-flex', gap: 34, padding: '15px 26px', background: '#5B4632', color: '#FDF9F1', fontSize: 13, border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'background .15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#2B2016'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#5B4632'; }}
          >Know more <span>↗</span></button>
        </div>
      </div>
    </section>
  );
}
