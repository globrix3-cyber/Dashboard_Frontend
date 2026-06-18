/* ─────────────────────────────────────────────────────────────────────────────
   services/api.js
   HTTP client for Globrix backend (Backend running on port 8000)
────────────────────────────────────────────────────────────────────────────── */

import { toast } from 'react-toastify';

// ================== BACKEND URL (Updated for your setup) ==================
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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
  // Let App.jsx know so it can update Redux (which keeps the socket effect in sync).
  window.dispatchEvent(new CustomEvent('auth:token-refreshed', { detail: { token: newToken } }));
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
    toast.error("Cannot connect to server. Please check your connection.");
    throw new Error("Backend connection failed.");
  }

  // Auto refresh on 401
  if (res.status === 401) {
    if (isRefreshing) {
      // Queue this request until the in-flight refresh completes, then retry.
      // If the retry itself returns 401 (edge case: token already expired again),
      // force a clean logout instead of surfacing the raw backend error.
      return new Promise((resolve, reject) => {
        refreshQueue.push({ resolve, reject });
      }).then((newToken) => {
        headers.Authorization = `Bearer ${newToken}`;
        return fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined })
          .then(r => {
            if (r.status === 401) {
              clearTokens();
              window.dispatchEvent(new CustomEvent('auth:expired'));
              throw new Error('Session expired. Please login again.');
            }
            return unwrap(r);
          });
      });
    }

    // Separate the refresh attempt from the retry so a 401 on the retry never
    // accidentally falls into the catch and double-fires auth:expired.
    isRefreshing = true;
    let refreshedToken = null;
    let refreshError   = null;
    try {
      refreshedToken = await attemptTokenRefresh();
      processQueue(null, refreshedToken);
    } catch (err) {
      refreshError = err;
    } finally {
      isRefreshing = false;
    }

    if (refreshError) {
      // Refresh failed — check for a cross-tab token BEFORE rejecting the queue.
      // If another tab already refreshed, use its token for both the queue and
      // our own retry so nothing shows a toast.
      const freshToken = getToken();
      if (freshToken && freshToken !== token) {
        processQueue(null, freshToken);
        headers.Authorization = `Bearer ${freshToken}`;
        res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });
      } else {
        processQueue(refreshError);
        clearTokens();
        window.dispatchEvent(new CustomEvent('auth:expired'));
        throw new Error('Session expired. Please login again.');
      }
    } else {
      // Refresh succeeded — retry original request with the new token.
      headers.Authorization = `Bearer ${refreshedToken}`;
      res = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
    }

    // If the retry after refresh still returns 401 (rare: backend redeployed
    // with a new JWT secret mid-flight), force a clean logout — one fire only.
    if (res.status === 401) {
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
    // Last-resort guard: a 401 that escaped every interceptor above must never
    // surface as a raw "Invalid token" toast — force a clean logout instead.
    if (res.status === 401) {
      clearTokens();
      window.dispatchEvent(new CustomEvent('auth:expired'));
      throw new Error('Session expired. Please login again.');
    }
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
  register:       (body) => post('/api/auth/register',        body),
  login:          (body) => post('/api/auth/login',           body),
  logout:         ()     => post('/api/auth/logout', { refresh_token: getRefreshToken() }),
  forgotPassword: (body) => post('/api/auth/forgot-password', body),
  resetPassword:  (body) => post('/api/auth/reset-password',  body),

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

  // ── Contracts ────────────────────────────────────────────────────────────
  getContracts:     ()       => get('/api/contracts'),
  getContract:      (id)     => get(`/api/contracts/${id}`),
  createContract:   (body)   => post('/api/contracts', body),
  updateContract:   (id, body) => patch(`/api/contracts/${id}`, body),
  signContract:     (id)     => post(`/api/contracts/${id}/sign`),
  cancelContract:   (id)     => post(`/api/contracts/${id}/cancel`),
  placeOrderFromContract: (id) => post(`/api/contracts/${id}/order`),

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