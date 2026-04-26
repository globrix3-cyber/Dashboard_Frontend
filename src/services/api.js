/* ─────────────────────────────────────────────────────────────────────────────
   services/api.js
   HTTP client for Globrix backend (Backend running on port 8000)
────────────────────────────────────────────────────────────────────────────── */

import { toast } from 'react-toastify';

// ================== BACKEND URL (Updated for your setup) ==================
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

console.log(`[API] Using backend → ${BASE_URL}`);

/* ── Token Helpers ─────────────────────────────────────────────────────────── */
const isValidToken = (t) =>
  t && typeof t === 'string' && t !== 'undefined' && t !== 'null' && t.trim() !== '';

const getToken = () => {
  const t = localStorage.getItem('token');
  return isValidToken(t) ? t : null;
};

const getRefreshToken = () => {
  const t = localStorage.getItem('refresh_token');
  return isValidToken(t) ? t : null;
};

const saveTokens = (token, refresh_token) => {
  if (!isValidToken(token) || !isValidToken(refresh_token)) {
    console.error('[api] Invalid tokens received');
    throw new Error('Invalid tokens from server');
  }
  localStorage.setItem('token', token);
  localStorage.setItem('refresh_token', refresh_token);
};

const clearTokens = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('role');
  localStorage.removeItem('name');
};

/* ── Refresh Logic ─────────────────────────────────────────────────────────── */
let isRefreshing = false;
let refreshQueue = [];

function processQueue(error, newToken = null) {
  refreshQueue.forEach(({ resolve, reject }) => 
    error ? reject(error) : resolve(newToken)
  );
  refreshQueue = [];
}

async function attemptTokenRefresh() {
  const refresh_token = getRefreshToken();
  if (!refresh_token) throw new Error('No refresh token');

  const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token }),
  });

  const json = await res.json();

  if (!res.ok) throw new Error(json.error || 'Token refresh failed');

  const newToken = json.data?.token || json.token;
  const newRefresh = json.data?.refresh_token || json.refresh_token;

  if (!newToken || !newRefresh) throw new Error('Refresh failed');

  saveTokens(newToken, newRefresh);
  return newToken;
}

/* ── Core Request Function ─────────────────────────────────────────────────── */
async function request(method, path, body) {
  const url = `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;

  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    console.error(`[API] Connection failed to ${url}`);
    toast.error("Cannot connect to backend. Make sure server is running on port 8000.");
    throw new Error("Backend connection failed. Is the server running?");
  }

  // Auto refresh on 401
  if (res.status === 401) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push({ resolve, reject });
      }).then((newToken) => {
        headers.Authorization = `Bearer ${newToken}`;
        return fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined })
          .then(unwrap);
      });
    }

    isRefreshing = true;
    try {
      const newToken = await attemptTokenRefresh();
      processQueue(null, newToken);
      isRefreshing = false;

      headers.Authorization = `Bearer ${newToken}`;
      res = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
    } catch (err) {
      processQueue(err);
      isRefreshing = false;
      clearTokens();
      window.dispatchEvent(new CustomEvent('auth:expired'));
      throw new Error('Session expired. Please login again.');
    }
  }

  return unwrap(res);
}

async function unwrap(res) {
  let json;
  try {
    json = await res.json();
  } catch (e) {
    if (!res.ok) throw new Error(`Server error (${res.status})`);
    return {};
  }

  if (!res.ok) {
    const msg = json.error || json.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return json.data ?? json;
}

/* ── HTTP Methods ──────────────────────────────────────────────────────────── */
const get   = (path)        => request('GET',    path);
const post  = (path, body)  => request('POST',   path, body);
const put   = (path, body)  => request('PUT',    path, body);
const patch = (path, body)  => request('PATCH',  path, body);
const del   = (path)        => request('DELETE', path);

/* ── Main API ───────────────────────────────────────────────────────────────── */
export const api = {
  get, post, put, patch, delete: del,

  // ── Auth ─────────────────────────────────────────────────────────────────
  register: (body) => post('/api/auth/register', body),
  login:    (body) => post('/api/auth/login',    body),
  logout:   ()     => post('/api/auth/logout'),

  // ── Profile ──────────────────────────────────────────────────────────────
  getMe:        ()     => get('/api/users/me'),
  updateMe:     (body) => patch('/api/users/me', body),

  // ── Stats ────────────────────────────────────────────────────────────────
  getStats: (role = 'buyer') => get(`/api/stats?role=${role}`),

  // ── RFQs ─────────────────────────────────────────────────────────────────
  getRFQs:    ()       => get('/api/rfqs'),
  getRFQ:     (id)     => get(`/api/rfqs/${id}`),
  createRFQ:  (body)   => post('/api/rfqs', body),
  updateRFQ:  (id, body) => patch(`/api/rfqs/${id}`, body),

  // ── Quotes (supplier submits / lists) ────────────────────────────────────
  getQuotes:   ()            => get('/api/quotes'),
  submitQuote: (rfqId, body) => post(`/api/rfqs/${rfqId}/quotes`, body),
  updateQuote: (id, body)    => patch(`/api/quotes/${id}`, body),

  // ── Orders ───────────────────────────────────────────────────────────────
  getOrders:     ()       => get('/api/orders'),
  getOrder:      (id)     => get(`/api/orders/${id}`),
  updateOrderStatus: (id, status) => patch(`/api/orders/${id}/status`, { status }),

  // ── Products ─────────────────────────────────────────────────────────────
  getProducts:   (params = {}) => get(`/api/products?${new URLSearchParams(params)}`),
  getProduct:    (id)          => get(`/api/products/${id}`),
  createProduct: (body)        => post('/api/products', body),
  updateProduct: (id, body)    => put(`/api/products/${id}`, body),
  deleteProduct: (id)          => del(`/api/products/${id}`),

  // ── Categories & Tags ────────────────────────────────────────────────────
  getCategories: () => get('/api/products/categories'),
  getTags:       () => get('/api/products/tags'),

  // ── Notifications ────────────────────────────────────────────────────────
  getNotifications:  ()   => get('/api/notifications'),
  markAllRead:       ()   => patch('/api/notifications/read-all'),
  markRead:          (id) => patch(`/api/notifications/${id}/read`),
  getUnreadCount:    ()   => get('/api/notifications/unread-count'),

  // ── Messaging ────────────────────────────────────────────────────────────
  getConversations:    ()              => get('/api/conversations'),
  getConversation:     (id)           => get(`/api/conversations/${id}`),
  startConversation:   (body)         => post('/api/conversations', body),
  sendMessage:         (convId, body) => post(`/api/conversations/${convId}/messages`, { body }),
  sendQuoteOffer:      (convId, data) => post(`/api/conversations/${convId}/quote-offer`, data),
  acceptQuoteOffer:    (convId, msgId)=> patch(`/api/conversations/${convId}/quote-offer/${msgId}/accept`),

  // ── Admin ────────────────────────────────────────────────────────────────
  admin: {
    getUsers:         (params = {}) => get(`/api/admin/users?${new URLSearchParams(params)}`),
    suspendUser:      (id)          => patch(`/api/admin/users/${id}/suspend`),
    getCompanies:     (params = {}) => get(`/api/admin/companies?${new URLSearchParams(params)}`),
    getVerifications: ()            => get('/api/admin/verifications'),
    verifyCompany:    (id, status, notes) => patch(`/api/admin/companies/${id}/verify`, { status, notes }),
    getStats:         ()            => get('/api/admin/stats'),
  },
};

export default api;