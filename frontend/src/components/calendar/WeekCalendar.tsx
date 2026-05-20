import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppStore } from '../../store';
import { themes } from '../../theme/themes';

interface WeekCalendarProps {
  selectedDate: string; // 'YYYY-MM-DD'
  onSelectDate: (date: string) => void;
  weekOffset: number;
  onChangeWeek: (offset: number) => void;
  completionRates: Record<string, number>; // dateString -> 0~1
}

const DAYS = ['월', '화', '수', '목', '금', '토', '일'];

function getMonday(offset: number): Date {
  const today = new Date();
  const day = today.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diff + offset * 7);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getCompletionColor(rate: number | undefined): string | null {
  if (rate === undefined || rate < 0) return null;
  if (rate >= 0.8) return '#10B981';
  if (rate >= 0.5) return '#F59E0B';
  return '#EF4444';
}

export function WeekCalendar({
  selectedDate,
  onSelectDate,
  weekOffset,
  onChangeWeek,
  completionRates,
}: WeekCalendarProps) {
  const themeId = useAppStore((s) => s.selectedTheme);
  const theme = themes[themeId];

  const weekDates = useMemo(() => {
    const monday = getMonday(weekOffset);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return {
        date: d,
        dateString: formatDate(d),
        dayLabel: DAYS[i],
        dayNum: d.getDate(),
        isToday: formatDate(d) === formatDate(new Date()),
      };
    });
  }, [weekOffset]);

  const monthLabel = useMemo(() => {
    const first = weekDates[0].date;
    const last = weekDates[6].date;
    if (first.getMonth() === last.getMonth()) {
      return `${first.getFullYear()}년 ${first.getMonth() + 1}월`;
    }
    return `${first.getMonth() + 1}월 - ${last.getMonth() + 1}월`;
  }, [weekDates]);

  return (
    <View style={styles.container}>
      {/* Header: month + navigation */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onChangeWeek(weekOffset - 1)}>
          <Text style={[styles.arrow, { color: theme.primaryColor }]}>←</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onChangeWeek(0)}>
          <Text style={[styles.monthLabel, { color: theme.textPrimary }]}>
            {monthLabel}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onChangeWeek(weekOffset + 1)}>
          <Text style={[styles.arrow, { color: theme.primaryColor }]}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Day cells */}
      <View style={styles.row}>
        {weekDates.map((item) => {
          const isSelected = item.dateString === selectedDate;
          const rate = completionRates[item.dateString];
          const dotColor = getCompletionColor(rate);

          return (
            <TouchableOpacity
              key={item.dateString}
              style={[
                styles.dayCell,
                isSelected && {
                  backgroundColor: theme.primaryColor,
                  borderRadius: 12,
                },
              ]}
              onPress={() => onSelectDate(item.dateString)}
              activeOpacity={0.7}>
              <Text
                style={[
                  styles.dayLabel,
                  {
                    color: isSelected
                      ? '#FFFFFF'
                      : item.isToday
                      ? theme.primaryColor
                      : theme.textSecondary,
                  },
                ]}>
                {item.dayLabel}
              </Text>
              <Text
                style={[
                  styles.dayNum,
                  {
                    color: isSelected ? '#FFFFFF' : theme.textPrimary,
                    fontWeight: item.isToday || isSelected ? '700' : '500',
                  },
                ]}>
                {item.dayNum}
              </Text>
              {dotColor && (
                <View
                  style={[
                    styles.dot,
                    {
                      backgroundColor: isSelected ? '#FFFFFF' : dotColor,
                    },
                  ]}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  arrow: {
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dayCell: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    minWidth: 38,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 6,
  },
  dayNum: {
    fontSize: 16,
    marginBottom: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 2,
  },
});
