import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { API_BASE_URL, API_TIMEOUT, STORAGE_KEYS } from '../utils/constants';
import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearTokens,
  clearUser,
} from '../utils/mmkvStorage';
import { showError } from '../utils/showSnackbar';
import Strings from '../utils/strings';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);
// Add Logging in Request Interceptor
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 🔍 LOG REQUEST
    console.log("🚀 API REQUEST:");
    console.log("URL:", `${config.baseURL}${config.url}`);
    console.log("METHOD:", config.method?.toUpperCase());
    console.log("HEADERS:", config.headers);
    console.log("PARAMS:", config.params);
    console.log("DATA (payload):", config.data);

    return config;
  },
  error => Promise.reject(error),
);
// ─── Response Interceptor ─────────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async error => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 — token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = await getRefreshToken();

      if (!refreshToken) {
        clearTokens();
        clearUser();
        processQueue(error, null);
        isRefreshing = false;
        showError(Strings.errorUnauthorized);
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });
        const { access, refresh } = response.data.data;
        saveTokens({ access, refresh });
        processQueue(null, access);
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        clearTokens();
        clearUser();
        processQueue(refreshError, null);
        showError(Strings.errorUnauthorized);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle network error
    if (!error.response) {
      showError(Strings.errorNetwork);
    }

    return Promise.reject(error);
  },
);

export default apiClient;