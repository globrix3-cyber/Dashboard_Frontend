import { useSelector } from 'react-redux';
import { api } from '../services/api';
import { useFetchData } from '../hooks/useFetchData';
import { useLandingBreakpoint } from '../hooks/useBreakpoint';
import { useWishlist } from '../hooks/useWishlist';
import HomeBanner from './buyer-home/HomeBanner';
import CategoryTiles from './buyer-home/CategoryTiles';
import { pickCategoryTiles } from './buyer-home/pickCategoryTiles';
import FeaturedProducts from './buyer-home/FeaturedProducts';

const SERIF = "'Canela', 'Cormorant Garamond', Georgia, serif";

// Signed-in buyer home, laid out to the client's Canva (V2, pages 7, 8, 10, 11, 18, 19):
// rotating banner → greeting → category tiles → featured products (4 × 2) → retail band.
export default function BuyerDashboard() {
  const { userName } = useSelector((s) => s.auth);
  const bp = useLandingBreakpoint();
  const m = bp.isMobile;
  const wishlist = useWishlist();

  const { data: rawProducts = [], loading: productsLoading, error: productsError } = useFetchData(() => api.getProducts());
  const { data: rawCategories = [] } = useFetchData(() => api.getCategories());

  const products = Array.isArray(rawProducts) ? rawProducts : [];
  const tiles = pickCategoryTiles(rawCategories, products);
  const firstName = (userName || '').trim().split(/\s+/)[0];

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: '#FDF9F1', color: '#5B4632' }}>
      <HomeBanner />

      <div style={{ maxWidth: 1600, margin: '0 auto', padding: m ? '30px 5% 0' : '48px 4.3% 0' }}>
        <h1 style={{ margin: 0, fontFamily: SERIF, fontWeight: 300, letterSpacing: '-1px', lineHeight: 1.05, fontSize: m ? 34 : 'clamp(40px, 3.6vw, 56px)', color: '#5B4632' }}>
          {firstName ? `Hi, ${firstName}` : 'Welcome back'}
        </h1>

        <CategoryTiles tiles={tiles} />
        <FeaturedProducts products={products} wishlist={wishlist} loading={productsLoading} error={productsError} />
      </div>

    </div>
  );
}
