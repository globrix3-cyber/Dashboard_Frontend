import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleLogin } from '../../features/auth/authSlice';
import { useBreakpoint, rGutter } from '../../hooks/useBreakpoint';

const SERIF = "'Cormorant Garamond', Georgia, serif";

const STEPS = [
  { title: 'Find your kind of good.',  body: 'Browse collections and filter by what fits your business.' },
  { title: 'Build your shortlist.',    body: 'Save your favourites. Add quantities to your cart.' },
  { title: 'Start the conversation.',  body: 'Send your request for quote and hear back from suppliers.' },
];

export default function FreshWay() {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const bp         = useBreakpoint();
  const isLoggedIn = !!useSelector(s => s.auth.token);

  const createBrief = () => {
    if (isLoggedIn) navigate('/buyer-dashboard/rfqs/new');
    else dispatch(toggleLogin(true));
  };

  return (
    <section style={{ background: '#FDF9F1', padding: bp.isMobile ? '44px 0' : '72px 0 80px' }}>
      <div style={{ ...rGutter(bp), display: 'grid', gridTemplateColumns: bp.isDesktop ? '1fr 2fr' : '1fr', gap: 40 }}>
        <div>
          <div style={{ fontSize: 9, letterSpacing: '.2em', color: '#5B4632', marginBottom: 16 }}>LESS SEARCHING. MORE DISCOVERING.</div>
          <h2 style={{ fontFamily: SERIF, fontSize: bp.isMobile ? 32 : 42, fontWeight: 500, lineHeight: 1.15, color: '#5B4632', margin: '0 0 24px' }}>A fresh way<br />to stock your store.</h2>
          <button onClick={createBrief} style={{ padding: '0 0 3px', background: 'none', border: 'none', borderBottom: '1px solid #5B4632', color: '#5B4632', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
            Create your buyer brief ↗
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: bp.isMobile ? '1fr' : 'repeat(3,1fr)', gap: 30 }}>
          {STEPS.map((step, i) => (
            <div key={step.title} style={{ borderTop: '2px solid #5B4632', paddingTop: 18 }}>
              <span style={{ width: 38, height: 38, borderRadius: '50%', background: '#5B4632', color: '#F0DCC0', fontFamily: SERIF, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>0{i + 1}</span>
              <h3 style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 500, color: '#5B4632', margin: '26px 0 22px' }}>{step.title}</h3>
              <p style={{ margin: 0, fontSize: 12, lineHeight: 1.7, color: '#79634E' }}>{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
