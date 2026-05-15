import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleLogin } from '../../features/auth/authSlice';
import { T, shadow, eyebrow, sectionTitle } from './tokens';
import { REGIONS } from './data';
import { IMG } from './images';
import { useBreakpoint, rPad, rW } from '../../hooks/useBreakpoint';

const REGION_PHOTOS = {
  'North India': IMG.delhiMarket,
  'West India':  IMG.mumbaiSkyline,
  'South India': IMG.bengaluruCity,
  'East India':  IMG.kolkataStreet,
};
const REGION_OVERLAYS = {
  'North India': 'linear-gradient(145deg,rgba(196,119,58,.88),rgba(164,84,22,.82))',
  'West India':  'linear-gradient(145deg,rgba(61,122,82,.88),rgba(40,90,58,.82))',
  'South India': 'linear-gradient(145deg,rgba(176,120,144,.88),rgba(130,80,105,.82))',
  'East India':  'linear-gradient(145deg,rgba(27,49,117,.88),rgba(18,34,90,.82))',
};

function RegionCard({ r, onAction }) {
  const [hov, setHov] = useState(false);
  const photo   = REGION_PHOTOS[r.name];
  const overlay = REGION_OVERLAYS[r.name];

  return (
    <div onClick={onAction} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ borderRadius: 18, overflow: 'hidden', cursor: 'pointer', position: 'relative', minHeight: 240, transform: hov ? 'translateY(-5px)' : 'none', boxShadow: hov ? shadow.lg : shadow.sm, transition: '.25s cubic-bezier(.22,.68,0,1.2)' }}>
      {photo && (
        <img src={photo} alt={`${r.name} — Indian MSME suppliers hub`} loading="lazy" decoding="async" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', transform: hov ? 'scale(1.06)' : 'scale(1)', transition: 'transform .55s ease' }} />
      )}
      <div style={{ position: 'absolute', inset: 0, background: overlay, opacity: hov ? 0.88 : 0.78, transition: '.25s' }} />
      <div style={{ position: 'relative', zIndex: 2, padding: '24px 20px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 26, marginBottom: 10 }}>{r.emoji}</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{r.name}</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.65)', lineHeight: 1.65, marginBottom: 12 }}>{r.cities}</div>
        </div>
        <div>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 12 }}>
            {r.tags.map(([, l]) => (
              <span key={l} style={{ background: 'rgba(255,255,255,.15)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,.22)', color: '#fff', fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 20 }}>{l}</span>
            ))}
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.75)', display: 'flex', alignItems: 'center', gap: 5, transform: hov ? 'translateX(4px)' : 'none', transition: '.2s' }}>
            Explore suppliers <span style={{ fontSize: 13 }}>→</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BrowseByRegion() {
  const dispatch  = useDispatch();
  const bp        = useBreakpoint();
  const openLogin = () => dispatch(toggleLogin(true));
  const cols      = bp.isMobile ? 'repeat(1,1fr)' : bp.isTablet ? 'repeat(2,1fr)' : 'repeat(4,1fr)';

  return (
    <section style={{ background: T.c, padding: rPad(bp) }}>
      <div style={{ ...rW }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={eyebrow}>Pan-India Network</div>
            <h2 style={sectionTitle}>Browse by Region</h2>
            <p style={{ fontSize: 13, color: T.mu, marginTop: 6 }}>Every MSME hub. Every manufacturing cluster.</p>
          </div>
          <button onClick={openLogin} style={{ fontSize: 13, color: T.t, fontWeight: 600, background: T.tl, border: `1.5px solid rgba(196,119,58,.25)`, borderRadius: 7, padding: '8px 16px', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>View all cities →</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 16 }}>
          {REGIONS.map(r => <RegionCard key={r.name} r={r} onAction={openLogin} />)}
        </div>
      </div>
    </section>
  );
}
