import type { HashtagCategory, PersonalityHashtag, PersonalityType } from '../types/personality';

// =============================================================================
// 36 Personality Hashtags (4 categories × 9)
// =============================================================================
// 설계 근거: Big Five (NEO-PI-R) facet 구조를 기반으로,
// 한국어 일상에서 직관적으로 이해 가능한 형태로 재구성.
// 각 카테고리는 Big Five의 주요 차원과 대응:
//   attitude  ≈ Conscientiousness + 행동 에너지
//   emotion   ≈ Neuroticism(역) + Positive Emotionality
//   relationship ≈ Extraversion + Agreeableness
//   value     ≈ Openness to Experience + 동기 구조

export const allHashtags: PersonalityHashtag[] = [
  // -------------------------------------------------------------------------
  // 1. attitude — 과제·도전에 대한 접근 방식 (9)
  // -------------------------------------------------------------------------
  { id: '#성실', tag: '#성실', category: 'attitude', description: '꾸준히 맡은 바를 성실하게 해내는 태도' },
  { id: '#추진력', tag: '#추진력', category: 'attitude', description: '목표가 정해지면 망설임 없이 밀고 나가는 실행 에너지' },
  { id: '#신중함', tag: '#신중함', category: 'attitude', description: '모든 가능성을 꼼꼼히 살피고 나서 움직이는 태도' },
  { id: '#유연함', tag: '#유연함', category: 'attitude', description: '변화에 부드럽게 적응하며 대안을 찾는 태도' },
  { id: '#계획적', tag: '#계획적', category: 'attitude', description: '목표를 달성하기 위해 단계별 로드맵을 설계하는 습관' },
  { id: '#도전적', tag: '#도전적', category: 'attitude', description: '안전지대를 벗어나 새로운 시도를 즐기는 자세' },
  { id: '#끈기', tag: '#끈기', category: 'attitude', description: '어려움 앞에서도 쉽게 포기하지 않고 버티는 힘' },
  { id: '#효율적', tag: '#효율적', category: 'attitude', description: '최소 자원으로 최대 성과를 추구하는 스마트한 방식' },
  { id: '#주도적', tag: '#주도적', category: 'attitude', description: '시키지 않아도 스스로 일을 찾아서 이끌어가는 자세' },

  // -------------------------------------------------------------------------
  // 2. emotion — 감정 처리 방식과 에너지 (9)
  // -------------------------------------------------------------------------
  { id: '#평정심', tag: '#평정심', category: 'emotion', description: '감정의 파도 속에서도 중심을 잡는 마음의 힘' },
  { id: '#섬세함', tag: '#섬세함', category: 'emotion', description: '작은 감정의 변화까지 감지하는 예민한 감수성' },
  { id: '#낙관적', tag: '#낙관적', category: 'emotion', description: '어려운 상황에서도 긍정적 가능성을 보는 태도' },
  { id: '#열정', tag: '#열정', category: 'emotion', description: '좋아하는 일에 뜨겁게 몰입하는 에너지' },
  { id: '#성찰적', tag: '#성찰적', category: 'emotion', description: '내면의 목소리에 귀 기울이며 깊이 생각하는 태도' },
  { id: '#감성적', tag: '#감성적', category: 'emotion', description: '기쁨과 슬픔의 스펙트럼이 넓고 깊은 감수성' },
  { id: '#침착함', tag: '#침착함', category: 'emotion', description: '위기 상황에서도 차분하게 대응하는 안정감' },
  { id: '#활기', tag: '#활기', category: 'emotion', description: '생동감 넘치는 에너지로 주변을 밝히는 힘' },
  { id: '#단단함', tag: '#단단함', category: 'emotion', description: '비난이나 실패에도 쉽게 무너지지 않는 내면의 힘' },

  // -------------------------------------------------------------------------
  // 3. relationship — 타인과의 상호작용 방식 (9)
  // -------------------------------------------------------------------------
  { id: '#사교적', tag: '#사교적', category: 'relationship', description: '낯선 사람에게도 스스럼없이 다가가는 능력' },
  { id: '#자립적', tag: '#자립적', category: 'relationship', description: '스스로의 힘으로 해내는 독립성' },
  { id: '#리더십', tag: '#리더십', category: 'relationship', description: '비전을 제시하고 사람들을 이끄는 능력' },
  { id: '#협조적', tag: '#협조적', category: 'relationship', description: '팀 전체의 목표를 위해 함께하는 태도' },
  { id: '#배려', tag: '#배려', category: 'relationship', description: '상대의 입장에서 세심하게 챙기는 마음' },
  { id: '#솔직함', tag: '#솔직함', category: 'relationship', description: '있는 그대로 분명하게 표현하는 태도' },
  { id: '#공감', tag: '#공감', category: 'relationship', description: '타인의 감정을 내 일처럼 느끼며 함께하는 마음' },
  { id: '#포용력', tag: '#포용력', category: 'relationship', description: '다른 의견이나 실수까지 품을 수 있는 넓은 마음' },
  { id: '#친화력', tag: '#친화력', category: 'relationship', description: '누구와도 금방 편안해지는 따뜻한 에너지' },

  // -------------------------------------------------------------------------
  // 4. value — 판단과 동기의 기준 (9)
  // -------------------------------------------------------------------------
  { id: '#논리적', tag: '#논리적', category: 'value', description: '근거와 이성으로 판단하는 태도' },
  { id: '#창의적', tag: '#창의적', category: 'value', description: '독창적인 시각으로 새로운 가치를 만드는 능력' },
  { id: '#현실적', tag: '#현실적', category: 'value', description: '실현 가능한 방안을 우선시하는 태도' },
  { id: '#호기심', tag: '#호기심', category: 'value', description: '세상 모든 것에 "왜?"라고 묻는 탐구심' },
  { id: '#성취지향', tag: '#성취지향', category: 'value', description: '분명한 성과를 이루어내려는 강한 욕구' },
  { id: '#진정성', tag: '#진정성', category: 'value', description: '꾸미지 않고 진심을 담는 태도' },
  { id: '#자유', tag: '#자유', category: 'value', description: '틀에 얽매이지 않고 자기 의지대로 살려는 태도' },
  { id: '#원칙', tag: '#원칙', category: 'value', description: '자신이 정한 기준을 흔들림 없이 지키는 태도' },
  { id: '#미적감각', tag: '#미적감각', category: 'value', description: '아름다움을 발견하고 조화롭게 배치하는 감각' },
];

// =============================================================================
// 20 Personality Types (각 3–4 해시태그)
// =============================================================================

export const personalityTypes: PersonalityType[] = [
  {
    id: 1,
    nameKR: '혁신적인 설계자',
    nameEN: 'The Visionary Architect',
    description: '새로운 아이디어와 가능성을 탐구하며 미래를 설계하는 혁신가',
    hashtags: ['#창의적', '#호기심', '#도전적'],
    emoji: '\u{1F680}',
  },
  {
    id: 2,
    nameKR: '거침없는 성취가',
    nameEN: 'The Driven Achiever',
    description: '목표를 향해 거침없이 달려가는 성취 지향적 실행가',
    hashtags: ['#성취지향', '#추진력', '#열정'],
    emoji: '\u{1F3C6}',
  },
  {
    id: 3,
    nameKR: '따뜻한 조율자',
    nameEN: 'The Empathetic Mediator',
    description: '사람들 사이의 갈등을 조율하고 따뜻하게 연결하는 중재자',
    hashtags: ['#공감', '#배려', '#포용력'],
    emoji: '\u{1F91D}',
  },
  {
    id: 4,
    nameKR: '냉철한 분석가',
    nameEN: 'The Rational Analyst',
    description: '데이터와 논리로 문제의 핵심을 꿰뚫어보는 분석가',
    hashtags: ['#논리적', '#침착함', '#신중함'],
    emoji: '\u{1F50D}',
  },
  {
    id: 5,
    nameKR: '든든한 원칙주의자',
    nameEN: 'The Reliable Pillar',
    description: '변함없는 원칙과 신뢰로 주변을 든든하게 지탱하는 기둥',
    hashtags: ['#원칙', '#성실', '#계획적'],
    emoji: '\u{1F3DB}\uFE0F',
  },
  {
    id: 6,
    nameKR: '자유로운 모험가',
    nameEN: 'The Free-Spirited Explorer',
    description: '틀에 얽매이지 않고 자유롭게 세상을 탐험하는 모험가',
    hashtags: ['#자유', '#유연함', '#도전적'],
    emoji: '\u{1F98B}',
  },
  {
    id: 7,
    nameKR: '유쾌한 분위기메이커',
    nameEN: 'The Social Spark',
    description: '어디서든 분위기를 밝히고 사람들을 연결하는 사교의 달인',
    hashtags: ['#사교적', '#친화력', '#활기'],
    emoji: '\u{1F389}',
  },
  {
    id: 8,
    nameKR: '전략적 실행가',
    nameEN: 'The Strategic Executor',
    description: '치밀한 전략으로 목표를 효율적으로 달성하는 실행가',
    hashtags: ['#효율적', '#계획적', '#주도적'],
    emoji: '\u{1F4CB}',
  },
  {
    id: 9,
    nameKR: '카리스마 리더',
    nameEN: 'The Charismatic Commander',
    description: '강렬한 존재감으로 사람들을 이끄는 타고난 리더',
    hashtags: ['#리더십', '#추진력', '#주도적'],
    emoji: '\u{1F451}',
  },
  {
    id: 10,
    nameKR: '합리적 실용주의자',
    nameEN: 'The Efficient Pragmatist',
    description: '효율과 실용을 최우선으로 여기는 합리적 현실주의자',
    hashtags: ['#현실적', '#효율적', '#논리적'],
    emoji: '\u2699\uFE0F',
  },
  {
    id: 11,
    nameKR: '진정성 있는 사색가',
    nameEN: 'The Authentic Thinker',
    description: '깊은 내면의 목소리에 귀 기울이며 진정성을 추구하는 사색가',
    hashtags: ['#성찰적', '#진정성', '#솔직함'],
    emoji: '\u{1F33F}',
  },
  {
    id: 12,
    nameKR: '감각적인 아티스트',
    nameEN: 'The Sensitive Creator',
    description: '섬세한 감각으로 아름다움을 창조하는 예술가 영혼',
    hashtags: ['#미적감각', '#섬세함', '#감성적'],
    emoji: '\u{1F3A8}',
  },
  {
    id: 13,
    nameKR: '무너지지 않는 오뚝이',
    nameEN: 'The Resilient Spirit',
    description: '어떤 어려움에도 다시 일어서는 강인한 회복력의 소유자',
    hashtags: ['#단단함', '#끈기', '#낙관적'],
    emoji: '\u{1F4AA}',
  },
  {
    id: 14,
    nameKR: '완벽을 추구하는 장인',
    nameEN: 'The Meticulous Master',
    description: '디테일 하나까지 완벽을 추구하는 장인 정신의 소유자',
    hashtags: ['#성실', '#신중함', '#성취지향'],
    emoji: '\u{1F527}',
  },
  {
    id: 15,
    nameKR: '묵묵한 조력자',
    nameEN: 'The Devoted Supporter',
    description: '묵묵히 헌신하며 팀을 뒤에서 지원하는 든든한 조력자',
    hashtags: ['#배려', '#협조적', '#성실'],
    emoji: '\u{1F31F}',
  },
  {
    id: 16,
    nameKR: '주관 뚜렷한 마이웨이',
    nameEN: 'The Independent Soloist',
    description: '남의 눈치 보지 않고 자신만의 길을 가는 독립적 개인주의자',
    hashtags: ['#자립적', '#솔직함', '#원칙'],
    emoji: '\u{1F3AF}',
  },
  {
    id: 17,
    nameKR: '여유로운 현자',
    nameEN: 'The Gentle Sage',
    description: '넉넉한 마음으로 세상을 품고 지혜를 나누는 현자',
    hashtags: ['#평정심', '#포용력', '#유연함'],
    emoji: '\u{1F9D8}',
  },
  {
    id: 18,
    nameKR: '유연한 적응왕',
    nameEN: 'The Adaptive Improviser',
    description: '어떤 환경에서도 유연하게 적응하며 기회를 포착하는 적응의 달인',
    hashtags: ['#유연함', '#사교적', '#활기'],
    emoji: '\u{1F30A}',
  },
  {
    id: 19,
    nameKR: '신중한 수호자',
    nameEN: 'The Cautious Guardian',
    description: '소중한 것들을 지키기 위해 신중하게 대비하는 수호자',
    hashtags: ['#신중함', '#계획적', '#끈기'],
    emoji: '\u{1F6E1}\uFE0F',
  },
  {
    id: 20,
    nameKR: '긍정 에너지 발산가',
    nameEN: 'The Optimistic Energizer',
    description: '넘치는 긍정 에너지로 주변을 밝히는 활력소',
    hashtags: ['#낙관적', '#열정', '#친화력'],
    emoji: '\u2600\uFE0F',
  },
];

// =============================================================================
// Helper Functions
// =============================================================================

export function hashtagsByCategory(): Record<HashtagCategory, PersonalityHashtag[]> {
  return allHashtags.reduce(
    (acc, hashtag) => {
      acc[hashtag.category].push(hashtag);
      return acc;
    },
    {
      attitude: [] as PersonalityHashtag[],
      emotion: [] as PersonalityHashtag[],
      relationship: [] as PersonalityHashtag[],
      value: [] as PersonalityHashtag[],
    } as Record<HashtagCategory, PersonalityHashtag[]>,
  );
}

export function findHashtag(tag: string): PersonalityHashtag | undefined {
  return allHashtags.find((h) => h.tag === tag);
}

export function findPersonalityType(id: number): PersonalityType | undefined {
  return personalityTypes.find((t) => t.id === id);
}

export function recommendPersonalityTypes(userTags: string[]): PersonalityType[] {
  const tagSet = new Set(userTags);

  return personalityTypes
    .map((type) => {
      const matchCount = type.hashtags.filter((tag) => tagSet.has(tag)).length;
      return { type, matchCount };
    })
    .filter(({ matchCount }) => matchCount > 0)
    .sort((a, b) => b.matchCount - a.matchCount)
    .map(({ type }) => type);
}
