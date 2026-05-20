"""주간/월간 데이터 집계.
이행률, 평균 감정, 감정 분포, mood_score 시계열을 계산.
"""
from collections import defaultdict
from dataclasses import dataclass
from datetime import date, timedelta
from typing import Optional

from sqlalchemy import and_
from sqlalchemy.orm import Session

from app.feedback.constants import ALL_EMOTIONS
from app.models import Diary, EmotionAnalysis, Habit, HabitLog


@dataclass
class PeriodAggregate:
    period_start: date
    period_end: date
    completion_rate: float                        # 0.0 ~ 1.0
    completion_count: int                         # 완료한 (habit, day) 수
    expected_count: int                           # 예정된 (habit, day) 수
    diary_count: int
    analyzed_diary_count: int
    mood_scores: list[float]                      # 일별 평균 mood (시계열)
    avg_mood: Optional[float]                     # 평균
    emotion_distribution: dict[str, float]        # 정규화된 감정 분포 (합=1)


def _is_habit_due_on(habit: Habit, day: date) -> bool:
    """해당 날짜에 이 habit이 예정되어 있는지."""
    freq = habit.frequency
    if freq == "daily":
        return True
    weekday = day.weekday()  # Mon=0 ... Sun=6
    if freq == "weekdays":
        return weekday < 5
    if freq == "weekends":
        return weekday >= 5
    if isinstance(freq, dict) and freq.get("type") == "custom":
        return weekday in (freq.get("days") or [])
    return False


def aggregate_period(
    db: Session, user_id: int, start: date, end: date
) -> PeriodAggregate:
    """[start, end] 구간 (양 끝 포함) 집계."""

    # 활성 습관 (해당 기간 안에 활성이었던 것)
    habits = db.query(Habit).filter(
        Habit.user_id == user_id,
        Habit.deleted_at.is_(None),
    ).all()

    # 기간 내 예정/완료 카운트
    expected = 0
    completed = 0
    days = (end - start).days + 1

    # 완료 로그 한 번에 가져옴
    habit_ids = [h.id for h in habits]
    logs = db.query(HabitLog).filter(
        HabitLog.habit_id.in_(habit_ids or [-1]),
        HabitLog.date >= start,
        HabitLog.date <= end,
        HabitLog.is_completed.is_(True),
    ).all()
    log_set = {(l.habit_id, l.date) for l in logs}

    for h in habits:
        for offset in range(days):
            day = start + timedelta(days=offset)
            # 해당 날짜에 활성이었어야 함
            if h.deactivated_at and h.deactivated_at.date() <= day:
                continue
            if not _is_habit_due_on(h, day):
                continue
            expected += 1
            if (h.id, day) in log_set:
                completed += 1

    completion_rate = completed / expected if expected > 0 else 0.0

    # 일기 + 감정 분포
    diaries = db.query(Diary).filter(
        Diary.user_id == user_id,
        Diary.date >= start,
        Diary.date <= end,
        Diary.deleted_at.is_(None),
    ).all()
    diary_count = len(diaries)
    diary_ids = [d.id for d in diaries]

    # mood_scores: 일별 평균 (같은 날 여러 일기 대비)
    mood_by_day: dict[date, list[float]] = defaultdict(list)
    for d in diaries:
        if d.mood_score is not None:
            mood_by_day[d.date].append(d.mood_score)
    mood_scores = [
        sum(scores) / len(scores) for _, scores in sorted(mood_by_day.items())
    ]
    avg_mood = sum(mood_scores) / len(mood_scores) if mood_scores else None

    # 감정 분포: EmotionAnalysis 테이블에서 distribution 평균
    emotion_analyses = db.query(EmotionAnalysis).filter(
        EmotionAnalysis.diary_id.in_(diary_ids or [-1])
    ).all()
    analyzed_count = len(emotion_analyses)

    raw_dist: dict[str, float] = defaultdict(float)
    for ea in emotion_analyses:
        if not ea.distribution:
            continue
        for emo, score in ea.distribution.items():
            if emo in ALL_EMOTIONS:
                raw_dist[emo] += score

    # KoELECTRA 분석 없으면 → 사용자가 직접 선택한 감정 태그(Diary.emotion_tags)로 fallback
    # 일기마다 선택된 태그를 카운트해서 분포로 정규화
    if sum(raw_dist.values()) == 0:
        for d in diaries:
            for tag in (d.emotion_tags or []):
                if tag in ALL_EMOTIONS:
                    raw_dist[tag] += 1.0

    total = sum(raw_dist.values())
    if total > 0:
        emotion_distribution = {k: round(v / total, 4) for k, v in raw_dist.items()}
    else:
        emotion_distribution = {}

    return PeriodAggregate(
        period_start=start,
        period_end=end,
        completion_rate=completion_rate,
        completion_count=completed,
        expected_count=expected,
        diary_count=diary_count,
        analyzed_diary_count=analyzed_count,
        mood_scores=mood_scores,
        avg_mood=avg_mood,
        emotion_distribution=emotion_distribution,
    )
