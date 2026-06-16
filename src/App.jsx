import { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { setAuth, toggleLogin } from "./features/auth/authSlice";
import { setUsdRate } from "./features/currency/currencySlice";
import { connectSocket, disconnectSocket } from "./services/socket";
import { DASHBOARD_ROUTES, allowedPathsByRole } from "./constants";
import { routeConfig } from "./routeConfig";

import LoginModal from "./pages/LoginModal";

import "./index.css";

// Pages anyone can browse without an account (Faire-style open browsing) —
// the initial-load guard below must not slap a login modal over these.
const GUEST_BROWSABLE_PREFIXES = [
  '/products', '/categories', '/about', '/blog', '/careers',
  '/contact', '/privacy', '/terms', '/help', '/our-story',
];
const isGuestBrowsable = (path) =>
  path === '/' || GUEST_BROWSABLE_PREFIXES.some(p => path === p || path.startsWith(p + '/'));

export default function App() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();

  const { userRole, token, showLogin } = useSelector((s) => s.auth);

  // ── 0. Fetch live INR→USD rate once on startup ──────────────────────────
  // jsdelivr CDN mirrors @fawazahmed0/currency-api and sets CORS: * — safe
  // from any origin. Falls back to ≈₹83/$1 if the CDN is unreachable so
  // the currency toggle always works even offline.
  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/inr.json')
      .then(r => r.json())
      .then(data => dispatch(setUsdRate(data.inr?.usd || 0.012)))
      .catch(() => dispatch(setUsdRate(0.012)));
  }, [dispatch]);

  // ── 1. Restore auth from localStorage on first load ─────────────────────
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole  = localStorage.getItem("role");
    const storedName  = localStorage.getItem("name");

    if (storedToken && storedRole) {
      dispatch(
        setAuth({
          token:    storedToken,
          userRole: storedRole,
          userName: storedName || "",
        })
      );
    } else if (!isGuestBrowsable(location.pathname)) {
      dispatch(toggleLogin(true));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── 2. Handle token expiry fired by api.js (401 + refresh failed) ───────
  useEffect(() => {
    const onExpired = () => {
      dispatch(setAuth({ token: null, userRole: null, userName: null }));
      dispatch(toggleLogin(true));
      navigate("/", { replace: true });
    };
    window.addEventListener("auth:expired", onExpired);
    return () => window.removeEventListener("auth:expired", onExpired);
  }, [dispatch, navigate]);

  // ── 2b. Keep Redux token in sync after silent refresh ────────────────────
  // api.js silently rotates tokens in localStorage every 15 min. Without this,
  // Redux keeps the original expired token, and the socket never reconnects
  // with a fresh credential after a network drop.
  useEffect(() => {
    const onRefreshed = (e) => {
      dispatch(setAuth({
        token:    e.detail.token,
        userRole: localStorage.getItem("role"),
        userName: localStorage.getItem("name") || "",
      }));
    };
    window.addEventListener("auth:token-refreshed", onRefreshed);
    return () => window.removeEventListener("auth:token-refreshed", onRefreshed);
  }, [dispatch]);

  // ── 3. Socket lifecycle — connect when token is available ────────────────
  useEffect(() => {
    if (token) {
      connectSocket(token);
    }
    return () => disconnectSocket();
  }, [token]);

  // ── 4. Role-based redirect guard ────────────────────────────────────────
  useEffect(() => {
    if (!userRole) return;

    const allowed       = allowedPathsByRole[userRole] || [];
    const currentPath   = location.pathname.replace(/\/+$/, "");
    const dashboardPath = DASHBOARD_ROUTES[userRole];

    const isAllowed = allowed.some((p) => {
      if (p.includes(":")) {
        const regex = new RegExp("^" + p.replace(/:[^/]+/g, "[^/]+") + "$");
        return regex.test(currentPath);
      }
      return p === currentPath;
    });

    const PUBLIC_PATHS = ['/about', '/blog', '/careers', '/contact', '/privacy', '/terms', '/help'];
    const isPublic = PUBLIC_PATHS.some(p => currentPath === p || currentPath.startsWith(p + '/'));

    if (isPublic) return; // always allow public pages regardless of role

    if (currentPath === "" || currentPath === "/") {
      navigate(dashboardPath, { replace: true });
    } else if (!isAllowed) {
      navigate(dashboardPath, { replace: true });
    }
  }, [userRole, location.pathname, navigate]);

  // ── 5. Called by LoginModal after successful login / register ────────────
  const handleAuthSuccess = (role) => {
    navigate(DASHBOARD_ROUTES[role], { replace: true });
  };

  return (
    <>
      <Routes>
        {routeConfig.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}

        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-black text-gray-200 mb-4">404</div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Page not found</h2>
                <button
                  className="btn-primary px-6 py-2.5 rounded-xl text-sm mt-4"
                  onClick={() => navigate("/")}
                >
                  Go Home
                </button>
              </div>
            </div>
          }
        />
      </Routes>

      {/* Login Modal — onSubmit triggers post-auth navigation */}
      {showLogin && <LoginModal onSubmit={handleAuthSuccess} />}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        closeOnClick
        pauseOnHover
        toastStyle={{
          fontFamily: "Sora, sans-serif",
          borderRadius: 12,
        }}
      />
    </>
  );
}