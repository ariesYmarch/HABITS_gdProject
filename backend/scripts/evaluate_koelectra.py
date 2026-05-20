"""KoELECTRA 홀드아웃 테스트셋 평가 CLI.

사용법:
    python scripts/evaluate_koelectra.py path/to/test.csv

테스트 CSV 형식 (UTF-8):
    text,label
    "오늘 정말 행복했다",joy
    "우울하다 ㅠㅠ",sadness
    ...

label은 8개 감정 (joy, calm, proud, hope, sadness, anger, anxiety, fatigue) 중 하나.
"""
import csv
import sys
import time
from pathlib import Path

# backend 디렉토리에서 실행한다고 가정
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.core.emotion import analyze_emotion
from app.ml.evaluator import evaluate, format_report


def predict_emotion(text: str) -> str:
    """analyze_emotion 호출 → 가장 높은 score의 감정 라벨 반환."""
    result = analyze_emotion(text)
    scores = result.get("scores", {})
    if not scores:
        return "unknown"
    return max(scores.items(), key=lambda x: x[1])[0]


def main(csv_path: str, f1_threshold: float = 0.80, sleep_per_call: float = 0.1):
    rows = []
    with open(csv_path, encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            text = row.get("text", "").strip()
            label = row.get("label", "").strip()
            if text and label:
                rows.append((text, label))

    if not rows:
        print(f"테스트 데이터 없음: {csv_path}")
        sys.exit(1)

    print(f"총 {len(rows)}개 샘플 평가 시작...")
    predictions = []
    labels = []
    for i, (text, label) in enumerate(rows, 1):
        pred = predict_emotion(text)
        predictions.append(pred)
        labels.append(label)
        if i % 20 == 0:
            print(f"  진행: {i}/{len(rows)}")
        if sleep_per_call > 0:
            time.sleep(sleep_per_call)  # HF API rate limit 고려

    result = evaluate(predictions, labels, f1_threshold=f1_threshold)
    print()
    print(format_report(result))


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(f"사용법: python {sys.argv[0]} <test.csv> [f1_threshold]")
        sys.exit(1)
    threshold = float(sys.argv[2]) if len(sys.argv) > 2 else 0.80
    main(sys.argv[1], f1_threshold=threshold)
