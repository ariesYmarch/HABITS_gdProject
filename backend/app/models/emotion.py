from sqlalchemy import Column, Integer, String, Float, ForeignKey, JSON, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base


class EmotionAnalysis(Base):
    """KoELECTRA 감정 분석 결과 — 일기 1건당 1건"""
    __tablename__ = "emotion_analyses"

    id = Column(Integer, primary_key=True, index=True)
    diary_id = Column(Integer, ForeignKey("diaries.id", ondelete="CASCADE"), unique=True, nullable=False)
    main_emotion = Column(String)                 # joy / calm / proud / sadness / ...
    confidence = Column(Float)                    # 0 ~ 1
    distribution = Column(JSON)                   # {"joy":0.05, "sadness":0.82, "calm":0.03, ...}
    sentiment = Column(Float)                     # 종합 감정 점수 (-1 ~ 1)
    model_version = Column(String, nullable=True) # "koelectra-v3-emotion-v1.0"
    analyzed_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    diary = relationship("Diary", back_populates="emotion_analysis")
