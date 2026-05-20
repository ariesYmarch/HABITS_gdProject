import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  withSpring,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { GradientText } from '../../components/common/GradientText';
import { useAppStore } from '../../store';
import { themes } from '../../theme/themes';

const { width: SCREEN_W } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const themeId = useAppStore((s) => s.selectedTheme);
  const theme = themes[themeId];

  // Animation values
  const cubeProgress = useSharedValue(0);
  const logoScale = useSharedValue(0.3);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textSlide = useSharedValue(30);
  const subtitleOpacity = useSharedValue(0);
  const lineWidth = useSharedValue(0);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    // Phase 1: Cube assembles fast
    cubeProgress.value = withTiming(1, { duration: 350, easing: Easing.out(Easing.cubic) });

    // Phase 2: Logo snaps in
    logoScale.value = withDelay(150, withSpring(1, { damping: 16, stiffness: 200 }));
    logoOpacity.value = withDelay(100, withTiming(1, { duration: 250 }));

    // Phase 3: Subtle glow
    glowOpacity.value = withDelay(300, withSequence(
      withTiming(0.5, { duration: 250 }),
      withTiming(0.2, { duration: 400 }),
    ));

    // Phase 4: Tagline slides up quickly
    textOpacity.value = withDelay(450, withTiming(1, { duration: 200 }));
    textSlide.value = withDelay(450, withSpring(0, { damping: 18, stiffness: 180 }));

    // Phase 5: Accent line
    lineWidth.value = withDelay(600, withTiming(60, { duration: 300, easing: Easing.out(Easing.cubic) }));

    // Phase 6: Subtitle
    subtitleOpacity.value = withDelay(750, withTiming(1, { duration: 250 }));

    const timer = setTimeout(onFinish, 2200);
    return () => clearTimeout(timer);
  }, []);

  // Cube faces animate from different directions
  const topFaceStyle = useAnimatedStyle(() => ({
    opacity: interpolate(cubeProgress.value, [0, 0.5, 1], [0, 0.15, 0.3]),
    transform: [
      { translateY: interpolate(cubeProgress.value, [0, 1], [-15, 0]) },
      { skewX: '-10deg' },
    ],
  }));

  const frontFaceStyle = useAnimatedStyle(() => ({
    opacity: interpolate(cubeProgress.value, [0, 0.4, 1], [0, 0.15, 0.35]),
    transform: [
      { translateX: interpolate(cubeProgress.value, [0, 1], [-20, 0]) },
    ],
  }));

  const rightFaceStyle = useAnimatedStyle(() => ({
    opacity: interpolate(cubeProgress.value, [0, 0.6, 1], [0, 0.3, 0.6]),
    transform: [
      { translateX: interpolate(cubeProgress.value, [0, 1], [20, 0]) },
    ],
  }));

  const logoContainerStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: interpolate(glowOpacity.value, [0, 0.8], [0.8, 1.2]) }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textSlide.value }],
  }));

  const lineStyle = useAnimatedStyle(() => ({
    width: lineWidth.value,
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      {/* Background glow */}
      <Animated.View style={[styles.glow, glowStyle]}>
        <LinearGradient
          colors={[theme.gradientColors[0] + '40', theme.gradientColors[2] + '20', 'transparent']}
          style={styles.glowGradient}
          start={{ x: 0.5, y: 0.3 }}
          end={{ x: 0.5, y: 1 }}
        />
      </Animated.View>

      {/* Cube + Logo */}
      <Animated.View style={[styles.logoWrapper, logoContainerStyle]}>
        <View style={styles.cubeContainer}>
          <Animated.View style={[styles.cubeTopFace, topFaceStyle]}>
            <LinearGradient
              colors={['#EFF8D1', 'transparent']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          </Animated.View>
          <Animated.View style={[styles.cubeFrontFace, frontFaceStyle]}>
            <LinearGradient
              colors={['#DBEFD8', '#ACD9E9', '#98D2F0']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            />
          </Animated.View>
          <Animated.View style={[styles.cubeRightFace, rightFaceStyle]}>
            <LinearGradient
              colors={['#9CDBEE', '#6BE1EE', '#97E7EC']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          </Animated.View>
        </View>
        <GradientText text="HABITS" colors={theme.gradientColors} style={styles.logoText} />
      </Animated.View>

      {/* Text block */}
      <Animated.View style={[styles.textBlock, textStyle]}>
        <Text style={[styles.tagline, { color: theme.textPrimary }]}>
          Build Better You
        </Text>
      </Animated.View>

      {/* Accent line */}
      <Animated.View style={[styles.accentLine, lineStyle, { overflow: 'hidden' as any, borderRadius: 2 }]}>
        <LinearGradient
          colors={[theme.gradientColors[1], theme.gradientColors[2]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* Subtitle */}
      <Animated.Text style={[styles.subtitle, { color: theme.textSecondary }, subtitleStyle]}>
        나를 이해하고 성장시키는 습관 코칭
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
    width: SCREEN_W * 1.2,
    height: SCREEN_W * 1.2,
    borderRadius: SCREEN_W * 0.6,
  },
  glowGradient: {
    flex: 1,
    borderRadius: SCREEN_W * 0.6,
  },
  logoWrapper: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cubeContainer: {
    width: 160,
    height: 160,
    position: 'absolute',
  },
  cubeTopFace: {
    width: 100,
    height: 50,
    borderRadius: 12,
    position: 'absolute',
    top: 5,
    left: 28,
    overflow: 'hidden',
  },
  cubeFrontFace: {
    width: 95,
    height: 90,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    borderTopLeftRadius: 4,
    position: 'absolute',
    top: 38,
    left: 8,
    overflow: 'hidden',
  },
  cubeRightFace: {
    width: 72,
    height: 90,
    borderBottomRightRadius: 14,
    borderTopRightRadius: 4,
    position: 'absolute',
    top: 38,
    left: 76,
    overflow: 'hidden',
  },
  logoText: {
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: 4,
    zIndex: 10,
  },
  textBlock: {
    alignItems: 'center',
    marginTop: -4,
  },
  tagline: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 6,
    textTransform: 'uppercase',
  },
  accentLine: {
    height: 3,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '400',
    marginTop: 14,
    letterSpacing: 1,
  },
});
