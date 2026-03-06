export type HashtagCategory = 'attitude' | 'emotion' | 'relationship' | 'value';

export interface PersonalityHashtag {
  id: string;
  tag: string;
  category: HashtagCategory;
  description: string;
}

export interface PersonalityType {
  id: number;
  nameKR: string;
  nameEN: string;
  description: string;
  hashtags: string[];
  emoji: string;
}

export type PersonalityTestType = 'current' | 'ideal';

export type TestCategory = 'attitude' | 'emotion' | 'relationship' | 'value';

export interface TestChoice {
  text: string;
  tags: string[];
}

export interface TestQuestion {
  id: number;
  category: TestCategory;
  question: string;
  choiceA: TestChoice;
  choiceB: TestChoice;
}
