import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleLogin } from '../../features/auth/authSlice';
import { T, shadow, eyebrow, sectionTitle } from './tokens';
import { CITIES } from './data';
import { IMG } from './images';
import { useBreakpoint, rPad, rW } from '../../hooks/useBreakpoint';

const CITY_PHOTOS = {
  Jaipur:    IMG.jaipurTextiles,
  Moradabad: IMG.ceramicVasesLamps,
  Delhi:     IMG.delhiMarket,
  Jodhpur:   IMG.rajasthaniEmbroidery,
};

const CITY_OVERLAYS = {
  Jaipur:    'linear-gradient(145deg,rgba(196,119,58,.85),rgba(164,84,22,.78))',
  Moradabad: 'linear-gradient(145deg,rgba(27,49,117,.85),rgba(18,34,90,.78))',
  Delhi:     'linear-gradient(145deg,rgba(61,122,82,.85),rgba(40,90,58,.78))',
  Jodhpur:   'linear-gradient(145deg,rgba(176,120,144,.85),rgba(130,80,105,.78))',
};

function CityCard({ city, onAction }) {
  const [hov, setHov] = useState(false);
  const photo   = CITY_PHOTOS[city.name];
  const overlay = CITY_OVERLAYS[city.name];

  return (
    <div onClick={onAction} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ borderRadius: 18, overflow: 'hidden', cursor: 'pointer', position: 'relative', minHeight: 260, transform: hov ? 'translateY(-5px)' : 'none', boxShadow: hov ? shadow.lg : shadow.sm, transition: '.25s cubic-bezier(.22,.68,0,1.2)' }}>
      {photo && (
        <img src={photo} alt={`${city.name} suppliers`} loading="lazy" decoding="async" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', transform: hov ? 'scale(1.06)' : 'scale(1)', transition: 'transform .55s ease' }} />
      )}
      <div style={{ position: 'absolute', inset: 0, background: overlay, opacity: hov ? 0.9 : 0.8, transition: '.25s' }} />
      <div style={{ position: 'relative', zIndex: 2, padding: '26px 22px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond','Playfair Display',serif", fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 4 }}>{city.name}</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.7)', marginBottom: 14, fontStyle: 'italic' }}>{city.tagline}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.8)', lineHeight: 1.7 }}>{city.desc}</div>
        </div>
        <div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
            {city.tags.map(([, l]) => (
              <span key={l} style={{ background: 'rgba(255,255,255,.15)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,.22)', color: '#fff', fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 20 }}>{l}</span>
            ))}
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,.85)', display: 'flex', alignItems: 'center', gap: 5, transform: hov ? 'translateX(4px)' : 'none', transition: '.2s' }}>
            Browse suppliers <span style={{ fontSize: 14 }}>→</span>
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
            <div style={eyebrow}>Source by City</div>
            <h2 style={sectionTitle}>India's Craft Capitals</h2>
            <p style={{ fontSize: 13, color: T.mu, marginTop: 6 }}>Connect directly with makers in India's iconic manufacturing hubs.</p>
          </div>
          <button onClick={openLogin} style={{ fontSize: 13, color: T.t, fontWeight: 600, background: T.tl, border: `1.5px solid rgba(196,119,58,.25)`, borderRadius: 7, padding: '8px 16px', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>Explore all cities →</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 16 }}>
          {CITIES.map(city => <CityCard key={city.name} city={city} onAction={openLogin} />)}
        </div>
      </div>
    </section>
  );
}
