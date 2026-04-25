import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { InputField, SelectField, PageHeader } from '../components/UI';
import { toast } from 'react-toastify';
import { Send, ArrowLeft } from 'lucide-react';

const CATEGORIES = [
  { value: '', label: 'Select category' },
  { value: 'Textiles', label: 'Textiles' },
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Automotive', label: 'Automotive' },
  { value: 'Machinery', label: 'Machinery' },
  { value: 'Packaging', label: 'Packaging' },
  { value: 'Homeware', label: 'Homeware' },
  { value: 'Beauty', label: 'Beauty & Personal Care' },
  { value: 'Sports', label: 'Sports & Fitness' },
  { value: 'Other', label: 'Other' },
];

const UNITS = [
  { value: 'pieces', label: 'Pieces' },
  { value: 'meters', label: 'Meters' },
  { value: 'kilograms', label: 'Kilograms' },
  { value: 'sets', label: 'Sets' },
  { value: 'units', label: 'Units' },
  { value: 'boxes', label: 'Boxes' },
];

export default function CreateRFQForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', product: '', category: '', quantity: '', unit: 'pieces',
    budget: '', deadline: '', description: '', destination: '',
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.quantity || !form.deadline) {
      toast.error('Please fill all required fields');
      return;
    }
    setLoading(true);
    try {
      await api.createRFQ(form);
      toast.success('RFQ posted successfully!');
      navigate('/buyer-dashboard/rfqs');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        title="Post New RFQ"
        subtitle="Get competitive quotes from verified suppliers"
        action={
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
            <ArrowLeft size={15} /> Back
          </button>
        }
      />

      <div className="bg-white rounded-3xl border border-gray-200 p-8" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <InputField label="RFQ Title *" value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="e.g. 10,000m Premium Cotton Fabric" />

          <div className="grid grid-cols-2 gap-4">
            <InputField label="Product Name *" value={form.product}
              onChange={(e) => set('product', e.target.value)}
              placeholder="Product name" />
            <SelectField label="Category" value={form.category}
              onChange={(e) => set('category', e.target.value)}
              options={CATEGORIES} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField label="Quantity *" type="number" value={form.quantity}
              onChange={(e) => set('quantity', e.target.value)}
              placeholder="5000" />
            <SelectField label="Unit" value={form.unit}
              onChange={(e) => set('unit', e.target.value)}
              options={UNITS} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField label="Budget (₹)" value={form.budget}
              onChange={(e) => set('budget', e.target.value)}
              placeholder="e.g. ₹5,00,000" />
            <InputField label="Deadline *" type="date" value={form.deadline}
              onChange={(e) => set('deadline', e.target.value)} />
          </div>

          <InputField label="Destination Country" value={form.destination}
            onChange={(e) => set('destination', e.target.value)}
            placeholder="India" />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Additional Requirements</label>
            <textarea value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={4} placeholder="Describe quality standards, certifications, packing requirements…"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 resize-none" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate(-1)}
              className="btn-outline flex-1 py-3.5 rounded-2xl text-sm font-bold">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="btn-primary flex-1 py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm"
              style={{ opacity: loading ? 0.7 : 1 }}>
              {loading
                ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <Send size={15} />}
              {loading ? 'Posting…' : 'Post RFQ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}