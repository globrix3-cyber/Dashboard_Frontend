import { useNavigate } from 'react-router-dom';
import { useBreakpoint, rGutter } from '../../hooks/useBreakpoint';

const REASONS = [
  { img: '/images/v3/why-globrixa-craft.webp',      alt: 'An artisan shaping a wooden furniture component',       title: 'Crafted for distinction',    body: 'Source Indian craft-led designs that give your retail collection a distinctive point of view.' },
  { img: '/images/v3/why-globrixa-materials.webp',  alt: 'Linen, wood finishes, ceramic glaze and woven samples', title: 'Materials that matter',      body: 'Compare textures, finishes and material details to select pieces that fit your store.' },
  { img: '/images/v3/why-globrixa-trade.webp',      alt: 'Carved wooden furniture beside protective packaging',   title: 'Trade-focused sourcing',     body: 'Shortlist products and specify quantities, samples and delivery requirements in your wholesale enquiry.' },
  { img: '/images/v3/newsletter-coffee-table.jpeg', alt: 'A wooden coffee table in a warm living room',           title: 'Curated for your customers', body: 'Bring furniture and home accessories together around your customers, space and price points.' },
];

export default function WhyGlobrixa() {
  const navigate = useNavigate();
  const bp       = useBreakpoint();
  return (
    <section style={{ background: '#FDF9F1', padding: bp.isMobile ? '44px 0' : '66px 0 60px' }}>
      <div style={rGutter(bp)}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: bp.isMobile ? 34 : 46, fontWeight: 500, color: '#5B4632', textAlign: 'center', margin: `0 0 ${bp.isMobile ? 28 : 46}px` }}>why GLOBRIXA</h2>
        <div style={{ display: 'grid', gridTemplateColumns: bp.isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: bp.isMobile ? 16 : 24 }}>
          {REASONS.map(r => (
            <div key={r.title}>
              <img src={r.img} alt={r.alt} loading="lazy" decoding="async" style={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', borderRadius: 6, display: 'block' }} />
              <h3 style={{ margin: '24px 0 14px', fontSize: 12, fontWeight: 600, letterSpacing: '.09em', textTransform: 'uppercase', color: '#5B4632' }}>{r.title}</h3>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.68, color: '#5B4632' }}>{r.body}</p>
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
