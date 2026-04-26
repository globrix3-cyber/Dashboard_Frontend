import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Plus, Edit2, Trash2, Eye, Package, Search, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const C = {
  saffron: '#D9600A', saffronLt: '#FDF1E8',
  emerald: '#1A7A4A', emeraldLt: '#EAF5EF',
  navy: '#1B3175', navyLt: '#EEF2FB',
  gold: '#B8730A', goldLt: '#FDF5E2',
  ink: '#1C1815', inkSoft: '#3D3731',
  muted: '#7A7068', borderSoft: '#E6DED0', cream: '#F4EFE4',
  red: '#DC2626', redLt: '#FEF2F2',
};

const STATUS = {
  active:       { bg: C.emeraldLt, color: C.emerald, label: 'Active'      },
  draft:        { bg: C.cream,     color: C.muted,   label: 'Draft'       },
  inactive:     { bg: C.goldLt,    color: C.gold,    label: 'Inactive'    },
  out_of_stock: { bg: C.redLt,     color: C.red,     label: 'Out of Stock'},
};

function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS.draft;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 100, background: s.bg, color: s.color }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.color }} /> {s.label}
    </span>
  );
}

function ActionBtn({ icon, title, onClick, color, bg, disabled }) {
  return (
    <button title={title} onClick={onClick} disabled={disabled} style={{
      width: 30, height: 30, borderRadius: 8, border: 'none', background: bg, color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.55 : 1,
      flexShrink: 0, transition: 'transform 0.1s',
    }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.transform = 'scale(1.1)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}>
      {icon}
    </button>
  );
}

export default function SupplierCatalog() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('all');
  const [deleting, setDeleting] = useState(null);

  const load = () => {
    setLoading(true); setError(null);
    api.getProducts()
      .then(d => setProducts(Array.isArray(d) ? d : []))
      .catch(e => setError(e.message || 'Failed to load products'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await api.deleteProduct(id);
      toast.success('Product deleted');
      setProducts(ps => ps.filter(p => p.id !== id));
    } catch (e) {
      toast.error(e.message || 'Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  const visible = products.filter(p => {
    const matchSearch = !search || p.name?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || p.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14, paddingBottom: 22, borderBottom: `1px solid ${C.borderSoft}` }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 27, fontWeight: 900, color: C.ink, margin: 0, letterSpacing: '-0.4px' }}>My Catalog</h1>
          <p style={{ fontSize: 13, color: C.muted, marginTop: 6 }}>
            {loading ? '…' : `${products.length} product${products.length !== 1 ? 's' : ''} listed`}
          </p>
        </div>
        <button onClick={() => navigate('/supplier-dashboard/catalog/new')} style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '11px 22px', borderRadius: 100, border: 'none',
          cursor: 'pointer', background: C.emerald, color: '#fff',
          fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13,
          boxShadow: '0 4px 14px rgba(26,122,74,0.28)', transition: 'transform 0.12s',
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}>
          <Plus size={15} /> List New Product
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px', borderRadius: 12, border: `1.5px solid ${C.borderSoft}`, background: '#fff', flex: 1, maxWidth: 300 }}>
          <Search size={14} color={C.muted} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…"
            style={{ border: 'none', outline: 'none', fontSize: 13, color: C.ink, background: 'transparent', width: '100%', fontFamily: "'DM Sans', sans-serif" }} />
        </div>
        {['all', 'active', 'draft', 'inactive'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '8px 16px', borderRadius: 100, cursor: 'pointer',
            border: `1.5px solid ${filter === f ? C.emerald : C.borderSoft}`,
            background: filter === f ? C.emeraldLt : '#fff',
            color: filter === f ? C.emerald : C.muted,
            fontSize: 12, fontWeight: 600, textTransform: 'capitalize', transition: 'all 0.15s',
          }}>{f}</button>
        ))}
      </div>

      {/* States */}
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '60px 0', color: C.muted }}>
          <Loader2 size={20} style={{ animation: 'spin 0.8s linear infinite' }} /> Loading catalog…
        </div>
      ) : error ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 20, borderRadius: 14, background: C.redLt, color: C.red, fontSize: 14 }}>
          <AlertCircle size={16} /> {error}
          <button onClick={load} style={{ marginLeft: 'auto', padding: '5px 14px', borderRadius: 8, border: `1.5px solid ${C.red}`, background: '#fff', color: C.red, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Retry</button>
        </div>
      ) : visible.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: '56px 24px', borderRadius: 20, border: `1.5px dashed ${C.borderSoft}`, background: '#fff', textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: C.emeraldLt, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Package size={26} color={C.emerald} />
          </div>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 800, color: C.ink }}>
              {search || filter !== 'all' ? 'No products match your filters' : 'No products yet'}
            </div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 5 }}>
              {search || filter !== 'all' ? 'Adjust your search or filter' : 'List your first product to start selling globally'}
            </div>
          </div>
          {!search && filter === 'all' && (
            <button onClick={() => navigate('/supplier-dashboard/catalog/new')} style={{
              display: 'flex', alignItems: 'center', gap: 7, padding: '10px 22px', borderRadius: 100,
              border: 'none', cursor: 'pointer', background: C.emerald, color: '#fff',
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13,
            }}>
              <Plus size={14} /> List Product
            </button>
          )}
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 18, border: `1.5px solid ${C.borderSoft}`, overflow: 'hidden' }}>
          <div style={{ borderTop: `3px solid ${C.emerald}` }} />
          {/* Header row */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 110px', gap: 12, padding: '12px 22px', borderBottom: `1px solid ${C.borderSoft}`, background: C.cream }}>
            {['Product', 'Category', 'Base Price', 'Status', 'Actions'].map(h => (
              <span key={h} style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{h}</span>
            ))}
          </div>
          {visible.map((p, i) => (
            <div key={p.id} style={{
              display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 110px', gap: 12,
              padding: '15px 22px', borderBottom: i < visible.length - 1 ? `1px solid ${C.borderSoft}` : 'none',
              alignItems: 'center', transition: 'background 0.12s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = C.cream; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: C.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                {p.hs_code && <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>HS {p.hs_code}</div>}
              </div>
              <div style={{ fontSize: 13, color: C.muted }}>{p.category_name || '—'}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>
                {p.base_price ? `₹${Number(p.base_price).toLocaleString('en-IN')}` : '—'}
                {p.moq_unit && <span style={{ fontSize: 11, color: C.muted, fontWeight: 400 }}>/{p.moq_unit}</span>}
              </div>
              <StatusBadge status={p.status} />
              <div style={{ display: 'flex', gap: 6 }}>
                <ActionBtn icon={<Edit2 size={13} />} title="Edit" onClick={() => navigate(`/supplier-dashboard/catalog/${p.id}/edit`)} color={C.navy} bg={C.navyLt} />
                <ActionBtn icon={deleting === p.id ? <Loader2 size={13} style={{ animation: 'spin 0.7s linear infinite' }} /> : <Trash2 size={13} />} title="Delete" onClick={() => handleDelete(p.id)} color={C.red} bg={C.redLt} disabled={deleting === p.id} />
                <ActionBtn icon={<Eye size={13} />} title="View" onClick={() => navigate(`/products/${p.id}`)} color={C.emerald} bg={C.emeraldLt} />
              </div>
            </div>
          ))}
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
