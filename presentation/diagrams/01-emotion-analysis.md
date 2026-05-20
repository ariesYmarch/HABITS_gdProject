# 감정 분석 모듈 (KoELECTRA)

## 동작 시나리오

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#F5F5F5', 'primaryBorderColor': '#555', 'primaryTextColor': '#333', 'lineColor': '#666', 'secondaryColor': '#EEE', 'fontSize': '14px'}}}%%

flowchart TB
    A["일기 작성<br/><i>'오늘 발표 준비를 했는데<br/>생각보다 잘 돼서 기분이 좋다.<br/>근데 내일이 좀 걱정된다'</i>"]

    B["텍스트 전처리<br/>(토크나이징)"]

    C["KoELECTRA 추론<br/>(Fine-tuned 감정 분류 모델)"]

    D["감정 확률 분포 출력<br/>{joy: 0.52, anxiety: 0.31,<br/>calm: 0.08, sadness: 0.05,<br/>anger: 0.02, anticipation: 0.02}"]

    E{{"임계값 판별<br/>(threshold: 0.2)"}}

    F["주감정 판별<br/>main_emotion: joy (0.52)"]

    G["복합감정 감지<br/>sub_emotion: anxiety (0.31)"]

    H["EmotionAnalysis 테이블 저장<br/>{main_emotion, confidence,<br/>emotion_distribution (JSONB)}"]

    I["감정 차트 시각화<br/>+ 맞춤 코칭 메시지 표시"]

    A --> B --> C --> D --> E
    E -->|"최고 확률"| F
    E -->|"0.2 이상 2번째"| G
    F --> H
    G --> H
    H --> I

    style A fill:#FAFAFA,stroke:#555,stroke-width:2px
    style C fill:#F0F0F0,stroke:#444,stroke-width:2px
    style D fill:#F5F5F5,stroke:#555,stroke-width:2px
    style E fill:#E8E8E8,stroke:#444,stroke-width:2px
    style H fill:#F0F0F0,stroke:#555,stroke-width:2px
    style I fill:#FAFAFA,stroke:#555,stroke-width:2px
```

## 시나리오 표

| 단계 | 주체 | 동작 | 입력 | 출력 |
|:---:|:---:|:---|:---|:---|
| 1 | 사용자 | 일기 작성 완료 | 텍스트 원문 | - |
| 2 | FastAPI | 텍스트 전처리 | 원문 | 토크나이즈된 입력 |
| 3 | KoELECTRA | 감정 분류 추론 | 토큰 시퀀스 | 6개 감정 확률 분포 |
| 4 | FastAPI | 임계값 판별 | 확률 분포 | 주감정 + 복합감정 |
| 5 | PostgreSQL | 분석 결과 저장 | EmotionAnalysis 객체 | emotion_analysis_id |
| 6 | React Native | 결과 시각화 | JSON 응답 | 감정 차트 + 코칭 메시지 |
