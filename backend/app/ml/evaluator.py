"""KoELECTRA 분류 성능 평가.

per-class F1 + macro F1 산출, 미달 클래스 식별.
"""
from collections import defaultdict
from dataclasses import dataclass


@dataclass
class ClassMetrics:
    label: str
    precision: float
    recall: float
    f1: float
    support: int


@dataclass
class EvaluationResult:
    per_class: list[ClassMetrics]
    macro_f1: float
    macro_precision: float
    macro_recall: float
    accuracy: float
    total_samples: int
    underperforming_classes: list[str]   # F1 < 임계값인 클래스


def _safe_div(num: float, den: float) -> float:
    return num / den if den > 0 else 0.0


def evaluate(
    predictions: list[str],
    labels: list[str],
    f1_threshold: float = 0.80,
) -> EvaluationResult:
    """예측 vs 정답 비교 → per-class precision/recall/F1 산출.

    sklearn 의존성 없이 구현 (배포 환경 슬림하게 유지).
    """
    if len(predictions) != len(labels):
        raise ValueError("predictions and labels length mismatch")

    n = len(labels)
    if n == 0:
        return EvaluationResult([], 0, 0, 0, 0, 0, [])

    all_classes = sorted(set(labels) | set(predictions))

    tp = defaultdict(int)
    fp = defaultdict(int)
    fn = defaultdict(int)
    correct = 0

    for pred, label in zip(predictions, labels):
        if pred == label:
            tp[label] += 1
            correct += 1
        else:
            fp[pred] += 1
            fn[label] += 1

    per_class: list[ClassMetrics] = []
    for c in all_classes:
        precision = _safe_div(tp[c], tp[c] + fp[c])
        recall = _safe_div(tp[c], tp[c] + fn[c])
        f1 = _safe_div(2 * precision * recall, precision + recall)
        support = tp[c] + fn[c]
        per_class.append(ClassMetrics(
            label=c, precision=round(precision, 4),
            recall=round(recall, 4), f1=round(f1, 4),
            support=support,
        ))

    macro_f1 = sum(m.f1 for m in per_class) / len(per_class)
    macro_precision = sum(m.precision for m in per_class) / len(per_class)
    macro_recall = sum(m.recall for m in per_class) / len(per_class)
    accuracy = correct / n

    underperforming = [m.label for m in per_class if m.f1 < f1_threshold]

    return EvaluationResult(
        per_class=per_class,
        macro_f1=round(macro_f1, 4),
        macro_precision=round(macro_precision, 4),
        macro_recall=round(macro_recall, 4),
        accuracy=round(accuracy, 4),
        total_samples=n,
        underperforming_classes=underperforming,
    )


def format_report(result: EvaluationResult) -> str:
    """사람이 읽기 좋은 리포트 문자열 생성."""
    lines = [
        f"전체 샘플: {result.total_samples}",
        f"정확도: {result.accuracy:.4f}",
        f"Macro F1: {result.macro_f1:.4f}",
        f"Macro Precision: {result.macro_precision:.4f}",
        f"Macro Recall: {result.macro_recall:.4f}",
        "",
        f"{'클래스':<12} {'Precision':<10} {'Recall':<10} {'F1':<10} {'Support':<8}",
        "-" * 56,
    ]
    for m in result.per_class:
        lines.append(
            f"{m.label:<12} {m.precision:<10.4f} {m.recall:<10.4f} {m.f1:<10.4f} {m.support:<8}"
        )

    if result.underperforming_classes:
        lines.append("")
        lines.append(f"미달 클래스 (F1 < threshold): {', '.join(result.underperforming_classes)}")
        lines.append("→ 데이터 보강 또는 클래스 가중치 조정 필요")

    return "\n".join(lines)
