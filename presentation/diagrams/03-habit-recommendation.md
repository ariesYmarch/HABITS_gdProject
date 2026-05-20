# 습관 추천 모듈 (규칙 기반 매칭 + Recombee 점진적 도입)

## 동작 시나리오: 온보딩 콜드 스타트 -> 웜 스타트 전환

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#F5F5F5', 'primaryBorderColor': '#555', 'primaryTextColor': '#333', 'lineColor': '#666', 'secondaryColor': '#EEE', 'fontSize': '14px'}}}%%

flowchart TB
    A["성격 테스트 진행"]

    B["성격 유형 2개 도출<br/>(현재 자신 / 이상적 자신)<br/><br/><i>예) 현재: 실행자형<br/>이상: 탐구자형</i>"]

    C["각 유형에 할당된<br/>해시태그 4-5개 제시<br/><br/><i>예) #자기관리 #집중력 #루틴<br/>#호기심 #창의성</i>"]

    D["사용자가 강화하고 싶은<br/>성격 특성 해시태그 선택<br/><br/><i>예) #집중력, #호기심 선택</i>"]

    E["일정 입력<br/>(시간표 / 기상 / 취침 / 통근)"]

    F["선택 해시태그에 할당된<br/>습관 목록 조회<br/>(규칙 기반 매칭)"]

    G["시간대별 습관 추천 제시<br/><br/><i>아침: 명상, 스트레칭<br/>통근: 독서, 팟캐스트<br/>저녁: 일기 쓰기, 산책</i>"]

    H["사용자가 습관 선택/채택<br/>-> 일정에 맞춰 자동 시간 배치"]

    I["Recombee에 데이터 축적 시작<br/>- user property: 성격 유형, 해시태그<br/>- interaction: 채택/무시/이행 이벤트"]

    J{{"사용자 데이터<br/>충분히 축적?"}}

    K["규칙 기반 매칭 유지<br/>(데이터 수집 계속)"]

    L["Recombee 협업 필터링<br/>점진적 개입<br/><br/>비슷한 성격 유형 사용자들의<br/>채택/이행 패턴 기반<br/>추천 정렬 및 신규 습관 제안"]

    A --> B --> C --> D --> E --> F --> G --> H --> I --> J
    J -->|"아니오 (초기)"| K
    J -->|"예 (성장기)"| L
    K -.->|"데이터 계속 축적"| J
    L -.->|"추천 정확도 개선"| G

    style A fill:#FAFAFA,stroke:#555,stroke-width:2px
    style B fill:#F5F5F5,stroke:#555,stroke-width:2px
    style D fill:#F0F0F0,stroke:#555,stroke-width:2px
    style E fill:#FAFAFA,stroke:#555,stroke-width:2px
    style F fill:#F0F0F0,stroke:#444,stroke-width:2px
    style G fill:#F5F5F5,stroke:#555,stroke-width:2px
    style H fill:#FAFAFA,stroke:#555,stroke-width:2px
    style J fill:#E8E8E8,stroke:#444,stroke-width:2px
    style K fill:#F0F0F0,stroke:#555,stroke-width:1px,stroke-dasharray: 5 5
    style L fill:#F0F0F0,stroke:#444,stroke-width:2px
```

## 시나리오 표

| 단계 | 주체 | 동작 | 입력 | 출력 |
|:---:|:---:|:---|:---|:---|
| 1 | 사용자 | 성격 테스트 진행 | 테스트 응답 | 성격 유형 2개 (현재/이상) |
| 2 | 앱 | 해시태그 제시 | 성격 유형별 해시태그 4-5개 | 해시태그 목록 |
| 3 | 사용자 | 강화 특성 해시태그 선택 | 해시태그 목록 | 선택된 해시태그 |
| 4 | 사용자 | 일정 입력 | 시간표, 기상/취침, 통근 | 가용 시간대 |
| 5 | FastAPI | 규칙 기반 습관 매칭 | 해시태그 -> 습관 매핑 테이블 | 후보 습관 목록 |
| 6 | 앱 | 시간대별 추천 제시 | 습관 목록 + 가용 시간대 | 아침/통근/저녁별 습관 카드 |
| 7 | 사용자 | 습관 채택 | 탭 선택 | 일정 자동 배치 |
| 8 | Recombee | 데이터 축적 | 채택/무시/이행 이벤트 + 성격 유형 | 사용자 프로필 구축 |
| 9 | Recombee | 점진적 개입 (성장기) | 축적된 행동 데이터 | 협업 필터링 기반 정렬/추천 |
