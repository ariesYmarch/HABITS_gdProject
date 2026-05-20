import api from './api';

export interface FeedbackResponse {
  available: boolean;
  reason?: string;
  actual?: Record<string, number>;
  period_start?: string;
  period_end?: string;
  completion_rate?: number;
  completion_count?: number;
  expected_count?: number;
  diary_count?: number;
  analyzed_diary_count?: number;
  avg_mood?: number | null;
  emotion_distribution?: Record<string, number>;
  exception?: { triggered: boolean; reasons: string[] };
  feedback?: {
    source: string;
    message: string;
    static_pattern: string;
    matched_emotions: string[];
  };
  low_completion_suggestion?: {
    habit_id: number;
    habit_title: string;
    completion_rate: number;
    options: { kind: string; message: string }[];
  };
}

export async function getWeeklyFeedback(weekStart?: string): Promise<FeedbackResponse> {
  const res = await api.get<FeedbackResponse>('/api/v1/feedback/weekly', {
    params: weekStart ? { week_start: weekStart } : {},
  });
  return res.data;
}

export async function getMonthlyFeedback(month?: string): Promise<FeedbackResponse> {
  const res = await api.get<FeedbackResponse>('/api/v1/feedback/monthly', {
    params: month ? { month } : {},
  });
  return res.data;
}

export interface SatisfactionPoint {
  id: number;
  rating: 'good' | 'neutral' | 'bad';
  score: number;        // -1 / 0 / 1
  period_type: 'weekly' | 'monthly';
  period_start: string;
  source: string | null;
  created_at: string | null;
}

export interface SatisfactionTrend {
  count: number;
  avg_score: number;
  points: SatisfactionPoint[];
}

export async function getSatisfactionTrend(days: number = 90): Promise<SatisfactionTrend> {
  const res = await api.get<SatisfactionTrend>('/api/v1/feedback/satisfaction-trend', {
    params: { days },
  });
  return res.data;
}
