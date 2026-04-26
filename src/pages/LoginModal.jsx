import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAuth, toggleLogin } from '../features/auth/authSlice';
import { toast } from 'react-toastify';
import {
  Globe, X, Eye, EyeOff, ShieldCheck,
  Building2, ArrowRight,
} from 'lucide-react';

import { api } from '../services/api';

/* ── Ornamental star divider ─────────────────────────────────────────────── */
function OrnaDiv() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginBottom: 8 }}>
      <div style={{ height: 1, width: 28, background: 'linear-gradient(90deg, transparent, var(--saffron))' }} />
      <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
        <path d="M8 0L9.2 6.1L15.3 7.3L9.2 8.5L8 14.6L6.8 8.5L.7 7.3L6.8 6.1Z" fill="var(--saffron)" opacity=".65" />
      </svg>
      <div style={{ height: 1, width: 28, background: 'linear-gradient(90deg, var(--saffron), transparent)' }} />
    </div>
  );
}

/* ── Indian tricolor bar ─────────────────────────────────────────────────── */
function TriBar() {
  return (
    <div style={{ display: 'flex', height: 4 }}>
      <div style={{ flex: 1, background: 'var(--saffron)' }} />
      <div style={{ flex: 1, background: '#fff', borderTop: '0.5px solid var(--border-soft)', borderBottom: '0.5px solid var(--border-soft)' }} />
      <div style={{ flex: 1, background: 'var(--emerald)' }} />
    </div>
  );
}

const ROLES = [
  { value: 'buyer',    label: 'Buyer',    desc: 'Source products globally', icon: '🛒' },
  { value: 'supplier', label: 'Supplier', desc: 'Sell to global buyers',    icon: '🏭' },
];

export default function LoginModal({ onSubmit }) {
  const dispatch  = useDispatch();
  const [tab,     setTab]     = useState('login');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const [form, setForm] = useState({
    email:    '',
    password: '',
    role:     'buyer',
    name:     '',
    company:  '',
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  /* ── Client-side validation ─────────────────────────────────────────────── */
  const validate = () => {
    if (!form.email)    { toast.error('Email is required');    return false; }
    if (!form.password) { toast.error('Password is required'); return false; }
    if (tab === 'register') {
      if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return false; }
      if (!form.role)                { toast.error('Please select a role');                   return false; }
      if (!form.name.trim())         { toast.error('Full name is required');                  return false; }
    }
    return true;
  };

  /* ── Submit ─────────────────────────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      let response;

      if (tab === 'login') {
        response = await api.login({ email: form.email, password: form.password });
      } else {
        // Register first
        const registerData = await api.register({
          email:    form.email,
          password: form.password,
          role:     form.role,
          name:     form.name.trim(),
          company:  form.company.trim(),
        });

        toast.success('Account created successfully! Logging you in...');

        // Auto-login after successful registration
        response = await api.login({ 
          email: form.email, 
          password: form.password 
        });
      }

      // ── Robust response parsing (supports token or access_token) ─────────────
      console.log('[LoginModal] raw auth response:', response);

      // Handle both direct response and possible { data: {...} } wrapper
      const payload = response?.data || response;

      const token         = payload.token || payload.access_token;
      const refresh_token = payload.refresh_token;
      const user          = payload.user;

      if (!token) {
        console.error('[LoginModal] token missing from response. Full payload:', payload);
        toast.error('Login failed: Server did not return authentication token.');
        return;
      }

      if (!refresh_token) {
        console.error('[LoginModal] refresh_token missing from response. Full payload:', payload);
        toast.error('Login failed: Server did not return refresh token.');
        return;
      }

      if (!user) {
        console.warn('[LoginModal] user data missing from response');
      }

      const userName = user?.name || user?.email?.split('@')[0] || 'Trader';
      const userRole = user?.role || form.role;

      // Save to localStorage
      localStorage.setItem('token',         token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('role',          userRole);
      localStorage.setItem('name',          userName);

      // Update Redux store
      dispatch(setAuth({ token, userRole, userName }));
      dispatch(toggleLogin(false));

      onSubmit?.(userRole, userName, token);

      toast.success(`Welcome, ${userName}! 🇮🇳`);

    } catch (err) {
      console.error('Auth error:', err);
      toast.error(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Shared input style ─────────────────────────────────────────────────── */
  const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: 12,
    border: '1.5px solid var(--border-soft)', background: 'var(--warm-white)',
    fontSize: 14, color: 'var(--ink)', fontFamily: "'DM Sans', sans-serif",
    outline: 'none', transition: 'border-color .18s, background .18s',
  };

  const inputFocus = (e) => {
    e.currentTarget.style.borderColor = 'var(--saffron)';
    e.currentTarget.style.background  = '#fff';
  };

  const inputBlur = (e) => {
    e.currentTarget.style.borderColor = 'var(--border-soft)';
    e.currentTarget.style.background  = 'var(--warm-white)';
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        background: 'rgba(28,24,21,0.55)', backdropFilter: 'blur(10px)',
      }}
      onClick={(e) => e.target === e.currentTarget && dispatch(toggleLogin(false))}
    >
      <div
        style={{
          width: '100%', maxWidth: 440, background: '#fff',
          borderRadius: 28, overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(28,24,21,.22), 0 4px 20px rgba(28,24,21,.08)',
          border: '1.5px solid var(--border-soft)',
          animation: 'gxFadeUp 0.45s cubic-bezier(.22,.68,0,1.2) both',
          position: 'relative',
        }}
      >
        {/* Mandala watermark */}
        <div
          style={{
            position: 'absolute', inset: 0, opacity: .12, pointerEvents: 'none', zIndex: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='46' fill='none' stroke='%23D9600A' stroke-width='.35' stroke-dasharray='3 7'/%3E%3Ccircle cx='50' cy='50' r='32' fill='none' stroke='%231A7A4A' stroke-width='.28' stroke-dasharray='2 5'/%3E%3Ccircle cx='50' cy='50' r='18' fill='none' stroke='%231B3175' stroke-width='.25' stroke-dasharray='2 4'/%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px',
          }}
        />

        <TriBar />

        {/* Close button */}
        <button
          onClick={() => dispatch(toggleLogin(false))}
          style={{
            position: 'absolute', top: 14, right: 14, zIndex: 2,
            width: 30, height: 30, borderRadius: 9, border: 'none',
            background: 'var(--cream)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background .15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--cream-mid)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--cream)'; }}
        >
          <X size={14} color="var(--muted)" />
        </button>

        {/* Body */}
        <div style={{ padding: '28px 32px 32px', position: 'relative', zIndex: 1 }}>

          {/* Logo row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, background: 'var(--saffron)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(217,96,10,.32)', flexShrink: 0,
            }}>
              <Globe size={16} color="#fff" />
            </div>
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, fontWeight: 900, color: 'var(--ink)', letterSpacing: -.5 }}>
              Globrixa
            </span>
            <span style={{
              fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 100,
              background: 'var(--saffron-lt)', color: 'var(--saffron)', letterSpacing: '.1em',
            }}>B2B</span>
          </div>

          {/* Headline */}
          <div style={{ marginBottom: 22 }}>
            <OrnaDiv />
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 900, color: 'var(--ink)', letterSpacing: -.6, lineHeight: 1.15 }}>
              Welcome to{' '}
              <span style={{
                background: 'linear-gradient(120deg, var(--saffron) 0%, var(--gold) 50%, var(--emerald) 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>Bharat's</span><br />
              Trade Platform
            </h2>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 5, lineHeight: 1.6 }}>
              India's premier B2B marketplace — GST-verified, AI-powered
            </p>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', background: 'var(--cream)', borderRadius: 14, padding: 4, marginBottom: 22 }}>
            {[['login', 'Sign In'], ['register', 'Join Free']].map(([t, lbl]) => (
              <button key={t} onClick={() => setTab(t)}
                style={{
                  flex: 1, padding: '8px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
                  fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
                  transition: 'all .22s ease',
                  ...(tab === t
                    ? { background: '#fff', color: 'var(--saffron)', boxShadow: '0 2px 10px rgba(28,24,21,.09)' }
                    : { background: 'transparent', color: 'var(--muted)' }),
                }}>
                {lbl}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

            {/* Role selector — register only */}
            {tab === 'register' && (
              <div style={{ marginBottom: 18 }}>
                <span style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 9 }}>
                  I am a
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {ROLES.map(({ value, label, desc, icon }) => (
                    <button type="button" key={value} onClick={() => set('role', value)}
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                        padding: '12px 13px', borderRadius: 16, cursor: 'pointer', textAlign: 'left',
                        fontFamily: "'DM Sans', sans-serif",
                        transition: 'all .2s ease',
                        ...(form.role === value
                          ? { border: '2px solid var(--saffron)', background: 'var(--saffron-lt)' }
                          : { border: '2px solid var(--border-soft)', background: '#fff' }),
                      }}>
                      <span style={{ fontSize: 20, marginBottom: 4, lineHeight: 1 }}>{icon}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>{label}</span>
                      <span style={{ fontSize: 11, color: 'var(--muted)', marginTop: 1 }}>{desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Name — register only */}
            {tab === 'register' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 14 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)' }}>Full Name</label>
                <input
                  value={form.name} onChange={e => set('name', e.target.value)}
                  placeholder="Rajesh Kumar" required
                  style={inputStyle} onFocus={inputFocus} onBlur={inputBlur}
                />
              </div>
            )}

            {/* Company — register only */}
            {tab === 'register' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 14 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)' }}>Company Name</label>
                <div style={{ position: 'relative' }}>
                  <Building2 size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', pointerEvents: 'none' }} />
                  <input
                    value={form.company} onChange={e => set('company', e.target.value)}
                    placeholder="Acme Exports Pvt. Ltd."
                    style={{ ...inputStyle, paddingLeft: 38 }} onFocus={inputFocus} onBlur={inputBlur}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)' }}>Email</label>
              <input
                type="email" value={form.email} onChange={e => set('email', e.target.value)}
                placeholder="you@company.com" required
                style={inputStyle} onFocus={inputFocus} onBlur={inputBlur}
              />
            </div>

            {/* Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPwd ? 'text' : 'password'} value={form.password}
                  onChange={e => set('password', e.target.value)}
                  placeholder="••••••••" required
                  style={{ ...inputStyle, paddingRight: 42 }} onFocus={inputFocus} onBlur={inputBlur}
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: 2, transition: 'color .15s' }}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              style={{
                marginTop: 20, width: '100%', padding: '14px 0', borderRadius: 100, border: 'none',
                fontSize: 15, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
                background: 'var(--saffron)', color: '#fff', cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: '0 6px 24px rgba(217,96,10,.35)',
                opacity: loading ? 0.75 : 1,
                transition: 'background .2s, transform .15s',
                animation: 'gxPulse 2.8s ease infinite',
              }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = '#BF530A'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--saffron)'; e.currentTarget.style.transform = 'none'; }}
            >
              {loading
                ? <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,.35)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                : <ArrowRight size={15} />
              }
              {loading ? 'Please wait…' : tab === 'login' ? 'Sign In' : 'Create Free Account'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, var(--border), transparent)', margin: '20px 0 16px' }} />

          {/* Trust row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--muted)', fontWeight: 500 }}>
              <ShieldCheck size={13} color="#10B981" /> Verified & Secure
            </div>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 12, color: 'var(--saffron)', fontStyle: 'italic' }}>
              भारत का विश्वसनीय मंच
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--muted)', fontWeight: 500 }}>
              <span style={{ fontSize: 14 }}>🇮🇳</span> Made in India
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes gxFadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes gxPulse  { 0%{box-shadow:0 0 0 0 rgba(217,96,10,.32);} 70%{box-shadow:0 0 0 10px rgba(217,96,10,0);} 100%{box-shadow:0 0 0 0 rgba(217,96,10,0);} }
        @keyframes spin     { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}