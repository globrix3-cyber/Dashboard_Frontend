import { useSelector, useDispatch } from 'react-redux';
import { setCurrency } from '../features/currency/currencySlice';

export const CURRENCIES = [
  { code: 'INR', symbol: '₹',   label: 'Indian Rupee'      },
  { code: 'USD', symbol: '$',   label: 'US Dollar'         },
  { code: 'EUR', symbol: '€',   label: 'Euro'              },
  { code: 'GBP', symbol: '£',   label: 'British Pound'     },
  { code: 'AUD', symbol: 'A$',  label: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$',  label: 'Canadian Dollar'   },
  { code: 'SGD', symbol: 'S$',  label: 'Singapore Dollar'  },
  { code: 'AED', symbol: 'AED', label: 'UAE Dirham'        },
  { code: 'SAR', symbol: 'SAR', label: 'Saudi Riyal'       },
];

export function useCurrency() {
  const { currency, rates } = useSelector((s) => s.currency);
  const dispatch = useDispatch();

  const rate = currency === 'INR' ? 1 : rates[currency.toLowerCase()];

  const fmt = (amount) => {
    const n = Number(amount) || 0;
    if (!n) return 'On request';
    if (currency === 'INR' || !rate) {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency', currency: 'INR', maximumFractionDigits: 0,
      }).format(n);
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency', currency, maximumFractionDigits: 2,
    }).format(n * rate);
  };

  return {
    currency,
    symbol: CURRENCIES.find(c => c.code === currency)?.symbol || currency,
    currencies: CURRENCIES,
    fmt,
    setCurrency: (code) => dispatch(setCurrency(code)),
    loading: currency !== 'INR' && !rate,
  };
}
