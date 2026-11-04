import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { api } from '../services/api';
import { useFetchData } from '../hooks/useFetchData';
import { Spinner, EmptyState } from '../components/UI';
import { ShoppingBag, BadgeCheck, Heart, ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { IMG } from './landing/images';
import { imageProps } from '../utils/helpers';
import { useCurrency } from '../hooks/useCurrency';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { useWishlist } from '../hooks/useWishlist';

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

const PAGE_SIZE = 24;

export default function ProductsPage() {
  const navigate                         = useNavigate();
  const [searchParams, setSearchParams]  = useSearchParams();
  const { userRole }                     = useSelector(s => s.auth);
  const { fmt }                          = useCurrency();
  const bp                               = useBreakpoint();
  const [search, setSearch]              = useState(searchParams.get('search') || '');
  const [cat, setCat]                    = useState(searchParams.get('category') || 'All');
  const [sort, setSort]                  = useState('featured');
  const [showSort, setShowSort]          = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const wishlist                         = useWishlist();
  const [paging, setPaging]              = useState({ key: '', count: PAGE_SIZE });
  const [prevParams, setPrevParams]      = useState(searchParams);

  // Keep search/category in sync with the URL (adjust-state-during-render pattern).
  if (searchParams !== prevParams) {
    setPrevParams(searchParams);
    setSearch(searchParams.get('search') || '');
    setCat(searchParams.get('category') || 'All');
  }

  // Paging resets to PAGE_SIZE whenever category/search/sort changes.
  const pageKey      = `${cat}|${search}|${sort}`;
  const visibleCount = paging.key === pageKey ? paging.count : PAGE_SIZE;
  const showMore     = () => setPaging({ key: pageKey, count: visibleCount + PAGE_SIZE });

  const selectCat = (c) => {
    setCat(c);
    const p = c === 'All' ? {} : { category: c };
    if (search) p.search = search;
    setSearchParams(p, { replace: true });
    setShowMobileFilter(false);
  };

  const toggleFav = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    wishlist.toggle(id);
  };

  const { data: raw = [], loading, error } = useFetchData(() => api.getProducts());
  const { data: catRaw = [] }              = useFetchData(() => api.getCategories());

  const products   = Array.isArray(raw)    ? raw    : [];
  const categories = useMemo(() => (Array.isArray(catRaw) ? catRaw : []), [catRaw]);
  const rootCats   = categories.filter(c => !c.parent_id);
  const sideItems  = ['All', ...rootCats.map(c => c.name)];

  const rootNameById = useMemo(() => {
    const byId = {};
    categories.forEach(c => { byId[c.id] = c; });
    const map = {};
    categories.forEach(c => {
      let cur = c;
      while (cur?.parent_id && byId[cur.parent_id]) cur = byId[cur.parent_id];
      map[c.id] = cur?.name;
    });
    return map;
  }, [categories]);

  let filtered = products.filter(p => {
    const name     = p.name          || '';
    const catName  = p.category_name || '';
    const rootName = rootNameById[p.category_id] || catName;
    const matchCat = cat === 'All' || rootName.toLowerCase() === cat.toLowerCase() || catName.toLowerCase() === cat.toLowerCase();
    const matchQ   = !search ||
      name.toLowerCase().includes(search.toLowerCase()) ||
      catName.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchQ;
  });
  if (sort === 'price_asc')  filtered = [...filtered].sort((a, b) => (Number(a.base_price) || 0) - (Number(b.base_price) || 0));
  if (sort === 'price_desc') filtered = [...filtered].sort((a, b) => (Number(b.base_price) || 0) - (Number(a.base_price) || 0));
  if (sort === 'newest')     filtered = [...filtered].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

  const handleGetQuote = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (userRole === 'buyer') navigate('/buyer-dashboard/rfqs/new');
    else if (userRole === 'supplier') toast.info('Switch to a buyer account to request quotes.');
    else navigate('/');
  };

  const showCategoryTiles = cat === 'All' && !search && rootCats.length > 0;

  /* ── Sidebar panel (shared between desktop sidebar and mobile drawer) ── */
  const renderSidebar = () => (
    <>
      <div style={{ fontSize: 12, fontWeight: 700, color: '#79634E', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid #E3D5C1' }}>
        {search ? `"${search}"` : 'Categories'}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {sideItems.map(c => (
          <button key={c} onClick={() => selectCat(c)} style={{
            display: 'block', width: '100%', textAlign: 'left',
            padding: '9px 12px', borderRadius: 8, border: 'none',
            fontFamily: "'DM Sans', sans-serif", fontSize: 13.5,
            fontWeight: cat === c ? 700 : 400,
            color: cat === c ? '#5B4632' : '#79634E',
            background: cat === c ? '#E3D5C1' : 'transparent',
            cursor: 'pointer', transition: 'background .1s, color .1s',
          }}
            onMouseEnter={e => { if (cat !== c) { e.currentTarget.style.background = '#E3D5C1'; e.currentTarget.style.color = '#5B4632'; } }}
            onMouseLeave={e => { if (cat !== c) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#79634E'; } }}
          >
            {c}
          </button>
        ))}
      </div>
    </>
  );

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: '#5B4632' }}
      onClick={() => showSort && setShowSort(false)}>

      {/* ── Category tiles ───────────────────────────────────────────────── */}
      {showCategoryTiles && (
        <div style={{ marginBottom: bp.isMobile ? 24 : 36 }}>
          <h2 style={{ fontSize: bp.isMobile ? 16 : 20, fontWeight: 700, margin: `0 0 ${bp.isMobile ? 10 : 14}px`, letterSpacing: '-0.3px' }}>
            Browse by category
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: bp.isMobile ? 'repeat(2, 1fr)' : bp.isTablet ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)', gap: bp.isMobile ? 8 : 10 }}>
            {rootCats.slice(0, bp.isMobile ? 6 : 8).map((c, i) => (
              <div key={c.id} onClick={() => selectCat(c.name)}
                style={{ display: 'flex', alignItems: 'center', background: '#E3D5C1', borderRadius: 10, overflow: 'hidden', cursor: 'pointer', border: '1px solid #E3D5C1', transition: 'box-shadow .15s, transform .15s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(43,32,22,.1)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{ width: bp.isMobile ? 52 : 70, height: bp.isMobile ? 52 : 70, flexShrink: 0, overflow: 'hidden' }}>
                  <img loading="lazy" decoding="async" src={CATEGORY_IMAGES[i % CATEGORY_IMAGES.length]} alt={c.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <span style={{ padding: bp.isMobile ? '0 10px' : '0 14px', fontSize: bp.isMobile ? 11.5 : 13, fontWeight: 600, lineHeight: 1.3 }}>{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Mobile: filter bar ───────────────────────────────────────────── */}
      {bp.isMobile && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          <button
            onClick={e => { e.stopPropagation(); setShowMobileFilter(o => !o); }}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: `1.5px solid ${cat !== 'All' ? '#C8792C' : '#E3D5C1'}`, background: cat !== 'All' ? '#FDF9F1' : '#FDF9F1', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: cat !== 'All' ? '#C8792C' : '#5B4632', flex: 1 }}
          >
            <SlidersHorizontal size={13} />
            {cat !== 'All' ? cat : 'All categories'}
          </button>
          <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowSort(o => !o)}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 12px', borderRadius: 8, border: '1.5px solid #E3D5C1', background: '#FDF9F1', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: '#5B4632', whiteSpace: 'nowrap' }}>
              Sort <ChevronDown size={12} />
            </button>
            {showSort && (
              <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 4px)', background: '#FDF9F1', border: '1.5px solid #E3D5C1', borderRadius: 10, overflow: 'hidden', zIndex: 50, minWidth: 180, boxShadow: '0 6px 24px rgba(43,32,22,.1)' }}>
                {SORT_OPTIONS.map(o => (
                  <button key={o.value} onClick={() => { setSort(o.value); setShowSort(false); }}
                    style={{ display: 'block', width: '100%', textAlign: 'left', padding: '11px 14px', border: 'none', background: sort === o.value ? '#E3D5C1' : '#FDF9F1', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: sort === o.value ? 700 : 400, color: '#5B4632' }}>
                    {o.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Mobile category drawer ───────────────────────────────────────── */}
      {bp.isMobile && showMobileFilter && (
        <>
          <div onClick={() => setShowMobileFilter(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(43,32,22,.4)', zIndex: 200 }} />
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#FDF9F1', borderRadius: '20px 20px 0 0', padding: '20px 18px 32px', zIndex: 201, maxHeight: '70vh', overflowY: 'auto', boxShadow: '0 -8px 32px rgba(43,32,22,.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#5B4632' }}>Filter by category</span>
              <button onClick={() => setShowMobileFilter(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                <X size={18} color="#79634E" />
              </button>
            </div>
            {renderSidebar()}
          </div>
        </>
      )}

      {/* ── Main area: sidebar + grid ───────────────────────────────────── */}
      <div style={{ display: 'flex', gap: bp.isTablet ? 20 : 28, alignItems: 'flex-start' }}>

        {/* Sidebar — desktop & tablet only */}
        {!bp.isMobile && (
          <div style={{ width: bp.isTablet ? 160 : 196, flexShrink: 0 }}>
            {renderSidebar()}
          </div>
        )}

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Sort / count bar — desktop & tablet */}
          {!bp.isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <span style={{ fontSize: 13, color: '#79634E' }}>
                <strong style={{ color: '#5B4632' }}>{filtered.length}</strong> product{filtered.length !== 1 ? 's' : ''}
              </span>
              <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
                <button onClick={() => setShowSort(o => !o)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: '1.5px solid #E3D5C1', background: '#FDF9F1', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: '#5B4632' }}>
                  {SORT_OPTIONS.find(o => o.value === sort)?.label} <ChevronDown size={13} />
                </button>
                {showSort && (
                  <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 4px)', background: '#FDF9F1', border: '1.5px solid #E3D5C1', borderRadius: 10, overflow: 'hidden', zIndex: 50, minWidth: 190, boxShadow: '0 6px 24px rgba(43,32,22,.1)' }}>
                    {SORT_OPTIONS.map(o => (
                      <button key={o.value} onClick={() => { setSort(o.value); setShowSort(false); }}
                        style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px', border: 'none', background: sort === o.value ? '#E3D5C1' : '#FDF9F1', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: sort === o.value ? 700 : 400, color: '#5B4632' }}>
                        {o.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mobile: product count */}
          {bp.isMobile && (
            <div style={{ fontSize: 12, color: '#79634E', marginBottom: 12 }}>
              <strong style={{ color: '#5B4632' }}>{filtered.length}</strong> product{filtered.length !== 1 ? 's' : ''}
              {cat !== 'All' ? ` in ${cat}` : ''}
            </div>
          )}

          {/* Product grid */}
          {loading ? <Spinner /> : error ? (
            <div style={{ padding: 32, textAlign: 'center', color: '#79634E' }}>
              <p style={{ marginBottom: 12 }}>Could not load products.</p>
              <button onClick={() => window.location.reload()} style={{ padding: '8px 20px', borderRadius: 100, background: '#C8792C', color: '#2B2016', border: 'none', cursor: 'pointer', fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>Retry</button>
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState icon={ShoppingBag} title="No products found" desc="Try a different search or category." />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: bp.isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(210px, 1fr))', gap: bp.isMobile ? 10 : 14 }}>
              {filtered.slice(0, visibleCount).map(p => (
                <Link key={p.id} to={`/products/${p.id}`}
                  style={{ display: 'block', background: '#FDF9F1', borderRadius: bp.isMobile ? 10 : 12, border: '1px solid #E3D5C1', overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow .18s, transform .18s', textDecoration: 'none', color: 'inherit' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(43,32,22,.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
                >
                  {/* Image */}
                  <div style={{ height: bp.isMobile ? 150 : 195, background: '#E3D5C1', position: 'relative', overflow: 'hidden' }}>
                    {p.images?.[0]?.image_url
                      ? <img loading="lazy" decoding="async" {...imageProps(p.images[0].image_url, 300)} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ShoppingBag size={40} color="#E3D5C1" /></div>
                    }
                    <div style={{ position: 'absolute', top: 8, left: 8, right: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      {p.status === 'active' && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, background: 'rgba(253,249,241,.92)', color: '#1A7A4A', fontSize: 9, fontWeight: 700, padding: '3px 7px', borderRadius: 100, backdropFilter: 'blur(4px)' }}>
                          <BadgeCheck size={8} /> Verified
                        </span>
                      )}
                      <button onClick={e => toggleFav(e, p.id)}
                        aria-label={wishlist.has(p.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                        style={{ marginLeft: 'auto', width: 28, height: 28, borderRadius: '50%', border: 'none', background: 'rgba(253,249,241,.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(4px)' }}>
                        <Heart size={13} fill={wishlist.has(p.id) ? '#C8792C' : 'none'} color={wishlist.has(p.id) ? '#C8792C' : '#79634E'} />
                      </button>
                    </div>
                  </div>

                  {/* Text */}
                  <div style={{ padding: bp.isMobile ? '9px 10px 11px' : '12px 14px 14px' }}>
                    <div style={{ fontSize: 9, color: '#79634E', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 2 }}>
                      {p.category_name || '—'}
                    </div>
                    <div style={{ fontSize: bp.isMobile ? 12 : 13.5, fontWeight: 500, color: '#5B4632', lineHeight: 1.35, marginBottom: bp.isMobile ? 7 : 10, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {p.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 4 }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: bp.isMobile ? 13 : 15, fontWeight: 700, letterSpacing: '-.3px' }}>
                          {p.base_price ? fmt(p.base_price) : 'On Request'}
                        </div>
                        {p.moq_unit && !bp.isMobile && <div style={{ fontSize: 11, color: '#79634E', marginTop: 1 }}>MOQ {p.min_order_quantity} {p.moq_unit}</div>}
                      </div>
                      <button onClick={handleGetQuote}
                        style={{ flexShrink: 0, padding: bp.isMobile ? '5px 9px' : '6px 12px', borderRadius: 7, border: '1.5px solid #5B4632', background: '#FDF9F1', color: '#5B4632', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: bp.isMobile ? 11 : 12, transition: 'background .12s, color .12s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#5B4632'; e.currentTarget.style.color = '#FDF9F1'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#FDF9F1'; e.currentTarget.style.color = '#5B4632'; }}>
                        Quote
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Show more */}
          {!loading && !error && filtered.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginTop: bp.isMobile ? 22 : 30 }}>
              <span style={{ fontSize: 12.5, color: '#79634E' }}>
                Showing <strong style={{ color: '#5B4632' }}>{Math.min(visibleCount, filtered.length)}</strong> of <strong style={{ color: '#5B4632' }}>{filtered.length}</strong>
              </span>
              {visibleCount < filtered.length && (
                <button onClick={showMore}
                  style={{ padding: bp.isMobile ? '10px 22px' : '11px 28px', borderRadius: 100, border: '1.5px solid #5B4632', background: '#FDF9F1', color: '#5B4632', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, transition: 'background .12s, color .12s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#5B4632'; e.currentTarget.style.color = '#FDF9F1'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#FDF9F1'; e.currentTarget.style.color = '#5B4632'; }}>
                  Show more products
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
