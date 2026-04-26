export const ROLES = {
  BUYER:    "buyer",
  SUPPLIER: "supplier",
  ADMIN:    "admin",
};

// Dashboard Routes for each role
export const DASHBOARD_ROUTES = {
  [ROLES.BUYER]:    "/buyer-dashboard",
  [ROLES.SUPPLIER]: "/supplier-dashboard",
  [ROLES.ADMIN]:    "/admin-dashboard",
};

// Allowed paths per role (for route protection)
export const allowedPathsByRole = {
  [ROLES.BUYER]: [
    "/buyer-dashboard",
    "/buyer-dashboard/orders",
    "/buyer-dashboard/rfqs",
    "/buyer-dashboard/rfqs/new",
    "/buyer-dashboard/messages",
    "/categories",
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
    "/supplier-dashboard/messages",
    "/categories",
    "/supplier-dashboard/catalog",
    "/supplier-dashboard/catalog/new",
    "/supplier-dashboard/catalog/:id/edit",
    "/supplier-dashboard/catalog/:id",
    "/profile",
    "/edit-profile",
  ],
  [ROLES.ADMIN]: [
    "/admin-dashboard",
    "/admin-dashboard/users",
    "/admin-dashboard/companies",
    "/admin-dashboard/products",
    "/admin-dashboard/verifications",
    "/admin-dashboard/messages",
    "/categories",
    "/admin-dashboard/reports",
    "/admin-dashboard/settings",
    "/edit-profile",
  ],
};