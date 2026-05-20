"""JITAI(Just-In-Time Adaptive Intervention) 트리거 감지.

3가지 신호:
  1. 연속 미이행: habit별로 마지막 N일 모두 미이행
  2. 부정 감정 반복: 최근 N개 일기 중 부정 감정 우세 비율이 임계값 이상
  3. 시간대 이탈: habit의 time_slot이 지났는데 오늘 미이행

알림 자체(푸시)는 클라이언트가 처리. 서버는 "지금 알림이 필요한지" + "어떤 메시지" 결정.
"""
from dataclasses import dataclass
from datetime import date, datetime, time, timedelta, timezone
from typing import Optional

from sqlalchemy.orm import Session

from app.feedback.constants import EMOTION_LABELS, NEGATIVE_EMOTIONS
from app.models import Diary, EmotionAnalysis, Habit, HabitLog


# 임계값
CONSECUTIVE_MISS_DAYS = 3              # N일 연속 미이행이면 트리거
NEGATIVE_STREAK_COUNT = 3              # 최근 N개 일기 중
NEGATIVE_STREAK_RATIO = 0.66           # 부정 감정 우세 비율 (2/3 이상)

# 시간대 → 마감 시각 매핑 (이 시각 지나면 "오늘 안 하면 못 함"으로 봄)
TIME_SLOT_DEADLINE: dict[str, time] = {
    "morning": time(11, 0),
    "commute": time(10, 0),
    "lunch": time(14, 0),
    "afternoon": time(17, 0),
    "evening": time(21, 0),
    "bedtime": time(23, 30),
    "anytime": time(23, 59),
}


@dataclass
class JitaiTrigger:
    kind: str                      # "consecutive_miss" | "negative_streak" | "time_slot_overdue"
    habit_id: Optional[int] = None
    message: str = ""
    detail: dict = None


def detect_consecutive_misses(db: Session, user_id: int, today: date) -> list[JitaiTrigger]:
    """활성 습관 중 N일 연속 미이행한 것들."""
    triggers: list[JitaiTrigger] = []

    habits = db.query(Habit).filter(
        Habit.user_id == user_id,
        Habit.is_active.is_(True),
        Habit.deleted_at.is_(None),
    ).all()

    if not habits:
        return triggers

    for h in habits:
        # 최근 N일이 모두 미이행인지
        days = [today - timedelta(days=i + 1) for i in range(CONSECUTIVE_MISS_DAYS)]
        log_count = db.query(HabitLog).filter(
            HabitLog.habit_id == h.id,
            HabitLog.date.in_(days),
            HabitLog.is_completed.is_(True),
        ).count()

        if log_count == 0:
            triggers.append(JitaiTrigger(
                kind="consecutive_miss",
                habit_id=h.id,
                message=f"'{h.title}' 습관을 {CONSECUTIVE_MISS_DAYS}일 동안 잠시 쉬어가셨네요. 오늘 가볍게 한 번만 시도해볼까요?",
                detail={"habit_title": h.title, "days_missed": CONSECUTIVE_MISS_DAYS},
            ))

    return triggers


def detect_negative_emotion_streak(
    db: Session, user_id: int, today: date
) -> Optional[JitaiTrigger]:
    """최근 N개 일기에서 부정 감정 우세 비율이 임계값 이상."""
    recent_diaries = db.query(Diary).filter(
        Diary.user_id == user_id,
        Diary.deleted_at.is_(None),
        Diary.date <= today,
    ).order_by(Diary.date.desc()).limit(NEGATIVE_STREAK_COUNT).all()

    if len(recent_diaries) < NEGATIVE_STREAK_COUNT:
        return None

    diary_ids = [d.id for d in recent_diaries]
    analyses = db.query(EmotionAnalysis).filter(
        EmotionAnalysis.diary_id.in_(diary_ids)
    ).all()

    if len(analyses) < NEGATIVE_STREAK_COUNT:
        # 분석 결과 부족 → 트리거 안 함
        return None

    negative_dominant = 0
    dominant_emotion: Optional[str] = None
    for ea in analyses:
        if not ea.distribution:
            continue
        top_emotion = max(ea.distribution.items(), key=lambda x: x[1])[0]
        if top_emotion in NEGATIVE_EMOTIONS:
            negative_dominant += 1
            if dominant_emotion is None:
                dominant_emotion = top_emotion

    ratio = negative_dominant / len(analyses)
    if ratio >= NEGATIVE_STREAK_RATIO:
        emo_label = EMOTION_LABELS.get(dominant_emotion or "", "")
        return JitaiTrigger(
            kind="negative_streak",
            message=f"최근 {emo_label}이 자주 보였어요. 오늘은 자신에게 한 가지 따뜻한 일을 해주는 건 어떨까요?",
            detail={
                "negative_count": negative_dominant,
                "total": len(analyses),
                "ratio": round(ratio, 2),
                "dominant_emotion": dominant_emotion,
            },
        )

    return None


def _is_habit_due_today(habit: Habit, today: date) -> bool:
    freq = habit.frequency
    if freq == "daily":
        return True
    weekday = today.weekday()
    if freq == "weekdays":
        return weekday < 5
    if freq == "weekends":
        return weekday >= 5
    if isinstance(freq, dict) and freq.get("type") == "custom":
        return weekday in (freq.get("days") or [])
    return False


def detect_time_slot_overdue(
    db: Session, user_id: int, now: datetime
) -> list[JitaiTrigger]:
    """오늘 예정 habit 중 time_slot 마감 시각이 지났는데 미이행인 것들."""
    today = now.date()
    current_time = now.time()
    triggers: list[JitaiTrigger] = []

    habits = db.query(Habit).filter(
        Habit.user_id == user_id,
        Habit.is_active.is_(True),
        Habit.deleted_at.is_(None),
    ).all()

    for h in habits:
        if not _is_habit_due_today(h, today):
            continue

        deadline = TIME_SLOT_DEADLINE.get(h.time_slot or "anytime", time(23, 59))
        if current_time < deadline:
            continue  # 아직 마감 전이므로 트리거 안 함

        # 오늘 완료 여부
        completed = db.query(HabitLog).filter(
            HabitLog.habit_id == h.id,
            HabitLog.date == today,
            HabitLog.is_completed.is_(True),
        ).first()

        if completed is None:
            triggers.append(JitaiTrigger(
                kind="time_slot_overdue",
                habit_id=h.id,
                message=f"'{h.title}'의 평소 시간대가 지났어요. 짧게라도 시도해보면 어떨까요?",
                detail={"habit_title": h.title, "time_slot": h.time_slot},
            ))

    return triggers


def detect_all_triggers(
    db: Session, user_id: int, now: Optional[datetime] = None
) -> list[JitaiTrigger]:
    """3가지 신호 모두 평가. 트리거된 것만 리스트로 반환."""
    if now is None:
        now = datetime.now(timezone.utc)
    today = now.date()

    triggers: list[JitaiTrigger] = []
    triggers.extend(detect_consecutive_misses(db, user_id, today))

    neg = detect_negative_emotion_streak(db, user_id, today)
    if neg:
        triggers.append(neg)

    triggers.extend(detect_time_slot_overdue(db, user_id, now))
    return triggers
