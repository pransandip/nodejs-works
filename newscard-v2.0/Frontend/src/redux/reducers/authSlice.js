import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAdmin: null,
  role: null,
  auth: null,
  signingOut: false,
  newUser: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    restore_token: (state, action) => {
      state.user = action.payload;
      state.signingOut = false;
    },
    sign_in: (state, action) => {
      state.user = action.payload;
      state.signingOut = false;
    },
    sign_out: (state, action) => {
      state.user = null;
      state.auth = null;
      state.role = null;
      state.isAdmin = null;
      state.signingOut = true;
    },
    read_auth: (state, action) => {
      state.isAdmin = action.payload.isAdmin;
      state.role = action.payload.role;
    },
    read_profile: (state, action) => {
      state.user = {
        ...action.payload,
      };
    },
  },
});

export const { restore_token, sign_in, sign_out, read_auth, read_profile } =
  authSlice.actions;
export const selectAuth = (state) => state.auth;
export default authSlice.reducer;
