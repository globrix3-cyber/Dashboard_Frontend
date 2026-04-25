import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";   // Adjust path if needed

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Optional helpers (no TypeScript)
export const getRootState = () => store.getState();
export const getAppDispatch = () => store.dispatch;