"""정적 피드백 선택 로직.

흐름:
1. 감정 분포(emotion_distribution) 분석 → 어떤 패턴인지 판정
2. 이행률 → 구간 판정 (low/mid/high)
3. 매칭되는 템플릿 선택
4. 변형 메시지가 여러 개면 random 선택
"""
import random
from typing import Literal, Optional

from app.feedback.constants import (
    COMBO_EMOTION_THRESHOLD,
    NEGATIVE_EMOTIONS,
    POSITIVE_EMOTIONS,
    SINGLE_EMOTION_THRESHOLD,
)
from app.feedback.templates import (
    COMBO_TEMPLATES,
    COMPLETION_ONLY_TEMPLATES,
    CompletionBucket,
    SINGLE_TEMPLATES,
    VALENCE_FALLBACK,
)


PatternKind = Literal["single", "combo", "valence", "completion_only", "needs_dynamic"]


def _bucket(rate: float) -> CompletionBucket:
    if rate < 0.30:
        return "low"
    if rate <= 0.70:
        return "mid"
    return "high"


def _classify_emotions(distribution: dict[str, float]) -> tuple[PatternKind, list[str]]:
    """감정 분포 → 패턴 판정.

    Returns:
        (패턴 종류, 관련 감정 리스트)
    """
    if not distribution:
        return "completion_only", []

    # confidence 내림차순 정렬
    sorted_emotions = sorted(distribution.items(), key=lambda x: x[1], reverse=True)
    top1, top1_score = sorted_emotions[0]
    top2, top2_score = sorted_emotions[1] if len(sorted_emotions) > 1 else (None, 0.0)
    top3_score = sorted_emotions[2][1] if len(sorted_emotions) > 2 else 0.0

    # 3개 이상 동시 도출 → 정적 미지원
    if top3_score >= COMBO_EMOTION_THRESHOLD:
        return "needs_dynamic", [e for e, _ in sorted_emotions if _ >= COMBO_EMOTION_THRESHOLD]

    # 단일 감정 압도적
    if top1_score >= SINGLE_EMOTION_THRESHOLD and top2_score < COMBO_EMOTION_THRESHOLD:
        return "single", [top1]

    # 2개 감정 조합
    if top2 and top2_score >= COMBO_EMOTION_THRESHOLD:
        return "combo", [top1, top2]

    # 그 외 (top1 약함, top2 미달) → top1만으로 단일 처리
    return "single", [top1]


def _valence(emotion: str) -> str:
    if emotion in POSITIVE_EMOTIONS:
        return "positive"
    if emotion in NEGATIVE_EMOTIONS:
        return "negative"
    return "mixed"


def _combined_valence(emotions: list[str]) -> str:
    valences = {_valence(e) for e in emotions}
    if valences == {"positive"}:
        return "positive"
    if valences == {"negative"}:
        return "negative"
    return "mixed"


def select_feedback(
    completion_rate: float,
    emotion_distribution: Optional[dict[str, float]] = None,
) -> dict:
    """정적 피드백 선택.

    Args:
        completion_rate: 0.0 ~ 1.0
        emotion_distribution: {"joy": 0.7, "calm": 0.1, ...} 또는 None

    Returns:
        {
            "message": str,                # 사용자에게 보일 메시지
            "needs_dynamic": bool,         # True면 Gemini 호출 필요
            "pattern": str,                # "single" | "combo" | "valence" | "completion_only" | "needs_dynamic"
            "matched_emotions": [str],
            "completion_bucket": str,
        }
    """
    bucket = _bucket(completion_rate)
    rate_pct = round(completion_rate * 100)

    pattern, matched = _classify_emotions(emotion_distribution or {})

    # 3개 이상 → 동적 생성 신호
    if pattern == "needs_dynamic":
        return {
            "message": "",
            "needs_dynamic": True,
            "pattern": "needs_dynamic",
            "matched_emotions": matched,
            "completion_bucket": bucket,
        }

    # 감정 데이터 없음
    if pattern == "completion_only":
        candidates = COMPLETION_ONLY_TEMPLATES.get(bucket, [])
        message = random.choice(candidates).format(rate=rate_pct) if candidates else ""
        return {
            "message": message,
            "needs_dynamic": False,
            "pattern": "completion_only",
            "matched_emotions": [],
            "completion_bucket": bucket,
        }

    # 단일 감정
    if pattern == "single":
        emotion = matched[0]
        candidates = SINGLE_TEMPLATES.get(emotion, {}).get(bucket, [])
        if candidates:
            message = random.choice(candidates).format(rate=rate_pct)
            return {
                "message": message,
                "needs_dynamic": False,
                "pattern": "single",
                "matched_emotions": matched,
                "completion_bucket": bucket,
            }
        # fallback to valence
        valence = _valence(emotion)
        candidates = VALENCE_FALLBACK.get(valence, {}).get(bucket, [])
        message = random.choice(candidates).format(rate=rate_pct) if candidates else ""
        return {
            "message": message,
            "needs_dynamic": False,
            "pattern": "valence",
            "matched_emotions": matched,
            "completion_bucket": bucket,
        }

    # 2개 조합
    if pattern == "combo":
        # 정렬된 tuple로 조회 (combos 키가 정렬되어 있음)
        key = tuple(sorted(matched))
        candidates = COMBO_TEMPLATES.get(key, {}).get(bucket, [])
        if candidates:
            message = random.choice(candidates).format(rate=rate_pct)
            return {
                "message": message,
                "needs_dynamic": False,
                "pattern": "combo",
                "matched_emotions": matched,
                "completion_bucket": bucket,
            }
        # fallback to valence
        valence = _combined_valence(matched)
        candidates = VALENCE_FALLBACK.get(valence, {}).get(bucket, [])
        message = random.choice(candidates).format(rate=rate_pct) if candidates else ""
        return {
            "message": message,
            "needs_dynamic": False,
            "pattern": "valence",
            "matched_emotions": matched,
            "completion_bucket": bucket,
        }

    # 도달 불가
    return {
        "message": "",
        "needs_dynamic": False,
        "pattern": pattern,
        "matched_emotions": matched,
        "completion_bucket": bucket,
    }
