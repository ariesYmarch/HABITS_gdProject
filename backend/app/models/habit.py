from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, JSON, DateTime, Date, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base


class Habit(Base):
    """습관 정의 — 프론트엔드 Habit 타입과 1:1 대응"""
    __tablename__ = "habits"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    client_id = Column(String, nullable=False, index=True)  # 클라이언트 생성 UUID (sync 매칭용)
    title = Column(String, nullable=False)       # "출근길 팟캐스트 듣기"
    emoji = Column(String, default="🎯")
    hashtags = Column(JSON)                       # ["#자기계발", "#지식"]
    category = Column(String, nullable=True)      # morningRitual / commute / health ...
    frequency = Column(JSON)                      # "daily" | "weekdays" | {type:"custom", days:[0,2,4]}
    time_slot = Column(String, default="anytime") # morning / commute / lunch / ...
    duration = Column(Integer, default=15)        # 분 단위
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc),
                        onupdate=lambda: datetime.now(timezone.utc), index=True)
    deactivated_at = Column(DateTime, nullable=True)
    deleted_at = Column(DateTime, nullable=True)  # tombstone (sync용 soft delete)

    __table_args__ = (
        UniqueConstraint('user_id', 'client_id', name='uq_habits_user_client'),
    )

    user = relationship("User", back_populates="habits")
    logs = relationship("HabitLog", back_populates="habit", passive_deletes=True)


class HabitLog(Base):
    """습관 완료 기록 — 날짜별 체크"""
    __tablename__ = "habit_logs"

    id = Column(Integer, primary_key=True, index=True)
    habit_id = Column(Integer, ForeignKey("habits.id", ondelete="CASCADE"), nullable=False, index=True)
    date = Column(Date, nullable=False)           # 완료한 날짜
    is_completed = Column(Boolean, default=True)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc),
                        onupdate=lambda: datetime.now(timezone.utc), index=True)

    __table_args__ = (
        UniqueConstraint('habit_id', 'date', name='uq_habit_logs_habit_date'),
    )

    habit = relationship("Habit", back_populates="logs")
