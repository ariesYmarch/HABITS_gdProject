"""Recombee 추천 클라이언트 wrapper.

Recombee 키가 비어있으면 stub 모드 (빈 결과 반환).
"""
from typing import Optional

from app.core.config import settings


def _is_configured() -> bool:
    return bool(settings.RECOMBEE_DB_ID) and bool(settings.RECOMBEE_API_TOKEN)


def _client():
    """Recombee SDK lazy import (키 없을 때 import 비용 회피)."""
    from recombee_api_client.api_client import RecombeeClient
    return RecombeeClient(settings.RECOMBEE_DB_ID, settings.RECOMBEE_API_TOKEN)


def register_user(user_id: int, properties: Optional[dict] = None) -> bool:
    if not _is_configured():
        return False
    try:
        from recombee_api_client.api_requests import AddUser, SetUserValues
        c = _client()
        c.send(AddUser(str(user_id)))
        if properties:
            c.send(SetUserValues(str(user_id), properties, cascade_create=True))
        return True
    except Exception:
        return False


def register_item(item_id: str, properties: Optional[dict] = None) -> bool:
    """item_id는 보통 habit template id (문자열로)."""
    if not _is_configured():
        return False
    try:
        from recombee_api_client.api_requests import AddItem, SetItemValues
        c = _client()
        c.send(AddItem(item_id))
        if properties:
            c.send(SetItemValues(item_id, properties, cascade_create=True))
        return True
    except Exception:
        return False


def recommend_items_for_user(user_id: int, count: int = 10) -> list[dict]:
    """사용자별 추천 아이템 N개. 실패 시 빈 리스트."""
    if not _is_configured():
        return []
    try:
        from recombee_api_client.api_requests import RecommendItemsToUser
        c = _client()
        result = c.send(RecommendItemsToUser(str(user_id), count))
        return result.get("recomms", [])
    except Exception:
        return []


def send_interaction(user_id: int, item_id: str, interaction: str) -> bool:
    """사용자 행동 이벤트 전송. interaction: 'bookmark' | 'purchase'.

    HABITS 도메인 매핑:
      - 'bookmark' = 채택 (수락)
      - 'purchase' = 이행 완료
    """
    if not _is_configured():
        return False
    try:
        from recombee_api_client.api_requests import AddBookmark, AddPurchase
        c = _client()
        if interaction == "bookmark":
            c.send(AddBookmark(str(user_id), item_id, cascade_create=True))
        elif interaction == "purchase":
            c.send(AddPurchase(str(user_id), item_id, cascade_create=True))
        else:
            return False
        return True
    except Exception:
        return False


def send_rating(user_id: int, item_id: str, rating_unit: float) -> bool:
    """명시적 평가 신호. rating_unit: -1.0 ~ 1.0 (Recombee 표준).

    HABITS 매핑:
      - good → +1.0
      - neutral → 0.0
      - bad → -1.0
    """
    if not _is_configured():
        return False
    try:
        from recombee_api_client.api_requests import AddRating
        c = _client()
        c.send(AddRating(str(user_id), item_id, rating_unit, cascade_create=True))
        return True
    except Exception:
        return False
