import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useAppStore } from '../../store';
import { themes } from '../../theme/themes';
import { WeekCalendar } from '../../components/calendar/WeekCalendar';
import { MonthCalendar } from '../../components/calendar/MonthCalendar';
import { HabitCheckRow } from '../../components/habit/HabitCheckRow';
import type { Habit, HabitFrequency } from '../../types/habit';

type CalendarMode = 'week' | 'month';

function formatDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getGreeting(): { text: string; emoji: string } {
  const hour = new Date().getHours();
  if (hour < 12) return { text: '좋은 아침이에요', emoji: '🌅' };
  if (hour < 18) return { text: '좋은 오후예요', emoji: '☀️' };
  return { text: '좋은 저녁이에요', emoji: '🌙' };
}

/** Check if a habit should appear on the given day-of-week (0=Mon..6=Sun) */
function isHabitOnDay(frequency: HabitFrequency, dayOfWeek: number): boolean {
  if (frequency === 'daily') return true;
  if (frequency === 'weekdays') return dayOfWeek < 5; // Mon-Fri
  if (frequency === 'weekends') return dayOfWeek >= 5; // Sat-Sun
  if (typeof frequency === 'object' && frequency.type === 'custom') {
    return frequency.days.includes(dayOfWeek);
  }
  return true;
}

/** Get day-of-week from dateString (0=Mon..6=Sun) */
function getDayOfWeek(dateString: string): number {
  const d = new Date(dateString + 'T00:00:00');
  const jsDay = d.getDay(); // 0=Sun
  return jsDay === 0 ? 6 : jsDay - 1; // Convert to Mon=0..Sun=6
}

export function HomeScreen() {
  const themeId = useAppStore((s) => s.selectedTheme);
  const theme = themes[themeId];
  const userName = useAppStore((s) => s.userName);
  const habits = useAppStore((s) => s.habits);
  const toggleHabitCompletion = useAppStore((s) => s.toggleHabitCompletion);

  const [selectedDate, setSelectedDate] = useState(formatDateString(new Date()));
  const [calendarMode, setCalendarMode] = useState<CalendarMode>('week');
  const [weekOffset, setWeekOffset] = useState(0);
  const [monthOffset, setMonthOffset] = useState(0);

  const greeting = getGreeting();

  // Filter habits for the selected date
  const filteredHabits = useMemo(() => {
    const dayOfWeek = getDayOfWeek(selectedDate);
    return habits
      .filter((h) => h.isActive && isHabitOnDay(h.frequency, dayOfWeek))
      .sort((a, b) => {
        const aCompleted = !!a.completionHistory[selectedDate];
        const bCompleted = !!b.completionHistory[selectedDate];
        if (aCompleted !== bCompleted) return aCompleted ? 1 : -1;
        return 0;
      });
  }, [habits, selectedDate]);

  // Calculate completion rates for all dates
  const completionRates = useMemo(() => {
    const rates: Record<string, number> = {};

    // Gather all dates that have any habit history
    const allDates = new Set<string>();
    habits.forEach((h) => {
      Object.keys(h.completionHistory).forEach((d) => allDates.add(d));
    });

    // Also add today
    allDates.add(formatDateString(new Date()));

    allDates.forEach((dateStr) => {
      const dayOfWeek = getDayOfWeek(dateStr);
      const activeHabits = habits.filter(
        (h) => h.isActive && isHabitOnDay(h.frequency, dayOfWeek),
      );
      if (activeHabits.length === 0) return;
      const completed = activeHabits.filter(
        (h) => !!h.completionHistory[dateStr],
      ).length;
      rates[dateStr] = completed / activeHabits.length;
    });

    return rates;
  }, [habits]);

  // Stats for the selected date
  const { totalCount, completedCount } = useMemo(() => {
    const total = filteredHabits.length;
    const done = filteredHabits.filter(
      (h) => !!h.completionHistory[selectedDate],
    ).length;
    return { totalCount: total, completedCount: done };
  }, [filteredHabits, selectedDate]);

  const handleToggle = useCallback(
    (habitId: string) => {
      toggleHabitCompletion(habitId, selectedDate);
    },
    [selectedDate, toggleHabitCompletion],
  );

  const renderHabitItem = useCallback(
    ({ item }: { item: Habit }) => (
      <HabitCheckRow
        habit={item}
        dateString={selectedDate}
        onToggle={handleToggle}
      />
    ),
    [selectedDate, handleToggle],
  );

  const renderHeader = () => (
    <View>
      {/* Greeting Header */}
      <View style={styles.greetingSection}>
        <Text style={[styles.greeting, { color: theme.textSecondary }]}>
          {greeting.emoji} {greeting.text}
        </Text>
        <Text style={[styles.userName, { color: theme.textPrimary }]}>
          {userName || '사용자'}님
        </Text>
      </View>

      {/* Calendar Mode Toggle */}
      <View style={styles.calendarToggle}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            calendarMode === 'week' && {
              backgroundColor: theme.primaryColor,
            },
          ]}
          onPress={() => setCalendarMode('week')}
          activeOpacity={0.7}>
          <Text
            style={[
              styles.toggleText,
              {
                color: calendarMode === 'week' ? '#FFFFFF' : theme.textSecondary,
              },
            ]}>
            주간
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            calendarMode === 'month' && {
              backgroundColor: theme.primaryColor,
            },
          ]}
          onPress={() => setCalendarMode('month')}
          activeOpacity={0.7}>
          <Text
            style={[
              styles.toggleText,
              {
                color: calendarMode === 'month' ? '#FFFFFF' : theme.textSecondary,
              },
            ]}>
            월간
          </Text>
        </TouchableOpacity>
      </View>

      {/* Calendar */}
      <View style={styles.calendarWrapper}>
        {calendarMode === 'week' ? (
          <WeekCalendar
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            weekOffset={weekOffset}
            onChangeWeek={setWeekOffset}
            completionRates={completionRates}
          />
        ) : (
          <MonthCalendar
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            monthOffset={monthOffset}
            onChangeMonth={setMonthOffset}
            completionRates={completionRates}
          />
        )}
      </View>

      {/* Summary Card */}
      <View
        style={[
          styles.summaryCard,
          { backgroundColor: theme.cardBackgroundColor },
        ]}>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
            오늘의 달성률
          </Text>
          <Text
            style={[
              styles.summaryValue,
              { color: theme.primaryColor },
            ]}>
            {totalCount > 0
              ? `${Math.round((completedCount / totalCount) * 100)}%`
              : '-'}
          </Text>
        </View>
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              {
                backgroundColor: theme.primaryColor,
                width:
                  totalCount > 0
                    ? `${(completedCount / totalCount) * 100}%`
                    : '0%',
              },
            ]}
          />
        </View>
        <Text style={[styles.summaryDetail, { color: theme.textSecondary }]}>
          {completedCount} / {totalCount} 완료
        </Text>
      </View>

      {/* Habit List Header */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
          습관 목록
        </Text>
        <Text style={[styles.sectionCount, { color: theme.textSecondary }]}>
          {filteredHabits.length}개
        </Text>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>🌱</Text>
      <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
        아직 습관이 없어요
      </Text>
      <Text style={[styles.emptyDesc, { color: theme.textSecondary }]}>
        온보딩에서 습관을 추가하거나{'\n'}마이페이지에서 새 습관을 만들어보세요
      </Text>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.backgroundColor }]}>
      <FlatList
        data={filteredHabits}
        keyExtractor={(item) => item.id}
        renderItem={renderHabitItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  greetingSection: {
    paddingTop: 16,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
  },
  calendarToggle: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 2,
    marginBottom: 12,
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '600',
  },
  calendarWrapper: {
    marginBottom: 16,
  },
  summaryCard: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  summaryDetail: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'right',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  sectionCount: {
    fontSize: 13,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});
