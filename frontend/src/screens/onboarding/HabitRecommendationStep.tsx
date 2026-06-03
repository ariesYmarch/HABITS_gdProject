import React, { useState, useMemo, useCallback, useEffect } from 'react';
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
  TimeSlot,
} from '../../types/habit';
import {
  getPersonalizedRecommendations,
  type PersonalizedRecommendation,
} from '../../services/habitRecommendation';
import { ActivityIndicator } from 'react-native';
import { Sunrise, Train, Utensils, Sun, Sunset, Moon } from 'lucide-react-native';

type _LucideIcon = React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;

type Props = NativeStackScreenProps<
  OnboardingStackParamList,
  'HabitRecommendation'
>;

// 시간대별 픽토그램 (lucide-react-native)
const TIME_PERIODS: { id: string; Icon: _LucideIcon; label: string }[] = [
  { id: 'morning', Icon: Sunrise, label: '아침' },
  { id: 'commute', Icon: Train, label: '통근' },
  { id: 'lunch', Icon: Utensils, label: '점심' },
  { id: 'afternoon', Icon: Sun, label: '오후' },
  { id: 'evening', Icon: Sunset, label: '저녁' },
  { id: 'bedtime', Icon: Moon, label: '취침 전' },
];

// 사용자가 입력한 일정 블록 타입(TimetableSlotType) → 어울리는 습관의 category/contexts
const SLOT_TO_HABIT: Record<string, { categories: string[]; contexts: string[] }> = {
  sleep:   { categories: ['evening'],
             contexts: ['beforeBed', 'evening'] },
  commute: { categories: ['commute'],
             contexts: ['commute', 'beforeOut'] },
  work:    { categories: ['productivity', 'learning'],
             contexts: ['work', 'study'] },
  meal:    { categories: [],
             contexts: ['meal', 'lunch'] },
  free:    { categories: ['mindset', 'health', 'relationship', 'morningRitual'],
             contexts: ['leisure', 'hobby', 'rest', 'morning', 'evening', 'exercise'] },
};

/** timetableData 7x24 그리드에서 슬롯별 블록 수 집계 */
function countBlocksBySlot(grid: any[][]): Record<string, number> {
  const counts: Record<string, number> = { sleep: 0, commute: 0, work: 0, meal: 0, free: 0 };
  if (!Array.isArray(grid)) return counts;
  for (const day of grid) {
    if (!Array.isArray(day)) continue;
    for (const cell of day) {
      if (cell && typeof cell === 'string' && cell in counts) counts[cell]++;
    }
  }
  return counts;
}

/** 슬롯 블록 수 + 해시태그 겹침으로 후보 사전 정렬.
 *  - 슬롯 가중치: 블록 수 많은 순으로 4·3·2·1·0점 (블록 0개는 가중 0)
 *  - 후보의 category/contexts가 슬롯 매핑과 겹치는 만큼 점수 합산
 *  - 해시태그 겹침은 매칭 1개당 +2점
 */
function rankCandidatesByTimetable(
  templates: HabitTemplateItem[],
  slotCounts: Record<string, number>,
  selectedHashtags: string[],
): HabitTemplateItem[] {
  const sortedSlots = Object.entries(slotCounts).sort((a, b) => b[1] - a[1]);
  const slotWeight: Record<string, number> = {};
  sortedSlots.forEach(([slot, count], idx) => {
    slotWeight[slot] = count === 0 ? 0 : Math.max(0, 4 - idx);
  });
  const userTagSet = new Set(selectedHashtags);
  const scored = templates.map((t) => {
    let slotScore = 0;
    for (const slot of Object.keys(slotWeight)) {
      const mapping = SLOT_TO_HABIT[slot];
      if (!mapping || slotWeight[slot] === 0) continue;
      const catMatch = mapping.categories.includes(t.category);
      const ctxMatch = mapping.contexts.some((ctx) =>
        (t.contexts || []).includes(ctx as any),
      );
      if (catMatch || ctxMatch) slotScore += slotWeight[slot];
    }
    const tagOverlap = (t.strengthenTags || []).filter((tag) => userTagSet.has(tag)).length;
    return { t, score: slotScore + tagOverlap * 2 };
  });
  return scored.sort((a, b) => b.score - a.score).map((s) => s.t);
}

export function HabitRecommendationStep({ navigation }: Props) {
  const themeId = useAppStore((s) => s.selectedTheme);
  const theme = themes[themeId];
  const insets = useSafeAreaInsets();
  const userName = useAppStore((s) => s.userName);
  const selectedHashtags = useAppStore((s) => s.selectedHashtags);
  const occupation = useAppStore((s) => s.occupation);
  const schedule = useAppStore((s) => s.schedule);
  const timetableData = useAppStore((s) => s.timetableData);
  const addHabit = useAppStore((s) => s.addHabit);
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);

  const [activeTimePeriod, setActiveTimePeriod] = useState<TimeSlot>('morning');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [showCompletion, setShowCompletion] = useState(false);
  const [loading, setLoading] = useState(true);
  const [geminiRecs, setGeminiRecs] = useState<PersonalizedRecommendation[]>([]);

  // Completion animation values
  const emojiScale = useSharedValue(0);
  const textOpacity = useSharedValue(0);

  // 후보 풀: 해시태그 1차 선별 → 일정 블록 수 + 태그 겹침으로 사전 정렬
  const candidatePool = useMemo(() => {
    const userTags = new Set(selectedHashtags);
    // 1차: 해시태그 매칭으로 50개 추림
    const tagFiltered = recommendTemplates(userTags, 50);
    // 2차: 사용자가 시간표에 입력한 슬롯별 블록 수 + 해시태그 겹침으로 정렬
    const slotCounts = countBlocksBySlot(timetableData);
    const ranked = rankCandidatesByTimetable(tagFiltered, slotCounts, selectedHashtags);
    return ranked.slice(0, 30);
  }, [selectedHashtags, timetableData]);

  // 마운트 시 Gemini 호출 — 일정 기반 추천 + time_slot 자동 매핑
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const candidates = candidatePool.map((t) => ({
        id: t.id,
        title: t.title,
        emoji: t.emoji,
        category: t.category,
        estimated_minutes: t.estimatedMinutes,
        strengthen_tags: t.strengthenTags,
      }));
      const recs = await getPersonalizedRecommendations(
        {
          wake_up_time: schedule.wakeUpTime,
          bed_time: schedule.bedTime,
          lunch_start_time: schedule.lunchStartTime,
          lunch_end_time: schedule.lunchEndTime,
          has_commute: schedule.hasCommute,
          commute_start_time: schedule.commuteStartTime,
          commute_end_time: schedule.commuteEndTime,
          work_start_time: schedule.workStartTime,
          work_end_time: schedule.workEndTime,
          // 사용자가 직접 채운 7×24 일주일 그리드
          weekly_timetable: timetableData,
        },
        occupation,
        selectedHashtags,
        candidates,
        10,
      );
      if (!cancelled) {
        // Gemini 실패해도 candidatePool로 fallback
        if (recs.length > 0) {
          setGeminiRecs(recs);
        } else {
          setGeminiRecs(
            candidatePool.slice(0, 8).map((t) => ({
              template_id: t.id,
              title: t.title,
              emoji: t.emoji,
              duration: t.estimatedMinutes,
              strengthen_tags: t.strengthenTags,
              time_slot: 'anytime' as TimeSlot,
              reason: '',
            })),
          );
        }
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // time_slot 기준 필터
  const filteredRecs = useMemo(() => {
    // anytime은 모든 탭에 보여줘서 사용자가 발견할 수 있게
    return geminiRecs.filter(
      (r) => r.time_slot === activeTimePeriod || r.time_slot === 'anytime',
    );
  }, [geminiRecs, activeTimePeriod]);

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
    // Gemini가 배정한 time_slot 그대로 저장
    for (const rec of geminiRecs) {
      if (selectedIds.has(rec.template_id)) {
        addHabit({
          title: rec.title,
          emoji: rec.emoji,
          hashtags: rec.strengthen_tags,
          frequency: 'daily',
          timeSlot: rec.time_slot,
          duration: rec.duration,
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
  }, [selectedIds, geminiRecs, addHabit, emojiScale, textOpacity]);

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
          const Icon = period.Icon;
          return (
            <TouchableOpacity
              key={period.id}
              style={styles.timePeriodItem}
              onPress={() => setActiveTimePeriod(period.id as TimeSlot)}
              activeOpacity={0.7}>
              <View
                style={[
                  styles.timePeriodCircle,
                  isActive && {
                    backgroundColor: theme.primaryColor + '20',
                    borderColor: theme.primaryColor,
                  },
                ]}>
                <Icon
                  size={26}
                  color={isActive ? theme.primaryColor : theme.textSecondary}
                  strokeWidth={1.8}
                />
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
        {loading ? (
          <View style={styles.emptyState}>
            <ActivityIndicator size="large" color={theme.primaryColor} />
            <Text style={[styles.emptyText, { color: theme.textSecondary, marginTop: 16 }]}>
              일정에 맞는 습관을 분석하고 있어요…
            </Text>
          </View>
        ) : filteredRecs.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              이 시간대에 맞는 추천 습관이 없어요
            </Text>
          </View>
        ) : (
          filteredRecs.map((rec) => {
            const isSelected = selectedIds.has(rec.template_id);
            return (
              <TouchableOpacity
                key={rec.template_id}
                style={[
                  styles.templateCard,
                  isSelected && {
                    backgroundColor: theme.primaryColor + '08',
                    borderColor: theme.primaryColor,
                  },
                ]}
                onPress={() => handleToggle(rec.template_id)}
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
                      <Text style={styles.checkIcon}>{'✓'}</Text>
                    )}
                  </View>
                  <Text style={styles.templateEmoji}>{rec.emoji}</Text>
                  <View style={styles.templateInfo}>
                    <Text
                      style={[
                        styles.templateTitle,
                        { color: theme.textPrimary },
                      ]}>
                      {rec.title}
                    </Text>
                    <Text
                      style={[
                        styles.templateDuration,
                        { color: theme.textSecondary },
                      ]}>
                      {rec.duration}분{rec.reason ? ' · ' + rec.reason : ''}
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
