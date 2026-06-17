"""Gemini Flash 기반 동적 피드백 생성.

GEMINI_API_KEY가 비어있으면 정적 fallback 메시지 사용 (개발 모드).
"""
import json
from typing import Optional

import requests

from app.core.config import settings


GEMINI_ENDPOINT = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    "gemini-2.5-flash:generateContent"
)


def _is_configured() -> bool:
    return bool(settings.GEMINI_API_KEY)


def _build_prompt(
    period_label: str,
    completion_rate: float,
    emotion_distribution: dict[str, float],
    exception_reasons: list[str],
    extra_context: Optional[str] = None,
    satisfaction_hint: Optional[str] = None,
) -> str:
    """프롬프트 빌드. KoELECTRA 분포를 JSON으로 명시 전달."""
    rate_pct = round(completion_rate * 100)
    dist_json = json.dumps(emotion_distribution, ensure_ascii=False)
    reasons_str = ", ".join(exception_reasons) if exception_reasons else "없음"

    # 톤 가이드: 만족도 hint 있으면 보강, 없으면 기본
    tone_guide = (
        f"\n톤 가이드 (사용자 피드백 기반):\n- {satisfaction_hint}"
        if satisfaction_hint else ""
    )

    prompt = f"""당신은 HABITS 앱의 피드백 작성 어시스턴트입니다.

규칙:
- 인과관계를 단정하지 말고 "~한 경향이 있었어요" 같은 관찰적 표현 사용
- 처방(빈도 줄여라/늘려라 등)은 명령이 아닌 선택지로 부드럽게 제시
- SDT의 자율성 원칙을 지켜 사용자가 스스로 해석하도록 유도
- 한국어로, 2~3문장 이내로 작성
- 이모지 1개 이내, 따옴표 사용 자제{tone_guide}

데이터:
- 기간: {period_label}
- 이행률: {rate_pct}%
- 감정 분포 (KoELECTRA): {dist_json}
- 감지된 예외 패턴: {reasons_str}

{f'추가 맥락: {extra_context}' if extra_context else ''}

위 데이터를 바탕으로 사용자에게 보낼 피드백 메시지 1개를 작성하세요.
"""
    return prompt.strip()


def enrich_diagnosis(
    period_label: str,
    category_summary: dict,
    static_label: str,
    static_detail: str,
) -> Optional[str]:
    """로컬 폴백 진단을 Gemini로 더 풍부하게 다듬음.

    실패 시 None 반환 → 호출부에서 static_detail 그대로 사용.

    category_summary 예시:
    {
        "rate_pct": 75, "rate_bucket": "high",
        "valence": "positive_dominant",
        "primary_emotion": "joy", "secondary_emotion": "calm",
        "mood_bucket": "high", "variance_bucket": "stable",
        "trend": "improving",
    }
    """
    if not _is_configured():
        return None

    cat_json = json.dumps(category_summary, ensure_ascii=False)

    prompt = f"""당신은 HABITS 앱의 종합 진단 작성 어시스턴트입니다.

규칙:
- 인과관계 단정 X, "~한 경향" 같은 관찰적 표현
- 처방이 아닌 선택지 형태로 제시
- SDT 자율성 원칙 준수
- 한국어, 3~4문장 이내, 자연스러운 줄글
- 이모지·따옴표 사용 자제
- 아래 로컬 폴백 진단의 핵심 메시지(라벨)는 유지하되, 표현은 더 구체적이고 따뜻하게

기간: {period_label}

데이터 범주화:
{cat_json}

로컬 폴백 진단:
- 라벨: {static_label}
- 줄글: {static_detail}

위 진단을 같은 의미를 유지하면서 더 자연스럽고 풍부한 줄글로 다듬어 주세요.
출력은 다듬은 줄글만, 라벨이나 헤더 없이.
"""

    try:
        response = requests.post(
            GEMINI_ENDPOINT,
            params={"key": settings.GEMINI_API_KEY},
            headers={"Content-Type": "application/json"},
            json={
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {
                    "temperature": 0.7, "topP": 0.9, "maxOutputTokens": 250,
                },
            },
            timeout=15,
        )
        response.raise_for_status()
        data = response.json()
        candidates = data.get("candidates", [])
        if not candidates:
            return None
        parts = candidates[0].get("content", {}).get("parts", [])
        if not parts:
            return None
        text = parts[0].get("text", "").strip()
        return text or None
    except Exception:
        return None


def recommend_habits_personalized(
    schedule: dict,
    occupation: Optional[str],
    hashtags: list[str],
    candidates: list[dict],
    count: int = 8,
) -> list[dict]:
    """사용자 일정 + 직업 + 해시태그 + 후보 습관 → Gemini가 최적 time_slot 배정해 N개 선정.

    candidates: [{id, title, emoji, category, estimated_minutes, strengthen_tags}, ...]
    반환: [{template_id, title, emoji, duration, strengthen_tags, time_slot, reason}, ...]
    """
    # Gemini 미설정/후보 비었을 때 fallback: candidates 그대로 + time_slot=anytime
    def _fallback() -> list[dict]:
        out = []
        for c in candidates[:count]:
            out.append({
                "template_id": c.get("id"),
                "title": c.get("title", ""),
                "emoji": c.get("emoji", ""),
                "duration": c.get("estimated_minutes", 15),
                "strengthen_tags": c.get("strengthen_tags", []),
                "time_slot": "anytime",
                "reason": "",
            })
        return out

    if not _is_configured() or not candidates:
        return _fallback()

    # 후보가 너무 많으면 prompt 비용 늘어남. 최대 30개로 제한.
    capped_candidates = candidates[:30]
    cand_minified = [
        {
            "id": c["id"],
            "t": c.get("title", ""),
            "cat": c.get("category", ""),
            "min": c.get("estimated_minutes", 15),
            "tags": c.get("strengthen_tags", []),
        }
        for c in capped_candidates
    ]
    # weekly_timetable이 있으면 free 시간대를 요일별로 요약해서 프롬프트 비용 절약
    weekly_grid = schedule.pop("weekly_timetable", None) if isinstance(schedule, dict) else None
    free_summary = None
    if weekly_grid and isinstance(weekly_grid, list):
        day_labels = ["월", "화", "수", "목", "금", "토", "일"]
        summary_lines = []
        for day_idx, day_row in enumerate(weekly_grid[:7]):
            if not isinstance(day_row, list):
                continue
            # 연속된 free/None 구간을 (start, end) 범위로 묶음
            free_ranges = []
            run_start = None
            for hour in range(min(len(day_row), 24)):
                cell = day_row[hour]
                is_free = cell is None or cell == "free"
                if is_free and run_start is None:
                    run_start = hour
                elif not is_free and run_start is not None:
                    free_ranges.append((run_start, hour))
                    run_start = None
            if run_start is not None:
                free_ranges.append((run_start, 24))
            if free_ranges:
                ranges_str = ", ".join(f"{s}~{e}시" for s, e in free_ranges)
                summary_lines.append(f"  {day_labels[day_idx]}: {ranges_str}")
        if summary_lines:
            free_summary = "요일별 자유 시간 (free 또는 미입력 구간):\n" + "\n".join(summary_lines)

    # 슬롯별 블록 수 집계 → 사용자 시간 우선순위
    slot_priority = None
    if weekly_grid and isinstance(weekly_grid, list):
        slot_counts: dict[str, int] = {"sleep": 0, "commute": 0, "work": 0, "meal": 0, "free": 0}
        for day_row in weekly_grid[:7]:
            if not isinstance(day_row, list):
                continue
            for cell in day_row[:24]:
                if isinstance(cell, str) and cell in slot_counts:
                    slot_counts[cell] += 1
        sorted_slots = [s for s, c in sorted(slot_counts.items(), key=lambda x: -x[1]) if c > 0]
        if sorted_slots:
            priority_str = " > ".join(f"{s}({slot_counts[s]}블록)" for s in sorted_slots)
            slot_priority = (
                f"사용자 시간 점유 우선순위 (블록 많은 순): {priority_str}\n"
                "→ 이 순서에 맞는 카테고리/컨텍스트 습관에 더 큰 가중치."
            )

    sched_json = json.dumps(schedule, ensure_ascii=False)
    cand_json = json.dumps(cand_minified, ensure_ascii=False)
    tags_str = ", ".join(hashtags) if hashtags else "없음"
    free_block = f"\n\n{free_summary}\n" if free_summary else ""
    priority_block = f"\n{slot_priority}\n" if slot_priority else ""

    prompt = f"""당신은 HABITS 앱의 맞춤 습관 추천 어시스턴트입니다.

사용자 기본 일정:
{sched_json}{free_block}{priority_block}

직업: {occupation or '미지정'}
관심 해시태그: {tags_str}

후보 습관 목록 (id, 제목, 카테고리, 소요분, 강화태그) — 프론트에서 슬롯 블록 수와 해시태그 겹침으로 사전 정렬된 순서:
{cand_json}

작업: 위 후보 중에서 사용자에게 가장 잘 맞는 {count}개를 골라, 각 습관에 가장 적합한 time_slot을 지정하세요.

time_slot 값은 반드시 다음 중 하나:
- morning: 기상 직후 ~ 출근 전
- commute: 출근/등교 이동 중 (hasCommute가 true일 때만 사용 권장)
- lunch: 점심시간
- afternoon: 점심 후 ~ 저녁 전
- evening: 퇴근/하교 후 ~ 잠들기 전 2시간 전
- bedtime: 잠들기 전 1시간
- anytime: 특정 시간대 무관

배정 원칙:
1. **'사용자 시간 점유 우선순위'에서 블록이 가장 많은 슬롯 타입을 최우선 가중**. 예: commute 블록이 가장 많으면 commute 관련 습관을 우선 추천하고 time_slot=commute 배정
2. 그 다음 우선순위 슬롯 타입의 습관을 그 다음 순위로 추천
3. 위에 표시된 '요일별 자유 시간'은 새 습관 수행 후보 시간대로 적극 활용. work/sleep/commute/meal 시간은 절대 피하기
4. commute slot은 has_commute=true일 때만 사용
5. 같은 time_slot에 너무 몰리지 않게 분산
6. 직업 특성 반영 (학생→learning 비중↑, 직장인→evening 회복 비중↑)
7. 해시태그(예: #끈기, #성실, #도전적)에서 드러나는 사용자 성향을 추천 사유에 직접 언급

출력은 반드시 JSON 배열만, 다른 텍스트 없이:
[
  {{"id": 1, "time_slot": "morning", "reason": "평일 7~8시 자유 시간이 있으니 기상 직후 5분 루틴으로 좋아요"}},
  ...
]
"""

    try:
        response = requests.post(
            GEMINI_ENDPOINT,
            params={"key": settings.GEMINI_API_KEY},
            headers={"Content-Type": "application/json"},
            json={
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {
                    "temperature": 0.4, "topP": 0.9, "maxOutputTokens": 1200,
                    "responseMimeType": "application/json",
                },
            },
            timeout=20,
        )
        response.raise_for_status()
        data = response.json()
        candidates_resp = data.get("candidates", [])
        if not candidates_resp:
            return _fallback()
        parts = candidates_resp[0].get("content", {}).get("parts", [])
        if not parts:
            return _fallback()
        text = parts[0].get("text", "").strip()
        if not text:
            return _fallback()
        parsed = json.loads(text)
    except Exception:
        return _fallback()

    if not isinstance(parsed, list):
        return _fallback()

    valid_slots = {"morning", "commute", "lunch", "afternoon", "evening", "bedtime", "anytime"}
    cand_map = {c["id"]: c for c in candidates}
    result: list[dict] = []
    for item in parsed:
        try:
            tid = int(item.get("id"))
        except Exception:
            continue
        ts = item.get("time_slot", "anytime")
        if ts not in valid_slots:
            ts = "anytime"
        c = cand_map.get(tid)
        if not c:
            continue
        result.append({
            "template_id": c["id"],
            "title": c.get("title", ""),
            "emoji": c.get("emoji", ""),
            "duration": c.get("estimated_minutes", 15),
            "strengthen_tags": c.get("strengthen_tags", []),
            "time_slot": ts,
            "reason": str(item.get("reason", ""))[:120],
        })
        if len(result) >= count:
            break

    return result if result else _fallback()


def generate_meta_insight(
    period_label: str,
    history: list[dict],
    current: dict,
) -> Optional[str]:
    """시계열 메타 인사이트 — 정적 룰로 못 만드는 cross-period 패턴 한 문단.

    history: [{"period_start", "rate", "valence", "primary_emotion", "tag_top"}, ...]
             최근 3~5개 리포트, 오래된 것부터 정렬.
    current: 같은 키 + 추가 컨텍스트 (이번 기간).
    """
    if not _is_configured() or len(history) < 2:
        return None

    hist_json = json.dumps(history, ensure_ascii=False)
    curr_json = json.dumps(current, ensure_ascii=False)

    prompt = f"""당신은 HABITS 앱의 시계열 분석 어시스턴트입니다.

규칙:
- 여러 기간을 비교한 결과만 작성. 한 기간 단편 분석 X.
- 정적 룰로 만들 수 없는 패턴(주기성, 추세 반전, 카테고리 간 격차 변화 등)에 집중.
- 인과 단정 X, 관찰적 표현
- 한국어 2~3문장, 이모지·따옴표 자제

기간 라벨: {period_label}
이전 기간 요약 (오래된→최근): {hist_json}
이번 기간: {curr_json}

이번 기간을 이전 기간들과 함께 봤을 때 발견되는 가장 의미 있는 시계열 패턴 1가지를 짧게 서술하세요.
"""
    return _call_gemini(prompt, max_tokens=200)


def generate_recommendation_rationale(
    rec_kind: str,
    rec_label: str,
    target_habit_title: Optional[str],
    target_habit_rate: Optional[float],
    completion_rate: float,
    primary_emotion: Optional[str],
    secondary_emotion: Optional[str],
    valence: str,
    emotions_tied: bool = False,
) -> Optional[str]:
    """추천 행동의 '왜 지금 이걸?'을 사용자 데이터로 구체적으로 풀어내는 1~2문장."""
    if not _is_configured():
        return None

    ctx = {
        "kind": rec_kind, "label": rec_label,
        "target_habit": target_habit_title,
        "target_habit_rate": target_habit_rate,
        "overall_rate": round(completion_rate, 2),
        "primary_emotion": primary_emotion,
        "secondary_emotion": secondary_emotion,
        "emotions_tied": emotions_tied,
        "valence": valence,
    }
    ctx_json = json.dumps(ctx, ensure_ascii=False)

    tie_rule = (
        "- emotions_tied=true면 주감정/보조감정을 단정 짓지 말고 "
        "'두 감정이 비슷한 비중으로' 같은 표현으로 풀 것\n"
        if emotions_tied else ""
    )

    prompt = f"""당신은 HABITS 앱의 추천 메시지 작성 어시스턴트입니다.

규칙:
- 일반론 X, 사용자 데이터를 인용하면서 '왜 지금 이걸 추천하는가'를 설명
- 처방이 아닌 선택지로 부드럽게 제시
- 인과 단정 X, 관찰적 표현
- 한국어 1~2문장, 이모지 1개 이내
{tie_rule}
추천 정보:
{ctx_json}

위 데이터를 토대로 사용자에게 보낼 추천 이유 메시지 1개를 작성하세요.
"""
    return _call_gemini(prompt, max_tokens=150)


def _call_gemini(prompt: str, max_tokens: int = 200) -> Optional[str]:
    try:
        response = requests.post(
            GEMINI_ENDPOINT,
            params={"key": settings.GEMINI_API_KEY},
            headers={"Content-Type": "application/json"},
            json={
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {
                    "temperature": 0.7, "topP": 0.9, "maxOutputTokens": max_tokens,
                },
            },
            timeout=15,
        )
        response.raise_for_status()
        data = response.json()
        candidates = data.get("candidates", [])
        if not candidates:
            return None
        parts = candidates[0].get("content", {}).get("parts", [])
        if not parts:
            return None
        return (parts[0].get("text", "").strip()) or None
    except Exception:
        return None


def generate_feedback(
    period_label: str,
    completion_rate: float,
    emotion_distribution: dict[str, float],
    exception_reasons: list[str],
    extra_context: Optional[str] = None,
    satisfaction_hint: Optional[str] = None,
) -> Optional[str]:
    """Gemini로 피드백 생성. 실패 시 None 반환 (호출 측에서 정적 fallback 처리).

    satisfaction_hint: 최근 사용자 만족도 기반 톤 가이드 (예: "최근 평가가 부정적이니 더 공감적으로")
    """
    if not _is_configured():
        return None

    prompt = _build_prompt(
        period_label, completion_rate, emotion_distribution,
        exception_reasons, extra_context, satisfaction_hint,
    )

    try:
        response = requests.post(
            GEMINI_ENDPOINT,
            params={"key": settings.GEMINI_API_KEY},
            headers={"Content-Type": "application/json"},
            json={
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {
                    "temperature": 0.7,
                    "topP": 0.9,
                    "maxOutputTokens": 200,
                },
            },
            timeout=15,
        )
        response.raise_for_status()
        data = response.json()
        candidates = data.get("candidates", [])
        if not candidates:
            return None
        parts = candidates[0].get("content", {}).get("parts", [])
        if not parts:
            return None
        text = parts[0].get("text", "").strip()
        return text or None
    except Exception:
        return None
