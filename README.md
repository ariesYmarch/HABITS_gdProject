# HABITS 🧘‍♀️
> **Psychology-based Personalized Habit Coaching Service with AI**
> 심리 이론 기반의 자아 탐색과 AI 감정 분석을 통한 개인 맞춤형 습관 코칭 서비스

[![Stack](https://img.shields.io/badge/Mobile-React%20Native%200.84-61DAFB?logo=react)]()
[![Stack](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)]()
[![Stack](https://img.shields.io/badge/DB-PostgreSQL%20(Supabase)-336791?logo=postgresql)]()
[![Stack](https://img.shields.io/badge/AI-KoELECTRA%20%2B%20Gemini%202.5-orange)]()
[![Status](https://img.shields.io/badge/Status-MVP%20Working-brightgreen)]()

---

## 📖 Project Overview

**"무작정 따라 하는 습관이 아닌, '나'를 이해하고 성장시키는 습관 코칭"**

**HABITS**는 사용자의 심리적 성향, 일과 스케줄, 매일의 감정 상태를 통합 분석해 **'이상적인 나'로 나아가는 과정**을 돕는 AI 기반 습관 코칭 모바일 앱입니다. 단순 체크리스트를 넘어, 행동(이행률)과 감정의 교차분석으로 *왜 안 됐는지* 까지 진단해 다음 액션을 제안합니다.

### 🎯 Key Goals
- **Self-Discovery** — 36개 해시태그 기반 성격 테스트로 '현재의 나' ↔ '이상적인 나' 격차 파악
- **Context-Aware Recommendation** — 사용자가 입력한 일주일 스케줄을 기반으로 Gemini가 습관별 최적 시간대 자동 매핑
- **Emotion-Aware Feedback** — KoELECTRA 8-class 감정 분류 + 한국어 키워드 사전으로 일기 분석, 행동/감정 교차 진단을 주·월간 리포트로 제공
- **Closed Feedback Loop** — 리포트 만족도 평가 → 다음 리포트 톤/Gemini 호출 분기에 자동 반영

---

## 🛠 Tech Stack

| Category | Technology | Notes |
| :--- | :--- | :--- |
| **Mobile** | React Native 0.84 + TypeScript | iOS·Android 단일 코드베이스 |
| **State** | Zustand + persist + AsyncStorage | Local-First 저장소 |
| **Navigation** | React Navigation Native Stack | |
| **Icons** | lucide-react-native + react-native-svg | 폰 이모지 → 픽토그램 |
| **Gesture** | react-native-gesture-handler (Swipeable) | 습관 토글 스와이프 |
| **Backend** | FastAPI 0.104 (Python 3.12) + APScheduler | 자동 리포트 스케줄러 |
| **DB** | PostgreSQL via Supabase (Session Pooler) | RLS + 권한 회수로 PostgREST 노출 차단 |
| **ORM** | SQLAlchemy 2.0 + Alembic | |
| **Auth** | JWT (HS256, access 15분 + refresh 7일) + bcrypt cost 12 | refresh race-lock 적용 |
| **AI #1** | **KoELECTRA** (`monologg/koelectra-base-v3-discriminator`, HF Inference API) | 8-class 감정 분류 (AI Hub 감성 대화 말뭉치 파인튜닝) |
| **AI #2** | **Gemini 2.5 Flash** | 시계열 메타 인사이트 + 추천 이유 개인화 + 일정 기반 time_slot 배정 |
| **AI #3** | **Recombee** (협업 필터링) | 사용자×습관 행렬 학습 |
| **Mail** | Resend API | 비밀번호 재설정 |

---

## 🏗 System Architecture

```mermaid
graph TD
    User((User)) -->|Diary / Habit Check / Schedule| Client[React Native App]
    Client -->|Zustand + AsyncStorage| LocalStore[Local-First Store]
    LocalStore -->|debounced 5s push / LWW sync| Server

    Client -->|JWT REST| Server[FastAPI + APScheduler]

    subgraph "AI Pipeline"
        Server -->|일기 텍스트| HF[HuggingFace KoELECTRA]
        HF -->|8-class distribution| Server
        Server -->|+ 키워드 사전 70:30 가중평균| EmotionEngine[Emotion Engine]

        Server -->|기간 집계 데이터| Diagnosis[5×4 진단 매트릭스]
        Diagnosis -->|정적 라벨·줄글·키워드| Server
        Server -->|이전 N개 리포트 + 추천 컨텍스트| Gemini[Gemini 2.5 Flash]
        Gemini -->|메타 인사이트 / 추천 이유| Server

        Server -->|view/bookmark/purchase/rating| Recombee[Recombee Cloud]
        Recombee -->|Recommend Items| Server
    end

    subgraph "Data Layer"
        Server <-->|RLS + bypassrls 백엔드 직결| DB[(Supabase PostgreSQL)]
    end

    APScheduler[APScheduler] -.->|일요일 22:00 KST / 월말 22:00| Server
```

---

## 🧠 Core Logic

### 1. 감정 분석 (KoELECTRA + Korean Keyword Dict)
한국어 ELECTRA 베이스를 AI Hub 감성 대화 말뭉치(30+ 세부 라벨)를 우리 8 클래스(joy/calm/proud/hope/sadness/anger/anxiety/fatigue)로 통합 후 weighted CrossEntropy로 클래스 불균형 보정해 파인튜닝. 모델 confidence가 모호한 케이스는 8 라벨 × 250+ 표현의 **한국어 키워드 사전**(구어체·신조어 포함)으로 보완 신호를 만들어 **모델 70% + 키워드 30%** 가중 평균.

### 2. AI 리포트 — 결정적 매트릭스 + Gemini 하이브리드
LLM 환각 위험을 피하기 위해 **결정적 진단을 먼저**, **풍부화만 LLM에** 위임. 이행률 5구간(very_low~very_high) × 감정 4구간(positive/negative/mixed/no_data) = **20셀 매트릭스**가 라벨·줄글·키워드를 결정. Gemini는 (a) 최근 3+ 리포트를 보고 **시계열 패턴 인사이트** 1문단 생성, (b) **추천 행동 이유**를 사용자 데이터 인용해 개인화. 사용자가 "아쉬워요" 평가 + 사유를 남기면 **다음 리포트 Gemini 호출의 satisfaction hint**에 직접 인용되어 폐쇄 루프 완성.

### 3. Context-Aware Habit Recommendation (Onboarding)
사용자가 온보딩에서 선택한 **해시태그**와 입력한 **일주일 일정(7×24 그리드)**을 결합해 Gemini가 후보 템플릿 중 N개를 골라 각 습관에 최적 `time_slot`(morning/commute/lunch/afternoon/evening/bedtime/anytime)을 자동 배정. 7×24 그리드는 요일별 자유 시간 범위로 압축 전송. JSON 응답 강제(`responseMimeType`)로 파싱 안정성 확보.

### 4. Local-First Sync with LWW
오프라인에서도 즉시 저장되도록 zustand+AsyncStorage가 1차 저장소. 모든 sync target에 `client_id` UUID + `updated_at` + `deleted_at`(tombstone) 필드. 충돌은 **Last-Write-Wins** 알고리즘으로 결정적 해결. 5초 debounce push + 포그라운드 진입 시 `since=lastSyncedAt` pull.

### 5. Security
- **JWT**: HS256 + payload `type` 필드(access/refresh/reset)로 토큰 위조 방어, refresh 동시 401 처리는 single shared promise로 race lock
- **bcrypt**: cost 12 (256ms/hash)
- **Supabase RLS**: 모든 `public.*` 테이블 RLS 활성화 + `REVOKE ALL ... FROM anon, authenticated, public` + DEFAULT PRIVILEGES 회수로 PostgREST 노출 0
- **백엔드 우회**: `postgres` superuser 직결(BYPASSRLS=true)로 RLS 영향 없음

---

## 🔧 Installation & Run

### 0. Prerequisites
- Python 3.12, Node.js ≥ 20, Xcode (iOS) / Android Studio
- CocoaPods (`sudo gem install cocoapods`)

### 1. Backend

```bash
cd backend
python3.12 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 환경변수 설정
cp .env.example .env   # 없으면 직접 만들기, 아래 항목 참고
# SECRET_KEY=$(python -c "import secrets; print(secrets.token_urlsafe(64))")
# DATABASE_URL=postgresql://<user>:<pw>@aws-...-pooler.supabase.com:6543/postgres
# GEMINI_API_KEY=AIza...
# HF_API_TOKEN=hf_...
# HF_MODEL_REPO=monologg/koelectra-base-v3-discriminator
# RECOMBEE_DB_ID=...
# RECOMBEE_API_TOKEN=...  # Private Token
# RESEND_API_KEY=re_...

alembic upgrade head        # DB 마이그레이션
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend (iOS)

```bash
cd frontend
npm install
cd ios && pod install && cd ..
npx react-native start                       # Metro (터미널 #1)
npx react-native run-ios --simulator "iPhone 17"   # 다른 터미널
```

### 3. Frontend (Android)
```bash
npx react-native run-android
```

---

## 📂 Project Structure

```
HABITS_gdProject
├── backend
│   ├── app
│   │   ├── analytics/        # 기간 집계 + 데이터 충분성 체크
│   │   ├── auth/             # JWT, bcrypt, dependencies
│   │   ├── core/             # config, database, emotion(HF client)
│   │   ├── feedback/         # 5×4 진단 매트릭스, narrative, satisfaction, keywords
│   │   ├── jitai/            # Just-In-Time Adaptive Intervention
│   │   ├── ml/               # KoELECTRA 평가 utils
│   │   ├── models/           # SQLAlchemy 10 테이블
│   │   ├── routers/          # auth/habits/diary/sync/reports/feedback/recommendations/jitai
│   │   ├── services/         # gemini, recombee, scheduler, report_generator
│   │   ├── sync/             # Local-First LWW sync
│   │   └── main.py
│   ├── alembic/              # DB 마이그레이션
│   ├── scripts/              # KoELECTRA 파인튜닝·평가
│   └── requirements.txt
├── frontend
│   ├── src
│   │   ├── components/       # 재사용 UI (AppAlert, HabitEditModal, ...)
│   │   ├── data/             # 36 해시태그, 20 성격유형, 200 습관 템플릿
│   │   ├── navigation/       # Root/Auth/Onboarding/Main 네비게이터
│   │   ├── screens/          # auth, onboarding(10단계), home, diary, report, mypage
│   │   ├── services/         # api, sync, reports, feedback, ...
│   │   ├── store/slices/     # auth, habit, diary, schedule, user, theme
│   │   ├── theme/, types/    # 디자인 토큰, TS 타입
│   │   └── ...
│   └── package.json
├── docs/                     # 통합 테스트 가이드, 작업 로그
├── presentation/             # 발표 자료, 아키텍처 다이어그램
└── README.md
```

---

## 📅 Roadmap

- [x] **Phase 1 — 기획 및 설계**
    - [x] 요구사항 정의 및 페르소나 설정
    - [x] 시스템 아키텍처 + ERD 설계 + UI 와이어프레임
- [x] **Phase 2 — MVP 개발**
    - [x] FastAPI 백엔드(10 라우터, JWT 인증, LWW sync, RLS 보안)
    - [x] React Native 앱(인증, 온보딩 10단계, 홈, 일기, 리포트, 마이페이지, 타이머)
    - [x] KoELECTRA + 키워드 사전 감정 분석 파이프라인
    - [x] Gemini 2.5 Flash 통합(메타 인사이트, 추천 이유 개인화, 일정 기반 추천)
    - [x] Recombee 협업 필터링 연동
    - [x] APScheduler 자동 리포트(일요일 22시 KST / 월말 22시)
    - [x] Local-First 동기화 (5초 debounce push, LWW conflict resolution)
- [ ] **Phase 3 — 고도화 / V2**
    - [ ] OAuth (카카오·구글) 로그인
    - [ ] FCM 푸시 알림 인프라
    - [ ] KoELECTRA self-hosted 컨테이너 이전 (외부 전송 0)
    - [ ] JWT RS256 전환 + refresh token server-side blacklist
    - [ ] Oracle Cloud / AWS 배포 + Caddy TLS

---

## 📑 Documents

- [💡 Ideation & Brainstorming](./docs/Ideation.md) — 초기 아이디어와 문제 정의
- [📝 Project Scenario & Specs](./docs/Project_Scenario.md) — 페르소나 시나리오 + 기능 명세
- [⚖️ Team Ground Rules](./docs/GroundRules.md) — 협업 가이드라인
- [🧪 Integration Test Guide](./docs/INTEGRATION_TEST_GUIDE.md) — E2E 검증 시나리오
- [📋 Work Log](./docs/WORK_LOG.md) — 개발 일지

---

## 👥 Team

**Team 12 HABITS** — 캡스톤디자인 그로쓰
- 양설아 (Team Leader, 2276186)
- Deng Yuanrong (2271003)
</content>
</invoke>