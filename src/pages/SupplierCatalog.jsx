// pages/SupplierCatalog.jsx
// Lists all products belonging to this supplier's company.
// Sidebar "Catalog" link → /supplier-dashboard/catalog

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import {
  Plus, Edit2, Trash2, Eye, Package,
  AlertCircle, Loader2, Search, Filter,
} from 'lucide-react';
import { toast } from 'react-toastify';

/* ── Design tokens (hardcoded, no CSS var dependency) ─────────────────────── */
const C = {
  emerald:   '#059669',
  emeraldLt: '#ECFDF5',
  ink:       '#1C1815',
  muted:     '#6B7280',
  border:    '#E5E7EB',
  warm:      '#F9FAFB',
  red:       '#EF4444',
  redLt:     '#FEE2E2',
  amber:     '#D97706',
  amberLt:   '#FEF3C7',
  navy:      '#1E40AF',
  navyLt:    '#EFF6FF',
};

const STATUS_STYLE = {
  active:      { bg: C.emeraldLt, color: C.emerald,  label: 'Active'      },
  draft:       { bg: C.warm,      color: C.muted,    label: 'Draft'       },
  inactive:    { bg: C.amberLt,   color: C.amber,    label: 'Inactive'    },
  out_of_stock:{ bg: C.redLt,     color: C.red,      label: 'Out of Stock'},
};

function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] ?? STATUS_STYLE.draft;
  return (
    <span style={{
      display:      'inline-block',
      padding:      '3px 10px',
      borderRadius: 100,
      fontSize:     11,
      fontWeight:   700,
      background:   s.bg,
      color:        s.color,
    }}>
      {s.label}
    </span>
  );
}

export default function SupplierCatalog() {
  const navigate = useNavigate();

  const [products,  setProducts]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [search,    setSearch]    = useState('');
  const [filter,    setFilter]    = useState('all');   // all | active | draft
  const [deleting,  setDeleting]  = useState(null);    // product id being deleted

  /* ── Fetch ────────────────────────────────────────────────────────────── */
  const fetchProducts = () => {
    setLoading(true);
    setError(null);
    api.getProducts()
      .then(data => setProducts(Array.isArray(data) ? data : []))
      .catch(err  => setError(err.message || 'Failed to load products'))
      .finally(()  => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  /* ── Delete ───────────────────────────────────────────────────────────── */
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await api.deleteProduct(id);
      toast.success('Product deleted');
      setProducts(ps => ps.filter(p => p.id !== id));
    } catch (err) {
      toast.error(err.message || 'Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  /* ── Filtered list ────────────────────────────────────────────────────── */
  const visible = products.filter(p => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || p.status === filter;
    return matchSearch && matchFilter;
  });

  /* ─── Render ────────────────────────────────────────────────────────────── */
  return (
    <div style={{
      fontFamily: "'DM Sans', system-ui, sans-serif",
      display:    'flex',
      flexDirection: 'column',
      gap:        24,
    }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        flexWrap:       'wrap',
        gap:            12,
      }}>
        <div>
          <h1 style={{
            fontFamily:   "'Playfair Display', Georgia, serif",
            fontSize:     24,
            fontWeight:   900,
            color:        C.ink,
            margin:       0,
            letterSpacing: -0.5,
          }}>
            My Catalog
          </h1>
          <p style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>
            {products.length} product{products.length !== 1 ? 's' : ''} listed
          </p>
        </div>

        <button
          onClick={() => navigate('/supplier-dashboard/catalog/new')}
          style={{
            display:      'flex',
            alignItems:   'center',
            gap:          7,
            padding:      '10px 20px',
            borderRadius: 10,
            border:       'none',
            cursor:       'pointer',
            background:   C.emerald,
            color:        '#fff',
            fontFamily:   "'DM Sans', sans-serif",
            fontWeight:   700,
            fontSize:     14,
            boxShadow:    '0 4px 14px rgba(16,185,129,0.25)',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
        >
          <Plus size={15} /> List New Product
        </button>
      </div>

      {/* ── Filters row ─────────────────────────────────────────────────── */}
      <div style={{
        display:    'flex',
        alignItems: 'center',
        gap:        10,
        flexWrap:   'wrap',
      }}>
        {/* Search */}
        <div style={{
          display:      'flex',
          alignItems:   'center',
          gap:          8,
          padding:      '8px 14px',
          borderRadius: 10,
          border:       `1.5px solid ${C.border}`,
          background:   '#fff',
          flex:         '1',
          maxWidth:     320,
        }}>
          <Search size={14} color={C.muted} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products…"
            style={{
              border:     'none',
              outline:    'none',
              fontSize:   13,
              color:      C.ink,
              background: 'transparent',
              width:      '100%',
              fontFamily: "'DM Sans', sans-serif",
            }}
          />
        </div>

        {/* Status filter */}
        {['all', 'active', 'draft', 'inactive'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{
              padding:      '7px 16px',
              borderRadius: 100,
              border:       `1.5px solid ${filter === f ? C.emerald : C.border}`,
              background:   filter === f ? C.emeraldLt : '#fff',
              color:        filter === f ? C.emerald   : C.muted,
              fontSize:     12,
              fontWeight:   600,
              cursor:       'pointer',
              transition:   'all .15s',
              textTransform: 'capitalize',
            }}>
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* ── States ──────────────────────────────────────────────────────── */}
      {loading ? (
        <div style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          gap:            10,
          padding:        '60px 0',
          color:          C.muted,
        }}>
          <Loader2 size={20} style={{ animation: 'spin .7s linear infinite' }} />
          Loading catalog…
        </div>
      ) : error ? (
        <div style={{
          display:        'flex',
          alignItems:     'center',
          gap:            10,
          padding:        '24px',
          borderRadius:   14,
          background:     C.redLt,
          color:          C.red,
          fontSize:       14,
        }}>
          <AlertCircle size={16} />
          {error}
          <button onClick={fetchProducts}
            style={{
              marginLeft:   'auto',
              padding:      '5px 14px',
              borderRadius: 8,
              border:       `1.5px solid ${C.red}`,
              background:   '#fff',
              color:        C.red,
              fontSize:     12,
              fontWeight:   600,
              cursor:       'pointer',
            }}>
            Retry
          </button>
        </div>
      ) : visible.length === 0 ? (

        /* Empty state */
        <div style={{
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          justifyContent: 'center',
          gap:            14,
          padding:        '64px 24px',
          borderRadius:   20,
          border:         `1.5px dashed ${C.border}`,
          background:     '#fff',
          textAlign:      'center',
        }}>
          <div style={{
            width:           56,
            height:          56,
            borderRadius:    16,
            background:      C.emeraldLt,
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'center',
          }}>
            <Package size={24} color={C.emerald} />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.ink }}>
              {search || filter !== 'all' ? 'No products match your filters' : 'No products yet'}
            </div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>
              {search || filter !== 'all'
                ? 'Try adjusting your search or filter'
                : 'Click "List New Product" to add your first item to the marketplace'}
            </div>
          </div>
          {!search && filter === 'all' && (
            <button
              onClick={() => navigate('/supplier-dashboard/catalog/new')}
              style={{
                display:      'flex',
                alignItems:   'center',
                gap:          7,
                padding:      '10px 22px',
                borderRadius: 10,
                border:       'none',
                cursor:       'pointer',
                background:   C.emerald,
                color:        '#fff',
                fontWeight:   700,
                fontSize:     13,
              }}>
              <Plus size={14} /> List Product
            </button>
          )}
        </div>

      ) : (

        /* ── Product table ────────────────────────────────────────────── */
        <div style={{
          background:   '#fff',
          borderRadius: 20,
          border:       `1.5px solid ${C.border}`,
          overflow:     'hidden',
        }}>

          {/* Table header */}
          <div style={{
            display:             'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr 110px',
            gap:                 12,
            padding:             '12px 20px',
            borderBottom:        `1px solid ${C.border}`,
            background:          C.warm,
          }}>
            {['Product', 'Category', 'Base Price', 'Status', 'Actions'].map(h => (
              <span key={h} style={{
                fontSize:        11,
                fontWeight:      700,
                color:           C.muted,
                textTransform:   'uppercase',
                letterSpacing:   '.05em',
              }}>
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          {visible.map((p, idx) => (
            <div
              key={p.id}
              style={{
                display:             'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr 110px',
                gap:                 12,
                padding:             '14px 20px',
                borderBottom:        idx < visible.length - 1 ? `1px solid ${C.border}` : 'none',
                alignItems:          'center',
                transition:          'background .12s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = C.warm; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
            >
              {/* Name */}
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontWeight:   600,
                  fontSize:     14,
                  color:        C.ink,
                  overflow:     'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace:   'nowrap',
                }}>
                  {p.name}
                </div>
                {p.hs_code && (
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
                    HS {p.hs_code}
                  </div>
                )}
              </div>

              {/* Category */}
              <div style={{ fontSize: 13, color: C.muted }}>
                {p.category?.name ?? '—'}
              </div>

              {/* Price */}
              <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>
                {p.base_price ? `₹${Number(p.base_price).toLocaleString('en-IN')}` : '—'}
                {p.moq_unit && (
                  <span style={{ fontSize: 11, color: C.muted, fontWeight: 400 }}>
                    /{p.moq_unit}
                  </span>
                )}
              </div>

              {/* Status */}
              <StatusBadge status={p.status} />

              {/* Actions */}
              <div style={{ display: 'flex', gap: 6 }}>
                <ActionBtn
                  icon={<Edit2 size={13} />}
                  title="Edit"
                  onClick={() => navigate(`/supplier-dashboard/catalog/${p.id}/edit`)}
                  color={C.navy}
                  bg={C.navyLt}
                />
                <ActionBtn
                  icon={deleting === p.id
                    ? <Loader2 size={13} style={{ animation: 'spin .7s linear infinite' }} />
                    : <Trash2 size={13} />}
                  title="Delete"
                  onClick={() => handleDelete(p.id)}
                  color={C.red}
                  bg={C.redLt}
                  disabled={deleting === p.id}
                />
                <ActionBtn
                  icon={<Eye size={13} />}
                  title="View"
                  onClick={() => navigate(`/products/${p.id}`)}
                  color={C.emerald}
                  bg={C.emeraldLt}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ── Tiny icon button ─────────────────────────────────────────────────────── */
function ActionBtn({ icon, title, onClick, color, bg, disabled }) {
  return (
    <button
      title={title}
      onClick={onClick}
      disabled={disabled}
      style={{
        width:          30,
        height:         30,
        borderRadius:   8,
        border:         'none',
        background:     bg,
        color:          color,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        cursor:         disabled ? 'not-allowed' : 'pointer',
        opacity:        disabled ? 0.6 : 1,
        flexShrink:     0,
        transition:     'transform .1s',
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.transform = 'scale(1.1)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      {icon}
    </button>
  );
}