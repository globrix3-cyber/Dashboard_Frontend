import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useFetchData } from '../hooks/useFetchData';
import { StatCard, Spinner, Badge, EmptyState } from '../components/UI';
import { ShoppingBag, FileText, DollarSign, Heart, Plus, ArrowRight, Package, Landmark, BadgeCheck } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/helpers';

const C = {
  saffron:    '#D9600A',
  saffronLt:  '#FDF1E8',
  saffronMid: '#F0B48A',
  emerald:    '#1A7A4A',
  emeraldLt:  '#EAF5EF',
  navy:       '#1B3175',
  navyLt:     '#EEF2FB',
  gold:       '#B8730A',
  goldLt:     '#FDF5E2',
  cream:      '#F4EFE4',
  ink:        '#1C1815',
  inkSoft:    '#3D3731',
  muted:      '#7A7068',
  border:     '#D4C9B8',
  borderSoft: '#E6DED0',
};

function TriBar() {
  return (
    <div style={{ display: 'flex', height: 3, borderRadius: '2px 2px 0 0', overflow: 'hidden' }}>
      <div style={{ flex: 1, background: C.saffron }} />
      <div style={{ flex: 1, background: '#fff' }} />
      <div style={{ flex: 1, background: C.emerald }} />
    </div>
  );
}

export default function BuyerDashboard() {
  const { userName } = useSelector((s) => s.auth);
  const navigate = useNavigate();
  const { data: stats,  loading: sl } = useFetchData(() => api.getStats('buyer'));
  const { data: rfqs,   loading: rl } = useFetchData(() => api.getRFQs());
  const { data: orders, loading: ol } = useFetchData(() => api.getOrders());

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Suprabhat';
    if (h < 17) return 'Namaste';
    return 'Shubh Sandhya';
  };

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* ── Welcome banner ──────────────────────────────────────────────────── */}
      <div style={{
        borderRadius: 20,
        overflow: 'hidden',
        position: 'relative',
        background: C.saffron,
        boxShadow: `0 8px 32px ${C.saffron}44`,
      }}>
        <TriBar />
        {/* Mandala watermark */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.07, pointerEvents: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='46' fill='none' stroke='%23fff' stroke-width='.5' stroke-dasharray='3 7'/%3E%3Ccircle cx='50' cy='50' r='30' fill='none' stroke='%23fff' stroke-width='.4' stroke-dasharray='2 5'/%3E%3Ccircle cx='50' cy='50' r='14' fill='none' stroke='%23fff' stroke-width='.35' stroke-dasharray='1 4'/%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px',
        }} />

        <div style={{ position: 'relative', zIndex: 1, padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 20 }}>🇮🇳</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '.12em', textTransform: 'uppercase' }}>
                Buyer Dashboard
              </span>
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, fontWeight: 900, color: '#fff', margin: 0, letterSpacing: -0.5 }}>
              {greeting()}, {userName}! 🙏
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.78)', marginTop: 5, fontSize: 14 }}>
              Aaj ka vyapar sarvanam — your trading overview for today.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/buyer-dashboard/rfqs/new')} style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '9px 18px', borderRadius: 100, border: 'none', cursor: 'pointer',
              background: '#fff', color: C.saffron,
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13,
              boxShadow: '0 4px 14px rgba(0,0,0,0.14)',
              transition: 'transform 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}>
              <Plus size={14} /> New RFQ
            </button>
            <button onClick={() => navigate('/products')} style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '9px 18px', borderRadius: 100, cursor: 'pointer',
              background: 'transparent', color: '#fff',
              border: '1.5px solid rgba(255,255,255,0.5)',
              fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13,
              transition: 'background 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
              <ShoppingBag size={14} /> Browse Products
            </button>
          </div>
        </div>
      </div>

      {/* ── Trust signals ───────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 10,
        padding: '14px 18px', borderRadius: 14,
        background: '#fff', border: `1.5px solid ${C.borderSoft}`,
      }}>
        {[
          { icon: Landmark,    text: 'GST Verified Network',  color: C.saffron },
          { icon: BadgeCheck,  text: 'MSME Registered',        color: C.emerald },
          { icon: ShoppingBag, text: '50,000+ Products',        color: C.navy    },
        ].map(({ icon: Icon, text, color }) => (
          <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={12} color={color} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 500, color: C.inkSoft }}>{text}</span>
            <span style={{ width: 1, height: 14, background: C.borderSoft, marginLeft: 4 }} />
          </div>
        ))}
        <span style={{ fontSize: 12, fontStyle: 'italic', color: C.muted, fontFamily: "'Playfair Display', serif", alignSelf: 'center' }}>
          भारत का व्यापार मंच
        </span>
      </div>

      {/* ── Stats ───────────────────────────────────────────────────────────── */}
      {sl ? <Spinner /> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          <StatCard icon={FileText}    label="Active RFQs"     value={stats?.activeRfqs     ?? 0}     color={C.saffron}  bg={C.saffronLt}  trend={12} />
          <StatCard icon={Package}     label="Pending Orders"  value={stats?.pendingOrders  ?? 0}     color={C.navy}     bg={C.navyLt}     trend={5}  />
          <StatCard icon={DollarSign}  label="Total Spend"     value={stats?.totalSpend     ?? '₹0'}  color={C.emerald}  bg={C.emeraldLt}  trend={8}  />
          <StatCard icon={Heart}       label="Saved Suppliers" value={stats?.savedSuppliers ?? 0}     color={C.gold}     bg={C.goldLt}               />
        </div>
      )}

      {/* ── Two-column panels ───────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Recent RFQs */}
        <div style={{
          background: '#fff', borderRadius: 20,
          border: `1.5px solid ${C.borderSoft}`, overflow: 'hidden',
          boxShadow: '0 1px 4px rgba(28,24,21,0.04)',
        }}>
          <div style={{ borderTop: `3px solid ${C.saffron}` }} />
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.borderSoft}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: C.ink, fontFamily: "'Playfair Display', serif" }}>Recent RFQs</span>
            <button onClick={() => navigate('/buyer-dashboard/rfqs')} style={{
              display: 'flex', alignItems: 'center', gap: 4,
              fontSize: 12, fontWeight: 600, color: C.saffron,
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            }}>
              View all <ArrowRight size={12} />
            </button>
          </div>
          {rl ? <Spinner /> : !rfqs?.length ? (
            <EmptyState icon={FileText} title="No RFQs yet" desc="Post your first request for quotation"
              action={<button onClick={() => navigate('/buyer-dashboard/rfqs/new')}
                style={{ padding: '8px 18px', borderRadius: 100, background: C.saffron, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>New RFQ</button>} />
          ) : (
            <div>
              {rfqs.slice(0, 4).map((r) => (
                <div key={r.id} onClick={() => navigate(`/buyer-dashboard/rfqs/${r.id}`)} style={{
                  padding: '12px 20px', cursor: 'pointer',
                  borderBottom: `1px solid ${C.borderSoft}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                  transition: 'background 0.15s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.saffronLt; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: C.ink }}>{r.title}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{r.quantity} {r.unit} · {formatDate(r.createdAt)}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: C.saffron }}>{r.responses} quotes</span>
                    <Badge status={r.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div style={{
          background: '#fff', borderRadius: 20,
          border: `1.5px solid ${C.borderSoft}`, overflow: 'hidden',
          boxShadow: '0 1px 4px rgba(28,24,21,0.04)',
        }}>
          <div style={{ borderTop: `3px solid ${C.emerald}` }} />
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.borderSoft}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: C.ink, fontFamily: "'Playfair Display', serif" }}>Recent Orders</span>
            <button onClick={() => navigate('/buyer-dashboard/orders')} style={{
              display: 'flex', alignItems: 'center', gap: 4,
              fontSize: 12, fontWeight: 600, color: C.emerald,
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            }}>
              View all <ArrowRight size={12} />
            </button>
          </div>
          {ol ? <Spinner /> : !orders?.length ? (
            <EmptyState icon={Package} title="No orders yet" desc="Your orders will appear here" />
          ) : (
            <div>
              {orders.slice(0, 4).map((o) => (
                <div key={o.id} onClick={() => navigate(`/buyer-dashboard/orders/${o.id}`)} style={{
                  padding: '12px 20px', cursor: 'pointer',
                  borderBottom: `1px solid ${C.borderSoft}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                  transition: 'background 0.15s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.emeraldLt; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: C.ink }}>{o.orderNo}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{o.product} · {formatCurrency(o.amount)}</div>
                  </div>
                  <Badge status={o.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
