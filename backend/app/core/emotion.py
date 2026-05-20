"""감정 분석 클라이언트.

흐름:
  1. HF Inference API (router 형식) 시도 → 성공 시 KoELECTRA 결과 + 키워드 가중 머지
  2. HF 실패 또는 키 미설정 시 → 키워드 사전만으로 분류 (fallback)

KoELECTRA 파인튜닝 후 본인 repo로 교체하면 자동으로 메인 신호로 사용됨.
파인튜닝 전엔 base 모델이 분류 헤드 없어서 사실상 keyword fallback로 동작.
"""
import time
import requests

from app.core.config import settings
from app.feedback.constants import ALL_EMOTIONS, EMOTION_LABELS
from app.feedback.keywords import (
    merge_with_model_distribution,
    score_text_by_keywords,
)


# HF Router 새 endpoint (구 api-inference 는 deprecated)
HF_ROUTER_URL = "https://router.huggingface.co/hf-inference/models"


def _call_hf(text: str, max_retries: int = 2) -> dict:
    """HF Inference API 호출. 실패/지원 안 됨 → 빈 dict 반환."""
    if not settings.HF_API_TOKEN or not settings.HF_MODEL_REPO:
        return {}

    url = f"{HF_ROUTER_URL}/{settings.HF_MODEL_REPO}"
    headers = {"Authorization": f"Bearer {settings.HF_API_TOKEN}"}

    for attempt in range(max_retries):
        try:
            response = requests.post(
                url, headers=headers,
                json={"inputs": text}, timeout=30,
            )
        except requests.RequestException:
            if attempt < max_retries - 1:
                time.sleep(2)
                continue
            return {}

        if response.status_code == 200:
            result = response.json()
            scores_list = result[0] if (result and isinstance(result[0], list)) else result
            if not scores_list:
                return {}
            return {
                item["label"]: round(float(item["score"]), 4)
                for item in scores_list
                if "label" in item and "score" in item
            }

        # 503: 모델 로딩 중 → 대기 후 재시도
        if response.status_code == 503:
            try:
                wait = response.json().get("estimated_time", 10)
            except Exception:
                wait = 10
            if attempt < max_retries - 1:
                time.sleep(min(wait, 20))
                continue

        # 그 외 (400, 404 등) → 그냥 실패
        break

    return {}


def analyze_emotion(text: str, threshold: float = 0.2) -> dict:
    """텍스트 감정 분석.

    Args:
        text: 분석할 텍스트
        threshold: tags에 포함할 최소 score (기본 0.2)

    Returns:
        {
            "tags": ["#기쁨", "#평온"],
            "scores": {"joy": 0.7, "calm": 0.2, ...},
            "source": "hf+keywords" | "keywords_only" | "empty"
        }
    """
    if not text or not text.strip():
        return {"tags": [], "scores": {}, "source": "empty"}

    hf_scores = _call_hf(text)
    keyword_scores = score_text_by_keywords(text)

    if hf_scores:
        # HF + 키워드 머지 (HF 70%, 키워드 30%)
        scores = merge_with_model_distribution(hf_scores, text, model_weight=0.7)
        source = "hf+keywords"
    elif keyword_scores:
        scores = keyword_scores
        source = "keywords_only"
    else:
        return {"tags": [], "scores": {}, "source": "empty"}

    # 8개 감정 카테고리만 유지 (HF가 다른 라벨을 반환할 경우 필터링)
    scores = {k: v for k, v in scores.items() if k in ALL_EMOTIONS}

    # 한글 태그 (#기쁨 등) - threshold 이상, score 내림차순
    above = [(k, v) for k, v in scores.items() if v >= threshold]
    above.sort(key=lambda x: x[1], reverse=True)
    tags = [f"#{EMOTION_LABELS.get(k, k)}" for k, _ in above]

    return {"tags": tags, "scores": scores, "source": source}
