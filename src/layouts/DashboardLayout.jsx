import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, toggleLogin } from '../features/auth/authSlice';
import { disconnectSocket } from '../services/socket';
import {
  LayoutDashboard, FileText, Package, ShoppingBag,
  Send, FileSearch, LogOut, User, Globe, ChevronRight,
  Menu,
} from 'lucide-react';
import { useState } from 'react';

/* ── CSS variables injected once into :root ────────────────────────────────── */
const CSS_VARS = `
  :root {
    --emerald:     #059669;
    --emerald-lt:  #ECFDF5;
    --saffron:     #F59E0B;
    --saffron-lt:  #FFFBEB;
    --navy:        #1E40AF;
    --navy-lt:     #EFF6FF;
    --gold:        #D97706;
    --gold-lt:     #FEF3C7;
    --ink:         #1C1815;
    --muted:       #6B7280;
    --border-soft: #E5E7EB;
    --warm-white:  #F9FAFB;
  }

  /* ── Sidebar nav button ──────────────────────────────────────────────────── */
  .sidebar-link {
    display:         flex;
    align-items:     center;
    gap:             10px;
    width:           100%;
    padding:         9px 12px;
    border-radius:   10px;
    border:          none;
    background:      transparent;
    color:           #374151;
    font-family:     'DM Sans', system-ui, sans-serif;
    font-size:       13.5px;
    font-weight:     500;
    text-align:      left;
    cursor:          pointer;
    transition:      background 0.15s, color 0.15s, transform 0.1s;
    white-space:     nowrap;
    overflow:        hidden;
  }

  .sidebar-link:hover:not(.active) {
    background: #F3F4F6;
    color:      #111827;
  }

  .sidebar-link.active {
    color:      #fff;
    font-weight: 700;
  }

  .sidebar-link span {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

/* ── Inject styles once ─────────────────────────────────────────────────────── */
if (!document.getElementById('globrix-vars')) {
  const s = document.createElement('style');
  s.id = 'globrix-vars';
  s.textContent = CSS_VARS;
  document.head.appendChild(s);
}

/* ── Nav link definitions ───────────────────────────────────────────────────── */
const buyerLinks = [
  { path: '/buyer-dashboard',        icon: LayoutDashboard, label: 'Overview'  },
  { path: '/buyer-dashboard/rfqs',   icon: FileText,        label: 'My RFQs'   },
  { path: '/buyer-dashboard/orders', icon: Package,         label: 'My Orders' },
  { path: '/products',               icon: ShoppingBag,     label: 'Browse'    },
  { path: '/edit-profile',           icon: User,            label: 'Profile'   },
];

const supplierLinks = [
  { path: '/supplier-dashboard',          icon: LayoutDashboard, label: 'Overview'  },
  { path: '/supplier-dashboard/rfqs',     icon: FileSearch,      label: 'Open RFQs' },
  { path: '/supplier-dashboard/quotes',   icon: Send,            label: 'My Quotes' },
  { path: '/supplier-dashboard/orders',   icon: Package,         label: 'Orders'    },
  { path: '/supplier-dashboard/catalog',  icon: ShoppingBag,     label: 'Catalog'   },
  { path: '/edit-profile',                icon: User,            label: 'Profile'   },
];

/* ── Sidebar ────────────────────────────────────────────────────────────────── */
function Sidebar({ links, collapsed, onToggle }) {
  const navigate              = useNavigate();
  const location              = useLocation();
  const dispatch              = useDispatch();
  const { userName, userRole } = useSelector((s) => s.auth);

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logout());
    disconnectSocket();
    dispatch(toggleLogin(true));
    navigate('/');
  };

  const accent   = userRole === 'supplier' ? '#059669' : '#FF6B00';
  const accentBg = userRole === 'supplier' ? '#ECFDF5' : '#FFF7ED';

  return (
    <aside
      style={{
        width:      collapsed ? 68 : 240,
        minWidth:   collapsed ? 68 : 240,
        height:     '100vh',
        position:   'sticky',
        top:        0,
        display:    'flex',
        flexDirection: 'column',
        background: '#FAFAFA',
        borderRight: '1px solid #E5E7EB',
        transition: 'width 0.3s, min-width 0.3s',
        overflow:   'hidden',
      }}
    >
      {/* ── Logo row ──────────────────────────────────────────────────────── */}
      <div style={{
        height:      64,
        display:     'flex',
        alignItems:  'center',
        padding:     '0 16px',
        gap:         12,
        borderBottom: '1px solid #E5E7EB',
        flexShrink:  0,
      }}>
        <div style={{
          width:           32,
          height:          32,
          borderRadius:    10,
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'center',
          flexShrink:      0,
          background:      `linear-gradient(135deg, ${accent}, ${accent}cc)`,
        }}>
          <Globe size={14} color="white" />
        </div>

        {!collapsed && (
          <span style={{
            fontWeight:    900,
            fontSize:      17,
            letterSpacing: '-0.5px',
            color:         '#111827',
            flex:          1,
          }}>
            GLOBRIX
          </span>
        )}

        <button
          onClick={onToggle}
          style={{
            marginLeft:     collapsed ? 'auto' : 0,
            width:          28,
            height:         28,
            borderRadius:   8,
            border:         'none',
            background:     'transparent',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            cursor:         'pointer',
            flexShrink:     0,
            color:          '#6B7280',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#E5E7EB'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
        >
          {collapsed
            ? <ChevronRight size={14} />
            : <Menu size={14} />}
        </button>
      </div>

      {/* ── User pill ─────────────────────────────────────────────────────── */}
      {!collapsed && (
        <div style={{
          margin:       '12px 12px 0',
          padding:      12,
          borderRadius: 14,
          background:   accentBg,
          flexShrink:   0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width:           32,
              height:          32,
              borderRadius:    10,
              display:         'flex',
              alignItems:      'center',
              justifyContent:  'center',
              background:      `linear-gradient(135deg, ${accent}, ${accent}cc)`,
              color:           '#fff',
              fontSize:        12,
              fontWeight:      700,
              flexShrink:      0,
            }}>
              {userName?.[0]?.toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontSize:    12,
                fontWeight:  700,
                color:       '#111827',
                overflow:    'hidden',
                textOverflow: 'ellipsis',
                whiteSpace:  'nowrap',
              }}>
                {userName}
              </div>
              <div style={{ fontSize: 11, color: accent, textTransform: 'capitalize' }}>
                {userRole}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Nav links ─────────────────────────────────────────────────────── */}
      <nav style={{
        flex:           1,
        overflowY:      'auto',
        padding:        12,
        display:        'flex',
        flexDirection:  'column',
        gap:            2,
        marginTop:      8,
      }}>
        {links.map(({ path, icon: Icon, label }) => {
          const active =
            location.pathname === path ||
            (path !== '/products' &&
             path !== '/edit-profile' &&
             location.pathname.startsWith(path));

          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`sidebar-link${active ? ' active' : ''}`}
              title={collapsed ? label : undefined}
              style={active ? {
                background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
                color:      '#fff',
              } : {}}
            >
              <Icon size={17} style={{ flexShrink: 0 }} />
              {!collapsed && <span>{label}</span>}
            </button>
          );
        })}
      </nav>

      {/* ── Logout ────────────────────────────────────────────────────────── */}
      <div style={{
        padding:     12,
        borderTop:   '1px solid #E5E7EB',
        flexShrink:  0,
      }}>
        <button
          onClick={handleLogout}
          className="sidebar-link"
          title={collapsed ? 'Log Out' : undefined}
          style={{ color: '#DC2626' }}
        >
          <LogOut size={17} style={{ flexShrink: 0 }} />
          {!collapsed && <span>Log Out</span>}
        </button>
      </div>
    </aside>
  );
}

/* ── DashboardLayout ────────────────────────────────────────────────────────── */
export default function DashboardLayout({ children }) {
  const { userRole }             = useSelector((s) => s.auth);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = userRole === 'supplier' ? supplierLinks : buyerLinks;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F9FAFB' }}>

      {/* Desktop sidebar */}
      <div style={{ display: 'none' }} className="md-sidebar-wrapper">
        <Sidebar links={links} collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      </div>

      {/* Responsive desktop sidebar via inline media approach */}
      <div className="hidden md:block" style={{ flexShrink: 0 }}>
        <Sidebar links={links} collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 40,
          display:  'flex',
        }} className="md:hidden">
          <div
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }}
            onClick={() => setMobileOpen(false)}
          />
          <div style={{ position: 'relative', zIndex: 50, height: '100%' }}>
            <Sidebar links={links} collapsed={false} onToggle={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Mobile top bar */}
        <div className="md:hidden" style={{
          height:      56,
          display:     'flex',
          alignItems:  'center',
          justifyContent: 'space-between',
          padding:     '0 16px',
          background:  '#fff',
          borderBottom: '1px solid #E5E7EB',
          flexShrink:  0,
        }}>
          <button
            onClick={() => setMobileOpen(true)}
            style={{
              width: 36, height: 36, borderRadius: 10,
              border: 'none', background: 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Menu size={18} />
          </button>
          <span style={{ fontWeight: 900, fontSize: 16, color: '#111827' }}>GLOBRIX</span>
          <div style={{ width: 36 }} />
        </div>

        <main style={{ flex: 1, padding: '24px 32px', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}