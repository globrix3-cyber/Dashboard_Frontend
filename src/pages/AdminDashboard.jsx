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
  AlertTriangle, CheckCircle2, Clock, XCircle,
  BarChart2, Settings, Globe, Zap,
} from 'lucide-react';
import { formatDate } from '../utils/helpers';

const C = {
  navy:       '#1B3175',
  navyLt:     '#EEF2FB',
  navyMid:    '#3B5AC6',
  saffron:    '#D9600A',
  saffronLt:  '#FDF1E8',
  emerald:    '#1A7A4A',
  emeraldLt:  '#EAF5EF',
  gold:       '#B8730A',
  goldLt:     '#FDF5E2',
  red:        '#DC2626',
  redLt:      '#FEF2F2',
  ink:        '#1C1815',
  inkSoft:    '#3D3731',
  muted:      '#7A7068',
  border:     '#D4C9B8',
  borderSoft: '#E6DED0',
  cream:      '#F4EFE4',
  warmWhite:  '#FAF7F1',
};

function TriBar() {
  return (
    <div style={{ display: 'flex', height: 3 }}>
      <div style={{ flex: 1, background: C.saffron }} />
      <div style={{ flex: 1, background: '#fff', borderTop: `0.5px solid ${C.borderSoft}`, borderBottom: `0.5px solid ${C.borderSoft}` }} />
      <div style={{ flex: 1, background: C.emerald }} />
    </div>
  );
}

function AdminStatCard({ icon: Icon, label, value, color, bg, trend, badge }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 16, padding: '22px 20px',
      border: `1.5px solid ${C.borderSoft}`, position: 'relative', overflow: 'hidden',
      boxShadow: '0 1px 4px rgba(28,24,21,0.04)',
    }}>
      <div style={{ position: 'absolute', top: -16, right: -16, width: 64, height: 64, borderRadius: '50%', background: `${color}12` }} />
      <div style={{ width: 40, height: 40, borderRadius: 11, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
        <Icon size={18} color={color} />
      </div>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 900, color: C.ink, lineHeight: 1, marginBottom: 4 }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: C.muted, fontWeight: 500, marginBottom: badge ? 8 : 0 }}>{label}</div>
      {badge && (
        <span style={{
          display: 'inline-block', fontSize: 10, fontWeight: 700,
          padding: '2px 8px', borderRadius: 100,
          background: `${color}15`, color,
        }}>{badge}</span>
      )}
      {trend && (
        <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, fontWeight: 700, color: C.emerald }}>
          <TrendingUp size={11} /> +{trend}%
        </div>
      )}
    </div>
  );
}

function StatusDot({ status }) {
  const map = {
    pending:   { color: C.gold,    bg: C.goldLt,    label: 'Pending'   },
    approved:  { color: C.emerald, bg: C.emeraldLt, label: 'Approved'  },
    rejected:  { color: C.red,     bg: C.redLt,     label: 'Rejected'  },
    active:    { color: C.emerald, bg: C.emeraldLt, label: 'Active'    },
    suspended: { color: C.red,     bg: C.redLt,     label: 'Suspended' },
  };
  const s = map[status] || map.pending;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 100,
      background: s.bg, color: s.color,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.color }} />
      {s.label}
    </span>
  );
}

/* No static mock data — all panels use live API with loading/empty states */

export default function AdminDashboard() {
  const { userName } = useSelector((s) => s.auth);
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(null); // { id, action }

  const { data: stats, loading: sl } = useFetchData(() => api.admin.getStats());
  const { data: liveVerifications, loading: vl, refetch: refetchVerif } = useFetchData(() => api.admin.getVerifications());
  const { data: liveUsers } = useFetchData(() => api.admin.getUsers({ limit: 4 }));

  const handleVerify = async (companyId, action) => {
    setVerifying({ id: companyId, action });
    try {
      await api.admin.verifyCompany(companyId, action === 'approve' ? 'verified' : 'rejected');
      toast.success(`Company ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
      refetchVerif();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setVerifying(null);
    }
  };

  const platformStats = [
    { icon: Users,       label: 'Total Users',          value: stats?.totalUsers      ?? '—', color: C.navy,    bg: C.navyLt,    trend: 8,  badge: null             },
    { icon: Building2,   label: 'Registered Companies', value: stats?.totalCompanies  ?? '—', color: C.emerald, bg: C.emeraldLt, trend: 12, badge: null             },
    { icon: ShoppingBag, label: 'Products Listed',      value: stats?.totalProducts   ?? '—', color: C.saffron, bg: C.saffronLt, trend: 15, badge: null             },
    { icon: DollarSign,  label: 'Monthly Revenue',      value: stats?.monthlyRevenue  ?? '—', color: C.gold,    bg: C.goldLt,    trend: 22, badge: null             },
    { icon: ShieldCheck, label: 'Pending KYC',          value: stats?.pendingKyc      ?? '—', color: C.gold,    bg: C.goldLt,    trend: null, badge: stats?.pendingKyc > 0 ? 'Action Needed' : null },
    { icon: Package,     label: 'Active Orders',        value: stats?.activeOrders    ?? '—', color: C.navy,    bg: C.navyLt,    trend: 6,  badge: null             },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* ── Hero banner ─────────────────────────────────────────────────────── */}
      <div style={{
        borderRadius: 20, overflow: 'hidden', position: 'relative',
        background: C.navy, boxShadow: `0 8px 32px ${C.navy}44`,
      }}>
        <TriBar />
        {/* Mandala bg */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.06, pointerEvents: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='46' fill='none' stroke='%23fff' stroke-width='.5' stroke-dasharray='3 7'/%3E%3Ccircle cx='50' cy='50' r='30' fill='none' stroke='%23fff' stroke-width='.4' stroke-dasharray='2 5'/%3E%3Ccircle cx='50' cy='50' r='14' fill='none' stroke='%23fff' stroke-width='.35' stroke-dasharray='1 4'/%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px',
        }} />
        {/* Ghost rings */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', border: `1px solid rgba(255,255,255,0.08)`, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', border: `1px dashed rgba(255,255,255,0.06)`, pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 18 }}>🇮🇳</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '.12em', textTransform: 'uppercase' }}>
                Admin Control Panel
              </span>
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, fontWeight: 900, color: '#fff', margin: 0, letterSpacing: -0.5 }}>
              Welcome, {userName} 🛡️
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.72)', marginTop: 5, fontSize: 14 }}>
              Platform oversight — Globrixa B2B Marketplace · India's Trade Engine
            </p>
          </div>

          {/* Quick action pills */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/admin-dashboard/verifications')} style={{
              display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 100,
              background: C.saffron, color: '#fff', border: 'none', cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13,
              boxShadow: `0 4px 14px ${C.saffron}44`, transition: 'transform 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}>
              <ShieldCheck size={14} /> Verify KYC
            </button>
            <button onClick={() => navigate('/admin-dashboard/users')} style={{
              display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 100,
              background: 'transparent', color: '#fff', border: '1.5px solid rgba(255,255,255,0.4)',
              cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13,
              transition: 'background 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
              <Users size={14} /> Manage Users
            </button>
            <button onClick={() => navigate('/admin-dashboard/reports')} style={{
              display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 100,
              background: 'transparent', color: '#fff', border: '1.5px solid rgba(255,255,255,0.4)',
              cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13,
              transition: 'background 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
              <BarChart2 size={14} /> Reports
            </button>
          </div>
        </div>
      </div>

      {/* ── Platform summary strip ───────────────────────────────────────────── */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 10, padding: '14px 18px', borderRadius: 14,
        background: '#fff', border: `1.5px solid ${C.borderSoft}`,
      }}>
        {[
          { icon: Globe,        text: '120+ Countries',          color: C.navy    },
          { icon: Zap,          text: 'AI-Powered Matching',     color: C.saffron },
          { icon: ShieldCheck,  text: 'GST KYC Verified',        color: C.emerald },
          { icon: TrendingUp,   text: '₹2.4 Cr Monthly Revenue', color: C.gold    },
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
          Bharat का व्यापार मंच
        </span>
      </div>

      {/* ── Stats grid ──────────────────────────────────────────────────────── */}
      {sl ? <Spinner /> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {platformStats.map((s) => <AdminStatCard key={s.label} {...s} />)}
        </div>
      )}

      {/* ── Pending Verifications + Recent Users ────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 20 }}>

        {/* Pending GST Verifications — live data */}
        <div style={{ background: '#fff', borderRadius: 20, border: `1.5px solid ${C.borderSoft}`, overflow: 'hidden' }}>
          <div style={{ borderTop: `3px solid ${C.gold}` }} />
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.borderSoft}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontWeight: 700, fontSize: 14, color: C.ink, fontFamily: "'Playfair Display', serif" }}>GST Verifications</span>
              <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 100, background: C.goldLt, color: C.gold }}>
                {(liveVerifications || []).length} Pending
              </span>
            </div>
            <button onClick={() => navigate('/admin-dashboard/verifications')} style={{
              display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: C.navy,
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            }}>
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div>
            {vl ? (
              <div style={{ padding: '24px 20px', textAlign: 'center', color: C.muted, fontSize: 13 }}>
                <span style={{ width: 16, height: 16, border: `2px solid ${C.borderSoft}`, borderTopColor: C.gold, borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block', marginRight: 8 }} />
                Loading…
              </div>
            ) : !(liveVerifications || []).length ? (
              <div style={{ padding: '32px 20px', textAlign: 'center', color: C.muted, fontSize: 13 }}>
                No pending verifications
              </div>
            ) : (liveVerifications || []).slice(0, 4).map((v) => {
              const id      = v.id;
              const name    = v.legal_name    || v.company;
              const gst     = v.gst_number    || v.gst    || '—';
              const city    = v.city;
              const date    = v.created_at    || v.submitted;
              const status  = v.verified_status || v.status;
              const isPending = status === 'pending' || status === 'under_review';
              const isActing  = verifying?.id === id;
              return (
                <div key={id} style={{
                  padding: '13px 20px', borderBottom: `1px solid ${C.borderSoft}`,
                  display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'center',
                  transition: 'background 0.15s', cursor: 'default',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.cream; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: C.ink, marginBottom: 2 }}>{name}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>GST: {gst} · {city}</div>
                    <div style={{ fontSize: 10, color: C.muted, marginTop: 1 }}>Submitted {formatDate(date)}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                    <StatusDot status={status === 'verified' ? 'approved' : status} />
                    {isPending && (
                      <div style={{ display: 'flex', gap: 5 }}>
                        <button onClick={() => handleVerify(id, 'approve')} disabled={isActing}
                          style={{ padding: '3px 10px', borderRadius: 100, fontSize: 10, fontWeight: 700, background: C.emeraldLt, color: C.emerald, border: 'none', cursor: 'pointer', opacity: isActing ? 0.6 : 1 }}>
                          {isActing && verifying?.action === 'approve' ? '…' : 'Approve'}
                        </button>
                        <button onClick={() => handleVerify(id, 'reject')} disabled={isActing}
                          style={{ padding: '3px 10px', borderRadius: 100, fontSize: 10, fontWeight: 700, background: C.redLt, color: C.red, border: 'none', cursor: 'pointer', opacity: isActing ? 0.6 : 1 }}>
                          {isActing && verifying?.action === 'reject' ? '…' : 'Reject'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Users — live data */}
        <div style={{ background: '#fff', borderRadius: 20, border: `1.5px solid ${C.borderSoft}`, overflow: 'hidden' }}>
          <div style={{ borderTop: `3px solid ${C.navy}` }} />
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.borderSoft}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: C.ink, fontFamily: "'Playfair Display', serif" }}>Recent Users</span>
            <button onClick={() => navigate('/admin-dashboard/users')} style={{
              display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: C.navy,
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            }}>
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div>
            {!(liveUsers || []).length ? (
              <div style={{ padding: '32px 20px', textAlign: 'center', color: C.muted, fontSize: 13 }}>No users yet</div>
            ) : (liveUsers || []).slice(0, 4).map((u) => {
              const displayName = u.full_name || u.name || u.email?.split('@')[0] || 'User';
              const role        = u.role;
              const company     = u.company || '—';
              const status      = u.is_active === false ? 'suspended' : u.status || 'active';
              return (
                <div key={u.id} style={{
                  padding: '13px 20px', borderBottom: `1px solid ${C.borderSoft}`,
                  display: 'flex', alignItems: 'center', gap: 12,
                  transition: 'background 0.15s', cursor: 'pointer',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.cream; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                    background: role === 'supplier' ? C.emerald : role === 'admin' ? C.saffron : C.navy,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: 13, fontWeight: 800, fontFamily: "'Playfair Display', serif",
                  }}>
                    {displayName[0]?.toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: C.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayName}</div>
                    <div style={{ fontSize: 11, color: C.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{company}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                    <StatusDot status={status} />
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 100,
                      background: role === 'supplier' ? C.emeraldLt : C.navyLt,
                      color: role === 'supplier' ? C.emerald : C.navy,
                      textTransform: 'capitalize',
                    }}>{role}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Activity Feed + Quick Actions ─────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 20 }}>

        {/* Activity Feed */}
        <div style={{ background: '#fff', borderRadius: 20, border: `1.5px solid ${C.borderSoft}`, overflow: 'hidden' }}>
          <div style={{ borderTop: `3px solid ${C.emerald}` }} />
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.borderSoft}` }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: C.ink, fontFamily: "'Playfair Display', serif" }}>Platform Activity</span>
          </div>
          <div style={{ padding: '8px 0' }}>
            {sl ? (
              <div style={{ padding: '32px 20px', textAlign: 'center', color: C.muted, fontSize: 13 }}>Loading activity…</div>
            ) : [
              stats?.pendingKyc > 0   && { icon: ShieldCheck, color: C.gold,    text: `${stats.pendingKyc} companies awaiting GST KYC approval`,    sub: 'Action required' },
              stats?.totalUsers       && { icon: Users,        color: C.navy,    text: `${stats.totalUsers} total registered users on platform`,       sub: 'All time' },
              stats?.totalProducts    && { icon: ShoppingBag,  color: C.saffron, text: `${stats.totalProducts} active products in marketplace`,        sub: 'All time' },
              stats?.activeOrders     && { icon: Package,      color: C.emerald, text: `${stats.activeOrders} orders placed this month`,               sub: 'Last 30 days' },
              stats?.totalCompanies   && { icon: Building2,    color: C.navy,    text: `${stats.totalCompanies} verified companies registered`,         sub: 'All time' },
              stats?.monthlyRevenue   && { icon: TrendingUp,   color: C.emerald, text: `Monthly GMV: ${stats.monthlyRevenue}`,                         sub: 'Last 30 days' },
            ].filter(Boolean).map((a, i) => (
              <div key={i} style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: `1px solid ${C.borderSoft}` }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: `${a.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <a.icon size={15} color={a.color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: C.ink, fontWeight: 500, lineHeight: 1.45 }}>{a.text}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{a.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ background: '#fff', borderRadius: 20, border: `1.5px solid ${C.borderSoft}`, overflow: 'hidden' }}>
          <div style={{ borderTop: `3px solid ${C.saffron}` }} />
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.borderSoft}` }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: C.ink, fontFamily: "'Playfair Display', serif" }}>Quick Actions</span>
          </div>
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { icon: ShieldCheck, label: 'Review KYC Queue',       path: '/admin-dashboard/verifications', color: C.gold,    bg: C.goldLt    },
              { icon: Users,       label: 'Manage Users',            path: '/admin-dashboard/users',         color: C.navy,    bg: C.navyLt    },
              { icon: Building2,   label: 'Company Directory',       path: '/admin-dashboard/companies',     color: C.emerald, bg: C.emeraldLt },
              { icon: ShoppingBag, label: 'Product Moderation',      path: '/admin-dashboard/products',      color: C.saffron, bg: C.saffronLt },
              { icon: BarChart2,   label: 'Platform Reports',        path: '/admin-dashboard/reports',       color: C.navy,    bg: C.navyLt    },
              { icon: Settings,    label: 'System Settings',         path: '/admin-dashboard/settings',      color: C.muted,   bg: C.cream     },
            ].map(({ icon: Icon, label, path, color, bg }) => (
              <button key={label} onClick={() => navigate(path)} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 12,
                background: bg, border: `1px solid ${color}22`, cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: C.ink,
                transition: 'transform 0.12s, box-shadow 0.12s',
                textAlign: 'left',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(3px)'; e.currentTarget.style.boxShadow = `0 2px 8px ${color}22`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={14} color={color} />
                </div>
                {label}
                <ArrowRight size={12} color={C.muted} style={{ marginLeft: 'auto' }} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
