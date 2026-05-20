# 피드백 생성 모듈 (Gemini Flash + 로컬 폴백)

## 동작 시나리오

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#F5F5F5', 'primaryBorderColor': '#555', 'primaryTextColor': '#333', 'lineColor': '#666', 'secondaryColor': '#EEE', 'fontSize': '14px'}}}%%

flowchart TB
    A["주간 리포트 트리거<br/>(매주 일요일 23:00)"]

    B["주간 데이터 집계<br/>habit_logs + emotion_analyses 조회"]

    C["집계 결과<br/>이행률: 72% | 주감정: calm<br/>연속일수: 5일 | 감정 변동폭: 낮음"]

    D{{"상황 판단 분기"}}

    E["특수 상황 감지 조건:<br/>- 이행률 급변 (전주 대비 20%p 이상)<br/>- 부정 감정 3일 연속<br/>- 연속 미달 7일 이상"]

    F["Gemini Flash<br/>(동적 피드백 생성, 30%)<br/><br/>프롬프트: 사용자 맥락 + 감정 + 이행률<br/>-> 개인화된 코칭 메시지"]

    G["로컬 폴백<br/>(정적 메시지 풀, 70%)<br/><br/>감정 카테고리 x 이행률 구간<br/>-> 사전 정의 메시지 매칭"]

    H["코칭 피드백 메시지<br/><i>'꾸준히 잘 해내고 있어요!<br/>이 페이스를 유지해보세요.'</i>"]

    I["AIReport 테이블 저장<br/>{period, completion_rate,<br/>insight, suggestion}"]

    J["푸시 알림 발송<br/>(Firebase Cloud Messaging)"]

    K["리포트 화면 표시<br/>이행률 차트 + 코칭 메시지"]

    A --> B --> C --> D
    D -->|"해당"| E
    E --> F
    D -->|"미해당"| G
    F --> H
    G --> H
    H --> I --> J --> K

    style A fill:#FAFAFA,stroke:#555,stroke-width:2px
    style C fill:#F5F5F5,stroke:#555,stroke-width:2px
    style D fill:#E8E8E8,stroke:#444,stroke-width:2px
    style E fill:#F0F0F0,stroke:#555,stroke-width:1px
    style F fill:#F0F0F0,stroke:#444,stroke-width:2px
    style G fill:#F0F0F0,stroke:#444,stroke-width:2px
    style H fill:#FAFAFA,stroke:#555,stroke-width:2px
    style I fill:#F0F0F0,stroke:#555,stroke-width:2px
    style K fill:#FAFAFA,stroke:#555,stroke-width:2px
```

## 시나리오 표

| 단계 | 주체 | 동작 | 입력 | 출력 |
|:---:|:---:|:---|:---|:---|
| 1 | 스케줄러 | 주간 리포트 트리거 | cron (일요일 23:00) | 생성 요청 |
| 2 | FastAPI | 주간 데이터 집계 | user_id + 주간 범위 | 이행률, 감정 평균, 연속일수 |
| 3 | FastAPI | 상황 판단 분기 | 집계 결과 | "특수" 또는 "일반" |
| 4a | Gemini Flash | 동적 피드백 생성 (30%) | 프롬프트 (맥락 + 감정) | 개인화 코칭 메시지 |
| 4b | 로컬 폴백 | 정적 메시지 매칭 (70%) | 감정 x 이행률 구간 | 사전 정의 메시지 |
| 5 | PostgreSQL | 리포트 저장 | AIReport 객체 | ai_report_id |
| 6 | FCM | 푸시 알림 발송 | 알림 내용 | 사용자 단말 전달 |
| 7 | React Native | 리포트 표시 | JSON 응답 | 차트 + 코칭 메시지 |
