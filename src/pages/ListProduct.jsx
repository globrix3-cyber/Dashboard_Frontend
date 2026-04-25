// pages/ListProduct.jsx
// Multi-step product listing form — mirrors Alibaba-style detail pages
// Steps: 1. Basic Info → 2. Pricing & MOQ → 3. Specifications → 4. Images & Tags → 5. Review

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import {
  ChevronRight, ChevronLeft, Check, Package, DollarSign,
  Tag, Image, Eye, Plus, Trash2, Loader2, AlertCircle,
} from 'lucide-react';

/* ─── Tiny shared primitives ─────────────────────────────────────────────── */
const Label = ({ children, required }) => (
  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>
    {children}{required && <span style={{ color: '#EF4444', marginLeft: 3 }}>*</span>}
  </label>
);

const Input = ({ style, ...props }) => (
  <input
    style={{
      width: '100%', padding: '10px 14px', borderRadius: 10,
      border: '1.5px solid var(--border-soft)', background: 'var(--warm-white)',
      fontSize: 14, color: 'var(--ink)', fontFamily: "'DM Sans', sans-serif",
      outline: 'none', transition: 'border-color .15s',
      boxSizing: 'border-box',
      ...style,
    }}
    onFocus={e => { e.currentTarget.style.borderColor = 'var(--emerald)'; }}
    onBlur={e  => { e.currentTarget.style.borderColor = 'var(--border-soft)'; }}
    {...props}
  />
);

const Select = ({ children, style, ...props }) => (
  <select
    style={{
      width: '100%', padding: '10px 14px', borderRadius: 10,
      border: '1.5px solid var(--border-soft)', background: 'var(--warm-white)',
      fontSize: 14, color: 'var(--ink)', fontFamily: "'DM Sans', sans-serif",
      outline: 'none', cursor: 'pointer', appearance: 'auto',
      boxSizing: 'border-box',
      ...style,
    }}
    {...props}
  >
    {children}
  </select>
);

const Textarea = ({ style, ...props }) => (
  <textarea
    style={{
      width: '100%', padding: '10px 14px', borderRadius: 10,
      border: '1.5px solid var(--border-soft)', background: 'var(--warm-white)',
      fontSize: 14, color: 'var(--ink)', fontFamily: "'DM Sans', sans-serif",
      outline: 'none', resize: 'vertical', minHeight: 90,
      boxSizing: 'border-box',
      ...style,
    }}
    onFocus={e => { e.currentTarget.style.borderColor = 'var(--emerald)'; }}
    onBlur={e  => { e.currentTarget.style.borderColor = 'var(--border-soft)'; }}
    {...props}
  />
);

const FieldRow = ({ children, cols = 2 }) => (
  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 16 }}>
    {children}
  </div>
);

const Field = ({ label, required, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <Label required={required}>{label}</Label>
    {children}
  </div>
);

/* ─── Step indicator ─────────────────────────────────────────────────────── */
const STEPS = [
  { label: 'Basic Info',   icon: Package    },
  { label: 'Pricing',      icon: DollarSign },
  { label: 'Specs',        icon: Tag        },
  { label: 'Media & Tags', icon: Image      },
  { label: 'Review',       icon: Eye        },
];

function StepBar({ current }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32 }}>
      {STEPS.map((s, i) => {
        const done    = i < current;
        const active  = i === current;
        const Icon    = s.icon;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `2px solid ${done ? 'var(--emerald)' : active ? 'var(--emerald)' : 'var(--border-soft)'}`,
                background: done ? 'var(--emerald)' : active ? 'var(--emerald-lt)' : '#fff',
                transition: 'all .2s',
              }}>
                {done
                  ? <Check size={15} color="#fff" />
                  : <Icon size={14} color={active ? 'var(--emerald)' : 'var(--muted)'} />
                }
              </div>
              <span style={{ fontSize: 10, fontWeight: 600, color: active ? 'var(--emerald)' : done ? 'var(--ink-soft)' : 'var(--muted)', whiteSpace: 'nowrap' }}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ flex: 1, height: 2, margin: '0 8px', marginBottom: 20, background: done ? 'var(--emerald)' : 'var(--border-soft)', borderRadius: 1, transition: 'background .2s' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Category tree builder ──────────────────────────────────────────────── */
function buildTree(cats) {
  const map  = {};
  const tree = [];
  cats.forEach(c => { map[c.id] = { ...c, children: [] }; });
  cats.forEach(c => {
    if (c.parent_id && map[c.parent_id]) map[c.parent_id].children.push(map[c.id]);
    else tree.push(map[c.id]);
  });
  return tree;
}

function flatOptions(tree, depth = 0) {
  const result = [];
  tree.forEach(node => {
    result.push({ id: node.id, name: node.name, depth });
    if (node.children.length) result.push(...flatOptions(node.children, depth + 1));
  });
  return result;
}

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function ListProduct() {
  const navigate = useNavigate();
  const [step,        setStep]        = useState(0);
  const [submitting,  setSubmitting]  = useState(false);
  const [categories,  setCategories]  = useState([]);
  const [catAttrs,    setCatAttrs]    = useState([]);   // attributes for chosen category
  const [allTags,     setAllTags]     = useState([]);
  const [loadingAttrs, setLoadingAttrs] = useState(false);

  // ── Form state ────────────────────────────────────────────────────────────
  const [basic, setBasic] = useState({
    name:               '',
    category_id:        '',
    description:        '',
    hs_code:            '',
    country_of_origin:  'IN',
    lead_time_days:     '',
    status:             'draft',
  });

  // Pricing tiers: base price + per-quantity variants
  const [pricing, setPricing] = useState({
    base_price:         '',
    moq_unit:           'pieces',
    min_order_quantity: '1',
  });

  // Price tiers stored as product_variants with attributes: { min_qty, max_qty, price }
  const [priceTiers, setPriceTiers] = useState([
    { min_qty: '1', max_qty: '99', price: '' },
  ]);

  // Spec values keyed by category_attribute_id
  const [specValues, setSpecValues] = useState({});

  // Images: array of { image_url, alt_text }
  const [images, setImages]     = useState([{ image_url: '', alt_text: '' }]);
  const [tagIds, setTagIds]     = useState([]);
  const [newTag, setNewTag]     = useState('');

  /* ── Load categories + tags on mount ──────────────────────────────────── */
  useEffect(() => {
    api.get('/api/products/categories')
      .then(data => setCategories(data))
      .catch(() => toast.error('Failed to load categories'));

    api.get('/api/products/tags')
      .then(data => setAllTags(data))
      .catch(() => {});
  }, []);

  /* ── Load category attributes when category changes ────────────────────── */
  useEffect(() => {
    if (!basic.category_id) { setCatAttrs([]); return; }
    setLoadingAttrs(true);
    api.get(`/api/products/categories/${basic.category_id}/attributes`)
      .then(data => { setCatAttrs(data); setSpecValues({}); })
      .catch(() => toast.error('Failed to load category attributes'))
      .finally(() => setLoadingAttrs(false));
  }, [basic.category_id]);

  /* ── Helpers ─────────────────────────────────────────────────────────────── */
  const setB = (k, v) => setBasic(b   => ({ ...b, [k]: v }));
  const setP = (k, v) => setPricing(p => ({ ...p, [k]: v }));

  const updateTier = (i, k, v) => setPriceTiers(tiers =>
    tiers.map((t, idx) => idx === i ? { ...t, [k]: v } : t)
  );
  const addTier    = () => setPriceTiers(t => [...t, { min_qty: '', max_qty: '', price: '' }]);
  const removeTier = (i) => setPriceTiers(t => t.filter((_, idx) => idx !== i));

  const updateImage = (i, k, v) => setImages(imgs =>
    imgs.map((img, idx) => idx === i ? { ...img, [k]: v } : img)
  );
  const addImage    = () => setImages(i => [...i, { image_url: '', alt_text: '' }]);
  const removeImage = (i) => setImages(imgs => imgs.filter((_, idx) => idx !== i));

  const toggleTag = (id) => setTagIds(ids =>
    ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id]
  );

  const handleCreateTag = async () => {
    if (!newTag.trim()) return;
    try {
      const tag = await api.post('/api/products/tags', { name: newTag.trim() });
      setAllTags(t => [...t, tag]);
      setTagIds(ids => [...ids, tag.id]);
      setNewTag('');
    } catch (err) {
      toast.error(err.message || 'Failed to create tag');
    }
  };

  /* ── Validation per step ─────────────────────────────────────────────────── */
  const validateStep = useCallback(() => {
    if (step === 0) {
      if (!basic.name.trim())    { toast.error('Product name is required');  return false; }
      if (!basic.category_id)    { toast.error('Please select a category');   return false; }
      if (!basic.description.trim()) { toast.error('Description is required'); return false; }
    }
    if (step === 1) {
      if (!pricing.base_price)         { toast.error('Base price is required');           return false; }
      if (!pricing.min_order_quantity) { toast.error('Min order quantity is required');   return false; }
      for (const [i, t] of priceTiers.entries()) {
        if (!t.price) { toast.error(`Price in tier ${i + 1} is required`); return false; }
      }
    }
    if (step === 3) {
      if (!images.some(img => img.image_url.trim())) {
        toast.error('At least one product image URL is required');
        return false;
      }
    }
    return true;
  }, [step, basic, pricing, priceTiers, images]);

  const next = () => { if (validateStep()) setStep(s => s + 1); };
  const prev = () => setStep(s => s - 1);

  /* ── Final submit ────────────────────────────────────────────────────────── */
  const handleSubmit = async (publish = false) => {
    setSubmitting(true);
    try {
      // Build variants from price tiers
      const variants = priceTiers
        .filter(t => t.price)
        .map(t => ({
          variant_name:   `${t.min_qty}–${t.max_qty || '+'} ${pricing.moq_unit}`,
          price_modifier: 0,
          attributes: {
            min_qty:  Number(t.min_qty),
            max_qty:  t.max_qty ? Number(t.max_qty) : null,
            price:    Number(t.price),
          },
        }));

      // Build specs
      const specs = Object.entries(specValues)
        .filter(([, v]) => v !== '' && v !== undefined)
        .map(([attrId, val]) => {
          const attr = catAttrs.find(a => a.id === attrId);
          const isNum = attr?.data_type === 'number' || attr?.data_type === 'numeric';
          return {
            category_attribute_id: attrId,
            value_text:    isNum ? null : String(val),
            value_numeric: isNum ? Number(val) : null,
          };
        });

      const payload = {
        ...basic,
        ...pricing,
        status:             publish ? 'active' : basic.status,
        base_price:         Number(pricing.base_price),
        min_order_quantity: Number(pricing.min_order_quantity),
        lead_time_days:     basic.lead_time_days ? Number(basic.lead_time_days) : null,
        images:  images.filter(i => i.image_url.trim()),
        variants,
        specs,
        tag_ids: tagIds,
      };

      await api.post('/api/products', payload);
      toast.success(publish ? 'Product published! 🎉' : 'Product saved as draft');
      navigate('/supplier-dashboard/catalog');
    } catch (err) {
      toast.error(err.message || 'Failed to create product');
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Category flat options ───────────────────────────────────────────────── */
  const catOptions = flatOptions(buildTree(categories));

  /* ─── Render ─────────────────────────────────────────────────────────────── */
  return (
    <div style={{ maxWidth: 780, margin: '0 auto', fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, fontWeight: 900, color: 'var(--ink)', margin: 0, letterSpacing: -.5 }}>
          List a Product
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 5 }}>
          Fill in the details below to add your product to the marketplace.
        </p>
      </div>

      {/* Step indicator */}
      <StepBar current={step} />

      {/* Card */}
      <div style={{
        background: '#fff', borderRadius: 20, padding: '28px 32px',
        border: '1.5px solid var(--border-soft)',
        boxShadow: '0 1px 4px rgba(28,24,21,.04)',
        marginBottom: 20,
      }}>

        {/* ── STEP 0: Basic Info ────────────────────────────────────────── */}
        {step === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: 'var(--ink)' }}>Basic Information</h2>

            <Field label="Product Name" required>
              <Input value={basic.name} onChange={e => setB('name', e.target.value)} placeholder="e.g. Handmade Embroidered Wall Tapestry" />
            </Field>

            <FieldRow>
              <Field label="Category" required>
                <Select value={basic.category_id} onChange={e => setB('category_id', e.target.value)}>
                  <option value="">Select category…</option>
                  {catOptions.map(c => (
                    <option key={c.id} value={c.id}>
                      {'—'.repeat(c.depth)} {c.name}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Country of Origin">
                <Input value={basic.country_of_origin} onChange={e => setB('country_of_origin', e.target.value)} placeholder="IN" maxLength={2} style={{ textTransform: 'uppercase' }} />
              </Field>
            </FieldRow>

            <Field label="Description" required>
              <Textarea value={basic.description} onChange={e => setB('description', e.target.value)} placeholder="Describe the product — material, use-case, unique features…" rows={4} />
            </Field>

            <FieldRow>
              <Field label="HS Code">
                <Input value={basic.hs_code} onChange={e => setB('hs_code', e.target.value)} placeholder="e.g. 5701.10" />
              </Field>
              <Field label="Lead Time (days)">
                <Input type="number" value={basic.lead_time_days} onChange={e => setB('lead_time_days', e.target.value)} placeholder="e.g. 30" min={1} />
              </Field>
            </FieldRow>

            <Field label="Listing Status">
              <Select value={basic.status} onChange={e => setB('status', e.target.value)}>
                <option value="draft">Draft — save and publish later</option>
                <option value="active">Active — publish immediately</option>
              </Select>
            </Field>
          </div>
        )}

        {/* ── STEP 1: Pricing & MOQ ─────────────────────────────────────── */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: 'var(--ink)' }}>Pricing & Order Quantities</h2>

            <FieldRow cols={3}>
              <Field label="Base Price (₹)" required>
                <Input type="number" value={pricing.base_price} onChange={e => setP('base_price', e.target.value)} placeholder="1200" min={0} />
              </Field>
              <Field label="Min Order Qty" required>
                <Input type="number" value={pricing.min_order_quantity} onChange={e => setP('min_order_quantity', e.target.value)} placeholder="10" min={1} />
              </Field>
              <Field label="Unit">
                <Select value={pricing.moq_unit} onChange={e => setP('moq_unit', e.target.value)}>
                  {['pieces','kg','meters','liters','boxes','sets','pairs','dozen','tons'].map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </Select>
              </Field>
            </FieldRow>

            {/* Price tiers */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div>
                  <Label>Price Tiers by Quantity</Label>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--muted)' }}>
                    Set different prices for different quantity ranges (like Alibaba).
                  </p>
                </div>
                <button type="button" onClick={addTier}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5, padding: '6px 14px', borderRadius: 8,
                    border: '1.5px dashed var(--emerald)', background: 'var(--emerald-lt)',
                    color: 'var(--emerald)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  }}>
                  <Plus size={12} /> Add Tier
                </button>
              </div>

              {/* Tier header */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 32px', gap: 10, marginBottom: 6 }}>
                {['Min Qty', 'Max Qty', 'Price per Unit (₹)', ''].map(h => (
                  <span key={h} style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.05em' }}>{h}</span>
                ))}
              </div>

              {priceTiers.map((tier, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 32px', gap: 10, marginBottom: 8, alignItems: 'center' }}>
                  <Input type="number" value={tier.min_qty} onChange={e => updateTier(i, 'min_qty', e.target.value)} placeholder="1" min={1} />
                  <Input type="number" value={tier.max_qty} onChange={e => updateTier(i, 'max_qty', e.target.value)} placeholder="99 (blank = unlimited)" />
                  <Input type="number" value={tier.price}   onChange={e => updateTier(i, 'price', e.target.value)}   placeholder="1426" min={0} />
                  <button type="button" onClick={() => removeTier(i)} disabled={priceTiers.length === 1}
                    style={{
                      width: 32, height: 32, borderRadius: 8, border: 'none', cursor: priceTiers.length === 1 ? 'not-allowed' : 'pointer',
                      background: priceTiers.length === 1 ? '#f3f4f6' : '#FEE2E2',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                    <Trash2 size={13} color={priceTiers.length === 1 ? '#d1d5db' : '#EF4444'} />
                  </button>
                </div>
              ))}

              {/* Preview */}
              {priceTiers.some(t => t.price) && (
                <div style={{ marginTop: 12, padding: '12px 16px', borderRadius: 10, background: 'var(--emerald-lt)', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--emerald)' }}>Preview: </span>
                  <span style={{ fontSize: 12, color: 'var(--ink)' }}>
                    ₹{priceTiers.filter(t => t.price).map(t =>
                      `${t.price}/${t.min_qty}${t.max_qty ? `–${t.max_qty}` : '+'} ${pricing.moq_unit}`
                    ).join(' · ')}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 2: Specifications ───────────────────────────────────── */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: 'var(--ink)' }}>Key Attributes</h2>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--muted)' }}>
                These are the attributes buyers filter by in the <strong>{catOptions.find(c => c.id === basic.category_id)?.name}</strong> category.
              </p>
            </div>

            {loadingAttrs ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--muted)', padding: '20px 0' }}>
                <Loader2 size={16} style={{ animation: 'spin .7s linear infinite' }} /> Loading attributes…
              </div>
            ) : catAttrs.length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '20px 0', color: 'var(--muted)', fontSize: 14 }}>
                <AlertCircle size={16} /> No specific attributes for this category. Continue to next step.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                {catAttrs.map(attr => (
                  <Field key={attr.id} label={`${attr.name}${attr.unit ? ` (${attr.unit})` : ''}`} required={attr.is_required}>
                    {attr.options && Array.isArray(attr.options) && attr.options.length > 0 ? (
                      <Select
                        value={specValues[attr.id] ?? ''}
                        onChange={e => setSpecValues(sv => ({ ...sv, [attr.id]: e.target.value }))}
                      >
                        <option value="">Select…</option>
                        {attr.options.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </Select>
                    ) : (
                      <Input
                        type={['number', 'numeric'].includes(attr.data_type) ? 'number' : 'text'}
                        value={specValues[attr.id] ?? ''}
                        onChange={e => setSpecValues(sv => ({ ...sv, [attr.id]: e.target.value }))}
                        placeholder={attr.unit ? `e.g. 100 ${attr.unit}` : `Enter ${attr.name}`}
                      />
                    )}
                  </Field>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── STEP 3: Images & Tags ─────────────────────────────────────── */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: 'var(--ink)' }}>Product Images</h2>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--muted)' }}>
                Add image URLs. First image is the main thumbnail.
              </p>
            </div>

            {images.map((img, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 32px', gap: 10, alignItems: 'flex-end' }}>
                <Field label={i === 0 ? 'Image URL (Main)' : `Image URL ${i + 1}`} required={i === 0}>
                  <Input value={img.image_url} onChange={e => updateImage(i, 'image_url', e.target.value)} placeholder="https://…" type="url" />
                </Field>
                <Field label="Alt Text">
                  <Input value={img.alt_text} onChange={e => updateImage(i, 'alt_text', e.target.value)} placeholder="Describe the image…" />
                </Field>
                <button type="button" onClick={() => removeImage(i)} disabled={images.length === 1}
                  style={{
                    width: 32, height: 38, borderRadius: 8, border: 'none', marginBottom: 0,
                    cursor: images.length === 1 ? 'not-allowed' : 'pointer',
                    background: images.length === 1 ? '#f3f4f6' : '#FEE2E2',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                  <Trash2 size={13} color={images.length === 1 ? '#d1d5db' : '#EF4444'} />
                </button>
              </div>
            ))}

            <button type="button" onClick={addImage}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
                borderRadius: 10, border: '1.5px dashed var(--border)', background: '#fafafa',
                color: 'var(--muted)', fontSize: 13, fontWeight: 600, cursor: 'pointer', width: 'fit-content',
              }}>
              <Plus size={13} /> Add Another Image
            </button>

            {/* Tags */}
            <div style={{ borderTop: '1px solid var(--border-soft)', paddingTop: 20 }}>
              <h2 style={{ margin: '0 0 4px', fontSize: 17, fontWeight: 700, color: 'var(--ink)' }}>Tags</h2>
              <p style={{ margin: '0 0 14px', fontSize: 13, color: 'var(--muted)' }}>
                Tags help buyers discover your product in search.
              </p>

              {/* Existing tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
                {allTags.map(tag => {
                  const selected = tagIds.includes(tag.id);
                  return (
                    <button key={tag.id} type="button" onClick={() => toggleTag(tag.id)}
                      style={{
                        padding: '5px 12px', borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                        border: `1.5px solid ${selected ? 'var(--emerald)' : 'var(--border-soft)'}`,
                        background: selected ? 'var(--emerald-lt)' : '#fff',
                        color: selected ? 'var(--emerald)' : 'var(--muted)',
                        transition: 'all .15s',
                      }}>
                      {selected && <Check size={10} style={{ marginRight: 4 }} />}
                      {tag.name}
                    </button>
                  );
                })}
              </div>

              {/* New tag */}
              <div style={{ display: 'flex', gap: 8 }}>
                <Input
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleCreateTag(); } }}
                  placeholder="Create new tag…"
                  style={{ maxWidth: 260 }}
                />
                <button type="button" onClick={handleCreateTag}
                  style={{
                    padding: '10px 18px', borderRadius: 10, border: 'none', cursor: 'pointer',
                    background: 'var(--emerald)', color: '#fff', fontWeight: 600, fontSize: 13,
                  }}>
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 4: Review ────────────────────────────────────────────── */}
        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: 'var(--ink)' }}>Review Your Listing</h2>

            {/* Basic */}
            <ReviewSection title="Basic Info">
              <ReviewRow label="Name"        value={basic.name} />
              <ReviewRow label="Category"    value={catOptions.find(c => c.id === basic.category_id)?.name || '—'} />
              <ReviewRow label="Description" value={basic.description} />
              <ReviewRow label="Origin"      value={basic.country_of_origin} />
              <ReviewRow label="HS Code"     value={basic.hs_code || '—'} />
              <ReviewRow label="Lead Time"   value={basic.lead_time_days ? `${basic.lead_time_days} days` : '—'} />
              <ReviewRow label="Status"      value={basic.status} />
            </ReviewSection>

            {/* Pricing */}
            <ReviewSection title="Pricing">
              <ReviewRow label="Base Price" value={`₹${pricing.base_price}`} />
              <ReviewRow label="Min Order"  value={`${pricing.min_order_quantity} ${pricing.moq_unit}`} />
              <div style={{ marginTop: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Price Tiers</span>
                <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {priceTiers.filter(t => t.price).map((t, i) => (
                    <div key={i} style={{ fontSize: 13, color: 'var(--ink)' }}>
                      {t.min_qty}{t.max_qty ? `–${t.max_qty}` : '+'} {pricing.moq_unit} → <strong>₹{t.price}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </ReviewSection>

            {/* Specs */}
            {Object.keys(specValues).length > 0 && (
              <ReviewSection title="Specifications">
                {catAttrs.filter(a => specValues[a.id]).map(a => (
                  <ReviewRow key={a.id} label={a.name} value={`${specValues[a.id]}${a.unit ? ' ' + a.unit : ''}`} />
                ))}
              </ReviewSection>
            )}

            {/* Images */}
            <ReviewSection title="Images">
              {images.filter(i => i.image_url).map((img, i) => (
                <ReviewRow key={i} label={i === 0 ? 'Main' : `Image ${i + 1}`} value={img.image_url} truncate />
              ))}
            </ReviewSection>

            {/* Tags */}
            {tagIds.length > 0 && (
              <ReviewSection title="Tags">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {allTags.filter(t => tagIds.includes(t.id)).map(t => (
                    <span key={t.id} style={{ padding: '3px 10px', borderRadius: 100, background: 'var(--emerald-lt)', color: 'var(--emerald)', fontSize: 12, fontWeight: 600 }}>
                      {t.name}
                    </span>
                  ))}
                </div>
              </ReviewSection>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button type="button" onClick={step === 0 ? () => navigate(-1) : prev}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 10,
            border: '1.5px solid var(--border-soft)', background: '#fff', cursor: 'pointer',
            fontSize: 14, fontWeight: 600, color: 'var(--ink)',
          }}>
          <ChevronLeft size={15} /> {step === 0 ? 'Cancel' : 'Back'}
        </button>

        <div style={{ display: 'flex', gap: 10 }}>
          {step === STEPS.length - 1 ? (
            <>
              <button type="button" onClick={() => handleSubmit(false)} disabled={submitting}
                style={{
                  padding: '10px 22px', borderRadius: 10,
                  border: '1.5px solid var(--border-soft)', background: '#fff',
                  fontSize: 14, fontWeight: 600, color: 'var(--ink)', cursor: submitting ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.6 : 1,
                }}>
                Save as Draft
              </button>
              <button type="button" onClick={() => handleSubmit(true)} disabled={submitting}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7, padding: '10px 22px', borderRadius: 10,
                  border: 'none', background: 'var(--emerald)', color: '#fff',
                  fontSize: 14, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.7 : 1,
                  boxShadow: '0 4px 14px rgba(16,185,129,0.3)',
                }}>
                {submitting
                  ? <Loader2 size={15} style={{ animation: 'spin .7s linear infinite' }} />
                  : <Check size={15} />
                }
                {submitting ? 'Publishing…' : 'Publish Listing'}
              </button>
            </>
          ) : (
            <button type="button" onClick={next}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '10px 22px', borderRadius: 10,
                border: 'none', background: 'var(--emerald)', color: '#fff',
                fontSize: 14, fontWeight: 700, cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(16,185,129,0.3)',
              }}>
              Continue <ChevronRight size={15} />
            </button>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ─── Review sub-components ──────────────────────────────────────────────── */
function ReviewSection({ title, children }) {
  return (
    <div style={{ borderRadius: 12, border: '1px solid var(--border-soft)', overflow: 'hidden' }}>
      <div style={{ padding: '10px 16px', background: 'var(--warm-white)', borderBottom: '1px solid var(--border-soft)' }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{title}</span>
      </div>
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {children}
      </div>
    </div>
  );
}

function ReviewRow({ label, value, truncate }) {
  return (
    <div style={{ display: 'flex', gap: 12, fontSize: 13 }}>
      <span style={{ minWidth: 110, color: 'var(--muted)', fontWeight: 600, flexShrink: 0 }}>{label}</span>
      <span style={{
        color: 'var(--ink)', flex: 1,
        ...(truncate ? { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } : {}),
      }}>
        {value || '—'}
      </span>
    </div>
  );
}