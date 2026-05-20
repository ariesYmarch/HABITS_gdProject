import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../types/navigation';
import { WelcomeStep } from '../screens/onboarding/WelcomeStep';
import { NameInputStep } from '../screens/onboarding/NameInputStep';
import { GuideStep } from '../screens/onboarding/GuideStep';
import { PersonalityTestStep } from '../screens/onboarding/PersonalityTestStep';
import { TransitionStep } from '../screens/onboarding/TransitionStep';
import { ResultTagSelectionStep } from '../screens/onboarding/ResultTagSelectionStep';
import { OccupationStep } from '../screens/onboarding/OccupationStep';
import { TimetableSetupStep } from '../screens/onboarding/TimetableSetupStep';
import { HabitRecommendationStep } from '../screens/onboarding/HabitRecommendationStep';
import { CompletionStep } from '../screens/onboarding/CompletionStep';
import { useAppStore } from '../store';
import { findPersonalityType } from '../data/personalityTypes';
import { schedulePush } from '../services/sync';

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
      {/* Welcome */}
      <Stack.Screen name="Welcome" component={WelcomeStep} />

      {/* Step 1/10: 이름 입력 */}
      <Stack.Screen name="NameInput" component={NameInputStep} />

      {/* Step 2/10: 안내 */}
      <Stack.Screen name="Guide" component={GuideStep} />

      {/* Step 3/10: 현재의 나 성격 테스트 */}
      <Stack.Screen name="CurrentPersonalityTest">
        {({ navigation }) => (
          <PersonalityTestStep
            testType="current"
            stepNumber={3}
            onComplete={(id) => {
              if (id) {
                const tags = findPersonalityType(id)?.hashtags || [];
                setPersonalityTypeId(id, tags);
                schedulePush();
              }
              navigation.navigate('Transition');
            }}
          />
        )}
      </Stack.Screen>

      {/* Step 4/10: 이상적인 나 소개 */}
      <Stack.Screen name="Transition" component={TransitionStep} />

      {/* Step 5/10: 이상적인 나 성격 테스트 */}
      <Stack.Screen name="IdealPersonalityTest">
        {({ navigation }) => (
          <PersonalityTestStep
            testType="ideal"
            stepNumber={5}
            onComplete={(id) => {
              if (id) {
                const tags = findPersonalityType(id)?.hashtags || [];
                setIdealPersonalityTypeId(id, tags);
                schedulePush();
              }
              navigation.navigate('ResultTagSelection');
            }}
          />
        )}
      </Stack.Screen>

      {/* Step 6/10: 결과 & 태그 선택 */}
      <Stack.Screen
        name="ResultTagSelection"
        component={ResultTagSelectionStep}
      />

      {/* Step 7/10: 직업 선택 */}
      <Stack.Screen name="Occupation" component={OccupationStep} />

      {/* Step 8/10: 시간표 설정 */}
      <Stack.Screen name="TimetableSetup" component={TimetableSetupStep} />

      {/* Step 9/10: 습관 추천 */}
      <Stack.Screen
        name="HabitRecommendation"
        component={HabitRecommendationStep}
      />

      {/* Step 10/10: 완료 */}
      <Stack.Screen name="Completion" component={CompletionStep} />
    </Stack.Navigator>
  );
}
