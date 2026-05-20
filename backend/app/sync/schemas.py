"""Sync API Pydantic 스키마.
프론트의 client_id를 키로 사용해 LWW 충돌 해결.
"""
from datetime import date as date_type
from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel


# ===== Habit =====
class HabitSyncItem(BaseModel):
    client_id: str
    title: str
    emoji: str = "🎯"
    hashtags: list[str] = []
    category: Optional[str] = None
    frequency: Any = "daily"  # str 또는 dict
    time_slot: str = "anytime"
    duration: int = 15
    is_active: bool = True
    deactivated_at: Optional[datetime] = None
    deleted_at: Optional[datetime] = None
    updated_at: datetime


class HabitSyncOut(HabitSyncItem):
    server_id: int  # 서버측 PK (참조용)


# ===== HabitLog =====
class HabitLogSyncItem(BaseModel):
    habit_client_id: str  # 어떤 habit의 로그인지 (client_id로 참조)
    date: date_type
    is_completed: bool = True
    updated_at: datetime


class HabitLogSyncOut(HabitLogSyncItem):
    pass


# ===== Diary =====
class EmotionAnalysisInline(BaseModel):
    """클라이언트가 KoELECTRA 분석 결과를 sync 시 함께 보냄."""
    main_emotion: Optional[str] = None
    confidence: Optional[float] = None
    distribution: Optional[Any] = None
    analyzed_at: Optional[datetime] = None


class DiarySyncItem(BaseModel):
    client_id: str
    date: date_type
    mood_score: Optional[float] = None
    emotion_tags: list[str] = []
    text_content: Optional[str] = None
    emotion_analysis: Optional[EmotionAnalysisInline] = None
    deleted_at: Optional[datetime] = None
    updated_at: datetime


class DiarySyncOut(DiarySyncItem):
    server_id: int


# ===== PersonalityResult =====
class PersonalitySyncItem(BaseModel):
    client_id: str
    test_type: str  # "current" | "ideal"
    type_id: Optional[int] = None
    type_name: Optional[str] = None
    hashtags: list[str] = []
    answers: Optional[Any] = None
    tested_at: datetime
    updated_at: datetime


class PersonalitySyncOut(PersonalitySyncItem):
    server_id: int


# ===== Schedule =====
class ScheduleSyncItem(BaseModel):
    timetable: Optional[Any] = None
    wake_up_time: Optional[str] = None
    bed_time: Optional[str] = None
    lunch_start: Optional[str] = None
    lunch_end: Optional[str] = None
    has_commute: bool = False
    commute_start: Optional[str] = None
    commute_end: Optional[str] = None
    work_start: Optional[str] = None
    work_end: Optional[str] = None
    updated_at: datetime


# ===== EmotionAnalysis (read-only, 서버에서만 생성) =====
class EmotionAnalysisOut(BaseModel):
    diary_client_id: str
    main_emotion: Optional[str] = None
    confidence: Optional[float] = None
    distribution: Optional[Any] = None
    sentiment: Optional[float] = None
    model_version: Optional[str] = None
    analyzed_at: datetime


# ===== Pull/Push 컨테이너 =====
class SyncPullResponse(BaseModel):
    server_time: datetime
    habits: list[HabitSyncOut]
    habit_logs: list[HabitLogSyncOut]
    diaries: list[DiarySyncOut]
    personality_results: list[PersonalitySyncOut]
    schedule: Optional[ScheduleSyncItem] = None
    emotion_analyses: list[EmotionAnalysisOut]


class SyncPushRequest(BaseModel):
    habits: list[HabitSyncItem] = []
    habit_logs: list[HabitLogSyncItem] = []
    diaries: list[DiarySyncItem] = []
    personality_results: list[PersonalitySyncItem] = []
    schedule: Optional[ScheduleSyncItem] = None


class SyncConflict(BaseModel):
    """LWW로 server win 한 항목 (client보다 server가 더 최신)."""
    entity: str        # "habit" | "diary" | "personality"
    client_id: str
    server_updated_at: datetime
    client_updated_at: datetime


class SyncPushResponse(BaseModel):
    synced_at: datetime
    conflicts: list[SyncConflict] = []
