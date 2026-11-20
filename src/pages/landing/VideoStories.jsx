import { useEffect, useRef, useState } from 'react';
import { useLandingBreakpoint } from '../../hooks/useBreakpoint';

const STORIES = [
  { id: 1, label: 'Style in motion' },
  { id: 2, label: 'The finishing touch' },
  { id: 3, label: 'Made for living' },
  { id: 4, label: 'Discover Globrixa' },
];

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function Story({ story, m }) {
  const ref = useRef(null);
  const userPaused = useRef(false);
  const [playing, setPlaying] = useState(false);
  const size = m ? 36 : 42;
  const icon = m ? 18 : 21;

  // As in the reference: muted clips play while on screen and pause when scrolled away.
  // preload="none" means nothing beyond the poster downloads until a clip comes into view.
  // Skipped for people who ask for reduced motion, and never resumes a clip someone paused.
  useEffect(() => {
    const v = ref.current;
    if (!v || prefersReducedMotion() || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!userPaused.current && v.paused) {
          const p = v.play();
          if (p && p.catch) p.catch(() => {});
        }
      } else if (!v.paused) {
        v.pause();
      }
    }, { threshold: 0.35 });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      const p = v.play();
      if (p && p.catch) p.catch(() => setPlaying(false));
    } else {
      userPaused.current = true;
      v.pause();
    }
  };

  return (
    <figure style={{ position: 'relative', margin: 0, aspectRatio: '9 / 16', borderRadius: 4, overflow: 'hidden', background: '#E3D5C1' }}>
      <video ref={ref} src={`/videos/story-${story.id}.mp4`} poster={`/images/v4/story-${story.id}-poster.jpg`}
        muted loop playsInline preload="none" aria-label={`${story.label} video`}
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onClick={toggle}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', cursor: 'pointer' }} />
      <button type="button" onClick={toggle} aria-label={`${playing ? 'Pause' : 'Play'} ${story.label.toLowerCase()} video`}
        style={{ position: 'absolute', right: m ? 9 : 13, bottom: m ? 13 : 17, width: size, height: size, borderRadius: '50%', background: '#FDF9F1', border: '1px solid rgba(253,249,241,.65)', color: '#5B4632', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, cursor: 'pointer', boxShadow: '0 2px 8px rgba(43,32,22,.18)' }}>
        {playing ? (
          <svg width={icon} height={icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="M9 6v12M15 6v12" /></svg>
        ) : (
          <svg width={icon} height={icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true"><path d="M9 6.5v11l8.5-5.5z" /></svg>
        )}
      </button>
    </figure>
  );
}

// Mirrors the reference .motion-stories rules: four 9:16 clips in a 4.3% gutter with
// 18px gaps (2x2 with 14px gaps and a 5% gutter up to 760px).
export default function VideoStories() {
  const bp = useLandingBreakpoint();
  const m  = bp.isMobile;
  return (
    <section id="globrixa-in-motion" aria-label="Product stories" style={{ background: '#FDF9F1', padding: m ? '43px 5%' : '64px 4.3% 62px', boxSizing: 'border-box' }}>
      <div style={{ display: 'grid', gridTemplateColumns: m ? 'repeat(2, minmax(0, 1fr))' : 'repeat(4, minmax(0, 1fr))', gap: m ? 14 : 18 }}>
        {STORIES.map(s => <Story key={s.id} story={s} m={m} />)}
      </div>
    </section>
  );
}
