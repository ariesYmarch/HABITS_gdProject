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
  selectedChoice: boolean | undefined;
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
      {/* Category + Question Number Badge — Swift style */}
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

      {/* Question Text — centered, bold */}
      <Text style={[styles.questionText, { color: theme.textPrimary }]}>
        {question.question}
      </Text>

      {/* Choice A */}
      <TouchableOpacity
        style={[
          styles.choiceButton,
          selectedChoice === true && {
            backgroundColor: theme.primaryColor + '12',
            borderColor: theme.primaryColor,
          },
        ]}
        onPress={() => onSelectChoice(true)}
        activeOpacity={0.7}>
        <Text
          style={[
            styles.choiceText,
            {
              color: selectedChoice === true
                ? theme.textPrimary
                : theme.textPrimary,
            },
          ]}>
          {question.choiceA.text}
        </Text>
        {selectedChoice === true && (
          <View style={[styles.checkCircle, { backgroundColor: theme.primaryColor }]}>
            <Text style={styles.checkIcon}>✓</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* OR separator */}
      <Text style={styles.orText}>OR</Text>

      {/* Choice B */}
      <TouchableOpacity
        style={[
          styles.choiceButton,
          selectedChoice === false && {
            backgroundColor: theme.primaryColor + '12',
            borderColor: theme.primaryColor,
          },
        ]}
        onPress={() => onSelectChoice(false)}
        activeOpacity={0.7}>
        <Text
          style={[
            styles.choiceText,
            {
              color: selectedChoice === false
                ? theme.textPrimary
                : theme.textPrimary,
            },
          ]}>
          {question.choiceB.text}
        </Text>
        {selectedChoice === false && (
          <View style={[styles.checkCircle, { backgroundColor: theme.primaryColor }]}>
            <Text style={styles.checkIcon}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  category: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 10,
    flex: 1,
  },
  counter: {
    fontSize: 14,
    fontWeight: '500',
  },
  questionText: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 30,
    textAlign: 'center',
    marginBottom: 28,
  },
  choiceButton: {
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceText: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    flex: 1,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  checkIcon: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  orText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
    textAlign: 'center',
    marginVertical: 10,
  },
});
