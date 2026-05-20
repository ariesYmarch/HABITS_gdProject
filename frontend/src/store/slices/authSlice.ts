import { StateCreator } from 'zustand';
import api from '../../services/api';

export interface AuthUser {
  id: number;
  email: string;
  nickname: string;
  occupation?: string | null;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string | null;
}

export interface AuthSlice {
  // State
  accessToken: string | null; // 메모리만 (persist 제외)
  refreshToken: string | null;
  user: AuthUser | null;
  lastUserId: number | null;  // 사용자 전환 감지용 — logout에도 보존
  isAuthLoading: boolean;

  // Actions
  setTokens: (access: string, refresh: string) => void;
  setUser: (user: AuthUser | null) => void;
  clearAuth: () => void;

  register: (email: string, password: string, nickname: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<boolean>;
  loadCurrentUser: () => Promise<boolean>;
  requestPasswordReset: (email: string) => Promise<void>;
  confirmPasswordReset: (token: string, newPassword: string) => Promise<void>;
}

const mapUser = (raw: any): AuthUser => ({
  id: raw.id,
  email: raw.email,
  nickname: raw.nickname,
  occupation: raw.occupation,
  isActive: raw.is_active,
  createdAt: raw.created_at,
  lastLoginAt: raw.last_login_at,
});

export const createAuthSlice: StateCreator<AuthSlice> = (set, get) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  lastUserId: null,
  isAuthLoading: false,

  setTokens: (access, refresh) =>
    set({ accessToken: access, refreshToken: refresh }),

  setUser: (user) => set({ user }),

  // lastUserId는 의도적으로 유지 — 다음 로그인이 같은 사용자인지 다른 사용자인지 판별용
  clearAuth: () =>
    set({ accessToken: null, refreshToken: null, user: null }),

  register: async (email, password, nickname) => {
    set({ isAuthLoading: true });
    try {
      // 신규 가입 → 디바이스에 다른 사용자 흔적이 있다면 로컬 데이터 초기화
      const hadPreviousUser = get().lastUserId !== null;
      if (hadPreviousUser) {
        const store = require('../index').useAppStore.getState();
        store.resetUser?.();
        store.resetHabits?.();
        store.resetDiary?.();
        store.resetSchedule?.();
        (globalThis as any).__sync_lastSyncedAt = null;
      }

      await api.post('/api/v1/auth/register', { email, password, nickname });
      // 가입 후 자동 로그인 (login()이 lastUserId를 갱신함)
      await get().login(email, password);
    } finally {
      set({ isAuthLoading: false });
    }
  },

  login: async (email, password) => {
    set({ isAuthLoading: true });
    try {
      // 디바이스에 마지막으로 로그인했던 사용자 ID (loadCurrentUser가 갱신하기 전에 캡처)
      const previousUserId = get().lastUserId;

      const res = await api.post('/api/v1/auth/login', { email, password });
      set({
        accessToken: res.data.access_token,
        refreshToken: res.data.refresh_token,
      });
      // loadCurrentUser는 user + lastUserId 둘 다 갱신
      await get().loadCurrentUser();

      const newUserId = get().user?.id ?? null;

      // 다른 사용자로 로그인 감지 → 이전 사용자의 로컬 데이터 초기화
      if (previousUserId !== null && newUserId !== null && previousUserId !== newUserId) {
        console.log('[auth] 사용자 전환 감지:', previousUserId, '→', newUserId, ', 로컬 데이터 초기화');
        const store = require('../index').useAppStore.getState();
        store.resetUser?.();
        store.resetHabits?.();
        store.resetDiary?.();
        store.resetSchedule?.();
        (globalThis as any).__sync_lastSyncedAt = null;
      }
    } finally {
      set({ isAuthLoading: false });
    }
  },

  logout: async () => {
    const access = get().accessToken;
    if (access) {
      try {
        await api.post(
          '/api/v1/auth/logout',
          {},
          { headers: { Authorization: `Bearer ${access}` } },
        );
      } catch {
        // 서버 응답 실패해도 로컬은 정리
      }
    }
    // 토큰만 지우고 로컬 데이터(habits/diaries/personality/schedule/userName 등)는 유지.
    // 같은 사용자가 재로그인하면 그대로 사용, 다른 사용자가 로그인하면 login()에서 감지해 초기화.
    get().clearAuth();
  },

  refreshTokens: async () => {
    const refresh = get().refreshToken;
    if (!refresh) return false;
    try {
      const res = await api.post('/api/v1/auth/refresh', {
        refresh_token: refresh,
      });
      set({
        accessToken: res.data.access_token,
        refreshToken: res.data.refresh_token,
      });
      return true;
    } catch {
      get().clearAuth();
      return false;
    }
  },

  loadCurrentUser: async () => {
    const access = get().accessToken;
    if (!access) return false;
    try {
      const res = await api.get('/api/v1/auth/me', {
        headers: { Authorization: `Bearer ${access}` },
      });
      const mapped = mapUser(res.data);
      set({ user: mapped });
      // 자동 로그인(refreshTokens 경로)에서도 lastUserId 동기화 → 다음 계정 전환 감지 가능
      if (mapped.id != null) {
        set({ lastUserId: mapped.id });
      }
      return true;
    } catch {
      return false;
    }
  },

  requestPasswordReset: async (email) => {
    await api.post('/api/v1/auth/password-reset', { email });
  },

  confirmPasswordReset: async (token, newPassword) => {
    await api.post('/api/v1/auth/password-reset/confirm', {
      token,
      new_password: newPassword,
    });
  },
});
