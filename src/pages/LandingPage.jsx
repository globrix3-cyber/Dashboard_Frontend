import LandingNavbar      from './landing/LandingNavbar';
import HeroSection        from './landing/HeroSection';
import BenefitsStrip      from './landing/BenefitsStrip';
import CollectionsSection from './landing/CollectionsSection';
import CraftBand          from './landing/CraftBand';
import NewThisWeek        from './landing/NewThisWeek';
import RetailAudience     from './landing/RetailAudience';
import WhyGlobrixa        from './landing/WhyGlobrixa';
import MakerStory         from './landing/MakerStory';
import FaqSection         from './landing/FaqSection';
import NewsletterSection  from './landing/NewsletterSection';
import LandingFooter      from './landing/LandingFooter';

export default function LandingPage() {
  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: '#FDF9F1', minHeight: '100vh', overflowX: 'clip' }}>
      <LandingNavbar />
      <HeroSection />
      <BenefitsStrip />
      <CollectionsSection />
      <CraftBand />
      <NewThisWeek />
      <RetailAudience />
      <WhyGlobrixa />
      <MakerStory />
      <FaqSection />
      <NewsletterSection />
      <LandingFooter />
    </div>
  );
}
