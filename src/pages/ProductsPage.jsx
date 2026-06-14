import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { api } from '../services/api';
import { useFetchData } from '../hooks/useFetchData';
import { Spinner, EmptyState } from '../components/UI';
import { ShoppingBag, BadgeCheck, Heart, ChevronDown } from 'lucide-react';
import { toast } from 'react-toastify';
import { IMG } from './landing/images';

const CATEGORY_IMAGES = [
  IMG.jaipurTextiles, IMG.blueCeramicVases, IMG.wovenBaskets, IMG.ceramicKitchenware,
  IMG.fabricRolls, IMG.indianJewelry, IMG.vadodaraPottery, IMG.chennaBaskets,
];

const SORT_OPTIONS = [
  { label: 'Featured',          value: 'featured'   },
  { label: 'Newest first',      value: 'newest'     },
  { label: 'Price: low → high', value: 'price_asc'  },
  { label: 'Price: high → low', value: 'price_desc' },
];

export default function ProductsPage() {
  const navigate                         = useNavigate();
  const [searchParams, setSearchParams]  = useSearchParams();
  const { userRole }                     = useSelector(s => s.auth);
  const [search, setSearch]              = useState(searchParams.get('search') || '');
  const [cat, setCat]                    = useState(searchParams.get('category') || 'All');
  const [sort, setSort]                  = useState('featured');
  const [showSort, setShowSort]          = useState(false);
  const [favs, setFavs]                  = useState(new Set());

  useEffect(() => { setSearch(searchParams.get('search') || ''); }, [searchParams]);
  useEffect(() => { setCat(searchParams.get('category') || 'All'); }, [searchParams]);

  const selectCat = (c) => {
    setCat(c);
    const p = c === 'All' ? {} : { category: c };
    if (search) p.search = search;
    setSearchParams(p, { replace: true });
  };

  const toggleFav = (e, id) => {
    e.stopPropagation();
    setFavs(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const { data: raw = [], loading, error } = useFetchData(() => api.getProducts());
  const { data: catRaw = [] }              = useFetchData(() => api.getCategories());

  const products  = Array.isArray(raw)    ? raw    : [];
  const rootCats  = (Array.isArray(catRaw) ? catRaw : []).filter(c => !c.parent_id);
  const sideItems = ['All', ...rootCats.map(c => c.name)];

  let filtered = products.filter(p => {
    const name    = p.name          || '';
    const catName = p.category_name || '';
    const matchCat = cat === 'All' || catName.toLowerCase().includes(cat.toLowerCase());
    const matchQ   = !search ||
      name.toLowerCase().includes(search.toLowerCase()) ||
      catName.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchQ;
  });
  if (sort === 'price_asc')  filtered = [...filtered].sort((a, b) => (Number(a.base_price) || 0) - (Number(b.base_price) || 0));
  if (sort === 'price_desc') filtered = [...filtered].sort((a, b) => (Number(b.base_price) || 0) - (Number(a.base_price) || 0));
  if (sort === 'newest')     filtered = [...filtered].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

  const handleGetQuote = (e, p) => {
    e.stopPropagation();
    if (userRole === 'buyer') navigate('/buyer-dashboard/rfqs/new');
    else if (userRole === 'supplier') toast.info('Switch to a buyer account to request quotes.');
    else navigate('/');
  };

  const showCategoryTiles = cat === 'All' && !search && rootCats.length > 0;

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: '#1C1815' }}
      onClick={() => showSort && setShowSort(false)}>

      {/* ── Category tiles (Faire-style top grid, only on "All" + no search) ── */}
      {showCategoryTiles && (
        <div style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 14px', letterSpacing: '-0.3px' }}>
            Browse by category
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {rootCats.slice(0, 8).map((c, i) => (
              <div key={c.id} onClick={() => selectCat(c.name)}
                style={{ display: 'flex', alignItems: 'center', background: '#F5F2EE', borderRadius: 10, overflow: 'hidden', cursor: 'pointer', border: '1px solid #EDE8E0', transition: 'box-shadow .15s, transform .15s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(28,24,21,.1)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{ width: 70, height: 70, flexShrink: 0, overflow: 'hidden' }}>
                  <img src={CATEGORY_IMAGES[i % CATEGORY_IMAGES.length]} alt={c.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <span style={{ padding: '0 14px', fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Main area: sidebar + grid ───────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>

        {/* Sidebar */}
        <div style={{ width: 196, flexShrink: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid #EDE8E0' }}>
            {search ? `"${search}"` : 'All products'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {sideItems.map(c => (
              <button key={c} onClick={() => selectCat(c)} style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '7px 10px', borderRadius: 7, border: 'none',
                fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                fontWeight: cat === c ? 700 : 400,
                color: cat === c ? '#1C1815' : '#7A7068',
                background: cat === c ? '#EDE8E0' : 'transparent',
                cursor: 'pointer', transition: 'background .1s, color .1s',
              }}
                onMouseEnter={e => { if (cat !== c) { e.currentTarget.style.background = '#F5F2EE'; e.currentTarget.style.color = '#1C1815'; } }}
                onMouseLeave={e => { if (cat !== c) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#7A7068'; } }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Sort / count bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <span style={{ fontSize: 13, color: '#7A7068' }}>
              <strong style={{ color: '#1C1815' }}>{filtered.length}</strong> product{filtered.length !== 1 ? 's' : ''}
            </span>
            <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
              <button onClick={() => setShowSort(o => !o)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: '1.5px solid #EDE8E0', background: '#fff', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: '#1C1815' }}>
                Sort by {SORT_OPTIONS.find(o => o.value === sort)?.label} <ChevronDown size={13} />
              </button>
              {showSort && (
                <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 4px)', background: '#fff', border: '1.5px solid #EDE8E0', borderRadius: 10, overflow: 'hidden', zIndex: 50, minWidth: 190, boxShadow: '0 6px 24px rgba(28,24,21,.1)' }}>
                  {SORT_OPTIONS.map(o => (
                    <button key={o.value} onClick={() => { setSort(o.value); setShowSort(false); }}
                      style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px', border: 'none', background: sort === o.value ? '#F5F2EE' : '#fff', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: sort === o.value ? 700 : 400, color: '#1C1815' }}>
                      {o.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product grid */}
          {loading ? <Spinner /> : error ? (
            <div style={{ padding: 32, textAlign: 'center', color: '#7A7068' }}>
              <p style={{ marginBottom: 12 }}>Could not load products.</p>
              <button onClick={() => window.location.reload()} style={{ padding: '8px 20px', borderRadius: 100, background: '#D9600A', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>Retry</button>
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState icon={ShoppingBag} title="No products found" desc="Try a different search or category." />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 14 }}>
              {filtered.map(p => (
                <div key={p.id} onClick={() => navigate(`/products/${p.id}`)}
                  style={{ background: '#fff', borderRadius: 12, border: '1px solid #EDE8E0', overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow .18s, transform .18s' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(28,24,21,.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
                >
                  {/* Image */}
                  <div style={{ height: 195, background: '#F5F2EE', position: 'relative', overflow: 'hidden' }}>
                    {p.images?.[0]?.image_url
                      ? <img src={p.images[0].image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ShoppingBag size={40} color="#C8C0B8" /></div>
                    }
                    {/* Top overlay: verified + heart */}
                    <div style={{ position: 'absolute', top: 10, left: 10, right: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      {p.status === 'active' && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, background: 'rgba(255,255,255,.92)', color: '#1A7A4A', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 100, backdropFilter: 'blur(4px)' }}>
                          <BadgeCheck size={9} /> Verified
                        </span>
                      )}
                      <button onClick={e => toggleFav(e, p.id)}
                        style={{ marginLeft: 'auto', width: 30, height: 30, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(4px)' }}>
                        <Heart size={14} fill={favs.has(p.id) ? '#D9600A' : 'none'} color={favs.has(p.id) ? '#D9600A' : '#7A7068'} />
                      </button>
                    </div>
                  </div>

                  {/* Text */}
                  <div style={{ padding: '12px 14px 14px' }}>
                    <div style={{ fontSize: 10, color: '#9A9088', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 3 }}>
                      {p.category_name || '—'}
                    </div>
                    <div style={{ fontSize: 13.5, fontWeight: 500, color: '#1C1815', lineHeight: 1.35, marginBottom: 10, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {p.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 6 }}>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-.3px' }}>
                          {p.base_price ? `₹${Number(p.base_price).toLocaleString('en-IN')}` : 'On Request'}
                        </div>
                        {p.moq_unit && <div style={{ fontSize: 11, color: '#9A9088', marginTop: 1 }}>MOQ {p.min_order_quantity} {p.moq_unit}</div>}
                      </div>
                      <button onClick={e => handleGetQuote(e, p)}
                        style={{ flexShrink: 0, padding: '6px 12px', borderRadius: 7, border: '1.5px solid #1C1815', background: '#fff', color: '#1C1815', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 12, transition: 'background .12s, color .12s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#1C1815'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#1C1815'; }}>
                        Quote
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
