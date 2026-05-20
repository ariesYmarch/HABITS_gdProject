# backend/app/core/database.py

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

# Supabase PostgreSQL 연결
# pool_size: SQLAlchemy 풀 기본 5
# max_overflow: 풀 초과 시 추가 생성 가능한 연결 수 (기본 10)
# pool_pre_ping: 끊긴 연결 자동 감지 (Supabase 유휴 연결 끊김 대응)
# pool_recycle: 일정 시간 지난 연결 강제 재생성 (1800초 = 30분)
engine = create_engine(
    settings.DATABASE_URL,
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,
    pool_recycle=1800,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
