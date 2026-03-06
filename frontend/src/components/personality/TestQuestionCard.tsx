import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useAppStore } from '../../store';
import { themes } from '../../theme/themes';
import type { TestQuestion } from '../../types/personality';

interface TestQuestionCardProps {
  question: TestQuestion;
  questionIndex: number;
  totalQuestions: number;
  selectedChoice: boolean | undefined; // true = A, false = B, undefined = not answered
  onSelectChoice: (choseA: boolean) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  attitude: '태도',
  emotion: '정서',
  relationship: '관계',
  value: '가치관',
};

export function TestQuestionCard({
  question,
  questionIndex,
  totalQuestions,
  selectedChoice,
  onSelectChoice,
}: TestQuestionCardProps) {
  const themeId = useAppStore((s) => s.selectedTheme);
  const theme = themes[themeId];

  return (
    <View style={styles.container}>
      {/* Category + Question Number Badge */}
      <View style={styles.header}>
        <View
          style={[styles.badge, { backgroundColor: theme.primaryColor }]}>
          <Text style={styles.badgeText}>
            Q{questionIndex + 1}
          </Text>
        </View>
        <Text style={[styles.category, { color: theme.textSecondary }]}>
          {CATEGORY_LABELS[question.category] ?? question.category}
        </Text>
        <Text style={[styles.counter, { color: theme.textSecondary }]}>
          {questionIndex + 1}/{totalQuestions}
        </Text>
      </View>

      {/* Question Text */}
      <Text style={[styles.questionText, { color: theme.textPrimary }]}>
        {question.question}
      </Text>

      {/* Choice A */}
      <TouchableOpacity
        style={[
          styles.choiceButton,
          selectedChoice === true && {
            backgroundColor: theme.primaryColor + '15',
            borderColor: theme.primaryColor,
          },
        ]}
        onPress={() => onSelectChoice(true)}
        activeOpacity={0.7}>
        <View style={styles.choiceContent}>
          <Text
            style={[
              styles.choiceLetter,
              { color: selectedChoice === true ? theme.primaryColor : '#9CA3AF' },
            ]}>
            A
          </Text>
          <Text
            style={[
              styles.choiceText,
              {
                color:
                  selectedChoice === true
                    ? theme.primaryColor
                    : theme.textPrimary,
                fontWeight: selectedChoice === true ? '600' : '400',
              },
            ]}>
            {question.choiceA.text}
          </Text>
          {selectedChoice === true && (
            <Text style={styles.checkMark}>✓</Text>
          )}
        </View>
      </TouchableOpacity>

      {/* Choice B */}
      <TouchableOpacity
        style={[
          styles.choiceButton,
          selectedChoice === false && {
            backgroundColor: theme.primaryColor + '15',
            borderColor: theme.primaryColor,
          },
        ]}
        onPress={() => onSelectChoice(false)}
        activeOpacity={0.7}>
        <View style={styles.choiceContent}>
          <Text
            style={[
              styles.choiceLetter,
              { color: selectedChoice === false ? theme.primaryColor : '#9CA3AF' },
            ]}>
            B
          </Text>
          <Text
            style={[
              styles.choiceText,
              {
                color:
                  selectedChoice === false
                    ? theme.primaryColor
                    : theme.textPrimary,
                fontWeight: selectedChoice === false ? '600' : '400',
              },
            ]}>
            {question.choiceB.text}
          </Text>
          {selectedChoice === false && (
            <Text style={styles.checkMark}>✓</Text>
          )}
        </View>
      </TouchableOpacity>

      {/* Tags preview (subtle) */}
      {selectedChoice !== undefined && (
        <View style={styles.tagsRow}>
          {(selectedChoice
            ? question.choiceA.tags
            : question.choiceB.tags
          ).map((tag) => (
            <View
              key={tag}
              style={[
                styles.tagChip,
                { backgroundColor: theme.primaryColor + '10' },
              ]}>
              <Text style={[styles.tagText, { color: theme.primaryColor }]}>
                {tag}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  category: {
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 10,
    flex: 1,
  },
  counter: {
    fontSize: 13,
    fontWeight: '500',
  },
  questionText: {
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 26,
    marginBottom: 20,
  },
  choiceButton: {
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  choiceContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  choiceLetter: {
    fontSize: 15,
    fontWeight: '700',
    marginRight: 12,
    width: 20,
  },
  choiceText: {
    fontSize: 15,
    lineHeight: 22,
    flex: 1,
  },
  checkMark: {
    fontSize: 18,
    color: '#10B981',
    marginLeft: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    gap: 6,
  },
  tagChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
