import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { api } from '../services/api';
import { useFetchData } from '../hooks/useFetchData';
import { Spinner } from '../components/UI';
import { toast } from 'react-toastify';
import {
  ArrowLeft, FileText, CheckCircle2, XCircle,
  ShoppingCart, Download, AlertTriangle, Clock,
  Package, DollarSign, Calendar, MapPin, Shield,
  Gavel, FileSignature,
} from 'lucide-react';
import { formatDate } from '../utils/helpers';

const C = {
  saffron:    '#D9600A', saffronLt: '#FDF1E8',
  emerald:    '#1A7A4A', emeraldLt: '#EAF5EF',
  navy:       '#1B3175', navyLt:    '#EEF2FB',
  gold:       '#B8730A', goldLt:    '#FDF5E2',
  ink:        '#1C1815', inkSoft:   '#3D3731',
  muted:      '#7A7068',
  borderSoft: '#E6DED0', cream:     '#F0E8DA',
  red:        '#DC2626', redLt:     '#FEF2F2',
};

const STATUS_META = {
  pending_supplier: { label: 'Awaiting Supplier Signature', color: C.gold,    bg: C.goldLt,    icon: Clock        },
  pending_buyer:    { label: 'Awaiting Buyer Signature',    color: '#D97706',  bg: '#FEF3C7',   icon: AlertTriangle },
  active:           { label: 'Active — Both Parties Signed',color: C.emerald,  bg: C.emeraldLt, icon: CheckCircle2 },
  completed:        { label: 'Completed — Order Placed',    color: '#15803D',  bg: '#F0FDF4',   icon: CheckCircle2 },
  cancelled:        { label: 'Cancelled',                   color: C.red,      bg: C.redLt,     icon: XCircle      },
};

function SectionCard({ title, icon: Icon, accent = C.navy, children }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 16,
      border: `1.5px solid ${C.borderSoft}`, overflow: 'hidden', marginBottom: 16,
    }}>
      <div style={{ height: 3, background: accent }} />
      <div style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Icon size={15} color={accent} />
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 14, color: C.ink, margin: 0, textTransform: 'uppercase', letterSpacing: '.04em' }}>
            {title}
          </h3>
        </div>
        {children}
      </div>
    </div>
  );
}

function Row({ label, value, strong }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, paddingBottom: 8, marginBottom: 8, borderBottom: `1px solid ${C.borderSoft}` }}>
      <span style={{ fontSize: 12, color: C.muted, flexShrink: 0, minWidth: 140 }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: strong ? 700 : 500, color: strong ? C.ink : C.inkSoft, textAlign: 'right' }}>{value}</span>
    </div>
  );
}

function SignatureBox({ label, signedAt, signedByName, pending }) {
  if (signedAt) {
    return (
      <div style={{
        flex: 1, borderRadius: 12, padding: '14px 16px',
        background: C.emeraldLt, border: `1.5px solid ${C.emerald}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <CheckCircle2 size={14} color={C.emerald} />
          <span style={{ fontSize: 12, fontWeight: 700, color: C.emerald }}>{label}</span>
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{signedByName || 'Signed'}</div>
        <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{formatDate(signedAt)}</div>
      </div>
    );
  }
  return (
    <div style={{
      flex: 1, borderRadius: 12, padding: '14px 16px',
      background: pending ? C.saffronLt : C.cream,
      border: `1.5px solid ${pending ? C.saffron : C.borderSoft}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        <Clock size={14} color={pending ? C.saffron : C.muted} />
        <span style={{ fontSize: 12, fontWeight: 700, color: pending ? C.saffron : C.muted }}>{label}</span>
      </div>
      <div style={{ fontSize: 12, color: C.muted }}>{pending ? 'Signature required' : 'Awaiting signature'}</div>
    </div>
  );
}

/* ── Confirm dialog ──────────────────────────────────────────────────────────── */
function ConfirmModal({ message, onConfirm, onCancel, confirmLabel, confirmColor }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.45)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div style={{
        background: '#fff', borderRadius: 20, padding: 28, maxWidth: 400, width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <AlertTriangle size={20} color={confirmColor || C.saffron} />
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 800, color: C.ink, margin: 0 }}>
            Confirm Action
          </h3>
        </div>
        <p style={{ fontSize: 14, color: C.inkSoft, lineHeight: 1.6, marginBottom: 20 }}>{message}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={{
            padding: '9px 20px', borderRadius: 100, border: `1.5px solid ${C.borderSoft}`,
            background: '#fff', color: C.muted, cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13,
          }}>Cancel</button>
          <button onClick={onConfirm} style={{
            padding: '9px 20px', borderRadius: 100, border: 'none',
            background: confirmColor || C.saffron, color: '#fff', cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13,
          }}>{confirmLabel || 'Confirm'}</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   CONTRACT PAGE — view, sign, cancel, place order
══════════════════════════════════════════════════════════════════════════════ */
export default function ContractPage() {
  const navigate     = useNavigate();
  const { id }       = useParams();
  const { userRole } = useSelector((s) => s.auth);
  const [busy, setBusy]           = useState(null);
  const [modal, setModal]         = useState(null);

  const { data: contract, loading, refetch } = useFetchData(() => api.getContract(id));

  const base = userRole === 'supplier' ? '/supplier-dashboard' : '/buyer-dashboard';

  const mySignedAt = userRole === 'buyer'
    ? contract?.buyer_signed_at
    : contract?.supplier_signed_at;

  const canSign   = contract && !mySignedAt && !['cancelled','completed'].includes(contract.status);
  const canCancel = contract && ['pending_supplier','pending_buyer'].includes(contract.status);
  const canOrder  = contract && contract.status === 'active' && userRole === 'buyer';

  async function handleSign() {
    setBusy('sign');
    try {
      await api.signContract(id);
      toast.success('Contract signed successfully!');
      refetch();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(null);
      setModal(null);
    }
  }

  async function handleCancel() {
    setBusy('cancel');
    try {
      await api.cancelContract(id);
      toast.info('Contract cancelled.');
      refetch();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(null);
      setModal(null);
    }
  }

  async function handlePlaceOrder() {
    setBusy('order');
    try {
      await api.placeOrderFromContract(id);
      toast.success('Order placed successfully!');
      navigate(`${base}/orders`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(null);
      setModal(null);
    }
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 240 }}>
      <Spinner />
    </div>
  );
  if (!contract) return (
    <div style={{ padding: 40, textAlign: 'center', color: C.muted }}>Contract not found.</div>
  );

  const statusMeta = STATUS_META[contract.status] || { label: contract.status, color: C.muted, bg: C.cream, icon: Clock };
  const StatusIcon = statusMeta.icon;

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", maxWidth: 860, margin: '0 auto' }}>

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 24 }}>
        <button onClick={() => navigate(`${base}/contracts`)} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          marginBottom: 14, fontSize: 13, fontWeight: 600, color: C.muted,
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        }}>
          <ArrowLeft size={14} /> Back to Contracts
        </button>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: C.muted, letterSpacing: '.06em' }}>
                {contract.contract_number}
              </span>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 100,
                background: statusMeta.bg, color: statusMeta.color,
              }}>
                <StatusIcon size={12} /> {statusMeta.label}
              </span>
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 900, color: C.ink, margin: 0 }}>
              {contract.title}
            </h1>
            <p style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>
              {contract.buyer_name} → {contract.supplier_name} · Created {formatDate(contract.created_at)}
            </p>
          </div>
        </div>
        <div style={{ height: 3, marginTop: 12, borderRadius: 2, background: `linear-gradient(90deg, ${C.saffron}, transparent)` }} />
      </div>

      {/* ── Action bar ───────────────────────────────────────────────────── */}
      {(canSign || canOrder || canCancel) && (
        <div style={{
          display: 'flex', gap: 10, flexWrap: 'wrap',
          background: '#fff', borderRadius: 16, padding: '14px 18px',
          border: `1.5px solid ${C.borderSoft}`, marginBottom: 20,
        }}>
          {canSign && (
            <button onClick={() => setModal('sign')} disabled={busy === 'sign'} style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '10px 22px', borderRadius: 100, border: 'none',
              background: C.emerald, color: '#fff', cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13,
              opacity: busy === 'sign' ? 0.7 : 1,
            }}>
              <FileSignature size={14} /> Sign Contract
            </button>
          )}
          {canOrder && (
            <button onClick={() => setModal('order')} disabled={busy === 'order'} style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '10px 22px', borderRadius: 100, border: 'none',
              background: C.saffron, color: '#fff', cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13,
              opacity: busy === 'order' ? 0.7 : 1,
            }}>
              <ShoppingCart size={14} /> Place Order
            </button>
          )}
          {canCancel && (
            <button onClick={() => setModal('cancel')} disabled={busy === 'cancel'} style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '10px 18px', borderRadius: 100,
              border: `1.5px solid ${C.borderSoft}`, background: '#fff',
              color: C.red, cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13,
              opacity: busy === 'cancel' ? 0.7 : 1,
            }}>
              <XCircle size={14} /> Cancel Contract
            </button>
          )}
          {mySignedAt && contract.status !== 'active' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: C.emerald, fontWeight: 600 }}>
              <CheckCircle2 size={14} /> You signed on {formatDate(mySignedAt)} — awaiting other party
            </div>
          )}
        </div>
      )}

      {/* ── Two-column layout ────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 20 }}>

        {/* Left column */}
        <div>
          {/* Product / Trade Details */}
          <SectionCard title="Trade Details" icon={Package} accent={C.saffron}>
            <Row label="Product"      value={contract.title}                                       strong />
            <Row label="Description"  value={contract.product_description}                                />
            <Row label="Quantity"     value={contract.quantity ? `${contract.quantity} ${contract.quantity_unit || 'units'}` : null} strong />
            <Row label="Unit Price"   value={contract.unit_price ? `${contract.currency} ${Number(contract.unit_price).toLocaleString('en-IN')}` : null} strong />
            <Row label="Total Value"  value={contract.total_value ? `${contract.currency} ${Number(contract.total_value).toLocaleString('en-IN')}` : null} strong />
            <Row label="Currency"     value={contract.currency}                                           />
          </SectionCard>

          {/* Commercial Terms */}
          <SectionCard title="Commercial Terms" icon={DollarSign} accent={C.emerald}>
            <Row label="Incoterms"      value={contract.incoterms}     strong />
            <Row label="Payment Terms"  value={contract.payment_terms}        />
            <Row label="Payment Method" value={contract.payment_method}       />
          </SectionCard>

          {/* Delivery */}
          <SectionCard title="Delivery" icon={MapPin} accent={C.navy}>
            <Row label="Destination"     value={contract.delivery_destination}                          />
            <Row label="Delivery By"     value={contract.delivery_deadline ? formatDate(contract.delivery_deadline) : null} strong />
            <Row label="Lead Time"       value={contract.lead_time_days ? `${contract.lead_time_days} days` : null} />
          </SectionCard>
        </div>

        {/* Right column */}
        <div>
          {/* Signatures */}
          <SectionCard title="Signatures" icon={FileSignature} accent={C.saffron}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 4 }}>
              <SignatureBox
                label="Buyer"
                signedAt={contract.buyer_signed_at}
                signedByName={contract.buyer_signed_by_name}
                pending={userRole === 'buyer' && !contract.buyer_signed_at && contract.status !== 'cancelled'}
              />
              <SignatureBox
                label="Supplier"
                signedAt={contract.supplier_signed_at}
                signedByName={contract.supplier_signed_by_name}
                pending={userRole === 'supplier' && !contract.supplier_signed_at && contract.status !== 'cancelled'}
              />
            </div>
            {contract.status === 'active' && (
              <div style={{
                marginTop: 10, padding: '8px 12px', borderRadius: 10,
                background: C.emeraldLt, fontSize: 12, color: C.emerald, fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <CheckCircle2 size={12} /> Fully executed — contract is binding
              </div>
            )}
          </SectionCard>

          {/* Parties */}
          <SectionCard title="Parties" icon={FileText} accent={C.navy}>
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 3 }}>Buyer</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>{contract.buyer_name}</div>
              {contract.buyer_city && <div style={{ fontSize: 12, color: C.muted }}>{contract.buyer_city}</div>}
            </div>
            <div style={{ height: 1, background: C.borderSoft, margin: '8px 0' }} />
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 3 }}>Supplier</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>{contract.supplier_name}</div>
              {contract.supplier_city && <div style={{ fontSize: 12, color: C.muted }}>{contract.supplier_city}</div>}
            </div>
          </SectionCard>

          {/* Quality & Legal */}
          <SectionCard title="Quality & Legal" icon={Shield} accent={C.emerald}>
            <Row label="Quality Standards"  value={contract.quality_standards}  />
            <Row label="Inspection"         value={contract.inspection_terms}   />
            <Row label="Warranty"           value={contract.warranty_terms}     />
            <Row label="Valid Until"        value={contract.valid_until ? formatDate(contract.valid_until) : null} />
          </SectionCard>

          {/* Dispute & Governing */}
          {(contract.dispute_resolution || contract.governing_law) && (
            <SectionCard title="Legal Framework" icon={Gavel} accent={C.gold}>
              <Row label="Dispute Resolution" value={contract.dispute_resolution} />
              <Row label="Governing Law"      value={contract.governing_law}      />
            </SectionCard>
          )}

          {/* Special Terms */}
          {contract.special_terms && (
            <SectionCard title="Special Terms" icon={FileText} accent={C.muted}>
              <p style={{ fontSize: 13, color: C.inkSoft, lineHeight: 1.7, margin: 0 }}>
                {contract.special_terms}
              </p>
            </SectionCard>
          )}
        </div>
      </div>

      {/* ── Confirm modals ────────────────────────────────────────────────── */}
      {modal === 'sign' && (
        <ConfirmModal
          message="By signing this contract you agree to all terms and conditions stated above. This action is legally binding and cannot be undone."
          confirmLabel="Sign Contract"
          confirmColor={C.emerald}
          onConfirm={handleSign}
          onCancel={() => setModal(null)}
        />
      )}
      {modal === 'cancel' && (
        <ConfirmModal
          message="Are you sure you want to cancel this contract? This cannot be undone."
          confirmLabel="Cancel Contract"
          confirmColor={C.red}
          onConfirm={handleCancel}
          onCancel={() => setModal(null)}
        />
      )}
      {modal === 'order' && (
        <ConfirmModal
          message={`Place an order for ${contract.title} with ${contract.supplier_name} for ${contract.currency} ${Number(contract.total_value || 0).toLocaleString('en-IN')}? The contract will be marked as completed.`}
          confirmLabel="Place Order"
          confirmColor={C.saffron}
          onConfirm={handlePlaceOrder}
          onCancel={() => setModal(null)}
        />
      )}
    </div>
  );
}
