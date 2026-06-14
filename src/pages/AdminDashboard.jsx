import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useFetchData } from '../hooks/useFetchData';
import { Spinner } from '../components/UI';
import { toast } from 'react-toastify';
import {
  Users, Building2, ShoppingBag, DollarSign,
  ShieldCheck, Package, ArrowRight, TrendingUp,
  BarChart2, Settings,
} from 'lucide-react';
import { formatDate } from '../utils/helpers';

/* ── Design tokens — Faire palette ─────────────────────────────────────── */
const C = {
  ink:        '#1C1815',
  inkSoft:    '#3D3731',
  muted:      '#7A7068',
  border:     '#EDE8E0',
  bg:         '#F5F2EE',
  white:      '#fff',
  emerald:    '#1A7A4A',
  emeraldLt:  '#EAF5EF',
  navy:       '#1B3175',
  navyLt:     '#EEF2FB',
  saffron:    '#C4773A',
  saffronLt:  '#FDF1E8',
  gold:       '#B8730A',
  goldLt:     '#FDF5E2',
  red:        '#DC2626',
  redLt:      '#FEF2F2',
};

/* ── Stat card ──────────────────────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, color, trend, badge }) {
  return (
    <div style={{ background: C.white, borderRadius: 12, padding: '18px 20px', border: `1px solid ${C.border}` }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ width: 36, height: 36, borderRadius: 9, background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={16} color={color} />
        </div>
        {trend != null && (
          <span style={{ fontSize: 12, fontWeight: 600, color: C.emerald, display: 'flex', alignItems: 'center', gap: 3 }}>
            <TrendingUp size={11} /> +{trend}%
          </span>
        )}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.5px', color: C.ink, marginBottom: 3 }}>{value}</div>
      <div style={{ fontSize: 12, color: C.muted }}>{label}</div>
      {badge && (
        <span style={{ display: 'inline-block', marginTop: 8, fontSize: 10, fontWeight: 700, padding: '2px 9px', borderRadius: 100, background: `${color}18`, color }}>
          {badge}
        </span>
      )}
    </div>
  );
}

/* ── Status pill ────────────────────────────────────────────────────────── */
function Status({ status }) {
  const map = {
    pending:   { color: C.gold,    bg: C.goldLt,    label: 'Pending'   },
    approved:  { color: C.emerald, bg: C.emeraldLt, label: 'Approved'  },
    rejected:  { color: C.red,     bg: C.redLt,     label: 'Rejected'  },
    active:    { color: C.emerald, bg: C.emeraldLt, label: 'Active'    },
    suspended: { color: C.red,     bg: C.redLt,     label: 'Suspended' },
  };
  const s = map[status] || map.pending;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 100, background: s.bg, color: s.color }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.color }} />{s.label}
    </span>
  );
}

/* ── Panel wrapper ──────────────────────────────────────────────────────── */
function Panel({ title, count, countColor, onViewAll, children }) {
  const navigate = useNavigate();
  return (
    <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
      <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: C.ink }}>{title}</span>
          {count != null && (
            <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 100, background: countColor ? `${countColor}18` : C.bg, color: countColor || C.muted }}>
              {count}
            </span>
          )}
        </div>
        {onViewAll && (
          <button onClick={onViewAll} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: C.navy, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            View all <ArrowRight size={12} />
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

export default function AdminDashboard() {
  const { userName } = useSelector(s => s.auth);
  const navigate     = useNavigate();
  const firstName    = userName?.split(' ')[0] || userName;
  const [verifying, setVerifying] = useState(null);

  const { data: stats,             loading: sl } = useFetchData(() => api.admin.getStats());
  const { data: liveVerifications, loading: vl, refetch: refetchVerif } = useFetchData(() => api.admin.getVerifications());
  const { data: liveUsers }                      = useFetchData(() => api.admin.getUsers({ limit: 5 }));

  const handleVerify = async (companyId, action) => {
    setVerifying({ id: companyId, action });
    try {
      await api.admin.verifyCompany(companyId, action === 'approve' ? 'verified' : 'rejected');
      toast.success(`Company ${action === 'approve' ? 'approved' : 'rejected'}`);
      refetchVerif();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setVerifying(null);
    }
  };

  const statCards = [
    { icon: Users,       label: 'Total Users',          value: stats?.totalUsers     ?? '—', color: C.navy,    trend: 8,    badge: null },
    { icon: Building2,   label: 'Companies',            value: stats?.totalCompanies ?? '—', color: C.emerald, trend: 12,   badge: null },
    { icon: ShoppingBag, label: 'Products Listed',      value: stats?.totalProducts  ?? '—', color: C.saffron, trend: 15,   badge: null },
    { icon: DollarSign,  label: 'Monthly Revenue',      value: stats?.monthlyRevenue ?? '—', color: C.gold,    trend: 22,   badge: null },
    { icon: ShieldCheck, label: 'Pending KYC',          value: stats?.pendingKyc     ?? '—', color: C.gold,    trend: null, badge: (stats?.pendingKyc > 0) ? 'Needs review' : null },
    { icon: Package,     label: 'Active Orders',        value: stats?.activeOrders   ?? '—', color: C.navy,    trend: 6,    badge: null },
  ];

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: C.ink, display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* ── Page heading ─────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#B0A89E', letterSpacing: '.1em', textTransform: 'uppercase', margin: '0 0 4px' }}>
            Globrixa · Admin
          </p>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 4px', letterSpacing: '-0.4px' }}>
            Welcome back, {firstName}
          </h1>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>{today}</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/admin-dashboard/verifications')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, background: C.ink, color: '#fff', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13 }}>
            <ShieldCheck size={14} /> Review KYC
          </button>
          <button onClick={() => navigate('/admin-dashboard/users')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, background: C.white, color: C.ink, border: `1.5px solid ${C.border}`, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13 }}>
            <Users size={14} /> Manage Users
          </button>
        </div>
      </div>

      {/* ── Stats grid ───────────────────────────────────────────────────── */}
      {sl ? <Spinner /> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {statCards.map(s => <StatCard key={s.label} {...s} />)}
        </div>
      )}

      {/* ── Verifications + Users ─────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: 16 }}>

        <Panel
          title="GST Verifications"
          count={`${(liveVerifications || []).length} pending`}
          countColor={C.gold}
          onViewAll={() => navigate('/admin-dashboard/verifications')}
        >
          {vl ? (
            <div style={{ padding: '28px 20px', textAlign: 'center', color: C.muted, fontSize: 13 }}>Loading…</div>
          ) : !(liveVerifications || []).length ? (
            <div style={{ padding: '36px 20px', textAlign: 'center', color: C.muted, fontSize: 13 }}>
              No pending verifications
            </div>
          ) : (liveVerifications || []).slice(0, 5).map(v => {
            const id       = v.id;
            const name     = v.legal_name || v.company;
            const gst      = v.gst_number || v.gst || '—';
            const city     = v.city;
            const date     = v.created_at || v.submitted;
            const status   = v.verified_status || v.status;
            const isPending = status === 'pending' || status === 'under_review';
            const isActing  = verifying?.id === id;
            return (
              <div key={id} style={{ padding: '12px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 14, transition: 'background .1s' }}
                onMouseEnter={e => e.currentTarget.style.background = C.bg}
                onMouseLeave={e => e.currentTarget.style.background = C.white}>
                {/* Avatar */}
                <div style={{ width: 36, height: 36, borderRadius: 9, background: C.goldLt, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 14, fontWeight: 700, color: C.gold }}>
                  {(name || '?')[0].toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>GST {gst}{city ? ` · ${city}` : ''} · {formatDate(date)}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <Status status={status === 'verified' ? 'approved' : status} />
                  {isPending && (
                    <>
                      <button onClick={() => handleVerify(id, 'approve')} disabled={isActing}
                        style={{ padding: '4px 11px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: C.emeraldLt, color: C.emerald, border: 'none', cursor: 'pointer', opacity: isActing ? 0.5 : 1 }}>
                        {isActing && verifying?.action === 'approve' ? '…' : 'Approve'}
                      </button>
                      <button onClick={() => handleVerify(id, 'reject')} disabled={isActing}
                        style={{ padding: '4px 11px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: C.redLt, color: C.red, border: 'none', cursor: 'pointer', opacity: isActing ? 0.5 : 1 }}>
                        {isActing && verifying?.action === 'reject' ? '…' : 'Reject'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </Panel>

        <Panel title="Recent Users" onViewAll={() => navigate('/admin-dashboard/users')}>
          {!(liveUsers || []).length ? (
            <div style={{ padding: '36px 20px', textAlign: 'center', color: C.muted, fontSize: 13 }}>No users yet</div>
          ) : (liveUsers || []).slice(0, 5).map(u => {
            const displayName = u.full_name || u.name || u.email?.split('@')[0] || 'User';
            const role        = u.role;
            const company     = u.company || '—';
            const status      = u.is_active === false ? 'suspended' : u.status || 'active';
            const avatarColor = role === 'supplier' ? C.emerald : role === 'admin' ? C.saffron : C.navy;
            return (
              <div key={u.id} style={{ padding: '11px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 12, transition: 'background .1s', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background = C.bg}
                onMouseLeave={e => e.currentTarget.style.background = C.white}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: `${avatarColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 13, fontWeight: 700, color: avatarColor }}>
                  {displayName[0]?.toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayName}</div>
                  <div style={{ fontSize: 11, color: C.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{company}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                  <Status status={status} />
                  <span style={{ fontSize: 10, fontWeight: 600, color: C.muted, textTransform: 'capitalize' }}>{role}</span>
                </div>
              </div>
            );
          })}
        </Panel>
      </div>

      {/* ── Activity + Quick Actions ──────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 16 }}>

        <Panel title="Platform Activity">
          {sl ? (
            <div style={{ padding: '28px 20px', textAlign: 'center', color: C.muted, fontSize: 13 }}>Loading…</div>
          ) : [
            stats?.pendingKyc  > 0 && { icon: ShieldCheck, color: C.gold,    text: `${stats.pendingKyc} companies awaiting KYC approval`,     sub: 'Action required' },
            stats?.totalUsers       && { icon: Users,        color: C.navy,    text: `${stats.totalUsers} registered users on platform`,          sub: 'All time' },
            stats?.totalProducts    && { icon: ShoppingBag,  color: C.saffron, text: `${stats.totalProducts} active products listed`,             sub: 'All time' },
            stats?.activeOrders     && { icon: Package,      color: C.emerald, text: `${stats.activeOrders} orders this month`,                   sub: 'Last 30 days' },
            stats?.totalCompanies   && { icon: Building2,    color: C.navy,    text: `${stats.totalCompanies} verified companies`,                 sub: 'All time' },
            stats?.monthlyRevenue   && { icon: TrendingUp,   color: C.emerald, text: `Monthly GMV: ${stats.monthlyRevenue}`,                      sub: 'Last 30 days' },
          ].filter(Boolean).map((a, i) => (
            <div key={i} style={{ padding: '12px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: `${a.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <a.icon size={15} color={a.color} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: C.ink, fontWeight: 500 }}>{a.text}</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{a.sub}</div>
              </div>
            </div>
          ))}
        </Panel>

        <Panel title="Quick Actions">
          <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { icon: ShieldCheck, label: 'Review KYC Queue',  path: '/admin-dashboard/verifications', color: C.gold    },
              { icon: Users,       label: 'Manage Users',      path: '/admin-dashboard/users',         color: C.navy    },
              { icon: Building2,   label: 'Company Directory', path: '/admin-dashboard/companies',     color: C.emerald },
              { icon: ShoppingBag, label: 'Product Moderation',path: '/admin-dashboard/products',      color: C.saffron },
              { icon: BarChart2,   label: 'Platform Reports',  path: '/admin-dashboard/reports',       color: C.navy    },
              { icon: Settings,    label: 'System Settings',   path: '/admin-dashboard/settings',      color: C.muted   },
            ].map(({ icon: Icon, label, path, color }) => (
              <button key={label} onClick={() => navigate(path)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 9, border: `1px solid ${C.border}`, background: C.white, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: C.ink, textAlign: 'left', transition: 'background .1s, border-color .1s' }}
                onMouseEnter={e => { e.currentTarget.style.background = C.bg; e.currentTarget.style.borderColor = '#D4CFC8'; }}
                onMouseLeave={e => { e.currentTarget.style.background = C.white; e.currentTarget.style.borderColor = C.border; }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={14} color={color} />
                </div>
                <span style={{ flex: 1 }}>{label}</span>
                <ArrowRight size={12} color="#C8C0B8" />
              </button>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
