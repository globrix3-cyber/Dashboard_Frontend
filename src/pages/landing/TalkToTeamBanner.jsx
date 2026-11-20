import { Link } from 'react-router-dom';
import { useLandingBreakpoint } from '../../hooks/useBreakpoint';

// Mirrors the reference .team-invitation rules: 76px 6% 74px padding (50px 7% on
// phones), heading clamp(36px, 3.7vw, 58px) in an 850px measure with a line break
// after "for" that phones drop.
export default function TalkToTeamBanner() {
  const bp = useLandingBreakpoint();
  const m  = bp.isMobile;
  return (
    <section id="talk-to-our-team" style={{ background: '#5B4632', color: '#FDF9F1', padding: m ? '50px 7%' : '76px 6% 74px', textAlign: 'center', boxSizing: 'border-box' }}>
      <h2 style={{ fontFamily: "'Canela', 'Cormorant Garamond', Georgia, serif", fontSize: m ? 'clamp(32px, 7.4vw, 44px)' : 'clamp(36px, 3.7vw, 58px)', fontWeight: 300, lineHeight: 1.18, letterSpacing: '-.5px', color: '#FDF9F1', margin: `0 auto ${m ? 25 : 30}px`, maxWidth: 850 }}>
        Want to see how this works for{m ? ' ' : <br />}your business?
      </h2>
      <Link to="/contact"
        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', width: 176, maxWidth: '100%', height: 44, padding: '0 16px', background: '#FDF9F1', color: '#5B4632', borderRadius: 3, fontSize: 13, lineHeight: 1.4, fontWeight: 600, letterSpacing: '.1px', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'background .2s' }}
        onMouseEnter={e => { e.currentTarget.style.background = '#F0DCC0'; }}
        onMouseLeave={e => { e.currentTarget.style.background = '#FDF9F1'; }}>
        Talk to our team
      </Link>
    </section>
  );
}
