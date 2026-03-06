export type ThemeId = 'default' | 'sunset' | 'lavender' | 'forest';

export interface AppTheme {
  id: ThemeId;
  name: string;
  emoji: string;
  gradientColors: [string, string, string];
  primaryColor: string;
  backgroundColor: string;
  cardBackgroundColor: string;
  textPrimary: string;
  textSecondary: string;
}

export const themes: Record<ThemeId, AppTheme> = {
  default: {
    id: 'default',
    name: '오션',
    emoji: '🌊',
    gradientColors: ['#6DD5ED', '#2193B0', '#1A7A96'],
    primaryColor: '#2193B0',
    backgroundColor: '#F5F0EB',
    cardBackgroundColor: '#FFFFFF',
    textPrimary: '#1A1A2E',
    textSecondary: '#6B7280',
  },
  sunset: {
    id: 'sunset',
    name: '선셋',
    emoji: '🌅',
    gradientColors: ['#FCCB90', '#E8837C', '#D66D75'],
    primaryColor: '#E8837C',
    backgroundColor: '#FFF5F0',
    cardBackgroundColor: '#FFFFFF',
    textPrimary: '#2D1B14',
    textSecondary: '#8B7D75',
  },
  lavender: {
    id: 'lavender',
    name: '라벤더',
    emoji: '💜',
    gradientColors: ['#D4BBEE', '#B39DDB', '#9575CD'],
    primaryColor: '#9575CD',
    backgroundColor: '#F5F0FA',
    cardBackgroundColor: '#FFFFFF',
    textPrimary: '#1A1033',
    textSecondary: '#7B6F8A',
  },
  forest: {
    id: 'forest',
    name: '포레스트',
    emoji: '🌲',
    gradientColors: ['#A8D5A2', '#7CB67C', '#5A9A5A'],
    primaryColor: '#7CB67C',
    backgroundColor: '#F0F5ED',
    cardBackgroundColor: '#FFFFFF',
    textPrimary: '#1A2E1A',
    textSecondary: '#6B7D6B',
  },
};
