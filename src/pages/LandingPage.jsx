import AnnouncementBar    from './landing/AnnouncementBar';
import LandingNavbar      from './landing/LandingNavbar';
import HeroSection        from './landing/HeroSection';
import SocialProofTicker  from './landing/SocialProofTicker';
import CategoryNavBar     from './landing/CategoryNavBar';
import PressStrip         from './landing/PressStrip';
import ShopByCategory     from './landing/ShopByCategory';
import FeaturedSuppliers  from './landing/FeaturedSuppliers';
import TrendingProducts   from './landing/TrendingProducts';
import NewThisWeek        from './landing/NewThisWeek';
import TrendingByCategory from './landing/TrendingByCategory';
import CuratedCollections from './landing/CuratedCollections';
import BrowseByRegion     from './landing/BrowseByRegion';
import HowItWorks         from './landing/HowItWorks';
import PlatformFeatures   from './landing/PlatformFeatures';
import StatsSection       from './landing/StatsSection';
import Testimonials       from './landing/Testimonials';
import ForBrandsSplit     from './landing/ForBrandsSplit';
import FaqSection         from './landing/FaqSection';
import NewsletterSection  from './landing/NewsletterSection';
import CtaBanner          from './landing/CtaBanner';
import LandingFooter      from './landing/LandingFooter';

export default function LandingPage() {
  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: '#F7F1E8', minHeight: '100vh', overflowX: 'hidden' }}>
      <AnnouncementBar />
      <LandingNavbar />
      <HeroSection />
      <SocialProofTicker />
      <CategoryNavBar />
      <PressStrip />
      <ShopByCategory />
      <FeaturedSuppliers />
      <TrendingProducts />
      <NewThisWeek />
      <TrendingByCategory />
      <CuratedCollections />
      <BrowseByRegion />
      <HowItWorks />
      <PlatformFeatures />
      <StatsSection />
      <Testimonials />
      <ForBrandsSplit />
      <FaqSection />
      <NewsletterSection />
      <CtaBanner />
      <LandingFooter />
    </div>
  );
}
