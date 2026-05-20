/**
 * AI 피드백 서비스 — Gemini 연결점
 *
 * 용도:
 * 1. 피드백 페이지의 AI 인사이트/감정 분석 문구 생성
 * 2. 리포트 페이지의 주간/월간 AI 리포트 생성
 *
 * 입력 데이터:
 * - 감정 분석 결과 (KoELECTRA 출력)
 * - 사용자 일정
 * - 습관 이행률
 * - 일기 내용 (있는 경우)
 * - 습관 적절성 평가
 *
 * 연결 방법:
 * 1. Google AI Studio에서 Gemini API 키 발급
 * 2. GEMINI_API_KEY 설정
 */

// TODO: Gemini API 키 발급 후 설정
const GEMINI_API_KEY = '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export interface FeedbackContext {
  // 감정 데이터
  emotionScores: number[];          // 기간 내 감정 점수 목록
  emotionTags: string[];            // KoELECTRA 분석 결과 태그
  avgMood: number;                  // 평균 기분 (-1 ~ 1)

  // 습관 데이터
  completionRate: number;           // 습관 이행률 (0 ~ 1)
  habitSatisfactions: string[];     // 습관 적절성 평가 목록

  // 일기 데이터
  diaryTexts: string[];             // 기간 내 일기 내용

  // 기간 정보
  periodType: 'week' | 'month' | 'year';
  periodLabel: string;              // "3월 2째 주" 등
}

export interface AIFeedbackResult {
  insight: string;                  // 피드백 페이지 인사이트 문구
  emotionAnalysis: string;          // 감정 분석 요약
  suggestion: string;               // 개선 제안
  report?: string;                  // 리포트 전체 내용 (리포트 페이지용)
}

/**
 * AI 피드백/인사이트 생성
 *
 * @param context - 피드백 생성에 필요한 데이터
 * @returns AI 생성 피드백
 */
export async function generateFeedback(
  context: FeedbackContext,
): Promise<AIFeedbackResult> {
  // API 미연결 시 기존 로컬 로직으로 fallback
  if (!GEMINI_API_KEY) {
    return generateLocalFeedback(context);
  }

  try {
    const prompt = buildFeedbackPrompt(context);

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        },
      }),
    });

    if (!response.ok) {
      console.warn('[AIFeedback] Gemini API error:', response.status);
      return generateLocalFeedback(context);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    // Gemini 응답 파싱
    // TODO: 프롬프트에 JSON 출력을 요청하여 구조화된 응답 받기
    return {
      insight: text,
      emotionAnalysis: '',
      suggestion: '',
    };
  } catch (error) {
    console.warn('[AIFeedback] Network error:', error);
    return generateLocalFeedback(context);
  }
}

/**
 * Gemini에 보낼 프롬프트 생성
 */
function buildFeedbackPrompt(context: FeedbackContext): string {
  return `당신은 심리학 기반 습관 코칭 앱 "HABITS"의 AI 코치입니다.
아래 데이터를 바탕으로 사용자에게 따뜻하고 구체적인 피드백을 3-4문장으로 작성해주세요.

기간: ${context.periodLabel}
평균 기분: ${Math.round((context.avgMood + 1) / 2 * 100)}점/100점
습관 이행률: ${Math.round(context.completionRate * 100)}%
주요 감정 태그: ${context.emotionTags.join(', ') || '없음'}
일기 수: ${context.diaryTexts.length}편

피드백은 한국어로, 공감적이고 실행 가능한 조언을 포함해주세요.`;
}

/**
 * API 미연결 시 로컬 피드백 생성 (기존 로직 유지)
 */
function generateLocalFeedback(context: FeedbackContext): AIFeedbackResult {
  const { avgMood, completionRate, periodLabel } = context;

  let insight = '';
  if (avgMood > 0.3) {
    insight += `${periodLabel} 전반적으로 긍정적인 감정 상태를 유지하셨네요. `;
  } else if (avgMood < -0.3) {
    insight += `${periodLabel} 다소 힘든 시간을 보내신 것 같아요. `;
  } else {
    insight += `${periodLabel} 감정이 비교적 안정적이었어요. `;
  }

  if (completionRate >= 0.7) {
    insight += '습관 실천도 훌륭해요! 이 좋은 흐름을 유지해보세요 🌟';
  } else if (completionRate >= 0.4) {
    insight += '꾸준한 실천으로 더 나은 하루를 만들어가요! ✨';
  } else {
    insight += '작은 습관부터 천천히 시작해보는 건 어떨까요? 💪';
  }

  return {
    insight,
    emotionAnalysis: '',
    suggestion: '',
  };
}
