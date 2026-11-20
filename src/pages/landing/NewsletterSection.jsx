import { useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../../services/api';
import { useLandingBreakpoint } from '../../hooks/useBreakpoint';

const INK = '#5B4632';

// Off-screen but still in the DOM, so bots fill it while people never see it.
const HONEYPOT_STYLE = { position: 'absolute', left: '-10000px', top: 'auto', width: 1, height: 1, overflow: 'hidden' };

// Mirrors the reference #newsletter rules: a 1200px band with 28px clamp(24px, 3vw, 46px)
// padding, text left / form right (48px gap); stacked up to 760px (28px 6% 30px), and
// the button drops under the input inside the same bordered box at 390px and below.
export default function NewsletterSection() {
  const bp = useLandingBreakpoint();
  const m  = bp.isMobile;
  const col = bp.width <= 390;
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
    <section style={{ background: '#F0DCC0', color: INK }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', boxSizing: 'border-box', padding: m ? '28px 6% 30px' : '28px clamp(24px, 3vw, 46px)', display: 'grid', gridTemplateColumns: m ? '1fr' : '1fr 1fr', columnGap: 48, rowGap: m ? 20 : 0, alignItems: 'center' }}>
        <div>
          <h2 style={{ fontFamily: "'Canela', 'Cormorant Garamond', Georgia, serif", fontSize: m ? 36 : 'clamp(34px, 3.1vw, 44px)', fontWeight: 300, lineHeight: 1.08, letterSpacing: '-0.6px', margin: 0 }}>Stay in the loop</h2>
          <p style={{ fontSize: 14.3, lineHeight: 1.65, margin: '10px 0 0', maxWidth: 440 }}>
            Get our latest updates delivered straight to your inbox. No spam, ever.
          </p>
        </div>
        {subscribed ? (
          <p role="status" style={{ fontSize: 14.3, lineHeight: 1.65, margin: 0 }}>
            Thank you — you’re on the list. Look out for Globrixa updates in your inbox.
          </p>
        ) : (
          <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
            <div aria-hidden="true" style={HONEYPOT_STYLE}>
              <label htmlFor="newsletter-company">Company</label>
              <input id="newsletter-company" type="text" name="company" tabIndex={-1} autoComplete="off" value={company} onChange={e => setCompany(e.target.value)} />
            </div>
            <label htmlFor="newsletter-email" style={{ display: 'block', fontSize: 11, lineHeight: '14px', fontWeight: 500, marginBottom: 6 }}>Your business email</label>
            <div style={{ display: 'flex', flexDirection: col ? 'column' : 'row', alignItems: 'stretch', border: `1px solid ${INK}`, background: '#FDF9F1' }}>
              <input id="newsletter-email" type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@yourbusiness.com"
                style={{ flex: col ? 'none' : 1, minWidth: 0, padding: '11px 12px', lineHeight: 1.5, border: 'none', background: '#FDF9F1', color: INK, fontSize: m ? 16 : 12, fontFamily: 'inherit', boxSizing: 'border-box' }} />
              <button type="submit" disabled={submitting} aria-busy={submitting}
                style={{ width: col ? '100%' : 'auto', padding: m ? '11px 13px' : '11px 14px', background: INK, color: '#F4D9A0', fontSize: 11, lineHeight: 1.5, fontWeight: 700, border: 'none', cursor: submitting ? 'wait' : 'pointer', opacity: submitting ? 0.7 : 1, fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                {submitting ? 'Signing you up…' : 'Sign up to our newsletter'}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
