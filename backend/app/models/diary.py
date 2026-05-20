from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, Date, DateTime, JSON, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base


class Diary(Base):
    """감정 일기 — 습관과 독립적으로 매일 작성"""
    __tablename__ = "diaries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    client_id = Column(String, nullable=False, index=True)  # 클라이언트 생성 UUID
    date = Column(Date, nullable=False, index=True)
    mood_score = Column(Float)                    # -1 ~ 1 (슬라이더)
    emotion_tags = Column(JSON, nullable=True)    # 사용자가 직접 선택한 감정 태그 ['joy','calm']
    text_content = Column(Text, nullable=True)    # 일기 본문
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc),
                        onupdate=lambda: datetime.now(timezone.utc), index=True)
    deleted_at = Column(DateTime, nullable=True)  # tombstone

    __table_args__ = (
        UniqueConstraint('user_id', 'client_id', name='uq_diaries_user_client'),
    )

    user = relationship("User", back_populates="diaries")
    emotion_analysis = relationship("EmotionAnalysis", back_populates="diary", uselist=False, passive_deletes=True)
