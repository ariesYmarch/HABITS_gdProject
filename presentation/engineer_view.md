# 3. 목표 및 해결방안 — Engineer View

---

## 솔루션 1: 사용자 맞춤 습관 추천

### Feature 1-1. 성격 유형 기반 습관 매칭
- 80개 해시태그(4카테고리) × 22개 성격 유형 매칭 알고리즘
- 이원화 성격 테스트: '현재의 나'와 '이상적인 나' Gap 분석
- Gap을 메우는 습관을 우선 추천

### Feature 1-2. Context-Aware 상황 인식 추천 (Recombee)
- 22개 상황 컨텍스트 기반 Multi-Factor 스코어링
- score = contextBonus × tagBonus × difficultyBonus
- Cold Start: 해시태그 기반 콘텐츠 필터링 (Recombee ReQL)
- Warm Start: 행동 로그 기반 협업 필터링으로 전환

### Feature 1-3. 124개 습관 템플릿 데이터베이스
- 10개 카테고리, 난이도 1~3 계층화
- 각 템플릿에 수행 상황(contexts) · 강화 태그(strengthenTags) · 예상 소요시간 매핑

---

## 솔루션 2: 감정-습관 통합 관리

### Feature 2-1. 일기 기반 감정 분석 엔진 (HuggingFace KoELECTRA)
- 8종 감정 분류 (기쁨 · 평온 · 뿌듯 · 희망 · 슬픔 · 짜증 · 불안 · 피로)
- 3단계 분석: 키워드 매칭 → 부호 보정(ㅠ, !, ?) → 정규화
- HuggingFace KoELECTRA 모델 연동 설계 (monologg/koelectra-base-finetuned-emotion)

### Feature 2-2. 감정-이행률 상관관계 분석
- 일기 작성 시점의 감정과 주간 습관 이행률 교차 추적
- 부정 감정 빈도 ↑ → 이행률 하락 패턴 감지
- 적응형 목표 조정 트리거 연동

### Feature 2-3. 4단계 습관 코칭 파이프라인
- 온보딩 → 상황 인식 추천 → 이행 관리 → 동적 피드백 루프
- 성격 분석 → 습관 추천 → 감정 기록 → 피드백의 순환 구조

---

## 솔루션 3: 데이터 기반 피드백

### Feature 3-1. AI 적응형 코칭 메시지 생성 (OpenAI GPT-4o-mini)
- SDT(자기결정이론) 기반 프롬프트 엔지니어링
- '실패'를 '조정'으로 리프레이밍하는 공감적 코칭 톤
- API + 로컬 폴백 이중 구조 (Graceful Degradation)

### Feature 3-2. 70% 임계값 기반 동적 목표 조정
- 이행률 < 30% → FREQUENCY_DOWN (목표 하향)
- 이행률 30~70% → KEEP (유지 격려)
- 이행률 ≥ 70% → LEVEL_UP (난이도 상향)
- 부정 감정 감지 시 임계값 완화 (50% 미만 → 즉시 하향 제안)

### Feature 3-3. 성장 데이터 시각화 및 성찰 유도
- 주간/월간 이행률 · 감정 변화 추이 대시보드
- 일기 → 감정 분석 → 해당 주간 피드백에 반영
- 캘린더 뷰에서 습관 완료 + 감정 이모지 동시 표시
