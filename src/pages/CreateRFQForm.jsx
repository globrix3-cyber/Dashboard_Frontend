import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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

const TODAY = new Date().toISOString().split('T')[0];

export default function CreateRFQForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', product: '', category: '', quantity: '', unit: 'pieces',
    budget: '', deadline: '', description: '', destination: '',
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // "Request quote" on a product page opens this form with ?product=<id>: prefill what we know
  // about that product. Fields the buyer has already typed are never overwritten.
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('product');
  const [sourceProduct, setSourceProduct] = useState(null);
  useEffect(() => {
    if (!productId) return undefined;
    let cancelled = false;
    api.getProduct(productId)
      .then((p) => {
        if (cancelled || !p) return;
        setSourceProduct(p);
        setForm((f) => ({
          ...f,
          title:       f.title       || `Quote request: ${p.name}`.slice(0, 200),
          product:     f.product     || p.name || '',
          category:    f.category    || p.category_name || '',
          unit:        p.moq_unit && UNITS.some(u => u.value === p.moq_unit) && f.unit === 'pieces' ? p.moq_unit : f.unit,
          description: f.description || `I'd like a quote for "${p.name}" (www.globrixa.com/products/${p.id}).`,
        }));
      })
      .catch(() => { /* the form still works without the prefill */ });
    return () => { cancelled = true; };
  }, [productId]);

  // The product's own category may not be in the static list; offer it so the prefill shows.
  const categoryOptions = form.category && !CATEGORIES.some(c => c.value === form.category)
    ? [...CATEGORIES, { value: form.category, label: form.category }]
    : CATEGORIES;

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
        title={sourceProduct ? 'Request a quote' : 'Post New RFQ'}
        subtitle={sourceProduct ? `For ${sourceProduct.name}` : 'Get competitive quotes from verified suppliers'}
        action={
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
            <ArrowLeft size={15} /> Back
          </button>
        }
      />

      <div className="bg-white rounded-3xl border border-gray-200 p-8" style={{ boxShadow: '0 1px 3px rgba(43,32,22,0.05)' }}>
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
              options={categoryOptions} />
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
              onChange={(e) => set('deadline', e.target.value)} min={TODAY} />
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