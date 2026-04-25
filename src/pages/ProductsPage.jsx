import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useFetchData } from '../hooks/useFetchData';
import EmptyState from '../components/EmptyState';
// Removed Spinner from UI import since it doesn't exist there

import { ShoppingBag, Search, Star, BadgeCheck } from 'lucide-react';
import { countryFlag } from '../utils/helpers';

const CATEGORIES = ['All', 'Textiles', 'Electronics', 'Automotive', 'Machinery', 'Packaging', 'Homeware', 'Beauty', 'Sports'];

export default function ProductsPage() {
  const navigate = useNavigate();
  
  const { data: products = [], loading, error } = useFetchData(() => api.getProducts());

  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');

  const filtered = products.filter((p) => {
    const matchCat = cat === 'All' || p.category === cat;
    const matchSearch = 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.supplier && p.supplier.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-semibold text-red-600 mb-3">Failed to load products</h2>
          <p className="text-gray-600 mb-8">
            {error.message || 'Something went wrong while fetching products.'}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary px-8 py-3 rounded-2xl font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Hero strip */}
      <div className="rounded-3xl p-8 mb-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#1E293B,#0F172A)' }}>
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, rgba(255,107,0,0.4) 0%, transparent 60%)' }} />
        <div className="relative z-10">
          <h1 className="text-4xl font-black text-white mb-3">Global Product Catalog</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)' }} className="text-lg">
            Browse 50,000+ products from verified suppliers worldwide
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products or suppliers…" 
            className="w-full pl-12 pr-5 py-3.5 rounded-2xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-orange-400 transition-colors"
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }} 
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 flex-wrap mb-10">
        {CATEGORIES.map((c) => (
          <button 
            key={c} 
            onClick={() => setCat(c)}
            className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all active:scale-95"
            style={cat === c 
              ? { 
                  background: 'linear-gradient(135deg,#FF6B00,#FF8C00)', 
                  color: 'white', 
                  boxShadow: '0 4px 14px rgba(255,107,0,0.25)' 
                }
              : { 
                  background: 'white', 
                  color: '#6B7280', 
                  border: '1px solid #E5E7EB' 
                }
            }
          >
            {c}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin"></div>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState 
          icon={ShoppingBag}
          title="No products found"
          description="Try changing your search term or select a different category."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <div 
              key={p.id}
              className="bg-white rounded-3xl border border-gray-200 overflow-hidden cursor-pointer card-hover group"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
              onClick={() => navigate(`/products/${p.id}`)}
            >
              {/* Product Image */}
              <div className="h-48 flex items-center justify-center relative bg-gradient-to-br from-gray-100 to-gray-50">
                <ShoppingBag size={52} className="text-gray-300 group-hover:scale-110 transition-transform duration-300" />
                
                {p.verified && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-700">
                    <BadgeCheck size={13} /> Verified
                  </div>
                )}

                {p.country && (
                  <div className="absolute top-4 left-4 text-2xl">
                    {countryFlag(p.country)}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6">
                <div className="text-xs font-semibold mb-2 px-3 py-1 rounded-lg inline-block"
                  style={{ background: '#FFF7ED', color: '#FF6B00' }}>
                  {p.category}
                </div>

                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 leading-tight text-base">
                  {p.name}
                </h3>
                
                <p className="text-xs text-gray-500 mb-4 line-clamp-1">{p.supplier}</p>

                <div className="flex items-center gap-1 mb-4">
                  <Star size={14} fill="#FF6B00" style={{ color: '#FF6B00' }} />
                  <span className="text-sm font-semibold text-gray-700">{p.rating}</span>
                  <span className="text-xs text-gray-400">({p.reviews?.toLocaleString() || 0})</span>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-2xl font-black text-gray-900">₹{p.price}</div>
                    <div className="text-xs text-gray-500">
                      per {p.unit} • MOQ: {p.moq}
                    </div>
                  </div>

                  <button 
                    className="btn-primary px-5 py-2.5 rounded-2xl text-sm font-semibold"
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      alert(`Quote requested for ${p.name}`);
                    }}
                  >
                    Get Quote
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}