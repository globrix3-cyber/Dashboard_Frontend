import { Loader2 } from 'lucide-react';
import { statusColor, statusLabel } from '../utils/helpers';

// ── Spinner ──────────────────────────────────────────────────────────────────
export function Spinner({ size = 24 }) {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 size={size} className="animate-spin" style={{ color: '#FF6B00' }} />
    </div>
  );
}

// ── Badge ────────────────────────────────────────────────────────────────────
export function Badge({ status, text }) {
  const cls = statusColor(status);
  return <span className={`badge ${cls}`}>{text || statusLabel(status)}</span>;
}

// ── StatCard ─────────────────────────────────────────────────────────────────
export function StatCard({ icon: Icon, label, value, color = '#FF6B00', bg = '#FFF7ED', trend }) {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: bg }}>
          <Icon size={22} style={{ color }} />
        </div>
        {trend && (
          <span className="text-xs font-semibold px-2 py-1 rounded-lg"
            style={{ background: trend > 0 ? '#ECFDF5' : '#FEF2F2', color: trend > 0 ? '#059669' : '#DC2626' }}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div className="text-2xl font-black text-gray-900 mb-1 font-mono">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}

// ── EmptyState ───────────────────────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, desc, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: '#FFF7ED' }}>
        <Icon size={28} style={{ color: '#FF6B00' }} />
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm mb-6 max-w-xs">{desc}</p>
      {action}
    </div>
  );
}

// ── PageHeader ────────────────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="text-2xl font-black text-gray-900">{title}</h1>
        {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ── InputField ────────────────────────────────────────────────────────────────
export function InputField({ label, error, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-semibold text-gray-700">{label}</label>}
      <input
        className="w-full px-4 py-3 rounded-xl border text-sm"
        style={{ borderColor: error ? '#DC2626' : '#E5E7EB', background: '#FAFAFA' }}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

// ── SelectField ───────────────────────────────────────────────────────────────
export function SelectField({ label, options = [], error, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-semibold text-gray-700">{label}</label>}
      <select
        className="w-full px-4 py-3 rounded-xl border text-sm bg-gray-50"
        style={{ borderColor: error ? '#DC2626' : '#E5E7EB' }}
        {...props}
      >
        {options.map(({ value, label: lbl }) => (
          <option key={value} value={value}>{lbl}</option>
        ))}
      </select>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}