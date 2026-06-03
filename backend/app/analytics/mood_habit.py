"""사용자별 mood × habit 상관관계 분석.

사용 시나리오 (report_generator 에서 호출):
  - 최근 N일 일기의 mood_score 분포를 quartile로 분리
  - 각 활성 habit에 대해 "기분 좋은 날" vs "기분 무거운 날" 이행률 비교
  - 차이가 의미 있는(>=25%p) habit만 인사이트 문장 후보로 반환

해석 방향:
  - high_better:  기분 좋을 때 더 잘함 → "컨디션과 함께 가는 습관"
  - low_better:   기분 무거울 때 더 잘함 → "어려운 시기 회복 루틴"
"""
from dataclasses import dataclass
from datetime import date, timedelta
from typing import Literal

from sqlalchemy.orm import Session

from app.models import Diary, Habit, HabitLog


DEFAULT_LOOKBACK_DAYS = 60
MIN_DIARY_POINTS = 10           # 분석 가능 최소 일기 수
MIN_GROUP_SIZE = 3              # high/low 그룹 각각 최소 3일
DIFF_THRESHOLD = 0.25           # 25%p 이상 차이만 인사이트로


@dataclass
class MoodHabitInsight:
    habit_title: str
    high_mood_rate: float
    low_mood_rate: float
    diff_pct: int                                # 양수면 high가 더 높음
    direction: Literal["high_better", "low_better"]


def compute_mood_habit_insights(
    db: Session,
    user_id: int,
    days: int = DEFAULT_LOOKBACK_DAYS,
) -> list[MoodHabitInsight]:
    since = date.today() - timedelta(days=days)

    diaries = db.query(Diary).filter(
        Diary.user_id == user_id,
        Diary.date >= since,
        Diary.mood_score.isnot(None),
        Diary.deleted_at.is_(None),
    ).all()
    if len(diaries) < MIN_DIARY_POINTS:
        return []

    # 같은 날 일기 여러 개면 평균 — 일자당 단일 mood 값
    mood_by_date: dict[date, list[float]] = {}
    for d in diaries:
        mood_by_date.setdefault(d.date, []).append(d.mood_score)
    daily_mood = {d: sum(v) / len(v) for d, v in mood_by_date.items()}

    if len(daily_mood) < MIN_DIARY_POINTS:
        return []

    sorted_moods = sorted(daily_mood.values())
    n = len(sorted_moods)
    p33 = sorted_moods[n // 3]
    p66 = sorted_moods[(2 * n) // 3]

    high_dates = {d for d, m in daily_mood.items() if m >= p66}
    low_dates = {d for d, m in daily_mood.items() if m <= p33}
    if len(high_dates) < MIN_GROUP_SIZE or len(low_dates) < MIN_GROUP_SIZE:
        return []

    active_habits = db.query(Habit).filter(
        Habit.user_id == user_id,
        Habit.is_active.is_(True),
        Habit.deleted_at.is_(None),
    ).all()

    insights: list[MoodHabitInsight] = []
    for h in active_habits:
        # 두 그룹에서 이 habit이 완료된 날 수
        high_done = db.query(HabitLog).filter(
            HabitLog.habit_id == h.id,
            HabitLog.date.in_(high_dates),
            HabitLog.is_completed.is_(True),
        ).count()
        low_done = db.query(HabitLog).filter(
            HabitLog.habit_id == h.id,
            HabitLog.date.in_(low_dates),
            HabitLog.is_completed.is_(True),
        ).count()

        high_rate = high_done / len(high_dates)
        low_rate = low_done / len(low_dates)
        diff = high_rate - low_rate

        if abs(diff) >= DIFF_THRESHOLD:
            insights.append(MoodHabitInsight(
                habit_title=h.title,
                high_mood_rate=round(high_rate, 2),
                low_mood_rate=round(low_rate, 2),
                diff_pct=round(diff * 100),
                direction="high_better" if diff > 0 else "low_better",
            ))

    insights.sort(key=lambda i: abs(i.diff_pct), reverse=True)
    return insights[:3]


def build_mood_habit_paragraph(insights: list[MoodHabitInsight]) -> str:
    """인사이트 리스트 → 사용자에게 보여줄 1~2문장.
    최대 2개까지만 합쳐서 자연스러운 단락으로.
    """
    if not insights:
        return ""

    sentences: list[str] = []
    for ins in insights[:2]:
        hi_pct = round(ins.high_mood_rate * 100)
        lo_pct = round(ins.low_mood_rate * 100)
        if ins.direction == "high_better":
            sentences.append(
                f"기분이 좋았던 날엔 '{ins.habit_title}'을(를) "
                f"{hi_pct}%, 무거웠던 날엔 {lo_pct}% 이행하셨어요. "
                "컨디션과 함께 움직이는 습관이에요."
            )
        else:
            sentences.append(
                f"흥미롭게도 '{ins.habit_title}'은(는) 기분이 무거웠던 날에 "
                f"{lo_pct}%, 좋았던 날엔 {hi_pct}% 이행하셨어요. "
                "어려운 시기를 버티게 해주는 회복 루틴일 수 있어요."
            )
    return " ".join(sentences)
