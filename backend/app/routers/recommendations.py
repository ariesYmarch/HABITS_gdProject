"""습관 추천 + 행동 로그 + 검증 메트릭 API.

추천 엔진은 Gemini(서버측 일정·해시태그 기반 시간대 매핑) + 로컬 템플릿 풀(프론트) 조합.
사용자 행동 로그(RecommendationLog)는 CTR·이행률 메트릭 산출용으로 유지.
"""
from datetime import datetime, timedelta, timezone
from typing import Literal, Optional

from fastapi import APIRouter, Depends, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.core.database import get_db
from app.models import RecommendationLog, User
from app.services.gemini import recommend_habits_personalized


router = APIRouter(prefix="/api/v1/recommendations", tags=["recommendations"])


# ===== 사용자 행동 로그 (메트릭용) =====
class InteractionRequest(BaseModel):
    template_id: int
    action: Literal["recommended", "accepted", "rejected", "completed"]


@router.post("/interaction", status_code=status.HTTP_201_CREATED)
def log_interaction(
    req: InteractionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """추천 노출/수락/거절/완료 행동을 로그에 기록 (메트릭 산출용)."""
    db.add(RecommendationLog(
        user_id=current_user.id,
        template_id=req.template_id,
        action=req.action,
    ))
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


# ===== 일정 기반 맞춤 추천 (Gemini) =====
class PersonalizedSchedule(BaseModel):
    wake_up_time: Optional[str] = None
    bed_time: Optional[str] = None
    lunch_start_time: Optional[str] = None
    lunch_end_time: Optional[str] = None
    has_commute: bool = False
    commute_start_time: Optional[str] = None
    commute_end_time: Optional[str] = None
    work_start_time: Optional[str] = None
    work_end_time: Optional[str] = None
    # 7일 × 24시간 weekly grid. 각 셀: sleep/work/commute/meal/free/None
    weekly_timetable: Optional[list[list[Optional[str]]]] = None


class TemplateCandidate(BaseModel):
    id: int
    title: str
    emoji: str = ""
    category: str = ""
    estimated_minutes: int = 15
    strengthen_tags: list[str] = []


class PersonalizedRecommendRequest(BaseModel):
    schedule: PersonalizedSchedule
    occupation: Optional[str] = None
    selected_hashtags: list[str] = []
    candidates: list[TemplateCandidate]
    count: int = 8


@router.post("/personalized")
def personalized_recommendations(
    req: PersonalizedRecommendRequest,
    current_user: User = Depends(get_current_user),
):
    """사용자 일정·해시태그·직업 + 후보 템플릿 → Gemini가 time_slot 매핑해 N개 추천."""
    items = recommend_habits_personalized(
        schedule=req.schedule.model_dump(),
        occupation=req.occupation,
        hashtags=req.selected_hashtags,
        candidates=[c.model_dump() for c in req.candidates],
        count=req.count,
    )
    return {"count": len(items), "recommendations": items}
