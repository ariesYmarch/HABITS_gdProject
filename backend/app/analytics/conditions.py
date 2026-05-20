"""교차 분석 인사이트 노출 조건.

데이터가 부족하면 인사이트는 노출하지 않고 "데이터 부족" 안내만 표시.
일기 미작성 사용자에게 감정-이행률 교차 분석을 강제로 보여주지 않기 위한 가드.
"""
from dataclasses import dataclass
from datetime import date, datetime, timedelta, timezone

from sqlalchemy import and_, func
from sqlalchemy.orm import Session

from app.models import Diary, EmotionAnalysis, Habit, HabitLog


# 임계값 (서비스 운영 중 조정 가능, 추후 config.py로 분리)
MIN_DIARIES_WEEKLY = 3            # 주간 인사이트 최소 일기 수
MIN_DIARIES_MONTHLY = 10          # 월간 인사이트 최소 일기 수
MIN_ANALYZED_DIARIES = 5          # 감정-이행률 상관 분석 최소 분석된 일기 수
MIN_ACTIVE_HABITS = 1             # 분석 대상 활성 습관 최소 개수


@dataclass
class SufficiencyResult:
    sufficient: bool
    reason: str = ""              # 부족 시 사용자 안내 메시지
    actual: dict[str, int] = None # 실제 카운트 (디버깅·UI 표시용)

    def to_dict(self):
        return {"sufficient": self.sufficient, "reason": self.reason, "actual": self.actual or {}}


def _count_diaries(db: Session, user_id: int, start: date, end: date) -> int:
    return db.query(func.count(Diary.id)).filter(
        Diary.user_id == user_id,
        Diary.date >= start,
        Diary.date <= end,
        Diary.deleted_at.is_(None),
    ).scalar() or 0


def _count_active_habits(db: Session, user_id: int) -> int:
    return db.query(func.count(Habit.id)).filter(
        Habit.user_id == user_id,
        Habit.is_active.is_(True),
        Habit.deleted_at.is_(None),
    ).scalar() or 0


def _count_analyzed_diaries(db: Session, user_id: int, start: date, end: date) -> int:
    """감정 분석(KoELECTRA)이 완료된 일기 수."""
    return db.query(func.count(EmotionAnalysis.id)).join(
        Diary, Diary.id == EmotionAnalysis.diary_id
    ).filter(
        Diary.user_id == user_id,
        Diary.date >= start,
        Diary.date <= end,
        Diary.deleted_at.is_(None),
    ).scalar() or 0


def is_weekly_data_sufficient(db: Session, user_id: int, week_start: date) -> SufficiencyResult:
    """주간 인사이트 노출 조건: 일기 3개 이상 + 활성 습관 1개 이상."""
    week_end = week_start + timedelta(days=6)
    diaries = _count_diaries(db, user_id, week_start, week_end)
    habits = _count_active_habits(db, user_id)

    actual = {"diaries": diaries, "active_habits": habits, "min_diaries": MIN_DIARIES_WEEKLY}

    if habits < MIN_ACTIVE_HABITS:
        return SufficiencyResult(False, "활성화된 습관이 없어요. 습관을 먼저 추가해주세요.", actual)

    if diaries < MIN_DIARIES_WEEKLY:
        return SufficiencyResult(
            False,
            f"이번 주 일기가 {diaries}개예요. 인사이트는 {MIN_DIARIES_WEEKLY}개부터 보여드려요.",
            actual,
        )

    return SufficiencyResult(True, "", actual)


def is_monthly_data_sufficient(db: Session, user_id: int, month_start: date) -> SufficiencyResult:
    """월간 인사이트 노출 조건: 일기 10개 이상 + 활성 습관 1개 이상."""
    # 다음달 1일 - 1일 = 이번달 마지막 날
    if month_start.month == 12:
        next_month = month_start.replace(year=month_start.year + 1, month=1)
    else:
        next_month = month_start.replace(month=month_start.month + 1)
    month_end = next_month - timedelta(days=1)

    diaries = _count_diaries(db, user_id, month_start, month_end)
    habits = _count_active_habits(db, user_id)

    actual = {"diaries": diaries, "active_habits": habits, "min_diaries": MIN_DIARIES_MONTHLY}

    if habits < MIN_ACTIVE_HABITS:
        return SufficiencyResult(False, "활성화된 습관이 없어요. 습관을 먼저 추가해주세요.", actual)

    if diaries < MIN_DIARIES_MONTHLY:
        return SufficiencyResult(
            False,
            f"이번 달 일기가 {diaries}개예요. 월간 인사이트는 {MIN_DIARIES_MONTHLY}개부터 보여드려요.",
            actual,
        )

    return SufficiencyResult(True, "", actual)


def is_emotion_correlation_sufficient(
    db: Session, user_id: int, start: date, end: date
) -> SufficiencyResult:
    """감정-이행률 교차 분석 노출 조건: 감정 분석된 일기 5개 이상."""
    analyzed = _count_analyzed_diaries(db, user_id, start, end)
    habits = _count_active_habits(db, user_id)

    actual = {"analyzed_diaries": analyzed, "active_habits": habits, "min_analyzed": MIN_ANALYZED_DIARIES}

    if habits < MIN_ACTIVE_HABITS:
        return SufficiencyResult(False, "활성 습관이 없어 상관 분석이 불가능해요.", actual)

    if analyzed < MIN_ANALYZED_DIARIES:
        return SufficiencyResult(
            False,
            f"분석 가능한 일기가 {analyzed}개예요. 상관 패턴은 {MIN_ANALYZED_DIARIES}개부터 보여드려요.",
            actual,
        )

    return SufficiencyResult(True, "", actual)
