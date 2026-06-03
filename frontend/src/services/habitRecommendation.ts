/**
 * 습관 추천 서비스 — 사용자 일정·해시태그·직업 기반 Gemini 맞춤 추천.
 *
 * 흐름:
 *   1. 프론트 로컬 템플릿 풀에서 해시태그 매칭 + 일정 슬롯 블록 수로 1차 정렬
 *   2. 정렬된 후보를 /api/v1/recommendations/personalized 로 전송
 *   3. 백엔드의 Gemini가 각 습관에 최적 time_slot 배정 + reason 생성
 */
import api from './api';
import type { TimeSlot } from '../types/habit';

export interface PersonalizedRecommendation {
  template_id: number;
  title: string;
  emoji: string;
  duration: number;
  strengthen_tags: string[];
  time_slot: TimeSlot;
  reason: string;
}

export interface ScheduleForRecommend {
  wake_up_time?: string | null;
  bed_time?: string | null;
  lunch_start_time?: string | null;
  lunch_end_time?: string | null;
  has_commute: boolean;
  commute_start_time?: string | null;
  commute_end_time?: string | null;
  work_start_time?: string | null;
  work_end_time?: string | null;
  // 7일 × 24시간 그리드. 각 셀: 'sleep'|'work'|'commute'|'meal'|'free'|null
  weekly_timetable?: (string | null)[][];
}

export interface CandidateTemplate {
  id: number;
  title: string;
  emoji: string;
  category: string;
  estimated_minutes: number;
  strengthen_tags: string[];
}

export async function getPersonalizedRecommendations(
  schedule: ScheduleForRecommend,
  occupation: string | null,
  selectedHashtags: string[],
  candidates: CandidateTemplate[],
  count: number = 8,
): Promise<PersonalizedRecommendation[]> {
  try {
    const res = await api.post<{ recommendations: PersonalizedRecommendation[] }>(
      '/api/v1/recommendations/personalized',
      {
        schedule,
        occupation,
        selected_hashtags: selectedHashtags,
        candidates,
        count,
      },
    );
    return res.data.recommendations || [];
  } catch (e: any) {
    console.warn('[personalized recommend] failed:', e?.message || e);
    return [];
  }
}
