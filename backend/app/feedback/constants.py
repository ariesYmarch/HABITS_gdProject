"""감정 카테고리 상수 - 백엔드 전역 공유."""

POSITIVE_EMOTIONS = {"joy", "calm", "proud", "hope"}
NEGATIVE_EMOTIONS = {"sadness", "anger", "anxiety", "fatigue"}
ALL_EMOTIONS = POSITIVE_EMOTIONS | NEGATIVE_EMOTIONS

EMOTION_LABELS = {
    "joy": "기쁨",
    "calm": "평온",
    "proud": "뿌듯",
    "hope": "희망",
    "sadness": "슬픔",
    "anger": "짜증",
    "anxiety": "불안",
    "fatigue": "피로",
}

# 단일 감정 판정 임계값
SINGLE_EMOTION_THRESHOLD = 0.5
# 복합 감정 후보로 인정하는 confidence 임계값
COMBO_EMOTION_THRESHOLD = 0.2

# 만족도 평가 기반 정책 임계값
# good=1, neutral=0, bad=-1 평균. 이 값보다 낮으면 "최근 만족도 낮음"으로 판단.
LOW_SATISFACTION_THRESHOLD = -0.3
# 최근 N일 평가만 집계
SATISFACTION_LOOKBACK_DAYS = 30
