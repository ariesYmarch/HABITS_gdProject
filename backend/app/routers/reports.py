"""저장된 AI 리포트 조회 + 수동 생성 트리거."""
from datetime import date, datetime, timedelta, timezone
from typing import Literal, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.analytics.conditions import (
    is_monthly_data_sufficient,
    is_weekly_data_sufficient,
)
from app.auth.dependencies import get_current_user
from app.core.database import get_db
from app.models import AIReport, User
from app.services.report_generator import (
    generate_monthly_report_for_user,
    generate_weekly_report_for_user,
)


router = APIRouter(prefix="/api/v1/reports", tags=["reports"])


def _serialize(r: AIReport) -> dict:
    return {
        "id": r.id,
        "period_type": r.period_type,
        "period_start": r.period_start.isoformat(),
        "period_end": r.period_end.isoformat(),
        "completion_rate": r.completion_rate,
        "avg_mood": r.avg_mood,
        "emotion_summary": r.emotion_summary or {},
        "insight": r.insight,                              # 한 줄 요약
        "diagnosis": r.suggestion,                         # 종합 진단 라벨
        "diagnosis_detail": r.diagnosis_detail,            # 종합 진단 줄글
        "diagnosis_keywords": r.diagnosis_keywords or [],  # 키워드 칩
        "full_report": r.full_report,                      # 줄글 전문
        "paragraphs": r.paragraphs or [],                  # 문단 리스트
        "recommendation": r.recommendation,                # {kind, label, message, habit_id?}
        "model_used": r.model_used,
        "generated_at": r.generated_at.isoformat() if r.generated_at else None,
        "read_at": r.read_at.isoformat() if r.read_at else None,
    }


@router.get("/unread-count")
def unread_count(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """미열람 리포트 수. 클라이언트가 배지 표시용으로 호출."""
    n = db.query(AIReport).filter(
        AIReport.user_id == current_user.id,
        AIReport.read_at.is_(None),
    ).count()
    return {"unread_count": n}


@router.post("/{report_id}/mark-read", status_code=status.HTTP_200_OK)
def mark_read(
    report_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    r = db.query(AIReport).filter(
        AIReport.id == report_id, AIReport.user_id == current_user.id
    ).first()
    if not r:
        raise HTTPException(status_code=404, detail="리포트를 찾을 수 없습니다")
    if not r.read_at:
        r.read_at = datetime.now(timezone.utc)
        db.commit()
    return {"id": r.id, "read_at": r.read_at.isoformat() if r.read_at else None}


@router.get("")
def list_reports(
    period_type: Optional[Literal["week", "month"]] = None,
    limit: int = Query(50, ge=1, le=200),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    q = db.query(AIReport).filter(AIReport.user_id == current_user.id)
    if period_type:
        q = q.filter(AIReport.period_type == period_type)
    reports = q.order_by(AIReport.period_start.desc()).limit(limit).all()
    return {"count": len(reports), "reports": [_serialize(r) for r in reports]}


@router.get("/{report_id}")
def get_report(
    report_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    r = db.query(AIReport).filter(
        AIReport.id == report_id, AIReport.user_id == current_user.id
    ).first()
    if not r:
        raise HTTPException(status_code=404, detail="리포트를 찾을 수 없습니다")
    return _serialize(r)


@router.delete("/{report_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_report(
    report_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    r = db.query(AIReport).filter(
        AIReport.id == report_id, AIReport.user_id == current_user.id
    ).first()
    if not r:
        raise HTTPException(status_code=404, detail="리포트를 찾을 수 없습니다")
    db.delete(r)
    db.commit()
    return None


@router.post("/generate-now", status_code=status.HTTP_201_CREATED)
def generate_now(
    period_type: Literal["week", "month"],
    period_start: Optional[date] = None,
    force: bool = True,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """수동 트리거: 지정한 기간 리포트 즉시 생성.
    기본 force=true → 같은 기간 기존 리포트가 있어도 삭제 후 재생성.
    자동 스케줄러는 force=False로 호출 (중복 방지).
    """
    today = date.today()
    if period_type == "week":
        start = period_start or (today - timedelta(days=today.weekday()))
        end = start + timedelta(days=6)
    else:
        start = period_start or today.replace(day=1)
        if start.month == 12:
            nxt = start.replace(year=start.year + 1, month=1)
        else:
            nxt = start.replace(month=start.month + 1)
        end = nxt - timedelta(days=1)

    # 데이터 충분성 사전 체크 → 실패 시 구체적 사유 반환
    sufficiency = (
        is_weekly_data_sufficient(db, current_user.id, start)
        if period_type == "week"
        else is_monthly_data_sufficient(db, current_user.id, start)
    )
    if not sufficiency.sufficient:
        return {
            "created": False,
            "reason": sufficiency.reason,
            "actual": sufficiency.actual,
        }

    if force:
        existing = db.query(AIReport).filter(
            AIReport.user_id == current_user.id,
            AIReport.period_type == period_type,
            AIReport.period_start == start,
            AIReport.period_end == end,
        ).all()
        for r in existing:
            db.delete(r)
        db.flush()

    if period_type == "week":
        report = generate_weekly_report_for_user(db, current_user.id, start)
    else:
        report = generate_monthly_report_for_user(db, current_user.id, start)

    if report is None:
        # sufficiency 통과 + force=True인데도 None이면 내부 로직 실패
        return {"created": False, "reason": "리포트 생성에 실패했어요. 잠시 후 다시 시도해주세요."}

    db.commit()
    db.refresh(report)
    return {"created": True, "report": _serialize(report)}
