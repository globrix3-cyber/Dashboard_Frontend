import { useState, useMemo, Fragment } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useFetchData } from '../hooks/useFetchData';
import { Spinner, EmptyState } from '../components/UI';
import { ShoppingBag, ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import { imageProps } from '../utils/helpers';
import { useBreakpoint } from '../hooks/useBreakpoint';
import usePageMeta from '../hooks/usePageMeta';

const SERIF = "'Canela', 'Cormorant Garamond', Georgia, serif";

// The client's category list (Canva V2, p14), shown in this order in the sidebar.
const CLIENT_CATEGORIES = [
  'Side Tables', 'Bedside Tables', 'Console Tables', 'Coffee Tables',
  'Table Lamps & Shades', 'Chairs', 'Vegan Leather Bags', 'Genuine Leather Bags',
  'Jute Bags', 'Cotton Bags', 'Wooden Serveware', 'Wall & Home Decor',
];

// Prices are agreed by quote, so the catalogue sorts only by relevance and recency.
const SORT_OPTIONS = [
  { label: 'Featured',     value: 'featured' },
  { label: 'Newest first', value: 'newest'   },
];

const PAGE_SIZE = 24;
const HELP_AFTER_ROWS = 3;

function HelpBand({ mobile }) {
  return (
    <section aria-label="Contact Globrixa" style={{ gridColumn: '1 / -1', background: '#5B4632', color: '#FDF9F1', textAlign: 'center', padding: mobile ? '26px 18px' : '30px 24px', margin: mobile ? '6px 0' : '10px 0' }}>
      <h2 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: mobile ? 26 : 32, letterSpacing: '-.5px', lineHeight: 1.15, margin: '0 0 8px', color: '#F4D9A0' }}>We&rsquo;re here to help</h2>
      <p style={{ margin: 0, fontSize: mobile ? 13 : 14, lineHeight: 1.7, color: '#F0DCC0' }}>
        Call us on <a href="tel:+918700076057" style={{ color: '#FDF9F1', textUnderlineOffset: 4 }}>+91 8700076057</a> or email us{' '}
        <a href="mailto:support@globrixa.com" style={{ color: '#FDF9F1', textUnderlineOffset: 4, overflowWrap: 'anywhere' }}>support@globrixa.com</a>
      </p>
    </section>
  );
}

export default function ProductsPage() {
  const navigate                         = useNavigate();
  const [searchParams, setSearchParams]  = useSearchParams();
  const bp                               = useBreakpoint();
  const [search, setSearch]              = useState(searchParams.get('search') || '');
  const [cat, setCat]                    = useState(searchParams.get('category') || 'All');
  const [sort, setSort]                  = useState('featured');
  const [showSort, setShowSort]          = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [catsOpen, setCatsOpen]          = useState(true);
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

  const { data: raw = [], loading, error } = useFetchData(() => api.getProducts());
  const { data: catRaw = [] }              = useFetchData(() => api.getCategories());

  const products   = Array.isArray(raw)    ? raw    : [];
  const categories = useMemo(() => (Array.isArray(catRaw) ? catRaw : []), [catRaw]);
  // A category reached from elsewhere (homepage tiles, old links) still shows as selected.
  const sideItems  = ['All', ...CLIENT_CATEGORIES, ...(cat !== 'All' && !CLIENT_CATEGORIES.includes(cat) ? [cat] : [])];

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
  if (sort === 'newest') filtered = [...filtered].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

  const cols        = bp.isMobile ? 2 : bp.isTablet ? 3 : 4;
  const helpAt      = cols * HELP_AFTER_ROWS;
  const visible     = filtered.slice(0, visibleCount);

  const metaTitle = [search && `"${search}"`, cat !== 'All' && cat].filter(Boolean).join(' in ');
  usePageMeta({
    title: metaTitle ? `${metaTitle} — Wholesale Products` : 'Wholesale Products from Indian Makers',
    description: cat !== 'All'
      ? `Browse wholesale ${cat} from Indian makers and suppliers on Globrixa. Request a quote for the pieces you need.`
      : 'Browse wholesale furniture, lighting, bags and home décor from Indian makers and suppliers on Globrixa. Request a quote for the pieces you need.',
    path: '/products',
  });

  /* ── Sidebar panel (shared between desktop sidebar and mobile drawer) ── */
  const renderSidebar = (collapsible) => (
    <>
      {search && (
        <div style={{ fontSize: 11, fontWeight: 600, color: '#79634E', letterSpacing: '1.4px', textTransform: 'uppercase', marginBottom: 14, overflowWrap: 'anywhere' }}>
          Results for &ldquo;{search}&rdquo;
        </div>
      )}
      <button type="button" onClick={() => collapsible && setCatsOpen(o => !o)} aria-expanded={collapsible ? catsOpen : true}
        aria-controls="product-categories" disabled={!collapsible}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0 0 12px', marginBottom: 8, background: 'none', border: 'none', borderBottom: '1px solid #E3D5C1', cursor: collapsible ? 'pointer' : 'default', fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '1.6px', textTransform: 'uppercase', color: '#5B4632' }}>
        Categories
        {collapsible && <ChevronDown size={15} aria-hidden="true" style={{ transform: catsOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />}
      </button>
      {(!collapsible || catsOpen) && (
        <div id="product-categories" style={{ display: 'flex', flexDirection: 'column' }}>
          {sideItems.map(c => {
            const active = cat === c;
            return (
              <button key={c} type="button" onClick={() => selectCat(c)} aria-pressed={active} style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '8px 0 8px 12px', border: 'none', borderLeft: `2px solid ${active ? '#C8792C' : 'transparent'}`,
                fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.4,
                fontWeight: active ? 600 : 400,
                color: active ? '#5B4632' : '#79634E',
                background: 'transparent', cursor: 'pointer', transition: 'color .12s',
              }}
                onMouseEnter={e => { e.currentTarget.style.color = '#5B4632'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.color = '#79634E'; }}
              >
                {c === 'All' ? 'All products' : c}
              </button>
            );
          })}
        </div>
      )}
    </>
  );

  const sortMenu = (minWidth) => showSort && (
    <div role="menu" style={{ position: 'absolute', right: 0, top: 'calc(100% + 4px)', background: '#FDF9F1', border: '1px solid #E3D5C1', borderRadius: 3, overflow: 'hidden', zIndex: 50, minWidth, boxShadow: '0 6px 24px rgba(43,32,22,.1)' }}>
      {SORT_OPTIONS.map(o => (
        <button key={o.value} type="button" role="menuitem" onClick={() => { setSort(o.value); setShowSort(false); }}
          style={{ display: 'block', width: '100%', textAlign: 'left', padding: '11px 14px', border: 'none', background: sort === o.value ? '#F5F0E7' : '#FDF9F1', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: sort === o.value ? 600 : 400, color: '#5B4632' }}>
          {o.label}
        </button>
      ))}
    </div>
  );

  const controlBtn = { display: 'flex', alignItems: 'center', gap: 6, height: 40, padding: '0 14px', borderRadius: 3, border: '1px solid rgba(91,70,50,.4)', background: 'transparent', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: '#5B4632', whiteSpace: 'nowrap' };

  const card = (p) => (
    <Link key={p.id} to={`/products/${p.id}`} className="gx-product-card"
      style={{ display: 'block', textDecoration: 'none', color: 'inherit', minWidth: 0 }}>
      <div style={{ aspectRatio: '3 / 4', background: '#F0E6D6', borderRadius: bp.isMobile ? 12 : 16, overflow: 'hidden' }}>
        {p.images?.[0]?.image_url
          ? <img className="gx-product-img" loading="lazy" decoding="async" {...imageProps(p.images[0].image_url, 400)} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .35s ease' }} />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ShoppingBag size={36} color="#C9B89F" aria-hidden="true" /></div>}
      </div>
      <div style={{ textAlign: 'center', padding: bp.isMobile ? '12px 4px 4px' : '16px 8px 6px' }}>
        <div style={{ fontSize: bp.isMobile ? 9.5 : 10.5, fontWeight: 500, color: '#79634E', textTransform: 'uppercase', letterSpacing: '1.6px', marginBottom: 6 }}>
          {p.category_name || 'Uncategorised'}
        </div>
        <div style={{ fontSize: bp.isMobile ? 12.5 : 14, fontWeight: 500, color: '#5B4632', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {p.name}
        </div>
      </div>
    </Link>
  );

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: '#5B4632' }}
      onClick={() => showSort && setShowSort(false)}>
      <style>{`
        .gx-product-card:hover .gx-product-img { transform: scale(1.03); }
        .gx-product-card:focus-visible { outline: 2px solid #C8792C; outline-offset: 4px; border-radius: 16px; }
        @media (prefers-reduced-motion: reduce) { .gx-product-img { transition: none !important; } .gx-product-card:hover .gx-product-img { transform: none; } }
      `}</style>

      <h1 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: bp.isMobile ? 34 : 46, letterSpacing: '-1px', lineHeight: 1.05, margin: `0 0 ${bp.isMobile ? 18 : 28}px`, color: '#5B4632' }}>
        {cat !== 'All' ? cat : search ? 'Search results' : 'All products'}
      </h1>

      {/* ── Mobile: filter bar ───────────────────────────────────────────── */}
      {bp.isMobile && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          <button type="button"
            onClick={e => { e.stopPropagation(); setShowMobileFilter(o => !o); }}
            aria-expanded={showMobileFilter}
            style={{ ...controlBtn, flex: 1, minWidth: 0, borderColor: cat !== 'All' ? '#5B4632' : 'rgba(91,70,50,.4)' }}
          >
            <SlidersHorizontal size={14} aria-hidden="true" />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{cat !== 'All' ? cat : 'Categories'}</span>
          </button>
          <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button type="button" onClick={() => setShowSort(o => !o)} aria-haspopup="true" aria-expanded={showSort} style={controlBtn}>
              Sort <ChevronDown size={13} aria-hidden="true" />
            </button>
            {sortMenu(170)}
          </div>
        </div>
      )}

      {/* ── Mobile category drawer ───────────────────────────────────────── */}
      {bp.isMobile && showMobileFilter && (
        <>
          <div onClick={() => setShowMobileFilter(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(43,32,22,.45)', zIndex: 200 }} />
          <div role="dialog" aria-label="Filter by category" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#FDF9F1', borderRadius: '14px 14px 0 0', padding: '20px 20px 32px', zIndex: 201, maxHeight: '75vh', overflowY: 'auto', boxShadow: '0 -8px 32px rgba(43,32,22,.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <span style={{ fontFamily: SERIF, fontWeight: 300, fontSize: 24, color: '#5B4632' }}>Filter</span>
              <button type="button" onClick={() => setShowMobileFilter(false)} aria-label="Close filters" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}>
                <X size={18} color="#79634E" />
              </button>
            </div>
            {renderSidebar(false)}
          </div>
        </>
      )}

      {/* ── Main area: sidebar + grid ───────────────────────────────────── */}
      <div style={{ display: 'flex', gap: bp.isTablet ? 24 : 40, alignItems: 'flex-start' }}>

        {/* Sidebar — desktop & tablet only */}
        {!bp.isMobile && (
          <aside aria-label="Product categories" style={{ width: bp.isTablet ? 170 : 210, flexShrink: 0, position: 'sticky', top: 160, maxHeight: 'calc(100vh - 180px)', overflowY: 'auto' }}>
            {renderSidebar(true)}
          </aside>
        )}

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Sort / count bar — desktop & tablet */}
          {!bp.isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
              <span style={{ fontSize: 13, color: '#79634E' }}>
                <strong style={{ color: '#5B4632', fontWeight: 600 }}>{filtered.length}</strong> product{filtered.length !== 1 ? 's' : ''}
              </span>
              <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
                <button type="button" onClick={() => setShowSort(o => !o)} aria-haspopup="true" aria-expanded={showSort} style={controlBtn}>
                  <span style={{ color: '#79634E', fontWeight: 400 }}>Sort by</span> {SORT_OPTIONS.find(o => o.value === sort)?.label} <ChevronDown size={13} aria-hidden="true" />
                </button>
                {sortMenu(180)}
              </div>
            </div>
          )}

          {/* Mobile: product count */}
          {bp.isMobile && (
            <div style={{ fontSize: 12, color: '#79634E', marginBottom: 14 }}>
              <strong style={{ color: '#5B4632', fontWeight: 600 }}>{filtered.length}</strong> product{filtered.length !== 1 ? 's' : ''}
              {cat !== 'All' ? ` in ${cat}` : ''}
            </div>
          )}

          {/* Product grid */}
          {loading ? <Spinner /> : error ? (
            <div style={{ padding: 32, textAlign: 'center', color: '#79634E' }}>
              <p style={{ marginBottom: 12 }}>Could not load products.</p>
              <button type="button" onClick={() => window.location.reload()} style={{ height: 44, padding: '0 22px', borderRadius: 3, background: '#5B4632', color: '#FDF9F1', border: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>Retry</button>
            </div>
          ) : filtered.length === 0 ? (
            // Never a dead end: homepage tiles and the client's categories can point at searches the catalogue doesn't cover yet.
            <>
              <EmptyState
                icon={ShoppingBag}
                title={search ? `We don't have “${search}” listed yet` : cat !== 'All' ? `We don't have ${cat} listed yet` : 'No products found'}
                desc={search || cat !== 'All' ? "New makers join regularly. Tell us what you're looking for and our team will help you source it." : 'Try a different search or category.'}
                action={
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginTop: 18 }}>
                    <button type="button" onClick={() => navigate('/contact')}
                      style={{ height: 44, padding: '0 22px', background: '#5B4632', color: '#FDF9F1', border: 'none', borderRadius: 3, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                      Talk to our team
                    </button>
                    <button type="button" onClick={() => navigate('/products')}
                      style={{ height: 44, padding: '0 21px', background: 'transparent', color: '#5B4632', border: '1px solid rgba(91,70,50,.4)', borderRadius: 3, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                      Browse all products
                    </button>
                  </div>
                }
              />
              <div style={{ display: 'grid' }}><HelpBand mobile={bp.isMobile} /></div>
            </>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, columnGap: bp.isMobile ? 12 : 22, rowGap: bp.isMobile ? 22 : 34 }}>
              {visible.map((p, i) => (
                <Fragment key={p.id}>
                  {card(p)}
                  {i === helpAt - 1 && <HelpBand mobile={bp.isMobile} />}
                </Fragment>
              ))}
              {visible.length < helpAt && <HelpBand mobile={bp.isMobile} />}
            </div>
          )}

          {/* Show more */}
          {!loading && !error && filtered.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginTop: bp.isMobile ? 26 : 36 }}>
              <span style={{ fontSize: 12.5, color: '#79634E' }}>
                Showing <strong style={{ color: '#5B4632', fontWeight: 600 }}>{Math.min(visibleCount, filtered.length)}</strong> of <strong style={{ color: '#5B4632', fontWeight: 600 }}>{filtered.length}</strong>
              </span>
              {visibleCount < filtered.length && (
                <button type="button" onClick={showMore}
                  style={{ height: 44, padding: '0 26px', borderRadius: 3, border: 'none', background: '#5B4632', color: '#FDF9F1', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13 }}>
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
