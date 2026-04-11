import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, TokenPair } from '../../utils/types';
import { authInitialState } from '../../modals';
import {
  loginAction,
  logoutAction,
  fetchMeAction,
} from './authActions';

const authSlice = createSlice({
  name: 'auth',
  initialState: authInitialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setToken: (state, action: PayloadAction<TokenPair>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
    clearAuth: state => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: state => {
      state.error = null;
    },
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
  },
  extraReducers: builder => {
    // ─── Login ───────────────────────────────────────────
    builder
      .addCase(loginAction.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginAction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // ─── Logout ─────────────────────────────────────────────
    builder.addCase(logoutAction.fulfilled, state => {
      Object.assign(state, authInitialState);
    });

    // ─── Fetch Me ────────────────────────────────────────────
    builder
      .addCase(fetchMeAction.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const {
  setUser,
  setToken,
  clearAuth,
  clearError,
  setAuthenticated,
} = authSlice.actions;

export default authSlice.reducer;
