import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { useAppStore } from '../../store';
import { themes } from '../../theme/themes';
import type { Habit, HabitFrequency, TimeSlot } from '../../types/habit';
import { schedulePush } from '../../services/sync';
import { Sunrise, Train, Utensils, Sun, Sunset, Moon, Clock } from 'lucide-react-native';

type _LucideIcon = React.ComponentType<{ size?: number; color?: string }>;

interface ReportRecommendationLite {
  kind: string;
  label: string;
  message: string;
}

interface Props {
  visible: boolean;
  habit: Habit | null;
  recommendation?: ReportRecommendationLite;
  onClose: () => void;
  onSaved?: () => void;
}

const FREQUENCY_OPTIONS: { value: HabitFrequency; label: string }[] = [
  { value: 'daily', label: '매일' },
  { value: 'weekdays', label: '평일만' },
  { value: 'weekends', label: '주말만' },
];

const TIME_SLOT_OPTIONS: { value: TimeSlot; label: string; Icon: _LucideIcon }[] = [
  { value: 'morning', label: '아침', Icon: Sunrise },
  { value: 'commute', label: '출근길', Icon: Train },
  { value: 'lunch', label: '점심', Icon: Utensils },
  { value: 'afternoon', label: '오후', Icon: Sun },
  { value: 'evening', label: '저녁', Icon: Sunset },
  { value: 'bedtime', label: '잠들기 전', Icon: Moon },
  { value: 'anytime', label: '아무때나', Icon: Clock },
];

const DURATION_OPTIONS = [5, 10, 15, 20, 30, 45, 60];

function freqEqual(a: HabitFrequency, b: HabitFrequency): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function HabitEditModal({ visible, habit, recommendation, onClose, onSaved }: Props) {
  const themeId = useAppStore((s) => s.selectedTheme);
  const theme = themes[themeId];
  const updateHabit = useAppStore((s) => s.updateHabit);

  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [timeSlot, setTimeSlot] = useState<TimeSlot>('anytime');
  const [duration, setDuration] = useState(15);

  // habit 변경 시 prefill
  useEffect(() => {
    if (habit) {
      setFrequency(habit.frequency);
      setTimeSlot(habit.timeSlot);
      setDuration(habit.duration);
    }
  }, [habit]);

  if (!habit) return null;

  const handleSave = () => {
    updateHabit(habit.id, { frequency, timeSlot, duration });
    schedulePush();
    onSaved?.();
    onClose();
  };

  const changed =
    !freqEqual(frequency, habit.frequency) ||
    timeSlot !== habit.timeSlot ||
    duration !== habit.duration;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={s.overlay}
      >
        <View style={[s.container, { backgroundColor: theme.backgroundColor }]}>
          <View style={s.header}>
            <TouchableOpacity onPress={onClose}>
              <Text style={[s.headerBtn, { color: theme.textSecondary }]}>취소</Text>
            </TouchableOpacity>
            <Text style={[s.title, { color: theme.textPrimary }]}>습관 조정</Text>
            <TouchableOpacity onPress={handleSave} disabled={!changed}>
              <Text style={[
                s.headerBtn,
                { color: changed ? theme.primaryColor : '#CBD5E1', fontWeight: '700' },
              ]}>저장</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={s.body}>
            {/* 추천 컨텍스트 */}
            {recommendation && (
              <View style={[s.recBox, { backgroundColor: theme.primaryColor + '12' }]}>
                <Text style={[s.recLabel, { color: theme.primaryColor }]}>
                  💡 추천: {recommendation.label}
                </Text>
                <Text style={[s.recMsg, { color: theme.textPrimary }]}>{recommendation.message}</Text>
              </View>
            )}

            {/* 대상 습관 */}
            <View style={s.targetBox}>
              <Text style={s.targetEmoji}>{habit.emoji}</Text>
              <Text style={[s.targetTitle, { color: theme.textPrimary }]}>{habit.title}</Text>
            </View>

            {/* 빈도 */}
            <Text style={[s.label, { color: theme.textPrimary }]}>빈도</Text>
            <View style={s.row}>
              {FREQUENCY_OPTIONS.map((f) => {
                const active = freqEqual(frequency, f.value);
                return (
                  <TouchableOpacity
                    key={f.label}
                    onPress={() => setFrequency(f.value)}
                    style={[s.chip, active && { backgroundColor: theme.primaryColor }]}
                  >
                    <Text style={[s.chipText, { color: active ? '#FFF' : theme.textPrimary }]}>{f.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* 시간대 */}
            <Text style={[s.label, { color: theme.textPrimary }]}>시간대</Text>
            <View style={s.wrapRow}>
              {TIME_SLOT_OPTIONS.map((t) => {
                const active = timeSlot === t.value;
                const Icon = t.Icon;
                return (
                  <TouchableOpacity
                    key={t.value}
                    onPress={() => setTimeSlot(t.value)}
                    style={[
                      s.chip,
                      { flexDirection: 'row', alignItems: 'center', gap: 6 },
                      active && { backgroundColor: theme.primaryColor },
                    ]}
                  >
                    <Icon size={14} color={active ? '#FFF' : theme.textPrimary} />
                    <Text style={[s.chipText, { color: active ? '#FFF' : theme.textPrimary }]}>
                      {t.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* 소요 시간 */}
            <Text style={[s.label, { color: theme.textPrimary }]}>소요 시간 (분)</Text>
            <View style={s.row}>
              {DURATION_OPTIONS.map((d) => {
                const active = duration === d;
                return (
                  <TouchableOpacity
                    key={d}
                    onPress={() => setDuration(d)}
                    style={[s.chip, active && { backgroundColor: theme.primaryColor }]}
                  >
                    <Text style={[s.chipText, { color: active ? '#FFF' : theme.textPrimary }]}>{d}분</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  container: {
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    maxHeight: '88%', minHeight: '60%',
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  title: { fontSize: 17, fontWeight: '700' },
  headerBtn: { fontSize: 15, paddingHorizontal: 4, paddingVertical: 4 },
  body: { padding: 20, paddingBottom: 40, gap: 8 },
  recBox: { padding: 14, borderRadius: 10, marginBottom: 12 },
  recLabel: { fontSize: 13, fontWeight: '700', marginBottom: 4 },
  recMsg: { fontSize: 13, lineHeight: 18 },
  targetBox: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 8, marginBottom: 4,
  },
  targetEmoji: { fontSize: 26 },
  targetTitle: { fontSize: 16, fontWeight: '700' },
  label: { fontSize: 14, fontWeight: '600', marginTop: 12, marginBottom: 8 },
  row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  wrapRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#F5F6FA',
  },
  chipText: { fontSize: 13, fontWeight: '500' },
});
