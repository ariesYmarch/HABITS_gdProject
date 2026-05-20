"""주간/월간 정적 피드백 템플릿.

규칙:
- 단일 감정(top1 confidence >= SINGLE_THRESHOLD) → SINGLE_TEMPLATES
- 2개 감정(top2도 >= COMBO_THRESHOLD) → COMBO_TEMPLATES (없으면 valence 기반 fallback)
- 3개 이상 동시 도출 → 정적 템플릿 미지원 → Gemini 호출 신호 반환

이행률 구간:
- low : < 0.30
- mid : 0.30 ~ 0.70
- high : > 0.70
"""
from typing import Literal, Optional

from app.feedback.constants import (
    EMOTION_LABELS,
    NEGATIVE_EMOTIONS,
    POSITIVE_EMOTIONS,
)


CompletionBucket = Literal["low", "mid", "high"]
EmotionType = str  # joy / calm / proud / hope / sadness / anger / anxiety / fatigue


SINGLE_TEMPLATES: dict[EmotionType, dict[CompletionBucket, list[str]]] = {
    # ===== 긍정 4 =====
    "joy": {
        "low": [
            "기분은 좋았는데 이행률은 {rate}% 였어요. 가벼운 마음 그대로, 다음 주는 한 가지 작게 챙겨봐요."
        ],
        "mid": [
            "{rate}% 달성, 기쁜 날들도 있었네요. 좋은 흐름이에요."
        ],
        "high": [
            "{rate}% 이행에 기쁨까지! 이번 주 정말 잘 해냈어요."
        ],
    },
    "calm": {
        "low": [
            "마음은 평온했지만 이행률은 {rate}%. 차분한 흐름 속에서 작은 한 걸음만 더 시도해봐요."
        ],
        "mid": [
            "평온한 한 주, {rate}% 달성. 무리 없이 잘 흘러가고 있어요."
        ],
        "high": [
            "평온함 속에 {rate}% 이행까지, 안정감 있는 한 주였네요."
        ],
    },
    "proud": {
        "low": [
            "뿌듯함은 있었는데 {rate}%에 머물렀어요. 이미 충분히 의미 있는 시도를 한 한 주였어요."
        ],
        "mid": [
            "{rate}% 달성, 뿌듯한 순간들이 있었네요. 그 감정을 기억해두면 다음에 도움이 돼요."
        ],
        "high": [
            "{rate}% 이행, 뿌듯해할 만해요. 본인을 인정해주세요."
        ],
    },
    "hope": {
        "low": [
            "희망적인 분위기였지만 이행률은 {rate}%. 다음 주에 실현해볼 작은 목표 하나 잡아봐요."
        ],
        "mid": [
            "{rate}% 달성과 함께 희망적인 한 주였어요. 다음 주도 기대돼요."
        ],
        "high": [
            "{rate}%에 희망까지, 다음 주 모멘텀이 좋겠어요."
        ],
    },
    # ===== 부정 4 =====
    "sadness": {
        "low": [
            "슬픈 감정이 컸던 한 주, 이행률 {rate}%는 자연스러워요. 무리하지 마세요."
        ],
        "mid": [
            "마음이 무거웠을 텐데 {rate}% 해냈어요. 충분히 잘 견뎠어요."
        ],
        "high": [
            "슬픔 속에서도 {rate}% 이행. 그 노력은 정말 대단한 거예요."
        ],
    },
    "anger": {
        "low": [
            "짜증이 잦았던 한 주, {rate}%는 사실 자연스러운 결과예요. 회복에 집중해봐요."
        ],
        "mid": [
            "기분 변화가 있었지만 {rate}% 해냈네요. 잘 버텼어요."
        ],
        "high": [
            "짜증 났던 순간에도 {rate}% 이행, 자기 컨트롤이 좋았어요."
        ],
    },
    "anxiety": {
        "low": [
            "불안이 높았던 한 주, {rate}% 이행. 부담을 덜 수 있는 작은 습관 하나만 남겨봐도 좋아요."
        ],
        "mid": [
            "불안 속에서도 {rate}% 챙겼네요. 작은 실천 자체가 안정감을 줄 수 있어요."
        ],
        "high": [
            "불안 속에서 {rate}% 이행은 굉장한 일이에요. 본인을 충분히 인정해주세요."
        ],
    },
    "fatigue": {
        "low": [
            "많이 지쳤던 한 주, {rate}% 이행. 회복이 우선이에요."
        ],
        "mid": [
            "피곤한 와중에 {rate}% 챙겼어요. 무리하지 않은 균형이 보여요."
        ],
        "high": [
            "피로함에도 {rate}% 이행, 정말 대단했어요. 이번 주말은 쉬어가도 좋아요."
        ],
    },
}


# 자주 함께 나타나는 감정 조합 (set 기준 정렬된 tuple로 키)
COMBO_TEMPLATES: dict[tuple[EmotionType, EmotionType], dict[CompletionBucket, list[str]]] = {
    ("calm", "joy"): {
        "low": [
            "기쁘면서도 평온했던 한 주, 이행률은 {rate}%. 좋은 컨디션을 다음 주 행동으로 이어가봐요."
        ],
        "mid": [
            "평온함과 기쁨이 공존한 {rate}% 한 주, 흐름이 좋아요."
        ],
        "high": [
            "기쁨과 평온 속에 {rate}% 이행, 이상적인 한 주였어요."
        ],
    },
    ("hope", "proud"): {
        "low": [
            "뿌듯함과 희망이 있었지만 이행률 {rate}%. 그 감정 자체가 다음 주 동력이 될 거예요."
        ],
        "mid": [
            "뿌듯함과 희망 속에서 {rate}% 달성, 좋은 모멘텀이에요."
        ],
        "high": [
            "{rate}% 이행에 뿌듯함과 희망까지, 자기효능감이 정말 잘 쌓이고 있어요."
        ],
    },
    ("anxiety", "fatigue"): {
        "low": [
            "불안과 피로가 겹친 한 주, {rate}%는 당연한 결과예요. 이번 주말은 회복에 우선순위를 두세요."
        ],
        "mid": [
            "불안하고 지친 와중에 {rate}% 해낸 건 정말 큰 의미예요."
        ],
        "high": [
            "힘든 컨디션에도 {rate}% 이행, 본인의 회복력을 인정해주세요."
        ],
    },
    ("anger", "anxiety"): {
        "low": [
            "짜증과 불안이 많았던 한 주, {rate}%. 마음 다스리는 짧은 루틴 하나 추가하면 좋겠어요."
        ],
        "mid": [
            "감정 기복 속에서 {rate}% 이행, 안정감을 찾으려는 시도가 보여요."
        ],
        "high": [
            "감정이 출렁였는데도 {rate}% 챙긴 한 주, 자기 조절력이 인상적이에요."
        ],
    },
    ("anger", "fatigue"): {
        "low": [
            "짜증과 피로가 겹친 한 주, {rate}%. 부담을 줄이고 회복에 집중해봐요."
        ],
        "mid": [
            "지치고 짜증 나는 와중에 {rate}% 이행, 충분히 잘 했어요."
        ],
        "high": [
            "힘든 와중에 {rate}% 이행, 정말 단단해진 한 주였어요."
        ],
    },
    ("anxiety", "sadness"): {
        "low": [
            "슬픔과 불안이 함께한 한 주, {rate}%. 회복이 먼저예요. 자신에게 시간을 주세요."
        ],
        "mid": [
            "감정적으로 무거운 한 주에도 {rate}% 챙겼어요. 그 자체로 의미가 커요."
        ],
        "high": [
            "어두운 감정 속에서도 {rate}% 이행, 강한 회복력이 보여요."
        ],
    },
}


# 감정 데이터 자체가 없는 경우 (일기 미작성 등)
COMPLETION_ONLY_TEMPLATES: dict[CompletionBucket, list[str]] = {
    "low": ["이번 주 이행률은 {rate}%. 다음 주는 작은 한 가지부터 다시 시작해봐요."],
    "mid": ["이번 주 이행률 {rate}%. 흐름은 만들어지고 있어요."],
    "high": ["이번 주 이행률 {rate}%, 잘 해냈어요!"],
}


# valence 기반 fallback (구체 조합이 COMBO_TEMPLATES에 없을 때)
VALENCE_FALLBACK: dict[str, dict[CompletionBucket, list[str]]] = {
    "positive": {
        "low": ["좋은 감정이 있었지만 이행률은 {rate}%. 다음 주 작은 목표 하나로 시작해봐요."],
        "mid": ["긍정적인 분위기 속에 {rate}% 달성, 좋은 한 주였어요."],
        "high": ["긍정적인 감정과 함께 {rate}% 이행, 이상적인 한 주였어요."],
    },
    "negative": {
        "low": ["감정이 무거웠던 한 주, {rate}%는 자연스러운 결과예요. 회복에 집중해봐요."],
        "mid": ["힘든 감정 속에서도 {rate}% 챙겼어요. 그 자체로 충분해요."],
        "high": ["어려운 감정에도 {rate}% 이행, 정말 대단해요."],
    },
    "mixed": {
        "low": ["감정이 다양했던 한 주, {rate}%. 다음 주는 한 가지에 집중해봐요."],
        "mid": ["감정 기복 속에 {rate}% 달성, 균형을 잡아가는 한 주였어요."],
        "high": ["다양한 감정 속에 {rate}% 이행, 자기 조절이 잘 된 한 주였어요."],
    },
}
