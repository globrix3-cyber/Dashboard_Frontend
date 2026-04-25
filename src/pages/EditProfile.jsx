import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuth } from '../features/auth/authSlice';
import { api } from '../services/api';
import { PageHeader, InputField } from '../components/UI';   // ← Fixed import path
import { toast } from 'react-toastify';
import { Save, User } from 'lucide-react';

export default function EditProfile() {
  const dispatch = useDispatch();
  const { userName, userRole } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    country: ''
  });

  // Load current profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await api.getProfile();
        if (profile) {
          setForm({
            name: profile.name || userName || '',
            email: profile.email || '',
            company: profile.company || '',
            phone: profile.phone || '',
            country: profile.country || ''
          });
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
        // Don't show toast on initial load if it fails
      }
    };

    fetchProfile();
  }, [userName]);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name?.trim()) {
      toast.error('Full Name is required');
      return;
    }

    setLoading(true);
    try {
      await api.updateProfile(form);
      
      dispatch(setAuth({ 
        userRole, 
        userName: form.name, 
        token: localStorage.getItem('token') 
      }));

      localStorage.setItem('name', form.name);
      toast.success('Profile updated successfully!');
      
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-8">
      <PageHeader 
        title="Edit Profile" 
        subtitle="Update your account information" 
      />

      <div className="bg-white rounded-3xl border border-gray-200 p-8 mt-6"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>

        {/* Avatar Section */}
        <div className="flex items-center gap-5 mb-10 pb-8 border-b border-gray-100">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-black"
            style={{ background: 'linear-gradient(135deg,#FF6B00,#FF8C00)' }}>
            {form.name ? form.name[0].toUpperCase() : <User size={32} />}
          </div>
          <div>
            <div className="font-bold text-2xl text-gray-900">
              {form.name || userName || 'Your Name'}
            </div>
            <div className="text-sm text-gray-500 capitalize mt-1">
              {userRole || 'User'}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField 
            label="Full Name *" 
            value={form.name} 
            onChange={(e) => handleChange('name', e.target.value)} 
            placeholder="John Doe" 
          />

          <InputField 
            label="Email Address" 
            type="email" 
            value={form.email} 
            onChange={(e) => handleChange('email', e.target.value)} 
            placeholder="you@company.com" 
          />

          <InputField 
            label="Company" 
            value={form.company} 
            onChange={(e) => handleChange('company', e.target.value)} 
            placeholder="Acme Imports Ltd." 
          />

          <InputField 
            label="Phone Number" 
            value={form.phone} 
            onChange={(e) => handleChange('phone', e.target.value)} 
            placeholder="+91 98765 43210" 
          />

          <InputField 
            label="Country" 
            value={form.country} 
            onChange={(e) => handleChange('country', e.target.value)} 
            placeholder="India" 
          />

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm font-semibold mt-4"
            style={{ opacity: loading ? 0.75 : 1 }}
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {loading ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}