import { createAsyncThunk } from '@reduxjs/toolkit';
import { User, TokenPair, AuthCredentials } from '../../utils/types';
import Endpoints from '../../utils/endpoints';
import { saveTokens, saveUser, clearTokens, clearUser } from '../../utils/mmkvStorage';
import apiClient from '../../services/apiClient';

// ─── Login ───────────────────────────────────────────────────────────────────
export const loginAction = createAsyncThunk<
  { user: User; token: TokenPair },
  AuthCredentials,
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await apiClient.post(Endpoints.auth.login, credentials);
    const { user, token } = response.data.data;
    saveTokens(token);
    saveUser(user);
    return { user, token };
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ?? 'Login failed',
    );
  }
});

// ─── Logout ───────────────────────────────────────────────────────────────────
export const logoutAction = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await apiClient.post(Endpoints.auth.logout);
    } catch {
      // Proceed with local logout even if API fails
    } finally {
      clearTokens();
      clearUser();
    }
  },
);

// ─── Fetch Current User ───────────────────────────────────────────────────────
export const fetchMeAction = createAsyncThunk<User, void, { rejectValue: string }>(
  'auth/fetchMe',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(Endpoints.auth.me);
      const user: User = response.data.data;
      saveUser(user);
      return user;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ?? 'Failed to fetch user',
      );
    }
  },
);
