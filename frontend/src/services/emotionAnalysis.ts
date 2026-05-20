/**
 * 감정 분석 서비스 — KoELECTRA 모델 연결점
 *
 * 모델: monologg/koelectra-base-v3-discriminator (파인튜닝)
 * 배포: HuggingFace Inference API (무료 티어)
 * 용도: 일기 텍스트 → 감정 태그 자동 분류
 *
 * 연결 방법:
 * 1. HuggingFace Hub에 파인튜닝 모델 업로드
 * 2. EMOTION_API_URL을 HF Inference API URL로 교체
 * 3. HF_API_TOKEN 설정
 */

// TODO: 파인튜닝 모델 업로드 후 실제 URL로 교체
const EMOTION_API_URL = '';
const HF_API_TOKEN = '';

export interface EmotionAnalysisResult {
  tags: string[];                    // ["#피로", "#슬픔"]
  scores: Record<string, number>;    // {"#기쁨": 0.05, "#슬픔": 0.82, ...}
  sentiment: number;                 // 종합 감정 점수 (-1 ~ 1)
}

/**
 * 일기 텍스트를 분석하여 감정 태그를 반환
 *
 * @param text - 사용자가 작성한 일기 내용
 * @param moodScore - 슬라이더 기분 점수 (-1 ~ 1)
 * @returns 감정 분석 결과 (태그, 점수)
 */
export async function analyzeEmotion(
  text: string,
  moodScore: number,
): Promise<EmotionAnalysisResult> {
  // API 미연결 시 빈 결과 반환 (graceful fallback)
  if (!EMOTION_API_URL) {
    return { tags: [], scores: {}, sentiment: moodScore };
  }

  try {
    const response = await fetch(EMOTION_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(HF_API_TOKEN ? { Authorization: `Bearer ${HF_API_TOKEN}` } : {}),
      },
      body: JSON.stringify({ inputs: text }),
    });

    if (!response.ok) {
      console.warn('[EmotionAnalysis] API error:', response.status);
      return { tags: [], scores: {}, sentiment: moodScore };
    }

    const data = await response.json();

    // HuggingFace Inference API 응답 형식에 맞게 파싱
    // TODO: 모델 출력 형식에 맞게 조정 필요
    return {
      tags: data.tags ?? [],
      scores: data.scores ?? {},
      sentiment: data.sentiment ?? moodScore,
    };
  } catch (error) {
    console.warn('[EmotionAnalysis] Network error:', error);
    return { tags: [], scores: {}, sentiment: moodScore };
  }
}
