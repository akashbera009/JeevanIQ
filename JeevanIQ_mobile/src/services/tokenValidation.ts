import { getAccessToken, getRefreshToken, saveTokens, clearTokens, clearUser } from '../utils/mmkvStorage';
import apiClient from './apiClient';
import Endpoints from '../utils/endpoints';

interface TokenValidationResult {
  isValid: boolean;
  refreshed: boolean;
}

/**
 * Validates the current access token.
 * If expired, attempts a silent refresh.
 * Returns whether the session is still valid.
 */
export const validateAndRefreshToken = async (): Promise<TokenValidationResult> => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  if (!accessToken || !refreshToken) {
    return { isValid: false, refreshed: false };
  }

  try {
    // Try calling /auth/me to verify the access token is still valid
    await apiClient.get(Endpoints.auth.me);
    return { isValid: true, refreshed: false };
  } catch (error: any) {
    if (error?.response?.status === 401) {
      // Token expired — try silent refresh
      try {
        const response = await apiClient.post(Endpoints.auth.refresh, {
          refresh: refreshToken,
        });
        const { access, refresh } = response.data.data;
        saveTokens({ access, refresh });
        return { isValid: true, refreshed: true };
      } catch {
        clearTokens();
        clearUser();
        return { isValid: false, refreshed: false };
      }
    }
    // Some other error (network, etc.) — assume token is still valid
    return { isValid: true, refreshed: false };
  }
};

/**
 * Decode JWT payload (no verification — for display only)
 */
export const decodeJwt = (token: string): Record<string, any> | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    // const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const decoded = ''  // need fuuture polyfill for atob in React Native
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

/**
 * Check if JWT is expired (client-side only)
 */
export const isTokenExpired = (token: string): boolean => {
  const payload = decodeJwt(token);
  if (!payload?.exp) return true;
  return Date.now() / 1000 > payload.exp;
};