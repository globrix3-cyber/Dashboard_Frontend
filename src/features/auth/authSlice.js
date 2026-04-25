import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userRole: null,
  userName: null,
  token: null,
  showLogin: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.userRole = action.payload.userRole;
      state.userName = action.payload.userName;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.userRole = null;
      state.userName = null;
      state.token = null;
      state.showLogin = false;
    },
    toggleLogin: (state, action) => {
      state.showLogin = action.payload ?? !state.showLogin;
    },
  },
});

export const { setAuth, logout, toggleLogin } = authSlice.actions;
export default authSlice.reducer;