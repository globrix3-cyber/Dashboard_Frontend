/**
 * Landing page image registry.
 * All paths are relative to /public — served as static assets at build time.
 *
 * Folders:
 *   hero/        — full-bleed hero & banner images (load eagerly, above the fold)
 *   categories/  — ShopByCategory card backgrounds
 *   suppliers/   — FeaturedSuppliers card headers
 *   products/    — product cards across Trending, NewThisWeek, TrendingByCategory
 *   collections/ — CuratedCollections card backgrounds
 *   regions/     — BrowseByRegion city photos
 *   people/      — testimonial avatars
 */

export const IMG = {
  // ── Hero & banners ───────────────────────────────────────────────────────
  artisanWeaving:      '/images/hero/artisan-weaving.jpg',
  handmadePottery:     '/images/hero/handmade-pottery.jpg',
  mosaicLamps:         '/images/hero/mosaic-lamps.jpg',
  delhiTextiles:       '/images/hero/delhi-textiles.jpg',        // CtaBanner bg

  // ── Category cards ───────────────────────────────────────────────────────
  jaipurTextiles:      '/images/categories/jaipur-textiles.jpg',
  wovenBaskets:        '/images/categories/woven-baskets.jpg',
  spicesMarket:        '/images/categories/spices-market.jpg',
  steelBolts:          '/images/categories/steel-bolts.jpg',

  // ── Supplier headers ─────────────────────────────────────────────────────
  jaisalmerTextiles:   '/images/suppliers/jaisalmer-textiles.jpg',
  ceramicKitchenware:  '/images/suppliers/ceramic-kitchenware.jpg',
  wheatFieldIndia:     '/images/suppliers/wheat-field-india.jpg',
  factoryAssembly:     '/images/suppliers/factory-assembly.jpg',

  // ── Product cards ────────────────────────────────────────────────────────
  fabricRolls:         '/images/products/fabric-rolls.jpg',
  turmericPowder:      '/images/products/turmeric-powder.jpg',
  metalParts:          '/images/products/metal-parts.jpg',
  blueCeramicVases:    '/images/products/blue-ceramic-vases.jpg',
  herbalPowder:        '/images/products/herbal-powder.jpg',
  floralHerbs:         '/images/products/floral-herbs.jpg',
  embroideredDupatta:  '/images/products/embroidered-dupatta.jpg',
  basmatiRice:         '/images/products/basmati-rice.jpg',
  redChilli:           '/images/products/red-chilli.jpg',
  coconutOil:          '/images/products/coconut-oil.jpg',
  garlicDried:         '/images/products/garlic-dried.jpg',
  woodenToys:          '/images/products/wooden-toys.jpg',
  rajasthaniEmbroidery:'/images/products/rajasthani-embroidery.jpg',
  mustardField:        '/images/products/mustard-field.jpg',
  saffronThreads:      '/images/products/saffron-threads.jpg',
  indianJewelry:       '/images/products/indian-jewelry.jpg',
  chennaBaskets:       '/images/products/chennai-baskets.jpg',
  artisanPainting:     '/images/products/artisan-painting.jpg',
  // reserved — not yet placed
  vadodaraPottery:     '/images/products/vadodara-pottery.jpg',
  ceramicVasesLamps:   '/images/products/ceramic-vases-lamps.jpg',

  // ── Collections ──────────────────────────────────────────────────────────
  keralaRiceFields:    '/images/collections/kerala-rice-fields.jpg',
  indiaFactoryWorkers: '/images/collections/india-factory-workers.jpg',

  // ── Regions ──────────────────────────────────────────────────────────────
  delhiMarket:         '/images/regions/delhi-market.jpg',
  mumbaiSkyline:       '/images/regions/mumbai-skyline.jpg',
  bengaluruCity:       '/images/regions/bengaluru-city.jpg',
  kolkataStreet:       '/images/regions/kolkata-street.jpg',

  // ── People ───────────────────────────────────────────────────────────────
  womanArtisanMarket:  '/images/people/woman-artisan-market.jpg',
  businessmanPortrait: '/images/people/businessman-portrait.jpg',
  sarahMitchell:       '/images/people/sarah-mitchell.jpg',
  pierreDubois:        '/images/people/pierre-dubois.jpg',
  aikoTanaka:          '/images/people/aiko-tanaka.jpg',
};
