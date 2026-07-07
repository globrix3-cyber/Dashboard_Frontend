// ── Ticker ─────────────────────────────────────────────────────────────────
export const TICKER_ITEMS = [
  { bold:'Global Sourcing Co.',   suffix:' placed a $2,800 order · 3 min ago' },
  { bold:'142 buyers',            suffix:' joined today from 28 countries' },
  { bold:'Heritage Décor Studio', suffix:' listed 24 new products' },
  { bold:'$48,000',               suffix:' in trades settled this week' },
  { bold:'New: Home Décor',       suffix:' category now open for sourcing' },
];

// ── Category nav ────────────────────────────────────────────────────────────
export const CATEGORY_NAV = [
  { icon: '✦',  label: 'All',                       active: true },
  { icon: '🖼️', label: 'Wall Décor'                              },
  { icon: '🛋️', label: 'Soft Furnishings'                        },
  { icon: '🎨', label: 'Decorative Accessories'                  },
  { icon: '🪑', label: 'Furniture Décor'                         },
  { icon: '🍽️', label: 'Kitchen & Dining'                        },
  { icon: '🌿', label: 'Garden & Outdoor'                        },
  { icon: '🏺', label: 'Handicrafts & Artisan'                   },
  { icon: '♻️', label: 'Sustainable Décor'                       },
  { icon: '🧵', label: 'Textiles'                                },
  { icon: '💎', label: 'Jewelry'                                 },
];

export const PRESS_LOGOS = ['Economic Times', 'YourStory', 'Inc42', 'The Hindu Business', 'Mint', 'Business Standard'];

// ── Category hero cards ─────────────────────────────────────────────────────
export const CAT_HERO = [
  { name: 'Wall Décor',              count: '820 brands · 12,000+ products',  chip: 'Pottery · Prints · Mirrors'        },
  { name: 'Soft Furnishings',        count: '640 brands · 9,500+ products',   chip: 'Cushions · Throws · Curtains'      },
  { name: 'Handicrafts & Artisan',   count: '982 brands · 15,000+ products',  chip: 'Pottery · Baskets · Wood Art'      },
  { name: 'Kitchen & Dining',        count: '510 brands · 7,800+ products',   chip: 'Ceramics · Serveware · Brass'      },
];

// ── Category sub-cards ──────────────────────────────────────────────────────
export const CAT_SUB = [
  { icon: '🪑', name: 'Furniture Décor',         count: '380 brands' },
  { icon: '🌿', name: 'Garden & Outdoor',         count: '290 brands' },
  { icon: '🎨', name: 'Decorative Accessories',   count: '460 brands' },
  { icon: '♻️', name: 'Sustainable Décor',        count: '215 brands' },
  { icon: '💡', name: 'Lighting & Lamps',         count: '340 brands' },
];

// ── Featured / Trusted suppliers ────────────────────────────────────────────
export const BRANDS = [
  {
    category: 'Wall Décor',
    emoji: '🏺', bg: 'linear-gradient(145deg,#FDEBD0,#F0B870)',
    badge: '✓ Verified', badgeStyle: { background: 'rgba(61,122,82,.9)', color: '#fff' },
    name: 'Heritage Décor Studio', loc: '📍 Jaipur, Rajasthan · Est. 2001',
    products: '680+', rating: '4.9★', min: '$45',
    tags: [{ v: 'g', l: 'Top Rated' }, { v: 't', l: 'Pottery' }, { v: 'n', l: 'Export' }],
  },
  {
    category: 'Lighting & Lamps',
    emoji: '🔆', bg: 'linear-gradient(145deg,#D5DCE8,#A8B4C8)',
    badge: '✓ Verified', badgeStyle: { background: 'rgba(61,122,82,.9)', color: '#fff' },
    name: 'Moradabad Brass Works', loc: '📍 Moradabad, UP · Est. 2005',
    products: '1,200+', rating: '4.8★', min: '$80',
    tags: [{ v: 'g', l: 'Verified' }, { v: 't', l: 'Brassware' }, { v: 'n', l: 'Export' }],
  },
  {
    category: 'Soft Furnishings',
    emoji: '🛋️', bg: 'linear-gradient(145deg,#FDEBD0,#E8C8A0)',
    badge: '🌿 Organic', badgeStyle: { background: 'rgba(61,122,52,.9)', color: '#fff' },
    name: 'Delhi Textile House', loc: '📍 New Delhi, Delhi · Est. 2010',
    products: '900+', rating: '4.8★', min: '$30',
    tags: [{ v: 'g', l: 'Verified' }, { v: 't', l: 'Handwoven' }, { v: 'g', l: 'OEKO-TEX' }],
  },
  {
    category: 'Furniture Décor',
    emoji: '🪑', bg: 'linear-gradient(145deg,#E8D5C8,#C8A890)',
    badge: '✓ Verified', badgeStyle: { background: 'rgba(61,122,82,.9)', color: '#fff' },
    name: 'Jodhpur Craft Studio', loc: '📍 Jodhpur, Rajasthan · Est. 1998',
    products: '540+', rating: '4.9★', min: '$120',
    tags: [{ v: 'g', l: 'Top Rated' }, { v: 't', l: 'Teakwood' }, { v: 'n', l: 'Export' }],
  },
];

// ── Trending products ───────────────────────────────────────────────────────
export const TRENDING_PRODUCTS = [
  { emoji: '🪴', bg: 'linear-gradient(145deg,#FDEBD0,#F5C898)', badge: 'New',    badgeBg: 'linear-gradient(135deg,#C4773A,#A8622E)', brand: 'Heritage Décor',   name: 'Hand-painted Ceramic Pot',    moq: 'MOQ: 24 pcs',    price: '$8',   unit: '/pc',   rating: '4.9 (128)' },
  { emoji: '🔆', bg: 'linear-gradient(145deg,#D5DCE8,#A8B4C8)', badge: null,                                                          brand: 'Moradabad Brass',  name: 'Antique Brass Table Lamp',    moq: 'MOQ: 12 pcs',    price: '$22',  unit: '/pc',   rating: '4.8 (94)'  },
  { emoji: '🪞', bg: 'linear-gradient(145deg,#EAD5D5,#C8A0A0)', badge: null,                                                          brand: 'Jodhpur Crafts',   name: 'Rajasthani Mirror Frame',     moq: 'MOQ: 6 pcs',     price: '$34',  unit: '/pc',   rating: '5.0 (210)' },
  { emoji: '🛋️', bg: 'linear-gradient(145deg,#FDEBD0,#E8C8A0)', badge: 'Export', badgeBg: 'linear-gradient(135deg,#1B3175,#122460)', brand: 'Delhi Textiles',   name: 'Block-print Cushion Cover',   moq: 'MOQ: 50 pcs',    price: '$4',   unit: '/pc',   rating: '4.9 (67)'  },
  { emoji: '🏺', bg: 'linear-gradient(145deg,#EAD5D5,#CAA8A8)', badge: 'Luxury', badgeBg: 'linear-gradient(135deg,#7A5C38,#5A4028)', brand: 'Heritage Décor',   name: 'Blue Pottery Dinner Set',     moq: 'MOQ: 12 sets',   price: '$28',  unit: '/set',  rating: '5.0 (183)' },
];

// ── New this week ───────────────────────────────────────────────────────────
export const NEW_THIS_WEEK = [
  { emoji: '🧵', bg: 'linear-gradient(145deg,#FDEBD0,#F0C898)', brand: 'Delhi Textiles',   name: 'Ikat Print Throw Blanket',   price: '$8.50/pc'  },
  { emoji: '🏺', bg: 'linear-gradient(145deg,#EAD5D5,#C8A0A0)', brand: 'Heritage Décor',   name: 'Hand-painted Ceramic Bowl',  price: '$6.00/pc'  },
  { emoji: '🧺', bg: 'linear-gradient(145deg,#D5E8D5,#A8CC90)', brand: 'Jodhpur Crafts',   name: 'Rattan Storage Basket',      price: '$5.50/pc'  },
  { emoji: '🌿', bg: 'linear-gradient(145deg,#EAD5D5,#C8A0A0)', brand: 'Heritage Décor',   name: 'Block Print Tablecloth',     price: '$7.00/pc'  },
  { emoji: '🪢', bg: 'linear-gradient(145deg,#EAE0D8,#C8B8A0)', brand: 'Delhi Textiles',   name: 'Macramé Wall Hanging',       price: '$12.00/pc' },
  { emoji: '🔆', bg: 'linear-gradient(145deg,#D5DCE8,#A0ACC0)', brand: 'Moradabad Brass',  name: 'Brass Incense Holder Set',   price: '$9.00/set' },
];

// ── Trending rows (kept for TrendingByCategory if needed) ───────────────────
export const TRENDING_ROWS = [
  {
    icon: '🖼️', iconBg: 'linear-gradient(135deg,#FDEBD0,#F0B870)', iconBorder: 'rgba(196,119,58,.2)',
    title: 'Trending in Wall Décor', count: '820 brands · 12,000+ products', link: 'All Wall Décor →',
    products: [
      { emoji: '🏺', bg: 'linear-gradient(145deg,#EAD5D5,#C8A0A0)', name: 'Blue Pottery Vase',        price: '$8.50/pc',  moq: 'MOQ 6 pcs'  },
      { emoji: '🪞', bg: 'linear-gradient(145deg,#EAE0D5,#C8B8A0)', name: 'Rajasthani Mirror Frame',  price: '$34.00/pc', moq: 'MOQ 4 pcs'  },
      { emoji: '🎨', bg: 'linear-gradient(145deg,#D5D5EA,#A8A8C8)', name: 'Madhubani Art Print',      price: '$5.50/pc',  moq: 'MOQ 10 pcs' },
      { emoji: '🖼️', bg: 'linear-gradient(145deg,#F0D8D8,#D8A8A8)', name: 'Hand-carved Wooden Frame', price: '$18.00/pc', moq: 'MOQ 8 pcs'  },
      { emoji: '🌿', bg: 'linear-gradient(145deg,#D8EAD8,#A8C8A8)', name: 'Macramé Wall Hanging',     price: '$12.00/pc', moq: 'MOQ 12 pcs' },
      { emoji: '💡', bg: 'linear-gradient(145deg,#D8D8EA,#A8A8C8)', name: 'Mosaic Glass Sconce',      price: '$24.00/pc', moq: 'MOQ 6 pcs'  },
    ],
  },
  {
    icon: '🛋️', iconBg: 'linear-gradient(135deg,#FDEBD0,#E8C8A0)', iconBorder: 'rgba(196,119,58,.2)',
    title: 'Trending in Soft Furnishings', count: '640 brands · 9,500+ products', link: 'All Soft Furnishings →',
    products: [
      { emoji: '🛋️', bg: 'linear-gradient(145deg,#FDEBD0,#F0C898)', name: 'Block Print Cushion Cover', price: '$4.00/pc',  moq: 'MOQ 50 pcs' },
      { emoji: '🧵', bg: 'linear-gradient(145deg,#F5E8D8,#E0C8A0)', name: 'Ikat Throw Blanket',         price: '$8.50/pc',  moq: 'MOQ 20 pcs' },
      { emoji: '🪢', bg: 'linear-gradient(145deg,#EAE0F0,#C8B0D8)', name: 'Handwoven Table Runner',     price: '$6.00/pc',  moq: 'MOQ 24 pcs' },
      { emoji: '🌸', bg: 'linear-gradient(145deg,#F0D8D8,#D8A8A8)', name: 'Embroidered Curtain Panel',  price: '$22.00/pc', moq: 'MOQ 10 pcs' },
      { emoji: '🎽', bg: 'linear-gradient(145deg,#D8EAD8,#A8C8A8)', name: 'Cotton Dhurrie Rug 4×6',     price: '$48.00/pc', moq: 'MOQ 5 pcs'  },
      { emoji: '🧶', bg: 'linear-gradient(145deg,#D8D8EA,#A8A8C8)', name: 'Linen Bedsheet Set',         price: '$32.00/set',moq: 'MOQ 10 sets' },
    ],
  },
  {
    icon: '🏺', iconBg: 'linear-gradient(135deg,#DEB8C8,#B07890)', iconBorder: 'rgba(176,120,144,.2)',
    title: 'Trending in Handicrafts & Artisan', count: '982 brands · 15,000+ products', link: 'All Handicrafts →',
    products: [
      { emoji: '🏺', bg: 'linear-gradient(145deg,#EAD5D5,#C8A0A0)', name: 'Blue Pottery Dinner Set',   price: '$28.00/set', moq: 'MOQ 6 sets'  },
      { emoji: '🧺', bg: 'linear-gradient(145deg,#EAD5E8,#C0A0C0)', name: 'Woven Rattan Basket',       price: '$5.50/pc',   moq: 'MOQ 24 pcs'  },
      { emoji: '🪆', bg: 'linear-gradient(145deg,#D5EAD5,#A0C8A0)', name: 'Channapatna Wood Toys',     price: '$2.50/set',  moq: 'MOQ 24 sets' },
      { emoji: '🪞', bg: 'linear-gradient(145deg,#EAE0D5,#C8B8A0)', name: 'Rajasthani Mirror Work',    price: '$34.00/pc',  moq: 'MOQ 4 pcs'   },
      { emoji: '🎎', bg: 'linear-gradient(145deg,#D5D5EA,#A8A8C8)', name: 'Madhubani Art Print',       price: '$5.50/pc',   moq: 'MOQ 10 pcs'  },
      { emoji: '🔆', bg: 'linear-gradient(145deg,#EAD5C0,#C8A880)', name: 'Antique Brass Lamp',        price: '$22.00/pc',  moq: 'MOQ 6 pcs'   },
    ],
  },
];

// ── Curated collections ─────────────────────────────────────────────────────
export const COLLECTIONS = [
  { wide: true,  name: 'Artisan India — Handcrafted for the World', desc: 'Authentic handmade products from Rajasthan, UP & Maharashtra — pottery, textiles, metalware, and more. All traceable to the artisan.' },
  { wide: false, name: 'The Luxury Home Edit',                      desc: 'Heritage craftsmen from Jaipur & Moradabad producing export-grade décor, lamps, and art pieces.' },
  { wide: false, name: 'Made in Jodhpur',                           desc: 'Furniture, wood crafts, and textile artisans from the Blue City — export-certified and design-forward.' },
];

// ── Cities (was Regions) ────────────────────────────────────────────────────
export const CITIES = [
  {
    name: 'Jaipur',
    tagline: 'The Pink City — India\'s craft capital',
    desc: 'Blue pottery · Textiles · Jewelry · Block prints',
    tags: [['t', 'Pottery'], ['n', 'Textiles'], ['g', 'Jewelry']],
  },
  {
    name: 'Moradabad',
    tagline: 'Brass City — Metal craft hub of India',
    desc: 'Brassware · Metal décor · Lamps · Serveware',
    tags: [['t', 'Brassware'], ['n', 'Metal Décor'], ['g', 'Lamps']],
  },
  {
    name: 'Delhi',
    tagline: 'The Capital — Textiles & home furnishings',
    desc: 'Soft furnishings · Handicrafts · Block prints · Export',
    tags: [['t', 'Furnishings'], ['n', 'Handicrafts'], ['g', 'Export']],
  },
  {
    name: 'Jodhpur',
    tagline: 'The Blue City — Wood furniture & heritage crafts',
    desc: 'Furniture · Wood crafts · Textiles · Heritage art',
    tags: [['t', 'Furniture'], ['n', 'Wood Crafts'], ['g', 'Textiles']],
  },
];

// ── Platform features ───────────────────────────────────────────────────────
export const FEATURES = [
  { icon: '🤝', iconBg: 'linear-gradient(135deg,#FDF3EB,#FAE8D4)', iconBorder: 'rgba(196,119,58,.25)', title: 'Trade Assurance',       desc: 'Escrow-backed payments release only after you approve goods. Every transaction is fully protected.' },
  { icon: '⚡', iconBg: 'linear-gradient(135deg,#EBF4EE,#DCF0E4)', iconBorder: 'rgba(61,122,52,.2)',   title: 'Instant RFQ Matching',  desc: 'Post a sourcing requirement and receive verified quotes within hours from the right suppliers.' },
  { icon: '📊', iconBg: 'linear-gradient(135deg,#EEF2FB,#DCE4F8)', iconBorder: 'rgba(27,49,117,.15)',  title: 'Real-Time Analytics',   desc: 'Live dashboards for market rates, supplier scorecards, and shipment tracking — all in one place.' },
  { icon: '📄', iconBg: 'linear-gradient(135deg,#FDF3EB,#FAE8D4)', iconBorder: 'rgba(196,119,58,.25)', title: 'Digital Contracts',     desc: 'Negotiate terms, sign digitally, and store every contract securely. No PDFs over email.' },
  { icon: '🚚', iconBg: 'linear-gradient(135deg,#EBF4EE,#DCF0E4)', iconBorder: 'rgba(61,122,52,.2)',   title: 'Shipment Tracking',     desc: 'Real-time logistics visibility from dispatch to delivery. Know where your order is at every step.' },
  { icon: '🛡️', iconBg: 'linear-gradient(135deg,#EEF2FB,#DCE4F8)', iconBorder: 'rgba(27,49,117,.15)',  title: 'Export Compliance',     desc: 'GST invoices, shipping docs, and export paperwork — generated automatically for every order.' },
];

// ── Stats ───────────────────────────────────────────────────────────────────
export const STATS = [
  { num: '10',  suf: '+', label: 'Verified Suppliers'  },
  { num: '200', suf: '+', label: 'Products Listed'     },
  { num: '10',  suf: '+', label: 'Categories'          },
  { num: '120', suf: '+', label: 'Countries Served'    },
];

// ── Testimonials ────────────────────────────────────────────────────────────
export const TESTIMONIALS = [
  { initial: 'S', bg: 'linear-gradient(135deg,#C4773A,#A8622E)', rating: '★★★★★', quote: '"We found our best Jaipur pottery supplier on Globrixa in under a week. The quality verification process gave us real confidence before ordering."', name: 'Sarah Mitchell',    role: 'Buyer · Terrain Home, Philadelphia' },
  { initial: 'P', bg: 'linear-gradient(135deg,#3D7A52,#2A6040)', rating: '★★★★★', quote: '"Our import volume tripled in three months. Best platform for sourcing Indian home décor — the supplier quality is consistently excellent."',      name: 'Pierre Dubois',     role: 'Import Manager · Maison & Objet, Paris' },
  { initial: 'A', bg: 'linear-gradient(135deg,#1B3175,#122460)', rating: '★★★★★', quote: '"Trade assurance completely transformed how we do international orders. The export support team is always responsive. Outstanding."',               name: 'Aiko Tanaka',       role: 'Founder · Wabi Studio, Tokyo' },
];

// ── For Brands / Suppliers ──────────────────────────────────────────────────
export const BRAND_PERKS = [
  { icon: '📦', title: 'Free to list',         desc: 'Get your catalog live in minutes. No upfront cost, no hidden fees.' },
  { icon: '📊', title: 'Real-time analytics',  desc: "See who's viewing your products and track every inquiry live." },
  { icon: '🛡️', title: 'Payment protection',   desc: 'Trade assurance means you get paid — every time, on time.' },
];

export const BRAND_METRICS = [
  { icon: '📈', num: '3× growth',      label: 'Average buyer reach increase in first 90 days' },
  { icon: '⚡', num: '24 hrs',         label: 'Average time to first verified international inquiry' },
  { icon: '💰', num: '$0 upfront',     label: 'Free to list — pay only when you sell' },
  { icon: '🌍', num: '120+ countries', label: 'International buyers sourcing from India' },
];

// ── FAQs ────────────────────────────────────────────────────────────────────
export const FAQS = [
  { q: 'How do I verify a supplier on Globrixa?',             a: 'Every supplier undergoes GST-based KYC before listing. Verified badges indicate completion. You can view ratings, reviews, and order history before placing any order.' },
  { q: 'What is Trade Assurance and how does it protect me?', a: 'Trade Assurance holds payment in escrow until goods are received and match your order. Our resolution team steps in for any disputes — you never lose money on a valid order.' },
  { q: 'Can I request samples before ordering in bulk?',      a: 'Yes. Most suppliers on Globrixa offer sample orders. You can request samples directly through the platform for a small fee, often credited against your first bulk order.' },
  { q: 'What currencies and payment methods are supported?',  a: 'All prices are in USD. We support international wire, credit card, and SWIFT transfers. Net 30/60 terms are available for qualifying buyers.' },
  { q: 'Is Globrixa free for buyers?',                        a: 'Yes — buyers can browse, message suppliers, and place orders for free. A Pro plan adds bulk RFQ tools, priority matching, and a dedicated account manager.' },
  { q: 'How do I get export documents and customs support?',  a: 'Globrixa generates commercial invoices and packing lists automatically. Our export support team helps with HSN codes, shipping coordination, and documentation.' },
];

// ── Footer columns ──────────────────────────────────────────────────────────
export const FOOTER_COLS = [
  { heading: 'Platform',    links: ['Products', 'Suppliers', 'RFQs', 'Analytics', 'Pricing']                          },
  { heading: 'Categories',  links: ['Wall Décor', 'Soft Furnishings', 'Handicrafts', 'Textiles', 'View all 24']       },
  { heading: 'Company',     links: ['About', 'Our Story', 'Blog', 'Careers', 'Press']                                 },
  { heading: 'Support',     links: ['Help Center', 'Contact', 'Privacy', 'Terms', 'Refund Policy']                    },
];
