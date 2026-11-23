import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useLandingBreakpoint } from '../../hooks/useBreakpoint';

const SERIF = "'Canela', 'Cormorant Garamond', Georgia, serif";
// The client will share new portraits on Drive (Canva V2, page 10); swap them in here.
const LEFT_IMAGE  = { src: '/images/v3/retailer-shop-cottonbro.jpg', alt: 'Shop owner behind the counter of her lifestyle store', pos: 'center' };
const RIGHT_IMAGE = { src: '/images/v3/retailer-packing-kampus.jpg', alt: 'Retailer holding a packed shipping box', pos: 'center top' };

export default function RetailBand() {
  const bp = useLandingBreakpoint();
  const m = bp.isMobile;
  const img = (i, row) => (
    <img src={i.src} alt={i.alt} loading="lazy" decoding="async"
      style={{ display: 'block', width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', objectPosition: i.pos, background: '#79634E', minWidth: 0, gridRow: row }} />
  );
  return (
    <section aria-labelledby="home-retail" style={{ background: '#5B4632', marginTop: m ? 56 : 88, padding: m ? '44px 5% 36px' : 'clamp(40px, 4.4vw, 70px) 4.3%' }}>
      <div style={{ maxWidth: 1600, margin: '0 auto', display: 'grid', gridTemplateColumns: m ? '1fr 1fr' : '1fr 1.05fr 1fr', alignItems: 'center', gap: m ? '28px 12px' : '3%' }}>
        {!m && img(LEFT_IMAGE)}
        <div style={{ textAlign: 'center', gridColumn: m ? '1 / -1' : 'auto' }}>
          <h2 id="home-retail" style={{ margin: 0, fontFamily: SERIF, fontWeight: 300, color: '#F4D9A0', letterSpacing: '-.4px', lineHeight: 1.1, fontSize: m ? 34 : 'clamp(28px, 2.6vw, 42px)', textWrap: 'balance' }}>
            From Local Shops to Growing Retail Businesses
          </h2>
          <p style={{ margin: m ? '18px auto 24px' : '18px auto 26px', maxWidth: 400, color: '#F0DCC0', fontSize: m ? 15 : 'clamp(14px, 1.15vw, 17px)', lineHeight: 1.65 }}>
            Globrixa helps retailers, importers, and online sellers source distinctive furniture and home accessories their customers will love.
          </p>
          <Link to="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 28, height: 44, padding: '0 20px', background: '#C8792C', color: '#2B2016', fontSize: 13, fontWeight: 600, letterSpacing: '.1px', borderRadius: 3, textDecoration: 'none' }}>
            Start sourcing <ArrowUpRight size={15} aria-hidden />
          </Link>
        </div>
        {m ? <>{img(LEFT_IMAGE)}{img(RIGHT_IMAGE)}</> : img(RIGHT_IMAGE)}
      </div>
    </section>
  );
}
