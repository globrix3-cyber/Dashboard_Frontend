import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Send, ArrowLeft, Phone, Mail } from 'lucide-react';
import { api } from '../services/api';
import { useLandingBreakpoint } from '../hooks/useBreakpoint';
import { imageProps } from '../utils/helpers';

// Client Canva p44: a fuller, higher-contrast quote page in the style of the Contact page,
// spread across the page width. Budget and Deadline are not asked for.
const MOCHA = '#5B4632';
const CREAM = '#FDF9F1';
const GOLD = '#F4D9A0';
const PALE = '#F0DCC0';
const MUTED = '#79634E';
const SERIF = "'Canela', 'Cormorant Garamond', Georgia, serif";
const SANS = "'DM Sans', system-ui, sans-serif";

// The client's category list (same as the catalogue sidebar).
const CATEGORIES = ['Side Tables', 'Bedside Tables', 'Console Tables', 'Coffee Tables', 'Table Lamps & Shades', 'Chairs',
  'Vegan Leather Bags', 'Genuine Leather Bags', 'Jute Bags', 'Cotton Bags', 'Wooden Serveware', 'Wall & Home Decor'];

const UNITS = [
  { value: 'pieces', label: 'Pieces' },
  { value: 'meters', label: 'Meters' },
  { value: 'kilograms', label: 'Kilograms' },
  { value: 'sets', label: 'Sets' },
  { value: 'units', label: 'Units' },
  { value: 'boxes', label: 'Boxes' },
];

// Country list for the destination dropdown (ISO code -> English name), India first.
const COUNTRIES = (() => {
  const names = new Intl.DisplayNames(['en'], { type: 'region' });
  const list = [];
  for (let a = 65; a <= 90; a++) for (let b = 65; b <= 90; b++) {
    const code = String.fromCharCode(a, b);
    let name;
    try { name = names.of(code); } catch { continue; }
    if (name && name !== code && !/Unknown/i.test(name)) list.push({ code, name });
  }
  list.sort((x, y) => x.name.localeCompare(y.name));
  const india = list.findIndex(c => c.code === 'IN');
  if (india > 0) list.unshift(list.splice(india, 1)[0]);
  return list;
})();

const label = { display: 'block', fontSize: 12, fontWeight: 600, letterSpacing: '1.2px', textTransform: 'uppercase', color: MOCHA, marginBottom: 9 };
const field = {
  display: 'block', width: '100%', boxSizing: 'border-box', minHeight: 50, padding: '13px 15px',
  background: '#FFFDF8', border: '1px solid rgba(91,70,50,.3)', borderRadius: 3,
  color: MOCHA, fontFamily: SANS, fontSize: 15, lineHeight: 1.5, outline: 'none',
};

function Field({ id, text, required, children }) {
  return (
    <div style={{ minWidth: 0 }}>
      <label htmlFor={id} style={label}>{text}{required && <span aria-hidden="true" style={{ color: '#B4541F' }}> *</span>}</label>
      {children}
    </div>
  );
}

export default function CreateRFQForm() {
  const navigate = useNavigate();
  const bp = useLandingBreakpoint();
  const m = bp.isMobile, stacked = bp.isMobile || bp.isTablet;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', product: '', category: '', quantity: '', unit: 'pieces', description: '', destination: 'IN',
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // "Request quote" on a product page opens this form with ?product=<id>: prefill what we know
  // about that product. Fields the buyer has already typed are never overwritten.
  const [searchParams] = useSearchParams();
  // Only accept a real product id from the URL (UUID); anything else is ignored.
  const rawProductId = searchParams.get('product');
  const productId = rawProductId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rawProductId) ? rawProductId : null;
  const [sourceProduct, setSourceProduct] = useState(null);
  useEffect(() => {
    if (!productId) return undefined;
    let cancelled = false;
    api.getProduct(productId)
      .then((p) => {
        if (cancelled || !p) return;
        setSourceProduct(p);
        setForm((f) => ({
          ...f,
          title:       f.title       || `Quote request: ${p.name}`.slice(0, 200),
          product:     f.product     || p.name || '',
          category:    f.category    || p.category_name || '',
          unit:        p.moq_unit && UNITS.some(u => u.value === p.moq_unit) && f.unit === 'pieces' ? p.moq_unit : f.unit,
          description: f.description || `I'd like a quote for "${p.name}".`,
        }));
      })
      .catch(() => { /* the form still works without the prefill */ });
    return () => { cancelled = true; };
  }, [productId]);

  // The product's own category may not be in the client's list; offer it so the prefill shows.
  const categoryOptions = form.category && !CATEGORIES.includes(form.category) ? [...CATEGORIES, form.category] : CATEGORIES;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.product.trim() || !form.quantity) {
      toast.error('Please fill in the title, product and quantity.');
      return;
    }
    setLoading(true);
    try {
      await api.createRFQ(form);
      toast.success('Your quote request has been sent.');
      navigate('/buyer-dashboard/rfqs');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const img = sourceProduct?.images?.[0]?.image_url;
  const focusOn = (e) => { e.currentTarget.style.borderColor = MOCHA; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(200,121,44,.3)'; };
  const focusOff = (e) => { e.currentTarget.style.borderColor = 'rgba(91,70,50,.3)'; e.currentTarget.style.boxShadow = 'none'; };
  const inputProps = { onFocus: focusOn, onBlur: focusOff };

  return (
    <div style={{ fontFamily: SANS, color: MOCHA }}>
      <button type="button" onClick={() => navigate(-1)}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: SANS, fontSize: 14, color: MUTED, marginBottom: m ? 18 : 24 }}>
        <ArrowLeft size={16} aria-hidden="true" /> Back
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: stacked ? '1fr' : 'minmax(0, 1fr) minmax(0, 1.75fr)', borderRadius: 4, overflow: 'hidden', border: '1px solid #E3D5C1', boxShadow: '0 1px 2px rgba(43,32,22,.04)' }}>
        {/* Left: context panel (Contact-page style) */}
        <aside style={{ background: MOCHA, color: PALE, padding: m ? '30px 22px' : 'clamp(32px, 3.4vw, 52px)' }}>
          <p style={{ margin: 0, fontSize: 12, fontWeight: 600, letterSpacing: '1.6px', textTransform: 'uppercase', color: GOLD }}>Request a quote</p>
          <h1 style={{ margin: '12px 0 0', fontFamily: SERIF, fontWeight: 300, fontSize: m ? 34 : 'clamp(36px, 3.2vw, 48px)', lineHeight: 1.08, letterSpacing: '-.6px', color: CREAM }}>
            {sourceProduct ? 'Tell us what you need' : 'Post a sourcing request'}
          </h1>

          {sourceProduct && (
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginTop: 26, padding: 14, background: 'rgba(253,249,241,.07)', border: '1px solid rgba(244,217,160,.25)', borderRadius: 4 }}>
              {img && <img {...imageProps(img, 160)} alt="" loading="lazy" decoding="async" style={{ width: 72, height: 96, objectFit: 'cover', borderRadius: 4, flexShrink: 0, background: '#4A3828' }} />}
              <div style={{ minWidth: 0 }}>
                {sourceProduct.category_name && <p style={{ margin: 0, fontSize: 11, letterSpacing: '1.4px', textTransform: 'uppercase', color: GOLD }}>{sourceProduct.category_name}</p>}
                <p style={{ margin: '6px 0 0', fontSize: 15.5, lineHeight: 1.45, color: CREAM, overflowWrap: 'anywhere' }}>{sourceProduct.name}</p>
              </div>
            </div>
          )}

          <ol style={{ listStyle: 'none', padding: 0, margin: '30px 0 0', display: 'grid', gap: 18 }}>
            {[
              ['Share your requirement', 'Quantity, finish, packaging and where it is going.'],
              ['We match the right maker', 'Our team checks availability with the supplier.'],
              ['Receive your quote', 'Pricing, minimums and delivery are confirmed in writing.'],
            ].map(([t, d], i) => (
              <li key={t} style={{ display: 'grid', gridTemplateColumns: '30px 1fr', gap: 12 }}>
                <span style={{ fontFamily: SERIF, fontSize: 24, lineHeight: 1, color: GOLD }}>{i + 1}</span>
                <span>
                  <strong style={{ display: 'block', fontWeight: 600, fontSize: 15, color: CREAM }}>{t}</strong>
                  <span style={{ display: 'block', marginTop: 3, fontSize: 14, lineHeight: 1.6 }}>{d}</span>
                </span>
              </li>
            ))}
          </ol>

          <div style={{ marginTop: 30, paddingTop: 22, borderTop: '1px solid rgba(244,217,160,.25)', display: 'grid', gap: 12, fontSize: 14.5 }}>
            <p style={{ margin: 0, color: GOLD, fontSize: 12, fontWeight: 600, letterSpacing: '1.4px', textTransform: 'uppercase' }}>Prefer to talk?</p>
            <a href="tel:+918700076057" style={{ display: 'flex', alignItems: 'center', gap: 10, color: CREAM, textDecoration: 'none' }}><Phone size={16} aria-hidden="true" /> +91 8700076057</a>
            <a href="mailto:support@globrixa.com" style={{ display: 'flex', alignItems: 'center', gap: 10, color: CREAM, textDecoration: 'none' }}><Mail size={16} aria-hidden="true" /> support@globrixa.com</a>
          </div>
        </aside>

        {/* Right: the form */}
        <form onSubmit={handleSubmit} noValidate style={{ background: '#F8F2E9', padding: m ? '28px 20px' : 'clamp(30px, 3.2vw, 50px)', display: 'grid', gap: m ? 20 : 24, alignContent: 'start' }}>
          <Field id="rfq-title" text="Request title" required>
            <input id="rfq-title" required value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. 200 mango wood serving boards" style={field} {...inputProps} />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : '1fr 1fr', gap: m ? 20 : 22 }}>
            <Field id="rfq-product" text="Product name" required>
              <input id="rfq-product" required value={form.product} onChange={(e) => set('product', e.target.value)} placeholder="Product name" style={field} {...inputProps} />
            </Field>
            <Field id="rfq-category" text="Category">
              <select id="rfq-category" value={form.category} onChange={(e) => set('category', e.target.value)} style={{ ...field, cursor: 'pointer' }} {...inputProps}>
                <option value="">Select a category</option>
                {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr 1fr' : '1fr 1fr 1fr', gap: m ? 14 : 22 }}>
            <Field id="rfq-qty" text="Quantity" required>
              <input id="rfq-qty" required type="number" min="1" inputMode="numeric" value={form.quantity} onChange={(e) => set('quantity', e.target.value)} placeholder="e.g. 500" style={field} {...inputProps} />
            </Field>
            <Field id="rfq-unit" text="Unit">
              <select id="rfq-unit" value={form.unit} onChange={(e) => set('unit', e.target.value)} style={{ ...field, cursor: 'pointer' }} {...inputProps}>
                {UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
              </select>
            </Field>
            <div style={m ? { gridColumn: '1 / -1' } : null}>
              <Field id="rfq-dest" text="Destination country">
                <select id="rfq-dest" value={form.destination} onChange={(e) => set('destination', e.target.value)} style={{ ...field, cursor: 'pointer' }} {...inputProps}>
                  {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                </select>
              </Field>
            </div>
          </div>

          <Field id="rfq-notes" text="Additional requirements">
            <textarea id="rfq-notes" value={form.description} onChange={(e) => set('description', e.target.value)} rows={5}
              placeholder="Finish, size, packaging, certifications, timelines…"
              style={{ ...field, resize: 'vertical', minHeight: 140 }} {...inputProps} />
          </Field>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, paddingTop: 4 }}>
            <button type="submit" disabled={loading}
              style={{ flex: m ? '1 1 100%' : '0 0 auto', minWidth: 220, height: 52, padding: '0 28px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: MOCHA, color: CREAM, border: `1px solid ${MOCHA}`, borderRadius: 3, fontFamily: SANS, fontSize: 15, fontWeight: 600, cursor: loading ? 'default' : 'pointer', opacity: loading ? .7 : 1, transition: 'background .15s, color .15s' }}
              onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.background = GOLD; e.currentTarget.style.color = MOCHA; e.currentTarget.style.borderColor = GOLD; } }}
              onMouseLeave={(e) => { e.currentTarget.style.background = MOCHA; e.currentTarget.style.color = CREAM; e.currentTarget.style.borderColor = MOCHA; }}>
              <Send size={16} aria-hidden="true" /> {loading ? 'Sending…' : 'Send quote request'}
            </button>
            <button type="button" onClick={() => navigate(-1)}
              style={{ flex: m ? '1 1 100%' : '0 0 auto', minWidth: 140, height: 52, padding: '0 24px', background: 'transparent', color: MOCHA, border: '1px solid rgba(91,70,50,.4)', borderRadius: 3, fontFamily: SANS, fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
