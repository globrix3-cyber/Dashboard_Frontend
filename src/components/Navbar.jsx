import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout, toggleLogin } from '../features/auth/authSlice';
import { disconnectSocket } from '../../services/socket';
import { DASHBOARD_ROUTES } from '../../constants';
import {
  Globe, Bell, ChevronDown, LogOut, User,
  LayoutDashboard, Menu, X, Zap
} from 'lucide-react';

export default function Navbar({ socket }) {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();
  const { userRole, userName } = useSelector((s) => s.auth);
  const notifications = useSelector((s) => s.notifications.items);

  const [scrolled,      setScrolled]      = useState(false);
  const [profileOpen,   setProfileOpen]   = useState(false);
  const [notifOpen,     setNotifOpen]     = useState(false);
  const [mobileOpen,    setMobileOpen]    = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logout());
    disconnectSocket();
    dispatch(toggleLogin(true));
    navigate('/');
  };

  const roleLabel = userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : '';

  const navLinks = [
    { label: 'Categories', path: '/categories' },
    { label: 'Products',   path: '/products'   },
    { label: 'Dashboard',  path: DASHBOARD_ROUTES[userRole] },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(229,231,235,0.8)',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.06)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <button onClick={() => navigate('/')} className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
            style={{ background: 'linear-gradient(135deg,#FF6B00,#FF8C00)' }}>
            <Globe size={15} color="white" />
          </div>
          <span className="text-lg font-black tracking-tight text-gray-900">Globrixa</span>
          <span className="hidden sm:block text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: '#FFF7ED', color: '#FF6B00' }}>B2B</span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ label, path }) => path && (
            <button key={label} onClick={() => navigate(path)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                color: location.pathname.startsWith(path) ? '#FF6B00' : '#6B7280',
                background: location.pathname.startsWith(path) ? '#FFF7ED' : 'transparent',
              }}>
              {label}
            </button>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">

          {/* Notifications */}
          <div className="relative">
            <button onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
              className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-gray-100">
              <Bell size={18} className="text-gray-600" />
              {notifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                  style={{ background: '#FF6B00' }} />
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <span className="font-bold text-sm text-gray-900">Notifications</span>
                  <button onClick={() => setNotifOpen(false)}><X size={14} className="text-gray-400" /></button>
                </div>
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-gray-400">No notifications yet</div>
                ) : (
                  notifications.slice(0, 5).map((n) => (
                    <div key={n.id} className="px-4 py-3 border-b border-gray-50 hover:bg-gray-50">
                      <p className="text-sm text-gray-800">{n.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Profile dropdown */}
          <div className="relative">
            <button onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all hover:bg-gray-100">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                style={{ background: 'linear-gradient(135deg,#FF6B00,#FF8C00)' }}>
                {userName?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-gray-900 leading-none">{userName}</div>
                <div className="text-xs text-gray-400 mt-0.5">{roleLabel}</div>
              </div>
              <ChevronDown size={14} className="text-gray-400" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-bold text-sm text-gray-900">{userName}</p>
                  <p className="text-xs text-gray-400">{roleLabel}</p>
                </div>
                <div className="p-2">
                  <button onClick={() => { navigate('/edit-profile'); setProfileOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-gray-50">
                    <User size={15} /> Edit Profile
                  </button>
                  <button onClick={() => { navigate(DASHBOARD_ROUTES[userRole]); setProfileOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-gray-50">
                    <LayoutDashboard size={15} /> Dashboard
                  </button>
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm mt-1 font-medium"
                    style={{ color: '#DC2626', background: '#FEF2F2' }}>
                    <LogOut size={15} /> Log Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-3">
          {navLinks.map(({ label, path }) => path && (
            <button key={label} onClick={() => { navigate(path); setMobileOpen(false); }}
              className="text-sm font-medium text-gray-700 text-left py-2">
              {label}
            </button>
          ))}
          <button onClick={handleLogout}
            className="text-sm font-bold text-red-500 text-left py-2">
            Log Out
          </button>
        </div>
      )}
    </header>
  );
}