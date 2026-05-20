/**
 * 습관 추천 서비스 — Recombee 연결점
 *
 * 용도:
 * 1. 온보딩 시 초기 습관 추천 (해시태그 + 성격유형 기반)
 * 2. 일정 + 해시태그 결합 맞춤 추천
 * 3. 감정 변화 추적 → 리포트에서 새로운 습관 추천
 *
 * 연결 방법:
 * 1. Recombee 계정 생성 + DB 설정
 * 2. RECOMBEE_DB_ID, RECOMBEE_API_TOKEN 설정
 * 3. 습관 템플릿 데이터를 Recombee에 업로드
 * 4. 사용자 인터랙션(습관 완료, 감정 기록) 이벤트 전송
 */

// TODO: Recombee 계정 설정 후 실제 값으로 교체
const RECOMBEE_DB_ID = '';
const RECOMBEE_API_TOKEN = '';
const RECOMBEE_API_URL = RECOMBEE_DB_ID
  ? `https://rapi.recombee.com/${RECOMBEE_DB_ID}`
  : '';

export interface RecommendedHabit {
  templateId: number;
  title: string;
  emoji: string;
  matchScore: number;       // 0-1
  reasons: string[];         // 추천 이유
}

export interface RecommendationContext {
  userId: string;
  hashtags: string[];        // 선택된 해시태그
  schedule?: object;         // 사용자 일정
  emotionTrend?: number[];   // 최근 감정 점수 추이
  completionRate?: number;   // 최근 습관 이행률
}

/**
 * 사용자 맥락에 기반한 습관 추천
 *
 * @param context - 추천에 사용할 사용자 정보
 * @param count - 추천 개수
 * @returns 추천 습관 목록
 */
export async function getHabitRecommendations(
  context: RecommendationContext,
  count: number = 5,
): Promise<RecommendedHabit[]> {
  // API 미연결 시 빈 결과 → 기존 로컬 추천 로직으로 fallback
  if (!RECOMBEE_API_URL) {
    return [];
  }

  try {
    const response = await fetch(
      `${RECOMBEE_API_URL}/recomms/users/${context.userId}/items/?count=${count}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${RECOMBEE_API_TOKEN}`,
        },
        body: JSON.stringify({
          filter: context.hashtags.length > 0
            ? `'tags' in ${JSON.stringify(context.hashtags)}`
            : undefined,
          booster: context.emotionTrend
            ? `if 'mood_boost' then 1.5 else 1`
            : undefined,
        }),
      },
    );

    if (!response.ok) {
      console.warn('[HabitRecommendation] API error:', response.status);
      return [];
    }

    const data = await response.json();
    return (data.recomms ?? []).map((r: any) => ({
      templateId: r.id,
      title: r.values?.title ?? '',
      emoji: r.values?.emoji ?? '🎯',
      matchScore: r.relevance ?? 0,
      reasons: r.values?.reasons ?? [],
    }));
  } catch (error) {
    console.warn('[HabitRecommendation] Network error:', error);
    return [];
  }
}

/**
 * 사용자 인터랙션 이벤트 전송 (학습 데이터)
 * 습관 완료, 감정 기록 등의 이벤트를 Recombee에 전송
 */
export async function sendInteraction(
  userId: string,
  itemId: string,
  interactionType: 'complete' | 'skip' | 'rate',
  value?: number,
): Promise<void> {
  if (!RECOMBEE_API_URL) return;

  try {
    await fetch(`${RECOMBEE_API_URL}/interactions/${interactionType}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RECOMBEE_API_TOKEN}`,
      },
      body: JSON.stringify({
        userId,
        itemId,
        timestamp: new Date().toISOString(),
        ...(value !== undefined ? { rating: value } : {}),
      }),
    });
  } catch (error) {
    console.warn('[HabitRecommendation] Interaction send failed:', error);
  }
}
