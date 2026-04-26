import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { useFetchData } from '../hooks/useFetchData';
import { Spinner, EmptyState } from '../components/UI';
import {
  Users, Building2, ShoppingBag, BarChart2,
  ShieldCheck, Search, CheckCircle2, XCircle,
  Eye, Ban, ArrowLeft, TrendingUp, MapPin, Download,
  Package, DollarSign, Loader2,
} from 'lucide-react';
import { formatDate } from '../utils/helpers';

const C = {
  navy: '#1B3175', navyLt: '#EEF2FB',
  saffron: '#D9600A', saffronLt: '#FDF1E8',
  emerald: '#1A7A4A', emeraldLt: '#EAF5EF',
  gold: '#B8730A', goldLt: '#FDF5E2',
  red: '#DC2626', redLt: '#FEF2F2',
  ink: '#1C1815', inkSoft: '#3D3731',
  muted: '#7A7068', border: '#D4C9B8',
  borderSoft: '#E6DED0', cream: '#F4EFE4',
};

/* ── Shared helpers ──────────────────────────────────────────────────────── */
function PageHeader({ title, subtitle, accentColor, onBack, action }) {
  return (
    <div style={{ marginBottom: 28 }}>
      {onBack && (
        <button onClick={onBack} style={{
          display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16,
          fontSize: 13, fontWeight: 600, color: C.muted,
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        }}>
          <ArrowLeft size={14} /> Back to Overview
        </button>
      )}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 27, fontWeight: 900, color: C.ink, margin: 0, letterSpacing: '-0.4px' }}>{title}</h1>
          {subtitle && <p style={{ fontSize: 13, color: C.muted, marginTop: 6 }}>{subtitle}</p>}
        </div>
        {action}
      </div>
      <div style={{ height: 3, marginTop: 16, borderRadius: 2, background: `linear-gradient(90deg, ${accentColor}, transparent)` }} />
    </div>
  );
}

function SearchBar({ value, onChange, placeholder }) {
  return (
    <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
      <Search size={14} color={C.muted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{
          width: '100%', paddingLeft: 36, paddingRight: 14, paddingTop: 10, paddingBottom: 10,
          borderRadius: 10, border: `1.5px solid ${C.borderSoft}`, background: '#fff',
          fontSize: 13, color: C.ink, fontFamily: "'DM Sans', sans-serif", outline: 'none',
          boxSizing: 'border-box', transition: 'border-color 0.15s',
        }}
        onFocus={e => { e.currentTarget.style.borderColor = C.navy; }}
        onBlur={e => { e.currentTarget.style.borderColor = C.borderSoft; }}
      />
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    active:    { bg: C.emeraldLt, color: C.emerald },
    suspended: { bg: C.redLt,     color: C.red     },
    pending:   { bg: C.goldLt,    color: C.gold    },
    approved:  { bg: C.emeraldLt, color: C.emerald },
    verified:  { bg: C.emeraldLt, color: C.emerald },
    rejected:  { bg: C.redLt,     color: C.red     },
    inactive:  { bg: C.cream,     color: C.muted   },
    draft:     { bg: C.cream,     color: C.muted   },
  };
  const s = map[status] || { bg: C.cream, color: C.muted };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 100,
      background: s.bg, color: s.color, textTransform: 'capitalize',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.color }} />
      {status === 'verified' ? 'Verified' : status}
    </span>
  );
}

/* ══════════════════════ ADMIN USERS PAGE ═════════════════════════════════ */
export function AdminUsersPage() {
  const navigate = useNavigate();
  const [search,     setSearch]     = useState('');
  const [filter,     setFilter]     = useState('all');
  const [suspending, setSuspending] = useState(null);

  const { data: users, loading, refetch } = useFetchData(() => api.admin.getUsers({ limit: 100 }));
  const list = Array.isArray(users) ? users : [];

  const filtered = list.filter(u => {
    const name   = u.full_name || u.email || '';
    const co     = u.company   || '';
    const role   = u.role      || '';
    const status = u.is_active === false ? 'suspended' : 'active';
    const matchQ = !search ||
      name.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      co.toLowerCase().includes(search.toLowerCase());
    const matchF = filter === 'all' || role === filter || status === filter;
    return matchQ && matchF;
  });

  const handleSuspend = async (id) => {
    setSuspending(id);
    try {
      const res = await api.admin.suspendUser(id);
      toast.success(res.message || 'User updated');
      refetch();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSuspending(null);
    }
  };

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <PageHeader
        title="User Management"
        subtitle={loading ? 'Loading…' : `${list.length} registered users`}
        accentColor={C.navy}
        onBack={() => navigate('/admin-dashboard')}
        action={
          <button style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 20px', borderRadius: 100, background: C.navy, color: '#fff', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13 }}>
            <Download size={13} /> Export
          </button>
        }
      />

      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search users, email, company…" />
        <div style={{ display: 'flex', gap: 6 }}>
          {['all', 'buyer', 'supplier', 'active', 'suspended'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '8px 15px', borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: 'pointer',
              background: filter === f ? C.navy : '#fff',
              color: filter === f ? '#fff' : C.inkSoft,
              border: `1.5px solid ${filter === f ? C.navy : C.borderSoft}`,
              textTransform: 'capitalize', transition: 'all 0.15s',
            }}>{f}</button>
          ))}
        </div>
      </div>

      {loading ? <Spinner /> : filtered.length === 0 ? (
        <EmptyState icon={Users} title="No users found" desc={search ? 'Try a different search term' : 'No users registered yet'} />
      ) : (
        <div style={{ background: '#fff', borderRadius: 20, border: `1.5px solid ${C.borderSoft}`, overflow: 'hidden' }}>
          <div style={{ borderTop: `3px solid ${C.navy}` }} />
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr auto', padding: '11px 22px', borderBottom: `1px solid ${C.borderSoft}`, background: C.cream }}>
            {['User', 'Company', 'Role', 'Status', 'Actions'].map(h => (
              <span key={h} style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '.07em' }}>{h}</span>
            ))}
          </div>
          {filtered.map(u => {
            const name   = u.full_name || u.email?.split('@')[0] || 'User';
            const status = u.is_active === false ? 'suspended' : 'active';
            const isSusp = status === 'suspended';
            return (
              <div key={u.id} style={{
                display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr auto',
                padding: '15px 22px', borderBottom: `1px solid ${C.borderSoft}`,
                alignItems: 'center', gap: 10, transition: 'background 0.12s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = C.cream; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0, background: u.role === 'supplier' ? C.emerald : C.navy, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 800, fontFamily: "'Playfair Display', serif" }}>
                    {name[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{name}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{u.email}</div>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 13, color: C.ink, fontWeight: 500 }}>{u.company || '—'}</div>
                  {u.city && <div style={{ fontSize: 11, color: C.muted, display: 'flex', alignItems: 'center', gap: 3 }}><MapPin size={9} />{u.city}</div>}
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 100, background: u.role === 'supplier' ? C.emeraldLt : C.navyLt, color: u.role === 'supplier' ? C.emerald : C.navy, textTransform: 'capitalize' }}>{u.role || '—'}</span>
                <StatusBadge status={status} />
                <div style={{ display: 'flex', gap: 6 }}>
                  <button title="View" style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${C.borderSoft}`, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Eye size={13} color={C.navy} />
                  </button>
                  <button title={isSusp ? 'Reactivate' : 'Suspend'} disabled={suspending === u.id}
                    onClick={() => handleSuspend(u.id)}
                    style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${C.borderSoft}`, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: suspending === u.id ? 0.5 : 1 }}>
                    {suspending === u.id ? <Loader2 size={13} style={{ animation: 'spin 0.7s linear infinite' }} /> : <Ban size={13} color={isSusp ? C.emerald : C.red} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ══════════════════════ ADMIN COMPANIES PAGE ════════════════════════════ */
export function AdminCompaniesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const { data: raw, loading } = useFetchData(() => api.admin.getCompanies({ limit: 100 }));
  const companies = Array.isArray(raw) ? raw : [];

  const filtered = companies.filter(c =>
    !search ||
    c.legal_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.city?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <PageHeader
        title="Company Directory"
        subtitle={loading ? 'Loading…' : `${companies.length} companies registered`}
        accentColor={C.emerald}
        onBack={() => navigate('/admin-dashboard')}
        action={
          <button style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 20px', borderRadius: 100, background: C.emerald, color: '#fff', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13 }}>
            <Download size={13} /> Export
          </button>
        }
      />

      <div style={{ marginBottom: 20 }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search company name, city…" />
      </div>

      {loading ? <Spinner /> : filtered.length === 0 ? (
        <EmptyState icon={Building2} title="No companies found" desc={search ? 'Try a different search' : 'No companies registered yet'} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {filtered.map(co => (
            <div key={co.id} style={{ background: '#fff', borderRadius: 18, border: `1.5px solid ${C.borderSoft}`, overflow: 'hidden', transition: 'box-shadow 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 6px 20px rgba(27,49,117,0.10)`; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ height: 3, background: co.verified_status === 'verified' ? C.emerald : C.gold }} />
              <div style={{ padding: '18px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: C.navyLt, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.navy, fontSize: 15, fontWeight: 900, fontFamily: "'Playfair Display', serif" }}>
                      {co.legal_name?.[0] || '?'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: C.ink }}>{co.legal_name}</div>
                      {co.city && <div style={{ fontSize: 11, color: C.muted, display: 'flex', alignItems: 'center', gap: 3, marginTop: 1 }}><MapPin size={9} />{co.city}</div>}
                    </div>
                  </div>
                  <StatusBadge status={co.verified_status || 'pending'} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                  {[
                    { label: 'Type',     value: co.is_supplier ? 'Supplier' : 'Buyer' },
                    { label: 'Products', value: co.product_count ?? '—' },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ textAlign: 'center', background: C.cream, borderRadius: 8, padding: '7px 4px' }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>{value}</div>
                      <div style={{ fontSize: 10, color: C.muted }}>{label}</div>
                    </div>
                  ))}
                </div>
                {co.verified_status !== 'verified' && (
                  <button onClick={() => toast.info('Use Verifications page to approve companies')}
                    style={{ width: '100%', padding: '8px 0', borderRadius: 9, border: 'none', background: C.emeraldLt, color: C.emerald, cursor: 'pointer', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                    <CheckCircle2 size={12} /> Review Verification
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════ ADMIN VERIFICATIONS PAGE ════════════════════════ */
export function AdminVerificationsPage() {
  const navigate  = useNavigate();
  const [filter,   setFilter]   = useState('all');
  const [actingId, setActingId] = useState(null);

  const { data: raw, loading, refetch } = useFetchData(() => api.admin.getVerifications());
  const source = Array.isArray(raw) ? raw : [];

  const mapped = source.map(v => ({
    id:        v.id,
    company:   v.legal_name    || '—',
    gst:       v.gst_number    || '—',
    pan:       v.pan_number    || '—',
    owner:     v.owner_name    || v.owner_email || '—',
    city:      v.city,
    type:      v.is_supplier ? 'Supplier' : 'Buyer',
    submitted: v.created_at,
    status:    v.verified_status || 'pending',
  }));

  const filtered = filter === 'all' ? mapped : mapped.filter(v => {
    if (filter === 'pending')  return v.status === 'pending' || v.status === 'under_review';
    if (filter === 'approved') return v.status === 'verified' || v.status === 'approved';
    return v.status === filter;
  });

  const counts = {
    pending:  mapped.filter(v => v.status === 'pending' || v.status === 'under_review').length,
    approved: mapped.filter(v => v.status === 'verified' || v.status === 'approved').length,
    rejected: mapped.filter(v => v.status === 'rejected').length,
  };

  const handleAction = async (id, action) => {
    setActingId(id);
    try {
      await api.admin.verifyCompany(id, action === 'approve' ? 'verified' : 'rejected');
      toast.success(`Company ${action === 'approve' ? 'approved ✅' : 'rejected'}`);
      refetch();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActingId(null);
    }
  };

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <PageHeader
        title="GST Verifications"
        subtitle="KYC queue — verify suppliers before marketplace access"
        accentColor={C.gold}
        onBack={() => navigate('/admin-dashboard')}
      />

      <div style={{ display: 'flex', gap: 10, marginBottom: 22, flexWrap: 'wrap' }}>
        {[
          { key: 'all',      label: 'All',      count: mapped.length,   color: C.navy,    bg: C.navyLt    },
          { key: 'pending',  label: 'Pending',  count: counts.pending,  color: C.gold,    bg: C.goldLt    },
          { key: 'approved', label: 'Approved', count: counts.approved, color: C.emerald, bg: C.emeraldLt },
          { key: 'rejected', label: 'Rejected', count: counts.rejected, color: C.red,     bg: C.redLt     },
        ].map(({ key, label, count, color, bg }) => (
          <button key={key} onClick={() => setFilter(key)} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '9px 16px', borderRadius: 100,
            background: filter === key ? color : '#fff', color: filter === key ? '#fff' : C.inkSoft,
            border: `1.5px solid ${filter === key ? color : C.borderSoft}`,
            cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.15s',
          }}>
            {label}
            <span style={{ padding: '1px 7px', borderRadius: 100, fontSize: 10, fontWeight: 700, background: filter === key ? 'rgba(255,255,255,0.25)' : bg, color: filter === key ? '#fff' : color }}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {loading ? <Spinner /> : filtered.length === 0 ? (
        <EmptyState icon={ShieldCheck} title="No verifications found" desc={filter === 'pending' ? 'No pending KYC requests' : 'Nothing to show for this filter'} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filtered.map(v => {
            const isPending = v.status === 'pending' || v.status === 'under_review';
            return (
              <div key={v.id} style={{ background: '#fff', borderRadius: 18, border: `1.5px solid ${C.borderSoft}`, overflow: 'hidden' }}>
                <div style={{ height: 3, background: v.status === 'verified' || v.status === 'approved' ? C.emerald : v.status === 'rejected' ? C.red : C.gold }} />
                <div style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: C.navyLt, color: C.navy, fontSize: 16, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Playfair Display', serif" }}>
                        {v.company[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: C.ink }}>{v.company}</div>
                        <div style={{ fontSize: 12, color: C.muted, display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
                          {v.city && <><MapPin size={10} /> {v.city} ·</>} {v.type} · {v.owner}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 18, marginBottom: 12 }}>
                      {[
                        { label: 'GST',       value: v.gst },
                        { label: 'PAN',       value: v.pan },
                        { label: 'Submitted', value: formatDate(v.submitted) },
                      ].map(({ label, value }) => (
                        <div key={label}>
                          <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 3 }}>{label}</div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, fontFamily: label !== 'Submitted' ? 'monospace' : "'DM Sans', sans-serif", background: label !== 'Submitted' ? C.cream : 'none', padding: label !== 'Submitted' ? '2px 7px' : '0', borderRadius: 6 }}>{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                    <StatusBadge status={v.status === 'verified' ? 'verified' : v.status} />
                    {isPending && (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button disabled={actingId === v.id} onClick={() => handleAction(v.id, 'approve')}
                          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 100, background: C.emerald, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, opacity: actingId === v.id ? 0.65 : 1 }}>
                          <CheckCircle2 size={13} /> {actingId === v.id ? '…' : 'Approve'}
                        </button>
                        <button disabled={actingId === v.id} onClick={() => handleAction(v.id, 'reject')}
                          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 100, background: C.redLt, color: C.red, border: `1.5px solid ${C.red}22`, cursor: 'pointer', fontSize: 12, fontWeight: 700, opacity: actingId === v.id ? 0.65 : 1 }}>
                          <XCircle size={13} /> {actingId === v.id ? '…' : 'Reject'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ══════════════════════ ADMIN REPORTS PAGE ══════════════════════════════ */
export function AdminReportsPage() {
  const navigate = useNavigate();
  const { data: stats, loading } = useFetchData(() => api.admin.getStats());

  const kpis = stats ? [
    { label: 'Total Users',          value: stats.totalUsers     ?? '—', color: C.navy,    bg: C.navyLt,    icon: Users       },
    { label: 'Active Companies',     value: stats.totalCompanies ?? '—', color: C.emerald, bg: C.emeraldLt, icon: Building2   },
    { label: 'Products Listed',      value: stats.totalProducts  ?? '—', color: C.saffron, bg: C.saffronLt, icon: ShoppingBag },
    { label: 'Monthly Revenue',      value: stats.monthlyRevenue ?? '—', color: C.gold,    bg: C.goldLt,    icon: DollarSign  },
    { label: 'Active Orders',        value: stats.activeOrders   ?? '—', color: C.navy,    bg: C.navyLt,    icon: Package     },
    { label: 'Pending Verifications',value: stats.pendingKyc     ?? '—', color: C.gold,    bg: C.goldLt,    icon: ShieldCheck },
  ] : [];

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <PageHeader
        title="Platform Reports"
        subtitle="Live platform metrics — Globrixa B2B Marketplace"
        accentColor={C.navy}
        onBack={() => navigate('/admin-dashboard')}
        action={
          <button style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 20px', borderRadius: 100, background: C.navy, color: '#fff', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13 }}>
            <Download size={13} /> Download Report
          </button>
        }
      />

      {loading ? <Spinner /> : (
        <>
          {/* KPI grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
            {kpis.map(({ label, value, color, bg, icon: Icon }) => (
              <div key={label} style={{ background: '#fff', borderRadius: 18, padding: '22px 22px', border: `1.5px solid ${C.borderSoft}`, position: 'relative', overflow: 'hidden', boxShadow: '0 1px 4px rgba(28,24,21,0.04)' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 3, background: color }} />
                <div style={{ width: 42, height: 42, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, marginTop: 8 }}>
                  <Icon size={19} color={color} />
                </div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 900, color: C.ink, lineHeight: 1, marginBottom: 6, letterSpacing: '-0.5px' }}>
                  {value}
                </div>
                <div style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Coming soon panel */}
          <div style={{ background: '#fff', borderRadius: 20, border: `1.5px solid ${C.borderSoft}`, padding: '48px 32px', textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 18, background: C.navyLt, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <BarChart2 size={30} color={C.navy} />
            </div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 800, color: C.ink, margin: '0 0 10px' }}>
              Detailed Analytics Coming Soon
            </h3>
            <p style={{ fontSize: 14, color: C.muted, maxWidth: 360, margin: '0 auto' }}>
              Category breakdowns, city-wise performance, trend charts, and more — currently in development.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

const AdminPages = { AdminUsersPage, AdminCompaniesPage, AdminVerificationsPage, AdminReportsPage };
export default AdminPages;
