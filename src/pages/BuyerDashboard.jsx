import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useFetchData } from '../hooks/useFetchData';
import { StatCard, Spinner, Badge, EmptyState } from '../components/UI';
import { ShoppingBag, FileText, DollarSign, Heart, Plus, ArrowRight, Package } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/helpers';

export default function BuyerDashboard() {
  const { userName } = useSelector((s) => s.auth);
  const navigate = useNavigate();
  const { data: stats,  loading: sl } = useFetchData(() => api.getStats('buyer'));
  const { data: rfqs,   loading: rl } = useFetchData(() => api.getRFQs());
  const { data: orders, loading: ol } = useFetchData(() => api.getOrders());

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div>
      {/* Welcome banner */}
      <div className="rounded-3xl p-8 mb-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#FF6B00,#FF8C00)' }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='1' fill='%23fff'/%3E%3C/svg%3E")` }} />
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-black text-white mb-1">{greeting()}, {userName}! 👋</h1>
            <p style={{ color: 'rgba(255,255,255,0.85)' }}>Here's your trading overview for today.</p>
          </div>
          <button onClick={() => navigate('/buyer-dashboard/rfqs/new')}
            className="flex items-center gap-2 font-bold rounded-2xl px-6 py-3 text-sm transition-all hover:-translate-y-0.5"
            style={{ background: 'white', color: '#FF6B00', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
            <Plus size={16} /> New RFQ
          </button>
        </div>
      </div>

      {/* Stats */}
      {sl ? <Spinner /> : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard icon={FileText}    label="Active RFQs"       value={stats?.activeRfqs || 0}           color="#FF6B00" bg="#FFF7ED" trend={12} />
          <StatCard icon={Package}     label="Pending Orders"    value={stats?.pendingOrders || 0}         color="#3B82F6" bg="#EFF6FF" trend={5}  />
          <StatCard icon={DollarSign}  label="Total Spend"       value={stats?.totalSpend || '₹0'}         color="#10B981" bg="#ECFDF5" trend={8}  />
          <StatCard icon={Heart}       label="Saved Suppliers"   value={stats?.savedSuppliers || 0}        color="#F59E0B" bg="#FFFBEB" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent RFQs */}
        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Recent RFQs</h2>
            <button onClick={() => navigate('/buyer-dashboard/rfqs')}
              className="flex items-center gap-1 text-xs font-semibold"
              style={{ color: '#FF6B00' }}>
              View all <ArrowRight size={13} />
            </button>
          </div>
          {rl ? <Spinner /> : !rfqs?.length ? (
            <EmptyState icon={FileText} title="No RFQs yet"
              desc="Post your first request for quotation"
              action={<button onClick={() => navigate('/buyer-dashboard/rfqs/new')}
                className="btn-primary px-5 py-2.5 rounded-2xl text-sm">New RFQ</button>} />
          ) : (
            <div>
              {rfqs.slice(0, 4).map((r) => (
                <div key={r.id} className="table-row cursor-pointer"
                  style={{ gridTemplateColumns: '1fr auto' }}
                  onClick={() => navigate(`/buyer-dashboard/rfqs/${r.id}`)}>
                  <div>
                    <div className="font-semibold text-sm text-gray-900">{r.title}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{r.quantity} {r.unit} · {formatDate(r.createdAt)}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold" style={{ color: '#FF6B00' }}>{r.responses} quotes</span>
                    <Badge status={r.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Recent Orders</h2>
            <button onClick={() => navigate('/buyer-dashboard/orders')}
              className="flex items-center gap-1 text-xs font-semibold"
              style={{ color: '#FF6B00' }}>
              View all <ArrowRight size={13} />
            </button>
          </div>
          {ol ? <Spinner /> : !orders?.length ? (
            <EmptyState icon={Package} title="No orders yet" desc="Your orders will appear here" />
          ) : (
            <div>
              {orders.slice(0, 4).map((o) => (
                <div key={o.id} className="table-row cursor-pointer"
                  style={{ gridTemplateColumns: '1fr auto' }}
                  onClick={() => navigate(`/buyer-dashboard/orders/${o.id}`)}>
                  <div>
                    <div className="font-semibold text-sm text-gray-900">{o.orderNo}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{o.product} · {formatCurrency(o.amount)}</div>
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