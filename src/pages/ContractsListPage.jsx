import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { api } from '../services/api';
import { useFetchData } from '../hooks/useFetchData';
import { Spinner, EmptyState } from '../components/UI';
import { FileText, ChevronRight, CheckCircle2, Clock, AlertCircle, XCircle } from 'lucide-react';
import { formatDate } from '../utils/helpers';

const C = {
  saffron:    '#D9600A', saffronLt: '#FDF1E8',
  emerald:    '#1A7A4A', emeraldLt: '#EAF5EF',
  navy:       '#1B3175', navyLt:    '#EEF2FB',
  gold:       '#B8730A', goldLt:    '#FDF5E2',
  ink:        '#1C1815', inkSoft:   '#3D3731',
  muted:      '#7A7068',
  borderSoft: '#E6DED0', cream:     '#F4EFE4',
};

const STATUS_META = {
  pending_supplier: { label: 'Awaiting Supplier',  icon: Clock,        bg: C.goldLt,    color: C.gold    },
  pending_buyer:    { label: 'Awaiting Your Sign',  icon: AlertCircle,  bg: '#FEF3C7',   color: '#D97706' },
  active:           { label: 'Active',              icon: CheckCircle2, bg: C.emeraldLt, color: C.emerald },
  completed:        { label: 'Completed',           icon: CheckCircle2, bg: '#F0FDF4',   color: '#15803D' },
  cancelled:        { label: 'Cancelled',           icon: XCircle,      bg: '#FEF2F2',   color: '#DC2626' },
};

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || { label: status, icon: Clock, bg: C.cream, color: C.muted };
  const Icon = meta.icon;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 100,
      background: meta.bg, color: meta.color,
    }}>
      <Icon size={11} /> {meta.label}
    </span>
  );
}

export default function ContractsListPage() {
  const navigate     = useNavigate();
  const { userRole } = useSelector((s) => s.auth);
  const { data: contracts, loading } = useFetchData(() => api.getContracts());

  const base = userRole === 'supplier' ? '/supplier-dashboard' : '/buyer-dashboard';

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 900, color: C.ink, margin: 0 }}>
          Contracts
        </h1>
        <p style={{ fontSize: 14, color: C.muted, marginTop: 4 }}>
          {userRole === 'buyer'
            ? 'Trade agreements with your suppliers'
            : 'Trade agreements from your buyers'}
        </p>
        <div style={{ height: 3, marginTop: 12, borderRadius: 2, background: `linear-gradient(90deg, ${C.saffron}, transparent)` }} />
      </div>

      {loading ? <Spinner /> : !(contracts || []).length ? (
        <EmptyState
          icon={FileText}
          title="No contracts yet"
          desc={userRole === 'buyer'
            ? 'Select a supplier quote from your RFQs to generate a contract'
            : 'Contracts sent by buyers will appear here for your signature'}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {contracts.map((c) => {
            const needsAction =
              (userRole === 'supplier' && c.status === 'pending_supplier' && !c.supplier_signed_at) ||
              (userRole === 'buyer'    && c.status === 'pending_buyer'    && !c.buyer_signed_at);

            return (
              <div
                key={c.id}
                onClick={() => navigate(`${base}/contracts/${c.id}`)}
                style={{
                  background: '#fff', borderRadius: 18, padding: '18px 22px',
                  border: `1.5px solid ${needsAction ? C.saffron : C.borderSoft}`,
                  cursor: 'pointer', transition: 'transform 0.18s, box-shadow 0.18s',
                  boxShadow: needsAction ? `0 0 0 3px ${C.saffronLt}` : 'none',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = needsAction ? `0 0 0 3px ${C.saffronLt}` : 'none'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: '.05em' }}>
                        {c.contract_number}
                      </span>
                      <StatusBadge status={c.status} />
                      {needsAction && (
                        <span style={{
                          fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 100,
                          background: C.saffron, color: '#fff',
                        }}>
                          ACTION REQUIRED
                        </span>
                      )}
                    </div>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 15, color: C.ink, margin: '0 0 8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.title}
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, fontSize: 12, color: C.muted }}>
                      {userRole === 'buyer' && c.supplier_name && (
                        <span>Supplier: <strong style={{ color: C.ink }}>{c.supplier_name}</strong></span>
                      )}
                      {userRole === 'supplier' && c.buyer_name && (
                        <span>Buyer: <strong style={{ color: C.ink }}>{c.buyer_name}</strong></span>
                      )}
                      {c.total_value && (
                        <span>Value: <strong style={{ color: C.emerald }}>{c.currency} {Number(c.total_value).toLocaleString('en-IN')}</strong></span>
                      )}
                      {c.delivery_deadline && (
                        <span>Delivery: <strong style={{ color: C.ink }}>{formatDate(c.delivery_deadline)}</strong></span>
                      )}
                      <span>Created: <strong style={{ color: C.ink }}>{formatDate(c.created_at)}</strong></span>
                    </div>

                    {/* Signature status */}
                    <div style={{ display: 'flex', gap: 14, marginTop: 10 }}>
                      <span style={{
                        fontSize: 11, padding: '3px 9px', borderRadius: 100,
                        background: c.buyer_signed_at    ? C.emeraldLt : C.cream,
                        color:      c.buyer_signed_at    ? C.emerald   : C.muted,
                        fontWeight: 600,
                      }}>
                        {c.buyer_signed_at ? '✓' : '○'} Buyer signed
                      </span>
                      <span style={{
                        fontSize: 11, padding: '3px 9px', borderRadius: 100,
                        background: c.supplier_signed_at ? C.emeraldLt : C.cream,
                        color:      c.supplier_signed_at ? C.emerald   : C.muted,
                        fontWeight: 600,
                      }}>
                        {c.supplier_signed_at ? '✓' : '○'} Supplier signed
                      </span>
                    </div>
                  </div>

                  <ChevronRight size={18} color={C.muted} style={{ flexShrink: 0 }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
