import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toggleLogin } from '../features/auth/authSlice';
import { api } from '../services/api';
import { useFetchData } from '../hooks/useFetchData';
import { Spinner, EmptyState } from '../components/UI';
import {
  Search, ShoppingBag, ChevronRight, ArrowRight,
  Package, Star, BadgeCheck, Filter, MapPin, Zap,
} from 'lucide-react';
import { formatDate } from '../utils/helpers';

/* ── Design tokens ───────────────────────────────────────────────────────── */
const C = {
  saffron: '#D9600A', saffronLt: '#FDF1E8', saffronMid: '#F0B48A',
  emerald: '#1A7A4A', emeraldLt: '#EAF5EF',
  navy:    '#1B3175', navyLt:    '#EEF2FB',
  gold:    '#B8730A', goldLt:    '#FDF5E2',
  ink:     '#1C1815', inkSoft:   '#3D3731',
  muted:   '#7A7068', borderSoft:'#E6DED0',
  cream:   '#F4EFE4', warmWhite: '#FAF7F1',
};

/* ── Category icon / colour map ──────────────────────────────────────────── */
const CAT_META = {
  'apparel-textiles':      { emoji: '🧵', color: C.saffron, bg: C.saffronLt,  label: 'Apparel & Textiles'      },
  'electronics-electrical':{ emoji: '💡', color: C.navy,    bg: C.navyLt,     label: 'Electronics & Electrical' },
  'home-garden':           { emoji: '🏡', color: C.emerald, bg: C.emeraldLt,  label: 'Home & Garden'            },
  'food-agriculture':      { emoji: '🌾', color: C.gold,    bg: C.goldLt,     label: 'Food & Agriculture'       },
  'industrial-machinery':  { emoji: '⚙️', color: C.navy,    bg: C.navyLt,     label: 'Industrial & Machinery'   },
  'beauty-personal-care':  { emoji: '✨', color: '#9B2C96', bg: '#F5EEF8',     label: 'Beauty & Personal Care'   },
  'sports-outdoors':       { emoji: '🏏', color: C.emerald, bg: C.emeraldLt,  label: 'Sports & Outdoors'        },
  'packaging-printing':    { emoji: '📦', color: C.saffron, bg: C.saffronLt,  label: 'Packaging & Printing'     },
  'chemicals-plastics':    { emoji: '🧪', color: '#1A7090', bg: '#E8F5F9',     label: 'Chemicals & Plastics'     },
  'handicrafts-gifts':     { emoji: '🎨', color: '#A0522D', bg: '#FDF0E8',     label: 'Handicrafts & Gifts'      },
  'automotive-parts':      { emoji: '🚗', color: '#374151', bg: '#F3F4F6',     label: 'Automotive Parts'         },
  'pharmaceuticals':       { emoji: '💊', color: '#1A7A4A', bg: '#EAF5EF',     label: 'Pharmaceuticals'          },
  'gems-jewellery':        { emoji: '💎', color: '#B8730A', bg: '#FDF5E2',     label: 'Gems & Jewellery'         },
  'building-construction': { emoji: '🏗️', color: '#92400E', bg: '#FEF3C7',     label: 'Building & Construction'  },
  'paper-stationery':      { emoji: '📄', color: '#374151', bg: '#F9FAFB',     label: 'Paper & Stationery'       },
  'leather-footwear':      { emoji: '👞', color: '#7C3AED', bg: '#EDE9FE',     label: 'Leather & Footwear'       },
};

function getMeta(slug) {
  return CAT_META[slug] || { emoji: '📋', color: C.navy, bg: C.navyLt };
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN CategoriesPage — show all root categories + sub-cats
═══════════════════════════════════════════════════════════════════════════ */
export default function CategoriesPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null); // selected root category id

  const { data: raw = [], loading } = useFetchData(() => api.getCategories());
  const allCats = Array.isArray(raw) ? raw : [];

  const roots = allCats.filter(c => !c.parent_id);
  const subs  = allCats.filter(c => !!c.parent_id);

  const filteredRoots = roots.filter(r =>
    !search ||
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    subs.filter(s => s.parent_id === r.id).some(s => s.name.toLowerCase().includes(search.toLowerCase()))
  );

  const selectedCat   = selected ? roots.find(r => r.id === selected) : null;
  const selectedSubs  = selected ? subs.filter(s => s.parent_id === selected) : [];
  const selectedMeta  = selectedCat ? getMeta(selectedCat.slug) : null;

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div style={{
        borderRadius: 20, padding: '32px 36px', marginBottom: 28, overflow: 'hidden',
        background: `linear-gradient(135deg, ${C.ink} 0%, #2D2420 100%)`,
        position: 'relative',
        boxShadow: `0 8px 32px rgba(28,24,21,0.32)`,
      }}>
        {/* Mandala bg */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='46' fill='none' stroke='%23fff' stroke-width='.5' stroke-dasharray='3 7'/%3E%3Ccircle cx='50' cy='50' r='30' fill='none' stroke='%23fff' stroke-width='.4' stroke-dasharray='2 5'/%3E%3C/svg%3E")`, backgroundSize: '100px 100px', pointerEvents: 'none' }} />
        {/* Ghost rings */}
        <div style={{ position: 'absolute', top: -100, right: -100, width: 380, height: 380, borderRadius: '50%', border: '1px solid rgba(217,96,10,0.15)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', border: '1px dashed rgba(26,122,74,0.2)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 20 }}>🇮🇳</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.55)', letterSpacing: '.12em', textTransform: 'uppercase' }}>
              India's B2B Marketplace
            </span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 32, fontWeight: 900, color: '#fff', margin: '0 0 8px', letterSpacing: '-0.5px', lineHeight: 1.1 }}>
            Browse by Category
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, margin: '0 0 24px' }}>
            {allCats.length > 0 ? `${roots.length} industry verticals · ${allCats.length} categories` : 'All Indian industry verticals in one place'} · GST-verified suppliers
          </p>

          {/* Search */}
          <div style={{ position: 'relative', maxWidth: 520 }}>
            <Search size={16} color="rgba(255,255,255,0.5)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search categories — Textiles, Electronics, Pharma…"
              style={{
                width: '100%', padding: '13px 16px 13px 44px', borderRadius: 12,
                border: '1.5px solid rgba(255,255,255,0.18)', background: 'rgba(255,255,255,0.10)',
                fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                color: '#fff', outline: 'none', boxSizing: 'border-box',
                backdropFilter: 'blur(8px)', transition: 'border-color 0.15s',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = C.saffron; e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; e.currentTarget.style.background = 'rgba(255,255,255,0.10)'; }}
            />
          </div>
        </div>
      </div>

      {/* Tricolor strip */}
      <div style={{ display: 'flex', height: 3, borderRadius: 2, overflow: 'hidden', marginBottom: 28 }}>
        <div style={{ flex: 1, background: C.saffron }} />
        <div style={{ flex: 1, background: '#fff', border: `0.5px solid ${C.borderSoft}` }} />
        <div style={{ flex: 1, background: C.emerald }} />
      </div>

      {loading ? <Spinner /> : (

        <div style={{ display: 'grid', gridTemplateColumns: selected ? '260px 1fr' : '1fr', gap: 20, alignItems: 'start' }}>

          {/* ── Left sidebar (when category selected) ────────────────────── */}
          {selected && (
            <div style={{ background: '#fff', borderRadius: 18, border: `1.5px solid ${C.borderSoft}`, overflow: 'hidden', position: 'sticky', top: 16 }}>
              <div style={{ borderTop: `3px solid ${selectedMeta?.color || C.navy}` }} />
              <div style={{ padding: '16px 18px', borderBottom: `1px solid ${C.borderSoft}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 24 }}>{selectedMeta?.emoji}</span>
                  <div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 15, color: C.ink }}>{selectedCat?.name}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{selectedSubs.length} sub-categories</div>
                  </div>
                </div>
              </div>
              <div style={{ padding: '8px 0' }}>
                <button onClick={() => { setSelected(null); navigate(`/products?category=${selectedCat?.name}`); }} style={{
                  width: '100%', padding: '11px 18px', border: 'none', background: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                  fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700,
                  color: selectedMeta?.color || C.navy,
                  transition: 'background 0.12s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = selectedMeta?.bg || C.navyLt; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}>
                  All {selectedCat?.name} <ArrowRight size={13} />
                </button>
                {selectedSubs.map(sub => (
                  <button key={sub.id} onClick={() => navigate(`/products?category=${sub.name}`)} style={{
                    width: '100%', padding: '10px 18px', border: 'none', background: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.inkSoft,
                    transition: 'background 0.12s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = C.cream; e.currentTarget.style.color = C.ink; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = C.inkSoft; }}>
                    {sub.name} <ChevronRight size={12} color={C.muted} />
                  </button>
                ))}
              </div>
              <div style={{ padding: '14px 18px', borderTop: `1px solid ${C.borderSoft}` }}>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: C.muted, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                  ← All Categories
                </button>
              </div>
            </div>
          )}

          {/* ── Main category grid ────────────────────────────────────────── */}
          <div>
            {selected ? (
              /* Selected category — product browse */
              <CategoryProducts category={selectedCat} meta={selectedMeta} navigate={navigate} dispatch={dispatch} />
            ) : (
              /* All categories grid */
              <>
                {/* Quick-access row */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
                  {['All', ...roots.slice(0, 6).map(r => r.name)].map(label => (
                    <button key={label} onClick={() => { if (label === 'All') setSearch(''); else setSearch(label.split(' ')[0]); }} style={{
                      padding: '7px 15px', borderRadius: 100,
                      border: `1.5px solid ${C.borderSoft}`, background: '#fff',
                      color: C.inkSoft, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = C.navy; e.currentTarget.style.color = C.navy; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = C.borderSoft; e.currentTarget.style.color = C.inkSoft; }}>
                      {label}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                  {filteredRoots.map(cat => {
                    const meta    = getMeta(cat.slug);
                    const catSubs = subs.filter(s => s.parent_id === cat.id);
                    return (
                      <div key={cat.id}
                        onClick={() => setSelected(cat.id)}
                        style={{
                          background: '#fff', borderRadius: 18,
                          border: `1.5px solid ${C.borderSoft}`, overflow: 'hidden',
                          cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 10px 30px ${meta.color}1A`; e.currentTarget.style.borderColor = meta.color; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = C.borderSoft; }}>

                        {/* Colored top bar */}
                        <div style={{ height: 4, background: meta.color }} />

                        <div style={{ padding: '22px 22px 16px' }}>
                          {/* Icon + name */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                            <div style={{ width: 52, height: 52, borderRadius: 14, background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>
                              {meta.emoji}
                            </div>
                            <div>
                              <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 16, color: C.ink, margin: 0, letterSpacing: '-0.2px' }}>
                                {cat.name}
                              </h3>
                              {cat.description && (
                                <p style={{ fontSize: 11, color: C.muted, margin: '4px 0 0', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                  {cat.description}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Sub-categories */}
                          {catSubs.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                              {catSubs.slice(0, 4).map(sub => (
                                <span key={sub.id} onClick={e => { e.stopPropagation(); navigate(`/products?category=${sub.name}`); }} style={{
                                  fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 100,
                                  background: meta.bg, color: meta.color, cursor: 'pointer',
                                  transition: 'opacity 0.12s',
                                }}
                                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.75'; }}
                                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}>
                                  {sub.name}
                                </span>
                              ))}
                              {catSubs.length > 4 && (
                                <span style={{ fontSize: 11, color: C.muted, padding: '3px 6px' }}>+{catSubs.length - 4} more</span>
                              )}
                            </div>
                          )}

                          {/* Footer */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, borderTop: `1px solid ${C.borderSoft}` }}>
                            <div style={{ display: 'flex', gap: 14 }}>
                              <span style={{ fontSize: 11, color: C.muted, display: 'flex', alignItems: 'center', gap: 4 }}>
                                <BadgeCheck size={11} color={meta.color} /> Verified Suppliers
                              </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color: meta.color }}>
                              Browse <ChevronRight size={13} />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {filteredRoots.length === 0 && (
                  <EmptyState icon={Package} title="No categories found" desc={`No categories matching "${search}"`} />
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CategoryProducts — product grid when a category is selected
═══════════════════════════════════════════════════════════════════════════ */
function CategoryProducts({ category, meta, navigate, dispatch }) {
  const [search, setSearch] = useState('');
  const { data: raw = [], loading } = useFetchData(() => api.getProducts());
  const allProds = Array.isArray(raw) ? raw : [];

  const filtered = allProds.filter(p => {
    const catMatch = p.category_name?.toLowerCase().includes(category?.name?.toLowerCase() || '');
    const qMatch   = !search || p.name?.toLowerCase().includes(search.toLowerCase());
    return catMatch && qMatch;
  });

  const handleGetQuote = (e, p) => {
    e.stopPropagation();
    navigate('/buyer-dashboard/rfqs/new');
  };

  return (
    <div>
      {/* Category header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 28 }}>{meta?.emoji}</span>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 22, color: C.ink, margin: 0 }}>{category?.name}</h2>
            <p style={{ fontSize: 13, color: C.muted, margin: '4px 0 0' }}>{category?.description || `GST-verified Indian ${category?.name} suppliers`}</p>
          </div>
        </div>
        <button onClick={() => navigate('/buyer-dashboard/rfqs/new')} style={{
          display: 'flex', alignItems: 'center', gap: 7, padding: '10px 20px', borderRadius: 100,
          border: 'none', background: C.saffron, color: '#fff', cursor: 'pointer',
          fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13,
          boxShadow: '0 4px 14px rgba(217,96,10,0.28)',
        }}>
          <Zap size={14} /> Post RFQ for {category?.name}
        </button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 20 }}>
        <Search size={14} color={C.muted} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder={`Search in ${category?.name}…`}
          style={{ width: '100%', padding: '11px 14px 11px 38px', borderRadius: 12, border: `1.5px solid ${C.borderSoft}`, background: '#fff', fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.ink, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
          onFocus={e => { e.currentTarget.style.borderColor = meta?.color || C.navy; }}
          onBlur={e => { e.currentTarget.style.borderColor = C.borderSoft; }} />
      </div>

      {loading ? <Spinner /> : filtered.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 18, border: `1.5px solid ${C.borderSoft}`, overflow: 'hidden' }}>
          <div style={{ height: 4, background: meta?.color || C.navy }} />
          <EmptyState icon={Package} title={`No ${category?.name} products yet`}
            desc="Be the first to list a product in this category, or post an RFQ to find suppliers."
            action={
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => navigate('/buyer-dashboard/rfqs/new')} style={{ padding: '9px 20px', borderRadius: 100, border: 'none', background: C.saffron, color: '#fff', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13 }}>
                  Post RFQ
                </button>
                <button onClick={() => navigate('/supplier-dashboard/catalog/new')} style={{ padding: '9px 20px', borderRadius: 100, border: `1.5px solid ${C.borderSoft}`, background: '#fff', color: C.inkSoft, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13 }}>
                  List Product
                </button>
              </div>
            } />
        </div>
      ) : (
        <>
          <p style={{ fontSize: 12, color: C.muted, marginBottom: 14 }}>{filtered.length} products found</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 16 }}>
            {filtered.map(p => (
              <div key={p.id} onClick={() => navigate(`/products/${p.id}`)} style={{
                background: '#fff', borderRadius: 16, border: `1.5px solid ${C.borderSoft}`,
                overflow: 'hidden', cursor: 'pointer',
                transition: 'transform 0.18s, box-shadow 0.18s, border-color 0.18s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${meta?.color || C.navy}1A`; e.currentTarget.style.borderColor = meta?.color || C.navy; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = C.borderSoft; }}>

                <div style={{ height: 140, background: `linear-gradient(135deg, ${C.cream}, #E8E2D6)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  {p.images?.[0]?.image_url
                    ? <img src={p.images[0].image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ fontSize: 36 }}>{meta?.emoji || '📦'}</span>
                  }
                  {p.status === 'active' && (
                    <span style={{ position: 'absolute', top: 8, right: 8, fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 100, background: C.emeraldLt, color: C.emerald, display: 'flex', alignItems: 'center', gap: 3 }}>
                      <BadgeCheck size={9} /> Verified
                    </span>
                  )}
                </div>

                <div style={{ padding: '14px 16px' }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 14, color: C.ink, marginBottom: 8, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {p.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 18, color: C.ink, letterSpacing: '-0.3px' }}>
                        {p.base_price ? `₹${Number(p.base_price).toLocaleString('en-IN')}` : 'On Request'}
                      </div>
                      {p.moq_unit && <div style={{ fontSize: 10, color: C.muted, marginTop: 1 }}>MOQ: {p.min_order_quantity} {p.moq_unit}</div>}
                    </div>
                    <button onClick={e => handleGetQuote(e, p)} style={{
                      padding: '7px 13px', borderRadius: 100, border: 'none', cursor: 'pointer',
                      background: meta?.color || C.saffron, color: '#fff',
                      fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 11,
                    }}>
                      Get Quote
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
