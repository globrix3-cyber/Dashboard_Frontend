# Globrixa — India's B2B Wholesale Marketplace

## What is Globrixa?

Globrixa is an online wholesale marketplace that connects Indian manufacturers and artisan suppliers with buyers around the world. Think of it like a professional sourcing platform — buyers (retailers, importers, business owners) can browse thousands of Indian products, request quotes from verified suppliers, and place bulk orders — all in one place.

**For buyers:** Browse 50,000+ wholesale products across textiles, handicrafts, home décor, food & agriculture, jewelry, and more. Send a request for quotation (RFQ) to multiple suppliers at once, compare quotes, sign a digital contract, and track your order — from inquiry to delivery.

**For suppliers:** List your products, respond to buyer RFQs, send professional quotes, manage orders, and grow your export business globally. Every supplier is GST-verified before listing.

**For the Globrixa team:** An admin dashboard lets the team verify suppliers, moderate products, manage users, and monitor platform activity.

---

## How It Works

### For a buyer
1. Browse products or search by category on the landing page
2. Sign up with a business email (takes 2 minutes)
3. Send an RFQ — specify quantity, delivery date, and budget
4. Receive quotes from interested suppliers, compare them
5. Accept a quote → a digital contract is generated
6. Pay and track your order

### For a supplier
1. Register as a supplier brand
2. List your products with photos, price tiers, and MOQ (minimum order quantity)
3. Browse open RFQs from buyers looking for what you make
4. Submit a quote — price, lead time, payment terms
5. If accepted, sign the digital contract and fulfill the order

---

## Key Features

| Feature | What it does |
|---|---|
| Product catalogue | 50K+ products, searchable by category, region, and supplier |
| RFQ system | Buyers post requests; suppliers respond with competitive quotes |
| Digital contracts | Auto-generated from accepted quotes; both parties sign online |
| Order tracking | Real-time status from confirmed → production → shipped → delivered |
| Live messaging | Buyers and suppliers chat directly, with quote offers inside the chat |
| Trade assurance | Escrow-style payment protection built in |
| GST compliance | All suppliers are KYC and GST verified |
| Multi-role access | Separate dashboards for buyers, suppliers, and admins |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 with Vite 8 |
| State management | Redux Toolkit |
| Routing | React Router v7 |
| Real-time | Socket.IO client |
| Icons | Lucide React |
| Styling | Inline styles + Tailwind CSS utility classes |
| Fonts | Cormorant Garamond (display) · DM Sans (body) |
| Notifications | React Toastify |

---

## Project Structure

```
src/
├── pages/
│   ├── landing/          # Public landing page sections
│   │   ├── LandingNavbar, HeroSection, ShopByCategory …
│   ├── LandingPage.jsx   # Landing page shell
│   ├── BuyerDashboard.jsx
│   ├── SupplierDashboard.jsx
│   ├── AdminDashboard.jsx
│   ├── LoginModal.jsx    # Auth modal (login + register)
│   ├── BuyerRFQsPage, BuyerOrdersPage, ContractsListPage …
│   ├── SupplierPages     # Supplier RFQs, quotes, catalog
│   ├── MessagesPage      # Live chat between buyer ↔ supplier
│   └── PublicPages       # About, Contact, Terms etc.
├── layouts/
│   └── DashboardLayout.jsx  # Sidebar + shell for all dashboards
├── features/
│   └── auth/             # Redux auth slice
├── services/
│   ├── api.js            # All API calls
│   └── socket.js         # Socket.IO setup
├── hooks/
│   └── useBreakpoint.js  # Responsive breakpoint hook
└── components/
    ├── UI.jsx            # Shared StatCard, Badge, Spinner, EmptyState
    └── Navbar.jsx        # Authenticated top navbar
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app runs on `http://localhost:5173` by default.

> **Note:** The frontend expects a backend API. Set the API base URL in `src/services/api.js`. Without it, login and data fetching will fail — the landing page and static content will still render.

---

## Design System

- **Primary accent:** Saffron `#C4773A` — used for CTAs, active states, prices
- **Emerald:** `#1A7A4A` — supplier accent, success states
- **Navy:** `#1B3175` — export/admin accent
- **Background:** Warm cream `#FDF8F2`
- **Display font:** Cormorant Garamond (headings, prices)
- **Body font:** DM Sans (all UI text)

---

## Roles & Permissions

| Role | Access |
|---|---|
| Guest | Landing page, product browsing (read-only) |
| Buyer | RFQs, orders, contracts, messages, categories, products |
| Supplier | Open RFQs, quotes, orders, contracts, messages, catalog |
| Admin | All of the above + user management, verifications, reports |

---

Built with ❤️ for Indian MSMEs and global buyers.
