from sqlalchemy import Column, Integer, String, Float, ForeignKey, JSON, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base


class RecommendationLog(Base):
    """Recombee 추천 이력 — 추천/수락/거절/완료 추적"""
    __tablename__ = "recommendation_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    template_id = Column(Integer)                 # 추천된 습관 템플릿 ID
    match_score = Column(Float, nullable=True)    # Recombee 매칭 점수 (0~1)
    action = Column(String, nullable=False)       # recommended / accepted / rejected / completed
    context_hashtags = Column(JSON, nullable=True)  # 추천 시점의 사용자 해시태그
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="recommendation_logs")
