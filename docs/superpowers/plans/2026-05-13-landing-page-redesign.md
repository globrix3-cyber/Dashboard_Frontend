# Landing Page Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace `src/pages/LandingPage.jsx` with a rich Faire-inspired B2B marketplace landing page — warm cream/terracotta palette, discovery-first categories and products, English only.

**Architecture:** Split the monolithic LandingPage into 14 focused sub-components under `src/pages/landing/`, plus a `data.js` for static content and `tokens.js` for design values. The root `LandingPage.jsx` assembles them. No backend changes, no new routes, no new Redux state — only `toggleLogin` dispatch is wired to CTA buttons.

**Tech Stack:** React 19, Vite, inline styles (following existing LandingPage pattern), Playfair Display + DM Sans (already loaded in `index.css`), lucide-react, react-redux (`toggleLogin`)

**Mockup reference:** `.superpowers/brainstorm/22-1778664055/content/full-page-v4.html`

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/pages/landing/tokens.js` | Create | CSS variable values + shared style helpers |
| `src/pages/landing/data.js` | Create | All static content arrays |
| `src/pages/landing/AnnouncementBar.jsx` | Create | Top dark announcement strip |
| `src/pages/landing/LandingNavbar.jsx` | Create | Sticky navbar with search |
| `src/pages/landing/HeroSection.jsx` | Create | Split hero + product grid |
| `src/pages/landing/SocialProofTicker.jsx` | Create | Live activity ticker |
| `src/pages/landing/CategoryNavBar.jsx` | Create | Sticky scrollable category tabs |
| `src/pages/landing/PressStrip.jsx` | Create | "As seen in" press logos |
| `src/pages/landing/ShopByCategory.jsx` | Create | 4 hero cards + 6 sub-category tiles |
| `src/pages/landing/FeaturedSuppliers.jsx` | Create | 4 brand cards |
| `src/pages/landing/TrendingProducts.jsx` | Create | 5-col product grid + spotlight banner |
| `src/pages/landing/NewThisWeek.jsx` | Create | 6-col compact product row |
| `src/pages/landing/TrendingByCategory.jsx` | Create | 3 category product rows |
| `src/pages/landing/CuratedCollections.jsx` | Create | 3 editorial collection cards |
| `src/pages/landing/BrowseByRegion.jsx` | Create | 4 region cards |
| `src/pages/landing/HowItWorks.jsx` | Create | 3-step panel |
| `src/pages/landing/PlatformFeatures.jsx` | Create | 3×2 feature grid |
| `src/pages/landing/StatsSection.jsx` | Create | Dark stats with 4 numbers |
| `src/pages/landing/Testimonials.jsx` | Create | 3 testimonial cards |
| `src/pages/landing/ForBrandsSplit.jsx` | Create | Left perks + dark right metrics |
| `src/pages/landing/FaqSection.jsx` | Create | 6 FAQ cards in 2 cols |
| `src/pages/landing/NewsletterSection.jsx` | Create | Email capture |
| `src/pages/landing/CtaBanner.jsx` | Create | Full-width terracotta CTA |
| `src/pages/landing/LandingFooter.jsx` | Create | 5-column footer |
| `src/pages/LandingPage.jsx` | Replace | Assemble all sections |

---

## Task 1: tokens.js + data.js

**Files:**
- Create: `src/pages/landing/tokens.js`
- Create: `src/pages/landing/data.js`

- [ ] **Create `src/pages/landing/tokens.js`**

```js
export const T = {
  c:    '#F7F1E8',
  cm:   '#EDE6D6',
  cd:   '#E2D8C6',
  w:    '#FFFFFF',
  t:    '#C4773A',
  td:   '#A8622E',
  tl:   '#FDF3EB',
  tm:   '#E8A876',
  ink:  '#1C1915',
  is:   '#3D3830',
  mu:   '#8A8178',
  b:    '#DEDAD0',
  bs:   '#EDE8DF',
  g:    '#3D7A52',
  gl:   '#EBF4EE',
  n:    '#1B3175',
  nl:   '#EEF2FB',
};

export const shadow = {
  sm:  '0 2px 8px rgba(28,25,21,.07)',
  md:  '0 8px 32px rgba(28,25,21,.10)',
  lg:  '0 20px 64px rgba(28,25,21,.14)',
};

export const W = { maxWidth: 1200, margin: '0 auto' };

export const eyebrow = {
  fontSize: 11, fontWeight: 700, letterSpacing: '.14em',
  textTransform: 'uppercase', color: T.t, marginBottom: 8,
};

export const sectionTitle = {
  fontFamily: "'Playfair Display', Georgia, serif",
  fontSize: 'clamp(26px,3vw,40px)', fontWeight: 700,
  color: T.ink, letterSpacing: -1, lineHeight: 1.1,
};

export const tag = (variant = 't') => {
  const map = {
    t: { background: T.tl, color: T.t },
    g: { background: T.gl, color: T.g },
    n: { background: T.nl, color: T.n },
  };
  return {
    ...map[variant],
    fontSize: 10, padding: '3px 9px', borderRadius: 4,
    fontWeight: 600, display: 'inline-block',
  };
};

export const btnPrimary = {
  padding: '11px 26px', borderRadius: 8, border: 'none',
  background: `linear-gradient(135deg,${T.t},${T.td})`,
  color: '#fff', fontSize: 14, fontWeight: 700,
  cursor: 'pointer', fontFamily: 'inherit',
  boxShadow: `0 8px 28px rgba(196,119,58,.38)`,
  transition: '.18s', letterSpacing: '.01em',
};

export const btnGhost = {
  padding: '10px 24px', borderRadius: 8,
  border: `1.5px solid ${T.b}`, background: 'transparent',
  fontSize: 14, fontWeight: 500, color: T.ink,
  cursor: 'pointer', fontFamily: 'inherit', transition: '.18s',
};

export const viewAll = {
  fontSize: 13, color: T.t, fontWeight: 600,
  textDecoration: 'none', display: 'inline-flex',
  alignItems: 'center', gap: 5, padding: '8px 16px',
  borderRadius: 7, border: `1.5px solid rgba(196,119,58,.25)`,
  background: T.tl, transition: '.18s', whiteSpace: 'nowrap',
  flexShrink: 0, cursor: 'pointer',
};

export const sectionPad = { padding: '80px 56px' };
```

- [ ] **Create `src/pages/landing/data.js`**

```js
export const HERO_PRODUCTS = [
  { emoji:'🧵', bg:'linear-gradient(145deg,#FDEBD0,#F5C898)', badge:'Trending', badgeBg:'linear-gradient(135deg,#C4773A,#A8622E)', name:'Silk Saree Fabric', brand:'Artisan Textiles · Surat', price:'₹450', unit:'/pc', moq:'MOQ 50 pcs' },
  { emoji:'🌾', bg:'linear-gradient(145deg,#D5E8D5,#A8CCA8)', badge:'Organic',  badgeBg:'linear-gradient(135deg,#3D7A52,#2A6040)', name:'Basmati Rice Premium', brand:'Punjab Agro · Ludhiana', price:'₹85', unit:'/kg', moq:'MOQ 500 kg' },
  { emoji:'⚙️', bg:'linear-gradient(145deg,#D5DCE8,#A8B4C8)', badge:null, name:'SS Auto Fasteners', brand:'TechParts · Pune', price:'₹1,200', unit:'/set', moq:'MOQ 100 sets' },
  { emoji:'🏺', bg:'linear-gradient(145deg,#EAD5D5,#CAA8A8)', badge:null, name:'Rajasthani Pottery', brand:'Heritage Crafts · Jaipur', price:'₹320', unit:'/pc', moq:'MOQ 24 pcs' },
  { emoji:'🌿', bg:'linear-gradient(145deg,#E8E0D5,#C8B898)', badge:'Export', badgeBg:'linear-gradient(135deg,#7A5C38,#5A4028)', name:'Kashmiri Saffron', brand:'Spice Garden · Srinagar', price:'₹1,800', unit:'/g', moq:'MOQ 10 g' },
];

export const TICKER_ITEMS = [
  { text: 'Rahul Exports', suffix: ' placed a ₹2.4L order · 2 min ago' },
  { bold: '142 buyers', suffix: ' joined today' },
  { bold: 'Artisan Textiles', suffix: ' listed 18 new products' },
  { bold: '₹4.8 Cr', suffix: ' in trades settled this week' },
  { bold: 'New: Pharma', suffix: ' category now open for sourcing' },
];

export const CATEGORY_NAV = [
  { icon:'✦', label:'All', active: true },
  { icon:'🧵', label:'Textiles' },
  { icon:'🌾', label:'Agriculture' },
  { icon:'⚙️', label:'Engineering' },
  { icon:'💊', label:'Pharma' },
  { icon:'🏺', label:'Handicrafts' },
  { icon:'🖥️', label:'Electronics' },
  { icon:'🌿', label:'Spices & Food' },
  { icon:'💎', label:'Jewelry' },
  { icon:'🧴', label:'Beauty & Health' },
  { icon:'🏗️', label:'Construction' },
];

export const PRESS_LOGOS = ['Economic Times','YourStory','Inc42','The Hindu Business','Mint','Business Standard'];

export const CAT_HERO = [
  { emoji:'🧵', bg:'linear-gradient(145deg,#FDEBD0,#E8A870)', name:'Textiles',     count:'1,240 brands · 18,000+ products', chip:'Sarees · Fabric · Garments' },
  { emoji:'🌾', bg:'linear-gradient(145deg,#C8DEBA,#8ABD78)', name:'Agriculture',  count:'856 brands · 12,000+ products',  chip:'Grains · Spices · Organic' },
  { emoji:'⚙️', bg:'linear-gradient(145deg,#B8C8DE,#7A90B0)', name:'Engineering',  count:'624 brands · 8,500+ products',   chip:'Auto Parts · Machinery' },
  { emoji:'🏺', bg:'linear-gradient(145deg,#DEB8C8,#B07A90)', name:'Handicrafts',  count:'982 brands · 15,000+ products',  chip:'Pottery · Jewelry · Wood Art' },
];

export const CAT_SUB = [
  { icon:'💊', name:'Pharma',         count:'412 brands' },
  { icon:'🖥️', name:'Electronics',    count:'538 brands' },
  { icon:'🌿', name:'Spices & Food',  count:'734 brands' },
  { icon:'💎', name:'Jewelry',        count:'290 brands' },
  { icon:'🧴', name:'Beauty & Health',count:'368 brands' },
];

export const BRANDS = [
  { emoji:'🧵', bg:'linear-gradient(145deg,#FDEBD0,#F0B870)', badge:'✓ Verified', badgeStyle:{background:'rgba(61,122,82,.9)',color:'#fff'}, name:'Artisan Textiles Co.', loc:'📍 Surat, Gujarat · Est. 2008', products:'1,200+', rating:'4.9★', min:'₹5K', tags:[{v:'g',l:'Top Rated'},{v:'t',l:'Sarees'},{v:'n',l:'Export'}] },
  { emoji:'🌾', bg:'linear-gradient(145deg,#C8DCBA,#90BC78)',  badge:'🌿 Organic', badgeStyle:{background:'rgba(61,122,52,.9)',color:'#fff'}, name:'Punjab Agro Foods',    loc:'📍 Ludhiana, Punjab · Est. 2011', products:'340+',  rating:'4.8★', min:'₹2K', tags:[{v:'g',l:'Verified'},{v:'t',l:'Organic'},{v:'g',l:'FSSAI'}] },
  { emoji:'⚙️', bg:'linear-gradient(145deg,#C0CCE0,#8898B8)',  badge:'✓ Verified', badgeStyle:{background:'rgba(61,122,82,.9)',color:'#fff'}, name:'TechParts India',     loc:'📍 Pune, Maharashtra · Est. 2005', products:'2,800+',rating:'4.9★', min:'₹10K',tags:[{v:'g',l:'Top Rated'},{v:'n',l:'ISO 9001'},{v:'t',l:'Auto'}] },
  { emoji:'🏺', bg:'linear-gradient(145deg,#E0C0C8,#B88898)',  badge:'✓ Verified', badgeStyle:{background:'rgba(61,122,82,.9)',color:'#fff'}, name:'Heritage Handicrafts', loc:'📍 Jaipur, Rajasthan · Est. 2001', products:'680+',  rating:'4.8★', min:'₹3K', tags:[{v:'g',l:'Verified'},{v:'t',l:'Handmade'},{v:'n',l:'Export'}] },
];

export const TRENDING_PRODUCTS = [
  { emoji:'🧶', bg:'linear-gradient(145deg,#FDEBD0,#F5C898)', badge:'New',    badgeBg:'linear-gradient(135deg,#C4773A,#A8622E)', brand:'Artisan Textiles', name:'Cotton Kurta Fabric 44"', moq:'MOQ: 100 meters', price:'₹220',  unit:'/meter', rating:'4.9 (128)' },
  { emoji:'🫚', bg:'linear-gradient(145deg,#D5E8D5,#A8CCA8)', badge:null,     brand:'Punjab Agro',        name:'Cold-Press Mustard Oil',  moq:'MOQ: 200 litres', price:'₹140',  unit:'/litre',  rating:'4.8 (94)' },
  { emoji:'🔩', bg:'linear-gradient(145deg,#D5DCE8,#A8B4C8)', badge:null,     brand:'TechParts India',    name:'SS Hex Bolt Set M12',     moq:'MOQ: 500 units',  price:'₹850',  unit:'/set',    rating:'5.0 (210)' },
  { emoji:'💎', bg:'linear-gradient(145deg,#EAD5E8,#C0A0C0)', badge:'Luxury', badgeBg:'linear-gradient(135deg,#1B3175,#122460)', brand:'Rajasthan Gems', name:'Kundan Bridal Jewelry', moq:'MOQ: 5 sets', price:'₹4,200', unit:'/set', rating:'4.9 (67)' },
  { emoji:'🌿', bg:'linear-gradient(145deg,#E8E0D5,#C8B898)', badge:'Export', badgeBg:'linear-gradient(135deg,#7A5C38,#5A4028)', brand:'Spice Garden',  name:'A-Grade Kashmiri Saffron', moq:'MOQ: 10 grams', price:'₹1,800', unit:'/g', rating:'5.0 (183)' },
];

export const NEW_THIS_WEEK = [
  { emoji:'🧶', bg:'linear-gradient(145deg,#FDEBD0,#F0C898)', brand:'Artisan Textiles', name:"Linen Kurta Fabric 58\"", price:'₹280/m' },
  { emoji:'🫙', bg:'linear-gradient(145deg,#D5E8D5,#A8CC90)', brand:'Spice Garden',     name:'Turmeric — Lakadong',    price:'₹320/kg' },
  { emoji:'🔧', bg:'linear-gradient(145deg,#D5DCE8,#A0ACC0)', brand:'TechParts',        name:'Precision Drill Bit Set',price:'₹1,400/set' },
  { emoji:'🏺', bg:'linear-gradient(145deg,#EAD5D5,#C8A0A0)', brand:'Heritage Crafts',  name:'Blue Pottery Vase',      price:'₹560/pc' },
  { emoji:'🌿', bg:'linear-gradient(145deg,#D4E8D4,#A0C4A0)', brand:'Green Earth',      name:'Ashwagandha Root Powder',price:'₹240/kg' },
  { emoji:'💐', bg:'linear-gradient(145deg,#EAE0D8,#C8B8A0)', brand:'Floral India',     name:'Rose Attar Essential Oil',price:'₹3,200/L' },
];

export const TRENDING_ROWS = [
  {
    icon:'🧵', iconBg:'linear-gradient(135deg,#FDEBD0,#F0B870)', iconBorder:'rgba(196,119,58,.2)',
    title:'Trending in Textiles', count:'1,240 suppliers · 18,000+ products', link:'All Textiles →',
    products:[
      { emoji:'🥻', bg:'linear-gradient(145deg,#FDEBD0,#F0C898)', name:'Banarasi Silk Saree',  price:'₹2,400/pc', moq:'MOQ 10 pcs' },
      { emoji:'👘', bg:'linear-gradient(145deg,#F5E8D8,#E0C8A0)', name:'Khadi Cotton Fabric',  price:'₹180/m',    moq:'MOQ 50 m' },
      { emoji:'🧣', bg:'linear-gradient(145deg,#EAE0F0,#C8B0D8)', name:'Pashmina Shawl',       price:'₹1,800/pc', moq:'MOQ 5 pcs' },
      { emoji:'🧤', bg:'linear-gradient(145deg,#F0D8D8,#D8A8A8)', name:'Embroidered Dupatta',  price:'₹340/pc',   moq:'MOQ 20 pcs' },
      { emoji:'🎽', bg:'linear-gradient(145deg,#D8EAD8,#A8C8A8)', name:'Cotton Kurta Set',     price:'₹520/set',  moq:'MOQ 12 pcs' },
      { emoji:'🧶', bg:'linear-gradient(145deg,#D8D8EA,#A8A8C8)', name:'Linen Blend Fabric',   price:'₹260/m',    moq:'MOQ 100 m' },
    ],
  },
  {
    icon:'🌾', iconBg:'linear-gradient(135deg,#C8DCBA,#90BC78)', iconBorder:'rgba(61,122,52,.2)',
    title:'Trending in Agriculture & Food', count:'856 suppliers · 12,000+ products', link:'All Agriculture →',
    products:[
      { emoji:'🌾', bg:'linear-gradient(145deg,#F0EAD0,#D8C888)', name:'Organic Basmati Rice',   price:'₹85/kg',   moq:'MOQ 500 kg' },
      { emoji:'🫙', bg:'linear-gradient(145deg,#E8F0D8,#B8D898)', name:'Raw Turmeric Powder',    price:'₹120/kg',  moq:'MOQ 100 kg' },
      { emoji:'🌶️',bg:'linear-gradient(145deg,#F0E0D0,#D8A888)', name:'Kashmiri Red Chilli',   price:'₹280/kg',  moq:'MOQ 50 kg' },
      { emoji:'🫒', bg:'linear-gradient(145deg,#D8F0D8,#98D098)', name:'Cold-Press Coconut Oil', price:'₹160/L',   moq:'MOQ 200 L' },
      { emoji:'🌿', bg:'linear-gradient(145deg,#F0F0D8,#C8C898)', name:'Dried Moringa Leaves',  price:'₹480/kg',  moq:'MOQ 25 kg' },
      { emoji:'🧄', bg:'linear-gradient(145deg,#EAD8D8,#C8A0A0)', name:'Premium Garlic Flakes', price:'₹320/kg',  moq:'MOQ 50 kg' },
    ],
  },
  {
    icon:'🏺', iconBg:'linear-gradient(135deg,#DEB8C8,#B07890)', iconBorder:'rgba(176,120,144,.2)',
    title:'Trending in Handicrafts', count:'982 suppliers · 15,000+ products', link:'All Handicrafts →',
    products:[
      { emoji:'🏺', bg:'linear-gradient(145deg,#EAD5D5,#C8A0A0)', name:'Blue Pottery Vase',       price:'₹560/pc',   moq:'MOQ 6 pcs' },
      { emoji:'💎', bg:'linear-gradient(145deg,#EAD5E8,#C0A0C0)', name:'Kundan Necklace Set',     price:'₹3,200/pc', moq:'MOQ 3 pcs' },
      { emoji:'🪆', bg:'linear-gradient(145deg,#D5EAD5,#A0C8A0)', name:'Channapatna Toys',        price:'₹180/set',  moq:'MOQ 12 sets' },
      { emoji:'🪞', bg:'linear-gradient(145deg,#EAE0D5,#C8B8A0)', name:'Rajasthani Mirror Work', price:'₹2,400/pc', moq:'MOQ 4 pcs' },
      { emoji:'🎎', bg:'linear-gradient(145deg,#D5D5EA,#A8A8C8)', name:'Madhubani Art Print',    price:'₹420/pc',   moq:'MOQ 10 pcs' },
      { emoji:'🧺', bg:'linear-gradient(145deg,#EAD5C0,#C8A880)', name:'Bamboo Basket Set',      price:'₹280/set',  moq:'MOQ 24 sets' },
    ],
  },
];

export const COLLECTIONS = [
  { emoji:'🌿', bg:'linear-gradient(145deg,#1E3A28,#0E2218)', glow:'rgba(61,122,52,.4)', wide:true,  name:"Organic India — Farm to Shelf", desc:'Certified organic producers from Punjab, Maharashtra & Kerala. Grains, oils, spices — all traceable to source.' },
  { emoji:'💎', bg:'linear-gradient(145deg,#3A1E2A,#221018)', glow:'rgba(196,119,58,.3)', wide:false, name:'The Luxury Craft Edit',         desc:'Heritage artisans from Rajasthan & UP producing export-grade jewelry, textiles, and decor.' },
  { emoji:'⚙️', bg:'linear-gradient(145deg,#1E2A3A,#101822)', glow:'rgba(27,49,117,.4)',  wide:false, name:'Made in Maharashtra',           desc:'Engineering & auto component suppliers from Pune, Nashik & Aurangabad — ISO certified.' },
];

export const REGIONS = [
  { emoji:'🏙️', bg:'linear-gradient(145deg,#FFF8F0,#FDF0E4)', border:'rgba(196,119,58,.15)', name:'North India', cities:'Delhi NCR · Ludhiana · Kanpur · Jaipur · Agra',       tags:[['t','Textiles'],['n','Leather'],['g','Handicrafts']] },
  { emoji:'🌊', bg:'linear-gradient(145deg,#F0FFF6,#E4F8EC)', border:'rgba(61,122,52,.15)',   name:'West India',  cities:'Mumbai · Surat · Pune · Ahmedabad · Rajkot',           tags:[['t','Diamonds'],['n','Engineering'],['g','Textiles']] },
  { emoji:'🌿', bg:'linear-gradient(145deg,#FFF0F8,#F8E4F0)', border:'rgba(176,120,144,.15)', name:'South India', cities:'Bengaluru · Chennai · Hyderabad · Coimbatore · Kochi', tags:[['t','Electronics'],['n','Pharma'],['g','Spices']] },
  { emoji:'🌾', bg:'linear-gradient(145deg,#F0F4FF,#E4ECF8)', border:'rgba(27,49,117,.12)',   name:'East India',  cities:'Kolkata · Bhubaneswar · Patna · Guwahati · Ranchi',    tags:[['t','Jute'],['n','Agriculture'],['g','Crafts']] },
];

export const FEATURES = [
  { icon:'🤝', iconBg:'linear-gradient(135deg,#FDF3EB,#FAE8D4)', iconBorder:'rgba(196,119,58,.25)', title:'Trade Assurance',     desc:"Escrow-backed payments release only after you approve goods. Every transaction is fully protected." },
  { icon:'⚡', iconBg:'linear-gradient(135deg,#EBF4EE,#DCF0E4)', iconBorder:'rgba(61,122,52,.2)',   title:'Instant RFQ Matching', desc:'Post a requirement and receive verified quotes within hours. Our engine surfaces the right suppliers for your spec.' },
  { icon:'📊', iconBg:'linear-gradient(135deg,#EEF2FB,#DCE4F8)', iconBorder:'rgba(27,49,117,.15)',  title:'Real-Time Analytics',  desc:'Live dashboards for market rates, supplier scorecards, and logistics tracking — unified into one command centre.' },
  { icon:'📄', iconBg:'linear-gradient(135deg,#FDF3EB,#FAE8D4)', iconBorder:'rgba(196,119,58,.25)', title:'Digital Contracts',    desc:'Negotiate terms, sign digitally, and store every contract securely. No PDFs over email, no lost agreements.' },
  { icon:'🚚', iconBg:'linear-gradient(135deg,#EBF4EE,#DCF0E4)', iconBorder:'rgba(61,122,52,.2)',   title:'Shipment Tracking',    desc:'Real-time logistics visibility from dispatch to delivery. Know exactly where your order is at every step.' },
  { icon:'🛡️', iconBg:'linear-gradient(135deg,#EEF2FB,#DCE4F8)', iconBorder:'rgba(27,49,117,.15)',  title:'GST & Compliance',     desc:'GST invoices generated automatically for every transaction. Stay compliant without extra overhead.' },
];

export const STATS = [
  { num:'5,000', suf:'+',  label:'Verified Suppliers' },
  { num:'50',    suf:'K+', label:'Product Listings' },
  { num:'₹250',  suf:'Cr', label:'Monthly Trade Volume' },
  { num:'500',   suf:'+',  label:'Cities Covered' },
];

export const TESTIMONIALS = [
  { initial:'R', bg:'linear-gradient(135deg,#C4773A,#A8622E)', rating:'★★★★★', quote:'"Globrixa slashed our sourcing time by 60%. The supplier matching for auto components is unlike anything else in the market."', name:'Rajesh Kumar',    role:'Procurement Head · TechParts Pvt Ltd, Pune' },
  { initial:'P', bg:'linear-gradient(135deg,#3D7A52,#2A6040)', rating:'★★★★★', quote:'"International buyer reach tripled in three months. Best platform for Indian textile exporters, hands down."',               name:'Priya Venkatesh', role:'Export Manager · SilkRoute Exports, Surat' },
  { initial:'A', bg:'linear-gradient(135deg,#1B3175,#122460)', rating:'★★★★★', quote:'"Trade assurance gave us the confidence to go global. Payments are always on time. Outstanding platform."',                   name:'Amandeep Singh',  role:'Founder & CEO · Punjab Agro Foods, Ludhiana' },
];

export const BRAND_PERKS = [
  { icon:'📦', title:'Free to list',          desc:'Get your catalog live in minutes. No upfront cost, no hidden fees.' },
  { icon:'📊', title:'Real-time analytics',   desc:"See who's viewing your products and track every order live." },
  { icon:'🛡️', title:'Payment protection',    desc:'Trade assurance means you get paid — every time, on time.' },
];

export const BRAND_METRICS = [
  { icon:'📈', num:'3× growth',    label:'Average buyer reach increase in first 90 days' },
  { icon:'⚡', num:'24 hrs',       label:'Average time to first verified inquiry' },
  { icon:'💰', num:'₹0 upfront',   label:'Free to list — pay only when you sell' },
  { icon:'🌍', num:'120+ countries',label:'International buyers sourcing from India' },
];

export const FAQS = [
  { q:'How do I verify a supplier on Globrixa?',           a:'Every supplier undergoes GST-based KYC before listing. Verified badges indicate completion. You can view ratings, reviews, and transaction history before ordering.' },
  { q:'What is Trade Assurance and how does it protect me?',a:'Trade Assurance holds your payment in escrow until goods are received and match your order. If there\'s a dispute, our resolution team steps in — you never lose money on a valid order.' },
  { q:'Can I negotiate price directly with a supplier?',    a:'Yes. Every listing supports direct messaging and RFQ. Suppliers can offer custom pricing, packaging, and shipping terms for your specific order size.' },
  { q:'What payment terms are available?',                  a:'We support Net 15, Net 30, and Net 60 for qualifying buyers. Instant payment via UPI, NEFT, RTGS, and international wire are also available for all orders.' },
  { q:'Is Globrixa free for buyers?',                       a:'Yes — buyers can browse, contact suppliers, and place orders for free. A Pro plan is available for bulk RFQs, priority matching, and dedicated account management.' },
  { q:'How do I list my products as a supplier?',           a:'Apply as a brand, complete GST verification, and upload your catalog. First 50 listings are free. Our onboarding team guides you in under 24 hours.' },
];

export const FOOTER_COLS = [
  { heading:'Platform',    links:['Products','Suppliers','RFQs','Analytics','Pricing'] },
  { heading:'Categories',  links:['Textiles','Agriculture','Engineering','Handicrafts','View all 24'] },
  { heading:'Company',     links:['About','Blog','Careers','Press'] },
  { heading:'Support',     links:['Help Center','Contact','Privacy','Terms','Refund Policy'] },
];
```

- [ ] **Commit**
```bash
git add src/pages/landing/tokens.js src/pages/landing/data.js
git commit -m "feat(landing): add design tokens and static data"
```

---

## Task 2: AnnouncementBar + LandingNavbar

**Files:**
- Create: `src/pages/landing/AnnouncementBar.jsx`
- Create: `src/pages/landing/LandingNavbar.jsx`

- [ ] **Create `src/pages/landing/AnnouncementBar.jsx`**

```jsx
export default function AnnouncementBar() {
  return (
    <div style={{
      background: 'linear-gradient(90deg,#1C1915 0%,#2A2320 50%,#1C1915 100%)',
      color: 'rgba(255,255,255,.82)', fontSize: 12, fontWeight: 500,
      textAlign: 'center', padding: '10px 20px',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
      letterSpacing: '.01em',
    }}>
      <span style={{
        background: 'linear-gradient(135deg,#C4773A,#A8622E)',
        color: '#fff', fontSize: 9, fontWeight: 800,
        padding: '3px 10px', borderRadius: 4, letterSpacing: '.08em', textTransform: 'uppercase',
      }}>NEW</span>
      Trade assurance now covers international shipments —{' '}
      <span style={{ color: '#E8A876', fontWeight: 600, cursor: 'pointer' }}>Learn more →</span>
    </div>
  );
}
```

- [ ] **Create `src/pages/landing/LandingNavbar.jsx`**

```jsx
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleLogin } from '../../features/auth/authSlice';
import { T, btnPrimary, btnGhost } from './tokens';

export default function LandingNavbar() {
  const dispatch = useDispatch();
  const [hoverSign, setHoverSign] = useState(false);
  const [hoverJoin, setHoverJoin] = useState(false);

  return (
    <nav style={{
      background: 'rgba(247,241,232,.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${T.bs}`,
      padding: '0 56px', height: 68,
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 200, gap: 24,
    }}>
      {/* Logo */}
      <div style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: 23, fontWeight: 900, color: T.ink,
        letterSpacing: '-.5px', flexShrink: 0,
      }}>
        Globri<span style={{ color: T.t }}>xa</span>
      </div>

      {/* Search */}
      <div style={{
        flex: 1, maxWidth: 540, background: T.w,
        border: `1.5px solid ${T.b}`, borderRadius: 10,
        height: 44, display: 'flex', alignItems: 'center',
        padding: '0 6px 0 16px', gap: 10,
        boxShadow: '0 2px 8px rgba(28,25,21,.07)',
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke={T.mu} strokeWidth="2" style={{ flexShrink: 0 }}>
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="text"
          placeholder="Search products, suppliers, categories…"
          style={{
            border: 'none', outline: 'none', background: 'transparent',
            fontSize: 14, color: T.ink, fontFamily: 'inherit', width: '100%',
          }}
        />
        <button style={{
          background: T.t, border: 'none', borderRadius: 7,
          width: 32, height: 32, display: 'flex', alignItems: 'center',
          justifyContent: 'center', cursor: 'pointer', color: '#fff', fontSize: 14,
          flexShrink: 0,
        }}>→</button>
      </div>

      {/* Nav links */}
      <div style={{ display: 'flex', gap: 2 }}>
        {['Discover', 'Suppliers', 'Pricing'].map(l => (
          <span key={l} style={{
            padding: '7px 13px', borderRadius: 7, fontSize: 13,
            color: T.is, cursor: 'pointer', fontWeight: 500,
          }}>{l}</span>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
        <button
          onClick={() => dispatch(toggleLogin(true))}
          onMouseEnter={() => setHoverSign(true)}
          onMouseLeave={() => setHoverSign(false)}
          style={{
            ...btnGhost,
            padding: '8px 18px', fontSize: 13,
            ...(hoverSign ? { borderColor: T.t, background: T.tl, color: T.t } : {}),
          }}>Sign in</button>
        <button
          onClick={() => dispatch(toggleLogin(true))}
          onMouseEnter={() => setHoverJoin(true)}
          onMouseLeave={() => setHoverJoin(false)}
          style={{
            ...btnPrimary,
            padding: '9px 20px', fontSize: 13,
            ...(hoverJoin ? { background: `linear-gradient(135deg,${T.td},#8A5226)`, transform: 'translateY(-1px)' } : {}),
          }}>Join free</button>
      </div>
    </nav>
  );
}
```

- [ ] **Start dev server and verify no errors**
```bash
npm run dev
```
Open http://localhost:5173 — page should load (still showing old LandingPage).

- [ ] **Commit**
```bash
git add src/pages/landing/AnnouncementBar.jsx src/pages/landing/LandingNavbar.jsx
git commit -m "feat(landing): add AnnouncementBar and LandingNavbar"
```

---

## Task 3: HeroSection

**Files:**
- Create: `src/pages/landing/HeroSection.jsx`

- [ ] **Create `src/pages/landing/HeroSection.jsx`**

```jsx
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleLogin } from '../../features/auth/authSlice';
import { T, shadow, W } from './tokens';
import { HERO_PRODUCTS } from './data';

function HeroProductCard({ item }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: T.w, borderRadius: 14, overflow: 'hidden',
        boxShadow: hov ? shadow.md : shadow.sm,
        border: `1px solid ${T.bs}`,
        transform: hov ? 'translateY(-5px)' : 'none',
        transition: '.22s', cursor: 'pointer',
      }}
    >
      <div style={{
        height: 108, background: item.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 36, position: 'relative',
      }}>
        {item.emoji}
        {item.badge && (
          <span style={{
            position: 'absolute', top: 9, left: 9,
            background: item.badgeBg, color: '#fff',
            fontSize: 8, fontWeight: 800, padding: '3px 9px',
            borderRadius: 5, letterSpacing: '.04em',
            backdropFilter: 'blur(4px)',
          }}>{item.badge}</span>
        )}
        <span style={{
          position: 'absolute', top: 9, right: 9,
          background: 'rgba(255,255,255,.92)', backdropFilter: 'blur(4px)',
          borderRadius: '50%', width: 26, height: 26,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, boxShadow: shadow.sm,
        }}>♡</span>
      </div>
      <div style={{ padding: '11px 13px 13px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.ink, marginBottom: 3, lineHeight: 1.3 }}>{item.name}</div>
        <div style={{ fontSize: 10, color: T.mu, marginBottom: 6 }}>{item.brand}</div>
        <div style={{ fontSize: 13, fontWeight: 800, color: T.t, display: 'flex', alignItems: 'baseline', gap: 3 }}>
          {item.price}<small style={{ fontSize: 9, color: T.mu, fontWeight: 400 }}>{item.unit}</small>
        </div>
        <div style={{ fontSize: 9, color: T.mu, marginTop: 2 }}>{item.moq}</div>
      </div>
    </div>
  );
}

function HeroCtaTile() {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: `linear-gradient(135deg,${T.t},${T.td})`,
        borderRadius: 14, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 8, padding: 16, minHeight: 168, cursor: 'pointer',
        opacity: hov ? 0.92 : 1, transition: '.18s',
        backgroundImage: `linear-gradient(135deg,${T.t},${T.td}), url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle stroke='rgba(255,255,255,0.08)' stroke-width='1' cx='20' cy='20' r='18' fill='none'/%3E%3C/svg%3E")`,
      }}
    >
      <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 900, color: '#fff', letterSpacing: -1 }}>5,000+</span>
      <span style={{ fontSize: 10, color: 'rgba(255,255,255,.82)', textAlign: 'center', lineHeight: 1.5 }}>verified suppliers ready to ship</span>
      <span style={{ fontSize: 20, color: 'rgba(255,255,255,.55)' }}>↗</span>
    </div>
  );
}

export default function HeroSection() {
  const dispatch = useDispatch();
  const [hovMain, setHovMain] = useState(false);
  const [hovSec, setHovSec] = useState(false);

  return (
    <section style={{ background: T.c, position: 'relative', overflow: 'hidden' }}>
      {/* ambient globs */}
      <div style={{ position:'absolute', top:-200, right:-200, width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle,rgba(196,119,58,.10),transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:-150, left:-150, width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(61,122,82,.08),transparent 70%)', pointerEvents:'none' }} />

      <div style={{ ...W, padding: '72px 56px 0', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center', paddingBottom: 60 }}>

          {/* LEFT */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: T.t, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.t, flexShrink: 0 }} />
              <span style={{ width: 28, height: 1.5, background: `linear-gradient(90deg,${T.t},transparent)` }} />
              India's B2B Wholesale Marketplace
            </div>

            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(42px,5vw,68px)', fontWeight:900, lineHeight:1.01, letterSpacing:-2.5, color:T.ink, marginBottom:22 }}>
              Where brands<br/>meet{' '}
              <em style={{ fontStyle:'italic', background:`linear-gradient(135deg,${T.t} 0%,#E8A060 100%)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>buyers</em>
            </h1>

            <p style={{ fontSize:17, color:T.is, lineHeight:1.82, marginBottom:38, maxWidth:430, fontWeight:400 }}>
              Discover 50,000+ products from 5,000+ verified Indian suppliers. Order wholesale, pay on terms, and grow faster — all in one place.
            </p>

            <div style={{ display:'flex', gap:12, marginBottom:40 }}>
              <button
                onClick={() => dispatch(toggleLogin(true))}
                onMouseEnter={() => setHovMain(true)}
                onMouseLeave={() => setHovMain(false)}
                style={{
                  padding:'15px 34px', borderRadius:10,
                  background: hovMain ? `linear-gradient(135deg,${T.td},#8A5226)` : `linear-gradient(135deg,${T.t},${T.td})`,
                  color:'#fff', fontSize:15, fontWeight:700, border:'none',
                  cursor:'pointer', fontFamily:'inherit',
                  boxShadow:'0 8px 28px rgba(196,119,58,.38)',
                  transform: hovMain ? 'translateY(-2px)' : 'none',
                  transition:'.2s',
                }}>Start sourcing free</button>
              <button
                onClick={() => dispatch(toggleLogin(true))}
                onMouseEnter={() => setHovSec(true)}
                onMouseLeave={() => setHovSec(false)}
                style={{
                  padding:'14px 28px', borderRadius:10,
                  background: hovSec ? T.tl : T.w,
                  color:T.ink, fontSize:15, fontWeight:600,
                  border: `1.5px solid ${hovSec ? T.t : T.b}`,
                  cursor:'pointer', fontFamily:'inherit',
                  boxShadow:'0 2px 8px rgba(28,25,21,.07)', transition:'.18s',
                }}>List your brand →</button>
            </div>

            <div style={{ display:'flex', gap:22, flexWrap:'wrap' }}>
              {['GST Verified', 'Trade Assured', 'Net 30 Terms'].map(txt => (
                <div key={txt} style={{ display:'flex', alignItems:'center', gap:7, fontSize:12, color:T.mu, fontWeight:500 }}>
                  <span style={{ width:20, height:20, borderRadius:'50%', background:'#EBF4EE', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, color:'#3D7A52', fontWeight:700 }}>✓</span>
                  {txt}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
            {HERO_PRODUCTS.map((item, i) => <HeroProductCard key={i} item={item} />)}
            <HeroCtaTile />
          </div>

        </div>
      </div>
    </section>
  );
}
```

- [ ] **Commit**
```bash
git add src/pages/landing/HeroSection.jsx
git commit -m "feat(landing): add HeroSection"
```

---

## Task 4: SocialProofTicker + CategoryNavBar + PressStrip

**Files:**
- Create: `src/pages/landing/SocialProofTicker.jsx`
- Create: `src/pages/landing/CategoryNavBar.jsx`
- Create: `src/pages/landing/PressStrip.jsx`

- [ ] **Create `src/pages/landing/SocialProofTicker.jsx`**

```jsx
import { T } from './tokens';
import { TICKER_ITEMS } from './data';

export default function SocialProofTicker() {
  return (
    <div style={{
      background: T.w, borderTop:`1px solid ${T.bs}`, borderBottom:`1px solid ${T.bs}`,
      padding:'13px 56px', display:'flex', gap:40, alignItems:'center', overflow:'hidden',
    }}>
      {TICKER_ITEMS.map((item, i) => (
        <>
          {i > 0 && <div key={`div-${i}`} style={{ width:1, height:16, background:T.bs, flexShrink:0 }} />}
          <div key={i} style={{ display:'flex', alignItems:'center', gap:9, whiteSpace:'nowrap', flexShrink:0 }}>
            <div style={{ width:7, height:7, borderRadius:'50%', background:'#3D7A52', flexShrink:0, boxShadow:'0 0 6px rgba(61,122,82,.5)' }} />
            <span style={{ fontSize:13, color:T.is, fontWeight:500 }}>
              <span style={{ fontWeight:700, color:T.ink }}>{item.bold || item.text}</span>
              {item.suffix}
            </span>
          </div>
        </>
      ))}
    </div>
  );
}
```

- [ ] **Create `src/pages/landing/CategoryNavBar.jsx`**

```jsx
import { T } from './tokens';
import { CATEGORY_NAV } from './data';

export default function CategoryNavBar() {
  return (
    <div style={{
      background: T.w, borderBottom:`1.5px solid ${T.bs}`,
      padding:'0 56px', position:'sticky', top:68, zIndex:150,
      boxShadow:'0 2px 12px rgba(28,25,21,.04)',
    }}>
      <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', alignItems:'center', overflowX:'auto', scrollbarWidth:'none' }}>
        {CATEGORY_NAV.map(item => (
          <div key={item.label} style={{
            padding:'15px 18px', fontSize:13, fontWeight: item.active ? 600 : 500,
            color: item.active ? T.t : T.mu,
            cursor:'pointer', whiteSpace:'nowrap',
            borderBottom: item.active ? `2.5px solid ${T.t}` : '2.5px solid transparent',
            transition:'.15s', display:'flex', alignItems:'center', gap:6,
          }}>
            <span style={{ fontSize:14 }}>{item.icon}</span>
            {item.label}
          </div>
        ))}
        <div style={{ padding:'15px 18px', fontSize:13, fontWeight:600, color:T.t, cursor:'pointer', whiteSpace:'nowrap', borderBottom:'2.5px solid transparent' }}>
          View all 24 →
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Create `src/pages/landing/PressStrip.jsx`**

```jsx
import { T } from './tokens';
import { PRESS_LOGOS } from './data';

export default function PressStrip() {
  return (
    <div style={{ background:T.cm, padding:'28px 56px', borderBottom:`1px solid ${T.b}` }}>
      <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', alignItems:'center', gap:48, flexWrap:'wrap' }}>
        <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:T.mu, flexShrink:0 }}>As seen in</div>
        <div style={{ display:'flex', gap:36, alignItems:'center', flexWrap:'wrap' }}>
          {PRESS_LOGOS.map(name => (
            <div key={name} style={{ fontSize:13, fontWeight:800, color:T.mu, opacity:.45, fontFamily:"'Playfair Display',serif", letterSpacing:'-.2px' }}>{name}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Commit**
```bash
git add src/pages/landing/SocialProofTicker.jsx src/pages/landing/CategoryNavBar.jsx src/pages/landing/PressStrip.jsx
git commit -m "feat(landing): add ticker, category nav, press strip"
```

---

## Task 5: ShopByCategory

**Files:**
- Create: `src/pages/landing/ShopByCategory.jsx`

- [ ] **Create `src/pages/landing/ShopByCategory.jsx`**

```jsx
import { useState } from 'react';
import { T, shadow, W, eyebrow, sectionTitle, viewAll } from './tokens';
import { CAT_HERO, CAT_SUB } from './data';

function CatHeroCard({ item }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius:16, overflow:'hidden', position:'relative', cursor:'pointer',
        aspectRatio:'3/4', display:'flex', flexDirection:'column', justifyContent:'flex-end',
        transform: hov ? 'translateY(-5px)' : 'none',
        boxShadow: hov ? shadow.lg : 'none', transition:'.25s',
      }}
    >
      <div style={{ position:'absolute', inset:0, background:item.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:80, transform: hov ? 'scale(1.04)' : 'scale(1)', transition:'.4s' }} />
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(18,14,10,.82) 0%,rgba(18,14,10,.18) 55%,transparent 100%)' }} />
      <div style={{ position:'relative', zIndex:2, padding:'22px 20px' }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:21, fontWeight:700, color:'#fff', marginBottom:5, lineHeight:1.15 }}>{item.name}</div>
        <div style={{ fontSize:12, color:'rgba(255,255,255,.68)', marginBottom:10 }}>{item.count}</div>
        <div style={{ display:'inline-block', background:'rgba(255,255,255,.12)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,.18)', color:'#fff', fontSize:10, fontWeight:600, padding:'4px 12px', borderRadius:5 }}>{item.chip}</div>
      </div>
    </div>
  );
}

function CatSubCard({ item, cta }) {
  const [hov, setHov] = useState(false);
  if (cta) return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ background: hov ? `linear-gradient(135deg,${T.td},#8A5226)` : `linear-gradient(135deg,${T.t},${T.td})`, borderRadius:12, padding:'16px 10px', textAlign:'center', cursor:'pointer', border:`1.5px solid ${T.t}`, transition:'.18s', transform: hov ? 'translateY(-2px)' : 'none' }}>
      <div style={{ fontSize:22, marginBottom:7 }}>→</div>
      <div style={{ fontSize:11, fontWeight:700, color:'#fff', marginBottom:2 }}>View all 24</div>
      <div style={{ fontSize:10, color:'rgba(255,255,255,.75)' }}>categories</div>
    </div>
  );
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ background: hov ? T.tl : T.w, border:`1.5px solid ${hov ? T.t : T.bs}`, borderRadius:12, padding:'16px 10px', textAlign:'center', cursor:'pointer', transform: hov ? 'translateY(-2px)' : 'none', boxShadow: hov ? shadow.sm : 'none', transition:'.18s' }}>
      <div style={{ fontSize:26, marginBottom:7 }}>{item.icon}</div>
      <div style={{ fontSize:11, fontWeight:700, color:T.ink, marginBottom:2 }}>{item.name}</div>
      <div style={{ fontSize:10, color:T.mu }}>{item.count}</div>
    </div>
  );
}

export default function ShopByCategory() {
  return (
    <section style={{ background:T.c, padding:'80px 56px 48px' }}>
      <div style={{ ...W }}>
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:36 }}>
          <div>
            <div style={eyebrow}>Browse</div>
            <h2 style={sectionTitle}>Shop by Category</h2>
            <p style={{ fontSize:14, color:T.mu, marginTop:7 }}>24 categories · 5,000+ verified suppliers</p>
          </div>
          <div style={viewAll}>All categories →</div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:12 }}>
          {CAT_HERO.map(item => <CatHeroCard key={item.name} item={item} />)}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:10 }}>
          {CAT_SUB.map(item => <CatSubCard key={item.name} item={item} />)}
          <CatSubCard cta />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Commit**
```bash
git add src/pages/landing/ShopByCategory.jsx
git commit -m "feat(landing): add ShopByCategory section"
```

---

## Task 6: FeaturedSuppliers

**Files:**
- Create: `src/pages/landing/FeaturedSuppliers.jsx`

- [ ] **Create `src/pages/landing/FeaturedSuppliers.jsx`**

```jsx
import { useState } from 'react';
import { T, shadow, W, eyebrow, sectionTitle, viewAll, tag } from './tokens';
import { BRANDS } from './data';

export default function FeaturedSuppliers() {
  return (
    <section style={{ background:T.cm, padding:'80px 56px' }}>
      <div style={{ ...W }}>
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:36 }}>
          <div>
            <div style={eyebrow}>Curated for you</div>
            <h2 style={sectionTitle}>Featured Suppliers</h2>
            <p style={{ fontSize:14, color:T.mu, marginTop:7 }}>Verified, top-rated, ready to ship</p>
          </div>
          <div style={viewAll}>Browse all suppliers →</div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
          {BRANDS.map(b => <BrandCard key={b.name} b={b} />)}
        </div>
      </div>
    </section>
  );
}

function BrandCard({ b }) {
  const [hov, setHov] = useState(false);
  const [ctaHov, setCtaHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background:T.w, borderRadius:16,
        border:`1.5px solid ${hov ? 'transparent' : T.bs}`,
        overflow:'hidden', cursor:'pointer',
        transform: hov ? 'translateY(-5px)' : 'none',
        boxShadow: hov ? shadow.lg : 'none', transition:'.22s',
      }}
    >
      <div style={{ height:100, background:b.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:44, position:'relative' }}>
        {b.emoji}
        <span style={{ position:'absolute', top:10, right:10, fontSize:9, fontWeight:700, padding:'4px 9px', borderRadius:5, backdropFilter:'blur(6px)', ...b.badgeStyle }}>{b.badge}</span>
      </div>
      <div style={{ padding:'16px 18px 18px' }}>
        <div style={{ fontSize:15, fontWeight:700, color:T.ink, marginBottom:3 }}>{b.name}</div>
        <div style={{ fontSize:12, color:T.mu, marginBottom:12 }}>{b.loc}</div>
        <div style={{ display:'flex', gap:12, padding:'10px 0', borderTop:`1px solid ${T.bs}`, borderBottom:`1px solid ${T.bs}`, marginBottom:12 }}>
          {[['Products',b.products],['Rating',b.rating],['Min order',b.min]].map(([l,v]) => (
            <div key={l}><div style={{ fontSize:14, fontWeight:800, color:T.ink }}>{v}</div><div style={{ fontSize:9, color:T.mu, marginTop:1 }}>{l}</div></div>
          ))}
        </div>
        <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:14 }}>
          {b.tags.map(({v,l}) => <span key={l} style={tag(v)}>{l}</span>)}
        </div>
        <button
          onMouseEnter={() => setCtaHov(true)}
          onMouseLeave={() => setCtaHov(false)}
          style={{
            width:'100%', padding:'10px 0',
            background: ctaHov ? T.t : T.tl,
            color: ctaHov ? '#fff' : T.t,
            border:`1.5px solid ${ctaHov ? T.t : 'rgba(196,119,58,.3)'}`,
            borderRadius:8, fontSize:12, fontWeight:700,
            cursor:'pointer', fontFamily:'inherit', transition:'.18s',
            boxShadow: ctaHov ? '0 4px 14px rgba(196,119,58,.3)' : 'none',
          }}>View Catalog →</button>
      </div>
    </div>
  );
}
```

- [ ] **Commit**
```bash
git add src/pages/landing/FeaturedSuppliers.jsx
git commit -m "feat(landing): add FeaturedSuppliers section"
```

---

## Task 7: TrendingProducts

**Files:**
- Create: `src/pages/landing/TrendingProducts.jsx`

- [ ] **Create `src/pages/landing/TrendingProducts.jsx`**

```jsx
import { useState } from 'react';
import { T, shadow, W, eyebrow, sectionTitle, viewAll } from './tokens';
import { TRENDING_PRODUCTS } from './data';

function ProductCard({ item }) {
  const [hov, setHov] = useState(false);
  const [qHov, setQHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background:T.w, borderRadius:14, overflow:'hidden', border:`1.5px solid ${T.bs}`, transform: hov ? 'translateY(-4px)' : 'none', boxShadow: hov ? shadow.md : 'none', transition:'.22s', cursor:'pointer' }}>
      <div style={{ height:148, background:item.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:46, position:'relative' }}>
        {item.emoji}
        {item.badge && <span style={{ position:'absolute', top:9, left:9, background:item.badgeBg, color:'#fff', fontSize:8, fontWeight:800, padding:'3px 9px', borderRadius:5 }}>{item.badge}</span>}
        <span style={{ position:'absolute', top:9, right:9, background:'rgba(255,255,255,.92)', backdropFilter:'blur(4px)', borderRadius:'50%', width:28, height:28, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, boxShadow:shadow.sm }}>♡</span>
      </div>
      <div style={{ padding:'12px 14px 14px' }}>
        <div style={{ fontSize:9, fontWeight:700, color:T.t, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:4 }}>{item.brand}</div>
        <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6, lineHeight:1.3 }}>{item.name}</div>
        <div style={{ fontSize:10, color:T.mu, marginBottom:7 }}>{item.moq}</div>
        <div style={{ fontSize:16, fontWeight:800, color:T.ink, display:'flex', alignItems:'baseline', gap:3 }}>{item.price}<small style={{ fontSize:11, color:T.mu, fontWeight:400 }}>{item.unit}</small></div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:10, paddingTop:10, borderTop:`1px solid ${T.bs}` }}>
          <span style={{ fontSize:10, color:T.mu }}>⭐ {item.rating}</span>
          <button onMouseEnter={() => setQHov(true)} onMouseLeave={() => setQHov(false)}
            style={{ fontSize:10, fontWeight:700, color: qHov ? '#fff' : T.t, background: qHov ? T.t : T.tl, border:'none', borderRadius:5, padding:'5px 11px', cursor:'pointer', fontFamily:'inherit', transition:'.15s' }}>Quote</button>
        </div>
      </div>
    </div>
  );
}

function SpotlightBanner() {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ gridColumn:'span 2', background:'linear-gradient(145deg,#1E3A28 0%,#12281A 100%)', borderRadius:14, padding:'30px 26px', display:'flex', flexDirection:'column', justifyContent:'space-between', minHeight:320, cursor:'pointer', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle,rgba(61,122,52,.3),transparent)', top:-100, right:-100, pointerEvents:'none' }} />
      <div style={{ position:'absolute', width:200, height:200, borderRadius:'50%', background:'radial-gradient(circle,rgba(196,119,58,.2),transparent)', bottom:-60, left:-60, pointerEvents:'none' }} />
      <div style={{ position:'relative', zIndex:1 }}>
        <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', color:'rgba(255,255,255,.45)', marginBottom:10 }}>Spotlight Category</div>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:30, fontWeight:700, color:'#fff', lineHeight:1.12, marginBottom:10 }}>India's finest<br/>Agricultural<br/>produce</div>
        <div style={{ fontSize:13, color:'rgba(255,255,255,.58)', lineHeight:1.65 }}>856 verified suppliers. Organic certified. Export-ready from farm to freight.</div>
      </div>
      <button style={{ position:'relative', zIndex:1, display:'inline-flex', alignItems:'center', gap:7, background:'#fff', color:'#1E3A28', fontSize:12, fontWeight:800, padding:'10px 20px', borderRadius:8, fontFamily:'inherit', border:'none', cursor:'pointer', boxShadow:'0 4px 14px rgba(0,0,0,.2)', transform: hov ? 'translateY(-1px)' : 'none', transition:'.18s' }}>Explore Agriculture →</button>
    </div>
  );
}

export default function TrendingProducts() {
  return (
    <section style={{ background:T.c, padding:'80px 56px' }}>
      <div style={{ ...W }}>
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:36 }}>
          <div><div style={eyebrow}>Most ordered</div><h2 style={sectionTitle}>Trending Products</h2></div>
          <div style={viewAll}>Browse all →</div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:14 }}>
          <SpotlightBanner />
          {TRENDING_PRODUCTS.map((item, i) => <ProductCard key={i} item={item} />)}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Commit**
```bash
git add src/pages/landing/TrendingProducts.jsx
git commit -m "feat(landing): add TrendingProducts section"
```

---

## Task 8: NewThisWeek + TrendingByCategory

**Files:**
- Create: `src/pages/landing/NewThisWeek.jsx`
- Create: `src/pages/landing/TrendingByCategory.jsx`

- [ ] **Create `src/pages/landing/NewThisWeek.jsx`**

```jsx
import { useState } from 'react';
import { T, shadow, W, sectionTitle, viewAll } from './tokens';
import { NEW_THIS_WEEK } from './data';

function MiniCard({ item }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background:T.w, borderRadius:10, overflow:'hidden', border:`1.5px solid ${T.bs}`, cursor:'pointer', transform: hov ? 'translateY(-2px)' : 'none', boxShadow: hov ? shadow.sm : 'none', transition:'.2s' }}>
      <div style={{ height:110, background:item.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:36 }}>{item.emoji}</div>
      <div style={{ padding:'8px 10px 10px' }}>
        <div style={{ fontSize:9, color:T.t, fontWeight:700, textTransform:'uppercase', letterSpacing:'.05em', marginBottom:3 }}>{item.brand}</div>
        <div style={{ fontSize:11, fontWeight:600, color:T.ink, lineHeight:1.3, marginBottom:4 }}>{item.name}</div>
        <div style={{ fontSize:12, fontWeight:700, color:T.ink }}>{item.price}</div>
      </div>
    </div>
  );
}

export default function NewThisWeek() {
  return (
    <section style={{ background:T.cm, padding:'80px 56px' }}>
      <div style={{ ...W }}>
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:36 }}>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <span style={{ background:`linear-gradient(135deg,${T.t},${T.td})`, color:'#fff', fontSize:9, fontWeight:800, padding:'4px 12px', borderRadius:5, letterSpacing:'.08em', textTransform:'uppercase' }}>New This Week</span>
            <h2 style={sectionTitle}>Just listed</h2>
          </div>
          <div style={viewAll}>See all new arrivals →</div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:12 }}>
          {NEW_THIS_WEEK.map((item, i) => <MiniCard key={i} item={item} />)}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Create `src/pages/landing/TrendingByCategory.jsx`**

```jsx
import { useState } from 'react';
import { T, shadow, W, viewAll } from './tokens';
import { TRENDING_ROWS } from './data';

function MiniProdCard({ item }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background:T.w, borderRadius:10, overflow:'hidden', border:`1.5px solid ${T.bs}`, cursor:'pointer', transform: hov ? 'translateY(-2px)' : 'none', boxShadow: hov ? shadow.sm : 'none', transition:'.18s' }}>
      <div style={{ height:96, background:item.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:32 }}>{item.emoji}</div>
      <div style={{ padding:'8px 10px 10px' }}>
        <div style={{ fontSize:11, fontWeight:600, color:T.ink, lineHeight:1.3, marginBottom:3 }}>{item.name}</div>
        <div style={{ fontSize:11, fontWeight:700, color:T.t }}>{item.price}</div>
        <div style={{ fontSize:9, color:T.mu }}>{item.moq}</div>
      </div>
    </div>
  );
}

function CategoryRow({ row }) {
  return (
    <div style={{ padding:'60px 56px', borderBottom:`1px solid ${T.bs}` }}>
      <div style={{ ...W }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ width:44, height:44, borderRadius:11, background:row.iconBg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, border:`1.5px solid ${row.iconBorder}`, flexShrink:0 }}>{row.icon}</div>
            <div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, color:T.ink, letterSpacing:'-.5px' }}>{row.title}</div>
              <div style={{ fontSize:12, color:T.mu, marginTop:2 }}>{row.count}</div>
            </div>
          </div>
          <div style={viewAll}>{row.link}</div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:12 }}>
          {row.products.map((item, i) => <MiniProdCard key={i} item={item} />)}
        </div>
      </div>
    </div>
  );
}

export default function TrendingByCategory() {
  return (
    <div style={{ background:T.c, borderTop:`1px solid ${T.bs}` }}>
      {TRENDING_ROWS.map(row => <CategoryRow key={row.title} row={row} />)}
    </div>
  );
}
```

- [ ] **Commit**
```bash
git add src/pages/landing/NewThisWeek.jsx src/pages/landing/TrendingByCategory.jsx
git commit -m "feat(landing): add NewThisWeek and TrendingByCategory sections"
```

---

## Task 9: CuratedCollections + BrowseByRegion

**Files:**
- Create: `src/pages/landing/CuratedCollections.jsx`
- Create: `src/pages/landing/BrowseByRegion.jsx`

- [ ] **Create `src/pages/landing/CuratedCollections.jsx`**

```jsx
import { useState } from 'react';
import { T, shadow, W, eyebrow, sectionTitle, viewAll, tag } from './tokens';
import { COLLECTIONS } from './data';

function CollectionCard({ item }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius:16, overflow:'hidden', cursor:'pointer',
        transform: hov ? 'translateY(-4px)' : 'none',
        boxShadow: hov ? shadow.lg : 'none',
        transition:'.22s',
        gridColumn: item.wide ? 'span 2' : 'span 1',
      }}
    >
      <div style={{ height: item.wide ? 200 : 200, background:item.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize: item.wide ? 72 : 56, position:'relative' }}>
        <div style={{ position:'absolute', inset:0, background:`radial-gradient(circle at 65% 35%,${item.glow},transparent 60%)` }} />
        <span style={{ position:'relative', zIndex:1 }}>{item.emoji}</span>
      </div>
      <div style={{ background:T.w, padding:'20px 22px', border:`1.5px solid ${T.bs}`, borderTop:'none', borderRadius:'0 0 16px 16px' }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:19, fontWeight:700, color:T.ink, marginBottom:5 }}>{item.name}</div>
        <div style={{ fontSize:13, color:T.mu, lineHeight:1.65, marginBottom:14 }}>{item.desc}</div>
        <div style={{ fontSize:12, fontWeight:700, color:T.t }}>Explore collection →</div>
      </div>
    </div>
  );
}

export default function CuratedCollections() {
  return (
    <section style={{ background:T.cm, padding:'80px 56px' }}>
      <div style={{ ...W }}>
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:36 }}>
          <div><div style={eyebrow}>Editor's Picks</div><h2 style={sectionTitle}>Curated Collections</h2><p style={{ fontSize:14, color:T.mu, marginTop:7 }}>Handpicked by our sourcing experts</p></div>
          <div style={viewAll}>All collections →</div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap:16 }}>
          {COLLECTIONS.map(item => <CollectionCard key={item.name} item={item} />)}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Create `src/pages/landing/BrowseByRegion.jsx`**

```jsx
import { useState } from 'react';
import { T, shadow, W, eyebrow, sectionTitle, viewAll, tag } from './tokens';
import { REGIONS } from './data';

export default function BrowseByRegion() {
  return (
    <section style={{ background:T.c, padding:'80px 56px' }}>
      <div style={{ ...W }}>
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:36 }}>
          <div><div style={eyebrow}>Pan-India Network</div><h2 style={sectionTitle}>Browse by Region</h2><p style={{ fontSize:14, color:T.mu, marginTop:7 }}>Every MSME hub. Every manufacturing cluster.</p></div>
          <div style={viewAll}>View all cities →</div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
          {REGIONS.map(r => <RegionCard key={r.name} r={r} />)}
        </div>
      </div>
    </section>
  );
}

function RegionCard({ r }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background:r.bg, borderRadius:14, padding:'26px 22px', cursor:'pointer', border:`1.5px solid ${hov ? T.tm : r.border}`, transform: hov ? 'translateY(-3px)' : 'none', boxShadow: hov ? shadow.md : 'none', transition:'.2s' }}>
      <div style={{ fontSize:32, marginBottom:13 }}>{r.emoji}</div>
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700, color:T.ink, marginBottom:6 }}>{r.name}</div>
      <div style={{ fontSize:12, color:T.mu, lineHeight:1.7, marginBottom:12 }}>{r.cities}</div>
      <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
        {r.tags.map(([v,l]) => <span key={l} style={tag(v)}>{l}</span>)}
      </div>
    </div>
  );
}
```

- [ ] **Commit**
```bash
git add src/pages/landing/CuratedCollections.jsx src/pages/landing/BrowseByRegion.jsx
git commit -m "feat(landing): add CuratedCollections and BrowseByRegion sections"
```

---

## Task 10: HowItWorks + PlatformFeatures

**Files:**
- Create: `src/pages/landing/HowItWorks.jsx`
- Create: `src/pages/landing/PlatformFeatures.jsx`

- [ ] **Create `src/pages/landing/HowItWorks.jsx`**

```jsx
import { T, W, eyebrow } from './tokens';

const STEPS = [
  { n:'01', icon:'🔐', title:'Create your account',   desc:'Sign up as a buyer or supplier. GST-based verification completes in under 24 hours — no paperwork, no delays.' },
  { n:'02', icon:'🔍', title:'Browse or post an RFQ', desc:'Search 50,000+ products across 24 categories, or post requirements and receive quotes from verified suppliers instantly.' },
  { n:'03', icon:'🚀', title:'Order with confidence', desc:'Pay on net 30 terms, track shipments in real time, and manage contracts digitally — all under one trade-assured roof.' },
];

export default function HowItWorks() {
  return (
    <section style={{ background:T.cd, padding:'80px 56px' }}>
      <div style={{ ...W }}>
        <div style={{ textAlign:'center', marginBottom:56 }}>
          <div style={{ ...eyebrow, display:'inline-block', marginBottom:10 }}>Simple Process</div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(26px,3vw,40px)', fontWeight:700, color:T.ink, letterSpacing:-1, lineHeight:1.1, textAlign:'center' }}>Up and running in minutes</h2>
          <p style={{ fontSize:15, color:T.mu, marginTop:10, maxWidth:460, marginLeft:'auto', marginRight:'auto', lineHeight:1.7 }}>No lengthy onboarding. Discover, connect, and transact — all in one place.</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:2 }}>
          {STEPS.map((s, i) => (
            <div key={s.n} style={{ background:T.w, padding:'44px 38px', borderRadius: i === 0 ? '16px 0 0 16px' : i === 2 ? '0 16px 16px 0' : 0, borderLeft: i > 0 ? `1px solid ${T.bs}` : 'none' }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:52, fontWeight:900, WebkitTextStroke:`2px ${T.t}`, color:'transparent', lineHeight:1, marginBottom:20 }}>{s.n}</div>
              <div style={{ fontSize:28, marginBottom:16 }}>{s.icon}</div>
              <div style={{ fontSize:18, fontWeight:700, color:T.ink, marginBottom:10 }}>{s.title}</div>
              <p style={{ fontSize:14, color:T.mu, lineHeight:1.78 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Create `src/pages/landing/PlatformFeatures.jsx`**

```jsx
import { useState } from 'react';
import { T, W, eyebrow, sectionTitle } from './tokens';
import { FEATURES } from './data';

export default function PlatformFeatures() {
  return (
    <section style={{ background:T.c, padding:'80px 56px' }}>
      <div style={{ ...W }}>
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:36 }}>
          <div><div style={eyebrow}>Why Globrixa</div><h2 style={sectionTitle}>Built for B2B, built for India</h2></div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:2 }}>
          {FEATURES.map((f, i) => <FeatureBlock key={f.title} f={f} i={i} />)}
        </div>
      </div>
    </section>
  );
}

function FeatureBlock({ f, i }) {
  const [hov, setHov] = useState(false);
  const col = i % 3;
  const row = Math.floor(i / 3);
  const radius = i === 0 ? '16px 0 0 0' : i === 2 ? '0 16px 0 0' : i === 3 ? '0 0 0 16px' : i === 5 ? '0 0 16px 0' : 0;
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background:T.w, padding:'36px 32px', borderRadius:radius, borderTop: `3px solid ${hov ? T.t : T.t}`, borderLeft: col > 0 ? `1px solid ${T.bs}` : 'none', borderTopWidth: row > 0 ? 1 : 3, borderTopStyle:'solid', borderTopColor: row > 0 ? T.bs : T.t }}>
      <div style={{ width:52, height:52, borderRadius:12, background:f.iconBg, border:`1.5px solid ${f.iconBorder}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, marginBottom:18 }}>{f.icon}</div>
      <div style={{ fontSize:17, fontWeight:700, color:T.ink, marginBottom:8 }}>{f.title}</div>
      <p style={{ fontSize:14, color:T.mu, lineHeight:1.78 }}>{f.desc}</p>
    </div>
  );
}
```

- [ ] **Commit**
```bash
git add src/pages/landing/HowItWorks.jsx src/pages/landing/PlatformFeatures.jsx
git commit -m "feat(landing): add HowItWorks and PlatformFeatures sections"
```

---

## Task 11: StatsSection + Testimonials

**Files:**
- Create: `src/pages/landing/StatsSection.jsx`
- Create: `src/pages/landing/Testimonials.jsx`

- [ ] **Create `src/pages/landing/StatsSection.jsx`**

```jsx
import { T, W } from './tokens';
import { STATS } from './data';

export default function StatsSection() {
  return (
    <div style={{ background:'linear-gradient(145deg,#1C1915 0%,#2A2320 100%)', padding:'72px 56px', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:-200, right:-200, width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(196,119,58,.12),transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:-150, left:-150, width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle,rgba(61,122,52,.10),transparent 70%)', pointerEvents:'none' }} />
      <div style={{ ...W, position:'relative', zIndex:1 }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:1, background:'rgba(255,255,255,.06)', borderRadius:16, overflow:'hidden' }}>
          {STATS.map(s => (
            <div key={s.label} style={{ padding:'48px 36px', background:'rgba(255,255,255,.03)', textAlign:'center' }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:56, fontWeight:900, color:'#fff', letterSpacing:-2, lineHeight:1, marginBottom:8 }}>
                {s.num}<span style={{ color:T.t }}>{s.suf}</span>
              </div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,.4)', fontWeight:500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Create `src/pages/landing/Testimonials.jsx`**

```jsx
import { useState } from 'react';
import { T, shadow, W, eyebrow, sectionTitle } from './tokens';
import { TESTIMONIALS } from './data';

export default function Testimonials() {
  return (
    <section style={{ background:T.c, padding:'80px 56px' }}>
      <div style={{ ...W }}>
        <div style={{ marginBottom:36 }}>
          <div style={eyebrow}>Customer Stories</div>
          <h2 style={sectionTitle}>Trusted by Indian businesses</h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:18 }}>
          {TESTIMONIALS.map(t => <TestiCard key={t.name} t={t} />)}
        </div>
      </div>
    </section>
  );
}

function TestiCard({ t }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background:T.w, borderRadius:16, padding:30, border:`1.5px solid ${hov ? 'rgba(196,119,58,.4)' : T.bs}`, boxShadow: hov ? shadow.md : 'none', transition:'.2s', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:-20, right:-10, fontFamily:"'Playfair Display',serif", fontSize:120, fontWeight:900, color:'rgba(196,119,58,.06)', lineHeight:1, pointerEvents:'none' }}>"</div>
      <div style={{ color:T.t, fontSize:14, letterSpacing:3, marginBottom:16 }}>{t.rating}</div>
      <p style={{ fontSize:15, color:T.is, lineHeight:1.82, fontStyle:'italic', marginBottom:26, fontFamily:"'Playfair Display',serif", fontWeight:600 }}>{t.quote}</p>
      <div style={{ height:1, background:T.bs, marginBottom:18 }} />
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <div style={{ width:44, height:44, borderRadius:10, background:t.bg, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700, flexShrink:0 }}>{t.initial}</div>
        <div>
          <div style={{ fontSize:14, fontWeight:700, color:T.ink }}>{t.name}</div>
          <div style={{ fontSize:12, color:T.mu }}>{t.role}</div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Commit**
```bash
git add src/pages/landing/StatsSection.jsx src/pages/landing/Testimonials.jsx
git commit -m "feat(landing): add StatsSection and Testimonials"
```

---

## Task 12: ForBrandsSplit + FaqSection + NewsletterSection

**Files:**
- Create: `src/pages/landing/ForBrandsSplit.jsx`
- Create: `src/pages/landing/FaqSection.jsx`
- Create: `src/pages/landing/NewsletterSection.jsx`

- [ ] **Create `src/pages/landing/ForBrandsSplit.jsx`**

```jsx
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleLogin } from '../../features/auth/authSlice';
import { T, eyebrow, btnPrimary, btnGhost } from './tokens';
import { BRAND_PERKS, BRAND_METRICS } from './data';

export default function ForBrandsSplit() {
  const dispatch = useDispatch();
  const [hovApply, setHovApply] = useState(false);
  const [hovLearn, setHovLearn] = useState(false);

  return (
    <div style={{ background:T.cd, padding:'0 56px', overflow:'hidden' }}>
      <div style={{ maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', minHeight:580 }}>

        {/* Left */}
        <div style={{ padding:'80px 64px 80px 0', display:'flex', flexDirection:'column', justifyContent:'center' }}>
          <div style={{ ...eyebrow, marginBottom:14 }}>For Suppliers</div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(30px,3vw,46px)', fontWeight:700, color:T.ink, letterSpacing:-1.5, lineHeight:1.1, marginBottom:16 }}>Grow your brand.<br/>Reach new buyers.</h2>
          <p style={{ fontSize:15, color:T.mu, lineHeight:1.82, marginBottom:36, maxWidth:400 }}>List your products, manage RFQs, and transact with thousands of buyers across India and beyond — all in one platform.</p>
          <div style={{ display:'flex', flexDirection:'column', gap:18, marginBottom:36 }}>
            {BRAND_PERKS.map(p => (
              <div key={p.title} style={{ display:'flex', alignItems:'flex-start', gap:14 }}>
                <div style={{ width:40, height:40, borderRadius:10, background:T.tl, border:`1.5px solid rgba(196,119,58,.3)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>{p.icon}</div>
                <div>
                  <div style={{ fontSize:14, fontWeight:700, color:T.ink, marginBottom:2 }}>{p.title}</div>
                  <div style={{ fontSize:13, color:T.mu, lineHeight:1.55 }}>{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:12 }}>
            <button onClick={() => dispatch(toggleLogin(true))} onMouseEnter={() => setHovApply(true)} onMouseLeave={() => setHovApply(false)}
              style={{ ...btnPrimary, ...(hovApply ? { background:`linear-gradient(135deg,${T.td},#8A5226)`, transform:'translateY(-1px)' } : {}) }}>Apply as a brand</button>
            <button onMouseEnter={() => setHovLearn(true)} onMouseLeave={() => setHovLearn(false)}
              style={{ ...btnGhost, ...(hovLearn ? { borderColor:T.t, background:T.tl, color:T.t } : {}) }}>Learn more</button>
          </div>
        </div>

        {/* Right dark */}
        <div style={{ background:'linear-gradient(145deg,#1C1915,#2A2320)', margin:'0 -56px 0 0', padding:'80px 80px 80px 56px', display:'flex', flexDirection:'column', justifyContent:'center', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:-150, right:-150, width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle,rgba(196,119,58,.14),transparent 70%)', pointerEvents:'none' }} />
          <div style={{ display:'flex', flexDirection:'column', gap:14, position:'relative', zIndex:1 }}>
            {BRAND_METRICS.map(m => (
              <div key={m.num} style={{ background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.09)', borderRadius:14, padding:'22px 24px', display:'flex', alignItems:'center', gap:16 }}>
                <div style={{ width:50, height:50, background:'rgba(196,119,58,.14)', borderRadius:11, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0 }}>{m.icon}</div>
                <div>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:700, color:'#fff', lineHeight:1, marginBottom:4 }}>{m.num}</div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,.42)' }}>{m.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
```

- [ ] **Create `src/pages/landing/FaqSection.jsx`**

```jsx
import { useState } from 'react';
import { T, shadow, W, eyebrow, sectionTitle } from './tokens';
import { FAQS } from './data';

export default function FaqSection() {
  return (
    <section style={{ background:T.cm, padding:'80px 56px' }}>
      <div style={{ ...W }}>
        <div style={{ marginBottom:40 }}>
          <div style={eyebrow}>Got questions?</div>
          <h2 style={sectionTitle}>Frequently asked</h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          {FAQS.map(faq => <FaqCard key={faq.q} faq={faq} />)}
        </div>
      </div>
    </section>
  );
}

function FaqCard({ faq }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background:T.w, borderRadius:14, padding:'26px 28px', border:`1.5px solid ${hov ? 'rgba(196,119,58,.35)' : T.bs}`, transition:'.18s' }}>
      <div style={{ fontSize:15, fontWeight:700, color:T.ink, marginBottom:10, display:'flex', alignItems:'flex-start', gap:10 }}>
        <span style={{ width:24, height:24, background:T.tl, color:T.t, borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:800, flexShrink:0, marginTop:1 }}>Q</span>
        {faq.q}
      </div>
      <p style={{ fontSize:14, color:T.mu, lineHeight:1.78, paddingLeft:34 }}>{faq.a}</p>
    </div>
  );
}
```

- [ ] **Create `src/pages/landing/NewsletterSection.jsx`**

```jsx
import { T, eyebrow, btnPrimary } from './tokens';

export default function NewsletterSection() {
  return (
    <div style={{ background:T.c, padding:'72px 56px', textAlign:'center', borderTop:`1px solid ${T.bs}` }}>
      <div style={{ maxWidth:560, margin:'0 auto' }}>
        <div style={{ ...eyebrow, marginBottom:12 }}>Stay informed</div>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:32, fontWeight:700, color:T.ink, letterSpacing:-1, marginBottom:10 }}>Stay ahead of the market</h2>
        <p style={{ fontSize:15, color:T.mu, lineHeight:1.75, marginBottom:28 }}>Weekly sourcing insights, new supplier alerts, and category trend reports — delivered to your inbox.</p>
        <div style={{ display:'flex', gap:10 }}>
          <input type="email" placeholder="Enter your business email" style={{ flex:1, border:`1.5px solid ${T.b}`, borderRadius:8, padding:'13px 16px', fontSize:14, fontFamily:'inherit', background:T.w, color:T.ink, outline:'none' }} />
          <button style={{ ...btnPrimary, whiteSpace:'nowrap', padding:'13px 24px' }}>Subscribe free</button>
        </div>
        <p style={{ fontSize:11, color:T.mu, marginTop:12 }}>No spam. Unsubscribe anytime. Join 12,000+ procurement professionals.</p>
      </div>
    </div>
  );
}
```

- [ ] **Commit**
```bash
git add src/pages/landing/ForBrandsSplit.jsx src/pages/landing/FaqSection.jsx src/pages/landing/NewsletterSection.jsx
git commit -m "feat(landing): add ForBrandsSplit, FaqSection, NewsletterSection"
```

---

## Task 13: CtaBanner + LandingFooter

**Files:**
- Create: `src/pages/landing/CtaBanner.jsx`
- Create: `src/pages/landing/LandingFooter.jsx`

- [ ] **Create `src/pages/landing/CtaBanner.jsx`**

```jsx
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleLogin } from '../../features/auth/authSlice';
import { T } from './tokens';

export default function CtaBanner() {
  const dispatch = useDispatch();
  const [hovW, setHovW] = useState(false);
  const [hovO, setHovO] = useState(false);

  return (
    <div style={{ background:`linear-gradient(145deg,${T.t} 0%,${T.td} 100%)`, padding:'104px 56px', textAlign:'center', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', inset:0, backgroundImage:"url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle stroke='rgba(255,255,255,0.06)' stroke-width='1' cx='30' cy='30' r='28' fill='none'/%3E%3Ccircle stroke='rgba(255,255,255,0.04)' stroke-width='1' cx='30' cy='30' r='16' fill='none'/%3E%3C/svg%3E\")", backgroundSize:'60px', pointerEvents:'none' }} />
      <div style={{ position:'relative', zIndex:1 }}>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(38px,5vw,66px)', fontWeight:900, color:'#fff', letterSpacing:-2.5, lineHeight:1.01, marginBottom:16 }}>Ready to grow<br/>your business?</h2>
        <p style={{ fontSize:17, color:'rgba(255,255,255,.76)', lineHeight:1.78, marginBottom:46, maxWidth:500, marginLeft:'auto', marginRight:'auto' }}>Join thousands of Indian businesses already sourcing and selling smarter on Globrixa.</p>
        <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
          <button
            onClick={() => dispatch(toggleLogin(true))}
            onMouseEnter={() => setHovW(true)} onMouseLeave={() => setHovW(false)}
            style={{ padding:'15px 40px', borderRadius:9, background:'#fff', color:T.t, fontSize:15, fontWeight:800, border:'none', cursor:'pointer', fontFamily:'inherit', boxShadow:`0 6px 24px rgba(0,0,0,.2)`, transform: hovW ? 'translateY(-2px)' : 'none', transition:'.18s' }}>
            Start sourcing — it's free
          </button>
          <button
            onClick={() => dispatch(toggleLogin(true))}
            onMouseEnter={() => setHovO(true)} onMouseLeave={() => setHovO(false)}
            style={{ padding:'14px 38px', borderRadius:9, background: hovO ? 'rgba(255,255,255,.1)' : 'transparent', color:'rgba(255,255,255,.88)', border:'1.5px solid rgba(255,255,255,.35)', fontSize:15, cursor:'pointer', fontFamily:'inherit', transition:'.18s' }}>
            List your brand →
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Create `src/pages/landing/LandingFooter.jsx`**

```jsx
import { useNavigate } from 'react-router-dom';
import { T } from './tokens';
import { FOOTER_COLS } from './data';

export default function LandingFooter() {
  const navigate = useNavigate();

  const NAV_MAP = {
    'About': '/about', 'Blog': '/blog', 'Careers': '/careers',
    'Press': '/about', 'Help Center': '/help', 'Contact': '/contact',
    'Privacy': '/privacy', 'Terms': '/terms', 'Refund Policy': '/terms',
  };

  return (
    <footer style={{ background:'#0F0E0D', padding:'64px 56px 36px' }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr', gap:48, paddingBottom:56, borderBottom:'1px solid #1A1816' }}>
          <div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:900, color:'#fff', marginBottom:12, letterSpacing:'-.5px' }}>Globrixa</div>
            <p style={{ fontSize:13, color:'#555', lineHeight:1.78, maxWidth:220, marginBottom:20 }}>India's premier B2B wholesale marketplace — connecting verified suppliers with global buyers across 120+ countries.</p>
            <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(255,255,255,.04)', border:'1px solid #222', borderRadius:7, padding:'7px 13px', fontSize:11, color:'#555' }}>🇮🇳 Proudly Made in India</div>
          </div>
          {FOOTER_COLS.map(col => (
            <div key={col.heading}>
              <h5 style={{ fontSize:10, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'#555', marginBottom:18 }}>{col.heading}</h5>
              {col.links.map(link => (
                <div key={link} onClick={() => NAV_MAP[link] && navigate(NAV_MAP[link])}
                  style={{ display:'block', fontSize:13, color:'#444', textDecoration:'none', marginBottom:10, cursor: NAV_MAP[link] ? 'pointer' : 'default', transition:'.15s' }}
                  onMouseEnter={e => { if (NAV_MAP[link]) e.currentTarget.style.color = T.t; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#444'; }}>
                  {link}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ paddingTop:28, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
          <span style={{ fontSize:12, color:'#2A2724' }}>© 2025 Globrixa Technologies Pvt. Ltd.</span>
          <div style={{ display:'flex', gap:20 }}>
            {['Privacy','Terms','Refund Policy'].map(l => (
              <span key={l} onClick={() => navigate('/terms')} style={{ fontSize:12, color:'#2A2724', cursor:'pointer' }}>{l}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Commit**
```bash
git add src/pages/landing/CtaBanner.jsx src/pages/landing/LandingFooter.jsx
git commit -m "feat(landing): add CtaBanner and LandingFooter"
```

---

## Task 14: Assemble LandingPage.jsx

**Files:**
- Replace: `src/pages/LandingPage.jsx`

- [ ] **Replace `src/pages/LandingPage.jsx` with the assembled page**

```jsx
import AnnouncementBar     from './landing/AnnouncementBar';
import LandingNavbar       from './landing/LandingNavbar';
import HeroSection         from './landing/HeroSection';
import SocialProofTicker   from './landing/SocialProofTicker';
import CategoryNavBar      from './landing/CategoryNavBar';
import PressStrip          from './landing/PressStrip';
import ShopByCategory      from './landing/ShopByCategory';
import FeaturedSuppliers   from './landing/FeaturedSuppliers';
import TrendingProducts    from './landing/TrendingProducts';
import NewThisWeek         from './landing/NewThisWeek';
import TrendingByCategory  from './landing/TrendingByCategory';
import CuratedCollections  from './landing/CuratedCollections';
import BrowseByRegion      from './landing/BrowseByRegion';
import HowItWorks          from './landing/HowItWorks';
import PlatformFeatures    from './landing/PlatformFeatures';
import StatsSection        from './landing/StatsSection';
import Testimonials        from './landing/Testimonials';
import ForBrandsSplit      from './landing/ForBrandsSplit';
import FaqSection          from './landing/FaqSection';
import NewsletterSection   from './landing/NewsletterSection';
import CtaBanner           from './landing/CtaBanner';
import LandingFooter       from './landing/LandingFooter';

export default function LandingPage() {
  return (
    <div style={{ fontFamily: "'Inter', 'DM Sans', system-ui, sans-serif", background: '#F7F1E8', minHeight: '100vh', overflowX: 'hidden' }}>
      <AnnouncementBar />
      <LandingNavbar />
      <HeroSection />
      <SocialProofTicker />
      <CategoryNavBar />
      <PressStrip />
      <ShopByCategory />
      <FeaturedSuppliers />
      <TrendingProducts />
      <NewThisWeek />
      <TrendingByCategory />
      <CuratedCollections />
      <BrowseByRegion />
      <HowItWorks />
      <PlatformFeatures />
      <StatsSection />
      <Testimonials />
      <ForBrandsSplit />
      <FaqSection />
      <NewsletterSection />
      <CtaBanner />
      <LandingFooter />
    </div>
  );
}
```

- [ ] **Start dev server and verify the full page renders**
```bash
npm run dev
```
Open http://localhost:5173 — scroll through the entire landing page and verify all 22 sections render without errors.

Check browser console for React errors. Common issues to fix:
- Missing key props on list items → add `key` to any mapped elements missing it
- `SocialProofTicker` uses JSX fragments inside a map — if React warns, wrap each group in a `<React.Fragment key={i}>` pair

- [ ] **Fix any console errors, then final commit**
```bash
git add src/pages/LandingPage.jsx
git commit -m "feat(landing): assemble full Faire-inspired landing page"
```

---

## Self-Review Checklist

| Requirement | Task |
|---|---|
| Announcement bar | Task 2 |
| Sticky navbar with search + auth dispatch | Task 2, Task 14 |
| Hero split layout + product grid | Task 3 |
| Gradient text on "buyers" | Task 3 |
| Social proof ticker | Task 4 |
| Category sticky nav bar | Task 4 |
| Press strip | Task 4 |
| Shop by category (4 hero + 6 sub) | Task 5 |
| Featured suppliers (4 brand cards) | Task 6 |
| Trending products + spotlight banner | Task 7 |
| New this week (6 compact) | Task 8 |
| Trending by category (3 rows of 6) | Task 8 |
| Curated collections | Task 9 |
| Browse by region (4 cards) | Task 9 |
| How it works (outlined numbers) | Task 10 |
| Platform features (3×2 grid) | Task 10 |
| Dark stats section with glows | Task 11 |
| Testimonials with ghost quote marks | Task 11 |
| For brands dark split | Task 12 |
| FAQ (2-col cards) | Task 12 |
| Newsletter capture | Task 12 |
| CTA banner (terracotta + pattern) | Task 13 |
| Footer (5-col) | Task 13 |
| English only — no Hindi | All tasks |
| toggleLogin wired to all CTAs | Tasks 2,3,12,13 |
| Static data, no API calls | Task 1 |
