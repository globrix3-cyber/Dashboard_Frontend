import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useFetchData } from '../hooks/useFetchData';
import { Spinner, Badge, EmptyState, PageHeader } from '../components/UI';
import { FileText, Plus, ChevronRight, MessageSquare } from 'lucide-react';
import { formatDate } from '../utils/helpers';

export default function BuyerRFQsPage() {
  const navigate = useNavigate();
  const { data: rfqs, loading, refetch } = useFetchData(() => api.getRFQs());

  return (
    <div>
      <PageHeader
        title="My RFQs"
        subtitle="Manage your requests for quotation"
        action={
          <button onClick={() => navigate('/buyer-dashboard/rfqs/new')}
            className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm">
            <Plus size={15} /> New RFQ
          </button>
        }
      />

      {loading ? <Spinner /> : !rfqs?.length ? (
        <EmptyState icon={FileText} title="No RFQs yet"
          desc="Post your first request for quotation to get quotes from verified suppliers"
          action={
            <button onClick={() => navigate('/buyer-dashboard/rfqs/new')}
              className="btn-primary px-6 py-3 rounded-2xl text-sm">
              Create First RFQ
            </button>
          } />
      ) : (
        <div className="flex flex-col gap-4">
          {rfqs.map((r) => (
            <div key={r.id}
              className="bg-white rounded-3xl border border-gray-200 p-6 cursor-pointer transition-all hover:-translate-y-0.5 hover:border-orange-200"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
              onClick={() => navigate(`/buyer-dashboard/rfqs/${r.id}`)}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-gray-900">{r.title}</h3>
                    <Badge status={r.status} />
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span>Qty: <strong className="text-gray-700">{r.quantity} {r.unit}</strong></span>
                    <span>Budget: <strong className="text-gray-700">{r.budget}</strong></span>
                    <span>Deadline: <strong className="text-gray-700">{formatDate(r.deadline)}</strong></span>
                    <span>Posted: <strong className="text-gray-700">{formatDate(r.createdAt)}</strong></span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="flex items-center gap-1.5 text-sm font-bold" style={{ color: '#FF6B00' }}>
                      <MessageSquare size={14} /> {r.responses}
                    </div>
                    <div className="text-xs text-gray-400">quotes</div>
                  </div>
                  <ChevronRight size={18} className="text-gray-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}