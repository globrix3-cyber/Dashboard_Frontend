import LandingNavbar      from './landing/LandingNavbar';
import HeroSection        from './landing/HeroSection';
import BenefitsStrip      from './landing/BenefitsStrip';
import CollectionsSection from './landing/CollectionsSection';
import NewThisWeek        from './landing/NewThisWeek';
import WhyGlobrixa        from './landing/WhyGlobrixa';
import MakerStory         from './landing/MakerStory';
import CraftBand          from './landing/CraftBand';
import RetailAudience     from './landing/RetailAudience';
import FreshWay           from './landing/FreshWay';
import SellerBanner       from './landing/SellerBanner';
import NewsletterSection  from './landing/NewsletterSection';
import LandingFooter      from './landing/LandingFooter';

export default function LandingPage() {
  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: '#FDF9F1', minHeight: '100vh', overflowX: 'clip' }}>
      <LandingNavbar />
      <HeroSection />
      <BenefitsStrip />
      <CollectionsSection />
      <NewThisWeek />
      <WhyGlobrixa />
      <MakerStory />
      <CraftBand />
      <RetailAudience />
      <FreshWay />
      <SellerBanner />
      <NewsletterSection />
      <LandingFooter />
    </div>
  );
}
