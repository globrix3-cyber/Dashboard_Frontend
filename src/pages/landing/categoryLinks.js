import { useEffect, useState } from 'react';
import { api } from '../../services/api';

// Homepage category names → the marketplace's top-level category they open.
export const CATEGORY_LINKS = [
  { label: 'Home & Living',         root: 'Home & Garden' },
  { label: 'Fashion & Accessories', root: 'Apparel & Textiles' },
  { label: 'Beauty & Wellness',     root: 'Beauty & Personal Care' },
  { label: 'Gifts & Lifestyle',     root: 'Handicrafts & Gifts' },
].map(c => ({ ...c, to: `/products?category=${encodeURIComponent(c.root)}` }));

let countsPromise = null;

// Active product count per top-level category name; null until loaded (show everything meanwhile).
export function useCategoryCounts() {
  const [counts, setCounts] = useState(null);
  useEffect(() => {
    countsPromise = countsPromise || api.getCategories()
      .then(res => {
        const list = Array.isArray(res) ? res : (res?.data ?? []);
        return Object.fromEntries(list.filter(c => !c.parent_id).map(c => [c.name, Number(c.product_count ?? NaN)]));
      })
      .catch(() => { countsPromise = null; return null; });
    let alive = true;
    countsPromise.then(c => { if (alive) setCounts(c); });
    return () => { alive = false; };
  }, []);
  return counts;
}

// Hide a category only when we know it has no products.
export const hasProducts = (counts, root) => !counts || !(counts[root] === 0);
