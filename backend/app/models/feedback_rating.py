from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base


class FeedbackRating(Base):
    """주간/월간 피드백 만족도 평가.
    Recombee 명시적 피드백 신호로도 활용.
    """
    __tablename__ = "feedback_ratings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    period_type = Column(String, nullable=False)        # "weekly" | "monthly"
    period_start = Column(Date, nullable=False)
    period_end = Column(Date, nullable=False)
    rating = Column(String, nullable=False)             # "good" | "neutral" | "bad"
    source = Column(String, nullable=True)              # "static" | "gemini"
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
