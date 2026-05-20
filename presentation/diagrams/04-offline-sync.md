# 오프라인 동기화 모듈 (AsyncStorage + 자동 동기화)

## 동작 시나리오

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#F5F5F5', 'primaryBorderColor': '#555', 'primaryTextColor': '#333', 'lineColor': '#666', 'secondaryColor': '#EEE', 'fontSize': '14px'}}}%%

flowchart TB
    A["네트워크 단절 감지<br/>(NetInfo: offline)"]

    subgraph OFFLINE["오프라인 구간"]
        direction TB
        B["습관 '운동' 완료 체크"]
        C["Zustand Store 상태 업데이트<br/>-> UI 즉시 반영"]
        D["AsyncStorage<br/>pending_sync 큐에 추가<br/>[{type: habit_log, data: {...}}]"]

        E["일기 작성 완료"]
        F["Zustand Store 상태 업데이트<br/>-> UI 즉시 반영"]
        G["AsyncStorage<br/>pending_sync 큐 누적<br/>[habit_log, diary] 2건"]

        B --> C --> D
        E --> F --> G
    end

    H["네트워크 복구 감지<br/>(NetInfo: online)"]

    subgraph SYNC["자동 동기화 구간"]
        direction TB
        I["pending_sync 큐 조회<br/>미전송 2건 확인"]
        J["POST /api/sync/batch<br/>[habit_log, diary]<br/>(FIFO 순서 처리)"]
        K{{"동기화 결과"}}
        L["성공 항목 큐에서 제거<br/>pending_sync: []"]
        M["실패 항목 큐에 유지<br/>-> 다음 복구 시 재시도"]
    end

    N["동기화 완료 표시<br/>{synced: 2, failed: 0}"]

    A --> OFFLINE
    OFFLINE --> H --> SYNC
    I --> J --> K
    K -->|"성공"| L --> N
    K -->|"실패"| M

    style A fill:#F0F0F0,stroke:#555,stroke-width:2px
    style OFFLINE fill:#F8F8F8,stroke:#999,stroke-width:1px,stroke-dasharray: 5 5
    style H fill:#F0F0F0,stroke:#555,stroke-width:2px
    style SYNC fill:#F5F5F5,stroke:#999,stroke-width:1px
    style K fill:#E8E8E8,stroke:#444,stroke-width:2px
    style N fill:#FAFAFA,stroke:#555,stroke-width:2px
```

## 시나리오 표

| 단계 | 주체 | 동작 | 입력 | 출력 |
|:---:|:---:|:---|:---|:---|
| 1 | React Native | 네트워크 단절 감지 | NetInfo 이벤트 | offline 모드 진입 |
| 2 | 사용자 | 습관 체크 / 일기 작성 | 터치 입력 | - |
| 3 | Zustand | 로컬 상태 업데이트 | 변경 데이터 | UI 즉시 반영 |
| 4 | AsyncStorage | pending_sync 큐 적재 | 변경 항목 | 큐 누적 (FIFO) |
| 5 | React Native | 네트워크 복구 감지 | NetInfo 이벤트 | online 모드 전환 |
| 6 | React Native | 큐 조회 + 배치 전송 | pending_sync | POST /api/sync/batch |
| 7 | FastAPI | 트랜잭션 처리 | 배치 데이터 | 항목별 성공/실패 |
| 8 | AsyncStorage | 큐 정리 | 동기화 결과 | 성공 제거, 실패 유지 |
