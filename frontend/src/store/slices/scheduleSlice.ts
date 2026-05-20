import { StateCreator } from 'zustand';
import { UserSchedule, TimetableData, TimetableSlotType } from '../../types/user';

export interface ScheduleSlice {
  schedule: UserSchedule;
  timetableData: TimetableData;

  setSchedule: (schedule: Partial<UserSchedule>) => void;
  setTimetableData: (data: TimetableData) => void;
  updateTimetableSlot: (day: number, hour: number, type: TimetableSlotType) => void;
  resetSchedule: () => void;
}

const defaultSchedule: UserSchedule = {
  wakeUpTime: '07:00',
  bedTime: '23:00',
  lunchStartTime: '12:00',
  lunchEndTime: '13:00',
  hasCommute: false,
};

// 7 days x 24 hours, all null initially
const createEmptyTimetable = (): TimetableData =>
  Array.from({ length: 7 }, () => Array(24).fill(null));

export const createScheduleSlice: StateCreator<ScheduleSlice> = (set) => ({
  schedule: defaultSchedule,
  timetableData: createEmptyTimetable(),

  setSchedule: (updates) =>
    set((state) => ({
      schedule: { ...state.schedule, ...updates },
    })),

  setTimetableData: (data) => set({ timetableData: data }),

  updateTimetableSlot: (day, hour, type) =>
    set((state) => {
      const newData = state.timetableData.map((row) => [...row]);
      newData[day][hour] = type;
      return { timetableData: newData };
    }),

  resetSchedule: () =>
    set({
      schedule: defaultSchedule,
      timetableData: createEmptyTimetable(),
    }),
});
