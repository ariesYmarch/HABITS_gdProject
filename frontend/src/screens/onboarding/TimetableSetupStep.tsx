import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const insets = useSafeAreaInsets();
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
    <View style={[styles.container, { backgroundColor: theme.backgroundColor, paddingTop: insets.top, paddingBottom: insets.bottom + 24 }]}>
      <ProgressBar current={8} total={10} />

      {/* Header — Swift style */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={[styles.backText, { color: theme.textSecondary }]}>
            {'<'}  이전
          </Text>
        </TouchableOpacity>

        <Text style={[styles.title, { color: theme.textPrimary }]}>
          일주일 일과를 알려주세요
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          시간대를 선택하고 표에서 해당 시간을 터치하세요{'\n'}
          입력하지 않아도 괜찮아요!
        </Text>
      </View>

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
    paddingTop: 8,
  },
  backButton: {
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 16,
    fontWeight: '400',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    color: '#9CA3AF',
  },
  gridWrapper: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  footer: {
    paddingHorizontal: 24,
  },
  button: {
    width: '100%',
  },
});
