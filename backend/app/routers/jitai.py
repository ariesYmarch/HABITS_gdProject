"""JITAI 트리거 조회 라우터.
클라이언트가 주기적으로 호출 (앱 포그라운드 진입, 백그라운드 정기 호출 등).
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.core.database import get_db
from app.jitai.triggers import detect_all_triggers
from app.models import User


router = APIRouter(prefix="/api/v1/jitai", tags=["jitai"])


@router.get("/check")
def check_jitai_triggers(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """현재 시점에서 사용자에게 보낼 알림이 있는지 확인."""
    triggers = detect_all_triggers(db, current_user.id)
    return {
        "count": len(triggers),
        "triggers": [
            {
                "kind": t.kind,
                "habit_id": t.habit_id,
                "message": t.message,
                "detail": t.detail or {},
            }
            for t in triggers
        ],
    }
