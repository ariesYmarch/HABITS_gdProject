import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { Platform } from 'react-native';

// 개발 환경 기본값. 배포 시 .env 또는 빌드 설정으로 교체.
const API_URL = Platform.select({
  ios: 'http://localhost:8000',
  android: 'http://10.0.2.2:8000',
});

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// 인증 인터셉터에서 제외할 경로 (무한 루프 방지)
const AUTH_EXEMPT_PATHS = [
  '/api/v1/auth/login',
  '/api/v1/auth/register',
  '/api/v1/auth/refresh',
  '/api/v1/auth/password-reset',
  '/api/v1/auth/password-reset/confirm',
];

const isAuthExempt = (url?: string) => {
  if (!url) return false;
  return AUTH_EXEMPT_PATHS.some((p) => url.includes(p));
};

// store는 순환 참조 방지를 위해 lazy import
const getStore = () => require('../store').useAppStore.getState();

// === Request interceptor ===
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (!isAuthExempt(config.url) && !config.headers.Authorization) {
    const token = getStore().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// === Response interceptor (401 → refresh 재시도) ===
let refreshPromise: Promise<boolean> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isAuthExempt(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // 동시 401 요청들이 refresh를 한 번만 호출하도록 promise 공유
    if (!refreshPromise) {
      refreshPromise = getStore()
        .refreshTokens()
        .finally(() => {
          refreshPromise = null;
        });
    }

    const refreshed = await refreshPromise;

    if (!refreshed) {
      // refresh 실패 → 이미 clearAuth 호출됨
      return Promise.reject(error);
    }

    // 새 access token으로 원래 요청 재시도
    const newToken = getStore().accessToken;
    if (newToken) {
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
    }
    return api(originalRequest as AxiosRequestConfig);
  },
);

export default api;
