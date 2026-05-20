import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../types/navigation';
import { ProgressBar } from '../../components/common/ProgressBar';
import { GradientButton } from '../../components/common/GradientButton';
import { useAppStore } from '../../store';
import { themes } from '../../theme/themes';
import { Brain, Star, Key } from 'lucide-react-native';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Guide'>;

const STEPS: { Icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>; title: string; desc: string }[] = [
  { Icon: Brain, title: '성격 테스트', desc: '나의 성격 유형을 알아봐요' },
  { Icon: Star, title: '이상적인 나', desc: '되고 싶은 모습을 탐색해요' },
  { Icon: Key, title: '맞춤 습관 추천', desc: '나에게 딱 맞는 습관을 받아요' },
];

export function GuideStep({ navigation }: Props) {
  const themeId = useAppStore((s) => s.selectedTheme);
  const theme = themes[themeId];
  const insets = useSafeAreaInsets();
  const userName = useAppStore((s) => s.userName);

  const titleOpacity = useSharedValue(0);
  const listOpacity = useSharedValue(0);
  const btnOpacity = useSharedValue(0);

  useEffect(() => {
    titleOpacity.value = withTiming(1, { duration: 300 });
    listOpacity.value = withDelay(150, withTiming(1, { duration: 300 }));
    btnOpacity.value = withDelay(300, withTiming(1, { duration: 300 }));
  }, []);

  const titleStyle = useAnimatedStyle(() => ({ opacity: titleOpacity.value }));
  const listStyle = useAnimatedStyle(() => ({ opacity: listOpacity.value }));
  const btnStyle = useAnimatedStyle(() => ({ opacity: btnOpacity.value }));

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.backgroundColor,
          paddingTop: insets.top,
          paddingBottom: insets.bottom + 24,
        },
      ]}>
      <ProgressBar current={2} total={10} />

      <View style={styles.content}>
        <Animated.View style={[styles.titleBlock, titleStyle]}>
          <Text style={[styles.greeting, { color: theme.textPrimary }]}>
            {userName}님, 반가워요!
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            앞으로 이런 과정을 진행할 거예요
          </Text>
        </Animated.View>

        <Animated.View style={[styles.stepsCard, listStyle]}>
          {STEPS.map((step, index) => {
            const Icon = step.Icon;
            return (
            <View
              key={step.title}
              style={[
                styles.stepRow,
                index < STEPS.length - 1 && styles.stepRowBorder,
              ]}>
              <View
                style={[
                  styles.stepNumber,
                  { backgroundColor: theme.primaryColor },
                ]}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <View style={styles.stepIconWrap}>
                <Icon size={26} color={theme.primaryColor} strokeWidth={1.8} />
              </View>
              <View style={styles.stepTextBlock}>
                <Text style={[styles.stepTitle, { color: theme.textPrimary }]}>
                  {step.title}
                </Text>
                <Text
                  style={[styles.stepDesc, { color: theme.textSecondary }]}>
                  {step.desc}
                </Text>
              </View>
            </View>
            );
          })}
        </Animated.View>

        <Animated.View style={[styles.readyBlock, titleStyle]}>
          <Text style={[styles.readyText, { color: theme.textPrimary }]}>
            준비 되셨나요? 😊
          </Text>
        </Animated.View>
      </View>

      <Animated.View style={[styles.buttonWrapper, btnStyle]}>
        <GradientButton
          title="시작하기"
          onPress={() => navigation.navigate('CurrentPersonalityTest')}
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
  titleBlock: {
    alignItems: 'center',
    marginBottom: 32,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  stepsCard: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 32,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  stepRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  stepIconWrap: {
    width: 28, alignItems: 'center', marginRight: 12,
  },
  stepTextBlock: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  stepDesc: {
    fontSize: 13,
    fontWeight: '400',
  },
  readyBlock: {
    alignItems: 'center',
  },
  readyText: {
    fontSize: 20,
    fontWeight: '700',
  },
  buttonWrapper: {
    paddingHorizontal: 0,
  },
  button: {
    width: '100%',
  },
});
