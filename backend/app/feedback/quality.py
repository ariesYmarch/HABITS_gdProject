"""Gemini Flash 출력 품질 자동 평가.

자동 체크 가능한 항목 + 수동 평가 가이드.
점수가 낮으면 정적 fallback으로 대체하는 데 활용 가능.
"""
import re
from dataclasses import dataclass


# 금지 표현 (명령형, 단정형, SDT 자율성 위반)
FORBIDDEN_PHRASES = [
    "해야 합니다", "해야 해요", "하셔야 합니다", "하셔야 해요",
    "반드시", "꼭",  # 단정적
    "당장", "즉시",  # 강제성
]

# 인과 단정 표현 (관찰적 표현이 아닌 인과 결론)
CAUSAL_PHRASES = [
    "때문에", "로 인해", "탓에", "원인",
]

# 권장 관찰적 표현 (있으면 가산점)
OBSERVATIONAL_PHRASES = [
    "경향이 있", "보였", "보여요", "보입니다",
    "~한 것 같", "~로 보여",
]

# 길이 임계값
MIN_LENGTH = 20
MAX_LENGTH = 250


@dataclass
class QualityCheck:
    passed: bool
    score: float            # 0~1
    issues: list[str]       # 문제점 목록 (디버깅·로깅용)
    detail: dict


def check_gemini_output(text: str) -> QualityCheck:
    """자동 품질 체크.

    체크 항목:
      - 길이 (너무 짧거나 길지 않은지)
      - 금지 표현 (명령형) 사용 여부
      - 인과 단정 표현 사용 여부
      - 관찰적 표현 가산점
      - 따옴표 과다 사용
      - 이모지 과다 사용 (1개 이내 권장)
    """
    issues: list[str] = []
    score = 1.0

    if not text or not text.strip():
        return QualityCheck(False, 0.0, ["empty_output"], {})

    text = text.strip()
    length = len(text)

    # 길이 체크
    if length < MIN_LENGTH:
        issues.append(f"too_short ({length}자)")
        score -= 0.4
    if length > MAX_LENGTH:
        issues.append(f"too_long ({length}자)")
        score -= 0.2

    # 금지 표현
    forbidden_hits = [p for p in FORBIDDEN_PHRASES if p in text]
    if forbidden_hits:
        issues.append(f"forbidden_phrases: {forbidden_hits}")
        score -= 0.3

    # 인과 단정
    causal_hits = [p for p in CAUSAL_PHRASES if p in text]
    if causal_hits:
        issues.append(f"causal_claims: {causal_hits}")
        score -= 0.2

    # 관찰적 표현 가산
    observational = sum(1 for p in OBSERVATIONAL_PHRASES if p in text)
    if observational > 0:
        score = min(1.0, score + 0.1)

    # 따옴표 과다 (3개 초과)
    quote_count = text.count('"') + text.count("'")
    if quote_count > 4:
        issues.append(f"too_many_quotes ({quote_count})")
        score -= 0.1

    # 이모지 과다 (Unicode emoji 범위 매칭)
    emoji_count = len(re.findall(
        r'[\U0001F300-\U0001F6FF\U0001F900-\U0001F9FF\U00002600-\U000027BF]',
        text,
    ))
    if emoji_count > 2:
        issues.append(f"too_many_emojis ({emoji_count})")
        score -= 0.1

    score = max(0.0, score)
    # 통과 기준: score 0.7 이상 + 금지표현 없음 + 인과 단정 없음
    passed = score >= 0.7 and not forbidden_hits and not causal_hits

    return QualityCheck(
        passed=passed,
        score=round(score, 2),
        issues=issues,
        detail={
            "length": length,
            "observational_count": observational,
            "emoji_count": emoji_count,
            "quote_count": quote_count,
        },
    )
