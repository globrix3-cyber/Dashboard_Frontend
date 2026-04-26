import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { Spinner } from '../components/UI';
import { toast } from 'react-toastify';
import {
  Send, MessageSquare, ChevronRight, Search,
  Globe, CheckCircle2, XCircle, Package,
  IndianRupee, Clock, Tag, Plus, ShieldCheck,
} from 'lucide-react';
import { formatDate } from '../utils/helpers';

const C = {
  navy:       '#1B3175', navyLt:     '#EEF2FB',
  saffron:    '#D9600A', saffronLt:  '#FDF1E8',
  emerald:    '#1A7A4A', emeraldLt:  '#EAF5EF',
  gold:       '#B8730A', goldLt:     '#FDF5E2',
  ink:        '#1C1815', inkSoft:    '#3D3731',
  muted:      '#7A7068', border:     '#D4C9B8',
  borderSoft: '#E6DED0', cream:      '#F4EFE4',
  warmWhite:  '#FAF7F1',
};

/* ── helpers ────────────────────────────────────────────────────────────────── */
function timeAgo(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60)   return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)return `${Math.floor(diff / 3600)}h ago`;
  return formatDate(ts);
}

function parseBody(body, type) {
  if (type === 'quote_offer' || type === 'quote_accepted') {
    try { return JSON.parse(body); } catch { return null; }
  }
  return null;
}

/* ── Quote Offer Card (in chat) ─────────────────────────────────────────────── */
function QuoteOfferCard({ data, isMine, onAccept, onCounter, accepting }) {
  return (
    <div style={{
      background: isMine ? C.emeraldLt : '#fff',
      border: `2px solid ${C.emerald}`,
      borderRadius: 16, padding: '16px 18px', maxWidth: 320,
      boxShadow: '0 4px 16px rgba(26,122,74,0.12)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: C.emerald, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ShieldCheck size={14} color="#fff" />
        </div>
        <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 13, color: C.emerald }}>
          Quote Offer
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 100, background: C.goldLt, color: C.gold }}>
          Valid {data.validity_days || 7}d
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
        {[
          { icon: IndianRupee, label: 'Unit Price',  val: `${data.currency || 'INR'} ${Number(data.price).toLocaleString('en-IN')}` },
          { icon: Package,     label: 'Min Qty',     val: data.quantity      ? `${data.quantity} units` : '—' },
          { icon: Clock,       label: 'Lead Time',   val: data.lead_time_days ? `${data.lead_time_days} days` : '—' },
          { icon: Tag,         label: 'Currency',    val: data.currency || 'INR' },
        ].map(({ icon: Icon, label, val }) => (
          <div key={label} style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 8, padding: '8px 10px' }}>
            <div style={{ fontSize: 9, color: C.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Icon size={9} /> {label}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{val}</div>
          </div>
        ))}
      </div>

      {data.notes && (
        <p style={{ fontSize: 12, color: C.inkSoft, lineHeight: 1.6, marginBottom: 12, padding: '8px 10px', background: 'rgba(255,255,255,0.5)', borderRadius: 8 }}>
          {data.notes}
        </p>
      )}

      {!isMine && onAccept && (
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onAccept} disabled={accepting}
            style={{
              flex: 1, padding: '8px 0', borderRadius: 100, border: 'none', cursor: 'pointer',
              background: C.emerald, color: '#fff',
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 12,
              opacity: accepting ? 0.65 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
            }}>
            <CheckCircle2 size={13} /> {accepting ? 'Placing order…' : 'Accept & Order'}
          </button>
          <button onClick={onCounter}
            style={{
              flex: 1, padding: '8px 0', borderRadius: 100, cursor: 'pointer',
              background: 'transparent', color: C.saffron,
              border: `1.5px solid ${C.saffron}`,
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
            }}>
            Counter
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Quote Accepted Card ────────────────────────────────────────────────────── */
function QuoteAcceptedCard({ data }) {
  const navigate = useNavigate();
  return (
    <div style={{
      background: C.emeraldLt, border: `2px solid ${C.emerald}`,
      borderRadius: 16, padding: '14px 16px', maxWidth: 280,
      display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <CheckCircle2 size={18} color={C.emerald} />
        <span style={{ fontWeight: 700, fontSize: 13, color: C.emerald }}>Quote Accepted!</span>
      </div>
      <p style={{ fontSize: 12, color: C.inkSoft, margin: 0 }}>
        Order <strong>{data.order_number}</strong> has been created.
      </p>
      <button onClick={() => navigate('/buyer-dashboard/orders')}
        style={{
          padding: '6px 14px', borderRadius: 100, border: 'none', cursor: 'pointer',
          background: C.emerald, color: '#fff', fontSize: 11, fontWeight: 700,
          fontFamily: "'DM Sans', sans-serif",
        }}>
        View Order
      </button>
    </div>
  );
}

/* ── Quote Offer Form (supplier side panel) ─────────────────────────────────── */
function QuoteOfferForm({ convId, onSent }) {
  const [form, setForm] = useState({ price: '', currency: 'INR', quantity: '', lead_time_days: '', validity_days: '7', notes: '' });
  const [sending, setSending] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSend = async (e) => {
    e.preventDefault();
    if (!form.price) { toast.error('Price is required'); return; }
    setSending(true);
    try {
      await api.post(`/api/conversations/${convId}/quote-offer`, {
        price:          Number(form.price),
        currency:       form.currency,
        quantity:       form.quantity || null,
        lead_time_days: form.lead_time_days ? Number(form.lead_time_days) : null,
        validity_days:  Number(form.validity_days) || 7,
        notes:          form.notes || null,
      });
      toast.success('Quote offer sent!');
      onSent();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 14, color: C.ink, marginBottom: 4 }}>
        Send Quote Offer
      </div>
      {[
        { key: 'price',          label: 'Unit Price (₹) *', type: 'number', placeholder: '250' },
        { key: 'quantity',       label: 'Min Quantity',      type: 'number', placeholder: '500' },
        { key: 'lead_time_days', label: 'Lead Time (days)',  type: 'number', placeholder: '15'  },
        { key: 'validity_days',  label: 'Valid for (days)',  type: 'number', placeholder: '7'   },
      ].map(({ key, label, type, placeholder }) => (
        <div key={key}>
          <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>{label}</label>
          <input type={type} value={form[key]} onChange={e => set(key, e.target.value)} placeholder={placeholder}
            style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: `1.5px solid ${C.borderSoft}`, background: C.cream, fontSize: 13, color: C.ink, fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box' }}
            onFocus={e => { e.currentTarget.style.borderColor = C.emerald; e.currentTarget.style.background = '#fff'; }}
            onBlur={e => { e.currentTarget.style.borderColor = C.borderSoft; e.currentTarget.style.background = C.cream; }} />
        </div>
      ))}
      <div>
        <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>Notes / Terms</label>
        <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2}
          placeholder="Quality, packaging, payment terms…"
          style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: `1.5px solid ${C.borderSoft}`, background: C.cream, fontSize: 12, color: C.ink, fontFamily: "'DM Sans', sans-serif", outline: 'none', resize: 'none', boxSizing: 'border-box' }}
          onFocus={e => { e.currentTarget.style.borderColor = C.emerald; e.currentTarget.style.background = '#fff'; }}
          onBlur={e => { e.currentTarget.style.borderColor = C.borderSoft; e.currentTarget.style.background = C.cream; }} />
      </div>
      <button type="submit" disabled={sending} style={{
        padding: '9px 0', borderRadius: 100, border: 'none', cursor: 'pointer',
        background: C.emerald, color: '#fff', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13,
        opacity: sending ? 0.65 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      }}>
        <ShieldCheck size={13} /> {sending ? 'Sending…' : 'Send Quote Offer'}
      </button>
    </form>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN MessagesPage
═══════════════════════════════════════════════════════════════════════════════ */
export default function MessagesPage() {
  const { userRole, userName } = useSelector(s => s.auth);
  const navigate               = useNavigate();
  const [searchParams]         = useSearchParams();

  const [conversations, setConversations] = useState([]);
  const [loadingConvs, setLoadingConvs]   = useState(true);
  const [activeConvId, setActiveConvId]   = useState(searchParams.get('conv') || null);
  const [activeConv,   setActiveConv]     = useState(null);
  const [loadingMsgs,  setLoadingMsgs]    = useState(false);
  const [msgText,      setMsgText]        = useState('');
  const [sending,      setSending]        = useState(false);
  const [accepting,    setAccepting]      = useState(null);
  const [search,       setSearch]         = useState('');
  const [showQuoteForm, setShowQuoteForm] = useState(false);

  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  const isSupplier = userRole === 'supplier';
  const isAdmin    = userRole === 'admin';

  /* load conversation list */
  useEffect(() => {
    (async () => {
      setLoadingConvs(true);
      try {
        const data = await api.get('/api/conversations');
        setConversations(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        toast.error('Failed to load conversations');
      } finally {
        setLoadingConvs(false);
      }
    })();
  }, []);

  /* load messages when active conversation changes */
  useEffect(() => {
    if (!activeConvId) return;
    (async () => {
      setLoadingMsgs(true);
      setShowQuoteForm(false);
      try {
        const data = await api.get(`/api/conversations/${activeConvId}`);
        const cv = data?.data || data;
        setActiveConv(cv);
        // Update unread count in list
        setConversations(prev => prev.map(c => c.id === activeConvId ? { ...c, unread_count: 0 } : c));
      } catch (err) {
        toast.error('Failed to load messages');
      } finally {
        setLoadingMsgs(false);
      }
    })();
  }, [activeConvId]);

  /* scroll to bottom on new messages */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages]);

  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!msgText.trim() || !activeConvId) return;
    setSending(true);
    const text = msgText.trim();
    setMsgText('');
    try {
      const data = await api.post(`/api/conversations/${activeConvId}/messages`, { body: text });
      const newMsg = data?.data || data;
      setActiveConv(prev => prev ? { ...prev, messages: [...(prev.messages || []), newMsg] } : prev);
      setConversations(prev => prev.map(c => c.id === activeConvId ? { ...c, last_message: text, last_message_at: new Date().toISOString() } : c));
    } catch (err) {
      toast.error(err.message);
      setMsgText(text);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleAcceptQuote = async (msgId, convId) => {
    setAccepting(msgId);
    try {
      const result = await api.patch(`/api/conversations/${convId}/quote-offer/${msgId}/accept`);
      toast.success('Order placed successfully! 🎉');
      // Reload conversation to see acceptance message
      const data = await api.get(`/api/conversations/${convId}`);
      setActiveConv(data?.data || data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setAccepting(null);
    }
  };

  const handleQuoteOfferSent = async () => {
    setShowQuoteForm(false);
    if (activeConvId) {
      const data = await api.get(`/api/conversations/${activeConvId}`);
      setActiveConv(data?.data || data);
    }
  };

  const filteredConvs = conversations.filter(c => {
    if (!search) return true;
    const name = (c.buyer_name || '') + (c.supplier_name || '') + (c.rfq_title || '') + (c.subject || '');
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const otherParty = (conv) => {
    if (!conv) return '';
    if (isSupplier) return conv.buyer_name || 'Buyer';
    if (isAdmin)    return `${conv.buyer_name || 'Buyer'} ↔ ${conv.supplier_name || 'Supplier'}`;
    return conv.supplier_name || 'Supplier';
  };

  const myCompanyId = activeConv
    ? (isSupplier ? activeConv.supplier_company_id : activeConv.buyer_company_id)
    : null;

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>

      {/* Page header */}
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 900, color: C.ink, margin: 0 }}>
          {isAdmin ? 'All Conversations' : 'Messages'}
        </h1>
        <p style={{ fontSize: 13, color: C.muted, marginTop: 3 }}>
          {isAdmin ? 'Monitor all platform conversations' : 'Negotiate, bargain and close deals with your trade partners'}
        </p>
        <div style={{ height: 3, marginTop: 10, borderRadius: 2, background: `linear-gradient(90deg, ${isSupplier ? C.emerald : isAdmin ? C.navy : C.saffron}, transparent)` }} />
      </div>

      {/* Main layout */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '300px 1fr', gap: 16, minHeight: 0 }}>

        {/* ── LEFT: Conversation list ─────────────────────────────────────── */}
        <div style={{ background: '#fff', borderRadius: 18, border: `1.5px solid ${C.borderSoft}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ borderTop: `3px solid ${isSupplier ? C.emerald : isAdmin ? C.navy : C.saffron}` }} />

          {/* Search */}
          <div style={{ padding: '12px 14px', borderBottom: `1px solid ${C.borderSoft}` }}>
            <div style={{ position: 'relative' }}>
              <Search size={13} color={C.muted} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search conversations…"
                style={{ width: '100%', padding: '8px 10px 8px 30px', borderRadius: 9, border: `1.5px solid ${C.borderSoft}`, background: C.cream, fontSize: 12, color: C.ink, fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box' }} />
            </div>
          </div>

          {/* List */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loadingConvs ? (
              <div style={{ padding: 24, display: 'flex', justifyContent: 'center' }}><Spinner /></div>
            ) : !filteredConvs.length ? (
              <div style={{ padding: 32, textAlign: 'center' }}>
                <MessageSquare size={32} color={C.borderSoft} style={{ marginBottom: 8 }} />
                <p style={{ fontSize: 13, color: C.muted }}>No conversations yet</p>
                {!isAdmin && (
                  <button onClick={() => navigate(isSupplier ? '/supplier-dashboard/rfqs' : '/products')}
                    style={{ marginTop: 10, padding: '7px 16px', borderRadius: 100, background: isSupplier ? C.emerald : C.saffron, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>
                    {isSupplier ? 'Browse RFQs' : 'Browse Suppliers'}
                  </button>
                )}
              </div>
            ) : filteredConvs.map(conv => {
              const isActive = conv.id === activeConvId;
              const party    = isAdmin
                ? `${conv.buyer_name || '?'} ↔ ${conv.supplier_name || '?'}`
                : isSupplier ? (conv.buyer_name || 'Buyer') : (conv.supplier_name || 'Supplier');
              const unread   = conv.unread_count || 0;
              let   preview  = conv.last_message || 'No messages yet';
              if (conv.last_message_type === 'quote_offer')    preview = '📋 Quote offer sent';
              if (conv.last_message_type === 'quote_accepted') preview = '✅ Quote accepted';

              return (
                <div key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  style={{
                    padding: '12px 14px', borderBottom: `1px solid ${C.borderSoft}`,
                    cursor: 'pointer', transition: 'background 0.15s',
                    background: isActive ? (isSupplier ? C.emeraldLt : isAdmin ? C.navyLt : C.saffronLt) : '#fff',
                    borderLeft: isActive ? `3px solid ${isSupplier ? C.emerald : isAdmin ? C.navy : C.saffron}` : '3px solid transparent',
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = C.cream; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = '#fff'; }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                      background: isSupplier ? C.navy : isAdmin ? C.saffron : C.emerald,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: 14, fontWeight: 800, fontFamily: "'Playfair Display', serif",
                    }}>
                      {party[0]?.toUpperCase() || '?'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: C.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{party}</span>
                        <span style={{ fontSize: 10, color: C.muted, flexShrink: 0 }}>{timeAgo(conv.last_message_at || conv.created_at)}</span>
                      </div>
                      {conv.rfq_title && (
                        <div style={{ fontSize: 10, color: isSupplier ? C.emerald : C.saffron, fontWeight: 600, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          RFQ: {conv.rfq_title}
                        </div>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
                        <span style={{ fontSize: 11, color: C.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{preview}</span>
                        {unread > 0 && (
                          <span style={{ width: 18, height: 18, borderRadius: '50%', background: C.saffron, color: '#fff', fontSize: 9, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {unread > 9 ? '9+' : unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT: Chat window ──────────────────────────────────────────── */}
        <div style={{ background: '#fff', borderRadius: 18, border: `1.5px solid ${C.borderSoft}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {!activeConvId ? (
            /* Empty state */
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 48 }}>
              <div style={{ width: 72, height: 72, borderRadius: 18, background: C.cream, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageSquare size={32} color={C.borderSoft} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 800, color: C.ink, margin: '0 0 6px' }}>Select a conversation</p>
                <p style={{ fontSize: 13, color: C.muted }}>Choose from the left panel to start chatting</p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div style={{ borderTop: `3px solid ${isSupplier ? C.emerald : isAdmin ? C.navy : C.saffron}` }} />
              <div style={{
                padding: '14px 18px', borderBottom: `1px solid ${C.borderSoft}`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: isSupplier ? C.navy : isAdmin ? C.saffron : C.emerald, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 15, fontWeight: 800, fontFamily: "'Playfair Display', serif" }}>
                    {otherParty(activeConv)?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: C.ink }}>{otherParty(activeConv)}</div>
                    {activeConv?.rfq_title && (
                      <div style={{ fontSize: 11, color: isSupplier ? C.emerald : C.saffron, fontWeight: 600 }}>
                        Re: {activeConv.rfq_title}
                      </div>
                    )}
                  </div>
                </div>
                {isSupplier && !isAdmin && (
                  <button onClick={() => setShowQuoteForm(v => !v)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 100,
                      background: showQuoteForm ? C.emerald : C.emeraldLt, color: showQuoteForm ? '#fff' : C.emerald,
                      border: `1.5px solid ${C.emerald}`, cursor: 'pointer',
                      fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 12, transition: 'all 0.15s',
                    }}>
                    <ShieldCheck size={13} /> Quote Offer
                  </button>
                )}
              </div>

              {/* Quote offer slide-down panel (supplier only) */}
              {showQuoteForm && isSupplier && (
                <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.borderSoft}`, background: C.emeraldLt }}>
                  <QuoteOfferForm convId={activeConvId} onSent={handleQuoteOfferSent} />
                </div>
              )}

              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 12, background: C.warmWhite }}>
                {loadingMsgs ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}><Spinner /></div>
                ) : !(activeConv?.messages?.length) ? (
                  <div style={{ textAlign: 'center', padding: '32px 0', color: C.muted, fontSize: 13 }}>
                    No messages yet — say hello! 👋
                  </div>
                ) : activeConv.messages.map((msg) => {
                  const isMine   = msg.sender_user_id === null
                    ? false
                    : msg.sender_company_id === myCompanyId;
                  const parsed   = parseBody(msg.body, msg.message_type);

                  return (
                    <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isMine ? 'flex-end' : 'flex-start' }}>
                      {!isMine && (
                        <span style={{ fontSize: 10, color: C.muted, marginBottom: 4 }}>
                          {msg.sender_name || msg.sender_company || 'Partner'}
                        </span>
                      )}

                      {msg.message_type === 'quote_offer' && parsed ? (
                        <QuoteOfferCard
                          data={parsed}
                          isMine={isMine}
                          accepting={accepting === msg.id}
                          onAccept={!isAdmin ? () => handleAcceptQuote(msg.id, activeConvId) : undefined}
                          onCounter={() => setMsgText(`Counter offer: `)}
                        />
                      ) : msg.message_type === 'quote_accepted' && parsed ? (
                        <QuoteAcceptedCard data={parsed} />
                      ) : (
                        <div style={{
                          maxWidth: '72%', padding: '10px 14px', borderRadius: isMine ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                          background: isMine ? (isSupplier ? C.emerald : C.saffron) : '#fff',
                          color: isMine ? '#fff' : C.ink,
                          fontSize: 13, lineHeight: 1.65,
                          boxShadow: '0 1px 4px rgba(28,24,21,0.06)',
                          border: isMine ? 'none' : `1.5px solid ${C.borderSoft}`,
                        }}>
                          {msg.body}
                        </div>
                      )}

                      <span style={{ fontSize: 10, color: C.muted, marginTop: 3 }}>
                        {timeAgo(msg.created_at)}
                        {isMine && msg.is_read && <span style={{ marginLeft: 5, color: C.emerald }}>✓✓</span>}
                      </span>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {/* Input bar — hidden for admin (read-only) */}
              {!isAdmin && (
                <div style={{ padding: '12px 16px', borderTop: `1px solid ${C.borderSoft}`, background: '#fff' }}>
                  <form onSubmit={sendMessage} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <input
                      ref={inputRef}
                      value={msgText}
                      onChange={e => setMsgText(e.target.value)}
                      placeholder="Type a message… (Enter to send)"
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) sendMessage(e); }}
                      style={{
                        flex: 1, padding: '11px 14px', borderRadius: 12,
                        border: `1.5px solid ${C.borderSoft}`, background: C.cream,
                        fontSize: 13, color: C.ink, fontFamily: "'DM Sans', sans-serif",
                        outline: 'none', transition: 'border-color 0.15s',
                      }}
                      onFocus={e => { e.currentTarget.style.borderColor = isSupplier ? C.emerald : C.saffron; e.currentTarget.style.background = '#fff'; }}
                      onBlur={e => { e.currentTarget.style.borderColor = C.borderSoft; e.currentTarget.style.background = C.cream; }}
                    />
                    <button type="submit" disabled={sending || !msgText.trim()}
                      style={{
                        width: 42, height: 42, borderRadius: 12, border: 'none', cursor: 'pointer',
                        background: isSupplier ? C.emerald : C.saffron,
                        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        opacity: (sending || !msgText.trim()) ? 0.5 : 1,
                        transition: 'opacity 0.15s',
                        flexShrink: 0,
                      }}>
                      <Send size={16} />
                    </button>
                  </form>
                  <div style={{ fontSize: 10, color: C.muted, marginTop: 6, textAlign: 'center' }}>
                    {isSupplier ? 'Use "Quote Offer" button above to send structured price proposals' : 'You can accept or counter supplier quote offers in chat'}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
