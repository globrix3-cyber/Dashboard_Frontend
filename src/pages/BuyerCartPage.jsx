import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { useFetchData } from '../hooks/useFetchData';
import { useCurrency } from '../hooks/useCurrency';
import { Spinner, EmptyState, PageHeader } from '../components/UI';
import { resolveImageUrl } from '../utils/helpers';
import { ShoppingBag, Minus, Plus, Trash2, Package } from 'lucide-react';

function CartRow({ item, onQtyChange, onRemove, removing, fmt }) {
  const moq      = Number(item.min_order_quantity) || 1;
  const unit     = item.moq_unit || 'pieces';
  const unitPrice = (Number(item.base_price) || 0) + (Number(item.price_modifier) || 0);
  const lineTotal = unitPrice * item.quantity;
  const thumb     = resolveImageUrl(item.image_url);

  const setExactQty = (raw) => {
    const n = Math.trunc(Number(raw));
    if (Number.isFinite(n)) onQtyChange(item.id, Math.max(moq, n));
  };

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '64px 2fr 1fr 140px 1fr 40px', gap: 16,
      alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #EDE8DF',
    }}>
      <div style={{ width: 56, height: 56, borderRadius: 10, overflow: 'hidden', background: '#F5F2EE', border: '1px solid #EDE8DF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {thumb
          ? <img src={thumb} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <Package size={20} color="#9A9088" />
        }
      </div>

      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#1C1815', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
        {item.variant_name && <div style={{ fontSize: 12, color: '#7A7068', marginTop: 2 }}>{item.variant_name}</div>}
        <div style={{ fontSize: 11.5, color: '#9A9088', marginTop: 2 }}>MOQ: {moq.toLocaleString('en-IN')} {unit}</div>
      </div>

      <div style={{ fontSize: 13, color: '#7A7068' }}>{item.supplier_name}</div>

      <div style={{ display: 'inline-flex', alignItems: 'center', border: '1.5px solid #EDE8DF', borderRadius: 10, overflow: 'hidden', width: 'fit-content' }}>
        <button onClick={() => onQtyChange(item.id, Math.max(moq, item.quantity - 1))} disabled={item.quantity <= moq} style={{
          width: 32, height: 34, border: 'none', background: '#fff', cursor: item.quantity <= moq ? 'default' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.quantity <= moq ? '#D8CFC1' : '#1C1815',
        }}>
          <Minus size={12} />
        </button>
        <input
          type="text" inputMode="numeric" pattern="[0-9]*"
          value={item.quantity}
          onChange={e => setExactQty(e.target.value)}
          onBlur={e => setExactQty(e.target.value || moq)}
          style={{ width: 48, textAlign: 'center', fontSize: 13, fontWeight: 700, color: '#1C1815', border: 'none', outline: 'none', background: 'transparent' }}
        />
        <button onClick={() => onQtyChange(item.id, item.quantity + 1)} style={{
          width: 32, height: 34, border: 'none', background: '#fff', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1C1815',
        }}>
          <Plus size={12} />
        </button>
      </div>

      <div style={{ fontSize: 14, fontWeight: 700, color: '#1C1815' }}>{fmt(lineTotal)}</div>

      <button onClick={() => onRemove(item.id)} disabled={removing} title="Remove" style={{
        width: 32, height: 32, borderRadius: 8, border: 'none', background: '#FEF2F2', color: '#DC2626',
        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: removing ? 'default' : 'pointer', opacity: removing ? 0.6 : 1,
      }}>
        <Trash2 size={14} />
      </button>
    </div>
  );
}

export default function BuyerCartPage() {
  const navigate = useNavigate();
  const { fmt } = useCurrency();
  const { data: raw, loading, refetch } = useFetchData(() => api.getCart());
  const [items, setItems]       = useState([]);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => { setItems(Array.isArray(raw) ? raw : []); }, [raw]);

  const handleQtyChange = async (id, qty) => {
    setItems(prev => prev.map(it => it.id === id ? { ...it, quantity: qty } : it));
    try {
      await api.updateCartItem(id, qty);
      window.dispatchEvent(new CustomEvent('cart:updated'));
    } catch (err) {
      toast.error(err.message || 'Could not update quantity');
      refetch();
    }
  };

  const handleRemove = async (id) => {
    setRemovingId(id);
    try {
      await api.removeCartItem(id);
      setItems(prev => prev.filter(it => it.id !== id));
      window.dispatchEvent(new CustomEvent('cart:updated'));
      toast.success('Removed from cart');
    } catch (err) {
      toast.error(err.message || 'Could not remove item');
    } finally {
      setRemovingId(null);
    }
  };

  const grandTotal = items.reduce((sum, it) => {
    const unitPrice = (Number(it.base_price) || 0) + (Number(it.price_modifier) || 0);
    return sum + unitPrice * it.quantity;
  }, 0);

  return (
    <div style={{ padding: '24px 32px', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <PageHeader title="My Cart" subtitle="Review items before checkout" />

      {loading ? <Spinner /> : !items.length ? (
        <EmptyState icon={ShoppingBag} title="Your cart is empty"
          desc="Browse products and add items to get started"
          action={
            <button onClick={() => navigate('/products')}
              className="btn-primary px-6 py-3 rounded-2xl text-sm">
              Browse products
            </button>
          } />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: '#fff', borderRadius: 18, border: '1.5px solid #EDE8DF', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '64px 2fr 1fr 140px 1fr 40px', gap: 16, padding: '12px 20px', background: '#F5F2EE', borderBottom: '1px solid #EDE8DF' }}>
              {['', 'Product', 'Supplier', 'Quantity', 'Total', ''].map((h, i) => (
                <span key={h || i} style={{ fontSize: 10, fontWeight: 700, color: '#7A7068', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{h}</span>
              ))}
            </div>
            {items.map(item => (
              <CartRow key={item.id} item={item} onQtyChange={handleQtyChange} onRemove={handleRemove} removing={removingId === item.id} fmt={fmt} />
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 24, padding: '0 4px' }}>
            <div style={{ fontSize: 14, color: '#7A7068' }}>
              Total ({items.length} item{items.length !== 1 ? 's' : ''}): <strong style={{ color: '#1C1815', fontSize: 17 }}>{fmt(grandTotal)}</strong>
            </div>
            <button
              onClick={() => toast.info('Checkout is coming soon — for now, request a quote or contract per supplier.')}
              style={{
                padding: '13px 28px', borderRadius: 100, border: 'none', cursor: 'pointer',
                background: '#C4773A', color: '#fff', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14,
                boxShadow: '0 4px 16px rgba(196,119,58,.28)',
              }}>
              Proceed to checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
