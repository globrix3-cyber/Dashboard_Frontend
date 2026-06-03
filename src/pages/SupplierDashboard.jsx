import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toggleLogin } from '../features/auth/authSlice';
import { api } from '../services/api';
import { useFetchData } from '../hooks/useFetchData';
import { Spinner, EmptyState } from '../components/UI';
import { Bell, Search, FileSearch, Send, DollarSign, Star, Plus, ArrowRight, TrendingUp } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/helpers';

/* ── Design tokens ─────────────────────────────────────────────────────────── */
const T = {
  ink:     '#1C1815',
  muted:   '#7A7068',
  border:  '#F0EAE0',
  borderSoft: '#EDE8DF',
  cream:   '#FDF8F2',
  emerald: '#1A7A4A',
  emeraldLt: '#EAF5EF',
  saffron: '#C4773A',
  navy:    '#1B3175',
  navyLt:  '#EEF2FB',
  gold:    '#B8730A',
  goldLt:  '#FDF5E2',
};

/* ── Stat card ─────────────────────────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, accent, bg, trend }) {
  return (
    <div style={{ background: T.cream, borderRadius: 12, border: `1.5px solid ${T.borderSoft}`, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ width: 38, height: 38, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={16} color={accent} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: T.ink, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 11, color: T.muted, marginTop: 3, fontWeight: 500 }}>{label}</div>
      </div>
      {trend != null && (
        <div style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 100, background: T.emeraldLt, color: T.emerald, flexShrink: 0 }}>
          ↑ {trend}%
        </div>
      )}
    </div>
  );
}

/* ── RFQ action card ───────────────────────────────────────────────────────── */
function RFQCard({ r, onClick }) {
  return (
    <div
      onClick={onClick}
      onMouseEnter={e => { e.currentTarget.style.background = T.cream; }}
      onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
      style={{ padding: '14px 20px', borderBottom: `1px solid ${T.borderSoft}`, cursor: 'pointer', transition: 'background .15s', background: '#fff' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: T.ink, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {r.title}
          </div>
          <div style={{ fontSize: 11.5, color: T.muted, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <span>{r.quantity} {r.unit}</span>
            {r.budget && <span>Budget: <strong style={{ color: T.ink }}>{r.budget}</strong></span>}
            {r.deadline && <span>Due {formatDate(r.deadline)}</span>}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
          <span style={{ fontSize: 10, fontWeight: 700, background: T.emeraldLt, color: T.emerald, padding: '3px 9px', borderRadius: 100 }}>
            {r.responses ?? 0} quotes
          </span>
          <span style={{ fontSize: 10, fontWeight: 700, background: T.emerald, color: '#fff', padding: '3px 9px', borderRadius: 100 }}>
            Quote now →
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Quote row ─────────────────────────────────────────────────────────────── */
const STATUS_COLORS = {
  pending:  { bg: T.goldLt,    color: T.gold    },
  accepted: { bg: T.emeraldLt, color: T.emerald },
  rejected: { bg: '#FEF2F2',   color: '#DC2626' },
  active:   { bg: T.navyLt,    color: T.navy    },
};

function QuoteRow({ q, onClick }) {
  const s = STATUS_COLORS[q.status] ?? { bg: '#F3F0EB', color: T.muted };
  return (
    <div
      onClick={onClick}
      onMouseEnter={e => { e.currentTarget.style.background = T.cream; }}
      onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
      style={{ padding: '13px 20px', borderBottom: `1px solid ${T.borderSoft}`, cursor: 'pointer', transition: 'background .15s', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: T.ink, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {q.rfqTitle}
        </div>
        <div style={{ fontSize: 11.5, color: T.muted }}>
          {q.totalAmount ? formatCurrency(q.totalAmount) : '—'}{q.leadTime ? ` · ${q.leadTime}` : ''}
        </div>
      </div>
      <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 100, background: s.bg, color: s.color, flexShrink: 0, textTransform: 'capitalize' }}>
        {q.status}
      </span>
    </div>
  );
}

/* ── Panel wrapper ─────────────────────────────────────────────────────────── */
function Panel({ title, accent, onViewAll, loading, empty, children }) {
  return (
    <div style={{ background: '#fff', borderRadius: 14, border: `1.5px solid ${T.borderSoft}`, overflow: 'hidden' }}>
      <div style={{ height: 3, background: accent }} />
      <div style={{ padding: '14px 20px', borderBottom: `1px solid ${T.borderSoft}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 700, color: T.ink }}>{title}</span>
        {onViewAll && (
          <button onClick={onViewAll} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: accent, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            View all <ArrowRight size={12} />
          </button>
        )}
      </div>
      {loading ? <div style={{ padding: 24 }}><Spinner /></div> : empty ? empty : children}
    </div>
  );
}

/* ── Quick action card ─────────────────────────────────────────────────────── */
function QuickAction({ icon: Icon, label, sub, accent, onClick }) {
  return (
    <div
      onClick={onClick}
      onMouseEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.background = T.cream; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = T.borderSoft; e.currentTarget.style.background = '#fff'; }}
      style={{ background: '#fff', border: `1.5px solid ${T.borderSoft}`, borderRadius: 12, padding: '16px 18px', cursor: 'pointer', transition: 'all .15s', display: 'flex', alignItems: 'center', gap: 14 }}
    >
      <div style={{ width: 38, height: 38, borderRadius: 10, background: T.cream, border: `1.5px solid ${T.borderSoft}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={16} color={accent} />
      </div>
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: T.ink, marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 11.5, color: T.muted }}>{sub}</div>
      </div>
      <ArrowRight size={14} color={T.muted} style={{ marginLeft: 'auto', flexShrink: 0 }} />
    </div>
  );
}

/* ── SupplierDashboard ─────────────────────────────────────────────────────── */
export default function SupplierDashboard() {
  const { userName } = useSelector((s) => s.auth);
  const navigate     = useNavigate();
  const dispatch     = useDispatch();

  const { data: stats,  loading: sl } = useFetchData(() => api.getStats('supplier'));
  const { data: rfqs,   loading: rl } = useFetchData(() => api.getRFQs());
  const { data: quotes, loading: ql } = useFetchData(() => api.getQuotes());

  const openRFQs = rfqs?.filter(r => r.status === 'active') ?? [];

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", minHeight: '100vh', background: '#fff' }}>

      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <div style={{
        height: 58, display: 'flex', alignItems: 'center', gap: 16,
        padding: '0 32px', borderBottom: `1px solid ${T.border}`,
        background: '#fff', position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 700, color: T.ink, whiteSpace: 'nowrap', flexShrink: 0 }}>
          {greeting()}, {userName} 👋
        </div>
        <div style={{ flex: 1, maxWidth: 440, position: 'relative' }}>
          <Search size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#B0A89E', pointerEvents: 'none' }} />
          <input readOnly onClick={() => dispatch(toggleLogin(true))} placeholder="Search RFQs, buyers, orders…"
            style={{ width: '100%', height: 34, borderRadius: 100, border: `1.5px solid #E8E2D8`, background: T.cream, padding: '0 14px 0 32px', fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: T.ink, outline: 'none', cursor: 'pointer' }} />
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ position: 'relative' }}>
            <button onClick={() => navigate('/supplier-dashboard/messages')}
              style={{ width: 34, height: 34, borderRadius: 9, border: `1.5px solid #E8E2D8`, background: T.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Bell size={14} color={T.muted} />
            </button>
            <div style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, borderRadius: '50%', background: '#DC2626', border: '1.5px solid #fff' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer' }} onClick={() => navigate('/edit-profile')}>
            <span style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>{userName}</span>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: `linear-gradient(135deg, ${T.emerald}, #0F5C38)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff' }}>
              {userName?.[0]?.toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      <div style={{ padding: '28px 32px', maxWidth: 1400, margin: '0 auto' }}>

        {/* Welcome + actions */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: T.ink, marginBottom: 4 }}>
              Welcome back, {userName}
            </h2>
            <p style={{ fontSize: 13, color: T.muted }}>Your supplier hub — respond to RFQs and manage your catalog.</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => navigate('/supplier-dashboard/catalog/new')}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 8, border: `1.5px solid #E8E2D8`, background: T.cream, color: T.ink, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              <Plus size={13} /> List product
            </button>
            <button onClick={() => navigate('/supplier-dashboard/rfqs')}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 8, border: 'none', background: T.emerald, color: '#fff', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              <FileSearch size={13} /> Browse RFQs
            </button>
          </div>
        </div>

        {/* Stats row */}
        {sl ? <Spinner /> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
            <StatCard icon={FileSearch}  label="Open RFQs"     value={stats?.openRfqs    ?? 0}    accent={T.saffron} bg="#FDF1E8" trend={18} />
            <StatCard icon={Send}        label="Active Quotes" value={stats?.activeQuotes ?? 0}    accent={T.navy}    bg={T.navyLt}  trend={7}  />
            <StatCard icon={DollarSign}  label="Revenue"       value={stats?.revenue      ?? '$0'} accent={T.emerald} bg={T.emeraldLt} trend={22} />
            <StatCard icon={Star}        label="Rating"        value={stats?.rating       ?? '—'}  accent={T.gold}    bg={T.goldLt} />
          </div>
        )}

        {/* Two-column panels */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20, marginBottom: 28 }}>

          {/* Open RFQs */}
          <Panel
            title="Open RFQs"
            accent={T.saffron}
            onViewAll={() => navigate('/supplier-dashboard/rfqs')}
            loading={rl}
            empty={!openRFQs.length && <EmptyState icon={FileSearch} title="No open RFQs" desc="New buyer requests will appear here" />}
          >
            {openRFQs.slice(0, 5).map(r => (
              <RFQCard key={r.id} r={r} onClick={() => navigate(`/supplier-dashboard/rfqs/${r.id}`)} />
            ))}
          </Panel>

          {/* My Quotes */}
          <Panel
            title="My Quotes"
            accent={T.emerald}
            onViewAll={() => navigate('/supplier-dashboard/quotes')}
            loading={ql}
            empty={!quotes?.length && <EmptyState icon={Send} title="No quotes yet" desc="Submit a quote on an open RFQ" />}
          >
            {(quotes ?? []).slice(0, 5).map(q => (
              <QuoteRow key={q.id} q={q} onClick={() => navigate(`/supplier-dashboard/quotes/${q.id}`)} />
            ))}
          </Panel>
        </div>

        {/* Quick actions */}
        <div>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 700, color: T.ink, marginBottom: 14 }}>
            Quick actions
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <QuickAction icon={Plus}        label="List a new product"  sub="Add to your catalog"          accent={T.emerald} onClick={() => navigate('/supplier-dashboard/catalog/new')} />
            <QuickAction icon={FileSearch}  label="Browse all RFQs"     sub="Find buyers looking for you"  accent={T.saffron} onClick={() => navigate('/supplier-dashboard/rfqs')} />
            <QuickAction icon={TrendingUp}  label="View performance"    sub="Revenue, ratings & analytics" accent={T.navy}    onClick={() => navigate('/supplier-dashboard')} />
          </div>
        </div>
      </div>
    </div>
  );
}
