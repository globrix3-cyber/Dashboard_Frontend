import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toggleLogin } from '../../features/auth/authSlice';
import { T, shadow, sectionTitle } from './tokens';
import { useBreakpoint, rPad, rW } from '../../hooks/useBreakpoint';
import { api } from '../../services/api';
import { resolveImageUrl } from '../../utils/helpers';

const FALLBACK_COLORS = [
  'linear-gradient(145deg,#FDEBD0,#F0C898)',
  'linear-gradient(145deg,#EAD5D5,#C8A0A0)',
  'linear-gradient(145deg,#D5EAD8,#A0C8A8)',
  'linear-gradient(145deg,#D5DCF0,#A0ACCC)',
  'linear-gradient(145deg,#F0EAD5,#C8B4A0)',
  'linear-gradient(145deg,#EAD5EA,#C8A0C8)',
];

function MiniCardSkeleton() {
  return (
    <div style={{ background: T.w, borderRadius: 12, overflow: 'hidden', border: `1.5px solid ${T.bs}` }}>
      <div style={{ aspectRatio: '1 / 1', background: 'linear-gradient(90deg,#f0ebe3 25%,#e8e1d8 50%,#f0ebe3 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
      <div style={{ padding: '14px 16px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ height: 8, width: '55%', borderRadius: 4, background: '#e8e1d8' }} />
        <div style={{ height: 10, width: '80%', borderRadius: 4, background: '#e8e1d8' }} />
        <div style={{ height: 10, width: '40%', borderRadius: 4, background: '#e8e1d8' }} />
      </div>
    </div>
  );
}

function MiniCard({ product, index, onLoginRequired, isLoggedIn }) {
  const [hov, setHov] = useState(false);
  const imgUrl = resolveImageUrl(product.images?.[0]?.image_url);

  const priceNum = Number(product.base_price);
  const currency = product.currency || 'INR';
  const priceStr = priceNum
    ? (currency === 'USD'
        ? `$${priceNum.toFixed(2)}/pc`
        : `₹${priceNum.toLocaleString('en-IN')}/pc`)
    : 'Price on request';

  return (
    <Link
      to={`/products/${product.id}`}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: T.w, borderRadius: 12, overflow: 'hidden',
        border: `1.5px solid ${hov ? 'rgba(200,121,44,.3)' : T.bs}`,
        cursor: 'pointer',
        transform: hov ? 'translateY(-4px)' : 'none',
        boxShadow: hov ? shadow.md : 'none',
        transition: '.22s cubic-bezier(.22,.68,0,1.2)',
        textDecoration: 'none', display: 'block',
      }}
    >
      <div style={{ aspectRatio: '1 / 1', position: 'relative', overflow: 'hidden' }}>
        {imgUrl ? (
          <>
            <img
              src={imgUrl} alt={product.name} loading="lazy" decoding="async"
              style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hov ? 'scale(1.08)' : 'scale(1)', transition: 'transform .5s ease', display: 'block' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: hov ? 'rgba(18,14,10,.12)' : 'rgba(18,14,10,.04)', transition: '.22s' }} />
          </>
        ) : (
          <div style={{ width: '100%', height: '100%', background: FALLBACK_COLORS[index % FALLBACK_COLORS.length], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
            🛍️
          </div>
        )}
        <div style={{ position: 'absolute', top: 8, left: 8 }}>
          <span style={{ background: 'rgba(200,121,44,.92)', backdropFilter: 'blur(6px)', color: '#fff', fontSize: 9, fontWeight: 800, padding: '4px 9px', borderRadius: 4, letterSpacing: '.08em' }}>NEW</span>
        </div>
      </div>
      <div style={{ padding: '14px 16px 18px' }}>
        <div style={{ fontSize: 11, color: T.t, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {product.category_name || 'Uncategorized'}
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, color: T.ink, lineHeight: 1.35, marginBottom: 8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.name}
        </div>
        {isLoggedIn ? (
          <div style={{ fontSize: 16, fontWeight: 800, color: T.ink }}>{priceStr}</div>
        ) : (
          <div
            onClick={e => { e.preventDefault(); onLoginRequired(); }}
            style={{ position: 'relative', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
          >
            <div style={{ fontSize: 16, fontWeight: 800, color: T.ink, filter: 'blur(5px)', userSelect: 'none', pointerEvents: 'none' }}>{priceStr}</div>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#79634E', fontWeight: 700, whiteSpace: 'nowrap' }}>
              🔒 Sign in
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

export default function NewThisWeek() {
  const dispatch    = useDispatch();
  const bp          = useBreakpoint();
  const isLoggedIn  = !!useSelector(s => s.auth.token);
  const openLogin   = () => dispatch(toggleLogin(true));

  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [viewAllHov, setViewAllHov] = useState(false);

  useEffect(() => {
    api.getProducts()
      .then(res => {
        const list = Array.isArray(res) ? res : (res?.data ?? []);
        setProducts(list.slice(0, 8));
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const cols = bp.isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)';
  const showSkeletons = loading;
  const showEmpty = !loading && products.length === 0;

  return (
    <section style={{ background: T.cm, padding: rPad(bp) }}>
      <div style={{ ...rW }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ background: `linear-gradient(135deg,${T.t},${T.td})`, color: '#fff', fontSize: 9, fontWeight: 800, padding: '4px 12px', borderRadius: 5, letterSpacing: '.08em', textTransform: 'uppercase' }}>New This Week</span>
            <h2 style={sectionTitle}>Just listed</h2>
          </div>
        </div>

        {showEmpty ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: T.mu, fontSize: 14 }}>
            No products listed yet — check back soon!
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: cols, gap: bp.isMobile ? 12 : 20 }}>
            {showSkeletons
              ? Array.from({ length: 8 }).map((_, i) => <MiniCardSkeleton key={i} />)
              : products.map((p, i) => <MiniCard key={p.id} product={p} index={i} onLoginRequired={openLogin} isLoggedIn={isLoggedIn} />)
            }
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 36 }}>
          <Link
            to="/products"
            onMouseEnter={() => setViewAllHov(true)}
            onMouseLeave={() => setViewAllHov(false)}
            style={{
              display: 'inline-block', padding: '14px 40px', borderRadius: 4,
              background: viewAllHov ? '#2B2016' : '#5B4632', color: '#fff',
              fontSize: 14, fontWeight: 600, letterSpacing: '.04em',
              textDecoration: 'none', transition: 'background .2s ease',
            }}
          >
            View all products
          </Link>
        </div>
      </div>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </section>
  );
}
