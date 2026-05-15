import { useDispatch } from 'react-redux';
import { toggleLogin } from '../../features/auth/authSlice';
import { T } from './tokens';
import { CATEGORY_NAV } from './data';
import { useBreakpoint } from '../../hooks/useBreakpoint';

export default function CategoryNavBar() {
  const dispatch = useDispatch();
  const bp       = useBreakpoint();
  const navH     = bp.isMobile ? 58 : 68;

  return (
    <div style={{
      background: T.w,
      borderBottom: `1.5px solid ${T.bs}`,
      padding: '0',
      position: 'sticky',
      top: navH,
      zIndex: 150,
      boxShadow: '0 2px 12px rgba(28,25,21,.04)',
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        WebkitOverflowScrolling: 'touch',
        paddingLeft: bp.isMobile ? 18 : 56,
        paddingRight: bp.isMobile ? 18 : 56,
      }}>
        {CATEGORY_NAV.map(item => (
          <div
            key={item.label}
            onClick={() => dispatch(toggleLogin(true))}
            style={{
              padding: bp.isMobile ? '12px 14px' : '15px 18px',
              fontSize: bp.isMobile ? 12 : 13,
              fontWeight: item.active ? 600 : 500,
              color: item.active ? T.t : T.mu,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              borderBottom: item.active ? `2.5px solid ${T.t}` : '2.5px solid transparent',
              transition: '.15s',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 13 }}>{item.icon}</span>
            {item.label}
          </div>
        ))}
        <div
          onClick={() => dispatch(toggleLogin(true))}
          style={{
            padding: bp.isMobile ? '12px 14px' : '15px 18px',
            fontSize: bp.isMobile ? 12 : 13,
            fontWeight: 600,
            color: T.t,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            borderBottom: '2.5px solid transparent',
            flexShrink: 0,
          }}
        >
          View all 24 →
        </div>
      </div>
    </div>
  );
}
