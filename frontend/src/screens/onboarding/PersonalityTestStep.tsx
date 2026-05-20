import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  LayoutChangeEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { PersonalityTestType, TestQuestion } from '../../types/personality';
import { getTestQuestions, analyzeTestResult } from '../../data/personalityTestQuestions';
import { ProgressBar } from '../../components/common/ProgressBar';
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
  const insets = useSafeAreaInsets();
  const questions = getTestQuestions(testType);

  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [listHeight, setListHeight] = useState(0);
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

  // Auto-advance after answering and all answered → complete
  const handleSelectAndAdvance = useCallback(
    (questionId: number, choseA: boolean) => {
      const newAnswers = { ...answers, [questionId]: choseA };
      setAnswers(newAnswers);

      // Check if all answered
      const allDone = Object.keys(newAnswers).length === questions.length;
      if (allDone) {
        // Auto complete after small delay
        setTimeout(() => {
          const result = analyzeTestResult(newAnswers, testType);
          onComplete(result.personalityType?.id ?? null);
        }, 400);
      } else if (currentIndex < questions.length - 1) {
        // Auto advance to next question
        setTimeout(() => {
          goToQuestion(currentIndex + 1);
        }, 300);
      }
    },
    [answers, currentIndex, goToQuestion, questions.length, testType, onComplete],
  );

  const handleListLayout = useCallback((e: LayoutChangeEvent) => {
    setListHeight(e.nativeEvent.layout.height);
  }, []);

  const renderQuestion = useCallback(
    ({ item, index }: { item: TestQuestion; index: number }) => (
      <View style={{ width: SCREEN_WIDTH, height: listHeight || undefined, justifyContent: 'center' }}>
        <TestQuestionCard
          question={item}
          questionIndex={index}
          totalQuestions={questions.length}
          selectedChoice={answers[item.id]}
          onSelectChoice={(choseA) => handleSelectAndAdvance(item.id, choseA)}
        />
      </View>
    ),
    [answers, handleSelectAndAdvance, questions.length, listHeight],
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
    <View style={[styles.container, { backgroundColor: theme.backgroundColor, paddingTop: insets.top, paddingBottom: insets.bottom + 24 }]}>
      {/* Progress bar — Swift style */}
      <ProgressBar current={stepNumber} total={10} />

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
        onLayout={handleListLayout}
        style={styles.questionList}
      />

      {/* Navigation — Swift style: "< 이전" and "다음 >" */}
      <View style={styles.footer}>
        <View style={styles.navRow}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={handlePrev}
            disabled={currentIndex === 0}>
            <Text
              style={[
                styles.navText,
                { color: currentIndex === 0 ? '#D1D5DB' : theme.textSecondary },
              ]}>
              {'<'}  이전
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={handleNext}
            disabled={
              currentIndex === questions.length - 1 ||
              answers[currentQuestion?.id] === undefined
            }>
            <Text
              style={[
                styles.navText,
                {
                  color:
                    answers[currentQuestion?.id] !== undefined &&
                    currentIndex < questions.length - 1
                      ? theme.primaryColor
                      : '#D1D5DB',
                },
              ]}>
              다음  {'>'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  questionList: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: 24,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navButton: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  navText: {
    fontSize: 16,
    fontWeight: '400',
  },
});
