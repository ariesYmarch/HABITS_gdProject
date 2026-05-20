"""성격 유형 테스트 재검사 관련 API.
저장 자체는 sync로 처리됨. 이 라우터는 재검사 가능 여부 + 결과 비교 기능.
"""
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.core.database import get_db
from app.models import PersonalityResult, User


router = APIRouter(prefix="/api/v1/personality", tags=["personality"])


# 재검사 권장 간격 (4주)
RETEST_RECOMMENDED_DAYS = 28


@router.get("/retest-eligible")
def check_retest_eligibility(
    test_type: str = "current",  # "current" | "ideal"
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """이 사용자가 재검사 권장 시점인지 확인 + 마지막 결과 반환."""
    last = db.query(PersonalityResult).filter(
        PersonalityResult.user_id == current_user.id,
        PersonalityResult.test_type == test_type,
    ).order_by(PersonalityResult.tested_at.desc()).first()

    if not last:
        return {"eligible": False, "reason": "최초 검사가 없어요. 먼저 테스트를 진행해주세요.", "last": None}

    last_tested = last.tested_at
    if last_tested.tzinfo is None:
        last_tested = last_tested.replace(tzinfo=timezone.utc)
    now = datetime.now(timezone.utc)
    days_since = (now - last_tested).days

    eligible = days_since >= RETEST_RECOMMENDED_DAYS
    reason = (
        f"마지막 검사 후 {days_since}일 경과, 재검사를 추천드려요."
        if eligible
        else f"마지막 검사 후 {days_since}일 경과. {RETEST_RECOMMENDED_DAYS}일 이후 재검사를 권장해요."
    )

    return {
        "eligible": eligible,
        "days_since_last_test": days_since,
        "recommended_days": RETEST_RECOMMENDED_DAYS,
        "reason": reason,
        "last": {
            "type_id": last.type_id,
            "type_name": last.type_name,
            "hashtags": last.hashtags or [],
            "tested_at": last_tested.isoformat(),
        },
    }


@router.get("/comparison")
def compare_results(
    test_type: str = "current",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """가장 최근 2개 결과 비교."""
    results = db.query(PersonalityResult).filter(
        PersonalityResult.user_id == current_user.id,
        PersonalityResult.test_type == test_type,
    ).order_by(PersonalityResult.tested_at.desc()).limit(2).all()

    if len(results) < 2:
        return {"comparable": False, "reason": "비교 가능한 결과가 부족해요. 재검사 후 다시 확인해주세요."}

    latest, previous = results
    latest_tags = set(latest.hashtags or [])
    prev_tags = set(previous.hashtags or [])
    added = sorted(latest_tags - prev_tags)
    removed = sorted(prev_tags - latest_tags)
    kept = sorted(latest_tags & prev_tags)

    type_changed = latest.type_id != previous.type_id

    return {
        "comparable": True,
        "type_changed": type_changed,
        "previous": {
            "type_id": previous.type_id,
            "type_name": previous.type_name,
            "hashtags": list(prev_tags),
            "tested_at": previous.tested_at.isoformat() if previous.tested_at else None,
        },
        "latest": {
            "type_id": latest.type_id,
            "type_name": latest.type_name,
            "hashtags": list(latest_tags),
            "tested_at": latest.tested_at.isoformat() if latest.tested_at else None,
        },
        "delta": {
            "added_tags": added,
            "removed_tags": removed,
            "kept_tags": kept,
        },
    }
