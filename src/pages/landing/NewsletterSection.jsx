import { useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../../services/api';
import { useBreakpoint } from '../../hooks/useBreakpoint';

const INK = '#5B4632';

// Off-screen but still in the DOM, so bots fill it while people never see it.
const HONEYPOT_STYLE = { position: 'absolute', left: '-10000px', top: 'auto', width: 1, height: 1, overflow: 'hidden' };

export default function NewsletterSection() {
  const bp = useBreakpoint();
  const [email, setEmail]         = useState('');
  const [company, setCompany]     = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      if (company) {
        // Honeypot tripped — pretend it worked without calling the API.
        setSubscribed(true);
        return;
      }
      await api.subscribeNewsletter(email.trim());
      setSubscribed(true);
    } catch (err) {
      toast.error(err.message || 'Could not subscribe right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section style={{ display: 'grid', gridTemplateColumns: bp.isMobile ? '1fr' : '1fr 1fr', background: '#FDF9F1' }}>
      <img src="/images/v3/newsletter-coffee-table.jpeg" alt="Natural wooden coffee table in a warm living room" loading="lazy" decoding="async"
        style={{ width: '100%', height: bp.isMobile ? 280 : '100%', minHeight: bp.isMobile ? 0 : 560, maxHeight: bp.isMobile ? 280 : 720, objectFit: 'cover', display: 'block' }} />
      <div style={{ padding: bp.isMobile ? '36px 18px' : '0 58px', display: 'flex', flexDirection: 'column', justifyContent: 'center', color: INK }}>
        <div style={{ fontSize: 26, lineHeight: 1 }}>✳</div>
        <div style={{ fontSize: 9, letterSpacing: '.22em', margin: '16px 0 14px' }}>THE GLOBRIXA EDIT</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: bp.isMobile ? 42 : 62, fontWeight: 600, margin: 0, lineHeight: 1.1 }}>Stay inspired.</h2>
        <p style={{ fontSize: 15, lineHeight: 1.7, margin: '16px 0 28px', maxWidth: 520 }}>
          Discover fresh finds, homeware trends and the latest from Globrixa. Inspiration for your store’s next chapter, delivered to your inbox.
        </p>
        {subscribed ? (
          <p role="status" style={{ fontSize: 15, lineHeight: 1.7, margin: 0, maxWidth: 520 }}>
            Thank you — you’re on the list. Look out for the Globrixa Edit in your inbox.
          </p>
        ) : (
        <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
          <div aria-hidden="true" style={HONEYPOT_STYLE}>
            <label htmlFor="newsletter-company">Company</label>
            <input id="newsletter-company" type="text" name="company" tabIndex={-1} autoComplete="off" value={company} onChange={e => setCompany(e.target.value)} />
          </div>
          <label htmlFor="newsletter-email" style={{ display: 'block', fontSize: 12, marginBottom: 8 }}>Your business email</label>
          <div style={{ display: 'flex', flexDirection: bp.isMobile ? 'column' : 'row', maxWidth: 605 }}>
            <input id="newsletter-email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@yourbusiness.com"
              style={{ flex: 1, minWidth: 0, minHeight: 49, padding: '0 13px', border: `1px solid ${INK}`, background: '#FDF9F1', color: INK, fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
            <button type="submit" disabled={submitting} aria-busy={submitting} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18, minHeight: 49, padding: '0 16px', background: INK, color: '#FDF9F1', fontSize: 12, border: 'none', cursor: submitting ? 'wait' : 'pointer', opacity: submitting ? 0.7 : 1, fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
              {submitting ? 'Signing you up…' : <>Sign up to our newsletter <span>↗</span></>}
            </button>
          </div>
        </form>
        )}
      </div>
    </section>
  );
}
