import { StateCreator } from 'zustand';
import { Habit, HabitFrequency, TimeSlot } from '../../types/habit';

const now = () => new Date().toISOString();

export interface HabitSlice {
  habits: Habit[];

  addHabit: (habit: Omit<Habit, 'id' | 'completionHistory' | 'isActive' | 'createdDate'>) => void;
  removeHabit: (id: string) => void;          // soft delete (deletedAt 설정, sync 후 영구 제거 가능)
  toggleHabitCompletion: (habitId: string, dateString: string) => void;
  deactivateHabit: (id: string) => void;
  updateHabitFrequency: (id: string, frequency: HabitFrequency) => void;
  updateHabit: (id: string, updates: Partial<Pick<Habit, 'frequency' | 'timeSlot' | 'duration' | 'title' | 'emoji'>>) => void;
  reorderHabits: (habits: Habit[]) => void;
  resetHabits: () => void;

  // sync 관련
  upsertHabits: (incoming: Habit[]) => void;  // 서버 pull 결과 LWW 머지
}

export const createHabitSlice: StateCreator<HabitSlice> = (set) => ({
  habits: [],

  addHabit: (habitData) =>
    set((state) => ({
      habits: [
        ...state.habits,
        {
          ...habitData,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          completionHistory: {},
          isActive: true,
          createdDate: new Date().toISOString(),
          updatedAt: now(),
        },
      ],
    })),

  removeHabit: (id) =>
    set((state) => ({
      habits: state.habits.map((h) =>
        h.id === id
          ? { ...h, deletedAt: now(), updatedAt: now() }
          : h,
      ),
    })),

  toggleHabitCompletion: (habitId, dateString) =>
    set((state) => ({
      habits: state.habits.map((h) => {
        if (h.id !== habitId) return h;
        const history = { ...h.completionHistory };
        if (history[dateString]) {
          delete history[dateString];
        } else {
          history[dateString] = true;
        }
        return { ...h, completionHistory: history, updatedAt: now() };
      }),
    })),

  deactivateHabit: (id) =>
    set((state) => ({
      habits: state.habits.map((h) =>
        h.id === id
          ? { ...h, isActive: false, deactivatedDate: now(), updatedAt: now() }
          : h,
      ),
    })),

  updateHabitFrequency: (id, frequency) =>
    set((state) => ({
      habits: state.habits.map((h) =>
        h.id === id ? { ...h, frequency, updatedAt: now() } : h,
      ),
    })),

  updateHabit: (id, updates) =>
    set((state) => ({
      habits: state.habits.map((h) =>
        h.id === id ? { ...h, ...updates, updatedAt: now() } : h,
      ),
    })),

  reorderHabits: (habits) => set({ habits }),

  resetHabits: () => set({ habits: [] }),

  upsertHabits: (incoming) =>
    set((state) => {
      const byId = new Map(state.habits.map((h) => [h.id, h]));
      for (const inc of incoming) {
        const existing = byId.get(inc.id);
        if (!existing) {
          byId.set(inc.id, inc);
          continue;
        }
        // LWW: 더 최근 updatedAt을 가진 쪽 채택
        const existingTime = existing.updatedAt ? Date.parse(existing.updatedAt) : 0;
        const incTime = inc.updatedAt ? Date.parse(inc.updatedAt) : 0;
        if (incTime > existingTime) {
          byId.set(inc.id, inc);
        }
      }
      return { habits: Array.from(byId.values()) };
    }),
});
