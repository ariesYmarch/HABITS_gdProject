import { StateCreator } from 'zustand';
import { DiaryEntry } from '../../types/diary';

const now = () => new Date().toISOString();

export interface DiarySlice {
  diaryEntries: DiaryEntry[];

  addDiaryEntry: (entry: Omit<DiaryEntry, 'id'>) => string;  // 생성된 id 반환
  removeDiaryEntry: (id: string) => void;       // soft delete
  updateDiaryEntry: (id: string, updates: Partial<DiaryEntry>) => void;
  resetDiary: () => void;

  // sync 관련
  upsertDiaries: (incoming: DiaryEntry[]) => void;
}

export const createDiarySlice: StateCreator<DiarySlice> = (set) => ({
  diaryEntries: [],

  addDiaryEntry: (entryData) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    set((state) => ({
      diaryEntries: [
        ...state.diaryEntries,
        { ...entryData, id, updatedAt: now() },
      ],
    }));
    return id;
  },

  removeDiaryEntry: (id) =>
    set((state) => ({
      diaryEntries: state.diaryEntries.map((e) =>
        e.id === id ? { ...e, deletedAt: now(), updatedAt: now() } : e,
      ),
    })),

  updateDiaryEntry: (id, updates) =>
    set((state) => ({
      diaryEntries: state.diaryEntries.map((e) =>
        e.id === id ? { ...e, ...updates, updatedAt: now() } : e,
      ),
    })),

  resetDiary: () => set({ diaryEntries: [] }),

  upsertDiaries: (incoming) =>
    set((state) => {
      const byId = new Map(state.diaryEntries.map((d) => [d.id, d]));
      for (const inc of incoming) {
        const existing = byId.get(inc.id);
        if (!existing) {
          byId.set(inc.id, inc);
          continue;
        }
        const existingTime = existing.updatedAt ? Date.parse(existing.updatedAt) : 0;
        const incTime = inc.updatedAt ? Date.parse(inc.updatedAt) : 0;
        if (incTime > existingTime) {
          byId.set(inc.id, inc);
        }
      }
      return { diaryEntries: Array.from(byId.values()) };
    }),
});
