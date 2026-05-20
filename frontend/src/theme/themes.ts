export type ThemeId = 'default';

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

// Colors extracted from ThemeManager.swift – exact RGB conversions
export const themes: Record<ThemeId, AppTheme> = {
  default: {
    id: 'default',
    name: '기본',
    emoji: '🌊',
    // from SVG: lemon → sky blue → aqua cyan (HABITS logo)
    gradientColors: ['#EFF8D1', '#ACD9E9', '#6BE1EE'],
    primaryColor: '#6BE1EE',
    backgroundColor: '#FAF9F6',
    cardBackgroundColor: '#FFFFFF',
    textPrimary: '#1C1C1E',
    textSecondary: '#666666',
  },
};
