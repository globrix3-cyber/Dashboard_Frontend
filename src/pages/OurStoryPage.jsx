import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleLogin } from '../features/auth/authSlice';

const T = {
  t: '#C4773A', td: '#A8622E', tl: '#FDF3EB',
  ink: '#1C1815', is: '#3D3830', mu: '#7A7068',
  b: '#DEDAD0', bs: '#EDE8DF', c: '#F7F1E8',
  g: '#3D7A52', gl: '#EBF4EE',
};

const VALUES = [
  { icon: '🤝', title: 'Trust first',         desc: 'Every supplier is KYC-verified before listing. We believe trust is the foundation of every trade relationship.' },
  { icon: '🌱', title: 'Built for growth',    desc: 'We designed Globrixa for businesses at every stage — from first-time importers to established global buyers.' },
  { icon: '🌍', title: 'India to the world',  desc: 'India has 63 million MSMEs. We exist to give them a global stage and give the world access to authentic Indian craft.' },
  { icon: '⚡', title: 'Simple by design',    desc: 'B2B trade shouldn\'t be complicated. We strip away friction — from discovery through payment to delivery.' },
];

const TEAM = [
  { name: 'Nishant Gaur',     role: 'Founder & CEO' },
  { name: 'Rahul Srivastava', role: 'CTO'           },
];

export default function OurStoryPage() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: T.c, minHeight: '100vh', color: T.ink }}>

      {/* Minimal nav */}
      <nav style={{ background: T.c, borderBottom: `1px solid ${T.bs}`, padding: '0 40px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 800, color: T.ink, letterSpacing: '0.18em', textTransform: 'uppercase' }}>GLOBRIXA</button>
        <button onClick={() => dispatch(toggleLogin(true))} style={{ padding: '9px 22px', borderRadius: 100, border: 'none', background: T.t, color: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 700 }}>Start sourcing</button>
      </nav>

      {/* Hero */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '80px 28px 60px', textAlign: 'center' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: T.t, marginBottom: 18 }}>Our Story</div>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(38px,6vw,70px)', fontWeight: 900, lineHeight: 1.04, letterSpacing: -2.5, color: T.ink, marginBottom: 24 }}>
          Born in India,<br/>
          <em style={{ fontStyle: 'italic', background: `linear-gradient(135deg,${T.t},#E8A060)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>built for the world</em>
        </h1>
        <p style={{ fontSize: 18, color: T.is, lineHeight: 1.85, maxWidth: 580, margin: '0 auto' }}>
          India is home to 63 million small businesses — the world's most skilled artisans, manufacturers, and food producers. For decades, global buyers had no reliable way to reach them. We built Globrixa to change that.
        </p>
      </div>

      {/* Full-width image */}
      <div style={{ width: '100%', maxWidth: 1100, margin: '0 auto 80px', padding: '0 28px' }}>
        <div style={{ borderRadius: 24, overflow: 'hidden', height: 440, position: 'relative' }}>
          <img src="/images/hero/artisan-weaving.jpg" alt="Indian artisan at work" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(28,25,21,.6) 0%, transparent 60%)' }} />
          <div style={{ position: 'absolute', bottom: 28, left: 36, color: '#fff' }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700 }}>Artisan weaver, Jaipur</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,.65)', marginTop: 4 }}>One of 5,000+ verified suppliers on Globrixa</div>
          </div>
        </div>
      </div>

      {/* The story */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 28px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 32 }}>
          {[
            { head: 'The problem we saw', body: 'When our founders were trying to source handcrafted home décor from Jaipur and Moradabad, they found the process painfully fragmented. Emails went unanswered. WhatsApp chains got lost. Quality was inconsistent. The platform for this simply didn\'t exist.' },
            { head: 'Why we built Globrixa', body: 'We started Globrixa with a simple belief: if you can order software from the cloud in seconds, you should be able to source authentic Indian handicrafts just as easily. We built the infrastructure for trust — verified suppliers, secure payments, digital contracts, and real logistics tracking.' },
            { head: 'Where we are today', body: 'Today, Globrixa connects 5,000+ GST-verified Indian manufacturers with buyers in 120+ countries. From blue pottery in Jaipur to brassware in Moradabad, from handwoven textiles in Delhi to teak furniture in Jodhpur — we bring the best of India to the world.' },
          ].map(({ head, body }) => (
            <div key={head}>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 700, color: T.ink, marginBottom: 14 }}>{head}</h3>
              <p style={{ fontSize: 16, color: T.is, lineHeight: 1.9 }}>{body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Values */}
      <div style={{ background: '#fff', borderTop: `1px solid ${T.bs}`, borderBottom: `1px solid ${T.bs}`, padding: '72px 28px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: T.t, marginBottom: 12 }}>What we stand for</div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 36, fontWeight: 800, color: T.ink, letterSpacing: -1 }}>Our values</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {VALUES.map(v => (
              <div key={v.title} style={{ background: T.c, borderRadius: 18, padding: '28px 24px', border: `1.5px solid ${T.bs}` }}>
                <div style={{ fontSize: 32, marginBottom: 14 }}>{v.icon}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: T.ink, marginBottom: 10 }}>{v.title}</div>
                <p style={{ fontSize: 14, color: T.mu, lineHeight: 1.75 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '72px 28px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: T.t, marginBottom: 12 }}>The people</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 36, fontWeight: 800, color: T.ink, letterSpacing: -1 }}>The founding team</h2>
        </div>
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
          {TEAM.map(m => (
            <div key={m.name} style={{ background: '#fff', borderRadius: 18, padding: '32px 40px', border: `1.5px solid ${T.bs}`, textAlign: 'center', minWidth: 220 }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: `linear-gradient(135deg,${T.t},${T.td})`, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 900, color: '#fff' }}>{m.name[0]}</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: T.ink, marginBottom: 6 }}>{m.name}</div>
              <div style={{ fontSize: 13, color: T.mu }}>{m.role}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: T.ink, padding: '72px 28px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(28px,4vw,48px)', fontWeight: 900, color: '#fff', letterSpacing: -1.5, marginBottom: 16 }}>Ready to start sourcing?</h2>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,.6)', marginBottom: 36, maxWidth: 420, margin: '0 auto 36px' }}>Join thousands of global buyers already sourcing from India's best manufacturers.</p>
        <button onClick={() => dispatch(toggleLogin(true))} style={{ padding: '15px 40px', borderRadius: 100, border: 'none', background: T.t, color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 8px 28px rgba(196,119,58,.4)' }}>
          Explore products →
        </button>
      </div>

      {/* Simple footer */}
      <div style={{ background: '#000', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,.25)' }}>© 2026 Globrixa Technologies Pvt. Ltd.</span>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'rgba(255,255,255,.35)' }}>← Back to home</button>
      </div>
    </div>
  );
}
