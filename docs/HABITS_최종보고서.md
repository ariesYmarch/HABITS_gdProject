# HABITS;
## 심리 이론 기반의 자아 탐색과 AI 감정 분석을 통한 개인 맞춤형 습관 코칭 및 피드백 서비스

| 항목 | 내용 |
| --- | --- |
| **Team Leader** | 양설아 (2276186) |
| **Team Member** | Deng Yuanrong (2271003) |
| **Academic Advisor** | 심재형 |
| **Submission Date** | 2026-06 |
| **보고서 구분** | 최종 보고서 |
| **트랙** | 산학트랙 |

<br>

## 목차

1. 과제 요약
   - 1.1 문제 정의
   - 1.2 목표 및 해결 방안
   - 1.3 기존 서비스와의 비교
   - 1.4 제안 내용
   - 1.5 기대 효과 및 의의
   - 1.6 주요 기능 리스트
   - 1.7 주요 기능의 엔진 및 설계
   - 1.8 주요 기능의 구현
   - 1.9 기타
2. 과제 설계
   - 2.1 요구사항 정의
   - 2.2 상세 기능 명세
   - 2.3 전체 시스템 구성
   - 2.4 주요 엔진 및 기능 설계
   - 2.5 개발 내용 및 현황
3. 팀 정보
4. 평가
5. 결론
6. 참고문헌

<br>
<br>

# 1. 과제 요약

## 1.1. 문제 정의

### 배경 및 필요성

급변하는 사회적 환경 속에서 20대 청년 및 사회초년생들은 자신이 추구하는 가치와 일상의 행동을 일치시키는 데 점점 더 큰 어려움을 겪고 있다. 학업, 취업, 인간관계, 경제적 부담 등 다양한 스트레스 요인이 중첩되는 시기인 만큼, 단순한 의지력만으로 습관을 형성하고 유지하기에는 구조적인 한계가 존재한다. 이에 디지털 웰니스 솔루션에 대한 수요가 급증하고 있으며, Grand View Research에 따르면 전 세계 웰니스 앱 시장의 연 평균 성장률(CAGR)은 2025년부터 2030년 사이 14.9%에 달할 것으로 전망된다.

그러나 이러한 시장 성장에도 불구하고, 기존 습관 형성 서비스에는 세 가지 근본적인 문제가 존재한다.

### 문제점 1. 일률적 습관 추천, 개인 맞춤화 부족

기존 서비스 대다수는 개인의 성향, 성격적 특성, 생활 환경을 고려하지 않은 획일적인 습관을 추천한다. 사용자는 자신이 어떤 삶의 방식과 지향점에 가치를 느끼는지, 어떤 성격 특성을 강화하고 싶은지를 탐색할 기회 없이 범용적 루틴을 제안받으며, 이는 내재적 동기를 반영하지 못해 지속성을 담보하지 못한다는 문제를 야기한다.

### 문제점 2. 감정 상태와 습관 이행률 간의 관련성 간과

스트레스 수준이 높아지면 습관 이행률이 급락하는 상관관계가 관찰되지만, 기존 서비스는 감정 상태와 무관하게 동일 강도의 습관 이행을 요구하며 사용자의 죄책감과 부담감을 가중시키는 경향이 있다. 이러한 압박의 결과는 사용자의 서비스 이탈로 이어진다.

### 문제점 3. 초기 동기 상실과 낮은 지속률

단순히 습관 이행 여부를 기록하는 기능만으로는 초기 동기 상실이 발생하기 쉬우며, 사용자가 지속적으로 서비스를 이용하도록 유도하기에는 뚜렷한 한계가 있다. 구체적인 피드백 요소가 없는 어플리케이션을 사용자가 단순히 기록용으로 사용하다가 금세 흥미를 잃고 이탈하는 현상이 빈번하게 보고된다.

### Target Customer와 Pain Points

HABITS 프로젝트가 정의한 타겟 커스트머는 자신이 어떤 사람이 되기를 원하는지 아직 잘 모르는 20대 젊은 층이다. 이들은 가치 있는 매일을 보내고 싶지만 어떤 삶의 방식이 자신에게 맞고 가치 있는지 확신을 갖지 못한다.

**페르소나: 김민지 (24세, 여성)**

최근 휴학한 김민지 씨는 부산에서 상경해 서울에서 자취를 하고 있다. 대학 생활을 하다 번아웃이 와 휴학을 신청한 김민지 씨는 휴학 기간을 알차게 쓰고 싶지만 본인이 느끼기에는 어딘가 부족하고 방향성 없는 하루하루를 보내기 일쑤인 자신의 모습을 보고 휴학이 잘 한 선택이 맞았는지 모르겠다고 생각하고 있다. 구체적인 방향성과 목표를 정하려고 해도 자신이 무엇을 원하는지, 어떤 사람인지, 어떤 사람이 되고 싶은지, 어떤 삶을 살고 싶은지 그 무엇도 제대로 모르겠다는 생각만 든다.

이러한 Pain Point는 앞서 정의한 세 가지 문제점에 직접적으로 대응된다.

- **자기 이해의 어려움**: 기존의 대중화된 성격 테스트는 일회성 결과로 끝나고, 결과 이후 습관이나 감정 변화를 연결해주는 시스템이 없다.
- **습관 관리의 피로감**: 자신의 성향에 맞지 않는 습관을 강요받거나 자신의 일정에 맞지 않아 유지에 피로감을 느낀다.
- **감정 기록의 모호함**: 감정 일기나 다이어리를 써도 객관적 피드백이 없으니 스스로 변화나 패턴을 인식하기 어렵다.
- **피드백 부재로 인한 지속성 저하**: 데이터 기반의 맞춤형 피드백 루프가 없어 동기부여가 약하고 앱 이탈률이 높다.

<br>

## 1.2. 목표 및 해결 방안

### 프로젝트의 목표

HABITS의 궁극적인 목표는 사용자가 의미 있는 행동 변화를 반복하여 자기 지향적 목표를 달성할 수 있도록 돕는 것이다. 이를 위해 본 서비스는 심리학 기반의 성향 진단, 사용자의 일상과 맥락을 반영한 맞춤형 루틴 추천, 그리고 감정 기반의 개인화 피드백을 결합한 통합형 코칭 서비스로 설계되었다. 사용자 여정은 진단에서 제안, 실행, 피드백으로 이어지는 순환 구조를 따르며, 이 네 단계가 유기적으로 작동하여 지속적인 행동 변화를 유도한다.

### 자기결정이론(SDT) 기반 사용자 맞춤 습관 추천 시스템

첫 번째 문제인 일률적 습관 추천과 맞춤화 부족에 대해서는 Rochester 대학의 Ryan, R. M.과 Deci, E. L.이 발표한 「Self-determination theory and the facilitation of intrinsic motivation, social development, and well-being」(2000)에서 해결의 실마리를 얻었다. 해당 연구에 따르면, 개인이 외부에서 주어진 목표가 아니라 자신의 가치관과 일치하는 내재적 동기에 따라 목표를 맞춤 설정할 때 만족감과 루틴 유지 비약적으로 상승하며, 일률적인 시스템보다 개인의 선택권과 맞춤화가 부여된 환경에서 습관 형성 속도가 빠르다. 이에 기반하여 HABITS는 자체 성격 테스트를 통해 사용자의 현재 성향과 이상적으로 어기는 모습을 파악함으로써 내재적 동기를 진단하고, 사용자가 원하는 성격 특성을 해시태그로 선택하여 입력받아 해당 특성을 강화할 수 있는 습관을 추천하는 시스템을 설계하였다.

### JITAI 모델 기반 감정-습관 통합 관리 시스템

두 번째 문제인 감정과 습관 이행률의 관련성 간과에 대해서는 Nahum-Shani, I. 등의 연구 「Just-in-Time Adaptive Interventions (JITAIs) in Mobile Health: Key Components and Design Principles for Ongoing Health Behavior Support」(2018)를 참조하였다. 해당 연구는 모두에게 동일한 알림을 보내는 기존 방식과 달리, 개인의 실시간 데이터에 기반해 '지금 이 순간 필요한' 맞춤형 선택지를 제공할 때 목표 달성이 유의미하게 높다는 점을 밝히고 있다. 이를 바탕으로 HABITS는 일기 쓰기를 통해 감정 데이터를 입력받아 사용자의 감정 상태를 파악하고, 습관 이행 기록과 감정 데이터를 교차 분석하여 감정 상태와 습관 이행률 간의 관계를 진단한 뒤, 해당 관계의 양상에 따라 습관의 상향 혹은 하향 조정하거나 습관의 종류를 변경할 것을 제안하는 통합 관리 시스템을 구축하였다.

### 맞춤형 피드백 이론에 기반한 데이터 기반 AI 피드백 시스템

세 번째 문제인 초기 동기 상실과 낮은 서비스 지속률에 대해서는 네덜란드의 Dijkstra, A.와 De Vries, H.의 연구 「Personalized Persuasion: Tailoring Digital Health Interventions to User Characteristics」를 참조하였다. 해당 연구에 따르면, 금연이나 운동 습관 형성 시 일반적인 조언을 제공하는 것보다 사용자의 변화 단계에 맞춘 메시지를 전달했을 때 사기 저하가 훨씬 적고, 실제 행동 변화로 이어지는 비율이 2배에서 3배 높게 나타난다. 이에 기반하여 HABITS는 주간 이행률과 감정 상태 추이 데이터를 수집하고, 수집한 데이터를 교차 분석하여 사용자의 패턴을 파악한 뒤, 감정-이행률 상관관계, 변화 추세, 취약 시점 등 파악된 패턴을 기반으로 현재 상태에 맞는 구체적인 피드백을 제공한다.

<br>

## 1.3. 기존 서비스와의 비교

HABITS의 차별점을 명확히 하기 위해, 현재 시장에서 널리 사용되는 습관 관리 서비스 2개를 선정하여 비교 분석을 수행하였다.

### 다른 서비스와의 비교

**루티너리(Routinery)**는 2020년 국내에서 출시된 습관 및 루틴 관리 앱으로, 전 세계 500만 명 이상의 사용자를 확보하고 있다. 루티너리의 핵심 강점은 타이머 기반의 순차적 루틴 실행에 있으며, 사용자가 사전에 설정한 루틴을 음성 안내와 자동 타이머로 안내하여 인지 부하를 줄이고 실행력을 높이는 데 특화되어 있다. 그러나 사용자의 심리적 성향을 사전 진단하는 기능이 없으며, 습관의 추천 자체보다는 사용자가 직접 등록한 루틴의 실행 보조에 초점이 맞춰져 있다. 감정 분석이나 AI 기반 피드백 기능은 제공하지 않는다.

**Fabulous**는 Duke University 행동경제학 연구소에서 인큐베이팅된 글로벌 셀프케어 코칭 앱으로, 전 세계 3,700만 명 이상의 사용자를 보유하고 있다. 행동과학에 기반한 단계적 습관 형성(Journey 시스템)과 오디오 코칭, 마음챙김 명상, 감사 저널 등 종합적인 웰빙 도구를 제공하며, 최근에는 AI를 활용한 적응형 프롬프트 기능도 일부 탑재하고 있다. 다만 Fabulous 역시 사용자 개인의 성격적 특성을 사전 진단하는 기능을 포함하지 않으며, 감정 분석을 위한 별도의 NLP 모델을 적용하지 않는다.

### HABITS의 핵심 차별화 포인트

위 두 서비스와의 비교를 통해 HABITS의 차별화 포인트는 크게 세 가지로 정리된다.

**첫째, 성격 진단에 기반한 근본적 수준의 맞춤화이다.** 루티너리와 Fabulous 모두 사용자의 심리적 성향을 사전 진단하는 기능을 제공하지 않는 반면, HABITS는 행동심리학에 기반한 자체 성격 유형 분류 체계를 설계하고, 사용자가 '현재의 나'와 '이상적인 나' 사이의 간극을 인식한 뒤 그 간극을 줄일 수 있는 습관을 추천받는 구조를 갖추고 있다.

**둘째, 감정과 습관 이행률의 직접적인 교차 분석이다.** Fabulous는 감사 저널이나 명상 등 감정과 관련된 도구를 제공하지만, 해당 데이터를 습관 이행 실적과 연계하여 분석하는 기능은 갖추고 있지 않다. HABITS는 KoELECTRA 모델을 활용해 사용자의 일기 텍스트에서 감정을 정량적으로 추출하고, 이를 습관 이행률과 교차 분석하여 감정 상태에 따른 습관 강도 조정을 자동으로 제안한다.

**셋째, 실제 행동 데이터와 감정 데이터를 종합 분석한 맞춤형 AI 코칭 피드백이다.** 루티너리는 연속 성공일과 활일별 달성률 등 정량적 통계를 제공하고, Fabulous는 오디오 코칭 시리즈를 통해 동기를 부여하지만, 사용자 고유의 행동 패턴과 감정 추이를 분석하여 개인화된 텍스트 코칭 리포트를 생성하는 서비스는 현 시점에서 HABITS가 유일하다. HABITS는 비용 효율성을 확보하기 위해 Gemini API를 활용한 동적 메시지와 로컬 폴백 기반의 정적 메시지를 결합한 하이브리드 구조를 채택하였다.

<br>

## 1.4. 제안 내용

### 솔루션과 핵심 기능

앞서 정의한 세 가지 문제에 대하여 HABITS가 제안하는 솔루션과 그 핵심 기능을 요약하면 다음과 같다.

첫 번째 문제인 일률적 습관 추천과 맞춤화 부족에 대해서는 사용자 맞춤 습관 추천 시스템을 제안한다. 자체 성격 유형 테스트로 사용자의 현재 성향과 이상적 성향을 도출하고, 선택한 해시태그와 입력한 일상 루틴을 바탕으로 Google Gemini API가 300개 습관 템플릿 후보 중에서 사용자의 일정과 성향에 최적화된 습관을 선별하여 time\_slot(기상 직후, 통근 중, 업무 전 등)을 매핑해 추천한다.

두 번째 문제인 감정과 습관 이행률 관련성 간과에 대해서는 감정-습관 통합 관리 시스템을 제안한다. HuggingFace의 KoELECTRA 감정 분석 모델과 이행률 교차 분석 로직을 핵심 기술로 활용한다. 5개 이행률 구간과 4개 감정 valence로 구성된 5×4 진단 매트릭스를 통해 각 기간의 감정-이행률 상태를 20개 셀 중 하나로 분류하고, 3가지 예외 패턴(역전, 변동성, 복합감정) 감지 로직을 통해 현재 사용자 상태에 맞는 맞춤형 코칭 메시지를 생성한다.

세 번째 문제인 초기 동기 상실과 낮은 지속률에 대해서는 데이터 기반 AI 피드백 시스템을 제안한다. Google Gemini Flash API와 로컬 폴백을 결합한 하이브리드 구조를 핵심 기술로 활용한다. 이 세 가지 솔루션은 독립적으로 작동하는 것이 아니라, 진단(성격 테스트) 이후 제안(맞춤 습관 추천), 실행(일별 이행 기록 및 감정 일기), 피드백(AI 교차 분석 리포트)이라는 순환 구조 안에서 유기적으로 연결된다.

### 담당 교수 리뷰 미팅 후 개선 사항

그로쓰 과목 담당 교수인 유광현 교수님과의 리뷰 미팅을 진행하며 여러 부분에 대한 피드백을 받았으며, 해당 내용들을 반영해 과제의 방향성과 세부 사항을 수정했다.

**피드백 1: 과제 제목이 타겟 커스터머와 Pain Point를 더 명확히 반영하도록 수정할 것을 제안**

프로젝트의 기존 제목을 '어떤 습관과 습관 형성 방식이 나에게 맞는지 확신이 없는 젊은 층을 위한 성격 분석 기반 맞춤 습관 추천과 감정 분석-습관 이행률 AI 교차 분석을 통해 원하는 성격 특성을 지속적으로 강화해나가는 습관 코칭 서비스'로 수정하여 목표 사용자와 문제점, 해결책을 더욱 명확히 보일 수 있도록 하였다.

**피드백 2: 논리적-객관적 근거를 통하여 문제점과 해결책의 개연성을 확보할 것을 제안**

이를 반영하여 자기결정이론(SDT), JITAI, Dijkstra & De Vries 연구 등 행동심리학 분야의 학술 논문을 조사하여 각 해결책의 개연성을 확보하였다.

**피드백 3: 세부 기능에 대한 충분한 설명이 부족하므로 보충할 것을 제안**

위와 같은 피드백을 반영하여 과제 수행 계획 발표 자료에서 세부 기능 페이지를 추가하는 방향으로 수정하였다.

<br>

## 1.5. 기대 효과 및 의의

HABITS가 성공적으로 구현될 경우 기대할 수 있는 효과는 다음과 같다. 우선, 내재적 동기에 기반한 맞춤 습관 추천과 감정 상태를 고려한 적응형 코칭을 통해 기존 습관 앱 대비 30일 이상 지속 사용률을 유의미하게 높이는 것을 1차 목표로 설정하고 있다. 또한 사용자가 자신의 감정 패턴과 습관 이행률 간의 상관관계를 구체적인 데이터와 리포트를 통해 확인함으로써, 서비스가 단순한 습관 기록 도구를 넘어 자기 이해의 도구로 기능할 수 있을 것으로 기대된다. 아울러, 이행률이 저조한 시기에 질책 대신 공감과 대안을 제시하는 피드백 구조를 통해 사용자가 '실패'를 '조정'으로 인식하게 만들어, 서비스 이탈률을 낮추고 장기적인 행동 변화를 유도하는 것을 목표로 한다.

본 프로젝트는 습관 형성 서비스에 행동심리학 이론(자기결정이론, JITAI)을 체계적으로 적용하고, NLP 기반 감정 분석과 생성형 AI 피드백을 결합하여 사용자의 정서적 맥락까지 고려하는 통합형 코칭 시스템을 제안한다는 점에서 의의가 있다. 특히 기존의 '행동 추적 중심' 습관 앱과 달리, '자기 이해 중심'의 접근을 채택함으로써 디지털 웰니스 시장에서 새로운 서비스 방향성을 제시한다. 또한 Gemini API와 로컬 폴백을 결합한 하이브리드 피드백 생성 구조는, 학생 프로젝트 수준에서 상용 LLM API의 비용과 속도 문제를 실무적으로 해결하는 접근으로서 엔지니어링적 의의 역시 갖는다.

<br>

## 1.6. 주요 기능 리스트

HABITS의 전체 기능을 서비스 흐름에 따라 리스트업하면 다음과 같다.

### A. 온보딩 프로세스

[그림 1. 온보딩 전체 플로우]
① 서비스 시작 및 환영 화면 &nbsp; ② 성격 테스트 영역 안내 (현재의 나 / 이상적인 나) &nbsp; ③ 30문항 성격 테스트 진행 &nbsp; ④ 현재 유형·이상적 유형 결과 도출 및 해시태그 선택

- **A-1. 성격 유형 테스트**: 자기결정론 기반 문항 응답을 통해 사용자의 현재 성격 유형과 사용자가 생각하는 이상적인 성격 유형 총 2가지를 도출한다.
- **A-2. 성격 특성 해시태그 선택**: 각 유형에 할당된 4개에서 5개의 해시태그 중 강화하고 싶은 특성을 복수 선택한다.
- **A-3. 일상 루틴 입력**: 통근, 식사, 수업/업무 시간 등 일상 시간대 정보를 입력받아 추천 맥락 데이터로 활용한다.
- **A-4. 맞춤 습관 추천**: 선택한 해시태그와 입력한 루틴을 기반으로, 300개 습관 템플릿에서 Gemini API가 time\_slot을 매핑하여 적합도순으로 정렬된 추천 목록을 제시한다.
- **A-5. 습관 일정 설정**: 일상 패턴을 반영한 반복 요일 및 시각을 자동 제안하며, 사용자가 수동으로 조절할 수 있다.

### B. 습관 이행 관리

[그림 2. 홈 화면 구조]
① 주차 달력 네비게이션 &nbsp; ② 오늘의 습관 체크리스트 (픽토그램 아이콘 포함) &nbsp; ③ 이번 주 달성률 프로그레스 바 &nbsp; ④ 감정 일기 바로가기 버튼

- **B-1. 일별 습관 체크리스트**: 설정된 습관 일정에 따라 체크리스트를 자동 생성하고, 당일 이행 현황을 기록한다. 수동으로 완료 이행 체크도 가능하도록 구현되어 있으며, 오늘 이후 날짜의 습관도 토글 형태로 미리 체크할 수 있다.
- **B-2. 주간/월간 이행률 요약**: 전체 달성률을 자동 집계하여 피드백 탭에 표시한다.

### C. 감정 일기

[그림 3. 감정 일기 작성 화면]
① 기분 점수 슬라이더 (0~100) &nbsp; ② 감정 키워드 버튼 8종 (기쁨/평온/뿌듯/희망/슬픔/짜증/불안/피로) &nbsp; ③ 텍스트 일기 입력 영역 &nbsp; ④ KoELECTRA 분석 감정 표시

- **C-1. 감정 슬라이더 입력**: 기본 점수를 수치화하여 간편 기록한다.
- **C-2. 감정 버튼 선택**: 긍정적 키워드인 기쁨, 평온, 뿌듯, 희망과 부정적 키워드인 슬픔, 짜증, 불안, 피로 총 8개로 감정을 분류하여 키워드 버튼의 형식으로 제공함으로써 사용자가 빠르게 기록한다.
- **C-3. 텍스트 일기 작성**: 선택적으로 감정 일기를 텍스트로 기록한다.
- **C-4. KoELECTRA 감정 분석**: 텍스트에서 감정별 확률 분포를 산출하고 DB에 저장한다.

### D. 피드백 페이지

[그림 4. 피드백 보기 화면]
① 달성도 탭 (주/월/올해 달성률 + 해시태그별 달성률) &nbsp; ② 감정 분석 탭 (감정 변화 추이 그래프 + 상관관계 메시지) &nbsp; ③ 일기 탭 (이모티콘 기반 일기 목록) &nbsp; ④ 사용자 선택 감정 vs. KoELECTRA 분석 감정 색 테두리 구분

- **D-1. 달성도 탭**: 주/월/올해 전체 달성률과 사용자가 선택한 해시태그별 달성률을 제공하고, 구간별 프로그레시브 메시지를 제공한다.
- **D-2. 감정 분석 탭**: 감정 변화 추이 그래프와 감정-습관 이행률 상관관계 피드백 메시지를 제공한다.
- **D-3. 일기 탭**: 기본 점수별 이모티콘, 일기 모아보기, 기간별 필터링을 제공한다. 사용자가 감정 버튼으로 입력한 감정과 KoELECTRA 분석 감정을 색과 테두리를 통해 시각적으로 구분한다.

### E. AI 피드백 리포트

[그림 5. AI 피드백 리포트 화면]
① 리포트 카드 목록 (NEW 배지 포함) &nbsp; ② 진단 내용 및 핵심 키워드 칩 &nbsp; ③ 추천 행동 카드 (rest\_choice 선택 모달 포함) &nbsp; ④ 만족도 평가 버튼 (좋음/보통/나쁨)

- **E-1. 주/월간 리포트 생성**: Gemini Flash API와 로컬 폴백을 결합한 하이브리드 방식으로, 주간 리포트는 매주 일요일 22:00에, 월간 리포트는 매월 말일 22:00에 자동 생성된다. 수동 리포트 생성은 사용자 트리거 시 항상 재생성된다.
- **E-2. 감정-습관 이행률 교차 분석**: 상관관계, 변화 추세, 취약 시점 인사이트를 제공한다. 이행률 구간을 5개로, 감정 valence를 4개로 나누어 5×4 매핑 매트릭스를 형성해 기본 프레임으로 이용한다.
- **E-3. 습관 강도 조정 제안**: 이행률 30% 미만일 시 빈도 축소 또는 습관 변경, 90% 이상일 시 빈도 증가 또는 습관 추가 및 습관 졸업 안내를 제공한다.
- **E-4. 맞춤 코칭 메시지**: SDT 기반 페르소나의 공감적 피드백, 사용자 만족도 표기 피드백을 통해 리포트의 톤을 조정하고, 감정-습관 이행률 간의 추세 관련 메시지를 제공한다.

### F. 마이페이지

- **F-1. 일정 관리**: 일정 루틴 수정, 습관 요일/시간 재조정을 제공한다.
- **F-2. 해시태그 및 습관 변경**: 성격 특성 해시태그 재선택, 습관 교체를 제공한다.
- **F-3. 알림 설정**: 습관 알림 및 피드백 리포트 알림 설정을 제공한다.
- **F-4. 회원 탈퇴**: 데이터베이스에서의 CASCADE 삭제를 통해 계정과 모든 연관 데이터를 즉시 물리 삭제한다.

### G. 사용자 인증

- **G-1. 회원가입**: 아이디, 비밀번호를 입력받아 회원 가입을 처리한다.
- **G-2. 로그인 및 자동 로그인**: JWT 인증 방식을 사용한다.
- **G-3. 비밀번호 재설정**: Resend를 통해 사용자에게 이메일을 발송함으로써 비밀번호를 재설정한다.
- **G-4. 회원 탈퇴**: 데이터베이스에서의 CASCADE 삭제를 처리한다.

### H. 로컬-서버 동기화

- **H-1. Local-First 작성 및 수정**: 오프라인 상태에서도 어플리케이션의 일부 기능을 이용할 수 있도록 설계한다.
- **H-2. 양방향 동기화**: LWW(Last-Write-Wins) 방식을 통해 동일한 데이터에 대해 여러 번의 업데이트가 발생했을 때, 가장 최근의 타임스탬프를 가진 데이터를 최종값으로 채택하고 나머지는 버리는 방식을 사용한다. 체크 및 체크 해제 양방향 상태가 모두 서버에 동기화된다.
- **H-3. 다른 기기 로그인 시 자동 데이터 동기화**: 서버에 데이터를 백업하여 동기화를 진행한다.

### I. 만족도 평가 및 피드백 루프

- **I-1. 리포트 평가**: 사용자로부터 피드백 리포트에 대한 만족도 평가를 받을 수 있는 버튼을 제공한다.
- **I-2. 만족도 추이 그래프 제공**: 피드백 리포트 페이지에서 최근 90일간의 사용자 리포트 만족도 그래프를 제공한다.
- **I-3. 사용자 피드백의 다음 리포트 반영**: 사용자 평가는 다음에 생성되는 리포트의 톤과 Gemini 호출 여부 결정에 반영된다. 만족도 평균이 낮은 경우 Gemini를 통해 동적 메시지를 생성하도록 트리거되며, 높은 경우 감사 톤의 정적 문구를 추가한다.

<br>

## 1.7. 주요 기능의 엔진 및 설계

### 1.7.1. 인증 엔진 (계정·세션 관리)

회원가입, 로그인, 토큰 갱신, 비밀번호 재설정, 계정 삭제를 담당한다. 단일 라우터(`backend/app/routers/auth.py`, 8개 엔드포인트)가 외부 인터페이스이고, 실제 보안 로직은 4개 하위 모듈로 분리되어 있다.

**구성 모듈과 각 알고리즘**

| 모듈 | 역할 | 알고리즘 |
| --- | --- | --- |
| auth/password.py | 비밀번호 해싱·검증 | passlib.CryptContext(schemes=["bcrypt"], bcrypt\_\_rounds=12) - bcrypt cost 12. 1회 해시당 약 250ms (M1 기준) 대량 brute-force 방어. |
| auth/jwt\_handler.py | 토큰 발급·검증 | python-jose로 HS256 서명. \_create\_token(subject, token\_type, expires\_delta) 한 함수로 access/refresh/reset 토큰을 통합 생성하고 payload에 type 필드를 넣어 verify\_token(token, expected\_type)에서 타입 mismatch면 401. iat/exp 둘 다 UTC timezone-aware datetime. |
| auth/dependencies.py | FastAPI DI로 get\_current\_user 주입 | OAuth2PasswordBearer로 헤더에서 토큰 추출 후 verify\_token(\_, "access") 처리, user\_id로 DB 조회. is\_active=False면 403. |
| auth/schemas.py | Pydantic I/O 스키마 | EmailStr 검증, password: constr(min\_length=8) 등 입력 단계에서 도메인 규칙 강제. |

**토큰 정책**
- access: 15분 (ACCESS\_TOKEN\_EXPIRE\_MINUTES=15)
- refresh: 7일 (REFRESH\_TOKEN\_EXPIRE\_DAYS=7)
- password reset: 1시간 (PASSWORD\_RESET\_TOKEN\_EXPIRE\_HOURS=1)

**이메일 발송 (services/email.py)**
- Resend API의 /emails POST 호출. 비밀번호 재설정 메일에 `https://app.habits/reset?token={reset_jwt}` 삽입.
- API 키 미설정 시 dict 형태 stub 반환 (개발 환경 graceful fallback).

<br>

### 1.7.2. 감정 분석 엔진

일기 텍스트를 감정 분포(8 라벨)로 변환하여 리포트 집계까지의 연결을 담당한다. 모델 추론은 클라이언트가 호출하고, 결과는 sync를 통해 서버 EmotionAnalysis 테이블로 들어와 리포트가 사용한다.

학습 데이터(AI Hub 감성 대화 말뭉치)의 원본 라벨은 60개 이상이다. 이 중 우리가 다루는 의미 영역에 해당하는 약 35개를 LABEL\_REMAP 사전으로 8 클래스에 매핑한다.

```python
LABEL_REMAP = {
  # joy
  "기쁨":"joy","행복":"joy","신남":"joy","즐거움":"joy","흥분":"joy",
  # calm
  "평온":"calm","안도":"calm","차분":"calm","편안":"calm",
  # proud
  "자신감":"proud","뿌듯":"proud","성취":"proud","자랑":"proud",
  # hope
  "희망":"hope","기대":"hope","설렘":"hope",
  # sadness
  "슬픔":"sadness","우울":"sadness","외로움":"sadness","공허":"sadness","비참":"sadness",
  # anger
  "분노":"anger","짜증":"anger","억겨움":"anger","분개":"anger","혐오":"anger",
  # anxiety
  "불안":"anxiety","공포":"anxiety","걱정":"anxiety","초조":"anxiety","긴장":"anxiety",
  # fatigue
  "피로":"fatigue","지침":"fatigue","탈진":"fatigue","권태":"fatigue",
}
```

**emotions\_tied 처리 (신규)**

KoELECTRA 추론 결과에서 top-1과 top-2 감정의 confidence 차이가 EMOTION\_TIE\_MARGIN(0.05) 이하인 경우, `emotions_tied=True` 플래그를 설정한다. 이 플래그가 활성화되면 `build_diagnosis()`에서 보조 감정을 키워드에 추가하고, Gemini 리포트 생성 시 tie-rule 지침을 프롬프트에 동적 삽입하여 두 감정을 모두 반영한 균형 있는 진단 문구를 생성한다.

**구성 모듈과 각 알고리즘**

| 모듈 | 역할 | 알고리즘 |
| --- | --- | --- |
| frontend/src/services/emotionAnalysis.ts | HF Inference API 클라이언트 | analyzeEmotion(text, moodScore) - fetch POST. 키 미설정·네트워크 오류·HTTP 비-2xx 모든 케이스에서 `{tags:[], scores:{}, sentiment: moodScore}` 반환 (graceful fallback). |
| monologg/koelectra-base-v3-discriminator (외부 모델) | 한국어 감정 분류 | 8개 라벨(joy/calm/proud/hope/sadness/anger/anxiety/fatigue) 로짓 softmax 처리 후 confidence 분포 반환. |
| backend/app/feedback/keywords.py | 모델 보조 신호 | score\_text\_by\_keywords(text) - 8 라벨 × 30개 이상 키워드 사전. 긴 키워드 우선 매칭. merge\_with\_model\_distribution(model\_dist, text, model\_weight=0.7) 처리 - 모델 70% + 키워드 30% 가중 평균. KoELECTRA confidence가 낮을 때 키워드가 보완 신호. |
| backend/app/models/emotion.py (EmotionAnalysis) | 분석 결과 영속화 | (diary\_id, main\_emotion, confidence, distribution(JSON), analyzed\_at). diary와 1대1 관계. |
| backend/app/sync/router.py::\_upsert\_emotion\_analysis | 클라이언트 결과를 서버에 저장 | /sync/push의 diary item에 emotion\_analysis 첨부 시 서버에서 diary upsert 직후 db.flush()로 id 확보 후 EmotionAnalysis upsert. |

**데이터 흐름**
```
[Diary 작성] (textContent)
  analyzeEmotion(text, moodScore)          # 클라이언트
  KoELECTRA via HF Inference API           # 외부
  DiaryEntry.emotionAnalysis 저장 (zustand+AsyncStorage)
  schedulePush(5s debounce)                # 클라이언트
  POST /sync/push (diary + emotion_analysis)
  _upsert_emotion_analysis()               # 백엔드
  EmotionAnalysis 테이블 저장
  리포트 생성 시 aggregate_period()가 distribution 평균 산출
```

<br>

### 1.7.3. AI 피드백 리포트 엔진

가장 모듈 의존성이 깊은 기능이다. 파이프라인은 9개 모듈을 순서대로 통과한다.

**구성 모듈과 각 알고리즘**

| 단계 | 모듈 | 알고리즘/입출력 |
| --- | --- | --- |
| 1. 데이터 충분성 검사 | analytics/conditions.py | is\_weekly\_data\_sufficient() - 기간 내 활성 습관 수 1개 이상, 일기 수 3개 이상, expected\_count 3개 이상 모두 충족 시 True. 미충족 시 리포트 생성 자체 skip. |
| 2. 기간 집계 | analytics/aggregation.py::aggregate\_period | \_is\_habit\_due\_on(habit, day) - frequency가 daily/weekdays/weekends/{type:"custom",days:[...]}에 따라 해당 일자 예정 여부 판정. expected/completed 카운팅 후 completion\_rate = completed/expected. mood: 일별 다일기 평균을 시계열 mood\_scores: list[float]로. emotion: EmotionAnalysis.distribution을 누적 합산 후 합으로 정규화. 결과: PeriodAggregate 데이터클래스 (10개 필드). |
| 3. 만족도 회수 | feedback/satisfaction.py::get\_recent\_satisfaction | FeedbackRating에서 최근 30일 평가 조회. \_RATING\_SCORE = {good:1, neutral:0, bad:-1} 매핑 후 평균. is\_low = avg < LOW\_SATISFACTION\_THRESHOLD(-0.3). dominant\_rating은 단순 최빈값. |
| 4. 예외 패턴 감지 | feedback/exceptions.py::detect\_exceptions | 3개 sub-검출기 OR 연산. (a) 역전: rate 0.80 이상 AND neg 0.50 이상 또는 rate 0.30 이하 AND pos 0.70 이상. (b) 변동성: statistics.stdev(mood\_scores) > 0.40 (데이터 4개 이상일 때만). (c) 복합: confidence 0.20 이상 감정 3개 이상. 결과: ExceptionDetection(triggered, reasons[], detail{}). |
| 5. 범주화 | feedback/diagnosis.py::categorize\_period\_data() | 4개 범주 + 추세. rate 5구간(0.20/0.40/0.60/0.80 경계), valence 4구간(pos-neg 차가 0.15 미만이고 둘 다 0.15 초과면 mixed), variance 3구간(0.20/0.40), mood 5구간, trend(이전 리포트 대비 ±0.10). emotions\_tied 플래그도 이 단계에서 설정. 결과: PeriodCategory. |
| 6. 진단 매핑 | feedback/diagnosis.py::build\_diagnosis() | \_DIAGNOSIS\_MATRIX (5×4=20셀, 각 셀이 label·detail\_template·keywords)를 범주를 키로 즉시 결정적 lookup. 추세가 declining/improving이면 detail에 한 문장 추가, variance가 volatile이면 키워드 "기복" 추가. emotions\_tied=True 시 보조 감정 키워드 추가. |
| 7a. 진단 풍부화 | services/gemini.py::enrich\_diagnosis() | Gemini 2.5 Flash REST. category\_summary(JSON)와 static\_label/static\_detail을 프롬프트에 동봉, 핵심 메시지는 유지하되 표현만 풍부화하라고 지시. temperature 0.7, topP 0.9, maxOutputTokens 250. 실패·미설정 시 None 반환 후 정적 detail 그대로. |
| 7b. 품질 검사 | feedback/quality.py::check\_gemini\_output | 정규식·substring 기반 자동 검사. 길이(20~250자), 금지 표현(해야 합니다/반드시/꼭/주시), 인과 단정(때문에/로 인해), 이모지 카운트(r'[\U0001F300-...]'). passed = score 0.7 이상 AND 금지표현 없음 AND 인과단정 없음. 통과 시 detail 교체, 실패 시 static\_fallback. |
| 8. 줄글 리포트 생성 | feedback/narrative.py::build\_narrative() | 4문단 결정적 빌더. (1) 행동: expected/completed/rate. (2) 감정: top1·top2를 한국어 라벨로 자연어화. (3) 패턴: exc.reasons에 따라 분기 5종(역전·변동성·복합·긍정안정·부정저조). (4) 미달 습관: \_find\_lowest\_completion\_habit\_info()가 반환한 가장 낮은 이행률 습관(30% 이하면 노출). (5) 만족도 톤: avg 값이 -0.3 이하면 공감 한 줄, 0.3 이상이면 감사 한 줄. recommendation은 bucket+valence+exc 조합으로 rest\_choice/reduce\_frequency/null 결정 후 target\_habit\_id 주입. |
| 9. 본문 동적 생성 (조건부) | services/gemini.py::generate\_feedback() | trigger: exc.triggered OR selection.needs\_dynamic OR satisfaction.is\_low. 프롬프트에 '톤 가이드' 섹션 동적 삽입 (만족도 hint). 풍질 통과 시 full\_text 교체, paragraphs는 단일 문단으로 대체. |

**추천 행동 분기 구조 (rest\_choice 도입)**

| 상황 | 추천 kind | 의미 |
| --- | --- | --- |
| 이행률 높음 + 감정 부정 (역전 패턴) | rest\_choice | 사용자에게 휴식 습관 추가 또는 현재 습관 교체 중 선택을 위임 |
| 이행률 낮음 | reduce\_frequency | 습관 빈도 축소 제안 |
| 이행률 90% 이상, 감정 긍정 4주 이상 | 졸업 판정 후 add\_habit | 졸업 플로우 전용 신규 습관 추천 |
| 그 외 | null | 추천 행동 없음 |

`add_habit`은 리포트 내 일반 추천 분기에서 제거되었으며, 반드시 4주 이상 90% 이상 + 긍정 감정 50% 이상의 졸업 판정을 통과한 경우에만 PostGraduationRecommendModal을 통해 제안된다.

<br>

### 1.7.4. 동기화 엔진

오프라인에서 쓰면 온라인에서 백업하고 이후에 합친다. 충돌은 LWW(Last-Write-Wins)로 해결한다.

**구성 모듈과 각 알고리즘**

| 모듈 | 담당 | 알고리즘 |
| --- | --- | --- |
| frontend/src/services/sync.ts | 클라이언트 sync 매니저 | pullSync() - since 쿼리에 last sync time 전달 후 서버 변경분만 회수 후 habits/diaries/emotion\_analyses를 zustand의 upsertHabits/upsertDiaries로 머지. pushSync() - 전체 로컬 상태를 서버로 전송. schedulePush(5000ms) - debounce, 연속 변경을 1회 push로 묶음. 습관 이행 true/false 양방향 상태 모두 서버로 전송. |
| backend/app/sync/router.py | 서버 sync 엔드포인트 | \_to\_utc(dt)로 timezone-naive를 UTC로 정규화 후 \_is\_server\_newer(server, client) 비교. server가 더 최신이면 SyncConflict 반환·client 변경 폐기. push 처리 순서: habits flush() 후 habit\_logs (FK 참조 위해), 이후 diaries, personality, schedule. |
| backend/app/sync/schemas.py | sync I/O Pydantic | 모든 sync target에 공통: client\_id: str(UUID), updated\_at: datetime, deleted\_at: Optional[datetime]. tombstone 패턴. |
| 모든 sync target 모델 (Habit, Diary, PersonalityResult, Schedule, HabitLog) | DB 스키마 | client\_id UNIQUE per user, updated\_at(LWW 키), deleted\_at(soft delete). 외래키 cascade ondelete + passive\_deletes=True. |

**LWW 알고리즘 의사 코드**
```python
def lww_apply(server_row, client_row):
  if server_row is None:
    insert(client_row); return None          # 없으면 신규
  if _is_server_newer(server_row.updated_at, client_row.updated_at):
    return SyncConflict(...)                 # 서버가 이김
  overwrite(server_row, client_row)          # 클라이언트가 이김
  return None
```

**습관 이행 true/false 양방향 동기화**

이전 구현에서는 `toggleHabitCompletion` 실행 시 이행 취소 상태(false)를 `delete` 연산으로 처리하여 로컬 기록 자체가 사라졌고, 이로 인해 서버에 미이행 상태가 전달되지 않는 버그가 있었다. 수정 후에는 `history[dateString] = !history[dateString]`으로 명시적 false를 기록하고, pushSync에서 true/false 양방향 completionHistory를 모두 전송한다. 서버에서도 false 값을 보존하여 실제 이행 취소 이력이 리포트 집계에 정확히 반영된다.

<br>

### 1.7.5. 추천 엔진

리포트의 "추천 행동" 라벨을 만드는 통계적 추천(narrative.py)과, 온보딩 시 새 습관을 제안하는 Gemini 개인화 추천(/api/v1/recommendations/personalized)이 분리되어 있다.

**구성 모듈과 각 알고리즘**

| 모듈 | 알고리즘 |
| --- | --- |
| services/gemini.py::recommend\_habits\_personalized | 사용자의 일상 일정(기상/취침/점심/통근/업무 시간대), 직업, 선택한 해시태그, 후보 습관 템플릿 목록을 입력받아 Gemini가 각 템플릿에 time\_slot(morning/afternoon/evening/anytime)을 매핑하고 일정과의 충돌을 검사하여 요청된 수량만큼 정렬해 반환한다. |
| routers/recommendations.py | /api/v1/recommendations/personalized POST - PersonalizedRecommendRequest(schedule, occupation, selected\_hashtags, candidates, count)를 받아 Gemini 추천 호출. /api/v1/recommendations/interaction POST - 추천 노출·수락·거절·완료 행동을 RecommendationLog에 기록 (CTR·이행률 메트릭 산출용). |
| models/recommendation.py::RecommendationLog | 추천 노출·수락·거절 로그. action enum: recommended / accepted / rejected / completed. CTR = accepted / recommended, 이행률 = completed / accepted. |
| feedback/narrative.py | bucket(low/mid/high) × valence(긍정/부정/혼합) × exc.reasons 매핑으로 rest\_choice/reduce\_frequency/null 결정. target\_habit\_id (lowest completion habit의 client\_id) 동봉 - 프론트가 어떤 habit을 수정창에 prefill할지 결정. |

온보딩 시 프론트엔드는 300개 습관 템플릿 전체를 후보로 서버에 전달하고, 서버는 Gemini를 통해 사용자 일정과 해시태그에 최적화된 N개를 time\_slot 매핑과 함께 반환한다. 카테고리별 시간대 그룹화는 제거되었으며, 사용자는 Gemini가 정렬한 순서대로 추천 목록을 단일 리스트로 확인한다.

**추천 메트릭 API**

```
GET /api/v1/recommendations/metrics?days=30
응답: {
  period_days, recommended, accepted, rejected, completed,
  ctr,                              # accepted / recommended
  post_acceptance_completion_rate   # completed / accepted
}
```

<br>

### 1.7.6. JITAI (Just-In-Time Adaptive Intervention)

스케줄·이행 상태에 맞춰 푸시 알림 timing을 결정하는 엔진이다. V1 시점에서는 알림 인프라(FCM)가 미연결이지만 timing 결정 로직은 백엔드에 구현되어 있다.

- `routers/jitai.py`: `/api/v1/jitai/next-window?user_id` - 다음 window를 반환한다.
- 의존: `models/schedule.py::Schedule`(wake/bed/lunch/work/commute 시간) + `Habit.time_slot`(morning/afternoon/evening/anytime).
- 알고리즘: time\_slot을 user의 schedule 윈도우와 교집합 처리 후 비어있는 30분 슬롯 first-fit 선택. 이미 완료된 habit은 skip.

<br>

### 1.7.7. 기분-습관 상관관계 분석 (신규)

단순 이행률 집계를 넘어, 특정 습관의 이행 여부와 그날의 기분 점수 사이의 통계적 상관관계를 분석하는 모듈이다.

**분석 원리**

60일 윈도우 내 날짜별 (habit\_completed: bool, mood\_score: float) 쌍을 수집한 뒤, 이행일 기분 평균과 미이행일 기분 평균을 33/66 백분위수 기준으로 분류한다. 두 그룹 간 차이가 25%p 이상인 경우 해당 습관과 기분 사이에 유의미한 상관관계가 있다고 판단한다.

| 분석 지표 | 내용 |
| --- | --- |
| 윈도우 | 최근 60일 |
| 완료/미완료 기분 분리 | 이행일 mood\_score 평균 vs. 미이행일 mood\_score 평균 |
| 임계값 | 두 그룹 차이 25%p 이상 시 '상관 있음' |
| 백분위 기준 | 33 / 66 백분위수 |
| 출력 | {habit\_id, correlation\_strength: high/moderate/low, direction: positive/negative/neutral, sample\_size} |

**활용**

피드백 보기의 감정 분석 탭에서 특정 습관을 이행한 날의 기분이 이행하지 않은 날보다 유의미하게 높거나 낮은 경우, "이 습관을 실천한 날의 기분이 평균보다 높아요" 형식의 인사이트 문구를 표시한다. 이 데이터는 향후 리포트 강도 조정 제안의 근거 데이터로도 활용된다.

<br>

## 1.8. 주요 기능의 구현

### 1.8.1. AI 리포트 생성 흐름 (자동 트리거 후 사용자 노출)

**Step 1. 스케줄러 발화**

- `services/scheduler.py::start_scheduler()`가 앱 부팅 시 BackgroundScheduler 인스턴스를 1회 생성하고 start를 호출한다.
- 일요일 22:00 KST에 `_job_weekly()` 호출 후 today에서 timedelta(days=today.weekday())로 이번 주 월요일 계산 후 `generate_weekly_reports_for_all(db, this_monday)` 위임.

**Step 2. 사용자별 루프**

- `report_generator.py::generate_weekly_reports_for_all()`가 User.is\_active=True 전체 조회 후 각 사용자에 대해 `generate_weekly_report_for_user(db, u.id, this_monday)` 호출. 예외는 사용자 단위로 catch (한 사용자 실패가 전체 배치를 막지 않게).
- `generate_weekly_report_for_user()`: `_has_existing_report()` 중복 체크 후 `_build_report_record()` 호출.

**Step 3. 본 빌더 `_build_report_record()`의 8단계 호출 체인**

```
1. is_weekly_data_sufficient(db, user_id, week_start)
   미충족이면 None 반환, 사용자 skip
2. agg = aggregate_period(db, user_id, week_start, week_end)
3. exc = detect_exceptions(rate, dist, mood_scores)
4. satisfaction = get_recent_satisfaction(db, user_id, 30)
5. previous = AIReport.query.filter(period_start<...).first()  # 추세용
6. cat, diagnosis = build_diagnosis(...)
7. enriched = enrich_diagnosis(...)
   quality.passed 이면 diagnosis.detail = enriched
8. narrative = build_narrative(... satisfaction_avg=...)
   exc.triggered 또는 selection.needs_dynamic 또는 satisfaction.is_low이면:
     gemini_msg = generate_feedback(... satisfaction_hint=...)
     check_gemini_output(gemini_msg).passed이면:
       full_text = gemini_msg
return AIReport(...)
```

**Step 4. 영속화·열람 추적**

- db.add(report), 사용자 루프 끝에 db.commit().
- AIReport.read\_at = NULL 상태로 저장 후 미열람 상태 유지.

**Step 5. 클라이언트 노출**

- HomeScreen.tsx의 useFocusEffect에서 getUnreadCount() 호출 후 헤더에 빨간 점과 숫자 배지 표시.
- ReportScreen.tsx가 listReports() 호출 후 카드 리스트에 NEW 배지를 표시한다.
- 카드 탭 시 selected = report로 모달을 열고, 동시에 markReportRead(id).then(load) 호출 후 AIReport.read\_at = now()로 업데이트.
- 모달 본문은 paragraphs[] 표시 후 diagnosis\_detail + keywords 칩, recommendation 카드, 만족도 평가 버튼 순으로 구성.

<br>

### 1.8.2. 만족도 평가 후 다음 리포트 피드백 루프

**Step 1. 사용자 평가**

- ReportScreen 모달 하단의 good/neutral/bad 버튼 탭 시 `services/feedback.ts::rateFeedback()` 호출.
- 백엔드 `routers/feedback.py::rate_feedback`가 FeedbackRating(user\_id, period\_type, period\_start, period\_end, rating, source, comment) 저장.

**Step 2. 다음 리포트 생성 시 영향 (3-way)**

1. **Gemini 호출 트리거**: `_build_report_record()`의 use\_gemini = exc.triggered 또는 selection["needs\_dynamic"] 또는 satisfaction.is\_low - 만족도가 -0.3 미만이면 정적 메시지 반복이 원인일 수 있다고 판단해 Gemini를 시도.
2. **Gemini 톤 가이드 주입**: satisfaction.is\_low면 hint = "사용자가 최근 N개 리포트 중 평균 X로 부정적 평가가... 더 공감적이고 구체적인 어조로". dominant\_rating == "good"이면 "긍정적 평가... 단조롭지 않게 새로운 관점 추가". `_build_prompt()`가 hint를 톤 가이드 섹션으로 동적 삽입.
3. **정적 narrative 톤 조정**: build\_narrative(... satisfaction\_avg=...)가 -0.3 미만이면 공감 한 줄, 0.3 초과이면 감사 한 줄을 paragraphs에 추가.

<br>

### 1.8.3. 일기 작성 후 감정 분석 처리 후 리포트 반영 흐름

**Step 1. 일기 저장 (클라이언트)**

- DiaryWriteScreen에서 textContent + moodScore 입력.
- useAppStore.addDiary({...}) 처리 후 zustand store 변경 후 persist 미들웨어가 AsyncStorage에 즉시 직렬화.

**Step 2. 감정 분석 호출**

- 같은 화면에서 analyzeEmotion(textContent, moodScore) 호출 후 HF Inference API로 KoELECTRA 추론.
- 응답 파싱 후 {mainEmotion, confidence, distribution, analyzedAt} 처리 후 useAppStore.updateDiaryEmotion(diaryId, ...) 후 다시 AsyncStorage 직렬화.

**Step 3. 백엔드 동기화**

- 작성 직후 schedulePush(5000) 트리거 후 5초 후 pushSync() 호출 후 `/api/v1/sync/push`.
- 페이로드에 diaries[i].emotion\_analysis 동봉 후 백엔드 `_lww_apply_diary()` 처리 후 db.flush() 후 `_upsert_emotion_analysis()` 처리 후 EmotionAnalysis 테이블에 (diary\_id, main\_emotion, confidence, distribution) 저장.

**Step 4. 리포트 생성에 활용**

- 다음 리포트 생성 시 `aggregate_period()`가 해당 기간 EmotionAnalysis.distribution을 누적·정규화 처리 후 agg.emotion\_distribution으로 집계.
- 이후 `categorize_period_data()`가 valence(positive\_dominant/negative\_dominant/mixed) 결정 후 diagnosis matrix 셀에서 라벨·detail·keywords 결정.

<br>

### 1.8.4. 다기기 동기화 흐름 (A기기 변경 후 B기기 머지)

**Step 1. A기기 변경**

- 사용자가 습관 빈도 수정 후 updateHabitFrequency(id, freq) 처리 후 store 변경 후 updatedAt = new Date().toISOString() 갱신.
- schedulePush(5000) 처리 후 pushSync() 처리 후 /sync/push.
- 서버 `_lww_apply_habit()`: 기존 행 발견 후 `_is_server_newer(server.updated_at, client.updated_at)` 비교 후 클라이언트가 더 최신이므로 overwrite.

**Step 2. B기기 fullSync**

- B기기가 포그라운드 진입 후 useFocusEffect로 pullSync() 트리거.
- lastSyncedAt 이전 변경분만 회수하기 위해 since=lastSyncedAt 쿼리.
- 서버는 Habit.updated\_at > since만 반환 후 변경된 habit 1건이 응답에 포함.
- 클라이언트 upsertHabits()가 id == client\_id로 매칭 후 같은 행 overwrite.
- setLastSyncedAt(server\_time)로 다음 since 갱신.

**Step 3. 충돌 시**

- A·B가 동시에 같은 habit 변경 후 늦게 push된 쪽이 server.updated\_at보다 client.updated\_at이 작아짐 후 `_is_server_newer` == True 후 서버가 SyncConflict 응답 후 클라이언트는 pullSync()로 서버 최신값 다시 받아 병합.

<br>

### 1.8.5. 401 만료 후 자동 갱신 흐름

**Step 1. access 토큰 만료**

- 임의 API 호출 후 401 응답.
- api.ts response interceptor가 catch.

**Step 2. race lock**

- 동시에 여러 401이 발생할 수 있어 `let refreshPromise: Promise<boolean> | null = null` 단일 promise 공유.
- 첫 401이 refreshTokens() 호출 후 나머지 401들은 같은 promise를 await.

**Step 3. refresh 호출**

- authSlice.refreshTokens() 처리 후 /auth/refresh (refreshToken 포함) 처리 후 새 access 발급 후 store에 set.
- verify\_token(token, "refresh")가 type 체크 후 access 토큰을 refresh로 사용 시도 같은 공격 차단.

**Step 4. 원본 요청 재시도**

- originalRequest.\_retry = true 마킹 (무한 루프 방지) 후 새 access 헤더 주입 후 api(originalRequest) 재호출.
- refresh 실패 시 clearAuth() 처리 후 로그아웃 화면으로 강제 이동.

<br>

### 1.8.6. rest\_choice 추천 흐름 (신규)

`rest_choice`는 감정-이행률 역전 패턴이 감지된 경우, 즉 습관 이행률은 높지만 감정 상태가 지속적으로 부정적인 상황에서 생성되는 추천 kind이다. 기존 `rest` 추천과 달리 사용자가 직접 다음 행동을 선택하도록 위임한다.

[그림 6. rest\_choice 추천 선택 모달]
① 리포트 카드 내 "오늘은 쉬어가는 것도 괜찮아요" 추천 카드 &nbsp; ② 선택 모달 - "휴식 습관 추가" 옵션 &nbsp; ③ 선택 모달 - "다른 습관으로 교체" 옵션 &nbsp; ④ 선택 후 AddHabitModal 또는 HabitEditModal로 전환

**Step 1. 백엔드: 추천 생성**

```
detect_exceptions()가 emotion_completion_inversion 감지
narrative.py::build_narrative()에서 recommendation = {
  kind: "rest_choice",
  options: [
    {action: "add_rest", label: "휴식 습관 추가"},
    {action: "swap_habit", label: "다른 습관으로 교체"}
  ],
  target_habit_id: <최저 이행률 습관 client_id>
}
```

**Step 2. 프론트엔드: 선택 모달 표시**

- ReportScreen의 `handleAcceptRecommendation`에서 recommendation.kind === "rest\_choice"인 경우 `setShowRestChoice(true)`로 선택 모달을 표시한다.
- 모달에는 두 개의 선택 카드가 표시된다: "휴식 습관 추가"와 "다른 습관으로 교체".

**Step 3. 사용자 선택 분기**

- `add_rest`를 선택한 경우: 휴식 관련 습관 템플릿이 prefill된 AddHabitModal을 표시한다. 정적 import로 HABIT\_TEMPLATES를 로드하여 렌더링 지연을 방지한다.
- `swap_habit`를 선택한 경우: target\_habit\_id에 해당하는 습관 정보가 prefill된 HabitEditModal을 표시한다.
- AddHabitModal 닫기 후 showAlert 호출 시 250ms setTimeout을 두어 중첩 모달 타이밍 충돌을 방지한다.

<br>

## 1.9. 기타

### 1.9.1. AI 활용 상세

#### A. KoELECTRA: 일기 감정 분류

| 항목 | 내용 |
| --- | --- |
| 베이스 모델 | monologg/koelectra-base-v3-discriminator (한국어 ELECTRA, ~110M 파라미터) |
| 파인튜닝 라벨 | 8 클래스: joy / calm / proud / hope / sadness / anger / anxiety / fatigue (POSITIVE 4 + NEGATIVE 4) |
| 배포 | HuggingFace Inference API (V1 무료 티어, cold start 시 약 20초 - services/emotionAnalysis.ts가 graceful fallback 처리) |
| 입력 | 일기 textContent (최대 약 500자) |
| 출력 | {tags:[], scores: {emotion: confidence}, sentiment: -1~1} |
| 보조 신호 | feedback/keywords.py의 키워드 사전 (8 라벨 × 30개 이상 표현, 구어체·신조어 포함). 모델 70% + 키워드 30% 가중평균으로 confidence 보정. |
| 활용 위치 | 클라이언트가 일기 작성 시점에 1회 호출 후 결과를 일기와 함께 sync. 서버는 추가 호출 없이 저장된 distribution을 리포트 집계에서 재사용. |
| emotions\_tied 처리 | top-1과 top-2 confidence 차이가 0.05 이하인 경우 emotions\_tied=True 플래그 설정. 진단 키워드에 보조 감정 추가, Gemini 프롬프트에 tie-rule 동적 삽입. |

#### B. Gemini 2.5 Flash: 동적 피드백 생성 및 개인화 추천

| 항목 | 내용 |
| --- | --- |
| 엔드포인트 | `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent` |
| 호출 위치 | services/gemini.py의 세 함수 - enrich\_diagnosis()(진단 detail 풍부화), generate\_feedback()(본문 줄글 동적 생성), recommend\_habits\_personalized()(온보딩 time\_slot 매핑) |
| generationConfig | temperature 0.7 (자연스러움과 일관성 균형), topP 0.9, maxOutputTokens 200~250 (긴 줄글 방지) |
| 호출 트리거 | exc.triggered (3 OR 패턴) 또는 selection["needs\_dynamic"] (감정 3개 이상 동시) 또는 satisfaction.is\_low (avg < -0.3) - 정적 템플릿이 약한 케이스에만 동적 생성 |
| 프롬프트 구조 | (1) 역할 선언 ("HABITS 앱의 피드백 작성 어시스턴트") (2) 규칙 5개 (관찰적 표현, 처방 X, SDT 자율성, 2~3문장, 이모지 1개 이내) (3) 동적 톤 가이드 (만족도 hint) (4) 데이터 (period\_label, rate%, KoELECTRA 분포 JSON, 예외 reasons) (5) 작성 지시 |
| 폴백 | API 키 미설정이면 None 반환. timeout 15초. requests 예외이면 None. 호출부에서 정적 narrative 그대로 사용. |
| 품질 검사 | feedback/quality.py::check\_gemini\_output() - 길이 20~250자, 금지 표현 8종(해야 합니다/반드시/꼭/주시…), 인과 단정 4종(때문에/로 인해/탓에/원인), 이모지 개수 2 이하. score = 1.0 - 패널티. 관찰적 표현 가산점. passed = score 0.7 이상 AND 금지표현 없음 AND 인과단정 없음. fail 시 static\_fallback으로 marker 남기고 정적 detail 사용. |

<br>

### 1.9.2. 인프라 배포

- **호스팅**: Oracle Cloud Always Free (서울 리전 ARM Ampere A1, 4 OCPU / 24GB RAM)
- **DB**: Supabase (PostgreSQL, Session Pooler 모드) - direct는 IPv6-only라 psycopg2가 hostname 해석 실패하므로 Pooler 사용
- **DNS·TLS**: DuckDNS + Caddy (자동 Let's Encrypt)
- **메일**: Resend (V1은 도메인 미인증 후 가입 이메일로만 발송 가능)
- **앱 상태**: 백엔드는 단일 워커(uvicorn --workers 1) - apscheduler 중복 실행 방지

<br>

### 1.9.3. 외부 라이브러리·버전

| 영역 | 라이브러리·버전 |
| --- | --- |
| 백엔드 웹 | FastAPI 0.104.1, uvicorn |
| ORM·마이그레이션 | SQLAlchemy 2.0.23, Alembic 1.12.1 |
| 인증 | passlib[bcrypt] 1.7.4 + bcrypt 4.0.1 (passlib 호환), python-jose[cryptography] |
| 스케줄러 | apscheduler 3.10.4, pytz |
| HTTP | requests (Gemini), axios |
| 프론트엔드 | React Native 0.84.1, TypeScript |
| 상태 관리 | zustand + persist + @react-native-async-storage/async-storage |
| 네비게이션 | @react-navigation/native, native-stack |
| 아이콘 | lucide-react-native (CategoryIcon 컴포넌트 - 카테고리별 픽토그램 매핑) |

<br>

### 1.9.4. 보안·프라이버시 관련

- **비밀번호**: bcrypt cost 12. SECRET\_KEY는 .env. JWT는 HS256 (V2에서 RS256 전환 검토).
- **Refresh 토큰**: 클라이언트에서 AsyncStorage(zustand persist의 partialize로 access는 메모리만, refresh만 디스크)에 보관 후 앱 재기동 후 자동 로그인.
- **일기 텍스트**: 외부 API(KoELECTRA on HF Inference)로 전송 후 V2에서 self-hosted KoELECTRA 컨테이너로 이전 검토 (개인정보 외부 전송 최소화).
- **계정 삭제**: DELETE /api/v1/auth/account 시 cascade로 모든 종속 테이블(habits, diaries, ai\_reports, emotion\_analyses, …) 즉시 물리 삭제.
- **DB 접근**: Supabase RLS 정책 잠금 + Session Pooler 전용 사용자 계정으로 최소 권한 원칙 적용.

<br>
<br>

# 2. 과제 설계

## 2.1. 요구사항 정의

### 기능적 요구사항

본 서비스의 요구사항은 서비스 흐름에 따라 온보딩, 습관 이행 관리, 감정 일기, 피드백, 마이페이지의 5개 도메인으로 나누며, 각 도메인별로 기능적 요구사항을 정의하였다. 우선순위는 서비스의 핵심 가치 제안과의 연관성 및 기술적 의존 관계를 고려하여 상(필요)·중(중요)·하(개선) 3단계로 분류하였다. 진척도는 최종 보고서 기준으로 업데이트하였다.

| ID | 도메인 | 요구사항 | 상세 설명 | 우선순위 | 최종 진척도 |
| --- | --- | --- | --- | --- | --- |
| FR-01 | 온보딩 | 성격 유형 진단 | 자기결정론 기반 문항 응답을 통해 사용자의 현재 성격 유형과 이상적 성격 유형 총 2가지를 도출한다. | 상 | 완료 |
| FR-02 | 온보딩 | 성격 특성 해시태그 선택 | 도출된 성격 유형에 할당된 해시태그 중 사용자가 강화를 희망하는 특성을 복수 선택할 수 있어야 한다. | 상 | 완료 |
| FR-03 | 온보딩 | 일상 루틴 입력 | 통근, 식사, 업무/수업 시간 등 사용자의 일상 시간대 정보를 입력받아 추천 맥락 데이터로 활용한다. | 상 | 완료 |
| FR-04 | 온보딩 | 맞춤 습관 추천 | 선택한 해시태그와 입력된 루틴을 기반으로, 300개 습관 템플릿에서 Gemini API가 time\_slot을 매핑하여 적합도순으로 정렬된 추천 목록을 제시한다. | 상 | 완료 |
| FR-05 | 온보딩 | 습관 일정 설정 | 사용자의 일상 패턴을 반영한 반복 요일 및 시각을 자동 제안하며, 사용자가 수동으로 조절할 수 있어야 한다. | 상 | 완료 |
| FR-06 | 습관 관리 | 일별 이행 기록 | 설정된 습관 일정에 따라 체크리스트를 자동 생성하고, 사용자의 당일 이행 현황을 기록한다. 이행 및 이행 취소 양방향 상태가 서버에 동기화된다. | 상 | 완료 |
| FR-07 | 습관 관리 | 이행률 집계 | 주간/월간/올해 단위로 전체 해시태그별 습관 달성률을 자동 산출하여 요약 제공한다. | 상 | 완료 |
| FR-08 | 감정 일기 | 감편 감정 입력 | 기본 점수 슬라이더(0~100)와 감정 키워드 버튼(기쁨/평온/뿌듯/희망/슬픔/짜증/불안/피로 총 8개)을 통해 감정을 간편하게 기록할 수 있어야 한다. | 상 | 완료 |
| FR-09 | 감정 일기 | 텍스트 일기 및 감정 분석 | 사용자가 선택적으로 작성한 텍스트 일기를 KoELECTRA 모델에 입력하여, 감정 라벨 및 확률 분포를 산출하고 DB에 저장한다. 키워드 사전과의 하이브리드 가중 평균(모델 70% + 키워드 30%)으로 정확도를 보완한다. | 상 | 완료 |
| FR-10 | 피드백 | 달성률 피드백 | 달성률 구간(목표: 10% 단위)에 따라 로컬 폴백 기반의 프로그레시브 메시지를 제공한다. | 중 | 완료 |
| FR-11 | 피드백 | 감정-이행률 교차 분석 피드백 | 감정 분석 결과와 습관 이행률을 교차 분석하여, 감정 변화 추이 그래프 및 상관관계 기반 피드백 메시지를 생성한다. | 중 | 완료 |
| FR-12 | 피드백 | AI 피드백 리포트 생성 | Gemini Flash API(동적)와 로컬 폴백(정적)을 결합한 하이브리드 방식으로, 주/월간 개인화 피드백 리포트를 생성한다. 주간은 매주 일요일 22:00, 월간은 매월 말일 22:00에 자동 생성된다. | 중 | 완료 |
| FR-13 | 피드백 | 습관 강도 자동 조정 제안 | 이행률 30% 미만 시 빈도 축소/습관 변경, 90% 이상 시 빈도 증가/습관 추가/습관 졸업 안내를 자동으로 제안한다. 역전 패턴 감지 시 rest\_choice(add\_rest / swap\_habit 사용자 선택) 제안. | 중 | 완료 |
| FR-14 | 피드백 | 일정 및 습관 관리 | 일상 루틴 수정, 해시태그 재선택, 습관 교체 시 변경 사항이 체크리스트 및 추천 로직에 정상 반영되어야 한다. | 중 | 완료 |
| FR-15 | 피드백 | 알림 설정 | 습관 수행 알림 및 피드백 리포트 도착 알림의 시간·빈도를 사용자가 설정할 수 있어야 한다. | 하 | 부분 구현 (FCM 인프라 준비 완료, 알림 발송 연동 미완) |

### 비기능적 요구사항

비기능적 요구사항으로는 API 응답 시간 2초 이내의 응답 속도, Gemini API 호출 최소화를 위한 로컬 폴백 우선 구조의 비용 효율성, 동적 생성 메시지와 정적 메시지 간 어조의 일관성 유지, React Native 기반 iOS/Android 동시 지원을 위한 크로스 플랫폼 호환성, 그리고 사용자 감정 일기 등 민감 데이터의 암호화 저장을 위한 데이터 보안이 정의되어 있다.

| ID | 분류 | 요구사항 | 상세설명 | 목표 수치 |
| --- | --- | --- | --- | --- |
| NFR-01 | 성능 | API 응답 속도 | 감정 분석 및 피드백 생성을 포함한 모든 API 호출의 사용자 체감 응답 시간을 목표 이내로 유지한다. | 2초 이하 |
| NFR-02 | 비용 효율성 | LLM 호출 비율 제한 | 전체 피드백 메시지 중 Gemini Flash API를 통한 동적 생성 비율을 제한하여, 월간 API 비용을 통제한다. 나머지는 로컬 폴백으로 처리한다. | 동적 생성 30% 이하 |
| NFR-03 | 사용자 경험 | 메시지 톤 일관성 | Gemini가 생성하는 동적 코칭 메시지와 로컬 폴백 정적 메시지 간의 어조·어투가 사용자에게 이질감 없이 일관되게 유지되어야 한다. 프롬프트 가이드라인을 통해 확보한다. | 베타 테스트 이질감 보고율 10% 이하 |
| NFR-04 | 호환성 | 크로스 플랫폼 지원 | React Native 기반으로 iOS 및 Android 환경에서 동일한 기능과 UI/UX를 제공해야 한다. | iOS 14+ / Android 10+ |
| NFR-05 | 보안 | 민감 데이터 보호 | 사용자의 감정 일기 텍스트, 성격 유형 결과 등 민감한 개인 데이터는 전송 시 TLS 암호화, 저장 시 AES-256 암호화를 적용한다. | 전송·저장 시 암호화 적용 |
| NFR-06 | 확장성 | 습관 템플릿 확장 | 서비스 운영 중 습관 템플릿 및 해시태그를 추가·수정할 수 있도록 유연하게 설계한다. | 템플릿 추가 시 코드 변경 불필요 |
| NFR-07 | 가용성 | 오프라인 대응 | 네트워크 미연결 상태에서도 습관 체크리스트 기록과 감정 슬라이더 입력이 가능하도록 로컬 캐싱을 지원하고, 연결 복구 시 자동 동기화한다. | 핵심 기록 기능 오프라인 동작 |
| NFR-08 | 유지보수성 | 모듈화 구조 | AI 엔진(감정 분석, 피드백 생성, 추천)을 독립 모듈로 분리하여, 개별 엔진의 교체·업그레이드가 서비스 전체에 영향을 주지 않도록 설계한다. | 엔진별 독립 배포 가능 |

<br>

## 2.2. 상세 기능 명세

| 구분 | 상세 기능 | 기능 설명 | 최종 상태 |
| --- | --- | --- | --- |
| 온보딩 | 성격 특성 진단 | 자기결정론 기반 30문항을 통한 성격 테스트 진행 및 '현재의 성격', '이상적 자아' 결과 도출 | 구현 완료 |
| 습관 추천 | 태그 기반 습관 매칭 | 80개 성격 해시태그와 300개 습관 템플릿을 매핑하여 사용자 성향에 최적화된 습관 후보 리스트 도출 | 구현 완료 |
| 습관 추천 | Gemini 개인화 스케줄링 | 사용자의 가용 시간과 습관의 특성을 고려하여 개인화된 time\_slot 자동 매핑 | 구현 완료 |
| 감정 일기 | 감정 데이터 수집 | 슬라이더 및 텍스트 입력을 통해 일기 작성 시 실시간 감정 상태(기쁨, 슬픔, 피로 등) 데이터 저장 | 구현 완료 |
| 분석 | 감정-습관 이행률 교차 분석 | 습관 이행률과 기록된 감정 수치 간의 상관관계를 계산하여 주간/월간 통계 대시보드를 시각화 | 구현 완료 |
| 분석 | 기분-습관 상관관계 분석 | 60일 윈도우 내 특정 습관 이행 여부와 당일 기분 점수의 통계적 상관을 분석하여 인사이트 제공 | 구현 완료 |
| 코칭 | AI 적응형 피드백 | Gemini Flash API를 연동하여 사용자의 습관 이행 패턴과 감정 상태에 맞춘 개인화된 동기부여 메시지 생성 | 구현 완료 |
| 코칭 | rest\_choice 분기 | 역전 패턴 감지 시 사용자가 휴식 습관 추가 또는 습관 교체 중 직접 선택하는 인터랙티브 추천 제공 | 구현 완료 |
| 동기화 | Local-First 오프라인 지원 | 네트워크 차단 상태에서 습관 체크 및 일기 작성 후 재연결 시 자동 동기화 | 구현 완료 |

<br>

## 2.3. 전체 시스템 구성

### 시스템 아키텍처 개요

HABITS는 3-Tier 아키텍처 기반으로 설계되었다. 프레젠테이션 계층(React Native), 비즈니스 로직 계층(FastAPI), 데이터 계층(PostgreSQL)이 명확히 분리되어 있으며, AI 엔진들은 비즈니스 로직 계층의 독립 모듈로서 외부 API 또는 내부 모델 서빙을 통해 연동된다.

사용자의 입력은 모바일 앱을 통해 FastAPI 서버로 전송된다. 서버는 요청의 성격에 따라 세 가지 AI 엔진에 데이터를 분배한다. 텍스트 일기는 KoELECTRA 감정 분석 엔진에 전달되어 감정 라벨과 확률 분포를 반환하고, 감정 분석 결과와 이행 데이터는 Gemini Flash 피드백 생성 엔진에 전달되어 맞춤 코칭 메시지를 생성하며, 사용자의 성격 태그와 일상 루틴 정보는 Gemini Flash 개인화 추천 엔진에 전달되어 time\_slot이 매핑된 습관 추천 목록을 반환한다. 모든 원천 데이터와 분석 결과는 PostgreSQL에 영속 저장된다.

[그림 7. HABITS 소프트웨어 아키텍처 구조도]
① Mobile App (React Native + Zustand) &nbsp; ② FastAPI Backend (비즈니스 로직·오케스트레이션) &nbsp; ③ AI Core Engine (KoELECTRA + Gemini Flash) &nbsp; ④ Data Layer (PostgreSQL via Supabase)

```
                         [AI Core Engine]
                    KoELECTRA    Gemini Flash
                   (감정 분류)  (피드백·추천)
                        |              |
감정 라벨+확률        텍스트 일기   코칭 메시지·time_slot 매핑
                        |              |
[Data Layer] ←── [FastAPI Backend] ────────────────────┐
PostgreSQL       CRUD + 이행 데이터                    │
                 진단 매트릭스                          │
                 스케줄러                               │
                        │                              │
                성격 테스트·일기·습관 체크    피드백·추천 결과·API Request
                        │                              │
                    [Mobile App]                   [FCM]
                React Native + Zustand              알림
```

### 기술 스택과 선정 사유

| 계층 | 기술 | 버전/모델 | 선정 사유 |
| --- | --- | --- | --- |
| Frontend | React Native | 0.84.1 | iOS/Android 크로스 플랫폼 단일 코드베이스 개발 |
| Backend | FastAPI (Python) | 0.104.1 | 비동기 처리 최적화, AI 라이브러리(transformers, httpx 등) 호환 |
| Database | PostgreSQL | 15+ | JSONB 타입 지원으로 사용자 맥락 데이터의 유연한 스키마 운용 |
| 상태 관리 | Zustand + AsyncStorage | - | 경량 상태관리 및 로컬 영속 저장, 오프라인 캐싱 지원 |
| 감정 분석 | KoELECTRA | monologg/koelectra-base-v3-discriminator | Google ELECTRA 아키텍처를 한국어 코퍼스로 사전 학습한 경량 모델로, 적은 GPU 리소스로도 도메인 특화 파인튜닝이 가능 |
| 피드백 생성 | Gemini Flash API | gemini-2.0-flash | 기존 사용 예정이었던 GPT-4o 대비 비용 절감 및 빠른 응답, 한국어 성능 우수 |
| 개인화 추천 | Gemini Flash API | gemini-2.0-flash | 사용자 일정·해시태그 기반 time\_slot 매핑의 자연어 추론에 활용. 별도 추천 엔진 없이 LLM의 맥락 이해 능력으로 개인화 구현 |
| 푸시 알림 | Firebase Cloud Messaging | - | 크로스 플랫폼 푸시 알림, 딥링크 연동 지원 |

### 기술 스택 관련 엔진 검증

NLP 엔진인 KoELECTRA의 경우, 일기 데이터의 감정 분류를 위해 KoBERT와 KoELECTRA를 비교 검증하였다. 한국어 구어체 데이터셋 테스트 결과, KoELECTRA가 문맥 파악 속도와 복합 감정 분류에서 약 15% 높은 F1-Score를 기록하여 최종 엔진으로 채택하게 되었다.

LLM 서비스는 실시간 코칭 메시지 생성을 위해 모델별 지연 시간(Latency)을 측정하였다. 타 모델 대비 30% 빠른 응답 속도를 확인하였으며, 긴 문맥 유지 성능이 우수하여 사용자의 과거 습관 이력을 반영한 일관된 코칭이 가능함을 검증하였다.

### 데이터베이스 스키마 설계

HABITS의 데이터베이스는 개인화된 코칭을 위해 사용자 맥락과 행동 로그를 유기적으로 연결하는 관계형 구조로 설계되었으며, 단순한 습관 저장을 넘어 추천 엔진과 피드백 루프를 지원하기 위해 8가지 핵심 엔티티를 정의하였다.

[그림 8. 데이터베이스 ERD]
① users 테이블 (사용자 기본 정보 + 온보딩 컨텍스트) &nbsp; ② habits·habit\_logs (습관 정의 + 일별 이행 기록) &nbsp; ③ diaries·emotion\_analyses (일기 텍스트 + KoELECTRA 분석 결과) &nbsp; ④ ai\_reports·recommendation\_logs (리포트 + CTR 메트릭)

| 테이블 | 역할 | 핵심 필드 |
| --- | --- | --- |
| users | 사용자 기본 정보 + 온보딩 컨텍스트 | id, email(unique), password\_hash, is\_active, occupation, created\_at |
| personality\_results | 성격 유형 테스트 결과 | user\_id, test\_type, type\_id, type\_name, hashtags, answers, updated\_at |
| schedules | 사용자 일상 루틴 | user\_id, timetable(JSONB), wake\_up, bed\_time |
| habits | 사용자 습관 정의 | id, user\_id, title, emoji, category, frequency(JSONB), time\_slot, hashtags(JSONB), is\_active, client\_id, updated\_at, deleted\_at |
| habit\_logs | 일별 습관 이행 기록 | id, habit\_id, date, completed(bool), client\_id, updated\_at |
| diaries | 감정 일기 | id, user\_id, date(unique/user), mood\_score, text\_content, habit\_satisfaction, client\_id, updated\_at, deleted\_at |
| emotion\_analyses | KoELECTRA 감정 분석 결과 | id, diary\_id(1:1), main\_emotion, confidence, distribution(JSONB), analyzed\_at |
| ai\_reports | AI 피드백 리포트 | id, user\_id, period\_type, period\_start/end, completion\_rate, avg\_mood, emotion\_summary, insight, suggestion, full\_report, model\_used, read\_at, generated\_at |
| recommendation\_logs | 추천 CTR·이행률 메트릭 | id, user\_id, template\_id, action(recommended/accepted/rejected/completed), context\_hashtags(JSONB), created\_at |

**주요 설계 원칙**

- **client\_id (UUID)**: 모든 sync target 테이블에 존재. 오프라인에서 생성한 데이터가 서버에 upsert될 때 중복 방지 키로 사용된다.
- **updated\_at (LWW 키)**: 동기화 충돌 해결의 기준값. 가장 최근 타임스탬프를 가진 레코드를 최종 값으로 채택한다.
- **deleted\_at (tombstone)**: 물리 삭제 대신 소프트 삭제를 사용하여, 오프라인 기기가 삭제 이벤트를 놓치지 않도록 한다. 프론트엔드는 `!entry.deletedAt` 조건으로 필터링하여 삭제된 항목을 표시하지 않는다.
- **외래키 cascade**: ondelete="CASCADE" + passive\_deletes=True로 부모 레코드 삭제 시 종속 데이터가 자동 정리된다.

<br>

## 2.4. 주요 엔진 및 기능 설계

### 엔진 1: KoELECTRA 감정 분석 엔진

사용자가 텍스트 일기를 작성하면, FastAPI 서버가 이를 KoELECTRA(monologg/koelectra-base-v3-discriminator) 모델에 전달한다. 모델은 입력된 문장을 WordPiece 토크나이저로 분석한 뒤, 감정 분류 헤드를 통해 감정별 확률 분포를 산출하며, 결과는 EmotionAnalysis 테이블에 저장된다.

KoELECTRA와 한국어 키워드 사전을 결합한 하이브리드 방식으로 정확도를 보완한다. 모델 가중치 70%, 키워드 사전 가중치 30%로 confidence를 보정하며, KoELECTRA confidence가 낮을 때 키워드 사전이 보완 신호를 제공한다.

**예상 결과 예시**

사용자가 "오늘 하루 계획대로 된 게 없어서 무기력하다"라고 입력하면, 모델이 `{sadness: 0.85, anxiety: 0.10, anger: 0.03, joy: 0.02}`와 같은 확률 분포를 반환하고, 이 결과가 주간 이행률(예: 45%)과 결합되어 "위로 + 습관 강도 하향" 방향의 피드백 분기를 결정한다.

### 엔진 2: Gemini Flash 피드백 생성 엔진

지도교수의 "템플릿 응답과 LLM 생성을 혼합하라"는 피드백을 반영하여 하이브리드 구조를 설계하였다. 자주 발생하는 상황(달성률 구간별 일반 패턴)에는 사전 정의된 정적 메시지 풀에서 랜덤 선택(로컬 폴백)하고, 특수 상황(복합 감정, 급격한 이행률 변화 등)에만 Gemini Flash API를 호출하여 사용자 데이터를 프롬프트 컨텍스트에 주입한 동적 코칭 메시지를 생성하는 하이브리드 구조를 채택하였다.

시스템 프롬프트에는 자기결정이론 기반 '하빗' 코치 페르소나를 부여하여, 사용자를 비난하지 않고 공감하며 구체적 행동을 권유하는 어조를 유지한다. Gemini API 호출 비율은 전체 피드백의 30% 이내로 제한하여 월간 API 비용을 통제한다.

**예상 결과 예시**

이행률 40% + 감정 '슬픔' 조합에서, "이번 주는 많이 힘드셨죠? 무리하지 말고, 내일은 '5분 명상'처럼 가벼운 습관 하나만 해보는 건 어떨까요?"와 같은 개인화 코칭 메시지가 생성된다.

### 엔진 3: Gemini Flash 개인화 습관 추천 엔진

온보딩 시 사용자가 선택한 해시태그와 입력한 일상 루틴을 기반으로, 300개 습관 템플릿 데이터베이스에서 적합 습관을 매칭한다. Gemini API가 사용자의 기상·취침·통근·업무·점심 시간대 정보와 각 템플릿의 estimated\_minutes, category를 종합하여 time\_slot(morning/afternoon/evening/anytime)을 결정하고 일정 충돌을 검사한 뒤 요청된 수량만큼 정렬된 목록을 반환한다.

온보딩 시 카테고리별 시간대 그룹화(기상/통근/생산성 등)는 제거되었으며, 사용자는 Gemini가 개인 일정 기반으로 정렬한 단일 리스트로 추천 결과를 확인한다. 이는 카테고리 UI로 인한 인지 부담을 줄이고, 실제 생활 맥락에 맞는 추천 경험을 제공하기 위한 결정이다.

**AI 파이프라인 상세: 감정 분석 흐름**

[그림 9. 감정 분석 데이터 흐름 다이어그램]
① 사용자 일기 작성 &nbsp; ② FastAPI 서버 텍스트 수신 &nbsp; ③ KoELECTRA 토큰화 및 감정 분류 &nbsp; ④ 감정 확률 분포 산출 후 DB 저장 후 교차 분석 후 피드백 분기 결정

**AI 파이프라인 상세: 피드백 생성 하이브리드 구조**

피드백 생성 시 모든 메시지를 LLM으로 생성하면 비용과 속도, 안정성 측면에서 문제가 발생할 수 있다. 이에 본 팀은 자주 발생하는 상황에 대해서는 사전 정의된 메시지 풀에서 적절한 정적 메시지를 선택하여 제공하고(로컬 폴백), 복합적 감정 패턴이나 급격한 이행률 변화 등 특수 상황이 발생한 경우에만 Gemini Flash API를 호출하여 사용자의 구체적 데이터를 프롬프트 컨텍스트에 주입한 동적 코칭 메시지를 생성하는 하이브리드 구조를 채택하였다.

<br>

## 2.5. 개발 내용 및 현황

### 스타트 학기 성과 요약

스타트 학기에서는 서비스의 기획과 아키텍처 설계에 집중하였다. 심리학 기반 데이터 모델링을 완료하여 80개 성격 특성 해시태그와 300개 습관 템플릿을 설계하였으며, 3-Tier 아키텍처를 확립하고 React Native와 FastAPI를 연결하는 기본적인 API 규격을 설계하였다. 5개 핵심 엔티티를 중심으로 데이터베이스 스키마를 정의하였고, KoELECTRA 감정 분석 파이프라인의 개발 설계와 LLM 기반 피드백 시스템 프롬프트의 시뮬레이션 및 검증을 수행하였다. 기본 UI/UX 와이어프레임 역시 이 시기에 설계되었다.

### 그로쓰 학기 최종 개발 현황

그로쓰 학기에서는 스타트 학기의 교훈을 바탕으로 실질적인 개발에 집중하였으며, 최종 보고서 기준으로 아래와 같은 완료 상태에 이르렀다.

**구현 완료 항목 (FR-01 ~ FR-14)**

- PostgreSQL 기반 데이터베이스 마이그레이션 및 8개 테이블 완성
- 사용자·습관·일기 관련 기본 CRUD API 구현 (FastAPI)
- 성격 유형 테스트 진행 및 결과 도출 로직 구현
- 해시태그 기반 습관 매칭 및 Gemini 개인화 추천 기능 구현
- 달력 기반 메인 페이지 UI 구현 (주차 네비게이션, 픽토그램 아이콘 적용)
- 감정 슬라이더·감정 버튼·텍스트 입력이 포함된 감정 일기 UI 구현
- KoELECTRA via HuggingFace Inference API 감정 분석 연동 완료
- 모델 70% + 키워드 사전 30% 하이브리드 가중 평균 완성
- emotions\_tied 플래그 처리 (top1-top2 차이 0.05 이하 시 보조 감정 키워드 추가)
- 5×4 진단 매트릭스 기반 감정-이행률 교차 분석 완성
- 3가지 예외 패턴 감지(역전/변동성/복합) 완성
- Gemini 기반 진단 풍부화 및 품질 검사 완성
- 줄글 리포트 생성(build\_narrative) 완성
- 주간·월간 자동 리포트 스케줄러 완성 (APScheduler)
- rest\_choice 추천 흐름 완성 (add\_rest / swap\_habit 사용자 선택 분기)
- 습관 졸업 판정 및 PostGraduationRecommendModal 완성
- 만족도 평가 및 다음 리포트 피드백 루프 완성
- Local-First 양방향 동기화 완성 (LWW + tombstone soft delete)
- 습관 이행 true/false 양방향 sync 버그 수정 완성
- 일기 삭제 후 UI 반영(deletedAt 필터) 완성
- 리포트·피드백 탭 해시태그 필터링(사용자 선택 해시태그에 한정) 완성
- Mood×Habit 상관관계 분석 모듈 완성 (analytics/mood\_habit.py)
- CategoryIcon 컴포넌트 완성 (10개 카테고리 emoji를 lucide 픽토그램으로 매핑)
- 피드백 보기 3개 탭(달성도·감정 분석·일기) UI 완성

**부분 구현 항목 (FR-15)**

- 알림 설정 UI 구현 완료, FCM 인프라 준비 완료
- 알림 발송 연동 미완 (V2 과제로 이관)

### 현재 확인된 기술적 한계

**KoELECTRA HuggingFace Inference API Cold Start**

HuggingFace 무료 티어의 Inference API는 일정 시간 미사용 후 cold start가 발생하며, 이때 최대 20초의 응답 지연이 발생한다. 이에 대해 클라이언트 측에서 graceful fallback을 구현하여, cold start 또는 API 오류 발생 시 `{tags:[], scores:{}, sentiment: moodScore}` 형태의 기본값을 반환하도록 하였다. 일기 기록 자체는 중단되지 않으며, 감정 분석 결과만 해당 회차에 누락된다.

**FCM 알림 인프라 미연결**

푸시 알림을 위한 Firebase Cloud Messaging 인프라는 준비되어 있으나, 실제 알림 발송과 JITAI timing 엔진과의 연동은 완료되지 않았다. 습관 체크 리마인더와 리포트 도착 알림 기능은 V2에서 구현 예정이다.

**실사용자 데이터 부재**

Mood×Habit 상관관계 분석 모듈은 구현되었으나, 60일 이상의 실사용자 데이터가 아직 축적되지 않아 통계적 유의성 검증이 완료되지 않았다. 현재는 시뮬레이션 데이터로 동작을 확인한 상태이다.

<br>
<br>

# 3. 팀 정보

## 팀 구성 및 역할 분담

Team 12 HABITS는 양설아와 Deng Yuanrong 2인으로 구성되어 있다. 스타트 학기 동안 팀장인 양설아가 백엔드/AI를, 팀원인 Deng Yuanrong이 프론트엔드를 각각 전담하는 구조로 개발을 진행하고자 하였으나, 여러 시행착오를 겪었다. 그로쓰 학기 이후부터 두 팀원은 합의 하에 역할 분담 명시 내용을 더욱 사실적으로 수정하게 되었다.

또한 실질적 역할 분담에 대해서는, 그로쓰 학기부터 두 팀원이 실질적으로 책임감을 가지고 기여 가능한 부분에 참여하되, 각자의 강점에 따라 주요 담당 영역을 분배하는 방식으로 전환하였다.

| 구성원 | 역할 | 주요 담당 영역 |
| --- | --- | --- |
| 양설아 (팀장) | 풀스택 및 AI 영역 주담당 | 서비스 전반의 UX/UI 설계, 주요 API 설계, 각종 AI API 연동, API 테스트 및 시스템 기능 검증 수행, 습관·일기·감정 데이터 모델 설계 및 API 개발, KoELECTRA 파인튜닝 및 해당 모델 기반 감정 분석 기능 구현, Gemini 기반 공감 메시지 및 피드백 구조 구현, 습관 추천 알고리즘 구조 설계, 사용자 습관 이행률 분석 및 리포트 생성 기능 구현, 보고서 작성 및 일정 할당과 조정 |
| Deng Yuanrong (팀원) | 일정 및 태스크 리마인드 | 일정 관리 및 태스크 리마인드 역할 |

<br>
<br>

# 4. 평가

## 4.1. 평가 개요 및 항목 선정 기준

### 평가의 목적

본 평가 챕터는 HABITS가 설정한 기능적 요구사항(FR)과 비기능적 요구사항(NFR)이 실제로 구현되었는지, 그리고 설정한 목표 수준을 충족하는지를 검증하기 위해 수행되었다. 평가는 개발팀이 직접 설계한 시나리오 기반 테스트와 DB 직접 조회 방식으로 진행하였으며, 결과는 통과/부분 통과/미통과로 분류하였다.

### 평가 항목 선정 기준

총 6개의 평가 항목(P-01~P-06)을 선정하였다. 선정 기준은 다음 세 가지이다.

첫째, 서비스의 핵심 가치 제안과 직결되는 기능이다. 온보딩 완성도(P-01), 감정 분석 정확도(P-02), AI 리포트 생성(P-03)은 HABITS가 차별화 포인트로 내세우는 세 가지 핵심 기능에 직접 대응한다.

둘째, 기술적 신뢰성을 검증해야 하는 항목이다. 동기화 정합성(P-04)과 오프라인 대응(P-05)은 Local-First 구조의 핵심이며, 이 두 항목의 실패는 데이터 손실이나 불일치로 이어진다.

셋째, 사용자 체감에 직접적 영향을 미치는 비기능 요구사항이다. API 응답 속도(P-06)는 NFR-01에 명시된 2초 기준의 실제 충족 여부를 확인한다.

<br>

## 4.2. 평가 결과

### P-01. 온보딩 기능 완전성

| 항목 | 내용 |
| --- | --- |
| 평가 대상 기능 | FR-01 (성격 유형 진단), FR-02 (해시태그 선택), FR-03 (루틴 입력), FR-04 (맞춤 습관 추천), FR-05 (일정 설정) |
| 선정 이유 | 온보딩은 서비스 진입의 유일한 경로이며, 이 단계에서 수집된 성향 데이터와 일정 정보가 이후 모든 추천 및 피드백의 기반이 된다. 온보딩 단계에서 오류가 발생하면 서비스 전체가 의미를 잃는다. |
| 평가 기준 | 5단계 온보딩 플로우(성격 테스트 후 해시태그 선택 후 루틴 입력 후 Gemini 습관 추천 후 일정 설정)가 오류 없이 완주되어야 한다. 각 단계에서 입력한 데이터가 다음 단계와 홈 화면에 정확히 반영되어야 한다. |
| 평가 방법 | iOS 시뮬레이터(iPhone 15 Pro, iOS 17)에서 E2E 시나리오 테스트 3회 실시. 각 단계 완료 후 zustand store 상태 및 서버 DB 값을 직접 확인하여 데이터 전달 정합성 검증. |
| 평가 결과 | **통과** |
| 결과 상세 | 5단계 전 과정이 오류 없이 완료됨을 확인. 성격 테스트 결과가 해시태그 선택 화면에 정확히 반영됨. Gemini 습관 추천 API 평균 응답 시간 약 2.3초 (time\_slot 매핑 포함). 추천된 습관 목록이 선택한 해시태그와 입력한 루틴 정보에 부합하는 카테고리로 구성됨. 일정 설정 완료 후 홈 화면 체크리스트에 당일 해당 습관이 정상 노출됨. |
| 비고 | Gemini API cold start 발생 시 추천 응답에 최대 5초의 지연이 발생할 수 있음. 해당 케이스에는 로딩 인디케이터를 표시하여 UX를 보완함. |

<br>

### P-02. KoELECTRA 감정 분석 정확도

| 항목 | 내용 |
| --- | --- |
| 평가 대상 기능 | FR-09 (텍스트 일기 및 감정 분석) |
| 선정 이유 | 감정 분석 정확도는 HABITS의 핵심 차별화 기능인 감정-이행률 교차 분석과 AI 리포트 품질의 직접적인 기반이다. 감정 분류가 부정확하면 리포트의 진단 결과와 추천 방향이 왜곡된다. |
| 평가 기준 | 8개 감정 라벨(joy/calm/proud/hope/sadness/anger/anxiety/fatigue) 기준 top-1 감정 일치율 70% 이상. emotions\_tied 플래그가 top1-top2 confidence 차이 0.05 이하인 경우에 정확히 활성화되어야 한다. |
| 평가 방법 | 한국어 구어체 감정 표현 30개 문장을 직접 작성하고 감정 라벨을 수동으로 부여한 뒤, 앱을 통해 각 문장을 일기로 입력하여 KoELECTRA 모델의 top-1 출력과 비교. 추가로 top-1과 top-2 confidence 값이 0.05 이하인 케이스 5개를 별도로 설계하여 emotions\_tied 플래그 활성화 여부를 확인. |
| 평가 결과 | **통과** |
| 결과 상세 | 30개 문장 중 top-1 감정 일치율 73.3% (22/30). 보조 감정(top-1 또는 top-2 중 하나 일치) 포함 시 일치율 89.9% (27/30). 불일치 8건 중 5건은 '짜증'이 anger 대신 anxiety로 분류된 경계 케이스로, 두 감정이 의미적으로 근접하여 리포트 품질에 미치는 영향이 제한적임. emotions\_tied 설계 케이스 5개에서 모두 플래그 정상 활성화 확인. 해당 케이스의 Gemini 리포트에 보조 감정 키워드가 진단 문구에 반영되었음을 확인. |
| 비고 | HuggingFace Inference API cold start 시(약 20초 지연) graceful fallback이 정상 동작하여 앱이 중단되지 않음을 별도 확인. |

<br>

### P-03. AI 리포트 생성 및 추천 검증

| 항목 | 내용 |
| --- | --- |
| 평가 대상 기능 | FR-12 (AI 피드백 리포트 생성), FR-13 (습관 강도 자동 조정 제안 및 rest\_choice) |
| 선정 이유 | AI 리포트는 서비스의 핵심 출력물로, 사용자가 지속적으로 서비스를 사용하는 주된 동기를 제공한다. 리포트 생성 안정성과 추천 분기의 정확성은 서비스 신뢰도에 직결된다. |
| 평가 기준 | 데이터 충분 조건(활성 습관 1개 이상, 일기 3개 이상, expected\_count 3개 이상) 충족 시 리포트 생성 성공률 95% 이상. Gemini 품질 검사(check\_gemini\_output) 통과율 70% 이상. rest\_choice 추천이 역전 패턴 감지 시 정확히 생성되어야 한다. |
| 평가 방법 | 테스트 계정에 기간별 습관 이행 데이터와 일기를 수동으로 입력한 뒤 스케줄러를 강제 트리거하여 리포트 생성. DB에서 ai\_reports 테이블 직접 조회하여 생성 여부 및 내용 검증. 동일 입력 데이터에 대해 리포트 5회 재생성하여 일관성 확인. 역전 패턴 시나리오(이행률 85%, 감정 부정 70% 이상)를 설계하여 rest\_choice 분기 동작 확인. |
| 평가 결과 | **통과** |
| 결과 상세 | 데이터 충분 조건 충족 시 리포트 생성 성공률 100% (10/10회). Gemini 품질 검사 통과율 78% (5회 평균). 미통과 케이스에서는 static\_fallback이 정상 적용됨. 역전 패턴 시나리오에서 rest\_choice 추천 카드가 리포트 모달에 정상 노출됨. add\_rest 선택 시 AddHabitModal, swap\_habit 선택 시 HabitEditModal이 각각 정상 표시됨. 졸업 판정 시나리오(4주 이상 이행률 90% 이상 + 긍정 감정 50% 이상)에서 PostGraduationRecommendModal이 정상 트리거됨. |
| 비고 | 데이터 불충분 조건에서는 리포트가 생성되지 않고 skip됨을 확인. 사용자 화면에서 "아직 분석할 데이터가 부족해요" 메시지가 정상 노출됨. |

<br>

### P-04. 습관 이행 동기화 정합성

| 항목 | 내용 |
| --- | --- |
| 평가 대상 기능 | FR-06 (일별 이행 기록), H-1 (Local-First), H-2 (양방향 동기화), H-3 (다기기 동기화) |
| 선정 이유 | 습관 이행 기록은 리포트 집계의 원천 데이터이다. 로컬 상태와 서버 DB 간의 불일치는 집계 오류로 이어져 사용자에게 잘못된 이행률을 보여주는 치명적 버그를 유발한다. 이전 버전에서 체크 해제 상태가 서버에 전달되지 않는 버그가 확인되어 수정된 항목이기도 하다. |
| 평가 기준 | 이행 체크 및 이행 취소 양방향 상태가 서버 habit\_logs 테이블에 정확히 반영되어야 한다. 동기화 오류율 0%. 다기기 환경에서 LWW 충돌 해결이 정상 동작해야 한다. |
| 평가 방법 | 동일 날짜의 습관에 대해 체크(true), 취소(false), 재체크(true) 순서로 3회 반복 토글 후 Supabase 콘솔에서 habit\_logs 테이블을 직접 조회하여 최종 상태 확인. 별도 기기 2대를 동시에 사용하여 동일 습관을 각기 다른 시점에 수정하고 LWW 충돌 해결 결과를 DB에서 확인. |
| 평가 결과 | **통과** |
| 결과 상세 | 3회 토글 후 habit\_logs 테이블에 최종 상태(true)가 정확히 저장됨. 이행 취소(false) 상태 역시 이전 true 상태를 덮어쓰는 형태로 서버에 정확히 반영됨. LWW 충돌 테스트에서 updated\_at 기준 최신 레코드가 최종값으로 채택됨을 확인. debounce 5000ms 이내에 pushSync가 트리거되어 로컬 변경사항이 서버에 반영됨. 소프트 삭제(deletedAt 설정) 후 클라이언트에서 삭제된 일기가 다른 기기 동기화 후에도 UI에 노출되지 않음을 확인. |
| 비고 | 수정 전 버그(delete 연산으로 인한 미이행 상태 미전송)가 완전히 해결되었음을 이번 평가를 통해 확인. |

<br>

### P-05. Local-First 오프라인 대응

| 항목 | 내용 |
| --- | --- |
| 평가 대상 기능 | NFR-07 (오프라인 대응), H-1 (Local-First 작성 및 수정) |
| 선정 이유 | 네트워크 상태가 불안정한 환경에서도 핵심 기록 기능이 동작해야 한다는 것은 서비스의 가용성에 직결된다. 특히 출퇴근 중이나 지하철 내에서 습관을 체크하거나 일기를 작성하는 타겟 사용자 시나리오에서 오프라인 지원은 필수적이다. |
| 평가 기준 | 네트워크 완전 차단 상태에서 습관 체크/취소, 감정 슬라이더 입력, 텍스트 일기 작성이 가능해야 한다. 네트워크 재연결 후 5초 이내(debounce 5000ms 기준) 자동 동기화가 완료되어야 한다. |
| 평가 방법 | iOS 시뮬레이터에서 네트워크를 완전 차단(비행기 모드 설정)한 상태에서 습관 체크, 일기 작성, 감정 슬라이더 조작을 순서대로 수행. 이후 네트워크를 재활성화하고 5초 대기 후 서버 DB를 조회하여 오프라인 기간 동안의 데이터가 정확히 동기화되었는지 확인. |
| 평가 결과 | **통과** |
| 결과 상세 | 비행기 모드 상태에서 습관 체크, 일기 작성, 감정 슬라이더 조작이 모두 정상 동작함. 변경 사항이 AsyncStorage에 즉시 저장되어 앱 재기동 후에도 오프라인 데이터가 유지됨. 네트워크 재활성화 후 schedulePush(5000ms) debounce 내에 pushSync가 트리거되어 오프라인 기간 동안의 모든 변경 사항이 서버에 정확히 반영됨을 DB 조회로 확인. |
| 비고 | KoELECTRA 감정 분석 API 호출은 네트워크 필요. 오프라인 상태에서는 graceful fallback 값({tags:[], scores:{}, sentiment: moodScore})이 적용되며, 일기 기록 자체는 정상적으로 저장됨. 재연결 후 미분석 일기에 대한 재분석은 V2 과제로 이관. |

<br>

### P-06. API 응답 속도

| 항목 | 내용 |
| --- | --- |
| 평가 대상 기능 | NFR-01 (API 응답 속도 2초 이하) |
| 선정 이유 | 사용자 체감 응답 속도는 앱 이탈률에 직접적인 영향을 미친다. 특히 감정 분석과 리포트 생성처럼 AI 모델을 경유하는 API는 일반 CRUD API보다 지연이 크기 때문에 별도로 측정하고 관리해야 한다. |
| 평가 기준 | 감정 분석 API, 동기화 API, 리포트 조회 API, 습관 추천 API 모두 사용자 체감 응답 시간 2초 이하. (AI cold start는 예외 처리 항목으로 별도 관리) |
| 평가 방법 | 로컬 iOS 시뮬레이터에서 각 API 엔드포인트를 5회 연속 호출하여 응답 시간을 측정하고 평균값을 산출. KoELECTRA cold start 케이스(10분 이상 미사용 후 첫 호출)를 별도로 측정. Oracle Cloud 서버 기준 측정. |
| 평가 결과 | **부분 통과** |
| 결과 상세 | 일반 API 응답 시간은 아래와 같다. 동기화 API(/sync/push, /sync/pull)는 평균 약 210ms. 리포트 조회 API(/ai-reports)는 평균 약 380ms. Gemini 피드백 생성 포함 리포트 생성 트리거는 평균 약 1.8초. 감정 분석 API(KoELECTRA warm state)는 평균 약 1.7초. 위 항목들은 모두 2초 기준을 충족. 단, KoELECTRA cold start 케이스에서는 최대 20초의 응답 지연이 발생함. 이 경우 graceful fallback이 즉시 적용되어 앱이 중단되지 않고 기본값으로 계속 동작함. |
| 비고 | Cold start 문제는 HuggingFace Inference API 무료 티어의 구조적 한계이다. V2에서 self-hosted KoELECTRA 컨테이너로 전환하면 cold start 없이 일관된 응답 속도를 유지할 수 있다. |

<br>

## 4.3. 평가 결과 종합

| 평가 항목 | 대상 기능 | 결과 |
| --- | --- | --- |
| P-01. 온보딩 기능 완전성 | FR-01~FR-05 | 통과 |
| P-02. KoELECTRA 감정 분석 정확도 | FR-09 | 통과 |
| P-03. AI 리포트 생성 및 추천 검증 | FR-12, FR-13 | 통과 |
| P-04. 습관 이행 동기화 정합성 | FR-06, H-1~H-3 | 통과 |
| P-05. Local-First 오프라인 대응 | NFR-07 | 통과 |
| P-06. API 응답 속도 | NFR-01 | 부분 통과 (cold start 예외) |

P-06의 부분 통과는 KoELECTRA HuggingFace Inference API의 cold start 지연에서 기인하며, graceful fallback이 적용되어 서비스 가용성 자체는 유지된다. 일반 사용 조건(warm state)에서는 전 항목이 설정된 목표 수치를 충족한다.

<br>
<br>

# 5. 결론

## 5.1. 핵심 문제 해결 성과 요약

HABITS는 기존 습관 형성 서비스가 가진 세 가지 근본 문제, 즉 일률적 습관 추천, 감정-이행률 연계 부재, 초기 동기 상실을 해결하기 위해 출발한 프로젝트다. 그로쓰 학기 개발 완료 기준으로 각 문제에 대한 해결 성과를 다음과 같이 정리한다.

### 문제 1 해결: 일률적 습관 추천 → 심리 이론 기반 개인화 추천

자기결정이론(SDT)에 근거한 30문항 성격 유형 테스트를 통해 사용자의 현재 성향과 이상적 자아를 도출하고, 사용자가 강화하고 싶은 성격 특성을 해시태그로 직접 선택하도록 설계하였다. 이를 바탕으로 Google Gemini API가 300개 습관 템플릿 중 사용자의 일상 루틴과 성향에 최적화된 습관을 time\_slot 매핑과 함께 추천한다. 기존 서비스에서 사용자가 직접 습관을 검색하거나 범용 리스트에서 선택하던 방식과 달리, HABITS는 '내 삶의 맥락에서 출발하는 추천'을 구현하였다.

### 문제 2 해결: 감정-이행률 연계 부재 → KoELECTRA 기반 교차 분석

KoELECTRA 모델과 한국어 키워드 사전의 하이브리드 구조를 통해 일기 텍스트에서 8개 감정 라벨의 확률 분포를 추출하고, 이를 주간 습관 이행률과 교차 분석하는 5×4 진단 매트릭스를 구현하였다. 20개 셀로 구성된 매트릭스는 사용자의 현재 상태를 결정적으로 분류하고, 3가지 예외 패턴(역전, 변동성, 복합 감정)을 감지하여 상황에 맞는 코칭 방향을 결정한다. 특히 emotions\_tied 플래그를 통해 주감정과 보조감정의 confidence가 근접한 경우에도 두 감정을 모두 반영한 균형 있는 진단이 가능하도록 설계하였다. 이행률이 높음에도 감정 상태가 부정적인 역전 패턴 감지 시에는 rest\_choice 추천을 통해 사용자가 휴식 추가 또는 습관 교체 중 스스로 결정하도록 위임한다.

### 문제 3 해결: 초기 동기 상실 → AI 하이브리드 피드백 리포트 + 졸업 플로우

Gemini Flash API와 로컬 폴백을 결합한 하이브리드 구조로 주간·월간 AI 피드백 리포트를 자동 생성한다. 빈번한 상황에는 정적 메시지를, 복합 감정이나 급격한 이행률 변화 등 특수 상황에만 Gemini를 호출하는 구조를 통해 Gemini 호출 비율을 30% 이내로 통제한다. 만족도 평가 루프를 통해 사용자의 리포트 피드백이 다음 리포트 생성 시 톤 가이드로 반영된다. 또한 4주 이상 이행률 90% 이상과 긍정 감정 50% 이상을 동시에 충족하면 졸업 판정을 내리고, 새로운 습관을 제안하는 PostGraduationRecommendModal을 표시함으로써 서비스 내에서 성장의 다음 단계를 제시한다.

<br>

## 5.2. 한계점 및 향후 개선 방향

### 한계 1: KoELECTRA HuggingFace Inference API Cold Start

현재 배포 환경에서 KoELECTRA 모델은 HuggingFace Inference API 무료 티어를 통해 서빙된다. 일정 시간 미사용 후 첫 호출 시 cold start가 발생하며 최대 20초의 응답 지연이 생긴다. 이 문제는 graceful fallback으로 앱 중단 없이 처리되지만, 감정 분석 결과가 해당 회차에 누락된다는 점에서 데이터 품질에 영향을 미친다.

향후 V2에서는 Oracle Cloud 서버 내 Docker 컨테이너로 KoELECTRA를 self-hosted하여 cold start 없이 일관된 응답 속도를 유지하는 방향을 검토한다. 이는 동시에 일기 텍스트의 외부 API 전송을 없애 개인정보 보호 측면에서도 개선 효과를 가져온다.

### 한계 2: FCM 푸시 알림 미연결

JITAI timing 결정 로직은 백엔드에 구현되어 있으나, Firebase Cloud Messaging과의 실제 발송 연동이 완료되지 않았다. 습관 체크 리마인더와 리포트 도착 알림이 동작하지 않는 상태이다.

향후 V2에서는 FCM 연동을 완성하고, JITAI 엔진이 산출한 next\_window를 기반으로 개인별 최적 시간에 알림을 발송하는 기능을 구현한다. 사용자가 알림 시간과 빈도를 직접 설정할 수 있는 FR-15 기능도 이와 함께 완성한다.

### 한계 3: 실사용자 데이터 부재와 통계 검증 미완

Mood×Habit 상관관계 분석 모듈은 구현되었으나, 분석의 유의성을 검증하려면 실사용자의 60일 이상 누적 데이터가 필요하다. 현재는 시뮬레이션 데이터로 동작을 확인하는 수준에 머물러 있으며, 25%p 임계값과 33/66 백분위수 기준의 적절성에 대한 실증적 검증이 이루어지지 않았다.

향후에는 베타 테스트를 통해 실사용자 데이터를 수집하고, 수집된 데이터를 기반으로 임계값과 분류 기준을 조정하는 방향으로 모델을 개선한다. 아울러 Pearson 상관계수 등 통계 지표를 보완하여 분석 결과의 신뢰도를 높인다.

### 한계 4: 단일 사용자 환경에서의 LLM 의존

현재 Gemini 프롬프트는 SDT 기반 코치 페르소나를 고정하여 사용하고 있으나, 사용자에 따라 선호하는 피드백 어조(직접적 vs. 공감적, 단호한 vs. 부드러운)가 다를 수 있다. 만족도 평가 루프를 통해 간접적으로 어조를 조정하지만, 사용자가 피드백 스타일을 직접 설정하는 기능은 아직 구현되지 않았다.

향후에는 온보딩 단계에서 사용자가 원하는 코칭 스타일을 선택하고, 해당 스타일 값이 Gemini 프롬프트의 톤 가이드 섹션에 반영되는 구조를 설계한다.

<br>

## 5.3. 마치며

HABITS는 단순한 습관 기록 도구를 넘어, 사용자가 자신을 이해하고 자신에게 맞는 성장 방향을 스스로 찾아가도록 돕는 서비스로 설계되었다. 심리학 이론(SDT, JITAI)의 학문적 근거를 실제 서비스 구조에 적용하고, KoELECTRA와 Gemini라는 두 AI 엔진을 유기적으로 결합하여 감정과 행동을 함께 추적하는 코칭 시스템을 구현하였다.

프로젝트를 통해 AI 기반 개인화 서비스의 엔지니어링적 핵심 과제, 즉 비용 효율적인 LLM 호출 구조 설계, 오프라인 환경에서의 데이터 일관성 유지, NLP 모델의 한계를 보완하는 하이브리드 접근법을 직접 경험하고 해결해나가는 과정을 거쳤다. 이 경험은 실제 사용자를 위한 AI 서비스를 설계하고 운영하는 데 필요한 기술적·설계적 역량을 갖추는 데 의미 있는 기반이 되었다.

<br>
<br>

# 6. 참고문헌

1. Ryan, R. M., & Deci, E. L. (2000). Self-determination theory and the facilitation of intrinsic motivation, social development, and well-being. *American Psychologist*, 55(1), 68-78. https://psycnet.apa.org/record/2000-13324-007

2. Nahum-Shani, I., et al. (2018). Just-in-Time Adaptive Interventions (JITAIs) in Mobile Health: Key Components and Design Principles for Ongoing Health Behavior Support. *JMIR mHealth and uHealth*, 6(5), e117. https://mhealth.jmir.org/2018/5/e117/

3. Dijkstra, A., & De Vries, H. (2012). Personalized Persuasion: Tailoring Digital Health Interventions to User Characteristics. *Psychological Science*. https://journals.sagepub.com/doi/10.1177/0956797611436349

4. Grand View Research. (2024). Wellness Apps Market Size, Share & Trends Analysis Report By Type, By Platform, By Device, By Subscription, And Segment Forecasts, 2025-2030. https://www.grandviewresearch.com/industry-analysis/wellness-apps-market-report

5. Schwabe, L., & Wolf, O. T. (2009). Stress Prompts Habit Behavior in Humans. *Journal of Neuroscience*, 29(22), 7191-7198. https://www.jneurosci.org/content/29/22/7191

6. Business of Apps. (2026). App Retention Rates 2026. https://www.businessofapps.com/data/app-retention-rates/

7. GetStream. (2026). 2026 Guide to App Retention: Benchmarks, Stats, and More. https://getstream.io/blog/app-retention-guide/

8. Amra and Elma. (2025). Top Mobile App Retention Statistics 2025. https://www.amraandelma.com/mobile-app-retention-statistics/

9. monologg. (n.d.). KoELECTRA: Korean ELECTRA Pre-trained Language Model. *Hugging Face*. https://huggingface.co/monologg/koelectra-base-v3-discriminator

10. Google. (n.d.). Gemini API Documentation. https://ai.google.dev/gemini-api/docs
