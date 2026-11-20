import { useEffect, useRef, useState } from 'react';
import { useBreakpoint } from '../../hooks/useBreakpoint';

const FILM   = '/videos/workshop-film.mp4';
const POSTER = '/images/v4/workshop-film-poster.jpg';

// "The Process" workshop film, matched to the reference's CSS:
// heading max-width 1152 centred, font clamp(36px, 4vw, 60px) (36px at <=760px),
// full-bleed frame at 21:9 (16:9 at <=760px). The film plays muted while on screen,
// pauses when scrolled away, and a click/Enter/Space toggles it. Nothing downloads
// until it is about to be seen (preload="none" + poster).
export default function ProcessSection() {
  const bp = useBreakpoint();
  const narrow = bp.width <= 760;
  const videoRef = useRef(null);
  const [paused, setPaused] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    let userPaused = false;
    video.muted = true;
    const play = () => { video.play().catch(() => {}); };
    const onToggle = () => { if (video.paused) { userPaused = false; play(); } else { userPaused = true; video.pause(); } };
    const onKey = e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); onToggle(); } };
    const onPlay = () => setPaused(false);
    const onPause = () => setPaused(true);
    video.addEventListener('click', onToggle);
    video.addEventListener('keydown', onKey);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    let io;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting;
        if (visible && !reduced.matches && !userPaused && !document.hidden) play();
        else if (!visible) video.pause();
      }, { threshold: 0.15 });
      io.observe(video);
    }
    const onVis = () => { if (document.hidden) video.pause(); else if (visible && !reduced.matches && !userPaused) play(); };
    const onReduced = () => { if (reduced.matches) video.pause(); else if (visible && !userPaused) play(); };
    document.addEventListener('visibilitychange', onVis);
    reduced.addEventListener?.('change', onReduced);
    return () => {
      io?.disconnect();
      video.removeEventListener('click', onToggle);
      video.removeEventListener('keydown', onKey);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      document.removeEventListener('visibilitychange', onVis);
      reduced.removeEventListener?.('change', onReduced);
    };
  }, []);

  return (
    <section id="workshop-film" aria-labelledby="workshop-film-title"
      style={{ background: '#FDF9F1', color: '#5B4632', padding: narrow ? '24px 0 19.2px' : '30.4px 0 32px' }}>
      <style>{'#workshop-film-video:focus-visible{outline:3px solid #F4D9A0;outline-offset:-3px}'}</style>
      <div style={{ maxWidth: 1152, margin: `0 auto ${narrow ? 17.6 : 20}px`, textAlign: 'center' }}>
        <h2 id="workshop-film-title"
          style={{ margin: 0, fontFamily: "'Canela', 'Cormorant Garamond', Georgia, serif", fontSize: narrow ? 36 : 'clamp(36px, 4vw, 60px)', fontWeight: 300, fontStyle: 'normal', lineHeight: 1.1, letterSpacing: '-.8px', textTransform: 'uppercase', color: '#5B4632' }}>
          The Process
        </h2>
      </div>
      <div style={{ width: '100%', aspectRatio: narrow ? '16 / 9' : '21 / 9', overflow: 'hidden', background: '#2B2016' }}>
        <video id="workshop-film-video" ref={videoRef} width="1920" height="1080" muted loop playsInline preload="none" poster={POSTER}
          tabIndex={0} role="button" aria-label={`${paused ? 'Play' : 'Pause'} workshop film`}
          style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', background: '#2B2016', cursor: 'pointer' }}>
          <source src={FILM} type="video/mp4" />
          Your browser does not support embedded video. <a href={FILM}>Watch the workshop film</a>.
        </video>
      </div>
    </section>
  );
}
