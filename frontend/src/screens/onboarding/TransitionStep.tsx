import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../types/navigation';
import { GradientButton } from '../../components/common/GradientButton';
import { useAppStore } from '../../store';
import { themes } from '../../theme/themes';
import { findPersonalityType } from '../../data/personalityTypes';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Transition'>;

export function TransitionStep({ navigation }: Props) {
  const themeId = useAppStore((s) => s.selectedTheme);
  const personalityTypeId = useAppStore((s) => s.personalityTypeId);
  const theme = themes[themeId];

  const personalityType = personalityTypeId
    ? findPersonalityType(personalityTypeId)
    : null;

  // Animations
  const checkScale = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const resultOpacity = useSharedValue(0);
  const btnOpacity = useSharedValue(0);

  useEffect(() => {
    checkScale.value = withSequence(
      withSpring(1.2, { damping: 8, stiffness: 200 }),
      withSpring(1, { damping: 12, stiffness: 150 }),
    );
    titleOpacity.value = withDelay(400, withTiming(1, { duration: 500 }));
    resultOpacity.value = withDelay(700, withTiming(1, { duration: 500 }));
    btnOpacity.value = withDelay(1000, withTiming(1, { duration: 500 }));
  }, []);

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));
  const titleStyle = useAnimatedStyle(() => ({ opacity: titleOpacity.value }));
  const resultStyle = useAnimatedStyle(() => ({ opacity: resultOpacity.value }));
  const btnStyle = useAnimatedStyle(() => ({ opacity: btnOpacity.value }));

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.content}>
        {/* Checkmark */}
        <Animated.Text style={[styles.checkEmoji, checkStyle]}>
          ✅
        </Animated.Text>

        {/* Title */}
        <Animated.View style={titleStyle}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            현재의 나 분석 완료!
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            당신의 현재 성격 유형을 분석했어요
          </Text>
        </Animated.View>

        {/* Result Preview */}
        {personalityType && (
          <Animated.View
            style={[
              styles.resultCard,
              resultStyle,
              { borderColor: theme.primaryColor + '30' },
            ]}>
            <Text style={styles.resultEmoji}>{personalityType.emoji}</Text>
            <Text style={[styles.resultName, { color: theme.primaryColor }]}>
              {personalityType.nameKR}
            </Text>
            <Text style={[styles.resultEN, { color: theme.textSecondary }]}>
              {personalityType.nameEN}
            </Text>
            <Text style={[styles.resultDesc, { color: theme.textSecondary }]}>
              {personalityType.description}
            </Text>
          </Animated.View>
        )}

        {/* Info message */}
        <Animated.View style={resultStyle}>
          <Text style={[styles.infoText, { color: theme.textSecondary }]}>
            이제 '이상적인 나'를 알아볼 차례에요!{'\n'}
            현재와 이상 사이의 갭을 분석하여{'\n'}
            맞춤 습관을 추천해 드립니다
          </Text>
        </Animated.View>
      </View>

      {/* CTA Button */}
      <Animated.View style={[styles.buttonWrapper, btnStyle]}>
        <GradientButton
          title="이상적인 나 테스트 시작"
          onPress={() => navigation.navigate('IdealPersonalityTest')}
          style={styles.button}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkEmoji: {
    fontSize: 70,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 24,
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  resultEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  resultName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  resultEN: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  resultDesc: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
  },
  buttonWrapper: {
    paddingBottom: 16,
  },
  button: {
    width: '100%',
  },
});
