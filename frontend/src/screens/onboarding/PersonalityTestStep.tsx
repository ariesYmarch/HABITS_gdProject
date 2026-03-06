import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../types/navigation';
import type { PersonalityTestType, TestQuestion } from '../../types/personality';
import { getTestQuestions, analyzeTestResult } from '../../data/personalityTestQuestions';
import { ProgressBar } from '../../components/common/ProgressBar';
import { GradientButton } from '../../components/common/GradientButton';
import { TestQuestionCard } from '../../components/personality/TestQuestionCard';
import { useAppStore } from '../../store';
import { themes } from '../../theme/themes';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface PersonalityTestStepProps {
  testType: PersonalityTestType;
  stepNumber: number;
  onComplete: (personalityTypeId: number | null) => void;
}

export function PersonalityTestStep({
  testType,
  stepNumber,
  onComplete,
}: PersonalityTestStepProps) {
  const themeId = useAppStore((s) => s.selectedTheme);
  const theme = themes[themeId];
  const questions = getTestQuestions(testType);

  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const answeredCount = Object.keys(answers).length;
  const isAllAnswered = answeredCount === questions.length;
  const currentQuestion = questions[currentIndex];

  const handleSelectChoice = useCallback(
    (questionId: number, choseA: boolean) => {
      setAnswers((prev) => ({ ...prev, [questionId]: choseA }));
    },
    [],
  );

  const goToQuestion = useCallback(
    (index: number) => {
      if (index >= 0 && index < questions.length) {
        setCurrentIndex(index);
        flatListRef.current?.scrollToIndex({ index, animated: true });
      }
    },
    [questions.length],
  );

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      goToQuestion(currentIndex + 1);
    }
  }, [currentIndex, goToQuestion, questions.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      goToQuestion(currentIndex - 1);
    }
  }, [currentIndex, goToQuestion]);

  const handleComplete = useCallback(() => {
    const result = analyzeTestResult(answers, testType);
    onComplete(result.personalityType?.id ?? null);
  }, [answers, testType, onComplete]);

  const renderQuestion = useCallback(
    ({ item, index }: { item: TestQuestion; index: number }) => (
      <View style={{ width: SCREEN_WIDTH }}>
        <TestQuestionCard
          question={item}
          questionIndex={index}
          totalQuestions={questions.length}
          selectedChoice={answers[item.id]}
          onSelectChoice={(choseA) => handleSelectChoice(item.id, choseA)}
        />
      </View>
    ),
    [answers, handleSelectChoice, questions.length],
  );

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: SCREEN_WIDTH,
      offset: SCREEN_WIDTH * index,
      index,
    }),
    [],
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.stepLabel, { color: theme.textSecondary }]}>
          Step {stepNumber} / 10
        </Text>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          {testType === 'current'
            ? '현재의 나 성격 테스트'
            : '이상적인 나 성격 테스트'}
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          {testType === 'current'
            ? '지금의 나에 가장 가까운 답을 골라주세요'
            : '되고 싶은 나의 모습에 가까운 답을 골라주세요'}
        </Text>
      </View>

      {/* Progress */}
      <ProgressBar current={answeredCount} total={questions.length} />

      {/* Question List (horizontal pager) */}
      <FlatList
        ref={flatListRef}
        data={questions}
        renderItem={renderQuestion}
        keyExtractor={(item) => `q-${item.id}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        getItemLayout={getItemLayout}
        style={styles.questionList}
        contentContainerStyle={styles.questionListContent}
      />

      {/* Navigation Arrows + Complete Button */}
      <View style={styles.footer}>
        <View style={styles.navRow}>
          <TouchableOpacity
            style={[
              styles.arrowButton,
              currentIndex === 0 && styles.arrowDisabled,
            ]}
            onPress={handlePrev}
            disabled={currentIndex === 0}>
            <Text
              style={[
                styles.arrowText,
                currentIndex === 0 && styles.arrowTextDisabled,
              ]}>
              ← 이전
            </Text>
          </TouchableOpacity>

          {/* Dot indicators (mini) */}
          <View style={styles.dotContainer}>
            {questions.map((q, idx) => (
              <View
                key={q.id}
                style={[
                  styles.dot,
                  idx === currentIndex && {
                    backgroundColor: theme.primaryColor,
                    width: 8,
                    height: 8,
                  },
                  answers[q.id] !== undefined &&
                    idx !== currentIndex && {
                      backgroundColor: theme.primaryColor + '60',
                    },
                ]}
              />
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.arrowButton,
              currentIndex === questions.length - 1 && styles.arrowDisabled,
            ]}
            onPress={handleNext}
            disabled={currentIndex === questions.length - 1}>
            <Text
              style={[
                styles.arrowText,
                currentIndex === questions.length - 1 &&
                  styles.arrowTextDisabled,
              ]}>
              다음 →
            </Text>
          </TouchableOpacity>
        </View>

        {isAllAnswered && (
          <GradientButton
            title="분석하기"
            onPress={handleComplete}
            style={styles.completeButton}
          />
        )}

        {!isAllAnswered && answers[currentQuestion?.id] !== undefined && (
          <TouchableOpacity
            style={[styles.skipToNextBtn, { borderColor: theme.primaryColor }]}
            onPress={handleNext}
            disabled={currentIndex === questions.length - 1}>
            <Text style={[styles.skipToNextText, { color: theme.primaryColor }]}>
              다음 질문으로
            </Text>
          </TouchableOpacity>
        )}
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
  questionList: {
    flex: 1,
  },
  questionListContent: {
    alignItems: 'center',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  arrowButton: {
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  arrowDisabled: {
    opacity: 0.3,
  },
  arrowText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  arrowTextDisabled: {
    color: '#9CA3AF',
  },
  dotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    flexWrap: 'wrap',
    maxWidth: 200,
    justifyContent: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
  },
  completeButton: {
    width: '100%',
  },
  skipToNextBtn: {
    borderWidth: 1.5,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  skipToNextText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
