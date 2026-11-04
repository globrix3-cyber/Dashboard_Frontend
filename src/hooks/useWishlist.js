/* ─────────────────────────────────────────────────────────────────────────────
   hooks/useWishlist.js
   Saved wishlist (hearts) backed by /api/wishlist. A module-level store keeps
   one shared Set of product ids so every component sees the same state; it is
   loaded once per signed-in user and cleared on logout.
────────────────────────────────────────────────────────────────────────────── */

import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { toggleLogin } from '../features/auth/authSlice';

let ids       = new Set();
let ownerKey  = null;   // which user the cached set belongs to
let loadingP  = null;
const listeners = new Set();

const emit      = () => listeners.forEach((l) => l());
const subscribe = (l) => { listeners.add(l); return () => listeners.delete(l); };
const snapshot  = () => ids;
const setIds    = (next) => { ids = next; emit(); };

// Key the cache by the JWT's user_id so a silent token refresh doesn't refetch,
// but switching accounts does.
function userKeyFromToken(token) {
  if (!token) return null;
  try {
    const raw = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(raw)).user_id || token;
  } catch {
    return token;
  }
}

function ensureLoaded(key) {
  if (!key) {
    if (ownerKey !== null) { ownerKey = null; loadingP = null; setIds(new Set()); }
    return;
  }
  if (ownerKey === key) return;
  ownerKey = key;
  setIds(new Set());
  const p = api.getWishlist()
    .then((list) => { if (ownerKey === key && loadingP === p) setIds(new Set(Array.isArray(list) ? list : [])); })
    .catch(() => { if (ownerKey === key) ownerKey = null; }); // allow a retry on next mount
  loadingP = p;
}

export function useWishlist() {
  const dispatch = useDispatch();
  const token    = useSelector((s) => s.auth.token) || localStorage.getItem('token');
  const key      = userKeyFromToken(token && token !== 'undefined' && token !== 'null' ? token : null);
  const set      = useSyncExternalStore(subscribe, snapshot, snapshot);

  useEffect(() => { ensureLoaded(key); }, [key]);

  const has = useCallback((id) => set.has(id), [set]);

  const toggle = useCallback(async (id) => {
    if (!key) { dispatch(toggleLogin(true)); return; }
    const wasSaved = ids.has(id);
    const next = new Set(ids);
    wasSaved ? next.delete(id) : next.add(id);
    setIds(next);
    try {
      if (wasSaved) await api.removeFromWishlist(id);
      else          await api.addToWishlist(id);
    } catch (err) {
      const rollback = new Set(ids);
      wasSaved ? rollback.add(id) : rollback.delete(id);
      setIds(rollback);
      toast.error(err?.message || 'Could not update wishlist');
    }
  }, [key, dispatch]);

  return { has, toggle, ids: set, isLoggedIn: !!key };
}

export default useWishlist;
