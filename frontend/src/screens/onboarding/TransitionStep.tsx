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
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../types/navigation';
import { ProgressBar } from '../../components/common/ProgressBar';
import { GradientButton } from '../../components/common/GradientButton';
import { useAppStore } from '../../store';
import { themes } from '../../theme/themes';
import { Star, Rocket, Heart, Handshake, Lightbulb } from 'lucide-react-native';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Transition'>;

type _LucideIcon = React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
const CATEGORIES: { Icon: _LucideIcon; name: string; desc: string }[] = [
  { Icon: Rocket, name: '태도', desc: '일과 도전에 대한 자세' },
  { Icon: Heart, name: '정서', desc: '감정과 스트레스 대처' },
  { Icon: Handshake, name: '관계', desc: '대인관계 스타일' },
  { Icon: Lightbulb, name: '가치관', desc: '삶의 우선순위' },
];

export function TransitionStep({ navigation }: Props) {
  const themeId = useAppStore((s) => s.selectedTheme);
  const theme = themes[themeId];
  const insets = useSafeAreaInsets();

  // Animations
  const starScale = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const descOpacity = useSharedValue(0);
  const listOpacity = useSharedValue(0);
  const btnOpacity = useSharedValue(0);

  useEffect(() => {
    starScale.value = withSequence(
      withSpring(1.3, { damping: 6, stiffness: 180 }),
      withSpring(1, { damping: 10, stiffness: 120 }),
    );
    titleOpacity.value = withDelay(150, withTiming(1, { duration: 300 }));
    descOpacity.value = withDelay(250, withTiming(1, { duration: 300 }));
    listOpacity.value = withDelay(350, withTiming(1, { duration: 300 }));
    btnOpacity.value = withDelay(500, withTiming(1, { duration: 300 }));
  }, []);

  const starStyle = useAnimatedStyle(() => ({
    transform: [{ scale: starScale.value }],
  }));
  const titleStyle = useAnimatedStyle(() => ({ opacity: titleOpacity.value }));
  const descStyle = useAnimatedStyle(() => ({ opacity: descOpacity.value }));
  const listStyle = useAnimatedStyle(() => ({ opacity: listOpacity.value }));
  const btnStyle = useAnimatedStyle(() => ({ opacity: btnOpacity.value }));

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor, paddingTop: insets.top, paddingBottom: insets.bottom + 24 }]}>
      <ProgressBar current={4} total={10} />

      <View style={styles.content}>
        {/* Star pictogram */}
        <Animated.View style={[styles.starWrap, starStyle]}>
          <Star size={60} color="#FF8C7C" strokeWidth={1.8} />
        </Animated.View>

        {/* Title — "이상적인 나" in coral/salmon color */}
        <Animated.View style={[styles.titleBlock, titleStyle]}>
          <Text style={[styles.title, { color: '#FF8C7C' }]}>
            이상적인 나
          </Text>
        </Animated.View>

        {/* Description */}
        <Animated.View style={descStyle}>
          <Text style={[styles.description, { color: theme.textSecondary }]}>
            어떤 사람이 되고 싶은가요?{'\n'}
            30개의 질문에 답해주세요.
          </Text>
        </Animated.View>

        {/* Category List */}
        <Animated.View style={[styles.categoryCard, listStyle]}>
          {CATEGORIES.map((cat, index) => {
            const Icon = cat.Icon;
            return (
            <View
              key={cat.name}
              style={[
                styles.categoryRow,
                index < CATEGORIES.length - 1 && styles.categoryRowBorder,
              ]}>
              <View style={styles.categoryIconWrap}>
                <Icon size={28} color={theme.primaryColor} strokeWidth={1.8} />
              </View>
              <View style={styles.categoryTextBlock}>
                <Text style={[styles.categoryName, { color: theme.textPrimary }]}>
                  {cat.name}
                </Text>
                <Text style={[styles.categoryDesc, { color: theme.textSecondary }]}>
                  {cat.desc}
                </Text>
              </View>
            </View>
            );
          })}
        </Animated.View>
      </View>

      {/* CTA Button */}
      <Animated.View style={[styles.buttonWrapper, btnStyle]}>
        <GradientButton
          title="테스트 시작"
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
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  starEmoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  starWrap: { marginBottom: 16, alignItems: 'center' },
  titleBlock: {
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  categoryCard: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  categoryRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  categoryEmoji: {
    fontSize: 32,
    marginRight: 14,
  },
  categoryIconWrap: { width: 32, alignItems: 'center', marginRight: 14 },
  categoryTextBlock: {
    flex: 1,
  },
  categoryName: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 2,
  },
  categoryDesc: {
    fontSize: 13,
    fontWeight: '400',
  },
  buttonWrapper: {
    paddingHorizontal: 24,
  },
  button: {
    width: '100%',
  },
});
