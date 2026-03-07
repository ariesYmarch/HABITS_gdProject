import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useAppStore } from '../../store';
import { themes } from '../../theme/themes';
import type { TimetableSlotType } from '../../types/user';

const DAYS = ['월', '화', '수', '목', '금', '토', '일'];
const START_HOUR = 6;
const END_HOUR = 24; // exclusive
const HOURS = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => i + START_HOUR);

interface SlotTypeOption {
  type: TimetableSlotType;
  label: string;
  emoji: string;
  color: string;
}

const SLOT_TYPES: SlotTypeOption[] = [
  { type: 'sleep', label: '수면', emoji: '😴', color: '#6B7280' },
  { type: 'commute', label: '이동', emoji: '🚇', color: '#3B82F6' },
  { type: 'work', label: '업무/학습', emoji: '💼', color: '#EF4444' },
  { type: 'meal', label: '식사', emoji: '🍽️', color: '#F59E0B' },
  { type: 'free', label: '자유', emoji: '🌿', color: '#10B981' },
  { type: null, label: '지우기', emoji: '✕', color: '#D1D5DB' },
];

interface TimetableGridProps {
  timetableData: (TimetableSlotType)[][];
  onUpdateSlot: (day: number, hour: number, type: TimetableSlotType) => void;
}

export function TimetableGrid({ timetableData, onUpdateSlot }: TimetableGridProps) {
  const themeId = useAppStore((s) => s.selectedTheme);
  const theme = themes[themeId];
  const [selectedSlotType, setSelectedSlotType] = useState<TimetableSlotType>('work');

  const getSlotColor = (type: TimetableSlotType): string => {
    const option = SLOT_TYPES.find((s) => s.type === type);
    return option?.color ?? 'transparent';
  };

  return (
    <View style={styles.container}>
      {/* Slot Type Selector Bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.selectorBar}
        contentContainerStyle={styles.selectorContent}>
        {SLOT_TYPES.map((option) => {
          const isActive = selectedSlotType === option.type;
          return (
            <TouchableOpacity
              key={option.label}
              style={[
                styles.selectorButton,
                isActive && {
                  backgroundColor: option.color + '20',
                  borderColor: option.color,
                },
              ]}
              onPress={() => setSelectedSlotType(option.type)}
              activeOpacity={0.7}>
              <Text style={styles.selectorEmoji}>{option.emoji}</Text>
              <Text
                style={[
                  styles.selectorLabel,
                  isActive && { color: option.color, fontWeight: '700' },
                ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Grid */}
      <ScrollView
        style={styles.gridScroll}
        showsVerticalScrollIndicator={true}
        nestedScrollEnabled>
        <View style={styles.grid}>
          {/* Day Headers */}
          <View style={styles.headerRow}>
            <View style={styles.hourCell}>
              <Text style={[styles.hourLabel, { color: theme.textSecondary }]}>
                시간
              </Text>
            </View>
            {DAYS.map((day, idx) => (
              <View key={day} style={styles.dayHeaderCell}>
                <Text
                  style={[
                    styles.dayLabel,
                    {
                      color:
                        idx >= 5 ? '#EF4444' : theme.textPrimary,
                    },
                  ]}>
                  {day}
                </Text>
              </View>
            ))}
          </View>

          {/* Hour Rows */}
          {HOURS.map((hour) => (
            <View key={hour} style={styles.row}>
              <View style={styles.hourCell}>
                <Text
                  style={[styles.hourLabel, { color: theme.textSecondary }]}>
                  {hour}
                </Text>
              </View>
              {DAYS.map((_, dayIdx) => {
                const slotType = timetableData[dayIdx]?.[hour] ?? null;
                const bgColor = slotType
                  ? getSlotColor(slotType) + '30'
                  : 'transparent';
                const borderColor = slotType
                  ? getSlotColor(slotType) + '60'
                  : '#F3F4F6';

                return (
                  <TouchableOpacity
                    key={`${dayIdx}-${hour}`}
                    style={[
                      styles.cell,
                      {
                        backgroundColor: bgColor,
                        borderColor,
                      },
                    ]}
                    onPress={() => onUpdateSlot(dayIdx, hour, selectedSlotType)}
                    activeOpacity={0.6}>
                    {slotType && (
                      <View
                        style={[
                          styles.cellDot,
                          { backgroundColor: getSlotColor(slotType) },
                        ]}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Legend */}
      <View style={styles.legend}>
        {SLOT_TYPES.filter((s) => s.type !== null).map((option) => (
          <View key={option.label} style={styles.legendItem}>
            <View
              style={[styles.legendDot, { backgroundColor: option.color }]}
            />
            <Text style={[styles.legendLabel, { color: theme.textSecondary }]}>
              {option.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const CELL_SIZE = 36;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  selectorBar: {
    maxHeight: 50,
    marginBottom: 12,
  },
  selectorContent: {
    gap: 8,
    paddingHorizontal: 4,
  },
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    gap: 4,
  },
  selectorEmoji: {
    fontSize: 14,
  },
  selectorLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  gridScroll: {
    maxHeight: 320,
  },
  grid: {
    paddingRight: 4,
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  hourCell: {
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hourLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  dayHeaderCell: {
    width: CELL_SIZE,
    alignItems: 'center',
    paddingVertical: 4,
    marginHorizontal: 1,
  },
  dayLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  cell: {
    width: CELL_SIZE,
    height: 28,
    marginHorizontal: 1,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingTop: 12,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
});
