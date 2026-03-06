export type HabitFrequency =
  | 'daily'
  | 'weekdays'
  | 'weekends'
  | { type: 'custom'; days: number[] };

export type TimeSlot =
  | 'morning'
  | 'commute'
  | 'lunch'
  | 'afternoon'
  | 'evening'
  | 'bedtime'
  | 'anytime';

export interface Habit {
  id: string;
  title: string;
  emoji: string;
  hashtags: string[];
  frequency: HabitFrequency;
  timeSlot: TimeSlot;
  duration: number; // minutes
  completionHistory: Record<string, boolean>; // dateString -> completed
  isActive: boolean;
  createdDate: string;
  deactivatedDate?: string;
}

export interface HabitTemplateItem {
  id: number;
  title: string;
  emoji: string;
  category: HabitTemplateCategory;
  contexts: HabitContext[];
  strengthenTags: string[];
  estimatedMinutes: number;
  difficulty: number; // 1-3
}

export type HabitTemplateCategory =
  | 'morningRitual'
  | 'commute'
  | 'productivity'
  | 'learning'
  | 'health'
  | 'relationship'
  | 'mindset'
  | 'finance'
  | 'evening'
  | 'periodic';

export type HabitContext =
  | 'wakeUp'
  | 'morning'
  | 'beforeOut'
  | 'commute'
  | 'work'
  | 'lunch'
  | 'study'
  | 'leisure'
  | 'hobby'
  | 'exercise'
  | 'meal'
  | 'daily'
  | 'relationship'
  | 'mindset'
  | 'rest'
  | 'beforeBed'
  | 'evening'
  | 'finance'
  | 'lifestyle'
  | 'weekly'
  | 'monthly'
  | 'weekend';

export interface HabitRecommendation {
  id: number;
  template: HabitTemplateItem;
  matchScore: number; // 0-1
  reasons: string[];
}
