import { StateCreator } from 'zustand';
import { Habit, HabitFrequency, TimeSlot } from '../../types/habit';

export interface HabitSlice {
  habits: Habit[];

  addHabit: (habit: Omit<Habit, 'id' | 'completionHistory' | 'isActive' | 'createdDate'>) => void;
  removeHabit: (id: string) => void;
  toggleHabitCompletion: (habitId: string, dateString: string) => void;
  deactivateHabit: (id: string) => void;
  updateHabitFrequency: (id: string, frequency: HabitFrequency) => void;
  reorderHabits: (habits: Habit[]) => void;
  resetHabits: () => void;
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
        },
      ],
    })),

  removeHabit: (id) =>
    set((state) => ({
      habits: state.habits.filter((h) => h.id !== id),
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
        return { ...h, completionHistory: history };
      }),
    })),

  deactivateHabit: (id) =>
    set((state) => ({
      habits: state.habits.map((h) =>
        h.id === id
          ? { ...h, isActive: false, deactivatedDate: new Date().toISOString() }
          : h,
      ),
    })),

  updateHabitFrequency: (id, frequency) =>
    set((state) => ({
      habits: state.habits.map((h) =>
        h.id === id ? { ...h, frequency } : h,
      ),
    })),

  reorderHabits: (habits) => set({ habits }),

  resetHabits: () => set({ habits: [] }),
});
