import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuth } from '../features/auth/authSlice';
import { api } from '../services/api';
import { toast } from 'react-toastify';
import { Save, User, Mail, Phone } from 'lucide-react';

const C = {
  saffron: '#D9600A', saffronLt: '#FDF1E8',
  emerald: '#1A7A4A', navy: '#1B3175',
  ink: '#1C1815', inkSoft: '#3D3731',
  muted: '#7A7068', borderSoft: '#E6DED0', cream: '#F4EFE4',
};

function Field({ label, icon: Icon, readOnly, ...props }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: C.inkSoft, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 7 }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        {Icon && <Icon size={14} color={C.muted} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />}
        <input readOnly={readOnly} {...props} style={{
          width: '100%', padding: Icon ? '12px 14px 12px 40px' : '12px 14px',
          borderRadius: 12, border: `1.5px solid ${C.borderSoft}`,
          background: readOnly ? '#F0EDE8' : C.cream,
          fontFamily: "'DM Sans', sans-serif", fontSize: 14,
          color: readOnly ? C.muted : C.ink,
          outline: 'none', transition: 'border-color 0.15s, background 0.15s',
          boxSizing: 'border-box', cursor: readOnly ? 'not-allowed' : 'text',
        }}
          onFocus={e => { if (!readOnly) { e.currentTarget.style.borderColor = C.saffron; e.currentTarget.style.background = '#fff'; } }}
          onBlur={e => { e.currentTarget.style.borderColor = C.borderSoft; e.currentTarget.style.background = readOnly ? '#F0EDE8' : C.cream; }}
        />
      </div>
    </div>
  );
}

export default function EditProfile() {
  const dispatch = useDispatch();
  const { userName, userRole, token } = useSelector(s => s.auth);
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '', phone_number: '' });

  useEffect(() => {
    api.getMe()
      .then(p => setForm({ full_name: p.full_name || userName || '', email: p.email || '', phone_number: p.phone_number || '' }))
      .catch(() => setForm(f => ({ ...f, full_name: userName || '' })))
      .finally(() => setFetching(false));
  }, [userName]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name.trim()) { toast.error('Full name is required'); return; }
    setSaving(true);
    try {
      await api.updateMe({ full_name: form.full_name.trim(), phone_number: form.phone_number || null });
      dispatch(setAuth({ userRole, userName: form.full_name.trim(), token }));
      localStorage.setItem('name', form.full_name.trim());
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const roleColor = userRole === 'supplier' ? C.emerald : userRole === 'admin' ? C.navy : C.saffron;
  const initials = (form.full_name || userName || '?')[0].toUpperCase();

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", maxWidth: 560, margin: '0 auto' }}>
      <div style={{ marginBottom: 32, paddingBottom: 22, borderBottom: `1px solid ${C.borderSoft}` }}>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 27, fontWeight: 900, color: C.ink, margin: 0, letterSpacing: '-0.4px' }}>Edit Profile</h1>
        <p style={{ fontSize: 13, color: C.muted, marginTop: 6 }}>Update your account information</p>
      </div>

      <div style={{ background: '#fff', borderRadius: 20, border: `1.5px solid ${C.borderSoft}`, overflow: 'hidden', boxShadow: '0 2px 8px rgba(28,24,21,0.06)' }}>
        <div style={{ display: 'flex', height: 3 }}>
          <div style={{ flex: 1, background: C.saffron }} />
          <div style={{ flex: 1, background: '#fff', borderTop: `0.5px solid ${C.borderSoft}`, borderBottom: `0.5px solid ${C.borderSoft}` }} />
          <div style={{ flex: 1, background: C.emerald }} />
        </div>
        <div style={{ padding: '32px 36px' }}>
          {/* Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 36, paddingBottom: 28, borderBottom: `1px solid ${C.borderSoft}` }}>
            <div style={{
              width: 76, height: 76, borderRadius: 20, flexShrink: 0,
              background: `linear-gradient(135deg, ${roleColor}, ${roleColor}cc)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 30, fontFamily: "'Playfair Display', serif", fontWeight: 900,
              boxShadow: `0 6px 20px ${roleColor}30`,
            }}>
              {fetching ? <User size={28} /> : initials}
            </div>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 800, color: C.ink }}>{form.full_name || userName || '—'}</div>
              <div style={{ fontSize: 12, color: roleColor, fontWeight: 600, textTransform: 'capitalize', marginTop: 4 }}>{userRole}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{form.email}</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <Field label="Full Name *"  icon={User}  value={form.full_name}    onChange={e => set('full_name', e.target.value)}    placeholder="Rajesh Kumar" />
            <Field label="Email"        icon={Mail}  value={form.email}        readOnly placeholder="you@company.com" />
            <Field label="Phone Number" icon={Phone} value={form.phone_number} onChange={e => set('phone_number', e.target.value)} placeholder="+91 98765 43210" />
            <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.borderSoft}, transparent)`, margin: '2px 0' }} />
            <button type="submit" disabled={saving || fetching} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
              padding: '13px 0', borderRadius: 100, border: 'none',
              cursor: (saving || fetching) ? 'not-allowed' : 'pointer',
              background: C.saffron, color: '#fff',
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14,
              opacity: (saving || fetching) ? 0.65 : 1,
              boxShadow: '0 4px 16px rgba(217,96,10,0.30)', transition: 'background 0.18s, transform 0.12s',
            }}
              onMouseEnter={e => { if (!saving) { e.currentTarget.style.background = '#BF530A'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
              onMouseLeave={e => { e.currentTarget.style.background = C.saffron; e.currentTarget.style.transform = 'none'; }}>
              {saving ? <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.35)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> : <Save size={16} />}
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
