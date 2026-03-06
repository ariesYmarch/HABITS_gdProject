import { StateCreator } from 'zustand';
import { DiaryEntry } from '../../types/diary';

export interface DiarySlice {
  diaryEntries: DiaryEntry[];

  addDiaryEntry: (entry: Omit<DiaryEntry, 'id'>) => void;
  removeDiaryEntry: (id: string) => void;
  updateDiaryEntry: (id: string, updates: Partial<DiaryEntry>) => void;
  resetDiary: () => void;
}

export const createDiarySlice: StateCreator<DiarySlice> = (set) => ({
  diaryEntries: [],

  addDiaryEntry: (entryData) =>
    set((state) => ({
      diaryEntries: [
        ...state.diaryEntries,
        {
          ...entryData,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        },
      ],
    })),

  removeDiaryEntry: (id) =>
    set((state) => ({
      diaryEntries: state.diaryEntries.filter((e) => e.id !== id),
    })),

  updateDiaryEntry: (id, updates) =>
    set((state) => ({
      diaryEntries: state.diaryEntries.map((e) =>
        e.id === id ? { ...e, ...updates } : e,
      ),
    })),

  resetDiary: () => set({ diaryEntries: [] }),
});
