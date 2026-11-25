import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLandingBreakpoint } from '../../hooks/useBreakpoint';
import { BANNER_SLIDES } from './bannerSlides';


const SERIF = "'Canela', 'Cormorant Garamond', Georgia, serif";
const INTERVAL_MS = 5000;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export default function HomeBanner({ slides = BANNER_SLIDES }) {
  const bp = useLandingBreakpoint();
  const m = bp.isMobile;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced] = useState(prefersReducedMotion);
  const [loaded, setLoaded] = useState(() => new Set([0]));
  const timer = useRef(null);
  const touchX = useRef(null);
  const count = slides.length;

  const go = (i) => {
    const next = (i + count) % count;
    setLoaded(prev => (prev.has(next) ? prev : new Set(prev).add(next)));
    setIndex(next);
  };

  useEffect(() => {
    if (paused || reduced || count < 2) return undefined;
    timer.current = setTimeout(() => go(index + 1), INTERVAL_MS);
    return () => clearTimeout(timer.current);
    // go is stable enough for this purpose; index drives the schedule.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, paused, reduced, count]);

  // Warm the next slide's image so the change never shows a blank frame.
  useEffect(() => {
    const next = (index + 1) % count;
    if (count > 1 && !loaded.has(next)) {
      const t = setTimeout(() => setLoaded(prev => new Set(prev).add(next)), 1500);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [index, count, loaded]);

  if (!count) return null;

  const arrow = (side) => ({
    position: 'absolute', top: '50%', [side]: m ? 10 : 18, transform: 'translateY(-50%)',
    width: m ? 36 : 44, height: m ? 36 : 44, borderRadius: 3, border: '1px solid rgba(253,249,241,.55)',
    background: 'rgba(43,32,22,.35)', color: '#FDF9F1', display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', zIndex: 2,
  });

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured collections"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false); }}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
      }}
      style={{ position: 'relative', overflow: 'hidden', background: '#2B2016', width: '100%', height: m ? 'clamp(280px, 80vw, 420px)' : bp.isTablet ? 'clamp(320px, 44vw, 460px)' : 'clamp(380px, 35vw, 620px)' }}
    >
      {slides.map((s, i) => (
        <div
          key={s.img}
          role="group"
          aria-roledescription="slide"
          aria-label={`${i + 1} of ${count}`}
          aria-hidden={i !== index}
          style={{ position: 'absolute', inset: 0, opacity: i === index ? 1 : 0, transition: reduced ? 'none' : 'opacity .8s ease', pointerEvents: i === index ? 'auto' : 'none' }}
        >
          {loaded.has(i) && (
            <img src={s.img} alt={s.alt} decoding="async" fetchpriority={i === 0 ? 'high' : 'low'}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: s.pos }} />
          )}
          <div aria-hidden style={{ position: 'absolute', inset: 0, background: m
            ? 'linear-gradient(0deg, rgba(43,32,22,.82) 0%, rgba(43,32,22,.45) 45%, rgba(43,32,22,.05) 75%)'
            : 'linear-gradient(90deg, rgba(43,32,22,.78) 0%, rgba(43,32,22,.45) 38%, rgba(43,32,22,0) 65%)' }} />
          <div style={{ position: 'absolute', left: m ? '6%' : '6%', right: m ? '6%' : 'auto', bottom: m ? 54 : 'auto', top: m ? 'auto' : '50%', transform: m ? 'none' : 'translateY(-50%)', maxWidth: m ? 'none' : 520, color: '#FDF9F1' }}>
            <p style={{ margin: 0, fontSize: m ? 10 : 11, letterSpacing: '1.6px', textTransform: 'uppercase', fontWeight: 600, color: '#F4D9A0' }}>{s.eyebrow}</p>
            <h2 style={{ margin: m ? '8px 0 14px' : '12px 0 22px', fontFamily: SERIF, fontWeight: 300, lineHeight: 1.05, letterSpacing: '-.8px', color: '#FDF9F1', fontSize: m ? 30 : 'clamp(38px, 3.9vw, 60px)', textShadow: '0 1px 2px rgba(43,32,22,.35)' }}>{s.title}</h2>
            <Link to={s.to} tabIndex={i === index ? 0 : -1}
              style={{ display: 'inline-flex', alignItems: 'center', height: m ? 40 : 44, padding: '0 20px', background: '#5B4632', color: '#FDF9F1', fontSize: 13, fontWeight: 600, letterSpacing: '.1px', borderRadius: 3, textDecoration: 'none', transition: 'background .15s, color .15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#F4D9A0'; e.currentTarget.style.color = '#5B4632'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#5B4632'; e.currentTarget.style.color = '#FDF9F1'; }}>
              {s.cta}
            </Link>
          </div>
        </div>
      ))}

      {count > 1 && (
        <>
          {/* Phones swipe instead — arrows there would sit on top of the headline. */}
          {!m && <button type="button" aria-label="Previous slide" onClick={() => go(index - 1)} style={arrow('left')}><ChevronLeft size={20} /></button>}
          {!m && <button type="button" aria-label="Next slide" onClick={() => go(index + 1)} style={arrow('right')}><ChevronRight size={20} /></button>}
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: m ? 18 : 22, display: 'flex', justifyContent: 'center', gap: 8, zIndex: 2 }}>
            {slides.map((s, i) => (
              <button key={s.img} type="button" aria-label={`Show slide ${i + 1}`} aria-current={i === index}
                onClick={() => go(i)}
                style={{ width: i === index ? 26 : 9, height: 9, padding: 0, borderRadius: 5, border: 'none', cursor: 'pointer', background: i === index ? '#F4D9A0' : 'rgba(253,249,241,.6)', transition: 'width .3s ease' }} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
