import { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { setAuth, toggleLogin } from "./features/auth/authSlice";
import { connectSocket, disconnectSocket } from "./services/socket";
import { DASHBOARD_ROUTES, allowedPathsByRole } from "./constants";
import { routeConfig } from "./routeConfig";

import LoginModal from "./pages/LoginModal";

import "./index.css";

export default function App() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();

  const { userRole, token, showLogin } = useSelector((s) => s.auth);

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
    } else if (location.pathname !== "/") {
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