import { Loader2, TrendingUp, TrendingDown } from 'lucide-react';
import { statusLabel } from '../utils/helpers';

const C = {
  saffron:    '#D9600A', saffronLt: '#FDF1E8',
  emerald:    '#1A7A4A', emeraldLt: '#EAF5EF',
  navy:       '#1B3175', navyLt:    '#EEF2FB',
  gold:       '#B8730A', goldLt:    '#FDF5E2',
  ink:        '#1C1815', inkSoft:   '#3D3731',
  muted:      '#7A7068', borderSoft:'#E6DED0',
  cream:      '#F4EFE4',
};

/* ── Spinner ─────────────────────────────────────────────────────────────── */
export function Spinner({ size = 22 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 0' }}>
      <Loader2 size={size} style={{ color: C.saffron, animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ── Badge ───────────────────────────────────────────────────────────────── */
const BADGE_MAP = {
  active:        { bg: '#EAF5EF', color: '#1A7A4A' },
  confirmed:     { bg: '#EAF5EF', color: '#1A7A4A' },
  delivered:     { bg: '#EAF5EF', color: '#1A7A4A' },
  approved:      { bg: '#EAF5EF', color: '#1A7A4A' },
  accepted:      { bg: '#EAF5EF', color: '#1A7A4A' },
  verified:      { bg: '#EAF5EF', color: '#1A7A4A' },
  pending:       { bg: '#FDF5E2', color: '#B8730A' },
  in_production: { bg: '#EEF2FB', color: '#1B3175' },
  shipped:       { bg: '#EEF2FB', color: '#1B3175' },
  quoted:        { bg: '#EEF2FB', color: '#1B3175' },
  under_review:  { bg: '#EEF2FB', color: '#1B3175' },
  draft:         { bg: '#F4EFE4', color: '#7A7068' },
  inactive:      { bg: '#F4EFE4', color: '#7A7068' },
  closed:        { bg: '#F4EFE4', color: '#7A7068' },
  rejected:      { bg: '#FEF2F2', color: '#DC2626' },
  cancelled:     { bg: '#FEF2F2', color: '#DC2626' },
  suspended:     { bg: '#FEF2F2', color: '#DC2626' },
};

export function Badge({ status, text }) {
  const s = BADGE_MAP[status] || { bg: '#F4EFE4', color: '#7A7068' };
  const label = text || statusLabel(status);
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: 10, fontWeight: 700, padding: '4px 11px', borderRadius: 100,
      background: s.bg, color: s.color,
      letterSpacing: '0.04em', whiteSpace: 'nowrap', textTransform: 'capitalize',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
      {label}
    </span>
  );
}

/* ── StatCard ────────────────────────────────────────────────────────────── */
export function StatCard({ icon: Icon, label, value, color = C.saffron, bg = C.saffronLt, trend }) {
  const up = trend > 0;
  return (
    <div className="stat-card" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: `${color}0D`, pointerEvents: 'none' }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ width: 46, height: 46, borderRadius: 13, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={21} color={color} />
        </div>
        {trend !== undefined && trend !== null && (
          <span style={{
            display: 'flex', alignItems: 'center', gap: 3,
            fontSize: 11, fontWeight: 700,
            color: up ? C.emerald : '#DC2626',
            background: up ? C.emeraldLt : '#FEF2F2',
            padding: '3px 9px', borderRadius: 100,
          }}>
            {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {up ? '+' : ''}{trend}%
          </span>
        )}
      </div>

      <div style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: 32, fontWeight: 900, color: C.ink,
        lineHeight: 1, marginBottom: 6, letterSpacing: '-0.5px',
      }}>
        {value}
      </div>
      <div style={{ fontSize: 12, fontWeight: 500, color: C.muted }}>{label}</div>
    </div>
  );
}

/* ── EmptyState ──────────────────────────────────────────────────────────── */
export function EmptyState({ icon: Icon, title, desc, action }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '64px 28px', textAlign: 'center',
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>
      <div style={{
        width: 68, height: 68, borderRadius: 20, background: C.saffronLt,
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20,
      }}>
        <Icon size={30} color={C.saffron} />
      </div>
      <h3 style={{
        fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 800,
        color: C.ink, marginBottom: 10, letterSpacing: '-0.3px',
      }}>
        {title}
      </h3>
      <p style={{ fontSize: 13, color: C.muted, marginBottom: 24, maxWidth: 290, lineHeight: 1.65 }}>{desc}</p>
      {action}
    </div>
  );
}

/* ── PageHeader ──────────────────────────────────────────────────────────── */
export function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
      flexWrap: 'wrap', gap: 16, marginBottom: 32,
      paddingBottom: 22, borderBottom: `1px solid ${C.borderSoft}`,
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>
      <div>
        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 27, fontWeight: 900, color: C.ink,
          margin: 0, letterSpacing: '-0.5px',
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: 13, color: C.muted, marginTop: 6, lineHeight: 1.6 }}>{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}

/* ── InputField ──────────────────────────────────────────────────────────── */
export function InputField({ label, error, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {label && (
        <label style={{
          fontSize: 11, fontWeight: 700, color: C.inkSoft,
          textTransform: 'uppercase', letterSpacing: '0.07em',
        }}>
          {label}
        </label>
      )}
      <input
        style={{
          width: '100%', padding: '11px 14px', borderRadius: 12,
          border: `1.5px solid ${error ? '#DC2626' : C.borderSoft}`,
          background: C.cream, fontFamily: "'DM Sans', sans-serif",
          fontSize: 14, color: C.ink, outline: 'none',
          transition: 'border-color 0.15s, background 0.15s',
        }}
        onFocus={e => { e.currentTarget.style.borderColor = C.saffron; e.currentTarget.style.background = '#fff'; }}
        onBlur={e => { e.currentTarget.style.borderColor = error ? '#DC2626' : C.borderSoft; e.currentTarget.style.background = C.cream; }}
        {...props}
      />
      {error && <span style={{ fontSize: 11, color: '#DC2626' }}>{error}</span>}
    </div>
  );
}

/* ── SelectField ─────────────────────────────────────────────────────────── */
export function SelectField({ label, options = [], error, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {label && (
        <label style={{
          fontSize: 11, fontWeight: 700, color: C.inkSoft,
          textTransform: 'uppercase', letterSpacing: '0.07em',
        }}>
          {label}
        </label>
      )}
      <select
        style={{
          width: '100%', padding: '11px 14px', borderRadius: 12,
          border: `1.5px solid ${error ? '#DC2626' : C.borderSoft}`,
          background: C.cream, fontFamily: "'DM Sans', sans-serif",
          fontSize: 14, color: C.ink, outline: 'none', cursor: 'pointer',
          transition: 'border-color 0.15s',
        }}
        onFocus={e => { e.currentTarget.style.borderColor = C.saffron; }}
        onBlur={e => { e.currentTarget.style.borderColor = error ? '#DC2626' : C.borderSoft; }}
        {...props}
      >
        {options.map(({ value, label: lbl }) => (
          <option key={value} value={value}>{lbl}</option>
        ))}
      </select>
      {error && <span style={{ fontSize: 11, color: '#DC2626' }}>{error}</span>}
    </div>
  );
}
