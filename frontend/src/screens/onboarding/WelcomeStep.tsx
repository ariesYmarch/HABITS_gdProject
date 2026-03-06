import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../types/navigation';
import { GradientButton } from '../../components/common/GradientButton';
import { useAppStore } from '../../store';
import { themes } from '../../theme/themes';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Welcome'>;

export function WelcomeStep({ navigation }: Props) {
  const themeId = useAppStore((s) => s.selectedTheme);
  const theme = themes[themeId];

  const logoOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const descOpacity = useSharedValue(0);
  const btnOpacity = useSharedValue(0);

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 600 });
    titleOpacity.value = withDelay(300, withTiming(1, { duration: 600 }));
    descOpacity.value = withDelay(600, withTiming(1, { duration: 600 }));
    btnOpacity.value = withDelay(900, withTiming(1, { duration: 600 }));
  }, []);

  const logoStyle = useAnimatedStyle(() => ({ opacity: logoOpacity.value }));
  const titleStyle = useAnimatedStyle(() => ({ opacity: titleOpacity.value }));
  const descStyle = useAnimatedStyle(() => ({ opacity: descOpacity.value }));
  const btnStyle = useAnimatedStyle(() => ({ opacity: btnOpacity.value }));

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.content}>
        <Animated.Text style={[styles.emoji, logoStyle]}>🧘‍♀️</Animated.Text>

        <Animated.View style={titleStyle}>
          <Text style={[styles.title, { color: theme.primaryColor }]}>
            Welcome to HABITS!
          </Text>
        </Animated.View>

        <Animated.View style={descStyle}>
          <Text style={[styles.description, { color: theme.textSecondary }]}>
            심리 이론 기반의 자아 탐색과{'\n'}AI 감정 분석을 통한{'\n'}개인
            맞춤형 습관 코칭 서비스
          </Text>
        </Animated.View>
      </View>

      <Animated.View style={[styles.buttonWrapper, btnStyle]}>
        <GradientButton
          title="시작하기"
          onPress={() => navigation.navigate('NameInput')}
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
  emoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonWrapper: {
    paddingBottom: 40,
  },
  button: {
    width: '100%',
  },
});
