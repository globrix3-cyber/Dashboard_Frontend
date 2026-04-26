import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';
import { useFetchData } from '../hooks/useFetchData';
import { Spinner, Badge, EmptyState } from '../components/UI';
import { toast } from 'react-toastify';
import {
  FileSearch, Send, Package, ArrowLeft, ArrowRight,
  ChevronRight, Plus, CheckCircle2, Clock, MapPin,
  DollarSign, Calendar, Tag,
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/helpers';

/* ── Shared tokens ─────────────────────────────────────────────────────────── */
const C = {
  emerald:    '#1A7A4A', emeraldLt: '#EAF5EF',
  saffron:    '#D9600A', saffronLt: '#FDF1E8',
  navy:       '#1B3175', navyLt:    '#EEF2FB',
  gold:       '#B8730A', goldLt:    '#FDF5E2',
  ink:        '#1C1815', inkSoft:   '#3D3731',
  muted:      '#7A7068', border:    '#D4C9B8',
  borderSoft: '#E6DED0', cream:     '#F4EFE4',
};

function PageHeader({ title, subtitle, color = C.emerald, onBack, action }) {
  return (
    <div style={{ marginBottom: 24 }}>
      {onBack && (
        <button onClick={onBack} style={{
          display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14,
          fontSize: 13, fontWeight: 600, color: C.muted,
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        }}>
          <ArrowLeft size={14} /> Back
        </button>
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 900, color: C.ink, margin: 0, letterSpacing: -0.5 }}>{title}</h1>
          {subtitle && <p style={{ fontSize: 14, color: C.muted, marginTop: 4 }}>{subtitle}</p>}
        </div>
        {action}
      </div>
      <div style={{ height: 3, marginTop: 12, borderRadius: 2, background: `linear-gradient(90deg, ${color}, transparent)` }} />
    </div>
  );
}

function InfoChip({ icon: Icon, text, color = C.muted }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color }}>
      <Icon size={12} color={color} /> {text}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   SUPPLIER RFQs PAGE — browse all active RFQs
══════════════════════════════════════════════════════════════════════════════ */
export function SupplierRFQsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const { data: rfqs, loading } = useFetchData(() => api.getRFQs());

  const filtered = (rfqs || []).filter(r =>
    !search || r.title?.toLowerCase().includes(search.toLowerCase()) ||
    r.product_name?.toLowerCase().includes(search.toLowerCase()) ||
    r.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <PageHeader
        title="Open RFQs"
        subtitle={`${filtered.length} active buyer requests — respond to win business`}
        color={C.emerald}
        action={
          <div style={{ position: 'relative' }}>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search RFQs…"
              style={{
                padding: '9px 14px', borderRadius: 10, border: `1.5px solid ${C.borderSoft}`,
                background: '#fff', fontSize: 13, color: C.ink, outline: 'none', width: 240,
                fontFamily: "'DM Sans', sans-serif",
              }} />
          </div>
        }
      />

      {loading ? <Spinner /> : !filtered.length ? (
        <EmptyState icon={FileSearch} title="No open RFQs" desc="New buyer requests will appear here" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filtered.map((r) => (
            <div key={r.id}
              onClick={() => navigate(`/supplier-dashboard/rfqs/${r.id}`)}
              style={{
                background: '#fff', borderRadius: 18, padding: '20px 24px',
                border: `1.5px solid ${C.borderSoft}`, cursor: 'pointer',
                transition: 'transform 0.18s, box-shadow 0.18s, border-color 0.18s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 28px rgba(26,122,74,0.12)`; e.currentTarget.style.borderColor = C.emerald; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = C.borderSoft; }}>

              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 16, color: C.ink, margin: 0 }}>{r.title}</h3>
                    <Badge status={r.status} />
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 10 }}>
                    <InfoChip icon={Tag}      text={r.category || 'General'}               color={C.navy}    />
                    <InfoChip icon={Package}  text={`${r.quantity} ${r.quantity_unit || 'units'}`} color={C.ink} />
                    <InfoChip icon={DollarSign} text={r.budget || 'Budget TBD'}             color={C.saffron} />
                    <InfoChip icon={Calendar} text={`Due ${formatDate(r.deadline)}`}        color={C.gold}    />
                    {r.destination_country && <InfoChip icon={MapPin} text={r.destination_country} color={C.muted} />}
                  </div>
                  {r.additional_requirements && (
                    <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {r.additional_requirements}
                    </p>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10, flexShrink: 0 }}>
                  <span style={{
                    fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 100,
                    background: C.emeraldLt, color: C.emerald,
                  }}>
                    {r.responses || 0} quotes
                  </span>
                  <button style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '8px 16px', borderRadius: 100, border: 'none', cursor: 'pointer',
                    background: C.emerald, color: '#fff',
                    fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 12,
                  }}>
                    Quote Now <ChevronRight size={12} />
                  </button>
                </div>
              </div>
              <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${C.borderSoft}`, fontSize: 11, color: C.muted }}>
                Posted {formatDate(r.created_at)} {r.buyer_name ? `· by ${r.buyer_name}` : ''}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   SUPPLIER RFQ DETAIL — view + submit quote
══════════════════════════════════════════════════════════════════════════════ */
export function SupplierRFQDetail() {
  const navigate  = useNavigate();
  const { id }    = useParams();
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [form, setForm] = useState({
    price_per_unit: '', currency: 'INR', total_amount: '', lead_time: '', notes: '',
  });

  const { data: rfq, loading } = useFetchData(() => api.getRFQ(id));
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmitQuote = async (e) => {
    e.preventDefault();
    if (!form.price_per_unit) { toast.error('Price per unit is required'); return; }
    setSubmitting(true);
    try {
      await api.submitQuote(id, {
        price_per_unit: Number(form.price_per_unit),
        currency:       form.currency,
        total_amount:   form.total_amount ? Number(form.total_amount) : null,
        lead_time:      form.lead_time || null,
        notes:          form.notes     || null,
      });
      toast.success('Quote submitted successfully! 🎉');
      setSubmitted(true);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner />;
  if (!rfq)    return <EmptyState icon={FileSearch} title="RFQ not found" desc="This RFQ may have been closed" />;

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", maxWidth: 860, margin: '0 auto' }}>
      <PageHeader
        title={rfq.title}
        subtitle={`Posted ${formatDate(rfq.created_at)}${rfq.buyer_name ? ` · ${rfq.buyer_name}` : ''}`}
        color={C.emerald}
        onBack={() => navigate('/supplier-dashboard/rfqs')}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 20 }}>

        {/* RFQ Details */}
        <div style={{ background: '#fff', borderRadius: 18, border: `1.5px solid ${C.borderSoft}`, overflow: 'hidden' }}>
          <div style={{ borderTop: `3px solid ${C.emerald}` }} />
          <div style={{ padding: '20px 24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              {[
                { label: 'Category',     value: rfq.category || '—'                               },
                { label: 'Quantity',     value: `${rfq.quantity} ${rfq.quantity_unit || 'units'}` },
                { label: 'Budget',       value: rfq.budget || 'Open Budget'                       },
                { label: 'Deadline',     value: formatDate(rfq.deadline)                          },
                { label: 'Destination', value: rfq.destination_country || 'India'                },
                { label: 'Responses',   value: `${rfq.responses || 0} suppliers`                 },
              ].map(({ label, value }) => (
                <div key={label} style={{ background: C.cream, borderRadius: 10, padding: '12px 14px' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>{value}</div>
                </div>
              ))}
            </div>
            {rfq.additional_requirements && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>Requirements</div>
                <p style={{ fontSize: 14, color: C.inkSoft, lineHeight: 1.7, background: C.cream, borderRadius: 10, padding: '12px 14px', margin: 0 }}>
                  {rfq.additional_requirements}
                </p>
              </div>
            )}

            {/* Existing quotes */}
            {rfq.rfq_responses?.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>
                  Current Quotes ({rfq.rfq_responses.length})
                </div>
                {rfq.rfq_responses.map(q => (
                  <div key={q.id} style={{
                    padding: '10px 14px', borderRadius: 10, border: `1px solid ${C.borderSoft}`,
                    marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{q.supplier_name}</div>
                      <div style={{ fontSize: 11, color: C.muted }}>{q.supplier_city}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: C.emerald }}>
                        {q.currency} {Number(q.price_per_unit).toLocaleString('en-IN')}/unit
                      </div>
                      <div style={{ fontSize: 11, color: C.muted }}>{q.lead_time || 'Lead time TBD'}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Quote Form */}
        <div style={{ background: '#fff', borderRadius: 18, border: `1.5px solid ${C.borderSoft}`, overflow: 'hidden' }}>
          <div style={{ borderTop: `3px solid ${C.saffron}` }} />
          <div style={{ padding: '20px 24px' }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 800, color: C.ink, margin: '0 0 16px' }}>
              {submitted ? '✅ Quote Submitted' : 'Submit Your Quote'}
            </h3>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <CheckCircle2 size={48} color={C.emerald} style={{ marginBottom: 12 }} />
                <p style={{ color: C.inkSoft, fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
                  Your quote has been submitted. The buyer will review and respond.
                </p>
                <button onClick={() => navigate('/supplier-dashboard/quotes')} style={{
                  padding: '10px 20px', borderRadius: 100, background: C.emerald, color: '#fff',
                  border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13,
                }}>
                  View My Quotes
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitQuote} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { key: 'price_per_unit', label: 'Price per Unit (₹) *', type: 'number', placeholder: '250' },
                  { key: 'total_amount',   label: 'Total Amount (₹)',     type: 'number', placeholder: '250000' },
                  { key: 'lead_time',      label: 'Lead Time',            type: 'text',   placeholder: '15-20 days' },
                ].map(({ key, label, type, placeholder }) => (
                  <div key={key}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.inkSoft, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.06em' }}>{label}</label>
                    <input type={type} value={form[key]} onChange={e => set(key, e.target.value)}
                      placeholder={placeholder}
                      style={{
                        width: '100%', padding: '10px 12px', borderRadius: 10,
                        border: `1.5px solid ${C.borderSoft}`, background: C.cream,
                        fontSize: 13, color: C.ink, fontFamily: "'DM Sans', sans-serif", outline: 'none',
                        boxSizing: 'border-box',
                      }}
                      onFocus={e => { e.currentTarget.style.borderColor = C.emerald; e.currentTarget.style.background = '#fff'; }}
                      onBlur={e => { e.currentTarget.style.borderColor = C.borderSoft; e.currentTarget.style.background = C.cream; }} />
                  </div>
                ))}
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.inkSoft, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.06em' }}>Notes / Terms</label>
                  <textarea value={form.notes} onChange={e => set('notes', e.target.value)}
                    rows={3} placeholder="Quality certifications, payment terms, packaging details…"
                    style={{
                      width: '100%', padding: '10px 12px', borderRadius: 10,
                      border: `1.5px solid ${C.borderSoft}`, background: C.cream,
                      fontSize: 13, color: C.ink, fontFamily: "'DM Sans', sans-serif",
                      outline: 'none', resize: 'vertical', boxSizing: 'border-box',
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = C.emerald; e.currentTarget.style.background = '#fff'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = C.borderSoft; e.currentTarget.style.background = C.cream; }} />
                </div>
                <button type="submit" disabled={submitting} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '12px 0', borderRadius: 100, border: 'none', cursor: submitting ? 'not-allowed' : 'pointer',
                  background: C.saffron, color: '#fff',
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14,
                  opacity: submitting ? 0.75 : 1, transition: 'background 0.2s',
                }}>
                  {submitting
                    ? <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,.35)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                    : <Send size={15} />}
                  {submitting ? 'Submitting…' : 'Submit Quote'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   SUPPLIER QUOTES PAGE — list of submitted quotes
══════════════════════════════════════════════════════════════════════════════ */
export function SupplierQuotesPage() {
  const navigate = useNavigate();
  const { data: quotes, loading } = useFetchData(() => api.getQuotes());

  const statusColor = (s) => {
    if (s === 'accepted')  return { bg: C.emeraldLt, color: C.emerald };
    if (s === 'rejected')  return { bg: '#FEF2F2',   color: '#DC2626'  };
    return                        { bg: C.goldLt,    color: C.gold     };
  };

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <PageHeader
        title="My Quotes"
        subtitle={`${(quotes || []).length} quotes submitted`}
        color={C.navy}
      />

      {loading ? <Spinner /> : !(quotes || []).length ? (
        <EmptyState icon={Send} title="No quotes yet"
          desc="Browse open RFQs and submit competitive quotes"
          action={
            <button onClick={() => navigate('/supplier-dashboard/rfqs')} style={{
              padding: '9px 20px', borderRadius: 100, background: C.emerald, color: '#fff',
              border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13,
            }}>
              Browse RFQs
            </button>
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {quotes.map((q) => {
            const sc = statusColor(q.status);
            return (
              <div key={q.id} style={{
                background: '#fff', borderRadius: 16, padding: '18px 22px',
                border: `1.5px solid ${C.borderSoft}`,
                display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'center',
              }}>
                <div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 15, color: C.ink, marginBottom: 6 }}>
                    {q.rfqTitle}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                    <InfoChip icon={DollarSign} text={formatCurrency(q.totalAmount)} color={C.emerald} />
                    <InfoChip icon={Clock}      text={q.leadTime}                   color={C.muted}   />
                    <InfoChip icon={Calendar}   text={formatDate(q.createdAt)}      color={C.muted}   />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 100,
                    background: sc.bg, color: sc.color, textTransform: 'capitalize',
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: sc.color }} />
                    {q.status}
                  </span>
                  {q.status === 'pending' && (
                    <button onClick={() => navigate(`/supplier-dashboard/rfqs`)} style={{
                      fontSize: 11, fontWeight: 600, color: C.navy,
                      background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                      display: 'flex', alignItems: 'center', gap: 3,
                    }}>
                      Edit <ArrowRight size={10} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   SUPPLIER ORDERS PAGE — track active orders
══════════════════════════════════════════════════════════════════════════════ */
const STATUS_STEPS = ['confirmed', 'in_production', 'shipped', 'delivered'];

function OrderProgress({ status }) {
  const idx = STATUS_STEPS.indexOf(status);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 10 }}>
      {STATUS_STEPS.map((s, i) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1 }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
            background: i <= idx ? C.emerald : C.borderSoft,
            transition: 'background 0.3s',
          }} />
          {i < STATUS_STEPS.length - 1 && (
            <div style={{ height: 2, flex: 1, background: i < idx ? C.emerald : C.borderSoft, borderRadius: 1 }} />
          )}
        </div>
      ))}
    </div>
  );
}

export function SupplierOrdersPage() {
  const navigate = useNavigate();
  const { data: orders, loading, refetch } = useFetchData(() => api.getOrders());
  const [updatingId, setUpdatingId] = useState(null);

  const NEXT_STATUS = {
    confirmed:     'in_production',
    in_production: 'shipped',
    shipped:       'delivered',
  };

  const handleAdvanceStatus = async (e, orderId, currentStatus) => {
    e.stopPropagation();
    const next = NEXT_STATUS[currentStatus];
    if (!next) return;
    setUpdatingId(orderId);
    try {
      await api.updateOrderStatus(orderId, next);
      toast.success(`Order marked as ${next.replace('_', ' ')}`);
      refetch();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <PageHeader
        title="My Orders"
        subtitle="Track and update order fulfillment status"
        color={C.emerald}
      />

      {loading ? <Spinner /> : !(orders || []).length ? (
        <EmptyState icon={Package} title="No orders yet" desc="Accepted quotes will convert to orders here" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {orders.map((o) => {
            const nextStatus = NEXT_STATUS[o.status];
            return (
              <div key={o.id} style={{
                background: '#fff', borderRadius: 18, padding: '20px 24px',
                border: `1.5px solid ${C.borderSoft}`,
                transition: 'box-shadow 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(26,122,74,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 15, color: C.ink, margin: 0 }}>{o.orderNo}</h3>
                      <Badge status={o.status} />
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 4 }}>
                      <InfoChip icon={Package}    text={o.product || 'Order'}          color={C.ink}     />
                      <InfoChip icon={DollarSign} text={formatCurrency(o.amount)}       color={C.emerald} />
                      {o.buyer && <InfoChip icon={MapPin} text={o.buyer}               color={C.navy}    />}
                      {o.deliveryDate && <InfoChip icon={Calendar} text={`Deliver by ${formatDate(o.deliveryDate)}`} color={C.gold} />}
                    </div>
                    <OrderProgress status={o.status} />
                    <div style={{ display: 'flex', gap: 8, fontSize: 10, color: C.muted, marginTop: 6 }}>
                      {STATUS_STEPS.map((s, i) => (
                        <span key={s} style={{
                          flex: 1, textAlign: 'center', textTransform: 'capitalize',
                          fontWeight: STATUS_STEPS.indexOf(o.status) >= i ? 600 : 400,
                          color: STATUS_STEPS.indexOf(o.status) >= i ? C.emerald : C.muted,
                        }}>
                          {s.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>

                  {nextStatus && o.status !== 'delivered' && (
                    <button
                      onClick={(e) => handleAdvanceStatus(e, o.id, o.status)}
                      disabled={updatingId === o.id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 7,
                        padding: '9px 16px', borderRadius: 100, border: 'none', cursor: 'pointer',
                        background: C.emerald, color: '#fff',
                        fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 12,
                        opacity: updatingId === o.id ? 0.65 : 1,
                        flexShrink: 0,
                      }}>
                      {updatingId === o.id
                        ? <span style={{ width: 12, height: 12, border: '2px solid rgba(255,255,255,.35)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                        : <CheckCircle2 size={12} />}
                      Mark {nextStatus.replace('_', ' ')}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ── Default export — object consumed by routeConfig.jsx ──────────────────── */
const SupplierPages = { SupplierRFQsPage, SupplierRFQDetail, SupplierQuotesPage, SupplierOrdersPage };
export default SupplierPages;
