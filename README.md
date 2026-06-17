# HABITS
> AI 기반 심리 맞춤형 습관 코칭 서비스 | 그로쓰 트랙 12팀

"점이 이어져 선이 되고, 선이 이어져 면이 되듯 — 꾸준한 실천은 습관이 되고, 습관은 사람을 만든다."

[![React Native](https://img.shields.io/badge/Frontend-React%20Native%200.84-61DAFB?logo=react)](https://reactnative.dev/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%200.104-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/DB-PostgreSQL-336791?logo=postgresql)](https://www.postgresql.org/)
[![Gemini](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-orange?logo=google)](https://deepmind.google/technologies/gemini/)
[![Status](https://img.shields.io/badge/Status-Deployed-brightgreen)]()

---

## Demo Video

https://youtu.be/ee_aI8e--zQ

---

## Overview

**HABITS**는 사용자의 심리 성향(5x4 Big-Five 기반 진단)과 일기 기반 감정 분석을 결합해 개인 맞춤형 습관을 추천하고, 장기 성장을 추적하는 AI 코칭 앱입니다.

핵심 차별점:
- 성격 진단(20개 문항) x 이상향 태그로 콜드 스타트 없이 즉시 추천
- KoELECTRA + 한국어 키워드 사전 하이브리드 감정 분석 (7감정)
- Gemini 2.5 Flash 기반 주간 리포트 서사 생성 및 동적 피드백
- Local-First 아키텍처 (LWW + tombstone) + 배포 백엔드 동기화

---

## How to Install

### Prerequisites

| 항목 | 버전 |
|------|------|
| Node.js | 18 이상 |
| Python | 3.11 이상 |
| Xcode | 15 이상 (iOS 빌드 시) |
| CocoaPods | 1.14 이상 (iOS 빌드 시) |
| Android Studio | Hedgehog 이상 (Android 빌드 시) |

### 1. 저장소 클론

```bash
git clone https://github.com/[org]/HABITS_gdProject.git
cd HABITS_gdProject
```

### 2. Backend 의존성 설치

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Frontend 의존성 설치

```bash
cd frontend
npm install

# iOS 전용 (macOS 한정)
cd ios && pod install && cd ..
```

---

## How to Build & Run

### Backend

`.env` 파일을 `backend/` 디렉토리에 생성합니다.

```
DATABASE_URL=postgresql+psycopg2://<user>:<password>@<host>:<port>/<db>
SECRET_KEY=<임의의 랜덤 문자열 32자 이상>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7
GEMINI_API_KEY=<Google AI Studio에서 발급>
HF_API_TOKEN=<HuggingFace Inference API 토큰>
RESEND_API_KEY=<Resend 이메일 서비스 키 - 이메일 인증 기능 사용 시>
```

DB 마이그레이션 후 서버 실행:

```bash
cd backend
source venv/bin/activate
alembic upgrade head
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Swagger 문서: `http://localhost:8000/docs`

### Frontend

`frontend/src/services/api.ts`에서 `BASE_URL`을 로컬 또는 배포 서버 주소로 설정합니다.

**iOS 시뮬레이터:**
```bash
cd frontend
npx react-native run-ios --simulator "iPhone 16 Pro"
```

**Android 에뮬레이터:**
```bash
cd frontend
npx react-native run-android
```

**실제 기기 (iOS):**
```bash
cd frontend
npx react-native run-ios --device
```

---

## Database Description

PostgreSQL 8테이블 구조입니다. Alembic으로 마이그레이션 관리합니다.

| 테이블 | 역할 | 주요 컬럼 |
|--------|------|-----------|
| `users` | 계정 및 인증 | id, email, password_hash, created_at |
| `personality` | 5x4 성격 진단 결과 | user_id, mbti_like_score, ideal_tags (JSON) |
| `schedule` | 생활 패턴 | user_id, wake_time, sleep_time, commute_min |
| `habits` | 습관 목록 | id, user_id, title, category, frequency, deleted_at |
| `diaries` | 일기 기록 | id, user_id, content, created_at, deleted_at |
| `emotion` | 감정 분석 결과 | diary_id, top_emotion, confidence, emotions_json |
| `reports` | 주간/월간 리포트 | id, user_id, period_start, narrative (TEXT) |
| `recommendations` | 추천 습관 이력 | id, user_id, kind, habit_data (JSON), created_at |

주요 설계 포인트:
- `deleted_at` tombstone으로 soft delete 구현 (LWW 동기화 충돌 해결)
- `emotion.emotions_json`에 전체 7감정 점수 저장 (재분석 없이 상관관계 집계)
- `recommendations.kind`로 일반 추천(`habit`) / 휴식 제안(`rest_choice`) 분기
- Row Level Security(RLS) 활성화 (Supabase)

---

## System Architecture

```
[React Native App]
      |
      | HTTPS (JWT Bearer)
      v
[FastAPI Backend] ---- [Supabase PostgreSQL]
      |
      |-- [HuggingFace Inference API] : KoELECTRA 감정 분석
      |-- [Gemini 2.5 Flash API]      : 리포트 서사, 피드백, 습관 추천
      |-- [APScheduler]               : 주간 리포트 자동 생성 (매주 월요일)
      |-- [Resend]                    : 이메일 인증 발송

[Deployment]
  - Backend : Oracle Cloud Always Free (서울, ARM A1 4OCPU/24GB)
  - TLS     : Caddy + DuckDNS (Let's Encrypt 자동 갱신)
  - DB      : Supabase Session Pooler (PostgreSQL 15)
```

---

## Tech Stack & Open Source

### Frontend

| 라이브러리 | 버전 | 용도 |
|-----------|------|------|
| react-native | 0.84.1 | 크로스 플랫폼 앱 프레임워크 |
| typescript | 5.x | 정적 타입 |
| zustand | 5.x | 전역 상태 관리 |
| @react-navigation/native | 7.x | 화면 라우팅 |
| @react-navigation/bottom-tabs | 7.x | 탭 내비게이션 |
| @react-navigation/native-stack | 7.x | 스택 내비게이션 |
| react-native-async-storage | 2.x | 로컬 영속 스토리지 |
| react-native-calendars | 1.x | 습관 캘린더 UI |
| lucide-react-native | 0.x | 아이콘 |
| date-fns | 4.x | 날짜 연산 |
| axios | 1.x | HTTP 클라이언트 |

### Backend

| 라이브러리 | 버전 | 용도 |
|-----------|------|------|
| fastapi | 0.104.1 | 비동기 REST API 프레임워크 |
| uvicorn | 0.24.0 | ASGI 서버 |
| sqlalchemy | 2.0.23 | ORM |
| alembic | 1.12.1 | DB 마이그레이션 |
| psycopg2-binary | 2.9.9 | PostgreSQL 드라이버 |
| pydantic | 2.5.2 | 데이터 검증 |
| python-jose | 3.3.0 | JWT 생성/검증 |
| passlib + bcrypt | 1.7.4 / 4.0.1 | 비밀번호 해싱 (cost 12) |
| apscheduler | 3.10.4 | 주간 리포트 스케줄러 |
| requests | 2.31.0 | HuggingFace API 호출 |
| slowapi | 0.1.9 | API Rate Limiting |
| resend | 0.7.0 | 이메일 인증 |

### AI / External API

| 서비스 | 용도 |
|--------|------|
| monologg/koelectra-base-v3-discriminator (HuggingFace) | 한국어 7감정 분류 |
| Gemini 2.5 Flash (Google AI) | 리포트 서사 생성, 동적 피드백, 개인화 추천 |

---

## Project Structure

```
HABITS_gdProject/
├── backend/
│   ├── app/
│   │   ├── analytics/       # Mood x Habit 상관관계 분석
│   │   ├── auth/            # JWT 인증, 이메일 인증
│   │   ├── core/            # 설정, 보안, DB 세션
│   │   ├── feedback/        # 진단 매트릭스, 서사 생성, 상수
│   │   ├── jitai/           # Just-in-Time Adaptive Intervention
│   │   ├── ml/              # KoELECTRA 래퍼, 감정 분석 파이프라인
│   │   ├── models/          # SQLAlchemy ORM 모델 (8테이블)
│   │   ├── routers/         # API 엔드포인트
│   │   ├── services/        # Gemini, 리포트 생성기
│   │   ├── sync/            # LWW 동기화 엔진
│   │   └── main.py
│   ├── alembic/             # DB 마이그레이션
│   ├── prompts/             # Gemini 프롬프트 템플릿
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── components/      # calendar, diary, feedback, habit, report...
│       ├── screens/         # auth, diary, feedback, home, onboarding, report...
│       ├── services/        # API 호출 레이어
│       ├── store/           # Zustand 슬라이스 (auth, habit, diary, schedule...)
│       └── types/
└── docs/
    ├── HABITS_최종보고서.md
    └── HABITS_제품설명서.md
```

---

## Key Features

1. **성격 진단 및 이상향 설정** - 20문항 5x4 매트릭스, 이상향 태그 선택
2. **AI 습관 추천** - Gemini 기반 개인화 추천 (cold-start 없음)
3. **습관 수행 추적** - 캘린더 뷰, 타이머, 완료율 집계
4. **일기 + 감정 분석** - KoELECTRA 70% + 키워드 사전 30% 하이브리드
5. **주간 리포트** - Gemini 서사 생성, Mood x Habit 상관관계 분석
6. **동적 피드백** - 이행률/감정 패턴 기반 습관 강도 조절 제안
7. **졸업 판정** - 4주 연속 90% 이상 + 긍정 감정 50% 이상
8. **Local-First 동기화** - 오프라인 우선, LWW 충돌 해결, 5초 디바운스

---

## Roadmap

- [x] 성격 진단 및 온보딩 (Phase 1)
- [x] 습관 CRUD 및 캘린더 추적 (Phase 2)
- [x] 일기 작성 및 KoELECTRA 감정 분석 (Phase 2)
- [x] 주간 리포트 (Gemini 서사 + 통계) (Phase 2)
- [x] Gemini 개인화 추천 엔진 (Phase 3)
- [x] Mood x Habit 상관관계 분석 (Phase 3)
- [x] Oracle Cloud 배포 + Caddy TLS (Phase 3)
- [x] Local-First LWW 동기화 (Phase 3)
- [ ] FCM 푸시 알림 (인프라 준비 완료, 미연결)
