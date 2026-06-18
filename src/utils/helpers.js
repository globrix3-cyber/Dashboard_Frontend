export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const statusColor = (status) => {
  const map = {
    active: 'badge-success', confirmed: 'badge-success', accepted: 'badge-success',
    pending: 'badge-warning', in_production: 'badge-info', shipped: 'badge-info',
    closed: 'badge-danger',  rejected: 'badge-danger',
  };
  return map[status] || 'badge-info';
};

export const statusLabel = (status) =>
  status?.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || '';

// Converts Google Drive share links to Google's image-serving thumbnail URL.
// drive.google.com/uc?export=view no longer works reliably in <img> tags
// (Google redirects to a consent page). The thumbnail endpoint serves raw
// image bytes and works for publicly-shared files.
// Input:  https://drive.google.com/file/d/FILE_ID/view?usp=sharing
// Output: https://lh3.googleusercontent.com/d/FILE_ID
export const resolveImageUrl = (url) => {
  if (!url) return url;
  const m = url.match(/drive\.google\.com\/file\/d\/([^/?#]+)/);
  if (m) return `https://lh3.googleusercontent.com/d/${m[1]}`;
  return url;
};

export const countryFlag = (code) => {
  if (!code) return '';
  return code.toUpperCase().replace(/./g, (c) =>
    String.fromCodePoint(127397 + c.charCodeAt())
  );
};