import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../types/navigation';
import { ProgressBar } from '../../components/common/ProgressBar';
import { GradientButton } from '../../components/common/GradientButton';
import { useAppStore } from '../../store';
import { themes } from '../../theme/themes';
import {
  recommendTemplates,
  HABIT_CATEGORY_INFO,
} from '../../data/habitTemplates';
import type {
  HabitTemplateItem,
  HabitTemplateCategory,
} from '../../types/habit';

type Props = NativeStackScreenProps<
  OnboardingStackParamList,
  'HabitRecommendation'
>;

const CATEGORY_ORDER: HabitTemplateCategory[] = [
  'morningRitual',
  'commute',
  'productivity',
  'learning',
  'health',
  'relationship',
  'mindset',
  'finance',
  'evening',
  'periodic',
];

export function HabitRecommendationStep({ navigation }: Props) {
  const themeId = useAppStore((s) => s.selectedTheme);
  const theme = themes[themeId];
  const selectedHashtags = useAppStore((s) => s.selectedHashtags);
  const addHabit = useAppStore((s) => s.addHabit);

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [activeCategory, setActiveCategory] =
    useState<HabitTemplateCategory>('morningRitual');

  // Get recommendations based on user tags
  const recommended = useMemo(() => {
    const userTags = new Set(selectedHashtags);
    return recommendTemplates(userTags, 30);
  }, [selectedHashtags]);

  const recommendedIds = useMemo(
    () => new Set(recommended.map((t) => t.id)),
    [recommended],
  );

  // Group by category for browsing
  const categoryTemplates = useMemo(() => {
    const result: Partial<Record<HabitTemplateCategory, HabitTemplateItem[]>> = {};
    for (const template of recommended) {
      if (!result[template.category]) {
        result[template.category] = [];
      }
      result[template.category]!.push(template);
    }
    return result;
  }, [recommended]);

  // Filter categories that have recommendations
  const availableCategories = useMemo(
    () => CATEGORY_ORDER.filter((cat) => categoryTemplates[cat]?.length),
    [categoryTemplates],
  );

  const currentTemplates = categoryTemplates[activeCategory] ?? [];

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
    navigation.navigate('Completion');
  }, [selectedIds, recommended, addHabit, navigation]);

  const selectedCount = selectedIds.size;

  return (
    <View
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.stepLabel, { color: theme.textSecondary }]}>
          Step 9 / 10
        </Text>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          습관을 선택하세요
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          성격 분석 결과에 맞춰 추천된 습관이에요{'\n'}
          나중에 자유롭게 추가/삭제할 수 있어요
        </Text>
      </View>

      <ProgressBar current={9} total={10} showLabel={false} />

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContent}>
        {availableCategories.map((cat) => {
          const info = HABIT_CATEGORY_INFO[cat];
          const isActive = cat === activeCategory;
          return (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                isActive && {
                  backgroundColor: theme.primaryColor + '15',
                  borderColor: theme.primaryColor,
                },
              ]}
              onPress={() => setActiveCategory(cat)}
              activeOpacity={0.7}>
              <Text style={styles.categoryEmoji}>{info.emoji}</Text>
              <Text
                style={[
                  styles.categoryLabel,
                  isActive && {
                    color: theme.primaryColor,
                    fontWeight: '700',
                  },
                ]}>
                {info.label}
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
        {currentTemplates.map((template) => {
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
                <Text style={styles.templateEmoji}>{template.emoji}</Text>
                <View style={styles.templateInfo}>
                  <Text
                    style={[
                      styles.templateTitle,
                      { color: theme.textPrimary },
                    ]}>
                    {template.title}
                  </Text>
                  <View style={styles.templateMeta}>
                    <Text
                      style={[
                        styles.metaText,
                        { color: theme.textSecondary },
                      ]}>
                      {template.estimatedMinutes}분
                    </Text>
                    <Text
                      style={[
                        styles.metaDot,
                        { color: theme.textSecondary },
                      ]}>
                      ·
                    </Text>
                    <Text
                      style={[
                        styles.metaText,
                        { color: theme.textSecondary },
                      ]}>
                      {'⭐'.repeat(template.difficulty)}
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.checkbox,
                    isSelected && {
                      backgroundColor: theme.primaryColor,
                      borderColor: theme.primaryColor,
                    },
                  ]}>
                  {isSelected && (
                    <Text style={styles.checkIcon}>✓</Text>
                  )}
                </View>
              </View>

              {/* Tags */}
              <View style={styles.tagsRow}>
                {template.strengthenTags.map((tag) => (
                  <View
                    key={tag}
                    style={[
                      styles.tagChip,
                      { backgroundColor: theme.primaryColor + '10' },
                    ]}>
                    <Text
                      style={[
                        styles.tagText,
                        { color: theme.primaryColor },
                      ]}>
                      {tag}
                    </Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={[styles.selectedCount, { color: theme.textSecondary }]}>
          {selectedCount}개 선택됨
        </Text>
        <GradientButton
          title={selectedCount > 0 ? '습관 시작하기' : '건너뛰기'}
          onPress={handleComplete}
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
  categoryScroll: {
    maxHeight: 48,
    marginTop: 12,
  },
  categoryContent: {
    paddingHorizontal: 24,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    gap: 4,
  },
  categoryEmoji: {
    fontSize: 14,
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  listScroll: {
    flex: 1,
    marginTop: 12,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 10,
  },
  templateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  templateRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginBottom: 4,
  },
  templateMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
  },
  metaDot: {
    fontSize: 12,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  checkIcon: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 10,
  },
  tagChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  selectedCount: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 10,
  },
  button: {
    width: '100%',
  },
});
