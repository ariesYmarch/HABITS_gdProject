import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useAppStore } from '../../store';
import { themes } from '../../theme/themes';
import type { Habit, HabitFrequency } from '../../types/habit';

interface ProgressTabProps {
  startDate: string;
  endDate: string;
}

function isHabitOnDay(frequency: HabitFrequency, dayOfWeek: number): boolean {
  if (frequency === 'daily') return true;
  if (frequency === 'weekdays') return dayOfWeek < 5;
  if (frequency === 'weekends') return dayOfWeek >= 5;
  if (typeof frequency === 'object' && frequency.type === 'custom') {
    return frequency.days.includes(dayOfWeek);
  }
  return true;
}

function getDayOfWeek(dateString: string): number {
  const d = new Date(dateString + 'T00:00:00');
  const jsDay = d.getDay();
  return jsDay === 0 ? 6 : jsDay - 1;
}

function getDatesBetween(start: string, end: string): string[] {
  const dates: string[] = [];
  const current = new Date(start + 'T00:00:00');
  const last = new Date(end + 'T00:00:00');
  while (current <= last) {
    const y = current.getFullYear();
    const m = String(current.getMonth() + 1).padStart(2, '0');
    const d = String(current.getDate()).padStart(2, '0');
    dates.push(`${y}-${m}-${d}`);
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

function CircularProgress({
  progress,
  size = 120,
  strokeWidth = 10,
  color,
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#F3F4F6"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={StyleSheet.absoluteFill}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={[styles.circlePercent, { color }]}>
            {Math.round(progress * 100)}%
          </Text>
        </View>
      </View>
    </View>
  );
}

function getInsightMessage(rate: number): string {
  if (rate >= 0.9) return '놀라운 실천력이에요! 이대로 유지해주세요 🔥';
  if (rate >= 0.7) return '잘하고 있어요! 조금만 더 힘내봐요 💪';
  if (rate >= 0.5) return '절반 이상 달성! 꾸준히 해봐요 🌱';
  if (rate >= 0.3) return '시작이 반이에요. 작은 습관부터 도전해볼까요? ✨';
  return '천천히 시작해봐요. 하나씩 해내면 돼요 🌿';
}

export function ProgressTab({ startDate, endDate }: ProgressTabProps) {
  const themeId = useAppStore((s) => s.selectedTheme);
  const theme = themes[themeId];
  const habits = useAppStore((s) => s.habits);

  const stats = useMemo(() => {
    const dates = getDatesBetween(startDate, endDate);
    let totalExpected = 0;
    let totalCompleted = 0;

    // Per-habit stats
    const habitStats: {
      habit: Habit;
      expected: number;
      completed: number;
      rate: number;
    }[] = [];

    const activeHabits = habits.filter((h) => h.isActive);

    activeHabits.forEach((habit) => {
      let expected = 0;
      let completed = 0;
      dates.forEach((dateStr) => {
        const dow = getDayOfWeek(dateStr);
        if (isHabitOnDay(habit.frequency, dow)) {
          expected++;
          if (habit.completionHistory[dateStr]) {
            completed++;
          }
        }
      });
      totalExpected += expected;
      totalCompleted += completed;
      habitStats.push({
        habit,
        expected,
        completed,
        rate: expected > 0 ? completed / expected : 0,
      });
    });

    // By hashtag
    const tagMap: Record<string, { expected: number; completed: number }> = {};
    activeHabits.forEach((habit) => {
      let expected = 0;
      let completed = 0;
      dates.forEach((dateStr) => {
        const dow = getDayOfWeek(dateStr);
        if (isHabitOnDay(habit.frequency, dow)) {
          expected++;
          if (habit.completionHistory[dateStr]) completed++;
        }
      });
      habit.hashtags.forEach((tag) => {
        if (!tagMap[tag]) tagMap[tag] = { expected: 0, completed: 0 };
        tagMap[tag].expected += expected;
        tagMap[tag].completed += completed;
      });
    });

    const tagStats = Object.entries(tagMap)
      .map(([tag, data]) => ({
        tag,
        rate: data.expected > 0 ? data.completed / data.expected : 0,
      }))
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 5);

    const overallRate =
      totalExpected > 0 ? totalCompleted / totalExpected : 0;

    return {
      overallRate,
      totalExpected,
      totalCompleted,
      habitStats: habitStats.sort((a, b) => b.rate - a.rate),
      tagStats,
    };
  }, [habits, startDate, endDate]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      {/* Overall Progress Circle */}
      <View
        style={[
          styles.card,
          { backgroundColor: theme.cardBackgroundColor },
        ]}>
        <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
          전체 완료율
        </Text>
        <View style={styles.circleContainer}>
          <CircularProgress
            progress={stats.overallRate}
            color={theme.primaryColor}
          />
        </View>
        <Text style={[styles.circleSubtext, { color: theme.textSecondary }]}>
          {stats.totalCompleted} / {stats.totalExpected} 완료
        </Text>
      </View>

      {/* AI Insight Card */}
      <View
        style={[
          styles.insightCard,
          { backgroundColor: theme.primaryColor + '10' },
        ]}>
        <Text style={styles.insightEmoji}>💡</Text>
        <Text style={[styles.insightText, { color: theme.textPrimary }]}>
          {getInsightMessage(stats.overallRate)}
        </Text>
      </View>

      {/* Per-hashtag progress */}
      {stats.tagStats.length > 0 && (
        <View
          style={[
            styles.card,
            { backgroundColor: theme.cardBackgroundColor },
          ]}>
          <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
            해시태그별 달성률
          </Text>
          {stats.tagStats.map(({ tag, rate }) => (
            <View key={tag} style={styles.barRow}>
              <Text
                style={[styles.barLabel, { color: theme.textPrimary }]}
                numberOfLines={1}>
                #{tag}
              </Text>
              <View style={styles.barBg}>
                <View
                  style={[
                    styles.barFill,
                    {
                      backgroundColor: theme.primaryColor,
                      width: `${Math.round(rate * 100)}%`,
                    },
                  ]}
                />
              </View>
              <Text
                style={[styles.barPercent, { color: theme.textSecondary }]}>
                {Math.round(rate * 100)}%
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Per-habit progress */}
      {stats.habitStats.length > 0 && (
        <View
          style={[
            styles.card,
            { backgroundColor: theme.cardBackgroundColor },
          ]}>
          <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
            습관별 달성률
          </Text>
          {stats.habitStats.map(({ habit, completed, expected, rate }) => (
            <View key={habit.id} style={styles.habitRow}>
              <Text style={styles.habitEmoji}>{habit.emoji}</Text>
              <View style={styles.habitInfo}>
                <Text
                  style={[styles.habitTitle, { color: theme.textPrimary }]}
                  numberOfLines={1}>
                  {habit.title}
                </Text>
                <View style={styles.barBg}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        backgroundColor: theme.primaryColor,
                        width: `${Math.round(rate * 100)}%`,
                      },
                    ]}
                  />
                </View>
              </View>
              <Text
                style={[styles.habitPercent, { color: theme.textSecondary }]}>
                {completed}/{expected}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Empty state */}
      {stats.habitStats.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>📊</Text>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            습관 데이터가 아직 없어요
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 20,
    gap: 16,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  circleContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  circlePercent: {
    fontSize: 28,
    fontWeight: '700',
  },
  circleSubtext: {
    fontSize: 13,
    textAlign: 'center',
  },
  insightCard: {
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  insightEmoji: {
    fontSize: 24,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  barLabel: {
    width: 80,
    fontSize: 13,
    fontWeight: '500',
  },
  barBg: {
    flex: 1,
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  barPercent: {
    width: 38,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 10,
  },
  habitEmoji: {
    fontSize: 22,
  },
  habitInfo: {
    flex: 1,
    gap: 4,
  },
  habitTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  habitPercent: {
    fontSize: 12,
    fontWeight: '500',
    width: 40,
    textAlign: 'right',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
  },
});
