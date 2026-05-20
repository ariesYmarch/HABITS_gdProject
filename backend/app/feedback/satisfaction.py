"""사용자 최근 만족도 집계.

리포트 생성 시 다음 두 결정에 사용:
1. Gemini 호출 여부 (만족도 낮으면 정적 메시지 반복이 문제일 수 있어 동적 시도)
2. Gemini 프롬프트 톤 조정 (만족도 낮으면 더 공감적으로 요청)
"""
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from typing import Literal, Optional

from sqlalchemy.orm import Session

from app.feedback.constants import LOW_SATISFACTION_THRESHOLD, SATISFACTION_LOOKBACK_DAYS
from app.models import FeedbackRating


_RATING_SCORE = {"good": 1, "neutral": 0, "bad": -1}


@dataclass
class SatisfactionStats:
    count: int
    avg_score: float                 # -1 ~ 1
    dominant_rating: Optional[str]   # 가장 자주 받은 평가 (None이면 평가 없음)
    is_low: bool                     # avg_score < LOW_SATISFACTION_THRESHOLD
    bad_reasons: list[str] = None    # 최근 'bad' 평가에서 사용자가 남긴 사유 (Gemini 힌트용)


def get_recent_satisfaction(
    db: Session, user_id: int, days: int = SATISFACTION_LOOKBACK_DAYS
) -> SatisfactionStats:
    """최근 N일 평가 집계."""
    since = datetime.now(timezone.utc) - timedelta(days=days)
    rows = db.query(FeedbackRating).filter(
        FeedbackRating.user_id == user_id,
        FeedbackRating.created_at >= since,
    ).all()

    if not rows:
        return SatisfactionStats(
            count=0, avg_score=0.0, dominant_rating=None, is_low=False, bad_reasons=[]
        )

    scores = [_RATING_SCORE.get(r.rating, 0) for r in rows]
    avg = sum(scores) / len(scores)

    counts: dict[str, int] = {}
    for r in rows:
        counts[r.rating] = counts.get(r.rating, 0) + 1
    dominant = max(counts.items(), key=lambda x: x[1])[0] if counts else None

    # 최근 'bad' 평가의 comment를 모아서 Gemini 힌트에 활용
    # comment 형식: "리포트가 너무 짧음; 감정 분석이 부족함; 추천이 맞지 않음 / 자유텍스트"
    bad_reasons: list[str] = []
    for r in rows:
        if r.rating == "bad" and r.comment:
            bad_reasons.append(r.comment.strip())

    return SatisfactionStats(
        count=len(rows),
        avg_score=round(avg, 3),
        dominant_rating=dominant,
        is_low=avg < LOW_SATISFACTION_THRESHOLD,
        bad_reasons=bad_reasons,
    )
