# Landing Page Redesign — Design Spec
**Date:** 2026-05-13  
**Project:** Globrixa B2B Frontend  
**Scope:** `src/pages/LandingPage.jsx` only  
**Inspiration:** Faire.com — curated, discovery-first B2B wholesale marketplace

---

## 1. Overview

Replace the current India-themed landing page (mandala patterns, Hindi phrases, tricolor bar) with a rich, Faire-inspired design that is:
- **Discovery-first** — categories and products are the visual stars
- **English only** — no Hindi text anywhere
- **Warm & curated** — cream/terracotta palette, not corporate blue
- **Visually premium** — gradient cards, ambient glows, serif typography, hover depth

The redesign is a single-file replacement of `LandingPage.jsx`. No backend changes. No new routes. No new Redux state.

---

## 2. Design Decisions

| Decision | Choice | Reason |
|---|---|---|
| Design direction | Warm & Brand-Card (split hero) | Keeps Indian warmth while feeling curated |
| Colour palette | Terracotta on cream | Close to Faire's earthy palette, modern without losing warmth |
| Hero right panel | 3×2 product grid | Immediately shows the marketplace depth |
| Page length | Full Faire-style (long) | More discovery surface, higher engagement |
| Language | English only | User requirement |

---

## 3. Colour Tokens

```
--cream:      #F7F1E8   (page background)
--cream-mid:  #EDE6D6   (alternate section bg)
--cream-deep: #E2D8C6   (section divider bg)
--white:      #FFFFFF
--terra:      #C4773A   (primary accent — CTAs, highlights)
--terra-dark: #A8622E   (hover state)
--terra-lt:   #FDF3EB   (tinted backgrounds)
--terra-mid:  #E8A876   (borders, badge tints)
--ink:        #1C1915   (headings)
--ink-soft:   #3D3830   (body text)
--muted:      #8A8178   (secondary text, labels)
--border:     #DEDAD0
--border-soft:#EDE8DF
--green:      #3D7A52   (Verified badges)
--green-lt:   #EBF4EE
--navy:       #1B3175   (Luxury/ISO badges)
--navy-lt:    #EEF2FB
```

**Typography:**
- Headings: `Playfair Display` (serif) — 700/900 weight
- Body: `Inter` — 400/500/600/700
- Load via Google Fonts

---

## 4. Page Sections (top → bottom)

### 4.1 Announcement Bar
- Full-width dark bar (`#1C1915` gradient)
- "NEW" badge + short message + link
- No close button (static)

### 4.2 Navbar
- Sticky, `backdrop-filter: blur(20px)`, cream bg at 95% opacity
- Logo left (Playfair serif)
- **Search bar centre** — flex-grow, max 540px, rounded, with search button
- Nav links: Discover · Suppliers · Pricing
- Actions: Sign in (ghost) + Join free (primary)

### 4.3 Hero
- 2-column grid: left = headline + CTA, right = 3×2 product card grid
- Headline: "Where brands meet *buyers*" — italic `em` uses terracotta gradient text
- Sub-copy: 50K+ products, 5K+ suppliers, pay on terms
- 2 CTAs: "Start sourcing free" (gradient primary) + "List your brand →" (ghost)
- Trust chips: GST Verified · Trade Assured · Net 30 Terms
- Right grid: 5 product cards + 1 terracotta CTA tile ("5,000+ verified suppliers")
- Each product card: gradient image area, badge (Trending/Organic/Export), ♡ favourite, name, brand+city, price/unit, MOQ
- Decorative radial glow blobs behind both columns (CSS pseudo-elements, pointer-events none)

### 4.4 Social Proof Ticker
- White bar below hero
- Live-style activity items: "Rahul Exports placed a ₹2.4L order · 2 min ago", "142 buyers joined today", etc.
- Green pulsing dot per item, pipe separators

### 4.5 Category Nav Bar
- Sticky below navbar (top: 68px)
- Horizontally scrollable pill tabs: All · Textiles · Agriculture · Engineering · Pharma · Handicrafts · Electronics · Spices & Food · Jewelry · Beauty & Health · Construction · View all 24 →
- Active tab: terracotta text + bottom border
- `overflow-x: auto; scrollbar-width: none`

### 4.6 Press Strip
- Cream-mid background
- "As seen in" label + 6 publication names in muted serif
- Opacity 45% — subtle credibility signal

### 4.7 Shop by Category
- Eyebrow: Browse
- **4 large editorial cards** (aspect-ratio 3/4, full-bleed gradient bg): Textiles · Agriculture · Engineering · Handicrafts
  - Gradient overlay dark-to-transparent from bottom
  - Playfair name, count, chip tag
  - Scale-up on hover, lift + shadow
- **6 small sub-category tiles** below: Pharma · Electronics · Spices & Food · Jewelry · Beauty & Health · View all 24 (terracotta gradient)

### 4.8 Featured Suppliers
- Cream-mid background
- 4-column brand card grid
- Each card: gradient banner with emoji + badge (Verified/Organic), name, location, stats row (Products / Rating / Min order), tag pills, "View Catalog →" CTA button
- Hover: lift + shadow + border fades to transparent

### 4.9 Trending Products
- 5-column product grid
- First cell spans 2 columns: dark green "Spotlight Category" editorial banner with ambient orbs and CTA
- Remaining 5: standard product cards with gradient image area, brand label (uppercase terracotta), name, MOQ, price, rating + "Quote" button

### 4.10 New This Week
- Cream-mid background
- "NEW THIS WEEK" terracotta badge inline with section title
- 6-column compact product grid (smaller image area)

### 4.11 Trending by Category (3 rows)
- White background, top border
- Each row: icon tile + Playfair title + count + "View All →" button
- 6-column mini product grid per row
- Rows: Textiles · Agriculture & Food · Handicrafts
- Subtle bottom border between rows

### 4.12 Curated Collections (Editor's Picks)
- Cream-mid background
- 3-column grid: 1 wide (2fr) + 2 narrow (1fr)
- Each: dark gradient top image panel (tall, with emoji + ambient glow), white card body below with name, desc, "Explore →"

### 4.13 Browse by Region
- Cream background
- 4 region cards (North / West / South / East India)
- Each: coloured tinted background (warm for North, green for West, pink for South, blue for East), emoji, Playfair name, city list, tag pills
- Hover: lift + shadow

### 4.14 How It Works
- Cream-deep background
- Centred section header
- 3-panel white grid (border-radius on corners only)
- Each: outlined serif number (01/02/03 using `-webkit-text-stroke`), emoji icon, title, paragraph
- No connector line — clean separation via 1px border between panels

### 4.15 Platform Features
- Cream background
- 3×2 grid (6 features), panels share borders like a table
- Top border of each panel: 3px terracotta line
- Features: Trade Assurance · RFQ Matching · Analytics · Digital Contracts · Shipment Tracking · GST & Compliance
- Each: coloured icon box (terra/green/navy tint), title, description

### 4.16 Stats (dark)
- Deep dark gradient background (`#1C1915` → `#2A2320`)
- Ambient radial glows (terracotta top-right, green bottom-left)
- 4-column grid with semi-transparent separators, rounded container
- Numbers: Playfair 56px, white, terracotta suffix

### 4.17 Testimonials
- Cream background
- 3 cards
- Ghost giant `"` in top-right corner (translucent terracotta, Playfair 120px, pointer-events none)
- Playfair italic quote, star rating, divider, avatar (gradient), name + role
- Hover: terracotta border + shadow

### 4.18 For Brands Split
- Left: cream-deep — eyebrow, Playfair title, sub, 3 perk rows (icon + title + desc), 2 CTAs
- Right: dark gradient — 4 metric cards (gradient dark glass, terracotta icon bg, Playfair number, muted label), ambient glow top-right
- Layout: 2-column, right panel bleeds to edge (negative margin)

### 4.19 FAQ
- Cream-mid background
- 2-column grid of 6 Q&A cards
- "Q" badge (terracotta), question bold, answer indented in muted
- Hover: terracotta border

### 4.20 Newsletter
- Cream background, top border
- Centred, max 560px
- Email input + "Subscribe free" CTA
- Social proof note: "Join 12,000+ procurement professionals"

### 4.21 CTA Banner
- Full-width terracotta gradient (`var(--t)` → `var(--td)`)
- SVG circle pattern overlay (subtle, pointer-events none)
- Playfair headline, sub-copy, 2 buttons (white solid + ghost outline)
- Buttons lift on hover with stronger shadow

### 4.22 Footer
- `#0F0E0D` background
- 5-column grid: Brand (logo + desc + Made in India badge) + Platform + Categories + Company + Support
- Bottom bar: copyright left + privacy/terms/refund right
- Link hover → terracotta

---

## 5. Visual Effects

| Effect | Implementation |
|---|---|
| Gradient text (hero) | `background-clip: text; -webkit-text-fill-color: transparent` |
| Outlined numbers | `-webkit-text-stroke: 2px var(--terra); color: transparent` |
| Ambient glows | CSS pseudo-elements with `radial-gradient` + absolute positioning |
| Card hover lift | `transform: translateY(-4px)` + `box-shadow` transition |
| Glass badges | `backdrop-filter: blur(6px)` + semi-transparent background |
| Sticky navbar | `position: sticky; backdrop-filter: blur(20px)` |
| Favourite icon | Static `♡` — no state wired (visual only) |
| Giant quote mark | Absolute positioned, `pointer-events: none`, opacity ~6% |
| Pattern overlay | Inline SVG `data:` URI in background-image |

---

## 6. Component Structure

The redesign replaces `LandingPage.jsx` as a single component. Sub-components to extract for readability:

```
LandingPage
  ├── AnnouncementBar
  ├── Navbar
  ├── HeroSection
  │   ├── HeroProductCard (×5)
  │   └── HeroCtaTile
  ├── SocialProofTicker
  ├── CategoryNavBar
  ├── PressStrip
  ├── ShopByCategorySection
  │   ├── CategoryHeroCard (×4)
  │   └── CategorySubCard (×6)
  ├── FeaturedSuppliersSection
  │   └── BrandCard (×4)
  ├── TrendingProductsSection
  │   ├── SpotlightBanner
  │   └── ProductCard (×5)
  ├── NewThisWeekSection
  │   └── ProductCard (×6, compact)
  ├── TrendingByCategorySection (×3 rows)
  │   └── MiniProductCard (×6 per row)
  ├── CuratedCollectionsSection
  ├── BrowseByRegionSection
  ├── HowItWorksSection
  ├── PlatformFeaturesSection
  ├── StatsSection
  ├── TestimonialsSection
  ├── ForBrandsSplitSection
  ├── FaqSection
  ├── NewsletterSection
  ├── CtaBannerSection
  └── Footer
```

---

## 7. Data / Props

All content is **static** in this first implementation — no API calls on the landing page. Product cards, supplier cards, testimonials, FAQ items, and category data are hardcoded in the component file.

Future iteration can pull `FeaturedSuppliers` and `TrendingProducts` from existing `/products` and `/companies` API endpoints.

---

## 8. Auth Dispatch Points

The following buttons dispatch `toggleLogin(true)` (existing behaviour, unchanged):
- Hero: "Start sourcing free"
- Hero: "List your brand →"
- Navbar: "Join free" + "Sign in"
- For Brands: "Apply as a brand"
- CTA Banner: "Start sourcing — it's free"
- CTA Banner: "List your brand →"

All other buttons/links are visual-only in this iteration (no routing or API calls).

---

## 9. What Does NOT Change

- Redux auth slice (`authSlice.js`) — `toggleLogin` dispatch still used for CTAs
- Route config — `/` still maps to `LandingPage`
- CSS reset / Tailwind config — global styles untouched
- Any other page

---

## 9. Mockup Reference

Approved mockup: `.superpowers/brainstorm/22-1778664055/content/full-page-v4.html`  
(Viewable via the brainstorm server at http://localhost:55099)
