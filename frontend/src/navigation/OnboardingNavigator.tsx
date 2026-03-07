import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../types/navigation';
import { WelcomeStep } from '../screens/onboarding/WelcomeStep';
import { NameInputStep } from '../screens/onboarding/NameInputStep';
import { PersonalityTestStep } from '../screens/onboarding/PersonalityTestStep';
import { TransitionStep } from '../screens/onboarding/TransitionStep';
import { ResultTagSelectionStep } from '../screens/onboarding/ResultTagSelectionStep';
import { OccupationStep } from '../screens/onboarding/OccupationStep';
import { TimetableSetupStep } from '../screens/onboarding/TimetableSetupStep';
import { HabitRecommendationStep } from '../screens/onboarding/HabitRecommendationStep';
import { CompletionStep } from '../screens/onboarding/CompletionStep';
import { useAppStore } from '../store';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export function OnboardingNavigator() {
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
      {/* Step 1: 환영 */}
      <Stack.Screen name="Welcome" component={WelcomeStep} />

      {/* Step 2: 이름 & 아이콘 입력 */}
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

      {/* Step 7: 직업 선택 */}
      <Stack.Screen name="Occupation" component={OccupationStep} />

      {/* Step 8: 시간표 설정 */}
      <Stack.Screen name="TimetableSetup" component={TimetableSetupStep} />

      {/* Step 9: 습관 추천 & 선택 */}
      <Stack.Screen
        name="HabitRecommendation"
        component={HabitRecommendationStep}
      />

      {/* Step 10: 완료 */}
      <Stack.Screen name="Completion" component={CompletionStep} />
    </Stack.Navigator>
  );
}
