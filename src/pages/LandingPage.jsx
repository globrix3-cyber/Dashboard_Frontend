import LandingNavbar      from './landing/LandingNavbar';
import HeroSection        from './landing/HeroSection';
import BenefitsStrip      from './landing/BenefitsStrip';
import CollectionsSection from './landing/CollectionsSection';
import NewThisWeek        from './landing/NewThisWeek';
import WhyGlobrixa        from './landing/WhyGlobrixa';
import MakerStory         from './landing/MakerStory';
import CraftBand          from './landing/CraftBand';
import RetailAudience     from './landing/RetailAudience';
import FaqSection         from './landing/FaqSection';
import NewsletterSection  from './landing/NewsletterSection';
import LandingFooter      from './landing/LandingFooter';
import usePageMeta        from '../hooks/usePageMeta';

const ORGANIZATION_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Globrixa',
  url: 'https://www.globrixa.com/',
  logo: 'https://www.globrixa.com/logo.png',
  description: "India's B2B wholesale marketplace connecting retailers with verified Indian makers and suppliers.",
};

export default function LandingPage() {
  usePageMeta({
    title: "Globrixa — India's B2B Wholesale Marketplace",
    description: 'Source handcrafted home décor, furniture and lifestyle products wholesale from verified Indian makers and suppliers. Request quotes, compare suppliers and order in bulk on Globrixa.',
    path: '/',
    jsonLd: ORGANIZATION_LD,
  });
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
