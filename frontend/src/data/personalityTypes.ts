import type { HashtagCategory, PersonalityHashtag, PersonalityType } from '../types/personality';

// =============================================================================
// 80 Personality Hashtags
// =============================================================================

export const allHashtags: PersonalityHashtag[] = [
  // -------------------------------------------------------------------------
  // 1. attitude (20)
  // -------------------------------------------------------------------------
  { id: '#성실', tag: '#성실', category: 'attitude', description: '요령을 피우기보다 정직한 땀방울의 가치를 믿고 꾸준히 임하는 태도' },
  { id: '#대담함', tag: '#대담함', category: 'attitude', description: '불확실한 상황에서도 두려움 없이 결단을 내리고 앞으로 나아가는 용기' },
  { id: '#신중함', tag: '#신중함', category: 'attitude', description: '돌다리도 두드려 보고 건너듯, 모든 가능성을 꼼꼼하게 살피는 태도' },
  { id: '#추진력', tag: '#추진력', category: 'attitude', description: '목표가 정해지면 망설임 없이 밀고 나가는 강력한 실행 에너지' },
  { id: '#끈기', tag: '#끈기', category: 'attitude', description: '비바람이 불어도 뿌리 깊은 나무처럼 쉽게 포기하지 않고 버티는 힘' },
  { id: '#여유', tag: '#여유', category: 'attitude', description: '바쁜 일상 속에서도 마음의 빈 공간을 잃지 않는 넉넉함' },
  { id: '#치밀함', tag: '#치밀함', category: 'attitude', description: '작은 빈틈도 허용하지 않고 완벽을 기하는 섬세한 장인 정신' },
  { id: '#순발력', tag: '#순발력', category: 'attitude', description: '예상치 못한 변화 앞에서도 당황하지 않고 즉각적으로 반응하는 민첩함' },
  { id: '#계획적', tag: '#계획적', category: 'attitude', description: '막연한 꿈을 현실로 만들기 위해 차근차근 지도를 그려나가는 습관' },
  { id: '#단호함', tag: '#단호함', category: 'attitude', description: '자신의 결정이나 입장을 흐리지 않고 분명하게 표현하는 태도' },
  { id: '#유연함', tag: '#유연함', category: 'attitude', description: '강한 바람에 부러지기보다 부드럽게 휘어질 줄 아는 지혜로운 태도' },
  { id: '#주도적', tag: '#주도적', category: 'attitude', description: '누가 시키지 않아도 스스로 일을 찾아서 하고 상황을 이끌어가는 자세' },
  { id: '#침착함', tag: '#침착함', category: 'attitude', description: '세상이 소란스러워도 내면의 고요함을 유지하며 차분하게 대응하는 상태' },
  { id: '#도전적', tag: '#도전적', category: 'attitude', description: '안전한 울타리에 안주하기보다 더 높은 곳, 새로운 세상을 향해 나아가는 자세' },
  { id: '#안정적', tag: '#안정적', category: 'attitude', description: '기복 없이 언제나 한결같은 모습으로 묵묵히 성과를 만들어내는 태도' },
  { id: '#부지런', tag: '#부지런', category: 'attitude', description: '주어진 시간을 허투루 쓰지 않고 성실하게 채워나가는 삶의 태도' },
  { id: '#효율적', tag: '#효율적', category: 'attitude', description: '최소한의 노력과 시간으로 최대한의 성과를 찾아내는 스마트한 방식' },
  { id: '#철저함', tag: '#철저함', category: 'attitude', description: '시작부터 끝까지 소홀함 없이 완벽을 기하는 프로의 자세' },
  { id: '#과감함', tag: '#과감함', category: 'attitude', description: '리스크가 있더라도 필요하다면 크게 베팅하고 행동하는 대범한 결단력' },
  { id: '#신속함', tag: '#신속함', category: 'attitude', description: '기회가 왔을 때 지체하지 않고 빠르게 낚아채는 민첩한 행동력' },

  // -------------------------------------------------------------------------
  // 2. emotion (20)
  // -------------------------------------------------------------------------
  { id: '#평정심', tag: '#평정심', category: 'emotion', description: '거친 파도 같은 감정 속에서도 중심을 잡고 흔들리지 않는 마음의 힘' },
  { id: '#섬세함', tag: '#섬세함', category: 'emotion', description: '남들이 무심코 지나치는 작은 감정의 결이나 변화까지 감지하는 능력' },
  { id: '#명랑함', tag: '#명랑함', category: 'emotion', description: '맑은 햇살처럼 밝고 쾌활한 기운으로 주변을 환하게 밝히는 성격' },
  { id: '#무던함', tag: '#무던함', category: 'emotion', description: '예민하게 반응하기보다 둥글게 상황을 받아들이고 넘길 줄 아는 수용력' },
  { id: '#다정함', tag: '#다정함', category: 'emotion', description: '타인에게 따뜻한 관심과 애정을 표현하며 마음을 녹이는 태도' },
  { id: '#냉철함', tag: '#냉철함', category: 'emotion', description: '감정에 치우치지 않고 상황을 객관적으로 바라보는 차분한 이성' },
  { id: '#성찰적', tag: '#성찰적', category: 'emotion', description: '바깥세상의 소란보다 내면의 목소리에 귀 기울이며 깊이 생각하는 태도' },
  { id: '#낙관적', tag: '#낙관적', category: 'emotion', description: '먹구름 뒤에 숨겨진 태양을 믿으며 언제나 희망을 이야기하는 태도' },
  { id: '#대비하는', tag: '#대비하는', category: 'emotion', description: '최악의 상황을 미리 그려보고 안전장치를 마련해두는 현명함' },
  { id: '#평온', tag: '#평온', category: 'emotion', description: '갈등이나 불안 없이 마음이 고요하고 편안한 상태를 추구하는 자세' },
  { id: '#열정', tag: '#열정', category: 'emotion', description: '좋아하는 일이나 목표를 향해 심장이 뜨겁게 뛰는 상태' },
  { id: '#객관적', tag: '#객관적', category: 'emotion', description: '내 감정이나 편견을 배제하고 사실 그대로를 바라보는 태도' },
  { id: '#겸손', tag: '#겸손', category: 'emotion', description: '충분히 뛰어난 능력을 갖추었음에도 스스로를 낮추는 태도' },
  { id: '#활기', tag: '#활기', category: 'emotion', description: '생동감이 넘치고 주변에 활력을 전파하는 에너지' },
  { id: '#담대함', tag: '#담대함', category: 'emotion', description: '눈앞에 닥친 위기나 큰일 앞에서도 위축되지 않는 용기' },
  { id: '#감각적', tag: '#감각적', category: 'emotion', description: '눈, 코, 입, 귀로 느껴지는 세상의 아름다움을 섬세하게 포착하는 능력' },
  { id: '#단단함', tag: '#단단함', category: 'emotion', description: '비난이나 실패 같은 외부의 충격에도 쉽게 무너지지 않는 내면의 힘' },
  { id: '#풍부한감성', tag: '#풍부한감성', category: 'emotion', description: '기쁨과 슬픔의 스펙트럼이 넓고 깊어 예술을 이해하는 감수성' },
  { id: '#이성적', tag: '#이성적', category: 'emotion', description: '뜨거운 감정보다 차가운 논리와 합리성을 우선시하는 태도' },
  { id: '#역동적', tag: '#역동적', category: 'emotion', description: '고여있는 물이 되기를 거부하고 끊임없이 움직이며 변화하는 에너지' },

  // -------------------------------------------------------------------------
  // 3. relationship (20)
  // -------------------------------------------------------------------------
  { id: '#사교적', tag: '#사교적', category: 'relationship', description: '낯선 사람에게도 스스럼없이 다가가 친해지는 능력' },
  { id: '#자립적', tag: '#자립적', category: 'relationship', description: '누군가에게 기대기보다 스스로의 힘으로 해내는 독립성' },
  { id: '#리더십', tag: '#리더십', category: 'relationship', description: '명확한 비전을 제시하고 사람들의 마음을 이끄는 능력' },
  { id: '#협조적', tag: '#협조적', category: 'relationship', description: '나 혼자 튀기보다 팀 전체의 목표를 위해 함께하는 태도' },
  { id: '#배려', tag: '#배려', category: 'relationship', description: '상대방의 입장에 서서 불편함이 없도록 세심하게 챙기는 마음' },
  { id: '#솔직함', tag: '#솔직함', category: 'relationship', description: '마음에도 없는 말로 꾸미기보다 있는 그대로 표현하는 태도' },
  { id: '#명쾌함', tag: '#명쾌함', category: 'relationship', description: '돌려 말하거나 애매하게 행동하지 않고 분명하게 표현하는 태도' },
  { id: '#포용력', tag: '#포용력', category: 'relationship', description: '나와 다른 의견이나 타인의 실수까지 품을 수 있는 넓은 마음' },
  { id: '#집중력', tag: '#집중력', category: 'relationship', description: '산만하게 흩어지지 않고 한 가지 대상에 깊이 몰입하는 능력' },
  { id: '#개방적', tag: '#개방적', category: 'relationship', description: '새로운 문화나 낯선 아이디어에 대해 열린 마음으로 받아들이는 태도' },
  { id: '#신의', tag: '#신의', category: 'relationship', description: '한번 맺은 약속이나 관계는 무슨 일이 있어도 지키려는 태도' },
  { id: '#센스', tag: '#센스', category: 'relationship', description: '말하지 않아도 상황의 분위기나 상대의 니즈를 파악하는 눈치' },
  { id: '#친화력', tag: '#친화력', category: 'relationship', description: '누구와도 금방 벽을 허물고 융화되어 편안해지는 능력' },
  { id: '#카리스마', tag: '#카리스마', category: 'relationship', description: '큰 소리 내지 않아도 좌중을 압도하는 존재감' },
  { id: '#수평적', tag: '#수평적', category: 'relationship', description: '직급이나 나이로 권위를 내세우기보다 동등하게 대화하는 태도' },
  { id: '#헌신적', tag: '#헌신적', category: 'relationship', description: '공동체나 소중한 사람을 위해 나의 이익을 내려놓는 태도' },
  { id: '#자기주관', tag: '#자기주관', category: 'relationship', description: '세상의 유행이나 타인의 평가에 휩쓸리지 않고 자신만의 기준을 지키는 태도' },
  { id: '#공감', tag: '#공감', category: 'relationship', description: '타인의 기쁨과 슬픔을 마치 내 일처럼 느끼며 함께하는 마음' },
  { id: '#중립적', tag: '#중립적', category: 'relationship', description: '감정이나 이해관계에 치우치지 않고 공정하게 판단하는 태도' },
  { id: '#에너지', tag: '#에너지', category: 'relationship', description: '지치지 않는 긍정의 힘으로 주변 사람들까지 충전시키는 능력' },

  // -------------------------------------------------------------------------
  // 4. value (20)
  // -------------------------------------------------------------------------
  { id: '#논리적', tag: '#논리적', category: 'value', description: '감정에 호소하기보다 앞뒤가 맞는 근거와 이성으로 설명하는 태도' },
  { id: '#직관적', tag: '#직관적', category: 'value', description: '구구절절한 설명 없이도 느낌과 통찰로 본질을 꿰뚫어보는 능력' },
  { id: '#현실적', tag: '#현실적', category: 'value', description: '뜬구름 잡는 소리보다 지금 당장 실현 가능한 방안을 추구하는 태도' },
  { id: '#이상적', tag: '#이상적', category: 'value', description: '눈앞의 현실을 넘어 더 나은 세상과 완벽한 결과를 꿈꾸는 태도' },
  { id: '#기본충실', tag: '#기본충실', category: 'value', description: '요행을 바라거나 기교를 부리기보다 기본에 충실한 태도' },
  { id: '#혁신적', tag: '#혁신적', category: 'value', description: '"원래 그래"라는 말에 의문을 던지고 새로운 방식을 찾는 태도' },
  { id: '#창의적', tag: '#창의적', category: 'value', description: '남들이 생각하지 못한 독창적인 시각으로 새로운 가치를 만드는 능력' },
  { id: '#실용적', tag: '#실용적', category: 'value', description: '겉만 번지르르한 명분보다 실제 생활이나 결과에 도움이 되는지를 따지는 태도' },
  { id: '#원칙', tag: '#원칙', category: 'value', description: '어떤 유혹이나 타협 앞에서도 자신이 정한 기준을 지키는 태도' },
  { id: '#낭만', tag: '#낭만', category: 'value', description: '삭막하고 바쁜 현실 속에서도 아름다움과 감성을 찾는 태도' },
  { id: '#단순함', tag: '#단순함', category: 'value', description: '복잡한 것을 걷어내고 가장 중요한 핵심만 남기는 간결함' },
  { id: '#미적감각', tag: '#미적감각', category: 'value', description: '사물의 아름다움을 발견하고 조화롭게 배치하는 감각' },
  { id: '#경제적', tag: '#경제적', category: 'value', description: '비용 대비 효과를 꼼꼼히 따져 가장 합리적인 선택을 하는 태도' },
  { id: '#성취지향', tag: '#성취지향', category: 'value', description: '단순히 하는 것에 만족하지 않고, 분명한 성과를 이루어내려는 욕구' },
  { id: '#호기심', tag: '#호기심', category: 'value', description: '"왜?"라는 질문을 멈추지 않고 세상 모든 것에 관심을 갖는 태도' },
  { id: '#분석적', tag: '#분석적', category: 'value', description: '겉으로 보이는 현상을 넘어 그 원리와 구조를 파악하려는 태도' },
  { id: '#진정성', tag: '#진정성', category: 'value', description: '사람이나 일을 대할 때 계산하거나 꾸미지 않고 진심을 담는 태도' },
  { id: '#전략적', tag: '#전략적', category: 'value', description: '무작정 열심히 하기보다 목표를 달성할 최적의 경로를 설계하는 태도' },
  { id: '#도덕적', tag: '#도덕적', category: 'value', description: '이익보다 옳고 그름을 먼저 따지며, 양심에 어긋남 없이 행동하는 태도' },
  { id: '#자유', tag: '#자유', category: 'value', description: '그 무엇에도 얽매이지 않고 자신의 의지대로 살아가려는 태도' },
];

// =============================================================================
// 22 Personality Types
// =============================================================================

export const personalityTypes: PersonalityType[] = [
  {
    id: 1,
    nameKR: '혁신적인 미래 설계자',
    nameEN: 'The Visionary Architect',
    description: '새로운 아이디어와 가능성을 탐구하며 미래를 설계하는 혁신가',
    hashtags: ['#혁신적', '#창의적', '#직관적', '#도전적', '#호기심'],
    emoji: '\u{1F680}', // rocket
  },
  {
    id: 2,
    nameKR: '거침없는 성취가',
    nameEN: 'The Driven Achiever',
    description: '목표를 향해 거침없이 달려가는 성취 지향적 실행가',
    hashtags: ['#성취지향', '#추진력', '#과감함', '#대담함', '#역동적'],
    emoji: '\u{1F3C6}', // trophy
  },
  {
    id: 3,
    nameKR: '따뜻한 조율자',
    nameEN: 'The Empathetic Mediator',
    description: '사람들 사이의 갈등을 조율하고 따뜻하게 연결하는 중재자',
    hashtags: ['#포용력', '#공감', '#다정함', '#협조적', '#배려'],
    emoji: '\u{1F91D}', // handshake
  },
  {
    id: 4,
    nameKR: '냉철한 분석가',
    nameEN: 'The Rational Analyst',
    description: '데이터와 논리로 문제의 핵심을 꿰뚫어보는 분석가',
    hashtags: ['#냉철함', '#분석적', '#논리적', '#객관적', '#치밀함'],
    emoji: '\u{1F50D}', // magnifying glass
  },
  {
    id: 5,
    nameKR: '든든한 원칙주의자',
    nameEN: 'The Reliable Pillar',
    description: '변함없는 원칙과 신뢰로 주변을 든든하게 지탱하는 기둥',
    hashtags: ['#안정적', '#성실', '#원칙', '#신의', '#도덕적'],
    emoji: '\u{1F3DB}\uFE0F', // classical building
  },
  {
    id: 6,
    nameKR: '자유로운 영혼의 모험가',
    nameEN: 'The Free-Spirited Explorer',
    description: '틀에 얽매이지 않고 자유롭게 세상을 탐험하는 모험가',
    hashtags: ['#자유', '#낭만', '#감각적', '#순발력', '#유연함'],
    emoji: '\u{1F98B}', // butterfly
  },
  {
    id: 7,
    nameKR: '유쾌한 분위기 메이커',
    nameEN: 'The Social Spark',
    description: '어디서든 분위기를 밝히고 사람들을 연결하는 사교의 달인',
    hashtags: ['#사교적', '#친화력', '#명랑함', '#센스', '#활기'],
    emoji: '\u{1F389}', // party popper
  },
  {
    id: 8,
    nameKR: '용의주도한 전략가',
    nameEN: 'The Prudent Strategist',
    description: '치밀한 계획과 전략으로 모든 상황에 대비하는 전략가',
    hashtags: ['#전략적', '#계획적', '#대비하는', '#신중함', '#철저함'],
    emoji: '\u265F\uFE0F', // chess pawn
  },
  {
    id: 9,
    nameKR: '카리스마 리더',
    nameEN: 'The Charismatic Commander',
    description: '강렬한 카리스마로 사람들을 이끄는 타고난 리더',
    hashtags: ['#리더십', '#카리스마', '#단호함', '#주도적', '#대담함'],
    emoji: '\u{1F451}', // crown
  },
  {
    id: 10,
    nameKR: '합리적인 실용주의자',
    nameEN: 'The Efficient Pragmatist',
    description: '효율과 실용을 최우선으로 여기는 합리적 현실주의자',
    hashtags: ['#실용적', '#효율적', '#현실적', '#경제적', '#단순함'],
    emoji: '\u2699\uFE0F', // gear
  },
  {
    id: 11,
    nameKR: '진정성 있는 사색가',
    nameEN: 'The Authentic Thinker',
    description: '깊은 내면의 목소리에 귀 기울이며 진정성을 추구하는 사색가',
    hashtags: ['#성찰적', '#진정성', '#이상적', '#평온', '#솔직함'],
    emoji: '\u{1F33F}', // herb
  },
  {
    id: 12,
    nameKR: '감각적인 아티스트',
    nameEN: 'The Sensitive Creator',
    description: '섬세한 감각으로 아름다움을 창조하는 예술가 영혼',
    hashtags: ['#미적감각', '#섬세함', '#풍부한감성', '#창의적', '#낭만'],
    emoji: '\u{1F3A8}', // artist palette
  },
  {
    id: 13,
    nameKR: '무너지지 않는 오뚝이',
    nameEN: 'The Resilient Spirit',
    description: '어떤 어려움에도 다시 일어서는 강인한 회복력의 소유자',
    hashtags: ['#단단함', '#끈기', '#낙관적', '#평정심', '#담대함'],
    emoji: '\u{1F4AA}', // flexed biceps
  },
  {
    id: 14,
    nameKR: '완벽을 추구하는 장인',
    nameEN: 'The Meticulous Master',
    description: '디테일 하나까지 완벽을 추구하는 장인 정신의 소유자',
    hashtags: ['#철저함', '#집중력', '#기본충실', '#치밀함', '#성실'],
    emoji: '\u{1F527}', // wrench
  },
  {
    id: 15,
    nameKR: '보이지 않는 조력자',
    nameEN: 'The Devoted Supporter',
    description: '묵묵히 헌신하며 팀을 뒤에서 지원하는 든든한 조력자',
    hashtags: ['#헌신적', '#겸손', '#협조적', '#배려', '#무던함'],
    emoji: '\u{1F31F}', // glowing star
  },
  {
    id: 16,
    nameKR: '주관 뚜렷한 마이웨이',
    nameEN: 'The Independent Soloist',
    description: '남의 눈치 보지 않고 자신만의 길을 가는 독립적 개인주의자',
    hashtags: ['#자립적', '#자기주관', '#명쾌함', '#단호함', '#솔직함'],
    emoji: '\u{1F3AF}', // bullseye
  },
  {
    id: 17,
    nameKR: '여유로운 현자',
    nameEN: 'The Gentle Sage',
    description: '넉넉한 마음으로 세상을 품고 지혜를 나누는 현자',
    hashtags: ['#여유', '#포용력', '#무던함', '#평정심', '#수평적'],
    emoji: '\u{1F9D8}', // person in lotus position
  },
  {
    id: 18,
    nameKR: '유연한 적응왕',
    nameEN: 'The Adaptive Improviser',
    description: '어떤 환경에서도 유연하게 적응하며 기회를 포착하는 적응의 달인',
    hashtags: ['#유연함', '#개방적', '#순발력', '#신속함', '#사교적'],
    emoji: '\u{1F30A}', // water wave
  },
  {
    id: 19,
    nameKR: '신중한 수호자',
    nameEN: 'The Cautious Guardian',
    description: '소중한 것들을 지키기 위해 신중하게 대비하는 수호자',
    hashtags: ['#신중함', '#대비하는', '#안정적', '#신의', '#원칙'],
    emoji: '\u{1F6E1}\uFE0F', // shield
  },
  {
    id: 20,
    nameKR: '긍정 에너지 발산가',
    nameEN: 'The Optimistic Energizer',
    description: '넘치는 긍정 에너지로 주변을 밝히는 활력소',
    hashtags: ['#에너지', '#열정', '#낙관적', '#활기', '#명랑함'],
    emoji: '\u2600\uFE0F', // sun
  },
  {
    id: 21,
    nameKR: '흔들리지 않는 이성주의자',
    nameEN: 'The Stoic Rationalist',
    description: '감정에 흔들리지 않고 이성으로 판단하는 냉정한 사상가',
    hashtags: ['#이성적', '#침착함', '#객관적', '#중립적', '#냉철함'],
    emoji: '\u{1F9CA}', // ice
  },
  {
    id: 22,
    nameKR: '민첩한 해결사',
    nameEN: 'The Agile Solver',
    description: '빠른 판단과 실행력으로 문제를 해결하는 민첩한 해결사',
    hashtags: ['#신속함', '#효율적', '#주도적', '#순발력', '#현실적'],
    emoji: '\u26A1', // high voltage
  },
];

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Group all hashtags by their category.
 */
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

/**
 * Find a single hashtag by its tag string (e.g. "#성실").
 */
export function findHashtag(tag: string): PersonalityHashtag | undefined {
  return allHashtags.find((h) => h.tag === tag);
}

/**
 * Find a personality type by its numeric id.
 */
export function findPersonalityType(id: number): PersonalityType | undefined {
  return personalityTypes.find((t) => t.id === id);
}

/**
 * Given a set of user-selected hashtag strings, return personality types
 * sorted by how many of their hashtags match (descending). Only types
 * with at least one match are returned.
 */
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
