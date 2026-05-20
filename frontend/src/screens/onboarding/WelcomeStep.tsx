import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { GradientText } from '../../components/common/GradientText';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../types/navigation';
import { GradientButton } from '../../components/common/GradientButton';
import { useAppStore } from '../../store';
import { themes } from '../../theme/themes';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Welcome'>;

export function WelcomeStep({ navigation }: Props) {
  const themeId = useAppStore((s) => s.selectedTheme);
  const theme = themes[themeId];
  const insets = useSafeAreaInsets();

  const logoOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const descOpacity = useSharedValue(0);
  const btnOpacity = useSharedValue(0);

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 400 });
    titleOpacity.value = withDelay(200, withTiming(1, { duration: 400 }));
    descOpacity.value = withDelay(350, withTiming(1, { duration: 400 }));
    btnOpacity.value = withDelay(500, withTiming(1, { duration: 400 }));
  }, []);

  const logoStyle = useAnimatedStyle(() => ({ opacity: logoOpacity.value }));
  const titleStyle = useAnimatedStyle(() => ({ opacity: titleOpacity.value }));
  const descStyle = useAnimatedStyle(() => ({ opacity: descOpacity.value }));
  const btnStyle = useAnimatedStyle(() => ({ opacity: btnOpacity.value }));

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor, paddingTop: insets.top, paddingBottom: insets.bottom + 24 }]}>
      <View style={styles.content}>
        {/* 3D Cube-style HABITS Logo */}
        <Animated.View style={[styles.logoWrapper, logoStyle]}>
          <View style={styles.cubeContainer}>
            {/* Top face */}
            <LinearGradient
              colors={['#EFF8D1', 'transparent']}
              style={styles.cubeTopFace}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            {/* Front face */}
            <LinearGradient
              colors={['#DBEFD8', '#ACD9E9', '#98D2F0']}
              style={styles.cubeFrontFace}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            />
            {/* Right face */}
            <LinearGradient
              colors={['#9CDBEE', '#6BE1EE', '#97E7EC']}
              style={styles.cubeRightFace}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          </View>
          <GradientText text="HABITS" colors={theme.gradientColors} style={styles.logoText} />
        </Animated.View>

        <Animated.View style={titleStyle}>
          <Text style={[styles.title, { color: theme.primaryColor }]}>
            Welcome to HABITS!
          </Text>
        </Animated.View>

        <Animated.View style={descStyle}>
          <Text style={[styles.description, { color: theme.textSecondary }]}>
            성격을 분석하고 맞춤 습관을 추천받아보세요!
          </Text>
        </Animated.View>
      </View>

      <Animated.View style={[styles.buttonWrapper, btnStyle]}>
        <GradientButton
          title="시작!"
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
  logoWrapper: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  cubeContainer: {
    width: 140,
    height: 140,
    position: 'absolute',
  },
  cubeTopFace: {
    width: 90,
    height: 45,
    borderRadius: 10,
    position: 'absolute',
    top: 5,
    left: 25,
    opacity: 0.3,
    transform: [{ skewX: '-10deg' }],
  },
  cubeFrontFace: {
    width: 85,
    height: 80,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderTopLeftRadius: 4,
    position: 'absolute',
    top: 35,
    left: 10,
    opacity: 0.35,
  },
  cubeRightFace: {
    width: 65,
    height: 80,
    borderBottomRightRadius: 12,
    borderTopRightRadius: 4,
    position: 'absolute',
    top: 35,
    left: 70,
    opacity: 0.6,
  },
  logoText: {
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: 2,
    zIndex: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonWrapper: {
    paddingHorizontal: 0,
  },
  button: {
    width: '100%',
  },
});
