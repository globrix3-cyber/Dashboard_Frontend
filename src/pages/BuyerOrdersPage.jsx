import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useFetchData } from '../hooks/useFetchData';
import { Spinner, Badge, EmptyState, PageHeader } from '../components/UI';
import { Package, ChevronRight } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/helpers';

const STATUS_STEPS = ['confirmed', 'in_production', 'shipped', 'delivered'];

function OrderProgress({ status }) {
  const idx = STATUS_STEPS.indexOf(status);
  return (
    <div className="flex items-center gap-1 mt-3">
      {STATUS_STEPS.map((s, i) => (
        <div key={s} className="flex items-center gap-1 flex-1">
          <div className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: i <= idx ? '#FF6B00' : '#E5E7EB' }} />
          {i < STATUS_STEPS.length - 1 && (
            <div className="h-0.5 flex-1"
              style={{ background: i < idx ? '#FF6B00' : '#E5E7EB' }} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function BuyerOrdersPage() {
  const navigate = useNavigate();
  const { data: orders, loading } = useFetchData(() => api.getOrders());

  return (
    <div>
      <PageHeader title="My Orders" subtitle="Track all your trade orders" />

      {loading ? <Spinner /> : !orders?.length ? (
        <EmptyState icon={Package} title="No orders yet" desc="Your orders will appear here once confirmed" />
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((o) => (
            <div key={o.id}
              className="bg-white rounded-3xl border border-gray-200 p-6 cursor-pointer transition-all hover:-translate-y-0.5 hover:border-orange-200"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-gray-900">{o.orderNo}</h3>
                    <Badge status={o.status} />
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span>Product: <strong className="text-gray-700">{o.product}</strong></span>
                    <span>Supplier: <strong className="text-gray-700">{o.supplier}</strong></span>
                    <span>Amount: <strong className="text-gray-700">{formatCurrency(o.amount)}</strong></span>
                    <span>Delivery: <strong className="text-gray-700">{formatDate(o.deliveryDate)}</strong></span>
                  </div>
                  <OrderProgress status={o.status} />
                </div>
                <ChevronRight size={18} className="text-gray-400 mt-1" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}