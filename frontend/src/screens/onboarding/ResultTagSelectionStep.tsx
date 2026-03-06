import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../types/navigation';
import { useAppStore } from '../../store';
import { themes } from '../../theme/themes';
import { findPersonalityType, allHashtags, hashtagsByCategory } from '../../data/personalityTypes';
import { ProgressBar } from '../../components/common/ProgressBar';
import { GradientButton } from '../../components/common/GradientButton';
import { PersonalityResultCard } from '../../components/personality/PersonalityResultCard';
import { HashtagSelector } from '../../components/personality/HashtagSelector';
import type { HashtagCategory } from '../../types/personality';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'ResultTagSelection'>;

const CATEGORY_TAB_LABELS: Record<HashtagCategory, string> = {
  attitude: '태도',
  emotion: '정서',
  relationship: '관계',
  value: '가치관',
};

const CATEGORY_ORDER: HashtagCategory[] = [
  'attitude',
  'emotion',
  'relationship',
  'value',
];

export function ResultTagSelectionStep({ navigation }: Props) {
  const themeId = useAppStore((s) => s.selectedTheme);
  const theme = themes[themeId];
  const personalityTypeId = useAppStore((s) => s.personalityTypeId);
  const idealPersonalityTypeId = useAppStore((s) => s.idealPersonalityTypeId);
  const setSelectedHashtags = useAppStore((s) => s.setSelectedHashtags);

  const currentType = personalityTypeId
    ? findPersonalityType(personalityTypeId)
    : undefined;
  const idealType = idealPersonalityTypeId
    ? findPersonalityType(idealPersonalityTypeId)
    : undefined;

  // Pre-select tags from both personality types
  const initialTags = useMemo(() => {
    const tags = new Set<string>();
    if (currentType) {
      currentType.hashtags.forEach((t) => tags.add(t));
    }
    if (idealType) {
      idealType.hashtags.forEach((t) => tags.add(t));
    }
    // Limit to max 6
    return Array.from(tags).slice(0, 6);
  }, [currentType, idealType]);

  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);
  const [activeCategory, setActiveCategory] = useState<HashtagCategory>('attitude');

  const grouped = useMemo(() => hashtagsByCategory(), []);

  const currentCategoryTags = useMemo(
    () => grouped[activeCategory].map((h) => h.tag),
    [grouped, activeCategory],
  );

  const handleToggleTag = useCallback(
    (tag: string) => {
      setSelectedTags((prev) => {
        if (prev.includes(tag)) {
          return prev.filter((t) => t !== tag);
        }
        if (prev.length >= 6) return prev;
        return [...prev, tag];
      });
    },
    [],
  );

  const isValid = selectedTags.length >= 2;

  const handleNext = useCallback(() => {
    setSelectedHashtags(selectedTags);
    navigation.navigate('Occupation');
  }, [selectedTags, setSelectedHashtags, navigation]);

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.stepLabel, { color: theme.textSecondary }]}>
          Step 6 / 10
        </Text>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          결과 & 태그 선택
        </Text>
      </View>

      <ProgressBar current={6} total={10} showLabel={false} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Personality Type Cards (side by side) */}
        <View style={styles.cardsRow}>
          <PersonalityResultCard
            label="현재의 나"
            personalityType={currentType}
            compact
          />
          <PersonalityResultCard
            label="이상적인 나"
            personalityType={idealType}
            compact
          />
        </View>

        {/* Tag Selection Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            나를 표현하는 태그를 선택하세요
          </Text>
          <Text style={[styles.sectionDesc, { color: theme.textSecondary }]}>
            성격 분석 결과를 바탕으로 추천 태그가 선택되어 있어요.{'\n'}
            자유롭게 수정할 수 있습니다. (2~6개)
          </Text>

          {/* Category Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryTabs}
            contentContainerStyle={styles.categoryTabsContent}>
            {CATEGORY_ORDER.map((cat) => {
              const isActive = cat === activeCategory;
              return (
                <View key={cat}>
                  <Text
                    style={[
                      styles.categoryTab,
                      isActive && {
                        color: theme.primaryColor,
                        fontWeight: '700',
                        borderBottomWidth: 2,
                        borderBottomColor: theme.primaryColor,
                      },
                    ]}
                    onPress={() => setActiveCategory(cat)}>
                    {CATEGORY_TAB_LABELS[cat]}
                  </Text>
                </View>
              );
            })}
          </ScrollView>

          {/* Hashtag Selector */}
          <HashtagSelector
            hashtags={currentCategoryTags}
            selectedTags={selectedTags}
            onToggleTag={handleToggleTag}
            minSelection={2}
            maxSelection={6}
          />
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={styles.footer}>
        <GradientButton
          title="다음"
          onPress={handleNext}
          disabled={!isValid}
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
    marginBottom: 4,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    marginBottom: 28,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  sectionDesc: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 16,
  },
  categoryTabs: {
    marginBottom: 12,
  },
  categoryTabsContent: {
    gap: 20,
    paddingRight: 16,
  },
  categoryTab: {
    fontSize: 15,
    fontWeight: '500',
    color: '#9CA3AF',
    paddingBottom: 8,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  button: {
    width: '100%',
  },
});
