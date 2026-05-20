import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { ProgressBar } from '../../components/common/ProgressBar';
import { GradientButton } from '../../components/common/GradientButton';
import { useAppStore } from '../../store';
import { themes } from '../../theme/themes';
import { ClipboardList, Target, FileText, PartyPopper } from 'lucide-react-native';

export function CompletionStep() {
  const themeId = useAppStore((s) => s.selectedTheme);
  const theme = themes[themeId];
  const insets = useSafeAreaInsets();
  const userName = useAppStore((s) => s.userName);
  const userIcon = useAppStore((s) => s.userIcon);
  const habits = useAppStore((s) => s.habits);
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);

  // Animations
  const emojiScale = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const statsOpacity = useSharedValue(0);
  const btnOpacity = useSharedValue(0);

  useEffect(() => {
    emojiScale.value = withSequence(
      withSpring(1.3, { damping: 6, stiffness: 180 }),
      withSpring(1, { damping: 10, stiffness: 120 }),
    );
    titleOpacity.value = withDelay(200, withTiming(1, { duration: 300 }));
    statsOpacity.value = withDelay(350, withTiming(1, { duration: 300 }));
    btnOpacity.value = withDelay(500, withTiming(1, { duration: 300 }));
  }, []);

  const emojiStyle = useAnimatedStyle(() => ({
    transform: [{ scale: emojiScale.value }],
  }));
  const titleStyle = useAnimatedStyle(() => ({ opacity: titleOpacity.value }));
  const statsStyle = useAnimatedStyle(() => ({ opacity: statsOpacity.value }));
  const btnStyle = useAnimatedStyle(() => ({ opacity: btnOpacity.value }));

  return (
    <View
      style={[styles.container, { backgroundColor: theme.backgroundColor, paddingTop: insets.top, paddingBottom: insets.bottom + 24 }]}>
      <ProgressBar current={10} total={10} showLabel={false} />

      <View style={styles.content}>
        {/* Celebration pictogram */}
        <Animated.View style={[styles.celebrationWrap, emojiStyle]}>
          <PartyPopper size={72} color={theme.primaryColor} strokeWidth={1.6} />
        </Animated.View>

        {/* Title */}
        <Animated.View style={[styles.titleBlock, titleStyle]}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            준비 완료!
          </Text>
          <Text style={[styles.greeting, { color: theme.primaryColor }]}>
            {userIcon} {userName}님, 환영해요!
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            맞춤 습관 코칭이 시작됩니다
          </Text>
        </Animated.View>

        {/* Stats Summary */}
        <Animated.View style={[styles.statsCard, statsStyle]}>
          <View style={styles.statRow}>
            <View style={styles.statIconWrap}>
              <ClipboardList size={26} color={theme.primaryColor} strokeWidth={1.8} />
            </View>
            <View style={styles.statTextWrapper}>
              <Text
                style={[styles.statLabel, { color: theme.textSecondary }]}>
                등록된 습관
              </Text>
              <Text
                style={[styles.statValue, { color: theme.primaryColor }]}>
                {habits.length}개
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.statRow}>
            <View style={styles.statIconWrap}>
              <Target size={26} color={theme.primaryColor} strokeWidth={1.8} />
            </View>
            <View style={styles.statTextWrapper}>
              <Text
                style={[styles.statLabel, { color: theme.textSecondary }]}>
                오늘부터
              </Text>
              <Text
                style={[styles.statValue, { color: theme.primaryColor }]}>
                매일 코칭 시작
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.statRow}>
            <View style={styles.statIconWrap}>
              <FileText size={26} color={theme.primaryColor} strokeWidth={1.8} />
            </View>
            <View style={styles.statTextWrapper}>
              <Text
                style={[styles.statLabel, { color: theme.textSecondary }]}>
                감정 일기
              </Text>
              <Text
                style={[styles.statValue, { color: theme.primaryColor }]}>
                AI 분석 지원
              </Text>
            </View>
          </View>
        </Animated.View>
      </View>

      {/* CTA */}
      <Animated.View style={[styles.footer, btnStyle]}>
        <GradientButton
          title="시작하기"
          onPress={completeOnboarding}
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
  celebration: {
    fontSize: 80,
    marginBottom: 20,
  },
  celebrationWrap: { marginBottom: 20, alignItems: 'center' },
  titleBlock: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statEmoji: {
    fontSize: 28,
    marginRight: 14,
  },
  statIconWrap: {
    width: 30, alignItems: 'center', marginRight: 14,
  },
  statTextWrapper: {
    flex: 1,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 17,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 4,
  },
  footer: {
    paddingHorizontal: 0,
  },
  button: {
    width: '100%',
  },
});
