import React, { useState, useCallback, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useAppStore } from '../store';
import { SplashScreen } from '../screens/splash/SplashScreen';
import { AuthNavigator } from './AuthNavigator';
import { OnboardingNavigator } from './OnboardingNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import { fullSync } from '../services/sync';
import { AppAlertHost } from '../components/common/AppAlert';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const hasCompletedOnboarding = useAppStore((s) => s.hasCompletedOnboarding);
  const refreshToken = useAppStore((s) => s.refreshToken);
  const user = useAppStore((s) => s.user);
  const refreshTokens = useAppStore((s) => s.refreshTokens);
  const loadCurrentUser = useAppStore((s) => s.loadCurrentUser);

  const [showSplash, setShowSplash] = useState(true);
  const [bootstrapped, setBootstrapped] = useState(false);

  // 앱 시작 시 자동 로그인 시도 (refreshToken이 있으면 access 갱신 → /me → 서버 sync)
  useEffect(() => {
    (async () => {
      if (refreshToken && !user) {
        const ok = await refreshTokens();
        if (ok) {
          await loadCurrentUser();
        }
      }
      setBootstrapped(true);
    })();
    // 앱 부트 시점 한 번만 실행
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 로그인 직후(또는 자동 로그인 직후) 서버와 양방향 sync 1회 실행
  useEffect(() => {
    if (!bootstrapped || !user) return;
    fullSync().catch((e) => {
      console.warn('[sync] 초기 sync 실패:', e?.message || e);
    });
  }, [bootstrapped, user]);

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  if (showSplash || !bootstrapped) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  const isAuthenticated = !!user;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : !hasCompletedOnboarding ? (
          <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
        ) : (
          <Stack.Screen name="Main" component={MainTabNavigator} />
        )}
      </Stack.Navigator>
      <AppAlertHost />
    </NavigationContainer>
  );
}
