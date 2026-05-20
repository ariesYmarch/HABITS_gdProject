"""습관 관련 API.
주: 일반 CRUD는 sync로 처리. 이 라우터는 sync 외 보조 기능 (졸업 추천 등).
"""
from datetime import date, datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.core.database import get_db
from app.feedback.suggestions import detect_graduation_candidates
from app.models import Habit, User


router = APIRouter(prefix="/api/v1/habits", tags=["habits"])


@router.get("/graduation-candidates")
def list_graduation_candidates(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """4주 연속 90% 이상 이행 + 긍정 감정 우세 패턴 만족하는 습관 후보."""
    candidates = detect_graduation_candidates(db, current_user.id, date.today())
    return {
        "count": len(candidates),
        "candidates": [
            {
                "habit_id": c.habit_id,
                "habit_title": c.habit_title,
                "completion_rate": c.completion_rate,
                "positive_emotion_ratio": c.positive_emotion_ratio,
                "weeks_evaluated": c.weeks_evaluated,
                "message": c.message,
            }
            for c in candidates
        ],
    }


@router.post("/{habit_id}/graduate", status_code=status.HTTP_200_OK)
def graduate_habit(
    habit_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """사용자가 졸업 제안을 수용한 경우. habit을 비활성화 처리."""
    habit = db.query(Habit).filter(
        Habit.id == habit_id,
        Habit.user_id == current_user.id,
        Habit.deleted_at.is_(None),
    ).first()
    if not habit:
        raise HTTPException(status_code=404, detail="습관을 찾을 수 없습니다")

    if not habit.is_active:
        raise HTTPException(status_code=409, detail="이미 비활성화된 습관입니다")

    habit.is_active = False
    habit.deactivated_at = datetime.now(timezone.utc)
    db.commit()

    return {"habit_id": habit.id, "graduated_at": habit.deactivated_at.isoformat()}
