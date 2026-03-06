import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../types/navigation';
import { WelcomeStep } from '../screens/onboarding/WelcomeStep';
import { PlaceholderStep } from '../screens/onboarding/PlaceholderSteps';
import { useAppStore } from '../store';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export function OnboardingNavigator() {
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="Welcome" component={WelcomeStep} />
      <Stack.Screen name="NameInput">
        {({ navigation }) => (
          <PlaceholderStep
            title="이름 입력"
            step={2}
            onNext={() => navigation.navigate('CurrentPersonalityTest')}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="CurrentPersonalityTest">
        {({ navigation }) => (
          <PlaceholderStep
            title="현재의 나 성격 테스트"
            step={3}
            onNext={() => navigation.navigate('Transition')}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="Transition">
        {({ navigation }) => (
          <PlaceholderStep
            title="테스트 전환"
            step={4}
            onNext={() => navigation.navigate('IdealPersonalityTest')}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="IdealPersonalityTest">
        {({ navigation }) => (
          <PlaceholderStep
            title="이상적인 나 성격 테스트"
            step={5}
            onNext={() => navigation.navigate('ResultTagSelection')}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="ResultTagSelection">
        {({ navigation }) => (
          <PlaceholderStep
            title="결과 & 태그 선택"
            step={6}
            onNext={() => navigation.navigate('Occupation')}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="Occupation">
        {({ navigation }) => (
          <PlaceholderStep
            title="직업 선택"
            step={7}
            onNext={() => navigation.navigate('TimetableSetup')}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="TimetableSetup">
        {({ navigation }) => (
          <PlaceholderStep
            title="시간표 설정"
            step={8}
            onNext={() => navigation.navigate('HabitRecommendation')}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="HabitRecommendation">
        {({ navigation }) => (
          <PlaceholderStep
            title="습관 추천"
            step={9}
            onNext={() => navigation.navigate('Completion')}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="Completion">
        {() => (
          <PlaceholderStep
            title="준비 완료!"
            step={10}
            onNext={completeOnboarding}
            nextLabel="시작하기"
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
