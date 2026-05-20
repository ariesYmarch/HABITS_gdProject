import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../types/navigation';
import { ProgressBar } from '../../components/common/ProgressBar';
import { GradientButton } from '../../components/common/GradientButton';
import { useAppStore } from '../../store';
import { themes } from '../../theme/themes';
import {
  recommendTemplates,
} from '../../data/habitTemplates';
import type {
  HabitTemplateItem,
} from '../../types/habit';

type Props = NativeStackScreenProps<
  OnboardingStackParamList,
  'HabitRecommendation'
>;

// Swift-matching time period categories
const TIME_PERIODS = [
  { id: 'morning', emoji: '\uD83C\uDF05', label: '아침' },
  { id: 'commute', emoji: '\uD83D\uDE89', label: '통근' },
  { id: 'lunch', emoji: '\uD83C\uDF7D\uFE0F', label: '점심' },
  { id: 'afternoon', emoji: '\u2600\uFE0F', label: '오후' },
  { id: 'evening', emoji: '\uD83C\uDF06', label: '저녁' },
  { id: 'bedtime', emoji: '\uD83C\uDF19', label: '취침 전' },
];

// Map time periods to habit template categories
const TIME_TO_CATEGORIES: Record<string, string[]> = {
  morning: ['morningRitual', 'health'],
  commute: ['commute', 'learning'],
  lunch: ['relationship', 'mindset'],
  afternoon: ['productivity', 'learning'],
  evening: ['evening', 'relationship'],
  bedtime: ['evening', 'mindset', 'health'],
};

export function HabitRecommendationStep({ navigation }: Props) {
  const themeId = useAppStore((s) => s.selectedTheme);
  const theme = themes[themeId];
  const insets = useSafeAreaInsets();
  const userName = useAppStore((s) => s.userName);
  const selectedHashtags = useAppStore((s) => s.selectedHashtags);
  const addHabit = useAppStore((s) => s.addHabit);
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);

  const [activeTimePeriod, setActiveTimePeriod] = useState('morning');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [showCompletion, setShowCompletion] = useState(false);

  // Completion animation values
  const emojiScale = useSharedValue(0);
  const textOpacity = useSharedValue(0);

  // Get recommendations
  const recommended = useMemo(() => {
    const userTags = new Set(selectedHashtags);
    return recommendTemplates(userTags, 50);
  }, [selectedHashtags]);

  // Filter by time period
  const filteredTemplates = useMemo(() => {
    const cats = TIME_TO_CATEGORIES[activeTimePeriod] || [];
    return recommended.filter((t) => cats.includes(t.category));
  }, [recommended, activeTimePeriod]);

  const handleToggle = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleComplete = useCallback(() => {
    // Add selected templates as habits
    for (const template of recommended) {
      if (selectedIds.has(template.id)) {
        addHabit({
          title: template.title,
          emoji: template.emoji,
          hashtags: template.strengthenTags,
          frequency: 'daily',
          timeSlot: 'anytime',
          duration: template.estimatedMinutes,
        });
      }
    }

    // Show completion overlay
    setShowCompletion(true);
    emojiScale.value = withSequence(
      withSpring(1.3, { damping: 6, stiffness: 180 }),
      withSpring(1, { damping: 10, stiffness: 120 }),
    );
    textOpacity.value = withDelay(200, withTiming(1, { duration: 300 }));
  }, [selectedIds, recommended, addHabit, emojiScale, textOpacity]);

  const emojiStyle = useAnimatedStyle(() => ({
    transform: [{ scale: emojiScale.value }],
  }));
  const textStyle = useAnimatedStyle(() => ({ opacity: textOpacity.value }));

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor, paddingTop: insets.top, paddingBottom: insets.bottom + 24 }]}>
      <ProgressBar current={9} total={10} />

      {/* Header — Swift: "{userName}님을 위한 습관 🔑" */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          {userName}님을 위한 습관 {'\uD83D\uDD11'}
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          시간대를 선택해서 습관을 추천받으세요
        </Text>
      </View>

      {/* Time Period Buttons — Swift style circular buttons */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.timePeriodScroll}
        contentContainerStyle={styles.timePeriodContent}>
        {TIME_PERIODS.map((period) => {
          const isActive = period.id === activeTimePeriod;
          return (
            <TouchableOpacity
              key={period.id}
              style={styles.timePeriodItem}
              onPress={() => setActiveTimePeriod(period.id)}
              activeOpacity={0.7}>
              <View
                style={[
                  styles.timePeriodCircle,
                  isActive && {
                    backgroundColor: theme.primaryColor + '20',
                    borderColor: theme.primaryColor,
                  },
                ]}>
                <Text style={styles.timePeriodEmoji}>{period.emoji}</Text>
              </View>
              <Text
                style={[
                  styles.timePeriodLabel,
                  {
                    color: isActive ? theme.primaryColor : theme.textSecondary,
                    fontWeight: isActive ? '700' : '400',
                  },
                ]}>
                {period.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Template List */}
      <ScrollView
        style={styles.listScroll}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}>
        {filteredTemplates.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              이 시간대에 맞는 추천 습관이 없어요
            </Text>
          </View>
        ) : (
          filteredTemplates.map((template) => {
            const isSelected = selectedIds.has(template.id);
            return (
              <TouchableOpacity
                key={template.id}
                style={[
                  styles.templateCard,
                  isSelected && {
                    backgroundColor: theme.primaryColor + '08',
                    borderColor: theme.primaryColor,
                  },
                ]}
                onPress={() => handleToggle(template.id)}
                activeOpacity={0.7}>
                <View style={styles.templateRow}>
                  <View
                    style={[
                      styles.checkbox,
                      isSelected && {
                        backgroundColor: theme.primaryColor,
                        borderColor: theme.primaryColor,
                      },
                    ]}>
                    {isSelected && (
                      <Text style={styles.checkIcon}>{'\u2713'}</Text>
                    )}
                  </View>
                  <Text style={styles.templateEmoji}>{template.emoji}</Text>
                  <View style={styles.templateInfo}>
                    <Text
                      style={[
                        styles.templateTitle,
                        { color: theme.textPrimary },
                      ]}>
                      {template.title}
                    </Text>
                    <Text
                      style={[
                        styles.templateDuration,
                        { color: theme.textSecondary },
                      ]}>
                      {template.estimatedMinutes}분
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <GradientButton
          title={selectedIds.size > 0 ? '시작하기' : '건너뛰기'}
          onPress={handleComplete}
          style={styles.button}
        />
      </View>

      {/* Completion Overlay — Swift style "준비 완료!" */}
      {showCompletion && (
        <View style={styles.overlay}>
          <View style={[styles.overlayCard, { backgroundColor: theme.backgroundColor }]}>
            <Animated.Text style={[styles.celebrationEmoji, emojiStyle]}>
              {'\uD83C\uDF89'}
            </Animated.Text>
            <Animated.View style={textStyle}>
              <Text style={[styles.completionTitle, { color: theme.primaryColor }]}>
                준비 완료!
              </Text>
              <Text style={[styles.completionSubtitle, { color: theme.textSecondary }]}>
                {userName}님의 HABITS 여정이 시작됩니다
              </Text>
            </Animated.View>
            <GradientButton
              title="시작하기"
              onPress={completeOnboarding}
              style={styles.overlayButton}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 12,
    alignItems: 'center',
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
  timePeriodScroll: {
    maxHeight: 100,
    marginTop: 16,
  },
  timePeriodContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  timePeriodItem: {
    alignItems: 'center',
    width: 64,
  },
  timePeriodCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: 6,
  },
  timePeriodEmoji: {
    fontSize: 24,
  },
  timePeriodLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  listScroll: {
    flex: 1,
    marginTop: 8,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 8,
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
  templateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    padding: 16,
  },
  templateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkIcon: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  templateEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  templateInfo: {
    flex: 1,
  },
  templateTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  templateDuration: {
    fontSize: 12,
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 24,
  },
  button: {
    width: '100%',
  },
  // Completion overlay
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    zIndex: 100,
  },
  overlayCard: {
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  celebrationEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  completionTitle: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  completionSubtitle: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 28,
  },
  overlayButton: {
    width: '100%',
  },
});
