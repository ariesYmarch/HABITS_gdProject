"""감정 키워드 사전.
KoELECTRA가 confidence 낮을 때 보완 신호로 활용. 구어체·줄임말·신조어 포함.

확장 정책: 실제 사용자 일기 데이터 누적 후 정량적으로 추가 (점진적 모델 개선 파이프라인 참고).
"""
from __future__ import annotations

import re
from typing import Optional

from app.feedback.constants import ALL_EMOTIONS


EMOTION_KEYWORDS: dict[str, list[str]] = {
    "joy": [
        # 기본 표현
        "기뻐", "기쁘", "기쁘다", "기쁨", "행복", "행복해", "행복하다", "즐거", "즐겁", "즐거워",
        "신나", "신난다", "신난", "재밌", "재미있", "재미있다", "신기", "웃", "웃긴", "웃겼",
        # 구어체·줄임말
        "ㅎㅎ", "ㅋㅋ", "ㅋㅋㅋ", "ㅎㅎㅎ", "ㅋㅋㅋㅋ", "히히", "헤헤", "흐흐", "킹받았",
        # 신조어
        "개꿀", "개좋", "개행복", "꿀", "킹받", "잼", "잼있", "쩐다", "지렸",
    ],
    "calm": [
        "평온", "평온해", "차분", "차분해", "고요", "조용", "안정", "안정적",
        "편안", "편해", "여유", "여유로", "느긋", "릴랙스", "쉴", "쉬는",
        "마음 편", "괜찮", "괜찮다", "잔잔", "은은", "포근",
    ],
    "proud": [
        "뿌듯", "뿌듯해", "뿌듯하다", "성취", "성취감", "이뤄", "해냈", "해내",
        "멋있", "멋졌", "잘했", "잘했어", "잘 했", "자랑스러", "기특",
        "끝냈", "완성", "달성", "이룬", "보람",
        # 신조어
        "개뿌듯", "킹뿌듯", "갓뿌듯",
    ],
    "hope": [
        "희망", "희망적", "기대", "기대돼", "기대된다", "설레", "설렘", "설렌",
        "두근", "두근두근", "두근거", "꿈꿔", "바람", "바라", "도전", "도전하",
        "내일", "다음", "앞으로", "미래", "더 잘",
    ],
    "sadness": [
        "슬프", "슬퍼", "슬픔", "우울", "우울해", "우울하다", "눈물", "울었", "울고",
        "외로", "외롭", "허전", "공허", "쓸쓸", "처참", "참담", "비참",
        # 구어체
        "ㅠㅠ", "ㅜㅜ", "ㅠ", "ㅜ", "ㅠㅠㅠ", "흑", "흑흑", "엉엉", "흐엉",
        # 신조어
        "현타", "현웃", "현실 자각", "기분 다운",
    ],
    "anger": [
        "짜증", "짜증나", "짜증났", "짜증남", "화", "화나", "화났", "분노", "열받",
        "빡쳐", "빡친", "빡침", "꼴받", "어이없", "어이가", "황당", "어처구니",
        "성질", "성가셔", "거슬려", "싫", "싫었", "싫다",
        # 신조어
        "킹받", "킹받네", "개짜증", "현타옴", "꼴받네",
    ],
    "anxiety": [
        "불안", "불안해", "불안하다", "걱정", "걱정돼", "걱정된다", "걱정되", "초조",
        "긴장", "긴장돼", "긴장된다", "두려", "두려워", "무서", "무섭", "겁",
        "조마조마", "어쩌지", "큰일", "망했", "망함", "망할",
        # 신조어
        "쫄", "쫄려", "쫄깃", "조마",
    ],
    "fatigue": [
        "피곤", "피곤해", "피곤하다", "피로", "지쳐", "지쳤", "지침", "지치",
        "힘들", "힘들어", "힘듦", "힘듭", "힘드네", "졸려", "졸림", "졸렸",
        "기운 없", "기력 없", "녹초", "퍼져", "뻗", "뻗었",
        # 구어체
        "ㅠㅠ 피곤", "현타 피곤", "에너지 바닥", "방전", "에너지 없",
    ],
}


# 키워드를 미리 정렬 (긴 것 우선 매칭 - "기쁘다"가 "기쁘"보다 우선)
_SORTED_KEYWORDS: dict[str, list[str]] = {
    emo: sorted(set(words), key=len, reverse=True)
    for emo, words in EMOTION_KEYWORDS.items()
}


def score_text_by_keywords(text: str) -> dict[str, float]:
    """텍스트에서 각 감정 키워드 매칭 카운트를 정규화한 분포 반환.

    매칭이 없으면 빈 dict 반환.
    """
    if not text:
        return {}

    text_lower = text.lower()
    raw: dict[str, int] = {emo: 0 for emo in ALL_EMOTIONS}

    for emo, words in _SORTED_KEYWORDS.items():
        for w in words:
            # 단순 substring 매칭 (한국어는 형태소 분석 없이도 substring으로 충분히 신호 잡힘)
            count = text_lower.count(w.lower())
            if count > 0:
                raw[emo] += count

    total = sum(raw.values())
    if total == 0:
        return {}

    return {emo: round(c / total, 4) for emo, c in raw.items() if c > 0}


def merge_with_model_distribution(
    model_dist: dict[str, float],
    text: str,
    model_weight: float = 0.7,
) -> dict[str, float]:
    """KoELECTRA 결과와 키워드 사전 결과를 가중 평균.

    KoELECTRA confidence가 낮은 경우 키워드 사전이 보완 신호로 작동.
    model_weight=0.7 → 모델 70% + 키워드 30% (모델이 더 강한 학습 결과를 갖고 있음)
    """
    keyword_dist = score_text_by_keywords(text)

    if not keyword_dist:
        return model_dist
    if not model_dist:
        return keyword_dist

    merged: dict[str, float] = {}
    keys = set(model_dist.keys()) | set(keyword_dist.keys())
    kw_weight = 1.0 - model_weight
    for k in keys:
        merged[k] = round(
            model_dist.get(k, 0) * model_weight + keyword_dist.get(k, 0) * kw_weight,
            4,
        )
    return merged
