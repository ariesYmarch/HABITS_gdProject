// personalityTestQuestions.ts
// HABITS - Personality Test Data
//
// 성격 유형 판별 테스트 데이터
// - 현재 성격 테스트 30문항
// - 이상적 성격 테스트 30문항

import type {
  PersonalityTestType,
  TestCategory,
  TestChoice,
  TestQuestion,
  PersonalityType,
} from '../types/personality';

// --------------------------------------------------------------------------
// 현재 성격 테스트 (30문항)
// --------------------------------------------------------------------------
export const currentPersonalityTest: TestQuestion[] = [
  // 태도 (1-8)
  {
    id: 1,
    category: 'attitude',
    question: '새로운 프로젝트를 시작할 때 나는?',
    choiceA: { text: '일단 시작하고 보면서 수정한다', tags: ['#추진력', '#대담함'] },
    choiceB: { text: '완벽한 계획을 세운 뒤 움직인다', tags: ['#치밀함', '#계획적'] },
  },
  {
    id: 2,
    category: 'attitude',
    question: '예상치 못한 문제가 터졌을 때 나는?',
    choiceA: { text: '"어떻게든 되겠지"라며 유연하게 대처한다', tags: ['#유연함', '#순발력'] },
    choiceB: { text: '매뉴얼과 원칙을 확인하며 정석대로 푼다', tags: ['#신중함', '#원칙'] },
  },
  {
    id: 3,
    category: 'attitude',
    question: '업무나 과제를 처리하는 스타일은?',
    choiceA: { text: '마감 직전에 폭발적인 에너지로 끝낸다', tags: ['#순발력', '#집중력'] },
    choiceB: { text: '미리미리 조금씩 해두어 여유를 갖는다', tags: ['#성실', '#여유'] },
  },
  {
    id: 4,
    category: 'attitude',
    question: '더 선호하는 일의 방식은?',
    choiceA: { text: '효율적으로 핵심만 빠르게 처리하기', tags: ['#효율적', '#신속함'] },
    choiceB: { text: '시간이 걸려도 디테일까지 완벽하게', tags: ['#철저함', '#치밀함'] },
  },
  {
    id: 5,
    category: 'attitude',
    question: '낯선 환경이나 새로운 도전에 대해',
    choiceA: { text: '설레는 마음으로 즐겁게 뛰어든다', tags: ['#도전적', '#대담함'] },
    choiceB: { text: '익숙하고 안정적인 환경을 선호한다', tags: ['#안정적', '#신중함'] },
  },
  {
    id: 6,
    category: 'attitude',
    question: '결정을 내려야 할 때 나는?',
    choiceA: { text: '나의 직감과 느낌을 믿고 따른다', tags: ['#직관적', '#과감함'] },
    choiceB: { text: '데이터와 정보를 꼼꼼히 비교한다', tags: ['#분석적', '#현실적'] },
  },
  {
    id: 7,
    category: 'attitude',
    question: '나의 하루 일과는?',
    choiceA: { text: '그때그때 하고 싶은 일을 하는 편이다', tags: ['#자유', '#유연함'] },
    choiceB: { text: '정해진 루틴대로 움직이는 편이다', tags: ['#계획적', '#부지런'] },
  },
  {
    id: 8,
    category: 'attitude',
    question: '실패했을 때 나의 반응은?',
    choiceA: { text: '"경험이지 뭐" 하고 툭 털고 일어난다', tags: ['#낙관적', '#단단함'] },
    choiceB: { text: '원인을 철저히 분석하고 복기한다', tags: ['#성찰적', '#분석적'] },
  },

  // 정서 (9-15)
  {
    id: 9,
    category: 'emotion',
    question: '스트레스를 받을 때 나는?',
    choiceA: { text: '사람들을 만나 수다 떨며 푼다', tags: ['#활기', '#사교적'] },
    choiceB: { text: '혼자만의 시간을 가지며 에너지를 채운다', tags: ['#평온', '#성찰적'] },
  },
  {
    id: 10,
    category: 'emotion',
    question: '친구가 우울해할 때 나는?',
    choiceA: { text: '해결책을 제시해 주는 게 진정한 도움이다', tags: ['#이성적', '#논리적'] },
    choiceB: { text: '묵묵히 들어주고 감정에 공감해 준다', tags: ['#다정함', '#공감'] },
  },
  {
    id: 11,
    category: 'emotion',
    question: '평소 나의 감정 상태는?',
    choiceA: { text: '기쁨과 슬픔의 파도가 크고 풍부하다', tags: ['#풍부한감성', '#열정'] },
    choiceB: { text: '잔잔한 호수처럼 기복 없이 일정하다', tags: ['#평정심', '#무던함'] },
  },
  {
    id: 12,
    category: 'emotion',
    question: '타인의 비판이나 지적에 대해',
    choiceA: { text: '감정적으로 상처받기보다 사실 여부를 따진다', tags: ['#냉철함', '#객관적'] },
    choiceB: { text: '마음이 쓰여서 오랫동안 곱씹게 된다', tags: ['#섬세함', '#성찰적'] },
  },
  {
    id: 13,
    category: 'emotion',
    question: '미래에 대한 나의 태도는?',
    choiceA: { text: '"어떻게든 잘 될 거야"라고 믿는다', tags: ['#낙관적', '#에너지'] },
    choiceB: { text: '최악의 상황까지 미리 대비해둔다', tags: ['#대비하는', '#신중함'] },
  },
  {
    id: 14,
    category: 'emotion',
    question: '아름다운 풍경이나 예술을 볼 때',
    choiceA: { text: '감동하여 벅차오르는 기분을 느낀다', tags: ['#낭만', '#미적감각'] },
    choiceB: { text: '구도나 원리, 비용 등을 생각한다', tags: ['#현실적', '#분석적'] },
  },
  {
    id: 15,
    category: 'emotion',
    question: '나 자신에 대해 생각할 때',
    choiceA: { text: '부족한 점을 채우려 노력한다', tags: ['#겸손', '#성찰적'] },
    choiceB: { text: '있는 그대로의 내 모습을 사랑한다', tags: ['#자기주관', '#평정심'] },
  },

  // 관계 (16-23)
  {
    id: 16,
    category: 'relationship',
    question: '모임에서 어색한 침묵이 흐르면?',
    choiceA: { text: '내가 먼저 말을 꺼내 분위기를 띄운다', tags: ['#사교적', '#명랑함'] },
    choiceB: { text: '누군가 말할 때까지 차분히 기다린다', tags: ['#여유', '#신중함'] },
  },
  {
    id: 17,
    category: 'relationship',
    question: '팀 프로젝트에서 선호하는 역할은?',
    choiceA: { text: '전체를 이끄는 리더 역할', tags: ['#리더십', '#주도적'] },
    choiceB: { text: '묵묵히 제 몫을 다하는 서포터 역할', tags: ['#협조적', '#헌신적'] },
  },
  {
    id: 18,
    category: 'relationship',
    question: '거절하기 힘든 부탁을 받았을 때',
    choiceA: { text: '관계가 어색해질까 봐 들어주는 편이다', tags: ['#배려', '#다정함'] },
    choiceB: { text: '내 상황을 설명하고 단호하게 거절한다', tags: ['#단호함', '#솔직함'] },
  },
  {
    id: 19,
    category: 'relationship',
    question: '갈등 상황이 생겼을 때 나는?',
    choiceA: { text: '내 주장을 논리적으로 관철시킨다', tags: ['#논리적', '#자기주관'] },
    choiceB: { text: '서로 양보하며 평화롭게 해결하려 한다', tags: ['#포용력', '#협조적'] },
  },
  {
    id: 20,
    category: 'relationship',
    question: '사람을 사귈 때 나의 스타일은?',
    choiceA: { text: '두루두루 넓고 얕게 아는 사이가 많다', tags: ['#친화력', '#개방적'] },
    choiceB: { text: '소수의 사람과 깊고 진한 관계를 맺는다', tags: ['#신의', '#집중력'] },
  },
  {
    id: 21,
    category: 'relationship',
    question: '나의 화법에 더 가까운 것은?',
    choiceA: { text: '돌려 말하지 않고 핵심만 직설적으로', tags: ['#명쾌함', '#솔직함'] },
    choiceB: { text: '상대의 기분을 배려해 우회적으로', tags: ['#센스', '#배려'] },
  },
  {
    id: 22,
    category: 'relationship',
    question: '칭찬을 들었을 때 반응은?',
    choiceA: { text: '기분 좋게 인정하고 즐긴다', tags: ['#자기주관', '#솔직함'] },
    choiceB: { text: '"아니에요"라며 공을 타인에게 돌린다', tags: ['#겸손', '#배려'] },
  },
  {
    id: 23,
    category: 'relationship',
    question: '조직 생활에서 더 중요한 것은?',
    choiceA: { text: '수직적인 체계와 질서', tags: ['#원칙', '#안정적'] },
    choiceB: { text: '수평적이고 자유로운 소통', tags: ['#수평적', '#개방적'] },
  },

  // 가치관 (24-30)
  {
    id: 24,
    category: 'value',
    question: '무엇을 선택할 때 기준은?',
    choiceA: { text: '그것이 나에게 주는 \'의미\'와 \'가치\'', tags: ['#이상적', '#진정성'] },
    choiceB: { text: '가성비와 실질적인 \'이득\'', tags: ['#실용적', '#경제적'] },
  },
  {
    id: 25,
    category: 'value',
    question: '세상을 바라보는 나의 시각은?',
    choiceA: { text: '"원래 그런 건 없다"며 변화를 꿈꾼다', tags: ['#혁신적', '#창의적'] },
    choiceB: { text: '오랜 지혜와 검증된 방식을 존중한다', tags: ['#원칙', '#안정적'] },
  },
  {
    id: 26,
    category: 'value',
    question: '일에서 보람을 느끼는 순간은?',
    choiceA: { text: '눈에 보이는 확실한 성과를 냈을 때', tags: ['#성취지향', '#현실적'] },
    choiceB: { text: '새로운 것을 배우고 성장했음을 느낄 때', tags: ['#호기심', '#성찰적'] },
  },
  {
    id: 27,
    category: 'value',
    question: '타인을 도울 때 나의 마음은?',
    choiceA: { text: '도덕적 의무감과 옳음 때문에', tags: ['#도덕적', '#원칙'] },
    choiceB: { text: '마음에서 우러나오는 측은지심 때문에', tags: ['#공감', '#헌신적'] },
  },
  {
    id: 28,
    category: 'value',
    question: '복잡한 문제를 해결하는 방법은?',
    choiceA: { text: '직관적인 통찰로 단번에 꿰뚫는다', tags: ['#직관적', '#창의적'] },
    choiceB: { text: '하나씩 쪼개어 논리적으로 파고든다', tags: ['#논리적', '#치밀함'] },
  },
  {
    id: 29,
    category: 'value',
    question: '나에게 \'성공\'이란?',
    choiceA: { text: '사회적인 인정과 높은 지위', tags: ['#성취지향', '#추진력'] },
    choiceB: { text: '내면의 평화와 자유로운 삶', tags: ['#평온', '#자유'] },
  },
  {
    id: 30,
    category: 'value',
    question: '더 중요하게 생각하는 것은?',
    choiceA: { text: '숲을 보는 거시적인 안목', tags: ['#직관적', '#전략적'] },
    choiceB: { text: '나무를 보는 디테일한 관찰력', tags: ['#섬세함', '#치밀함'] },
  },
];

// --------------------------------------------------------------------------
// 이상적 성격 테스트 (30문항)
// --------------------------------------------------------------------------
export const idealPersonalityTest: TestQuestion[] = [
  // 태도 (1-8)
  {
    id: 1,
    category: 'attitude',
    question: '어떤 일 처리 능력을 갖고 싶은가?',
    choiceA: { text: '망설임 없는 과감한 실행력', tags: ['#추진력', '#대담함'] },
    choiceB: { text: '빈틈없는 완벽한 계획성', tags: ['#치밀함', '#계획적'] },
  },
  {
    id: 2,
    category: 'attitude',
    question: '위기 상황에서 어떤 사람이 되고 싶은가?',
    choiceA: { text: '유연하게 상황을 넘기는 재치 있는 사람', tags: ['#유연함', '#순발력'] },
    choiceB: { text: '원칙을 지키며 흔들리지 않는 사람', tags: ['#신중함', '#원칙'] },
  },
  {
    id: 3,
    category: 'attitude',
    question: '어떤 업무 스타일을 동경하는가?',
    choiceA: { text: '단기간에 폭발적인 성과를 내는 스타일', tags: ['#순발력', '#집중력'] },
    choiceB: { text: '꾸준함으로 결국 이뤄내는 스타일', tags: ['#성실', '#여유'] },
  },
  {
    id: 4,
    category: 'attitude',
    question: '어떤 결과물을 만들어내고 싶은가?',
    choiceA: { text: '빠르고 효율적인 결과물', tags: ['#효율적', '#신속함'] },
    choiceB: { text: '장인 정신이 깃든 완벽한 결과물', tags: ['#철저함', '#치밀함'] },
  },
  {
    id: 5,
    category: 'attitude',
    question: '어떤 삶의 태도를 갖고 싶은가?',
    choiceA: { text: '끊임없이 도전하고 모험하는 삶', tags: ['#도전적', '#대담함'] },
    choiceB: { text: '안정되고 평화로운 삶', tags: ['#안정적', '#신중함'] },
  },
  {
    id: 6,
    category: 'attitude',
    question: '어떤 판단력을 갖고 싶은가?',
    choiceA: { text: '동물적인 감각과 직관', tags: ['#직관적', '#과감함'] },
    choiceB: { text: '날카로운 데이터 분석 능력', tags: ['#분석적', '#현실적'] },
  },
  {
    id: 7,
    category: 'attitude',
    question: '어떤 라이프스타일을 꿈꾸는가?',
    choiceA: { text: '자유롭고 얽매이지 않는 삶', tags: ['#자유', '#유연함'] },
    choiceB: { text: '규칙적이고 절제된 삶', tags: ['#계획적', '#부지런'] },
  },
  {
    id: 8,
    category: 'attitude',
    question: '실패 앞에서 어떤 모습이고 싶은가?',
    choiceA: { text: '오뚝이처럼 바로 일어나는 회복력', tags: ['#낙관적', '#단단함'] },
    choiceB: { text: '실패를 통해 깊이 배우는 성찰력', tags: ['#성찰적', '#분석적'] },
  },

  // 정서 (9-15)
  {
    id: 9,
    category: 'emotion',
    question: '에너지를 얻는 이상적인 방식은?',
    choiceA: { text: '사람들과 어울리며 얻는 활기', tags: ['#활기', '#사교적'] },
    choiceB: { text: '고요한 혼자만의 시간', tags: ['#평온', '#성찰적'] },
  },
  {
    id: 10,
    category: 'emotion',
    question: '친구에게 어떤 존재가 되고 싶은가?',
    choiceA: { text: '명쾌한 해결책을 주는 멘토', tags: ['#이성적', '#논리적'] },
    choiceB: { text: '따뜻하게 품어주는 힐러', tags: ['#다정함', '#공감'] },
  },
  {
    id: 11,
    category: 'emotion',
    question: '어떤 감성을 갖고 싶은가?',
    choiceA: { text: '풍부하고 열정적인 예술가적 감성', tags: ['#풍부한감성', '#열정'] },
    choiceB: { text: '어떤 상황에도 동요하지 않는 평정심', tags: ['#평정심', '#무던함'] },
  },
  {
    id: 12,
    category: 'emotion',
    question: '타인의 평가에 대해',
    choiceA: { text: '팩트만 받아들이는 쿨한 태도', tags: ['#냉철함', '#객관적'] },
    choiceB: { text: '타인의 마음까지 헤아리는 섬세함', tags: ['#섬세함', '#성찰적'] },
  },
  {
    id: 13,
    category: 'emotion',
    question: '미래를 대하는 태도로 원하는 것은?',
    choiceA: { text: '무한한 긍정과 희망', tags: ['#낙관적', '#에너지'] },
    choiceB: { text: '철저한 대비와 유비무환', tags: ['#대비하는', '#신중함'] },
  },
  {
    id: 14,
    category: 'emotion',
    question: '세상을 보는 눈으로 원하는 것은?',
    choiceA: { text: '아름다움을 발견하는 심미안', tags: ['#낭만', '#미적감각'] },
    choiceB: { text: '본질과 이익을 꿰뚫는 현실감각', tags: ['#현실적', '#분석적'] },
  },
  {
    id: 15,
    category: 'emotion',
    question: '자존감의 원천으로 원하는 것은?',
    choiceA: { text: '부족함을 채워가는 성장 마인드', tags: ['#겸손', '#성찰적'] },
    choiceB: { text: '나 자체로 충분하다는 확신', tags: ['#자기주관', '#평정심'] },
  },

  // 관계 (16-23)
  {
    id: 16,
    category: 'relationship',
    question: '모임에서 어떤 역할을 하고 싶은가?',
    choiceA: { text: '분위기를 주도하는 주인공', tags: ['#사교적', '#명랑함'] },
    choiceB: { text: '무게감 있게 자리를 지키는 사람', tags: ['#여유', '#신중함'] },
  },
  {
    id: 17,
    category: 'relationship',
    question: '조직에서 어떤 위치에 있고 싶은가?',
    choiceA: { text: '앞에서 이끄는 카리스마 리더', tags: ['#리더십', '#주도적'] },
    choiceB: { text: '뒤에서 받쳐주는 든든한 조력자', tags: ['#협조적', '#헌신적'] },
  },
  {
    id: 18,
    category: 'relationship',
    question: '인간관계에서 더 갖고 싶은 능력은?',
    choiceA: { text: '모두를 챙기는 세심한 배려심', tags: ['#배려', '#다정함'] },
    choiceB: { text: '싫은 건 싫다고 말하는 용기', tags: ['#단호함', '#솔직함'] },
  },
  {
    id: 19,
    category: 'relationship',
    question: '갈등 해결 방식으로 선호하는 것은?',
    choiceA: { text: '논리 정연하게 설득하는 능력', tags: ['#논리적', '#자기주관'] },
    choiceB: { text: '부드럽게 감싸 안는 포용력', tags: ['#포용력', '#협조적'] },
  },
  {
    id: 20,
    category: 'relationship',
    question: '인간관계의 이상적인 형태는?',
    choiceA: { text: '발이 넓은 마당발 인맥', tags: ['#친화력', '#개방적'] },
    choiceB: { text: '목숨도 줄 수 있는 깊은 우정', tags: ['#신의', '#집중력'] },
  },
  {
    id: 21,
    category: 'relationship',
    question: '멋있다고 생각하는 화법은?',
    choiceA: { text: '핵심만 찌르는 사이다 화법', tags: ['#명쾌함', '#솔직함'] },
    choiceB: { text: '기분 좋게 만드는 센스 있는 화법', tags: ['#센스', '#배려'] },
  },
  {
    id: 22,
    category: 'relationship',
    question: '칭찬받을 때의 태도로 원하는 것은?',
    choiceA: { text: '당당하게 즐기는 자신감', tags: ['#자기주관', '#솔직함'] },
    choiceB: { text: '겸손하게 낮추는 미덕', tags: ['#겸손', '#배려'] },
  },
  {
    id: 23,
    category: 'relationship',
    question: '이상적인 조직 문화는?',
    choiceA: { text: '질서와 체계가 잡힌 곳', tags: ['#원칙', '#안정적'] },
    choiceB: { text: '누구나 자유롭게 의견 내는 곳', tags: ['#수평적', '#개방적'] },
  },

  // 가치관 (24-30)
  {
    id: 24,
    category: 'value',
    question: '의사결정의 기준으로 삼고 싶은 것은?',
    choiceA: { text: '가슴이 시키는 의미와 신념', tags: ['#이상적', '#진정성'] },
    choiceB: { text: '머리가 계산하는 실리와 효율', tags: ['#실용적', '#경제적'] },
  },
  {
    id: 25,
    category: 'value',
    question: '세상을 대하는 태도로 원하는 것은?',
    choiceA: { text: '세상을 바꾸려는 혁신가', tags: ['#혁신적', '#창의적'] },
    choiceB: { text: '세상을 지탱하는 수호자', tags: ['#원칙', '#안정적'] },
  },
  {
    id: 26,
    category: 'value',
    question: '일에서 얻고 싶은 최고의 가치는?',
    choiceA: { text: '눈부신 성과와 보상', tags: ['#성취지향', '#현실적'] },
    choiceB: { text: '배움과 내적 성장', tags: ['#호기심', '#성찰적'] },
  },
  {
    id: 27,
    category: 'value',
    question: '선행의 동기로 더 멋진 것은?',
    choiceA: { text: '마땅히 해야 할 도덕적 의무', tags: ['#도덕적', '#원칙'] },
    choiceB: { text: '뜨거운 인류애와 사랑', tags: ['#공감', '#헌신적'] },
  },
  {
    id: 28,
    category: 'value',
    question: '문제 해결사로서 원하는 능력은?',
    choiceA: { text: '천재적인 직관과 통찰', tags: ['#직관적', '#창의적'] },
    choiceB: { text: '완벽한 논리와 분석', tags: ['#논리적', '#치밀함'] },
  },
  {
    id: 29,
    category: 'value',
    question: '인생의 성공이라 생각하는 것은?',
    choiceA: { text: '정상에 올라 세상을 호령하는 것', tags: ['#성취지향', '#추진력'] },
    choiceB: { text: '누구에게도 방해받지 않는 평화', tags: ['#평온', '#자유'] },
  },
  {
    id: 30,
    category: 'value',
    question: '어떤 시야를 갖고 싶은가?',
    choiceA: { text: '시대를 읽는 거시적 안목', tags: ['#직관적', '#전략적'] },
    choiceB: { text: '작은 것도 놓치지 않는 관찰력', tags: ['#섬세함', '#치밀함'] },
  },
];

// --------------------------------------------------------------------------
// 22개 성격 유형 (매칭용)
// --------------------------------------------------------------------------
export const personalityTypes: PersonalityType[] = [
  {
    id: 1,
    nameKR: '혁신적인 미래 설계자',
    nameEN: 'The Visionary Architect',
    description: '새로운 아이디어와 가능성을 탐구하며 미래를 설계하는 혁신가',
    hashtags: ['#혁신적', '#창의적', '#직관적', '#도전적', '#호기심'],
    emoji: '',
  },
  {
    id: 2,
    nameKR: '거침없는 성취가',
    nameEN: 'The Driven Achiever',
    description: '목표를 향해 거침없이 달려가는 성취 지향적 실행가',
    hashtags: ['#성취지향', '#추진력', '#과감함', '#대담함', '#역동적'],
    emoji: '',
  },
  {
    id: 3,
    nameKR: '따뜻한 조율자',
    nameEN: 'The Empathetic Mediator',
    description: '사람들 사이의 갈등을 조율하고 따뜻하게 연결하는 중재자',
    hashtags: ['#포용력', '#공감', '#다정함', '#협조적', '#배려'],
    emoji: '',
  },
  {
    id: 4,
    nameKR: '냉철한 분석가',
    nameEN: 'The Rational Analyst',
    description: '데이터와 논리로 문제의 핵심을 꿰뚫어보는 분석가',
    hashtags: ['#냉철함', '#분석적', '#논리적', '#객관적', '#치밀함'],
    emoji: '',
  },
  {
    id: 5,
    nameKR: '든든한 원칙주의자',
    nameEN: 'The Reliable Pillar',
    description: '변함없는 원칙과 신뢰로 주변을 든든하게 지탱하는 기둥',
    hashtags: ['#안정적', '#성실', '#원칙', '#신의', '#도덕적'],
    emoji: '',
  },
  {
    id: 6,
    nameKR: '자유로운 영혼의 모험가',
    nameEN: 'The Free-Spirited Explorer',
    description: '틀에 얽매이지 않고 자유롭게 세상을 탐험하는 모험가',
    hashtags: ['#자유', '#낭만', '#감각적', '#순발력', '#유연함'],
    emoji: '',
  },
  {
    id: 7,
    nameKR: '유쾌한 분위기 메이커',
    nameEN: 'The Social Spark',
    description: '어디서든 분위기를 밝히고 사람들을 연결하는 사교의 달인',
    hashtags: ['#사교적', '#친화력', '#명랑함', '#센스', '#활기'],
    emoji: '',
  },
  {
    id: 8,
    nameKR: '용의주도한 전략가',
    nameEN: 'The Prudent Strategist',
    description: '치밀한 계획과 전략으로 모든 상황에 대비하는 전략가',
    hashtags: ['#전략적', '#계획적', '#대비하는', '#신중함', '#철저함'],
    emoji: '',
  },
  {
    id: 9,
    nameKR: '카리스마 리더',
    nameEN: 'The Charismatic Commander',
    description: '강렬한 카리스마로 사람들을 이끄는 타고난 리더',
    hashtags: ['#리더십', '#카리스마', '#단호함', '#주도적', '#대담함'],
    emoji: '',
  },
  {
    id: 10,
    nameKR: '합리적인 실용주의자',
    nameEN: 'The Efficient Pragmatist',
    description: '효율과 실용을 최우선으로 여기는 합리적 현실주의자',
    hashtags: ['#실용적', '#효율적', '#현실적', '#경제적', '#단순함'],
    emoji: '',
  },
  {
    id: 11,
    nameKR: '진정성 있는 사색가',
    nameEN: 'The Authentic Thinker',
    description: '깊은 내면의 목소리에 귀 기울이며 진정성을 추구하는 사색가',
    hashtags: ['#성찰적', '#진정성', '#이상적', '#평온', '#솔직함'],
    emoji: '',
  },
  {
    id: 12,
    nameKR: '감각적인 아티스트',
    nameEN: 'The Sensitive Creator',
    description: '섬세한 감각으로 아름다움을 창조하는 예술가 영혼',
    hashtags: ['#미적감각', '#섬세함', '#풍부한감성', '#창의적', '#낭만'],
    emoji: '',
  },
  {
    id: 13,
    nameKR: '무너지지 않는 오뚝이',
    nameEN: 'The Resilient Spirit',
    description: '어떤 어려움에도 다시 일어서는 강인한 회복력의 소유자',
    hashtags: ['#단단함', '#끈기', '#낙관적', '#평정심', '#담대함'],
    emoji: '',
  },
  {
    id: 14,
    nameKR: '완벽을 추구하는 장인',
    nameEN: 'The Meticulous Master',
    description: '디테일 하나까지 완벽을 추구하는 장인 정신의 소유자',
    hashtags: ['#철저함', '#집중력', '#기본충실', '#치밀함', '#성실'],
    emoji: '',
  },
  {
    id: 15,
    nameKR: '보이지 않는 조력자',
    nameEN: 'The Devoted Supporter',
    description: '묵묵히 헌신하며 팀을 뒤에서 지원하는 든든한 조력자',
    hashtags: ['#헌신적', '#겸손', '#협조적', '#배려', '#무던함'],
    emoji: '',
  },
  {
    id: 16,
    nameKR: '주관 뚜렷한 마이웨이',
    nameEN: 'The Independent Soloist',
    description: '남의 눈치 보지 않고 자신만의 길을 가는 독립적 개인주의자',
    hashtags: ['#자립적', '#자기주관', '#명쾌함', '#단호함', '#솔직함'],
    emoji: '',
  },
  {
    id: 17,
    nameKR: '여유로운 현자',
    nameEN: 'The Gentle Sage',
    description: '넉넉한 마음으로 세상을 품고 지혜를 나누는 현자',
    hashtags: ['#여유', '#포용력', '#무던함', '#평정심', '#수평적'],
    emoji: '',
  },
  {
    id: 18,
    nameKR: '유연한 적응왕',
    nameEN: 'The Adaptive Improviser',
    description: '어떤 환경에서도 유연하게 적응하며 기회를 포착하는 적응의 달인',
    hashtags: ['#유연함', '#개방적', '#순발력', '#신속함', '#사교적'],
    emoji: '',
  },
  {
    id: 19,
    nameKR: '신중한 수호자',
    nameEN: 'The Cautious Guardian',
    description: '소중한 것들을 지키기 위해 신중하게 대비하는 수호자',
    hashtags: ['#신중함', '#대비하는', '#안정적', '#신의', '#원칙'],
    emoji: '',
  },
  {
    id: 20,
    nameKR: '긍정 에너지 발산가',
    nameEN: 'The Optimistic Energizer',
    description: '넘치는 긍정 에너지로 주변을 밝히는 활력소',
    hashtags: ['#에너지', '#열정', '#낙관적', '#활기', '#명랑함'],
    emoji: '',
  },
  {
    id: 21,
    nameKR: '흔들리지 않는 이성주의자',
    nameEN: 'The Stoic Rationalist',
    description: '감정에 흔들리지 않고 이성으로 판단하는 냉정한 사상가',
    hashtags: ['#이성적', '#침착함', '#객관적', '#중립적', '#냉철함'],
    emoji: '',
  },
  {
    id: 22,
    nameKR: '민첩한 해결사',
    nameEN: 'The Agile Solver',
    description: '빠른 판단과 실행력으로 문제를 해결하는 민첩한 해결사',
    hashtags: ['#신속함', '#효율적', '#주도적', '#순발력', '#현실적'],
    emoji: '',
  },
];

// --------------------------------------------------------------------------
// 테스트 결과에서 질문 세트를 선택하는 헬퍼
// --------------------------------------------------------------------------
export function getTestQuestions(testType: PersonalityTestType): TestQuestion[] {
  return testType === 'current' ? currentPersonalityTest : idealPersonalityTest;
}

// --------------------------------------------------------------------------
// 테스트 결과 분석
// --------------------------------------------------------------------------

/**
 * answers: questionId -> true(A 선택) / false(B 선택)
 * testType: 'current' | 'ideal'
 *
 * 반환값:
 *   tags      - 태그별 누적 점수  { '#추진력': 3, '#대담함': 2, ... }
 *   personalityType - 가장 잘 맞는 PersonalityType (없으면 null)
 */
export function analyzeTestResult(
  answers: Record<number, boolean>,
  testType: PersonalityTestType,
): { tags: Record<string, number>; personalityType: PersonalityType | null } {
  const questions = getTestQuestions(testType);
  const tagScores: Record<string, number> = {};

  for (const [questionIdStr, choseA] of Object.entries(answers)) {
    const questionId = Number(questionIdStr);
    const question = questions.find((q) => q.id === questionId);
    if (!question) continue;

    const selectedChoice = choseA ? question.choiceA : question.choiceB;

    for (const tag of selectedChoice.tags) {
      tagScores[tag] = (tagScores[tag] ?? 0) + 1;
    }
  }

  const personalityType = findBestMatchingPersonality(tagScores);

  return { tags: tagScores, personalityType };
}

/**
 * 태그 점수를 기반으로 22개 성격 유형 중 가장 잘 맞는 유형을 찾는다.
 * 각 성격 유형의 hashtags 배열과 사용자의 tagScores를 비교하여
 * 가장 높은 누적 점수를 가진 유형을 반환한다.
 */
export function findBestMatchingPersonality(
  tagScores: Record<string, number>,
): PersonalityType | null {
  let bestMatch: PersonalityType | null = null;
  let bestScore = 0;

  for (const type of personalityTypes) {
    let score = 0;
    for (const tag of type.hashtags) {
      score += tagScores[tag] ?? 0;
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = type;
    }
  }

  return bestMatch;
}
