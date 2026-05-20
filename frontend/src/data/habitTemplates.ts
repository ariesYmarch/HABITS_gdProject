// habitTemplates.ts
// 200 habit templates — strengthenTags drawn from the 36 personality hashtags

import type {
  HabitTemplateItem,
  HabitTemplateCategory,
  HabitContext,
  HabitRecommendation,
} from '../types/habit';

// ---------------------------------------------------------------------------
// Context info map
// ---------------------------------------------------------------------------
export const HABIT_CONTEXT_INFO: Record<HabitContext, { emoji: string; label: string }> = {
  wakeUp:       { emoji: '\u{1F305}', label: '기상' },
  morning:      { emoji: '\u2600\uFE0F', label: '아침' },
  beforeOut:    { emoji: '\u{1F6AA}', label: '외출전' },
  commute:      { emoji: '\u{1F687}', label: '이동' },
  work:         { emoji: '\u{1F4BC}', label: '업무' },
  lunch:        { emoji: '\u{1F37D}\uFE0F', label: '점심' },
  study:        { emoji: '\u{1F4DA}', label: '학습' },
  leisure:      { emoji: '\u{1F3AE}', label: '여가' },
  hobby:        { emoji: '\u{1F3A8}', label: '취미' },
  exercise:     { emoji: '\u{1F4AA}', label: '운동' },
  meal:         { emoji: '\u{1F957}', label: '식사' },
  daily:        { emoji: '\u{1F4C5}', label: '일상' },
  relationship: { emoji: '\u{1F465}', label: '관계' },
  mindset:      { emoji: '\u{1F9E0}', label: '마인드' },
  rest:         { emoji: '\u{1F634}', label: '휴식' },
  beforeBed:    { emoji: '\u{1F319}', label: '취침전' },
  evening:      { emoji: '\u{1F306}', label: '저녁' },
  finance:      { emoji: '\u{1F4B0}', label: '재무' },
  lifestyle:    { emoji: '\u{1F3E0}', label: '라이프' },
  weekly:       { emoji: '\u{1F4C6}', label: '주간' },
  monthly:      { emoji: '\u{1F5D3}\uFE0F', label: '월간' },
  weekend:      { emoji: '\u{1F334}', label: '주말' },
};

// ---------------------------------------------------------------------------
// Category info map
// ---------------------------------------------------------------------------
export const HABIT_CATEGORY_INFO: Record<HabitTemplateCategory, { emoji: string; label: string }> = {
  morningRitual: { emoji: '\u{1F305}', label: '모닝 리추얼' },
  commute:       { emoji: '\u{1F687}', label: '통근/이동' },
  productivity:  { emoji: '\u26A1',    label: '생산성' },
  learning:      { emoji: '\u{1F4D6}', label: '학습/자기계발' },
  health:        { emoji: '\u{1F49A}', label: '건강' },
  relationship:  { emoji: '\u{1F495}', label: '관계' },
  mindset:       { emoji: '\u{1F9D8}', label: '마인드셋/멘탈' },
  finance:       { emoji: '\u{1F48E}', label: '재무/라이프스타일' },
  evening:       { emoji: '\u{1F319}', label: '취침 전/저녁' },
  periodic:      { emoji: '\u{1F4CA}', label: '주간/월간 리추얼' },
};

function catEmoji(category: HabitTemplateCategory): string {
  return HABIT_CATEGORY_INFO[category].emoji;
}

// ---------------------------------------------------------------------------
// 200 Habit Templates
// ---------------------------------------------------------------------------
export const HABIT_TEMPLATES: HabitTemplateItem[] = [
  // ========== Morning Ritual (25) ==========
  { id: 1, title: '침대 정리하기', emoji: catEmoji('morningRitual'), category: 'morningRitual', contexts: ['wakeUp'], strengthenTags: ['#성실', '#계획적'], estimatedMinutes: 2, difficulty: 1 },
  { id: 2, title: '알람 울리고 바로 일어나기', emoji: catEmoji('morningRitual'), category: 'morningRitual', contexts: ['wakeUp'], strengthenTags: ['#추진력', '#주도적'], estimatedMinutes: 1, difficulty: 2 },
  { id: 3, title: '미지근한 물 한 잔 마시기', emoji: catEmoji('morningRitual'), category: 'morningRitual', contexts: ['wakeUp'], strengthenTags: ['#성실', '#현실적'], estimatedMinutes: 1, difficulty: 1 },
  { id: 4, title: '"오늘도 좋은 하루" 자기암시 말하기', emoji: catEmoji('morningRitual'), category: 'morningRitual', contexts: ['wakeUp'], strengthenTags: ['#낙관적', '#단단함'], estimatedMinutes: 1, difficulty: 1 },
  { id: 5, title: '창문 열고 환기하기', emoji: catEmoji('morningRitual'), category: 'morningRitual', contexts: ['wakeUp'], strengthenTags: ['#활기', '#성찰적'], estimatedMinutes: 1, difficulty: 1 },
  { id: 6, title: '1분간 전신 스트레칭하기', emoji: catEmoji('morningRitual'), category: 'morningRitual', contexts: ['wakeUp'], strengthenTags: ['#유연함', '#활기'], estimatedMinutes: 1, difficulty: 1 },
  { id: 7, title: '양치하며 스쿼트 10회', emoji: catEmoji('morningRitual'), category: 'morningRitual', contexts: ['wakeUp'], strengthenTags: ['#효율적', '#끈기'], estimatedMinutes: 3, difficulty: 2 },
  { id: 8, title: '오늘 가장 중요한 목표 3가지 적기', emoji: catEmoji('morningRitual'), category: 'morningRitual', contexts: ['wakeUp'], strengthenTags: ['#계획적', '#성취지향'], estimatedMinutes: 3, difficulty: 2 },
  { id: 9, title: '아침 식사 챙겨 먹기', emoji: catEmoji('morningRitual'), category: 'morningRitual', contexts: ['morning'], strengthenTags: ['#성실', '#현실적'], estimatedMinutes: 15, difficulty: 2 },
  { id: 10, title: '유산균/영양제 챙겨 먹기', emoji: catEmoji('morningRitual'), category: 'morningRitual', contexts: ['morning'], strengthenTags: ['#계획적', '#신중함'], estimatedMinutes: 1, difficulty: 1 },
  { id: 11, title: '스마트폰 보지 않고 10분 보내기', emoji: catEmoji('morningRitual'), category: 'morningRitual', contexts: ['morning'], strengthenTags: ['#주도적', '#평정심'], estimatedMinutes: 10, difficulty: 3 },
  { id: 12, title: '꿈 기록하기', emoji: catEmoji('morningRitual'), category: 'morningRitual', contexts: ['morning'], strengthenTags: ['#창의적', '#성찰적'], estimatedMinutes: 5, difficulty: 2 },
  { id: 13, title: '체중 재고 기록하기', emoji: catEmoji('morningRitual'), category: 'morningRitual', contexts: ['morning'], strengthenTags: ['#현실적', '#끈기'], estimatedMinutes: 1, difficulty: 1 },
  { id: 14, title: '오늘 입을 옷에 어울리는 향수 뿌리기', emoji: catEmoji('morningRitual'), category: 'morningRitual', contexts: ['beforeOut'], strengthenTags: ['#미적감각', '#감성적'], estimatedMinutes: 1, difficulty: 1 },
  { id: 15, title: '현관 나설 때 신발장 정리 확인', emoji: catEmoji('morningRitual'), category: 'morningRitual', contexts: ['beforeOut'], strengthenTags: ['#성실', '#신중함'], estimatedMinutes: 1, difficulty: 1 },
  { id: 16, title: '거울 보며 옷매무새 단정히', emoji: catEmoji('morningRitual'), category: 'morningRitual', contexts: ['beforeOut'], strengthenTags: ['#미적감각', '#주도적'], estimatedMinutes: 1, difficulty: 1 },
  { id: 17, title: '집 나설 때 가족에게 인사하기', emoji: catEmoji('morningRitual'), category: 'morningRitual', contexts: ['beforeOut'], strengthenTags: ['#배려', '#친화력'], estimatedMinutes: 1, difficulty: 1 },
  { id: 18, title: '가방 속 불필요한 물건 버리기', emoji: catEmoji('morningRitual'), category: 'morningRitual', contexts: ['beforeOut'], strengthenTags: ['#효율적', '#현실적'], estimatedMinutes: 2, difficulty: 1 },
  { id: 19, title: '긍정 확언 한 문장 읽기', emoji: catEmoji('morningRitual'), category: 'morningRitual', contexts: ['beforeOut'], strengthenTags: ['#낙관적', '#단단함'], estimatedMinutes: 1, difficulty: 1 },
  { id: 20, title: '아침 5분 명상하기', emoji: catEmoji('morningRitual'), category: 'morningRitual', contexts: ['morning'], strengthenTags: ['#평정심', '#성찰적'], estimatedMinutes: 5, difficulty: 2 },
  { id: 21, title: '감사한 일 3가지 떠올리기', emoji: catEmoji('morningRitual'), category: 'morningRitual', contexts: ['morning'], strengthenTags: ['#낙관적', '#공감'], estimatedMinutes: 2, difficulty: 1 },
  { id: 22, title: '오늘의 한 줄 다짐 적기', emoji: catEmoji('morningRitual'), category: 'morningRitual', contexts: ['morning'], strengthenTags: ['#성취지향', '#주도적'], estimatedMinutes: 1, difficulty: 1 },
  { id: 23, title: '아침 요가 10분', emoji: catEmoji('morningRitual'), category: 'morningRitual', contexts: ['morning'], strengthenTags: ['#유연함', '#평정심'], estimatedMinutes: 10, difficulty: 2 },
  { id: 24, title: '하루 수분 섭취 목표 설정하기', emoji: catEmoji('morningRitual'), category: 'morningRitual', contexts: ['morning'], strengthenTags: ['#계획적', '#성실'], estimatedMinutes: 1, difficulty: 1 },
  { id: 25, title: '오늘의 기분을 한 단어로 기록하기', emoji: catEmoji('morningRitual'), category: 'morningRitual', contexts: ['morning'], strengthenTags: ['#섬세함', '#성찰적'], estimatedMinutes: 1, difficulty: 1 },

  // ========== Commute (20) ==========
  { id: 31, title: '뉴스 브리핑 팟캐스트 듣기', emoji: catEmoji('commute'), category: 'commute', contexts: ['commute'], strengthenTags: ['#현실적', '#호기심'], estimatedMinutes: 15, difficulty: 1 },
  { id: 32, title: '외국어 단어장 앱 5분 보기', emoji: catEmoji('commute'), category: 'commute', contexts: ['commute'], strengthenTags: ['#성실', '#호기심'], estimatedMinutes: 5, difficulty: 2 },
  { id: 33, title: '오디오북으로 고전 듣기', emoji: catEmoji('commute'), category: 'commute', contexts: ['commute'], strengthenTags: ['#호기심', '#성찰적'], estimatedMinutes: 20, difficulty: 2 },
  { id: 34, title: '경제 관련 유튜브/팟캐스트 듣기', emoji: catEmoji('commute'), category: 'commute', contexts: ['commute'], strengthenTags: ['#현실적', '#논리적'], estimatedMinutes: 15, difficulty: 2 },
  { id: 35, title: '관심 분야 트렌드 리포트 읽기', emoji: catEmoji('commute'), category: 'commute', contexts: ['commute'], strengthenTags: ['#호기심', '#성취지향'], estimatedMinutes: 10, difficulty: 2 },
  { id: 36, title: '좋아하는 음악 듣기', emoji: catEmoji('commute'), category: 'commute', contexts: ['commute'], strengthenTags: ['#감성적', '#미적감각'], estimatedMinutes: 15, difficulty: 1 },
  { id: 37, title: '에스컬레이터 대신 계단 이용하기', emoji: catEmoji('commute'), category: 'commute', contexts: ['commute'], strengthenTags: ['#끈기', '#추진력'], estimatedMinutes: 2, difficulty: 2 },
  { id: 38, title: '창밖 풍경 보며 눈의 피로 풀기', emoji: catEmoji('commute'), category: 'commute', contexts: ['commute'], strengthenTags: ['#감성적', '#평정심'], estimatedMinutes: 5, difficulty: 1 },
  { id: 39, title: '오늘 만날 사람들과의 대화 시뮬레이션', emoji: catEmoji('commute'), category: 'commute', contexts: ['commute'], strengthenTags: ['#사교적', '#계획적'], estimatedMinutes: 5, difficulty: 2 },
  { id: 40, title: '메모장에 아이디어 1개 적기', emoji: catEmoji('commute'), category: 'commute', contexts: ['commute'], strengthenTags: ['#창의적', '#호기심'], estimatedMinutes: 2, difficulty: 2 },
  { id: 41, title: '불필요한 스마트폰 알림 끄기', emoji: catEmoji('commute'), category: 'commute', contexts: ['commute'], strengthenTags: ['#주도적', '#효율적'], estimatedMinutes: 3, difficulty: 2 },
  { id: 42, title: 'TED 강연 1편 듣기', emoji: catEmoji('commute'), category: 'commute', contexts: ['commute'], strengthenTags: ['#호기심', '#창의적'], estimatedMinutes: 18, difficulty: 2 },
  { id: 43, title: '한 정거장 미리 내려서 걷기', emoji: catEmoji('commute'), category: 'commute', contexts: ['commute'], strengthenTags: ['#활기', '#도전적'], estimatedMinutes: 10, difficulty: 2 },
  { id: 44, title: '부모님이나 친구에게 안부 문자 보내기', emoji: catEmoji('commute'), category: 'commute', contexts: ['commute'], strengthenTags: ['#배려', '#친화력'], estimatedMinutes: 2, difficulty: 1 },
  { id: 45, title: '하루 일정 확인하기', emoji: catEmoji('commute'), category: 'commute', contexts: ['commute'], strengthenTags: ['#계획적', '#신중함'], estimatedMinutes: 3, difficulty: 1 },
  { id: 46, title: '감사한 일 3가지 머릿속으로 떠올리기', emoji: catEmoji('commute'), category: 'commute', contexts: ['commute'], strengthenTags: ['#낙관적', '#성찰적'], estimatedMinutes: 2, difficulty: 1 },
  { id: 47, title: '자세 바르게 하고 복식호흡 5회', emoji: catEmoji('commute'), category: 'commute', contexts: ['commute'], strengthenTags: ['#침착함', '#평정심'], estimatedMinutes: 2, difficulty: 1 },
  { id: 48, title: '나만의 플레이리스트 정비하기', emoji: catEmoji('commute'), category: 'commute', contexts: ['commute'], strengthenTags: ['#미적감각', '#자유'], estimatedMinutes: 10, difficulty: 1 },
  { id: 49, title: '기술 블로그/뉴스레터 1편 읽기', emoji: catEmoji('commute'), category: 'commute', contexts: ['commute'], strengthenTags: ['#호기심', '#논리적'], estimatedMinutes: 10, difficulty: 2 },
  { id: 50, title: '이동 중 어깨·목 스트레칭', emoji: catEmoji('commute'), category: 'commute', contexts: ['commute'], strengthenTags: ['#유연함', '#성실'], estimatedMinutes: 3, difficulty: 1 },

  // ========== Productivity (20) ==========
  { id: 61, title: '책상 위 불필요한 물건 치우기', emoji: catEmoji('productivity'), category: 'productivity', contexts: ['work'], strengthenTags: ['#효율적', '#계획적'], estimatedMinutes: 3, difficulty: 1 },
  { id: 62, title: '업무 시작 전 오늘의 우선순위 3개 적기', emoji: catEmoji('productivity'), category: 'productivity', contexts: ['work'], strengthenTags: ['#계획적', '#성취지향'], estimatedMinutes: 5, difficulty: 2 },
  { id: 63, title: '가장 어려운 일 오전에 처리', emoji: catEmoji('productivity'), category: 'productivity', contexts: ['work'], strengthenTags: ['#추진력', '#도전적'], estimatedMinutes: 60, difficulty: 3 },
  { id: 64, title: '뽀모도로 타이머 쓰기', emoji: catEmoji('productivity'), category: 'productivity', contexts: ['work'], strengthenTags: ['#효율적', '#주도적'], estimatedMinutes: 25, difficulty: 2 },
  { id: 65, title: '이메일 정해진 시간에만 확인하기', emoji: catEmoji('productivity'), category: 'productivity', contexts: ['work'], strengthenTags: ['#주도적', '#원칙'], estimatedMinutes: 10, difficulty: 2 },
  { id: 66, title: '방해 금지 모드 켜고 일하기', emoji: catEmoji('productivity'), category: 'productivity', contexts: ['work'], strengthenTags: ['#성취지향', '#끈기'], estimatedMinutes: 60, difficulty: 2 },
  { id: 67, title: '동료에게 커피/간식 건네며 스몰토크', emoji: catEmoji('productivity'), category: 'productivity', contexts: ['work'], strengthenTags: ['#사교적', '#친화력'], estimatedMinutes: 5, difficulty: 2 },
  { id: 68, title: '점심시간 10분 산책으로 햇볕 쬐기', emoji: catEmoji('productivity'), category: 'productivity', contexts: ['lunch'], strengthenTags: ['#활기', '#유연함'], estimatedMinutes: 10, difficulty: 1 },
  { id: 69, title: '오후 업무 전 스트레칭으로 몸 풀기', emoji: catEmoji('productivity'), category: 'productivity', contexts: ['work'], strengthenTags: ['#유연함', '#활기'], estimatedMinutes: 5, difficulty: 1 },
  { id: 70, title: '퇴근 30분 전 내일 할 일 리스트업', emoji: catEmoji('productivity'), category: 'productivity', contexts: ['work'], strengthenTags: ['#계획적', '#신중함'], estimatedMinutes: 10, difficulty: 2 },
  { id: 71, title: '바탕화면 아이콘 정리하고 퇴근하기', emoji: catEmoji('productivity'), category: 'productivity', contexts: ['work'], strengthenTags: ['#효율적', '#성실'], estimatedMinutes: 3, difficulty: 1 },
  { id: 72, title: '업무 중 떠오른 생각 메모장에 옮기기', emoji: catEmoji('productivity'), category: 'productivity', contexts: ['work'], strengthenTags: ['#창의적', '#주도적'], estimatedMinutes: 2, difficulty: 1 },
  { id: 73, title: '회의 전 안건 미리 정리하기', emoji: catEmoji('productivity'), category: 'productivity', contexts: ['work'], strengthenTags: ['#계획적', '#리더십'], estimatedMinutes: 10, difficulty: 2 },
  { id: 74, title: '2분 안에 끝나는 일 즉시 처리', emoji: catEmoji('productivity'), category: 'productivity', contexts: ['work'], strengthenTags: ['#추진력', '#효율적'], estimatedMinutes: 2, difficulty: 1 },
  { id: 75, title: '하루 업무 끝난 뒤 오늘 성과 정리', emoji: catEmoji('productivity'), category: 'productivity', contexts: ['work'], strengthenTags: ['#성찰적', '#성취지향'], estimatedMinutes: 5, difficulty: 2 },
  { id: 76, title: '멀티태스킹 대신 싱글태스킹 실천', emoji: catEmoji('productivity'), category: 'productivity', contexts: ['work'], strengthenTags: ['#주도적', '#끈기'], estimatedMinutes: 30, difficulty: 3 },
  { id: 77, title: '업무 이메일 간결하게 쓰기', emoji: catEmoji('productivity'), category: 'productivity', contexts: ['work'], strengthenTags: ['#효율적', '#솔직함'], estimatedMinutes: 5, difficulty: 2 },
  { id: 78, title: '동료에게 감사 한마디 전하기', emoji: catEmoji('productivity'), category: 'productivity', contexts: ['work'], strengthenTags: ['#배려', '#협조적'], estimatedMinutes: 1, difficulty: 1 },
  { id: 79, title: '업무 마무리 후 체크리스트 점검', emoji: catEmoji('productivity'), category: 'productivity', contexts: ['work'], strengthenTags: ['#신중함', '#성실'], estimatedMinutes: 5, difficulty: 1 },
  { id: 80, title: '주 1회 업무 회고 작성', emoji: catEmoji('productivity'), category: 'productivity', contexts: ['work'], strengthenTags: ['#성찰적', '#성취지향'], estimatedMinutes: 15, difficulty: 2 },

  // ========== Learning (22) ==========
  { id: 91, title: '하루 1개 새로운 지식 알아보기', emoji: catEmoji('learning'), category: 'learning', contexts: ['study'], strengthenTags: ['#호기심', '#창의적'], estimatedMinutes: 10, difficulty: 2 },
  { id: 92, title: '전문 분야 아티클 1편 읽기', emoji: catEmoji('learning'), category: 'learning', contexts: ['study'], strengthenTags: ['#성취지향', '#논리적'], estimatedMinutes: 15, difficulty: 2 },
  { id: 93, title: '하루 20페이지 독서하기', emoji: catEmoji('learning'), category: 'learning', contexts: ['study'], strengthenTags: ['#성실', '#끈기'], estimatedMinutes: 30, difficulty: 2 },
  { id: 94, title: '유튜브 교육 영상 1.5배속으로 시청', emoji: catEmoji('learning'), category: 'learning', contexts: ['study'], strengthenTags: ['#효율적', '#호기심'], estimatedMinutes: 15, difficulty: 1 },
  { id: 95, title: '전시회/박물관 정보 찾기', emoji: catEmoji('learning'), category: 'learning', contexts: ['leisure'], strengthenTags: ['#미적감각', '#호기심'], estimatedMinutes: 10, difficulty: 1 },
  { id: 96, title: '블로그나 SNS에 짧은 글 쓰기', emoji: catEmoji('learning'), category: 'learning', contexts: ['study'], strengthenTags: ['#창의적', '#솔직함'], estimatedMinutes: 15, difficulty: 2 },
  { id: 97, title: '낯선 주제의 다큐멘터리 시청하기', emoji: catEmoji('learning'), category: 'learning', contexts: ['leisure'], strengthenTags: ['#호기심', '#유연함'], estimatedMinutes: 45, difficulty: 1 },
  { id: 98, title: '마인드맵 그리며 생각 확장하기', emoji: catEmoji('learning'), category: 'learning', contexts: ['study'], strengthenTags: ['#창의적', '#논리적'], estimatedMinutes: 15, difficulty: 2 },
  { id: 99, title: '외국어 뉴스 헤드라인 읽기', emoji: catEmoji('learning'), category: 'learning', contexts: ['study'], strengthenTags: ['#도전적', '#호기심'], estimatedMinutes: 10, difficulty: 2 },
  { id: 100, title: '시 한 편 필사하기', emoji: catEmoji('learning'), category: 'learning', contexts: ['hobby'], strengthenTags: ['#감성적', '#미적감각'], estimatedMinutes: 10, difficulty: 2 },
  { id: 101, title: '퍼즐/스도쿠/체스 등 두뇌 게임 하기', emoji: catEmoji('learning'), category: 'learning', contexts: ['hobby'], strengthenTags: ['#논리적', '#끈기'], estimatedMinutes: 15, difficulty: 2 },
  { id: 102, title: '온라인 강의 1강 듣기', emoji: catEmoji('learning'), category: 'learning', contexts: ['study'], strengthenTags: ['#성취지향', '#끈기'], estimatedMinutes: 30, difficulty: 2 },
  { id: 103, title: '업무 관련 자격증 공부 30분', emoji: catEmoji('learning'), category: 'learning', contexts: ['study'], strengthenTags: ['#성실', '#성취지향'], estimatedMinutes: 30, difficulty: 3 },
  { id: 104, title: '읽은 책에서 인상 깊은 문장 기록', emoji: catEmoji('learning'), category: 'learning', contexts: ['study'], strengthenTags: ['#성찰적', '#진정성'], estimatedMinutes: 5, difficulty: 1 },
  { id: 105, title: '새로운 요리 레시피 하나 도전', emoji: catEmoji('learning'), category: 'learning', contexts: ['hobby'], strengthenTags: ['#도전적', '#창의적'], estimatedMinutes: 30, difficulty: 2 },
  { id: 106, title: '악기 연습 15분', emoji: catEmoji('learning'), category: 'learning', contexts: ['hobby'], strengthenTags: ['#끈기', '#미적감각'], estimatedMinutes: 15, difficulty: 2 },
  { id: 107, title: '드로잉/스케치 연습 10분', emoji: catEmoji('learning'), category: 'learning', contexts: ['hobby'], strengthenTags: ['#창의적', '#섬세함'], estimatedMinutes: 10, difficulty: 2 },
  { id: 108, title: '코딩/프로그래밍 연습 30분', emoji: catEmoji('learning'), category: 'learning', contexts: ['study'], strengthenTags: ['#논리적', '#도전적'], estimatedMinutes: 30, difficulty: 3 },
  { id: 109, title: '오늘 배운 것 한 문장으로 정리', emoji: catEmoji('learning'), category: 'learning', contexts: ['study'], strengthenTags: ['#성찰적', '#효율적'], estimatedMinutes: 2, difficulty: 1 },
  { id: 110, title: '관심 분야 논문/보고서 요약 읽기', emoji: catEmoji('learning'), category: 'learning', contexts: ['study'], strengthenTags: ['#논리적', '#호기심'], estimatedMinutes: 20, difficulty: 3 },
  { id: 111, title: '사진 촬영 연습하기', emoji: catEmoji('learning'), category: 'learning', contexts: ['hobby'], strengthenTags: ['#미적감각', '#감성적'], estimatedMinutes: 15, difficulty: 1 },
  { id: 112, title: '글씨 연습/캘리그라피', emoji: catEmoji('learning'), category: 'learning', contexts: ['hobby'], strengthenTags: ['#섬세함', '#미적감각'], estimatedMinutes: 15, difficulty: 2 },

  // ========== Health (22) ==========
  { id: 121, title: '30분 이상 유산소 운동', emoji: catEmoji('health'), category: 'health', contexts: ['exercise'], strengthenTags: ['#끈기', '#추진력'], estimatedMinutes: 30, difficulty: 3 },
  { id: 122, title: '근력 운동 30분', emoji: catEmoji('health'), category: 'health', contexts: ['exercise'], strengthenTags: ['#성취지향', '#끈기'], estimatedMinutes: 30, difficulty: 3 },
  { id: 123, title: '하루 8000보 걷기', emoji: catEmoji('health'), category: 'health', contexts: ['daily'], strengthenTags: ['#성실', '#끈기'], estimatedMinutes: 60, difficulty: 2 },
  { id: 124, title: '식사 때 채소 먼저 먹기', emoji: catEmoji('health'), category: 'health', contexts: ['meal'], strengthenTags: ['#신중함', '#현실적'], estimatedMinutes: 1, difficulty: 1 },
  { id: 125, title: '간식 대신 견과류/과일 먹기', emoji: catEmoji('health'), category: 'health', contexts: ['meal'], strengthenTags: ['#원칙', '#신중함'], estimatedMinutes: 1, difficulty: 2 },
  { id: 126, title: '하루 물 2L 마시기', emoji: catEmoji('health'), category: 'health', contexts: ['daily'], strengthenTags: ['#성실', '#계획적'], estimatedMinutes: 1, difficulty: 2 },
  { id: 127, title: '점심 후 10분 산책', emoji: catEmoji('health'), category: 'health', contexts: ['lunch'], strengthenTags: ['#활기', '#유연함'], estimatedMinutes: 10, difficulty: 1 },
  { id: 128, title: '엘리베이터 대신 계단 이용', emoji: catEmoji('health'), category: 'health', contexts: ['daily'], strengthenTags: ['#추진력', '#끈기'], estimatedMinutes: 3, difficulty: 2 },
  { id: 129, title: '저녁 식사 20시 이전에 마치기', emoji: catEmoji('health'), category: 'health', contexts: ['evening'], strengthenTags: ['#원칙', '#계획적'], estimatedMinutes: 1, difficulty: 2 },
  { id: 130, title: '취침 1시간 전 카페인 음료 안 마시기', emoji: catEmoji('health'), category: 'health', contexts: ['evening'], strengthenTags: ['#신중함', '#원칙'], estimatedMinutes: 1, difficulty: 2 },
  { id: 131, title: '일어나서 10분 조깅', emoji: catEmoji('health'), category: 'health', contexts: ['morning'], strengthenTags: ['#추진력', '#활기'], estimatedMinutes: 10, difficulty: 3 },
  { id: 132, title: '플랭크 1분 챌린지', emoji: catEmoji('health'), category: 'health', contexts: ['exercise'], strengthenTags: ['#단단함', '#끈기'], estimatedMinutes: 1, difficulty: 2 },
  { id: 133, title: '눈 운동/눈 깜빡이기 세트', emoji: catEmoji('health'), category: 'health', contexts: ['work'], strengthenTags: ['#섬세함', '#현실적'], estimatedMinutes: 2, difficulty: 1 },
  { id: 134, title: '스트레칭 루틴 10분', emoji: catEmoji('health'), category: 'health', contexts: ['exercise'], strengthenTags: ['#유연함', '#성실'], estimatedMinutes: 10, difficulty: 1 },
  { id: 135, title: '주 3회 이상 운동하기', emoji: catEmoji('health'), category: 'health', contexts: ['exercise'], strengthenTags: ['#계획적', '#성취지향'], estimatedMinutes: 60, difficulty: 3 },
  { id: 136, title: '식사 천천히 꼭꼭 씹어 먹기', emoji: catEmoji('health'), category: 'health', contexts: ['meal'], strengthenTags: ['#침착함', '#신중함'], estimatedMinutes: 15, difficulty: 2 },
  { id: 137, title: '자기 전 폼롤러로 근육 이완', emoji: catEmoji('health'), category: 'health', contexts: ['beforeBed'], strengthenTags: ['#유연함', '#성실'], estimatedMinutes: 10, difficulty: 1 },
  { id: 138, title: '주말 아침 러닝/산책', emoji: catEmoji('health'), category: 'health', contexts: ['weekend'], strengthenTags: ['#활기', '#자유'], estimatedMinutes: 30, difficulty: 2 },
  { id: 139, title: '식단 기록하기', emoji: catEmoji('health'), category: 'health', contexts: ['meal'], strengthenTags: ['#성실', '#현실적'], estimatedMinutes: 3, difficulty: 2 },
  { id: 140, title: '하루 한 끼 직접 요리해 먹기', emoji: catEmoji('health'), category: 'health', contexts: ['meal'], strengthenTags: ['#자립적', '#창의적'], estimatedMinutes: 30, difficulty: 2 },
  { id: 141, title: '수면 시간 7시간 이상 확보', emoji: catEmoji('health'), category: 'health', contexts: ['beforeBed'], strengthenTags: ['#계획적', '#원칙'], estimatedMinutes: 1, difficulty: 2 },
  { id: 142, title: '주 1회 새로운 운동 종목 체험', emoji: catEmoji('health'), category: 'health', contexts: ['exercise'], strengthenTags: ['#도전적', '#호기심'], estimatedMinutes: 60, difficulty: 2 },

  // ========== Relationship (18) ==========
  { id: 151, title: '가족에게 "고마워" 말하기', emoji: catEmoji('relationship'), category: 'relationship', contexts: ['relationship'], strengthenTags: ['#배려', '#진정성'], estimatedMinutes: 1, difficulty: 1 },
  { id: 152, title: '친구에게 안부 연락하기', emoji: catEmoji('relationship'), category: 'relationship', contexts: ['relationship'], strengthenTags: ['#친화력', '#배려'], estimatedMinutes: 5, difficulty: 1 },
  { id: 153, title: '대화할 때 스마트폰 내려놓기', emoji: catEmoji('relationship'), category: 'relationship', contexts: ['relationship'], strengthenTags: ['#공감', '#배려'], estimatedMinutes: 1, difficulty: 2 },
  { id: 154, title: '상대방 말 끝까지 듣기', emoji: catEmoji('relationship'), category: 'relationship', contexts: ['relationship'], strengthenTags: ['#공감', '#포용력'], estimatedMinutes: 1, difficulty: 2 },
  { id: 155, title: '하루 1번 진심으로 칭찬하기', emoji: catEmoji('relationship'), category: 'relationship', contexts: ['relationship'], strengthenTags: ['#친화력', '#낙관적'], estimatedMinutes: 1, difficulty: 1 },
  { id: 156, title: '함께 식사하며 대화하기', emoji: catEmoji('relationship'), category: 'relationship', contexts: ['relationship'], strengthenTags: ['#사교적', '#공감'], estimatedMinutes: 30, difficulty: 1 },
  { id: 157, title: '갈등 있을 때 먼저 말 걸기', emoji: catEmoji('relationship'), category: 'relationship', contexts: ['relationship'], strengthenTags: ['#추진력', '#포용력'], estimatedMinutes: 5, difficulty: 3 },
  { id: 158, title: '나와 다른 의견 한 번 받아들여 보기', emoji: catEmoji('relationship'), category: 'relationship', contexts: ['relationship'], strengthenTags: ['#포용력', '#유연함'], estimatedMinutes: 5, difficulty: 3 },
  { id: 159, title: '감정을 "나 전달법"으로 표현하기', emoji: catEmoji('relationship'), category: 'relationship', contexts: ['relationship'], strengthenTags: ['#솔직함', '#공감'], estimatedMinutes: 5, difficulty: 3 },
  { id: 160, title: '팀 프로젝트에서 역할 먼저 맡기', emoji: catEmoji('relationship'), category: 'relationship', contexts: ['work'], strengthenTags: ['#리더십', '#협조적'], estimatedMinutes: 5, difficulty: 2 },
  { id: 161, title: '누군가의 부탁에 기꺼이 응하기', emoji: catEmoji('relationship'), category: 'relationship', contexts: ['relationship'], strengthenTags: ['#협조적', '#배려'], estimatedMinutes: 10, difficulty: 1 },
  { id: 162, title: '소모적 관계 점검하고 거리 두기', emoji: catEmoji('relationship'), category: 'relationship', contexts: ['relationship'], strengthenTags: ['#자립적', '#원칙'], estimatedMinutes: 10, difficulty: 3 },
  { id: 163, title: '새로운 모임/커뮤니티 참여하기', emoji: catEmoji('relationship'), category: 'relationship', contexts: ['leisure'], strengthenTags: ['#사교적', '#도전적'], estimatedMinutes: 60, difficulty: 2 },
  { id: 164, title: '고마운 사람에게 손편지 쓰기', emoji: catEmoji('relationship'), category: 'relationship', contexts: ['hobby'], strengthenTags: ['#진정성', '#감성적'], estimatedMinutes: 20, difficulty: 2 },
  { id: 165, title: '파트너/가족과 하루 10분 대화 시간', emoji: catEmoji('relationship'), category: 'relationship', contexts: ['evening'], strengthenTags: ['#배려', '#친화력'], estimatedMinutes: 10, difficulty: 1 },
  { id: 166, title: '동료의 장점 하나 발견하기', emoji: catEmoji('relationship'), category: 'relationship', contexts: ['work'], strengthenTags: ['#공감', '#섬세함'], estimatedMinutes: 2, difficulty: 1 },
  { id: 167, title: '거절할 때 정중하게 이유 말하기', emoji: catEmoji('relationship'), category: 'relationship', contexts: ['relationship'], strengthenTags: ['#솔직함', '#자립적'], estimatedMinutes: 2, difficulty: 3 },
  { id: 168, title: '공동 프로젝트에서 공 나누기', emoji: catEmoji('relationship'), category: 'relationship', contexts: ['work'], strengthenTags: ['#협조적', '#리더십'], estimatedMinutes: 5, difficulty: 2 },

  // ========== Mindset (22) ==========
  { id: 171, title: '5분 호흡 명상하기', emoji: catEmoji('mindset'), category: 'mindset', contexts: ['mindset'], strengthenTags: ['#평정심', '#침착함'], estimatedMinutes: 5, difficulty: 2 },
  { id: 172, title: '오늘 감정 일기 쓰기', emoji: catEmoji('mindset'), category: 'mindset', contexts: ['mindset'], strengthenTags: ['#섬세함', '#성찰적'], estimatedMinutes: 10, difficulty: 2 },
  { id: 173, title: '"완벽하지 않아도 괜찮아" 되뇌기', emoji: catEmoji('mindset'), category: 'mindset', contexts: ['mindset'], strengthenTags: ['#유연함', '#단단함'], estimatedMinutes: 1, difficulty: 1 },
  { id: 174, title: '실패 경험에서 배운 점 1가지 쓰기', emoji: catEmoji('mindset'), category: 'mindset', contexts: ['mindset'], strengthenTags: ['#성찰적', '#단단함'], estimatedMinutes: 5, difficulty: 2 },
  { id: 175, title: '비교하지 않기 — 어제의 나와만 비교', emoji: catEmoji('mindset'), category: 'mindset', contexts: ['mindset'], strengthenTags: ['#자립적', '#진정성'], estimatedMinutes: 2, difficulty: 3 },
  { id: 176, title: '걱정 시간 정해두고 그 시간에만 걱정', emoji: catEmoji('mindset'), category: 'mindset', contexts: ['mindset'], strengthenTags: ['#계획적', '#침착함'], estimatedMinutes: 10, difficulty: 2 },
  { id: 177, title: '자연 속에서 10분 머물기', emoji: catEmoji('mindset'), category: 'mindset', contexts: ['rest'], strengthenTags: ['#평정심', '#감성적'], estimatedMinutes: 10, difficulty: 1 },
  { id: 178, title: '부정적 생각을 긍정으로 리프레이밍', emoji: catEmoji('mindset'), category: 'mindset', contexts: ['mindset'], strengthenTags: ['#낙관적', '#유연함'], estimatedMinutes: 3, difficulty: 2 },
  { id: 179, title: '나의 강점 3가지 적기', emoji: catEmoji('mindset'), category: 'mindset', contexts: ['mindset'], strengthenTags: ['#진정성', '#낙관적'], estimatedMinutes: 3, difficulty: 1 },
  { id: 180, title: '10분간 아무것도 안 하기', emoji: catEmoji('mindset'), category: 'mindset', contexts: ['rest'], strengthenTags: ['#자유', '#평정심'], estimatedMinutes: 10, difficulty: 2 },
  { id: 181, title: '불안할 때 "지금 이 순간"에 집중', emoji: catEmoji('mindset'), category: 'mindset', contexts: ['mindset'], strengthenTags: ['#침착함', '#단단함'], estimatedMinutes: 3, difficulty: 2 },
  { id: 182, title: '주간 목표 달성률 점검', emoji: catEmoji('mindset'), category: 'mindset', contexts: ['weekly'], strengthenTags: ['#성취지향', '#성찰적'], estimatedMinutes: 10, difficulty: 2 },
  { id: 183, title: '나의 가치관 리스트 업데이트', emoji: catEmoji('mindset'), category: 'mindset', contexts: ['monthly'], strengthenTags: ['#진정성', '#성찰적'], estimatedMinutes: 15, difficulty: 2 },
  { id: 184, title: '버킷리스트 1개 추가하기', emoji: catEmoji('mindset'), category: 'mindset', contexts: ['monthly'], strengthenTags: ['#도전적', '#열정'], estimatedMinutes: 5, difficulty: 1 },
  { id: 185, title: '소셜미디어 사용시간 체크', emoji: catEmoji('mindset'), category: 'mindset', contexts: ['daily'], strengthenTags: ['#주도적', '#현실적'], estimatedMinutes: 2, difficulty: 2 },
  { id: 186, title: '타인의 비판에 감정 분리 연습', emoji: catEmoji('mindset'), category: 'mindset', contexts: ['mindset'], strengthenTags: ['#단단함', '#침착함'], estimatedMinutes: 5, difficulty: 3 },
  { id: 187, title: '하루 중 가장 행복했던 순간 기록', emoji: catEmoji('mindset'), category: 'mindset', contexts: ['beforeBed'], strengthenTags: ['#낙관적', '#감성적'], estimatedMinutes: 3, difficulty: 1 },
  { id: 188, title: '장기 목표를 시각화하기', emoji: catEmoji('mindset'), category: 'mindset', contexts: ['mindset'], strengthenTags: ['#열정', '#성취지향'], estimatedMinutes: 5, difficulty: 2 },
  { id: 189, title: '내가 통제할 수 있는 것만 목록 정리', emoji: catEmoji('mindset'), category: 'mindset', contexts: ['mindset'], strengthenTags: ['#현실적', '#침착함'], estimatedMinutes: 5, difficulty: 2 },
  { id: 190, title: '아침에 "나는 할 수 있다" 3번 말하기', emoji: catEmoji('mindset'), category: 'mindset', contexts: ['wakeUp'], strengthenTags: ['#열정', '#단단함'], estimatedMinutes: 1, difficulty: 1 },
  { id: 191, title: '독서 후 내 삶에 적용할 점 1개 쓰기', emoji: catEmoji('mindset'), category: 'mindset', contexts: ['study'], strengthenTags: ['#성찰적', '#논리적'], estimatedMinutes: 5, difficulty: 2 },
  { id: 192, title: '나만의 원칙 1가지 정하고 지키기', emoji: catEmoji('mindset'), category: 'mindset', contexts: ['daily'], strengthenTags: ['#원칙', '#끈기'], estimatedMinutes: 1, difficulty: 2 },

  // ========== Finance / Lifestyle (18) ==========
  { id: 201, title: '하루 지출 기록하기', emoji: catEmoji('finance'), category: 'finance', contexts: ['finance'], strengthenTags: ['#현실적', '#성실'], estimatedMinutes: 3, difficulty: 1 },
  { id: 202, title: '충동구매 전 24시간 대기하기', emoji: catEmoji('finance'), category: 'finance', contexts: ['finance'], strengthenTags: ['#신중함', '#원칙'], estimatedMinutes: 1, difficulty: 2 },
  { id: 203, title: '불필요한 구독 서비스 점검', emoji: catEmoji('finance'), category: 'finance', contexts: ['monthly'], strengthenTags: ['#효율적', '#현실적'], estimatedMinutes: 15, difficulty: 1 },
  { id: 204, title: '한 달 예산 세우기', emoji: catEmoji('finance'), category: 'finance', contexts: ['monthly'], strengthenTags: ['#계획적', '#현실적'], estimatedMinutes: 20, difficulty: 2 },
  { id: 205, title: '비상금/적금 통장 잔액 확인', emoji: catEmoji('finance'), category: 'finance', contexts: ['monthly'], strengthenTags: ['#신중함', '#계획적'], estimatedMinutes: 5, difficulty: 1 },
  { id: 206, title: '쓰지 않는 물건 중고 판매하기', emoji: catEmoji('finance'), category: 'finance', contexts: ['weekend'], strengthenTags: ['#효율적', '#현실적'], estimatedMinutes: 30, difficulty: 2 },
  { id: 207, title: '자동이체 설정으로 저축 자동화', emoji: catEmoji('finance'), category: 'finance', contexts: ['monthly'], strengthenTags: ['#계획적', '#효율적'], estimatedMinutes: 10, difficulty: 1 },
  { id: 208, title: '가계부 주간 결산', emoji: catEmoji('finance'), category: 'finance', contexts: ['weekly'], strengthenTags: ['#성실', '#논리적'], estimatedMinutes: 15, difficulty: 2 },
  { id: 209, title: '안 입는 옷/물건 기부하거나 버리기', emoji: catEmoji('finance'), category: 'finance', contexts: ['monthly'], strengthenTags: ['#유연함', '#자유'], estimatedMinutes: 30, difficulty: 2 },
  { id: 210, title: '재테크 관련 책/영상 1개 보기', emoji: catEmoji('finance'), category: 'finance', contexts: ['study'], strengthenTags: ['#논리적', '#성취지향'], estimatedMinutes: 20, difficulty: 2 },
  { id: 211, title: '식비 절약을 위해 도시락 싸기', emoji: catEmoji('finance'), category: 'finance', contexts: ['morning'], strengthenTags: ['#현실적', '#성실'], estimatedMinutes: 20, difficulty: 2 },
  { id: 212, title: '하루 한 가지 미니멀 라이프 실천', emoji: catEmoji('finance'), category: 'finance', contexts: ['daily'], strengthenTags: ['#자유', '#효율적'], estimatedMinutes: 5, difficulty: 1 },
  { id: 213, title: '화분에 물주기', emoji: catEmoji('finance'), category: 'finance', contexts: ['daily'], strengthenTags: ['#섬세함', '#성실'], estimatedMinutes: 2, difficulty: 1 },
  { id: 214, title: '집 안 한 곳 5분 정리', emoji: catEmoji('finance'), category: 'finance', contexts: ['daily'], strengthenTags: ['#성실', '#효율적'], estimatedMinutes: 5, difficulty: 1 },
  { id: 215, title: '이번 달 경조사 미리 체크하기', emoji: catEmoji('finance'), category: 'finance', contexts: ['monthly'], strengthenTags: ['#계획적', '#배려'], estimatedMinutes: 10, difficulty: 1 },
  { id: 216, title: '나에게 선물 주기', emoji: catEmoji('finance'), category: 'finance', contexts: ['monthly'], strengthenTags: ['#자유', '#진정성'], estimatedMinutes: 30, difficulty: 1 },
  { id: 217, title: '사진첩 정리하기', emoji: catEmoji('finance'), category: 'finance', contexts: ['monthly'], strengthenTags: ['#감성적', '#성찰적'], estimatedMinutes: 30, difficulty: 1 },
  { id: 218, title: '재활용 분리수거 꼼꼼히 하기', emoji: catEmoji('finance'), category: 'finance', contexts: ['daily'], strengthenTags: ['#성실', '#신중함'], estimatedMinutes: 3, difficulty: 1 },

  // ========== Evening (25) ==========
  { id: 231, title: '오늘 하루 잘한 점 3가지 적기', emoji: catEmoji('evening'), category: 'evening', contexts: ['beforeBed'], strengthenTags: ['#낙관적', '#성찰적'], estimatedMinutes: 3, difficulty: 1 },
  { id: 232, title: '내일 입을 옷 미리 준비하기', emoji: catEmoji('evening'), category: 'evening', contexts: ['beforeBed'], strengthenTags: ['#계획적', '#효율적'], estimatedMinutes: 3, difficulty: 1 },
  { id: 233, title: '가벼운 독서로 하루 마무리', emoji: catEmoji('evening'), category: 'evening', contexts: ['beforeBed'], strengthenTags: ['#성찰적', '#평정심'], estimatedMinutes: 15, difficulty: 1 },
  { id: 234, title: '따뜻한 차 한 잔 마시기', emoji: catEmoji('evening'), category: 'evening', contexts: ['evening'], strengthenTags: ['#평정심', '#감성적'], estimatedMinutes: 10, difficulty: 1 },
  { id: 235, title: '핸드폰 30분 전 무음 모드', emoji: catEmoji('evening'), category: 'evening', contexts: ['beforeBed'], strengthenTags: ['#주도적', '#원칙'], estimatedMinutes: 1, difficulty: 2 },
  { id: 236, title: '스트레칭 하기', emoji: catEmoji('evening'), category: 'evening', contexts: ['beforeBed'], strengthenTags: ['#유연함', '#성실'], estimatedMinutes: 5, difficulty: 1 },
  { id: 237, title: '방 온도 체크하기', emoji: catEmoji('evening'), category: 'evening', contexts: ['beforeBed'], strengthenTags: ['#섬세함', '#신중함'], estimatedMinutes: 1, difficulty: 1 },
  { id: 238, title: '암막 커튼 치고 방 어둡게 하기', emoji: catEmoji('evening'), category: 'evening', contexts: ['beforeBed'], strengthenTags: ['#계획적', '#신중함'], estimatedMinutes: 1, difficulty: 1 },
  { id: 239, title: '내일 기상 알람 확인하기', emoji: catEmoji('evening'), category: 'evening', contexts: ['beforeBed'], strengthenTags: ['#계획적', '#성실'], estimatedMinutes: 1, difficulty: 1 },
  { id: 240, title: '전자기기 끄고 10분간 멍때리기', emoji: catEmoji('evening'), category: 'evening', contexts: ['beforeBed'], strengthenTags: ['#평정심', '#자유'], estimatedMinutes: 10, difficulty: 2 },
  { id: 241, title: '내일 기대되는 일 1가지 생각하기', emoji: catEmoji('evening'), category: 'evening', contexts: ['beforeBed'], strengthenTags: ['#열정', '#낙관적'], estimatedMinutes: 2, difficulty: 1 },
  { id: 242, title: '씻고 로션 바르기', emoji: catEmoji('evening'), category: 'evening', contexts: ['evening'], strengthenTags: ['#성실', '#섬세함'], estimatedMinutes: 10, difficulty: 1 },
  { id: 243, title: '하루 1줄 일기 쓰기', emoji: catEmoji('evening'), category: 'evening', contexts: ['beforeBed'], strengthenTags: ['#성찰적', '#솔직함'], estimatedMinutes: 2, difficulty: 1 },
  { id: 244, title: '스스로에게 "오늘도 수고했어" 말하기', emoji: catEmoji('evening'), category: 'evening', contexts: ['beforeBed'], strengthenTags: ['#진정성', '#단단함'], estimatedMinutes: 1, difficulty: 1 },
  { id: 245, title: '내일 가방/준비물 미리 챙기기', emoji: catEmoji('evening'), category: 'evening', contexts: ['beforeBed'], strengthenTags: ['#계획적', '#신중함'], estimatedMinutes: 5, difficulty: 1 },
  { id: 246, title: '좋아하는 음악 들으며 릴렉스', emoji: catEmoji('evening'), category: 'evening', contexts: ['evening'], strengthenTags: ['#감성적', '#자유'], estimatedMinutes: 15, difficulty: 1 },
  { id: 247, title: '가벼운 일기체로 오늘 감정 정리', emoji: catEmoji('evening'), category: 'evening', contexts: ['beforeBed'], strengthenTags: ['#섬세함', '#솔직함'], estimatedMinutes: 5, difficulty: 2 },
  { id: 248, title: '오늘 감사한 사람 떠올리기', emoji: catEmoji('evening'), category: 'evening', contexts: ['beforeBed'], strengthenTags: ['#공감', '#낙관적'], estimatedMinutes: 2, difficulty: 1 },
  { id: 249, title: '내일 점심 메뉴 미리 정하기', emoji: catEmoji('evening'), category: 'evening', contexts: ['beforeBed'], strengthenTags: ['#효율적', '#계획적'], estimatedMinutes: 2, difficulty: 1 },
  { id: 250, title: '잠들기 전 3분 복식호흡', emoji: catEmoji('evening'), category: 'evening', contexts: ['beforeBed'], strengthenTags: ['#침착함', '#평정심'], estimatedMinutes: 3, difficulty: 1 },
  { id: 251, title: '침구 정돈하고 눕기', emoji: catEmoji('evening'), category: 'evening', contexts: ['beforeBed'], strengthenTags: ['#성실', '#섬세함'], estimatedMinutes: 2, difficulty: 1 },
  { id: 252, title: '저녁 산책 15분', emoji: catEmoji('evening'), category: 'evening', contexts: ['evening'], strengthenTags: ['#활기', '#평정심'], estimatedMinutes: 15, difficulty: 1 },
  { id: 253, title: '취미 활동 30분 (그림/악기/글쓰기)', emoji: catEmoji('evening'), category: 'evening', contexts: ['evening'], strengthenTags: ['#창의적', '#자유'], estimatedMinutes: 30, difficulty: 2 },
  { id: 254, title: '파트너/친구와 오늘 있었던 일 공유', emoji: catEmoji('evening'), category: 'evening', contexts: ['evening'], strengthenTags: ['#친화력', '#솔직함'], estimatedMinutes: 10, difficulty: 1 },
  { id: 255, title: '내일 스케줄 간단히 훑어보기', emoji: catEmoji('evening'), category: 'evening', contexts: ['beforeBed'], strengthenTags: ['#계획적', '#신중함'], estimatedMinutes: 3, difficulty: 1 },

  // ========== Periodic (28) ==========
  { id: 261, title: '다음 주 일정 전체 훑기', emoji: catEmoji('periodic'), category: 'periodic', contexts: ['weekly'], strengthenTags: ['#계획적', '#신중함'], estimatedMinutes: 15, difficulty: 2 },
  { id: 262, title: '대청소하기', emoji: catEmoji('periodic'), category: 'periodic', contexts: ['weekly'], strengthenTags: ['#성실', '#끈기'], estimatedMinutes: 60, difficulty: 2 },
  { id: 263, title: '냉장고 식재료 유통기한 확인', emoji: catEmoji('periodic'), category: 'periodic', contexts: ['weekly'], strengthenTags: ['#신중함', '#현실적'], estimatedMinutes: 10, difficulty: 1 },
  { id: 264, title: '한 주간의 지출 결산하기', emoji: catEmoji('periodic'), category: 'periodic', contexts: ['weekly'], strengthenTags: ['#현실적', '#논리적'], estimatedMinutes: 15, difficulty: 2 },
  { id: 265, title: '디지털 디톡스 하기', emoji: catEmoji('periodic'), category: 'periodic', contexts: ['weekly'], strengthenTags: ['#자유', '#평정심'], estimatedMinutes: 60, difficulty: 3 },
  { id: 266, title: '나에게 선물 주기', emoji: catEmoji('periodic'), category: 'periodic', contexts: ['monthly'], strengthenTags: ['#진정성', '#열정'], estimatedMinutes: 30, difficulty: 1 },
  { id: 267, title: '안 입는 옷/물건 기부하거나 버리기', emoji: catEmoji('periodic'), category: 'periodic', contexts: ['monthly'], strengthenTags: ['#유연함', '#자유'], estimatedMinutes: 30, difficulty: 2 },
  { id: 268, title: '월간 목표 점검하고 수정하기', emoji: catEmoji('periodic'), category: 'periodic', contexts: ['monthly'], strengthenTags: ['#성취지향', '#유연함'], estimatedMinutes: 20, difficulty: 2 },
  { id: 269, title: '소중한 사람들에게 안부 전화 돌리기', emoji: catEmoji('periodic'), category: 'periodic', contexts: ['monthly'], strengthenTags: ['#친화력', '#배려'], estimatedMinutes: 30, difficulty: 2 },
  { id: 270, title: '정기 구독 서비스 사용 여부 점검', emoji: catEmoji('periodic'), category: 'periodic', contexts: ['monthly'], strengthenTags: ['#효율적', '#현실적'], estimatedMinutes: 15, difficulty: 1 },
  { id: 271, title: '컴퓨터/폰 사진첩 정리하기', emoji: catEmoji('periodic'), category: 'periodic', contexts: ['monthly'], strengthenTags: ['#성실', '#감성적'], estimatedMinutes: 30, difficulty: 1 },
  { id: 272, title: '한 달 동안 읽은 책/본 영화 기록 정리', emoji: catEmoji('periodic'), category: 'periodic', contexts: ['monthly'], strengthenTags: ['#성찰적', '#호기심'], estimatedMinutes: 15, difficulty: 1 },
  { id: 273, title: '새로운 맛집이나 핫플레이스 탐방', emoji: catEmoji('periodic'), category: 'periodic', contexts: ['weekend'], strengthenTags: ['#도전적', '#활기'], estimatedMinutes: 120, difficulty: 1 },
  { id: 274, title: '자연 속에서 2시간 이상 보내기', emoji: catEmoji('periodic'), category: 'periodic', contexts: ['weekend'], strengthenTags: ['#평정심', '#자유'], estimatedMinutes: 120, difficulty: 1 },
  { id: 275, title: '밀린 빨래 하고 햇볕에 말리기', emoji: catEmoji('periodic'), category: 'periodic', contexts: ['weekend'], strengthenTags: ['#성실', '#현실적'], estimatedMinutes: 30, difficulty: 1 },
  { id: 276, title: '한 주 동안 감사했던 사람 리스트 적기', emoji: catEmoji('periodic'), category: 'periodic', contexts: ['weekly'], strengthenTags: ['#공감', '#낙관적'], estimatedMinutes: 10, difficulty: 1 },
  { id: 277, title: '다음 달 경조사 미리 체크하기', emoji: catEmoji('periodic'), category: 'periodic', contexts: ['monthly'], strengthenTags: ['#배려', '#계획적'], estimatedMinutes: 10, difficulty: 1 },
  { id: 278, title: '비상금/적금 통장 잔액 확인', emoji: catEmoji('periodic'), category: 'periodic', contexts: ['monthly'], strengthenTags: ['#현실적', '#계획적'], estimatedMinutes: 5, difficulty: 1 },
  { id: 279, title: '한 달간의 \'베스트 모먼트\' 선정하기', emoji: catEmoji('periodic'), category: 'periodic', contexts: ['monthly'], strengthenTags: ['#낙관적', '#감성적'], estimatedMinutes: 10, difficulty: 1 },
  { id: 280, title: '아무것도 안 하는 날 갖기', emoji: catEmoji('periodic'), category: 'periodic', contexts: ['monthly'], strengthenTags: ['#자유', '#평정심'], estimatedMinutes: 480, difficulty: 1 },
  { id: 281, title: '주간 운동 횟수 점검', emoji: catEmoji('periodic'), category: 'periodic', contexts: ['weekly'], strengthenTags: ['#끈기', '#성취지향'], estimatedMinutes: 5, difficulty: 1 },
  { id: 282, title: '주말 아침 브런치 만들어 먹기', emoji: catEmoji('periodic'), category: 'periodic', contexts: ['weekend'], strengthenTags: ['#창의적', '#자유'], estimatedMinutes: 40, difficulty: 1 },
  { id: 283, title: '한 주간 가장 뿌듯했던 일 기록', emoji: catEmoji('periodic'), category: 'periodic', contexts: ['weekly'], strengthenTags: ['#성취지향', '#성찰적'], estimatedMinutes: 5, difficulty: 1 },
  { id: 284, title: '봉사활동 참여하기', emoji: catEmoji('periodic'), category: 'periodic', contexts: ['weekend'], strengthenTags: ['#공감', '#포용력'], estimatedMinutes: 120, difficulty: 2 },
  { id: 285, title: '새로운 카페/공간 탐방하기', emoji: catEmoji('periodic'), category: 'periodic', contexts: ['weekend'], strengthenTags: ['#호기심', '#도전적'], estimatedMinutes: 60, difficulty: 1 },
  { id: 286, title: '일주일 식단 미리 계획하기', emoji: catEmoji('periodic'), category: 'periodic', contexts: ['weekly'], strengthenTags: ['#계획적', '#현실적'], estimatedMinutes: 15, difficulty: 2 },
  { id: 287, title: '혼자만의 시간 2시간 확보하기', emoji: catEmoji('periodic'), category: 'periodic', contexts: ['weekend'], strengthenTags: ['#자립적', '#성찰적'], estimatedMinutes: 120, difficulty: 2 },
  { id: 288, title: '월말 나 자신에게 편지 쓰기', emoji: catEmoji('periodic'), category: 'periodic', contexts: ['monthly'], strengthenTags: ['#진정성', '#성찰적'], estimatedMinutes: 15, difficulty: 2 },
];

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

export function templatesByCategory(): Record<HabitTemplateCategory, HabitTemplateItem[]> {
  const result = {} as Record<HabitTemplateCategory, HabitTemplateItem[]>;
  for (const t of HABIT_TEMPLATES) {
    if (!result[t.category]) {
      result[t.category] = [];
    }
    result[t.category].push(t);
  }
  return result;
}

export function templatesByContext(context: HabitContext): HabitTemplateItem[] {
  return HABIT_TEMPLATES.filter((t) => t.contexts.includes(context));
}

export function recommendTemplates(
  userTags: Set<string>,
  limit?: number,
): HabitTemplateItem[];

export function recommendTemplates(
  userTags: Set<string>,
  limit: number | undefined,
  context: HabitContext,
): HabitRecommendation[];

export function recommendTemplates(
  userTags: Set<string>,
  limit: number = 10,
  context?: HabitContext,
): HabitTemplateItem[] | HabitRecommendation[] {
  if (context === undefined) {
    return HABIT_TEMPLATES
      .map((template) => {
        const matchCount = template.strengthenTags.filter((tag) => userTags.has(tag)).length;
        return { template, matchCount };
      })
      .filter((entry) => entry.matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount)
      .slice(0, limit)
      .map((entry) => entry.template);
  }

  const contextInfo = HABIT_CONTEXT_INFO[context];

  return HABIT_TEMPLATES
    .map((template) => {
      let score = 1.0;
      const reasons: string[] = [];

      if (template.contexts.includes(context)) {
        score *= 2.0;
        reasons.push(`${contextInfo.emoji} ${contextInfo.label}에 적합`);
      }

      const matchingTags = template.strengthenTags.filter((tag) => userTags.has(tag));
      if (matchingTags.length > 0) {
        score *= 1.0 + matchingTags.length * 0.3;
        reasons.push(`${matchingTags.join(' ')} 강화`);
      }

      score *= 1.0 + 0.1 * (4 - template.difficulty);

      const matchScore = Math.min(0.95, score / 4.0);

      return {
        id: template.id,
        template,
        matchScore,
        reasons,
      } as HabitRecommendation;
    })
    .filter((r) => r.matchScore > 0.2)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
}
