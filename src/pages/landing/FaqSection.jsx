import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleLogin } from '../../features/auth/authSlice';
import { FAQS } from './data';
import { useBreakpoint, rGutter } from '../../hooks/useBreakpoint';

const INK = '#5B4632';
const MUTED = '#79634E';

function FaqItem({ faq, idx, open, onToggle, bp }) {
  const panelId = `faq-panel-${idx}`;
  const btnId   = `faq-btn-${idx}`;
  return (
    <div style={{ background: '#F7F0E5', borderRadius: 10 }}>
      <h3 style={{ margin: 0 }}>
        <button id={btnId} onClick={onToggle} aria-expanded={open} aria-controls={panelId}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, fontFamily: "'DM Sans', system-ui, sans-serif", minHeight: bp.isMobile ? 80 : 82, padding: bp.isMobile ? '12px 19px' : '0 26px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: bp.isMobile ? 14 : 15, fontWeight: 500, letterSpacing: 'normal', color: INK }}>
          <span>{faq.q}</span>
          <span aria-hidden="true" style={{ width: bp.isMobile ? 28 : 34, height: bp.isMobile ? 28 : 34, borderRadius: '50%', border: `1px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: bp.isMobile ? 16 : 19, fontWeight: 300, lineHeight: 1, flexShrink: 0 }}>{open ? '−' : '+'}</span>
        </button>
      </h3>
      {open && (
        <div id={panelId} role="region" aria-labelledby={btnId}>
          <p style={{ margin: 0, padding: bp.isMobile ? '0 56px 18px 19px' : '0 80px 26px 26px', fontSize: bp.isMobile ? 13 : 14, lineHeight: 1.75, color: MUTED }}>{faq.a}</p>
        </div>
      )}
    </div>
  );
}

export default function FaqSection() {
  const bp       = useBreakpoint();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token    = useSelector(s => s.auth.token);
  const [openIdx, setOpenIdx] = useState(-1);

  const startBrief = (e) => {
    e.preventDefault();
    if (token) navigate('/buyer-dashboard/rfqs/new');
    else dispatch(toggleLogin(true));
  };

  return (
    // Reference layout: 1440px → 702px tall (80px top/bottom, 6 x 82px items + 10px gaps, accordion at x=575 w=779;
    // left column sticks, so once scrolled past it rests against the bottom with its h2 at ~+341).
    // 390px → 875px tall (43px top, 20px sides, accordion starts at +295).
    <section style={{ background: '#FDF9F1', padding: bp.isMobile ? '43px 0 50px' : '80px 0' }}>
      <div style={{ ...rGutter(bp), ...(bp.isDesktop ? { paddingLeft: 86, paddingRight: 86 } : bp.isMobile ? { paddingLeft: 20, paddingRight: 20 } : {}), display: 'grid', gridTemplateColumns: bp.isMobile ? '1fr' : bp.isTablet ? '1fr 1.4fr' : '403px 1fr', columnGap: bp.isTablet ? 32 : 86, rowGap: 28, alignItems: 'start' }}>
        <div style={{ paddingTop: bp.isMobile ? 0 : 8, paddingBottom: bp.isMobile ? 0 : 9, ...(bp.isMobile ? {} : { position: 'sticky', top: 110 }) }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 9, fontWeight: 600, letterSpacing: '2px', color: INK, marginBottom: bp.isMobile ? 14 : 22 }}>
            <span aria-hidden="true" style={{ width: 22, height: 1, background: INK }} />A LITTLE CLARITY
          </div>
          <h2 style={{ fontFamily: "'Canela', 'Cormorant Garamond', Georgia, serif", fontSize: bp.isMobile ? 43 : bp.isTablet ? 50 : 59, fontWeight: 300, lineHeight: 0.98, letterSpacing: '-1px', color: INK, margin: 0 }}>Frequently asked questions.</h2>
          <p style={{ margin: bp.isMobile ? '19px 0 20px' : '22px 0 28px', maxWidth: bp.isMobile ? 350 : 300, fontSize: bp.isMobile ? 13 : 14, lineHeight: 1.8, color: MUTED }}>
            The details behind your next collection. Explore the essentials of sourcing with Globrixa.
          </p>
          <a href={token ? '/buyer-dashboard/rfqs/new' : '/'} onClick={startBrief}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 22, paddingBottom: 5, borderBottom: `1px solid ${INK}`, fontSize: 11, color: INK, textDecoration: 'none' }}>
            Create your sourcing brief <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {FAQS.map((faq, i) => (
            <FaqItem key={faq.q} faq={faq} idx={i} bp={bp} open={openIdx === i} onToggle={() => setOpenIdx(o => (o === i ? -1 : i))} />
          ))}
        </div>
      </div>
    </section>
  );
}
