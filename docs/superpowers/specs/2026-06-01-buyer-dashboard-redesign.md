# Buyer Dashboard Redesign — Faire-style
**Date:** 2026-06-01  
**Status:** Approved for implementation

---

## Summary

Redesign the buyer dashboard and its shell (DashboardLayout) to match Faire's clean discovery-first aesthetic, aligned with Globrixa's landing page typography and colour system.

**Design decisions confirmed by user:**
- Layout: Faire-style icon sidebar + product-browse main area
- Sidebar: Narrow (64px) dark icon rail — no text labels
- Main content: Products wall-to-wall (pure browse, no stats on home screen)
- Theme: Dark charcoal sidebar (#1C1815) + white content area
- Fonts: Cormorant Garamond (headings/display) + DM Sans (body) — matching landing page

---

## 1. DashboardLayout Changes

### Sidebar
Replace the current 220px wide text sidebar with a 64px icon-only dark rail.

**Sidebar structure (top → bottom):**
- Logo mark (saffron square, 32×32, border-radius 8)
- Nav items (40×40 rounded buttons, SVG icons):
  - Dashboard (grid icon) — buyer default active
  - Products / Browse (grid of squares)
  - RFQs (document lines)
  - Orders (shopping cart)
  - *divider*
  - Messages (chat bubble)
  - Favourites (heart)
- Bottom: User avatar circle (initials, saffron gradient)

**Behaviour:**
- Active state: `rgba(196,119,58,.22)` background, saffron icon
- Hover state: `rgba(255,255,255,.08)` background
- Tooltip on hover showing label (CSS `title` attribute)
- Sidebar never collapses — always 64px

**Colours:**
- Background: `#1C1815`
- Active icon: `#C4773A`
- Inactive icon: `rgba(255,255,255,.35)`
- Divider: `rgba(255,255,255,.08)`

### Top bar
White bar, 56px tall, `border-bottom: 1px solid #F0EAE0`.

Contents (left → right):
1. **Page title** — Cormorant Garamond 20px 700, e.g. "Good morning, Rahul 👋" on dashboard, "Browse Products" on products page
2. **Search input** — flex:1, max-width 420px, rounded pill, `background: #FDF8F2`, placeholder "Search products, suppliers, orders…"
3. **Notification bell** — 32×32 icon button with red dot badge when unread
4. **User chip** — name + avatar circle (initials)

### CSS / fonts
Add Cormorant Garamond to the global `@import` in DashboardLayout CSS_VARS alongside DM Sans.

### Supplier / Admin dashboards
The sidebar icon set changes but the slot layout is identical. Supplier and Admin get different nav items (same icon-rail pattern). Their dashboard page content is **not** changed in this spec — only the shell is updated.

---

## 2. BuyerDashboard Page

Replace the current welcome-banner → stats → panels layout with a pure product-browse experience.

### Top section (inside content area, below top bar)
- Section heading: **"New for you"** (Cormorant Garamond 26px 700)
- Sub-label: "5,000+ verified Indian suppliers · Updated daily" (DM Sans 13px muted)
- Right side: `+ New RFQ` button (dark, rounded-8) + `Browse all` ghost button

### Category filter tabs
Horizontal scrollable pill-tab row:
- Pills: All · Textiles · Home Décor · Food & Agri · Handicrafts · Jewelry · Industrial
- Active pill: `background: #1C1815; color: #fff`
- Inactive pill: `background: #FDF8F2; border: 1px solid #E8E2D8; color: #7A7068`
- Clicking a tab filters the product grid (client-side filter on the `CAT_DATA` already in ShopByCategory — reuse same data)

### Product grid
- **4 columns** on desktop, 2 on tablet, 1 on mobile
- Each card: image (height 140px, object-fit cover) → brand label → product name → price + MOQ badge
- Badge variants: NEW (saffron), EXPORT (navy), TRENDING (emerald)
- Card hover: `border-color: #C4773A`, `translateY(-2px)`
- Clicking any card → `dispatch(toggleLogin(true))` (same pattern as landing page — no direct product page yet)
- "Load more" button at bottom (ghost style)

### Product data
Reuse `CAT_DATA` from `ShopByCategory.jsx` — import directly rather than duplicating. "All" tab shows first 8 products across all categories shuffled. Category tabs filter to that category's 6 products.

### Stats & Orders
Removed from the home screen. Stats are accessible via the sidebar Orders/RFQ pages which already exist. A slim "3 pending orders" pill badge on the sidebar Orders icon provides the only at-a-glance count.

---

## 3. Files Changed

| File | Change |
|---|---|
| `src/layouts/DashboardLayout.jsx` | Full sidebar rebuild (icon rail), top bar update, font import |
| `src/pages/BuyerDashboard.jsx` | Full page rebuild (products-first) |
| `src/pages/SupplierDashboard.jsx` | Sidebar icon set updated (shell change only) |
| `src/pages/AdminDashboard.jsx` | Sidebar icon set updated (shell change only) |

---

## 4. Out of Scope

- Supplier dashboard content redesign
- Admin dashboard content redesign
- Real product API integration (products come from CAT_DATA static data)
- Mobile drawer for the icon sidebar (separate task)
- Notification system implementation
