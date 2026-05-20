"""사용자가 직접 선택한 감정 태그를 ground truth로 export.

흐름:
  1. DB에서 Diary 조회 (text_content가 비어있지 않고 emotion_tags가 1개인 것)
  2. 사용자 선택 태그 = ground truth로 간주 (KoELECTRA 출력은 제외 - 순환 학습 방지)
  3. JSONL 형식으로 저장 → 다음 파인튜닝 라운드 입력으로 활용

emotion_tags가 여러 개인 경우 multi-label 학습에 활용 가능하지만 현재 8-class single-label 모델이라 단일 태그만 사용.

사용법:
    python scripts/export_user_labels.py [output.jsonl] [--min-text-length 20]
"""
import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from app.core.database import SessionLocal
from app.feedback.constants import ALL_EMOTIONS
from app.models import Diary


def export(output_path: str, min_text_length: int = 20) -> int:
    db = SessionLocal()
    try:
        diaries = db.query(Diary).filter(
            Diary.deleted_at.is_(None),
            Diary.text_content.isnot(None),
        ).all()

        count = 0
        with open(output_path, "w", encoding="utf-8") as f:
            for d in diaries:
                text = (d.text_content or "").strip()
                tags = d.emotion_tags or []

                # 필터: 텍스트 충분, 태그 정확히 1개, 알려진 감정
                if len(text) < min_text_length:
                    continue
                if len(tags) != 1:
                    continue
                if tags[0] not in ALL_EMOTIONS:
                    continue

                f.write(json.dumps(
                    {"text": text, "label": tags[0]},
                    ensure_ascii=False,
                ) + "\n")
                count += 1

        return count
    finally:
        db.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("output", default="data/user_labels.jsonl", nargs="?")
    parser.add_argument("--min-text-length", type=int, default=20)
    args = parser.parse_args()

    n = export(args.output, args.min_text_length)
    print(f"export 완료: {n}건 → {args.output}")
