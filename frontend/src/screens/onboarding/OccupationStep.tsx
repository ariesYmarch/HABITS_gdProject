import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../types/navigation';
import type { Occupation } from '../../types/user';
import { ProgressBar } from '../../components/common/ProgressBar';
import { GradientButton } from '../../components/common/GradientButton';
import { useAppStore } from '../../store';
import { themes } from '../../theme/themes';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Occupation'>;

interface OccupationOption {
  type: Occupation;
  emoji: string;
  label: string;
  description: string;
}

const OCCUPATION_OPTIONS: OccupationOption[] = [
  {
    type: '학생',
    emoji: '📚',
    label: '학생',
    description: '중·고등학생, 대학생, 대학원생',
  },
  {
    type: '직장인',
    emoji: '💼',
    label: '직장인',
    description: '회사원, 공무원, 자영업자',
  },
  {
    type: '기타',
    emoji: '🏠',
    label: '기타',
    description: '취업 준비, 프리랜서, 주부 등',
  },
];

export function OccupationStep({ navigation }: Props) {
  const themeId = useAppStore((s) => s.selectedTheme);
  const theme = themes[themeId];
  const insets = useSafeAreaInsets();
  const setOccupation = useAppStore((s) => s.setOccupation);
  const currentOccupation = useAppStore((s) => s.occupation);

  const [selected, setSelected] = useState<Occupation>(currentOccupation);

  const handleNext = () => {
    setOccupation(selected);
    navigation.navigate('TimetableSetup');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor, paddingTop: insets.top, paddingBottom: insets.bottom + 24 }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.stepLabel, { color: theme.textSecondary }]}>
          Step 7/10
        </Text>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          직업을 알려주세요
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          생활 패턴에 맞는 습관을 추천해 드려요
        </Text>
      </View>

      <ProgressBar current={7} total={10} />

      {/* Occupation Cards */}
      <View style={styles.cardsContainer}>
        {OCCUPATION_OPTIONS.map((option) => {
          const isSelected = selected === option.type;
          return (
            <TouchableOpacity
              key={option.type}
              style={[
                styles.card,
                isSelected && {
                  backgroundColor: theme.primaryColor + '10',
                  borderColor: theme.primaryColor,
                },
              ]}
              onPress={() => setSelected(option.type)}
              activeOpacity={0.7}>
              <Text style={styles.cardEmoji}>{option.emoji}</Text>
              <View style={styles.cardTextWrapper}>
                <Text
                  style={[
                    styles.cardLabel,
                    {
                      color: isSelected
                        ? theme.primaryColor
                        : theme.textPrimary,
                    },
                  ]}>
                  {option.label}
                </Text>
                <Text
                  style={[styles.cardDesc, { color: theme.textSecondary }]}>
                  {option.description}
                </Text>
              </View>
              {isSelected && (
                <View
                  style={[
                    styles.checkCircle,
                    { backgroundColor: theme.primaryColor },
                  ]}>
                  <Text style={styles.checkMark}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
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
  cardsContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardEmoji: {
    fontSize: 40,
    marginRight: 16,
  },
  cardTextWrapper: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    paddingHorizontal: 24,
  },
  button: {
    width: '100%',
  },
});
