import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import SiteLayout from './SiteLayout';
import usePageMeta from '../../hooks/usePageMeta';
import { toggleLogin } from '../../features/auth/authSlice';
import { COUNTRY_CODES } from './contact/countryCodes';
import './siteBase.css';
import './contact/contact.css';

// Contact page, built from the client's reference (/contact/). Markup and class
// names mirror the reference so its stylesheet (ported to contact.css) applies
// unchanged at every screen width.

const EMAIL         = 'support@globrixa.com';
const ADDRESS       = 'OFF. NO 301, PLOT NO6, III/F, Anupam Plaza 1, Ghazipur Road, Ghazipur, NEW DELHI, 110096';
const MAPS_LINK     = 'https://maps.app.goo.gl/3KtMCNrtySo5hrHM6';
const MAP_EMBED     = 'https://www.google.com/maps?q=28.630255%2C77.317790&z=16&output=embed';
const PHONES        = ['+91 8700076057', '+91 8796930822'];
const FILM_SRC      = '/videos/workshop-film.mp4';
const FILM_POSTER   = '/images/v4/workshop-film-poster.jpg';
const MESSAGE_MAX   = 2500;
const CALL_REQUIRED = 'Enter a phone number if you’d like us to call you.';

const SOCIAL = [
  { name: 'Facebook',  href: 'https://www.facebook.com/people/Globrixa/61592642189036/',          icon: '/images/v4/social/facebook.svg' },
  { name: 'Instagram', href: 'https://www.instagram.com/globrixa_india?cnvx=MTF3M3B1MHRjc3E5eA==', icon: '/images/v4/social/instagram.svg' },
  { name: 'LinkedIn',  href: 'https://www.linkedin.com/company/globrixa/home/',                   icon: '/images/v4/social/linkedin.svg' },
];

// Workshop film: plays muted while on screen, pauses when scrolled away or when
// the tab is hidden, respects reduced motion, and stays paused once the visitor
// pauses it (same behaviour as the reference's contact-film.js).
function WorkshopFilm() {
  const videoRef = useRef(null);
  const userPaused = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed]   = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    video.muted = true;
    video.defaultMuted = true;

    const play = async () => {
      try {
        await video.play();
        if (!visible || document.hidden || userPaused.current) video.pause();
      } catch { /* autoplay refused: stay paused, the visitor can still click */ }
    };

    let observer;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting;
        if (visible && !reduced.matches && !userPaused.current && !document.hidden) play();
        else if (!visible) video.pause();
      }, { threshold: 0.2 });
      observer.observe(video);
    } else {
      visible = true;
      if (!reduced.matches && !document.hidden) play();
    }
    const onVisibility = () => {
      if (document.hidden) video.pause();
      else if (visible && !reduced.matches && !userPaused.current) play();
    };
    const onReduced = () => {
      if (reduced.matches) video.pause();
      else if (visible && !userPaused.current && !document.hidden) play();
    };
    document.addEventListener('visibilitychange', onVisibility);
    reduced.addEventListener?.('change', onReduced);
    return () => {
      observer?.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      reduced.removeEventListener?.('change', onReduced);
    };
  }, []);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) { userPaused.current = false; video.play().catch(() => {}); }
    else { userPaused.current = true; video.pause(); }
  };

  return (
    <section className="contact-film-card" aria-labelledby="contact-film-title">
      <h2 id="contact-film-title">Behind The Process</h2>
      <div className="contact-film-frame">
        <video
          ref={videoRef}
          id="contact-workshop-video"
          width="1920" height="1080"
          muted loop playsInline preload="none"
          poster={FILM_POSTER}
          tabIndex={0}
          role="button"
          aria-label={`${playing ? 'Pause' : 'Play'} workshop film`}
          onClick={toggle}
          onKeyDown={e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); } }}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onError={() => setFailed(true)}
        >
          <source src={FILM_SRC} type="video/mp4" onError={() => setFailed(true)} />
          Your browser does not support embedded video. <a href={FILM_SRC}>Watch the workshop film</a>.
        </video>
      </div>
      <p id="contact-film-error" className="contact-film-error" role="status" hidden={!failed}>
        The film could not load. <a href={FILM_SRC}>Open the workshop film</a>.
      </p>
    </section>
  );
}

// Enquiry form: drafts an email to support (as the reference does) and offers a
// copy-the-message fallback when no email app opens. Nothing is stored server-side.
function EnquiryForm() {
  const formRef     = useRef(null);
  const phoneRef    = useRef(null);
  const consentRef  = useRef(null);
  const fallbackRef = useRef(null);
  const [count, setCount]       = useState(0);
  const [status, setStatus]     = useState('');
  const [message, setMessage]   = useState('');
  const [showCopy, setShowCopy] = useState(false);
  const [fallback, setFallback] = useState(false);

  const updateCallRequirement = () => {
    const phone = phoneRef.current, consent = consentRef.current;
    if (!phone || !consent) return;
    phone.required = consent.checked;
    phone.setAttribute('aria-required', String(consent.checked));
    phone.setCustomValidity(consent.checked && !phone.value.trim() ? CALL_REQUIRED : '');
  };
  useEffect(updateCallRequirement, []);

  const onSubmit = e => {
    e.preventDefault();
    const form = formRef.current, phone = phoneRef.current, consent = consentRef.current;
    for (const el of form.querySelectorAll('[required]')) {
      el.setCustomValidity(el.value.trim() ? '' : (el === phone && consent.checked ? CALL_REQUIRED : 'Please complete this field.'));
    }
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const name = [data.get('firstName'), data.get('surname')].map(p => String(p || '').trim()).filter(Boolean).join(' ');
    const email = String(data.get('email') || '').trim();
    const national = String(data.get('phone') || '').trim();
    const code = String(data.get('countryCode') || '').split('|')[0].trim();
    const phoneText = national ? (national.startsWith('+') ? national : `${code} ${national}`) : '';
    const permission = data.get('callConsent') === 'yes' ? 'Yes — about this enquiry only' : 'No — please reply by email';
    const body = `GLOBRIXA CONTACT ENQUIRY\n\nName: ${name}\nEmail: ${email}${phoneText ? `\nPhone: ${phoneText}` : ''}\nPermission to call: ${permission}\n\n${String(data.get('message') || '').trim()}`;
    setMessage(body);
    setStatus(`Review and send the draft in your email app. If it does not open, copy your message and email ${EMAIL}.`);
    setShowCopy(true);
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(`Globrixa enquiry — ${name}`)}&body=${encodeURIComponent(body)}`;
  };

  const onInput = e => {
    if (e.target.setCustomValidity) e.target.setCustomValidity('');
    if (e.target.id === 'contactMessage') setCount(e.target.value.length);
    if (e.target.id === 'contactPhone') updateCallRequirement();
  };

  const onCopy = async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(message);
      setStatus(`Message copied. Paste it into an email to ${EMAIL}.`);
    } catch {
      setFallback(true);
      setStatus(`Select and copy your message below, then email ${EMAIL}.`);
      requestAnimationFrame(() => { fallbackRef.current?.focus(); fallbackRef.current?.select(); });
    }
  };

  return (
    <form ref={formRef} id="contactForm" className="simple-contact-form" onSubmit={onSubmit} onInput={onInput} aria-labelledby="contact-form-title">
      <div className="contact-form-intro">
        <h2 id="contact-form-title">What can we help you find?</h2>
        <p>Share your ideas, your wish list or your next project.</p>
      </div>
      <div className="simple-contact-fields">
        <label htmlFor="contactFirstName">First name<input id="contactFirstName" name="firstName" placeholder="First name" autoComplete="given-name" required maxLength={70} /></label>
        <label htmlFor="contactSurname">Last name<input id="contactSurname" name="surname" placeholder="Last name" autoComplete="family-name" required maxLength={70} /></label>
        <label htmlFor="contactEmail" className="simple-contact-wide">Email<input id="contactEmail" name="email" type="email" placeholder="you@yourbusiness.com" autoComplete="email" required maxLength={254} /></label>
        <div className="contact-phone-inputs simple-contact-wide">
          <label htmlFor="contactCountryCode">Country code
            <span className="contact-country-select">
              {/* Several countries share a calling code (+1, +44…), so each option's value pairs
                  code and country to keep them distinct; the code is read back on submit. */}
              <select id="contactCountryCode" name="countryCode" autoComplete="tel-country-code" defaultValue="+91|India">
                {COUNTRY_CODES.map(([code, country]) => (
                  <option key={`${code}|${country}`} value={`${code}|${country}`}>{`${code} · ${country}`}</option>
                ))}
              </select>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5" /></svg>
            </span>
          </label>
          <label htmlFor="contactPhone">Phone number<input ref={phoneRef} id="contactPhone" name="phone" type="tel" placeholder="Phone number" autoComplete="tel-national" maxLength={50} /></label>
        </div>
        <label htmlFor="contactMessage" className="simple-contact-wide contact-message-field">Message
          <textarea id="contactMessage" name="message" placeholder={'Tell us about the products you’re looking for, or ask us a question…'}
            aria-describedby="contactMessageCount" required rows={6} maxLength={MESSAGE_MAX} />
          <span className="simple-contact-message-meta"><span id="contactMessageCount">{count.toLocaleString('en-US')} / 2,500</span></span>
        </label>
        <label className="simple-contact-wide contact-call-consent" htmlFor="contactCallConsent">
          <input ref={consentRef} id="contactCallConsent" name="callConsent" type="checkbox" value="yes" onChange={updateCallRequirement} />
          <span>I give Globrixa permission to call me about this enquiry.</span>
        </label>
      </div>
      <button className="simple-contact-submit" type="submit">Send enquiry</button>
      <p id="contactStatus" className="simple-contact-status" role="status" aria-live="polite">{status}</p>
      <button id="contactCopy" className="simple-contact-copy" type="button" hidden={!showCopy} onClick={onCopy}>Copy message instead</button>
      <textarea ref={fallbackRef} id="contactCopyFallback" aria-label="Your message, ready to copy" readOnly hidden={!fallback} value={message} />
    </form>
  );
}

const ICONS = {
  address: <svg viewBox="0 0 24 26"><path d="M20 10c0 6-8 14-8 14S4 16 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>,
  phone:   <svg viewBox="0 0 24 26"><path d="m6 3 4 5-3 3c2 4 4 6 8 8l3-3 5 4-2 4C10 25-1 14 2 5Z" transform="translate(1 -1) scale(.9)" /></svg>,
  email:   <svg viewBox="0 0 24 26"><rect x="2.5" y="5" width="19" height="14" rx="1" /><path d="m3 6 9 7 9-7" /></svg>,
  follow:  <svg viewBox="0 0 24 26"><circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 12h18 M5 7h14 M5 17h14" /></svg>,
};

export default function ContactPage() {
  const dispatch = useDispatch();
  usePageMeta({
    title: 'Contact Globrixa',
    description: 'Get in touch with Globrixa for product, wholesale and customisation enquiries. Visit us in Ghazipur, New Delhi, call +91 8700076057 or email support@globrixa.com.',
    path: '/contact',
  });

  // The reference links to /?panel=buyer and /?panel=signin; here they open the same login modal the header uses.
  const openRegister = e => { e.preventDefault(); dispatch(toggleLogin({ show: true, intent: 'register' })); };
  const openSignIn   = e => { e.preventDefault(); dispatch(toggleLogin(true)); };

  return (
    <SiteLayout>
      <div className="gx-ref contact-page">
        <div id="contact-main" className="simple-contact">
          <div className="simple-contact-heading"><h1>CONTACT US</h1></div>
          <div className="simple-contact-layout">
            <aside className="simple-contact-details">
              <WorkshopFilm />
              <section className="contact-intro-card" aria-labelledby="contact-intro-title">
                <h2 id="contact-intro-title">Get in touch</h2>
                <p>For product, wholesale and customisation enquiries, write to us.</p>
                <h3>Email</h3>
                <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              </section>
              <section className="contact-account-card" aria-labelledby="contact-account-title">
                <h2 id="contact-account-title">Explore our catalogue</h2>
                <a className="contact-account-cta" href="/" role="button" onClick={openRegister}>Create account</a>
                <p className="contact-account-signin">Already have an account? <a href="/" role="button" onClick={openSignIn}>Sign in</a></p>
              </section>
            </aside>
            <EnquiryForm />
          </div>

          <section id="contact-location" className="contact-location" aria-labelledby="contact-location-title">
            <div className="contact-location-heading">
              <div>
                <h2 id="contact-location-title">Find us in New Delhi</h2>
                <p>{ADDRESS}</p>
              </div>
              <a className="contact-location-link" href={MAPS_LINK} target="_blank" rel="noopener noreferrer">Open in Google Maps</a>
            </div>
            <iframe className="contact-location-map" title={'Google Maps location of Globrixa’s office in Ghazipur, New Delhi'}
              src={MAP_EMBED} width="1200" height="360" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
          </section>

          <section id="contact-details" className="contact-information" aria-label="Contact information">
            <article className="contact-information-card">
              <span className="contact-info-icon" aria-hidden="true">{ICONS.address}</span>
              <h2>Address</h2>
              <p><a className="contact-address-map" href={MAPS_LINK} target="_blank" rel="noopener noreferrer">{ADDRESS}</a></p>
            </article>
            <article className="contact-information-card">
              <span className="contact-info-icon" aria-hidden="true">{ICONS.phone}</span>
              <h2>Phone</h2>
              {PHONES.map(p => <a key={p} href={`tel:${p.replace(/\s/g, '')}`}>{p}</a>)}
            </article>
            <article className="contact-information-card">
              <span className="contact-info-icon" aria-hidden="true">{ICONS.email}</span>
              <h2>Email</h2>
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </article>
            <article className="contact-information-card">
              <span className="contact-info-icon" aria-hidden="true">{ICONS.follow}</span>
              <h2>Follow us</h2>
              <div className="contact-social-links" aria-label="Follow Globrixa">
                {SOCIAL.map(s => (
                  <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`Globrixa on ${s.name} (opens in a new tab)`}>
                    <img src={s.icon} width="32" height="32" alt={s.name} decoding="async" />
                  </a>
                ))}
              </div>
            </article>
          </section>
        </div>
      </div>
    </SiteLayout>
  );
}
