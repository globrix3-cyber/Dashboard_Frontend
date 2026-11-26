import { useSelector } from 'react-redux';
import LandingNavbar from '../landing/LandingNavbar';
import LandingFooter from '../landing/LandingFooter';
import DashboardLayout from '../../layouts/DashboardLayout';

const PAGE = { fontFamily: "'DM Sans', system-ui, sans-serif", background: '#FDF9F1', overflowX: 'clip', maxWidth: 1700, margin: '0 auto' };

// Shared shell for the marketing pages (About, Contact, Blog, Policies).
// Guests get the homepage header and footer, as in the client's reference.
// Signed-in users keep the after-login header (client Canva p38); DashboardLayout
// already renders the same footer, so it isn't repeated here.
// Like the reference (and LandingPage), the page caps at 1700px and centres on very wide screens.
export default function SiteLayout({ children }) {
  const { token, userRole } = useSelector((s) => s.auth);
  if (token && userRole) {
    return (
      <DashboardLayout fullBleed>
        {/* DashboardLayout already provides the <main> landmark. */}
        <div style={PAGE}>{children}</div>
      </DashboardLayout>
    );
  }
  return (
    <div style={{ ...PAGE, minHeight: '100vh' }}>
      <LandingNavbar />
      <main>{children}</main>
      <LandingFooter />
    </div>
  );
}
