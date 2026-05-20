"""습관 추천 + 행동 로그 + 검증 메트릭 API."""
from datetime import date, datetime, timedelta, timezone
from typing import Literal, Optional

from fastapi import APIRouter, Depends, status
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.core.database import get_db
from app.models import Habit, HabitLog, RecommendationLog, User
from app.services.recombee import (
    recommend_items_for_user,
    send_interaction,
)


router = APIRouter(prefix="/api/v1/recommendations", tags=["recommendations"])


# ===== 추천 조회 =====
@router.get("")
def get_recommendations(
    count: int = 10,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Recombee 추천 N개. 키 없으면 빈 리스트."""
    items = recommend_items_for_user(current_user.id, count=count)

    # 추천 로그에 'recommended' action 기록
    for it in items:
        item_id = it.get("id") if isinstance(it, dict) else str(it)
        if not item_id:
            continue
        db.add(RecommendationLog(
            user_id=current_user.id,
            template_id=int(item_id) if str(item_id).isdigit() else None,
            match_score=it.get("score") if isinstance(it, dict) else None,
            action="recommended",
        ))
    db.commit()

    return {"count": len(items), "items": items}


# ===== 사용자 행동 로그 =====
class InteractionRequest(BaseModel):
    template_id: int
    action: Literal["accepted", "rejected", "completed"]


@router.post("/interaction", status_code=status.HTTP_201_CREATED)
def log_interaction(
    req: InteractionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """추천 후 사용자 행동 기록 + Recombee로 신호 전송."""
    db.add(RecommendationLog(
        user_id=current_user.id,
        template_id=req.template_id,
        action=req.action,
    ))

    if req.action == "accepted":
        send_interaction(current_user.id, str(req.template_id), "bookmark")
    elif req.action == "completed":
        send_interaction(current_user.id, str(req.template_id), "purchase")

    db.commit()
    return {"ok": True}


# ===== 검증 메트릭 =====
@router.get("/metrics")
def get_metrics(
    days: int = 30,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """최근 N일 추천 품질 지표.

    - CTR(Click-Through Rate): accepted / recommended
    - 이행률: 추천 채택 후 실제 이행한 비율
    """
    since = datetime.now(timezone.utc) - timedelta(days=days)

    base = db.query(RecommendationLog).filter(
        RecommendationLog.user_id == current_user.id,
        RecommendationLog.created_at >= since,
    )

    recommended_count = base.filter(RecommendationLog.action == "recommended").count()
    accepted_count = base.filter(RecommendationLog.action == "accepted").count()
    rejected_count = base.filter(RecommendationLog.action == "rejected").count()
    completed_count = base.filter(RecommendationLog.action == "completed").count()

    ctr = accepted_count / recommended_count if recommended_count > 0 else 0.0
    completion_rate = completed_count / accepted_count if accepted_count > 0 else 0.0

    return {
        "period_days": days,
        "recommended": recommended_count,
        "accepted": accepted_count,
        "rejected": rejected_count,
        "completed": completed_count,
        "ctr": round(ctr, 4),
        "post_acceptance_completion_rate": round(completion_rate, 4),
    }
