import { ROLES } from "./constants";

// Layout
import DashboardLayout from "./layouts/DashboardLayout";

// Pages
import LandingPage       from "./pages/LandingPage";
import ProductsPage      from "./pages/ProductsPage";
import EditProfile       from "./pages/EditProfile";

import BuyerDashboard    from "./pages/BuyerDashboard";
import SupplierDashboard from "./pages/SupplierDashboard";

import BuyerRFQsPage     from "./pages/BuyerRFQsPage";
import BuyerOrdersPage   from "./pages/BuyerOrdersPage";
import CreateRFQForm     from "./pages/CreateRFQForm";

import SupplierPages     from "./pages/SupplierPages";
import SupplierCatalog   from "./pages/SupplierCatalog";
import ListProduct       from "./pages/ListProduct";

const {
  SupplierRFQsPage,
  SupplierRFQDetail,
  SupplierQuotesPage,
  SupplierOrdersPage,
} = SupplierPages || {};

// Wrap a page component in the dashboard layout
const withLayout = (Component) => (
  <DashboardLayout>
    <Component />
  </DashboardLayout>
);

export const routeConfig = [
  // ── Public ────────────────────────────────────────────────────────────────
  { path: "/",          element: <LandingPage />, public: true },

  // ── Shared ────────────────────────────────────────────────────────────────
  {
    path:    "/products",
    element: withLayout(ProductsPage),
    roles:   [ROLES.BUYER, ROLES.SUPPLIER],
  },
  {
    path:    "/edit-profile",
    element: withLayout(EditProfile),
    roles:   [ROLES.BUYER, ROLES.SUPPLIER],
  },

  // ── Buyer ─────────────────────────────────────────────────────────────────
  {
    path:    "/buyer-dashboard",
    element: withLayout(BuyerDashboard),
    roles:   [ROLES.BUYER],
  },
  {
    path:    "/buyer-dashboard/rfqs",
    element: withLayout(BuyerRFQsPage),
    roles:   [ROLES.BUYER],
  },
  {
    path:    "/buyer-dashboard/rfqs/new",
    element: withLayout(CreateRFQForm),
    roles:   [ROLES.BUYER],
  },
  {
    path:    "/buyer-dashboard/orders",
    element: withLayout(BuyerOrdersPage),
    roles:   [ROLES.BUYER],
  },

  // ── Supplier ──────────────────────────────────────────────────────────────
  {
    path:    "/supplier-dashboard",
    element: withLayout(SupplierDashboard),
    roles:   [ROLES.SUPPLIER],
  },
  {
    path:    "/supplier-dashboard/rfqs",
    element: withLayout(SupplierRFQsPage),
    roles:   [ROLES.SUPPLIER],
  },
  {
    path:    "/supplier-dashboard/rfqs/:id",
    element: withLayout(SupplierRFQDetail),
    roles:   [ROLES.SUPPLIER],
  },
  {
    path:    "/supplier-dashboard/quotes",
    element: withLayout(SupplierQuotesPage),
    roles:   [ROLES.SUPPLIER],
  },
  {
    path:    "/supplier-dashboard/orders",
    element: withLayout(SupplierOrdersPage),
    roles:   [ROLES.SUPPLIER],
  },
  {
    path:    "/supplier-dashboard/catalog",
    element: withLayout(SupplierCatalog),
    roles:   [ROLES.SUPPLIER],
  },
  {
    path:    "/supplier-dashboard/catalog/new",
    element: withLayout(ListProduct),
    roles:   [ROLES.SUPPLIER],
  },
  {
    path:    "/supplier-dashboard/catalog/:id/edit",
    element: withLayout(ListProduct),
    roles:   [ROLES.SUPPLIER],
  },
];