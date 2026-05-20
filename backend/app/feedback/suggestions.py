"""저이행률 / 졸업 후보 등 사용자 제안 생성.

원칙: 명령이 아닌 선택지로 제시, 수용 여부는 사용자 결정 (SDT 자율성).
"""
from dataclasses import dataclass
from datetime import date, timedelta
from typing import Optional

from sqlalchemy.orm import Session

from app.feedback.constants import POSITIVE_EMOTIONS
from app.models import Diary, EmotionAnalysis, Habit, HabitLog


# 임계값
LOW_COMPLETION_THRESHOLD = 0.30          # 이 이하 시 제안 트리거
GRADUATION_WEEK_COUNT = 4                # 4주 연속 평가
GRADUATION_RATE_THRESHOLD = 0.90         # 90% 이상
GRADUATION_POSITIVE_THRESHOLD = 0.50     # 긍정 감정 비중 50% 이상


@dataclass
class HabitSuggestion:
    """이행률 저조 시 제안."""
    habit_id: int
    habit_title: str
    completion_rate: float
    options: list[dict]   # [{kind: "reduce_frequency"|"change_habit", message: ...}]


@dataclass
class GraduationCandidate:
    """졸업 후보 습관."""
    habit_id: int
    habit_title: str
    completion_rate: float
    positive_emotion_ratio: float
    weeks_evaluated: int
    message: str


def _is_due_on(habit: Habit, day: date) -> bool:
    freq = habit.frequency
    if freq == "daily":
        return True
    weekday = day.weekday()
    if freq == "weekdays":
        return weekday < 5
    if freq == "weekends":
        return weekday >= 5
    if isinstance(freq, dict) and freq.get("type") == "custom":
        return weekday in (freq.get("days") or [])
    return False


def _habit_completion_rate(
    db: Session, habit: Habit, start: date, end: date
) -> tuple[float, int, int]:
    """[start, end] 구간 habit의 이행률. (rate, completed, expected)"""
    expected = 0
    days = (end - start).days + 1
    for i in range(days):
        d = start + timedelta(days=i)
        if habit.deactivated_at and habit.deactivated_at.date() <= d:
            continue
        if _is_due_on(habit, d):
            expected += 1

    if expected == 0:
        return 0.0, 0, 0

    completed = db.query(HabitLog).filter(
        HabitLog.habit_id == habit.id,
        HabitLog.date >= start,
        HabitLog.date <= end,
        HabitLog.is_completed.is_(True),
    ).count()

    return completed / expected, completed, expected


def detect_low_completion_suggestion(
    db: Session, user_id: int, week_start: date
) -> Optional[HabitSuggestion]:
    """주간 이행률 30% 미만이면 가장 미이행률 높은 habit에 대해 제안 생성."""
    week_end = week_start + timedelta(days=6)

    habits = db.query(Habit).filter(
        Habit.user_id == user_id,
        Habit.is_active.is_(True),
        Habit.deleted_at.is_(None),
    ).all()

    if not habits:
        return None

    # 각 habit별 이행률 계산, 가장 낮은 habit 찾기
    worst: Optional[tuple[Habit, float]] = None
    for h in habits:
        rate, _, expected = _habit_completion_rate(db, h, week_start, week_end)
        if expected == 0:
            continue
        if worst is None or rate < worst[1]:
            worst = (h, rate)

    if worst is None or worst[1] >= LOW_COMPLETION_THRESHOLD:
        return None

    habit, rate = worst
    rate_pct = round(rate * 100)

    options = [
        {
            "kind": "reduce_frequency",
            "message": f"'{habit.title}' 빈도를 줄여서 부담을 낮춰볼까요? (예: 매일 → 평일만)",
        },
        {
            "kind": "change_habit",
            "message": f"'{habit.title}' 대신 더 작고 부담 적은 습관으로 바꿔봐도 좋아요.",
        },
        {
            "kind": "keep",
            "message": "현재 그대로 유지하고 다음 주에 다시 시도해볼게요.",
        },
    ]

    return HabitSuggestion(
        habit_id=habit.id,
        habit_title=habit.title,
        completion_rate=rate,
        options=options,
    )


def detect_graduation_candidates(
    db: Session, user_id: int, today: date
) -> list[GraduationCandidate]:
    """4주 연속 90%+ 이행률 AND 해당 습관 실천일 긍정 감정 비중 50% 이상인 습관."""
    period_end = today
    period_start = today - timedelta(days=GRADUATION_WEEK_COUNT * 7 - 1)

    habits = db.query(Habit).filter(
        Habit.user_id == user_id,
        Habit.is_active.is_(True),
        Habit.deleted_at.is_(None),
    ).all()

    candidates: list[GraduationCandidate] = []

    for h in habits:
        # 4주 활성이었던 habit만 대상
        if h.created_at and h.created_at.date() > period_start:
            continue

        rate, _, expected = _habit_completion_rate(db, h, period_start, period_end)
        if expected == 0 or rate < GRADUATION_RATE_THRESHOLD:
            continue

        # 해당 habit 실천한 날(=완료한 날)의 일기 감정 분석
        completed_dates = [
            l.date for l in db.query(HabitLog).filter(
                HabitLog.habit_id == h.id,
                HabitLog.date >= period_start,
                HabitLog.date <= period_end,
                HabitLog.is_completed.is_(True),
            ).all()
        ]
        if not completed_dates:
            continue

        analyses = db.query(EmotionAnalysis).join(
            Diary, Diary.id == EmotionAnalysis.diary_id
        ).filter(
            Diary.user_id == user_id,
            Diary.date.in_(completed_dates),
            Diary.deleted_at.is_(None),
        ).all()

        if not analyses:
            # 감정 데이터 부족 → 졸업 보류
            continue

        positive_dominant = 0
        for ea in analyses:
            if not ea.distribution:
                continue
            top = max(ea.distribution.items(), key=lambda x: x[1])[0]
            if top in POSITIVE_EMOTIONS:
                positive_dominant += 1

        ratio = positive_dominant / len(analyses)
        if ratio < GRADUATION_POSITIVE_THRESHOLD:
            continue

        candidates.append(GraduationCandidate(
            habit_id=h.id,
            habit_title=h.title,
            completion_rate=rate,
            positive_emotion_ratio=ratio,
            weeks_evaluated=GRADUATION_WEEK_COUNT,
            message=f"'{h.title}'이(가) 자연스러운 루틴이 된 것 같아요. 졸업하고 새로운 습관에 도전해볼까요?",
        ))

    return candidates
