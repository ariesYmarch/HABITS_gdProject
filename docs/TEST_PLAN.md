# HABITS 통합 테스트 계획

## 목적
지금까지 만든 시스템(백엔드 + 프론트엔드 + Supabase + 외부 API)이 실 사용자 흐름에서 정상 동작하는지 단계적으로 검증.

## 전제 조건 (Prerequisite)
- `backend/.env` 모든 필수 키 채워짐 (Gemini 제외 OK)
- backend venv 활성화 가능 + DB(Supabase) 연결 정상
- frontend node_modules + iOS Pods (또는 Android Gradle) 설치됨
- 실행 가이드: `docs/INTEGRATION_TEST_GUIDE.md`

---

## 테스트 구조 (5 Phase)

| Phase | 영역 | 테스트 수 | 예상 시간 |
|-------|------|-----------|-----------|
| Phase A | 환경 점검 | 4개 | 10분 |
| Phase B | 인증/계정 | 6개 | 20분 |
| Phase C | 데이터 도메인 | 8개 | 40분 |
| Phase D | 피드백/리포트 | 5개 | 30분 |
| Phase E | 엣지 케이스 | 5개 | 30분 |
| **합계** | | **28개** | **약 2시간** |

핵심 경로(Critical Path) = Phase A → B → C → D 필수, Phase E는 시간 되면 진행.

---

## Phase A: 환경 점검 (10분)

목적: 백엔드/프론트엔드/외부 서비스가 모두 살아있는지 사전 확인.

### A-1. 백엔드 서버 시작 확인
- 터미널에서 `uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload` 실행
- `INFO: Application startup complete.` 로그 확인
- `INFO: Uvicorn running on http://0.0.0.0:8000` 확인
- **합격**: 에러 없이 시작 + scheduler 시작 로그 확인

### A-2. 헬스 체크 + OpenAPI
- 브라우저: `http://localhost:8000/`
- 응답 `{"message":"HABITS Server is Running!","env":"development"}`
- `http://localhost:8000/docs` (Swagger UI) → 26개 엔드포인트 표시
- **합격**: 두 응답 모두 정상

### A-3. Supabase 연결
- `python -c "from app.core.database import engine; from sqlalchemy import text; print(engine.connect().execute(text('SELECT 1')).scalar())"`
- **합격**: 1 출력

### A-4. Metro Bundler + 시뮬레이터 부팅
- `npm start` (frontend)
- `npx react-native run-ios` (또는 run-android)
- Splash 화면 노출 확인
- **합격**: 화면 진입 + RN 컴포넌트 렌더링 OK

발견된 이슈: ____________________________________________

---

## Phase B: 인증/계정 (20분)

목적: JWT 인증, refresh, 비밀번호 재설정, 회원 탈퇴 전체 흐름.

### B-1. 신규 회원가입
- 시뮬레이터에서 LoginScreen → "회원가입" 링크
- 입력: 새 이메일 (`test1@example.com`), 비밀번호 (`Pass1234`), 닉네임 (`tester1`)
- **합격**: 가입 성공 → 자동으로 다음 화면으로 이동 (로그인 안 됐으면 로그인 화면 그대로 유지면 fail)

### B-2. 중복 회원가입 차단
- 같은 이메일로 다시 가입 시도
- **합격**: "이미 사용 중인 이메일 또는 닉네임입니다" Alert 노출

### B-3. 비밀번호 형식 검증
- 가입 화면에서 7자만 입력
- 가입 화면에서 영문만 입력 (숫자 없음)
- **합격**: 가입 버튼 비활성 또는 "8자 이상, 영문+숫자" 안내 노출

### B-4. 잘못된 로그인
- 등록된 이메일 + 잘못된 비밀번호
- **합격**: "이메일 또는 비밀번호가 올바르지 않습니다" Alert

### B-5. 정상 로그인 + 자동 로그인
- 정상 로그인 → 메인 화면 (또는 온보딩) 진입
- 시뮬레이터에서 앱 강제 종료 (홈 버튼 두 번 → 위로 스와이프)
- 다시 앱 실행
- **합격**: 자동으로 로그인 상태 유지 (로그인 화면 안 나타남)

### B-6. 비밀번호 재설정 메일 발송
- 로그아웃
- LoginScreen → "비밀번호를 잊으셨나요?" → 가입한 이메일 입력
- 백엔드 콘솔 로그 확인 (개발 모드라 콘솔 출력)
- 또는 Resend 사용 시 가입 이메일 inbox 확인
- **합격**: "메일 발송 완료" Alert + 백엔드 콘솔에 reset URL 출력 (또는 메일 도착)

발견된 이슈: ____________________________________________

---

## Phase C: 데이터 도메인 (40분)

목적: 습관/일기/성격 등 핵심 데이터 + Local-First sync 동작.

### C-1. 온보딩 완주
- 신규 가입 후 온보딩 진입
- Welcome → NameInput → Guide → CurrentPersonalityTest (성격 검사 응답)
- → Transition → IdealPersonalityTest → ResultTagSelection
- → Occupation → TimetableSetup → HabitRecommendation → Completion
- **합격**: 모든 단계 진행, 마지막 Completion 후 메인 화면 진입

### C-2. 습관 추가
- 메인(Home)에서 새 습관 추가
- 제목/이모지/빈도/시간대/소요시간 입력
- **합격**: 습관 리스트에 추가됨, 화면 즉시 반영

### C-3. 습관 이행 체크
- 추가한 습관에 체크 (오늘)
- **합격**: 체크 표시 즉시 반영, completionHistory 업데이트

### C-4. 일기 작성
- DiaryWrite 진입 → 무드 슬라이더 + 감정 이모지 선택 + 텍스트 입력
- 저장
- **합격**: 일기 저장 성공, 리스트에 표시

### C-5. KoELECTRA 감정 분석 (텍스트 일기)
- 일기 텍스트가 있는 경우 자동으로 분석 호출
- HF API cold start 시 10-30초 대기 가능 (정상)
- **합격**: 감정 태그 또는 분석 결과 표시 (cold start로 1회는 빈 결과 가능, 두 번째는 정상)

### C-6. 자동 sync (로그인 직후)
- 백엔드 호출:
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test1@example.com","password":"Pass1234"}'
# → access_token 복사
curl http://localhost:8000/api/v1/sync/pull \
  -H "Authorization: Bearer <ACCESS>" | python3 -m json.tool
```
- **합격**: 시뮬레이터에서 추가한 habits/diaries가 응답에 포함

### C-7. Local-First 동작 (오프라인 → 온라인)
- 시뮬레이터의 네트워크 끊기 (iOS: Settings → Wi-Fi 끄기, 또는 메뉴에서 Network Link Conditioner)
- 습관 1개 추가 + 체크
- Wi-Fi 다시 켜기
- 5초 정도 대기 (debounce)
- 백엔드 sync/pull 호출 → 오프라인에서 추가한 데이터가 서버에 반영됐는지
- **합격**: 오프라인 변경사항이 자동으로 서버에 sync

### C-8. 회원 탈퇴 cascade
- 마이페이지 → 회원 탈퇴 (있으면)
- 또는 직접 API 호출: `DELETE /api/v1/auth/account`
- 다시 같은 이메일로 회원가입 가능해야 함
- **합격**: 탈퇴 성공 + Supabase에 해당 user_id 관련 모든 데이터 삭제 (cascade)

발견된 이슈: ____________________________________________

---

## Phase D: 피드백/리포트 (30분)

목적: 정적 템플릿/예외 감지/리포트 생성/만족도 평가.

### D-1. 데이터 부족 상태 (리포트 화면)
- 신규 사용자 (일기/습관 거의 없음)로 ReportScreen 진입
- 주간 탭 → "이번 주 리포트 생성하기" 클릭
- **합격**: "데이터가 부족하거나 이미 리포트가 존재" Alert 노출

### D-2. 데이터 충족 후 정적 리포트 생성
- 일기 3개 이상 + 활성 습관 1개 이상 만들고
- "이번 주 리포트 생성하기" 클릭
- **합격**: 리포트 카드 생성, model_used="static" (또는 static_fallback)

### D-3. 리포트 상세 모달
- 생성된 리포트 카드 클릭
- **합격**: 이행률 / 평균 감정 / 감정 분포 (있으면) / 인사이트 / 만족도 평가 위젯 노출

### D-4. 만족도 평가
- "좋아요/보통/아쉬워요" 중 하나 선택
- **합격**: "감사합니다" Alert → 모달 닫힘
- 백엔드 검증: `feedback_ratings` 테이블에 row 추가됐는지
```sql
SELECT * FROM feedback_ratings ORDER BY created_at DESC LIMIT 1;
```

### D-5. 졸업 후보 / 저이행률 제안 (조건부)
- 4주 사용 못 했으면 졸업 후보는 안 보일 수 있음 (정상)
- 단기 테스트로 저이행률만 확인:
  - 활성 습관 여러 개 + 이행률 30% 미만 상태에서 ReportScreen 진입
  - "이번 주 제안" 카드 노출 확인
- **합격**: 빈도 축소/습관 변경/유지 옵션 노출

발견된 이슈: ____________________________________________

---

## Phase E: 엣지 케이스 (30분)

목적: 인증 토큰 갱신, 충돌 해결, 시간대 이슈 등 비주류 시나리오.

### E-1. Access token 만료 → 자동 refresh
- 코드 임시 수정으로 access token 만료 시간을 1분으로 단축 (`config.py: ACCESS_TOKEN_EXPIRE_MINUTES=1`)
- 또는 jwt_handler에 1분짜리 토큰 강제 발급 헬퍼 추가
- 1분 이상 대기 후 API 호출
- **합격**: 자동으로 refresh → 새 access로 재시도 → 정상 응답
- 테스트 후 원복: `ACCESS_TOKEN_EXPIRE_MINUTES=15`

### E-2. Refresh token도 만료 → 강제 로그아웃
- 코드에서 refresh도 짧게 (1분) 설정
- 둘 다 만료된 후 API 호출
- **합격**: 자동으로 로그아웃 → LoginScreen으로 복귀

### E-3. Sync 충돌 (LWW)
- 시뮬레이터 A에서 같은 계정 로그인 → 습관 1 추가
- 백엔드에서 같은 client_id의 데이터를 다른 timestamp로 직접 PUSH
```bash
curl -X POST http://localhost:8000/api/v1/sync/push \
  -H "Authorization: Bearer <ACCESS>" \
  -H "Content-Type: application/json" \
  -d '{"habits":[{"client_id":"<HABIT_ID>","title":"덮어쓴 제목","hashtags":[],"frequency":"daily","updated_at":"2099-01-01T00:00:00+00:00"}]}'
```
- 시뮬레이터 풀다운 새로고침 (또는 강제 sync 트리거)
- **합격**: 시뮬레이터 화면에 "덮어쓴 제목"으로 업데이트 (서버 win)

### E-4. JITAI 트리거 확인
- 활성 습관 1개 + 3일 연속 미이행 (오늘 + 어제 + 그저께 모두 미체크)
- `GET /api/v1/jitai/check` 호출
- **합격**: `consecutive_miss` 트리거 + 메시지 노출

### E-5. 시뮬레이터 ↔ 실기기 (선택)
- 같은 계정으로 시뮬레이터 + 실기기 모두 로그인
- 한쪽에서 데이터 변경 → 다른 쪽 sync로 반영 확인
- **합격**: 양쪽 모두 동일 데이터로 수렴

발견된 이슈: ____________________________________________

---

## 합격 기준 정리

### 필수 (Critical Path)
모두 통과해야 배포 진행:
- A-1, A-2, A-4 (환경 OK)
- B-1, B-5 (회원가입 + 자동 로그인)
- C-1, C-2, C-4 (온보딩 + 습관 + 일기)
- C-6 (sync 동작)
- D-2, D-4 (리포트 + 만족도)

### 강력 권장
시간 되는 만큼:
- B-2, B-4, B-6 (인증 엣지)
- C-3, C-5 (이행 + KoELECTRA)
- D-1, D-3 (리포트 UX)

### 선택
- C-7 (오프라인)
- C-8 (탈퇴 cascade)
- D-5 (조건부 알림)
- Phase E 전체

---

## 발견 버그 기록 양식

각 테스트에서 실패가 나오면 아래 양식으로 기록:

```
- 테스트 ID: B-3
- 증상: 비밀번호 7자 입력 후 가입 버튼이 활성화 상태
- 재현 단계: 1. RegisterScreen → 2. password 필드에 "abc1234" 입력 → 3. 가입 버튼 회색 안 됨
- 콘솔 로그/스크린샷: (있으면 첨부)
- 추정 원인: 검증 함수 미적용 또는 length 비교 < vs <=
```

수집해서 한꺼번에 수정하면 효율적.

---

## 버그 픽스 사이클

1. Phase A → E 순서로 진행 (또는 핵심 경로만 먼저)
2. 발견 버그를 위 양식으로 기록 (3-5개 모이면 멈춤)
3. 같이 디버깅/수정
4. 같은 테스트 재시도
5. 모두 통과 시 다음 단계 (Oracle Cloud 배포)

---

## 다음 단계 (테스트 통과 후)

1. Oracle Cloud 인스턴스 발급 (사용자 작업)
2. DuckDNS 서브도메인 발급
3. Ubuntu/Docker/Caddy 셋업 (가이드 제공)
4. 백엔드 배포 + 모바일 앱 API URL 변경
5. 실배포 환경에서 Phase A~D 재검증
