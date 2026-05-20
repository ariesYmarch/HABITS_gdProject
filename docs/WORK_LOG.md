# HABITS 프로젝트 작업 트랙 리스트

최종 업데이트: 2026-05-01

## 현재 진행 상황

**백엔드 Phase 1 ~ Phase 4 모두 완료**, 사용자 작업(API 키 발급, 인프라 셋업) 대기 중.

엔드포인트 23개 모두 정상 동작 검증 완료.

---

## 1. 인프라/배포 결정 사항

| 항목 | 선택 | 이유 |
|------|------|------|
| 호스팅 | Oracle Cloud Always Free (서울 리전) | 영구 무료, 한국 latency 최저, ARM 24GB RAM |
| DB | Supabase (서울 리전, Session pooler) | PostgreSQL 무료, 자동 백업 |
| 도메인 | DuckDNS (무료 서브도메인) | 비용 0 |
| HTTPS | Caddy (자동 Let's Encrypt) | nginx + certbot보다 단순 |
| 이메일 | Resend (3000건/월 무료) | 비밀번호 재설정용 |
| 이식성 | Dockerfile + .env + Alembic | 호스팅 전환 시 환경변수만 옮기면 됨 |

## 2. 인증 정책 결정 사항

| 항목 | 결정 |
|------|------|
| 인증 방식 | JWT (access 15분 + refresh 7일) |
| 비밀번호 해싱 | bcrypt cost factor 12 |
| 회원가입 | 이메일 + 비밀번호 + 닉네임 (이메일 인증은 V1 생략) |
| 비밀번호 정책 | 8자 이상, 영문+숫자 조합 |
| 비밀번호 재설정 | 이메일 링크 방식 (Resend), 토큰 1시간 유효 |
| 회원 탈퇴 | 즉시 cascade delete (개인정보보호법 대응) |
| 동기화 전략 | Local-First + Server Backup (전략 B), LWW + timestamp |
| OAuth | V2에서 카카오/구글 추가 |

## 3. 백엔드 완료 작업 (Phase 1-4)

### Phase 1: 데이터 + 피드백 시스템

**Phase 1-1: 서버 동기화 (Local-First + Server Backup)**
- 모든 sync 대상 모델에 `client_id`, `updated_at`, `deleted_at` 추가
- `GET /api/v1/sync/pull?since=...` - 변경된 데이터만 받기
- `POST /api/v1/sync/push` - LWW 충돌 해결, 충돌 항목 응답에 포함
- LWW: client.updated_at vs server.updated_at, 최신 채택
- 모든 FK에 ondelete CASCADE + passive_deletes
- 프론트 `services/sync.ts` SyncManager + 로그인 후 자동 sync

**Phase 1-2: 인사이트 노출 조건**
- `app/analytics/conditions.py` - 데이터 충족 여부 판단
- 주간: 일기 3개 이상 + 활성 습관 1개 이상
- 월간: 일기 10개 이상 + 활성 습관 1개 이상
- 감정-이행률 상관: 분석된 일기 5개 이상

**Phase 1-3: 정적 피드백 템플릿**
- `app/feedback/templates.py` - 단일 감정 24개 + 조합 6개 + valence fallback + 감정없음
- `app/feedback/selector.py` - 분포 기반 선택 (single/combo/valence/needs_dynamic)
- 임계값: 단일 0.5, 조합 0.2, 3개 이상 = needs_dynamic

**Phase 1-4: 예외 패턴 감지**
- `app/feedback/exceptions.py` - 3가지 OR 평가
- (1) 이행률-감정 역전: 80%+ AND 부정 0.5+ / 30%- AND 긍정 0.7+
- (2) 감정 변동성: mood_score 표준편차 > 0.4
- (3) 복합 감정 3개 이상 (confidence 0.2+)

**Phase 1-5: Gemini 동적/정적 분기**
- `app/services/gemini.py` - Gemini 2.0 Flash 호출, 키 없으면 None 반환
- `app/analytics/aggregation.py` - 주간/월간 데이터 집계
- `app/routers/feedback.py` - `GET /weekly`, `GET /monthly`
- 분기 흐름: 충족 검사 → 집계 → 예외 OR needs_dynamic 시 Gemini → 실패 시 정적 fallback

**Phase 1-6: JITAI**
- `app/jitai/triggers.py` - 3가지 신호
- (1) 연속 미이행 3일 이상
- (2) 부정 감정 streak (최근 3개 일기 중 2/3 이상 부정 우세)
- (3) 시간대 이탈 (time_slot 마감 후 미이행)
- `GET /api/v1/jitai/check` - 트리거 리스트 반환

### Phase 2: 사용자 기능 (백엔드)

**Phase 2-7: 저이행률 제안**
- `app/feedback/suggestions.py` - `detect_low_completion_suggestion`
- 30% 미만 시 가장 미이행률 높은 habit에 대해 3가지 옵션 제시 (빈도 축소 / 습관 변경 / 유지)
- weekly feedback 응답에 `low_completion_suggestion` 포함

**Phase 2-8: 습관 졸업**
- `app/feedback/suggestions.py` - `detect_graduation_candidates`
- 4주 연속 90%+ 이행 AND 해당 habit 실천일에 긍정 감정 우세 50%+
- `GET /api/v1/habits/graduation-candidates`
- `POST /api/v1/habits/{id}/graduate` - 졸업 처리 (deactivate)

**Phase 2-9: 성격 유형 재검사**
- `app/routers/personality.py`
- `GET /api/v1/personality/retest-eligible` - 마지막 검사 후 28일 경과 여부
- `GET /api/v1/personality/comparison` - 가장 최근 2개 결과 비교 (delta tags)

**Phase 2-10: 리포트 만족도 평가**
- `FeedbackRating` 모델 추가 + Alembic 마이그레이션
- `POST /api/v1/feedback/rate` - good/neutral/bad + 출처 + 코멘트

### Phase 3: KoELECTRA 모델 작업

**Phase 3-11: 감정 키워드 사전**
- `app/feedback/keywords.py` - 8개 감정 × 30+개 키워드 (구어체·줄임말·신조어)
- `score_text_by_keywords` - 텍스트 → 감정 분포
- `merge_with_model_distribution` - KoELECTRA + 키워드 가중 평균

**Phase 3-12: KoELECTRA 평가 파이프라인**
- `app/ml/evaluator.py` - per-class precision/recall/F1, macro F1, 미달 클래스 식별
- `scripts/evaluate_koelectra.py` - CSV 입력 평가 CLI

**Phase 3-13: 파인튜닝 코드 템플릿** (사용자 Colab에서 실행)
- `scripts/finetune_koelectra.py` - AI Hub 라벨 리매핑 + WeightedTrainer (클래스 가중치 손실)
- 베이스: monologg/koelectra-base-v3-discriminator

**Phase 3-14: 점진적 모델 개선 파이프라인**
- `scripts/export_user_labels.py` - 사용자 직접 선택 태그 → 다음 파인튜닝 라운드 입력 JSONL

### Phase 4: 평가/검증 시스템

**Phase 4-15: Gemini Flash 출력 품질**
- `app/feedback/quality.py` - 자동 품질 체크
- 길이, 금지 표현(명령형), 인과 단정, 관찰적 표현, 따옴표/이모지 과다
- threshold 0.7 + 금지표현/인과단정 없음 = 통과

**Phase 4-16: Recombee 추천 검증**
- `app/services/recombee.py` - SDK wrapper (키 없으면 stub)
- `app/routers/recommendations.py`
  - `GET /api/v1/recommendations` - 추천 + 자동 로그
  - `POST /api/v1/recommendations/interaction` - accepted/rejected/completed 행동 로그 + Recombee로 신호 전송
  - `GET /api/v1/recommendations/metrics` - CTR, 채택 후 이행률

---

## 4. 프론트엔드 완료 작업 (인증)

- `store/slices/authSlice.ts` - accessToken 메모리 + refreshToken AsyncStorage + actions
- `services/api.ts` - 토큰 자동 첨부 + 401 → refresh 재시도 + race condition 방지
- 4개 Auth 스크린 (Login/Register/ForgotPassword/ResetPassword)
- `AuthNavigator` + `RootNavigator` 재구성 (Splash → Auth → Onboarding → Main)
- 자동 로그인 + 자동 sync
- 타입에 `updatedAt`, `deletedAt` 추가
- slice에 자동 timestamp + `upsertHabits` / `upsertDiaries` (LWW 머지)
- `services/sync.ts` SyncManager (pull/push/fullSync/schedulePush)

---

## 5. 등록된 엔드포인트 (총 23개)

```
auth        : register, login, logout, refresh, me, password-reset, password-reset/confirm, account 삭제
emotion     : analyze
feedback    : weekly, monthly, rate
habits      : graduation-candidates, graduate
jitai       : check
personality : comparison, retest-eligible
sync        : pull, push
recommendations : list, interaction, metrics
```

---

## 6. 남은 작업

### 6.1 사용자가 해야 하는 것

**API 키 발급 (2026-05-04 완료/보류)**
- HF Access Token: 발급 완료, 정상 동작 (`hf_vjvmB...`)
- Recombee Token: Production DB로 변경 후 정상 동작 (`habits-project-prod`, AP_SE)
- Resend API 키: 발급 완료, prefix OK (`re_5gYu2...`). 도메인 인증은 V2
- Gemini API 키: **보류** (신규 프로젝트 `habits-pro`에 403/429 정책 제한 발생)
  - 정적 피드백 + 키워드 사전 + 예외 패턴 감지로 V1 운영 가능
  - 추후 결제 계정 추가 또는 시간 두고 재시도

**인프라 (배포 직전)**
- Oracle Cloud Always Free 계정 + ARM 인스턴스 프로비저닝
- DuckDNS 서브도메인 발급 + Oracle Cloud IP 연결

### 6.2 코드 작업 완료 (2026-05-04)

- Phase 2 프론트 UI 통합 완료
  - ReportScreen: 탭(주간/월간), 리포트 카드, 상세 모달, 만족도 평가 위젯
  - 저이행률 제안 카드 (ReportScreen 상단)
  - 졸업 후보 알림 (ReportScreen 상단)
  - PersonalityRetestCard (MyPageScreen 통합)

- 자동 리포트 생성 시스템 추가
  - apscheduler: 매주 월요일 00:05 KST + 매월 1일 00:05 KST
  - `app/services/report_generator.py`, `app/services/scheduler.py`
  - `app/routers/reports.py` (list/get/generate-now)

- 외부 서비스 검증
  - HF, Recombee, Resend OK (Gemini는 정적 폴백으로 운영)

### 6.3 다음 작업 (현재 진행 가능)

**로컬 시뮬레이터 통합 테스트**
- 회원가입 → 온보딩 → 습관 추가 → 일기 → 리포트 생성 → 만족도 평가 전체 흐름 검증
- 백엔드: `cd backend && source venv/bin/activate && uvicorn app.main:app --reload`
- 프론트: `cd frontend && npm start` + iOS/Android 시뮬레이터

**인프라 배포 (마지막)**
- VCN/Security List 설정
- Ubuntu 시스템 설정 (Docker, swap, ufw)
- Caddy 리버스 프록시 (자동 HTTPS)
- Docker Compose 배포

### 6.4 V2
- OAuth 소셜 로그인 (카카오/구글)
- 수익 모델 (광고 + 프리미엄 구독)
- Gemini 결제 계정 추가 후 동적 피드백 활성화
- Resend 도메인 인증

---

## 7. 신규 생성/수정 파일 (Phase 1-4)

### 신규
```
backend/
  Dockerfile, .dockerignore
  alembic/env.py, alembic.ini, alembic/versions/*.py (4개 마이그레이션)
  app/
    auth/        - password.py, jwt_handler.py, dependencies.py, schemas.py
    routers/     - auth.py, feedback.py, habits.py, jitai.py, personality.py, recommendations.py
    services/    - email.py, gemini.py, recombee.py
    sync/        - schemas.py, router.py
    analytics/   - conditions.py, aggregation.py
    feedback/    - constants.py, templates.py, selector.py, exceptions.py, suggestions.py, keywords.py, quality.py
    ml/          - evaluator.py
    jitai/       - triggers.py
    models/      - feedback_rating.py
  scripts/       - evaluate_koelectra.py, finetune_koelectra.py, export_user_labels.py

frontend/
  src/
    store/slices/   - authSlice.ts
    screens/auth/   - LoginScreen.tsx, RegisterScreen.tsx, ForgotPasswordScreen.tsx, ResetPasswordScreen.tsx
    navigation/     - AuthNavigator.tsx
    services/       - sync.ts (신규)

docs/
  WORK_LOG.md (이 파일)
```

### 수정
```
backend/
  requirements.txt (auth 패키지 추가, torch/transformers 제거)
  app/main.py (라우터 다수 등록, CORS 미들웨어)
  app/core/config.py (pydantic-settings 기반 리팩토링)
  app/core/database.py (SQLite 제거, pool 설정)
  app/models/* (sync 필드 + ondelete CASCADE)

frontend/
  src/types/habit.ts, types/diary.ts, types/navigation.ts (sync 필드 + Auth 스택)
  src/services/api.ts (인터셉터 강화)
  src/store/index.ts (authSlice 등록 + partialize)
  src/store/slices/habitSlice.ts, slices/diarySlice.ts (updatedAt + upsert)
  src/navigation/RootNavigator.tsx (Auth 라우팅 + 자동 sync)
```

---

## 8. 환경 정보

- Python: 3.12.12 (venv)
- PostgreSQL: 17.6 (Supabase 서울 리전)
- 주요 패키지
  - fastapi 0.104.1, uvicorn 0.24.0, sqlalchemy 2.0.23, alembic 1.12.1
  - bcrypt 4.0.1 (passlib 호환), python-jose 3.3.0, passlib 1.7.4
  - resend 0.7.0, recombee-api-client 4.1.0
