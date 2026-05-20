"""KoELECTRA 감정 분류 파인튜닝 스크립트.

실행 환경: GPU 권장 (Colab T4 무료 충분).

전처리 흐름:
  1. AI Hub 감성 대화 말뭉치 다운로드 (수동, AI Hub 가입 필요)
  2. 원본 라벨(60+개) → 우리 8개 클래스로 리매핑
  3. train/val/test 분할
  4. KoELECTRA-base + classification head 파인튜닝
  5. 클래스 불균형 보완: weighted CrossEntropyLoss
  6. 학습 후 Hugging Face Hub에 업로드

사용 방법 (Colab):
  !pip install transformers datasets scikit-learn torch huggingface_hub
  !huggingface-cli login   # write 권한 토큰
  !python finetune_koelectra.py

본 파일은 템플릿이므로 데이터 경로·하이퍼파라미터·HF repo 이름은 본인 환경에 맞게 수정.
"""
import json
import sys
from pathlib import Path

import torch
import torch.nn as nn
from torch.utils.data import Dataset


# ===== 라벨 리매핑 =====
# AI Hub 감성 대화 말뭉치 원본 60+개 라벨 → 우리 8개 클래스
# 실제 원본 라벨 목록은 데이터셋 메타에서 확인 후 보강 필요
LABEL_REMAP = {
    # joy
    "기쁨": "joy", "행복": "joy", "신남": "joy", "즐거움": "joy", "흥분": "joy",
    # calm
    "평온": "calm", "안도": "calm", "차분": "calm", "편안": "calm",
    # proud
    "자신감": "proud", "뿌듯": "proud", "성취": "proud", "자랑": "proud",
    # hope
    "희망": "hope", "기대": "hope", "설렘": "hope",
    # sadness
    "슬픔": "sadness", "우울": "sadness", "외로움": "sadness", "공허": "sadness", "비참": "sadness",
    # anger
    "분노": "anger", "짜증": "anger", "역겨움": "anger", "분개": "anger", "혐오": "anger",
    # anxiety
    "불안": "anxiety", "공포": "anxiety", "걱정": "anxiety", "초조": "anxiety", "긴장": "anxiety",
    # fatigue
    "피로": "fatigue", "지침": "fatigue", "탈진": "fatigue", "권태": "fatigue",
}

LABELS = ["joy", "calm", "proud", "hope", "sadness", "anger", "anxiety", "fatigue"]
LABEL_TO_ID = {l: i for i, l in enumerate(LABELS)}
ID_TO_LABEL = {i: l for l, i in LABEL_TO_ID.items()}


# ===== 데이터셋 클래스 =====
class EmotionDataset(Dataset):
    def __init__(self, texts: list[str], labels: list[int], tokenizer, max_length: int = 128):
        self.texts = texts
        self.labels = labels
        self.tokenizer = tokenizer
        self.max_length = max_length

    def __len__(self):
        return len(self.texts)

    def __getitem__(self, idx):
        encoding = self.tokenizer(
            self.texts[idx],
            truncation=True,
            padding="max_length",
            max_length=self.max_length,
            return_tensors="pt",
        )
        return {
            "input_ids": encoding["input_ids"].squeeze(),
            "attention_mask": encoding["attention_mask"].squeeze(),
            "labels": torch.tensor(self.labels[idx], dtype=torch.long),
        }


def load_and_remap_data(jsonl_path: str) -> tuple[list[str], list[int]]:
    """JSONL 파일 로드 + 라벨 리매핑.

    JSONL 각 줄: {"text": "...", "label": "기쁨"} 형식 가정
    """
    texts, labels = [], []
    skipped = 0
    with open(jsonl_path, encoding="utf-8") as f:
        for line in f:
            row = json.loads(line)
            text = row.get("text", "").strip()
            raw_label = row.get("label", "").strip()
            mapped = LABEL_REMAP.get(raw_label)
            if not text or not mapped:
                skipped += 1
                continue
            texts.append(text)
            labels.append(LABEL_TO_ID[mapped])
    print(f"로드 완료: {len(texts)}개 (스킵 {skipped}개)")
    return texts, labels


def compute_class_weights(labels: list[int]) -> torch.Tensor:
    """클래스 불균형 보완용 가중치 (역빈도)."""
    from collections import Counter
    counts = Counter(labels)
    total = sum(counts.values())
    weights = torch.zeros(len(LABELS))
    for i in range(len(LABELS)):
        weights[i] = total / (len(LABELS) * counts.get(i, 1))
    return weights


def main():
    """파인튜닝 실행."""
    from transformers import (
        ElectraForSequenceClassification,
        ElectraTokenizer,
        Trainer,
        TrainingArguments,
    )
    from sklearn.model_selection import train_test_split

    # ===== 설정 (본인 환경에 맞게 조정) =====
    DATA_PATH = "data/aihub_emotion.jsonl"  # 전처리된 데이터
    BASE_MODEL = "monologg/koelectra-base-v3-discriminator"
    OUTPUT_DIR = "./koelectra_emotion_8class"
    HF_REPO = "YOUR_USERNAME/koelectra-emotion-8class"  # HF 업로드 시 사용

    # ===== 데이터 로드 =====
    texts, labels = load_and_remap_data(DATA_PATH)
    train_texts, val_texts, train_labels, val_labels = train_test_split(
        texts, labels, test_size=0.15, stratify=labels, random_state=42
    )
    print(f"train: {len(train_texts)}, val: {len(val_texts)}")

    # ===== 토크나이저 + 모델 =====
    tokenizer = ElectraTokenizer.from_pretrained(BASE_MODEL)
    model = ElectraForSequenceClassification.from_pretrained(
        BASE_MODEL,
        num_labels=len(LABELS),
        id2label=ID_TO_LABEL,
        label2id=LABEL_TO_ID,
    )

    train_ds = EmotionDataset(train_texts, train_labels, tokenizer)
    val_ds = EmotionDataset(val_texts, val_labels, tokenizer)

    # ===== 클래스 가중치 적용한 Trainer =====
    class_weights = compute_class_weights(train_labels).to(
        "cuda" if torch.cuda.is_available() else "cpu"
    )

    class WeightedTrainer(Trainer):
        def compute_loss(self, model, inputs, return_outputs=False, **kwargs):
            labels = inputs.pop("labels")
            outputs = model(**inputs)
            logits = outputs.logits
            loss_fn = nn.CrossEntropyLoss(weight=class_weights)
            loss = loss_fn(logits, labels)
            return (loss, outputs) if return_outputs else loss

    args = TrainingArguments(
        output_dir=OUTPUT_DIR,
        num_train_epochs=3,
        per_device_train_batch_size=16,
        per_device_eval_batch_size=32,
        warmup_steps=500,
        weight_decay=0.01,
        learning_rate=5e-5,
        logging_steps=50,
        eval_strategy="epoch",
        save_strategy="epoch",
        load_best_model_at_end=True,
        metric_for_best_model="eval_loss",
        push_to_hub=False,  # 학습 끝나고 별도 push
        fp16=torch.cuda.is_available(),
    )

    trainer = WeightedTrainer(
        model=model,
        args=args,
        train_dataset=train_ds,
        eval_dataset=val_ds,
    )

    trainer.train()
    trainer.save_model(OUTPUT_DIR)
    tokenizer.save_pretrained(OUTPUT_DIR)
    print(f"모델 저장 완료: {OUTPUT_DIR}")

    # HF Hub 업로드 (선택)
    # model.push_to_hub(HF_REPO)
    # tokenizer.push_to_hub(HF_REPO)


if __name__ == "__main__":
    main()
