# 로컬 통합 테스트 가이드

작성: 2026-05-04

지금까지 만든 시스템(백엔드 + 프론트엔드 + Supabase + 외부 API)이 실제 사용 흐름에서 잘 동작하는지 확인하는 단계.

## 0. 사전 준비 (최초 1회만)

### 백엔드
이미 venv + 의존성 설치 완료. `.env`에 키들 채워져 있음.

### 프론트엔드
- node_modules, iOS Pods, Android Gradle 모두 셋업 완료

### 시뮬레이터
- iOS: macOS + Xcode 설치 (이미 있을 것)
- Android: Android Studio + AVD 만들어두었으면 사용

---

## 1. 백엔드 서버 실행

터미널 1 (백엔드 전용으로 띄워두기):

```bash
cd /Users/s_yang/HABITS_gdProject/backend
source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

확인:
- 다른 브라우저나 터미널에서 http://localhost:8000 → `{"message":"HABITS Server is Running!"}` 보이면 OK
- 스케줄러 시작 로그: `[scheduler] started` (`logging.basicConfig(level=logging.INFO)` 추가하면 보임)

**중요**: `--host 0.0.0.0`을 줘야 Android Emulator에서 `10.0.2.2`로 접근 가능.

---

## 2. 프론트엔드 실행

### 2-1. Metro Bundler 시작 (터미널 2)

```bash
cd /Users/s_yang/HABITS_gdProject/frontend
npm start
```

또는 캐시 초기화 필요하면:
```bash
npm start -- --reset-cache
```

### 2-2. iOS Simulator 실행 (터미널 3)

```bash
cd /Users/s_yang/HABITS_gdProject/frontend
npx react-native run-ios
```

또는 특정 시뮬레이터 지정:
```bash
npx react-native run-ios --simulator="iPhone 15 Pro"
```

### 2-3. Android Emulator 실행 (대신 Android로 테스트하는 경우)

먼저 Android Studio에서 AVD Manager로 에뮬레이터 띄우기. 그 후:

```bash
cd /Users/s_yang/HABITS_gdProject/frontend
npx react-native run-android
```

---

## 3. 테스트 시나리오 (전체 흐름)

### 시나리오 A: 신규 사용자 풀 흐름

1. **앱 시작** → Splash 화면
2. **회원가입**
   - LoginScreen → "회원가입" 링크 클릭
   - 이메일/비밀번호(8자+영문+숫자)/닉네임 입력
   - 가입 완료 → 자동 로그인 → 온보딩 진입

3. **온보딩 완주**
   - Welcome → NameInput → Guide → CurrentPersonalityTest → Transition → IdealPersonalityTest → ResultTagSelection → Occupation → TimetableSetup → HabitRecommendation → Completion
   - 완료 후 메인 화면 진입

4. **습관 추가**
   - HomeScreen에서 새 습관 생성

5. **이행 체크**
   - 추가한 습관에 체크 (이행 기록 생성)

6. **일기 작성**
   - DiaryWrite 화면에서 무드/감정 태그/텍스트 입력
   - KoELECTRA 감정 분석이 백엔드에서 호출되어야 함 (텍스트가 있는 경우)

7. **리포트 화면**
   - "이번 주 리포트 생성하기" 버튼 클릭
   - 데이터가 충분하면 리포트 카드 생성됨
   - 카드 클릭 → 상세 모달
   - 만족도 평가 클릭 (좋아요/보통/아쉬워요)

8. **마이페이지**
   - PersonalityRetestCard 보임 (재검사 가능 여부 표시)
   - 28일 안 됐으면 "마지막 검사 후 N일 경과" 표시

### 시나리오 B: 데이터 sync 검증

1. **로그인 상태에서 습관 1개 추가**
2. **백엔드에서 직접 조회**:
   ```bash
   # 다른 터미널에서
   curl -X POST http://localhost:8000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"본인이메일","password":"본인비밀번호"}'
   # access token 복사
   
   curl http://localhost:8000/api/v1/sync/pull \
     -H "Authorization: Bearer 복사한_토큰" | python3 -m json.tool
   ```
   → 방금 추가한 습관이 응답에 있어야 함

3. **앱 강제 종료 후 재시작**
   - 자동 로그인 + 자동 sync (RootNavigator의 useEffect)
   - 로그 확인: `[sync] 초기 sync 실패` 같은 메시지 없어야 함

### 시나리오 C: 인증 토큰 갱신

1. **15분 이상 앱 사용 후 API 호출**
   - access token이 만료됐을 때 자동으로 refresh 호출 → 새 access로 재시도되는지 확인
   - Network 인터셉터 로그 확인

---

## 4. 자주 발생하는 이슈 + 디버깅

### 이슈 1: "Network Error" 또는 "Failed to fetch"
- 원인: 백엔드 서버 안 떠있거나, URL 매칭 안 됨
- 확인:
  - 백엔드가 `--host 0.0.0.0`로 떠있는지
  - iOS simulator → `localhost:8000` 정상
  - Android emulator → `10.0.2.2:8000` 정상 (`services/api.ts`에서 자동)

### 이슈 2: 로그인 후 화면 전환 안 됨
- 원인: AsyncStorage 권한 문제 또는 Zustand persist 충돌
- 디버깅: React Native Debugger에서 store 상태 확인

### 이슈 3: 일기 작성 시 감정 분석 실패
- 원인: HF API cold start (10-30초 대기 가능)
- 정상: `app/core/emotion.py`에서 max_retries=3, 30초 대기 로직 있음
- 너무 오래 걸리면 빈 결과 반환됨 (정상)

### 이슈 4: 리포트 생성 "데이터 부족"
- 주간 인사이트는 일기 3개 이상 + 활성 습관 1개 이상 필요
- 일기 더 추가 후 재시도

### 이슈 5: Metro 캐시 이슈
- `npm start -- --reset-cache`로 재시작
- iOS: `cd ios && pod install` 한 번 더 시도

### 이슈 6: Supabase 연결 실패
- IP가 변경됐거나 와이파이 환경이 IPv6만 지원하는 경우
- `.env`의 DATABASE_URL이 Session pooler 형식인지 재확인

---

## 5. 검증 체크리스트

핵심 기능별 동작 여부:

- [ ] 회원가입 (이메일/비밀번호/닉네임)
- [ ] 로그인 (이메일/비밀번호)
- [ ] 자동 로그인 (앱 재시작 시)
- [ ] 비밀번호 재설정 메일 (개발 콘솔에 reset URL 출력 확인)
- [ ] 온보딩 완주 (성격 테스트 + 일정 + 추천)
- [ ] 습관 추가/체크/삭제
- [ ] 일기 작성 (mood + 이모지 + 텍스트)
- [ ] 일기 작성 시 감정 분석 결과 표시
- [ ] 리포트 화면 진입 + 빈 상태 표시
- [ ] "이번 주 리포트 생성하기" 클릭 → 카드 생성
- [ ] 리포트 상세 모달 (이행률/감정 분포/인사이트)
- [ ] 만족도 평가 클릭 → 저장 confirm
- [ ] 마이페이지 → PersonalityRetestCard 표시
- [ ] 졸업 후보 카드 (4주 이상 사용해야 보임 - 단기엔 안 보임)
- [ ] 저이행률 제안 카드 (이행률 30% 미만일 때)
- [ ] 회원 탈퇴 → 로그인 화면으로 복귀

---

## 6. 다음 단계

통합 테스트 통과되면:
1. Oracle Cloud 계정 시도 (capacity 이슈 미리 확인)
2. 발견된 버그 수정
3. 인프라 셋업 → 배포

발견되는 버그/이슈는 메모해두고 한꺼번에 수정.
