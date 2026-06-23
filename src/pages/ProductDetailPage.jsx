import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { useFetchData } from '../hooks/useFetchData';
import { Spinner, EmptyState } from '../components/UI';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { resolveImageUrl } from '../utils/helpers';
import { useCurrency } from '../hooks/useCurrency';
import { toggleLogin } from '../features/auth/authSlice';
import {
  ChevronLeft, ChevronDown, ShoppingBag, Truck, MapPin, RotateCcw,
  MessageSquare, Minus, Plus, BadgeCheck,
} from 'lucide-react';

/* ── Design tokens ─────────────────────────────────────────────────────────── */
const C = {
  ink:    '#1C1815',
  muted:  '#7A7068',
  border: '#EDE8DF',
  cream:  '#FDF8F2',
  saffron:'#C4773A',
  emerald:'#1A7A4A',
  navy:   '#1B3175',
};

const COUNTRY_NAMES = {
  IN: 'India', CN: 'China', US: 'United States', GB: 'United Kingdom',
  AE: 'United Arab Emirates', BD: 'Bangladesh', VN: 'Vietnam', TH: 'Thailand',
  PK: 'Pakistan', LK: 'Sri Lanka', NP: 'Nepal', ID: 'Indonesia',
};
const countryName = (code) => COUNTRY_NAMES[code] || code || 'India';

/* ── Expandable section, Faire-style ───────────────────────────────────────── */
function Accordion({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderTop: `1px solid ${C.border}` }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 0', background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: "'Cormorant Garamond', serif", fontSize: 19, fontWeight: 700, color: C.ink,
        }}
      >
        {title}
        <ChevronDown size={18} color={C.muted} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }} />
      </button>
      {open && <div style={{ paddingBottom: 18, fontSize: 13.5, color: C.inkSoft || C.ink, lineHeight: 1.7 }}>{children}</div>}
    </div>
  );
}

/* ── Compact product card for the "More from this supplier" rail ──────────── */
function MiniProductCard({ p, onClick }) {
  const [hov, setHov] = useState(false);
  const { fmt } = useCurrency();
  const img = resolveImageUrl(p.images?.[0]?.image_url);
  return (
    <Link
      to={`/products/${p.id}`}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ display: 'block', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", textDecoration: 'none', color: 'inherit' }}
    >
      <div style={{
        position: 'relative', borderRadius: 12, overflow: 'hidden', aspectRatio: '1 / 1',
        background: C.cream, marginBottom: 8, border: `1px solid ${hov ? '#D4C9B8' : C.border}`,
        transition: 'border-color .15s',
      }}>
        {img
          ? <img src={img} alt={p.name} loading="lazy" decoding="async"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: hov ? 'scale(1.04)' : 'scale(1)', transition: 'transform .35s ease' }} />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ShoppingBag size={28} color="#D8CFC1" /></div>
        }
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 1 }}>
        {p.base_price ? fmt(p.base_price) : 'On request'}
      </div>
      <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {p.name}
      </div>
    </Link>
  );
}

/* ── ProductDetailPage — Faire-style product view ─────────────────────────── */
export default function ProductDetailPage() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const dispatch     = useDispatch();
  const bp           = useBreakpoint();
  const { userRole } = useSelector(s => s.auth);

  const { fmt } = useCurrency();

  const { data: product, loading, error } = useFetchData(() => api.getProduct(id), [id]);
  const { data: allRaw }                  = useFetchData(() => api.getProducts());

  const [activeImg, setActiveImg]     = useState(0);
  const [qty, setQty]                 = useState(1);
  const [variantChoice, setVariant]   = useState({});
  const [messaging, setMessaging]     = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  /* Tiered-pricing variants (created by the "price tiers" listing feature) carry
     {min_qty, max_qty, price} instead of real selectable options like Size/Color —
     they drive the per-quantity price and the order cap, not a dropdown. */
  const isTierVariant = (v) => {
    const keys = Object.keys(v.attributes || {});
    return keys.length > 0 && keys.every(k => ['min_qty', 'max_qty', 'price'].includes(k));
  };

  const priceTiers = useMemo(() => (product?.variants || [])
    .filter(isTierVariant)
    .map(v => ({
      minQty: Number(v.attributes.min_qty) || 0,
      maxQty: v.attributes.max_qty != null ? Number(v.attributes.max_qty) : Infinity,
      price:  Number(v.attributes.price) || 0,
    }))
    .sort((a, b) => a.minQty - b.minQty), [product]);

  const maxQty = priceTiers.length ? Math.max(...priceTiers.map(t => t.maxQty)) : Infinity;

  /* Derive variant dropdown groups (e.g. Size / Color) from product_variants.attributes,
     excluding tiered-pricing variants. */
  const variantGroups = useMemo(() => {
    const groups = {};
    (product?.variants || []).filter(v => !isTierVariant(v)).forEach(v => {
      Object.entries(v.attributes || {}).forEach(([key, val]) => {
        if (!groups[key]) groups[key] = [];
        if (!groups[key].includes(val)) groups[key].push(val);
      });
    });
    return groups;
  }, [product]);
  const variantKeys = Object.keys(variantGroups);

  const selectedVariant = useMemo(() => {
    if (!variantKeys.length) return null;
    return (product?.variants || []).filter(v => !isTierVariant(v)).find(v =>
      variantKeys.every(k => (variantChoice[k] ?? variantGroups[k][0]) === v.attributes?.[k])
    ) || null;
  }, [product, variantChoice, variantGroups, variantKeys]);

  // Quantity must start at the supplier's MOQ, not 1 — otherwise "Add to cart"
  // can submit an order below the minimum without the buyer touching the stepper.
  // Recomputes tier bounds locally (rather than depending on the derived `maxQty`
  // variable) so the effect's dependency array stays a stable single reference.
  useEffect(() => {
    if (!product?.min_order_quantity) return;
    const moqValue = Number(product.min_order_quantity) || 1;
    const tierMaxes = (product.variants || [])
      .filter(v => {
        const keys = Object.keys(v.attributes || {});
        return keys.length > 0 && keys.every(k => ['min_qty', 'max_qty', 'price'].includes(k));
      })
      .map(v => (v.attributes.max_qty != null ? Number(v.attributes.max_qty) : Infinity));
    const cap = tierMaxes.length ? Math.max(...tierMaxes) : Infinity;
    setQty(Math.min(cap, moqValue));
  }, [product]);

  if (loading) return <div style={{ padding: 32 }}><Spinner /></div>;
  if (error || !product) {
    return (
      <div style={{ padding: bp.isMobile ? '24px 16px' : '32px' }}>
        <EmptyState icon={ShoppingBag} title="Product not found" desc="This listing may have been removed or is no longer available." />
      </div>
    );
  }

  const images   = product.images?.length ? product.images : [];
  const moq      = Number(product.min_order_quantity) || 1;
  const unit     = product.moq_unit || 'pieces';
  const basePrice = Number(product.base_price) || 0;
  const tierPrice = priceTiers.find(t => qty >= t.minQty && qty <= t.maxQty)?.price
    ?? priceTiers[priceTiers.length - 1]?.price;
  const unitPrice = (tierPrice ?? basePrice) + Number(selectedVariant?.price_modifier || 0);
  const totalPrice = unitPrice * qty;

  const brandName          = product.supplier_brand_name || product.supplier_legal_name || 'Verified supplier';
  const isVerifiedSupplier = product.supplier_verified_status === 'verified';
  const supplierLocation   = [product.supplier_city, product.supplier_state, countryName(product.supplier_country)]
    .filter(Boolean).join(', ');

  const moreFromSupplier = (Array.isArray(allRaw) ? allRaw : [])
    .filter(p => p.supplier_company_id === product.supplier_company_id && p.id !== product.id)
    .slice(0, 4);

  const handleVariantChange = (key, val) => setVariant(prev => ({ ...prev, [key]: val }));

  const handleAddToCart = async () => {
    if (!userRole) { dispatch(toggleLogin(true)); return; }
    if (userRole !== 'buyer') { toast.info('Switch to a buyer account to add items to cart.'); return; }

    setAddingToCart(true);
    try {
      await api.addToCart({ product_id: product.id, variant_id: selectedVariant?.id || null, quantity: qty });
      const label = variantKeys.length
        ? variantKeys.map(k => variantChoice[k] ?? variantGroups[k][0]).join(' / ') + ' · '
        : '';
      toast.success(`Added to cart — ${label}${qty} × ${product.name}`);
      window.dispatchEvent(new CustomEvent('cart:updated'));
    } catch (err) {
      toast.error(err.message || 'Could not add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleMessageSupplier = async () => {
    if (!product.supplier_company_id) return;
    setMessaging(true);
    try {
      const conv = await api.startConversation({
        supplier_company_id: product.supplier_company_id,
        subject: `Inquiry: ${product.name}`,
        initial_message: `Hi, I'm interested in "${product.name}". Could you share more details and pricing for bulk orders?`,
      });
      navigate(`/buyer-dashboard/messages${conv?.id ? `?conv=${conv.id}` : ''}`);
    } catch (err) {
      toast.error(err.message || 'Could not start conversation');
    } finally {
      setMessaging(false);
    }
  };

  const clampQty = (n) => Math.min(maxQty, Math.max(moq, n));
  const stepQty  = (delta) => setQty(q => clampQty(q + delta));
  const setExactQty = (raw) => {
    const n = Math.trunc(Number(raw));
    if (Number.isFinite(n)) setQty(clampQty(n));
  };

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: '#fff' }}>
      <div style={{ padding: bp.isMobile ? '16px 14px 40px' : bp.isTablet ? '22px 24px 48px' : '28px 40px 56px', maxWidth: 1280, margin: '0 auto' }}>

        {/* Back link */}
        <button onClick={() => navigate(-1)} style={{
          display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20,
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: C.muted, padding: 0,
        }}>
          <ChevronLeft size={15} /> Back
        </button>

        {/* ── Main: gallery + buy box ──────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: bp.isMobile || bp.isTablet ? '1fr' : '1.1fr 0.9fr', gap: bp.isMobile ? 24 : 48 }}>

          {/* Image gallery */}
          <div>
            <div style={{
              borderRadius: 16, overflow: 'hidden', aspectRatio: '1 / 1', background: C.cream,
              border: `1px solid ${C.border}`, marginBottom: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {images[activeImg]?.image_url
                ? <img src={resolveImageUrl(images[activeImg].image_url)} alt={images[activeImg].alt_text || product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                : <ShoppingBag size={64} color="#D8CFC1" />
              }
            </div>
            {images.length > 1 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                {images.slice(0, 5).map((img, i) => (
                  <button key={img.id || i} onClick={() => setActiveImg(i)} style={{
                    aspectRatio: '1 / 1', borderRadius: 9, overflow: 'hidden', cursor: 'pointer', padding: 0,
                    border: `1.5px solid ${i === activeImg ? C.saffron : C.border}`,
                    background: C.cream,
                  }}>
                    <img src={resolveImageUrl(img.image_url)} alt={img.alt_text || `${product.name} ${i + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Buy box */}
          <div>
            {/* Brand strip — Faire-style "Sold by [brand]" */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{
                width: 38, height: 38, borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
                background: C.cream, border: `1px solid ${C.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {product.supplier_logo_url
                  ? <img src={resolveImageUrl(product.supplier_logo_url)} alt={brandName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <ShoppingBag size={16} color={C.muted} />
                }
              </div>
              <div>
                <div style={{ fontSize: 10.5, color: C.muted, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 1 }}>
                  Sold by
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 700, color: C.ink, lineHeight: 1.1 }}>
                    {brandName}
                  </span>
                  {isVerifiedSupplier && <BadgeCheck size={15} color={C.emerald} />}
                </div>
                {supplierLocation && (
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 1 }}>{supplierLocation}</div>
                )}
              </div>
            </div>

            {/* Category */}
            <div style={{ fontSize: 11.5, color: C.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 10 }}>
              {product.category_name}
            </div>

            {/* Name */}
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: bp.isMobile ? 26 : 32, fontWeight: 700, color: C.ink, lineHeight: 1.2, marginBottom: 12 }}>
              {product.name}
            </h1>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: C.ink }}>
                {fmt(unitPrice)}
              </span>
              <span style={{ fontSize: 13, color: C.muted }}>per {unit.replace(/s$/, '')}</span>
            </div>
            <div style={{ fontSize: 12.5, color: C.muted, marginBottom: 22 }}>
              Minimum order: {moq.toLocaleString('en-IN')} {unit}
              {product.lead_time_days ? ` · Ships in ~${product.lead_time_days} days` : ''}
            </div>

            {/* Variant dropdowns */}
            {variantKeys.map(key => (
              <div key={key} style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: C.ink, marginBottom: 6 }}>{key}</label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={variantChoice[key] ?? variantGroups[key][0]}
                    onChange={e => handleVariantChange(key, e.target.value)}
                    style={{
                      width: '100%', appearance: 'none', padding: '11px 36px 11px 14px',
                      borderRadius: 10, border: `1.5px solid ${C.border}`, background: '#fff',
                      fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, color: C.ink, cursor: 'pointer', outline: 'none',
                    }}
                  >
                    {variantGroups[key].map(val => <option key={val} value={val}>{val}</option>)}
                  </select>
                  <ChevronDown size={15} color={C.muted} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                </div>
              </div>
            ))}

            {/* Quantity stepper */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: C.ink, marginBottom: 6 }}>Quantity</label>
              <div style={{ display: 'inline-flex', alignItems: 'center', border: `1.5px solid ${C.border}`, borderRadius: 10, overflow: 'hidden' }}>
                <button onClick={() => stepQty(-1)} disabled={qty <= moq} style={{
                  width: 38, height: 40, border: 'none', background: '#fff', cursor: qty <= moq ? 'default' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: qty <= moq ? '#D8CFC1' : C.ink,
                }}>
                  <Minus size={14} />
                </button>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={qty}
                  onChange={e => setExactQty(e.target.value)}
                  onBlur={e => setExactQty(e.target.value || moq)}
                  style={{
                    width: 64, textAlign: 'center', fontSize: 14, fontWeight: 700, color: C.ink,
                    fontFamily: "'DM Sans', sans-serif", border: 'none', outline: 'none', background: 'transparent',
                  }}
                />
                <button onClick={() => stepQty(1)} disabled={qty >= maxQty} style={{
                  width: 38, height: 40, border: 'none', background: '#fff', cursor: qty >= maxQty ? 'default' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: qty >= maxQty ? '#D8CFC1' : C.ink,
                }}>
                  <Plus size={14} />
                </button>
              </div>
              <div style={{ fontSize: 11.5, color: C.muted, marginTop: 6 }}>
                {moq.toLocaleString('en-IN')}{Number.isFinite(maxQty) ? `–${maxQty.toLocaleString('en-IN')}` : '+'} {unit}
              </div>
            </div>

            {/* Add to cart */}
            <button onClick={handleAddToCart} disabled={addingToCart} style={{
              width: '100%', padding: '14px 20px', borderRadius: 10, border: 'none', cursor: addingToCart ? 'default' : 'pointer',
              background: C.saffron, color: '#fff', fontFamily: "'DM Sans', sans-serif", fontSize: 14.5, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 10,
              boxShadow: '0 4px 16px rgba(196,119,58,.28)', opacity: addingToCart ? 0.7 : 1,
            }}>
              {addingToCart ? 'Adding…' : `Add to cart · ${fmt(totalPrice)}`}
            </button>

            {userRole === 'buyer' && (
              <button onClick={handleMessageSupplier} disabled={messaging} style={{
                width: '100%', padding: '12px 20px', borderRadius: 10, cursor: messaging ? 'default' : 'pointer',
                border: `1.5px solid ${C.border}`, background: '#fff', color: C.ink,
                fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 24, opacity: messaging ? .6 : 1,
              }}>
                <MessageSquare size={14} /> {messaging ? 'Starting conversation…' : 'Message supplier'}
              </button>
            )}

            {/* Shipping & policies */}
            <div style={{ border: `1px solid ${C.border}`, borderRadius: 14, padding: 18 }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 700, color: C.ink, marginBottom: 12 }}>
                Shipping &amp; policies
              </div>
              <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                <Truck size={16} color={C.muted} style={{ flexShrink: 0, marginTop: 1 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>Estimated delivery</div>
                  <div style={{ fontSize: 12.5, color: C.muted, marginTop: 1 }}>
                    {product.lead_time_days ? `Production + shipping: approx. ${product.lead_time_days} days from order confirmation` : 'Lead time confirmed by supplier after order confirmation'}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                <MapPin size={16} color={C.muted} style={{ flexShrink: 0, marginTop: 1 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>Ships from</div>
                  <div style={{ fontSize: 12.5, color: C.muted, marginTop: 1 }}>{supplierLocation || countryName(product.country_of_origin)}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <RotateCcw size={16} color={C.muted} style={{ flexShrink: 0, marginTop: 1 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>Returns</div>
                  <div style={{ fontSize: 12.5, color: C.muted, marginTop: 1 }}>
                    Covered by your digital contract's quality-inspection and warranty terms — raise a dispute via Trade Assurance if goods don't match spec.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Description / Details accordions ─────────────────────────────── */}
        <div style={{ marginTop: 36, maxWidth: 760 }}>
          <Accordion title="Description" defaultOpen>
            {product.description ? <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{product.description}</p>
              : <p style={{ margin: 0, color: C.muted }}>No description provided by the supplier yet.</p>}
          </Accordion>

          <Accordion title="Details">
            <div style={{ display: 'grid', gridTemplateColumns: bp.isMobile ? '1fr' : '1fr 1fr', rowGap: 8, columnGap: 24 }}>
              <DetailRow label="Country of origin" value={countryName(product.country_of_origin)} />
              {product.hs_code && <DetailRow label="HS code" value={product.hs_code} />}
              <DetailRow label="Minimum order" value={`${moq.toLocaleString('en-IN')} ${unit}`} />
              {product.lead_time_days && <DetailRow label="Lead time" value={`${product.lead_time_days} days`} />}
              {(product.specifications || []).map(s => (
                <DetailRow key={s.id} label={s.attr_name} value={`${s.value_text ?? s.value_numeric ?? '—'}${s.unit ? ` ${s.unit}` : ''}`} />
              ))}
            </div>
            {product.tags?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 16 }}>
                {product.tags.map(t => (
                  <span key={t.id} style={{ fontSize: 11.5, fontWeight: 600, color: C.navy, background: '#EEF2FB', padding: '4px 10px', borderRadius: 100 }}>
                    {t.name}
                  </span>
                ))}
              </div>
            )}
          </Accordion>
        </div>

        {/* ── More from this supplier ───────────────────────────────────────── */}
        {moreFromSupplier.length > 0 && (
          <div style={{ marginTop: 48, paddingTop: 32, borderTop: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: bp.isMobile ? 20 : 23, fontWeight: 700, color: C.ink, marginBottom: 3 }}>
                  More from {brandName}
                </h3>
                <p style={{ fontSize: 12.5, color: C.muted, margin: 0 }}>Other active listings from the same {isVerifiedSupplier ? 'verified ' : ''}supplier</p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => navigate('/products')} style={{
                  padding: '9px 18px', borderRadius: 100, border: `1.5px solid ${C.border}`, background: '#fff',
                  color: C.ink, fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
                }}>
                  Shop all products
                </button>
                {userRole === 'buyer' && (
                  <button onClick={handleMessageSupplier} disabled={messaging} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '9px 18px', borderRadius: 100, border: 'none', background: C.ink,
                    color: '#fff', fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, fontWeight: 700, cursor: messaging ? 'default' : 'pointer', opacity: messaging ? .6 : 1,
                  }}>
                    <MessageSquare size={12} /> Message brand
                  </button>
                )}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(${bp.isMobile ? '130px' : '170px'}, 1fr))`, gap: bp.isMobile ? 12 : 18 }}>
              {moreFromSupplier.map(p => (
                <MiniProductCard key={p.id} p={p} onClick={() => window.scrollTo(0, 0)} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '6px 0', borderBottom: `1px solid #F2EDE4` }}>
      <span style={{ color: C.muted }}>{label}</span>
      <span style={{ color: C.ink, fontWeight: 600, textAlign: 'right' }}>{value}</span>
    </div>
  );
}
