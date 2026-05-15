import { useState } from 'react';
import { T, shadow, W, eyebrow, sectionTitle } from './tokens';
import { TESTIMONIALS } from './data';
import { IMG } from './images';

const TESTI_PHOTOS = {
  'Priya Venkatesh': IMG.womanArtisanMarket,
  'Rajesh Kumar':    IMG.artisanPainting,
  'Amandeep Singh':  IMG.businessmanPortrait,
};

function TestiCard({ t, featured }) {
  const [hov, setHov] = useState(false);
  const photo = TESTI_PHOTOS[t.name];

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: featured ? `linear-gradient(145deg,${T.ink},#2A2320)` : T.w,
        borderRadius: 20, padding: 30,
        border: `1.5px solid ${hov ? 'rgba(196,119,58,.45)' : featured ? 'rgba(196,119,58,.2)' : T.bs}`,
        boxShadow: hov ? shadow.lg : featured ? '0 8px 32px rgba(28,25,21,.18)' : 'none',
        transition: '.22s', position: 'relative', overflow: 'hidden',
        transform: hov ? 'translateY(-4px)' : 'none',
      }}
    >
      {/* Big decorative quote */}
      <div style={{
        position: 'absolute', top: -14, right: -4,
        fontFamily: "'Playfair Display',serif", fontSize: 140,
        fontWeight: 900, lineHeight: 1,
        color: featured ? 'rgba(196,119,58,.12)' : 'rgba(196,119,58,.07)',
        pointerEvents: 'none', userSelect: 'none',
      }}>"</div>

      {/* Stars */}
      <div style={{ color: T.t, fontSize: 13, letterSpacing: 3, marginBottom: 18 }}>{t.rating}</div>

      {/* Quote */}
      <p style={{
        fontSize: 15, color: featured ? 'rgba(255,255,255,.85)' : T.is,
        lineHeight: 1.82, fontStyle: 'italic', marginBottom: 28,
        fontFamily: "'Playfair Display',serif", fontWeight: 600,
        position: 'relative', zIndex: 1,
      }}>
        {t.quote}
      </p>

      {/* Divider */}
      <div style={{ height: 1, background: featured ? 'rgba(255,255,255,.08)' : T.bs, marginBottom: 20 }} />

      {/* Author */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {photo ? (
          <div style={{
            width: 48, height: 48, borderRadius: 12, overflow: 'hidden', flexShrink: 0,
            border: `2px solid ${featured ? 'rgba(196,119,58,.4)' : 'rgba(196,119,58,.2)'}`,
          }}>
            <img
              src={photo}
              alt={t.name}
              loading="lazy"
              decoding="async"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
            />
          </div>
        ) : (
          <div style={{
            width: 48, height: 48, borderRadius: 12, background: t.bg, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, flexShrink: 0,
          }}>
            {t.initial}
          </div>
        )}
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: featured ? '#fff' : T.ink }}>{t.name}</div>
          <div style={{ fontSize: 12, color: featured ? 'rgba(255,255,255,.45)' : T.mu, marginTop: 2 }}>{t.role}</div>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section style={{ background: T.c, padding: '80px 56px' }}>
      <div style={{ ...W }}>
        <div style={{ marginBottom: 40, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <div style={eyebrow}>Customer Stories</div>
            <h2 style={sectionTitle}>Trusted by Indian businesses</h2>
          </div>
          <div style={{ fontSize: 13, color: T.mu, textAlign: 'right' }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 800, color: T.ink, lineHeight: 1 }}>4.9 / 5</div>
            <div style={{ color: T.t, fontSize: 12, letterSpacing: 2 }}>★★★★★</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
          {TESTIMONIALS.map((t, i) => <TestiCard key={t.name} t={t} featured={i === 1} />)}
        </div>
      </div>
    </section>
  );
}
