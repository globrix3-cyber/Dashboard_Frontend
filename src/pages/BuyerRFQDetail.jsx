import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';
import { useFetchData } from '../hooks/useFetchData';
import { Spinner, Badge } from '../components/UI';
import { toast } from 'react-toastify';
import {
  ArrowLeft, FileText, Package, DollarSign, Calendar,
  MapPin, Tag, CheckCircle2, X, ChevronRight,
} from 'lucide-react';
import { formatDate } from '../utils/helpers';

/* ── Design tokens (matching SupplierPages palette) ─────────────────────────── */
const C = {
  saffron:    '#D9600A', saffronLt: '#FDF1E8',
  emerald:    '#1A7A4A', emeraldLt: '#EAF5EF',
  navy:       '#1B3175', navyLt:    '#EEF2FB',
  gold:       '#B8730A', goldLt:    '#FDF5E2',
  ink:        '#1C1815', inkSoft:   '#3D3731',
  muted:      '#7A7068', border:    '#D4C9B8',
  borderSoft: '#E6DED0', cream:     '#F4EFE4',
};

const field = (label, value, colSpan = 1) => ({ label, value, colSpan });

function InfoCard({ children, accent = C.saffron }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 18,
      border: `1.5px solid ${C.borderSoft}`, overflow: 'hidden',
    }}>
      <div style={{ height: 3, background: accent }} />
      <div style={{ padding: '20px 24px' }}>{children}</div>
    </div>
  );
}

function Label({ children }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>
      {children}
    </div>
  );
}

function InputField({ label, type = 'text', value, onChange, placeholder, required, multiline }) {
  const style = {
    width: '100%', padding: '9px 12px', borderRadius: 10,
    border: `1.5px solid ${C.borderSoft}`, background: C.cream,
    fontSize: 13, color: C.ink, fontFamily: "'DM Sans', sans-serif",
    outline: 'none', boxSizing: 'border-box',
    resize: multiline ? 'vertical' : undefined,
  };
  return (
    <div>
      <Label>{label}{required && ' *'}</Label>
      {multiline
        ? <textarea rows={3} value={value} onChange={onChange} placeholder={placeholder} style={style}
            onFocus={e => { e.currentTarget.style.borderColor = C.saffron; e.currentTarget.style.background = '#fff'; }}
            onBlur={e => { e.currentTarget.style.borderColor = C.borderSoft; e.currentTarget.style.background = C.cream; }} />
        : <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={style}
            onFocus={e => { e.currentTarget.style.borderColor = C.saffron; e.currentTarget.style.background = '#fff'; }}
            onBlur={e => { e.currentTarget.style.borderColor = C.borderSoft; e.currentTarget.style.background = C.cream; }} />
      }
    </div>
  );
}

function SelectField({ label, value, onChange, options, required }) {
  return (
    <div>
      <Label>{label}{required && ' *'}</Label>
      <select value={value} onChange={onChange} style={{
        width: '100%', padding: '9px 12px', borderRadius: 10,
        border: `1.5px solid ${C.borderSoft}`, background: C.cream,
        fontSize: 13, color: C.ink, fontFamily: "'DM Sans', sans-serif",
        outline: 'none', boxSizing: 'border-box', cursor: 'pointer',
      }}>
        <option value="">— Select —</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

const INCOTERMS = ['EXW','FCA','FAS','FOB','CFR','CIF','CPT','CIP','DAP','DPU','DDP'];
const PAYMENT_METHODS = ['Bank Transfer (T/T)','Letter of Credit (L/C)','Cash in Advance','Open Account','Documentary Collection'];

/* ══════════════════════════════════════════════════════════════════════════════
   BUYER RFQ DETAIL — view quotes + draft contract
══════════════════════════════════════════════════════════════════════════════ */
export default function BuyerRFQDetail() {
  const navigate  = useNavigate();
  const { id }    = useParams();
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [showForm, setShowForm]           = useState(false);
  const [submitting, setSubmitting]       = useState(false);

  const { data: rfq, loading } = useFetchData(() => api.getRFQ(id));

  const emptyForm = {
    payment_terms: '', payment_method: '', incoterms: '',
    delivery_destination: '', delivery_deadline: '', lead_time_days: '',
    quality_standards: '', inspection_terms: '', warranty_terms: '',
    dispute_resolution: '', governing_law: '', special_terms: '', valid_until: '',
  };
  const [form, setForm] = useState(emptyForm);
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSelectQuote = (quote) => {
    setSelectedQuote(quote);
    setForm(emptyForm);
    setShowForm(true);
    setTimeout(() => document.getElementById('contract-form')?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleCreateContract = async (e) => {
    e.preventDefault();
    if (!selectedQuote) return;
    setSubmitting(true);
    try {
      const body = {
        rfq_id:              id,
        quote_id:            selectedQuote.id,
        supplier_company_id: selectedQuote.supplier_company_id,
        title:               rfq.title,
        product_description: rfq.description || rfq.additional_requirements || null,
        quantity:            rfq.quantity,
        quantity_unit:       rfq.quantity_unit,
        unit_price:          selectedQuote.price_per_unit,
        total_value:         selectedQuote.price_per_unit
                               ? Number(selectedQuote.price_per_unit) * Number(rfq.quantity || 1)
                               : null,
        currency:            selectedQuote.currency || 'USD',
        ...form,
        lead_time_days: form.lead_time_days ? Number(form.lead_time_days) : selectedQuote.delivery_time_days || null,
        delivery_deadline: form.delivery_deadline || rfq.expiry_date || null,
      };

      const contract = await api.createContract(body);
      toast.success('Contract created & sent to supplier for signature!');
      navigate(`/buyer-dashboard/contracts/${contract.id}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
      <Spinner />
    </div>
  );
  if (!rfq) return (
    <div style={{ padding: 40, textAlign: 'center', color: C.muted }}>RFQ not found.</div>
  );

  const quotes = rfq.rfq_responses || [];

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", maxWidth: 900, margin: '0 auto' }}>

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 24 }}>
        <button onClick={() => navigate('/buyer-dashboard/rfqs')} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          marginBottom: 14, fontSize: 13, fontWeight: 600, color: C.muted,
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        }}>
          <ArrowLeft size={14} /> Back to RFQs
        </button>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 900, color: C.ink, margin: 0 }}>
              {rfq.title}
            </h1>
            <p style={{ fontSize: 14, color: C.muted, marginTop: 4 }}>
              Posted {formatDate(rfq.created_at)} · {quotes.length} quote{quotes.length !== 1 ? 's' : ''} received
            </p>
          </div>
          <Badge status={rfq.status} />
        </div>
        <div style={{ height: 3, marginTop: 12, borderRadius: 2, background: `linear-gradient(90deg, ${C.saffron}, transparent)` }} />
      </div>

      {/* ── RFQ details ──────────────────────────────────────────────────── */}
      <InfoCard accent={C.navy}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 15, color: C.ink, margin: '0 0 16px' }}>
          RFQ Details
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: rfq.description ? 16 : 0 }}>
          {[
            { icon: Tag,       label: 'Category',   value: rfq.category || '—'                         },
            { icon: Package,   label: 'Quantity',    value: `${rfq.quantity} ${rfq.quantity_unit || 'units'}` },
            { icon: DollarSign,label: 'Budget',      value: rfq.budget || 'Open'                        },
            { icon: Calendar,  label: 'Deadline',    value: formatDate(rfq.deadline)                    },
            { icon: MapPin,    label: 'Destination', value: rfq.destination_country || '—'              },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} style={{ background: C.cream, borderRadius: 10, padding: '10px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                <Icon size={11} color={C.muted} />
                <span style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '.07em' }}>{label}</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{value}</div>
            </div>
          ))}
        </div>
        {rfq.description && (
          <div style={{ background: C.cream, borderRadius: 10, padding: '12px 14px', fontSize: 13, color: C.inkSoft, lineHeight: 1.7 }}>
            {rfq.description}
          </div>
        )}
      </InfoCard>

      {/* ── Supplier Quotes ───────────────────────────────────────────────── */}
      <div style={{ marginTop: 20 }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 800, color: C.ink, marginBottom: 14 }}>
          Supplier Quotes ({quotes.length})
        </h2>

        {quotes.length === 0 ? (
          <div style={{
            background: '#fff', borderRadius: 18, border: `1.5px solid ${C.borderSoft}`,
            padding: '32px 24px', textAlign: 'center', color: C.muted,
          }}>
            <FileText size={36} color={C.borderSoft} style={{ marginBottom: 10 }} />
            <p style={{ margin: 0, fontSize: 14 }}>No quotes yet. Suppliers will respond here.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {quotes.map((q) => {
              const isSelected = selectedQuote?.id === q.id;
              return (
                <div key={q.id} style={{
                  background: '#fff', borderRadius: 18, padding: '18px 22px',
                  border: `2px solid ${isSelected ? C.saffron : C.borderSoft}`,
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  boxShadow: isSelected ? `0 0 0 3px ${C.saffronLt}` : 'none',
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'center' }}>
                    <div>
                      <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 15, color: C.ink, marginBottom: 8 }}>
                        {q.supplier_name}
                        {q.supplier_city && <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: 12, color: C.muted, marginLeft: 8 }}>· {q.supplier_city}</span>}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
                        <div>
                          <div style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: '.07em' }}>Unit Price</div>
                          <div style={{ fontSize: 16, fontWeight: 800, color: C.emerald }}>
                            {q.currency} {Number(q.price_per_unit).toLocaleString('en-IN')}
                          </div>
                        </div>
                        {rfq.quantity && (
                          <div>
                            <div style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: '.07em' }}>Total Value</div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>
                              {q.currency} {(Number(q.price_per_unit) * Number(rfq.quantity)).toLocaleString('en-IN')}
                            </div>
                          </div>
                        )}
                        {q.delivery_time_days && (
                          <div>
                            <div style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: '.07em' }}>Lead Time</div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{q.delivery_time_days} days</div>
                          </div>
                        )}
                        {q.min_order_quantity && (
                          <div>
                            <div style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: '.07em' }}>Min. Order</div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{q.min_order_quantity} {rfq.quantity_unit || 'units'}</div>
                          </div>
                        )}
                        {q.validity_days && (
                          <div>
                            <div style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: '.07em' }}>Valid For</div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{q.validity_days} days</div>
                          </div>
                        )}
                      </div>
                      {q.notes && (
                        <div style={{ marginTop: 8, fontSize: 12, color: C.inkSoft, background: C.cream, borderRadius: 8, padding: '7px 10px', lineHeight: 1.6 }}>
                          {q.notes}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end', flexShrink: 0 }}>
                      {isSelected ? (
                        <button onClick={() => { setSelectedQuote(null); setShowForm(false); }} style={{
                          display: 'flex', alignItems: 'center', gap: 6,
                          padding: '8px 16px', borderRadius: 100, border: `1.5px solid ${C.saffron}`,
                          background: C.saffronLt, color: C.saffron, cursor: 'pointer',
                          fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 12,
                        }}>
                          <X size={12} /> Deselect
                        </button>
                      ) : (
                        <button onClick={() => handleSelectQuote(q)} style={{
                          display: 'flex', alignItems: 'center', gap: 6,
                          padding: '8px 16px', borderRadius: 100, border: 'none',
                          background: C.saffron, color: '#fff', cursor: 'pointer',
                          fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 12,
                        }}>
                          Select & Contract <ChevronRight size={12} />
                        </button>
                      )}
                      {isSelected && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: C.saffron, fontWeight: 700 }}>
                          <CheckCircle2 size={12} /> Selected
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Contract Form ─────────────────────────────────────────────────── */}
      {showForm && selectedQuote && (
        <div id="contract-form" style={{ marginTop: 28 }}>
          <InfoCard accent={C.saffron}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 800, color: C.ink, margin: '0 0 4px' }}>
              Draft Contract
            </h2>
            <p style={{ fontSize: 13, color: C.muted, marginBottom: 20 }}>
              With <strong style={{ color: C.ink }}>{selectedQuote.supplier_name}</strong> ·
              {' '}{selectedQuote.currency} {Number(selectedQuote.price_per_unit).toLocaleString('en-IN')} / {rfq.quantity_unit || 'unit'}
            </p>

            <form onSubmit={handleCreateContract} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Commercial Terms */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.navy, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12, paddingBottom: 6, borderBottom: `1px solid ${C.borderSoft}` }}>
                  Commercial Terms
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <SelectField
                    label="Incoterms"
                    value={form.incoterms}
                    onChange={set('incoterms')}
                    options={INCOTERMS.map(t => ({ value: t, label: t }))}
                  />
                  <SelectField
                    label="Payment Method"
                    value={form.payment_method}
                    onChange={set('payment_method')}
                    options={PAYMENT_METHODS.map(m => ({ value: m, label: m }))}
                  />
                  <div style={{ gridColumn: '1 / -1' }}>
                    <InputField
                      label="Payment Terms"
                      value={form.payment_terms}
                      onChange={set('payment_terms')}
                      placeholder="e.g. 30% advance, 70% before shipment"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.navy, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12, paddingBottom: 6, borderBottom: `1px solid ${C.borderSoft}` }}>
                  Delivery
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <InputField
                    label="Delivery Destination"
                    value={form.delivery_destination}
                    onChange={set('delivery_destination')}
                    placeholder="Port / city / address"
                  />
                  <InputField
                    label="Delivery Deadline"
                    type="date"
                    value={form.delivery_deadline}
                    onChange={set('delivery_deadline')}
                  />
                  <InputField
                    label="Lead Time (days)"
                    type="number"
                    value={form.lead_time_days}
                    onChange={set('lead_time_days')}
                    placeholder={selectedQuote.delivery_time_days || '30'}
                  />
                </div>
              </div>

              {/* Quality & Legal */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.navy, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12, paddingBottom: 6, borderBottom: `1px solid ${C.borderSoft}` }}>
                  Quality & Legal
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <InputField
                    label="Quality Standards"
                    value={form.quality_standards}
                    onChange={set('quality_standards')}
                    placeholder="e.g. ISO 9001, BIS certified, FSSAI compliant"
                    multiline
                  />
                  <InputField
                    label="Inspection Terms"
                    value={form.inspection_terms}
                    onChange={set('inspection_terms')}
                    placeholder="e.g. Pre-shipment inspection by SGS at seller's cost"
                    multiline
                  />
                  <InputField
                    label="Warranty / Guarantee Terms"
                    value={form.warranty_terms}
                    onChange={set('warranty_terms')}
                    placeholder="e.g. 12 months warranty against manufacturing defects"
                    multiline
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <InputField
                      label="Dispute Resolution"
                      value={form.dispute_resolution}
                      onChange={set('dispute_resolution')}
                      placeholder="e.g. ICC Arbitration, Singapore"
                    />
                    <InputField
                      label="Governing Law"
                      value={form.governing_law}
                      onChange={set('governing_law')}
                      placeholder="e.g. Laws of India"
                    />
                  </div>
                  <InputField
                    label="Special Terms / Remarks"
                    value={form.special_terms}
                    onChange={set('special_terms')}
                    placeholder="Any additional terms, packing instructions, labeling requirements…"
                    multiline
                  />
                  <InputField
                    label="Contract Valid Until"
                    type="date"
                    value={form.valid_until}
                    onChange={set('valid_until')}
                  />
                </div>
              </div>

              {/* Submit */}
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 8, borderTop: `1px solid ${C.borderSoft}` }}>
                <button type="button" onClick={() => { setShowForm(false); setSelectedQuote(null); }} style={{
                  padding: '11px 24px', borderRadius: 100, border: `1.5px solid ${C.borderSoft}`,
                  background: '#fff', color: C.muted, cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13,
                }}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '11px 28px', borderRadius: 100, border: 'none',
                  background: C.saffron, color: '#fff', cursor: submitting ? 'not-allowed' : 'pointer',
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13,
                  opacity: submitting ? 0.75 : 1,
                }}>
                  {submitting
                    ? <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,.35)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                    : <FileText size={14} />}
                  {submitting ? 'Creating…' : 'Create & Send Contract'}
                </button>
              </div>
            </form>
          </InfoCard>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
