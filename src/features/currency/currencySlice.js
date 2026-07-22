import { createSlice } from '@reduxjs/toolkit';

const currencySlice = createSlice({
  name: 'currency',
  initialState: {
    currency: localStorage.getItem('currency') || 'INR',
    rates: {}, // INR-based rates fetched from live exchange API on app load, keyed by lowercase code
  },
  reducers: {
    setCurrency: (state, action) => {
      state.currency = action.payload;
      localStorage.setItem('currency', action.payload);
    },
    setRates: (state, action) => {
      state.rates = action.payload;
    },
  },
});

export const { setCurrency, setRates } = currencySlice.actions;
export default currencySlice.reducer;
