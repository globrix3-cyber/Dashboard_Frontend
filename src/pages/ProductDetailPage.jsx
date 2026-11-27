import { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { api } from '../services/api';
import { useFetchData } from '../hooks/useFetchData';
import { Spinner, EmptyState } from '../components/UI';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { resolveImageUrl, imageProps } from '../utils/helpers';
import usePageMeta from '../hooks/usePageMeta';
import { toggleLogin } from '../features/auth/authSlice';
import { ChevronLeft, ChevronDown, ShoppingBag } from 'lucide-react';

/* ── Design tokens (client palette) ────────────────────────────────────────── */
const C = {
  ink:    '#5B4632',
  muted:  '#79634E',
  border: '#E3D5C1',
  cream:  '#FDF9F1',
  amber:  '#C8792C',
  deep:   '#2B2016',
};
const SERIF = "'Canela', 'Cormorant Garamond', Georgia, serif";
const SANS  = "'DM Sans', system-ui, sans-serif";

const COUNTRY_NAMES = {
  IN: 'India', CN: 'China', US: 'United States', GB: 'United Kingdom',
  AE: 'United Arab Emirates', BD: 'Bangladesh', VN: 'Vietnam', TH: 'Thailand',
  PK: 'Pakistan', LK: 'Sri Lanka', NP: 'Nepal', ID: 'Indonesia',
};
const countryName = (code) => COUNTRY_NAMES[code] || code || 'India';

/* Tiered-pricing variants carry {min_qty, max_qty, price}; they are pricing data, not options. */
const isTierVariant = (v) => {
  const keys = Object.keys(v.attributes || {});
  return keys.length > 0 && keys.every(k => ['min_qty', 'max_qty', 'price'].includes(k));
};

/* ── Expandable section ────────────────────────────────────────────────────── */
function Accordion({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderTop: `1px solid ${C.border}` }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 0', background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: SERIF, fontSize: 25, fontWeight: 300, letterSpacing: '-.3px', color: C.ink, textAlign: 'left',
        }}
      >
        {title}
        <ChevronDown size={18} color={C.muted} aria-hidden="true" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .15s', flexShrink: 0 }} />
      </button>
      {open && <div style={{ paddingBottom: 22, fontSize: 16, color: C.ink, lineHeight: 1.75 }}>{children}</div>}
    </div>
  );
}

/* ── Card for the "More similar products" rail: image, category, name only ── */
function MiniProductCard({ p, onClick }) {
  const img = resolveImageUrl(p.images?.[0]?.image_url, 480);
  return (
    <Link to={`/products/${p.id}`} onClick={onClick} className="gx-product-card"
      style={{ display: 'block', textDecoration: 'none', color: 'inherit', minWidth: 0 }}>
      <div style={{ aspectRatio: '3 / 4', borderRadius: 14, overflow: 'hidden', background: '#F0E6D6' }}>
        {img
          ? <img className="gx-product-img" src={img} alt={p.name} loading="lazy" decoding="async"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .35s ease' }} />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ShoppingBag size={28} color="#C9B89F" aria-hidden="true" /></div>}
      </div>
      <div style={{ textAlign: 'center', padding: '14px 6px 4px' }}>
        <div style={{ fontSize: 10.5, fontWeight: 500, color: C.muted, textTransform: 'uppercase', letterSpacing: '1.6px', marginBottom: 6 }}>
          {p.category_name || 'Uncategorised'}
        </div>
        <div style={{ fontSize: 13.5, fontWeight: 500, color: C.ink, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {p.name}
        </div>
      </div>
    </Link>
  );
}

/* ── ProductDetailPage — quote-led product view (client Canva V2, p21–p22) ── */
export default function ProductDetailPage() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const dispatch     = useDispatch();
  const bp           = useBreakpoint();
  const { userRole } = useSelector(s => s.auth);

  const { data: product, loading, error } = useFetchData(() => api.getProduct(id), [id]);
  const { data: allRaw }                  = useFetchData(() => api.getProducts());

  const [activeImg, setActiveImg] = useState(0);
  const [zoomOpen, setZoomOpen]   = useState(false); // client Canva p34: click the photo to enlarge
  const [prevId, setPrevId]       = useState(id);

  // Moving to another product resets the gallery to its first image.
  if (prevId !== id) {
    setPrevId(id);
    setActiveImg(0);
  }

  /* Real product options (e.g. Size / Colour), shown as information — the quantity
     and options themselves are agreed in the quote. */
  const optionGroups = useMemo(() => {
    const groups = {};
    (product?.variants || []).filter(v => !isTierVariant(v)).forEach(v => {
      Object.entries(v.attributes || {}).forEach(([key, val]) => {
        if (!groups[key]) groups[key] = [];
        if (!groups[key].includes(val)) groups[key].push(val);
      });
    });
    return groups;
  }, [product]);

  // Per-product SEO: title, description, og:image and Product JSON-LD (no prices — quotes only).
  const metaImage  = resolveImageUrl(product?.images?.[0]?.image_url, 1200) || undefined;
  const metaDesc   = product
    ? (product.description?.trim() || `Request a wholesale quote for ${product.name} on Globrixa.`)
    : undefined;
  usePageMeta({
    title:       product?.name ? `${product.name} — Wholesale` : undefined,
    description: metaDesc,
    image:       metaImage,
    path:        `/products/${id}`,
    type:        product ? 'product' : undefined,
    jsonLd: product ? {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      ...(metaImage && { image: (product.images || []).map(im => resolveImageUrl(im.image_url, 1200)).filter(Boolean) }),
      ...(metaDesc && { description: metaDesc.slice(0, 5000) }),
      ...(product.category_name && { category: product.category_name }),
      url: `https://www.globrixa.com/products/${id}`,
    } : null,
  });

  if (loading) return <div style={{ padding: 32 }}><Spinner /></div>;
  if (error || !product) {
    return (
      <div style={{ padding: bp.isMobile ? '24px 16px' : '32px' }}>
        <EmptyState icon={ShoppingBag} title="Product not found" desc="This listing may have been removed or is no longer available." />
      </div>
    );
  }

  const images   = product.images?.length ? product.images : [];
  const current  = images[activeImg] || images[0];
  const optionKeys = Object.keys(optionGroups);

  // Similar = same category first, then same supplier, never the product itself.
  const all = Array.isArray(allRaw) ? allRaw : [];
  const sameCategory = all.filter(p => p.id !== product.id && p.category_id && p.category_id === product.category_id);
  const sameSupplier = all.filter(p => p.id !== product.id && p.supplier_company_id === product.supplier_company_id && !sameCategory.includes(p));
  const similar = [...sameCategory, ...sameSupplier].slice(0, 4);

  const handleRequestQuote = () => {
    if (!userRole) { dispatch(toggleLogin(true)); return; }
    navigate(`/buyer-dashboard/rfqs/new?product=${encodeURIComponent(product.id)}`);
  };


  const canQuote  = !userRole || userRole === 'buyer';
  const thumbSize = bp.isMobile ? 52 : 72;
  const stacked   = bp.isMobile || bp.isTablet;

  return (
    <div style={{ fontFamily: SANS, background: C.cream, color: C.ink }}>
      <style>{`
        .gx-product-card:hover .gx-product-img { transform: scale(1.03); }
        .gx-product-card:focus-visible, .gx-thumb:focus-visible { outline: 2px solid ${C.amber}; outline-offset: 3px; }
        .gx-quote-btn:hover, .gx-quote-btn:focus-visible { background: #F4D9A0 !important; color: #5B4632 !important; }
        .gx-secondary-btn:hover { background: #F5F0E7 !important; }
        @media (prefers-reduced-motion: reduce) { .gx-product-img { transition: none !important; } .gx-product-card:hover .gx-product-img { transform: none; } }
      `}</style>
      <div style={{ padding: bp.isMobile ? '16px 0 40px' : '24px 0 56px', maxWidth: 1240, margin: '0 auto' }}>

        {/* Back link */}
        <button type="button" onClick={() => navigate(-1)} style={{
          display: 'flex', alignItems: 'center', gap: 6, marginBottom: bp.isMobile ? 16 : 24,
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: SANS, fontSize: 13, fontWeight: 500, color: C.muted, padding: 0,
        }}>
          <ChevronLeft size={15} aria-hidden="true" /> Back
        </button>

        {/* ── Main: gallery + details ──────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: stacked ? '1fr' : 'minmax(0, 1fr) minmax(0, 1fr)', gap: bp.isMobile ? 26 : stacked ? 36 : 64, alignItems: 'start' }}>

          {/* Gallery: thumbnails in a column on the left, main image beside them */}
          <div style={{ display: 'flex', gap: bp.isMobile ? 10 : 14, alignItems: 'flex-start', justifyContent: stacked ? 'center' : 'flex-start' }}>
            {images.length > 1 && (
              <div role="list" aria-label="Product images" style={{ display: 'flex', flexDirection: 'column', gap: bp.isMobile ? 8 : 10, flexShrink: 0, maxHeight: bp.isMobile ? 380 : 560, overflowY: 'auto' }}>
                {images.slice(0, 8).map((img, i) => (
                  <button key={img.id || i} type="button" role="listitem" className="gx-thumb" onClick={() => setActiveImg(i)} aria-pressed={i === activeImg}
                    aria-label={`Show image ${i + 1} of ${Math.min(images.length, 8)}`}
                    style={{
                      width: thumbSize, aspectRatio: '3 / 4', flexShrink: 0, borderRadius: 8, overflow: 'hidden', cursor: 'pointer', padding: 0,
                      border: `1.5px solid ${i === activeImg ? C.ink : C.border}`, background: '#F0E6D6',
                      opacity: i === activeImg ? 1 : .8, transition: 'opacity .15s, border-color .15s',
                    }}>
                    <img loading="lazy" decoding="async" {...imageProps(img.image_url, 160)} alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </button>
                ))}
              </div>
            )}
            <div style={{
              flex: '1 1 auto', maxWidth: bp.isMobile ? 'none' : 440, aspectRatio: '3 / 4', borderRadius: 16, overflow: 'hidden', background: '#F0E6D6',
              display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 0,
            }}>
              {current?.image_url
                ? <button type="button" onClick={() => setZoomOpen(true)} aria-label="Enlarge photo"
                    style={{ all: 'unset', display: 'block', width: '100%', height: '100%', cursor: 'zoom-in' }}>
                    <img fetchPriority="high" {...imageProps(current.image_url, 800)} alt={current.alt_text || product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </button>
                : <ShoppingBag size={56} color="#C9B89F" aria-hidden="true" />}
            </div>
          </div>

          {zoomOpen && <PhotoViewer images={images} index={activeImg} onIndex={setActiveImg} onClose={() => setZoomOpen(false)} title={product.name} />}

          {/* Details */}
          <div style={{ paddingTop: stacked ? 0 : 8 }}>
            {product.category_name && (
              <div style={{ fontSize: 11, color: C.muted, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1.6px', marginBottom: 14 }}>
                {product.category_name}
              </div>
            )}

            <h1 style={{ fontFamily: SERIF, fontSize: bp.isMobile ? 30 : 40, fontWeight: 300, letterSpacing: '-.8px', color: C.ink, lineHeight: 1.12, margin: '0 0 22px', overflowWrap: 'anywhere' }}>
              {product.name}
            </h1>

            {product.description && (
              <p style={{ fontSize: 16.5, color: C.muted, lineHeight: 1.7, margin: '0 0 26px', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden', whiteSpace: 'pre-line' }}>
                {product.description}
              </p>
            )}

            {optionKeys.length > 0 && (
              <div style={{ margin: '0 0 26px', display: 'grid', gap: 10 }}>
                {optionKeys.map(key => (
                  <div key={key} style={{ fontSize: 13.5, lineHeight: 1.6 }}>
                    <span style={{ fontSize: 11, fontWeight: 500, color: C.muted, textTransform: 'uppercase', letterSpacing: '1.4px', marginRight: 10 }}>{key}</span>
                    {optionGroups[key].join(' · ')}
                  </div>
                ))}
              </div>
            )}

            {canQuote && (
              <button type="button" className="gx-quote-btn" onClick={handleRequestQuote} style={{
                width: '100%', maxWidth: 420, height: 52, padding: '0 22px', borderRadius: 3, border: 'none', cursor: 'pointer',
                background: '#5B4632', color: '#FDF9F1', fontFamily: SANS, fontSize: 15, fontWeight: 600, letterSpacing: '.2px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12, transition: 'background .15s, color .15s',
              }}>
                {userRole ? 'Request quote' : 'Sign in to request a quote'}
              </button>
            )}

            {/* Description / Details sit under the quote button, beside the photo (client Canva p46). */}
            <div style={{ marginTop: 30, maxWidth: 560 }}>
              <Accordion title="Description" defaultOpen>
                {product.description ? <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{product.description}</p>
                  : <p style={{ margin: 0, color: C.muted }}>Ask us for full details in your quote request.</p>}
              </Accordion>

              <Accordion title="Details">
                <div style={{ display: 'grid', gridTemplateColumns: bp.isMobile ? '1fr' : '1fr 1fr', rowGap: 8, columnGap: 24 }}>
                  <DetailRow label="Country of origin" value={countryName(product.country_of_origin)} />
                  {product.hs_code && <DetailRow label="HS code" value={product.hs_code} />}
                  {(product.specifications || []).map(s => (
                    <DetailRow key={s.id} label={s.attr_name} value={`${s.value_text ?? s.value_numeric ?? '—'}${s.unit ? ` ${s.unit}` : ''}`} />
                  ))}
                </div>
                {product.tags?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 16 }}>
                    {product.tags.map(t => (
                      <span key={t.id} style={{ fontSize: 11.5, fontWeight: 500, color: C.ink, background: '#F0DCC0', padding: '4px 10px', borderRadius: 999 }}>
                        {t.name}
                      </span>
                    ))}
                  </div>
                )}
              </Accordion>
            </div>


          </div>
        </div>


        {/* ── More similar products ─────────────────────────────────────────── */}
        {similar.length > 0 && (
          <section style={{ marginTop: bp.isMobile ? 44 : 64, paddingTop: bp.isMobile ? 30 : 40, borderTop: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: bp.isMobile ? 20 : 28, flexWrap: 'wrap', gap: 14 }}>
              <h2 style={{ fontFamily: SERIF, fontSize: bp.isMobile ? 30 : 40, fontWeight: 300, letterSpacing: '-.8px', color: C.ink, margin: 0, lineHeight: 1.1 }}>
                More similar products
              </h2>
              <button type="button" className="gx-secondary-btn" onClick={() => navigate('/products')} style={{
                height: 44, padding: '0 20px', borderRadius: 3, border: '1px solid rgba(91,70,50,.4)', background: 'transparent',
                color: C.ink, fontFamily: SANS, fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'background .15s',
              }}>
                View all products
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${bp.isMobile ? 2 : 4}, minmax(0, 1fr))`, columnGap: bp.isMobile ? 12 : 22, rowGap: 24 }}>
              {similar.map(p => (
                <MiniProductCard key={p.id} p={p} onClick={() => window.scrollTo(0, 0)} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '7px 0', borderBottom: `1px solid ${C.border}` }}>
      <span style={{ color: C.muted }}>{label}</span>
      <span style={{ color: C.ink, fontWeight: 500, textAlign: 'right', overflowWrap: 'anywhere' }}>{value}</span>
    </div>
  );
}

// Full-screen photo viewer (client Canva p34). Escape / backdrop click closes; arrows step through photos.
function PhotoViewer({ images, index, onIndex, onClose, title }) {
  const count = images.length;
  const img = images[index] || images[0];
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight' && count > 1) onIndex((index + 1) % count);
      else if (e.key === 'ArrowLeft' && count > 1) onIndex((index - 1 + count) % count);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prevOverflow; };
  }, [index, count, onClose, onIndex]);
  if (!img?.image_url) return null;
  const navBtn = { position: 'absolute', top: '50%', transform: 'translateY(-50%)', width: 46, height: 46, borderRadius: 3, border: '1px solid rgba(253,249,241,.5)', background: 'rgba(43,32,22,.45)', color: '#FDF9F1', fontSize: 22, lineHeight: 1, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };
  return (
    <div role="dialog" aria-modal="true" aria-label={`${title} — photo ${index + 1} of ${count}`} onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(43,32,22,.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '56px 4%' }}>
      <img src={img.image_url} alt={img.alt_text || title} onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 6, boxShadow: '0 20px 60px rgba(0,0,0,.35)', cursor: 'default' }} />
      <button type="button" onClick={onClose} aria-label="Close photo" autoFocus
        style={{ ...navBtn, top: 16, right: 16, transform: 'none', width: 42, height: 42 }}>×</button>
      {count > 1 && (
        <>
          <button type="button" aria-label="Previous photo" onClick={(e) => { e.stopPropagation(); onIndex((index - 1 + count) % count); }} style={{ ...navBtn, left: 16 }}>‹</button>
          <button type="button" aria-label="Next photo" onClick={(e) => { e.stopPropagation(); onIndex((index + 1) % count); }} style={{ ...navBtn, right: 16 }}>›</button>
          <span style={{ position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)', color: '#F0DCC0', fontSize: 13 }}>{index + 1} / {count}</span>
        </>
      )}
    </div>
  );
}
