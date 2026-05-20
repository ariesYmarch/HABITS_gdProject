"""주간/월간 피드백 라우터.

분기 흐름 (발표 답변 기준):
  1. 인사이트 노출 조건 (유효 데이터 충족) AND 트리거(주간/월간 리포트)
  2. 위 만족 시 → 예외 패턴 감지 (3가지 OR)
  3. 예외 감지 → Gemini Flash 호출
     예외 없음 → 정적 템플릿 사용
"""
from datetime import date, datetime, timedelta, timezone
from typing import Literal, Optional

from fastapi import APIRouter, Body, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.analytics.aggregation import aggregate_period
from app.analytics.conditions import (
    is_monthly_data_sufficient,
    is_weekly_data_sufficient,
)
from app.auth.dependencies import get_current_user
from app.core.database import get_db
from app.feedback.exceptions import detect_exceptions
from app.feedback.selector import select_feedback
from app.feedback.suggestions import (
    detect_graduation_candidates,
    detect_low_completion_suggestion,
)
from app.models import AIReport, FeedbackRating, Habit, User
from app.services.gemini import generate_feedback
from app.services.recombee import send_rating


router = APIRouter(prefix="/api/v1/feedback", tags=["feedback"])


def _parse_iso_date(s: Optional[str], default: date) -> date:
    if not s:
        return default
    try:
        return datetime.strptime(s, "%Y-%m-%d").date()
    except ValueError:
        return default


def _week_start_of(d: date) -> date:
    """월요일 시작."""
    return d - timedelta(days=d.weekday())


def _month_start_of(d: date) -> date:
    return d.replace(day=1)


def _month_end_of(month_start: date) -> date:
    if month_start.month == 12:
        nxt = month_start.replace(year=month_start.year + 1, month=1)
    else:
        nxt = month_start.replace(month=month_start.month + 1)
    return nxt - timedelta(days=1)


def _build_response(
    period_start: date,
    period_end: date,
    period_label: str,
    db: Session,
    user_id: int,
    sufficiency_check,  # 함수 (주간/월간별 다름)
):
    sufficiency = sufficiency_check
    if not sufficiency.sufficient:
        return {
            "available": False,
            "reason": sufficiency.reason,
            "actual": sufficiency.actual,
        }

    agg = aggregate_period(db, user_id, period_start, period_end)

    exc = detect_exceptions(
        completion_rate=agg.completion_rate,
        emotion_distribution=agg.emotion_distribution,
        mood_scores=agg.mood_scores,
    )

    selection = select_feedback(agg.completion_rate, agg.emotion_distribution)

    # 정적 템플릿이 needs_dynamic을 신호하거나 OR 예외가 감지되면 Gemini 호출
    use_gemini = exc.triggered or selection["needs_dynamic"]

    message: str
    source: str

    if use_gemini:
        gemini_msg = generate_feedback(
            period_label=period_label,
            completion_rate=agg.completion_rate,
            emotion_distribution=agg.emotion_distribution,
            exception_reasons=exc.reasons,
        )
        if gemini_msg:
            message = gemini_msg
            source = "gemini"
        else:
            # GEMINI 키 없거나 호출 실패 → 정적 fallback
            message = selection["message"] or "이번 주 데이터를 잘 살펴보세요."
            source = "static_fallback"
    else:
        message = selection["message"]
        source = "static"

    return {
        "available": True,
        "period_start": period_start.isoformat(),
        "period_end": period_end.isoformat(),
        "completion_rate": agg.completion_rate,
        "completion_count": agg.completion_count,
        "expected_count": agg.expected_count,
        "diary_count": agg.diary_count,
        "analyzed_diary_count": agg.analyzed_diary_count,
        "avg_mood": agg.avg_mood,
        "emotion_distribution": agg.emotion_distribution,
        "exception": {
            "triggered": exc.triggered,
            "reasons": exc.reasons,
        },
        "feedback": {
            "source": source,
            "message": message,
            "static_pattern": selection["pattern"],
            "matched_emotions": selection["matched_emotions"],
        },
    }


@router.get("/weekly")
def weekly_feedback(
    week_start: Optional[str] = Query(None, description="월요일 날짜 YYYY-MM-DD. 미지정 시 이번 주."),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    today = date.today()
    start = _parse_iso_date(week_start, _week_start_of(today))
    end = start + timedelta(days=6)

    sufficiency = is_weekly_data_sufficient(db, current_user.id, start)
    response = _build_response(
        period_start=start,
        period_end=end,
        period_label=f"{start.isoformat()} ~ {end.isoformat()} (주간)",
        db=db,
        user_id=current_user.id,
        sufficiency_check=sufficiency,
    )

    # 이행률 30% 미만이면 제안 추가 (충족 여부 무관 - 활성 습관만 있으면)
    suggestion = detect_low_completion_suggestion(db, current_user.id, start)
    if suggestion:
        response["low_completion_suggestion"] = {
            "habit_id": suggestion.habit_id,
            "habit_title": suggestion.habit_title,
            "completion_rate": suggestion.completion_rate,
            "options": suggestion.options,
        }

    return response


@router.get("/monthly")
def monthly_feedback(
    month: Optional[str] = Query(None, description="월 시작 YYYY-MM-01. 미지정 시 이번 달."),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    today = date.today()
    start = _parse_iso_date(month, _month_start_of(today))
    end = _month_end_of(start)

    sufficiency = is_monthly_data_sufficient(db, current_user.id, start)
    return _build_response(
        period_start=start,
        period_end=end,
        period_label=f"{start.year}년 {start.month}월 (월간)",
        db=db,
        user_id=current_user.id,
        sufficiency_check=sufficiency,
    )


# ===== 만족도 평가 =====
class FeedbackRateRequest(BaseModel):
    period_type: Literal["weekly", "monthly"]
    period_start: date
    period_end: date
    rating: Literal["good", "neutral", "bad"]
    # source는 자유 문자열로 (static / gemini / static_narrative / static_fallback 등)
    source: Optional[str] = Field(None, max_length=50)
    comment: Optional[str] = Field(None, max_length=500)


_RATING_TO_RECOMBEE = {"good": 1.0, "neutral": 0.0, "bad": -1.0}


@router.get("/satisfaction-trend")
def satisfaction_trend(
    days: int = Query(90, ge=7, le=365),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """최근 N일 만족도 평가 시계열. 클라이언트 차트용."""
    since = datetime.now(timezone.utc) - timedelta(days=days)
    rows = db.query(FeedbackRating).filter(
        FeedbackRating.user_id == current_user.id,
        FeedbackRating.created_at >= since,
    ).order_by(FeedbackRating.created_at.asc()).all()

    score_map = {"good": 1, "neutral": 0, "bad": -1}
    points = [
        {
            "id": r.id,
            "rating": r.rating,
            "score": score_map.get(r.rating, 0),
            "period_type": r.period_type,
            "period_start": r.period_start.isoformat(),
            "source": r.source,
            "created_at": r.created_at.isoformat() if r.created_at else None,
        }
        for r in rows
    ]
    avg = round(sum(p["score"] for p in points) / len(points), 3) if points else 0
    return {"count": len(points), "avg_score": avg, "points": points}


@router.post("/rate", status_code=status.HTTP_201_CREATED)
def rate_feedback(
    req: FeedbackRateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """리포트 만족도 평가 저장. 해당 기간 리포트가 추천한 habit에 대해 Recombee 명시적 신호 전송."""
    rating = FeedbackRating(
        user_id=current_user.id,
        period_type=req.period_type,
        period_start=req.period_start,
        period_end=req.period_end,
        rating=req.rating,
        source=req.source,
        comment=req.comment,
    )
    db.add(rating)
    db.commit()
    db.refresh(rating)

    # 해당 기간 리포트의 recommendation에 들어있는 habit에 Recombee 신호 전송 (실패해도 평가 저장은 유지)
    period_db_type = "week" if req.period_type == "weekly" else "month"
    try:
        report = db.query(AIReport).filter(
            AIReport.user_id == current_user.id,
            AIReport.period_type == period_db_type,
            AIReport.period_start == req.period_start,
            AIReport.period_end == req.period_end,
        ).first()
        if report and report.recommendation:
            target_client_id = report.recommendation.get("habit_id")
            if target_client_id:
                habit = db.query(Habit).filter(
                    Habit.user_id == current_user.id,
                    Habit.client_id == target_client_id,
                ).first()
                if habit:
                    rating_unit = _RATING_TO_RECOMBEE.get(req.rating, 0.0)
                    # Recombee item_id로는 client_id 사용 (sync 경로와 일관)
                    send_rating(current_user.id, habit.client_id, rating_unit)
    except Exception:
        pass  # Recombee 실패는 무시

    return {"id": rating.id, "created_at": rating.created_at.isoformat() if rating.created_at else None}
