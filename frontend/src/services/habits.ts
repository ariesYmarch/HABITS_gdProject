import api from './api';

export interface GraduationCandidate {
  habit_id: number;
  habit_title: string;
  completion_rate: number;
  positive_emotion_ratio: number;
  weeks_evaluated: number;
  message: string;
}

export async function listGraduationCandidates(): Promise<GraduationCandidate[]> {
  const res = await api.get<{ count: number; candidates: GraduationCandidate[] }>(
    '/api/v1/habits/graduation-candidates',
  );
  return res.data.candidates;
}

export async function graduateHabit(habitId: number): Promise<void> {
  await api.post(`/api/v1/habits/${habitId}/graduate`);
}
