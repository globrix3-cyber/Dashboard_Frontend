import { useEffect }     from 'react';
import { useLocation }   from 'react-router-dom';
import LandingNavbar      from './landing/LandingNavbar';
import HeroSection        from './landing/HeroSection';
import BenefitsStrip      from './landing/BenefitsStrip';
import CollectionsSection from './landing/CollectionsSection';
import NewThisWeek        from './landing/NewThisWeek';
import WhyGlobrixa        from './landing/WhyGlobrixa';
import AboutBanner        from './landing/AboutBanner';
import CustomisationSection from './landing/CustomisationSection';
import VideoStories       from './landing/VideoStories';
import TalkToTeamBanner   from './landing/TalkToTeamBanner';
import CraftBand          from './landing/CraftBand';
import RetailAudience     from './landing/RetailAudience';
import ProcessSection     from './landing/ProcessSection';
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
  const { hash } = useLocation();
  // Links such as /#products (footer) and /#faq land on the section, including from other pages.
  useEffect(() => {
    if (!hash) return undefined;
    const id = decodeURIComponent(hash.slice(1));
    const go = () => document.getElementById(id)?.scrollIntoView({ block: 'start' });
    const t = setTimeout(go, 60);
    return () => clearTimeout(t);
  }, [hash]);
  usePageMeta({
    title: "Globrixa — India's B2B Wholesale Marketplace",
    description: 'Source handcrafted home décor, furniture and lifestyle products wholesale from verified Indian makers and suppliers. Request quotes, compare suppliers and order in bulk on Globrixa.',
    path: '/',
    jsonLd: ORGANIZATION_LD,
  });
  // Like the reference (body max-width 1700px, centred, from 1550px up), very wide screens
  // get a centred 1700px page instead of stretched sections.
  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: '#FDF9F1', minHeight: '100vh', overflowX: 'clip', maxWidth: 1700, margin: '0 auto' }}>
      <LandingNavbar />
      <HeroSection />
      <BenefitsStrip />
      <AboutBanner />
      <CollectionsSection />
      <RetailAudience />
      <ProcessSection />
      <NewThisWeek />
      <CraftBand />
      <WhyGlobrixa />
      <CustomisationSection />
      <VideoStories />
      <FaqSection />
      <TalkToTeamBanner />
      <NewsletterSection />
      <LandingFooter />
    </div>
  );
}
