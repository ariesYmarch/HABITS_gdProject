"""Sync API: Local-First + Server Backup 양방향 동기화.

규칙:
- LWW(Last-Write-Wins): client.updated_at vs server.updated_at 비교, 더 최근 것 유지.
- client_id로 행 매칭 (user_id + client_id unique).
- soft delete (deleted_at)로 tombstone 유지 → 다른 기기에서도 삭제 전파.
"""
from datetime import datetime, timezone
from typing import Optional


def _to_utc(dt: Optional[datetime]) -> Optional[datetime]:
    """naive datetime은 UTC로 가정 (DB에서 온 값들이 timezone-naive라서)."""
    if dt is None:
        return None
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)


def _is_server_newer(server_dt: Optional[datetime], client_dt: datetime) -> bool:
    s = _to_utc(server_dt)
    c = _to_utc(client_dt)
    return s is not None and s >= c

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.core.database import get_db
from app.models import (
    Diary,
    EmotionAnalysis,
    Habit,
    HabitLog,
    PersonalityResult,
    Schedule,
    User,
)
from app.sync.schemas import (
    DiarySyncItem,
    DiarySyncOut,
    EmotionAnalysisOut,
    HabitLogSyncItem,
    HabitLogSyncOut,
    HabitSyncItem,
    HabitSyncOut,
    PersonalitySyncItem,
    PersonalitySyncOut,
    ScheduleSyncItem,
    SyncConflict,
    SyncPullResponse,
    SyncPushRequest,
    SyncPushResponse,
)

router = APIRouter(prefix="/api/v1/sync", tags=["sync"])


# ===== PULL =====
@router.get("/pull", response_model=SyncPullResponse)
def pull(
    since: Optional[datetime] = Query(None, description="이 시각 이후 변경된 데이터만 반환. None이면 전체."),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    server_time = datetime.now(timezone.utc)

    # Habits
    h_query = db.query(Habit).filter(Habit.user_id == current_user.id)
    if since:
        h_query = h_query.filter(Habit.updated_at > since)
    habits = h_query.all()
    habits_out = [
        HabitSyncOut(
            server_id=h.id,
            client_id=h.client_id,
            title=h.title,
            emoji=h.emoji or "🎯",
            hashtags=h.hashtags or [],
            category=h.category,
            frequency=h.frequency or "daily",
            time_slot=h.time_slot or "anytime",
            duration=h.duration or 15,
            is_active=h.is_active,
            deactivated_at=h.deactivated_at,
            deleted_at=h.deleted_at,
            updated_at=h.updated_at,
        )
        for h in habits
    ]

    # Habit Logs
    user_habit_ids = [h.id for h in habits] if since is None else [
        h.id for h in db.query(Habit).filter(Habit.user_id == current_user.id).all()
    ]
    habit_id_to_client_id = {
        h.id: h.client_id
        for h in db.query(Habit).filter(Habit.user_id == current_user.id).all()
    }
    log_query = db.query(HabitLog).filter(HabitLog.habit_id.in_(user_habit_ids or [-1]))
    if since:
        log_query = log_query.filter(HabitLog.updated_at > since)
    logs_out = [
        HabitLogSyncOut(
            habit_client_id=habit_id_to_client_id[l.habit_id],
            date=l.date,
            is_completed=l.is_completed,
            updated_at=l.updated_at,
        )
        for l in log_query.all()
        if l.habit_id in habit_id_to_client_id
    ]

    # Diaries
    d_query = db.query(Diary).filter(Diary.user_id == current_user.id)
    if since:
        d_query = d_query.filter(Diary.updated_at > since)
    diaries = d_query.all()
    diaries_out = [
        DiarySyncOut(
            server_id=d.id,
            client_id=d.client_id,
            date=d.date,
            mood_score=d.mood_score,
            emotion_tags=d.emotion_tags or [],
            text_content=d.text_content,
            deleted_at=d.deleted_at,
            updated_at=d.updated_at,
        )
        for d in diaries
    ]

    # Personality
    p_query = db.query(PersonalityResult).filter(PersonalityResult.user_id == current_user.id)
    if since:
        p_query = p_query.filter(PersonalityResult.updated_at > since)
    personalities_out = [
        PersonalitySyncOut(
            server_id=p.id,
            client_id=p.client_id,
            test_type=p.test_type,
            type_id=p.type_id,
            type_name=p.type_name,
            hashtags=p.hashtags or [],
            answers=p.answers,
            tested_at=p.tested_at,
            updated_at=p.updated_at,
        )
        for p in p_query.all()
    ]

    # Schedule (user당 1개)
    s_query = db.query(Schedule).filter(Schedule.user_id == current_user.id)
    if since:
        s_query = s_query.filter(Schedule.updated_at > since)
    s = s_query.first()
    schedule_out = (
        ScheduleSyncItem(
            timetable=s.timetable,
            wake_up_time=s.wake_up_time,
            bed_time=s.bed_time,
            lunch_start=s.lunch_start,
            lunch_end=s.lunch_end,
            has_commute=s.has_commute or False,
            commute_start=s.commute_start,
            commute_end=s.commute_end,
            work_start=s.work_start,
            work_end=s.work_end,
            updated_at=s.updated_at,
        )
        if s
        else None
    )

    # Emotion analyses (read-only)
    diary_id_to_client = {d.id: d.client_id for d in diaries}
    ea_query = db.query(EmotionAnalysis).filter(EmotionAnalysis.diary_id.in_(diary_id_to_client.keys() or [-1]))
    if since:
        ea_query = ea_query.filter(EmotionAnalysis.analyzed_at > since)
    emotions_out = [
        EmotionAnalysisOut(
            diary_client_id=diary_id_to_client[ea.diary_id],
            main_emotion=ea.main_emotion,
            confidence=ea.confidence,
            distribution=ea.distribution,
            sentiment=ea.sentiment,
            model_version=ea.model_version,
            analyzed_at=ea.analyzed_at,
        )
        for ea in ea_query.all()
        if ea.diary_id in diary_id_to_client
    ]

    return SyncPullResponse(
        server_time=server_time,
        habits=habits_out,
        habit_logs=logs_out,
        diaries=diaries_out,
        personality_results=personalities_out,
        schedule=schedule_out,
        emotion_analyses=emotions_out,
    )


# ===== PUSH =====
def _lww_apply_habit(db: Session, user_id: int, item: HabitSyncItem) -> Optional[SyncConflict]:
    existing = db.query(Habit).filter(
        Habit.user_id == user_id, Habit.client_id == item.client_id
    ).first()

    if existing is None:
        h = Habit(
            user_id=user_id,
            client_id=item.client_id,
            title=item.title,
            emoji=item.emoji,
            hashtags=item.hashtags,
            category=item.category,
            frequency=item.frequency,
            time_slot=item.time_slot,
            duration=item.duration,
            is_active=item.is_active,
            deactivated_at=item.deactivated_at,
            deleted_at=item.deleted_at,
            updated_at=item.updated_at,
        )
        db.add(h)
        return None

    # LWW
    if _is_server_newer(existing.updated_at, item.updated_at):
        return SyncConflict(
            entity="habit",
            client_id=item.client_id,
            server_updated_at=existing.updated_at,
            client_updated_at=item.updated_at,
        )

    existing.title = item.title
    existing.emoji = item.emoji
    existing.hashtags = item.hashtags
    existing.category = item.category
    existing.frequency = item.frequency
    existing.time_slot = item.time_slot
    existing.duration = item.duration
    existing.is_active = item.is_active
    existing.deactivated_at = item.deactivated_at
    existing.deleted_at = item.deleted_at
    existing.updated_at = item.updated_at
    return None


def _apply_habit_log(db: Session, user_id: int, item: HabitLogSyncItem) -> bool:
    """HabitLog는 (habit_id, date) 단위로 LWW. habit이 없으면 무시."""
    habit = db.query(Habit).filter(
        Habit.user_id == user_id, Habit.client_id == item.habit_client_id
    ).first()
    if not habit:
        return False

    log = db.query(HabitLog).filter(
        HabitLog.habit_id == habit.id, HabitLog.date == item.date
    ).first()

    if log is None:
        db.add(HabitLog(
            habit_id=habit.id,
            date=item.date,
            is_completed=item.is_completed,
            updated_at=item.updated_at,
        ))
        return True

    if _is_server_newer(log.updated_at, item.updated_at):
        return False  # server wins

    log.is_completed = item.is_completed
    log.updated_at = item.updated_at
    return True


def _upsert_emotion_analysis(db: Session, diary: Diary, ea_item) -> None:
    """클라이언트가 보낸 KoELECTRA 분석 결과를 EmotionAnalysis 테이블에 upsert."""
    if not ea_item or not ea_item.main_emotion:
        return
    existing_ea = db.query(EmotionAnalysis).filter(
        EmotionAnalysis.diary_id == diary.id
    ).first()
    analyzed_at = ea_item.analyzed_at or datetime.now(timezone.utc)
    if existing_ea is None:
        db.add(EmotionAnalysis(
            diary_id=diary.id,
            main_emotion=ea_item.main_emotion,
            confidence=ea_item.confidence,
            distribution=ea_item.distribution,
            analyzed_at=analyzed_at,
        ))
    else:
        existing_ea.main_emotion = ea_item.main_emotion
        existing_ea.confidence = ea_item.confidence
        existing_ea.distribution = ea_item.distribution
        existing_ea.analyzed_at = analyzed_at


def _lww_apply_diary(db: Session, user_id: int, item: DiarySyncItem) -> Optional[SyncConflict]:
    existing = db.query(Diary).filter(
        Diary.user_id == user_id, Diary.client_id == item.client_id
    ).first()

    if existing is None:
        d = Diary(
            user_id=user_id,
            client_id=item.client_id,
            date=item.date,
            mood_score=item.mood_score,
            emotion_tags=item.emotion_tags,
            text_content=item.text_content,
            deleted_at=item.deleted_at,
            updated_at=item.updated_at,
        )
        db.add(d)
        # EmotionAnalysis 같이 저장하려면 diary.id 필요 → flush
        if item.emotion_analysis and item.emotion_analysis.main_emotion:
            db.flush()
            _upsert_emotion_analysis(db, d, item.emotion_analysis)
        return None

    if _is_server_newer(existing.updated_at, item.updated_at):
        return SyncConflict(
            entity="diary",
            client_id=item.client_id,
            server_updated_at=existing.updated_at,
            client_updated_at=item.updated_at,
        )

    existing.date = item.date
    existing.mood_score = item.mood_score
    existing.emotion_tags = item.emotion_tags
    existing.text_content = item.text_content
    existing.deleted_at = item.deleted_at
    existing.updated_at = item.updated_at

    # 기존 diary면 emotion_analysis upsert
    if item.emotion_analysis:
        _upsert_emotion_analysis(db, existing, item.emotion_analysis)

    return None


def _lww_apply_personality(db: Session, user_id: int, item: PersonalitySyncItem) -> Optional[SyncConflict]:
    existing = db.query(PersonalityResult).filter(
        PersonalityResult.user_id == user_id, PersonalityResult.client_id == item.client_id
    ).first()

    if existing is None:
        p = PersonalityResult(
            user_id=user_id,
            client_id=item.client_id,
            test_type=item.test_type,
            type_id=item.type_id,
            type_name=item.type_name,
            hashtags=item.hashtags,
            answers=item.answers,
            tested_at=item.tested_at,
            updated_at=item.updated_at,
        )
        db.add(p)
        return None

    if _is_server_newer(existing.updated_at, item.updated_at):
        return SyncConflict(
            entity="personality",
            client_id=item.client_id,
            server_updated_at=existing.updated_at,
            client_updated_at=item.updated_at,
        )

    existing.test_type = item.test_type
    existing.type_id = item.type_id
    existing.type_name = item.type_name
    existing.hashtags = item.hashtags
    existing.answers = item.answers
    existing.tested_at = item.tested_at
    existing.updated_at = item.updated_at
    return None


def _apply_schedule(db: Session, user_id: int, item: ScheduleSyncItem) -> bool:
    existing = db.query(Schedule).filter(Schedule.user_id == user_id).first()

    if existing is None:
        db.add(Schedule(
            user_id=user_id,
            timetable=item.timetable,
            wake_up_time=item.wake_up_time,
            bed_time=item.bed_time,
            lunch_start=item.lunch_start,
            lunch_end=item.lunch_end,
            has_commute=item.has_commute,
            commute_start=item.commute_start,
            commute_end=item.commute_end,
            work_start=item.work_start,
            work_end=item.work_end,
            updated_at=item.updated_at,
        ))
        return True

    if _is_server_newer(existing.updated_at, item.updated_at):
        return False

    existing.timetable = item.timetable
    existing.wake_up_time = item.wake_up_time
    existing.bed_time = item.bed_time
    existing.lunch_start = item.lunch_start
    existing.lunch_end = item.lunch_end
    existing.has_commute = item.has_commute
    existing.commute_start = item.commute_start
    existing.commute_end = item.commute_end
    existing.work_start = item.work_start
    existing.work_end = item.work_end
    existing.updated_at = item.updated_at
    return True


@router.post("/push", response_model=SyncPushResponse)
def push(
    req: SyncPushRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    conflicts: list[SyncConflict] = []

    # 처리 순서: Habit 먼저 (HabitLog가 의존), 그 다음 나머지
    for h in req.habits:
        c = _lww_apply_habit(db, current_user.id, h)
        if c:
            conflicts.append(c)

    db.flush()  # habit ID를 logs가 참조할 수 있도록

    for log in req.habit_logs:
        _apply_habit_log(db, current_user.id, log)

    for d in req.diaries:
        c = _lww_apply_diary(db, current_user.id, d)
        if c:
            conflicts.append(c)

    for p in req.personality_results:
        c = _lww_apply_personality(db, current_user.id, p)
        if c:
            conflicts.append(c)

    if req.schedule:
        _apply_schedule(db, current_user.id, req.schedule)

    db.commit()

    return SyncPushResponse(
        synced_at=datetime.now(timezone.utc),
        conflicts=conflicts,
    )
