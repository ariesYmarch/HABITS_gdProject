"""줄글 형식 리포트 생성기.

사용자 데이터(이행률, 감정 분포, 변동성)를 분석해 여러 문단의 줄글 + 종합 진단 + 권장 행동을 만든다.
Gemini 미사용 시에도 단순 메시지가 아닌 실제 분석 리포트를 제공.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Optional

from app.analytics.aggregation import PeriodAggregate
from app.feedback.constants import (
    EMOTION_LABELS,
    NEGATIVE_EMOTIONS,
    POSITIVE_EMOTIONS,
)
from app.feedback.exceptions import ExceptionDetection


@dataclass
class NarrativeReport:
    """줄글 리포트 + 진단 + 권장 행동."""
    summary: str                # 한 줄 요약
    paragraphs: list[str]       # 분석 문단들 (3-5개)
    diagnosis: str              # 종합 진단 ("안정적", "주의 필요" 등)
    recommendation: Optional[dict] = None
    # recommendation 형태:
    # {
    #   "kind": "reduce_frequency" | "increase_frequency" | "add_habit" | "rest",
    #   "label": "빈도 축소",
    #   "message": "...",
    #   "habit_id": int (선택)
    # }


# ===== Helper =====
def _bucket_label(rate: float) -> str:
    if rate < 0.30:
        return "낮음"
    if rate <= 0.70:
        return "보통"
    return "높음"


def _bucket_kind(rate: float) -> str:
    if rate < 0.30:
        return "low"
    if rate <= 0.70:
        return "mid"
    return "high"


def _top_emotions(distribution: dict[str, float], top_n: int = 3) -> list[tuple[str, float]]:
    return sorted(distribution.items(), key=lambda x: x[1], reverse=True)[:top_n]


def _emotion_korean(emo: str) -> str:
    return EMOTION_LABELS.get(emo, emo)


def _valence_summary(distribution: dict[str, float]) -> str:
    pos = sum(v for k, v in distribution.items() if k in POSITIVE_EMOTIONS)
    neg = sum(v for k, v in distribution.items() if k in NEGATIVE_EMOTIONS)
    if pos > 0 and neg > 0 and abs(pos - neg) < 0.15:
        return "혼합"
    if pos > neg:
        return "긍정 우세"
    if neg > pos:
        return "부정 우세"
    return "데이터 없음"


# 8개 감정 라벨에 한해 조사를 미리 고정 (받침 + 어휘 자연성 고려)
_EMOTION_PARTICLES: dict[str, dict[str, str]] = {
    # joy / hope / sadness / 등은 받침 ㅁ/ㅇ → 을·과
    "기쁨":   {"obj": "기쁨을",   "and": "기쁨과",   "subj": "기쁨이"},
    "평온":   {"obj": "평온을",   "and": "평온과",   "subj": "평온이"},
    "뿌듯":   {"obj": "뿌듯함을", "and": "뿌듯함과", "subj": "뿌듯함이"},
    "희망":   {"obj": "희망을",   "and": "희망과",   "subj": "희망이"},
    "슬픔":   {"obj": "슬픔을",   "and": "슬픔과",   "subj": "슬픔이"},
    "짜증":   {"obj": "짜증을",   "and": "짜증과",   "subj": "짜증이"},
    "불안":   {"obj": "불안을",   "and": "불안과",   "subj": "불안이"},
    "피로":   {"obj": "피로를",   "and": "피로와",   "subj": "피로가"},
}


def _emo_with_particle(emo_key: str, kind: str) -> str:
    label = _emotion_korean(emo_key)
    p = _EMOTION_PARTICLES.get(label)
    if not p:
        return label
    return p.get(kind, label)


def _format_emotion_phrase(distribution: dict[str, float]) -> str:
    """감정 분포를 자연스러운 한국어 구절로."""
    if not distribution:
        return "감정 분석 데이터가 부족했어요"
    tops = _top_emotions(distribution, 2)
    if len(tops) == 1 or tops[1][1] < 0.15:
        return f"주로 {_emo_with_particle(tops[0][0], 'obj')} 느끼셨고"
    return (
        f"{_emo_with_particle(tops[0][0], 'and')} "
        f"{_emo_with_particle(tops[1][0], 'subj')} 함께 나타났고"
    )


# ===== 본 빌더 =====
def build_narrative(
    period_label: str,
    agg: PeriodAggregate,
    exc: ExceptionDetection,
    target_habit_id: Optional[str] = None,
    target_habit_title: Optional[str] = None,
    target_habit_rate: Optional[float] = None,
    satisfaction_avg: Optional[float] = None,
) -> NarrativeReport:
    """
    target_habit_id: 추천 행동의 대상이 될 habit의 client_id (프론트 매칭용 string).
    target_habit_title/rate: 미달 습관의 제목과 이행률. 줄글에 자연스럽게 녹임.
    satisfaction_avg: 사용자 최근 만족도 평균 (-1~1). 정적 톤 조정에 사용.
    """
    rate_pct = round(agg.completion_rate * 100)
    bucket = _bucket_kind(agg.completion_rate)
    bucket_label = _bucket_label(agg.completion_rate)
    valence = _valence_summary(agg.emotion_distribution)
    emo_phrase = _format_emotion_phrase(agg.emotion_distribution)

    # 1. 한 줄 요약
    summary = (
        f"{period_label} 동안 이행률 {rate_pct}%, 감정은 {valence}로 나타났어요."
    )

    paragraphs: list[str] = []

    # 2. 행동 분석 문단
    behavior = (
        f"이번 기간 예정된 습관 {agg.expected_count}건 중 "
        f"{agg.completion_count}건을 완료해 이행률이 {rate_pct}%였어요. "
        f"이는 '{bucket_label}' 구간에 해당해요."
    )
    paragraphs.append(behavior)

    # 3. 감정 분석 문단
    if agg.diary_count == 0:
        paragraphs.append(
            "이번 기간 작성한 일기가 없어 감정 분석은 생략됐어요. "
            "일기를 함께 기록하면 다음 리포트에서 더 풍부한 분석이 가능해요."
        )
    elif agg.emotion_distribution:
        # 감정 분포가 있음 (KoELECTRA 분석 결과 또는 사용자 버튼 입력 fallback)
        is_text_analyzed = agg.analyzed_diary_count > 0
        if is_text_analyzed:
            analyzed_phrase = (
                f"이번 기간 일기 {agg.diary_count}건 중 {agg.analyzed_diary_count}건이 분석됐고, "
                f"{emo_phrase}, 전반적인 감정 흐름은 {valence} 분포였어요."
            )
        else:
            # 버튼 입력만으로 분포가 만들어진 경우
            analyzed_phrase = (
                f"이번 기간 일기 {agg.diary_count}건에서 직접 선택하신 감정을 종합하면 "
                f"{emo_phrase}, 전반적인 흐름은 {valence}이었어요."
            )
        if agg.avg_mood is not None:
            mood_pct = round((agg.avg_mood + 1) * 50)
            analyzed_phrase += f" 감정 점수는 평균 {mood_pct}점이었어요."
        paragraphs.append(analyzed_phrase)
    else:
        # 일기는 있지만 감정 태그/분석 모두 없음
        analyzed_phrase = f"이번 기간 일기 {agg.diary_count}건을 기록하셨어요."
        if agg.avg_mood is not None:
            mood_pct = round((agg.avg_mood + 1) * 50)
            analyzed_phrase += f" 직접 입력하신 감정 점수는 평균 {mood_pct}점이었어요."
        paragraphs.append(analyzed_phrase)

    # 4. 상관관계/패턴 문단
    if "emotion_completion_inversion" in exc.reasons:
        inv = exc.detail.get("inversion", {})
        if inv.get("type") == "high_completion_negative_emotion":
            paragraphs.append(
                f"눈에 띄는 점은 이행률이 {rate_pct}%로 높았는데도 부정 감정이 우세했다는 거예요. "
                "이런 패턴은 '잘 해내고 있지만 마음은 지쳐가는' 신호일 수 있어요. "
                "성취 자체와는 별개로 본인의 컨디션을 한 번 들여다보는 시간이 필요할지도 몰라요."
            )
        else:
            paragraphs.append(
                f"흥미로운 점은 감정은 긍정적이었지만 이행률이 {rate_pct}%에 머물렀다는 거예요. "
                "기분이 좋은 날에도 실천이 어려웠다면, 습관 자체의 적합성을 점검해볼 수 있어요. "
                "지금 설정된 빈도나 시간대가 본인 일과에 잘 맞는지 다시 살펴봐도 좋겠어요."
            )
    elif "high_emotion_variance" in exc.reasons:
        var = exc.detail.get("variance", {})
        paragraphs.append(
            f"이번 기간 감정 변동성이 평소보다 컸어요(표준편차 {var.get('stdev', '?')}). "
            "기복이 큰 시기엔 평균만 보면 평범해 보일 수 있지만, "
            "실제로는 감정의 진폭이 컸기 때문에 작은 회복 루틴을 추가해두는 게 도움돼요."
        )
    elif "complex_emotions" in exc.reasons:
        cx = exc.detail.get("complex", {})
        emos = ", ".join(_emotion_korean(e) for e in (cx.get("emotions") or [])[:3])
        paragraphs.append(
            f"이번 기간엔 여러 감정({emos})이 동시에 나타났어요. "
            "다양한 감정이 공존하는 시기는 자기 자신을 더 풍부하게 이해할 수 있는 기회이기도 해요. "
            "어떤 상황에서 어떤 감정이 올라왔는지 일기로 자세히 기록하면 패턴을 파악하기 좋아요."
        )
    elif agg.diary_count > 0 and valence == "긍정 우세" and bucket == "high":
        paragraphs.append(
            "이행률과 긍정 감정이 함께 높게 나온다는 건, "
            "현재의 습관이 부담을 주지 않으면서도 본인에게 만족감을 주는 안정적인 루틴으로 자리잡고 있다는 신호예요. "
            "이대로 유지해도 좋고, 새로운 도전을 한두 가지 더해봐도 좋겠어요."
        )
    elif agg.diary_count > 0 and valence == "부정 우세" and bucket == "low":
        paragraphs.append(
            "감정이 무거웠던 만큼 이행률도 낮았던 한 기간이었네요. "
            "이건 무리하지 않은 자연스러운 결과예요. "
            "회복이 우선이고, 그 다음에 다시 작은 단위부터 시작하면 됩니다."
        )

    # 5. 종합 진단
    if bucket == "high" and valence == "긍정 우세":
        diagnosis = "안정적 - 현재 루틴이 잘 맞아요"
        recommendation = {
            "kind": "add_habit",
            "label": "새 습관 추가",
            "message": "지금 흐름이 좋으니 새 습관을 한두 가지 더해봐도 좋아요.",
        }
    elif bucket == "low" and valence == "부정 우세":
        diagnosis = "회복 필요 - 부담을 줄여보세요"
        recommendation = {
            "kind": "reduce_frequency",
            "label": "빈도 축소",
            "message": "지금은 회복이 우선이에요. 가장 부담스러운 습관 한 가지의 빈도를 줄여보는 게 어떨까요?",
        }
    elif "emotion_completion_inversion" in exc.reasons:
        diagnosis = "주의 - 성취와 컨디션의 균형 점검 필요"
        recommendation = {
            "kind": "rest",
            "label": "휴식 추가",
            "message": "잘 해내고 있지만 컨디션이 무거워요. 짧은 회복 시간을 일과에 추가해보세요.",
        }
    elif bucket == "low":
        diagnosis = "조정 필요 - 부담을 낮출 시점"
        recommendation = {
            "kind": "reduce_frequency",
            "label": "빈도 축소",
            "message": "이행이 어려웠다면 지금 설정된 빈도가 본인에게 부담일 수 있어요.",
        }
    elif bucket == "high":
        diagnosis = "양호 - 안정적으로 유지 중"
        recommendation = None
    else:
        diagnosis = "보통 - 흐름은 만들어지는 중"
        recommendation = None

    # 5b. 미달 습관 줄글 통합 (이행률이 낮을 때만)
    if (
        target_habit_title and target_habit_rate is not None
        and target_habit_rate < 0.30
    ):
        miss_pct = round(target_habit_rate * 100)
        paragraphs.append(
            f"이번 기간 가장 어려웠던 건 '{target_habit_title}'으로, 이행률이 {miss_pct}% 정도였어요. "
            "지금 설정된 빈도나 시간대가 본인 일과에 잘 맞는지 한 번 살펴봐도 좋겠어요."
        )

    # 5c. 사용자 최근 만족도 반영 - 부정적이면 공감 한 줄, 긍정적이면 격려 한 줄
    if satisfaction_avg is not None:
        if satisfaction_avg < -0.3:
            paragraphs.append(
                "최근 리포트가 충분히 도움되지 못한 것 같아 아쉬웠어요. "
                "어떤 부분이 더 필요했는지 이번 평가로 알려주시면 다음 리포트에 반영할게요."
            )
        elif satisfaction_avg > 0.3:
            paragraphs.append(
                "최근 리포트들에 좋은 평가를 주셔서 감사해요. 같은 흐름으로 이어가볼게요."
            )

    # target habit 주입 (수정창에서 어떤 habit 대상으로 띄울지)
    if recommendation and target_habit_id:
        recommendation = {**recommendation, "habit_id": target_habit_id}

    return NarrativeReport(
        summary=summary,
        paragraphs=paragraphs,
        diagnosis=diagnosis,
        recommendation=recommendation,
    )
