export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

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

export const countryFlag = (code) => {
  if (!code) return '';
  return code.toUpperCase().replace(/./g, (c) =>
    String.fromCodePoint(127397 + c.charCodeAt())
  );
};