import { createSlice } from '@reduxjs/toolkit';

const currencySlice = createSlice({
  name: 'currency',
  initialState: {
    currency: localStorage.getItem('currency') || 'INR',
    usdRate: null, // fetched from live exchange API on app load
  },
  reducers: {
    toggleCurrency: (state) => {
      state.currency = state.currency === 'INR' ? 'USD' : 'INR';
      localStorage.setItem('currency', state.currency);
    },
    setUsdRate: (state, action) => {
      state.usdRate = action.payload;
    },
  },
});

export const { toggleCurrency, setUsdRate } = currencySlice.actions;
export default currencySlice.reducer;
