import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppStore } from '../../store';
import { themes } from '../../theme/themes';
import type { Habit, TimeSlot } from '../../types/habit';

interface HabitCheckRowProps {
  habit: Habit;
  dateString: string;
  onToggle: (habitId: string) => void;
}

const TIME_SLOT_INFO: Record<TimeSlot, { icon: string; label: string }> = {
  morning: { icon: '🌅', label: '아침' },
  commute: { icon: '🚇', label: '이동' },
  lunch: { icon: '🍽️', label: '점심' },
  afternoon: { icon: '☀️', label: '오후' },
  evening: { icon: '🌙', label: '저녁' },
  bedtime: { icon: '😴', label: '취침 전' },
  anytime: { icon: '⏰', label: '자유' },
};

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}분`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}시간 ${m}분` : `${h}시간`;
}

export function HabitCheckRow({ habit, dateString, onToggle }: HabitCheckRowProps) {
  const themeId = useAppStore((s) => s.selectedTheme);
  const theme = themes[themeId];

  const isCompleted = !!habit.completionHistory[dateString];
  const slotInfo = TIME_SLOT_INFO[habit.timeSlot];

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: isCompleted
            ? theme.primaryColor + '08'
            : theme.cardBackgroundColor,
          borderColor: isCompleted ? theme.primaryColor + '30' : '#F3F4F6',
        },
      ]}
      onPress={() => onToggle(habit.id)}
      activeOpacity={0.7}>
      {/* Checkbox */}
      <TouchableOpacity
        style={[
          styles.checkbox,
          isCompleted
            ? { backgroundColor: theme.primaryColor, borderColor: theme.primaryColor }
            : { borderColor: '#D1D5DB' },
        ]}
        onPress={() => onToggle(habit.id)}
        activeOpacity={0.7}>
        {isCompleted && <Text style={styles.checkMark}>✓</Text>}
      </TouchableOpacity>

      {/* Emoji */}
      <Text style={styles.emoji}>{habit.emoji}</Text>

      {/* Content */}
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            {
              color: isCompleted ? theme.textSecondary : theme.textPrimary,
              textDecorationLine: isCompleted ? 'line-through' : 'none',
            },
          ]}
          numberOfLines={1}>
          {habit.title}
        </Text>
        <View style={styles.meta}>
          <Text style={[styles.metaText, { color: theme.textSecondary }]}>
            {slotInfo.icon} {slotInfo.label}
          </Text>
          <Text style={[styles.metaDot, { color: theme.textSecondary }]}>·</Text>
          <Text style={[styles.metaText, { color: theme.textSecondary }]}>
            {formatDuration(habit.duration)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  emoji: {
    fontSize: 28,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 3,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    fontWeight: '400',
  },
  metaDot: {
    fontSize: 12,
    marginHorizontal: 4,
  },
});
