import { useSelector, useDispatch } from 'react-redux';
import { toggleCurrency } from '../features/currency/currencySlice';

export function useCurrency() {
  const { currency, usdRate } = useSelector((s) => s.currency);
  const dispatch = useDispatch();

  const fmt = (amount) => {
    const n = Number(amount) || 0;
    if (!n) return 'On request';
    if (currency === 'USD' && usdRate) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency', currency: 'USD', maximumFractionDigits: 2,
      }).format(n * usdRate);
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0,
    }).format(n);
  };

  return {
    currency,
    symbol:  currency === 'USD' ? '$' : '₹',
    usdRate,
    fmt,
    toggle: () => dispatch(toggleCurrency()),
    loading: currency === 'USD' && !usdRate,
  };
}
