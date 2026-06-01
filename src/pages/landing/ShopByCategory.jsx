import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleLogin } from '../../features/auth/authSlice';
import { T, shadow, eyebrow, sectionTitle } from './tokens';
import { CAT_HERO, CAT_SUB } from './data';
import { IMG } from './images';
import { useBreakpoint, rPad, rW } from '../../hooks/useBreakpoint';

// ── Per-category product data ────────────────────────────────────────────────
export const CAT_DATA = {
  'Wall Décor': {
    meta: '820 brands · 12,000+ products',
    products: [
      { img: IMG.blueCeramicVases,     name: 'Blue Pottery Vase Set',        brand: 'Heritage Décor Studio',  price: '$8.50',   moq: 'MOQ 6 pcs',    rating: '4.9★' },
      { img: IMG.rajasthaniEmbroidery, name: 'Rajasthani Mirror Frame',       brand: 'Jodhpur Craft Studio',   price: '$34.00',  moq: 'MOQ 4 pcs',    rating: '5.0★' },
      { img: IMG.artisanPainting,      name: 'Madhubani Art Print',           brand: 'Bihar Arts Co.',         price: '$5.50',   moq: 'MOQ 10 pcs',   rating: '4.8★' },
      { img: IMG.woodenToys,           name: 'Hand-carved Wooden Frame',      brand: 'Jodhpur Craft Studio',   price: '$18.00',  moq: 'MOQ 8 pcs',    rating: '4.7★' },
      { img: IMG.embroideredDupatta,   name: 'Macramé Wall Hanging',          brand: 'Delhi Textile House',    price: '$12.00',  moq: 'MOQ 12 pcs',   rating: '4.9★' },
      { img: IMG.mosaicLamps,          name: 'Mosaic Glass Wall Sconce',      brand: 'Moradabad Brass Works',  price: '$24.00',  moq: 'MOQ 6 pcs',    rating: '4.8★' },
    ],
  },
  'Soft Furnishings': {
    meta: '640 brands · 9,500+ products',
    products: [
      { img: IMG.jaipurTextiles,       name: 'Block Print Cushion Cover',     brand: 'Delhi Textile House',    price: '$4.00',   moq: 'MOQ 50 pcs',   rating: '4.9★' },
      { img: IMG.fabricRolls,          name: 'Ikat Throw Blanket',            brand: 'Delhi Textile House',    price: '$8.50',   moq: 'MOQ 20 pcs',   rating: '4.8★' },
      { img: IMG.embroideredDupatta,   name: 'Handwoven Table Runner',        brand: 'Jaipur Weavers',         price: '$6.00',   moq: 'MOQ 24 pcs',   rating: '4.9★' },
      { img: IMG.rajasthaniEmbroidery, name: 'Embroidered Curtain Panel',     brand: 'Delhi Textile House',    price: '$22.00',  moq: 'MOQ 10 pcs',   rating: '4.7★' },
      { img: IMG.delhiTextiles,        name: 'Cotton Dhurrie Rug 4×6',        brand: 'Jaipur Weavers',         price: '$48.00',  moq: 'MOQ 5 pcs',    rating: '4.9★' },
      { img: IMG.jaisalmerTextiles,    name: 'Linen Bedsheet Set',            brand: 'Delhi Textile House',    price: '$32.00',  moq: 'MOQ 10 sets',  rating: '4.8★' },
    ],
  },
  'Decorative Accessories': {
    meta: '460 brands · 8,200+ products',
    products: [
      { img: IMG.mosaicLamps,          name: 'Brass Candle Holder Set',       brand: 'Moradabad Brass Works',  price: '$18.00',  moq: 'MOQ 12 pcs',   rating: '4.8★' },
      { img: IMG.blueCeramicVases,     name: 'Decorative Ceramic Bowl',       brand: 'Heritage Décor Studio',  price: '$12.00',  moq: 'MOQ 6 pcs',    rating: '4.9★' },
      { img: IMG.vadodaraPottery,      name: 'Hand-painted Flower Vase',      brand: 'Vadodara Art Studio',    price: '$9.50',   moq: 'MOQ 12 pcs',   rating: '4.7★' },
      { img: IMG.wovenBaskets,         name: 'Woven Decorative Tray',         brand: 'Jodhpur Craft Studio',   price: '$8.00',   moq: 'MOQ 20 pcs',   rating: '4.8★' },
      { img: IMG.ceramicVasesLamps,    name: 'Stone Coaster Set (6pcs)',      brand: 'Agra Stone Works',       price: '$14.00',  moq: 'MOQ 10 sets',  rating: '4.6★' },
      { img: IMG.artisanWeaving,       name: 'Brass Incense Holder',          brand: 'Moradabad Brass Works',  price: '$9.00',   moq: 'MOQ 24 sets',  rating: '4.9★' },
    ],
  },
  'Furniture Décor': {
    meta: '380 brands · 5,400+ products',
    products: [
      { img: IMG.woodenToys,           name: 'Sheesham Wood Coffee Table',    brand: 'Jodhpur Craft Studio',   price: '$120.00', moq: 'MOQ 2 pcs',    rating: '4.9★' },
      { img: IMG.artisanPainting,      name: 'Rajasthani Painted Stool',      brand: 'Jaipur Art Studio',      price: '$45.00',  moq: 'MOQ 4 pcs',    rating: '4.8★' },
      { img: IMG.wovenBaskets,         name: 'Rattan Side Table',             brand: 'Jodhpur Craft Studio',   price: '$65.00',  moq: 'MOQ 2 pcs',    rating: '4.7★' },
      { img: IMG.artisanWeaving,       name: 'Hand-carved Wooden Shelf',      brand: 'Jodhpur Craft Studio',   price: '$88.00',  moq: 'MOQ 2 pcs',    rating: '4.9★' },
      { img: IMG.chennaBaskets,        name: 'Cane Wicker Chair',             brand: 'Jodhpur Craft Studio',   price: '$95.00',  moq: 'MOQ 2 pcs',    rating: '4.8★' },
      { img: IMG.jaisalmerTextiles,    name: 'Vintage Wooden Cabinet',        brand: 'Jodhpur Craft Studio',   price: '$220.00', moq: 'MOQ 1 pc',     rating: '5.0★' },
    ],
  },
  'Kitchen & Dining': {
    meta: '510 brands · 7,800+ products',
    products: [
      { img: IMG.ceramicKitchenware,   name: 'Blue Pottery Dinner Set',       brand: 'Heritage Décor Studio',  price: '$28.00',  moq: 'MOQ 6 sets',   rating: '5.0★' },
      { img: IMG.metalParts,           name: 'Brass Serving Bowl Set',        brand: 'Moradabad Brass Works',  price: '$35.00',  moq: 'MOQ 4 sets',   rating: '4.8★' },
      { img: IMG.vadodaraPottery,      name: 'Terracotta Mug Set (4pcs)',      brand: 'Heritage Décor Studio',  price: '$16.00',  moq: 'MOQ 12 sets',  rating: '4.9★' },
      { img: IMG.ceramicVasesLamps,    name: 'Hand-painted Ceramic Plates',   brand: 'Heritage Décor Studio',  price: '$8.50',   moq: 'MOQ 24 pcs',   rating: '4.9★' },
      { img: IMG.spicesMarket,         name: 'Copper Water Bottle',           brand: 'Moradabad Brass Works',  price: '$12.00',  moq: 'MOQ 12 pcs',   rating: '4.7★' },
      { img: IMG.handmadePottery,      name: 'Clay Cooking Pot Set',          brand: 'Heritage Décor Studio',  price: '$22.00',  moq: 'MOQ 6 sets',   rating: '4.8★' },
    ],
  },
  'Garden & Outdoor': {
    meta: '290 brands · 4,100+ products',
    products: [
      { img: IMG.vadodaraPottery,      name: 'Terracotta Planter Set (3pcs)', brand: 'Heritage Décor Studio',  price: '$18.00',  moq: 'MOQ 12 sets',  rating: '4.8★' },
      { img: IMG.mosaicLamps,          name: 'Stone Garden Lantern',          brand: 'Agra Stone Works',       price: '$28.00',  moq: 'MOQ 6 pcs',    rating: '4.7★' },
      { img: IMG.keralaRiceFields,     name: 'Bamboo Wind Chimes',            brand: 'Jodhpur Craft Studio',   price: '$9.50',   moq: 'MOQ 24 pcs',   rating: '4.9★' },
      { img: IMG.handmadePottery,      name: 'Clay Bird Bath',                brand: 'Heritage Décor Studio',  price: '$34.00',  moq: 'MOQ 4 pcs',    rating: '4.6★' },
      { img: IMG.fabricRolls,          name: 'Jute Garden Mat',               brand: 'Delhi Textile House',    price: '$12.00',  moq: 'MOQ 20 pcs',   rating: '4.8★' },
      { img: IMG.metalParts,           name: 'Brass Garden Stake Set',        brand: 'Moradabad Brass Works',  price: '$22.00',  moq: 'MOQ 10 sets',  rating: '4.7★' },
    ],
  },
  'Handicrafts & Artisan': {
    meta: '982 brands · 15,000+ products',
    products: [
      { img: IMG.wovenBaskets,         name: 'Woven Rattan Basket',           brand: 'Jodhpur Craft Studio',   price: '$5.50',   moq: 'MOQ 24 pcs',   rating: '4.8★' },
      { img: IMG.woodenToys,           name: 'Channapatna Wood Toys',         brand: 'Channapatna Arts',        price: '$2.50',   moq: 'MOQ 24 sets',  rating: '4.9★' },
      { img: IMG.artisanPainting,      name: 'Madhubani Art Print',           brand: 'Bihar Arts Co.',          price: '$5.50',   moq: 'MOQ 10 pcs',   rating: '4.8★' },
      { img: IMG.ceramicKitchenware,   name: 'Blue Pottery Dinner Set',       brand: 'Heritage Décor Studio',   price: '$28.00',  moq: 'MOQ 6 sets',   rating: '5.0★' },
      { img: IMG.rajasthaniEmbroidery, name: 'Rajasthani Mirror Work Art',    brand: 'Jaipur Art Studio',       price: '$34.00',  moq: 'MOQ 4 pcs',    rating: '4.7★' },
      { img: IMG.mosaicLamps,          name: 'Antique Brass Lamp',            brand: 'Moradabad Brass Works',   price: '$22.00',  moq: 'MOQ 6 pcs',    rating: '4.9★' },
    ],
  },
  'Sustainable Décor': {
    meta: '215 brands · 3,200+ products',
    products: [
      { img: IMG.blueCeramicVases,     name: 'Recycled Glass Vase Set',       brand: 'Eco India Crafts',       price: '$14.00',  moq: 'MOQ 12 pcs',   rating: '4.8★' },
      { img: IMG.chennaBaskets,        name: 'Jute Storage Basket',           brand: 'Delhi Textile House',    price: '$8.50',   moq: 'MOQ 20 pcs',   rating: '4.9★' },
      { img: IMG.woodenToys,           name: 'Bamboo Desk Organizer',         brand: 'Eco India Crafts',       price: '$12.00',  moq: 'MOQ 12 pcs',   rating: '4.7★' },
      { img: IMG.fabricRolls,          name: 'Cork Placemat Set (6pcs)',       brand: 'Eco India Crafts',       price: '$16.00',  moq: 'MOQ 10 sets',  rating: '4.6★' },
      { img: IMG.jaipurTextiles,       name: 'Natural Cotton Throw',          brand: 'Delhi Textile House',    price: '$28.00',  moq: 'MOQ 10 pcs',   rating: '4.9★' },
      { img: IMG.vadodaraPottery,      name: 'Terracotta Wall Planter',       brand: 'Heritage Décor Studio',  price: '$10.00',  moq: 'MOQ 16 pcs',   rating: '4.8★' },
    ],
  },
  'Textiles': {
    meta: '520 brands · 11,000+ products',
    products: [
      { img: IMG.fabricRolls,          name: 'Ikat Fabric Roll (10m)',        brand: 'Delhi Textile House',    price: '$8.50',   moq: 'MOQ 10 rolls', rating: '4.9★' },
      { img: IMG.embroideredDupatta,   name: 'Block Print Dupatta',           brand: 'Jaipur Weavers',         price: '$6.00',   moq: 'MOQ 24 pcs',   rating: '4.8★' },
      { img: IMG.rajasthaniEmbroidery, name: 'Rajasthani Embroidery Fabric',  brand: 'Jaipur Weavers',         price: '$12.00',  moq: 'MOQ 10 m',     rating: '4.9★' },
      { img: IMG.jaipurTextiles,       name: 'Handwoven Cotton Saree Fabric', brand: 'Jaipur Weavers',         price: '$22.00',  moq: 'MOQ 5 pcs',    rating: '4.8★' },
      { img: IMG.delhiTextiles,        name: 'Banarasi Brocade Fabric',       brand: 'Varanasi Silks',         price: '$22.00',  moq: 'MOQ 10 m',     rating: '4.9★' },
      { img: IMG.jaisalmerTextiles,    name: 'Cotton Dhurrie Rug',            brand: 'Jaipur Weavers',         price: '$48.00',  moq: 'MOQ 5 pcs',    rating: '4.8★' },
    ],
  },
  'Jewelry': {
    meta: '310 brands · 6,500+ products',
    products: [
      { img: IMG.indianJewelry,        name: 'Kundan Necklace Set',           brand: 'Jaipur Gems',            price: '$28.00',  moq: 'MOQ 10 pcs',   rating: '4.9★' },
      { img: IMG.saffronThreads,       name: 'Oxidized Silver Earrings',      brand: 'Jaipur Gems',            price: '$6.50',   moq: 'MOQ 24 pairs', rating: '4.8★' },
      { img: IMG.mosaicLamps,          name: 'Meenakari Pendant Set',         brand: 'Jaipur Gems',            price: '$14.00',  moq: 'MOQ 12 pcs',   rating: '4.9★' },
      { img: IMG.artisanPainting,      name: 'Temple Jewelry Collection',     brand: 'Chennai Jewels',         price: '$32.00',  moq: 'MOQ 6 sets',   rating: '5.0★' },
      { img: IMG.rajasthaniEmbroidery, name: 'Afghani Jhumka Earrings',       brand: 'Jaipur Gems',            price: '$8.00',   moq: 'MOQ 20 pairs', rating: '4.7★' },
      { img: IMG.metalParts,           name: 'Brass Bangle Set',              brand: 'Moradabad Brass Works',  price: '$12.00',  moq: 'MOQ 12 sets',  rating: '4.8★' },
    ],
  },
};

// ── Hero cards for "All" view ─────────────────────────────────────────────────
const CAT_IMAGES = {
  'Wall Décor':            IMG.blueCeramicVases,
  'Soft Furnishings':      IMG.jaipurTextiles,
  'Handicrafts & Artisan': IMG.wovenBaskets,
  'Kitchen & Dining':      IMG.ceramicKitchenware,
};

function CatHeroCard({ item, onAction }) {
  const [hov, setHov] = useState(false);
  const photo = CAT_IMAGES[item.name];
  return (
    <div onClick={onAction} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      borderRadius: 18, overflow: 'hidden', position: 'relative', cursor: 'pointer',
      aspectRatio: '3/4',
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      transform: hov ? 'translateY(-6px)' : 'none',
      boxShadow: hov ? shadow.lg : shadow.sm,
      transition: '.28s cubic-bezier(.22,.68,0,1.2)',
    }}>
      {photo ? (
        <img src={photo} alt={item.name} loading="lazy" decoding="async"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', transform: hov ? 'scale(1.07)' : 'scale(1)', transition: 'transform .55s ease' }}
        />
      ) : (
        <div style={{ position: 'absolute', inset: 0, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80 }}>{item.emoji}</div>
      )}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(18,14,10,.88) 0%,rgba(18,14,10,.22) 50%,rgba(18,14,10,.04) 100%)' }} />
      {hov && <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(196,119,58,.12) 0%,transparent 60%)', pointerEvents: 'none' }} />}
      <div style={{ position: 'relative', zIndex: 2, padding: '20px 18px' }}>
        <div style={{ marginBottom: 8 }}>
          <span style={{ display: 'inline-block', background: hov ? 'rgba(196,119,58,.9)' : 'rgba(255,255,255,.12)', backdropFilter: 'blur(8px)', border: hov ? '1px solid rgba(196,119,58,.5)' : '1px solid rgba(255,255,255,.18)', color: '#fff', fontSize: 9, fontWeight: 800, padding: '4px 11px', borderRadius: 20, letterSpacing: '.1em', textTransform: 'uppercase', transition: '.22s' }}>{item.chip}</span>
        </div>
        <div style={{ fontFamily: "'Cormorant Garamond','Playfair Display',serif", fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 4, lineHeight: 1.15 }}>{item.name}</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,.6)', marginBottom: 10 }}>{item.count}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: hov ? T.tm : 'rgba(255,255,255,.45)', fontSize: 11, fontWeight: 600, transition: '.22s', transform: hov ? 'translateX(4px)' : 'none' }}>
          Browse {item.name} <span style={{ fontSize: 13 }}>→</span>
        </div>
      </div>
    </div>
  );
}

function CatSubCard({ item, cta, onAction }) {
  const [hov, setHov] = useState(false);
  if (cta) return (
    <div onClick={onAction} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ background: hov ? `linear-gradient(135deg,${T.td},#8A5226)` : `linear-gradient(135deg,${T.t},${T.td})`, borderRadius: 12, padding: '16px 10px', textAlign: 'center', cursor: 'pointer', transition: '.18s', transform: hov ? 'translateY(-2px)' : 'none' }}>
      <div style={{ fontSize: 20, marginBottom: 6 }}>→</div>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#fff', marginBottom: 2 }}>View all 24</div>
      <div style={{ fontSize: 10, color: 'rgba(255,255,255,.75)' }}>categories</div>
    </div>
  );
  return (
    <div onClick={onAction} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ background: hov ? T.tl : T.w, border: `1.5px solid ${hov ? T.t : T.bs}`, borderRadius: 12, padding: '14px 10px', textAlign: 'center', cursor: 'pointer', transform: hov ? 'translateY(-2px)' : 'none', boxShadow: hov ? shadow.sm : 'none', transition: '.18s' }}>
      <div style={{ fontSize: 24, marginBottom: 6 }}>{item.icon}</div>
      <div style={{ fontSize: 11, fontWeight: 700, color: T.ink, marginBottom: 2 }}>{item.name}</div>
      <div style={{ fontSize: 10, color: T.mu }}>{item.count}</div>
    </div>
  );
}

// ── Filtered product card ─────────────────────────────────────────────────────
function ProductCard({ p, onAction, bp }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ background: '#fff', borderRadius: 14, border: `1.5px solid ${hov ? T.t : T.bs}`, overflow: 'hidden', cursor: 'pointer', transition: 'border-color .18s, transform .18s, box-shadow .18s', transform: hov ? 'translateY(-4px)' : 'none', boxShadow: hov ? shadow.sm : 'none' }}
      onClick={onAction}
    >
      {/* Image / emoji */}
      <div style={{ height: bp.isMobile ? 140 : 160, position: 'relative', overflow: 'hidden', background: p.bg || '#F0E8DA' }}>
        {p.img ? (
          <img src={p.img} alt={p.name} loading="lazy" decoding="async"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block', transform: hov ? 'scale(1.05)' : 'scale(1)', transition: 'transform .4s ease' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>
            {p.emoji}
          </div>
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(18,14,10,.25) 0%, transparent 50%)' }} />
        <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,.45)', backdropFilter: 'blur(6px)', borderRadius: 20, padding: '3px 8px', fontSize: 10, color: '#fff', fontWeight: 600 }}>
          {p.rating}
        </div>
      </div>
      {/* Info */}
      <div style={{ padding: '12px 14px 14px' }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: T.mu, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 4 }}>{p.brand}</div>
        <div style={{ fontSize: bp.isMobile ? 13 : 14, fontWeight: 700, color: T.ink, lineHeight: 1.3, marginBottom: 8 }}>{p.name}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: 15, fontWeight: 800, color: T.t }}>{p.price}</span>
            <span style={{ fontSize: 11, color: T.mu }}> /pc</span>
          </div>
          <div style={{ fontSize: 10, color: T.mu, background: T.tl, borderRadius: 20, padding: '3px 8px', fontWeight: 600 }}>{p.moq}</div>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ShopByCategory({ activeCategory = 'All', onCategoryChange }) {
  const dispatch  = useDispatch();
  const bp        = useBreakpoint();
  const openLogin = () => dispatch(toggleLogin(true));

  const heroColumns = bp.isMobile ? 'repeat(2,1fr)' : bp.isTablet ? 'repeat(2,1fr)' : 'repeat(4,1fr)';
  const subColumns  = bp.isMobile ? 'repeat(3,1fr)' : bp.isTablet ? 'repeat(4,1fr)' : 'repeat(6,1fr)';
  const prodColumns = bp.isMobile ? 'repeat(2,1fr)' : bp.isTablet ? 'repeat(3,1fr)' : 'repeat(3,1fr)';

  const catData = CAT_DATA[activeCategory];

  return (
    <section id="shop-by-category" style={{ background: T.c, padding: rPad(bp) }}>
      <div style={{ ...rW }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28, gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div style={eyebrow}>
              {activeCategory === 'All' ? 'Browse' : 'Category'}
            </div>
            <h2 style={sectionTitle}>
              {activeCategory === 'All' ? 'Shop by Category' : activeCategory}
            </h2>
            <p style={{ fontSize: 13, color: T.mu, marginTop: 6 }}>
              {activeCategory === 'All' ? '24 categories · 5,000+ verified suppliers' : catData?.meta}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {activeCategory !== 'All' && (
              <button
                onClick={() => onCategoryChange?.('All')}
                style={{ fontSize: 13, color: T.mu, fontWeight: 500, background: '#fff', border: `1.5px solid ${T.bs}`, borderRadius: 7, padding: '8px 14px', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
              >
                ← All categories
              </button>
            )}
            <button onClick={openLogin} style={{ fontSize: 13, color: T.t, fontWeight: 600, background: T.tl, border: `1.5px solid rgba(196,119,58,.25)`, borderRadius: 7, padding: '8px 16px', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
              {activeCategory === 'All' ? 'All categories →' : `View all ${activeCategory} →`}
            </button>
          </div>
        </div>

        {/* Content */}
        {activeCategory === 'All' ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: heroColumns, gap: 12, marginBottom: 10 }}>
              {CAT_HERO.map(item => <CatHeroCard key={item.name} item={item} onAction={openLogin} />)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: subColumns, gap: 8 }}>
              {CAT_SUB.map(item => <CatSubCard key={item.name} item={item} onAction={openLogin} />)}
              <CatSubCard cta onAction={openLogin} />
            </div>
          </>
        ) : catData ? (
          <div style={{ display: 'grid', gridTemplateColumns: prodColumns, gap: bp.isMobile ? 10 : 16 }}>
            {catData.products.map((p, i) => (
              <ProductCard key={i} p={p} bp={bp} onAction={openLogin} />
            ))}
          </div>
        ) : (
          /* Fallback for categories without data yet */
          <div style={{ textAlign: 'center', padding: '60px 20px', color: T.mu }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
            <p style={{ fontSize: 15 }}>Products coming soon for this category.</p>
            <button onClick={() => onCategoryChange?.('All')} style={{ marginTop: 16, padding: '10px 24px', borderRadius: 8, border: `1.5px solid ${T.bs}`, background: '#fff', color: T.ink, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              ← Back to all
            </button>
          </div>
        )}

        {/* Sign-in nudge for filtered views */}
        {activeCategory !== 'All' && catData && (
          <div style={{ marginTop: 28, padding: '16px 20px', background: 'rgba(196,119,58,.07)', border: `1.5px solid rgba(196,119,58,.2)`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ fontSize: 13, color: T.ink, margin: 0, fontWeight: 500 }}>
              Sign in to see wholesale prices, contact suppliers, and place orders.
            </p>
            <button onClick={openLogin} style={{ padding: '9px 22px', borderRadius: 8, background: '#1C1815', color: '#fff', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
              Sign in free →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
