import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleLogin } from '../features/auth/authSlice';
import {
  Globe, ArrowRight, Mail, Phone, MapPin,
  Shield, FileText, HelpCircle, Users, Rocket,
  Star, Package, TrendingUp, Zap, CheckCircle2,
  ChevronRight,
} from 'lucide-react';

/* ── Shared design tokens ────────────────────────────────────────────────── */
const C = {
  saffron: '#D9600A', saffronLt: '#FDF1E8', saffronMid: '#F0B48A',
  emerald: '#1A7A4A', emeraldLt: '#EAF5EF',
  navy:    '#1B3175', navyLt:    '#EEF2FB',
  gold:    '#B8730A', goldLt:    '#FDF5E2',
  ink:     '#1C1815', inkSoft:   '#3D3731',
  muted:   '#7A7068', borderSoft:'#E6DED0',
  cream:   '#F4EFE4', warmWhite: '#FAF7F1',
};

/* ── Shared layout wrapper ───────────────────────────────────────────────── */
function PublicLayout({ children }) {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: C.warmWhite, minHeight: '100vh' }}>
      {/* Mini nav */}
      <div style={{ height: 3, display: 'flex' }}>
        <div style={{ flex: 1, background: C.saffron }} />
        <div style={{ flex: 1, background: '#fff', borderBottom: `0.5px solid ${C.borderSoft}` }} />
        <div style={{ flex: 1, background: C.emerald }} />
      </div>
      <header style={{ background: '#fff', borderBottom: `1px solid ${C.borderSoft}`, padding: '0 48px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer' }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: C.saffron, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Globe size={14} color="#fff" />
          </div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 19, fontWeight: 900, color: C.ink, letterSpacing: -0.5 }}>Globrixa</span>
          <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 100, background: C.saffronLt, color: C.saffron }}>B2B</span>
        </button>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => dispatch(toggleLogin(true))} style={{ padding: '8px 18px', borderRadius: 100, border: `1.5px solid ${C.borderSoft}`, background: '#fff', color: C.inkSoft, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13 }}>
            Sign In
          </button>
          <button onClick={() => dispatch(toggleLogin(true))} style={{ padding: '8px 18px', borderRadius: 100, border: 'none', background: C.saffron, color: '#fff', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13 }}>
            Join Free
          </button>
        </div>
      </header>
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '56px 28px' }}>
        {children}
      </main>
      <footer style={{ textAlign: 'center', padding: '28px', borderTop: `1px solid ${C.borderSoft}`, color: C.muted, fontSize: 12 }}>
        © 2025 Globrixa Technologies Pvt. Ltd. · <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: C.saffron, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Back to Home</button>
      </footer>
    </div>
  );
}

function SectionTag({ text, color = C.saffron, bg = C.saffronLt }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', padding: '4px 13px', borderRadius: 100, background: bg, color, marginBottom: 14 }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: color }} /> {text}
    </span>
  );
}

/* ════════════════════════ ABOUT PAGE ══════════════════════════════════════ */
export function AboutPage() {
  const dispatch = useDispatch();
  return (
    <PublicLayout>
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <SectionTag text="Our Story" />
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 44, fontWeight: 900, color: C.ink, letterSpacing: -1.5, margin: '0 0 16px' }}>
          Built for Bharat's<br />
          <span style={{ background: `linear-gradient(120deg, ${C.saffron}, ${C.gold}, ${C.emerald})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Global Ambition</span>
        </h1>
        <p style={{ fontSize: 16, color: C.muted, maxWidth: 560, margin: '0 auto', lineHeight: 1.75 }}>
          Globrixa was founded to bridge the gap between India's 6.3 crore MSMEs and the $1.8 trillion global trade market. We believe every Indian manufacturer deserves world-class trade tools.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 48 }}>
        {[
          { icon: Rocket,     color: C.saffron, title: 'Our Mission',  text: 'Make Indian B2B trade as easy as buying from Amazon — fast, verified, and trust-backed.' },
          { icon: Globe,      color: C.emerald, title: 'Our Vision',   text: 'To be the platform where every Indian MSME finds their first international buyer.' },
          { icon: Shield,     color: C.navy,    title: 'Our Values',   text: 'Transparency, GST-compliance, fair trade, and technology that speaks Hindi and English.' },
          { icon: TrendingUp, color: C.gold,    title: 'Our Traction', text: '5,000+ suppliers · 50,000+ products · ₹250 Cr+ in monthly trade facilitated.' },
        ].map(({ icon: Icon, color, title, text }) => (
          <div key={title} style={{ background: '#fff', borderRadius: 18, padding: '28px 26px', border: `1.5px solid ${C.borderSoft}`, borderTop: `3px solid ${color}` }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Icon size={20} color={color} />
            </div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 800, color: C.ink, marginBottom: 8 }}>{title}</h3>
            <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>{text}</p>
          </div>
        ))}
      </div>

      <div style={{ background: C.navy, borderRadius: 20, padding: '40px 36px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='46' fill='none' stroke='%23fff' stroke-width='.5' stroke-dasharray='3 7'/%3E%3C/svg%3E")`, backgroundSize: '100px 100px', pointerEvents: 'none' }} />
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 900, color: '#fff', margin: '0 0 12px' }}>Join the Globrixa Movement</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 28, fontSize: 14 }}>Be part of India's most trusted B2B trade platform.</p>
        <button onClick={() => dispatch(toggleLogin(true))} style={{ padding: '12px 32px', borderRadius: 100, border: 'none', background: C.saffron, color: '#fff', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, boxShadow: '0 4px 16px rgba(217,96,10,0.4)' }}>
          Get Started Free
        </button>
      </div>
    </PublicLayout>
  );
}

/* ════════════════════════ BLOG PAGE ═══════════════════════════════════════ */
const BLOG_POSTS = [
  { id: 1, tag: 'Trade Tips',     tagColor: C.saffron, tagBg: C.saffronLt, date: '22 Apr 2026', title: 'How Indian Textile Exporters Are Winning Global Markets in 2026',        excerpt: 'GST-verified suppliers from Surat, Tirupur and Ludhiana are using Globrixa to triple their international inquiries. Here\'s how.',        readTime: '5 min' },
  { id: 2, tag: 'Platform News',  tagColor: C.emerald, tagBg: C.emeraldLt, date: '18 Apr 2026', title: 'Globrixa Crosses ₹250 Crore Monthly Trade Volume Milestone',           excerpt: 'In just 18 months, over 5,000 MSME suppliers have facilitated ₹250Cr+ in monthly trade through our platform. A milestone for Made in India.', readTime: '3 min' },
  { id: 3, tag: 'Guides',         tagColor: C.navy,    tagBg: C.navyLt,    date: '14 Apr 2026', title: 'Complete Guide: Posting Your First RFQ on Globrixa',                    excerpt: 'Step-by-step: how buyers can post a Request for Quotation and receive verified supplier bids within 24 hours.',                             readTime: '7 min' },
  { id: 4, tag: 'Success Stories', tagColor: C.gold,   tagBg: C.goldLt,    date: '10 Apr 2026', title: 'From Ludhiana to Lagos: How Punjab Agro Foods Found 14 New Buyers',     excerpt: 'Amandeep Singh\'s story of going from local agricultural trader to exporting to 6 African countries through Globrixa.',                     readTime: '6 min' },
  { id: 5, tag: 'Trade Tips',     tagColor: C.saffron, tagBg: C.saffronLt, date: '05 Apr 2026', title: 'GST Compliance for Indian Exporters: What You Need to Know in 2026',   excerpt: 'A practical overview of IGST, LUT bonds, and e-way bills — everything an Indian supplier needs to trade internationally without penalties.', readTime: '8 min' },
  { id: 6, tag: 'Platform News',  tagColor: C.emerald, tagBg: C.emeraldLt, date: '01 Apr 2026', title: 'Introducing AI-Powered Supplier Matching on Globrixa',                  excerpt: 'Our new matching engine uses category, budget, and purchase history to surface the most relevant Indian suppliers for every RFQ in seconds.',  readTime: '4 min' },
];

export function BlogPage() {
  return (
    <PublicLayout>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <SectionTag text="Globrixa Blog" color={C.navy} bg={C.navyLt} />
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 40, fontWeight: 900, color: C.ink, letterSpacing: -1.2, margin: '0 0 14px' }}>Insights for Indian Traders</h1>
        <p style={{ fontSize: 15, color: C.muted, maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>Trade tips, platform news, success stories and guides for India's growing global commerce community.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {BLOG_POSTS.map(p => (
          <div key={p.id} style={{ background: '#fff', borderRadius: 18, border: `1.5px solid ${C.borderSoft}`, overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(28,24,21,0.10)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
            <div style={{ height: 4, background: p.tagColor }} />
            <div style={{ padding: '22px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 100, background: p.tagBg, color: p.tagColor, letterSpacing: '0.06em' }}>{p.tag}</span>
                <span style={{ fontSize: 11, color: C.muted }}>{p.date} · {p.readTime} read</span>
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 800, color: C.ink, marginBottom: 10, lineHeight: 1.3 }}>{p.title}</h3>
              <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.excerpt}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color: p.tagColor }}>
                Read more <ChevronRight size={13} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </PublicLayout>
  );
}

/* ════════════════════════ CAREERS PAGE ════════════════════════════════════ */
const JOBS = [
  { title: 'Senior Backend Engineer',      dept: 'Engineering',  location: 'Bengaluru / Remote', type: 'Full-time' },
  { title: 'Product Manager — Trade',      dept: 'Product',      location: 'Mumbai',             type: 'Full-time' },
  { title: 'Business Development Manager', dept: 'Sales',        location: 'Delhi NCR',          type: 'Full-time' },
  { title: 'UI/UX Designer',               dept: 'Design',       location: 'Remote',             type: 'Full-time' },
  { title: 'GST & Compliance Specialist',  dept: 'Legal',        location: 'Mumbai',             type: 'Full-time' },
  { title: 'Data Analyst',                 dept: 'Analytics',    location: 'Bengaluru',          type: 'Full-time' },
];

export function CareersPage() {
  return (
    <PublicLayout>
      <div style={{ textAlign: 'center', marginBottom: 52 }}>
        <SectionTag text="We're Hiring" color={C.emerald} bg={C.emeraldLt} />
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 40, fontWeight: 900, color: C.ink, letterSpacing: -1.2, margin: '0 0 14px' }}>Build India's Trade Future</h1>
        <p style={{ fontSize: 15, color: C.muted, maxWidth: 500, margin: '0 auto', lineHeight: 1.75 }}>
          Join a team of builders, traders and technologists who are rewiring how India does global commerce. Remote-friendly · ESOP · Meaningful work.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
        {JOBS.map(j => (
          <div key={j.title} style={{ background: '#fff', borderRadius: 14, border: `1.5px solid ${C.borderSoft}`, padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, cursor: 'pointer', transition: 'border-color 0.15s, box-shadow 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.emerald; e.currentTarget.style.boxShadow = `0 4px 16px ${C.emerald}18`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.borderSoft; e.currentTarget.style.boxShadow = 'none'; }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: C.ink }}>{j.title}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 4, display: 'flex', gap: 14 }}>
                <span>{j.dept}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><MapPin size={10} />{j.location}</span>
                <span>{j.type}</span>
              </div>
            </div>
            <button onClick={() => window.open('mailto:careers@globrixa.com', '_blank')} style={{ padding: '8px 18px', borderRadius: 100, border: 'none', background: C.emeraldLt, color: C.emerald, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 12 }}>
              Apply
            </button>
          </div>
        ))}
      </div>

      <div style={{ background: C.cream, borderRadius: 18, padding: '32px', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: C.ink, marginBottom: 8 }}>Don't see your role?</p>
        <p style={{ fontSize: 14, color: C.muted, marginBottom: 18 }}>We're always looking for talented people. Send us your CV.</p>
        <a href="mailto:careers@globrixa.com" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 24px', borderRadius: 100, background: C.saffron, color: '#fff', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
          <Mail size={14} /> careers@globrixa.com
        </a>
      </div>
    </PublicLayout>
  );
}

/* ════════════════════════ CONTACT PAGE ════════════════════════════════════ */
export function ContactPage() {
  return (
    <PublicLayout>
      <div style={{ textAlign: 'center', marginBottom: 52 }}>
        <SectionTag text="Contact Us" />
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 40, fontWeight: 900, color: C.ink, letterSpacing: -1.2, margin: '0 0 14px' }}>We're Here to Help</h1>
        <p style={{ fontSize: 15, color: C.muted, maxWidth: 460, margin: '0 auto', lineHeight: 1.75 }}>
          Got a question about trading on Globrixa, a GST query, or a partnership proposal? Reach out — we respond within 24 hours.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 40 }}>
        {[
          { icon: Mail,     color: C.saffron, bg: C.saffronLt, label: 'Email',        value: 'support@globrixa.com',  link: 'mailto:support@globrixa.com' },
          { icon: Phone,    color: C.emerald, bg: C.emeraldLt, label: 'Phone',        value: '+91 98765 00000',        link: 'tel:+919876500000'          },
          { icon: MapPin,   color: C.navy,    bg: C.navyLt,    label: 'Office',       value: 'Bandra Kurla Complex, Mumbai 400051', link: null            },
          { icon: HelpCircle,color:C.gold,    bg: C.goldLt,    label: 'Help Center',  value: 'docs.globrixa.com',      link: '#'                          },
        ].map(({ icon: Icon, color, bg, label, value, link }) => (
          <div key={label} style={{ background: '#fff', borderRadius: 16, padding: '24px', border: `1.5px solid ${C.borderSoft}` }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <Icon size={19} color={color} />
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>{label}</div>
            {link ? (
              <a href={link} style={{ fontSize: 14, fontWeight: 600, color: color, textDecoration: 'none' }}>{value}</a>
            ) : (
              <div style={{ fontSize: 14, fontWeight: 600, color: C.inkSoft }}>{value}</div>
            )}
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: 20, border: `1.5px solid ${C.borderSoft}`, padding: '32px 36px' }}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 800, color: C.ink, marginBottom: 24 }}>Send a Message</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {[{ label: 'Your Name', ph: 'Rajesh Kumar' }, { label: 'Email', ph: 'you@company.com' }, { label: 'Subject', ph: 'GST verification query' }].map(f => (
            <div key={f.label}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: C.inkSoft, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 7 }}>{f.label}</label>
              <input placeholder={f.ph} style={{ width: '100%', padding: '11px 14px', borderRadius: 12, border: `1.5px solid ${C.borderSoft}`, background: C.cream, fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: C.ink, outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => { e.currentTarget.style.borderColor = C.saffron; e.currentTarget.style.background = '#fff'; }}
                onBlur={e => { e.currentTarget.style.borderColor = C.borderSoft; e.currentTarget.style.background = C.cream; }} />
            </div>
          ))}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: C.inkSoft, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 7 }}>Message</label>
            <textarea rows={4} placeholder="How can we help you?" style={{ width: '100%', padding: '11px 14px', borderRadius: 12, border: `1.5px solid ${C.borderSoft}`, background: C.cream, fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: C.ink, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
              onFocus={e => { e.currentTarget.style.borderColor = C.saffron; e.currentTarget.style.background = '#fff'; }}
              onBlur={e => { e.currentTarget.style.borderColor = C.borderSoft; e.currentTarget.style.background = C.cream; }} />
          </div>
          <button onClick={() => alert('Message sent! We\'ll get back to you within 24 hours.')} style={{ padding: '12px 0', borderRadius: 100, border: 'none', background: C.saffron, color: '#fff', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, boxShadow: '0 4px 16px rgba(217,96,10,0.28)' }}>
            Send Message
          </button>
        </div>
      </div>
    </PublicLayout>
  );
}

/* ════════════════════════ PRIVACY PAGE ════════════════════════════════════ */
export function PrivacyPage() {
  const sections = [
    { title: 'Data We Collect', body: 'We collect information you provide during registration (name, email, company details, GST number) and usage data (pages visited, RFQs posted, products viewed). We never sell your data to third parties.' },
    { title: 'How We Use Data', body: 'Your data is used to operate and improve the Globrixa platform — matching buyers with suppliers, processing payments, sending transactional emails, and complying with Indian tax regulations (GST Act 2017).' },
    { title: 'Data Storage', body: 'All data is stored on encrypted servers hosted in India (compliant with IT Act 2000) and the European Union. We use AES-256 encryption for sensitive fields and TLS 1.3 for all data in transit.' },
    { title: 'Your Rights', body: 'Under PDPB 2023, you have the right to access, correct, and delete your personal data. Contact privacy@globrixa.com to exercise these rights. We respond within 30 days.' },
    { title: 'Cookies', body: 'We use essential cookies for authentication and performance cookies (Google Analytics) to improve the platform. You can disable non-essential cookies in your browser settings.' },
    { title: 'Contact', body: 'For privacy questions, email: privacy@globrixa.com · Grievance Officer: Globrixa Technologies Pvt. Ltd., BKC, Mumbai 400051 · +91 98765 00000' },
  ];
  return (
    <PublicLayout>
      <div style={{ marginBottom: 48 }}>
        <SectionTag text="Privacy Policy" color={C.navy} bg={C.navyLt} />
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 900, color: C.ink, letterSpacing: -1, margin: '0 0 10px' }}>Privacy Policy</h1>
        <p style={{ fontSize: 13, color: C.muted }}>Last updated: 1 April 2026 · Effective for all Globrixa users</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {sections.map(s => (
          <div key={s.title} style={{ background: '#fff', borderRadius: 16, padding: '24px 28px', border: `1.5px solid ${C.borderSoft}`, borderLeft: `4px solid ${C.navy}` }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 800, color: C.ink, marginBottom: 10 }}>{s.title}</h3>
            <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.75 }}>{s.body}</p>
          </div>
        ))}
      </div>
    </PublicLayout>
  );
}

/* ════════════════════════ TERMS PAGE ══════════════════════════════════════ */
export function TermsPage() {
  const sections = [
    { title: '1. Acceptance',         body: 'By using Globrixa, you agree to these Terms of Service. If you do not agree, please do not use the platform. These terms are governed by Indian law and the jurisdiction of Mumbai courts.' },
    { title: '2. User Accounts',      body: 'You must be 18+ and provide accurate GST/PAN information. You are responsible for all activity under your account. Globrixa may suspend accounts found to be fraudulent or in violation of these terms.' },
    { title: '3. Platform Role',      body: 'Globrixa is a marketplace facilitator — we connect buyers and suppliers but are not a party to any trade contract. All disputes between buyers and suppliers must be resolved directly, except where Trade Assurance applies.' },
    { title: '4. Prohibited Uses',    body: 'You may not use Globrixa to list counterfeit goods, violate export control laws, spam other users, or engage in fraudulent transactions. Violations result in immediate account termination.' },
    { title: '5. Fees & Payments',    body: 'The Starter plan is free. The Pro plan is ₹2,999/month (billed annually). All fees are exclusive of GST. Globrixa charges a platform fee of 2% on transactions facilitated through Trade Assurance.' },
    { title: '6. Intellectual Property', body: 'All Globrixa branding, technology, and content is owned by Globrixa Technologies Pvt. Ltd. Users retain ownership of their own product listings and company data.' },
    { title: '7. Limitation of Liability', body: 'Globrixa is not liable for indirect or consequential damages. Our maximum liability for any claim is limited to fees paid by you to Globrixa in the 12 months prior to the claim.' },
  ];
  return (
    <PublicLayout>
      <div style={{ marginBottom: 48 }}>
        <SectionTag text="Legal" color={C.navy} bg={C.navyLt} />
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 900, color: C.ink, letterSpacing: -1, margin: '0 0 10px' }}>Terms of Service</h1>
        <p style={{ fontSize: 13, color: C.muted }}>Last updated: 1 April 2026 · Applicable to all Globrixa users</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {sections.map(s => (
          <div key={s.title} style={{ background: '#fff', borderRadius: 16, padding: '22px 28px', border: `1.5px solid ${C.borderSoft}` }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 800, color: C.ink, marginBottom: 8 }}>{s.title}</h3>
            <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.75 }}>{s.body}</p>
          </div>
        ))}
      </div>
    </PublicLayout>
  );
}

/* ════════════════════════ HELP CENTER PAGE ════════════════════════════════ */
const HELP = [
  { q: 'How do I register as a supplier?',         a: 'Click "Join Free" on the homepage, select Supplier, enter your company details and GST number. Our team verifies your KYC within 24 hours.' },
  { q: 'How does Trade Assurance work?',            a: 'Payments go into escrow when an order is placed. Funds are released to the supplier only after the buyer confirms receipt and quality. Globrixa mediates any disputes.' },
  { q: 'What documents do I need for KYC?',        a: 'GST Certificate, PAN Card, and one address proof (MSME certificate or Shop Act license). Upload these during company setup.' },
  { q: 'How do I post an RFQ?',                    a: 'From your Buyer Dashboard, click "New RFQ", fill in product details, quantity, budget and deadline. Suppliers will submit quotes within hours.' },
  { q: 'Can I export without an IEC code?',        a: 'Yes, for small-value exports under ₹5 lakh per year. Above this, an Import Export Code from DGFT is mandatory. We guide you through the process.' },
  { q: 'What currencies are supported?',           a: 'Invoices are in INR by default. International buyers can pay in USD, EUR, GBP, AED. Currency conversion uses RBI reference rates.' },
  { q: 'How do I contact my supplier/buyer?',      a: 'Use the built-in Messages feature to negotiate directly within the platform. All messages are logged for trade assurance purposes.' },
  { q: 'What is the platform fee?',               a: 'The Starter plan is free (5 RFQs/month). Pro is ₹2,999/month with unlimited features. A 2% platform fee applies on Trade Assurance transactions.' },
];

export function HelpCenterPage() {
  return (
    <PublicLayout>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <SectionTag text="Help Center" color={C.emerald} bg={C.emeraldLt} />
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 38, fontWeight: 900, color: C.ink, letterSpacing: -1, margin: '0 0 14px' }}>How Can We Help?</h1>
        <p style={{ fontSize: 15, color: C.muted, maxWidth: 460, margin: '0 auto', lineHeight: 1.75 }}>Answers to the most common questions from Indian traders on Globrixa.</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {HELP.map(({ q, a }) => (
          <div key={q} style={{ background: '#fff', borderRadius: 14, border: `1.5px solid ${C.borderSoft}`, padding: '20px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <CheckCircle2 size={18} color={C.emerald} style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: C.ink, marginBottom: 6 }}>{q}</div>
                <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.7 }}>{a}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 40, textAlign: 'center', background: C.cream, borderRadius: 18, padding: '32px' }}>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: C.ink, marginBottom: 8 }}>Still have questions?</p>
        <p style={{ fontSize: 14, color: C.muted, marginBottom: 20 }}>Our support team replies within 24 hours — in Hindi or English.</p>
        <a href="mailto:support@globrixa.com" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '11px 26px', borderRadius: 100, background: C.emerald, color: '#fff', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
          <Mail size={14} /> Email Support
        </a>
      </div>
    </PublicLayout>
  );
}

export default { AboutPage, BlogPage, CareersPage, ContactPage, PrivacyPage, TermsPage, HelpCenterPage };
