export interface UserSchedule {
  wakeUpTime: string;
  bedTime: string;
  lunchStartTime: string;
  lunchEndTime: string;
  hasCommute: boolean;
  commuteStartTime?: string;
  commuteEndTime?: string;
  workStartTime?: string;
  workEndTime?: string;
}

export type Occupation = '직장인' | '학생' | '기타';

export type TimetableSlotType =
  | 'sleep'
  | 'work'
  | 'commute'
  | 'meal'
  | 'free'
  | null;

// 7 days x 24 hours
export type TimetableData = (TimetableSlotType)[][];
