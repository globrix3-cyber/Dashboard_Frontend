import { resolveImageUrl } from '../../utils/helpers';

// Site photography for categories that have a fitting picture; anything else
// falls back to a photo of one of its own products.
const CATEGORY_PHOTOS = {
  'Home & Garden':      '/images/v3/rustic-living-room-edited.jpg',
  Furniture:            '/images/v3/newsletter-coffee-table.jpeg',
  'LED Lighting':       '/images/v4/category-table-lamps.jpg',
  'Handicrafts & Gifts':'/images/v4/about-woven-woodwork.jpg',
};

// Pick the five busiest categories (by live product count) and give each a photo.
export function pickCategoryTiles(categories, products) {
  const list = Array.isArray(categories) ? categories : [];
  const byId = Object.fromEntries(list.map(c => [c.id, c]));
  const used = new Set();
  const photoFor = (cat) => {
    if (CATEGORY_PHOTOS[cat.name]) return CATEGORY_PHOTOS[cat.name];
    // Each tile gets its own product photo, even when categories share products.
    const match = (products || []).find(p => {
      if (!p.images?.[0]?.image_url || used.has(p.images[0].image_url)) return false;
      if (p.category_name === cat.name) return true;
      const child = list.find(c => c.name === p.category_name);
      return child && byId[child.parent_id]?.name === cat.name;
    });
    if (!match) return null;
    used.add(match.images[0].image_url);
    return resolveImageUrl(match.images[0].image_url, 900);
  };
  const tiles = [];
  const ranked = list
    .filter(c => Number(c.product_count) > 0)
    .sort((a, b) => Number(b.product_count) - Number(a.product_count));
  for (const c of ranked) {
    if (tiles.length === 5) break;
    const img = photoFor(c);
    if (img) tiles.push({ name: c.name, to: `/products?category=${encodeURIComponent(c.name)}`, img });
  }
  return tiles;
}
