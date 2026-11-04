import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBreakpoint, rGutter } from '../../hooks/useBreakpoint';
import { CATEGORY_LINKS, useCategoryCounts, hasProducts } from './categoryLinks';

const SERIF = "'Cormorant Garamond', Georgia, serif";

const DETAILS = {
  'Home & Living':         { body: 'Everyday objects, beautifully considered.', img: '/images/v3/ceramics.jpg' },
  'Fashion & Accessories': { body: 'Small details. A signature style.',         img: '/images/v3/bags.jpg' },
  'Beauty & Wellness':     { body: 'A little ritual goes a long way.',          img: '/images/v3/skincare.jpg' },
  'Gifts & Lifestyle':     { body: 'Thoughtful things, waiting to be found.',   img: '/images/v3/decor.jpg' },
};
const COLLECTIONS = CATEGORY_LINKS.map(c => ({ name: c.label, root: c.root, to: c.to, ...DETAILS[c.label] }));

function CollectionCard({ item, index, bp }) {
  const [hov, setHov] = useState(false);
  return (
    <Link to={item.to} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ display: 'block', textDecoration: 'none', color: '#5B4632' }}>
      <div style={{ position: 'relative', aspectRatio: '1 / 1', overflow: 'hidden', borderBottom: '3px solid #5B4632' }}>
        <img src={item.img} alt={item.name} loading="lazy" decoding="async"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: hov ? 'scale(1.05)' : 'none', transition: 'transform .5s ease' }} />
        <span style={{ position: 'absolute', top: 14, left: 14, width: 26, height: 26, borderRadius: '50%', background: '#5B4632', color: '#FDF9F1', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>0{index + 1}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginTop: 16, fontFamily: SERIF, fontSize: bp.isMobile ? 19 : 24, fontWeight: 500, lineHeight: 1.2 }}>
        {item.name} <span style={{ fontSize: 15 }}>↗</span>
      </div>
      <p style={{ margin: '10px 0 0', fontSize: 11, lineHeight: 1.5, color: '#79634E' }}>{item.body}</p>
    </Link>
  );
}

export default function CollectionsSection() {
  const bp     = useBreakpoint();
  const counts = useCategoryCounts();
  const shown  = COLLECTIONS.filter(c => hasProducts(counts, c.root));
  return (
    <section id="collections" style={{ scrollMarginTop: 90, background: '#FDF9F1', padding: bp.isMobile ? '44px 0' : '66px 0 60px' }}>
      <div style={rGutter(bp)}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 30 }}>
          <div>
            <div style={{ fontSize: 9, letterSpacing: '.2em', color: '#5B4632', marginBottom: 16 }}>A WORLD OF GOOD FINDS</div>
            <h2 style={{ fontFamily: SERIF, fontSize: bp.isMobile ? 32 : 42, fontWeight: 500, color: '#5B4632', margin: 0, lineHeight: 1.1 }}>Your store. Your kind of extraordinary.</h2>
          </div>
          <Link to="/products" style={{ display: 'flex', gap: 30, fontSize: 11, color: '#5B4632', textDecoration: 'none', borderBottom: '1px solid #5B4632', paddingBottom: 8 }}>
            Explore all products <span>↗</span>
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: bp.isMobile ? 'repeat(2,1fr)' : `repeat(${Math.max(shown.length, 3)},1fr)`, gap: bp.isMobile ? '28px 12px' : 22 }}>
          {shown.map((item, i) => <CollectionCard key={item.name} item={item} index={i} bp={bp} />)}
        </div>
      </div>
    </section>
  );
}
