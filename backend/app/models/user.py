from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    nickname = Column(String, unique=True, index=True, nullable=False)
    occupation = Column(String, nullable=True)  # 직장인 / 학생 / 기타
    is_active = Column(Boolean, default=True, nullable=False)
    last_login_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc),
                        onupdate=lambda: datetime.now(timezone.utc))

    # relationships - DB CASCADE로 처리되므로 passive_deletes=True
    personality_results = relationship("PersonalityResult", back_populates="user", passive_deletes=True)
    schedule = relationship("Schedule", back_populates="user", uselist=False, passive_deletes=True)
    habits = relationship("Habit", back_populates="user", passive_deletes=True)
    diaries = relationship("Diary", back_populates="user", passive_deletes=True)
    ai_reports = relationship("AIReport", back_populates="user", passive_deletes=True)
    recommendation_logs = relationship("RecommendationLog", back_populates="user", passive_deletes=True)
