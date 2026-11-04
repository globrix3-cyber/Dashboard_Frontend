import { useEffect } from 'react';

const SITE_URL  = 'https://www.globrixa.com';
const SITE_NAME = 'Globrixa';

// Tags the hook manages: [selector attribute, key, content attribute].
const TAGS = {
  description:   ['name',     'description'],
  ogTitle:       ['property', 'og:title'],
  ogDescription: ['property', 'og:description'],
  ogImage:       ['property', 'og:image'],
  ogUrl:         ['property', 'og:url'],
  ogType:        ['property', 'og:type'],
  twTitle:       ['name',     'twitter:title'],
  twDescription: ['name',     'twitter:description'],
  twImage:       ['name',     'twitter:image'],
};

const clip = (s, n = 160) => {
  const t = String(s || '').replace(/\s+/g, ' ').trim();
  return t.length > n ? `${t.slice(0, n - 1).trimEnd()}…` : t;
};

const absUrl = (u) => {
  if (!u) return '';
  try { return new URL(u, SITE_URL).href; } catch { return ''; }
};

// Set a <meta> tag's content; returns an undo function.
function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  const created = !el;
  const prev = el?.getAttribute('content');
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
  return () => {
    if (created) el.remove();
    else if (prev != null) el.setAttribute('content', prev);
  };
}

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  const created = !el;
  const prev = el?.getAttribute('href');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
  return () => {
    if (created) el.remove();
    else if (prev != null) el.setAttribute('href', prev);
  };
}

/**
 * Per-page <title>, meta description, canonical, Open Graph/Twitter tags and
 * optional JSON-LD. Everything is restored/removed on unmount.
 *
 *   usePageMeta({ title, description, image, path, type, jsonLd })
 *
 * - title:  page title; " | Globrixa" is appended unless it already mentions it
 * - path:   canonical path (defaults to the current pathname, query stripped)
 * - jsonLd: object (or array of objects) rendered as application/ld+json
 */
export default function usePageMeta({ title, description, image, path, type, jsonLd } = {}) {
  const jsonLdText = jsonLd ? JSON.stringify(jsonLd) : '';

  useEffect(() => {
    const undo = [];
    const fullTitle = title
      ? (title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`)
      : null;
    const desc = description ? clip(description) : null;
    const url  = `${SITE_URL}${path || window.location.pathname}`;
    const img  = absUrl(image);

    if (fullTitle) {
      const prevTitle = document.title;
      document.title = fullTitle;
      undo.push(() => { document.title = prevTitle; });
      undo.push(setMeta(...TAGS.ogTitle, fullTitle));
      undo.push(setMeta(...TAGS.twTitle, fullTitle));
    }
    if (desc) {
      undo.push(setMeta(...TAGS.description, desc));
      undo.push(setMeta(...TAGS.ogDescription, desc));
      undo.push(setMeta(...TAGS.twDescription, desc));
    }
    if (img) {
      undo.push(setMeta(...TAGS.ogImage, img));
      undo.push(setMeta(...TAGS.twImage, img));
    }
    if (type) undo.push(setMeta(...TAGS.ogType, type));
    undo.push(setMeta(...TAGS.ogUrl, url));
    undo.push(setCanonical(url));

    if (jsonLdText) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-page-meta', '');
      // Escape "<" so a product name can never close the script tag.
      script.textContent = jsonLdText.replace(/</g, '\\u003c');
      document.head.appendChild(script);
      undo.push(() => script.remove());
    }

    return () => { undo.reverse().forEach(fn => fn()); };
  }, [title, description, image, path, type, jsonLdText]);
}
