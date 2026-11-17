import { useNavigate } from 'react-router-dom';
import { useBreakpoint } from '../../hooks/useBreakpoint';

// Reference layout: 1440px → 350px tall (76/74px padding, 850px-wide centred heading, 30px gap);
// 390px → 245px tall (50px padding, 27.3px sides, 25px gap).
export default function TalkToTeamBanner() {
  const navigate = useNavigate();
  const bp = useBreakpoint();
  const m  = bp.isMobile;
  return (
    <section style={{ background: '#5B4632', padding: m ? '50px 27.3px' : bp.isTablet ? '64px 32px' : '76px 86.4px 74px', textAlign: 'center' }}>
      <h2 style={{ fontFamily: "'Canela', 'Cormorant Garamond', Georgia, serif", fontSize: m ? 32 : bp.isTablet ? 44 : 53.28, fontWeight: 300, lineHeight: 1.18, letterSpacing: '-0.5px', color: '#FDF9F1', margin: '0 auto', maxWidth: 850 }}>
        Want to see how this works for{bp.isDesktop ? <br /> : ' '}your business?
      </h2>
      <button type="button" onClick={() => navigate('/contact')}
        style={{ marginTop: m ? 25 : 30, minWidth: 176, height: 44, padding: '0 16px', background: '#FDF9F1', color: '#5B4632', border: 'none', borderRadius: 3, fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 13, lineHeight: '18.2px', fontWeight: 600, letterSpacing: '0.1px', cursor: 'pointer', transition: 'background .15s' }}
        onMouseEnter={e => { e.currentTarget.style.background = '#F0DCC0'; }}
        onMouseLeave={e => { e.currentTarget.style.background = '#FDF9F1'; }}>
        Talk to our team
      </button>
    </section>
  );
}
