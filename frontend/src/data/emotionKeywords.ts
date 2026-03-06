/**
 * 한국어 감정 분석 키워드 사전
 * EmotionAnalysisService에서 사용
 * Swift EmotionAnalysisService.swift 에서 포팅
 */

import { EmotionType } from '../types/diary';

export const EMOTION_KEYWORDS: Record<EmotionType, string[]> = {
  joy: [
    '기쁨', '행복', '좋았', '신나', '즐거', '웃', '만족', '뿌듯',
    '설레', '감사', '최고', '대박', '기분좋', '사랑', '재밌', '굿',
    '완전', '진짜좋', '너무좋',
  ],
  sadness: [
    '슬프', '슬픔', '우울', '눈물', '외로', '쓸쓸', '허전', '그리',
    '아프', '힘들', '지치', '무기력', '공허', '답답', '서운', '섭섭',
    '마음이아',
  ],
  anxiety: [
    '불안', '걱정', '초조', '긴장', '두려', '무서', '떨리', '스트레스',
    '압박', '부담', '미루', '해야하는데', '어떡', '어쩌', '망할', '큰일',
    '조마조마',
  ],
  anger: [
    '화나', '짜증', '분노', '열받', '빡치', '답답', '억울', '싫어',
    '화가', '미치겠', '최악', '진짜', '왜이러', '짜증나', '열불', '못참',
  ],
  fatigue: [
    '피곤', '지치', '힘들', '녹초', '기진맥진', '졸리', '무기력',
    '귀찮', '그냥', '쉬고싶', '힘빠', '기력', '탈진', '늘어지',
  ],
  hope: [
    '희망', '기대', '설레', '꿈', '목표', '할수있', '노력', '도전',
    '성장', '발전', '응원', '화이팅', '파이팅', '해낼', '믿어', '가능',
  ],
};

/** 부호/특수문자 기반 감정 보정 규칙 */
export const PUNCTUATION_RULES = {
  sadnessFatigue: ['...', 'ㅠ', 'ㅜ'],  // 슬픔/피로 가산
  joyHope: ['!'],                        // 기쁨/희망 가산 (개수 비례)
  anxiety: ['?'],                        // 불안 가산 (개수 비례)
};

/** 감정별 색상 맵 */
export const EMOTION_COLORS: Record<EmotionType, string> = {
  joy: '#FFD700',
  sadness: '#6B8EC4',
  anger: '#E74C3C',
  anxiety: '#9B59B6',
  fatigue: '#95A5A6',
  hope: '#2ECC71',
};

/** 감정별 이모지 맵 */
export const EMOTION_EMOJIS: Record<EmotionType, string> = {
  joy: '😊',
  sadness: '😢',
  anger: '😤',
  anxiety: '😰',
  fatigue: '😩',
  hope: '🌟',
};

/** 감정별 한국어 라벨 */
export const EMOTION_LABELS: Record<EmotionType, string> = {
  joy: '기쁨',
  sadness: '슬픔',
  anger: '분노',
  anxiety: '불안',
  fatigue: '피로',
  hope: '희망',
};
