// personalityTestQuestions.ts
// 성격 유형 판별 테스트 데이터 (36개 해시태그 기반 재설계)
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
  // === 태도 (1–8) ===
  {
    id: 1,
    category: 'attitude',
    question: '새로운 프로젝트를 시작할 때 나는?',
    choiceA: { text: '일단 시작하고 보면서 수정한다', tags: ['#추진력', '#도전적'] },
    choiceB: { text: '완벽한 계획을 세운 뒤 움직인다', tags: ['#계획적', '#신중함'] },
  },
  {
    id: 2,
    category: 'attitude',
    question: '예상치 못한 문제가 터졌을 때 나는?',
    choiceA: { text: '"어떻게든 되겠지"라며 유연하게 대처한다', tags: ['#유연함', '#낙관적'] },
    choiceB: { text: '원칙과 매뉴얼을 확인하며 정석대로 푼다', tags: ['#신중함', '#원칙'] },
  },
  {
    id: 3,
    category: 'attitude',
    question: '업무나 과제를 처리하는 스타일은?',
    choiceA: { text: '마감 직전에 폭발적인 에너지로 끝낸다', tags: ['#추진력', '#끈기'] },
    choiceB: { text: '미리미리 조금씩 해두어 여유를 갖는다', tags: ['#성실', '#계획적'] },
  },
  {
    id: 4,
    category: 'attitude',
    question: '더 선호하는 일의 방식은?',
    choiceA: { text: '효율적으로 핵심만 빠르게 처리하기', tags: ['#효율적', '#주도적'] },
    choiceB: { text: '시간이 걸려도 디테일까지 완벽하게', tags: ['#성실', '#신중함'] },
  },
  {
    id: 5,
    category: 'attitude',
    question: '낯선 환경이나 새로운 도전에 대해',
    choiceA: { text: '설레는 마음으로 뛰어든다', tags: ['#도전적', '#활기'] },
    choiceB: { text: '익숙하고 안정적인 환경을 선호한다', tags: ['#신중함', '#끈기'] },
  },
  {
    id: 6,
    category: 'attitude',
    question: '결정을 내려야 할 때 나는?',
    choiceA: { text: '나의 직감과 느낌을 믿고 따른다', tags: ['#추진력', '#유연함'] },
    choiceB: { text: '데이터와 근거를 모아서 결정한다', tags: ['#논리적', '#신중함'] },
  },
  {
    id: 7,
    category: 'attitude',
    question: '일이 잘 안 풀릴 때 나는?',
    choiceA: { text: '방법을 바꿔서라도 끝까지 해본다', tags: ['#끈기', '#유연함'] },
    choiceB: { text: '계획을 처음부터 다시 세운다', tags: ['#계획적', '#논리적'] },
  },
  {
    id: 8,
    category: 'attitude',
    question: '팀에서 나의 역할은 보통?',
    choiceA: { text: '방향을 제시하고 이끄는 편이다', tags: ['#리더십', '#주도적'] },
    choiceB: { text: '맡은 역할을 꼼꼼히 수행하는 편이다', tags: ['#성실', '#협조적'] },
  },

  // === 감정 (9–16) ===
  {
    id: 9,
    category: 'emotion',
    question: '감정적으로 힘든 상황을 마주하면?',
    choiceA: { text: '일단 감정을 충분히 느끼고 표현한다', tags: ['#감성적', '#솔직함'] },
    choiceB: { text: '감정을 다스리고 이성적으로 판단한다', tags: ['#침착함', '#평정심'] },
  },
  {
    id: 10,
    category: 'emotion',
    question: '스트레스를 해소하는 나만의 방법은?',
    choiceA: { text: '신나는 활동을 하며 에너지를 발산한다', tags: ['#활기', '#열정'] },
    choiceB: { text: '조용한 공간에서 혼자만의 시간을 갖는다', tags: ['#평정심', '#성찰적'] },
  },
  {
    id: 11,
    category: 'emotion',
    question: '실패를 경험했을 때 나는?',
    choiceA: { text: '"다음엔 잘 될 거야"라고 빠르게 전환한다', tags: ['#낙관적', '#유연함'] },
    choiceB: { text: '원인을 꼼꼼히 분석한 뒤 다시 도전한다', tags: ['#성찰적', '#논리적'] },
  },
  {
    id: 12,
    category: 'emotion',
    question: '좋아하는 일에 몰입하는 편인가?',
    choiceA: { text: '열정적으로 빠져들어 시간 가는 줄 모른다', tags: ['#열정', '#끈기'] },
    choiceB: { text: '적당한 선에서 균형을 유지한다', tags: ['#침착함', '#효율적'] },
  },
  {
    id: 13,
    category: 'emotion',
    question: '주변 사람의 감정 변화에 대해?',
    choiceA: { text: '작은 변화도 빠르게 알아차린다', tags: ['#섬세함', '#공감'] },
    choiceB: { text: '굳이 민감하게 반응하지 않는 편이다', tags: ['#평정심', '#자립적'] },
  },
  {
    id: 14,
    category: 'emotion',
    question: '어려운 시기를 버텨내는 나의 힘은?',
    choiceA: { text: '언젠가 좋아질 거라는 긍정의 힘', tags: ['#낙관적', '#단단함'] },
    choiceB: { text: '현실을 직시하고 해결책을 찾는 능력', tags: ['#현실적', '#추진력'] },
  },
  {
    id: 15,
    category: 'emotion',
    question: '영화, 음악, 예술 작품에 대해?',
    choiceA: { text: '감동받으면 눈물이 나올 정도로 몰입한다', tags: ['#감성적', '#미적감각'] },
    choiceB: { text: '좋아하지만 감정적으로 휩쓸리진 않는다', tags: ['#침착함', '#논리적'] },
  },
  {
    id: 16,
    category: 'emotion',
    question: '비판이나 부정적 피드백을 받을 때?',
    choiceA: { text: '속상하지만 성장의 기회로 받아들인다', tags: ['#단단함', '#성찰적'] },
    choiceB: { text: '크게 흔들리지 않고 담담하게 넘긴다', tags: ['#평정심', '#자립적'] },
  },

  // === 관계 (17–23) ===
  {
    id: 17,
    category: 'relationship',
    question: '새로운 사람을 만나는 자리에서 나는?',
    choiceA: { text: '먼저 다가가서 말을 건네는 편이다', tags: ['#사교적', '#친화력'] },
    choiceB: { text: '상대가 먼저 다가오면 대화를 시작한다', tags: ['#신중함', '#자립적'] },
  },
  {
    id: 18,
    category: 'relationship',
    question: '친한 친구와의 관계에서 나는?',
    choiceA: { text: '속마음을 솔직하게 터놓는 편이다', tags: ['#솔직함', '#진정성'] },
    choiceB: { text: '상대의 기분을 먼저 생각하고 말한다', tags: ['#배려', '#공감'] },
  },
  {
    id: 19,
    category: 'relationship',
    question: '갈등이 생겼을 때 나는?',
    choiceA: { text: '대화로 직접 해결하려고 한다', tags: ['#솔직함', '#추진력'] },
    choiceB: { text: '시간을 두고 자연스럽게 풀리길 기다린다', tags: ['#유연함', '#포용력'] },
  },
  {
    id: 20,
    category: 'relationship',
    question: '그룹 프로젝트에서 선호하는 방식은?',
    choiceA: { text: '역할을 나누고 각자 효율적으로 하기', tags: ['#효율적', '#자립적'] },
    choiceB: { text: '함께 모여 의견을 나누며 같이 하기', tags: ['#협조적', '#공감'] },
  },
  {
    id: 21,
    category: 'relationship',
    question: '누군가의 부탁을 받았을 때?',
    choiceA: { text: '가능하면 기꺼이 도와준다', tags: ['#배려', '#협조적'] },
    choiceB: { text: '내 상황을 먼저 고려한 뒤 결정한다', tags: ['#자립적', '#원칙'] },
  },
  {
    id: 22,
    category: 'relationship',
    question: '대화할 때 나는 주로?',
    choiceA: { text: '상대 이야기에 맞장구치며 호응한다', tags: ['#친화력', '#공감'] },
    choiceB: { text: '핵심적인 의견이나 조언을 말한다', tags: ['#논리적', '#솔직함'] },
  },
  {
    id: 23,
    category: 'relationship',
    question: '나와 다른 의견을 가진 사람에 대해?',
    choiceA: { text: '흥미롭게 생각하고 배울 점을 찾는다', tags: ['#포용력', '#호기심'] },
    choiceB: { text: '내 입장을 논리적으로 설명한다', tags: ['#논리적', '#주도적'] },
  },

  // === 가치 (24–30) ===
  {
    id: 24,
    category: 'value',
    question: '일과 삶에서 가장 중요하게 여기는 것은?',
    choiceA: { text: '목표를 달성하고 성과를 내는 것', tags: ['#성취지향', '#추진력'] },
    choiceB: { text: '의미와 가치를 추구하는 것', tags: ['#진정성', '#성찰적'] },
  },
  {
    id: 25,
    category: 'value',
    question: '이상과 현실 사이에서 나는?',
    choiceA: { text: '현실적으로 가능한 것부터 실행한다', tags: ['#현실적', '#효율적'] },
    choiceB: { text: '이상을 향해 도전하는 것이 중요하다', tags: ['#도전적', '#열정'] },
  },
  {
    id: 26,
    category: 'value',
    question: '새로운 취미나 관심사에 대해?',
    choiceA: { text: '궁금하면 바로 찾아보고 시작한다', tags: ['#호기심', '#도전적'] },
    choiceB: { text: '기존에 하던 것을 깊이 파고든다', tags: ['#끈기', '#성취지향'] },
  },
  {
    id: 27,
    category: 'value',
    question: '규칙과 자유 중에서 나는?',
    choiceA: { text: '규칙은 지켜야 할 중요한 틀이다', tags: ['#원칙', '#성실'] },
    choiceB: { text: '자유롭게 나만의 방식으로 하고 싶다', tags: ['#자유', '#창의적'] },
  },
  {
    id: 28,
    category: 'value',
    question: '문제 해결 방식에 대해?',
    choiceA: { text: '기존에 증명된 방법을 따르는 편이다', tags: ['#현실적', '#원칙'] },
    choiceB: { text: '새로운 방법을 시도해보는 편이다', tags: ['#창의적', '#호기심'] },
  },
  {
    id: 29,
    category: 'value',
    question: '아름다움에 대한 감각?',
    choiceA: { text: '색감, 디자인, 분위기에 민감하다', tags: ['#미적감각', '#섬세함'] },
    choiceB: { text: '기능성과 실용성을 더 중시한다', tags: ['#현실적', '#효율적'] },
  },
  {
    id: 30,
    category: 'value',
    question: '나에게 성공이란?',
    choiceA: { text: '눈에 보이는 구체적인 성과와 결과물', tags: ['#성취지향', '#현실적'] },
    choiceB: { text: '내가 만족하는 삶을 사는 것', tags: ['#진정성', '#자유'] },
  },
];

// --------------------------------------------------------------------------
// 이상적 성격 테스트 (30문항)
// --------------------------------------------------------------------------
export const idealPersonalityTest: TestQuestion[] = [
  // === 태도 (1–8) ===
  {
    id: 1,
    category: 'attitude',
    question: '더 키우고 싶은 일처리 능력은?',
    choiceA: { text: '빠른 실행력과 추진력', tags: ['#추진력', '#주도적'] },
    choiceB: { text: '꼼꼼하고 체계적인 계획력', tags: ['#계획적', '#신중함'] },
  },
  {
    id: 2,
    category: 'attitude',
    question: '위기 상황에서 되고 싶은 모습은?',
    choiceA: { text: '유연하게 대처하는 적응의 달인', tags: ['#유연함', '#침착함'] },
    choiceB: { text: '흔들리지 않는 원칙의 사람', tags: ['#원칙', '#끈기'] },
  },
  {
    id: 3,
    category: 'attitude',
    question: '이상적인 업무 스타일은?',
    choiceA: { text: '최소한의 시간으로 최대한의 결과', tags: ['#효율적', '#성취지향'] },
    choiceB: { text: '꾸준히 매일 성실하게 쌓아가는 것', tags: ['#성실', '#끈기'] },
  },
  {
    id: 4,
    category: 'attitude',
    question: '되고 싶은 도전 자세는?',
    choiceA: { text: '두려움 없이 새로운 것에 뛰어드는 사람', tags: ['#도전적', '#열정'] },
    choiceB: { text: '철저히 준비한 뒤 확실하게 움직이는 사람', tags: ['#신중함', '#계획적'] },
  },
  {
    id: 5,
    category: 'attitude',
    question: '갖추고 싶은 실행 태도는?',
    choiceA: { text: '누가 시키지 않아도 스스로 찾아서 하는 것', tags: ['#주도적', '#추진력'] },
    choiceB: { text: '맡은 일을 끝까지 완수하는 책임감', tags: ['#성실', '#끈기'] },
  },
  {
    id: 6,
    category: 'attitude',
    question: '변화에 대한 이상적 태도는?',
    choiceA: { text: '변화를 기회로 즐기는 유연함', tags: ['#유연함', '#도전적'] },
    choiceB: { text: '변하지 않는 자신만의 기준', tags: ['#원칙', '#성실'] },
  },
  {
    id: 7,
    category: 'attitude',
    question: '의사결정에서 되고 싶은 모습은?',
    choiceA: { text: '빠르고 과감하게 결정하는 사람', tags: ['#추진력', '#효율적'] },
    choiceB: { text: '신중하게 분석하고 결정하는 사람', tags: ['#논리적', '#신중함'] },
  },
  {
    id: 8,
    category: 'attitude',
    question: '더 갖추고 싶은 리더십은?',
    choiceA: { text: '앞에서 방향을 제시하는 리더', tags: ['#리더십', '#주도적'] },
    choiceB: { text: '뒤에서 팀을 서포트하는 조력자', tags: ['#협조적', '#배려'] },
  },

  // === 감정 (9–16) ===
  {
    id: 9,
    category: 'emotion',
    question: '갖고 싶은 감정 조절 능력은?',
    choiceA: { text: '어떤 상황에서도 흔들리지 않는 평정심', tags: ['#평정심', '#침착함'] },
    choiceB: { text: '감정을 풍부하게 느끼면서도 균형 잡기', tags: ['#감성적', '#유연함'] },
  },
  {
    id: 10,
    category: 'emotion',
    question: '되고 싶은 에너지 유형은?',
    choiceA: { text: '주변을 밝히는 긍정 에너지', tags: ['#활기', '#낙관적'] },
    choiceB: { text: '깊은 내면에서 나오는 차분한 에너지', tags: ['#성찰적', '#평정심'] },
  },
  {
    id: 11,
    category: 'emotion',
    question: '실패 앞에서 되고 싶은 모습은?',
    choiceA: { text: '빠르게 회복하는 탄성 있는 사람', tags: ['#단단함', '#낙관적'] },
    choiceB: { text: '실패를 깊이 분석해 성장하는 사람', tags: ['#성찰적', '#논리적'] },
  },
  {
    id: 12,
    category: 'emotion',
    question: '몰입에 대한 이상적 태도는?',
    choiceA: { text: '좋아하는 일에 뜨겁게 몰입하기', tags: ['#열정', '#끈기'] },
    choiceB: { text: '적절한 거리를 두고 균형 잡기', tags: ['#침착함', '#현실적'] },
  },
  {
    id: 13,
    category: 'emotion',
    question: '감수성에 대해 되고 싶은 모습은?',
    choiceA: { text: '작은 아름다움도 놓치지 않는 섬세함', tags: ['#섬세함', '#감성적'] },
    choiceB: { text: '감정에 흔들리지 않는 단단함', tags: ['#단단함', '#침착함'] },
  },
  {
    id: 14,
    category: 'emotion',
    question: '일상에서 되고 싶은 감정 상태는?',
    choiceA: { text: '설레고 열정적인 하루하루', tags: ['#열정', '#활기'] },
    choiceB: { text: '고요하고 평화로운 일상', tags: ['#평정심', '#성찰적'] },
  },
  {
    id: 15,
    category: 'emotion',
    question: '예술과 아름다움에 대해?',
    choiceA: { text: '깊이 감동하고 영감을 받는 사람', tags: ['#감성적', '#미적감각'] },
    choiceB: { text: '실용적 가치를 더 중시하는 사람', tags: ['#현실적', '#효율적'] },
  },
  {
    id: 16,
    category: 'emotion',
    question: '스트레스 대처에서 되고 싶은 모습?',
    choiceA: { text: '긍정적으로 전환하는 사람', tags: ['#낙관적', '#유연함'] },
    choiceB: { text: '냉정하게 분석하고 해결하는 사람', tags: ['#논리적', '#침착함'] },
  },

  // === 관계 (17–23) ===
  {
    id: 17,
    category: 'relationship',
    question: '되고 싶은 대인관계 스타일은?',
    choiceA: { text: '누구와도 쉽게 친해지는 사교적 사람', tags: ['#사교적', '#친화력'] },
    choiceB: { text: '깊고 진실된 소수 관계를 유지하는 사람', tags: ['#진정성', '#자립적'] },
  },
  {
    id: 18,
    category: 'relationship',
    question: '갈등 상황에서 되고 싶은 모습은?',
    choiceA: { text: '서로의 입장을 이해하고 중재하는 사람', tags: ['#공감', '#포용력'] },
    choiceB: { text: '내 의견을 분명히 전달하는 사람', tags: ['#솔직함', '#주도적'] },
  },
  {
    id: 19,
    category: 'relationship',
    question: '팀에서 맡고 싶은 역할은?',
    choiceA: { text: '팀을 이끄는 리더 역할', tags: ['#리더십', '#추진력'] },
    choiceB: { text: '팀을 조화롭게 만드는 서포터 역할', tags: ['#협조적', '#배려'] },
  },
  {
    id: 20,
    category: 'relationship',
    question: '소통 방식에서 되고 싶은 모습은?',
    choiceA: { text: '상대의 마음을 잘 읽는 공감 능력', tags: ['#공감', '#섬세함'] },
    choiceB: { text: '명확하고 솔직한 의사전달', tags: ['#솔직함', '#논리적'] },
  },
  {
    id: 21,
    category: 'relationship',
    question: '타인과의 관계에서 되고 싶은 모습은?',
    choiceA: { text: '어디서든 분위기를 밝히는 존재', tags: ['#친화력', '#활기'] },
    choiceB: { text: '묵묵히 믿을 수 있는 든든한 존재', tags: ['#성실', '#배려'] },
  },
  {
    id: 22,
    category: 'relationship',
    question: '의견 차이에 대한 이상적 태도는?',
    choiceA: { text: '다양한 관점을 열린 마음으로 받아들이기', tags: ['#포용력', '#호기심'] },
    choiceB: { text: '자신의 관점을 명확히 갖고 공유하기', tags: ['#자립적', '#솔직함'] },
  },
  {
    id: 23,
    category: 'relationship',
    question: '인간관계에서 더 키우고 싶은 것은?',
    choiceA: { text: '새로운 사람을 만나는 폭넓은 네트워크', tags: ['#사교적', '#도전적'] },
    choiceB: { text: '기존 관계를 깊이 가꾸는 정성', tags: ['#배려', '#진정성'] },
  },

  // === 가치 (24–30) ===
  {
    id: 24,
    category: 'value',
    question: '추구하고 싶은 삶의 방식은?',
    choiceA: { text: '구체적 목표를 세우고 성취하는 삶', tags: ['#성취지향', '#계획적'] },
    choiceB: { text: '자유롭게 흘러가는 대로 사는 삶', tags: ['#자유', '#유연함'] },
  },
  {
    id: 25,
    category: 'value',
    question: '키우고 싶은 사고 능력은?',
    choiceA: { text: '논리적이고 분석적인 사고력', tags: ['#논리적', '#현실적'] },
    choiceB: { text: '창의적이고 직관적인 사고력', tags: ['#창의적', '#호기심'] },
  },
  {
    id: 26,
    category: 'value',
    question: '삶에서 더 중요한 것은?',
    choiceA: { text: '실용적이고 효율적인 결과', tags: ['#효율적', '#현실적'] },
    choiceB: { text: '아름답고 의미 있는 과정', tags: ['#미적감각', '#감성적'] },
  },
  {
    id: 27,
    category: 'value',
    question: '되고 싶은 지적 태도는?',
    choiceA: { text: '끊임없이 새로운 것을 탐구하는 사람', tags: ['#호기심', '#도전적'] },
    choiceB: { text: '하나의 분야를 깊이 파고드는 전문가', tags: ['#끈기', '#성취지향'] },
  },
  {
    id: 28,
    category: 'value',
    question: '진정성에 대해 되고 싶은 모습은?',
    choiceA: { text: '있는 그대로의 나를 보여주는 사람', tags: ['#진정성', '#솔직함'] },
    choiceB: { text: '상황에 맞게 유연하게 대처하는 사람', tags: ['#유연함', '#사교적'] },
  },
  {
    id: 29,
    category: 'value',
    question: '독립성에 대해 되고 싶은 모습은?',
    choiceA: { text: '스스로의 힘으로 해내는 자립적 사람', tags: ['#자립적', '#원칙'] },
    choiceB: { text: '함께 힘을 모아 큰 일을 해내는 사람', tags: ['#협조적', '#리더십'] },
  },
  {
    id: 30,
    category: 'value',
    question: '궁극적으로 되고 싶은 사람은?',
    choiceA: { text: '세상에 영향력을 미치는 사람', tags: ['#리더십', '#성취지향'] },
    choiceB: { text: '나 자신과 주변을 행복하게 하는 사람', tags: ['#공감', '#낙관적'] },
  },
];

// --------------------------------------------------------------------------
// Helper functions (consumed by PersonalityTestStep)
// --------------------------------------------------------------------------
import { recommendPersonalityTypes } from './personalityTypes';

export function getTestQuestions(testType: PersonalityTestType): TestQuestion[] {
  return testType === 'current' ? currentPersonalityTest : idealPersonalityTest;
}

export function analyzeTestResult(
  answers: Record<number, boolean>,
  testType: PersonalityTestType,
): { personalityType: PersonalityType | undefined } {
  const questions = getTestQuestions(testType);
  const collectedTags: string[] = [];

  for (const q of questions) {
    const choseA = answers[q.id];
    if (choseA === undefined) continue;
    const choice = choseA ? q.choiceA : q.choiceB;
    collectedTags.push(...choice.tags);
  }

  const recommended = recommendPersonalityTypes(collectedTags);
  return { personalityType: recommended.length > 0 ? recommended[0] : undefined };
}
