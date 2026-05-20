from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, JSON, Date, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base


class AIReport(Base):
    """Gemini 생성 AI 리포트 — 주간/월간/연간"""
    __tablename__ = "ai_reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    period_type = Column(String, nullable=False)  # week / month / year
    period_start = Column(Date, nullable=False)
    period_end = Column(Date, nullable=False)
    completion_rate = Column(Float)               # 기간 내 습관 이행률 (0~1)
    avg_mood = Column(Float)                      # 기간 내 평균 감정 (-1~1)
    emotion_summary = Column(JSON)                # {"joy":5, "sadness":2, ...} 감정 분포
    insight = Column(Text, nullable=True)         # 한 줄 요약
    suggestion = Column(Text, nullable=True)      # 종합 진단 라벨 (예: "최적 - 안정 흐름")
    full_report = Column(Text, nullable=True)     # 줄글 전문 (paragraphs join)
    paragraphs = Column(JSON, nullable=True)      # 줄글 문단 리스트
    recommendation = Column(JSON, nullable=True)  # {kind, label, message, habit_id?}
    diagnosis_detail = Column(Text, nullable=True)        # 종합 진단 줄글 (2-3문장)
    diagnosis_keywords = Column(JSON, nullable=True)      # 진단 핵심 키워드 ["안정","긍정 우세",...]
    model_used = Column(String, nullable=True)    # "static" / "gemini" / "static_fallback"
    generated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    read_at = Column(DateTime, nullable=True)     # 사용자가 리포트를 열어본 시각. null이면 미열람.

    user = relationship("User", back_populates="ai_reports")
