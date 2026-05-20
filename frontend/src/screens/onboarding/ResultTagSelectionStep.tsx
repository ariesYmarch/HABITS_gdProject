import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../types/navigation';
import { useAppStore } from '../../store';
import { themes } from '../../theme/themes';
import { findPersonalityType } from '../../data/personalityTypes';
import { ProgressBar } from '../../components/common/ProgressBar';
import { GradientButton } from '../../components/common/GradientButton';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'ResultTagSelection'>;

export function ResultTagSelectionStep({ navigation }: Props) {
  const themeId = useAppStore((s) => s.selectedTheme);
  const theme = themes[themeId];
  const personalityTypeId = useAppStore((s) => s.personalityTypeId);
  const idealPersonalityTypeId = useAppStore((s) => s.idealPersonalityTypeId);
  const setSelectedHashtags = useAppStore((s) => s.setSelectedHashtags);

  const insets = useSafeAreaInsets();
  const currentType = personalityTypeId
    ? findPersonalityType(personalityTypeId)
    : undefined;
  const idealType = idealPersonalityTypeId
    ? findPersonalityType(idealPersonalityTypeId)
    : undefined;

  // Combine hashtags from both personality types
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    if (currentType) {
      currentType.hashtags.forEach((t) => tags.add(t));
    }
    if (idealType) {
      idealType.hashtags.forEach((t) => tags.add(t));
    }
    return Array.from(tags);
  }, [currentType, idealType]);

  // Pre-select first few tags
  const initialTags = useMemo(() => {
    return availableTags.slice(0, Math.min(availableTags.length, 2));
  }, [availableTags]);

  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);

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
    <View style={[styles.container, { backgroundColor: theme.backgroundColor, paddingTop: insets.top, paddingBottom: insets.bottom + 24 }]}>
      <ProgressBar current={6} total={10} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Title — Swift: "테스트 결과 🎉" */}
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          테스트 결과 {'\uD83C\uDF89'}
        </Text>

        {/* 지금의 나 Card */}
        <View style={styles.resultCard}>
          <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>
            지금의 나
          </Text>
          <View style={styles.cardHeader}>
            {currentType && (
              <>
                <Text style={styles.cardEmoji}>{currentType.emoji}</Text>
                <Text style={[styles.cardName, { color: theme.textPrimary }]}>
                  {currentType.nameKR}
                </Text>
              </>
            )}
          </View>
          {currentType && (
            <Text style={[styles.cardDesc, { color: theme.textSecondary }]}>
              {currentType.description}
            </Text>
          )}
          {currentType && (
            <View style={styles.cardTags}>
              {currentType.hashtags.map((tag) => (
                <View
                  key={tag}
                  style={[styles.tagBubble, { backgroundColor: theme.primaryColor + '18' }]}>
                  <Text style={[styles.tagBubbleText, { color: theme.primaryColor }]}>
                    {tag}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* 되고 싶은 나 Card */}
        <View style={styles.resultCard}>
          <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>
            되고 싶은 나
          </Text>
          <View style={styles.cardHeader}>
            {idealType && (
              <>
                <Text style={styles.cardEmoji}>{idealType.emoji}</Text>
                <Text style={[styles.cardName, { color: theme.textPrimary }]}>
                  {idealType.nameKR}
                </Text>
              </>
            )}
          </View>
          {idealType && (
            <Text style={[styles.cardDesc, { color: theme.textSecondary }]}>
              {idealType.description}
            </Text>
          )}
          {idealType && (
            <View style={styles.cardTags}>
              {idealType.hashtags.map((tag) => (
                <View
                  key={tag}
                  style={[styles.tagBubble, { backgroundColor: theme.primaryColor + '18' }]}>
                  <Text style={[styles.tagBubbleText, { color: theme.primaryColor }]}>
                    {tag}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Tag Selection Section */}
        <View style={styles.tagSection}>
          <View style={styles.tagSectionHeader}>
            <Text style={[styles.tagSectionTitle, { color: theme.textPrimary }]}>
              나를 표현하는 태그 선택
            </Text>
            <Text style={[styles.tagCount, { color: theme.textSecondary }]}>
              {selectedTags.length}/6
            </Text>
          </View>
          <Text style={[styles.tagSectionDesc, { color: theme.textSecondary }]}>
            최소 2개, 최대 6개를 선택해주세요
          </Text>

          <View style={styles.tagGrid}>
            {availableTags.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <TouchableOpacity
                  key={tag}
                  style={[
                    styles.selectableTag,
                    isSelected && {
                      backgroundColor: theme.primaryColor + '20',
                      borderColor: theme.primaryColor,
                    },
                  ]}
                  onPress={() => handleToggleTag(tag)}
                  activeOpacity={0.7}>
                  <Text
                    style={[
                      styles.selectableTagText,
                      {
                        color: isSelected ? theme.primaryColor : theme.textPrimary,
                        fontWeight: isSelected ? '700' : '500',
                      },
                    ]}>
                    {tag}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 20,
  },
  resultCard: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardEmoji: {
    fontSize: 36,
    marginRight: 12,
  },
  cardName: {
    fontSize: 20,
    fontWeight: '700',
  },
  cardDesc: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 12,
  },
  cardTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagBubble: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  tagBubbleText: {
    fontSize: 13,
    fontWeight: '500',
  },
  tagSection: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  tagSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  tagSectionTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  tagCount: {
    fontSize: 14,
    fontWeight: '500',
  },
  tagSectionDesc: {
    fontSize: 13,
    marginBottom: 16,
  },
  tagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectableTag: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  selectableTagText: {
    fontSize: 14,
  },
  footer: {
    paddingHorizontal: 24,
  },
  button: {
    width: '100%',
  },
});
