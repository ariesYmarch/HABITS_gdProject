"""apscheduler 기반 정기 작업.

- 매주 일요일 22:00 KST: 이번 주 (월~일) 리포트 생성 → 사용자가 일요일 밤에 받아봄
- 매월 마지막 날 22:00 KST: 이번 달 리포트 생성

주의: uvicorn 다중 워커 환경에서는 중복 실행 방지 필요.
운영 환경: --workers 1 또는 별도 worker 프로세스 권장.
"""
import calendar
from datetime import date, datetime, timedelta
import logging

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from pytz import timezone as pytz_tz

from app.core.database import SessionLocal
from app.services.report_generator import (
    generate_monthly_reports_for_all,
    generate_weekly_reports_for_all,
)


logger = logging.getLogger(__name__)
KST = pytz_tz("Asia/Seoul")


def _job_weekly():
    """이번 주(월~일) 리포트 생성. 일요일 22:00 KST 실행."""
    today = date.today()
    # 이번 주 월요일 (today가 일요일이라면 6일 전)
    this_monday = today - timedelta(days=today.weekday())
    db = SessionLocal()
    try:
        n = generate_weekly_reports_for_all(db, this_monday)
        logger.info(f"[scheduler] 주간 리포트 {n}건 생성 (week of {this_monday})")
    finally:
        db.close()


def _is_last_day_of_month(d: date) -> bool:
    last = calendar.monthrange(d.year, d.month)[1]
    return d.day == last


def _job_monthly_check():
    """매일 22:00에 호출 - 오늘이 그 달 마지막 날이면 월간 리포트 생성."""
    today = date.today()
    if not _is_last_day_of_month(today):
        return
    month_start = today.replace(day=1)
    db = SessionLocal()
    try:
        n = generate_monthly_reports_for_all(db, month_start)
        logger.info(f"[scheduler] 월간 리포트 {n}건 생성 (month {month_start})")
    finally:
        db.close()


_scheduler: BackgroundScheduler | None = None


def start_scheduler() -> BackgroundScheduler:
    global _scheduler
    if _scheduler and _scheduler.running:
        return _scheduler

    _scheduler = BackgroundScheduler(timezone=KST)
    # 매주 일요일 22:00 KST → 이번 주(월~일) 리포트
    _scheduler.add_job(
        _job_weekly,
        CronTrigger(day_of_week="sun", hour=22, minute=0, timezone=KST),
        id="weekly_reports",
        replace_existing=True,
    )
    # 매일 22:00 KST에 월말 체크 → 마지막 날이면 월간 리포트
    _scheduler.add_job(
        _job_monthly_check,
        CronTrigger(hour=22, minute=0, timezone=KST),
        id="monthly_reports",
        replace_existing=True,
    )
    _scheduler.start()
    logger.info("[scheduler] started")
    return _scheduler


def stop_scheduler():
    global _scheduler
    if _scheduler and _scheduler.running:
        _scheduler.shutdown(wait=False)
        logger.info("[scheduler] stopped")
