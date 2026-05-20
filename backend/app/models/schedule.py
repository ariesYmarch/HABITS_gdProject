from sqlalchemy import Column, Integer, String, ForeignKey, JSON, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base


class Schedule(Base):
    """사용자 시간표 — 온보딩에서 입력, 습관 추천에 활용 (user당 1개)"""
    __tablename__ = "schedules"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    timetable = Column(JSON)          # 7(요일) x 24(시간) 2차원 배열
    wake_up_time = Column(String)     # "07:00"
    bed_time = Column(String)         # "23:00"
    lunch_start = Column(String, nullable=True)
    lunch_end = Column(String, nullable=True)
    has_commute = Column(Boolean, default=False)
    commute_start = Column(String, nullable=True)
    commute_end = Column(String, nullable=True)
    work_start = Column(String, nullable=True)
    work_end = Column(String, nullable=True)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc),
                        onupdate=lambda: datetime.now(timezone.utc), index=True)

    user = relationship("User", back_populates="schedule")
