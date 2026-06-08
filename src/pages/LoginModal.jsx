import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAuth, toggleLogin } from '../features/auth/authSlice';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';
import { api } from '../services/api';
import OnboardingQuiz from './OnboardingQuiz';

const INPUT = {
  width: '100%', padding: '14px 16px', borderRadius: 10,
  border: '1.5px solid #E0DAD0', background: '#FDF8F2',
  fontSize: 15, color: '#1C1815', fontFamily: "'DM Sans', sans-serif",
  outline: 'none', boxSizing: 'border-box', transition: 'border-color .18s',
};

const ROLES = [
  { value: 'buyer',    label: 'Buyer',    sub: 'I want to source products',  icon: '🛍️' },
  { value: 'supplier', label: 'Supplier', sub: 'I want to sell my products', icon: '🏭' },
];

export default function LoginModal({ onSubmit }) {
  const dispatch = useDispatch();
  const [mode, setMode]       = useState('login');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', name: '', company: '', role: 'buyer' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Forgot-password flow: 'request' (enter email) → 'confirm' (enter PIN + new password)
  const [resetStep, setResetStep]     = useState('request');
  const [pin, setPin]                 = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPwd, setShowNewPwd]   = useState(false);

  const goToForgot = () => { setMode('forgot'); setResetStep('request'); setPin(''); setNewPassword(''); };
  const backToLogin = () => { setMode('login'); setResetStep('request'); setPin(''); setNewPassword(''); };

  const close = () => dispatch(toggleLogin(false));

  const validate = () => {
    if (!form.email)    { toast.error('Email is required');    return false; }
    if (!form.password) { toast.error('Password is required'); return false; }
    if (mode === 'register') {
      if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return false; }
      if (!form.name.trim())        { toast.error('Full name is required');                  return false; }
    }
    return true;
  };

  const handleRequestPin = async () => {
    if (!form.email) { toast.error('Email is required'); return; }
    setLoading(true);
    try {
      await api.forgotPassword({ email: form.email });
      toast.success('If that email is registered, a reset PIN has been sent to it.');
      setResetStep('confirm');
    } catch (err) {
      toast.error(err.message || 'Could not send reset PIN. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReset = async () => {
    if (!pin.trim())            { toast.error('Enter the 6-digit PIN from your email');         return; }
    if (newPassword.length < 8) { toast.error('New password must be at least 8 characters');    return; }
    setLoading(true);
    try {
      await api.resetPassword({ email: form.email, pin: pin.trim(), new_password: newPassword });
      toast.success('Password reset! Sign in with your new password.');
      backToLogin();
      set('password', '');
    } catch (err) {
      toast.error(err.message || 'Could not reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const finalizeAuth = (response, fallbackRole) => {
    const payload       = response?.data || response;
    const token         = payload.token || payload.access_token;
    const refresh_token = payload.refresh_token;
    const user          = payload.user;
    if (!token)         { toast.error('Login failed: no token returned.');         return; }
    if (!refresh_token) { toast.error('Login failed: no refresh token returned.'); return; }
    const userName = user?.name || user?.email?.split('@')[0] || 'Trader';
    const userRole = user?.role || fallbackRole;
    localStorage.setItem('token',         token);
    localStorage.setItem('refresh_token', refresh_token);
    localStorage.setItem('role',          userRole);
    localStorage.setItem('name',          userName);
    dispatch(setAuth({ token, userRole, userName }));
    dispatch(toggleLogin(false));
    onSubmit?.(userRole, userName, token);
    toast.success(`Welcome, ${userName}! 🇮🇳`);
  };

  const registerAndLogin = async (onboardingAnswers) => {
    setLoading(true);
    try {
      await api.register({
        email: form.email,
        password: form.password,
        role: form.role,
        name: form.name.trim(),
        company: form.company.trim(),
        onboarding_answers: onboardingAnswers && Object.keys(onboardingAnswers).length ? onboardingAnswers : undefined,
      });
      toast.success('Account created! Signing you in…');
      const response = await api.login({ email: form.email, password: form.password });
      finalizeAuth(response, form.role);
    } catch (err) {
      toast.error(err.message || 'Authentication failed. Please try again.');
      setMode('register');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'forgot') {
      return resetStep === 'request' ? handleRequestPin() : handleConfirmReset();
    }
    if (!validate()) return;

    if (mode === 'login') {
      setLoading(true);
      try {
        const response = await api.login({ email: form.email, password: form.password });
        finalizeAuth(response, form.role);
      } catch (err) {
        toast.error(err.message || 'Authentication failed. Please try again.');
      } finally {
        setLoading(false);
      }
      return;
    }

    // Register: collect a short MCQ questionnaire (Faire-style) — buyers and suppliers each get a tailored set
    setMode('onboarding');
  };

  return (
    <div
      onClick={e => e.target === e.currentTarget && close()}
      style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(28,24,21,.5)', backdropFilter: 'blur(8px)' }}
    >
      <div style={{ width: '100%', maxWidth: 460, background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 32px 80px rgba(28,24,21,.22)', position: 'relative', animation: 'modalIn .38s cubic-bezier(.22,.68,0,1.2) both' }}>

        {/* Close */}
        <button onClick={close} style={{ position: 'absolute', top: 14, right: 14, width: 30, height: 30, borderRadius: 8, border: '1.5px solid #E8E2D8', background: '#F0E8DA', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
          <X size={14} color="#7A7068" />
        </button>

        <div style={{ padding: '36px 32px 28px' }}>

          {/* Logo — centered */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 22 }}>
            <img src="/logo.png" alt="Globrixa" style={{ height: 72, objectFit: 'contain', display: 'block' }} />
          </div>

          {mode === 'onboarding' ? (
            <OnboardingQuiz
              role={form.role}
              onComplete={(answers) => registerAndLogin(answers)}
              onSkip={() => registerAndLogin(null)}
              onBack={() => setMode('register')}
            />
          ) : (
          <>
          {/* Headline */}
          <div style={{ textAlign: 'center', marginBottom: 26 }}>
            <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 28, fontWeight: 900, color: '#1C1815', letterSpacing: -0.5, lineHeight: 1.2, marginBottom: 10 }}>
              {mode === 'login'
                ? <>Source <span style={{ color: '#C4773A' }}>better,</span><br/>grow together.</>
                : mode === 'register'
                  ? <>Join <span style={{ color: '#C4773A' }}>Globrixa</span> free.</>
                  : <>Reset your <span style={{ color: '#C4773A' }}>password.</span></>}
            </h2>
            <p style={{ fontSize: 14, color: '#7A7068', lineHeight: 1.6 }}>
              {mode === 'login'
                ? 'Sign in to access prices, connect with suppliers, and grow your business.'
                : mode === 'register'
                  ? (form.role === 'supplier'
                      ? 'List your products and reach global buyers across 120+ countries.'
                      : 'Access 50,000+ products from verified Indian manufacturers.')
                  : (resetStep === 'request'
                      ? "Enter your registered email and we'll send a 6-digit PIN to reset your password."
                      : <>Enter the PIN sent to <strong style={{ color: '#1C1815' }}>{form.email}</strong> along with your new password.</>)}
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Role picker — register only */}
            {mode === 'register' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {ROLES.map(r => (
                  <button type="button" key={r.value} onClick={() => set('role', r.value)} style={{ padding: '12px', borderRadius: 12, border: `2px solid ${form.role === r.value ? '#C4773A' : '#E0DAD0'}`, background: form.role === r.value ? '#FDF3EB' : '#fff', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: '.15s' }}>
                    <div style={{ fontSize: 18, marginBottom: 4 }}>{r.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#1C1815' }}>{r.label}</div>
                    <div style={{ fontSize: 11, color: '#8A8178' }}>{r.sub}</div>
                  </button>
                ))}
              </div>
            )}

            {/* Name — register only */}
            {mode === 'register' && (
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#3D3830', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.06em' }}>Full Name</label>
                <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Rajesh Kumar" style={INPUT}
                  onFocus={e => { e.currentTarget.style.borderColor = '#C4773A'; e.currentTarget.style.background = '#fff'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#E0DAD0'; e.currentTarget.style.background = '#FDF8F2'; }} />
              </div>
            )}

            {/* Business email — login & register */}
            {mode !== 'forgot' && (
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#3D3830', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.06em' }}>Business email</label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@company.com" required style={INPUT}
                  onFocus={e => { e.currentTarget.style.borderColor = '#C4773A'; e.currentTarget.style.background = '#fff'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#E0DAD0'; e.currentTarget.style.background = '#FDF8F2'; }} />
              </div>
            )}

            {/* Password — login & register */}
            {mode !== 'forgot' && (
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#3D3830', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.06em' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPwd ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} placeholder="••••••••" required style={{ ...INPUT, paddingRight: 52 }}
                    onFocus={e => { e.currentTarget.style.borderColor = '#C4773A'; e.currentTarget.style.background = '#fff'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = '#E0DAD0'; e.currentTarget.style.background = '#FDF8F2'; }} />
                  <button type="button" onClick={() => setShowPwd(s => !s)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8A8178', fontSize: 12, fontFamily: 'inherit', fontWeight: 600 }}>
                    {showPwd ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
            )}

            {/* Forgot password link — login only */}
            {mode === 'login' && (
              <div style={{ textAlign: 'right', marginTop: -6 }}>
                <button type="button" onClick={goToForgot} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8A8178', fontSize: 12.5, fontWeight: 600, fontFamily: 'inherit', textDecoration: 'underline' }}>
                  Forgot password?
                </button>
              </div>
            )}

            {/* Step 1 — request PIN */}
            {mode === 'forgot' && resetStep === 'request' && (
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#3D3830', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.06em' }}>Registered email</label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@company.com" required style={INPUT}
                  onFocus={e => { e.currentTarget.style.borderColor = '#C4773A'; e.currentTarget.style.background = '#fff'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#E0DAD0'; e.currentTarget.style.background = '#FDF8F2'; }} />
              </div>
            )}

            {/* Step 2 — enter PIN + new password */}
            {mode === 'forgot' && resetStep === 'confirm' && (
              <>
                <div style={{ padding: '10px 14px', borderRadius: 10, background: '#F4EFE6', fontSize: 12.5, color: '#7A7068', lineHeight: 1.6 }}>
                  Wrong email?{' '}
                  <button type="button" onClick={() => setResetStep('request')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C4773A', fontWeight: 700, fontSize: 12.5, fontFamily: 'inherit', textDecoration: 'underline' }}>
                    Use a different one
                  </button>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#3D3830', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.06em' }}>6-digit PIN</label>
                  <input value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="••••••" inputMode="numeric" required
                    style={{ ...INPUT, letterSpacing: '0.4em', fontWeight: 700, textAlign: 'center' }}
                    onFocus={e => { e.currentTarget.style.borderColor = '#C4773A'; e.currentTarget.style.background = '#fff'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = '#E0DAD0'; e.currentTarget.style.background = '#FDF8F2'; }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#3D3830', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.06em' }}>New password</label>
                  <div style={{ position: 'relative' }}>
                    <input type={showNewPwd ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" required style={{ ...INPUT, paddingRight: 52 }}
                      onFocus={e => { e.currentTarget.style.borderColor = '#C4773A'; e.currentTarget.style.background = '#fff'; }}
                      onBlur={e => { e.currentTarget.style.borderColor = '#E0DAD0'; e.currentTarget.style.background = '#FDF8F2'; }} />
                    <button type="button" onClick={() => setShowNewPwd(s => !s)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8A8178', fontSize: 12, fontFamily: 'inherit', fontWeight: 600 }}>
                      {showNewPwd ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading}
              style={{ marginTop: 4, width: '100%', padding: '15px', borderRadius: 10, border: 'none', background: loading ? '#C8C0B4' : '#1C1815', color: '#fff', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'background .18s' }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#3D3730'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#1C1815'; }}
            >
              {loading
                ? 'Please wait…'
                : mode !== 'forgot'
                  ? 'Continue'
                  : resetStep === 'request' ? 'Send reset PIN' : 'Reset password'}
            </button>
          </form>

          {/* Terms */}
          <p style={{ fontSize: 11, color: '#B0A898', textAlign: 'center', marginTop: 18, lineHeight: 1.65 }}>
            By continuing, you agree to our{' '}
            <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Terms of Service</span>
            {' '}and{' '}
            <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Privacy Policy</span>.
          </p>
          </>
          )}
        </div>

        {/* Footer toggle */}
        {mode !== 'onboarding' && (
        <div style={{ background: '#FBF6F0', borderTop: '1px solid #EDE8DF', padding: '18px 32px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {mode === 'login' ? (
            <>
              <p style={{ fontSize: 13, color: '#7A7068', textAlign: 'center', margin: 0 }}>
                New to Globrixa?{' '}
                <button
                  onClick={() => { setMode('register'); set('role', 'buyer'); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1C1815', fontWeight: 700, fontSize: 13, fontFamily: 'inherit', textDecoration: 'underline' }}
                >
                  Create an account
                </button>
              </p>
              <p style={{ fontSize: 13, color: '#7A7068', textAlign: 'center', margin: 0 }}>
                Are you a supplier?{' '}
                <button
                  onClick={() => { setMode('register'); set('role', 'supplier'); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1C1815', fontWeight: 700, fontSize: 13, fontFamily: 'inherit', textDecoration: 'underline' }}
                >
                  Join as a brand
                </button>
              </p>
            </>
          ) : mode === 'register' ? (
            <p style={{ fontSize: 13, color: '#7A7068', textAlign: 'center', margin: 0 }}>
              Already have an account?{' '}
              <button onClick={() => setMode('login')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1C1815', fontWeight: 700, fontSize: 13, fontFamily: 'inherit', textDecoration: 'underline' }}>
                Sign in
              </button>
            </p>
          ) : (
            <p style={{ fontSize: 13, color: '#7A7068', textAlign: 'center', margin: 0 }}>
              Remembered your password?{' '}
              <button onClick={backToLogin} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1C1815', fontWeight: 700, fontSize: 13, fontFamily: 'inherit', textDecoration: 'underline' }}>
                Back to sign in
              </button>
            </p>
          )}
        </div>
        )}
      </div>

      <style>{`@keyframes modalIn{from{opacity:0;transform:translateY(20px) scale(.97)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}
