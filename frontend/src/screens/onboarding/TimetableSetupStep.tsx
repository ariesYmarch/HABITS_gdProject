import React, { useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../types/navigation';
import type { TimetableSlotType } from '../../types/user';
import { ProgressBar } from '../../components/common/ProgressBar';
import { GradientButton } from '../../components/common/GradientButton';
import { TimetableGrid } from '../../components/timetable/TimetableGrid';
import { useAppStore } from '../../store';
import { themes } from '../../theme/themes';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'TimetableSetup'>;

export function TimetableSetupStep({ navigation }: Props) {
  const themeId = useAppStore((s) => s.selectedTheme);
  const theme = themes[themeId];
  const timetableData = useAppStore((s) => s.timetableData);
  const updateTimetableSlot = useAppStore((s) => s.updateTimetableSlot);

  const handleUpdateSlot = useCallback(
    (day: number, hour: number, type: TimetableSlotType) => {
      updateTimetableSlot(day, hour, type);
    },
    [updateTimetableSlot],
  );

  const handleNext = () => {
    navigation.navigate('HabitRecommendation');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.stepLabel, { color: theme.textSecondary }]}>
          Step 8 / 10
        </Text>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          나의 일주일 시간표
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          슬롯 유형을 선택한 뒤 칸을 터치하세요
        </Text>
      </View>

      <ProgressBar current={8} total={10} showLabel={false} />

      {/* Timetable */}
      <View style={styles.gridWrapper}>
        <TimetableGrid
          timetableData={timetableData}
          onUpdateSlot={handleUpdateSlot}
        />
      </View>

      {/* CTA */}
      <View style={styles.footer}>
        <GradientButton
          title="다음"
          onPress={handleNext}
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  stepLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  gridWrapper: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  button: {
    width: '100%',
  },
});
