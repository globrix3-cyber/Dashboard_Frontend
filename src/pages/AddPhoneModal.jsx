import { useState } from 'react';
import { toast } from 'react-toastify';
import { Phone } from 'lucide-react';
import { api } from '../services/api';
import { PHONE_COUNTRIES, DEFAULT_PHONE_COUNTRY, combinePhone } from '../utils/phoneCountries';

const INPUT = {
  padding: '14px 16px', borderRadius: 10,
  border: '1.5px solid #E3D5C1', background: '#FDF9F1',
  fontSize: 15, color: '#5B4632', fontFamily: "'DM Sans', sans-serif",
  outline: 'none', boxSizing: 'border-box',
};

// Shown once per session to logged-in buyers/suppliers who have no phone
// number on file — keeps account contact info usable for order/RFQ follow-up
// without forcing it during signup for accounts created before this existed.
export default function AddPhoneModal({ onDone }) {
  const [dial, setDial]   = useState(DEFAULT_PHONE_COUNTRY.dial);
  const [number, setNumber] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    const digits = number.replace(/\D/g, '');
    if (digits.length < 7) { toast.error('Enter a valid phone number'); return; }

    setSaving(true);
    try {
      await api.updateMe({ phone_number: combinePhone(dial, digits) });
      toast.success('Phone number saved!');
      onDone();
    } catch (err) {
      toast.error(err.message || 'Could not save phone number');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(43,32,22,0.55)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div role="dialog" aria-modal="true" aria-labelledby="add-phone-title" style={{
        background: '#FDF9F1', borderRadius: 20, padding: 32, maxWidth: 420, width: '100%',
        boxShadow: '0 24px 64px rgba(43,32,22,0.25)', fontFamily: "'DM Sans', sans-serif",
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14, background: '#F5F0E7', border: '1px solid #E3D5C1',
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18,
        }}>
          <Phone size={22} color="#5B4632" />
        </div>
        <h2 id="add-phone-title" style={{ fontFamily: "'Canela', 'Cormorant Garamond', Georgia, serif", fontSize: 26, fontWeight: 300, letterSpacing: '-0.4px', lineHeight: 1.15, color: '#5B4632', margin: '0 0 8px' }}>
          Add your phone number
        </h2>
        <p style={{ fontSize: 13.5, color: '#79634E', lineHeight: 1.6, margin: '0 0 22px' }}>
          Suppliers and buyers use this to reach you about RFQs and orders. Add it now to keep your account up to date.
        </p>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <select value={dial} onChange={e => setDial(e.target.value)} style={{ ...INPUT, width: 110, cursor: 'pointer' }}>
              {PHONE_COUNTRIES.map(c => (
                <option key={c.iso} value={c.dial}>{c.iso} {c.dial}</option>
              ))}
            </select>
            <input
              type="tel" inputMode="numeric" value={number}
              onChange={e => setNumber(e.target.value.replace(/[^\d\s]/g, ''))}
              placeholder="98765 43210" required style={{ ...INPUT, flex: 1 }}
            />
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button type="button" onClick={onDone} disabled={saving} style={{
              flex: 1, padding: '13px 0', borderRadius: 10, border: '1px solid rgba(91,70,50,.4)',
              background: 'transparent', color: '#5B4632', cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13.5,
            }}>
              Skip for now
            </button>
            <button type="submit" disabled={saving} style={{
              flex: 1, padding: '13px 0', borderRadius: 10, border: 'none',
              background: '#5B4632', color: '#FDF9F1', cursor: saving ? 'default' : 'pointer',
              fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13.5,
              opacity: saving ? 0.7 : 1,
            }}>
              {saving ? 'Saving…' : 'Save number'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
