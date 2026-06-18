import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useFetchData } from '../hooks/useFetchData';
import { Spinner } from '../components/UI';
import {
  FileSearch, Send, DollarSign, Plus, ArrowRight, Package, Pencil,
} from 'lucide-react';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { formatCurrency, resolveImageUrl } from '../utils/helpers';

/* ── Design tokens ─────────────────────────────────────────────────────────── */
const T = {
  ink:        '#1C1815',
  muted:      '#7A7068',
  borderSoft: '#EDE8DF',
  cream:      '#FDF8F2',
  emerald:    '#1A7A4A', emeraldLt: '#EAF5EF',
  saffron:    '#C4773A', saffronLt: '#FDF1E8',
  navy:       '#1B3175', navyLt:    '#EEF2FB',
  gold:       '#B8730A', goldLt:    '#FDF5E2',
  red:        '#DC2626', redLt:     '#FEF2F2',
};

const PRODUCT_STATUS = {
  active:       { bg: T.emeraldLt, color: T.emerald, label: 'Active'    },
  draft:        { bg: T.cream,     color: T.muted,   label: 'Draft'     },
  inactive:     { bg: T.goldLt,    color: T.gold,    label: 'Inactive'  },
  out_of_stock: { bg: T.redLt,     color: T.red,     label: 'OOS'       },
};

/* ── Stat card ─────────────────────────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, accent, bg }) {
  return (
    <div
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,.08)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
      style={{
        background: '#fff', borderRadius: 14, border: `1.5px solid ${T.borderSoft}`,
        padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14,
        transition: 'box-shadow .2s',
      }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={18} color={accent} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: T.ink, lineHeight: 1 }}>{value ?? '—'}</div>
        <div style={{ fontSize: 11.5, color: T.muted, marginTop: 4, fontWeight: 500 }}>{label}</div>
      </div>
    </div>
  );
}

/* ── Panel wrapper ─────────────────────────────────────────────────────────── */
function Panel({ title, accent, count, onViewAll, loading, empty, children }) {
  return (
    <div style={{ background: '#fff', borderRadius: 14, border: `1.5px solid ${T.borderSoft}`, overflow: 'hidden' }}>
      <div style={{ height: 3, background: accent }} />
      <div style={{ padding: '14px 20px', borderBottom: `1px solid ${T.borderSoft}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 700, color: T.ink }}>{title}</span>
          {count != null && (
            <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 100, background: T.cream, color: T.muted }}>{count}</span>
          )}
        </div>
        {onViewAll && (
          <button onClick={onViewAll} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: accent, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            View all <ArrowRight size={12} />
          </button>
        )}
      </div>
      {loading
        ? <div style={{ padding: 32, display: 'flex', justifyContent: 'center' }}><Spinner /></div>
        : empty || children}
    </div>
  );
}

/* ── RFQ row ───────────────────────────────────────────────────────────────── */
function RFQCard({ r, onClick }) {
  return (
    <div onClick={onClick}
      onMouseEnter={e => { e.currentTarget.style.background = T.cream; }}
      onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
      style={{ padding: '13px 20px', borderBottom: `1px solid ${T.borderSoft}`, cursor: 'pointer', transition: 'background .15s', background: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: T.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</div>
          <div style={{ fontSize: 11.5, color: T.muted, marginTop: 3, display: 'flex', gap: 10 }}>
            <span>{r.quantity} {r.unit}</span>
            {r.budget && <span>Budget: <strong style={{ color: T.ink }}>{r.budget}</strong></span>}
          </div>
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, background: T.emeraldLt, color: T.emerald, padding: '3px 9px', borderRadius: 100, flexShrink: 0, whiteSpace: 'nowrap' }}>
          Quote now →
        </span>
      </div>
    </div>
  );
}

/* ── Quote row ─────────────────────────────────────────────────────────────── */
const QUOTE_COLORS = {
  pending:  { bg: T.goldLt,    color: T.gold    },
  accepted: { bg: T.emeraldLt, color: T.emerald },
  rejected: { bg: T.redLt,     color: T.red     },
};

function QuoteRow({ q }) {
  const s = QUOTE_COLORS[q.status] ?? { bg: '#F3F0EB', color: T.muted };
  return (
    <div style={{ padding: '13px 20px', borderBottom: `1px solid ${T.borderSoft}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: T.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.rfqTitle}</div>
        <div style={{ fontSize: 11.5, color: T.muted, marginTop: 2 }}>{q.totalAmount ? formatCurrency(q.totalAmount) : '—'}</div>
      </div>
      <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 100, background: s.bg, color: s.color, flexShrink: 0, textTransform: 'capitalize' }}>{q.status}</span>
    </div>
  );
}

/* ── Catalog product row ───────────────────────────────────────────────────── */
function CatalogRow({ p, onEdit }) {
  const st = PRODUCT_STATUS[p.status] || PRODUCT_STATUS.draft;
  const imgUrl = resolveImageUrl(p.images?.[0]?.image_url);
  return (
    <div
      onMouseEnter={e => { e.currentTarget.style.background = T.cream; }}
      onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
      style={{ padding: '12px 20px', borderBottom: `1px solid ${T.borderSoft}`, transition: 'background .15s', background: '#fff', display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 44, height: 44, borderRadius: 8, overflow: 'hidden', background: T.cream, flexShrink: 0, border: `1px solid ${T.borderSoft}` }}>
        {imgUrl
          ? <img src={imgUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Package size={18} color={T.muted} /></div>
        }
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: T.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
        <div style={{ fontSize: 11.5, color: T.muted, marginTop: 2 }}>
          {p.base_price ? `₹${Number(p.base_price).toLocaleString('en-IN')}` : 'Price TBD'}
          {p.moq_unit && ` / ${p.moq_unit}`}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 100, background: st.bg, color: st.color }}>{st.label}</span>
        <button onClick={onEdit} title="Edit product"
          style={{ width: 28, height: 28, borderRadius: 8, border: 'none', background: T.navyLt, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Pencil size={12} color={T.navy} />
        </button>
      </div>
    </div>
  );
}

/* ── SupplierDashboard ─────────────────────────────────────────────────────── */
export default function SupplierDashboard() {
  const { userName } = useSelector((s) => s.auth);
  const navigate     = useNavigate();
  const bp           = useBreakpoint();

  const { data: stats,    loading: sl } = useFetchData(() => api.getStats('supplier'));
  const { data: rfqs,     loading: rl } = useFetchData(() => api.getRFQs());
  const { data: quotes,   loading: ql } = useFetchData(() => api.getQuotes());
  const { data: rawProds, loading: pl } = useFetchData(() => api.getProducts());

  const openRFQs      = (rfqs  ?? []).filter(r => r.status === 'active');
  const myQuotes      = (quotes ?? []).slice(0, 5);
  const allProducts   = Array.isArray(rawProds) ? rawProds : [];
  const recentProds   = allProducts.slice(0, 4);
  const activeCount   = allProducts.filter(p => p.status === 'active').length;

  const today     = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
  const firstName = userName?.split(' ')[0] || userName;

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* Welcome bar */}
      <div style={{ display: 'flex', alignItems: bp.isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <p style={{ fontSize: 11.5, fontWeight: 600, color: T.muted, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>{today}</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: bp.isMobile ? 22 : 28, fontWeight: 700, color: T.ink, marginBottom: 4 }}>
            Welcome back, {firstName}
          </h2>
          <p style={{ fontSize: 13, color: T.muted }}>Manage your catalog, respond to RFQs, and grow your business.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {!bp.isMobile && (
            <button onClick={() => navigate('/supplier-dashboard/catalog/new')}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 8, border: `1.5px solid ${T.borderSoft}`, background: '#fff', color: T.ink, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              <Plus size={13} /> List product
            </button>
          )}
          <button onClick={() => navigate('/supplier-dashboard/rfqs')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 8, border: 'none', background: T.emerald, color: '#fff', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            <FileSearch size={13} /> {bp.isMobile ? 'RFQs' : 'Browse RFQs'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: bp.isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: bp.isMobile ? 8 : 14, marginBottom: 24 }}>
        {sl || pl ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 14, border: `1.5px solid ${T.borderSoft}`, padding: '18px 20px', height: 82 }} />
          ))
        ) : (
          <>
            <StatCard icon={Package}    label="Active listings" value={activeCount}              accent={T.emerald} bg={T.emeraldLt} />
            <StatCard icon={FileSearch} label="Open RFQs"       value={stats?.openRfqs ?? '—'}   accent={T.saffron} bg={T.saffronLt} />
            <StatCard icon={Send}       label="Active quotes"   value={stats?.activeQuotes ?? '—'} accent={T.navy}   bg={T.navyLt}    />
            <StatCard icon={DollarSign} label="Total revenue"   value={stats?.revenue ?? '₹0'}   accent={T.gold}    bg={T.goldLt}    />
          </>
        )}
      </div>

      {/* RFQs + Quotes */}
      <div style={{ display: 'grid', gridTemplateColumns: bp.isMobile || bp.isTablet ? '1fr' : '1.2fr 1fr', gap: 16, marginBottom: 16 }}>

        <Panel title="Open RFQs" accent={T.saffron} count={openRFQs.length || null}
          onViewAll={() => navigate('/supplier-dashboard/rfqs')} loading={rl}
          empty={!rl && !openRFQs.length && (
            <div style={{ padding: '28px 20px', textAlign: 'center' }}>
              <FileSearch size={30} color={T.borderSoft} style={{ marginBottom: 10 }} />
              <div style={{ fontSize: 13.5, fontWeight: 600, color: T.ink, marginBottom: 4 }}>No open RFQs</div>
              <div style={{ fontSize: 12, color: T.muted }}>New buyer requests will appear here</div>
            </div>
          )}>
          {openRFQs.slice(0, 5).map(r => (
            <RFQCard key={r.id} r={r} onClick={() => navigate(`/supplier-dashboard/rfqs/${r.id}`)} />
          ))}
        </Panel>

        <Panel title="My Quotes" accent={T.emerald} count={myQuotes.length || null}
          onViewAll={() => navigate('/supplier-dashboard/quotes')} loading={ql}
          empty={!ql && !myQuotes.length && (
            <div style={{ padding: '28px 20px', textAlign: 'center' }}>
              <Send size={30} color={T.borderSoft} style={{ marginBottom: 10 }} />
              <div style={{ fontSize: 13.5, fontWeight: 600, color: T.ink, marginBottom: 4 }}>No quotes yet</div>
              <div style={{ fontSize: 12, color: T.muted }}>Submit a quote on an open RFQ to get started</div>
            </div>
          )}>
          {myQuotes.map(q => <QuoteRow key={q.id} q={q} />)}
        </Panel>
      </div>

      {/* My Catalog */}
      <Panel title="My Catalog" accent={T.navy} count={allProducts.length || null}
        onViewAll={() => navigate('/supplier-dashboard/catalog')} loading={pl}
        empty={!pl && !allProducts.length && (
          <div style={{ padding: '32px 20px', textAlign: 'center' }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: T.emeraldLt, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <Package size={24} color={T.emerald} />
            </div>
            <div style={{ fontSize: 14.5, fontWeight: 700, color: T.ink, marginBottom: 5 }}>No products listed yet</div>
            <div style={{ fontSize: 12.5, color: T.muted, marginBottom: 18 }}>List your first product to start reaching buyers on Globrixa</div>
            <button onClick={() => navigate('/supplier-dashboard/catalog/new')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 22px', borderRadius: 100, border: 'none', background: T.emerald, color: '#fff', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
              <Plus size={14} /> List your first product
            </button>
          </div>
        )}>
        {recentProds.map(p => (
          <CatalogRow key={p.id} p={p} onEdit={() => navigate(`/supplier-dashboard/catalog/${p.id}/edit`)} />
        ))}
        {allProducts.length > 4 && (
          <div style={{ padding: '12px 20px', textAlign: 'center' }}>
            <button onClick={() => navigate('/supplier-dashboard/catalog')}
              style={{ fontSize: 12.5, fontWeight: 600, color: T.navy, background: 'none', border: 'none', cursor: 'pointer' }}>
              View all {allProducts.length} products →
            </button>
          </div>
        )}
      </Panel>
    </div>
  );
}
