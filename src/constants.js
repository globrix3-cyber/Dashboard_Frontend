export const ROLES = {
  BUYER: "buyer",
  SUPPLIER: "supplier",
};

// Dashboard Routes for each role
export const DASHBOARD_ROUTES = {
  [ROLES.BUYER]: "/buyer-dashboard",
  [ROLES.SUPPLIER]: "/supplier-dashboard",
};

// Allowed paths per role (for route protection)
export const allowedPathsByRole = {
  [ROLES.BUYER]: [
    "/buyer-dashboard",
    "/buyer-dashboard/orders",
    "/buyer-dashboard/rfqs",
    "/products",
    "/products/:id",
    "/profile",
    "/edit-profile",
  ],
  [ROLES.SUPPLIER]: [
    "/supplier-dashboard",
    "/supplier-dashboard/rfqs",
    "/supplier-dashboard/rfqs/:id",
    "/supplier-dashboard/quotes",
    "/supplier-dashboard/orders",
    "/supplier-dashboard/catalog",
    "/supplier-dashboard/catalog/new",
    "/supplier-dashboard/catalog/:id/edit",
    "/supplier-dashboard/catalog/:id",
    "/profile",
    "/edit-profile",
  ],
};