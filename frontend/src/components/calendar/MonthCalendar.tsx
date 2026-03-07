import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppStore } from '../../store';
import { themes } from '../../theme/themes';

interface MonthCalendarProps {
  selectedDate: string; // 'YYYY-MM-DD'
  onSelectDate: (date: string) => void;
  monthOffset: number;
  onChangeMonth: (offset: number) => void;
  completionRates: Record<string, number>; // dateString -> 0~1
}

const DAY_HEADERS = ['월', '화', '수', '목', '금', '토', '일'];

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

interface DayItem {
  date: Date;
  dateString: string;
  dayNum: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export function MonthCalendar({
  selectedDate,
  onSelectDate,
  monthOffset,
  onChangeMonth,
  completionRates,
}: MonthCalendarProps) {
  const themeId = useAppStore((s) => s.selectedTheme);
  const theme = themes[themeId];

  const { year, month, weeks } = useMemo(() => {
    const now = new Date();
    const targetDate = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
    const y = targetDate.getFullYear();
    const m = targetDate.getMonth();

    // First day of month (0=Sun, adjust to Mon-based)
    const firstDayOfMonth = new Date(y, m, 1);
    let startDow = firstDayOfMonth.getDay(); // 0=Sun
    // Convert to Monday-based: Mon=0, Tue=1, ... Sun=6
    startDow = startDow === 0 ? 6 : startDow - 1;

    const daysInMonth = new Date(y, m + 1, 0).getDate();

    // Previous month fill
    const prevMonthDays = new Date(y, m, 0).getDate();
    const todayStr = formatDate(new Date());

    const allDays: DayItem[] = [];

    // Previous month days
    for (let i = startDow - 1; i >= 0; i--) {
      const d = new Date(y, m - 1, prevMonthDays - i);
      allDays.push({
        date: d,
        dateString: formatDate(d),
        dayNum: d.getDate(),
        isCurrentMonth: false,
        isToday: formatDate(d) === todayStr,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(y, m, i);
      allDays.push({
        date: d,
        dateString: formatDate(d),
        dayNum: i,
        isCurrentMonth: true,
        isToday: formatDate(d) === todayStr,
      });
    }

    // Next month fill (up to full weeks)
    const remaining = 7 - (allDays.length % 7);
    if (remaining < 7) {
      for (let i = 1; i <= remaining; i++) {
        const d = new Date(y, m + 1, i);
        allDays.push({
          date: d,
          dateString: formatDate(d),
          dayNum: i,
          isCurrentMonth: false,
          isToday: formatDate(d) === todayStr,
        });
      }
    }

    // Split into weeks
    const weekRows: DayItem[][] = [];
    for (let i = 0; i < allDays.length; i += 7) {
      weekRows.push(allDays.slice(i, i + 7));
    }

    return { year: y, month: m, weeks: weekRows };
  }, [monthOffset]);

  const monthLabel = `${year}년 ${month + 1}월`;

  return (
    <View style={[styles.container, { backgroundColor: theme.cardBackgroundColor }]}>
      {/* Header: month + navigation */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onChangeMonth(monthOffset - 1)}>
          <Text style={[styles.arrow, { color: theme.primaryColor }]}>←</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onChangeMonth(0)}>
          <Text style={[styles.monthLabel, { color: theme.textPrimary }]}>
            {monthLabel}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onChangeMonth(monthOffset + 1)}>
          <Text style={[styles.arrow, { color: theme.primaryColor }]}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Day headers */}
      <View style={styles.dayHeaderRow}>
        {DAY_HEADERS.map((day, idx) => (
          <View key={day} style={styles.dayHeaderCell}>
            <Text
              style={[
                styles.dayHeaderLabel,
                {
                  color: idx >= 5 ? '#EF4444' : theme.textSecondary,
                },
              ]}>
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      {weeks.map((week, weekIdx) => (
        <View key={weekIdx} style={styles.weekRow}>
          {week.map((item) => {
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
                    borderRadius: 10,
                  },
                ]}
                onPress={() => onSelectDate(item.dateString)}
                activeOpacity={0.7}>
                <Text
                  style={[
                    styles.dayNum,
                    {
                      color: isSelected
                        ? '#FFFFFF'
                        : !item.isCurrentMonth
                        ? theme.textSecondary + '50'
                        : item.isToday
                        ? theme.primaryColor
                        : theme.textPrimary,
                      fontWeight: item.isToday || isSelected ? '700' : '400',
                    },
                  ]}>
                  {item.dayNum}
                </Text>
                {dotColor && item.isCurrentMonth && (
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
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  dayHeaderRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayHeaderCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  dayHeaderLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  dayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    minHeight: 36,
  },
  dayNum: {
    fontSize: 14,
    marginBottom: 2,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginTop: 1,
  },
});
