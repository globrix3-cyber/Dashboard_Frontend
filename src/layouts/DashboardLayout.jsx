import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, toggleLogin } from '../features/auth/authSlice';
import { disconnectSocket } from '../services/socket';
import {
  LayoutDashboard, FileText, Package, ShoppingBag,
  Send, FileSearch, LogOut, User,
  Menu, Users, Building2, ShieldCheck, BarChart2, Settings,
  MessageSquare, Grid3X3, ScrollText,
} from 'lucide-react';
import { useState } from 'react';

/* ── CSS variables injected once into :root ────────────────────────────────── */
const CSS_VARS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,600&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  :root {
    --cream:        #F0E8DA;
    --cream-mid:    #E8DFCF;
    --cream-deep:   #DEDAD0;
    --warm-white:   #FDF8F2;
    --saffron:      #C4773A;
    --saffron-lt:   #FDF1E8;
    --emerald:      #1A7A4A;
    --emerald-lt:   #EAF5EF;
    --navy:         #1B3175;
    --navy-lt:      #EEF2FB;
    --gold:         #B8730A;
    --gold-lt:      #FDF5E2;
    --ink:          #1C1815;
    --ink-soft:     #3D3731;
    --muted:        #7A7068;
    --border:       #D4C9B8;
    --border-soft:  #E6DED0;
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
  { path: '/buyer-dashboard',              icon: LayoutDashboard, label: 'Overview'   },
  { path: '/buyer-dashboard/rfqs',         icon: FileText,        label: 'My RFQs'    },
  { path: '/buyer-dashboard/contracts',    icon: ScrollText,      label: 'Contracts'  },
  { path: '/buyer-dashboard/orders',       icon: Package,         label: 'My Orders'  },
  { path: '/buyer-dashboard/messages',     icon: MessageSquare,   label: 'Messages'   },
  { path: '/categories',                   icon: Grid3X3,         label: 'Categories' },
  { path: '/products',                     icon: ShoppingBag,     label: 'Browse'     },
  { path: '/edit-profile',                 icon: User,            label: 'Profile'    },
];

const supplierLinks = [
  { path: '/supplier-dashboard',              icon: LayoutDashboard, label: 'Overview'   },
  { path: '/supplier-dashboard/rfqs',         icon: FileSearch,      label: 'Open RFQs'  },
  { path: '/supplier-dashboard/quotes',       icon: Send,            label: 'My Quotes'  },
  { path: '/supplier-dashboard/contracts',    icon: ScrollText,      label: 'Contracts'  },
  { path: '/supplier-dashboard/orders',       icon: Package,         label: 'Orders'     },
  { path: '/supplier-dashboard/messages',     icon: MessageSquare,   label: 'Messages'   },
  { path: '/categories',                      icon: Grid3X3,         label: 'Categories' },
  { path: '/supplier-dashboard/catalog',      icon: ShoppingBag,     label: 'Catalog'    },
  { path: '/edit-profile',                    icon: User,            label: 'Profile'    },
];

const adminLinks = [
  { path: '/admin-dashboard',               icon: LayoutDashboard, label: 'Overview'      },
  { path: '/admin-dashboard/users',         icon: Users,           label: 'Users'         },
  { path: '/admin-dashboard/companies',     icon: Building2,       label: 'Companies'     },
  { path: '/admin-dashboard/products',      icon: ShoppingBag,     label: 'Products'      },
  { path: '/admin-dashboard/verifications', icon: ShieldCheck,     label: 'Verifications' },
  { path: '/admin-dashboard/messages',      icon: MessageSquare,   label: 'Messages'      },
  { path: '/admin-dashboard/reports',       icon: BarChart2,       label: 'Reports'       },
  { path: '/admin-dashboard/settings',      icon: Settings,        label: 'Settings'      },
  { path: '/edit-profile',                  icon: User,            label: 'Profile'       },
];

/* ── Sidebar ────────────────────────────────────────────────────────────────── */
function Sidebar({ links, onMobileClose }) {
  const navigate               = useNavigate();
  const location               = useLocation();
  const dispatch               = useDispatch();
  const { userName, userRole } = useSelector((s) => s.auth);

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logout());
    disconnectSocket();
    dispatch(toggleLogin(true));
    navigate('/');
  };

  const accent = userRole === 'supplier' ? '#1A7A4A' : userRole === 'admin' ? '#1B3175' : '#C4773A';

  return (
    <aside style={{
      width: 64, minWidth: 64,
      height: '100vh',
      position: 'sticky', top: 0,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      background: '#1C1815',
      borderRight: '1px solid rgba(255,255,255,.06)',
      paddingBottom: 12,
      zIndex: 10,
    }}>
      {/* Logo mark */}
      <div style={{
        width: 64, height: 64, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderBottom: '1px solid rgba(255,255,255,.06)',
        marginBottom: 8,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 16, fontWeight: 700, color: '#fff',
          letterSpacing: '-.5px',
        }}>G</div>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, width: '100%', padding: '0 8px' }}>
        {links.map(({ path, icon: Icon, label }) => {
          const active =
            location.pathname === path ||
            (path !== '/products' && path !== '/edit-profile' && path !== '/categories' &&
             location.pathname.startsWith(path));
          return (
            <button
              key={path}
              onClick={() => { navigate(path); onMobileClose?.(); }}
              title={label}
              style={{
                width: 40, height: 40, borderRadius: 10,
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: active ? `${accent}33` : 'transparent',
                color: active ? accent : 'rgba(255,255,255,.38)',
                transition: 'background .15s, color .15s',
                flexShrink: 0,
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,.08)'; e.currentTarget.style.color = 'rgba(255,255,255,.75)'; }}}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,.38)'; }}}
            >
              <Icon size={17} />
            </button>
          );
        })}
      </nav>

      {/* Bottom: logout + avatar */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '8px 0 0' }}>
        <button
          onClick={handleLogout}
          title="Log out"
          style={{
            width: 40, height: 40, borderRadius: 10,
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'transparent', color: 'rgba(255,255,255,.3)',
            transition: 'background .15s, color .15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,.18)'; e.currentTarget.style.color = '#F87171'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,.3)'; }}
        >
          <LogOut size={15} />
        </button>
        <div
          title={userName}
          style={{
            width: 30, height: 30, borderRadius: '50%',
            background: `linear-gradient(135deg, ${accent}, ${accent}99)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, color: '#fff',
            cursor: 'default',
          }}
        >
          {userName?.[0]?.toUpperCase()}
        </div>
      </div>
    </aside>
  );
}

/* ── DashboardLayout ────────────────────────────────────────────────────────── */
export default function DashboardLayout({ children }) {
  const { userRole }                = useSelector((s) => s.auth);
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = userRole === 'supplier' ? supplierLinks : userRole === 'admin' ? adminLinks : buyerLinks;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fff' }}>

      {/* Desktop sidebar */}
      <div className="hidden md:block" style={{ flexShrink: 0 }}>
        <Sidebar links={links} />
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 40, display: 'flex' }} className="md:hidden">
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.5)' }} onClick={() => setMobileOpen(false)} />
          <div style={{ position: 'relative', zIndex: 50, height: '100%' }}>
            <Sidebar links={links} onMobileClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Mobile top bar */}
        <div className="md:hidden" style={{
          height: 56, display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '0 16px',
          background: '#fff', borderBottom: '1px solid #F0EAE0', flexShrink: 0,
        }}>
          <button
            onClick={() => setMobileOpen(true)}
            style={{ width: 36, height: 36, borderRadius: 10, border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <Menu size={18} />
          </button>
          <img src="/logo.png" alt="Globrixa" style={{ height: 32, width: 'auto', objectFit: 'contain' }} />
          <div style={{ width: 36 }} />
        </div>

        <main style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}