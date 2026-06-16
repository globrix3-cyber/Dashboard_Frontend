import { configureStore } from "@reduxjs/toolkit";
import authReducer     from "../features/auth/authSlice";
import currencyReducer from "../features/currency/currencySlice";

export const store = configureStore({
  reducer: {
    auth:     authReducer,
    currency: currencyReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Optional helpers (no TypeScript)
export const getRootState = () => store.getState();
export const getAppDispatch = () => store.dispatch;