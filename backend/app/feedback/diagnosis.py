"""종합 진단 생성기.

흐름:
1. 데이터 → 범주화 (categorize_period_data)
2. 범주 → 매핑 테이블 → 로컬 폴백 진단 (label + detail + keywords)
3. (선택) Gemini 호출로 detail을 더 풍부한 자연어로 변환
4. 통합 결과 반환

설계 원칙:
- 이행률(5구간) × 감정 valence × 변동성 × (옵션)추세 조합으로 매핑
- SDT 자율성 원칙: 처방이 아닌 관찰적 표현
- Gemini 실패해도 로컬 폴백으로 풍부한 진단 보장
"""
from dataclasses import dataclass, field
from typing import Literal, Optional

from app.feedback.constants import (
    COMBO_EMOTION_THRESHOLD,
    EMOTION_LABELS,
    NEGATIVE_EMOTIONS,
    POSITIVE_EMOTIONS,
)


RateBucket = Literal["very_low", "low", "mid", "high", "very_high"]
Valence = Literal["positive_dominant", "negative_dominant", "mixed", "no_data"]
VarianceBucket = Literal["stable", "moderate", "volatile", "unknown"]
MoodBucket = Literal["very_low", "low", "neutral", "high", "very_high", "unknown"]
TrendKind = Literal["improving", "stable", "declining", "unknown"]


@dataclass
class PeriodCategory:
    """기간 데이터의 범주화 결과."""
    rate_bucket: RateBucket
    rate_pct: int                                # 정확한 이행률 % (라벨에 사용)
    valence: Valence
    primary_emotion: Optional[str] = None        # top1 감정 (영어 키)
    secondary_emotion: Optional[str] = None      # top2 (>=COMBO_THRESHOLD)
    mood_bucket: MoodBucket = "unknown"
    variance_bucket: VarianceBucket = "unknown"
    trend: TrendKind = "unknown"                 # 이전 리포트 대비


@dataclass
class Diagnosis:
    label: str                          # "최적 - 안정 흐름"
    detail: str                         # 2-3문장 줄글
    keywords: list[str] = field(default_factory=list)
    pattern_key: str = ""               # 매핑 키 (디버깅·로깅용)
    source: str = "static"              # "static" | "gemini" | "static_fallback"


# ===== 범주화 =====
def _bucket_rate(rate: float) -> RateBucket:
    pct = rate * 100
    if pct < 20: return "very_low"
    if pct < 40: return "low"
    if pct < 60: return "mid"
    if pct < 80: return "high"
    return "very_high"


def _bucket_mood(mood: Optional[float]) -> MoodBucket:
    if mood is None: return "unknown"
    if mood < -0.5: return "very_low"
    if mood < -0.2: return "low"
    if mood < 0.2: return "neutral"
    if mood < 0.5: return "high"
    return "very_high"


def _bucket_variance(stdev: Optional[float]) -> VarianceBucket:
    if stdev is None: return "unknown"
    if stdev < 0.2: return "stable"
    if stdev < 0.4: return "moderate"
    return "volatile"


def _classify_valence(distribution: dict[str, float]) -> Valence:
    if not distribution: return "no_data"
    pos = sum(v for k, v in distribution.items() if k in POSITIVE_EMOTIONS)
    neg = sum(v for k, v in distribution.items() if k in NEGATIVE_EMOTIONS)
    if pos == 0 and neg == 0: return "no_data"
    if abs(pos - neg) < 0.15 and pos > 0.15 and neg > 0.15:
        return "mixed"
    return "positive_dominant" if pos > neg else "negative_dominant"


def _top_emotions(distribution: dict[str, float]) -> tuple[Optional[str], Optional[str]]:
    if not distribution:
        return None, None
    sorted_e = sorted(distribution.items(), key=lambda x: x[1], reverse=True)
    top1 = sorted_e[0][0]
    top2 = sorted_e[1][0] if len(sorted_e) > 1 and sorted_e[1][1] >= COMBO_EMOTION_THRESHOLD else None
    return top1, top2


def _classify_trend(current_rate: float, previous_rate: Optional[float]) -> TrendKind:
    if previous_rate is None: return "unknown"
    diff = current_rate - previous_rate
    if diff > 0.10: return "improving"
    if diff < -0.10: return "declining"
    return "stable"


def categorize_period_data(
    completion_rate: float,
    emotion_distribution: dict[str, float],
    avg_mood: Optional[float],
    mood_stdev: Optional[float],
    previous_completion_rate: Optional[float] = None,
) -> PeriodCategory:
    primary, secondary = _top_emotions(emotion_distribution or {})
    return PeriodCategory(
        rate_bucket=_bucket_rate(completion_rate),
        rate_pct=round(completion_rate * 100),
        valence=_classify_valence(emotion_distribution or {}),
        primary_emotion=primary,
        secondary_emotion=secondary,
        mood_bucket=_bucket_mood(avg_mood),
        variance_bucket=_bucket_variance(mood_stdev),
        trend=_classify_trend(completion_rate, previous_completion_rate),
    )


# ===== 매핑 매트릭스 (이행률 × valence) → 라벨 + 줄글 + 키워드 =====
_RATE_LABEL_KR = {
    "very_low": "낮음", "low": "낮음", "mid": "보통",
    "high": "높음", "very_high": "매우 높음",
}

_VALENCE_LABEL_KR = {
    "positive_dominant": "긍정 우세",
    "negative_dominant": "부정 우세",
    "mixed": "혼합",
    "no_data": "감정 데이터 없음",
}


def _emotion_kr(emo: Optional[str]) -> Optional[str]:
    return EMOTION_LABELS.get(emo) if emo else None


# (rate_bucket, valence) → (label, detail_template, keyword_list)
# detail_template은 {rate_pct} 포맷 가능
# 라벨은 짧은 진단명이 아니라 사용자에게 직접 와닿는 한 문장으로 표현
# detail에는 항상 "무엇이" 어떤지 명확한 주어가 들어가야 함 (비문 방지)
_DIAGNOSIS_MATRIX: dict[tuple[str, str], dict] = {
    # ===== very_high (80-100%) =====
    ("very_high", "positive_dominant"): {
        "label": "성취도 높고 마음도 가벼웠던 한 기간이었어요",
        "detail": (
            "습관 이행률이 {rate_pct}%로 매우 높았고, 일기에 기록된 감정도 긍정 쪽으로 기울었어요. "
            "행동과 감정이 같은 방향으로 가는 흐름은 흔치 않은데, 이번 기간이 바로 그런 모습이에요. "
            "지금의 루틴이 본인에게 잘 맞고 있다는 신호이니, 새 도전을 한두 가지 더해도 무리가 적을 시점이에요."
        ),
        "keywords": ["성취-긍정 동행", "안정 루틴", "확장 가능"],
    },
    ("very_high", "negative_dominant"): {
        "label": "행동은 잘 이어졌지만 마음은 좀 무거웠던 한 기간이었어요",
        "detail": (
            "습관 이행률은 {rate_pct}%로 매우 높았지만, 감정 기록은 부정 쪽이 더 많이 나타났어요. "
            "결과적으로 잘 해내고 있지만 정신적으로는 지쳐가는 신호일 수 있어요. "
            "성취 자체와는 별개로 회복할 수 있는 짧은 시간을 의식적으로 일과에 넣어두는 걸 추천해요."
        ),
        "keywords": ["성취-컨디션 불일치", "회복 필요", "번아웃 주의"],
    },
    ("very_high", "mixed"): {
        "label": "감정은 복잡했지만 행동은 한결같았던 한 기간이었어요",
        "detail": (
            "습관 이행률이 {rate_pct}%로 매우 높은 가운데, 감정은 긍정과 부정이 함께 섞여 나타났어요. "
            "감정 폭이 넓을 때도 행동을 일관되게 가져가는 자기 조절 능력이 인상적이에요. "
            "이런 안정성은 본인의 강점으로 기억해두면 어려운 시기에 큰 자산이 돼요."
        ),
        "keywords": ["자기 조절", "행동 일관성", "강점 발견"],
    },
    ("very_high", "no_data"): {
        "label": "이번 기간 습관 이행이 매우 잘 진행됐어요",
        "detail": (
            "습관 이행률이 {rate_pct}%로 매우 높은 한 기간이었어요. "
            "다만 일기에서 감정 데이터가 부족해서, 행동이 본인의 마음 상태와 어떻게 연결됐는지는 이번엔 함께 보지 못했어요. "
            "다음 기간엔 일기를 한두 줄이라도 더 남겨주시면 감정 흐름까지 종합한 진단을 드릴 수 있어요."
        ),
        "keywords": ["행동 안정", "일기 권장"],
    },

    # ===== high (60-80%) =====
    ("high", "positive_dominant"): {
        "label": "이행도 잘 되고 기분도 좋았던 한 기간이었어요",
        "detail": (
            "습관 이행률이 {rate_pct}%로 양호한 수준이었고, 감정 기록도 긍정 쪽이 더 많이 나타났어요. "
            "지금처럼 좋은 흐름이 자리잡고 있을 땐 무리하게 바꾸기보다 이대로 유지하는 게 가장 효율적이에요. "
            "여유가 있다면 새 습관을 한 가지 정도 살짝 얹어보는 것도 좋은 시도예요."
        ),
        "keywords": ["긍정 흐름", "유지 권장", "여유 있는 확장"],
    },
    ("high", "negative_dominant"): {
        "label": "마음이 무거운데도 습관은 꾸준히 이어가신 한 기간이었어요",
        "detail": (
            "습관 이행률은 {rate_pct}%로 양호한 편이었지만, 감정은 부정 쪽이 더 우세하게 나타났어요. "
            "쉽지 않은 컨디션에서도 행동을 이어간 점은 충분히 인정받을 만한 노력이에요. "
            "다만 무리가 누적되지 않도록 한 가지 습관 정도는 잠시 쉼표를 둬도 괜찮아요."
        ),
        "keywords": ["분투", "자기 돌봄", "선택적 휴식"],
    },
    ("high", "mixed"): {
        "label": "감정은 오르내렸지만 습관은 꾸준했던 한 기간이었어요",
        "detail": (
            "습관 이행률이 {rate_pct}%로 양호한 가운데, 감정은 다양하게 오르내리며 나타났어요. "
            "감정 기복이 있어도 행동의 리듬은 흔들리지 않았다는 점이 좋은 신호예요. "
            "이런 회복 탄력성은 시간이 갈수록 더 단단해지는 본인만의 자산이 될 거예요."
        ),
        "keywords": ["회복 탄력성", "행동 일관성", "혼합 감정"],
    },
    ("high", "no_data"): {
        "label": "이번 기간 습관 이행이 양호한 흐름을 보였어요",
        "detail": (
            "습관 이행률이 {rate_pct}%로 좋은 흐름이 자리잡고 있어요. "
            "감정 기록이 더해지면 어떤 컨디션에서 이 흐름이 만들어졌는지까지 함께 볼 수 있어서 분석이 더 정교해져요."
        ),
        "keywords": ["양호한 흐름", "일기 권장"],
    },

    # ===== mid (40-60%) =====
    ("mid", "positive_dominant"): {
        "label": "흐름은 만들어지는 중이고 기분도 괜찮았던 한 기간이었어요",
        "detail": (
            "습관 이행률이 {rate_pct}%로 흐름이 만들어지고 있는 단계였고, 감정 기록도 긍정 쪽이 더 많았어요. "
            "기반이 다져지고 있는 시점이라 지금 페이스를 유지하면서 조금씩 빈도를 늘려가기 좋은 단계예요. "
            "급하게 늘리기보다 일주일에 한 가지 정도씩 작은 확장을 시도해보세요."
        ),
        "keywords": ["기반 형성", "점진 확장", "긍정 흐름"],
    },
    ("mid", "negative_dominant"): {
        "label": "마음이 무거운 가운데 이행도 쉽지 않았던 한 기간이었어요",
        "detail": (
            "습관 이행률이 {rate_pct}%로 보통 수준이었고, 감정은 부정 쪽이 더 많이 나타났어요. "
            "행동을 끌어올리는 것보다 감정 회복을 먼저 챙길 만한 시점이에요. "
            "지금 가장 의미 있는 한두 가지 핵심 습관만 남기고 나머지는 잠시 내려놔도 괜찮아요."
        ),
        "keywords": ["감정 회복 우선", "선택과 집중", "부담 줄이기"],
    },
    ("mid", "mixed"): {
        "label": "다양한 감정 속에서 자기 패턴을 탐색하는 한 기간이었어요",
        "detail": (
            "습관 이행률이 {rate_pct}%로 보통 수준이었고, 감정은 긍정과 부정이 비슷하게 섞여 나타났어요. "
            "어떤 상황에서 어떤 감정이 올라왔는지 일기에 조금 더 구체적으로 적어두시면 본인만의 패턴이 보이기 시작해요. "
            "그 패턴이 보이는 순간부터는 습관 설계도 훨씬 정교해질 수 있어요."
        ),
        "keywords": ["자기 탐색", "패턴 관찰", "혼합 감정"],
    },
    ("mid", "no_data"): {
        "label": "이번 기간 습관 흐름이 막 만들어지기 시작했어요",
        "detail": (
            "습관 이행률이 {rate_pct}%로 흐름이 형성되어가는 중이에요. "
            "일기 기록까지 더해지면 어떤 상황에서 이행이 잘 됐고 어떤 상황에서 막혔는지 패턴을 함께 볼 수 있어요."
        ),
        "keywords": ["흐름 형성 중", "일기 권장"],
    },

    # ===== low (20-40%) =====
    ("low", "positive_dominant"): {
        "label": "기분은 좋았는데 실제 행동까지는 이어지지 못한 한 기간이었어요",
        "detail": (
            "감정은 긍정 쪽이 더 많이 나타났지만, 습관 이행률은 {rate_pct}%에 머물렀어요. "
            "동기는 충분한데 행동으로 옮기기가 어려웠다면, 습관 자체가 본인 일과에 맞지 않거나 "
            "시간대·장소 같은 환경적 트리거가 약해서일 수 있어요. "
            "한 가지 습관을 골라 시간대나 빈도부터 조정해보는 게 의외로 큰 차이를 만들어요."
        ),
        "keywords": ["감정-행동 불일치", "환경 조정", "트리거 점검"],
    },
    ("low", "negative_dominant"): {
        "label": "마음도 무겁고 이행도 쉽지 않았던 회복이 필요한 한 기간이었어요",
        "detail": (
            "습관 이행률이 {rate_pct}%에 머물렀고, 감정도 부정 쪽이 더 많이 나타났어요. "
            "지금은 행동을 끌어올리려 무리하기보다 회복에 우선순위를 두는 게 자연스러워요. "
            "부담이 가장 적은 한 가지만 남기고 나머지는 잠시 멈춰두셔도 충분히 괜찮아요. "
            "회복이 먼저 돌아온 뒤에 다시 작은 단위부터 시작하면 더 잘 이어집니다."
        ),
        "keywords": ["회복 우선", "부담 축소", "최소 단위 유지"],
    },
    ("low", "mixed"): {
        "label": "감정도 복잡하고 이행도 어려웠던, 우선순위 재정비가 필요한 한 기간이었어요",
        "detail": (
            "습관 이행률이 {rate_pct}%였고, 감정도 긍정과 부정이 섞여 복잡하게 나타났어요. "
            "여러 감정이 동시에 오가는 시기에는 모든 습관을 동등하게 가져가기가 어려워요. "
            "지금 가장 의미 있는 한두 가지만 추려서 거기에 에너지를 집중하는 게 효과적이에요."
        ),
        "keywords": ["재정비", "우선순위", "선택과 집중"],
    },
    ("low", "no_data"): {
        "label": "이번 기간 습관 이행이 다소 쉽지 않았어요",
        "detail": (
            "습관 이행률이 {rate_pct}%로 어려운 한 기간이었어요. "
            "현재 설정된 빈도나 시간대가 본인 일과에 부담일 수 있으니, 한 가지 습관부터 조정을 검토해보는 게 좋겠어요. "
            "일기를 함께 기록해주시면 다음 리포트에선 무엇이 어려움의 원인인지까지 함께 분석할 수 있어요."
        ),
        "keywords": ["조정 필요", "부담 점검", "일기 권장"],
    },

    # ===== very_low (0-20%) =====
    ("very_low", "positive_dominant"): {
        "label": "마음은 좋았는데 행동으로 이어지지 못한, 환경 조정이 필요한 한 기간이었어요",
        "detail": (
            "감정 기록은 긍정 쪽이 우세였지만, 습관 이행률은 {rate_pct}%에 그쳤어요. "
            "동기가 부족한 게 아니라 행동을 끌어내는 환경이 부족했을 가능성이 커요. "
            "습관을 수행할 시간대·장소·앞 행동(트리거)을 의식적으로 설계해보면 직접적인 도움이 돼요. "
            "예를 들어 '아침 양치 후 바로 산책 5분' 같은 식으로 기존 일과 뒤에 붙여보세요."
        ),
        "keywords": ["환경 설계", "트리거 재구성", "감정-행동 불일치"],
    },
    ("very_low", "negative_dominant"): {
        "label": "마음도 행동도 쉽지 않았던, 회복을 가장 먼저 챙기셔야 할 한 기간이었어요",
        "detail": (
            "습관 이행률이 {rate_pct}%에 그쳤고, 감정도 부정 쪽이 더 많이 나타났어요. "
            "지금은 무엇보다 회복이 우선이에요. 습관 진행을 잠시 멈추셔도 괜찮고, 충분한 휴식과 자기 돌봄에 시간을 쓰세요. "
            "에너지가 돌아온 뒤에 가장 부담 없는 한 가지부터 다시 시작하면 충분히 다시 자리잡을 수 있어요."
        ),
        "keywords": ["깊은 회복", "안전망 확보", "재시작 준비"],
    },
    ("very_low", "mixed"): {
        "label": "감정도 행동도 모두 어려웠던, 처음부터 다시 설계할 만한 한 기간이었어요",
        "detail": (
            "습관 이행률이 {rate_pct}%로 매우 낮은 가운데 감정도 복잡하게 섞여 나타났어요. "
            "이런 시기에는 기존 설정을 그대로 끌고 가기보다 한 번 리셋하는 편이 더 효과적이에요. "
            "가장 작고 쉬운 습관 한 가지만 골라 거기서부터 다시 출발해보세요. 부담이 줄어들면 자연스럽게 다음 단계가 보입니다."
        ),
        "keywords": ["리셋 권장", "최소 단위 출발", "재설계"],
    },
    ("very_low", "no_data"): {
        "label": "이번 기간은 잠시 쉼표를 둘 만한 한 기간이었어요",
        "detail": (
            "습관 이행률이 {rate_pct}%로 한 기간이 많이 어려우셨어요. "
            "원인을 더 깊이 보기 위해선 일기 기록이 함께 있어야 하니, 가벼운 마음으로 한두 줄씩이라도 남겨보세요. "
            "그리고 다음 기간엔 가장 작은 한 가지만이라도 다시 시도해보면 흐름이 다시 돌아옵니다."
        ),
        "keywords": ["재출발", "최소 단위", "일기 권장"],
    },
}


def _format_trend_phrase(rate_pct: int, prev_rate: Optional[float]) -> Optional[str]:
    """이전 기간 비교 문장. 변화량(%)에 따라 변화/유지를 자연어로 표현."""
    if prev_rate is None:
        return None
    prev_pct = round(prev_rate * 100)
    diff = rate_pct - prev_pct
    if abs(diff) < 5:
        return (
            f"지난 기간 이행률이 {prev_pct}%였는데 이번에도 {rate_pct}%로 비슷한 흐름이 이어졌어요. "
            "유지 자체가 가진 의미가 있는 시점이에요."
        )
    if diff >= 10:
        return (
            f"지난 기간 이행률이 {prev_pct}%였는데 이번엔 {rate_pct}%로 {diff}% 올라갔어요. "
            "분명한 개선 흐름이 만들어지고 있어요."
        )
    if diff >= 5:
        return (
            f"지난 기간 이행률이 {prev_pct}%였는데 이번엔 {rate_pct}%로 {diff}% 정도 조금 올라갔어요. "
            "작은 변화지만 방향은 분명히 좋아요."
        )
    if diff <= -10:
        return (
            f"지난 기간 이행률이 {prev_pct}%였는데 이번엔 {rate_pct}%로 {abs(diff)}% 떨어졌어요. "
            "환경이나 컨디션에 변화가 있었는지 한 번 살펴볼 만해요."
        )
    return (
        f"지난 기간 이행률이 {prev_pct}%였는데 이번엔 {rate_pct}%로 {abs(diff)}% 정도 살짝 낮아졌어요. "
        "큰 변화는 아니지만 흐름은 기억해두면 좋아요."
    )


def _build_static_diagnosis(
    cat: PeriodCategory,
    previous_completion_rate: Optional[float] = None,
) -> Diagnosis:
    """매핑 매트릭스 기반 로컬 폴백 진단."""
    key = (cat.rate_bucket, cat.valence)
    template = _DIAGNOSIS_MATRIX.get(key)
    if not template:
        template = {
            "label": "이번 기간 데이터를 함께 살펴봐요",
            "detail": (
                f"습관 이행률이 {cat.rate_pct}%인 한 기간이었어요. "
                "데이터가 좀 더 쌓이면 더 정밀한 진단을 드릴 수 있어요."
            ),
            "keywords": ["관찰 단계"],
        }

    detail = template["detail"].format(rate_pct=cat.rate_pct)

    # 이전 기간 비교 문장 (있을 때만)
    trend_phrase = _format_trend_phrase(cat.rate_pct, previous_completion_rate)
    if trend_phrase:
        detail += " " + trend_phrase

    # 변동성이 컸을 때만 추가 멘트 (감정이 분석된 경우만 의미 있음)
    if cat.variance_bucket == "volatile":
        detail += (
            " 다만 감정의 폭이 평소보다 크게 나타난 한 기간이라, "
            "회복 루틴이나 휴식 시간을 의식적으로 챙기는 게 도움돼요."
        )

    keywords = list(template["keywords"])
    if cat.primary_emotion:
        emo_kr = _emotion_kr(cat.primary_emotion)
        if emo_kr and emo_kr not in keywords:
            keywords.append(emo_kr)
    if cat.trend == "improving":
        keywords.append("개선 추세")
    elif cat.trend == "declining":
        keywords.append("주의 추세")
    if cat.variance_bucket == "volatile":
        keywords.append("감정 변동성 큼")

    return Diagnosis(
        label=template["label"],
        detail=detail,
        keywords=keywords[:6],
        pattern_key=f"{cat.rate_bucket}_{cat.valence}",
        source="static",
    )


# ===== 통합 진단 빌더 =====
def build_diagnosis(
    period_label: str,
    completion_rate: float,
    emotion_distribution: dict[str, float],
    avg_mood: Optional[float],
    mood_stdev: Optional[float],
    previous_completion_rate: Optional[float] = None,
) -> tuple[PeriodCategory, Diagnosis]:
    """범주화 + 로컬 폴백 진단 생성.
    Gemini 호출은 호출부에서 _enrich_with_gemini로 보강.
    """
    cat = categorize_period_data(
        completion_rate, emotion_distribution, avg_mood, mood_stdev,
        previous_completion_rate,
    )
    return cat, _build_static_diagnosis(cat, previous_completion_rate)
