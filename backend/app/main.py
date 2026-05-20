from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.core.config import settings
from app.core.emotion import analyze_emotion
from app.routers import auth as auth_router
from app.routers import feedback as feedback_router
from app.routers import habits as habits_router
from app.routers import jitai as jitai_router
from app.routers import personality as personality_router
from app.routers import recommendations as recommendations_router
from app.routers import reports as reports_router
from app.services.scheduler import start_scheduler, stop_scheduler
from app.sync import router as sync_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # 시작 시 정기 리포트 스케줄러 가동
    start_scheduler()
    yield
    stop_scheduler()


# 스키마 관리는 Alembic이 담당 (alembic upgrade head)
app = FastAPI(
    title="HABITS API",
    description="AI Habit Coaching Backend",
    lifespan=lifespan,
)

# CORS - 모바일 앱은 origin이 없거나 다양해서 일단 모두 허용
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(auth_router.router)
app.include_router(sync_router.router)
app.include_router(feedback_router.router)
app.include_router(jitai_router.router)
app.include_router(habits_router.router)
app.include_router(personality_router.router)
app.include_router(recommendations_router.router)
app.include_router(reports_router.router)


@app.get("/")
def read_root():
    return {"message": "HABITS Server is Running!", "env": settings.ENVIRONMENT}


class DiaryRequest(BaseModel):
    text: str


@app.post("/api/v1/emotion/analyze")
def emotion_analyze(req: DiaryRequest):
    """일기 텍스트의 감정을 분석하여 태그와 점수를 반환"""
    return analyze_emotion(req.text)
