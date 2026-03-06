import React, { useCallback } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../types/navigation';
import { WelcomeStep } from '../screens/onboarding/WelcomeStep';
import { NameInputStep } from '../screens/onboarding/NameInputStep';
import { PersonalityTestStep } from '../screens/onboarding/PersonalityTestStep';
import { TransitionStep } from '../screens/onboarding/TransitionStep';
import { ResultTagSelectionStep } from '../screens/onboarding/ResultTagSelectionStep';
import { PlaceholderStep } from '../screens/onboarding/PlaceholderSteps';
import { useAppStore } from '../store';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export function OnboardingNavigator() {
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const setPersonalityTypeId = useAppStore((s) => s.setPersonalityTypeId);
  const setIdealPersonalityTypeId = useAppStore(
    (s) => s.setIdealPersonalityTypeId,
  );

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="Welcome" component={WelcomeStep} />
      <Stack.Screen name="NameInput" component={NameInputStep} />

      {/* Step 3: 현재의 나 성격 테스트 */}
      <Stack.Screen name="CurrentPersonalityTest">
        {({ navigation }) => (
          <PersonalityTestStep
            testType="current"
            stepNumber={3}
            onComplete={(id) => {
              if (id) setPersonalityTypeId(id);
              navigation.navigate('Transition');
            }}
          />
        )}
      </Stack.Screen>

      {/* Step 4: 전환 (현재 결과 표시) */}
      <Stack.Screen name="Transition" component={TransitionStep} />

      {/* Step 5: 이상적인 나 성격 테스트 */}
      <Stack.Screen name="IdealPersonalityTest">
        {({ navigation }) => (
          <PersonalityTestStep
            testType="ideal"
            stepNumber={5}
            onComplete={(id) => {
              if (id) setIdealPersonalityTypeId(id);
              navigation.navigate('ResultTagSelection');
            }}
          />
        )}
      </Stack.Screen>

      {/* Step 6: 결과 & 태그 선택 */}
      <Stack.Screen
        name="ResultTagSelection"
        component={ResultTagSelectionStep}
      />

      {/* Steps 7-10: Placeholder (Branch 3에서 구현 예정) */}
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
