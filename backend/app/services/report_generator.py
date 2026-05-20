"""주간/월간 리포트 생성 서비스.

스케줄러에서 호출되거나 수동 트리거 가능.
모든 활성 사용자에 대해 해당 기간의 피드백을 생성하고 AIReport 테이블에 저장.
"""
from datetime import date, datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.analytics.aggregation import aggregate_period
from app.analytics.conditions import (
    is_monthly_data_sufficient,
    is_weekly_data_sufficient,
)
from app.feedback.diagnosis import build_diagnosis
from app.feedback.exceptions import detect_exceptions
from app.feedback.narrative import build_narrative
from app.feedback.quality import check_gemini_output
from app.feedback.satisfaction import get_recent_satisfaction
from app.feedback.selector import select_feedback
from app.models import AIReport, Habit, HabitLog, User
from app.services.gemini import (
    enrich_diagnosis,
    generate_feedback,
    generate_meta_insight,
    generate_recommendation_rationale,
)


def _find_lowest_completion_habit_info(
    db: Session, user_id: int, period_start: date, period_end: date
) -> tuple[str | None, str | None, float | None]:
    """기간 내 활성 습관 중 가장 미이행률 높은 habit의 (client_id, title, rate)."""
    habits = db.query(Habit).filter(
        Habit.user_id == user_id,
        Habit.is_active.is_(True),
        Habit.deleted_at.is_(None),
    ).all()
    if not habits:
        return None, None, None

    days = (period_end - period_start).days + 1
    worst = None  # (cid, title, rate)
    worst_rate = float("inf")
    for h in habits:
        cnt = db.query(HabitLog).filter(
            HabitLog.habit_id == h.id,
            HabitLog.date >= period_start,
            HabitLog.date <= period_end,
            HabitLog.is_completed.is_(True),
        ).count()
        rate = (cnt / days) if days > 0 else 0.0
        if rate < worst_rate:
            worst_rate = rate
            worst = (h.client_id, h.title, rate)
    if not worst:
        return None, None, None
    return worst


def _generate_message_for_period(
    period_label: str, agg, exc, selection
) -> tuple[str, str]:
    """리포트 메시지 생성. (message, source) 반환."""
    use_gemini = exc.triggered or selection["needs_dynamic"]

    if use_gemini:
        gemini_msg = generate_feedback(
            period_label=period_label,
            completion_rate=agg.completion_rate,
            emotion_distribution=agg.emotion_distribution,
            exception_reasons=exc.reasons,
        )
        if gemini_msg:
            quality = check_gemini_output(gemini_msg)
            if quality.passed:
                return gemini_msg, "gemini"
        # Gemini 실패/품질 미달 → 정적 fallback
        return selection["message"] or "이번 기간 데이터를 살펴보세요.", "static_fallback"

    return selection["message"], "static"


def _has_existing_report(
    db: Session, user_id: int, period_type: str, period_start: date, period_end: date
) -> bool:
    return db.query(AIReport).filter(
        AIReport.user_id == user_id,
        AIReport.period_type == period_type,
        AIReport.period_start == period_start,
        AIReport.period_end == period_end,
    ).first() is not None


def _build_report_record(
    user_id: int,
    period_type: str,
    period_start: date,
    period_end: date,
    period_label: str,
    db: Session,
) -> AIReport | None:
    """공통 리포트 빌더 (week/month 공유)."""
    sufficiency_fn = (
        is_weekly_data_sufficient if period_type == "week" else is_monthly_data_sufficient
    )
    sufficiency = sufficiency_fn(db, user_id, period_start)
    if not sufficiency.sufficient:
        return None

    agg = aggregate_period(db, user_id, period_start, period_end)
    exc = detect_exceptions(
        completion_rate=agg.completion_rate,
        emotion_distribution=agg.emotion_distribution,
        mood_scores=agg.mood_scores,
    )

    # 1) 사용자 최근 만족도 미리 집계 (정적 narrative + Gemini 둘 다에 반영)
    satisfaction = get_recent_satisfaction(db, user_id)

    # 1b) 이전 동일 타입 리포트 (추세 비교용)
    previous = db.query(AIReport).filter(
        AIReport.user_id == user_id,
        AIReport.period_type == period_type,
        AIReport.period_start < period_start,
    ).order_by(AIReport.period_start.desc()).first()
    previous_rate = previous.completion_rate if previous else None

    # 1c) mood 표준편차 계산
    import statistics as _stat
    mood_stdev = _stat.stdev(agg.mood_scores) if len(agg.mood_scores) >= 2 else None

    # 1d) 종합 진단 빌드 (범주화 + 로컬 폴백, Gemini 보강은 아래에서)
    cat, diagnosis = build_diagnosis(
        period_label=period_label,
        completion_rate=agg.completion_rate,
        emotion_distribution=agg.emotion_distribution,
        avg_mood=agg.avg_mood,
        mood_stdev=mood_stdev,
        previous_completion_rate=previous_rate,
    )

    # 1e) 진단 detail 풍부화는 사용자가 "표현이 어색" 사유 남겼을 때만 Gemini 호출 (호출 절약)
    awkward_feedback = any(
        "표현이 어색" in r or "어렵게" in r
        for r in (satisfaction.bad_reasons or [])
    )
    if awkward_feedback:
        enriched = enrich_diagnosis(
            period_label=period_label,
            category_summary={
                "rate_pct": cat.rate_pct,
                "rate_bucket": cat.rate_bucket,
                "valence": cat.valence,
                "primary_emotion": cat.primary_emotion,
                "secondary_emotion": cat.secondary_emotion,
                "mood_bucket": cat.mood_bucket,
                "variance_bucket": cat.variance_bucket,
                "trend": cat.trend,
            },
            static_label=diagnosis.label,
            static_detail=diagnosis.detail,
        )
        if enriched:
            quality = check_gemini_output(enriched)
            if quality.passed:
                diagnosis.detail = enriched
                diagnosis.source = "gemini"

    # 2) 줄글 narrative 빌드 (정적 + 데이터 분석 + 만족도 톤 반영) - 종합 진단은 별도 필드
    target_cid, target_title, target_rate = _find_lowest_completion_habit_info(
        db, user_id, period_start, period_end,
    )
    narrative = build_narrative(
        period_label, agg, exc,
        target_habit_id=target_cid,
        target_habit_title=target_title,
        target_habit_rate=target_rate,
        satisfaction_avg=satisfaction.avg_score if satisfaction.count >= 2 else None,
    )

    # === Gemini 핵심 작업 1: 시계열 메타 인사이트 (이전 리포트 2개 이상 있을 때만) ===
    gemini_used = diagnosis.source == "gemini"

    prev_reports = db.query(AIReport).filter(
        AIReport.user_id == user_id,
        AIReport.period_type == period_type,
        AIReport.period_start < period_start,
    ).order_by(AIReport.period_start.desc()).limit(4).all()

    if len(prev_reports) >= 2:
        history = []
        for r in reversed(prev_reports):  # 오래된 → 최근
            top_emo = None
            if r.emotion_summary:
                sorted_emo = sorted(r.emotion_summary.items(), key=lambda x: x[1], reverse=True)
                top_emo = sorted_emo[0][0] if sorted_emo else None
            history.append({
                "period_start": r.period_start.isoformat(),
                "rate": round(r.completion_rate or 0, 2),
                "primary_emotion": top_emo,
            })
        meta = generate_meta_insight(
            period_label=period_label,
            history=history,
            current={
                "period_start": period_start.isoformat(),
                "rate": round(agg.completion_rate, 2),
                "primary_emotion": cat.primary_emotion,
                "valence": cat.valence,
            },
        )
        if meta:
            quality = check_gemini_output(meta)
            if quality.passed:
                # 메타 인사이트는 narrative 가장 앞에 삽입 (시계열 컨텍스트 먼저 제시)
                narrative.paragraphs.insert(0, meta)
                gemini_used = True

    # === Gemini 핵심 작업 2: 추천 이유 개인화 ===
    if narrative.recommendation:
        rationale = generate_recommendation_rationale(
            rec_kind=narrative.recommendation.get("kind", ""),
            rec_label=narrative.recommendation.get("label", ""),
            target_habit_title=target_title,
            target_habit_rate=target_rate,
            completion_rate=agg.completion_rate,
            primary_emotion=cat.primary_emotion,
            secondary_emotion=cat.secondary_emotion,
            valence=cat.valence,
        )
        if rationale:
            quality = check_gemini_output(rationale)
            if quality.passed:
                narrative.recommendation = {
                    **narrative.recommendation,
                    "message": rationale,
                }
                gemini_used = True

    full_text = "\n\n".join(narrative.paragraphs)
    source = "gemini" if gemini_used else "static_narrative"

    return AIReport(
        user_id=user_id,
        period_type=period_type,
        period_start=period_start,
        period_end=period_end,
        completion_rate=agg.completion_rate,
        avg_mood=agg.avg_mood,
        emotion_summary=agg.emotion_distribution,
        insight=narrative.summary,
        suggestion=diagnosis.label,                      # 종합 진단 라벨
        diagnosis_detail=diagnosis.detail,               # 종합 진단 줄글
        diagnosis_keywords=diagnosis.keywords,           # 키워드 리스트
        full_report=full_text,
        paragraphs=narrative.paragraphs,                 # 구조화된 4문단 + 메타 인사이트
        recommendation=narrative.recommendation,
        model_used=source,
    )


def generate_weekly_report_for_user(
    db: Session, user_id: int, week_start: date
) -> AIReport | None:
    week_end = week_start + timedelta(days=6)
    if _has_existing_report(db, user_id, "week", week_start, week_end):
        return None
    period_label = f"{week_start.isoformat()} ~ {week_end.isoformat()} (주간)"
    report = _build_report_record(user_id, "week", week_start, week_end, period_label, db)
    if report:
        db.add(report)
    return report


def generate_monthly_report_for_user(
    db: Session, user_id: int, month_start: date
) -> AIReport | None:
    if month_start.month == 12:
        nxt = month_start.replace(year=month_start.year + 1, month=1)
    else:
        nxt = month_start.replace(month=month_start.month + 1)
    month_end = nxt - timedelta(days=1)
    if _has_existing_report(db, user_id, "month", month_start, month_end):
        return None
    period_label = f"{month_start.year}년 {month_start.month}월 (월간)"
    report = _build_report_record(user_id, "month", month_start, month_end, period_label, db)
    if report:
        db.add(report)
    return report


def generate_weekly_reports_for_all(db: Session, target_week_start: date) -> int:
    """모든 활성 사용자에 대해 주간 리포트 생성. 생성된 리포트 수 반환."""
    users = db.query(User).filter(User.is_active.is_(True)).all()
    count = 0
    for u in users:
        try:
            report = generate_weekly_report_for_user(db, u.id, target_week_start)
            if report:
                count += 1
        except Exception as e:
            print(f"[report] user {u.id} weekly 실패: {e}")
    db.commit()
    return count


def generate_monthly_reports_for_all(db: Session, target_month_start: date) -> int:
    """모든 활성 사용자에 대해 월간 리포트 생성."""
    users = db.query(User).filter(User.is_active.is_(True)).all()
    count = 0
    for u in users:
        try:
            report = generate_monthly_report_for_user(db, u.id, target_month_start)
            if report:
                count += 1
        except Exception as e:
            print(f"[report] user {u.id} monthly 실패: {e}")
    db.commit()
    return count
