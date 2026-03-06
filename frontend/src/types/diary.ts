export type EmotionType =
  | 'joy'
  | 'sadness'
  | 'anger'
  | 'anxiety'
  | 'fatigue'
  | 'hope';

export interface EmotionInfo {
  type: EmotionType;
  emoji: string;
  label: string;
  color: string;
}

export const EMOTIONS: EmotionInfo[] = [
  { type: 'joy', emoji: '😊', label: '기쁨', color: '#FFD700' },
  { type: 'sadness', emoji: '😢', label: '슬픔', color: '#6B8EC4' },
  { type: 'anger', emoji: '😤', label: '분노', color: '#E74C3C' },
  { type: 'anxiety', emoji: '😰', label: '불안', color: '#9B59B6' },
  { type: 'fatigue', emoji: '😩', label: '피로', color: '#95A5A6' },
  { type: 'hope', emoji: '🌟', label: '희망', color: '#2ECC71' },
];

export interface DiaryEntry {
  id: string;
  date: string;
  moodScore: number; // -1 to 1
  emotionTags: string[];
  textContent?: string;
  habitSatisfaction?: 'satisfied' | 'neutral' | 'unsatisfied';
  emotionAnalysis?: EmotionAnalysisResult;
}

export interface EmotionAnalysisResult {
  mainEmotion: EmotionType;
  confidence: number;
  distribution: Record<EmotionType, number>;
  analyzedAt: string;
}
