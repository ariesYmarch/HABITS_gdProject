// habitTemplates.ts
// 124 habit templates ported from HabitTemplateData.swift

import type {
  HabitTemplateItem,
  HabitTemplateCategory,
  HabitContext,
  HabitRecommendation,
} from '../types/habit';

// ---------------------------------------------------------------------------
// Context info map  (context -> emoji + label)
// ---------------------------------------------------------------------------
export const HABIT_CONTEXT_INFO: Record<HabitContext, { emoji: string; label: string }> = {
  wakeUp:       { emoji: '\u{1F305}', label: '\uAE30\uC0C1' },       // sunrise
  morning:      { emoji: '\u2600\uFE0F', label: '\uC544\uCE68' },    // sun
  beforeOut:    { emoji: '\u{1F6AA}', label: '\uC678\uCD9C\uC804' }, // door
  commute:      { emoji: '\u{1F687}', label: '\uC774\uB3D9' },       // metro
  work:         { emoji: '\u{1F4BC}', label: '\uC5C5\uBB34' },       // briefcase
  lunch:        { emoji: '\u{1F37D}\uFE0F', label: '\uC810\uC2EC' }, // plate
  study:        { emoji: '\u{1F4DA}', label: '\uD559\uC2B5' },       // books
  leisure:      { emoji: '\u{1F3AE}', label: '\uC5EC\uAC00' },       // game
  hobby:        { emoji: '\u{1F3A8}', label: '\uCDE8\uBBF8' },       // palette
  exercise:     { emoji: '\u{1F4AA}', label: '\uC6B4\uB3D9' },       // flexed bicep
  meal:         { emoji: '\u{1F957}', label: '\uC2DD\uC0AC' },       // salad
  daily:        { emoji: '\u{1F4C5}', label: '\uC77C\uC0C1' },       // calendar
  relationship: { emoji: '\u{1F465}', label: '\uAD00\uACC4' },       // people
  mindset:      { emoji: '\u{1F9E0}', label: '\uB9C8\uC778\uB4DC' }, // brain
  rest:         { emoji: '\u{1F634}', label: '\uD734\uC2DD' },        // sleeping
  beforeBed:    { emoji: '\u{1F319}', label: '\uCDE8\uCE68\uC804' }, // crescent moon
  evening:      { emoji: '\u{1F306}', label: '\uC800\uB141' },       // sunset
  finance:      { emoji: '\u{1F4B0}', label: '\uC7AC\uBB34' },       // money bag
  lifestyle:    { emoji: '\u{1F3E0}', label: '\uB77C\uC774\uD504' }, // house
  weekly:       { emoji: '\u{1F4C6}', label: '\uC8FC\uAC04' },       // tear-off calendar
  monthly:      { emoji: '\u{1F5D3}\uFE0F', label: '\uC6D4\uAC04' },// spiral calendar
  weekend:      { emoji: '\u{1F334}', label: '\uC8FC\uB9D0' },       // palm tree
};

// ---------------------------------------------------------------------------
// Category info map  (category -> emoji + label)
// ---------------------------------------------------------------------------
export const HABIT_CATEGORY_INFO: Record<HabitTemplateCategory, { emoji: string; label: string }> = {
  morningRitual: { emoji: '\u{1F305}', label: '\uBAA8\uB2DD \uB9AC\uCD94\uC5BC' },
  commute:       { emoji: '\u{1F687}', label: '\uD1B5\uADFC/\uC774\uB3D9' },
  productivity:  { emoji: '\u26A1',    label: '\uC0DD\uC0B0\uC131' },
  learning:      { emoji: '\u{1F4D6}', label: '\uD559\uC2B5/\uC790\uAE30\uACC4\uBC1C' },
  health:        { emoji: '\u{1F49A}', label: '\uAC74\uAC15' },
  relationship:  { emoji: '\u{1F495}', label: '\uAD00\uACC4' },
  mindset:       { emoji: '\u{1F9D8}', label: '\uB9C8\uC778\uB4DC\uC14B/\uBA58\uD0C8' },
  finance:       { emoji: '\u{1F48E}', label: '\uC7AC\uBB34/\uB77C\uC774\uD504\uC2A4\uD0C0\uC77C' },
  evening:       { emoji: '\u{1F319}', label: '\uCDE8\uCE68 \uC804/\uC800\uB141' },
  periodic:      { emoji: '\u{1F4CA}', label: '\uC8FC\uAC04/\uC6D4\uAC04 \uB9AC\uCD94\uC5BC' },
};

// ---------------------------------------------------------------------------
// Helper: resolve category emoji
// ---------------------------------------------------------------------------
function catEmoji(category: HabitTemplateCategory): string {
  return HABIT_CATEGORY_INFO[category].emoji;
}

// ---------------------------------------------------------------------------
// 124 Habit Templates
// ---------------------------------------------------------------------------
export const HABIT_TEMPLATES: HabitTemplateItem[] = [
  // ========== Morning Ritual (19) ==========
  { id: 1, title: '\uCE68\uB300 \uC815\uB9AC\uD558\uAE30', emoji: catEmoji('morningRitual'), category: 'morningRitual', contexts: ['wakeUp'], strengthenTags: ['#\uC131\uC2E4', '#\uAE54\uB054\uD568'], estimatedMinutes: 2, difficulty: 1 },
  { id: 2, title: '\uC54C\uB78C \uC6B8\uB9AC\uACE0 \uBC14\uB85C \uC77C\uC5B4\uB098\uAE30', emoji: catEmoji('morningRitual'), category: 'morningRitual', contexts: ['wakeUp'], strengthenTags: ['#\uACB0\uB2E8\uB825', '#\uC8FC\uB3C4\uC801'], estimatedMinutes: 1, difficulty: 2 },
  { id: 3, title: '\uBBF8\uC9C0\uADFC\uD55C \uBB3C \uD55C \uC794 \uB9C8\uC2DC\uAE30', emoji: catEmoji('morningRitual'), category: 'morningRitual', contexts: ['wakeUp'], strengthenTags: ['#\uAE30\uBCF8\uCDA9\uC2E4', '#\uAC74\uAC15'], estimatedMinutes: 1, difficulty: 1 },
  { id: 4, title: '"\uB098\uB294 \uC6B4\uC774 \uC88B\uC740 \uC0AC\uB78C\uC774\uB2E4" \uC790\uAE30\uC554\uC2DC', emoji: catEmoji('morningRitual'), category: 'morningRitual', contexts: ['wakeUp'], strengthenTags: ['#\uAE0D\uC815', '#\uC790\uC874\uAC10'], estimatedMinutes: 1, difficulty: 1 },
  { id: 5, title: '\uCC3D\uBB38 \uC5F4\uACE0 \uD658\uAE30\uD558\uAE30', emoji: catEmoji('morningRitual'), category: 'morningRitual', contexts: ['wakeUp'], strengthenTags: ['#\uD65C\uAE30', '#\uC5EC\uC720'], estimatedMinutes: 1, difficulty: 1 },
  { id: 6, title: '1\uBD84\uAC04 \uC804\uC2E0 \uC2A4\uD2B8\uB808\uCE6D\uD558\uAE30', emoji: catEmoji('morningRitual'), category: 'morningRitual', contexts: ['wakeUp'], strengthenTags: ['#\uC720\uC5F0\uD568', '#\uC790\uAE30\uAD00\uB9AC'], estimatedMinutes: 1, difficulty: 1 },
  { id: 7, title: '\uC591\uCE58\uD558\uBA70 \uC2A4\uCFFC\uD2B8 10\uD68C', emoji: catEmoji('morningRitual'), category: 'morningRitual', contexts: ['wakeUp'], strengthenTags: ['#\uD6A8\uC728\uC801', '#\uCCB4\uB825'], estimatedMinutes: 3, difficulty: 2 },
  { id: 8, title: '\uC624\uB298 \uAC00\uC7A5 \uC911\uC694\uD55C \uBAA9\uD45C 3\uAC00\uC9C0 \uC801\uAE30', emoji: catEmoji('morningRitual'), category: 'morningRitual', contexts: ['wakeUp'], strengthenTags: ['#\uC804\uB7B5\uC801', '#\uC9D1\uC911\uB825'], estimatedMinutes: 3, difficulty: 2 },
  { id: 9, title: '\uC544\uCE68 \uC2DD\uC0AC \uCC59\uACE8 \uBA39\uAE30', emoji: catEmoji('morningRitual'), category: 'morningRitual', contexts: ['morning'], strengthenTags: ['#\uC5D0\uB108\uC9C0', '#\uC790\uAE30\uB3CC\uBD04'], estimatedMinutes: 15, difficulty: 2 },
  { id: 10, title: '\uC720\uC0B0\uADE0/\uC601\uC591\uC81C \uCC59\uACE8 \uBA39\uAE30', emoji: catEmoji('morningRitual'), category: 'morningRitual', contexts: ['morning'], strengthenTags: ['#\uCCA0\uC800\uD568', '#\uAC74\uAC15'], estimatedMinutes: 1, difficulty: 1 },
  { id: 11, title: '\uC2A4\uB9C8\uD2B8\uD3F0 \uBCF4\uC9C0 \uC54A\uACE0 10\uBD84 \uBCF4\uB0B4\uAE30', emoji: catEmoji('morningRitual'), category: 'morningRitual', contexts: ['morning'], strengthenTags: ['#\uC8FC\uB3C4\uC801', '#\uD3C9\uC628'], estimatedMinutes: 10, difficulty: 3 },
  { id: 12, title: '\uAFC8 \uAE30\uB85D\uD558\uAE30', emoji: catEmoji('morningRitual'), category: 'morningRitual', contexts: ['morning'], strengthenTags: ['#\uCC3D\uC758\uC801', '#\uAE30\uB85D'], estimatedMinutes: 5, difficulty: 2 },
  { id: 13, title: '\uCCB4\uC911 \uC7AC\uACE0 \uAE30\uB85D\uD558\uAE30', emoji: catEmoji('morningRitual'), category: 'morningRitual', contexts: ['morning'], strengthenTags: ['#\uD604\uC2E4\uC801', '#\uC790\uAE30\uAD00\uB9AC'], estimatedMinutes: 1, difficulty: 1 },
  { id: 14, title: '\uC624\uB298 \uC785\uC744 \uC637\uC5D0 \uC5B4\uC6B8\uB9AC\uB294 \uD5A5\uC218 \uBFCC\uB9AC\uAE30', emoji: catEmoji('morningRitual'), category: 'morningRitual', contexts: ['beforeOut'], strengthenTags: ['#\uC13C\uC2A4', '#\uAC10\uAC01\uC801'], estimatedMinutes: 1, difficulty: 1 },
  { id: 15, title: '\uD604\uAD00 \uB098\uC124 \uB54C \uC2E0\uBC1C\uC7A5 \uC815\uB9AC \uD655\uC778', emoji: catEmoji('morningRitual'), category: 'morningRitual', contexts: ['beforeOut'], strengthenTags: ['#\uC815\uB3C8', '#\uC5EC\uC720'], estimatedMinutes: 1, difficulty: 1 },
  { id: 16, title: '\uC5D8\uB9AC\uBCA0\uC774\uD130 \uAC70\uC6B8 \uBCF4\uBA70 \uC637\uB9E4\uBB34\uC0C8 \uB2E8\uC815\uD788', emoji: catEmoji('morningRitual'), category: 'morningRitual', contexts: ['beforeOut'], strengthenTags: ['#\uB2E8\uC815\uD568', '#\uC790\uC874\uAC10'], estimatedMinutes: 1, difficulty: 1 },
  { id: 17, title: '\uC9D1 \uB098\uC124 \uB54C \uAC00\uC871\uC5D0\uAC8C \uC778\uC0AC\uD558\uAE30', emoji: catEmoji('morningRitual'), category: 'morningRitual', contexts: ['beforeOut'], strengthenTags: ['#\uB2E4\uC815\uD568', '#\uC608\uC758'], estimatedMinutes: 1, difficulty: 1 },
  { id: 18, title: '\uAC00\uBC29 \uC18D \uBD88\uD544\uC694\uD55C \uC601\uC218\uC99D/\uC4F0\uB808\uAE30 \uBC84\uB9AC\uAE30', emoji: catEmoji('morningRitual'), category: 'morningRitual', contexts: ['beforeOut'], strengthenTags: ['#\uAE54\uB054\uD568', '#\uB2E8\uC21C\uD568'], estimatedMinutes: 2, difficulty: 1 },
  { id: 19, title: '\uAE0D\uC815 \uD655\uC5B8 \uD55C \uBB38\uC7A5 \uC77D\uAE30', emoji: catEmoji('morningRitual'), category: 'morningRitual', contexts: ['beforeOut'], strengthenTags: ['#\uB9C8\uC778\uB4DC\uC14B', '#\uB099\uAD00\uC801'], estimatedMinutes: 1, difficulty: 1 },

  // ========== Commute (18) ==========
  { id: 21, title: '\uB274\uC2A4 \uBE0C\uB9AC\uD551 \uD31F\uCE90\uC2A4\uD2B8/\uC624\uB514\uC624 \uB4E3\uAE30', emoji: catEmoji('commute'), category: 'commute', contexts: ['commute'], strengthenTags: ['#\uD604\uC2E4\uC801', '#\uC815\uBCF4\uD1B5'], estimatedMinutes: 15, difficulty: 1 },
  { id: 22, title: '\uC678\uAD6D\uC5B4 \uB2E8\uC5B4\uC7A5 \uC571 5\uBD84 \uBCF4\uAE30', emoji: catEmoji('commute'), category: 'commute', contexts: ['commute'], strengthenTags: ['#\uC131\uC2E4', '#\uC5B8\uC5B4\uB2A5\uB825'], estimatedMinutes: 5, difficulty: 2 },
  { id: 23, title: '\uC624\uB514\uC624\uBD81\uC73C\uB85C \uACE0\uC804/\uC778\uBB38\uD559 \uB4E3\uAE30', emoji: catEmoji('commute'), category: 'commute', contexts: ['commute'], strengthenTags: ['#\uAD50\uC591', '#\uD1B5\uCC30\uB825'], estimatedMinutes: 20, difficulty: 2 },
  { id: 24, title: '\uACBD\uC81C \uAD00\uB828 \uC720\uD29C\uBE0C/\uD31F\uCE90\uC2A4\uD2B8 \uB4E3\uAE30', emoji: catEmoji('commute'), category: 'commute', contexts: ['commute'], strengthenTags: ['#\uACBD\uC81C\uC801', '#\uC804\uB7B5\uC801'], estimatedMinutes: 15, difficulty: 2 },
  { id: 25, title: '\uAD00\uC2EC \uBD84\uC57C \uD2B8\uB80C\uB4DC \uB9AC\uD3EC\uD2B8 \uC77D\uAE30', emoji: catEmoji('commute'), category: 'commute', contexts: ['commute'], strengthenTags: ['#\uD2B8\uB80C\uB514', '#\uC804\uBB38\uC131'], estimatedMinutes: 10, difficulty: 2 },
  { id: 26, title: '\uC88B\uC544\uD558\uB294 \uC74C\uC545 \uB4E3\uAE30', emoji: catEmoji('commute'), category: 'commute', contexts: ['commute'], strengthenTags: ['#\uAC10\uAC01\uC801', '#\uB0AD\uB9CC'], estimatedMinutes: 15, difficulty: 1 },
  { id: 28, title: '\uC5D0\uC2A4\uCEEC\uB808\uC774\uD130 \uB300\uC2E0 \uACC4\uB2E8 \uC774\uC6A9\uD558\uAE30', emoji: catEmoji('commute'), category: 'commute', contexts: ['commute'], strengthenTags: ['#\uBD80\uC9C0\uB7F0', '#\uCCB4\uB825'], estimatedMinutes: 2, difficulty: 2 },
  { id: 29, title: '\uCC3D\uBC16 \uD48D\uACBD \uBCF4\uBA70 \uB208\uC758 \uD53C\uB85C \uD480\uAE30', emoji: catEmoji('commute'), category: 'commute', contexts: ['commute'], strengthenTags: ['#\uC5EC\uC720', '#\uAC74\uAC15'], estimatedMinutes: 5, difficulty: 1 },
  { id: 30, title: '\uC624\uB298 \uB9CC\uB0A0 \uC0AC\uB78C\uB4E4\uACFC\uC758 \uB300\uD654 \uC2DC\uBBAC\uB808\uC774\uC158', emoji: catEmoji('commute'), category: 'commute', contexts: ['commute'], strengthenTags: ['#\uC900\uBE44\uC131', '#\uC13C\uC2A4'], estimatedMinutes: 5, difficulty: 2 },
  { id: 31, title: '\uBA54\uBAA8\uC7A5\uC5D0 \uC544\uC774\uB514\uC5B4 1\uAC1C \uC801\uAE30', emoji: catEmoji('commute'), category: 'commute', contexts: ['commute'], strengthenTags: ['#\uCC3D\uC758\uC801', '#\uAE30\uB85D'], estimatedMinutes: 2, difficulty: 2 },
  { id: 32, title: '\uBD88\uD544\uC694\uD55C \uC2A4\uB9C8\uD2B8\uD3F0 \uC54C\uB9BC \uB044\uAE30', emoji: catEmoji('commute'), category: 'commute', contexts: ['commute'], strengthenTags: ['#\uC9D1\uC911\uB825', '#\uC8FC\uB3C4\uC801'], estimatedMinutes: 3, difficulty: 2 },
  { id: 33, title: 'TED \uAC15\uC5F0 1\uD3B8 \uB4E3\uAE30', emoji: catEmoji('commute'), category: 'commute', contexts: ['commute'], strengthenTags: ['#\uC9C0\uC801\uD638\uAE30\uC2EC', '#\uAE00\uB85C\uBC8C'], estimatedMinutes: 18, difficulty: 2 },
  { id: 34, title: '\uD55C \uC815\uAC70\uC7A5 \uBBF8\uB9AC \uB0B4\uB824\uC11C \uAC77\uAE30', emoji: catEmoji('commute'), category: 'commute', contexts: ['commute'], strengthenTags: ['#\uD65C\uAE30', '#\uC5EC\uC720'], estimatedMinutes: 10, difficulty: 2 },
  { id: 36, title: '\uBD80\uBAA8\uB2D8\uC774\uB098 \uCE5C\uAD6C\uC5D0\uAC8C \uC548\uBD80 \uBB38\uC790 \uBCF4\uB0B4\uAE30', emoji: catEmoji('commute'), category: 'commute', contexts: ['commute'], strengthenTags: ['#\uB2E4\uC815\uD568', '#\uCE5C\uD654\uB825'], estimatedMinutes: 2, difficulty: 1 },
  { id: 37, title: '\uD558\uB8E8 \uC77C\uC815 \uD655\uC778\uD558\uAE30', emoji: catEmoji('commute'), category: 'commute', contexts: ['commute'], strengthenTags: ['#\uACC4\uD68D\uC801', '#\uCE58\uBC00\uD568'], estimatedMinutes: 3, difficulty: 1 },
  { id: 38, title: '\uAC10\uC0AC\uD55C \uC77C 3\uAC00\uC9C0 \uBA38\uB9BF\uC18D\uC73C\uB85C \uB5A0\uC62C\uB9AC\uAE30', emoji: catEmoji('commute'), category: 'commute', contexts: ['commute'], strengthenTags: ['#\uAE0D\uC815', '#\uD3C9\uC628'], estimatedMinutes: 2, difficulty: 1 },
  { id: 39, title: '\uC790\uC138 \uBC14\uB974\uAC8C \uD558\uACE0 \uBCF5\uC2DD\uD638\uD761 5\uD68C', emoji: catEmoji('commute'), category: 'commute', contexts: ['commute'], strengthenTags: ['#\uC548\uC815\uC801', '#\uAC74\uAC15'], estimatedMinutes: 2, difficulty: 1 },
  { id: 40, title: '\uB098\uB9CC\uC758 \uD50C\uB808\uC774\uB9AC\uC2A4\uD2B8 \uC815\uBE44\uD558\uAE30', emoji: catEmoji('commute'), category: 'commute', contexts: ['commute'], strengthenTags: ['#\uCDE8\uD5A5', '#\uAC10\uAC01\uC801'], estimatedMinutes: 10, difficulty: 1 },

  // ========== Productivity (12) ==========
  { id: 41, title: '\uCC45\uC0C1 \uC704 \uBD88\uD544\uC694\uD55C \uBB3C\uAC74 \uCE58\uC6B0\uAE30', emoji: catEmoji('productivity'), category: 'productivity', contexts: ['work'], strengthenTags: ['#\uB2E8\uC21C\uD568', '#\uC815\uB3C8'], estimatedMinutes: 3, difficulty: 1 },
  { id: 42, title: '\uC5C5\uBB34 \uC2DC\uC791 \uC804 \uC624\uB298\uC758 \uC6B0\uC120\uC21C\uC704 3\uAC1C \uC801\uAE30', emoji: catEmoji('productivity'), category: 'productivity', contexts: ['work'], strengthenTags: ['#\uC804\uB7B5\uC801', '#\uBAA9\uD45C\uC9C0\uD5A5'], estimatedMinutes: 5, difficulty: 2 },
  { id: 43, title: '\uAC00\uC7A5 \uC5B4\uB824\uC6B4 \uC77C \uC624\uC804\uC5D0 \uCC98\uB9AC', emoji: catEmoji('productivity'), category: 'productivity', contexts: ['work'], strengthenTags: ['#\uACFC\uAC10\uD568', '#\uCD94\uC9C4\uB825'], estimatedMinutes: 60, difficulty: 3 },
  { id: 44, title: '\uBF40\uBAA8\uB3C4\uB85C \uD0C0\uC774\uBA38 \uC4F0\uAE30', emoji: catEmoji('productivity'), category: 'productivity', contexts: ['work'], strengthenTags: ['#\uD6A8\uC728\uC801', '#\uC9D1\uC911\uB825'], estimatedMinutes: 25, difficulty: 2 },
  { id: 45, title: '\uC774\uBA54\uC77C \uD655\uC778\uD558\uAE30', emoji: catEmoji('productivity'), category: 'productivity', contexts: ['work'], strengthenTags: ['#\uC8FC\uB3C4\uC801', '#\uADDC\uCE59\uC801'], estimatedMinutes: 10, difficulty: 1 },
  { id: 46, title: '\uBC29\uD574 \uAE08\uC9C0 \uBAA8\uB4DC \uCF1C\uACE0 \uC77C\uD558\uAE30', emoji: catEmoji('productivity'), category: 'productivity', contexts: ['work'], strengthenTags: ['#\uC9D1\uC911\uB825', '#\uD504\uB85C'], estimatedMinutes: 60, difficulty: 2 },
  { id: 50, title: '\uB3D9\uB8CC\uC5D0\uAC8C \uCEE4\uD53C/\uAC04\uC2DD \uAC74\uB124\uBA70 \uC2A4\uBAB0\uD1A0\uD06C', emoji: catEmoji('productivity'), category: 'productivity', contexts: ['work'], strengthenTags: ['#\uC0AC\uAD50\uC801', '#\uCE5C\uD654\uB825'], estimatedMinutes: 5, difficulty: 2 },
  { id: 51, title: '\uC810\uC2EC\uC2DC\uAC04 10\uBD84 \uC0B0\uCC45\uC73C\uB85C \uD587\uBCDB \uC410\uAE30', emoji: catEmoji('productivity'), category: 'productivity', contexts: ['lunch'], strengthenTags: ['#\uD65C\uAE30', '#\uB9AC\uD504\uB808\uC2DC'], estimatedMinutes: 10, difficulty: 1 },
  { id: 53, title: '\uC624\uD6C4 \uC5C5\uBB34 \uC804 \uC2A4\uD2B8\uB808\uCE6D\uC73C\uB85C \uBAB8 \uD480\uAE30', emoji: catEmoji('productivity'), category: 'productivity', contexts: ['work'], strengthenTags: ['#\uC720\uC5F0\uD568', '#\uC790\uAE30\uAD00\uB9AC'], estimatedMinutes: 5, difficulty: 1 },
  { id: 55, title: '\uD1F4\uADFC 30\uBD84 \uC804 \uB0B4\uC77C \uD560 \uC77C \uB9AC\uC2A4\uD2B8\uC5C5', emoji: catEmoji('productivity'), category: 'productivity', contexts: ['work'], strengthenTags: ['#\uB300\uBE44\uD558\uB294', '#\uCC45\uC784\uAC10'], estimatedMinutes: 10, difficulty: 2 },
  { id: 56, title: '\uBC14\uD0D5\uD654\uBA74 \uC544\uC774\uCF58 \uC815\uB9AC\uD558\uACE0 \uD1F4\uADFC\uD558\uAE30', emoji: catEmoji('productivity'), category: 'productivity', contexts: ['work'], strengthenTags: ['#\uAE54\uB054\uD568', '#\uB9C8\uBB34\uB9AC'], estimatedMinutes: 3, difficulty: 1 },
  { id: 57, title: '\uC5C5\uBB34 \uC911 \uB5A0\uC624\uB978 \uC0DD\uAC01 \uBA54\uBAA8\uC7A5\uC5D0 \uC62E\uAE30\uAE30', emoji: catEmoji('productivity'), category: 'productivity', contexts: ['work'], strengthenTags: ['#\uC9D1\uC911\uB825', '#\uB2E8\uC21C\uD568'], estimatedMinutes: 2, difficulty: 1 },

  // ========== Learning (12) ==========
  { id: 61, title: '\uD558\uB8E8 1\uAC1C \uC0C8\uB85C\uC6B4 \uC9C0\uC2DD \uC54C\uC544\uBCF4\uAE30', emoji: catEmoji('learning'), category: 'learning', contexts: ['study'], strengthenTags: ['#\uC7A1\uD559\uB2E4\uC2DD', '#\uD638\uAE30\uC2EC'], estimatedMinutes: 10, difficulty: 2 },
  { id: 62, title: '\uC804\uBB38 \uBD84\uC57C \uC544\uD2F0\uD074 1\uD3B8 \uC77D\uAE30', emoji: catEmoji('learning'), category: 'learning', contexts: ['study'], strengthenTags: ['#\uC804\uBB38\uC131', '#\uAE4A\uC774'], estimatedMinutes: 15, difficulty: 2 },
  { id: 64, title: '\uD558\uB8E8 20\uD398\uC774\uC9C0 \uB3C5\uC11C\uD558\uAE30', emoji: catEmoji('learning'), category: 'learning', contexts: ['study'], strengthenTags: ['#\uC131\uC2E4', '#\uC9C0\uC801'], estimatedMinutes: 30, difficulty: 2 },
  { id: 67, title: '\uC720\uD29C\uBE0C \uAD50\uC721 \uC601\uC0C1 1.5\uBC30\uC18D\uC73C\uB85C \uC2DC\uCCAD', emoji: catEmoji('learning'), category: 'learning', contexts: ['study'], strengthenTags: ['#\uD6A8\uC728\uC801', '#\uBC30\uC6C0'], estimatedMinutes: 15, difficulty: 1 },
  { id: 68, title: '\uC804\uC2DC\uD68C/\uBC15\uBB3C\uAD00 \uC815\uBCF4 \uCC3E\uAE30', emoji: catEmoji('learning'), category: 'learning', contexts: ['leisure'], strengthenTags: ['#\uAD50\uC591', '#\uBBF8\uC801\uAC10\uAC01'], estimatedMinutes: 10, difficulty: 1 },
  { id: 71, title: '\uBE14\uB85C\uADF8\uB098 SNS\uC5D0 \uC9E7\uC740 \uAE00 \uC4F0\uAE30', emoji: catEmoji('learning'), category: 'learning', contexts: ['study'], strengthenTags: ['#\uAE30\uB85D', '#\uD45C\uD604\uB825'], estimatedMinutes: 15, difficulty: 2 },
  { id: 72, title: '\uB0AF\uC120 \uC8FC\uC81C\uC758 \uB2E4\uD050\uBA58\uD130\uB9AC \uC2DC\uCCAD\uD558\uAE30', emoji: catEmoji('learning'), category: 'learning', contexts: ['leisure'], strengthenTags: ['#\uAC1C\uBC29\uC801', '#\uB2E4\uC591\uC131'], estimatedMinutes: 45, difficulty: 1 },
  { id: 73, title: '\uB9C8\uC778\uB4DC\uB9F5 \uADF8\uB9AC\uBA70 \uC0DD\uAC01 \uD655\uC7A5\uD558\uAE30', emoji: catEmoji('learning'), category: 'learning', contexts: ['study'], strengthenTags: ['#\uCC3D\uC758\uC801', '#\uAD6C\uC870\uD654'], estimatedMinutes: 15, difficulty: 2 },
  { id: 74, title: '\uC678\uAD6D\uC5B4 \uB274\uC2A4 \uD5E4\uB4DC\uB77C\uC778 \uC77D\uAE30', emoji: catEmoji('learning'), category: 'learning', contexts: ['study'], strengthenTags: ['#\uAE00\uB85C\uBC8C', '#\uC5B8\uC5B4\uB2A5\uB825'], estimatedMinutes: 10, difficulty: 2 },
  { id: 75, title: '\uC2DC \uD55C \uD3B8 \uD544\uC0AC\uD558\uAE30', emoji: catEmoji('learning'), category: 'learning', contexts: ['hobby'], strengthenTags: ['#\uAC10\uAC01\uC801', '#\uCE68\uCC29\uD568'], estimatedMinutes: 10, difficulty: 2 },
  { id: 76, title: '\uD37C\uC990/\uC2A4\uB3C4\uCFE0/\uCCB4\uC2A4 \uB4F1 \uB450\uB1CC \uAC8C\uC784 \uD558\uAE30', emoji: catEmoji('learning'), category: 'learning', contexts: ['hobby'], strengthenTags: ['#\uB17C\uB9AC\uC801', '#\uC804\uB7B5\uC801'], estimatedMinutes: 15, difficulty: 2 },
  { id: 77, title: '\uADF8\uB9BC \uADF8\uB9AC\uAC70\uB098 \uC545\uAE30 \uC5F0\uC8FC 10\uBD84', emoji: catEmoji('learning'), category: 'learning', contexts: ['hobby'], strengthenTags: ['#\uC608\uC220\uC801', '#\uC9D1\uC911\uB825'], estimatedMinutes: 10, difficulty: 2 },

  // ========== Health (14) ==========
  { id: 81, title: '\uD558\uB8E8 \uBB3C 2\uB9AC\uD130 \uB9C8\uC2DC\uAE30', emoji: catEmoji('health'), category: 'health', contexts: ['daily'], strengthenTags: ['#\uAE30\uBCF8\uCDA9\uC2E4', '#\uAC74\uAC15'], estimatedMinutes: 1, difficulty: 2 },
  { id: 82, title: '\uD0C4\uC0B0\uC74C\uB8CC \uB300\uC2E0 \uCC28\uB098 \uBB3C \uB9C8\uC2DC\uAE30', emoji: catEmoji('health'), category: 'health', contexts: ['daily'], strengthenTags: ['#\uC808\uC81C\uB825', '#\uAD00\uB9AC'], estimatedMinutes: 1, difficulty: 2 },
  { id: 83, title: '\uC2DD\uC0AC \uC2DC \uCC44\uC18C\uBD80\uD130 \uBA3C\uC800 \uBA39\uAE30', emoji: catEmoji('health'), category: 'health', contexts: ['meal'], strengthenTags: ['#\uC804\uB7B5\uC801', '#\uAC74\uAC15'], estimatedMinutes: 1, difficulty: 2 },
  { id: 86, title: '\uC800\uB141 8\uC2DC \uC774\uD6C4 \uAE08\uC2DD', emoji: catEmoji('health'), category: 'health', contexts: ['daily'], strengthenTags: ['#\uC6D0\uCE59', '#\uC808\uC81C\uB825'], estimatedMinutes: 1, difficulty: 3 },
  { id: 87, title: '\uB9E4\uC77C \uD50C\uB7AD\uD06C 1\uBD84 \uBC84\uD2F0\uAE30', emoji: catEmoji('health'), category: 'health', contexts: ['exercise'], strengthenTags: ['#\uB048\uAE30', '#\uB2E8\uB2E8\uD568'], estimatedMinutes: 1, difficulty: 2 },
  { id: 88, title: '\uC2A4\uCFFC\uD2B8 \uD558\uB8E8 50\uAC1C', emoji: catEmoji('health'), category: 'health', contexts: ['exercise'], strengthenTags: ['#\uB048\uAE30', '#\uCCB4\uB825'], estimatedMinutes: 5, difficulty: 2 },
  { id: 90, title: '\uC549\uC544 \uC788\uC744 \uB54C \uD5C8\uB9AC \uACE7\uAC8C \uD3B4\uAE30', emoji: catEmoji('health'), category: 'health', contexts: ['daily'], strengthenTags: ['#\uBC14\uB978\uC790\uC138', '#\uC790\uC874\uAC10'], estimatedMinutes: 1, difficulty: 2 },
  { id: 91, title: '1\uC2DC\uAC04\uB9C8\uB2E4 \uB208 \uAC10\uACE0 1\uBD84 \uD734\uC2DD', emoji: catEmoji('health'), category: 'health', contexts: ['daily'], strengthenTags: ['#\uC790\uAE30\uB3CC\uBD04', '#\uD68C\uBCF5'], estimatedMinutes: 1, difficulty: 1 },
  { id: 92, title: '\uBAA9/\uC5B4\uAE68 \uC2A4\uD2B8\uB808\uCE6D \uD558\uAE30', emoji: catEmoji('health'), category: 'health', contexts: ['daily'], strengthenTags: ['#\uC720\uC5F0\uD568', '#\uC774\uC644'], estimatedMinutes: 3, difficulty: 1 },
  { id: 93, title: '\uD587\uBCDB \uC410\uAE30', emoji: catEmoji('health'), category: 'health', contexts: ['daily'], strengthenTags: ['#\uD65C\uAE30', '#\uC790\uC5F0\uCE5C\uD654'], estimatedMinutes: 10, difficulty: 1 },
  { id: 96, title: '\uC778\uC2A4\uD134\uD2B8 \uB300\uC2E0 \uAC74\uAC15\uD55C \uC74C\uC2DD \uBA39\uAE30', emoji: catEmoji('health'), category: 'health', contexts: ['meal'], strengthenTags: ['#\uAE4C\uB2E4\uB85C\uC6C0', '#\uAC74\uAC15'], estimatedMinutes: 1, difficulty: 2 },
  { id: 97, title: '\uC7A0\uB4E4\uAE30 3\uC2DC\uAC04 \uC804 \uC57C\uC2DD \uBA39\uC9C0 \uC54A\uAE30', emoji: catEmoji('health'), category: 'health', contexts: ['beforeBed'], strengthenTags: ['#\uC6D0\uCE59', '#\uC219\uBA74'], estimatedMinutes: 1, difficulty: 2 },
  { id: 98, title: '\uCE58\uC2E4/\uCE58\uAC04\uCE6B\uC194 \uC0AC\uC6A9\uD558\uAE30', emoji: catEmoji('health'), category: 'health', contexts: ['daily'], strengthenTags: ['#\uC12C\uC138\uD568', '#\uCCAD\uACB0'], estimatedMinutes: 3, difficulty: 1 },
  { id: 99, title: '\uC190 \uC52A\uACE0 \uD578\uB4DC\uD06C\uB9BC \uBC14\uB974\uAE30', emoji: catEmoji('health'), category: 'health', contexts: ['daily'], strengthenTags: ['#\uAE54\uB054\uD568', '#\uC790\uAE30\uC560'], estimatedMinutes: 1, difficulty: 1 },

  // ========== Relationship (10) ==========
  { id: 101, title: '\uD558\uB8E8 \uD55C \uBA85\uC5D0\uAC8C \uC9C4\uC2EC\uC73C\uB85C \uCE6D\uCC2C\uD558\uAE30', emoji: catEmoji('relationship'), category: 'relationship', contexts: ['relationship'], strengthenTags: ['#\uAE0D\uC815', '#\uD638\uAC10'], estimatedMinutes: 1, difficulty: 2 },
  { id: 103, title: '\uC0C1\uB300\uBC29 \uB9D0 \uB04A\uC9C0 \uC54A\uACE0 \uB05D\uAE4C\uC9C0 \uB4E3\uAE30', emoji: catEmoji('relationship'), category: 'relationship', contexts: ['relationship'], strengthenTags: ['#\uACBD\uCCAD', '#\uC874\uC911'], estimatedMinutes: 1, difficulty: 2 },
  { id: 105, title: '\uC0C1\uB300\uBC29 \uC774\uB984 \uAE30\uC5B5\uD574\uC11C \uBD88\uB7EC\uC8FC\uAE30', emoji: catEmoji('relationship'), category: 'relationship', contexts: ['relationship'], strengthenTags: ['#\uC12C\uC138\uD568', '#\uCE5C\uD654\uB825'], estimatedMinutes: 1, difficulty: 2 },
  { id: 106, title: '\uC6C3\uB294 \uC5BC\uAD74\uB85C \uBA3C\uC800 \uC778\uC0AC\uD558\uAE30', emoji: catEmoji('relationship'), category: 'relationship', contexts: ['relationship'], strengthenTags: ['#\uBA85\uB791\uD568', '#\uBA3C\uC800'], estimatedMinutes: 1, difficulty: 1 },
  { id: 107, title: '\uB300\uD654 \uC911 \uD578\uB4DC\uD3F0 \uBCF4\uC9C0 \uC54A\uAE30', emoji: catEmoji('relationship'), category: 'relationship', contexts: ['relationship'], strengthenTags: ['#\uC9D1\uC911\uB825', '#\uC608\uC758'], estimatedMinutes: 1, difficulty: 2 },
  { id: 110, title: '\uC2DD\uB2F9/\uCE74\uD398 \uC9C1\uC6D0\uC5D0\uAC8C \uCE5C\uC808\uD558\uAC8C \uB300\uD558\uAE30', emoji: catEmoji('relationship'), category: 'relationship', contexts: ['daily'], strengthenTags: ['#\uC778\uACA9', '#\uACA6\uC190'], estimatedMinutes: 1, difficulty: 1 },
  { id: 111, title: '\uB4B7\uC0AC\uB78C \uC704\uD574 \uBB38 \uC7A1\uC544\uC8FC\uAE30', emoji: catEmoji('relationship'), category: 'relationship', contexts: ['daily'], strengthenTags: ['#\uBC30\uB824', '#\uB9E4\uB108'], estimatedMinutes: 1, difficulty: 1 },
  { id: 117, title: '\uC0C1\uB300\uBC29 \uB9D0\uC5D0 \uB9DE\uC7A5\uAD6C\uCE58\uAE30', emoji: catEmoji('relationship'), category: 'relationship', contexts: ['relationship'], strengthenTags: ['#\uACF5\uAC10', '#\uC218\uC6A9'], estimatedMinutes: 1, difficulty: 1 },
  { id: 118, title: '\uBD80\uC815\uC801\uC778 \uC77C\uC744 \uAE0D\uC815\uC801\uC73C\uB85C \uBC14\uAFB8\uBCF4\uAE30', emoji: catEmoji('relationship'), category: 'relationship', contexts: ['relationship'], strengthenTags: ['#\uB099\uAD00\uC801', '#\uC5D0\uB108\uC9C0'], estimatedMinutes: 2, difficulty: 2 },
  { id: 120, title: '\uAC00\uC871\uC5D0\uAC8C \uC0AC\uB791\uD55C\uB2E4\uB294 \uD45C\uD604\uD558\uAE30', emoji: catEmoji('relationship'), category: 'relationship', contexts: ['relationship'], strengthenTags: ['#\uD45C\uD604\uB825', '#\uB530\uB73B\uD568'], estimatedMinutes: 1, difficulty: 2 },

  // ========== Mindset/Mental (12) ==========
  { id: 141, title: '\uD558\uB8E8 5\uBD84 \uBA4D\uB54C\uB9AC\uAE30', emoji: catEmoji('mindset'), category: 'mindset', contexts: ['rest'], strengthenTags: ['#\uC5EC\uC720', '#\uBE44\uC6C0'], estimatedMinutes: 5, difficulty: 1 },
  { id: 142, title: '\uD654\uB0A0 \uB54C \uC22B\uC790 10\uAE4C\uC9C0 \uC138\uAE30', emoji: catEmoji('mindset'), category: 'mindset', contexts: ['mindset'], strengthenTags: ['#\uCE68\uCC29\uD568', '#\uD1B5\uC81C\uB825'], estimatedMinutes: 1, difficulty: 2 },
  { id: 144, title: '\uAC71\uC815\uB418\uB294 \uC77C \uC885\uC774\uC5D0 \uC801\uC5B4 \uAC1D\uAD00\uD654\uD558\uAE30', emoji: catEmoji('mindset'), category: 'mindset', contexts: ['mindset'], strengthenTags: ['#\uBD84\uC11D\uC801', '#\uD574\uC18C'], estimatedMinutes: 5, difficulty: 2 },
  { id: 145, title: '"\uADF8\uB7F4 \uC218\uB3C4 \uC788\uC9C0"\uB77C\uACE0 \uC18C\uB9AC \uB0B4\uC5B4 \uB9D0\uD558\uAE30', emoji: catEmoji('mindset'), category: 'mindset', contexts: ['mindset'], strengthenTags: ['#\uBB34\uB358\uD568', '#\uD3EC\uC6A9\uB825'], estimatedMinutes: 1, difficulty: 1 },
  { id: 146, title: '\uC2A4\uC2A4\uB85C \uCE6D\uCC2C\uD558\uAE30', emoji: catEmoji('mindset'), category: 'mindset', contexts: ['mindset'], strengthenTags: ['#\uAE0D\uC815', '#\uC790\uAE30\uC560'], estimatedMinutes: 1, difficulty: 1 },
  { id: 148, title: '\uC2EB\uC5B4\uD558\uB294 \uC0AC\uB78C\uC758 \uC7A5\uC810 \uC5B5\uC9C0\uB85C \uCC3E\uAE30', emoji: catEmoji('mindset'), category: 'mindset', contexts: ['mindset'], strengthenTags: ['#\uAD00\uB300\uD568', '#\uAC1D\uAD00\uC801'], estimatedMinutes: 3, difficulty: 3 },
  { id: 149, title: '\uC790\uAE30 \uC804 \'\uC624\uB298 \uC798\uD55C \uC77C\' 3\uAC00\uC9C0 \uC0DD\uAC01\uD558\uAE30', emoji: catEmoji('mindset'), category: 'mindset', contexts: ['beforeBed'], strengthenTags: ['#\uAE0D\uC815', '#\uB9CC\uC871'], estimatedMinutes: 3, difficulty: 1 },
  { id: 151, title: '\uB0AF\uC120 \uAE38\uB85C \uC0B0\uCC45\uD558\uAE30', emoji: catEmoji('mindset'), category: 'mindset', contexts: ['leisure'], strengthenTags: ['#\uBAA8\uD5D8\uC2EC', '#\uAD00\uCC30'], estimatedMinutes: 20, difficulty: 2 },
  { id: 152, title: '\uD558\uB298 \uC0AC\uC9C4 \uCC0D\uAE30', emoji: catEmoji('mindset'), category: 'mindset', contexts: ['leisure'], strengthenTags: ['#\uAC10\uAC01\uC801', '#\uB0AD\uB9CC'], estimatedMinutes: 2, difficulty: 1 },
  { id: 157, title: '\uBD80\uC815\uC801\uC778 \uC0DD\uAC01 \uB4E4\uBA74 "STOP" \uC678\uCE58\uAE30', emoji: catEmoji('mindset'), category: 'mindset', contexts: ['mindset'], strengthenTags: ['#\uB2E8\uD638\uD568', '#\uC804\uD658'], estimatedMinutes: 1, difficulty: 2 },
  { id: 159, title: '1\uB144 \uB4A4, 10\uB144 \uB4A4 \uB0B4 \uBAA8\uC2B5 \uC0C1\uC0C1\uD558\uAE30', emoji: catEmoji('mindset'), category: 'mindset', contexts: ['mindset'], strengthenTags: ['#\uBE44\uC804', '#\uC774\uC0C1\uC801'], estimatedMinutes: 5, difficulty: 2 },
  { id: 160, title: '\uC624\uB298 \uD558\uB8E8\uB97C \uC120\uBB3C\uB85C \uC0DD\uAC01\uD558\uAE30', emoji: catEmoji('mindset'), category: 'mindset', contexts: ['mindset'], strengthenTags: ['#\uAC10\uC0AC', '#\uACA6\uC190'], estimatedMinutes: 1, difficulty: 1 },

  // ========== Finance/Lifestyle (9) ==========
  { id: 121, title: '\uB9E4\uC77C \uC9C0\uCD9C \uB0B4\uC5ED \uAC00\uACC4\uBD80 \uC571\uC5D0 \uAE30\uB85D', emoji: catEmoji('finance'), category: 'finance', contexts: ['finance'], strengthenTags: ['#\uAF3C\uAF3C\uD568', '#\uACBD\uC81C\uC801'], estimatedMinutes: 3, difficulty: 2 },
  { id: 122, title: '\uBB34\uC9C0\uCD9C \uCC4C\uB9B0\uC9C0 \uD558\uAE30', emoji: catEmoji('finance'), category: 'finance', contexts: ['finance'], strengthenTags: ['#\uC808\uC81C\uB825', '#\uB3C4\uC804\uC801'], estimatedMinutes: 1, difficulty: 3 },
  { id: 127, title: '\uD0DD\uC2DC \uB300\uC2E0 \uB300\uC911\uAD50\uD1B5 \uC774\uC6A9\uD558\uAE30', emoji: catEmoji('finance'), category: 'finance', contexts: ['commute'], strengthenTags: ['#\uAC80\uC18C\uD568', '#\uBD80\uC9C0\uB7F0'], estimatedMinutes: 1, difficulty: 2 },
  { id: 129, title: '\uD1B5\uC7A5 \uC794\uACE0 \uD655\uC778\uD558\uAE30', emoji: catEmoji('finance'), category: 'finance', contexts: ['finance'], strengthenTags: ['#\uD604\uC2E4\uC801', '#\uAD00\uC2EC'], estimatedMinutes: 2, difficulty: 1 },
  { id: 131, title: '\uACBD\uC81C \uB274\uC2A4 \uD5E4\uB4DC\uB77C\uC778 \uD6D1\uC5B4\uBCF4\uAE30', emoji: catEmoji('finance'), category: 'finance', contexts: ['finance'], strengthenTags: ['#\uC815\uBCF4\uD1B5', '#\uAC10\uAC01\uC801'], estimatedMinutes: 5, difficulty: 1 },
  { id: 133, title: '\uC77C\uD68C\uC6A9\uD488 \uB300\uC2E0 \uD140\uBE14\uB7EC \uC0AC\uC6A9\uD558\uAE30', emoji: catEmoji('finance'), category: 'finance', contexts: ['lifestyle'], strengthenTags: ['#\uB3C4\uB355\uC801', '#\uC2E4\uCC9C'], estimatedMinutes: 1, difficulty: 1 },
  { id: 134, title: '\uBB3C\uAC74 \uC81C\uC790\uB9AC\uC5D0 \uB450\uAE30', emoji: catEmoji('finance'), category: 'finance', contexts: ['lifestyle'], strengthenTags: ['#\uC815\uB3C8', '#\uADDC\uCE59\uC801'], estimatedMinutes: 1, difficulty: 1 },
  { id: 136, title: '\uBC30\uB2EC \uC74C\uC2DD \uB300\uC2E0 \uC9D1\uBC25 \uD574 \uBA39\uAE30', emoji: catEmoji('finance'), category: 'finance', contexts: ['meal'], strengthenTags: ['#\uAC74\uAC15', '#\uACBD\uC81C\uC801'], estimatedMinutes: 30, difficulty: 2 },
  { id: 139, title: '\uD658\uAE30 \uC2DC\uD0A4\uAE30', emoji: catEmoji('finance'), category: 'finance', contexts: ['lifestyle'], strengthenTags: ['#\uC0C1\uCE8C\uD568', '#\uBD80\uC9C0\uB7F0'], estimatedMinutes: 1, difficulty: 1 },

  // ========== Evening (18) ==========
  { id: 161, title: '\uC800\uB141 \uC2DD\uC0AC \uD6C4 \uBC14\uB85C \uC124\uAC70\uC9C0\uD558\uAE30', emoji: catEmoji('evening'), category: 'evening', contexts: ['evening'], strengthenTags: ['#\uBD80\uC9C0\uB7F0', '#\uAE54\uB054\uD568'], estimatedMinutes: 10, difficulty: 2 },
  { id: 162, title: '\uD558\uB8E8 \uB3D9\uC548 \uC30D\uC778 \uC4F0\uB808\uAE30 \uBC84\uB9AC\uAE30', emoji: catEmoji('evening'), category: 'evening', contexts: ['evening'], strengthenTags: ['#\uC815\uB3C8', '#\uB2E8\uC21C\uD568'], estimatedMinutes: 3, difficulty: 1 },
  { id: 163, title: '\uB0B4\uC77C \uC785\uC744 \uC637 \uBBF8\uB9AC \uAEA8\uB0B4\uB450\uAE30', emoji: catEmoji('evening'), category: 'evening', contexts: ['beforeBed'], strengthenTags: ['#\uC900\uBE44\uC131', '#\uC13C\uC2A4'], estimatedMinutes: 3, difficulty: 1 },
  { id: 164, title: '\uAC00\uBC29 \uBBF8\uB9AC \uCC59\uACE8\uB450\uAE30', emoji: catEmoji('evening'), category: 'evening', contexts: ['beforeBed'], strengthenTags: ['#\uCCA0\uC800\uD568', '#\uC5EC\uC720'], estimatedMinutes: 5, difficulty: 1 },
  { id: 165, title: '\uC2A4\uB9C8\uD2B8\uD3F0 \uCE68\uB300 \uBA40\uB9AC \uB450\uACE0 \uCDA9\uC804\uD558\uAE30', emoji: catEmoji('evening'), category: 'evening', contexts: ['beforeBed'], strengthenTags: ['#\uC808\uC81C\uB825', '#\uC219\uBA74'], estimatedMinutes: 1, difficulty: 2 },
  { id: 166, title: '\uC7A0\uB4E4\uAE30 1\uC2DC\uAC04 \uC804 \uBE14\uB8E8\uB77C\uC774\uD2B8 \uCC28\uB2E8', emoji: catEmoji('evening'), category: 'evening', contexts: ['beforeBed'], strengthenTags: ['#\uC790\uAE30\uAD00\uB9AC', '#\uAC74\uAC15'], estimatedMinutes: 1, difficulty: 2 },
  { id: 167, title: '\uB530\uB73B\uD55C \uCC28 \uB9C8\uC2DC\uBA70 \uD558\uB8E8 \uC815\uB9AC', emoji: catEmoji('evening'), category: 'evening', contexts: ['beforeBed'], strengthenTags: ['#\uCE68\uCC29\uD568', '#\uC774\uC644'], estimatedMinutes: 10, difficulty: 1 },
  { id: 168, title: '\uC885\uC774\uCC45 10\uD398\uC774\uC9C0 \uC77D\uACE0 \uC790\uAE30', emoji: catEmoji('evening'), category: 'evening', contexts: ['beforeBed'], strengthenTags: ['#\uC9C0\uC801', '#\uD3C9\uC628'], estimatedMinutes: 15, difficulty: 2 },
  { id: 169, title: '\uAC10\uC0AC \uC77C\uAE30 \uC4F0\uAE30', emoji: catEmoji('evening'), category: 'evening', contexts: ['beforeBed'], strengthenTags: ['#\uAC10\uC0AC', '#\uAE0D\uC815'], estimatedMinutes: 5, difficulty: 1 },
  { id: 170, title: '\uC2A4\uD2B8\uB808\uCE6D \uD558\uAE30', emoji: catEmoji('evening'), category: 'evening', contexts: ['beforeBed'], strengthenTags: ['#\uC790\uAE30\uB3CC\uBD04', '#\uAC74\uAC15'], estimatedMinutes: 5, difficulty: 1 },
  { id: 171, title: '\uBC29 \uC628\uB3C4 \uCCB4\uD06C\uD558\uAE30', emoji: catEmoji('evening'), category: 'evening', contexts: ['beforeBed'], strengthenTags: ['#\uC12C\uC138\uD568', '#\uC7EC\uC801'], estimatedMinutes: 1, difficulty: 1 },
  { id: 172, title: '\uC554\uB9C9 \uCEE4\uD2BC \uCE58\uACE0 \uBC29 \uC5B4\uB461\uAC8C \uD558\uAE30', emoji: catEmoji('evening'), category: 'evening', contexts: ['beforeBed'], strengthenTags: ['#\uCCA0\uC800\uD568', '#\uC219\uBA74'], estimatedMinutes: 1, difficulty: 1 },
  { id: 173, title: '\uB0B4\uC77C \uAE30\uC0C1 \uC54C\uB78C \uD655\uC778\uD558\uAE30', emoji: catEmoji('evening'), category: 'evening', contexts: ['beforeBed'], strengthenTags: ['#\uACC4\uD68D\uC801', '#\uC2E0\uB8B0'], estimatedMinutes: 1, difficulty: 1 },
  { id: 175, title: '\uC804\uC790\uAE30\uAE30 \uB044\uACE0 10\uBD84\uAC04 \uBA4D\uB54C\uB9AC\uAE30', emoji: catEmoji('evening'), category: 'evening', contexts: ['beforeBed'], strengthenTags: ['#\uC131\uCC30\uC801', '#\uACE0\uC694'], estimatedMinutes: 10, difficulty: 2 },
  { id: 177, title: '\uB0B4\uC77C \uAE30\uB300\uB418\uB294 \uC77C 1\uAC00\uC9C0 \uC0DD\uAC01\uD558\uAE30', emoji: catEmoji('evening'), category: 'evening', contexts: ['beforeBed'], strengthenTags: ['#\uC124\uB818', '#\uD76C\uB9DD'], estimatedMinutes: 2, difficulty: 1 },
  { id: 178, title: '\uC52A\uACE0 \uB85C\uC158 \uBC14\uB974\uAE30', emoji: catEmoji('evening'), category: 'evening', contexts: ['evening'], strengthenTags: ['#\uC12C\uC138\uD568', '#\uB3CC\uBD04'], estimatedMinutes: 10, difficulty: 1 },
  { id: 179, title: '\uD558\uB8E8 1\uC904 \uC77C\uAE30 \uC4F0\uAE30', emoji: catEmoji('evening'), category: 'evening', contexts: ['beforeBed'], strengthenTags: ['#\uAE30\uB85D', '#\uC131\uCC30\uC801'], estimatedMinutes: 2, difficulty: 1 },
  { id: 180, title: '\uC2A4\uC2A4\uB85C\uC5D0\uAC8C "\uC624\uB298\uB3C4 \uC218\uACE0\uD588\uC5B4" \uB9D0\uD558\uAE30', emoji: catEmoji('evening'), category: 'evening', contexts: ['beforeBed'], strengthenTags: ['#\uC790\uC560', '#\uC704\uB85C'], estimatedMinutes: 1, difficulty: 1 },

  // ========== Periodic (20) ==========
  { id: 181, title: '\uB2E4\uC74C \uC8FC \uC77C\uC815 \uC804\uCCB4 \uD6D1\uAE30', emoji: catEmoji('periodic'), category: 'periodic', contexts: ['weekly'], strengthenTags: ['#\uC804\uB7B5\uC801', '#\uB300\uBE44\uD558\uB294'], estimatedMinutes: 15, difficulty: 2 },
  { id: 182, title: '\uB300\uCCAD\uC18C\uD558\uAE30', emoji: catEmoji('periodic'), category: 'periodic', contexts: ['weekly'], strengthenTags: ['#\uBD80\uC9C0\uB7F0', '#\uC0C1\uCE8C\uD568'], estimatedMinutes: 60, difficulty: 2 },
  { id: 183, title: '\uB0C9\uC7A5\uACE0 \uC2DD\uC7AC\uB8CC \uC720\uD1B5\uAE30\uD55C \uD655\uC778', emoji: catEmoji('periodic'), category: 'periodic', contexts: ['weekly'], strengthenTags: ['#\uC54C\uB728\uD568', '#\uAD00\uB9AC'], estimatedMinutes: 10, difficulty: 1 },
  { id: 184, title: '\uD55C \uC8FC\uAC04\uC758 \uC9C0\uCD9C \uACB0\uC0B0\uD558\uAE30', emoji: catEmoji('periodic'), category: 'periodic', contexts: ['weekly'], strengthenTags: ['#\uACBD\uC81C\uC801', '#\uBC18\uC131'], estimatedMinutes: 15, difficulty: 2 },
  { id: 185, title: '\uB514\uC9C0\uD138 \uB514\uD1A1\uC2A4 \uD558\uAE30', emoji: catEmoji('periodic'), category: 'periodic', contexts: ['weekly'], strengthenTags: ['#\uC790\uC720', '#\uD734\uC2DD'], estimatedMinutes: 60, difficulty: 3 },
  { id: 186, title: '\uB098\uC5D0\uAC8C \uC120\uBB3C \uC8FC\uAE30', emoji: catEmoji('periodic'), category: 'periodic', contexts: ['monthly'], strengthenTags: ['#\uBCF4\uC0C1', '#\uB3D9\uAE30\uBD80\uC5EC'], estimatedMinutes: 30, difficulty: 1 },
  { id: 187, title: '\uC548 \uC785\uB294 \uC637/\uBB3C\uAC74 \uAE30\uBD80\uD558\uAC70\uB098 \uBC84\uB9AC\uAE30', emoji: catEmoji('periodic'), category: 'periodic', contexts: ['monthly'], strengthenTags: ['#\uBBF8\uB2C8\uBA40', '#\uB098\uB214'], estimatedMinutes: 30, difficulty: 2 },
  { id: 188, title: '\uC6D4\uAC04 \uBAA9\uD45C \uC810\uAC80\uD558\uACE0 \uC218\uC815\uD558\uAE30', emoji: catEmoji('periodic'), category: 'periodic', contexts: ['monthly'], strengthenTags: ['#\uC720\uC5F0\uD568', '#\uBAA9\uD45C'], estimatedMinutes: 20, difficulty: 2 },
  { id: 189, title: '\uC18C\uC911\uD55C \uC0AC\uB78C\uB4E4\uC5D0\uAC8C \uC548\uBD80 \uC804\uD654 \uB3CC\uB9AC\uAE30', emoji: catEmoji('periodic'), category: 'periodic', contexts: ['monthly'], strengthenTags: ['#\uC778\uB9E5', '#\uB2E4\uC815\uD568'], estimatedMinutes: 30, difficulty: 2 },
  { id: 190, title: '\uC815\uAE30 \uAD6C\uB3C5 \uC11C\uBE44\uC2A4 \uC0AC\uC6A9 \uC5EC\uBD80 \uC810\uAC80', emoji: catEmoji('periodic'), category: 'periodic', contexts: ['monthly'], strengthenTags: ['#\uD6A8\uC728\uC801', '#\uACBD\uC81C\uC801'], estimatedMinutes: 15, difficulty: 1 },
  { id: 191, title: '\uCEF4\uD4E8\uD130/\uD3F0 \uC0AC\uC9C4\uCCA9 \uC815\uB9AC\uD558\uAE30', emoji: catEmoji('periodic'), category: 'periodic', contexts: ['monthly'], strengthenTags: ['#\uAE54\uB054\uD568', '#\uCD94\uC5B5'], estimatedMinutes: 30, difficulty: 1 },
  { id: 192, title: '\uD55C \uB2EC \uB3D9\uC548 \uC77D\uC740 \uCC45/\uBCF8 \uC601\uD654 \uAE30\uB85D \uC815\uB9AC', emoji: catEmoji('periodic'), category: 'periodic', contexts: ['monthly'], strengthenTags: ['#\uC9C0\uC801', '#\uC544\uCE74\uC774\uBE59'], estimatedMinutes: 15, difficulty: 1 },
  { id: 193, title: '\uC0C8\uB85C\uC6B4 \uB9DB\uC9D1\uC774\uB098 \uD56B\uD50C\uB808\uC774\uC2A4 \uD0D0\uBC29', emoji: catEmoji('periodic'), category: 'periodic', contexts: ['weekend'], strengthenTags: ['#\uD2B8\uB80C\uB514', '#\uD65C\uAE30'], estimatedMinutes: 120, difficulty: 1 },
  { id: 194, title: '\uC790\uC5F0 \uC18D\uC5D0\uC11C 2\uC2DC\uAC04 \uC774\uC0C1 \uBCF4\uB0B4\uAE30', emoji: catEmoji('periodic'), category: 'periodic', contexts: ['weekend'], strengthenTags: ['#\uD798\uB9C1', '#\uC5EC\uC720'], estimatedMinutes: 120, difficulty: 1 },
  { id: 195, title: '\uBC00\uB9B0 \uBE68\uB798 \uD558\uACE0 \uD587\uBCDB\uC5D0 \uB9D0\uB9AC\uAE30', emoji: catEmoji('periodic'), category: 'periodic', contexts: ['weekend'], strengthenTags: ['#\uC0C1\uCE8C\uD568', '#\uC0DD\uD65C\uB825'], estimatedMinutes: 30, difficulty: 1 },
  { id: 196, title: '\uD55C \uC8FC \uB3D9\uC548 \uAC10\uC0AC\uD588\uB358 \uC0AC\uB78C \uB9AC\uC2A4\uD2B8 \uC801\uAE30', emoji: catEmoji('periodic'), category: 'periodic', contexts: ['weekly'], strengthenTags: ['#\uAC10\uC0AC', '#\uACA6\uC190'], estimatedMinutes: 10, difficulty: 1 },
  { id: 197, title: '\uB2E4\uC74C \uB2EC \uACBD\uC870\uC0AC \uBBF8\uB9AC \uCCB4\uD06C\uD558\uAE30', emoji: catEmoji('periodic'), category: 'periodic', contexts: ['monthly'], strengthenTags: ['#\uC900\uBE44\uC131', '#\uC0AC\uD68C\uC131'], estimatedMinutes: 10, difficulty: 1 },
  { id: 198, title: '\uBE44\uC0C1\uAE08/\uC801\uAE08 \uD1B5\uC7A5 \uC794\uC561 \uD655\uC778', emoji: catEmoji('periodic'), category: 'periodic', contexts: ['monthly'], strengthenTags: ['#\uC548\uC815\uC801', '#\uBBF8\uB798'], estimatedMinutes: 5, difficulty: 1 },
  { id: 199, title: '\uD55C \uB2EC\uAC04\uC758 \'\uBCA0\uC2A4\uD2B8 \uBAA8\uBA3C\uD2B8\' \uC120\uC815\uD558\uAE30', emoji: catEmoji('periodic'), category: 'periodic', contexts: ['monthly'], strengthenTags: ['#\uAE0D\uC815', '#\uD589\uBCF5'], estimatedMinutes: 10, difficulty: 1 },
  { id: 200, title: '\uC544\uBB34\uAC83\uB3C4 \uC548 \uD558\uB294 \uB0A0 \uAC16\uAE30', emoji: catEmoji('periodic'), category: 'periodic', contexts: ['monthly'], strengthenTags: ['#\uD734\uC2DD', '#\uC7AC\uCDA9\uC804'], estimatedMinutes: 480, difficulty: 1 },
];

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

/**
 * Group templates by category.
 */
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

/**
 * Filter templates that include the given context.
 */
export function templatesByContext(context: HabitContext): HabitTemplateItem[] {
  return HABIT_TEMPLATES.filter((t) => t.contexts.includes(context));
}

/**
 * Recommend templates based on user strengthen-tags (simple tag matching).
 * Returns up to `limit` templates sorted by number of matching tags descending.
 */
export function recommendTemplates(
  userTags: Set<string>,
  limit?: number,
): HabitTemplateItem[];

/**
 * Recommend templates based on context + user tags (composite scoring).
 * Returns HabitRecommendation objects with matchScore and reasons.
 */
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
    // Simple tag-based recommendation
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

  // Context + tag composite recommendation
  const contextInfo = HABIT_CONTEXT_INFO[context];

  return HABIT_TEMPLATES
    .map((template) => {
      let score = 1.0;
      const reasons: string[] = [];

      // Context matching
      if (template.contexts.includes(context)) {
        score *= 2.0;
        reasons.push(`${contextInfo.emoji} ${contextInfo.label}에 적합`);
      }

      // Tag matching
      const matchingTags = template.strengthenTags.filter((tag) => userTags.has(tag));
      if (matchingTags.length > 0) {
        score *= 1.0 + matchingTags.length * 0.3;
        reasons.push(`${matchingTags.join(' ')} 강화`);
      }

      // Difficulty correction (slightly prefer easier ones)
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
