// pages/SupplierDashboard.jsx
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useFetchData } from '../hooks/useFetchData';
import { StatCard, Spinner, Badge, EmptyState } from '../components/UI';
import { FileSearch, Send, DollarSign, Star, ArrowRight, Plus } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/helpers';

export default function SupplierDashboard() {
  const { userName } = useSelector((s) => s.auth);
  const navigate     = useNavigate();

  const { data: stats,  loading: sl } = useFetchData(() => api.getStats('supplier'));
  const { data: rfqs,   loading: rl } = useFetchData(() => api.getRFQs());
  const { data: quotes, loading: ql } = useFetchData(() => api.getQuotes());

  const activeRFQs = rfqs?.filter((r) => r.status === 'active') ?? [];

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* ── Hero banner ───────────────────────────────────────────────────── */}
      <div style={{
        borderRadius: 20, padding: '28px 32px',
        background: 'var(--emerald)', position: 'relative', overflow: 'hidden',
      }}>
        {/* Mandala watermark */}
        <div style={{
          position: 'absolute', inset: 0, opacity: .08, pointerEvents: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='46' fill='none' stroke='%23fff' stroke-width='.5' stroke-dasharray='3 7'/%3E%3Ccircle cx='50' cy='50' r='30' fill='none' stroke='%23fff' stroke-width='.4' stroke-dasharray='2 5'/%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px',
        }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', width: 44, height: 3, borderRadius: 2, overflow: 'hidden', marginBottom: 10 }}>
              <div style={{ flex: 1, background: 'var(--saffron)' }} />
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.85)' }} />
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.4)' }} />
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, fontWeight: 900, color: '#fff', margin: 0, letterSpacing: -.5 }}>
              Supplier Hub, {userName} 🏭
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.78)', marginTop: 5, fontSize: 14, margin: '5px 0 0' }}>
              Respond to RFQs and grow your global business.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/supplier-dashboard/catalog/new')}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '9px 18px', borderRadius: 100, border: '1.5px solid rgba(255,255,255,0.5)',
                cursor: 'pointer', background: 'transparent', color: '#fff',
                fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13,
                transition: 'all .15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              <Plus size={14} /> List Product
            </button>
            <button
              onClick={() => navigate('/supplier-dashboard/rfqs')}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '9px 18px', borderRadius: 100, border: 'none', cursor: 'pointer',
                background: '#fff', color: 'var(--emerald)',
                fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13,
                boxShadow: '0 4px 14px rgba(0,0,0,0.12)', transition: 'transform .15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
            >
              <FileSearch size={14} /> Browse RFQs
            </button>
          </div>
        </div>
      </div>

      {/* ── Stats grid ────────────────────────────────────────────────────── */}
      {sl ? <Spinner /> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          <StatCard icon={FileSearch} label="Open RFQs"     value={stats?.openRfqs     ?? 0}    color="var(--saffron)" bg="var(--saffron-lt)" trend={18} />
          <StatCard icon={Send}       label="Active Quotes" value={stats?.activeQuotes  ?? 0}    color="var(--navy)"    bg="var(--navy-lt)"    trend={7}  />
          <StatCard icon={DollarSign} label="Revenue"       value={stats?.revenue       ?? '₹0'} color="var(--emerald)" bg="var(--emerald-lt)" trend={22} />
          <StatCard icon={Star}       label="Rating"        value={stats?.rating        ?? '—'}  color="var(--gold)"    bg="var(--gold-lt)"               />
        </div>
      )}

      {/* ── Two-column panel row ──────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Open RFQs panel */}
        <div style={{
          background: '#fff', borderRadius: 20,
          border: '1.5px solid var(--border-soft)',
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '16px 20px', borderBottom: '1px solid var(--border-soft)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)' }}>Open RFQs</span>
            <button
              onClick={() => navigate('/supplier-dashboard/rfqs')}
              style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: 'var(--emerald)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              View all <ArrowRight size={12} />
            </button>
          </div>

          {rl ? <Spinner /> : activeRFQs.length === 0 ? (
            <EmptyState icon={FileSearch} title="No open RFQs" desc="New buyer requests will appear here" />
          ) : (
            <div>
              {activeRFQs.slice(0, 4).map((r) => (
                <div
                  key={r.id}
                  onClick={() => navigate(`/supplier-dashboard/rfqs/${r.id}`)}
                  style={{
                    padding: '12px 20px', cursor: 'pointer',
                    borderBottom: '1px solid var(--border-soft)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                    transition: 'background .15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--warm-white)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {r.title}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                      {r.budget} · Due {formatDate(r.deadline)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--emerald)' }}>
                      {r.responses} responses
                    </div>
                    <span style={{
                      display: 'inline-block', marginTop: 3,
                      fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 100,
                      background: 'var(--emerald-lt)', color: 'var(--emerald)',
                    }}>
                      Quote Now
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Quotes panel */}
        <div style={{
          background: '#fff', borderRadius: 20,
          border: '1.5px solid var(--border-soft)',
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '16px 20px', borderBottom: '1px solid var(--border-soft)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)' }}>My Quotes</span>
            <button
              onClick={() => navigate('/supplier-dashboard/quotes')}
              style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: 'var(--emerald)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              View all <ArrowRight size={12} />
            </button>
          </div>

          {ql ? <Spinner /> : !quotes?.length ? (
            <EmptyState icon={Send} title="No quotes yet" desc="Submit a quote on an open RFQ" />
          ) : (
            <div>
              {quotes.slice(0, 4).map((q) => (
                <div
                  key={q.id}
                  style={{
                    padding: '12px 20px',
                    borderBottom: '1px solid var(--border-soft)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {q.rfqTitle}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                      {formatCurrency(q.totalAmount)} · {q.leadTime}
                    </div>
                  </div>
                  <Badge status={q.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}