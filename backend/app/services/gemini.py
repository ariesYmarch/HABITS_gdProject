"""Gemini Flash 기반 동적 피드백 생성.

GEMINI_API_KEY가 비어있으면 정적 fallback 메시지 사용 (개발 모드).
"""
import json
from typing import Optional

import requests

from app.core.config import settings


GEMINI_ENDPOINT = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    "gemini-2.5-flash:generateContent"
)


def _is_configured() -> bool:
    return bool(settings.GEMINI_API_KEY)


def _build_prompt(
    period_label: str,
    completion_rate: float,
    emotion_distribution: dict[str, float],
    exception_reasons: list[str],
    extra_context: Optional[str] = None,
    satisfaction_hint: Optional[str] = None,
) -> str:
    """프롬프트 빌드. KoELECTRA 분포를 JSON으로 명시 전달."""
    rate_pct = round(completion_rate * 100)
    dist_json = json.dumps(emotion_distribution, ensure_ascii=False)
    reasons_str = ", ".join(exception_reasons) if exception_reasons else "없음"

    # 톤 가이드: 만족도 hint 있으면 보강, 없으면 기본
    tone_guide = (
        f"\n톤 가이드 (사용자 피드백 기반):\n- {satisfaction_hint}"
        if satisfaction_hint else ""
    )

    prompt = f"""당신은 HABITS 앱의 피드백 작성 어시스턴트입니다.

규칙:
- 인과관계를 단정하지 말고 "~한 경향이 있었어요" 같은 관찰적 표현 사용
- 처방(빈도 줄여라/늘려라 등)은 명령이 아닌 선택지로 부드럽게 제시
- SDT의 자율성 원칙을 지켜 사용자가 스스로 해석하도록 유도
- 한국어로, 2~3문장 이내로 작성
- 이모지 1개 이내, 따옴표 사용 자제{tone_guide}

데이터:
- 기간: {period_label}
- 이행률: {rate_pct}%
- 감정 분포 (KoELECTRA): {dist_json}
- 감지된 예외 패턴: {reasons_str}

{f'추가 맥락: {extra_context}' if extra_context else ''}

위 데이터를 바탕으로 사용자에게 보낼 피드백 메시지 1개를 작성하세요.
"""
    return prompt.strip()


def enrich_diagnosis(
    period_label: str,
    category_summary: dict,
    static_label: str,
    static_detail: str,
) -> Optional[str]:
    """로컬 폴백 진단을 Gemini로 더 풍부하게 다듬음.

    실패 시 None 반환 → 호출부에서 static_detail 그대로 사용.

    category_summary 예시:
    {
        "rate_pct": 75, "rate_bucket": "high",
        "valence": "positive_dominant",
        "primary_emotion": "joy", "secondary_emotion": "calm",
        "mood_bucket": "high", "variance_bucket": "stable",
        "trend": "improving",
    }
    """
    if not _is_configured():
        return None

    cat_json = json.dumps(category_summary, ensure_ascii=False)

    prompt = f"""당신은 HABITS 앱의 종합 진단 작성 어시스턴트입니다.

규칙:
- 인과관계 단정 X, "~한 경향" 같은 관찰적 표현
- 처방이 아닌 선택지 형태로 제시
- SDT 자율성 원칙 준수
- 한국어, 3~4문장 이내, 자연스러운 줄글
- 이모지·따옴표 사용 자제
- 아래 로컬 폴백 진단의 핵심 메시지(라벨)는 유지하되, 표현은 더 구체적이고 따뜻하게

기간: {period_label}

데이터 범주화:
{cat_json}

로컬 폴백 진단:
- 라벨: {static_label}
- 줄글: {static_detail}

위 진단을 같은 의미를 유지하면서 더 자연스럽고 풍부한 줄글로 다듬어 주세요.
출력은 다듬은 줄글만, 라벨이나 헤더 없이.
"""

    try:
        response = requests.post(
            GEMINI_ENDPOINT,
            params={"key": settings.GEMINI_API_KEY},
            headers={"Content-Type": "application/json"},
            json={
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {
                    "temperature": 0.7, "topP": 0.9, "maxOutputTokens": 250,
                },
            },
            timeout=15,
        )
        response.raise_for_status()
        data = response.json()
        candidates = data.get("candidates", [])
        if not candidates:
            return None
        parts = candidates[0].get("content", {}).get("parts", [])
        if not parts:
            return None
        text = parts[0].get("text", "").strip()
        return text or None
    except Exception:
        return None


def generate_meta_insight(
    period_label: str,
    history: list[dict],
    current: dict,
) -> Optional[str]:
    """시계열 메타 인사이트 — 정적 룰로 못 만드는 cross-period 패턴 한 문단.

    history: [{"period_start", "rate", "valence", "primary_emotion", "tag_top"}, ...]
             최근 3~5개 리포트, 오래된 것부터 정렬.
    current: 같은 키 + 추가 컨텍스트 (이번 기간).
    """
    if not _is_configured() or len(history) < 2:
        return None

    hist_json = json.dumps(history, ensure_ascii=False)
    curr_json = json.dumps(current, ensure_ascii=False)

    prompt = f"""당신은 HABITS 앱의 시계열 분석 어시스턴트입니다.

규칙:
- 여러 기간을 비교한 결과만 작성. 한 기간 단편 분석 X.
- 정적 룰로 만들 수 없는 패턴(주기성, 추세 반전, 카테고리 간 격차 변화 등)에 집중.
- 인과 단정 X, 관찰적 표현
- 한국어 2~3문장, 이모지·따옴표 자제

기간 라벨: {period_label}
이전 기간 요약 (오래된→최근): {hist_json}
이번 기간: {curr_json}

이번 기간을 이전 기간들과 함께 봤을 때 발견되는 가장 의미 있는 시계열 패턴 1가지를 짧게 서술하세요.
"""
    return _call_gemini(prompt, max_tokens=200)


def generate_recommendation_rationale(
    rec_kind: str,
    rec_label: str,
    target_habit_title: Optional[str],
    target_habit_rate: Optional[float],
    completion_rate: float,
    primary_emotion: Optional[str],
    secondary_emotion: Optional[str],
    valence: str,
) -> Optional[str]:
    """추천 행동의 '왜 지금 이걸?'을 사용자 데이터로 구체적으로 풀어내는 1~2문장."""
    if not _is_configured():
        return None

    ctx = {
        "kind": rec_kind, "label": rec_label,
        "target_habit": target_habit_title,
        "target_habit_rate": target_habit_rate,
        "overall_rate": round(completion_rate, 2),
        "primary_emotion": primary_emotion,
        "secondary_emotion": secondary_emotion,
        "valence": valence,
    }
    ctx_json = json.dumps(ctx, ensure_ascii=False)

    prompt = f"""당신은 HABITS 앱의 추천 메시지 작성 어시스턴트입니다.

규칙:
- 일반론 X, 사용자 데이터를 인용하면서 '왜 지금 이걸 추천하는가'를 설명
- 처방이 아닌 선택지로 부드럽게 제시
- 인과 단정 X, 관찰적 표현
- 한국어 1~2문장, 이모지 1개 이내

추천 정보:
{ctx_json}

위 데이터를 토대로 사용자에게 보낼 추천 이유 메시지 1개를 작성하세요.
"""
    return _call_gemini(prompt, max_tokens=150)


def _call_gemini(prompt: str, max_tokens: int = 200) -> Optional[str]:
    try:
        response = requests.post(
            GEMINI_ENDPOINT,
            params={"key": settings.GEMINI_API_KEY},
            headers={"Content-Type": "application/json"},
            json={
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {
                    "temperature": 0.7, "topP": 0.9, "maxOutputTokens": max_tokens,
                },
            },
            timeout=15,
        )
        response.raise_for_status()
        data = response.json()
        candidates = data.get("candidates", [])
        if not candidates:
            return None
        parts = candidates[0].get("content", {}).get("parts", [])
        if not parts:
            return None
        return (parts[0].get("text", "").strip()) or None
    except Exception:
        return None


def generate_feedback(
    period_label: str,
    completion_rate: float,
    emotion_distribution: dict[str, float],
    exception_reasons: list[str],
    extra_context: Optional[str] = None,
    satisfaction_hint: Optional[str] = None,
) -> Optional[str]:
    """Gemini로 피드백 생성. 실패 시 None 반환 (호출 측에서 정적 fallback 처리).

    satisfaction_hint: 최근 사용자 만족도 기반 톤 가이드 (예: "최근 평가가 부정적이니 더 공감적으로")
    """
    if not _is_configured():
        return None

    prompt = _build_prompt(
        period_label, completion_rate, emotion_distribution,
        exception_reasons, extra_context, satisfaction_hint,
    )

    try:
        response = requests.post(
            GEMINI_ENDPOINT,
            params={"key": settings.GEMINI_API_KEY},
            headers={"Content-Type": "application/json"},
            json={
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {
                    "temperature": 0.7,
                    "topP": 0.9,
                    "maxOutputTokens": 200,
                },
            },
            timeout=15,
        )
        response.raise_for_status()
        data = response.json()
        candidates = data.get("candidates", [])
        if not candidates:
            return None
        parts = candidates[0].get("content", {}).get("parts", [])
        if not parts:
            return None
        text = parts[0].get("text", "").strip()
        return text or None
    except Exception:
        return None
