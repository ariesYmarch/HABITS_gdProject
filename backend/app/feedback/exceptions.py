"""예외 패턴 감지 - Gemini Flash 동적 생성을 트리거하는 3가지 조건.

- 감정-이행률 역전: 이행률 ≥80% AND 부정 감정 우세, OR 이행률 ≤30% AND 긍정 감정 우세
- 감정 변동성: 주간 mood_score 표준편차가 임계값 초과 (단순 평균으로는 평범한 한 주로 오독될 위험)
- 복합 감정 3개 이상 동시 도출: 정적 템플릿이 커버 불가 (이미 selector에서 처리되지만 명시적 함수 제공)
"""
import statistics
from dataclasses import dataclass
from typing import Optional

from app.feedback.constants import (
    COMBO_EMOTION_THRESHOLD,
    NEGATIVE_EMOTIONS,
    POSITIVE_EMOTIONS,
)


# 임계값 (실 데이터로 검증 후 조정)
INVERSION_HIGH_COMPLETION = 0.80   # 이 이상이면 "이행률 높음"
INVERSION_LOW_COMPLETION = 0.30    # 이 이하면 "이행률 낮음"
INVERSION_NEGATIVE_DOMINANCE = 0.50  # 부정 감정 합이 이 이상이면 "부정 우세"
INVERSION_POSITIVE_DOMINANCE = 0.70  # 긍정 감정 합이 이 이상이면 "긍정 우세"
VARIANCE_THRESHOLD = 0.40            # mood_score 표준편차 임계값 (-1~1 범위)
MIN_MOOD_DATA_POINTS = 4             # 변동성 계산에 필요한 최소 데이터 수


@dataclass
class ExceptionDetection:
    triggered: bool
    reasons: list[str]   # 어떤 패턴이 감지됐는지 (디버깅·로깅용)
    detail: dict         # 감지 상세 (수치 포함)


def _negative_score(distribution: dict[str, float]) -> float:
    return sum(v for k, v in distribution.items() if k in NEGATIVE_EMOTIONS)


def _positive_score(distribution: dict[str, float]) -> float:
    return sum(v for k, v in distribution.items() if k in POSITIVE_EMOTIONS)


def detect_emotion_completion_inversion(
    completion_rate: float, emotion_distribution: dict[str, float]
) -> tuple[bool, dict]:
    """이행률과 감정의 역전 패턴 감지."""
    if not emotion_distribution:
        return False, {}

    neg = _negative_score(emotion_distribution)
    pos = _positive_score(emotion_distribution)

    # 이행률 높은데 부정 우세
    if completion_rate >= INVERSION_HIGH_COMPLETION and neg >= INVERSION_NEGATIVE_DOMINANCE:
        return True, {
            "type": "high_completion_negative_emotion",
            "completion_rate": completion_rate,
            "negative_score": neg,
        }

    # 이행률 낮은데 긍정 우세
    if completion_rate <= INVERSION_LOW_COMPLETION and pos >= INVERSION_POSITIVE_DOMINANCE:
        return True, {
            "type": "low_completion_positive_emotion",
            "completion_rate": completion_rate,
            "positive_score": pos,
        }

    return False, {}


def detect_high_emotion_variance(mood_scores: list[float]) -> tuple[bool, dict]:
    """주간 감정 변동성이 큰지 판정 (mood_score 표준편차 기반)."""
    if len(mood_scores) < MIN_MOOD_DATA_POINTS:
        return False, {"reason": "insufficient_data", "count": len(mood_scores)}

    stdev = statistics.stdev(mood_scores)
    if stdev > VARIANCE_THRESHOLD:
        return True, {
            "stdev": round(stdev, 4),
            "threshold": VARIANCE_THRESHOLD,
            "data_points": len(mood_scores),
        }
    return False, {"stdev": round(stdev, 4), "threshold": VARIANCE_THRESHOLD}


def detect_complex_emotions(emotion_distribution: dict[str, float]) -> tuple[bool, dict]:
    """confidence ≥ COMBO_EMOTION_THRESHOLD인 감정이 3개 이상이면 True."""
    if not emotion_distribution:
        return False, {}

    above = [(k, v) for k, v in emotion_distribution.items() if v >= COMBO_EMOTION_THRESHOLD]
    if len(above) >= 3:
        return True, {
            "count": len(above),
            "threshold": COMBO_EMOTION_THRESHOLD,
            "emotions": [k for k, _ in sorted(above, key=lambda x: x[1], reverse=True)],
        }
    return False, {"count": len(above)}


def detect_exceptions(
    completion_rate: float,
    emotion_distribution: Optional[dict[str, float]] = None,
    mood_scores: Optional[list[float]] = None,
) -> ExceptionDetection:
    """3가지 예외 패턴을 OR로 평가. 하나라도 감지되면 triggered=True."""
    reasons: list[str] = []
    detail: dict = {}

    if emotion_distribution:
        inv_hit, inv_info = detect_emotion_completion_inversion(completion_rate, emotion_distribution)
        if inv_hit:
            reasons.append("emotion_completion_inversion")
            detail["inversion"] = inv_info

        cx_hit, cx_info = detect_complex_emotions(emotion_distribution)
        if cx_hit:
            reasons.append("complex_emotions")
            detail["complex"] = cx_info

    if mood_scores:
        var_hit, var_info = detect_high_emotion_variance(mood_scores)
        if var_hit:
            reasons.append("high_emotion_variance")
            detail["variance"] = var_info

    return ExceptionDetection(triggered=len(reasons) > 0, reasons=reasons, detail=detail)
