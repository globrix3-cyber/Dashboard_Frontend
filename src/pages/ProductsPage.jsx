import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { api } from '../services/api';
import { useFetchData } from '../hooks/useFetchData';
import { Spinner, EmptyState } from '../components/UI';
import { ShoppingBag, Search, BadgeCheck, Filter, Grid3X3 } from 'lucide-react';
import { toast } from 'react-toastify';

const C = {
  saffron: '#D9600A', saffronLt: '#FDF1E8',
  emerald: '#1A7A4A', emeraldLt: '#EAF5EF',
  navy: '#1B3175', navyLt: '#EEF2FB',
  gold: '#B8730A', goldLt: '#FDF5E2',
  ink: '#1C1815', inkSoft: '#3D3731',
  muted: '#7A7068', borderSoft: '#E6DED0', cream: '#F4EFE4',
};

export default function ProductsPage() {
  const navigate  = useNavigate();
  const { userRole } = useSelector(s => s.auth);
  const [search, setSearch] = useState('');
  const [cat, setCat]       = useState('All');

  const { data: raw = [],      loading, error } = useFetchData(() => api.getProducts());
  const { data: catRaw = [] }                   = useFetchData(() => api.getCategories());

  const products = Array.isArray(raw) ? raw : [];
  const rootCats = (Array.isArray(catRaw) ? catRaw : []).filter(c => !c.parent_id);
  const catPills = ['All', ...rootCats.map(c => c.name)];

  const filtered = products.filter(p => {
    const name    = p.name          || '';
    const catName = p.category_name || '';
    const matchCat = cat === 'All' || catName.toLowerCase().includes(cat.toLowerCase());
    const matchQ   = !search ||
      name.toLowerCase().includes(search.toLowerCase()) ||
      catName.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchQ;
  });

  const handleGetQuote = async (e, product) => {
    e.stopPropagation();
    if (userRole === 'buyer') {
      navigate('/buyer-dashboard/rfqs/new');
    } else if (userRole === 'supplier') {
      toast.info('Switch to a buyer account to request quotes.');
    } else {
      navigate('/');
    }
  };

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* Hero */}
      <div style={{
        borderRadius: 20, padding: '32px 36px', marginBottom: 32,
        background: C.navy, position: 'relative', overflow: 'hidden',
        boxShadow: `0 8px 32px ${C.navy}44`,
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.06, backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='46' fill='none' stroke='%23fff' stroke-width='.5' stroke-dasharray='3 7'/%3E%3C/svg%3E")`, backgroundSize: '100px 100px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.08)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 18 }}>🇮🇳</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '.12em', textTransform: 'uppercase' }}>Global Catalog</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 900, color: '#fff', margin: '0 0 8px', letterSpacing: '-0.5px' }}>
            Product Marketplace
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 14, margin: 0 }}>
            Browse verified products from GST-certified Indian manufacturers &amp; exporters
          </p>
        </div>
      </div>

      {/* Quick-access: browse by category */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, padding: '12px 16px', background: '#fff', borderRadius: 14, border: `1.5px solid ${C.borderSoft}` }}>
        <Grid3X3 size={16} color={C.navy} />
        <span style={{ fontSize: 13, fontWeight: 600, color: C.inkSoft }}>Browse by category:</span>
        <button onClick={() => navigate('/categories')} style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 100,
          border: 'none', background: C.navy, color: '#fff', cursor: 'pointer',
          fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 12,
        }}>
          Open Category Browser
        </button>
      </div>

      {/* Search + filter row */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
          <Search size={14} color={C.muted} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search products…"
            style={{ width: '100%', padding: '11px 14px 11px 38px', borderRadius: 12, border: `1.5px solid ${C.borderSoft}`, background: '#fff', fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.ink, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
            onFocus={e => { e.currentTarget.style.borderColor = C.navy; }}
            onBlur={e => { e.currentTarget.style.borderColor = C.borderSoft; }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: C.muted, fontWeight: 500 }}>
          <Filter size={13} /> {filtered.length} product{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Category pills — from real API */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
        {catPills.map(c => (
          <button key={c} onClick={() => setCat(c)} style={{
            padding: '7px 16px', borderRadius: 100, border: `1.5px solid ${cat === c ? C.navy : C.borderSoft}`,
            background: cat === c ? C.navy : '#fff', color: cat === c ? '#fff' : C.inkSoft,
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
            transition: 'all 0.15s',
          }}>
            {c}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? <Spinner /> : error ? (
        <div style={{ padding: 32, textAlign: 'center', color: C.muted }}>
          <p style={{ marginBottom: 12 }}>Could not load products.</p>
          <button onClick={() => window.location.reload()} style={{ padding: '8px 20px', borderRadius: 100, background: C.saffron, color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>Retry</button>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={ShoppingBag} title="No products found" desc="Try a different search or category filter." />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 18 }}>
          {filtered.map(p => (
            <div key={p.id} onClick={() => navigate(`/products/${p.id}`)} style={{
              background: '#fff', borderRadius: 18, border: `1.5px solid ${C.borderSoft}`,
              overflow: 'hidden', cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
              boxShadow: '0 1px 4px rgba(28,24,21,0.05)',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(27,49,117,0.12)'; e.currentTarget.style.borderColor = C.navy; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(28,24,21,0.05)'; e.currentTarget.style.borderColor = C.borderSoft; }}>

              {/* Image placeholder */}
              <div style={{ height: 160, background: `linear-gradient(135deg, ${C.cream}, #E8E2D6)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                {p.images?.[0]?.image_url
                  ? <img src={p.images[0].image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <ShoppingBag size={44} color={C.borderSoft} />
                }
                {p.status === 'active' && (
                  <span style={{ position: 'absolute', top: 10, right: 10, display: 'flex', alignItems: 'center', gap: 4, background: C.emeraldLt, color: C.emerald, fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 100 }}>
                    <BadgeCheck size={10} /> Verified
                  </span>
                )}
              </div>

              <div style={{ padding: '16px 18px 18px' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.navy, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                  {p.category_name || '—'}
                </div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 15, color: C.ink, marginBottom: 10, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {p.name}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
                  <div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 20, color: C.ink, letterSpacing: '-0.5px' }}>
                      {p.base_price ? `₹${Number(p.base_price).toLocaleString('en-IN')}` : 'On Request'}
                    </div>
                    {p.moq_unit && (
                      <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>MOQ: {p.min_order_quantity} {p.moq_unit}</div>
                    )}
                  </div>
                  <button onClick={e => handleGetQuote(e, p)} style={{
                    padding: '8px 14px', borderRadius: 100, border: 'none', cursor: 'pointer',
                    background: C.saffron, color: '#fff',
                    fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 12,
                    boxShadow: '0 3px 10px rgba(217,96,10,0.28)',
                    transition: 'background 0.15s, transform 0.12s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#BF530A'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = C.saffron; e.currentTarget.style.transform = 'none'; }}>
                    Get Quote
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
