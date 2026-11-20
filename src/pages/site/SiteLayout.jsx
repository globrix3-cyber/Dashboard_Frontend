import LandingNavbar from '../landing/LandingNavbar';
import LandingFooter from '../landing/LandingFooter';

// Shared shell for the marketing pages (About, Contact, Blog, Policies):
// same header and footer as the homepage, as in the client's reference.
// Like the reference (and LandingPage), the page caps at 1700px and centres on very wide screens.
export default function SiteLayout({ children }) {
  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: '#FDF9F1', minHeight: '100vh', overflowX: 'clip', maxWidth: 1700, margin: '0 auto' }}>
      <LandingNavbar />
      <main>{children}</main>
      <LandingFooter />
    </div>
  );
}
