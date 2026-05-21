import { useDispatch } from 'react-redux';
import { toggleLogin } from '../../features/auth/authSlice';
import { T, btnPrimary, eyebrow, sectionTitle } from './tokens';
import { IMG } from './images';
import { useBreakpoint, rPad, rW } from '../../hooks/useBreakpoint';

const PILLARS = [
  {
    photo: IMG.wovenBaskets,
    photoAlt: 'Flexible minimum orders from Indian suppliers',
    title: 'Flexible minimum orders',
    desc: 'Work with suppliers offering low MOQs — perfect for growing businesses and first-time importers testing new product lines.',
  },
  {
    photo: IMG.wheatFieldIndia,
    photoAlt: 'Verified Indian suppliers',
    title: 'Verified Indian suppliers',
    desc: 'Discover trusted manufacturers and emerging brands across home décor, lifestyle, textiles, and more. Every supplier is KYC-verified.',
  },
  {
    photo: IMG.mumbaiSkyline,
    photoAlt: 'Export support made simple',
    title: 'Export support made simple',
    desc: 'From sourcing to shipping, manage international orders with streamlined communication, digital contracts, and dedicated support.',
  },
];

function PillarCard({ p, bp }) {
  return (
    <div style={{ background: '#fff', borderRadius: 20, border: `1.5px solid ${T.bs}`, overflow: 'hidden' }}>
      {/* Photo */}
      <div style={{ height: bp.isMobile ? 180 : 200, position: 'relative', overflow: 'hidden' }}>
        <img
          src={p.photo}
          alt={p.photoAlt}
          loading="lazy"
          decoding="async"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(28,25,21,.35) 0%, transparent 60%)' }} />
      </div>
      {/* Text */}
      <div style={{ padding: bp.isMobile ? '20px 18px' : '24px 24px' }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: T.ink, marginBottom: 10, fontFamily: "'Playfair Display',serif" }}>{p.title}</div>
        <p style={{ fontSize: 14, color: T.mu, lineHeight: 1.75, margin: 0 }}>{p.desc}</p>
      </div>
    </div>
  );
}

export default function SourceConfidently() {
  const dispatch = useDispatch();
  const bp       = useBreakpoint();
  const cols     = bp.isMobile ? '1fr' : bp.isTablet ? '1fr' : 'repeat(3,1fr)';

  return (
    <section style={{ background: T.c, padding: rPad(bp), borderTop: `1px solid ${T.bs}` }}>
      <div style={{ ...rW }}>
        <div style={{ textAlign: 'center', marginBottom: bp.isMobile ? 28 : 44 }}>
          <div style={{ ...eyebrow, marginBottom: 10 }}>Why Globrixa</div>
          <h2 style={{ ...sectionTitle, fontSize: bp.isMobile ? '26px' : 'clamp(28px,3.5vw,44px)' }}>
            Source confidently from India
          </h2>
          <p style={{ fontSize: bp.isMobile ? 14 : 16, color: T.mu, marginTop: 12, maxWidth: 500, margin: '12px auto 0', lineHeight: 1.7 }}>
            Everything you need to import from India's best manufacturers — in one place.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: cols, gap: bp.isMobile ? 14 : 20, marginBottom: 36 }}>
          {PILLARS.map((p, i) => <PillarCard key={i} p={p} bp={bp} />)}
        </div>

        <div style={{ textAlign: 'center' }}>
          <button onClick={() => dispatch(toggleLogin(true))} style={{ ...btnPrimary, padding: '14px 40px', fontSize: 15 }}>
            Start sourcing →
          </button>
        </div>
      </div>
    </section>
  );
}
