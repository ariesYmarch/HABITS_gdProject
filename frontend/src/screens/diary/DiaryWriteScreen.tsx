import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useAppStore } from '../../store';
import { themes } from '../../theme/themes';
import { MoodSlider } from '../../components/diary/MoodSlider';
import { EmotionTagSelector } from '../../components/diary/EmotionTagSelector';
import { GradientButton } from '../../components/common/GradientButton';
import type { DiaryEntry } from '../../types/diary';

type HabitSatisfaction = 'satisfied' | 'neutral' | 'unsatisfied';

interface SatisfactionOption {
  type: HabitSatisfaction;
  emoji: string;
  label: string;
}

const SATISFACTION_OPTIONS: SatisfactionOption[] = [
  { type: 'satisfied', emoji: '😊', label: '만족' },
  { type: 'neutral', emoji: '😐', label: '보통' },
  { type: 'unsatisfied', emoji: '😔', label: '불만족' },
];

function formatDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDateDisplay(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const weekday = weekdays[d.getDay()];
  return `${year}년 ${month}월 ${day}일 (${weekday})`;
}

export function DiaryWriteScreen() {
  const themeId = useAppStore((s) => s.selectedTheme);
  const theme = themes[themeId];
  const addDiaryEntry = useAppStore((s) => s.addDiaryEntry);
  const diaryEntries = useAppStore((s) => s.diaryEntries);

  const todayStr = formatDateString(new Date());

  // Check if today's diary already exists
  const existingEntry = diaryEntries.find((e) => e.date === todayStr);

  const [moodScore, setMoodScore] = useState(existingEntry?.moodScore ?? 0);
  const [emotionTags, setEmotionTags] = useState<string[]>(
    existingEntry?.emotionTags ?? [],
  );
  const [textContent, setTextContent] = useState(
    existingEntry?.textContent ?? '',
  );
  const [habitSatisfaction, setHabitSatisfaction] =
    useState<HabitSatisfaction | null>(
      existingEntry?.habitSatisfaction ?? null,
    );
  const [isSaved, setIsSaved] = useState(!!existingEntry);

  const handleToggleTag = useCallback((tag: string) => {
    setEmotionTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
    setIsSaved(false);
  }, []);

  const handleMoodChange = useCallback((value: number) => {
    setMoodScore(value);
    setIsSaved(false);
  }, []);

  const handleSave = useCallback(() => {
    if (emotionTags.length === 0) {
      Alert.alert('감정 선택', '오늘의 감정을 하나 이상 선택해주세요.');
      return;
    }

    const entry: Omit<DiaryEntry, 'id'> = {
      date: todayStr,
      moodScore,
      emotionTags,
      textContent: textContent.trim() || undefined,
      habitSatisfaction: habitSatisfaction ?? undefined,
    };

    addDiaryEntry(entry);
    setIsSaved(true);
    Alert.alert('저장 완료', '오늘의 일기가 저장되었어요! ✨');
  }, [
    todayStr,
    moodScore,
    emotionTags,
    textContent,
    habitSatisfaction,
    addDiaryEntry,
  ]);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.backgroundColor }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.textPrimary }]}>
              오늘의 일기
            </Text>
            <Text style={[styles.dateLabel, { color: theme.textSecondary }]}>
              {formatDateDisplay(todayStr)}
            </Text>
          </View>

          {/* Section 1: Mood Score */}
          <View
            style={[
              styles.section,
              { backgroundColor: theme.cardBackgroundColor },
            ]}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              오늘의 기분
            </Text>
            <Text
              style={[styles.sectionDesc, { color: theme.textSecondary }]}>
              슬라이더를 움직여 오늘의 기분을 표현해보세요
            </Text>
            <MoodSlider value={moodScore} onValueChange={handleMoodChange} />
          </View>

          {/* Section 2: Emotion Tags */}
          <View
            style={[
              styles.section,
              { backgroundColor: theme.cardBackgroundColor },
            ]}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              감정 태그
            </Text>
            <EmotionTagSelector
              selectedTags={emotionTags}
              onToggleTag={handleToggleTag}
            />
          </View>

          {/* Section 3: Text Content */}
          <View
            style={[
              styles.section,
              { backgroundColor: theme.cardBackgroundColor },
            ]}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              오늘 하루 메모
            </Text>
            <Text
              style={[styles.sectionDesc, { color: theme.textSecondary }]}>
              자유롭게 오늘의 생각을 적어보세요
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  color: theme.textPrimary,
                  borderColor: '#E5E7EB',
                },
              ]}
              placeholder="오늘 하루는 어땠나요?"
              placeholderTextColor={theme.textSecondary + '80'}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              value={textContent}
              onChangeText={(text) => {
                setTextContent(text);
                setIsSaved(false);
              }}
            />
            <Text style={[styles.charCount, { color: theme.textSecondary }]}>
              {textContent.length}자
            </Text>
          </View>

          {/* Section 4: Habit Satisfaction */}
          <View
            style={[
              styles.section,
              { backgroundColor: theme.cardBackgroundColor },
            ]}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              습관 만족도
            </Text>
            <Text
              style={[styles.sectionDesc, { color: theme.textSecondary }]}>
              오늘 습관 실천에 대해 어떻게 느끼시나요?
            </Text>
            <View style={styles.satisfactionRow}>
              {SATISFACTION_OPTIONS.map((option) => {
                const isSelected = habitSatisfaction === option.type;
                return (
                  <TouchableOpacity
                    key={option.type}
                    style={[
                      styles.satisfactionButton,
                      isSelected
                        ? {
                            backgroundColor: theme.primaryColor + '15',
                            borderColor: theme.primaryColor,
                          }
                        : { borderColor: '#E5E7EB' },
                    ]}
                    onPress={() => {
                      setHabitSatisfaction(option.type);
                      setIsSaved(false);
                    }}
                    activeOpacity={0.7}>
                    <Text style={styles.satisfactionEmoji}>
                      {option.emoji}
                    </Text>
                    <Text
                      style={[
                        styles.satisfactionLabel,
                        {
                          color: isSelected
                            ? theme.primaryColor
                            : theme.textSecondary,
                          fontWeight: isSelected ? '700' : '500',
                        },
                      ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Save Button */}
          <View style={styles.footer}>
            <GradientButton
              title={isSaved ? '저장됨 ✓' : '일기 저장하기'}
              onPress={handleSave}
              disabled={isSaved}
              style={styles.saveButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  textInput: {
    fontSize: 15,
    lineHeight: 22,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    minHeight: 120,
  },
  charCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 6,
  },
  satisfactionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  satisfactionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    gap: 6,
  },
  satisfactionEmoji: {
    fontSize: 28,
  },
  satisfactionLabel: {
    fontSize: 14,
  },
  footer: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  saveButton: {
    width: '100%',
  },
});
