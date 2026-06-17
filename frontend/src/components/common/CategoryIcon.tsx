import React from 'react';
import { Text } from 'react-native';
import {
  Sunrise, Train, Zap, BookOpen, Heart, Users, Brain, Wallet, Moon, CalendarDays,
} from 'lucide-react-native';

// HABIT_CATEGORY_INFO에 정의된 카테고리별 emoji 문자열 → lucide 픽토그램 매핑.
// habit.emoji가 카테고리 emoji와 일치하면 픽토그램 렌더, 그 외(사용자 커스텀)는 텍스트 fallback.
const ICON_BY_EMOJI: Record<string, React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>> = {
  '\u{1F305}': Sunrise,      // morningRitual
  '\u{1F687}': Train,        // commute
  '⚡': Zap,             // productivity
  '\u{1F4D6}': BookOpen,     // learning
  '\u{1F49A}': Heart,        // health
  '\u{1F495}': Users,        // relationship
  '\u{1F9D8}': Brain,        // mindset
  '\u{1F48E}': Wallet,       // finance
  '\u{1F319}': Moon,         // evening
  '\u{1F4CA}': CalendarDays, // periodic
};

interface Props {
  emoji: string;
  size?: number;
  color?: string;
}

export function CategoryIcon({ emoji, size = 22, color = '#6B7280' }: Props) {
  const Icon = ICON_BY_EMOJI[emoji];
  if (Icon) return <Icon size={size} color={color} strokeWidth={1.8} />;
  return <Text style={{ fontSize: size }}>{emoji}</Text>;
}
