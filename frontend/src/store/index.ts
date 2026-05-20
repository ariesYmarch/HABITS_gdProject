import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createUserSlice, UserSlice } from './slices/userSlice';
import { createHabitSlice, HabitSlice } from './slices/habitSlice';
import { createDiarySlice, DiarySlice } from './slices/diarySlice';
import { createScheduleSlice, ScheduleSlice } from './slices/scheduleSlice';
import { createThemeSlice, ThemeSlice } from './slices/themeSlice';
import { createAuthSlice, AuthSlice } from './slices/authSlice';

export type AppStore = UserSlice &
  HabitSlice &
  DiarySlice &
  ScheduleSlice &
  ThemeSlice &
  AuthSlice;

export const useAppStore = create<AppStore>()(
  persist(
    (...a) => ({
      ...createUserSlice(...a),
      ...createHabitSlice(...a),
      ...createDiarySlice(...a),
      ...createScheduleSlice(...a),
      ...createThemeSlice(...a),
      ...createAuthSlice(...a),
    }),
    {
      name: 'habits-app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // accessToken과 isAuthLoading은 메모리만 유지 (보안 + 휘발성)
      partialize: (state) => {
        const { accessToken, isAuthLoading, ...rest } = state;
        return rest;
      },
    },
  ),
);
