import { useState } from 'react';
import LandingNavbar      from './landing/LandingNavbar';
import HeroSection        from './landing/HeroSection';
import SocialProofTicker  from './landing/SocialProofTicker';
import CategoryNavBar     from './landing/CategoryNavBar';
import PressStrip         from './landing/PressStrip';
import ShopByCategory     from './landing/ShopByCategory';
import FeaturedSuppliers  from './landing/FeaturedSuppliers';
import NewThisWeek        from './landing/NewThisWeek';
import BrowseByRegion     from './landing/BrowseByRegion';
import SourceConfidently  from './landing/SourceConfidently';
import StatsSection       from './landing/StatsSection';
import Testimonials       from './landing/Testimonials';
import FaqSection         from './landing/FaqSection';
import BuyerStory         from './landing/BuyerStory';
import BuyerFeatures      from './landing/BuyerFeatures';
import NewsletterSection  from './landing/NewsletterSection';
import CtaBanner          from './landing/CtaBanner';
import LandingFooter      from './landing/LandingFooter';

export default function LandingPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const handleCategorySelect = (cat) => {
    setActiveCategory(cat);
    setTimeout(() => {
      document.getElementById('shop-by-category')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 40);
  };

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: '#F7F1E8', minHeight: '100vh', overflowX: 'hidden' }}>
      <LandingNavbar />
      <HeroSection />
      <SocialProofTicker />
      <CategoryNavBar activeCategory={activeCategory} onSelect={handleCategorySelect} />
      <PressStrip />
      <ShopByCategory activeCategory={activeCategory} onCategoryChange={handleCategorySelect} />
      <FeaturedSuppliers />
      <NewThisWeek />
      <BrowseByRegion />
      <SourceConfidently />
      <StatsSection />
      <Testimonials />
      <FaqSection />
      <BuyerStory />
      <BuyerFeatures />
      <NewsletterSection />
      <CtaBanner />
      <LandingFooter />
    </div>
  );
}
