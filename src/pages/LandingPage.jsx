import { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleLogin } from '../features/auth/authSlice';
import {
  Globe, Zap, ShieldCheck, TrendingUp,
  BadgeCheck, ArrowRight, Rocket, Store, ShoppingBag,
  Star, Menu, X, Check, MapPin, Landmark, ChevronRight
} from 'lucide-react';

/* ── Global CSS injected once ─────────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --cream:        #F4EFE4;
    --cream-mid:    #EDE5D4;
    --cream-deep:   #E4D9C4;
    --warm-white:   #FAF7F1;
    --saffron:      #D9600A;
    --saffron-lt:   #FDF1E8;
    --saffron-mid:  #F0B48A;
    --emerald:      #1A7A4A;
    --emerald-lt:   #EAF5EF;
    --navy:         #1B3175;
    --navy-lt:      #EEF2FB;
    --gold:         #B8730A;
    --gold-lt:      #FDF5E2;
    --ink:          #1C1815;
    --ink-soft:     #3D3731;
    --muted:        #7A7068;
    --border:       #D4C9B8;
    --border-soft:  #E6DED0;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .gx-page { font-family: 'DM Sans', system-ui, sans-serif; background: var(--warm-white); min-height: 100vh; overflow-x: hidden; }
  .gx-serif { font-family: 'Playfair Display', Georgia, serif; }

  @keyframes gxFadeUp   { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes gxFloat    { 0%,100%{ transform:translateY(0); } 50%{ transform:translateY(-7px); } }
  @keyframes gxPulse    { 0%{box-shadow:0 0 0 0 rgba(217,96,10,.3);} 70%{box-shadow:0 0 0 12px rgba(217,96,10,0);} 100%{box-shadow:0 0 0 0 rgba(217,96,10,0);} }
  @keyframes gxShimmer  { 0%{background-position:-200% center;} 100%{background-position:200% center;} }

  .gx-fade-up  { animation: gxFadeUp 0.65s ease both; }
  .gx-float    { animation: gxFloat 4s ease-in-out infinite; }
  .gx-pulse    { animation: gxPulse 2.5s ease infinite; }

  .gx-gradient-text {
    background: linear-gradient(120deg, var(--saffron) 0%, var(--gold) 45%, var(--emerald) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }

  .gx-card {
    background: #fff;
    border: 1.5px solid var(--border-soft);
    border-radius: 20px;
    transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
  }
  .gx-card:hover { transform: translateY(-4px); box-shadow: 0 18px 48px rgba(28,24,21,.09); }

  .gx-btn-primary {
    background: var(--saffron); color: #fff; border: none; border-radius: 100px;
    font-family: 'DM Sans', sans-serif; font-weight: 600; cursor: pointer;
    display: inline-flex; align-items: center; gap: 8px;
    transition: background .2s, transform .15s;
  }
  .gx-btn-primary:hover { background: #BF530A; transform: translateY(-1px); }

  .gx-btn-ghost {
    background: transparent; color: var(--ink); border: 1.5px solid var(--border);
    border-radius: 100px; font-family: 'DM Sans', sans-serif; font-weight: 500; cursor: pointer;
    display: inline-flex; align-items: center; gap: 8px;
    transition: background .2s, border-color .2s;
  }
  .gx-btn-ghost:hover { background: var(--cream); border-color: var(--saffron-mid); }

  .gx-divider { height: 1px; background: linear-gradient(90deg, transparent, var(--border), transparent); }

  .gx-mandala {
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='46' fill='none' stroke='%23D9600A' stroke-width='.35' stroke-dasharray='3 7'/%3E%3Ccircle cx='50' cy='50' r='32' fill='none' stroke='%231A7A4A' stroke-width='.28' stroke-dasharray='2 5'/%3E%3Ccircle cx='50' cy='50' r='18' fill='none' stroke='%231B3175' stroke-width='.25' stroke-dasharray='2 4'/%3E%3Ccircle cx='50' cy='50' r='4' fill='none' stroke='%23B8730A' stroke-width='.5'/%3E%3C/svg%3E");
    background-size: 100px 100px;
  }

  .gx-dots {
    background-image: radial-gradient(circle, var(--border) 1px, transparent 1px);
    background-size: 28px 28px;
  }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: var(--cream); }
  ::-webkit-scrollbar-thumb { background: var(--saffron-mid); border-radius: 3px; }
`;

function StyleInjector() {
  useEffect(() => {
    const id = 'gx-global-styles';
    if (!document.getElementById(id)) {
      const el = document.createElement('style');
      el.id = id; el.textContent = GLOBAL_CSS;
      document.head.appendChild(el);
    }
  }, []);
  return null;
}

/* ── Tricolor bar ─────────────────────────────────────────────────────────── */
function TriBar() {
  return (
    <div style={{ display: 'flex', height: 3 }}>
      <div style={{ flex: 1, background: 'var(--saffron)' }} />
      <div style={{ flex: 1, background: '#fff', borderTop: '0.5px solid var(--border-soft)', borderBottom: '0.5px solid var(--border-soft)' }} />
      <div style={{ flex: 1, background: 'var(--emerald)' }} />
    </div>
  );
}

/* ── Ornamental star divider ──────────────────────────────────────────────── */
function OrnaDiv({ color = 'var(--saffron)' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', margin: '0 0 18px' }}>
      <div style={{ height: 1, width: 36, background: `linear-gradient(90deg, transparent, ${color})` }} />
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 0L9.2 6.1L15.3 7.3L9.2 8.5L8 14.6L6.8 8.5L.7 7.3L6.8 6.1Z" fill={color} opacity=".65"/>
      </svg>
      <div style={{ height: 1, width: 36, background: `linear-gradient(90deg, ${color}, transparent)` }} />
    </div>
  );
}

/* ── Section label pill ───────────────────────────────────────────────────── */
function Pill({ text, color = 'var(--saffron)', bg = 'var(--saffron-lt)' }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: bg, color, fontWeight: 600,
      fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase',
      padding: '5px 14px', borderRadius: 100, marginBottom: 14,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: color }} />
      {text}
    </span>
  );
}

/* ── Animated counter ─────────────────────────────────────────────────────── */
function useCounter(target, started) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!started) return;
    let s = 0;
    const total = 85;
    const t = setInterval(() => {
      s++;
      const ease = 1 - Math.pow(1 - s / total, 3);
      setVal(Math.floor(target * Math.min(ease, 1)));
      if (s >= total) clearInterval(t);
    }, 1800 / total);
    return () => clearInterval(t);
  }, [target, started]);
  return val;
}

/* ── Stat card ────────────────────────────────────────────────────────────── */
function StatCard({ icon: Icon, label, target, color, suffix = '+' }) {
  const [started, setStarted] = useState(false);
  const ref = useRef(null);
  const val = useCounter(target, started);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: .3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className="gx-card" style={{ padding: '26px 22px', position: 'relative', overflow: 'hidden', cursor: 'default' }}>
      <div style={{ position: 'absolute', top: -18, right: -18, width: 72, height: 72, borderRadius: '50%', background: `${color}10` }} />
      <div style={{ width: 42, height: 42, borderRadius: 11, background: `${color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
        <Icon size={19} color={color} />
      </div>
      <div className="gx-serif" style={{ fontSize: 36, fontWeight: 900, color: 'var(--ink)', lineHeight: 1, marginBottom: 5 }}>
        {val.toLocaleString('en-IN')}
        <span style={{ color, fontSize: 26 }}>{suffix}</span>
      </div>
      <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 500 }}>{label}</div>
    </div>
  );
}

/* ══════════════════════════════ MAIN ══════════════════════════════════════ */
export default function LandingPage() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const features = [
    { icon: Zap,         title: 'AI-Powered Matching',   desc: 'Smart algorithms pair you with verified suppliers in seconds — tuned to your category, budget, and purchase history.',          color: 'var(--saffron)', bg: 'var(--saffron-lt)', accent: 'var(--saffron)' },
    { icon: ShieldCheck, title: 'Trade Assurance',        desc: 'Escrow-backed payments release only after you approve goods. GST invoices generated automatically for every transaction.',    color: 'var(--emerald)', bg: 'var(--emerald-lt)', accent: 'var(--emerald)' },
    { icon: TrendingUp,  title: 'Real-Time Intelligence', desc: 'Live dashboards — market rates, supplier scorecards, logistics tracking — unified into one actionable command center.',        color: 'var(--navy)',    bg: 'var(--navy-lt)',    accent: 'var(--navy)'    },
    { icon: Globe,       title: 'Make in India Network',  desc: '5,000+ GST-verified manufacturers across textiles, engineering, pharma, chemicals and agri-products, ready to export.',       color: 'var(--gold)',    bg: 'var(--gold-lt)',    accent: 'var(--gold)'    },
  ];

  const steps = [
    { n: '01', title: 'Register & Verify',         desc: 'Sign up as buyer or supplier. AI-powered GST KYC completes in under 24 hours.',             color: 'var(--saffron)' },
    { n: '02', title: 'Browse or Post RFQ',        desc: 'Explore 50,000+ Indian products or post requirements to receive instant verified quotes.',   color: 'var(--emerald)' },
    { n: '03', title: 'Trade with Confidence',     desc: 'Negotiate, sign digitally, track shipments — all under one trade-assured roof.',             color: 'var(--navy)'    },
  ];

  const testimonials = [
    { name: 'Rajesh Kumar',     company: 'TechParts Pvt Ltd',  city: 'Pune, MH',     role: 'Procurement Head',  text: 'Globrixa slashed our sourcing time by 60%. The AI matching for auto components is unlike anything else in the market.',   rating: 5 },
    { name: 'Priya Venkatesh', company: 'SilkRoute Exports',  city: 'Surat, GJ',    role: 'Export Manager',    text: 'International buyer reach tripled in three months. Best platform for Indian textile exporters, hands down.',            rating: 5 },
    { name: 'Amandeep Singh',  company: 'Punjab Agro Foods',  city: 'Ludhiana, PB', role: 'Founder & CEO',     text: 'Trade assurance gave us the confidence to go global. Payments are always on time. Bohot badhiya platform hai!',        rating: 5 },
  ];

  const cities = ['Delhi NCR', 'Mumbai', 'Surat', 'Ludhiana', 'Pune', 'Bengaluru', 'Chennai', 'Hyderabad', 'Jaipur', 'Ahmedabad', 'Kanpur', 'Coimbatore'];

  const W = { maxWidth: 1100, margin: '0 auto', padding: '0 28px' };

  return (
    <>
      <StyleInjector />
      <div className="gx-page">

        <TriBar />

        {/* ══ NAVBAR ════════════════════════════════════════════════════════ */}
        <header style={{
          position: 'fixed', top: 3, left: 0, right: 0, zIndex: 100,
          background: scrolled ? 'rgba(250,247,241,0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(18px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border-soft)' : 'none',
          transition: 'all .3s ease',
        }}>
          <div style={{ ...W, height: 66, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--saffron)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(217,96,10,.32)' }}>
                <Globe size={16} color="#fff" />
              </div>
              <span className="gx-serif" style={{ fontSize: 21, fontWeight: 900, color: 'var(--ink)', letterSpacing: -.5 }}>Globrixa</span>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 100, background: 'var(--saffron-lt)', color: 'var(--saffron)', letterSpacing: '.1em' }}>B2B</span>
            </div>

            <nav style={{ display: 'flex', gap: 2 }}>
              {['Products', 'Suppliers', 'Pricing', 'About'].map(item => (
                <a key={item} href="#" style={{ padding: '7px 15px', borderRadius: 9, fontSize: 14, fontWeight: 500, color: 'var(--ink-soft)', textDecoration: 'none', transition: 'all .15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--cream)'; e.currentTarget.style.color = 'var(--ink)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--ink-soft)'; }}>
                  {item}
                </a>
              ))}
            </nav>

            <div style={{ display: 'flex', gap: 9 }}>
              <button className="gx-btn-ghost" style={{ padding: '9px 18px', fontSize: 14 }} onClick={() => dispatch(toggleLogin(true))}>Sign In</button>
              <button className="gx-btn-primary gx-pulse" style={{ padding: '10px 20px', fontSize: 14 }} onClick={() => dispatch(toggleLogin(true))}>
                <Zap size={13} /> Join Free
              </button>
            </div>
          </div>
        </header>

        {/* ══ HERO ══════════════════════════════════════════════════════════ */}
        <section style={{ position: 'relative', paddingTop: 116, paddingBottom: 76, background: 'var(--cream)', overflow: 'hidden' }}>

          {/* Decorative mandala bg */}
          <div className="gx-mandala" style={{ position: 'absolute', inset: 0, opacity: .4, pointerEvents: 'none' }} />

          {/* Large ghost circles */}
          <div style={{ position: 'absolute', top: -130, right: -130, width: 520, height: 520, borderRadius: '50%', border: '1px solid var(--saffron-mid)', opacity: .25, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: -65, right: -65, width: 330, height: 330, borderRadius: '50%', border: '1px dashed var(--gold)', opacity: .18, pointerEvents: 'none' }} />
          <div className="gx-float" style={{ position: 'absolute', bottom: 40, left: -90, width: 290, height: 290, borderRadius: '50%', border: '1.5px dashed var(--emerald)', opacity: .12, pointerEvents: 'none' }} />

          <div style={{ ...W, position: 'relative', zIndex: 1 }}>

            {/* Hero badge */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 30 }}>
              <div className="gx-fade-up" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#fff', borderRadius: 100,
                padding: '7px 20px 7px 8px',
                border: '1.5px solid var(--border)',
                boxShadow: '0 2px 12px rgba(28,24,21,.06)',
              }}>
                <div style={{ width: 26, height: 26, borderRadius: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🇮🇳</div>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-soft)' }}>India's Premier B2B Trade Platform</span>
                <span style={{ width: 1, height: 14, background: 'var(--border)', margin: '0 2px' }} />
                <span className="gx-serif" style={{ fontSize: 13, color: 'var(--saffron)', fontStyle: 'italic' }}>भारत का व्यापार मंच</span>
              </div>
            </div>

            {/* Headline */}
            <h1 className="gx-fade-up gx-serif" style={{
              textAlign: 'center', fontWeight: 900, lineHeight: 1.02,
              fontSize: 'clamp(46px, 8.5vw, 86px)', letterSpacing: -2.5,
              color: 'var(--ink)', marginBottom: 22, animationDelay: '.06s',
            }}>
              Powering India's<br />
              <span className="gx-gradient-text">Global Commerce</span>
            </h1>

            <p className="gx-fade-up" style={{
              textAlign: 'center', maxWidth: 600, margin: '0 auto 42px',
              color: 'var(--ink-soft)', fontSize: 18, lineHeight: 1.8, fontWeight: 400,
              animationDelay: '.13s',
            }}>
              Connect with GST-verified Indian manufacturers and global buyers through
              our AI-powered platform — trusted by 50,000+ businesses nationwide.
            </p>

            {/* CTAs */}
            <div className="gx-fade-up" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 13, marginBottom: 48, animationDelay: '.2s' }}>
              <button className="gx-btn-primary" style={{ height: 56, padding: '0 42px', fontSize: 15, boxShadow: '0 8px 28px rgba(217,96,10,.36)' }} onClick={() => dispatch(toggleLogin(true))}>
                <Rocket size={16} /> Start Trading Now
              </button>
              <button className="gx-btn-ghost" style={{ height: 56, padding: '0 42px', fontSize: 15 }}>
                <Globe size={16} /> Explore Products
              </button>
            </div>

            {/* Trust signals */}
            <div className="gx-fade-up" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 22, marginBottom: 64, animationDelay: '.27s' }}>
              {[
                { icon: Landmark,    text: 'GST Verified Suppliers' },
                { icon: BadgeCheck,  text: 'MSME Registered' },
                { icon: ShieldCheck, text: 'RBI Compliant Payments' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--saffron-lt)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={13} color="var(--saffron)" />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-soft)' }}>{text}</span>
                </div>
              ))}
            </div>

            {/* Stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(195px, 1fr))', gap: 14 }}>
              {[
                { icon: Store,       label: 'Active Indian Suppliers',  target: 5000,  color: 'var(--saffron)' },
                { icon: ShoppingBag, label: 'Product Listings',         target: 50000, color: 'var(--emerald)' },
                { icon: MapPin,      label: 'Cities Covered',           target: 500,   color: 'var(--navy)'    },
                { icon: TrendingUp,  label: 'Monthly Trade (₹ Cr)',    target: 250,   color: 'var(--gold)'    },
              ].map(s => <StatCard key={s.label} {...s} />)}
            </div>
          </div>
        </section>

        <div className="gx-divider" />

        {/* ══ FEATURES ══════════════════════════════════════════════════════ */}
        <section style={{ padding: '90px 28px', background: 'var(--warm-white)', position: 'relative', overflow: 'hidden' }}>
          <div className="gx-dots" style={{ position: 'absolute', inset: 0, opacity: .55, pointerEvents: 'none' }} />
          <div style={{ ...W, position: 'relative', zIndex: 1 }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <Pill text="Platform Features" />
              <OrnaDiv />
              <h2 className="gx-serif" style={{ fontSize: 'clamp(26px, 4vw, 48px)', fontWeight: 900, color: 'var(--ink)', letterSpacing: -1.5, marginBottom: 12 }}>
                Built for Bharat,<br />Built for the World
              </h2>
              <p style={{ color: 'var(--muted)', fontSize: 16, maxWidth: 460, margin: '0 auto' }}>
                Technology that understands Indian business — GST, MSME, local logistics, global ambition
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
              {features.map(({ icon: Icon, title, desc, color, bg, accent }) => (
                <div key={title} className="gx-card" style={{ padding: '34px 26px', borderTop: `3px solid ${accent}`, cursor: 'default' }}>
                  <div style={{ width: 52, height: 52, borderRadius: 13, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                    <Icon size={24} color={color} />
                  </div>
                  <h3 className="gx-serif" style={{ fontSize: 19, fontWeight: 700, color: 'var(--ink)', marginBottom: 9 }}>{title}</h3>
                  <p style={{ color: 'var(--muted)', lineHeight: 1.75, fontSize: 14 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="gx-divider" />

        {/* ══ HOW IT WORKS ══════════════════════════════════════════════════ */}
        <section style={{ padding: '90px 28px', background: 'var(--cream)', position: 'relative', overflow: 'hidden' }}>
          <div className="gx-mandala" style={{ position: 'absolute', inset: 0, opacity: .28, pointerEvents: 'none' }} />
          <div style={{ ...W, position: 'relative', zIndex: 1 }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <Pill text="Simple Process" color="var(--emerald)" bg="var(--emerald-lt)" />
              <OrnaDiv color="var(--emerald)" />
              <h2 className="gx-serif" style={{ fontSize: 'clamp(26px, 4vw, 48px)', fontWeight: 900, color: 'var(--ink)', letterSpacing: -1.5 }}>
                Kaise Kaam Karta Hai?
              </h2>
              <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 8 }}>Three simple steps to global trade</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 0 }}>
              {steps.map(({ n, title, desc, color }, i) => (
                <div key={n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '36px 24px', position: 'relative' }}>
                  {i < steps.length - 1 && (
                    <ChevronRight size={16} color="var(--border)" style={{ position: 'absolute', right: 0, top: 58 }} />
                  )}
                  <div className="gx-float" style={{
                    width: 76, height: 76, borderRadius: '50%',
                    background: '#fff', border: `2px solid ${color}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 22, animationDelay: `${i * .45}s`,
                    boxShadow: `0 6px 24px ${color}22`,
                  }}>
                    <span className="gx-serif" style={{ fontSize: 22, fontWeight: 900, color }}>{n}</span>
                  </div>
                  <h3 className="gx-serif" style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)', marginBottom: 9 }}>{title}</h3>
                  <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.78 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="gx-divider" />

        {/* ══ CITY BAND ═════════════════════════════════════════════════════ */}
        <section style={{ padding: '60px 28px', background: 'var(--warm-white)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
            <Pill text="Pan-India Coverage" color="var(--navy)" bg="var(--navy-lt)" />
            <h3 className="gx-serif" style={{ fontSize: 24, fontWeight: 800, color: 'var(--ink)', marginBottom: 7 }}>
              Every MSME Hub. Every State.
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 26 }}>From Kashmir to Kanyakumari — India's manufacturing heartland, on one platform</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 9 }}>
              {cities.map(city => (
                <span key={city} style={{
                  background: '#fff', border: '1.5px solid var(--border-soft)',
                  color: 'var(--ink-soft)', fontSize: 13, fontWeight: 500,
                  padding: '6px 15px', borderRadius: 100,
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  boxShadow: '0 1px 4px rgba(28,24,21,.04)',
                }}>
                  <MapPin size={10} color="var(--saffron)" /> {city}
                </span>
              ))}
            </div>
          </div>
        </section>

        <div className="gx-divider" />

        {/* ══ TESTIMONIALS ══════════════════════════════════════════════════ */}
        <section style={{ padding: '90px 28px', background: 'var(--cream-mid)', position: 'relative', overflow: 'hidden' }}>
          <div className="gx-mandala" style={{ position: 'absolute', inset: 0, opacity: .22, pointerEvents: 'none' }} />
          <div style={{ ...W, position: 'relative', zIndex: 1 }}>
            <div style={{ textAlign: 'center', marginBottom: 50 }}>
              <Pill text="Customer Stories" color="var(--gold)" bg="var(--gold-lt)" />
              <OrnaDiv color="var(--gold)" />
              <h2 className="gx-serif" style={{ fontSize: 'clamp(26px, 4vw, 44px)', fontWeight: 900, color: 'var(--ink)', letterSpacing: -1.5 }}>
                Trusted by Indian Vyaparis
              </h2>
              <p style={{ color: 'var(--muted)', marginTop: 8, fontSize: 14 }}>Real businesses, real results</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: 16 }}>
              {testimonials.map(({ name, company, city, role, text, rating }) => (
                <div key={name} className="gx-card" style={{ padding: '26px 22px', cursor: 'default' }}>
                  <div style={{ display: 'flex', gap: 2, marginBottom: 14 }}>
                    {Array(rating).fill(0).map((_, i) => <Star key={i} size={12} fill="var(--gold)" color="var(--gold)" />)}
                  </div>
                  <div className="gx-serif" style={{ fontSize: 44, color: 'var(--saffron-mid)', lineHeight: .6, marginBottom: 10, fontWeight: 900 }}>"</div>
                  <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.8, marginBottom: 20 }}>{text}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 11, paddingTop: 14, borderTop: '1px solid var(--border-soft)' }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--saffron)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800, fontFamily: "'Playfair Display', serif", flexShrink: 0 }}>
                      {name[0]}
                    </div>
                    <div>
                      <div className="gx-serif" style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)' }}>{name}</div>
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>{role}, {company}</div>
                      <div style={{ fontSize: 11, color: 'var(--emerald)', fontWeight: 600, marginTop: 1, display: 'flex', alignItems: 'center', gap: 3 }}>
                        <MapPin size={9} /> {city}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="gx-divider" />

        {/* ══ PRICING ═══════════════════════════════════════════════════════ */}
        <section style={{ padding: '90px 28px', background: 'var(--warm-white)' }}>
          <div style={{ maxWidth: 780, margin: '0 auto', textAlign: 'center' }}>
            <Pill text="Pricing" color="var(--navy)" bg="var(--navy-lt)" />
            <OrnaDiv color="var(--navy)" />
            <h2 className="gx-serif" style={{ fontSize: 'clamp(26px, 4vw, 44px)', fontWeight: 900, color: 'var(--ink)', letterSpacing: -1.5, marginBottom: 8 }}>
              Shuru Karein Free Mein
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: 15, marginBottom: 44 }}>No credit card. No hidden charges. Cancel anytime.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: 18 }}>
              {[
                { plan: 'Starter', hindi: 'मुफ़्त शुरुआत', price: 'Free',    period: 'forever', popular: false, color: 'var(--ink-soft)', border: 'var(--border-soft)', bg: '#fff', perks: ['5 RFQs / month', '50 product views', 'Basic analytics', 'Email support'] },
                { plan: 'Pro',     hindi: 'व्यापार बढ़ाएं', price: '₹2,999', period: '/ month',  popular: true,  color: 'var(--saffron)', border: 'var(--saffron)',     bg: 'var(--saffron-lt)', perks: ['Unlimited RFQs', 'Full catalog access', 'AI supplier matching', 'Hindi & English support', 'Trade assurance', 'GST invoice auto-generation'] },
              ].map(({ plan, hindi, price, period, popular, color, border, bg, perks }) => (
                <div key={plan} className="gx-card" style={{ padding: '34px 26px', textAlign: 'left', position: 'relative', background: bg, borderColor: border, borderWidth: 2 }}>
                  {popular && (
                    <span style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: 'var(--saffron)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 16px', borderRadius: 100, whiteSpace: 'nowrap' }}>
                      Most Popular
                    </span>
                  )}
                  <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, marginBottom: 2, textTransform: 'uppercase', letterSpacing: '.08em' }}>{plan}</div>
                  <div className="gx-serif" style={{ fontSize: 12, color, fontStyle: 'italic', marginBottom: 12 }}>{hindi}</div>
                  <div className="gx-serif" style={{ fontSize: 38, fontWeight: 900, color, letterSpacing: -1 }}>{price}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 26 }}>{period}</div>
                  <ul style={{ padding: 0, margin: '0 0 26px', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9 }}>
                    {perks.map(p => (
                      <li key={p} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 14, color: 'var(--ink-soft)' }}>
                        <Check size={14} color="var(--emerald)" style={{ flexShrink: 0, marginTop: 2 }} /> {p}
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => dispatch(toggleLogin(true))}
                    className={popular ? 'gx-btn-primary' : 'gx-btn-ghost'}
                    style={{ width: '100%', padding: '12px 0', borderRadius: 12, fontSize: 14, justifyContent: 'center', ...(popular ? { boxShadow: '0 4px 16px rgba(217,96,10,.32)' } : {}) }}>
                    Get Started
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ CTA BANNER ════════════════════════════════════════════════════ */}
        <section style={{ padding: '90px 28px', background: 'var(--ink)', position: 'relative', overflow: 'hidden' }}>
          {/* Ghost rings */}
          <div style={{ position: 'absolute', top: -120, right: -120, width: 480, height: 480, borderRadius: '50%', border: '1px solid rgba(217,96,10,.2)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: -55, right: -55, width: 280, height: 280, borderRadius: '50%', border: '1px dashed rgba(217,96,10,.14)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -90, left: -90, width: 320, height: 320, borderRadius: '50%', border: '1px solid rgba(26,122,74,.18)', pointerEvents: 'none' }} />

          <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
            {/* Mini tricolor */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 26 }}>
              <div style={{ display: 'flex', width: 56, height: 3, borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ flex: 1, background: 'var(--saffron)' }} />
                <div style={{ flex: 1, background: '#fff' }} />
                <div style={{ flex: 1, background: 'var(--emerald)' }} />
              </div>
            </div>

            <h2 className="gx-serif" style={{ fontSize: 'clamp(30px, 5.5vw, 56px)', fontWeight: 900, color: '#fff', letterSpacing: -2, marginBottom: 14, lineHeight: 1.05 }}>
              Apna Business Badhao
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,.62)', lineHeight: 1.8, marginBottom: 42 }}>
              Join thousands of Indian traders on the future of global commerce.<br />
              <span className="gx-serif" style={{ color: 'rgba(255,255,255,.38)', fontSize: 14, fontStyle: 'italic' }}>Vyapar ka naya zariya.</span>
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 13 }}>
              <button onClick={() => dispatch(toggleLogin(true))} style={{
                height: 56, padding: '0 44px', fontSize: 15, fontWeight: 600,
                background: 'var(--saffron)', color: '#fff', border: 'none', borderRadius: 100, cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 9,
                boxShadow: '0 8px 28px rgba(217,96,10,.42)',
                fontFamily: "'DM Sans', sans-serif", transition: 'background .2s, transform .15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#BF530A'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--saffron)'; e.currentTarget.style.transform = 'none'; }}>
                <Rocket size={16} /> Free Mein Shuru Karein
              </button>
              <button style={{
                height: 56, padding: '0 40px', fontSize: 15, fontWeight: 500,
                background: 'transparent', color: 'rgba(255,255,255,.78)', border: '1.5px solid rgba(255,255,255,.2)',
                borderRadius: 100, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 9,
                fontFamily: "'DM Sans', sans-serif", transition: 'background .15s, border-color .15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.38)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.2)'; }}>
                Explore Platform <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </section>

        {/* ══ FOOTER ════════════════════════════════════════════════════════ */}
        <footer style={{ background: '#131110', color: '#A09890' }}>
          <TriBar />
          <div style={{ ...W, padding: '50px 28px 28px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))', gap: 32, marginBottom: 40 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--saffron)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Globe size={14} color="#fff" />
                  </div>
                  <span className="gx-serif" style={{ color: 'var(--cream)', fontWeight: 900, fontSize: 18, letterSpacing: -.5 }}>Globrixa</span>
                </div>
                <p style={{ fontSize: 12, lineHeight: 1.75, marginBottom: 12, maxWidth: 190 }}>
                  India's premier B2B trade platform — connecting MSMEs with buyers across 120+ countries.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ fontSize: 14 }}>🇮🇳</span>
                  <span style={{ fontSize: 11, color: '#52484A' }}>Proudly Made in India</span>
                </div>
              </div>

              {[
                { heading: 'Platform', links: [
                    { label: 'Products',   path: null, action: () => dispatch(toggleLogin(true)) },
                    { label: 'Suppliers',  path: null, action: () => dispatch(toggleLogin(true)) },
                    { label: 'RFQs',       path: null, action: () => dispatch(toggleLogin(true)) },
                    { label: 'Analytics',  path: null, action: () => dispatch(toggleLogin(true)) },
                  ]},
                { heading: 'Company',  links: [
                    { label: 'About',    path: '/about'   },
                    { label: 'Blog',     path: '/blog'    },
                    { label: 'Careers',  path: '/careers' },
                    { label: 'Press',    path: '/about'   },
                  ]},
                { heading: 'Support',  links: [
                    { label: 'Help Center', path: '/help'    },
                    { label: 'Contact',     path: '/contact' },
                    { label: 'Privacy',     path: '/privacy' },
                    { label: 'Terms',       path: '/terms'   },
                  ]},
              ].map(({ heading, links }) => (
                <div key={heading}>
                  <div style={{ color: 'var(--cream)', fontWeight: 600, fontSize: 12, marginBottom: 14, letterSpacing: '.06em', textTransform: 'uppercase' }}>{heading}</div>
                  <ul style={{ padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9 }}>
                    {links.map(l => (
                      <li key={l.label}>
                        <button onClick={l.action || (() => navigate(l.path))}
                          style={{ fontSize: 13, color: '#A09890', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 0, transition: 'color .15s', fontFamily: 'inherit' }}
                          onMouseEnter={e => { e.currentTarget.style.color = 'var(--saffron)'; }}
                          onMouseLeave={e => { e.currentTarget.style.color = '#A09890'; }}>
                          {l.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid #1E1A18', paddingTop: 22, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
              <p style={{ fontSize: 11, color: '#4A4240' }}>© 2025 Globrixa Technologies Pvt. Ltd. · CIN: U74999MH2024PTC001234 · GST: 27AABCG1234F1Z5</p>
              <div style={{ display: 'flex', gap: 18 }}>
                {['Privacy', 'Terms', 'Refund Policy'].map(t => (
                  <a key={t} href="#" style={{ fontSize: 11, color: '#4A4240', textDecoration: 'none', transition: 'color .15s' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#A09890'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#4A4240'; }}>
                    {t}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}