from sqlalchemy import Column, Integer, String, ForeignKey, JSON, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base


class PersonalityResult(Base):
    """성격 검사 결과 — current(현재의 나) / ideal(이상적인 나) / 재검사도 누적"""
    __tablename__ = "personality_results"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    client_id = Column(String, nullable=False, index=True)  # sync 매칭용
    test_type = Column(String, nullable=False)   # "current" | "ideal"
    type_id = Column(Integer)                     # 성격 유형 번호 (1~16)
    type_name = Column(String)                    # "용감한 모험가" 등
    hashtags = Column(JSON)                       # ["#대담함", "#도전", ...]
    answers = Column(JSON, nullable=True)         # 각 문항 답변 기록 (재검사 비교용)
    tested_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc),
                        onupdate=lambda: datetime.now(timezone.utc), index=True)

    __table_args__ = (
        UniqueConstraint('user_id', 'client_id', name='uq_personality_user_client'),
    )

    user = relationship("User", back_populates="personality_results")
